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
// 現在の技の SKILLBUFF 行（技バフ：命中時トリガー含む）
function currentSkillBuffRows() {
    if (CURRENT_SKILL && CURRENT_SKILL['Id'] && typeof IRYOKU_SKILLBUFF !== 'undefined' && IRYOKU_SKILLBUFF[CURRENT_SKILL['Id']]) {
        return IRYOKU_SKILLBUFF[CURRENT_SKILL['Id']];
    }
    return [];
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
            SKILL_LIST[battleType2]['ALL'].unshift({ "Id": "NORMAL_" + battleType2, "ConsumeBp": 0, "Name": "通常攻撃(" + battleType2 + ")", "PowerGrade": "E", "SkillIryoku": 7, "SkillType": "技", "BattleType": battleType2 });
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
    for (var key in map) {
        var paramName = map[key];
        var charBase = Number(charInfo["MAX" + key]) + (typeof LIMIT_BASE !== 'undefined' ? LIMIT_BASE : 0);
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
    renderSkillInfo(info);
    renderAddSkills(info);
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
            charInfo: CURRENT_CHAR_INFO, skillBuffRows: skillBuffRows
        });
        var inc = computeHitAbilityPer(hit, resolved.matchedHitRows, resolved.matchedSkillBuffRows);
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
        skillBuffRows: currentSkillBuffRows()
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
    var empty = { per: 0, resolved: { abilityPer: 0, exBuckets: [], activeRows: [], matchedHitRows: [], matchedSkillBuffRows: [] } };
    if (!CURRENT_SKILL || !CURRENT_STYLE_T1) return empty;
    var checkedKeys = {};
    $("#AUTOFILL_AREA .AUTOFILL_CHK").each(function () {
        checkedKeys[$(this).data("key")] = $(this).prop("checked");
    });
    var resolved = resolveT1Ability(CURRENT_STYLE_T1, CURRENT_SKILL, {
        weaponType: styleWeaponType(),
        isWeak: isWeak, isOD: isOD, charInfo: CURRENT_CHAR_INFO,
        skillBuffRows: currentSkillBuffRows()
    });
    var per = 0;
    resolved.activeRows.forEach(function (row) {
        var key = autoFillKey(row);
        var checked = (checkedKeys[key] !== undefined) ? checkedKeys[key] : true;
        if (checked) per += row.p;
    });
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
    return {
        type: coreType(CURRENT_SKILL),
        str: attackStat(CURRENT_SKILL),
        agi: numVal("#styleAGI"),
        weapon: numVal("#weapon"),
        rank: numVal("#skill_rank"),
        vit: vitRaw * (1 - debuff / 100),
        resist: numVal("#resist")
    };
}

// 全実測行の feasibleIryokuSet を求め、集合積を取る。abilityDelta は感度分析用。
function computeAll(rows, base, abilityDelta) {
    abilityDelta = abilityDelta || 0;
    var isWeak = base.resist <= -35;
    var perSample = [];
    var inter = null;
    var anyCapped = false;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var isOD = r.od;
        // 自動充填（T1発動アビ）＋そのEFバケット・命中時トリガー行を取得
        var af = autoFillAbilityPer(isWeak, isOD);
        var resolved = af.resolved;
        // hit別アビ%補正: 未編集の行は毎回 computeHitAbilityPer で算出した増分を使う（s-hitab欄の
        // 自動プレフィルと同値）。ユーザーが手動編集した行(data-manual)はその入力値を尊重する。
        // ※ 二重計上を防ぐため r.hitab と hitInc を両方足さない（どちらか一方のみ）。
        var hitInc = computeHitAbilityPer(r.hit, resolved.matchedHitRows, resolved.matchedSkillBuffRows);
        var hitCorrection = r.hitabManual ? r.hitab : hitInc;
        var ability = effAbility(isWeak, isOD) + af.per + hitCorrection + abilityDelta;
        var capped = ability > IRYOKU_MAX_FIRE_DAMAGE;
        if (capped) { ability = IRYOKU_MAX_FIRE_DAMAGE; anyCapped = true; }
        var ctx = {
            type: base.type, str: base.str, agi: base.agi, weapon: base.weapon,
            rank: base.rank, vit: base.vit, master: effMaster(isOD),
            ability: ability, resist: base.resist, ex: computeEx(isWeak, isOD, resolved.exBuckets)
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
        if (known !== null && known !== undefined && String(CURRENT_SKILL['Id']).indexOf("NORMAL_") !== 0) {
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
            + ' vit=' + Math.round(ps.ctx.vit) + ' master=' + (Math.round(ps.ctx.master * 100) / 100)
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
