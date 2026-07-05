let SELECTED_ATTACKER = null;
let SELECTED_SKILL = null;

let LAST_RANKING = null;   // 直近 API レスポンス {baseDamage, ranking:[...]}
let RANK_REQ_SEQ = 0;      // リクエスト世代カウンタ（古いレスポンス破棄用）
let BASE_BD = null;        // 編集中のブレークダウン（API 応答をコピーして保持）

function recalcRanking() {
    if (!SELECTED_ATTACKER || !SELECTED_SKILL) {
        LAST_RANKING = null;
        $("#BASE_DAMAGE_AREA").addClass("d-none");
        $("#RANKING_AREA").html('<div class="text-center" style="padding:20px;">アタッカーと技を選択してください</div>');
        return;
    }
    const enemy = getEnemyConfig();
    const req = {
        attackerStyleId: SELECTED_ATTACKER['Id'],
        skillId: SELECTED_SKILL['Id'],
        enemy: { count: enemy.count, vit: enemy.vit, mnd: enemy.mnd, resist: enemy.resist },
    };
    const seq = ++RANK_REQ_SEQ;
    $("#RANKING_AREA").html('<div class="text-center" style="padding:20px;">計算中...</div>');
    fetchOkimonoRanking(req)
        .then(function (data) {
            if (seq !== RANK_REQ_SEQ) return;   // 古いレスポンスは破棄
            LAST_RANKING = data;
            renderRanking();
        })
        .catch(function () {
            if (seq !== RANK_REQ_SEQ) return;
            LAST_RANKING = null;
            $("#BASE_DAMAGE_AREA").addClass("d-none");
            $("#RANKING_AREA").html('<div class="text-center" style="padding:20px;">ランキングの取得に失敗しました。時間をおいて再度お試しください</div>');
        });
}

// API を叩いて JSON を返す。非200/ネットワーク失敗は reject。
function fetchOkimonoRanking(req) {
    const base = resolveOkimonoApiBase(location.hostname);
    const url = buildOkimonoQuery(base, req);
    return fetch(url).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    });
}

// キャッシュ済みランキングを描画。フィルタ変更時はこれだけ呼ぶ（再 fetch しない）。
// 既存のフィルタ意味論を維持: 所持チェッカー(MY_FLAG)のみリストを絞る。upRate<=0 は非表示。
function renderRanking() {
    $("#RANKING_AREA").html("");
    // 基本値（アタッカー素ダメージ）とその計算内訳を編集可能フォームで表示
    if (LAST_RANKING && LAST_RANKING.baseDamage > 0) {
        // API 応答をディープコピーして保持。statParts に _origEff/_origStatus を退避しておく
        BASE_BD = JSON.parse(JSON.stringify(LAST_RANKING.baseBreakdown || {}));
        BASE_BD._origStatus = BASE_BD.status;
        BASE_BD._origEnemyEff = BASE_BD.enemyStatEff;
        BASE_BD._origDamage = LAST_RANKING.baseDamage;
        $("#BASE_DAMAGE_SUB").addClass('d-none');
        // perHitDamage は 1ヒット分。baseDamage はシナリオ全ヒット合計。
        // hit ratio を保存して、入力変更時の再計算でも合計値を正確に出せるようにする。
        var perHit = Number(BASE_BD.perHitDamage) || 0;
        BASE_BD._hitRatio = (perHit > 0) ? LAST_RANKING.baseDamage / perHit : 1;
        if (Array.isArray(BASE_BD.statParts)) {
            BASE_BD.statParts.forEach(function(sp) { sp._origEff = sp.eff; });
        }
        var bdHtml = (typeof buildBaseBreakdownInputHTML === 'function')
            ? buildBaseBreakdownInputHTML(BASE_BD) : '';
        $("#BASE_BREAKDOWN").html(bdHtml);
        $("#BASE_DAMAGE_VALUE").text(Math.round(LAST_RANKING.baseDamage).toLocaleString());
        // ヒット別ダメージ（多段/追撃の内訳。カンスト確認用）
        renderBaseHits(LAST_RANKING.baseHits);
        $("#BASE_DAMAGE_AREA").removeClass("d-none");
    } else {
        BASE_BD = null;
        $("#BASE_BREAKDOWN").html("");
        $("#BASE_DAMAGE_AREA").addClass("d-none");
    }
    if (!LAST_RANKING || !Array.isArray(LAST_RANKING.ranking)) return;
    // フィルタ通過分を先に集めて最大レートを求める（バー幅の基準）
    const visible = [];
    for (const row of LAST_RANKING.ranking) {
        if (!(row.upRate > 0)) continue;
        const styleId = row.supportStyleId;
        if (MY_FLAG && MY_STYLE.indexOf(styleId) === -1) continue;
        const styleInfo = STYLE_MASTER[styleId];
        if (!styleInfo) continue;
        if (!supportPassesFilters({
            weaponType: styleInfo['WeaponType'],
            breakdown: row.breakdown,
            filterWeapon: FILTER_WEAPON,
            filterAttr: FILTER_ATTR,
            filterRange: FILTER_RANGE,
        })) continue;
        visible.push({ row, styleInfo });
    }
    const maxRate = visible.length ? Math.max(...visible.map(v => v.row.upRate)) : 1;
    RANK_DETAIL_DATA = {};
    visible.forEach(function (v, i) {
        addRankRow(v.styleInfo, v.row, i + 1, maxRate);
    });
}

// ランキング行の詳細展開用データ（styleId → {styleInfo, rate, breakdown, damage}）
let RANK_DETAIL_DATA = {};

// 選択中の技から「このバフが乗るか」判定用の条件セットを作る。
// エンジン(calcDamage)の targetAttr / efConditions と同等の簡易版。
function getSkillApplicability(skillInfo) {
    const set = new Set(['全']);
    if (!skillInfo) return set;
    String(skillInfo['AttackAttributes'] ?? '').split(/[,+]/).filter(Boolean).forEach(a => set.add(a));
    const area = skillInfo['AttackArea'] ?? '';
    if (area === '敵単体' || area === 'ランダム') { set.add('単体'); set.add('単体攻撃'); }
    else if (area === '敵全体') { set.add('全体'); set.add('全体攻撃'); set.add('範囲'); set.add('範囲攻撃'); }
    else if (area === '敵縦一列' || area === '敵横一列') { set.add('範囲'); set.add('範囲攻撃'); set.add('縦攻撃'); set.add('横攻撃'); }
    const st = skillInfo['SkillType'];
    if (st) { set.add(st); set.add(st + '攻撃'); }           // 技/術
    const method = skillInfo['AttackMethod'];
    if (method) { set.add(method); set.add(method + '攻撃'); } // 直接/間接
    // Weak判定: 選択技のいずれかの属性で敵耐性が -35 以下なら Weak系バフが乗る
    document.querySelectorAll('.E_RESIST').forEach(function (inp) {
        const a = inp.getAttribute('data-attr');
        if (set.has(a) && Number(inp.value) <= -35) {
            set.add('Weak');
            set.add('Weak攻撃');
        }
    });
    return set;
}

// 名前付きEF条件（BE の EF_CONDITION_MAP と同期）。
// null = 条件なし（全攻撃に乗る）/ {character} = アタッカーのキャラ名一致 / {gender} / {series} / {skill}
const EF_NAMED_CONDITIONS = {
    '古き神の力': null,
    '神憑りの力': null,
    'けんし': null, // 暫定: 当該アビ持ちは剣士キャラのみ
    '邪神憑りし者': { character: '飯綱こよみ' },
    '破壊女神': { character: 'サイヴァ' },
    '目覚めし者': { character: '飯綱こよみ' },
    '呪われし者': { character: 'ヴィンセント・クインブラ' },
    '魔を祓いし者': { character: 'ダリオ・グラナダ' },
    '黒き象': { character: 'ダイ・ダイ' },
    '術法と科学を極めし者': { character: 'ボルカノ' },
    '竜人束ねし女王': { character: 'サライ・グラキエス' },
    '紡し者': { character: 'シィレイ' },
    '女性': { gender: '女' },
    '性別不明': { gender: '不明' },
    'GBSaGa': { series: 'GB1/GB2/GB3' },
    'RS1': { series: 'RS1' }, 'RS2': { series: 'RS2' }, 'RS3': { series: 'RS3' },
    'SF1': { series: 'SF1' }, 'SF2': { series: 'SF2' },
    'US': { series: 'US' }, 'ES': { series: 'ES' }, 'IS': { series: 'IS' },
    'SSG': { series: 'SSG' }, 'SaGaEB': { series: 'SEB' }, 'SaGaRS': { series: 'RSR' },
};

// 名前付きEF条件の成立判定（BE _isEfNamedConditionMet 相当）
function isEfNamedConditionMet(name) {
    const lookupKey = (name in EF_NAMED_CONDITIONS) ? name : name.split('/')[0];
    if (!(lookupKey in EF_NAMED_CONDITIONS)) return false;
    const rule = EF_NAMED_CONDITIONS[lookupKey];
    if (rule === null) return true; // 条件なし = 全攻撃に乗る
    const charInfo = (typeof CHAR_MASTER !== 'undefined' && SELECTED_ATTACKER)
        ? CHAR_MASTER[SELECTED_ATTACKER['CharacterId']] : null;
    if (rule.character) return (charInfo?.Name ?? '') === rule.character;
    if (rule.gender) return (charInfo?.Gender ?? '') === rule.gender;
    if (rule.series) return rule.series.split('/').includes(charInfo?.Series ?? '');
    if (rule.skill) {
        const base = String(SELECTED_SKILL?.Name ?? '').replace('+', '').replace('[追撃]', '');
        return rule.skill.split('/').includes(base);
    }
    return false;
}

// breakdown の damage キー（'単体攻撃','エクストラフォース単体','斬・打' 等）が
// 選択中の技に適用されるか判定する。Weak/OD は敵設定依存なので false（条件付き扱い）。
// 名前付き条件（古き神の力等）は EF_NAMED_CONDITIONS で判定する。
function isFactorApplicable(key, appSet) {
    const k = key.replace('エクストラフォース', '');
    if (appSet.has(key) || appSet.has(k)) return true;
    // 名前付きEF条件（古き神の力 = 全攻撃、破壊女神 = キャラ一致 等）
    if (key.includes('エクストラフォース') && isEfNamedConditionMet(k)) return true;
    // 「斬・打」「全体・範囲」等の複合キーはいずれか一致でOK（ダメ強化はOR、ExはANDだが表示上は近似）
    const parts = k.split('・');
    if (parts.length > 1 && parts.every(p => appSet.has(p) || appSet.has(p + '攻撃'))) return true;
    if (parts.length > 1 && !key.includes('エクストラフォース')
        && parts.some(p => appSet.has(p) || appSet.has(p + '攻撃'))) return true;
    return false;
}

// breakdown から「何の要因で上位か」の要約HTMLを作る。
// 選択中の技に乗らない項目は薄く表示する。敵付与マーカーは被弾回数分を合算表示。
function factorSummary(breakdown, styleInfo = null) {
    const appSet = getSkillApplicability(SELECTED_SKILL);
    const active = [];
    const inactive = [];
    const push = (applicable, html) => (applicable ? active : inactive).push(html);

    const d = (breakdown && breakdown.damage) ? breakdown.damage : {};
    for (const k in d) {
        const applicable = isFactorApplicable(k, appSet);
        if (k.includes('エクストラフォース')) {
            push(applicable, `${k.replace('エクストラフォース', 'Ex')}×${(1 + d[k]).toFixed(2)}`);
        } else {
            push(applicable, `${k}+${d[k]}%`);
        }
    }
    const buffSrc = (breakdown && breakdown.buff) ? breakdown.buff : {};
    const byParam = {};
    for (const tm in buffSrc) {
        for (const p in buffSrc[tm]) byParam[p] = (byParam[p] ?? 0) + buffSrc[tm][p];
    }
    const buffVals = Object.values(byParam);
    if (buffVals.length) active.push(`ステ+${Math.max(...buffVals)}%`);

    // ステデバフ: 静的分 + 敵付与マーカーの被弾発動分
    const marker = styleInfo ? computeMarkerBonus(styleInfo) : { defDown: 0, stat: {}, procs: 0 };
    const debuffs = (breakdown && breakdown.debuff) ? breakdown.debuff : {};
    const statTotal = {};
    for (const k in debuffs) {
        if (k === '体力' || k === '精神') statTotal[k] = debuffs[k].per;
        else active.push(`敵${k}-${debuffs[k].per}%`);
    }
    for (const [p, v] of Object.entries(marker.stat)) statTotal[p] = (statTotal[p] ?? 0) + v;
    for (const [k, v] of Object.entries(statTotal)) {
        active.push(`敵${k}-${v}%`);
    }
    if (marker.defDown > 0) active.push(`防弱(被弾×${marker.procs})+${marker.defDown}%`);
    // 行動トリガーバフ（アクセルブースト等）
    if (styleInfo) {
        for (const b of computeGrantActionBuffs(styleInfo)) {
            active.push(`${b.sub}+${b.per}%/回(×${b.actions}行動)`);
        }
    }

    let html = active.join(' ／ ');
    if (inactive.length) {
        html += `<span class="rank-factor-na"> ｜ ${inactive.join(' ／ ')}</span>`;
    }
    return html;
}

// バー形式のランキング1行を追加。クリックで詳細（旧カード）を展開する。
function addRankRow(styleInfo, row, rankNo, maxRate) {
    const styleId = styleInfo['Id'];
    RANK_DETAIL_DATA[styleId] = { styleInfo, rate: row.upRate, breakdown: row.breakdown ?? null, damage: row.damage ?? null };

    const incPct = (row.upRate - 1) * 100;
    // バー幅: 増加率ベース（最下位でも少し見えるよう4%下駄）
    const barPct = Math.max(4, (maxRate > 1) ? (row.upRate - 1) / (maxRate - 1) * 100 : 100);
    const factors = factorSummary(row.breakdown, styleInfo);

    const $row = $(`
        <div class="rank-row" data-style-id="${styleId}">
            <div class="rank-no">${rankNo}</div>
            <div class="rank-icon"></div>
            <div class="rank-main">
                <div class="rank-name-line">
                    <span class="rank-name">${styleInfo['Name']} ${styleInfo['AnotherName'] ?? ''}</span>
                    <span class="rank-rate">+${incPct.toFixed(1)}%</span>
                </div>
                <div class="rank-bar-wrap"><div class="rank-bar" style="width:${barPct}%"></div></div>
                <div class="rank-factors">${factors}</div>
            </div>
        </div>`);
    $row.find(".rank-icon").append(getStyleIcon(styleInfo['Rarity'], styleId, styleInfo['WeaponType'], true));
    $("#RANKING_AREA").append($row);
}

// ランキング行クリック → 詳細（旧カードUI）をトグル表示
$(document).on('click', '.rank-row', function () {
    const styleId = $(this).attr('data-style-id');
    const $next = $(this).next('.rank-detail');
    if ($next.length) {
        $next.remove();
        $(this).removeClass('rank-open');
        return;
    }
    $(this).addClass('rank-open');
    const d = RANK_DETAIL_DATA[styleId];
    if (!d) return;
    const $detail = $('<div class="rank-detail"></div>');
    $detail.html(buildRankDetailHTML(d.styleInfo, d.rate, d.breakdown, d.damage));
    $(this).after($detail);
});

// アビ効果の sub 文字列 → 適用判定用の属性キーに変換する。
// 例: 'エクストラフォース(Weak)'→'エクストラフォースWeak', 'Weak攻撃強化'→'Weak攻撃', '斬属性攻撃強化'→'斬'
function subToAttrKey(sub) {
    if (!sub) return '全';
    let m = sub.match(/エクストラフォース\(?([^)）]*)\)?/);
    if (m) return 'エクストラフォース' + m[1];
    m = sub.match(/(?:エリアエンハンス|エレメントエンハンス|デュアルエンハンス)\(([^)]*)\)/);
    if (m) return m[1];
    if (sub.includes('Weak')) return 'Weak攻撃';
    m = sub.match(/^(斬|打|突|熱|冷|雷|陽|陰)(・(斬|打|突|熱|冷|雷|陽|陰))*/);
    if (m && m[0]) return m[0];
    if (sub.includes('単体')) return '単体攻撃';
    if (sub.includes('全体')) return '全体攻撃';
    if (sub.includes('範囲')) return '範囲攻撃';
    return '全'; // 攻撃強化/ヒートアップ/モラルアップ等の無条件系
}

// trigger（when）の表示順
const TRG_ORDER = ['バトル開始時', 'ラウンド開始時', 'ターン開始時', '偶数ターン開始時', '奇数ターン開始時', 'ターン終了時'];

// ステータス名の短縮（腕力→腕 等）
function shortParam(s) {
    return String(s).replace(/腕力/g, '腕').replace(/器用さ/g, '器').replace(/素早さ/g, '速')
        .replace(/知力/g, '知').replace(/体力/g, '体').replace(/精神/g, '精')
        .replace(/魅力/g, '魅').replace(/と/g, '・');
}

// パラメータキー → ICON_LIST 用のフル名
const PARAM_FULL_NAME = { STR: '腕力', DEX: '器用さ', AGI: '素早さ', INT: '知力', VIT: '体力', MND: '精神', AI: '愛', MI: '魅力' };

// ステータスアイコン（バフ=上昇アイコン / デバフ=低下アイコン）。skill.html と同じ ICON_LIST を使用
function statIconHTML(fullName, isBuff) {
    const cls = (typeof ICON_LIST !== 'undefined') ? ICON_LIST[fullName + (isBuff ? '上昇' : '低下')] : null;
    if (cls) return `<span class="icon_xs ${cls}" title="${fullName}${isBuff ? '上昇' : '低下'}">　</span>`;
    return shortParam(fullName) + (isBuff ? '↑' : '↓');
}

// sub（'全ステ' / '腕力と器用さと素早さと知力' / '体力' 等）→ アイコン列HTML
function statIconsFromSub(sub, isBuff) {
    if (sub === '全ステ') {
        const path = (typeof getImgPath === 'function') ? getImgPath(`icon/icon_formation_${isBuff ? 'up' : 'down'}.png`) : '';
        return path ? `全<img class="icon_xs" src="${path}">` : ('全ステ' + (isBuff ? '↑' : '↓'));
    }
    return String(sub).split('と').map(p => statIconHTML(p.trim(), isBuff)).join('');
}

// サポートが敵に付与するマーカー（攻撃を受けた時系）の効果を、
// 選択中シナリオの発動回数（総ヒット数-1、(N回)上限あり）で合算する。デバフの重ねがけ上限はなし。
function computeMarkerBonus(styleInfo) {
    const out = { defDown: 0, stat: {}, procs: 0 };
    const hits = (typeof LAST_RANKING !== 'undefined' && Array.isArray(LAST_RANKING?.baseHits))
        ? LAST_RANKING.baseHits.length : 1;
    const procs = Math.max(0, hits - 1);
    if (!procs) return out;
    out.procs = procs;
    const ABM = (typeof ABILITY_MASTER !== 'undefined') ? ABILITY_MASTER : {};
    for (const lv in (styleInfo['StyleAbilityIds'] || {})) {
        const ab = ABM[styleInfo['StyleAbilityIds'][lv]];
        if (!ab) continue;
        for (const attr of (ab['Attr'] ?? [])) {
            if (attr['main'] !== 'アビリティ付与') continue;
            if (!String(attr['target'] ?? '').includes('敵')) continue;
            const subId = maskId(filterNumber(String(attr['size']).split('>')[0]));
            const mab = ABM[subId];
            if (!mab) continue;
            for (const sa of (mab['Attr'] ?? [])) {
                const w = sa['when'] ?? sa['trigger'] ?? '';
                if (!w.includes('受け')) continue;
                const per = parseInt(String(sa['size'] ?? '').replace(/[^0-9-]/g, ''), 10) || 0;
                const lim = parseInt(String(sa['maxLimit'] ?? '').replace(/[^0-9]/g, ''), 10) || 999;
                const n = Math.min(procs, lim);
                if (per <= 0 || n <= 0) continue;
                if (sa['main'] === '被ダメージ増加') {
                    out.defDown += per * n;
                } else if (sa['main'] === 'デバフ') {
                    const subs = (sa['sub'] === '全ステ') ? ['体力', '精神'] : String(sa['sub'] ?? '').split('と');
                    for (let p of subs) {
                        p = p.trim();
                        if (p === '体力' || p === '精神') out.stat[p] = (out.stat[p] ?? 0) + per * n;
                    }
                }
            }
        }
    }
    return out;
}

// 味方付与アビの行動トリガー（攻撃時/命中時）ダメージ強化を列挙する。
// アクセルブースト等: アタッカーの行動（技・追撃の発動）ごとに発動し1ターン中スタックする。
function computeGrantActionBuffs(styleInfo) {
    const out = [];
    const actions = (typeof LAST_RANKING !== 'undefined' && Array.isArray(LAST_RANKING?.baseHits))
        ? (LAST_RANKING.baseHits.filter(h => h.first).length || 1) : 1;
    const ABM = (typeof ABILITY_MASTER !== 'undefined') ? ABILITY_MASTER : {};
    for (const lv in (styleInfo['StyleAbilityIds'] || {})) {
        const ab = ABM[styleInfo['StyleAbilityIds'][lv]];
        if (!ab) continue;
        for (const attr of (ab['Attr'] ?? [])) {
            if (attr['main'] !== 'アビリティ付与') continue;
            if (!String(attr['target'] ?? '').includes('味方')) continue; // 自身/敵付与は対象外
            const subId = maskId(filterNumber(String(attr['size']).split('>')[0]));
            const gab = ABM[subId];
            if (!gab) continue;
            for (const sa of (gab['Attr'] ?? [])) {
                const w = sa['when'] ?? sa['trigger'] ?? '';
                if (!(w.includes('攻撃') || w.includes('命中')) || w.includes('受け')) continue;
                if (w.includes('開始時') || w.includes('終了時')) continue;
                if (sa['main'] !== 'ダメージ強化') continue;
                const per = parseInt(String(sa['size'] ?? '').replace(/[^0-9-]/g, ''), 10) || 0;
                if (per <= 0) continue;
                let sub = String(sa['sub'] ?? '');
                sub = sub.replace(/((?:斬|打|突|熱|冷|雷|陽|陰)(?:・(?:斬|打|突|熱|冷|雷|陽|陰))*)属性攻撃強化/, '$1');
                out.push({ name: gab['Name'], sub, per, actions });
            }
        }
    }
    return out;
}

// ランキング詳細: trigger ごとにグルーピングした新レイアウトのHTMLを生成する
function buildRankDetailHTML(styleInfo, rate = 0, breakdown = null, damage = null) {
    if (!styleInfo) return '';
    const appSet = getSkillApplicability(SELECTED_SKILL);
    const markerBonus = computeMarkerBonus(styleInfo);
    const actionBuffs = computeGrantActionBuffs(styleInfo);

    // ---- ヘッダ（名前・増加率・実ダメージ）----
    const incPct = (rate - 1) * 100;
    let headHtml = `<div class="dtl-head">
        <span class="dtl-icon"></span>
        <div class="dtl-title">
            <div class="dtl-name">${styleInfo['Name']} <span class="dtl-another">${styleInfo['AnotherName'] ?? ''}</span></div>
            <div class="dtl-rates">
                与ダメ増加率 <span class="fuchidori-blue dtl-rate-big">+${incPct.toFixed(1)}%</span>
                ${damage ? `　実ダメージ <span class="fuchidori-blue">${Math.round(damage).toLocaleString()}</span>` : ''}
            </div>
        </div>
    </div>`;

    // ---- 火力アビ（強化系 + 防御弱化系の合算。適用中は青、対象外は薄表示）----
    const STAT_DEBUFF_KEYS = ['体力', '精神', '腕力', '器用さ', '素早さ', '知力'];
    const abValues = (breakdown && breakdown.damage) ? breakdown.damage : {};
    const debuffs = (breakdown && breakdown.debuff) ? breakdown.debuff : {};

    let sumValue = 0;
    let exSum = 0; // 適用中Exの加算合計（エンジンと同じ: 最終倍率 = 1 + Σex）
    const abItems = [];
    const exItems = [];
    // 強化系（ダメージ強化）とEx（乗算系）を分離
    for (const attr in abValues) {
        const active = attr === '全' || isFactorApplicable(attr, appSet);
        if (attr.includes('エクストラフォース')) {
            if (active) exSum += abValues[attr];
            // タグ側に「Ex」があるので条件名のみ表示（'エクストラフォース単体'→'単体'）
            exItems.push(`<span class="${active ? 'fuchidori-blue' : 'dtl-off'}">${attr.replace('エクストラフォース', '')}×${(1 + abValues[attr]).toFixed(2)}</span>`);
        } else {
            if (active) sumValue += abValues[attr];
            abItems.push(`<span class="${active ? 'fuchidori-blue' : 'dtl-off'}">${attr}+${abValues[attr]}%</span>`);
        }
    }
    // 弱化系（防御弱化。ステ系デバフは除く）
    for (const k in debuffs) {
        if (STAT_DEBUFF_KEYS.includes(k)) continue;
        const active = k === '全' || isFactorApplicable(k, appSet);
        if (active) sumValue += debuffs[k].per;
        const scope = debuffs[k].target === '単体' ? '(単)' : '(全)';
        abItems.push(`<span class="${active ? 'fuchidori-blue' : 'dtl-off'}">防弱${k === '全' ? '' : k}+${debuffs[k].per}%${scope}</span>`);
    }
    // 敵付与マーカーの防御弱化（被弾ごとに発動 × ヒット数-1）
    if (markerBonus.defDown > 0) {
        sumValue += markerBonus.defDown;
        abItems.push(`<span class="fuchidori-blue">防弱(被弾×${markerBonus.procs})+${markerBonus.defDown}%</span>`);
    }

    // ---- ステバフ（アイコン表示。全パラメータ同値ならまとめる）----
    const buffByParam = {};
    const buffSrc = (breakdown && breakdown.buff) ? breakdown.buff : {};
    for (const tm in buffSrc) {
        for (const p in buffSrc[tm]) buffByParam[p] = (buffByParam[p] ?? 0) + buffSrc[tm][p];
    }
    let buffHtml = '';
    const buffVals = Object.values(buffByParam);
    if (buffVals.length) {
        buffHtml = (new Set(buffVals).size === 1)
            ? Object.keys(buffByParam).map(p => statIconHTML(PARAM_FULL_NAME[p] ?? p, true)).join('') + `<span class="fuchidori-white">+${buffVals[0]}%</span>`
            : Object.entries(buffByParam).map(([p, v]) => `${statIconHTML(PARAM_FULL_NAME[p] ?? p, true)}<span class="fuchidori-white">+${v}%</span>`).join(' ');
    }

    // ---- ステデバフ（アイコン表示。体力/精神等のステータスのみ。マーカー被弾発動分込み）----
    const statDebuffTotal = {};
    for (const [k, d] of Object.entries(debuffs)) {
        if (STAT_DEBUFF_KEYS.includes(k)) statDebuffTotal[k] = { per: d.per, target: d.target };
    }
    for (const [p, v] of Object.entries(markerBonus.stat)) {
        if (!statDebuffTotal[p]) statDebuffTotal[p] = { per: 0, target: '' };
        statDebuffTotal[p].per += v;
    }
    const statDebuffHtml = Object.entries(statDebuffTotal)
        .map(([k, d]) => `${statIconHTML(k, false)}<span class="fuchidori-white">-${d.per}%</span>${d.target === '単体' ? '(単)' : ''}`)
        .join(' ');

    const exTotalHtml = exSum > 0
        ? `　Ex<span class="fuchidori-blue dtl-sum-total">×${(1 + exSum).toFixed(2)}</span>`
        : '';
    // 行動トリガーバフ（アクセルブースト等）: 行動ごとに発動し1ターン中スタックする
    let actionHtml = '';
    if (actionBuffs.length) {
        const items = actionBuffs.map(b =>
            `<span class="fuchidori-blue">${b.sub}+${b.per}%/回</span>`
        ).join(' ');
        actionHtml = `<div><span class="dtl-tag">行動時</span>${items} <span class="dtl-off">×${actionBuffs[0].actions}行動で累積</span></div>`;
    }
    let summaryHtml = `<div class="dtl-summary dtl-3col">
        <div class="dtl-col">
            <div class="dtl-col-head">◆火力アビ <span class="fuchidori-blue dtl-sum-total">${sumValue}%</span>${exTotalHtml}</div>
            <div class="dtl-col-body">
                ${abItems.length ? `<div><span class="dtl-tag">アビ</span>${abItems.join(' ')}</div>` : ''}
                ${exItems.length ? `<div><span class="dtl-tag">Ex</span>${exItems.join(' ')}</div>` : ''}
                ${actionHtml}
            </div>
        </div>
        <div class="dtl-col">
            <div class="dtl-col-head">◆ステバフ</div>
            <div class="dtl-col-body">${buffHtml || '<span class="dtl-off">なし</span>'}</div>
        </div>
        <div class="dtl-col">
            <div class="dtl-col-head">◆ステデバフ</div>
            <div class="dtl-col-body">${statDebuffHtml || '<span class="dtl-off">なし</span>'}</div>
        </div>
    </div>`;

    // ---- アビ効果を trigger ごとに収集 ----
    function resolveAbInfo(id) {
        const am = (typeof ABILITY_MASTER !== 'undefined') ? ABILITY_MASTER : null;
        if (am && am[id]) {
            const ab = JSON.parse(JSON.stringify(am[id]));
            for (const attr of ab['Attr'] || []) {
                if (!attr['when'] && attr['trigger']) attr['when'] = attr['trigger'];
            }
            return ab;
        }
        const bam = (typeof BUFF_ABILITY_MASTER !== 'undefined') ? BUFF_ABILITY_MASTER : null;
        return bam && bam[id] ? JSON.parse(JSON.stringify(bam[id])) : undefined;
    }

    const entries = []; // {when, abName, main, sub, size}
    // grantMult: 0 = スタイル自身のアビ / 4 = 自身以外の味方に付与 / 5 = 味方全体に付与
    function collectEntries(abInfo, grantMult) {
        const isGranted = grantMult > 0;
        const categories = filterAbilityCategory(abInfo, isGranted);
        for (const attr of categories) {
            if (attr['main'] === 'アビリティ付与') {
                // 付与先アビを展開（1段のみ）。付与エントリ自体は表示しない
                const addAbId = maskId(filterNumber(String(attr['size']).split('>')[0]));
                const addAbInfo = resolveAbInfo(addAbId);
                if (!addAbInfo || isGranted) continue;
                const grantTgt = String(attr['target'] ?? '');
                if (grantTgt === '自身') continue; // バッファー自身専用（チェインアーツ(零絶)等）
                if (grantTgt.includes('敵')) {
                    // 敵マーカー（ブレイクマーカー等）: 被弾トリガー効果はアタッカーの
                    // ヒットごとに発動する。発動回数 = 総ヒット数 - 1（次のヒットから反映）
                    const hits = (typeof LAST_RANKING !== 'undefined' && Array.isArray(LAST_RANKING?.baseHits))
                        ? LAST_RANKING.baseHits.length : 1;
                    const procs = Math.max(0, hits - 1);
                    for (const sa of (addAbInfo['Attr'] ?? [])) {
                        const w = sa['when'] ?? sa['trigger'] ?? '';
                        if (!w.includes('受け')) continue;
                        if (sa['main'] !== 'デバフ' && sa['main'] !== '被ダメージ増加') continue;
                        const lim = parseInt(String(sa['maxLimit'] ?? '').replace(/[^0-9]/g, ''), 10) || 999;
                        entries.push({
                            when: '攻撃を受けた時（敵に付与）',
                            abName: addAbInfo['Name'],
                            main: sa['main'],
                            sub: sa['sub'] ?? '',
                            size: String(sa['size'] ?? '').replace(sa['sub'] ?? '', '').trim(),
                            mult: Math.min(procs, lim),
                            isMarker: true,
                        });
                    }
                    continue;
                }
                if (grantTgt.includes('味方') || String(attr['sub'] ?? '').includes('味方生存者全体')) {
                    // 「自身以外の〜」は付与者を含まない4人分（自身所持分は別行×1で表示される）
                    const gm = (grantTgt + String(attr['sub'] ?? '')).includes('自身以外') ? 4 : 5;
                    collectEntries(addAbInfo, gm);
                }
                continue;
            }
            const sub = attr['sub'] ?? '';
            const size = String(attr['size'] ?? '').replace(sub, '').replace('秘奥・攻', '').trim();
            const when = (attr['when'] ?? attr['trigger'] ?? '') || 'その他';
            // 味方付与アビの味方/敵対象パッシブ効果は、付与された人数分（味方全体=5 / 自身以外=4）
            // 個別に発動する（BE の partyGrantMult と同じ判定。付与者自身の所持分は別行×1）
            const effTgt = attr['target'] ?? '';
            const isPartyOrEnemyEffect = effTgt !== '' && effTgt !== '自身';
            const isPassive = when.includes('開始時') || when.includes('終了時') || when === '常時';
            const mult = (isGranted && isPartyOrEnemyEffect && isPassive) ? grantMult : 1;
            entries.push({
                when: when,
                abName: abInfo['Name'],
                main: attr['main'],
                sub: sub,
                size: size,
                mult: mult,
            });
        }
    }
    for (const lv in (styleInfo['StyleAbilityIds'] || {})) {
        const abInfo = resolveAbInfo(styleInfo['StyleAbilityIds'][lv]);
        if (abInfo) collectEntries(abInfo, 0);
    }

    // ---- trigger → アビ名 でグルーピングして描画 ----
    function effectLabel(e) {
        // size から数値部分だけを抽出（「超極大+(150%)」→「150%」、「大(0.75倍)」→「×1.75」）
        const size = String(e.size || '');
        let val = '';
        let m = size.match(/([0-9.]+)\s*%/);
        if (m) {
            val = m[1] + '%';
        } else {
            m = size.match(/([0-9.]+)\s*倍/);
            if (m) val = '×' + (1 + parseFloat(m[1])).toFixed(2);
            else val = size; // 数値なし（付与アビ名等）はそのまま
        }
        let name;
        if (e.main === 'バフ') name = statIconsFromSub(e.sub, true);
        else if (e.main === 'デバフ') name = `敵${statIconsFromSub(e.sub, false)}`;
        else {
            name = e.sub || e.main;
            name = name.replace('エクストラフォース', 'Ex');
            // 「斬属性攻撃強化」→「斬」等の短縮（属性のみ残す）
            name = name.replace(/((?:斬|打|突|熱|冷|雷|陽|陰)(?:・(?:斬|打|突|熱|冷|雷|陽|陰))*)属性攻撃強化/, '$1');
            // 「単体攻撃強化」→「単体攻撃」「Weak攻撃強化」→「Weak攻撃」（無印の「攻撃強化」はそのまま）
            name = name.replace(/^(単体|全体|範囲|Weak|直接|間接)攻撃強化$/, '$1攻撃');
        }
        return val && val !== size ? `${name}${val.startsWith('×') ? '' : ' '}${val}` : `${name} ${val}`.trim();
    }
    function effectActive(e) {
        if (e.isMarker) return (e.mult ?? 0) > 0; // 敵マーカーは被弾回数>0なら発動
        if (e.main === 'バフ' || e.main === 'デバフ' || e.main === '被ダメージ増加') return true;
        return isFactorApplicable(subToAttrKey(e.sub), appSet);
    }

    const groups = new Map();
    for (const e of entries) {
        if (!groups.has(e.when)) groups.set(e.when, []);
        groups.get(e.when).push(e);
    }
    const orderedKeys = [...groups.keys()].sort((a, b) => {
        const ia = TRG_ORDER.indexOf(a), ib = TRG_ORDER.indexOf(b);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    let trgHtml = '';
    for (const key of orderedKeys) {
        // アビ名 + 発動数(mult) でグルーピング。同名アビでも自身所持(×1)と付与(×4/×5)は別行にする
        const byAb = new Map();
        for (const e of groups.get(key)) {
            const abKey = e.abName + '|' + (e.mult ?? 1);
            if (!byAb.has(abKey)) byAb.set(abKey, { name: e.abName, list: [] });
            byAb.get(abKey).list.push(e);
        }
        let lines = '';
        for (const [, grp] of byAb) {
            const list = grp.list;
            // 同一効果の重複は xN 表示にまとめる
            const seen = new Map();
            for (const e of list) {
                const k = effectLabel(e);
                if (!seen.has(k)) seen.set(k, { e, n: 0 });
                seen.get(k).n++;
            }
            const items = [...seen.values()].map(({ e, n }) => {
                const cls = effectActive(e) ? 'trg-eff fuchidori-white' : 'trg-eff dtl-off';
                return `<span class="${cls}">${effectLabel(e)}${n > 1 ? ` x${n}` : ''}</span>`;
            }).join('<span class="trg-sep">／</span>');
            // ×N = このアビが味方に付与されN人分存在する（自身の所持分は別行×1）
            const abMult = Math.max(...list.map(e => e.mult ?? 1));
            const multBadge = abMult > 1 ? `<span class="trg-mult" title="味方に付与されるため${abMult}人分発動">×${abMult}</span>` : '';
            lines += `<div class="trg-ab-line"><span class="trg-ab-name">${grp.name}${multBadge}</span>${items}</div>`;
        }
        trgHtml += `<div class="trg-group"><div class="trg-head">${key}</div>${lines}</div>`;
    }

    const html = headHtml + summaryHtml + trgHtml
        + `<div class="dtl-note">薄い表示はこの技には乗らない効果です</div>`;

    // アイコンは jQuery で後付け（getStyleIcon が jQuery オブジェクトを返すため）
    setTimeout(function () {
        const $slot = $('.rank-detail .dtl-icon').last();
        if ($slot.length && !$slot.children().length) {
            $slot.append(getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], styleInfo['WeaponType'], true));
        }
    }, 0);

    return html;
}

function getEnemyConfig() {
    var resist = {};
    $(".E_RESIST").each(function () {
        resist[$(this).attr("data-attr")] = Number($(this).val()) || 0;
    });
    return {
        count: Math.max(1, Number($("#E_COUNT").val()) || 1),
        vit: Number($("#E_VIT").val()) || 1000,
        mnd: Number($("#E_MND").val()) || 1000,
        resist: resist,
    };
}

// 敵設定の変更は即時反映せず、反映ボタンをアクティブにする
$(document).on('input change', '#E_COUNT,#E_VIT,#E_MND,.E_RESIST', function () {
    $('#ENEMY_APPLY').addClass('enemy-apply-active').removeClass('icon_btn_off').addClass('icon_btn_on');
});
$(document).on('click', '#ENEMY_APPLY', function () {
    if (!$(this).hasClass('enemy-apply-active')) return;
    $(this).removeClass('enemy-apply-active icon_btn_on').addClass('icon_btn_off');
    recalcRanking();
});

// ヒット別ダメージ表示（多段ヒット・追撃の内訳。1ヒット上限=99,999,999のカンスト確認用）
function renderBaseHits(hits) {
    const $area = $("#BASE_HITS");
    if (!Array.isArray(hits) || hits.length <= 1) {
        // 単発は基本値と同じなので表示しない
        $area.html('').addClass('d-none');
        return;
    }
    let html = `<div class="bh-head">ヒット別ダメージ（${hits.length}hit）</div>`;
    let cappedCount = 0;
    hits.forEach(function (h, i) {
        const name = (typeof SKILL_MASTER !== 'undefined' && SKILL_MASTER[h.skillId])
            ? SKILL_MASTER[h.skillId]['Name'] : h.skillId;
        const cappedHtml = h.capped ? '<span class="bh-capped">カンスト</span>' : '';
        if (h.capped) cappedCount++;
        html += `<div class="bh-row${h.capped ? ' bh-row-capped' : ''}">
            <span class="bh-no">${i + 1}</span>
            <span class="bh-name">${name}${h.first ? '<span class="bh-first">初</span>' : ''}</span>
            <span class="bh-dmg">${Math.round(h.damage).toLocaleString()}${cappedHtml}</span>
        </div>`;
    });
    if (cappedCount > 0) {
        html += `<div class="bh-warn">⚠ ${cappedCount}ヒットがダメージ上限（1hit=99,999,999×Ex）に到達。バフを盛っても伸びないためランキングが想定と異なる場合があります</div>`;
    }
    $area.html(html).removeClass('d-none');
}

// BASE_BD 変更後の再計算＋表示更新（入力・Exボタン共通）
function refreshBaseDamageView() {
    if (!BASE_BD) return;
    // 武器威力 + 技威力 の合計
    $(".bd-sum").text(Math.round(BASE_BD.weapon) + Math.round(BASE_BD.skill));
    // ステ実効値
    (BASE_BD.statParts || []).forEach(function (sp, idx) {
        $(`.bd-stat-eff[data-idx="${idx}"]`).text(calcStatEff(sp));
    });
    // 敵実効値
    var enemyEff = Math.max(0, (Number(BASE_BD.enemyStatBase) || 0) * (1 - (Number(BASE_BD.enemyDebuffPer) || 0) / 100));
    $(".bd-enemy-eff").text(Math.round(enemyEff));
    // 基本値 + 調整前の値・変化量
    if (typeof calcBaseDamageFromBreakdown === 'function') {
        var newDmg = calcBaseDamageFromBreakdown(BASE_BD);
        $("#BASE_DAMAGE_VALUE").text(Math.round(newDmg).toLocaleString());
        var orig = Number(BASE_BD._origDamage) || 0;
        if (orig > 0 && Math.round(newDmg) !== Math.round(orig)) {
            var diff = newDmg - orig;
            var diffPct = (diff / orig) * 100;
            var sign = diff > 0 ? '+' : '';
            $("#BASE_DAMAGE_ORG").text(`調整前: ${Math.round(orig).toLocaleString()}`);
            $("#BASE_DAMAGE_DIFF")
                .text(`${sign}${Math.round(diff).toLocaleString()} (${sign}${diffPct.toFixed(1)}%)`)
                .toggleClass('bd-diff-up', diff > 0)
                .toggleClass('bd-diff-down', diff < 0);
            $("#BASE_DAMAGE_SUB").removeClass('d-none');
        } else {
            $("#BASE_DAMAGE_SUB").addClass('d-none');
        }
    }
}

function recalcStatusIntoBD() {
    var weaponTypeName = (typeof resolveWeaponTypeName === 'function')
        ? resolveWeaponTypeName(SELECTED_ATTACKER && SELECTED_ATTACKER['WeaponType'])
        : null;
    BASE_BD.status = (typeof calcStatusAfterBuffChange === 'function')
        ? calcStatusAfterBuffChange(BASE_BD, weaponTypeName)
        : BASE_BD.status;
}

// ブレークダウン入力変更 → BASE_BD を更新して基本値を即時再計算
$(document).on('input', '.bd-input', function () {
    if (!BASE_BD) return;
    var key = $(this).attr('data-bd');
    var val = parseFloat($(this).val()) || 0;

    if (key === 'weapon') { BASE_BD.weapon = val; }
    else if (key === 'skill') { BASE_BD.skill = val; }
    else if (key === 'ability') { BASE_BD.ability = val; }
    else if (key === 'ex') { BASE_BD.ex = val; }
    else if (key === 'enemyDebuffPer') {
        BASE_BD.enemyDebuffPer = val;
        recalcStatusIntoBD();
    }
    else {
        var idx = Number($(this).attr('data-idx'));
        var sp = BASE_BD.statParts && BASE_BD.statParts[idx];
        if (sp) {
            if (key === 'statCharBase') { sp.charBase = val; }
            else if (key === 'statStyleCorr') {
                // 補正入力 = styleBonus + correction。correction は据え置き、styleBonus を逆算
                sp.styleBonus = val - (Number(sp.correction) || 0);
            }
            else if (key === 'statBase') { sp.base = val; }
            else if (key === 'statBuff') { sp.buffPer = val; }
            recalcStatusIntoBD();
        }
    }
    refreshBaseDamageView();
});

// Ex ティア加算ボタン
$(document).on('click', '.bd-ex-add', function () {
    if (!BASE_BD) return;
    var add = parseFloat($(this).attr('data-ex-add')) || 0;
    BASE_BD.ex = Math.round(((Number(BASE_BD.ex) || 1) + add) * 100) / 100;
    $('.bd-input[data-bd="ex"]').val(BASE_BD.ex.toFixed(2));
    refreshBaseDamageView();
});


const ICON_LIST_SM = {
    "剣": "icon_ken_sm", "大剣": "icon_dken_sm", "斧": "icon_ono_sm",
    "小剣": "icon_sken_sm", "槍": "icon_yari_sm", "弓": "icon_yumi_sm",
    "棍棒": "icon_kon_sm", "体術": "icon_tai_sm", "銃": "icon_ju_sm", "杖": "icon_tsue_sm",
    "斬": "icon_zan", "突": "icon_totsu", "打": "icon_da",
    "熱": "icon_netsu", "冷": "icon_rei", "雷": "icon_rai",
    "陰": "icon_in", "陽": "icon_yo",
};
let MY_FLAG = false;
let MY_STYLE = [];
function _initial() {
    intialMyStyle();
}
function _noLoginInitial() {
}

function intialMyStyle(){
    readStyleCheckData(UID, function (result) {
        if (result !== null) {
            sslist = (result['SS'] !== undefined) ? result['SS'] : [];
            slist = (result['S'] !== undefined) ? result['S'] : [];
            alist = (result['A'] !== undefined) ? result['A'] : [];
            MY_STYLE = sslist.concat(slist).concat(alist);
        }
    }, false);    
}


$(document).ready(function () {
    // スタイル/技未選択時はランキングを表示しない
    recalcRanking();
});



function filterAbilityCategory(abInfo, isPartyAbility = false){
    // target が「味方」系かどうか
    const isAllyTarget = (t) => t && (
        t.includes("味方") || t === "対象" || t.includes("自身以外")
    );
    // target が「敵」系かどうか
    const isEnemyTarget = (t) => t && (
        t.includes("敵") || t.includes("デバフ") || t === "対象"
    );
    // target が自身のみかどうか
    const isSelfOnly = (t) => t === "自身";

    let filterAttr = [];
    for(const attr of abInfo['Attr'] || []) {
        const m = attr['main'];
        const t = attr['target'] || '';
        if(attr['sub'] && attr['sub'].includes("耐性")){
            continue;
        }
        // アビリティ付与は常に拾う（付与先で再評価）
        if(m === "アビリティ付与"){
            filterAttr.push(attr);
            continue;
        }
        // ダメージ強化: 敵向け（防御弱化）・味方向けを採用。
        // 直接アビの「自身」向け（女王たる所以のEx(冷)等）はバッファー自身にしか乗らないので除外。
        // 味方全体グラント経由（単体激化Ⅳ等）の自身向けはアタッカーも受け取るため isPartyAbility 時のみ採用。
        if(m === "ダメージ強化"){
            if(isSelfOnly(t) && !isPartyAbility) { continue; }
            filterAttr.push(attr);
            continue;
        }
        // デバフ・被ダメージ増加: 敵向けのみ
        if(m === "デバフ" || m === "被ダメージ増加"){
            if(isEnemyTarget(t)) { filterAttr.push(attr); continue; }
            continue;
        }
        // バフ: 味方全体/自身以外向け → 採用。自身向けは isPartyAbility 時のみ
        if(m === "バフ"){
            if(!isSelfOnly(t) && isAllyTarget(t)) { filterAttr.push(attr); continue; }
            if(isSelfOnly(t) && isPartyAbility) { filterAttr.push(attr); continue; }
            continue;
        }
        // エクストラフォース系(ダメージ強化のサブカテゴリとして sub に含まれる場合)はダメージ強化で拾う
        // 追加: ダメージ弱化（味方向けダメージ軽減）は除外のまま
    }
    return filterAttr;
}


let FILTER_WEAPON = "";
$(".filterWeapon").click(function(){
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
        FILTER_WEAPON = "";
    } else {
        // ON
        $(".filterWeapon").each(function (){
            $(this).removeClass("filterActive");
        });
        $(this).addClass("filterActive");
        FILTER_WEAPON = $(this).attr("data-weapon");
    }
    filter();
});

let FILTER_ATTR = [];
$(".filterAttr").click(function(){
    FILTER_ATTR = [];
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
    } else {
        // ON
        if($(".filterAttr.filterActive").length >= 2){
            return;
        }
        $(this).addClass("filterActive")
    }
    $(".filterAttr.filterActive").each(function(){
        FILTER_ATTR.push($(this).attr("data-attr"));
    });
    filter();
});

let FILTER_RANGE = [];
$(".filterRange").click(function(){
    FILTER_RANGE = [];
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
    } else {
        // ON
        if($(".filterRange.filterActive").length >= 2){
            //return;
        }
        $(this).addClass("filterActive")
    }
    $(".filterRange.filterActive").each(function(){
        FILTER_RANGE.push($(this).attr("data-href"));
    });
    filter();
});
$(".styleChecker").click(function(){
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
        $(this).find(".fButton").html("ON");
        MY_FLAG = false;
    } else {
        // ON
        $(this).addClass("filterActive")
        $(this).find(".fButton").html("OFF");
        MY_FLAG = true;
    }
    filter();
});


let FILTER = [];
function filter() { renderRanking(); }

