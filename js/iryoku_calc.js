// iryoku_calc.js — 技・術威力逆算計算機の画面制御（jQuery / 手動入力ツール版）
// 計算の中核は iryoku_core.js（feasibleIryokuSet / intersectFeasible / computeHitAbilityPer）に委譲する。
// damage_calc.js は読み込まない（グローバル状態衝突を避けるため）ので、必要なパターンだけ本ファイルへ転記している。

//////////////////////////////////////////////////
// マスターデータ由来の定数・ルックアップ
//////////////////////////////////////////////////
var SKILL_LIST = {
    "剣": [], "大剣": [], "斧": [],
    "小剣": [], "槍": [], "弓": [],
    "棍棒": [], "体術": [], "銃": [],
    "火術": [], "水術": [], "風術": [],
    "土術": [], "光術": [], "闇術": [], "杖": []
};
var SKILL_MAP = {
    'ken': '剣', 'dken': '大剣', 'ono': '斧', 'sken': '小剣', 'yari': '槍',
    'yumi': '弓', 'kon': '棍棒', 'tai': '体術', 'ju': '銃',
    'hi': '火術', 'mizu': '水術', 'kaze': '風術', 'tsuchi': '土術',
    'hikari': '光術', 'yami': '闇術'
};
var DEX_LIST = ["小剣", "弓", "銃"];
var IRYOKU_LABEL = {
    "E": "6〜9", "D": "10〜14", "C": "15〜20",
    "B": "21〜27", "A": "28〜35", "S": "36〜44",
    "SS": "45〜57", "SSS": "58〜73", "SSSS": "74〜99"
};
// EF 種別（バケット）の基本キー。属性8種＋現在の武器種は動的に足す。
var EF_BASE_BUCKETS = ["全", "Weak攻撃", "OD攻撃", "HP満タン時", "技・術攻撃", "直接攻撃", "間接攻撃", "Critical"];
var EF_ATTR_BUCKETS = ["斬", "打", "突", "熱", "冷", "雷", "陰", "陽"];

// 逆算の対象となっている技（メイン技 or AddSkill追撃サブ技）
var CURRENT_SKILL = null;

// 選択中スタイルのT1データ・状態（Task D2b: 自動充填で使用）
var CURRENT_STYLE_ID = null;
var CURRENT_STYLE_T1 = null; // IRYOKU_T1[styleId] || {rows,hitRows,buff,debuff}
var CURRENT_CHAR_INFO = null;
// Task L(buffBase): スタイル選択時のキャラ基礎ステ（= charMAX + LIMIT_BASE。スタイル%ボーナス適用前）。
// effectiveStat のエンジン厳密式 styleMax + floor(buffBase × per/100) の buffBase に使う。
// 表示ステを手入力で上書きされても buffBase は別途この値を保持する。
var CURRENT_CHAR_BASE = null; // { STR, DEX, AGI, INT } or null

// 選択中の敵データ行（vit/mndを個別に保持）。#vitは表示専用の単一値のため、混在技/術チェーンで
// 術ヒットに正しい敵MND値を使うにはこれが必要（プルダウン選択時のみ設定。手動VIT入力時はnull＝
// 従来通りVIT値をMND代わりに流用するフォールバック）。
var CURRENT_ENEMY_ROW = null;

// アビ%キャップ（出典: BE damageCalc.inc $MAX_FIRE_DAMAGE）
var IRYOKU_MAX_FIRE_DAMAGE = 10000;

// 自動EFバケット名(row.b="エクストラフォース斬"等)を手動EFバケット名空間へ正規化する。
// 手動UIの EF_*_BUCKETS は表示名("Weak攻撃"/"OD攻撃"/"直接攻撃"/"間接攻撃")を使うが、
// 実データのEF条件は接頭辞を剥がすと "Weak"/"OD"/"直接"/"間接" となり文字列が異なる。
// これを吸収して同一バケットとして max 合成できるようにする（未吸収だと二重計上になる）。
var EF_AUTO_TO_MANUAL = { "Weak": "Weak攻撃", "OD": "OD攻撃", "直接": "直接攻撃", "間接": "間接攻撃" };
function normalizeEfBucket(rawB) {
    var stripped = String(rawB).replace(/^エクストラフォース/, "");
    return EF_AUTO_TO_MANUAL[stripped] || stripped;
}

//////////////////////////////////////////////////
// 汎用ヘルパ
//////////////////////////////////////////////////
function weaponNameOf(typeKey) {
    return SKILL_MAP[typeKey] || "剣";
}
function numVal(sel) {
    var v = Number($(sel).val());
    return isNaN(v) ? 0 : v;
}
// 現在の武器種（スタイル選択時はマスターの WeaponType 優先、未選択時は武器種セレクトから）
function styleWeaponType() {
    if (CURRENT_STYLE_ID && typeof STYLE_MASTER !== 'undefined' && STYLE_MASTER[CURRENT_STYLE_ID]) {
        return STYLE_MASTER[CURRENT_STYLE_ID]['WeaponType'];
    }
    return weaponNameOf($("#type").val());
}
// 通常攻撃の実在 SKILL_MASTER エントリを武器種で検索する。
// マスターには全10武器種分「通常攻撃(◯◯)[追撃]」名の完全エントリ（属性/攻撃方法/攻撃範囲/威力7）が
// 1件ずつ存在する。同名の別エントリは無いため最初の一致を返せばよい。
function findNormalAttackSkill(battleType) {
    for (var sid in SKILL_MASTER) {
        var s = SKILL_MASTER[sid];
        if (s && s['BattleType'] === battleType && String(s['Name'] || '').indexOf('通常攻撃(') === 0) {
            return s;
        }
    }
    return null; // 見つからない場合のみ呼び出し側のフォールバックを使う
}

// 現在の技の SKILLBUFF 行（技バフ：命中時トリガー含む）
function currentSkillBuffRows() {
    if (CURRENT_SKILL && CURRENT_SKILL['Id'] && typeof IRYOKU_SKILLBUFF !== 'undefined' && IRYOKU_SKILLBUFF[CURRENT_SKILL['Id']]) {
        return IRYOKU_SKILLBUFF[CURRENT_SKILL['Id']];
    }
    return [];
}
// 現在の技の SKILLMARKER 行（>Mod アビ付与由来の毎hitマーカー。Task F）
function currentSkillMarkers() {
    if (CURRENT_SKILL && CURRENT_SKILL['Id'] && typeof IRYOKU_SKILLMARKER !== 'undefined' && IRYOKU_SKILLMARKER[CURRENT_SKILL['Id']]) {
        return IRYOKU_SKILLMARKER[CURRENT_SKILL['Id']];
    }
    return [];
}
// 現在の技の SKILLSTATBUFF 行（技Mステバフ。Task C）
function currentSkillStatBuffRows() {
    if (CURRENT_SKILL && CURRENT_SKILL['Id'] && typeof IRYOKU_SKILLSTATBUFF !== 'undefined' && IRYOKU_SKILLSTATBUFF[CURRENT_SKILL['Id']]) {
        return IRYOKU_SKILLSTATBUFF[CURRENT_SKILL['Id']];
    }
    return [];
}
// C/D/G のバリアビリティ（Task L で UI 配線）。K段階では既定固定。
//   statIncludesBuff : 表示ステがバフ込み入力なら true（乗算しない）。既定 false=乗算する。
//   isCrit           : crit確定時 true（+20%＋Critical EF）。既定 false。
var IRYOKU_TOOL_OPTS = { statIncludesBuff: false, isCrit: false };
// crit確定時の会心アビ%基礎加算（iryoku_core.js resolveT1Ability の +20 と一致させること）。
var IRYOKU_CRIT_ABILITY_BONUS = 20;
// 攻撃に使うステのキー（"STR"/"DEX"/"INT"）を技/武器種から決める。
// ★既存 attackStat() のステ選択と厳密に一致させること（buff% を実際に使うステに乗せるため）。
function attackStatKey(skill) {
    if (skill && (skill['SkillType'] === "術" || skill['SpecialType'] === "知力")) return "INT";
    var bt = skill ? skill['BattleType'] : weaponNameOf($("#type").val());
    if (DEX_LIST.indexOf(bt) > -1) return "DEX";
    return "STR";
}

//////////////////////////////////////////////////
// 初期化
//////////////////////////////////////////////////
$(function () {
    // --- 敵セレクト ---
    for (var idx in ENEMY_DATA) {
        var row = ENEMY_DATA[idx];
        var disp = row['quest'] + " " + row['name'] + " 体:" + row['vit'] + " 精:" + row['mnd'];
        $('#enemy_vit').append($('<option>', { value: idx, text: disp }));
    }

    // --- SKILL_LIST 構築（damage_calc.js のパターンを転記） ---
    for (var sid in SKILL_MASTER) {
        var s = SKILL_MASTER[sid];
        if (s['Type'] != "攻撃") continue;
        var bt = s['BattleType'];
        if (typeof SKILL_LIST[bt] == "undefined") continue;
        if (typeof SKILL_LIST[bt]['ALL'] == "undefined") SKILL_LIST[bt]['ALL'] = [];
        if (typeof SKILL_LIST[bt][s['PowerGrade']] == "undefined") SKILL_LIST[bt][s['PowerGrade']] = [];
        SKILL_LIST[bt]['ALL'].push(s);
        SKILL_LIST[bt][s['PowerGrade']].push(s);
    }
    var base = { "Id": "", "ConsumeBp": 0, "Name": "", "PowerGrade": "E", "SkillIryoku": 7, "SkillType": "技" };
    for (var battleType in SKILL_LIST) {
        for (var grade in IRYOKU_LABEL) {
            var label = Object.assign({}, base);
            label['Id'] = "LABEL" + battleType + grade;
            var count = (typeof SKILL_LIST[battleType][grade] != "undefined") ? SKILL_LIST[battleType][grade].length : 0;
            label['Name'] = "==== 威力:" + grade + " " + IRYOKU_LABEL[grade] + " " + count + "種 ====";
            label['PowerGrade'] = grade;
            label['SkillIryoku'] = IRYOKU_LABEL[grade].split("〜")[1];
            label['ConsumeBp'] = 100;
            if (typeof SKILL_LIST[battleType]['ALL'] != "undefined") SKILL_LIST[battleType]['ALL'].push(label);
            if (typeof SKILL_LIST[battleType][grade] != "undefined") SKILL_LIST[battleType][grade].push(label);
        }
    }
    for (var battleType2 in SKILL_LIST) {
        for (var grade2 in SKILL_LIST[battleType2]) {
            SKILL_LIST[battleType2][grade2].sort(function (a, b) {
                if (Number(a.SkillIryoku) > Number(b.SkillIryoku)) return -1;
                if (Number(a.SkillIryoku) < Number(b.SkillIryoku)) return 1;
                return (a.ConsumeBp < b.ConsumeBp) ? 1 : -1;
            });
        }
        if (typeof SKILL_LIST[battleType2]['ALL'] != "undefined") {
            // 通常攻撃は SKILL_MASTER に全10武器種分の実在エントリ（AttackAttributes/AttackMethod/
            // AttackArea を持つ完全なデータ, SkillIryoku=7 は公開値）がある。合成オブジェクトを作らず
            // それを検索して先頭に置く。属性依存の T1 行マッチ（複合属性バケット等）が正しく効くようになる。
            var normalSkill = findNormalAttackSkill(battleType2);
            if (normalSkill) {
                SKILL_LIST[battleType2]['ALL'].unshift(normalSkill);
            } else {
                // フォールバック（現状データでは全10武器種に実エントリがあるため通常到達しない。
                // 将来データが変わった場合の後方互換用。この "NORMAL_" 疑似IDは skillObjById() で
                // SkillIryoku:null に解決されるため、既知威力照合は null 判定で自動的に除外される）
                SKILL_LIST[battleType2]['ALL'].unshift({ "Id": "NORMAL_" + battleType2, "ConsumeBp": 0, "Name": "通常攻撃(" + battleType2 + ")", "PowerGrade": "E", "SkillIryoku": 7, "SkillType": "技", "BattleType": battleType2 });
            }
        }
    }

    // --- 技セレクト初期表示（剣） ---
    renderSkillOptions("剣", "ALL");
    onSkillChange();

    // --- EF 種別セレクト ---
    rebuildEfBucketSelect();

    // --- Mレベル・冒険Rank 初期値 ---
    if (typeof BOUKEN_RANK_PER !== 'undefined') $("#adventDamage").val(BOUKEN_RANK_PER);
    setMasterRate();

    // --- 実測行を1行だけ用意 ---
    addSampleRow();
});

//////////////////////////////////////////////////
// (1) キャラ検索 → スタイル選択
//////////////////////////////////////////////////
$(document).on('input', '#charSearch', function () {
    var q = $(this).val().trim();
    $("#HOLDERS_AREA").html("");
    if (q.length < 1) return;
    var styleIds = [];
    for (var cid in CHAR_MASTER) {
        var c = CHAR_MASTER[cid];
        if (!c['Name'] || c['Name'].indexOf(q) === -1) continue;
        if (!c['Holders']) continue;
        for (var i = 0; i < c['Holders'].length; i++) styleIds.push(c['Holders'][i]);
    }
    // 重複除去
    styleIds = styleIds.filter(function (x, i, self) { return self.indexOf(x) === i; });
    for (var j = 0; j < styleIds.length; j++) {
        var styleInfo = STYLE_MASTER[styleIds[j]];
        if (!styleInfo) continue;
        $("#HOLDERS_AREA").append(getStyleIcon(styleInfo['Rarity'], styleIds[j], "", true));
    }
});

$(document).on('click', '#HOLDERS_AREA .style', function () {
    var styleId = $(this).attr("data-id");
    var styleInfo = STYLE_MASTER[styleId];
    if (!styleInfo) return;
    var charInfo = CHAR_MASTER[styleInfo['CharacterId']];

    // Task D2b: スタイル状態を保持（自動充填で使用）
    CURRENT_STYLE_ID = styleId;
    CURRENT_STYLE_T1 = (typeof IRYOKU_T1 !== 'undefined' && IRYOKU_T1[styleId]) || { rows: [], hitRows: [], buff: {}, debuff: {} };
    CURRENT_CHAR_INFO = charInfo;

    // 表示ステの自動入力（damage_calc.js の HOLDERS クリック処理を転記）
    var styleBonus = culcStyleAddintional(styleInfo);
    var map = { "STR": "腕力", "DEX": "器用さ", "AGI": "素早さ", "INT": "知力" };
    CURRENT_CHAR_BASE = {}; // Task L(buffBase): 基礎ステ（バフ計算の基準値）を保持
    for (var key in map) {
        var paramName = map[key];
        var charBase = Number(charInfo["MAX" + key]) + (typeof LIMIT_BASE !== 'undefined' ? LIMIT_BASE : 0);
        CURRENT_CHAR_BASE[key] = charBase;
        var per = styleBonus[paramName][50]["Per"];
        var bonus = styleBonus[paramName][50]["Bonus"];
        $("#style" + key).val(addBonus(charBase, per, bonus));
    }

    // 武器種を反映（術は SkillType で判定するため杖系は既定のまま）
    var wt = styleInfo['WeaponType'];
    for (var tk in SKILL_MAP) {
        if (SKILL_MAP[tk] === wt) {
            $("#type").val(tk);
            renderSkillOptions(wt, "ALL");
            $("#skill_grade").val("ALL");
            onSkillChange();
            break;
        }
    }
    rebuildEfBucketSelect();

    $("#SELECTED_STYLE").html("選択中: <b>" + (styleInfo['Name'] || "") + "</b>（" + (charInfo ? charInfo['Name'] : "") + " / " + wt + "）");

    renderAutoFillRows();
    refreshHitabPrefills();
});

//////////////////////////////////////////////////
// (3) Mレベル
//////////////////////////////////////////////////
function setMasterRate() {
    var mlv = $("#Mlv").val();
    $("#masterDamage").val(Math.round(masterLevel(mlv) * 100 * 100) / 100);
    $("#masterODDamage").val(Math.round(overdrive(mlv) * 100 * 100) / 100);
}
$(document).on('change', '#Mlv', setMasterRate);

//////////////////////////////////////////////////
// (4) 聖石 / EF 動的行
//////////////////////////////////////////////////
$(document).on('click', '#ADD_HOLY', function () {
    if ($("#HOLY_AREA .HOLY_ROW").length >= 20) return;
    var v = $("#holyInput").val();
    var $row = $("#HOLY_ROW_TMPL").clone().removeAttr("id").removeClass("d-none");
    $row.find(".holy-per").val(v === "" ? 0 : v);
    $("#HOLY_AREA").append($row);
    $("#holyInput").val("");
});

function rebuildEfBucketSelect() {
    var $sel = $("#efBucket");
    var cur = $sel.val();
    $sel.html("");
    var buckets = EF_BASE_BUCKETS.concat(EF_ATTR_BUCKETS);
    var wt = weaponNameOf($("#type").val());
    if (buckets.indexOf(wt) === -1) buckets.push(wt);
    for (var i = 0; i < buckets.length; i++) {
        $sel.append($('<option>', { value: buckets[i], text: buckets[i] }));
    }
    if (cur && buckets.indexOf(cur) > -1) $sel.val(cur);
}
$(document).on('change', '#type', function () {
    renderSkillOptions(weaponNameOf($("#type").val()), "ALL");
    $("#skill_grade").val("ALL");
    onSkillChange();
    rebuildEfBucketSelect();
});

$(document).on('click', '#ADD_EF', function () {
    var bucket = $("#efBucket").val();
    var v = $("#efInput").val();
    var $row = $("#EF_ROW_TMPL").clone().removeAttr("id").removeClass("d-none");
    $row.attr("data-bucket", bucket);
    $row.find(".ef-bucket-label").text(bucket);
    $row.find(".ef-per").val(v === "" ? 0 : v);
    $("#EF_AREA").append($row);
    $("#efInput").val("");
});

// 汎用: 動的行の削除
$(document).on('click', '.DEL_ROW', function () {
    $(this).closest(".HOLY_ROW, .EF_ROW, .SAMPLE_ROW").remove();
});

//////////////////////////////////////////////////
// (5) 敵情報
//////////////////////////////////////////////////
var TAISEI_KEYS = { "zan": "斬", "da": "打", "totsu": "突", "netsu": "熱", "rei": "冷", "rai": "雷", "you": "陽", "in": "陰" };
$(document).on('change', '#enemy_vit', function () {
    var idx = $("#enemy_vit").val();
    if (idx === "x") return;
    var row = ENEMY_DATA[idx];
    CURRENT_ENEMY_ROW = row; // vit/mndを個別保持（混在技/術チェーンの敵MND用）
    var type = $("#type").val();
    if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
        $("#vit").val(row['mnd']);
    } else {
        $("#vit").val(row['vit']);
    }
    for (var z in TAISEI_KEYS) {
        var val = row[z];
        var $cell = $("#taisei_" + z);
        $cell.text(val);
        $cell.toggleClass("weak", Number(val) <= -35);
    }
});
// 属性欄クリックで耐性値を反映
$(document).on('click', '.taisei-cell', function () {
    var v = $(this).text().trim();
    if (v !== "" && v !== "999") $("#resist").val(v);
});

//////////////////////////////////////////////////
// (6) 技選択
//////////////////////////////////////////////////
function renderSkillOptions(battleType, grade) {
    $("#skill").html("");
    var list = (SKILL_LIST[battleType] && SKILL_LIST[battleType][grade]) ? SKILL_LIST[battleType][grade] : [];
    for (var i = 0; i < list.length; i++) {
        var r = list[i];
        var isLabel = (r['ConsumeBp'] == 100);
        var label;
        if (isLabel) {
            label = r['Name'];
        } else if (String(r['Id']).indexOf("NORMAL_") === 0) {
            label = r['Name'];
        } else {
            var attr = (r['AttackAttributes'] != undefined) ? "[" + String(r['AttackAttributes']).replace(",", "") + "] " : "";
            label = "威力:" + r['SkillIryoku'] + " " + r['Name'] + " " + attr + "BP:" + r['ConsumeBp'];
        }
        $("#skill").append($('<option>', { value: r['Id'], text: label, disabled: isLabel }));
    }
}

$(document).on('change', '#skill_grade', function () {
    renderSkillOptions(weaponNameOf($("#type").val()), $("#skill_grade").val());
    onSkillChange();
});
$(document).on('change', '#skill', onSkillChange);

function skillObjById(id) {
    if (String(id).indexOf("NORMAL_") === 0) {
        var bt = id.replace("NORMAL_", "");
        return { "Id": id, "Name": "通常攻撃", "SkillType": "技", "BattleType": bt, "PowerGrade": null, "SkillIryoku": null };
    }
    return SKILL_MASTER[id];
}

function onSkillChange() {
    var id = $("#skill").val();
    var info = skillObjById(id);
    if (!info) return;
    CURRENT_SKILL = info;
    CURRENT_CHAIN_MAIN_ID = id; // GAP H Task S: メイン技IDをチェーンlookupキーとして保持
    renderSkillInfo(info);
    renderAddSkills(info);
    renderChainPicker(); // GAP H Task S
    renderAutoFillRows();
    refreshHitabPrefills();
}

function renderSkillInfo(info) {
    var grade = info['PowerGrade'];
    var range = (grade && IRYOKU_LABEL[grade]) ? IRYOKU_LABEL[grade] : "―";
    var iryoku = (info['SkillIryoku'] !== null && info['SkillIryoku'] !== undefined) ? info['SkillIryoku'] : "未判明";
    var attr = info['AttackAttributes'] ? String(info['AttackAttributes']) : "―";
    var html = "対象技: <b>" + info['Name'] + "</b>（" + (info['SkillType'] || "技") + " / " + (info['BattleType'] || "") + "）<br>"
        + "威力ﾗﾝｸ: <b>" + (grade || "―") + "</b>（" + range + "）　既知威力: <b>" + iryoku + "</b>　属性: " + attr;
    $("#SKILL_INFO").html(html);
}

// AddSkill（追撃サブ技）の列挙。SKILL_MASTER[x].AddSkill は追撃技IDの配列。
function renderAddSkills(info) {
    $("#ADDSKILL_AREA").html("");
    var adds = info['AddSkill'];
    if (!adds || !adds.length) return;
    var $wrap = $('<div class="iryoku-panel small"></div>').text("追撃・派生技（クリックで逆算対象を切替）:");
    $("#ADDSKILL_AREA").append($wrap);
    // 親技に戻すボタン
    $("#ADDSKILL_AREA").append(makeSkillSwitchBtn(info, "親: " + info['Name'], true));
    for (var i = 0; i < adds.length; i++) {
        var sub = SKILL_MASTER[adds[i]];
        if (!sub) continue;
        var lbl = "追撃: " + sub['Name'] + " 威力" + (sub['SkillIryoku'] != null ? sub['SkillIryoku'] : "?") + "(" + (sub['PowerGrade'] || "?") + ")";
        $("#ADDSKILL_AREA").append(makeSkillSwitchBtn(sub, lbl, false));
    }
}

// GAP H Task S: チェーン構造(IRYOKU_CHAIN)がある技はチェーン位置ピッカーを表示する。
// CURRENT_CHAIN_TARGET = {skillIndex, hit} 逆算対象の発動位置(未選択時はmainの1hit目)。
var CURRENT_CHAIN_TARGET = { skillIndex: 0, hit: 1 };
var CURRENT_CHAIN_MAIN_ID = null;
function currentChainEntry() {
    if (!CURRENT_STYLE_ID || !CURRENT_SKILL || typeof IRYOKU_CHAIN === 'undefined') return null;
    var byStyle = IRYOKU_CHAIN[CURRENT_STYLE_ID];
    if (!byStyle) return null;
    // メイン技(親)のchainIdで引く。追撃ボタンでCURRENT_SKILLが切り替わっても、
    // チェーン自体は常にメイン技IDで登録されているため、直近クリックしたメイン技IDを保持する。
    return byStyle[CURRENT_CHAIN_MAIN_ID] || null;
}

// 直近に描画したチェーンのメイン技ID。技を切り替えたら選択位置(CURRENT_CHAIN_TARGET)を
// 既定(main 1hit目)へリセットする — 前の技の選択位置が別チェーンに存在せず、どのボタンも
// ハイライトされないまま無言でlegacy値にフォールバックするのを防ぐ(final review Important#1)。
var CHAIN_PICKER_RENDERED_ID = null;
function renderChainPicker() {
    var $area = $("#CHAIN_AREA").html("");
    var entry = currentChainEntry();
    if (!entry) { CURRENT_CHAIN_TARGET = { skillIndex: 0, hit: 1 }; CHAIN_PICKER_RENDERED_ID = null; return; }
    if (CHAIN_PICKER_RENDERED_ID !== CURRENT_CHAIN_MAIN_ID) {
        CURRENT_CHAIN_TARGET = { skillIndex: 0, hit: 1 }; // 技切替時は既定位置へ戻す
        CHAIN_PICKER_RENDERED_ID = CURRENT_CHAIN_MAIN_ID;
    }
    var variant = entry.variants[0]; // Task S簡易版: 条件分岐(rel非空)はvariants[0]を既定選択
    $area.append($('<div class="mb-1"></div>').text('追撃チェーン(発動位置をクリックで逆算対象を選択):'));
    variant.seq.forEach(function (seqEntry) {
        for (var h = 1; h <= (seqEntry.multi || 1); h++) {
            var label = seqEntry.name + ' ' + h + 'hit目';
            var $btn = $('<button class="icon_btn_negative shadow-black CHAIN_HIT_BTN mr-1 mb-1" style="padding:2px 8px; font-size:0.8rem;"></button>').text(label);
            $btn.attr('data-skill-index', seqEntry.order).attr('data-hit', h);
            if (seqEntry.order === CURRENT_CHAIN_TARGET.skillIndex && h === CURRENT_CHAIN_TARGET.hit) {
                $btn.removeClass('icon_btn_negative').addClass('icon_btn_on');
            }
            $area.append($btn);
        }
    });
}
$(document).on('click', '.CHAIN_HIT_BTN', function () {
    CURRENT_CHAIN_TARGET = { skillIndex: Number($(this).attr('data-skill-index')), hit: Number($(this).attr('data-hit')) };
    $('.CHAIN_HIT_BTN').removeClass('icon_btn_on').addClass('icon_btn_negative');
    $(this).removeClass('icon_btn_negative').addClass('icon_btn_on');
    recalcIfResultShown();
});

function makeSkillSwitchBtn(skillInfo, label, isParent) {
    var $btn = $('<button class="icon_btn_negative shadow-black ADDSKILL_BTN mr-1 mb-1" style="padding:3px 10px; font-size:0.85rem;"></button>').text(label);
    $btn.data("skill", skillInfo);
    return $btn;
}
$(document).on('click', '.ADDSKILL_BTN', function () {
    var info = $(this).data("skill");
    if (!info) return;
    CURRENT_SKILL = info;
    renderSkillInfo(info);
    $(".ADDSKILL_BTN").removeClass("icon_btn_on").addClass("icon_btn_negative");
    $(this).removeClass("icon_btn_negative").addClass("icon_btn_on");
    renderAutoFillRows();
    refreshHitabPrefills();
});

// 耐性変更で Weak 判定が変わりうるので自動充填リスト・hit別プレフィルを更新
$(document).on('change', '#resist', function () {
    renderAutoFillRows();
    refreshHitabPrefills();
});

//////////////////////////////////////////////////
// (7) 実測ダメージ行
//////////////////////////////////////////////////
function addSampleRow() {
    var $row = $("#SAMPLE_ROW_TMPL").clone().removeAttr("id").removeClass("d-none");
    $("#SAMPLE_AREA").append($row);
    refreshHitabPrefills();
}
$(document).on('click', '#ADD_SAMPLE', addSampleRow);

// hit別アビ%補正欄をユーザーが直接編集したら data-manual を立て、以降は自動上書きしない
$(document).on('input', '.s-hitab', function () { $(this).attr('data-manual', '1'); });
// hit数・OD が変わったら（未編集の行だけ）hit別%補正を自動プレフィル
$(document).on('change', '.s-hit, .s-od', refreshHitabPrefills);

// Task L: 結果が既に表示されていれば再計算する（トグル/入力変更を即反映）
function recalcIfResultShown() {
    if (typeof collectSamples === 'function' && collectSamples().length > 0
        && $("#RESULT_AREA").find(".cand-box, .alert, .bg-item").length > 0) {
        $("#CALC").click();
    }
}

// Task L: 「入力ステはバフ込み」トグル。ON=入力ステをそのまま使う（乗算しない＝二重計上回避）。
// 既定OFF=ツールが自己buff{}＋技Mステバフを buffBase 基準で per-hit 加算する。
$(document).on('change', '#statIncludesBuff', function () {
    IRYOKU_TOOL_OPTS.statIncludesBuff = $(this).prop('checked');
    recalcIfResultShown();
});

// Task L: 「クリティカル発動」トグル（全サンプル共通）。ON=+20%＋Critical EF＋クリ条件付き
// ダメージ強化アビ（Task M）を有効化。プレフィルも変わるので refreshHitabPrefills を呼ぶ。
$(document).on('change', '#isCrit', function () {
    IRYOKU_TOOL_OPTS.isCrit = $(this).prop('checked');
    // クリ時のみ有効になる Critical攻撃 / クリ条件付き行を自動充填リストに反映（透明性）
    if (typeof renderAutoFillRows === 'function') renderAutoFillRows();
    refreshHitabPrefills();
    recalcIfResultShown();
});

// 各実測行の hit別アビ%補正欄に、命中時トリガー行(hitRows/SKILLBUFF)由来の増分%を自動入力する。
// ユーザーが手動編集した欄(data-manual=1)は上書きしない。
function refreshHitabPrefills() {
    if (!CURRENT_SKILL || !CURRENT_STYLE_T1) return;
    var isWeak = numVal("#resist") <= -35;
    var skillBuffRows = currentSkillBuffRows();
    var weaponType = styleWeaponType();
    $("#SAMPLE_AREA .SAMPLE_ROW").each(function () {
        var $row = $(this);
        var $hitab = $row.find(".s-hitab");
        if ($hitab.attr('data-manual') === '1') return;
        var hit = Number($row.find(".s-hit").val()) || 1;
        var isOD = $row.find(".s-od").prop("checked");
        var resolved = resolveT1Ability(CURRENT_STYLE_T1, CURRENT_SKILL, {
            weaponType: weaponType, isWeak: isWeak, isOD: isOD,
            charInfo: CURRENT_CHAR_INFO, skillBuffRows: skillBuffRows,
            markers: currentSkillMarkers(), isCrit: IRYOKU_TOOL_OPTS.isCrit
        });
        var inc = computeHitAbilityPer(hit, resolved.matchedHitRows, resolved.matchedSkillBuffRows, resolved.matchedDmgMarkers);
        $hitab.val(inc);
    });
}

//////////////////////////////////////////////////
// 計算コンテキストの組み立て
//////////////////////////////////////////////////
function attackStat(skill) {
    var sSTR = numVal("#styleSTR"), sDEX = numVal("#styleDEX"), sINT = numVal("#styleINT");
    if (skill && (skill['SkillType'] === "術" || skill['SpecialType'] === "知力")) return sINT;
    var bt = skill ? skill['BattleType'] : weaponNameOf($("#type").val());
    if (DEX_LIST.indexOf(bt) > -1) return sDEX;
    return sSTR;
}
// damageCore の type 引数（tai / ju のみ特別分岐、術と物理その他は default 分岐）
function coreType(skill) {
    if (skill && (skill['SkillType'] === "術" || skill['SpecialType'] === "知力")) return "hi";
    var bt = skill ? skill['BattleType'] : weaponNameOf($("#type").val());
    if (bt === "銃") return "ju";
    if (bt === "体術") return "tai";
    return "ken"; // default 分岐（4×ステ, weaponConst 1.5）
}

// GAP H Task 7: replayChain の perHit[].status は damageCore の d2
// （= 1 + coef.per×実効ステ - coef.enemy×敵実効ステ。js/iryoku_chain_replay.js computeStatusValue参照）
// と同一式の完成値であり、legacy(単技モード)の ctx.str（=バフ後の生ステ値。damageCore内部でd2を
// 再計算する前提の入力）とは別物。target.status をそのまま ctx.str に代入すると damageCore が
// 係数(4倍等)を二重に掛けてしまい破綻する（例: status=7550をそのままstrに入れると4×7550相当になる）。
// ここでは damageCore が実際に使う係数（ctx.type由来。tai=2/2.5/1.2, ju=3.6/1.25, 他=4/1.5で
// computeStatusValueの係数表と完全一致）で逆算し、damageCore内でd2を再計算した結果が
// target.statusに厳密一致するstrEffを返す（ctx.vitには同じvitEffを使う前提。代数的に
// coef.per×str-coef.enemy×vit = status-1 が常に成立するよう解くだけなので、status>1の通常域では
// damageCoreのif分岐（linear側）も必ず選ばれ厳密一致する。status<=1の極端なケースのみ
// damageCore側のクランプで1に丸められ僅かな差が出る＝既知の限界）。
// 検証: test/fixtures/iryoku_perhit_golden.json 全9サンプルのidx0h1で
// invertStatusToStrEff(...) が oracle の statParts.eff と厳密一致（Task 7 report参照）。
function invertStatusToStrEff(type, agi, status, vitEff) {
    if (type === "tai") return (status - 1 - 2.5 * agi + 1.2 * vitEff) / 2;
    if (type === "ju") return (status - 1 + 1.25 * vitEff) / 3.6;
    return (status - 1 + 1.5 * vitEff) / 4; // "ken"（既定=剣/斧/大剣/小剣/槍/弓/棍棒/杖）・"hi"（術/知力）共通
}

function effAbility(isWeak, isOD) {
    var other = numVal("#ability_other");
    var holy = 0;
    $("#HOLY_AREA .holy-per").each(function () { holy += Number($(this).val()) || 0; });
    var shouTech = numVal("#shouTech");
    var shouWeak = numVal("#shouWeak");
    var shouOD = numVal("#shouOD");
    var adv = numVal("#adventDamage");
    return other + holy + shouTech + (isWeak ? shouWeak : 0) + (isOD ? shouOD : 0) + adv;
}
function effMaster(isOD) {
    var mlv = $("#Mlv").val();
    return (isOD ? overdrive(mlv) : masterLevel(mlv)) * 100;
}
// EF バケット合成: 同一バケットは max、バケット間は【加算】。全は常時、Weak攻撃/OD攻撃は状態条件つき。
// 【Task D2b バグ修正】以前はバケット間を乗算(ex *= (1+per))していたが、実機BE calcDamage() は
// $extraForce += $ex をバケットごとに加算し最後に +1 する（＝加算合成）。乗算は誤りだったため修正。
// autoExBuckets: resolveT1Ability が返す exBuckets（各 per は既に fraction 単位・条件マッチ済み）。
// 手動入力欄は % 単位なので /100 して fraction に揃え、同一バケット名で max 合成する。
function computeEx(isWeak, isOD, autoExBuckets) {
    var buckets = {}; // 正規化バケット名 -> fraction (max)
    $("#EF_AREA .EF_ROW").each(function () {
        var b = $(this).attr("data-bucket");
        var p = (Number($(this).find(".ef-per").val()) || 0) / 100; // %→fraction
        if (buckets[b] === undefined || p > buckets[b]) buckets[b] = p;
    });
    (autoExBuckets || []).forEach(function (row) {
        // row.per は既に fraction。resolveT1Ability 内で isWeak/isOD 条件は判定済みなので
        // ここでの active 判定は手動分のみに効かせればよい（自動分のバケット名は正規化して手動と揃える）。
        var b = normalizeEfBucket(row.b);
        if (buckets[b] === undefined || row.per > buckets[b]) buckets[b] = row.per;
    });
    var sum = 0;
    for (var b2 in buckets) {
        var active = true;
        if (b2 === "Weak攻撃") active = isWeak;
        else if (b2 === "OD攻撃") active = isOD;
        if (active) sum += buckets[b2];
    }
    return 1 + sum;
}

//////////////////////////////////////////////////
// (4b) 自動充填（T1発動アビ）— Task D2b
//////////////////////////////////////////////////
// 技・スタイル・耐性が変わったら自動充填アビ%リスト（チェックボックス）を再描画する。
// 表示は代表状態(isWeak=現在の耐性判定, isOD=false)で計算する。実サンプル行ごとの
// OD差分は computeAll 内で resolveT1Ability を都度呼び直して反映する。
function autoFillKey(row) {
    return (row.n || "") + "|" + (row.b || "") + "|" + (row.t || "");
}
function renderAutoFillRows() {
    if (!CURRENT_SKILL || !CURRENT_STYLE_T1) { $("#AUTOFILL_AREA").html(""); return; }
    var isWeak = numVal("#resist") <= -35;
    var resolved = resolveT1Ability(CURRENT_STYLE_T1, CURRENT_SKILL, {
        weaponType: styleWeaponType(),
        isWeak: isWeak, isOD: false, charInfo: CURRENT_CHAR_INFO,
        skillBuffRows: currentSkillBuffRows(),
        markers: currentSkillMarkers(), isCrit: IRYOKU_TOOL_OPTS.isCrit
    });
    var $area = $("#AUTOFILL_AREA").html("");
    resolved.activeRows.forEach(function (row) {
        var key = autoFillKey(row);
        var $lbl = $('<label class="d-block iryoku-panel small mb-0" style="cursor:pointer;"></label>');
        var $chk = $('<input type="checkbox" class="AUTOFILL_CHK mr-1" checked>').attr("data-key", key).attr("data-per", row.p);
        $lbl.append($chk).append(document.createTextNode(row.n + "（" + row.b + " +" + row.p + "% " + row.t + "）"));
        $area.append($lbl);
    });
    if (!resolved.activeRows.length) $area.html('<span class="opacity small iryoku-panel">自動充填候補なし</span>');
}
$(document).on('change', '#AUTOFILL_AREA .AUTOFILL_CHK', function () { /* 再計算はCALC押下時 */ });

// チェック済み自動充填行のアビ%合計と、行ごとの resolveT1Ability 結果を返す。
// 表示リストに無い行（isOD差分等で新規出現）はチェック不可なので既定ON扱い（単純化・報告参照）。
function autoFillAbilityPer(isWeak, isOD) {
    var empty = { per: 0, resolved: { abilityPer: 0, exBuckets: [], activeRows: [], matchedHitRows: [], matchedSkillBuffRows: [], matchedDmgMarkers: [], enemyStatMarkers: [], selfStatMarkers: [] } };
    if (!CURRENT_SKILL || !CURRENT_STYLE_T1) return empty;
    var checkedKeys = {};
    $("#AUTOFILL_AREA .AUTOFILL_CHK").each(function () {
        checkedKeys[$(this).data("key")] = $(this).prop("checked");
    });
    var resolved = resolveT1Ability(CURRENT_STYLE_T1, CURRENT_SKILL, {
        weaponType: styleWeaponType(),
        isWeak: isWeak, isOD: isOD, charInfo: CURRENT_CHAR_INFO,
        skillBuffRows: currentSkillBuffRows(),
        markers: currentSkillMarkers(), isCrit: IRYOKU_TOOL_OPTS.isCrit
    });
    var per = 0;
    resolved.activeRows.forEach(function (row) {
        var key = autoFillKey(row);
        var checked = (checkedKeys[key] !== undefined) ? checkedKeys[key] : true;
        if (checked) per += row.p;
    });
    // Task L(crit): resolveT1Ability は crit確定時に abilityPer へ +20%（会心補正）を加える
    // （iryoku_core.js の "if(opts.isCrit) abilityPer += 20"）。これは activeRows（チェックボックス行）に
    // 紐づかない常時スカラー加算なので上の行合計には含まれない。トグル不可分としてここで補う。
    // ※非crit時(既定)は一切加算しない＝従来挙動を厳密に維持。
    if (IRYOKU_TOOL_OPTS.isCrit) per += IRYOKU_CRIT_ABILITY_BONUS;
    return { per: per, resolved: resolved };
}

function collectSamples() {
    var rows = [];
    $("#SAMPLE_AREA .SAMPLE_ROW").each(function () {
        var d = $(this).find(".s-damage").val();
        if (d === "" || d === null) return;
        rows.push({
            damage: Number(d),
            hit: Number($(this).find(".s-hit").val()) || 1,
            od: $(this).find(".s-od").prop("checked"),
            hitab: Number($(this).find(".s-hitab").val()) || 0,
            hitabManual: $(this).find(".s-hitab").attr("data-manual") === "1"
        });
    });
    return rows;
}

function ctxBase() {
    var vitRaw = numVal("#vit");
    var debuff = numVal("#debuff_per");
    // 敵ステの種別（技/物理=VIT, 術(知力以外)=MND）。静的デバフ体力/精神の対応付けに使う。
    var enemyKind = (CURRENT_SKILL && CURRENT_SKILL['SkillType'] === "術" && CURRENT_SKILL['SpecialType'] !== "知力") ? "MND" : "VIT";
    return {
        type: coreType(CURRENT_SKILL),
        // strBase = バフ前の攻撃ステ（表示ステ入力）。実効ステは computeAll が per-hit で乗算する（Task C/D）。
        strBase: attackStat(CURRENT_SKILL),
        statKey: attackStatKey(CURRENT_SKILL),
        // Task L: 攻撃ステの基礎値（charMAX+LIMIT_BASE）。effectiveStat のエンジン厳密式に渡す。
        // 未選択（手動運用）時は null → effectiveStat は従来の近似式にフォールバック。
        buffBase: (CURRENT_CHAR_BASE && CURRENT_CHAR_BASE[attackStatKey(CURRENT_SKILL)] != null)
            ? CURRENT_CHAR_BASE[attackStatKey(CURRENT_SKILL)] : null,
        agi: numVal("#styleAGI"),
        weapon: numVal("#weapon"),
        rank: numVal("#skill_rank"),
        vitRaw: vitRaw,
        manualDebuffPer: debuff,            // 手動 #debuff_per（従来通り。乗算で残す）
        enemyKind: enemyKind,
        enemyDebuff: (CURRENT_STYLE_T1 && CURRENT_STYLE_T1.debuff) || {}, // 静的敵デバフ（Task K-gap）
        resist: numVal("#resist"),
        // 後方互換: str/vit の即値も残す（外部参照用。computeAll は per-hit 値を使う）
        str: attackStat(CURRENT_SKILL),
        vit: vitRaw * (1 - debuff / 100)
    };
}

// 全実測行の feasibleIryokuSet を求め、集合積を取る。abilityDelta は感度分析用。
function computeAll(rows, base, abilityDelta) {
    abilityDelta = abilityDelta || 0;
    var isWeak = base.resist <= -35;
    var perSample = [];
    var inter = null;
    var anyCapped = false;
    // GAP H Task S(7): チェーン構造(IRYOKU_CHAIN)がある技はTask 6 replayChainでチェーン全体を
    // エンジン忠実にリプレイし、CURRENT_CHAIN_TARGETで選んだ発動位置の値をctxへ反映する。
    // チェーンデータが無い技(currentChainEntry()===null)ではchainResult=nullのまま→単技モードは
    // 完全に従来通り動作する（下のループ内if(chainResult)ブロックが丸ごとno-op）。
    var chainEntry = currentChainEntry();
    // レビュー修正(1): チェーンはサンプル行ごとにOD(r.od)が異なりうる（同じ技構成でも通常/OD撃ちを
    // 混在計測できる）。以前はisOD:false固定で1回だけreplayChainしていたためOD行のability/ex/status
    // （recalcBuffStatusのOD+20%全ステ・OD限定発動アビ/EF等）が誤って通常値になっていた。
    // ここでOD/非OD双方を事前に1回ずつ計算し、下のループで行ごとのisODで選択する
    // （golden harnessはサンプル別isODを渡して検証済み＝これがverified挙動と一致する）。
    var chainResultNoOD = null;
    var chainResultOD = null;
    if (chainEntry && typeof replayChain === 'function') {
        var styleInfo = STYLE_MASTER[CURRENT_STYLE_ID];
        var charInfo = CHAR_MASTER[styleInfo.CharacterId];
        // チェーンは技/術混在しうるためstyleMaxは4キー全て渡す（statKeyは発動ごとにreplayChain内で導出）。
        // #styleSTR等は「実機の表示ステータス」＝装備(武器/防具)込みの値を入れる運用（iryoku.html ②の
        // 注記通り）なので、styleMaxByKeyへそのまま渡してよい。装備補正は既にここに含まれているため
        // statCorrectionは省略(既定0)で二重計上にならない（Task 7 report参照・golden 9サンプルで検証済み）。
        var styleMaxByKey = { STR: numVal('#styleSTR'), DEX: numVal('#styleDEX'), AGI: numVal('#styleAGI'), INT: numVal('#styleINT') };
        var chainOptsBase = {
            styleId: CURRENT_STYLE_ID, mainSkillId: CURRENT_CHAIN_MAIN_ID, weaponType: styleWeaponType(),
            charInfo: charInfo, charBasePlusLimit: CURRENT_CHAR_BASE || {}, styleMaxByKey: styleMaxByKey,
            resist: base.resist, isWeak: isWeak, isCrit: IRYOKU_TOOL_OPTS.isCrit,
            // baseEnemyVitは#vitの現在値を常に使う（手動編集を尊重、従来通り）。baseEnemyMndのみ、
            // 敵プルダウン選択済み（CURRENT_ENEMY_ROW有）ならその実MND値を使う（混在技/術チェーンで
            // 術ヒットがVIT値を誤って流用しないように。以前は常にVIT値のエイリアスだった）。
            enemyType: '',
            baseEnemyVit: base.vitRaw,
            baseEnemyMnd: CURRENT_ENEMY_ROW ? Number(CURRENT_ENEMY_ROW.mnd) : base.vitRaw,
            skillMasterOf: function (skillId) { return skillObjById(skillId); },
            reg: (typeof IRYOKU_REG !== 'undefined') ? IRYOKU_REG[CURRENT_STYLE_ID] : undefined,
            chain: chainEntry, chainOn: [],
            markersOf: function (id) { return (typeof IRYOKU_SKILLMARKER !== 'undefined' && IRYOKU_SKILLMARKER[id]) || []; },
        };
        chainResultNoOD = replayChain(Object.assign({}, chainOptsBase, { isOD: false }));
        chainResultOD = replayChain(Object.assign({}, chainOptsBase, { isOD: true }));
    }
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var isOD = r.od;
        // レビュー修正(1): 行別ODフラグで事前計算済みの2種から選択（replayChainはループ内で呼ばない＝
        // computeAllあたり最大2回のみ）。
        var chainResult = isOD ? chainResultOD : chainResultNoOD;
        // 自動充填（T1発動アビ）＋そのEFバケット・命中時トリガー行を取得
        var af = autoFillAbilityPer(isWeak, isOD);
        var resolved = af.resolved;
        // hit別アビ%補正: 未編集の行は毎回 computeHitAbilityPer で算出した増分を使う（s-hitab欄の
        // 自動プレフィルと同値）。ユーザーが手動編集した行(data-manual)はその入力値を尊重する。
        // ※ 二重計上を防ぐため r.hitab と hitInc を両方足さない（どちらか一方のみ）。
        // Task F/E: ダメージマーカー(ch:dmg)の毎hit蓄積も合算する。
        var hitInc = computeHitAbilityPer(r.hit, resolved.matchedHitRows, resolved.matchedSkillBuffRows, resolved.matchedDmgMarkers);
        var hitCorrection = r.hitabManual ? r.hitab : hitInc;
        var ability = effAbility(isWeak, isOD) + af.per + hitCorrection + abilityDelta;
        var capped = ability > IRYOKU_MAX_FIRE_DAMAGE;
        if (capped) { ability = IRYOKU_MAX_FIRE_DAMAGE; anyCapped = true; }
        // Task C/D: 実効攻撃ステ = バフ前ステ × (1 + buff%/100)。buff% は per-hit（C=技Mステバフ・
        // D=自己buff{}・自己ステマーカー）。statIncludesBuff=true なら乗算しない（Task L でトグル配線）。
        var statKey = base.statKey || "STR";
        var selfBuff = (CURRENT_STYLE_T1 && CURRENT_STYLE_T1.buff) || {};
        var buffPer = statBuffPercent(statKey, selfBuff, currentSkillStatBuffRows(), resolved.selfStatMarkers, r.hit);
        // Task L: buffBase（=charMAX+LIMIT_BASE）を渡すとエンジン厳密式 styleMax+floor(buffBase×per/100) を使う。
        // statIncludesBuff=true 時は effectiveStat が入力ステをそのまま返す（buffBase/buffPer は不使用）。
        var strEff = effectiveStat(base.strBase, buffPer, { statIncludesBuff: IRYOKU_TOOL_OPTS.statIncludesBuff, buffBase: base.buffBase });
        // Task K-gap / per-hit vit: 静的敵デバフ(体力/精神)＋敵ステマーカーを敵vit/mndへ per-hit 反映。
        // 手動 #debuff_per は従来通り乗算で残す（UIトグルは Task L）。
        var staticKey = (base.enemyKind === "MND") ? "精神" : "体力";
        var staticEntry = (base.enemyDebuff || {})[staticKey];
        var staticPer = (staticEntry && typeof staticEntry.per === 'number') ? -Math.abs(staticEntry.per) : 0;
        var enemyMarkerRows = (resolved.enemyStatMarkers || []).filter(function (m) { return m.stat === base.enemyKind; });
        var autoDebuffPer = enemyStatDebuffPer(staticPer, enemyMarkerRows, r.hit);
        var vitEff = effectiveEnemyStat(base.vitRaw, autoDebuffPer) * (1 - base.manualDebuffPer / 100);
        var exEff = computeEx(isWeak, isOD, resolved.exBuckets);
        var ctxType = base.type; // 既定は単技モードと同じCURRENT_SKILL由来のtype
        // GAP H Task S(7): チェーンモードでは選択発動位置(CURRENT_CHAIN_TARGET)のreplayChain結果で
        // ability/vitEff/strEff/exEffを上書きする。target.abilityはスタイルアビ+技Mod+マーカー累積を
        // 全て含む完全値なので、af.per(自動充填)・hitCorrection(hit別%補正)は加算しない
        // （二重計上防止。手動入力分(聖石/その他%/Weak・OD章/冒険Rank)のみeffAbilityで合算する）。
        if (chainResult) {
            var target = chainResult.perHit.find(function (h) {
                return h.skillIndex === CURRENT_CHAIN_TARGET.skillIndex && h.hit === CURRENT_CHAIN_TARGET.hit;
            });
            if (target) {
                ability = effAbility(isWeak, isOD) + target.ability + abilityDelta;
                vitEff = target.enemyStatEff * (1 - base.manualDebuffPer / 100);
                // レビュー修正(2): typeは選択hitの技(target.skillId)から導出する。base.type(=CURRENT_SKILL＝
                // チェーンの親技)のままだと混在型チェーン（技と術が混在する追撃列等）で選択hitの実際の型と
                // ズレる。coreType()はSkillType/SpecialType/BattleTypeだけで決まる純粋関数なので、
                // skillObjById(target.skillId)で取得した技オブジェクトに単技モードと全く同じ関数を
                // 適用するだけでよい（新しい係数ロジックは作らない）。damageCoreのweaponConst
                // （tai=1,ju=1.9,else=1.5）はこのtypeだけで決まるため、ここを直せば十分。
                // ※agi/weapon/rank(#styleAGI/#weapon/#skill_rank)は単技モードでもCURRENT_SKILL切替時に
                // 変更されない手動UI入力（ADDSKILL_BTNのclickハンドラも#weapon/#skill_rankを書き換えない）。
                // つまり元々「技に依存しない全体値」という既存仕様であり、チェーンの選択hitが変わっても
                // base.agi/base.weapon/base.rankをそのまま使うのが単技モードと一致した挙動。
                var hitSkill = skillObjById(target.skillId);
                var hitType = hitSkill ? coreType(hitSkill) : base.type; // 解決不可時は既存(CURRENT_SKILL)にフォールバック
                ctxType = hitType;
                // target.status(=damageCoreのd2と同一式の完成値)をctx.strへ二重計上なく変換する
                // （下のinvertStatusToStrEffのコメント参照。ctx.vitには上のvitEffをそのまま使う）。
                // CRITICAL: ここで使うtypeは上のctxTypeと同一でなければならない（invertが前提とする
                // 係数族と、ctx.type経由でdamageCoreが実際に使う係数族がズレると往復が破綻する）。
                strEff = invertStatusToStrEff(hitType, base.agi, target.status, vitEff);
                // exもtarget.ex(自動EF込み)で上書きし、手動EF行の分のみ加算する
                //（computeEx(isWeak,isOD,[]) - 1 = 手動EF行のみの合計。エンジンはEFキー間を線形加算するため加算合成でよい）。
                exEff = target.ex + (computeEx(isWeak, isOD, []) - 1);
                // ability%キャップ判定はチェーンモードでも上書き後の値に対して行う。
                capped = ability > IRYOKU_MAX_FIRE_DAMAGE;
                if (capped) { ability = IRYOKU_MAX_FIRE_DAMAGE; anyCapped = true; }
            } else {
                // レビュー修正(3): 選択発動位置(CURRENT_CHAIN_TARGET)がperHitに見つからない防御的ケース。
                // 従来通りbase(=CURRENT_SKILL)由来の値にフォールバックするが、無言で処理を続けると
                // チェーンなのに単技相当の値になっていることに気づけないため警告を出す。
                console.warn('[iryoku_calc] chain target not found in perHit (skillIndex=' + CURRENT_CHAIN_TARGET.skillIndex +
                    ', hit=' + CURRENT_CHAIN_TARGET.hit + ') — falling back to legacy(CURRENT_SKILL-based) ctx values.');
            }
        }
        var ctx = {
            type: ctxType, str: strEff, agi: base.agi, weapon: base.weapon,
            rank: base.rank, vit: vitEff, master: effMaster(isOD),
            ability: ability, resist: base.resist, ex: exEff
        };
        var res = feasibleIryokuSet({ damage: r.damage }, ctx);
        perSample.push({ row: r, res: res, ctx: ctx, capped: capped });
        if (inter === null) {
            inter = new Set();
            res.set.forEach(function (v) { inter.add(v); });
        } else {
            inter.forEach(function (v) { if (!res.set.has(v)) inter.delete(v); });
        }
    }
    var arr = inter ? Array.from(inter) : [];
    arr.sort(function (a, b) { return a - b; });
    return { inter: arr, perSample: perSample, isWeak: isWeak, anyCapped: anyCapped };
}

// 連続区間をまとめて "a〜b, c" 表記にする
function formatRanges(sorted) {
    if (!sorted.length) return "(なし)";
    var parts = [];
    var start = sorted[0], prev = sorted[0];
    for (var i = 1; i < sorted.length; i++) {
        if (sorted[i] === prev + 1) { prev = sorted[i]; continue; }
        parts.push(start === prev ? "" + start : start + "〜" + prev);
        start = prev = sorted[i];
    }
    parts.push(start === prev ? "" + start : start + "〜" + prev);
    return parts.join(", ");
}

//////////////////////////////////////////////////
// 逆算実行 & 結果表示
//////////////////////////////////////////////////
$(document).on('click', '#CALC', function () {
    var rows = collectSamples();
    if (rows.length === 0) {
        $("#RESULT_AREA").html("実測ダメージを1件以上入力してください。");
        return;
    }
    var base = ctxBase();
    var result = computeAll(rows, base, 0);
    var html = "";

    if (result.anyCapped) {
        html += '<div class="alert alert-warning" style="margin:0 0 10px;">アビリティ強化%が上限 '
            + number_format(IRYOKU_MAX_FIRE_DAMAGE) + '% に到達したためキャップしました（実機同様、これ以上は加算されません）。</div>';
    }

    if (result.inter.length === 0) {
        html += '<div class="alert alert-warning" style="margin:0 0 10px;">候補が空です。入力（表示ステ・敵体力・耐性・アビリティ%・EF）のどれかが実機とズレている可能性があります。</div>';
        // 感度表示（アビリティ% を ±5 して再計算）
        html += '<div class="mb-2"><b>感度（アビリティ%を増減した場合）:</b><br>';
        var deltas = [-5, 0, 5];
        for (var d = 0; d < deltas.length; d++) {
            var alt = computeAll(rows, base, deltas[d]);
            var sign = deltas[d] > 0 ? "+" + deltas[d] : "" + deltas[d];
            html += "アビ" + sign + "%: " + formatRanges(alt.inter) + "<br>";
        }
        html += '</div>';
    } else {
        html += '<div class="cand-box mb-2">威力候補: ' + formatRanges(result.inter) + '</div>';

        // 威力ランクレンジとの整合チェック
        var grade = CURRENT_SKILL && CURRENT_SKILL['PowerGrade'];
        if (grade && IRYOKU_LABEL[grade]) {
            var gr = IRYOKU_LABEL[grade].split("〜");
            var gmin = Number(gr[0]), gmax = Number(gr[1]);
            var outside = result.inter.filter(function (v) { return v < gmin || v > gmax; });
            if (outside.length === result.inter.length) {
                html += '<div class="alert alert-warning" style="margin:0 0 8px;">威力ランク ' + grade + '(' + IRYOKU_LABEL[grade] + ') の範囲外です。技の選択や入力条件を確認してください。</div>';
            } else if (outside.length > 0) {
                html += '<div class="opacity mb-2">※ 一部候補が威力ランク ' + grade + '(' + IRYOKU_LABEL[grade] + ') の範囲外です。</div>';
            } else {
                html += '<div class="opacity mb-2">威力ランク ' + grade + '(' + IRYOKU_LABEL[grade] + ') の範囲内です。</div>';
            }
        }

        // 既知 SkillIryoku との照合
        var known = CURRENT_SKILL && CURRENT_SKILL['SkillIryoku'];
        if (known !== null && known !== undefined) {
            var inSet = result.inter.indexOf(Number(known)) > -1;
            html += '<div class="mb-2">既知の威力実数 <b>' + known + '</b> は候補集合に'
                + (inSet ? '<b style="color:#7dff7d;">含まれます</b>（整合OK）' : '<b style="color:#ff9a9a;">含まれません</b>（要確認）') + '。</div>';
        }
    }

    // サンプル別の詳細（一致した n / model）
    html += '<div class="bg-item text-center mt-2">▼ 実測行ごとの一致内訳 ▼</div>';
    for (var i = 0; i < result.perSample.length; i++) {
        var ps = result.perSample[i];
        var cand = Array.from(ps.res.set).sort(function (a, b) { return a - b; });
        html += '<div class="mb-1" style="border-bottom:1px solid #faf0b4; padding-bottom:4px;">'
            + '実測 <b>' + number_format(ps.row.damage) + '</b>'
            + '（' + ps.row.hit + 'hit目' + (ps.row.od ? ' / OD' : '') + '）' + (ps.capped ? '<span style="color:#ff9a9a;">[アビ%キャップ到達]</span> ' : '') + '→ 威力候補: ' + formatRanges(cand)
            + '<br><span class="small opacity">ctx: str=' + Math.round(ps.ctx.str) + ' weapon=' + ps.ctx.weapon
            + ' vit(実効)=' + Math.round(ps.ctx.vit) + ' master=' + (Math.round(ps.ctx.master * 100) / 100)
            + ' ability=' + (Math.round(ps.ctx.ability * 100) / 100) + ' resist=' + ps.ctx.resist
            + ' ex=' + (Math.round(ps.ctx.ex * 1000) / 1000) + '</span>';
        // 一致した (n, model) を最大10件表示
        if (ps.res.detail.length) {
            var d = ps.res.detail.slice(0, 10).map(function (x) { return "威力" + x.s + "(n" + x.n + "/" + x.model + ")"; });
            html += '<br><span class="small">一致: ' + d.join(", ") + (ps.res.detail.length > 10 ? " ..." : "") + '</span>';
        }
        html += '</div>';
    }

    $("#RESULT_AREA").html(html);
});
