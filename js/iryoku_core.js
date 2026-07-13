// iryoku_core.js — 技・術威力逆算計算機の中核ロジック（DOM/jQuery非依存の純関数群）
// ブラウザでは <script> 直読み込みでグローバル関数として動く（damage.js より後に読み込み、
// グローバルの damageCore をそのまま呼ぶ）。Node からは module.exports 経由で使う
// （その場合は vm 等で damageCore をこのファイルと同じグローバルスコープに用意すること）。

// 実測ダメージ1件から「あり得る威力整数の集合」を全数探索で求める。
// ctx: { type, str, agi, weapon, rank, vit, master, ability, resist, ex }
// sample: { damage }
function feasibleIryokuSet(sample, ctx) {
    var set = new Set();
    var detail = [];
    var ex = (ctx.ex === undefined) ? 1 : ctx.ex;
    for (var s = 6; s <= 120; s++) {
        for (var n = 1; n <= 10; n++) {
            var r = damageCore(ctx.type, ctx.str, ctx.agi, ctx.weapon, s, ctx.rank,
                ctx.vit, ctx.master, ctx.ability, ctx.resist, n);
            // FEモデル: floor(damageCore.result × ex) との一致
            if (Math.floor(r.result * ex) === sample.damage) {
                set.add(s);
                detail.push({ s: s, n: n, model: "FE" });
            }
            // BEモデル: floor済みresultではなく生のd1*d2*d3を1回だけroundして比較
            if (Math.round(r.d1 * r.d2 * r.d3 * ex) === sample.damage) {
                set.add(s);
                detail.push({ s: s, n: n, model: "BE" });
            }
        }
    }
    return { set: set, detail: detail };
}

// 複数サンプル（多段hitの各hit・複数回試行）の feasibleIryokuSet 結果の集合積を取る。
function intersectFeasible(samples, ctx) {
    var perSample = samples.map(function (sample) { return feasibleIryokuSet(sample, ctx); });
    var set = new Set();
    if (perSample.length > 0) {
        perSample[0].set.forEach(function (v) { set.add(v); });
        for (var i = 1; i < perSample.length; i++) {
            var other = perSample[i].set;
            set.forEach(function (v) { if (!other.has(v)) set.delete(v); });
        }
    }
    return { set: set, perSample: perSample };
}

// 多段hitの命中時バフによる、そのhit時点での増分%を計算する。
// hitIndexは1始まり。1hit目は必ず増分0。
// 各行 { p, maxLimit? } について min(hitIndex - 1, maxLimit ?? Infinity) × p を合算する。
function computeHitAbilityPer(hitIndex, matchedHitRows, matchedSkillBuffRows) {
    var rows = (matchedHitRows || []).concat(matchedSkillBuffRows || []);
    var n = hitIndex - 1;
    var total = 0;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var maxLimit = (row.maxLimit === undefined || row.maxLimit === null) ? Infinity : row.maxLimit;
        total += Math.min(n, maxLimit) * row.p;
    }
    return total;
}

// ─────────────────────────────────────────────────────────────────────────
// resolveT1Ability: 技・スタイルのT1(1ターン目・1hit目相当)における
// ダメージ%アビ合計(abilityPer)とエクストラフォース倍率バケット(exBuckets)を
// BE damageCalc.inc の calcDamage() (1369-1517行) と等価に算出する純関数。
//
// styleT1 : IRYOKU_T1[styleId] = { rows, hitRows, buff, debuff }
//   - rows    : T1開始時点で有効な行(バトル開始時/ターン開始時/常時バフ)。今回の算出対象。
//   - hitRows : 命中時トリガー行(maxLimit付き)。1hit目には未発動なのでT1算出からは除外し、
//               多段hitの増分は computeHitAbilityPer(Task A) 側で扱う。
// skillInfo : SKILL_MASTER[skillId] (AttackAttributes/AttackArea/SkillType/AttackMethod/Name等)
// opts      : { weaponType, isWeak, isOD, isRoundCalcOrTurn1=true, charInfo }
//   - weaponType : STYLE_MASTER[styleId].WeaponType (呼び出し側の責務で渡す)
//   - charInfo   : CHAR_MASTER[STYLE_MASTER[styleId].CharacterId]。EF名前付き条件
//                  (性別/シリーズ/キャラ名/技名) 判定に使う。省略時は名前付き条件は不成立扱い。
//
// 戻り値 { abilityPer, exBuckets:[{b,per}], activeRows, inactiveCandidates }
//   - abilityPer : マッチした通常行(nd:0)の p 合計 (Critical/防御弱化は含めない)
//   - exBuckets  : マッチしたEF行(nd:1)を b でグルーピングし各バケット内 max を取ったもの。
//                  ex倍率は 1 + Σ(バケットper) で再構成する (BE: $extraForce += $ex; $extraForce += 1)。
//   - activeRows : マッチした通常行(nd:0)そのもの (UI表示用)
//   - inactiveCandidates : 未実装 (空配列)
//   - matchedHitRows / matchedSkillBuffRows : Task D2b 追加。命中時トリガー行(styleT1.hitRows)と
//                  技バフ行(opts.skillBuffRows = IRYOKU_SKILLBUFF[skillId]) のうち、通常行と同じ
//                  属性判定(targetAttr)でマッチしたもの。computeHitAbilityPer(Task A) に渡して
//                  多段hitの増分%を出す用途。abilityPer/exBuckets の算出には一切影響しない。

// BE damageCalc.inc:208-213 の $RANGE_LIST を転記
var IRYOKU_RANGE_LIST = {
    "敵単体": ["単体攻撃", "単体"], "ランダム": ["単体攻撃", "単体"],
    "敵横一列": ["全体攻撃または範囲攻撃", "範囲攻撃", "範囲"],
    "敵縦一列": ["全体攻撃または範囲攻撃", "範囲攻撃", "範囲"],
    "敵全体": ["全体攻撃または範囲攻撃", "範囲攻撃", "全体"]
};

// BE damageCalc.inc:83 の $CHANGE_SKILL_NAME (練達前技名→練達後技名リマップ)
var IRYOKU_CHANGE_SKILL_NAME = {
    "二連流し斬り": "流し斬り+"
};

// BE damageCalc.inc:22-81 の $EF_CONDITION_MAP (名前付きEF条件テーブル)
var IRYOKU_EF_CONDITION_MAP = {
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
    "女性": { gender: "女" },
    "性別不明": { gender: "不明" },
    "けんし": { skill: "インフェルノブレイク/ダークマター/せんねつ斬り/いなずま斬り/ふうじん斬り/ばくれん斬り" },
    "GBSaGa": { series: "GB1/GB2/GB3" },
    "RS1": { series: "RS1" },
    "RS2": { series: "RS2" },
    "RS3": { series: "RS3" },
    "SF1": { series: "SF1" },
    "SF2": { series: "SF2" },
    "US": { series: "US" },
    "ES": { series: "ES" },
    "IS": { series: "IS" },
    "SSG": { series: "SSG" },
    "SaGaEB": { series: "SEB" },
    "SaGaRS": { series: "RSR" },
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
    "会心の一撃": { skill: "会心の一撃" }
};

// BE damageCalc.inc:1317-1345 の _isEfNamedConditionMet 移植
function _isEfNamedConditionMet(part, skillInfo, charInfo) {
    var lookupKey = (IRYOKU_EF_CONDITION_MAP[part] !== undefined) ? part : part.split('/')[0];
    var rule = IRYOKU_EF_CONDITION_MAP[lookupKey];
    if (rule === undefined) return false;
    if (Object.keys(rule).length === 0) return true; // {} = 条件なし
    var ci = charInfo || {};
    if (rule.gender !== undefined) return (ci.Gender || '') === rule.gender;
    if (rule.series !== undefined) return rule.series.split('/').indexOf(ci.Series || '') !== -1;
    if (rule.character !== undefined) return (ci.Name || '') === rule.character;
    if (rule.skill !== undefined) {
        if (rule.skill === '???') return false;
        var base = (skillInfo.Name || '').replace(/\+|\[追撃\]/g, '');
        return rule.skill.split('/').indexOf(base) !== -1;
    }
    return false;
}

function resolveT1Ability(styleT1, skillInfo, opts) {
    opts = opts || {};
    var rows = (styleT1 && styleT1.rows) || [];
    var charInfo = opts.charInfo;

    // ── targetAttr 構築 (damageCalc.inc:1378-1428) ──
    var targetAttr = new Set(["全", opts.weaponType]);
    (skillInfo.AttackAttributes || "").split(",").forEach(function (a) { targetAttr.add(a); });
    (IRYOKU_RANGE_LIST[skillInfo.AttackArea] || []).forEach(function (r) { targetAttr.add(r); });
    targetAttr.add(skillInfo.AttackArea);

    // 複合属性バケット ("斬・突"等): rows の b が "・" を含みEF以外のものについて、
    // "・"分割したいずれかが targetAttr にあれば複合キー自体も追加 (damageCalc.inc:1392-1399)
    var compoundKeys = new Set();
    rows.forEach(function (row) {
        if (row.b.indexOf("・") !== -1 && row.b.indexOf("エクストラフォース") === -1) compoundKeys.add(row.b);
    });
    compoundKeys.forEach(function (key) {
        var subs = key.split("・");
        if (subs.some(function (s) { return targetAttr.has(s); })) targetAttr.add(key);
    });

    // 技名 (練達前リマップ→"+"/"[追撃]"除去) (damageCalc.inc:1401-1406)
    var skillName = (IRYOKU_CHANGE_SKILL_NAME[skillInfo.Name] || skillInfo.Name).replace(/\+|\[追撃\]/g, "");
    targetAttr.add(skillName);
    targetAttr.add(skillName + "を発動後");

    if (opts.isOD) { targetAttr.add("OD攻撃"); targetAttr.add("連携攻撃"); }

    targetAttr.add(opts.isRoundCalcOrTurn1 !== false ? "HP満タン時" : "HPが満タンではない時");

    if (opts.isWeak) targetAttr.add("Weak攻撃"); // 鬼八(IDae063)のOD/Weak OR例外は省略

    targetAttr.add(skillInfo.SkillType + "攻撃");   // "技攻撃"/"術攻撃"
    targetAttr.add(skillInfo.AttackMethod + "攻撃"); // "直接攻撃"/"間接攻撃" (AttackMethodは実データで文字列)
    targetAttr.add(skillInfo.AttackMethod);          // "直接"/"間接"
    // Critical・防御弱化は abilityPer に含めない (D1 golden採取時に発生しないサンプルを選定済み)

    // ── 通常行(nd:0)のマッチ・合計 (damageCalc.inc:1444-1451 + _getAbilityValue) ──
    // BEは targetAttr の各キーごとに _getAbilityValue で集計する。通常キーは加算、
    // "モラルアップ"/"エクストラフォース"を含むキーは重複不可(最大値のみ)。
    // → マッチ行を b でグルーピングし、モラルアップは max・それ以外は sum で合算する。
    var activeRows = [];
    var normalGroups = {}; // b -> { rows:[], per(累積) }
    rows.forEach(function (row) {
        if (row.nd === 1) return; // EF行は別処理
        if (!targetAttr.has(row.b)) return;
        activeRows.push(row);
        if (!normalGroups[row.b]) normalGroups[row.b] = { isMax: row.b.indexOf("モラルアップ") !== -1, per: 0 };
        var g = normalGroups[row.b];
        g.per = g.isMax ? Math.max(g.per, row.p) : g.per + row.p;
    });
    var abilityPer = 0;
    Object.keys(normalGroups).forEach(function (b) { abilityPer += normalGroups[b].per; });

    // ── EF行(nd:1)のマッチ・バケット化 (damageCalc.inc:1468-1517) ──
    var efConditions = new Set(targetAttr);
    efConditions.add(skillInfo.SkillType);       // "術"/"技" (サフィックスなし)
    if (opts.isWeak) efConditions.add("Weak");
    if (opts.isOD) { efConditions.add("OD"); efConditions.add("連携"); }
    // Critical関連は省略 (Criticalトグルは対象外)
    if (efConditions.has("全体") || efConditions.has("範囲")) { efConditions.add("全体"); efConditions.add("範囲"); }

    var exBucketMap = {}; // b -> per (max)
    rows.forEach(function (row) {
        if (row.nd !== 1) return;
        var efCond = row.b.replace(/^エクストラフォース/, "");
        if (efCond === "") return;
        var efCondStripped = efCond.split("/")[0]; // "/特大"等のサフィックス除去
        var allMet;
        if (IRYOKU_EF_CONDITION_MAP[efCond] !== undefined || IRYOKU_EF_CONDITION_MAP[efCondStripped] !== undefined) {
            // 名前付き条件 (キャラ/シリーズ/技名限定など)
            allMet = _isEfNamedConditionMet(efCond, skillInfo, charInfo);
        } else if (efConditions.has(efCond)) {
            allMet = true; // 単純条件として全体マッチ
        } else {
            // "・" AND分割: 各パーツが単純条件 or 名前付き条件を満たすか
            allMet = efCond.split("・").every(function (p) {
                return efConditions.has(p) || _isEfNamedConditionMet(p, skillInfo, charInfo);
            });
        }
        if (allMet) {
            var prev = (exBucketMap[row.b] === undefined) ? -Infinity : exBucketMap[row.b];
            exBucketMap[row.b] = Math.max(prev, row.p);
        }
    });
    var exBuckets = Object.keys(exBucketMap).map(function (b) { return { b: b, per: exBucketMap[b] }; });

    // ── hitRows / skillBuffRows マッチング (Task D2b 追加) ──
    // 通常行(nd:0)と同じ属性判定を行う。ただし上で確定した targetAttr は「変更しない」
    // (targetAttr に compound キーを足すと abilityPer が変わり golden が壊れるため)。
    // compound バケット("打・熱・陽"等)は非破壊的にローカル判定する (通常行 compound と同じ規則)。
    function _matchAttrRow(row) {
        if (row.nd === 1) return false; // EF行は対象外
        if (targetAttr.has(row.b)) return true;
        if (row.b.indexOf("・") !== -1 && row.b.indexOf("エクストラフォース") === -1) {
            return row.b.split("・").some(function (sub) { return targetAttr.has(sub); });
        }
        return false;
    }
    var matchedHitRows = ((styleT1 && styleT1.hitRows) || []).filter(_matchAttrRow);
    var matchedSkillBuffRows = (opts.skillBuffRows || []).filter(_matchAttrRow);

    return {
        abilityPer: abilityPer, exBuckets: exBuckets, activeRows: activeRows,
        inactiveCandidates: [], matchedHitRows: matchedHitRows, matchedSkillBuffRows: matchedSkillBuffRows
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { feasibleIryokuSet, intersectFeasible, computeHitAbilityPer, resolveT1Ability };
}
