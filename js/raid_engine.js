/**
 * レイドバトルシミュレーター 計算エンジン（フェーズ3）
 *
 * 仕様: RAID_SPEC.md
 * データ: romasaga-tool-be/php/data_raid/ の raid_pattern / raid_skill_dict / raid_support / raid_meta / raid_weapon_ef
 *
 * UIに依存しない純粋関数群。ブラウザ(グローバル RaidEngine)とNode(module.exports)の両対応。
 *
 * 主要API:
 *   RaidEngine.init(data)                      — 5つのJSONを渡して初期化
 *   RaidEngine.evaluateParty(party, boss, opt) — パーティ5枠のスコア計算（明細つき）
 *   RaidEngine.rankAttackers(boss, opt)        — アタッカー単体ランキング
 *   RaidEngine.rankSupporters(party, boss, opt)— 空きスロットへの増分ランキング
 *
 * 用語:
 *   grant   = EF付与の実体 {cond, mult, targets, startTurn, startSeq, expireTurn, ...}
 *   seq     = ターン内の時系列位置。0=ターン開始時, 1..N=行動(サポーター→アタッカー、スロット1は最後), 999=ターン終了時
 */
(function (global) {
    "use strict";

    const CAP = 99999999;
    const TURNS = 3;
    const ATTRS = ["斬", "打", "突", "熱", "冷", "雷", "陽", "陰"];
    const OD_PER_ATTACK = 16; // 1攻撃あたりのODゲージ上昇(暫定)

    // EF名前付き条件マップ（PHP $EF_CONDITION_MAP の移植。新条件はここに追記）
    const EF_COND_MAP = {
        "古き神の力": {},
        "邪神憑りし者": { character: "飯綱こよみ" },
        "破壊女神": { character: "サイヴァ" },
        "目覚めし者": { character: "飯綱こよみ" },
        "呪われし者": { character: "ヴィンセント・クインブラ" },
        "魔を祓いし者": { character: "ダリオ・グラナダ" },
        "黒き象": { character: "ダイ・ダイ" },
        "術法と科学を極めし者": { character: "ボルカノ" },
        "竜人束ねし女王": { character: "サライ・グラキエス" },
        "紡し者": { character: "シィレイ" },
        "書を操りし者": {}, // TODO キャラ特定
        "四元像": { character: "アレツ、シムメシュ、シャムマベル、ノーア" },
        "女性": { gender: "女" },
        "性別不明": { gender: "不明" },
        "けんし": {},
        "GBSaGa": { series: "GB1/GB2/GB3" },
        "RS1": { series: "RS1" }, "RS2": { series: "RS2" }, "RS3": { series: "RS3" },
        "SF1": { series: "SF1" }, "SF2": { series: "SF2" },
        "US": { series: "US" }, "ES": { series: "ES" }, "IS": { series: "IS" },
        "SSG": { series: "SSG" }, "SaGaEB": { series: "SEB" }, "SaGaRS": { series: "RSR" },
        "神憑りの力": {},
        "赤竜波": { skill: "赤竜波" },
        "四元の記憶": { skill: "氷奏/電光雷破/紅烈火脚/波動斬・地怒" },
        "勇者のとくぎ": { skill: "ギガスラッシュ/ギガブレイク/ギガクロスブレイク" },
        "ムチの戦技": { skill: "双竜打ち/地這い大蛇" },
        "大魔王の魔力": { skill: "マヒャドのて/かがやくいき/マヒャデドスのこぶし" },
        "覇者の魔力": { skill: "ドルクマ/闇のれんごく魔弾/ダークピラー" },
        "覚醒剣技": { skill: "ラミアスの極光/メテオストライク" },
        "タロット": { skill: "愚者のカード/真・愚者のカード" },
        "夢幻陽炎の極意": { skill: "陽炎流し斬り/夢幻流し斬り" },
        "ギガスラッシュ": { skill: "ギガスラッシュ" },
        "ギガブレイク": { skill: "ギガブレイク" },
        "ギガクロスブレイク": { skill: "ギガクロスブレイク" },
        "フェルゼンプファイル": { skill: "フェルゼンプファイル" },
        "マヒャデドスのこぶし": { skill: "マヒャデドスのこぶし" },
        "スーパーハイテンション": { skill: "スーパーハイテンション" },
        "真・魔神の絶技": { skill: "真・魔神の絶技" },
        "輝閃連斬剣": { skill: "輝閃連斬剣" },
        "会心の一撃": { skill: "会心の一撃" },
    };

    let D = null; // {pattern, dict, support, meta, weaponEf}

    function init(data) {
        D = data;
    }

    // ============================================================
    // ユーティリティ
    // ============================================================

    function parseDuration(turnStr) {
        if (!turnStr) return Infinity;
        if (turnStr.indexOf("永続") >= 0) return Infinity;
        const m = String(turnStr).match(/(\d+)ターン/);
        return m ? +m[1] : Infinity;
    }

    function parseMaxLimit(limitStr) {
        if (!limitStr) return Infinity;
        const m = String(limitStr).match(/(\d+)/);
        return m ? +m[1] : Infinity;
    }

    /** 弱点キー: ボス弱点∩スタイル属性 を weakMap のキー形式(sortedカンマ結合)に */
    function weakKeyFor(styleEntry, bossWeaks) {
        const union = {};
        Object.keys(styleEntry.weakMap || {}).forEach(k => {
            k.split(",").forEach(a => { if (a) union[a] = 1; });
        });
        const inter = bossWeaks.filter(a => union[a]);
        inter.sort();
        return (styleEntry.weakMap || {})[inter.join(",")] ?? "";
    }

    // ============================================================
    // EFグラント展開
    // ============================================================

    /**
     * 対象文字列 → スロットインデックス配列
     * @param target 付与対象（自身/味方単体/対象/味方生存者全体/敵...）
     */
    function resolveTargets(target, selfSlot, partySize) {
        const all = [];
        for (let i = 0; i < partySize; i++) all.push(i);
        if (!target || target === "自身") return [selfSlot];
        if (target.indexOf("味方生存者全体") >= 0 || target === "全員" || target === "味方全体") {
            return target.indexOf("自身以外") >= 0 ? all.filter(i => i !== selfSlot) : all;
        }
        if (target === "味方単体" || target === "対象" || target === "対象と自身") {
            // 単体付与は先頭(スロット0)へ。「対象と自身」は先頭+自身
            return target === "対象と自身" ? [...new Set([0, selfSlot])] : [0];
        }
        if (target.indexOf("敵") >= 0) {
            // 敵経由（敵に付与したアビからプレイヤー側にEF）は全体扱い
            return all;
        }
        return [selfSlot];
    }

    /**
     * when文字列 → 発動タイミング {turn, seq} のリスト（3ターン分）
     * seq: 0=ターン開始時, ACT=行動時(発動者の行動位置で確定), 999=ターン終了時
     * 対応外のwhenは null を返す（unhandledに記録される）
     */
    function whenToTimings(when, condition) {
        const w = when || "";
        const timings = [];
        if (w === "バトル開始時" || w === "常時" || w === "") return [{ turn: 1, seq: 0 }];
        if (w === "ターン開始時" || w === "ラウンド開始時") {
            for (let t = 1; t <= TURNS; t++) timings.push({ turn: t, seq: 0 });
            return timings;
        }
        let m = w.match(/^(\d+)ターン目以降のターン開始時$/);
        if (m) {
            for (let t = +m[1]; t <= TURNS; t++) timings.push({ turn: t, seq: 0 });
            return timings;
        }
        m = w.match(/^(\d+)ターン目のターン開始時$/);
        if (m) return +m[1] <= TURNS ? [{ turn: +m[1], seq: 0 }] : [];
        m = w.match(/^(\d+)の倍数のターン開始時$/);
        if (m) {
            for (let t = 1; t <= TURNS; t++) if (t % +m[1] === 0) timings.push({ turn: t, seq: 0 });
            return timings;
        }
        if (w === "奇数ターン開始時") return [{ turn: 1, seq: 0 }, { turn: 3, seq: 0 }];
        if (w === "偶数ターン開始時") return [{ turn: 2, seq: 0 }];
        if (w === "ターン終了時") {
            for (let t = 1; t <= TURNS; t++) timings.push({ turn: t, seq: 999 });
            return timings;
        }
        // 行動連動系（攻撃時/Weak攻撃時/攻撃後/OD攻撃時/○○を発動後）は呼び出し側で行動位置に展開する
        if (/攻撃|発動後/.test(w)) return "ACTION";
        return null; // 未対応
    }

    /**
     * メンバーのサポートイベント(ef/critical)を静的グラントに展開
     * 行動連動(ACTION)とlimitは展開時にメンバーの行動列を参照する
     *
     * @param events  raid_support の events
     * @param member  {slot, styleId, actionSeqByTurn: {turn: seq}, attacksByTurn: {turn: [{attrs[],od,weak}...]}}
     * @param out     {grants:[], criticals:[], unhandled:[]}
     */
    function expandMemberEvents(events, member, partySize, out) {
        for (const e of events) {
            if (e.inactive) continue; // 状態条件がレイドで恒久不成立（PHP抽出時に共通評価器で判定済み）
            if (e.type === "bp" || e.type === "od") continue; // 別系統で処理
            if (e.type !== "ef" && e.type !== "critical") continue;

            // 補助技由来は supporter プラン側で展開するためここではスキップ
            if (e.source === "support_skill") continue;

            const isCrit = e.type === "critical";
            const targets = resolveTargets(e.target, member.slot, partySize);
            const duration = parseDuration(e.turn);
            let fireLimit = parseMaxLimit(e.maxLimit);

            // 攻撃技付随EF: その技を使うターンの行動位置で発動
            if (e.source === "attack_skill") {
                for (let t = 1; t <= TURNS; t++) {
                    const used = (member.skillUseByTurn[t] || []).some(id => id === e.skillId);
                    if (!used || fireLimit <= 0) continue;
                    fireLimit--;
                    out.grants.push({
                        cond: e.cond, mult: e.mult, grade: e.grade, targets,
                        turn: t,
                        seq: member.actionSeqByTurn[t] ?? 1,
                        beforeAttack: !!e.beforeAttack,
                        fromHit: 1,
                        expireTurn: t + (parseDuration(e.turn) || 1) - 1,
                        source: e, owner: member.slot, isCrit,
                    });
                }
                continue;
            }

            // アビリティ由来（チェーン込み）
            const timings = whenToTimings(e.when, e.condition);
            if (timings === null) {
                out.unhandled.push({ slot: member.slot, event: e });
                continue;
            }
            if (timings === "ACTION") {
                // 行動連動: 攻撃時/Weak攻撃時/攻撃後/○○のたび 等
                for (let t = 1; t <= TURNS; t++) {
                    const acts = member.attacksByTurn[t] || [];
                    for (const act of acts) {
                        if (fireLimit <= 0) break;
                        const w = e.when || "";
                        let fire = false;
                        let fromHit = 1;
                        let afterAction = false;
                        if (/^Weak攻撃/.test(w)) { fire = act.weak; fromHit = 2; }
                        else if (/^攻撃時|攻撃のたび/.test(w)) { fire = true; fromHit = 2; }
                        else if (/攻撃後|発動後/.test(w)) { fire = true; afterAction = true; }
                        else if (/OD攻撃/.test(w)) { fire = act.od; fromHit = 2; }
                        else if (/属性攻撃/.test(w)) {
                            const am = w.match(/([斬打突熱冷雷陽陰・]+)属性攻撃/);
                            fire = am ? am[1].split("・").every(a => act.attrs.includes(a)) : false;
                            fromHit = 2;
                        }
                        if (!fire) continue;
                        fireLimit--;
                        out.grants.push({
                            cond: e.cond, mult: e.mult, grade: e.grade, targets,
                            turn: t,
                            seq: member.actionSeqByTurn[t] ?? 1,
                            beforeAttack: false,
                            fromHit: afterAction ? Infinity : fromHit, // afterAction=同行動には乗らない
                            expireTurn: t + duration - 1,
                            source: e, owner: member.slot, isCrit,
                        });
                    }
                }
                continue;
            }
            for (const tm of timings) {
                if (fireLimit <= 0) break;
                fireLimit--;
                out.grants.push({
                    cond: e.cond, mult: e.mult, grade: e.grade, targets,
                    turn: tm.turn, seq: tm.seq, beforeAttack: false, fromHit: 1,
                    expireTurn: tm.turn + duration - 1,
                    source: e, owner: member.slot, isCrit,
                });
            }
        }
    }

    /** 武器EF: 装備条件が合えばバトル開始時から永続 */
    function weaponEfGrants(member, out) {
        const meta = D.meta[member.styleId] || {};
        for (const wp of D.weaponEf || []) {
            if (wp.weaponType !== meta.weaponType) continue;
            const cond = wp.equipCond || "";
            if (cond.indexOf("キャラクターが") === 0) {
                const names = cond.replace(/^キャラクターが/, "").replace(/の場合$/, "").split("、");
                if (!names.includes(meta.char)) continue;
            }
            out.grants.push({
                cond: wp.cond, mult: wp.mult, grade: wp.grade,
                targets: [member.slot], turn: 1, seq: 0, beforeAttack: false, fromHit: 1,
                expireTurn: Infinity, source: { weapon: wp.weaponName }, owner: member.slot, isCrit: false,
            });
        }
    }

    // ============================================================
    // hit単位のEF判定
    // ============================================================

    /** 武器種条件（装備武器=スタイルの武器種で判定） */
    const WEAPON_PARTS = { "剣": 1, "大剣": 1, "斧": 1, "棍棒": 1, "小剣": 1, "槍": 1, "弓": 1, "体術": 1, "銃": 1, "杖": 1 };
    /** レイドでは発生しない条件（連携など）→ 常に不適用。未知条件としては報告しない */
    const NEVER_PARTS = { "連携": 1 };
    /** 攻撃範囲系の条件パートか（範囲系は・区切りでもOR判定） */
    const AREA_PARTS = { "単体": 1, "全体": 1, "範囲": 1, "縦一列": 1, "横一列": 1 };

    function cleanSkillName(name) {
        return String(name || "").replace(/\[追撃\]|\[ｶｳﾝﾀｰ\]|\[溜め発動\]|\+$/g, "");
    }
    function areaPartMatches(part, hit) {
        const a = hit.area || "";
        if (part === "単体") return a === "敵単体" || a === "ランダム";
        if (part === "全体") return a === "敵全体";
        if (part === "範囲") return a === "敵縦一列" || a === "敵横一列";
        if (part === "縦一列") return a === "敵縦一列";
        if (part === "横一列") return a === "敵横一列";
        return false;
    }

    /** EF条件パート1つがhitに合致するか */
    function condPartMatches(part, hit, memberMeta, hasCrit) {
        if (part === "" ) return true;
        if (part === "Weak") return hit.weak;
        if (ATTRS.includes(part)) return hit.attrs.includes(part);
        if (part === "直接" || part === "間接") return hit.method === part;
        if (part === "技" || part === "術") return hit.type === part;
        if (part === "OD") return hit.od;
        if (part === "Critical") return hasCrit;
        if (AREA_PARTS[part]) return areaPartMatches(part, hit);
        if (WEAPON_PARTS[part]) return memberMeta.weaponType === part;
        if (NEVER_PARTS[part]) return false;
        const rule = EF_COND_MAP[part];
        if (!rule) {
            // マップ未登録の名前は「特定技条件」として技名と直接比較する
            // （月華必衰斬/バベルクランブル等。一致しなければそのhitには乗らないだけで未知扱いにしない）
            return part === cleanSkillName(hit.skillName);
        }
        if (rule.character) return rule.character.split("、").includes(memberMeta.char);
        if (rule.gender) return memberMeta.gender === rule.gender;
        if (rule.series) return rule.series.split("/").includes(memberMeta.series);
        if (rule.skill) return rule.skill.split("/").includes(cleanSkillName(hit.skillName));
        return true; // {} = 条件なし
    }

    /**
     * EF条件がhitに合致するか
     * ・区切りの複合条件は基本AND（斬・陽 = 斬かつ陽属性のhit）だが、
     * 攻撃範囲系（全体・範囲 = 全体または範囲攻撃）は1つの攻撃が複数範囲を持てないためOR判定
     */
    function condMatches(cond, hit, memberMeta, hasCrit, unknownConds) {
        const condStr = String(cond);
        // 「・」を含む技名条件（真・魔神の絶技/無明葬剣・伍式 等）は分割前に全体一致を試す
        if (EF_COND_MAP[condStr]) {
            const r = condPartMatches(condStr, hit, memberMeta, hasCrit);
            return r === true;
        }
        if (condStr.indexOf("・") >= 0 && condStr === cleanSkillName(hit.skillName)) return true;
        const parts = condStr.split("・");
        const areaParts = parts.filter(p => AREA_PARTS[p]);
        const otherParts = parts.filter(p => !AREA_PARTS[p]);
        if (areaParts.length && !areaParts.some(p => areaPartMatches(p, hit))) return false;
        for (const part of otherParts) {
            const r = condPartMatches(part, hit, memberMeta, hasCrit);
            if (r && r.unknown) {
                unknownConds.add(r.unknown);
                return false;
            }
            if (!r) return false;
        }
        return true;
    }

    // ============================================================
    // パーティ評価
    // ============================================================

    /**
     * @param party [{styleId, variantIdx?, odTurns?, supportPlan?}] 長さ1〜5。slot0=先頭
     * @param boss  {weaks: ["打"], gotai: {直接:0.9, 間接:0, 技:0, 術:0}}
     * @param opt   {hitMode: "avg"|"max", autoVariant: true}
     * @return {total, members:[{styleId, damage, hits, actions, turns:[...]}], grants, unhandled, unknownConds}
     */
    function evaluateParty(party, boss, opt) {
        opt = opt || {};
        const hitMode = opt.hitMode || "avg";
        const partySize = party.length;
        const unknownConds = new Set();
        const out = { grants: [], criticals: [], unhandled: [] };

        // ---- 0. ODゲージ供給の集計（変種選択の実現可能性判定に使う） ----
        const odSupply = computeOdSupply(party.map(p => p.styleId), partySize);

        // ---- 1. 各メンバーの行動列を確定（変種選択） ----
        const members = party.map((p, slot) => {
            const m = {
                slot, styleId: p.styleId,
                meta: D.meta[p.styleId] || {},
                variant: null, config: null, odTurns: p.odTurns || [],
                skillUseByTurn: {}, actionSeqByTurn: {}, attacksByTurn: {},
                supportPlan: p.supportPlan || null,
            };
            const entry = D.pattern[p.styleId];
            if (entry) {
                const wk = weakKeyFor(entry, boss.weaks || []);
                let cands = [];
                entry.variants.forEach((v, vi) => {
                    for (const c of v.configs) {
                        if (c.w.join(",") !== wk) continue;
                        cands.push({ v, vi, c });
                    }
                });
                // ODゲージ収支の検証:
                //   o=配列(OD感応変種) → そのODターンが実現可能なものだけ残す
                //   o="any"(OD非感応)  → 指定odTurnsが実現可能ならマーク。未指定はODなし
                //                        (ODは先頭行動になり同ターンの支援EFを失うため、
                //                         撃つかどうかは optimizeOd() で最適化する)
                cands = cands.map(x => {
                    if (Array.isArray(x.c.o)) {
                        const r = simulateOdGauge(x.v, odSupply[slot], x.c.o);
                        return r.feasible ? { ...x, odMarks: x.c.o } : null;
                    }
                    if (p.odTurns && p.odTurns.length) {
                        const r = simulateOdGauge(x.v, odSupply[slot], p.odTurns);
                        return { ...x, odMarks: r.feasible ? p.odTurns : [] };
                    }
                    return { ...x, odMarks: [] };
                }).filter(Boolean);

                if (cands.length) {
                    let pick;
                    if (p.variantIdx != null) {
                        pick = cands.find(x => x.vi === p.variantIdx) || cands[0];
                    } else {
                        // ベスト変種 = hit数(指定モード)最大、同点なら要BP供給が少ない方
                        cands.sort((a, b) => {
                            const ha = hitMode === "max" ? a.v.hitMax : (a.v.hitMin + a.v.hitMax) / 2;
                            const hb = hitMode === "max" ? b.v.hitMax : (b.v.hitMin + b.v.hitMax) / 2;
                            if (hb !== ha) return hb - ha;
                            return a.c.b - b.c.b;
                        });
                        pick = cands[0];
                    }
                    m.variant = pick.v;
                    m.config = pick.c;
                    m.odTurns = pick.odMarks || [];
                }
            }
            return m;
        });

        // ---- 2. 行動順の確定 ----
        // ご都合主義: ターン内 seq = OD使用者 → スロット1以外(添字昇順) → スロット0
        for (let t = 1; t <= TURNS; t++) {
            const order = [];
            const isOd = (m) => m.odTurns.includes(t);
            members.filter(m => isOd(m)).forEach(m => order.push(m));
            members.filter(m => !isOd(m) && m.slot !== 0).forEach(m => order.push(m));
            const head = members.find(m => m.slot === 0);
            if (head && !order.includes(head)) order.push(head);
            order.forEach((m, i) => { m.actionSeqByTurn[t] = i + 1; });
        }

        // ---- 3. 各メンバーのhit列を構築 ----
        for (const m of members) {
            for (let t = 1; t <= TURNS; t++) {
                m.skillUseByTurn[t] = [];
                m.attacksByTurn[t] = [];
            }
            if (!m.variant) continue;
            m.variant.turns.forEach((recs, ti) => {
                const t = ti + 1;
                const od = m.odTurns.includes(t);
                for (const [skillId, tsuigeki] of recs) {
                    const sk = D.dict[skillId] || {};
                    m.skillUseByTurn[t].push(skillId);
                    if (!sk.atk) continue;
                    const attrs = String(sk.attrs || "").split(",").filter(Boolean);
                    const weak = attrs.some(a => (boss.weaks || []).includes(a));
                    m.attacksByTurn[t].push({
                        skillId, skillName: sk.name || "", attrs, weak, od,
                        method: sk.method, type: sk.type, area: sk.area || "",
                        hits: hitMode === "max" ? sk.hitMax : (sk.hitMin + sk.hitMax) / 2,
                        tsuigeki: !!tsuigeki,
                    });
                }
            });
        }

        // ---- 4. EFグラント展開 ----
        for (const m of members) {
            const events = (D.support[m.styleId] || {}).events || [];
            expandMemberEvents(events, m, partySize, out);
            weaponEfGrants(m, out);
            // 補助技プラン（サポーター）: {turn: eventIndex | eventIndex[]} 形式
            // 1つの補助技が複数EFを付与する場合（剣士の波紋=剣+大剣 等）は配列で同時発火する
            if (m.supportPlan) {
                for (const [turnStr, evIdxRaw] of Object.entries(m.supportPlan)) {
                    const t = +turnStr;
                    for (const evIdx of (Array.isArray(evIdxRaw) ? evIdxRaw : [evIdxRaw])) {
                        const e = events[evIdx];
                        if (!e || e.type !== "ef") continue;
                        out.grants.push({
                            cond: e.cond, mult: e.mult, grade: e.grade,
                            targets: resolveTargets(e.target, m.slot, partySize),
                            turn: t, seq: m.actionSeqByTurn[t] ?? 1, beforeAttack: false, fromHit: 1,
                            expireTurn: t + parseDuration(e.turn) - 1,
                            source: e, owner: m.slot, isCrit: false,
                        });
                    }
                }
            }
        }

        // クリ強制（critical type grants は grants に isCrit で入っている）
        const critGrants = out.grants.filter(g => g.isCrit);
        const efGrants = out.grants.filter(g => !g.isCrit);

        // ---- 5. スコア計算 ----
        const gotai = boss.gotai || {};
        const result = { total: 0, members: [], unhandled: out.unhandled, unknownConds, grants: out.grants };

        for (const m of members) {
            const mr = { styleId: m.styleId, name: m.meta.name, char: m.meta.char, damage: 0, hits: 0, actions: 0, turns: [], bpNeed: m.config ? m.config.b : 0, variant: m.variant, config: m.config };
            for (let t = 1; t <= TURNS; t++) {
                const seq = m.actionSeqByTurn[t] ?? 1;
                const turnDetail = [];
                const acts = m.attacksByTurn[t] || [];
                mr.actions += (m.skillUseByTurn[t] || []).length;
                for (const act of acts) {
                    // この行動のhitに有効なEFグラントを抽出
                    const hasCrit = critGrants.some(g =>
                        g.targets.includes(m.slot) && (g.turn < t || (g.turn === t && g.seq <= seq)) && t <= g.expireTurn);
                    const hit = { ...act };
                    const active = [];
                    for (const g of efGrants) {
                        if (!g.targets.includes(m.slot)) continue;
                        if (t > g.expireTurn) continue;
                        // 発動済みか（時系列判定）
                        if (g.turn > t) continue;
                        if (g.turn === t) {
                            if (g.seq > seq) continue;
                            if (g.seq === seq && g.owner === m.slot) {
                                // 自分の行動中の付与: beforeAttack なら同行動から、それ以外は fromHit から
                                if (g.fromHit === Infinity) continue;
                            } else if (g.seq === seq) {
                                continue; // 同seqの他人=自分より後扱いはしない(同seqは自分のみ)
                            }
                        }
                        if (!condMatches(g.cond, hit, m.meta, hasCrit, unknownConds)) continue;
                        active.push(g);
                    }
                    // 同名(cond)上書き: 最大multのみ有効
                    const byCond = {};
                    const wasted = [];
                    for (const g of active) {
                        const cur = byCond[g.cond];
                        if (!cur || (g.mult || 0) > (cur.mult || 0)) {
                            if (cur) wasted.push(cur);
                            byCond[g.cond] = g;
                        } else {
                            wasted.push(g);
                        }
                    }
                    const efSum = Object.values(byCond).reduce((s, g) => s + (g.mult || 0), 0);
                    // 剛体: 直間×技術 乗算
                    let cut = 1;
                    if (gotai[hit.method]) cut *= (1 - gotai[hit.method]);
                    if (gotai[hit.type]) cut *= (1 - gotai[hit.type]);
                    const dmg = Math.round(hit.hits * CAP * (1 + efSum) * cut);
                    mr.damage += dmg;
                    mr.hits += hit.hits;
                    turnDetail.push({
                        skill: hit.skillName, hits: hit.hits, attrs: hit.attrs, od: hit.od, weak: hit.weak,
                        method: hit.method, type: hit.type, area: hit.area,
                        efSum, efActive: Object.values(byCond).map(g => ({ cond: g.cond, grade: g.grade, mult: g.mult, from: g.owner })),
                        efWasted: wasted.map(g => ({ cond: g.cond, grade: g.grade, mult: g.mult, from: g.owner })),
                        cut: 1 - cut, damage: dmg,
                    });
                }
                mr.turns.push(turnDetail);
            }
            result.total += mr.damage;
            result.members.push(mr);
        }
        result.unknownConds = [...unknownConds];
        return result;
    }

    // ============================================================
    // ODゲージ収支
    // ============================================================

    /**
     * パーティ全員のODゲージ供給イベントを集計
     * @return slot別 {battleStart, turnStart:{t:amt}, turnEnd:{t:amt}}
     * 注意: 攻撃連動(攻撃命中時ODゲージ上昇等)のタイミング系以外はv1では未対応
     */
    function computeOdSupply(partyStyleIds, partySize) {
        const supply = [];
        for (let i = 0; i < partySize; i++) {
            supply.push({ battleStart: 0, turnStart: { 1: 0, 2: 0, 3: 0 }, turnEnd: { 1: 0, 2: 0, 3: 0 } });
        }
        partyStyleIds.forEach((styleId, slot) => {
            const events = (D.support[styleId] || {}).events || [];
            for (const e of events) {
                if (e.inactive) continue;
                if (e.type !== "od" || !e.amount) continue;
                const timings = whenToTimings(e.when, e.condition);
                if (timings === null || timings === "ACTION") continue; // 攻撃連動供給はv1未対応
                const targets = resolveTargets(e.target, slot, partySize);
                let fireLimit = parseMaxLimit(e.maxLimit);
                for (const tm of timings) {
                    if (fireLimit <= 0) break;
                    fireLimit--;
                    for (const tg of targets) {
                        if (tm.seq === 0) {
                            if (tm.turn === 1 && (e.when === "バトル開始時" || e.when === "常時" || !e.when)) supply[tg].battleStart += e.amount;
                            else supply[tg].turnStart[tm.turn] += e.amount;
                        } else {
                            supply[tg].turnEnd[tm.turn] += e.amount;
                        }
                    }
                }
            }
        });
        return supply;
    }

    /** 変種の「ターンごとの攻撃行動数」 */
    function attackActionsPerTurn(variant) {
        const acts = {};
        variant.turns.forEach((recs, ti) => {
            acts[ti + 1] = recs.filter(([id]) => (D.dict[id] || {}).atk).length;
        });
        return acts;
    }

    /**
     * ODゲージシミュレーション
     * @param odTurns ODを撃ちたいターン配列（null=貯まり次第すべて撃つ自動モード）
     * @return {feasible: bool, marks: [実際にODできるターン]}
     * ルール: ゲージはターン開始時点で100以上なら発動可。使用後0から再蓄積。1攻撃+16。
     */
    function simulateOdGauge(variant, slotSupply, odTurns) {
        const acts = attackActionsPerTurn(variant);
        let g = slotSupply.battleStart;
        const marks = [];
        const want = odTurns ? new Set(odTurns) : null;
        for (let t = 1; t <= TURNS; t++) {
            g += slotSupply.turnStart[t];
            const can = g >= 100;
            const use = want ? (want.has(t) && can) : can;
            if (want && want.has(t) && !can) return { feasible: false, marks };
            if (use) { marks.push(t); g = 0; }
            g += (acts[t] || 0) * OD_PER_ATTACK;
            g += slotSupply.turnEnd[t];
            g = Math.min(g, 100);
        }
        return { feasible: true, marks };
    }

    /**
     * ODターンの最適化（メンバーごとに逐次貪欲）
     * ODは「先頭で行動する＝同ターンの支援EFを失う」コストと「EF(OD)・OD追撃」の利得があるため、
     * 全パターンをスコア評価して決める
     * @return {party, total} odTurns設定済みのparty
     */
    function optimizeOd(party, boss, opt) {
        const OD_SETS = [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]];
        const work = party.map(p => ({ ...p }));
        let best = evaluateParty(work, boss, opt).total;
        for (let i = 0; i < work.length; i++) {
            if (!D.pattern[work[i].styleId]) continue;
            let bestSet = work[i].odTurns || [];
            for (const set of OD_SETS) {
                work[i] = { ...work[i], odTurns: set };
                const t = evaluateParty(work, boss, opt).total;
                if (t > best) { best = t; bestSet = set; }
            }
            work[i] = { ...work[i], odTurns: bestSet };
        }
        return { party: work, total: best };
    }

    // ============================================================
    // ランキング
    // ============================================================

    /** アタッカー単体ランキング（サポートなし、ボス設定適用） */
    function rankAttackers(boss, opt) {
        opt = opt || {};
        const rows = [];
        for (const styleId of Object.keys(D.pattern)) {
            const r = evaluateParty([{ styleId }], boss, opt);
            const m = r.members[0];
            rows.push({
                styleId, name: m.name, char: m.char,
                damage: m.damage, hits: m.hits, actions: m.actions, bpNeed: m.bpNeed,
                detail: m,
            });
        }
        rows.sort((a, b) => b.damage - a.damage);
        return rows;
    }

    /**
     * サポーター増分ランキング
     * @param party 現在のパーティ（1〜4枠）
     * @return [{styleId, gain, planDesc}] 増分降順
     */
    function rankSupporters(party, boss, opt) {
        opt = opt || {};
        const base = evaluateParty(party, boss, opt).total;
        const rows = [];
        const partyIds = new Set(party.map(p => p.styleId));
        for (const styleId of Object.keys(D.support)) {
            if (partyIds.has(styleId)) continue;
            const events = (D.support[styleId] || {}).events || [];
            if (!events.some(e => e.type === "ef" || e.type === "critical")) continue;
            const cand = bestSupporterPlan(party, styleId, boss, opt);
            if (cand.total > base) {
                // 増分を「自前火力」と「他メンバーへの支援効果」に分離する
                const selfDmg = cand.result ? (cand.result.members.find(m => m.styleId === styleId) || {}).damage || 0 : 0;
                rows.push({
                    styleId,
                    name: (D.meta[styleId] || {}).name,
                    char: (D.meta[styleId] || {}).char,
                    gain: cand.total - base,
                    gainSelf: selfDmg,
                    gainOthers: cand.total - base - selfDmg,
                    plan: cand.plan,
                });
            }
        }
        // デフォルトは支援効果(gainOthers)降順。総合で見たい場合は呼び出し側でgainソート
        rows.sort((a, b) => (opt.sortBy === "gain" ? b.gain - a.gain : b.gainOthers - a.gainOthers));
        return rows;
    }

    /** サポーター1体を追加した時の最適プラン探索（補助技の使用ターン全探索） */
    function bestSupporterPlan(party, styleId, boss, opt) {
        const events = (D.support[styleId] || {}).events || [];
        const hasPattern = !!D.pattern[styleId];
        // 技単位でイベントをグルーピング（1補助技=複数EFを同時発火させる）
        const bySkill = {};
        events.forEach((e, i) => {
            if (e.type !== "ef" || e.inactive) return;
            const plannable = e.source === "support_skill"
                // 攻撃技付随の全体/単体EF: アタッカーパターンを持たないスタイルでも
                // サポーターとして「その攻撃技を使う」プランで付与できる
                // (パターン持ちは変種シミュレーション側で発火するため二重計上を避ける)
                || (e.source === "attack_skill" && !hasPattern
                    && (String(e.target).includes("味方生存者全体") || String(e.target).includes("対象")));
            if (!plannable) return;
            (bySkill[e.skillId] = bySkill[e.skillId] || []).push(i);
        });

        // プラン候補: 補助技なし + 各技を1〜3ターン目に使用
        // （limit 1回の技が多いので v1 は「1技を1ターンに1回」の単純列挙。
        //   複数補助技の組み合わせはv2で対応）
        const plans = [null];
        for (const indices of Object.values(bySkill)) {
            // スタンバイターン: standby >= t のターンは使用不可（PHP側と同じ判定。改造手術Ⅱ=スタンバイ5は3Tレイドで使用不可）
            const standby = Math.max(...indices.map(i => +(events[i].standby || 0)));
            for (let t = 1; t <= TURNS; t++) {
                if (standby >= t && standby > 0) continue;
                plans.push({ [t]: indices });
            }
        }

        let best = { total: -1, plan: null, result: null };
        for (const plan of plans) {
            const p2 = [...party, { styleId, supportPlan: plan }];
            const r = evaluateParty(p2, boss, opt);
            if (r.total > best.total) best = { total: r.total, plan, result: r };
        }
        return best;
    }

    const api = {
        init, evaluateParty, rankAttackers, rankSupporters, bestSupporterPlan, optimizeOd,
        getSupportEvents: (styleId) => (D.support[styleId] || {}).events || [],
        getMeta: (styleId) => D.meta[styleId] || {},
        /** キャラ名/スタイル名で全スタイル検索（リリース日降順） */
        searchStyles: (q, limit) => {
            const rows = [];
            for (const [styleId, m] of Object.entries(D.meta)) {
                if (q && !(m.char || "").includes(q) && !(m.name || "").includes(q)) continue;
                rows.push({ styleId, ...m, isAttacker: !!D.pattern[styleId], hasSupport: !!D.support[styleId] });
            }
            rows.sort((a, b) => (b.release || "").localeCompare(a.release || ""));
            return rows.slice(0, limit || 30);
        },
        // テスト用に内部関数も公開
        _internals: { weakKeyFor, whenToTimings, resolveTargets, condMatches, parseDuration, EF_COND_MAP, computeOdSupply, simulateOdGauge },
        CAP, TURNS,
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    } else {
        global.RaidEngine = api;
    }
})(typeof window !== "undefined" ? window : globalThis);
