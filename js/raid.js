/**
 * raid.html UIロジック（フェーズ4）
 * 計算は js/raid_engine.js に委譲。ここは状態管理と描画のみ。
 */
(function () {
    "use strict";

    const ATTRS = ["斬", "打", "突", "熱", "冷", "雷", "陽", "陰"];
    const GOTAI_KEYS = ["直接", "間接", "技", "術"];
    const CUTS = [0, 0.5, 0.9, 0.99];
    const CAP = 99999999;

    // ===== 状態 =====
    const state = {
        weaks: [],
        gotai: { 直接: 0, 間接: 0, 技: 0, 術: 0 },
        hitMode: "max",
        party: [],          // [{styleId, supportPlan?}] slot0=先頭
        ranking: [],
        supRows: [],
        openDetail: null,   // 明細展開中の styleId
    };

    const $ = (sel) => document.querySelector(sel);
    const el = (html) => {
        const t = document.createElement("template");
        t.innerHTML = html.trim();
        return t.content.firstChild;
    };
    // ダメージ表示は「億」単位（カンスト99,999,999 ≒ 1億/hit）
    const fmtOku = (dmg) => {
        const v = dmg / 1e8;
        return (v >= 100 ? v.toFixed(1) : v.toFixed(1)).replace(/\.0$/, "");
    };
    const fmtCap = fmtOku; // 互換エイリアス

    /** スタイルアイコン（style.htmlと同じ style_icon_bg 画像を使用） */
    const styleIcon = (styleId, size) =>
        `<span class="sicon" style="width:${size}px;height:${size}px;background-image:url(https://romasagatool.com/img/style_icon_bg/${styleId}.png)"></span>`;

    // ===== データロード =====
    const FILES = ["raid_pattern", "raid_skill_dict", "raid_support", "raid_meta", "raid_weapon_ef"];
    Promise.all(FILES.map(f =>
        fetch(`./data/raid/${f}.json`).then(r => {
            if (!r.ok) throw new Error(`${f} load error ${r.status}`);
            return r.json();
        })
    )).then(([pattern, dict, support, meta, weaponEf]) => {
        RaidEngine.init({ pattern, dict, support, meta, weaponEf });
        $("#loading").classList.add("hidden");
        $("#hdrStatus").textContent = `${Object.keys(pattern).length}アタッカー / ${Object.keys(support).length}サポート候補`;
        buildBossPanel();
        refreshAll();
    }).catch(e => {
        $("#loadPct").textContent = "読込エラー: " + e.message;
    });

    // ===== ボス設定パネル =====
    function buildBossPanel() {
        const chips = $("#weakChips");
        ATTRS.forEach(a => {
            const c = el(`<button class="attr-chip">${a}</button>`);
            c.addEventListener("click", () => {
                c.classList.toggle("on");
                state.weaks = [...chips.querySelectorAll(".on")].map(x => x.textContent);
                refreshAll();
            });
            chips.appendChild(c);
        });

        const gs = $("#gotaiSelects");
        GOTAI_KEYS.forEach(k => {
            const wrap = el(`<label class="gotai-item"><span>${k}</span></label>`);
            const sel = document.createElement("select");
            CUTS.forEach(c => {
                const o = document.createElement("option");
                o.value = c;
                o.textContent = c === 0 ? "カットなし" : `${c * 100}%カット`;
                sel.appendChild(o);
            });
            sel.addEventListener("change", () => {
                state.gotai[k] = +sel.value;
                sel.classList.toggle("cut", +sel.value > 0);
                refreshAll();
            });
            wrap.appendChild(sel);
            gs.appendChild(wrap);
        });

        $("#hitMode").querySelectorAll("button").forEach(b => {
            b.addEventListener("click", () => {
                $("#hitMode").querySelectorAll("button").forEach(x => x.classList.remove("on"));
                b.classList.add("on");
                state.hitMode = b.dataset.v;
                refreshAll();
            });
        });

        $("#partyDetailBtn").addEventListener("click", () => {
            $("#partyDetail").classList.toggle("hidden");
            renderPartyDetail();
        });
        $("#supSearch").addEventListener("input", renderSupList);
        $("#freeSearch").addEventListener("input", renderFreeList);
        renderFreeList();
    }

    // ===== 自由選択（全スタイル検索） =====
    function renderFreeList() {
        const list = $("#freeList");
        const q = $("#freeSearch").value.trim();
        list.innerHTML = "";
        if (!q) {
            list.appendChild(el(`<div class="note" style="padding:6px;">キャラ名を入力すると候補が出ます（アタッカー/サポーター問わず追加可能）</div>`));
            return;
        }
        RaidEngine.searchStyles(q, 30).forEach(r => {
            const tags = [
                r.isAttacker ? `<span class="badge slow">攻</span>` : "",
                r.hasSupport ? `<span class="badge bp">援</span>` : "",
            ].join("");
            const row = el(`<div class="sup-row">
                <span class="nm">${styleIcon(r.styleId, 28)}<b>${r.char}</b> <span style="color:var(--fg-dim);font-size:11px;">${r.name !== r.char ? r.name : ""} ${r.release || ""}</span>${tags}</span>
            </div>`);
            row.addEventListener("click", () => {
                // サポートイベント持ちなら最適プランを探索して追加
                if (!r.isAttacker && r.hasSupport && state.party.length) {
                    const best = RaidEngine.bestSupporterPlan(state.party, r.styleId, bossConfig(), opt());
                    addToParty(r.styleId, best.plan);
                } else {
                    addToParty(r.styleId);
                }
            });
            list.appendChild(row);
        });
    }

    function bossConfig() {
        const gotai = {};
        GOTAI_KEYS.forEach(k => { if (state.gotai[k] > 0) gotai[k] = state.gotai[k]; });
        return { weaks: state.weaks, gotai };
    }
    function opt() { return { hitMode: state.hitMode }; }

    // ===== 再計算 =====
    function refreshAll() {
        state.ranking = RaidEngine.rankAttackers(bossConfig(), opt());
        renderRanking();
        refreshParty();
    }

    function refreshParty() {
        if (state.party.length) {
            // ODターンを自動最適化（EF(OD)/OD追撃があれば撃ち、なければ支援EF優先で撃たない）
            const od = RaidEngine.optimizeOd(state.party, bossConfig(), opt());
            state.party = od.party;
            const r = RaidEngine.evaluateParty(state.party, bossConfig(), opt());
            state.partyResult = r;
            $("#totalVal").textContent = fmtOku(r.total) + "億";
        } else {
            state.partyResult = null;
            $("#totalVal").textContent = "0億";
        }
        renderSlots();
        renderPartyDetail();
        // サポーターランキングはアタッカー編成後のみ表示
        // （EFの増分は基準アタッカーの属性・直間・技術に依存するため、基準なしの数値は誤解を招く）
        state.supRows = state.party.length ? RaidEngine.rankSupporters(state.party, bossConfig(), opt()) : [];
        renderSupList();
    }

    // ===== アタッカーランキング =====
    function renderRanking() {
        const tbody = $("#rankTable tbody");
        tbody.innerHTML = "";
        state.ranking.slice(0, 50).forEach((r, i) => {
            const slowBadge = r.actions >= 15 ? `<span class="badge slow">行動${r.actions}</span>` : "";
            const bpBadge = r.bpNeed > 0 ? `<span class="badge bp">要BP${r.bpNeed}</span>` : "";
            const tr = el(`<tr>
                <td class="rank-pos">${i + 1}</td>
                <td>${styleIcon(r.styleId, 34)}<b>${r.char}</b> <span style="color:var(--fg-dim);font-size:11px;">${r.name !== r.char ? r.name : ""}</span>${bpBadge}${slowBadge}</td>
                <td class="num dmg">${fmtCap(r.damage)}</td>
                <td class="num">${r.hits}</td>
                <td class="num">${r.actions}</td>
                <td><button class="ghost-btn" title="編成に追加">▶</button></td>
            </tr>`);
            tr.addEventListener("click", (ev) => {
                if (ev.target.tagName === "BUTTON") return;
                toggleDetail(tr, r);
            });
            tr.querySelector("button").addEventListener("click", () => addToParty(r.styleId));
            tbody.appendChild(tr);
        });
    }

    function toggleDetail(tr, r) {
        const existing = tr.parentNode.querySelector(".detail-row");
        const wasOpen = state.openDetail === r.styleId;
        if (existing) existing.remove();
        state.openDetail = null;
        if (wasOpen) return;
        state.openDetail = r.styleId;
        const dr = el(`<tr class="detail-row"><td colspan="6"></td></tr>`);
        dr.querySelector("td").appendChild(renderMemberTurns(r.detail));
        tr.after(dr);
    }

    /** メンバー1人のターン明細DOM（1行動=1行の縦積み、ターン合計スコアつき） */
    function renderMemberTurns(m) {
        const box = el(`<div class="turnbox"></div>`);
        m.turns.forEach((acts, ti) => {
            const turnDmg = acts.reduce((s, a) => s + (a.damage || 0), 0);
            const turnHits = acts.reduce((s, a) => s + a.hits, 0);
            const group = el(`<div class="turngroup">
                <div class="turnhead">
                    <span class="t">TURN ${ti + 1}</span>
                    <span style="font-size:11px;color:var(--fg-dim);">${acts.length}行動 / ${turnHits}hit</span>
                    <span class="tsum">${fmtOku(turnDmg)}<span class="u">億</span></span>
                </div>
            </div>`);
            if (!acts.length) group.appendChild(el(`<div class="actrow" style="color:var(--fg-dim);">（攻撃なし）</div>`));
            acts.forEach(a => {
                const cls = ["actrow", a.od ? "od" : "", a.weak ? "weakhit" : ""].join(" ");
                const baseName = a.skill.replace("[追撃]", "");
                const isTsui = a.skill.includes("[追撃]");
                const efs = a.efActive.map(e =>
                    `<span class="efchip ${e.cond === "Weak" ? "weakcond" : ""}">${e.cond}${e.grade ? "/" + e.grade : ""}</span>`).join("");
                const wasted = a.efWasted.map(e =>
                    `<span class="efchip wasted" title="同名EFに上書きされ無効">${e.cond}${e.grade ? "/" + e.grade : ""}</span>`).join("");
                const flags = (a.od ? "OD" : "") + (a.weak ? (a.od ? "/弱" : "弱") : "");
                group.appendChild(el(`<div class="${cls}">
                    <span class="a">${a.attrs.join("")}${flags ? `<span class="flags">${flags}</span>` : ""}</span>
                    <span class="nm">${baseName}${isTsui ? ` <span class="tsui">追撃</span>` : ""}</span>
                    <span class="calc"><span class="h">${a.hits}hit</span> ×${(1 + a.efSum).toFixed(2)} = <span class="dmg-v">${fmtOku(a.damage)}億</span></span>
                    <span class="efs">${efs}${wasted}</span>
                </div>`));
            });
            box.appendChild(group);
        });
        return box;
    }

    // ===== パーティ =====
    function addToParty(styleId, supportPlan) {
        if (state.party.length >= 5) return alert("パーティは5枠までです");
        if (state.party.some(p => p.styleId === styleId)) return;
        state.party.push(supportPlan !== undefined ? { styleId, supportPlan } : { styleId });
        refreshParty();
    }

    const IMG = "https://romasagatool.com/img";
    const WP_ICON = {
        "剣": "icon_ken", "大剣": "icon_dken", "斧": "icon_ono", "小剣": "icon_sken",
        "槍": "icon_yari", "弓": "icon_yumi", "棍棒": "icon_kon", "体術": "icon_tai",
        "銃": "icon_ju", "杖": "icon_tsue",
    };

    function renderSlots() {
        const wrap = $("#slots");
        wrap.innerHTML = "";
        const result = state.partyResult;
        for (let i = 0; i < 5; i++) {
            const p = state.party[i];
            if (!p) {
                wrap.appendChild(el(`<div class="slot empty"><span class="pos">${i + 1}</span>空き</div>`));
                continue;
            }
            const m = result ? result.members[i] : null;
            const meta = RaidEngine.getMeta(p.styleId);
            const events = RaidEngine.getSupportEvents(p.styleId);
            const planDesc = p.supportPlan
                ? Object.entries(p.supportPlan).map(([t, idx]) => {
                    const i0 = Array.isArray(idx) ? idx[0] : idx;
                    return `T${t}:${(events[i0] || {}).skill || "補助技"}`;
                }).join(" / ")
                : "";
            const odDesc = (p.odTurns || []).length ? `<span class="badge slow">OD:T${p.odTurns.join(",T")}</span>` : "";
            const bpBadge = m && m.bpNeed > 0 ? `<span class="badge bp">要BP${m.bpNeed}</span>` : "";
            const rare = (meta.rarity || "SS").toUpperCase();
            const rareLow = rare.toLowerCase();
            const wpIcon = WP_ICON[meta.weaponType];
            const slot = el(`<div class="slot">
                <div class="card-head" style="background:#333 url(${IMG}/bg_styleback_${rareLow}.jpg) repeat-y;background-size:contain;">
                    <span class="pos">${i + 1}</span>
                    <img class="rare-icon" src="${IMG}/icon/icon_${rare}.png" alt="${rare}"
                         onerror="this.style.display='none'">
                    <img class="char-img" src="${IMG}/style_vertical/${p.styleId}.png" alt="${meta.char || ''}"
                         onerror="this.src='${IMG}/style_icon_bg/${p.styleId}.png';this.style.objectFit='contain'">
                    <div class="move-btns">
                        <button data-act="up" title="左へ">◀</button>
                        <button data-act="down" title="右へ">▶</button>
                    </div>
                    <button class="del-btn" data-act="del" title="外す">✕</button>
                </div>
                <div class="card-body">
                    <div class="nm-row">
                        ${wpIcon ? `<img class="wp-icon" src="${IMG}/icon/${wpIcon}.png" alt="">` : ""}
                        <span class="nm" title="${meta.char || ""}">${meta.char || p.styleId}</span>
                    </div>
                    <div class="score-row"><span class="v">${m ? fmtOku(m.damage) : "-"}</span><span class="u">億</span></div>
                    <div class="tags">${bpBadge}${odDesc}</div>
                    ${planDesc ? `<div class="plan-txt" title="${planDesc}">${planDesc}</div>` : ""}
                </div>
            </div>`);
            slot.querySelector('[data-act="up"]').addEventListener("click", () => moveSlot(i, -1));
            slot.querySelector('[data-act="down"]').addEventListener("click", () => moveSlot(i, 1));
            slot.querySelector('[data-act="del"]').addEventListener("click", () => { state.party.splice(i, 1); refreshParty(); });
            wrap.appendChild(slot);
        }
    }

    function moveSlot(i, d) {
        const j = i + d;
        if (j < 0 || j >= state.party.length) return;
        [state.party[i], state.party[j]] = [state.party[j], state.party[i]];
        refreshParty();
    }

    function renderPartyDetail() {
        const box = $("#partyDetail");
        if (box.classList.contains("hidden")) return;
        box.innerHTML = "";
        if (!state.partyResult) {
            box.appendChild(el(`<div class="note">パーティが空です</div>`));
            return;
        }
        state.partyResult.members.forEach((m, i) => {
            box.appendChild(el(`<div style="margin:8px 0 4px;font-weight:700;display:flex;align-items:center;gap:6px;">
                ${i + 1}. ${styleIcon(m.styleId, 30)} ${m.char} <span class="dmg" style="font-family:var(--font-num);">${fmtCap(m.damage)}</span>
                <span style="color:var(--fg-dim);font-size:11px;">${m.hits}hit / ${m.actions}行動</span></div>`));
            box.appendChild(renderMemberTurns(m));
        });
    }

    // ===== サポーターランキング =====

    /** 現在の基準パーティ(またはランキング1位)のhitプロファイルを作る（EF反応判定用） */
    function attackerHitProfile() {
        if (!state.partyResult) return null;
        const members = state.partyResult.members;
        const hits = [];
        let metaRef = null;
        members.forEach(m => {
            if (!m.turns) return;
            const meta = RaidEngine.getMeta(m.styleId);
            if (!metaRef && m.hits > 0) metaRef = meta;
            m.turns.forEach(acts => acts.forEach(a => {
                hits.push({ hit: { attrs: a.attrs, weak: a.weak, od: true, method: a.method, type: a.type, area: a.area, skillName: a.skill }, meta });
                hits.push({ hit: { attrs: a.attrs, weak: a.weak, od: false, method: a.method, type: a.type, area: a.area, skillName: a.skill }, meta });
            }));
        });
        return hits.length ? hits : null;
    }

    /** EF条件が現在のアタッカーのどれかのhitに反応するか */
    function condReacts(cond, profile) {
        if (!profile) return true;
        const { condMatches } = RaidEngine._internals;
        const dummy = new Set();
        return profile.some(p => condMatches(cond, p.hit, p.meta, true, dummy));
    }

    /** サポート内容の展開表示: タイミングごとに「打/中(1T) Weak/中(1T)」形式 */
    function buildSupDetail(r, profile) {
        const events = RaidEngine.getSupportEvents(r.styleId).filter(e => !e.inactive);
        const { parseDuration } = RaidEngine._internals;
        const durTxt = (turnStr) => {
            const d = parseDuration(turnStr);
            return d === Infinity ? "永続" : `${d}T`;
        };
        const groups = {}; // label => [text...]
        let hiddenCount = 0;
        for (const e of events) {
            let label, text;
            if (e.type === "ef") {
                if (!condReacts(e.cond, profile)) { hiddenCount++; continue; }
                label = e.source === "support_skill" ? `補助技[${e.skill}]`
                    : e.source === "attack_skill" ? `攻撃技[${e.skill}]`
                    : (e.when || "常時");
                const selfOnly = (e.target === "自身") ? "(自身のみ)" : "";
                text = `<span class="efchip ${e.cond === "Weak" ? "weakcond" : ""}">${e.cond}/${e.grade}(${durTxt(e.turn)})${selfOnly}</span>`;
            } else if (e.type === "od") {
                label = e.when || "常時";
                text = `<span class="efchip" style="color:var(--gold);border-color:rgba(255,201,77,.5);">ODゲージ${e.amount >= 100 ? "満タン" : "+" + e.amount}${e.target === "自身" ? "(自身)" : ""}</span>`;
            } else if (e.type === "bp") {
                label = e.when || "常時";
                text = `<span class="efchip" style="color:var(--green);border-color:rgba(123,201,111,.5);">BP供給+${String(e.size).replace("+", "")}</span>`;
            } else if (e.type === "critical") {
                label = e.when || "常時";
                text = `<span class="efchip" style="color:var(--weak);">クリ強制(${e.target})</span>`;
            } else continue;
            (groups[label] = groups[label] || []).push(text);
        }
        const box = el(`<div class="sup-detail"></div>`);
        for (const [label, texts] of Object.entries(groups)) {
            box.appendChild(el(`<div class="sup-detail-line"><span class="lb">${label}:</span><span>${texts.join(" ")}</span></div>`));
        }
        if (!Object.keys(groups).length) box.appendChild(el(`<div class="note">現在のアタッカーに反応する効果はありません</div>`));
        if (hiddenCount) box.appendChild(el(`<div class="note">他${hiddenCount}件のEFは現在のアタッカーに反応しないため非表示</div>`));
        return box;
    }

    function renderSupList() {
        const list = $("#supList");
        const q = $("#supSearch").value.trim();
        list.innerHTML = "";
        if (!state.party.length) {
            list.appendChild(el(`<div class="note" style="padding:8px;">
                サポーターの増分は基準となるアタッカーの属性・直接/間接・技/術に依存します。<br>
                まずアタッカーランキングから ▶ で編成してください。</div>`));
            return;
        }
        // 基準パーティの明示（誰に対する増分なのかを常に見せる）
        const baseChars = state.partyResult
            ? state.partyResult.members.filter(m => m.hits > 0).map(m => m.char).join(" / ")
            : "";
        list.appendChild(el(`<div class="note" style="padding:2px 8px 6px;">基準アタッカー: <b style="color:var(--fg);">${baseChars || "なし"}</b>（このパーティへの増分を表示）</div>`));
        const profile = attackerHitProfile();
        let openDetail = null;
        state.supRows
            .filter(r => !q || (r.char || "").includes(q) || (r.name || "").includes(q))
            .slice(0, 60)
            .forEach(r => {
                const row = el(`<div class="sup-row">
                    <span class="gain">+${fmtOku(r.gainOthers)}</span>
                    <span class="self">+${fmtOku(r.gainSelf)}</span>
                    <span class="nm">${styleIcon(r.styleId, 30)}<b>${r.char}</b> <span style="color:var(--fg-dim);font-size:11px;">${r.name !== r.char ? r.name : ""}</span></span>
                    <button class="ghost-btn" title="パーティに追加">▶</button>
                </div>`);
                row.querySelector("button").addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    addToParty(r.styleId, r.plan);
                });
                row.addEventListener("click", () => {
                    const existing = list.querySelector(".sup-detail");
                    const wasOpen = openDetail === r.styleId;
                    if (existing) existing.remove();
                    openDetail = null;
                    if (wasOpen) return;
                    openDetail = r.styleId;
                    row.after(buildSupDetail(r, profile));
                });
                list.appendChild(row);
            });
        if (!state.supRows.length) {
            list.appendChild(el(`<div class="note" style="padding:8px;">アタッカーを編成するとここに表示されます</div>`));
        }
    }
})();
