let DAMAGE_ABILITY = {
    "ID29d93221" : {"Id":"ability_list2", "Per":2},
    "ID29d93221" : {"Id":"ability_list2", "Per":5},
    "ID29d93221" : {"Id":"ability_list2", "Per":10},
    "ID29d93221" : {"Id":"ability_list2", "Per":15},
    "ID29d93221" : {"Id":"ability_list2", "Per":20},
};
let SKILL_LIST = {
    "剣": [], "大剣": [], "斧": [],
    "小剣": [], "槍": [], "弓": [],
    "棍棒": [], "体術": [], "銃": [],
    "火術": [], "水術": [], "風術": [],
    "土術": [], "光術": [], "闇術": [],"杖": []};
let SKILL_MAP = {
    'ken': '剣',
    'dken': '大剣',
    'ono': '斧',
    'sken': '小剣',
    'yari': '槍',
    'yumi': '弓',
    'kon': '棍棒',
    'tai': '体術',
    'ju': '銃',
    'hi': '火術',
    'mizu': '水術',
    'kaze': '風術',
    'tsuchi': '土術',
    'hikari': '光術',
    'yami': '闇術'
};
let DEX_LIST = ["yumi", "sken", "ju"];
var MY_MASTER_LV = {"ken":1,"dken":1,"ono":1,"sken":1,"yumi":1,"yari":1,"ju":1,"kon":1,"tai":1,"tsue":1};
var SAVE_OPTION = {
    "styleId" : "",
    "weapon" : 0,
    "master" : "",
    "masterPer" : "",
    "ab" : 0,
    "enemy" : 0,
    "resist" : 0,
    "damage" : 0,

    "name" : "通常攻撃",
    "grade" : "E",
    "iryoku" : 7,
    "rank" : 1,
    "status" : "",
    "statusCalc" : "",
};

if(typeof firebase !== 'undefined'){
    firebase.auth(appUsers).onAuthStateChanged((user) => {
        if (user) {
            USER = user;
            UID = user.uid;
            initial();
        }
    });
}


async function initial() {
    // マスターレベル
    let masterFunc = readUserData("MASTER", function (read) {
        if (read !== null) {
            MY_MASTER_LV = read;
            $("#master").val(MY_MASTER_LV["ken"]);
            $("#NOW_MAX_ML").val(WEAPON_MAP["剣"]['master']);
            setMasterDamageRate();
        } else {
            $("#master").val(WEAPON_MAP["剣"]['master']);
            $("#NOW_MAX_ML").val(WEAPON_MAP["剣"]['master']);
        }
    });
    $("#NOW_ADV_LV").val(BOUKEN_RANK_PER);    
    await Promise.all([masterFunc]);
    firebase.database().goOffline();
    firebase.database(appUsers).goOffline();
}

$(function () {

    for (let idx in ENEMY_DATA) {
        let row = ENEMY_DATA[idx];
        let disp = row['quest'] + " " + row['name'] + " 体:" + row['vit'] + " 精:" + row['mnd'];
        //" 推定HP:" + row['hp'];
        $option = $('<option>', {value: idx, text: disp});
        $('#enemy_vit').append($option);
    }
    
    for (let idx in SKILL_MASTER) {
        let row = SKILL_MASTER[idx];
        if(row['Type'] != "攻撃") {
            continue;
        }
        if(typeof SKILL_LIST[row['BattleType']]['ALL'] == "undefined") {
            SKILL_LIST[row['BattleType']]['ALL'] = [];
        }
        if(typeof SKILL_LIST[row['BattleType']][row['PowerGrade']] == "undefined") {
            SKILL_LIST[row['BattleType']][row['PowerGrade']] = [];
        }
        SKILL_LIST[row['BattleType']]['ALL'].push(row);
        SKILL_LIST[row['BattleType']][row['PowerGrade']].push(row);
    }

    let idx = 0;
    let base = {"Id": "", "ConsumeBp": 0, "Name": "", "PowerGrade": "E", "SkillIryoku": 7, "SkillType": "技"};
    let IRYOKU_LABEL = {
        "E":"6〜9","D":"10〜14","C":"15〜20",
        "B":"21〜27","A":"28〜35","S":"36〜44",
        "SS":"45〜57","SSS":"58〜73","SSSS":"74〜99"}
    ;

    for (let battleType in SKILL_LIST) {
        for(grade in IRYOKU_LABEL) {
            label = Object.assign({}, base);
            label['Id'] = "LABEL" + battleType + grade;
            let count = (typeof SKILL_LIST[battleType][grade] != "undefined") ? SKILL_LIST[battleType][grade].length : 0;
            label['Name'] = `==== 威力:${grade} ${IRYOKU_LABEL[grade]} ${count}種 ====`;
            label['PowerGrade'] = grade;
            label['SkillIryoku'] = IRYOKU_LABEL[grade].split("〜")[1];
            label['ConsumeBp'] = 100;
            SKILL_LIST[battleType]['ALL'].push(label);
            if(typeof SKILL_LIST[battleType][grade] != "undefined") {
                SKILL_LIST[battleType][grade].push(label);
            }            
        }
    }
    for (let battleType in SKILL_LIST) {
        for (let grade in SKILL_LIST[battleType]) {
            SKILL_LIST[battleType][grade].sort(function (a, b) {

                if (a.SkillIryoku > b.SkillIryoku) {
                    return -1;
                } else if (a.SkillIryoku < b.SkillIryoku) {
                    return 1;
                } else if (a.ConsumeBp < b.ConsumeBp) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        SKILL_LIST[battleType]['ALL'].unshift({"Id": "ID" + (idx++), "ConsumeBp": 0, "Name": "通常攻撃(" + battleType + ")", "PowerGrade": "E", "SkillIryoku": 7, "SkillType": "技"});
    }
    // 初回表示
    addOptionWithDisable(createSkillOption(SKILL_LIST["剣"]['ALL']), "skill");
    setDefaultSkillIryoku();
});

//////////////////////////////////////////////////
// 画面操作の挙動
//////////////////////////////////////////////////
$(document).on('click', '.CLOSE_BTN', function () {
    $(this).parents(".bg-simple").slideUp(300, function (){ $(this).remove() });
});

$(document).on('change', '.calcDamage', function () {
    $(".DAMAGE_TMPL").removeClass("d-none");
    $(".match-damage").removeClass("match-damage");

    $(".calcDamage").each(function(){
        var damage = $(this).val();
        if(damage == "") {
            return true; // continue
        }
        $(".DAMAGE_TMPL").each(function(){
            var match_flg = false;
            for (i = 1; i <= 10; i++) {
                $col = $(this).find(".d" + i)
                d = Number($col.html().replace(",",""));
                if(damage == d) {
                    $col.addClass("match-damage");
                    match_flg = true;
                }
            }
            if(!match_flg) {
                $(this).addClass("d-none");
            }
        })
    });
});

$(document).on('change', '.damage', function () {
    damageCalc();
});

$(document).on('change', '.charParam', function () {
    damageCalc();
});

$(document).on('change', '.culcList', function () {
    // abilityの値を入れ替えるので計算はこのタイミング
    damageCalc();
});
$(document).on('change', '#master', function () {
    type = $("#type").val();
    if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
        type = "tsue";
    }
    // マスターレベルの変更
    MY_MASTER_LV[type] = $("#master").val();
    setMasterDamageRate();
    damageCalc();
});

$(document).on('change', '#resist', function () {
    var r = $('#resist').val();
    $("#resistDamage").val(Math.round(1 / (1 + 0.008 * r) * 100 * 100) / 100);
});

$(document).on('click', '#SAVE', function () {
    damageCalc();

    $history = $("#HISTORY_TEMPLATE").clone().removeAttr("id").removeClass("d-none");
    
    styleId = SAVE_OPTION["styleId"];
    if(styleId != ""){
        styleInfo = STYLE_MASTER[styleId];
        let styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, "", true);
        $history.find(".ICON").append(styleIcon);
    }
    $history.find(".GRADE").text(SAVE_OPTION['grade']);
    $history.find(".WEAPON").text(SAVE_OPTION['weapon'])
    $history.find(".MLV").text(SAVE_OPTION['master']);
    $history.find(".MLV_PER").text(SAVE_OPTION['masterPer']);
    $history.find(".AB").text(SAVE_OPTION['ab']);
    $history.find(".AB_STONE").text(SAVE_OPTION['abStone']);
    $history.find(".ENEMY_ST").text(SAVE_OPTION['enemy']);
    $history.find(".DAMAGE").text(number_format(SAVE_OPTION['damage']));
    $history.find(".SKILL_NAME").text(SAVE_OPTION['name']);
    $history.find(".IRYOKU").text(SAVE_OPTION['iryoku']);
    $history.find(".RANK").text(SAVE_OPTION['rank']);
    $history.find(".ST").text(SAVE_OPTION['status']);
    $history.find(".ST_CALC").text(SAVE_OPTION['statusCalc']);
    $history.find(".RESIST").text(SAVE_OPTION['resist']);
    $("#HISTORY_AREA").append($history);
});

$(document).on('change', '#enemy_vit', function () {
    let idx = $("#enemy_vit").val();
    if (idx === "x") {
        return;
    }
    let row = ENEMY_DATA[idx];
    type = $("#type").val();
    if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
        $("#vit").val(row['mnd']);
    } else {
        $("#vit").val(row['vit']);
    }
    for (let z of ["zan", "da", "totsu", "netsu", "rei", "rai", "in", "you"]) {
        setTaisei($("#taisei_" + z), row[z]);
    }
    // vitの値を入れ替えるので計算はこのタイミング
    damageCalc();
});

/**
 * 武器ボタンクリック
 */
$(document).on('click', '.WEAPON_CHOISE', function () {
    $(".WEAPON_AREA").find(".filterActive").each(function(){
        $(this).removeClass("filterActive");
    });
    $(this).parents(".d-inline-block").addClass("filterActive");
    $("#weapon").val(Number($(this).parents(".d-inline-block").attr("data-val")));
    changeStatus();
    damageCalc();
});
/**
 * 装備ボタンクリック
 */
$(document).on('click', '.ARMOR_CHOISE', function () {
    var type = $(this).attr("data-type");
    clickArmor(type);
    $(".ARMOR_CHOISE").each(function(){
        $(this).removeClass("icon_btn_positive").addClass("icon_btn_negative");
    });
    $(this).removeClass("icon_btn_negative").addClass("icon_btn_positive");
    changeStatus();
    damageCalc();
});
// 武器種別が変更された場合
$(document).on('change', '#type', function () {
    $("#HOLDERS_AREA_SS").html("");
    $("#HOLDERS_AREA_S").html("");
    $("#HOLDERS_AREA_A").html("");
    $("#ABILITY_AREA").html("");
    SAVE_OPTION["styleId"] = "";
    SAVE_OPTION["name"] = "通常攻撃";
    SAVE_OPTION["grade"] = "E";

    type = $("#type").val();

    var wp = type.replace(/(mizu)|(tsuchi)|(kaze)|(hikari)|(yami)|(hi)/g,"tsue");

    for(var WeaponType in MASTER_LV_KEY) {
        if(wp == MASTER_LV_KEY[WeaponType]){
            // 武器の表示
            $("#NOW_MAX_ML").val(WEAPON_MAP[WeaponType]['master']);
            break;
        }
    }
    if(wp == "tsue") {
        $(".TEMP_WEAPON").each(function(){
            var jutsuType = $(this).attr("data-type");
            if(jutsuType.indexOf(JUTSU_MASTER[type]) == -1) {
                $(this).addClass("d-none").removeClass("d-inline-block");
            } else {
                $(this).removeClass("d-none").addClass("d-inline-block");
            }
        });
    }

    masterType = $("#type").val();
    if ($.inArray(masterType, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
        masterType = "tsue";
    }
    // マスターレベルの変更
    $("#master").val(MY_MASTER_LV[masterType]);

    setMasterDamageRate();

    // 技リストを更新する
    $('#skill').children().remove();
    addOptionWithDisable(createSkillOption(SKILL_LIST[SKILL_MAP[type]]['ALL']), "skill");
    setDefaultSkillIryoku();
    changeSkillType(masterType, {});
    $('#skill_grade').val("ALL");
    damageCalc();
});
/**
 * 技威力ラベル変更された場合
 */ 
$(document).on('change', '#skill_grade', function () {
    let val = $('#skill_grade option:selected').val();
    let type = $("#type").val();
    // 技リストを更新する
    $('#skill').children().remove();
    if(typeof SKILL_LIST[SKILL_MAP[type]][val] != "undefined") {
        addOptionWithDisable(createSkillOption(SKILL_LIST[SKILL_MAP[type]][val]), "skill");
    }
});

/**
 * 技が変更された場合
 * 通常攻撃はrankを非表示で1に設定。それ以外はrankを表示
 */
 $(document).on('change', '#skill', function () {
    $("#HOLDERS_AREA_SS").html("");
    $("#HOLDERS_AREA_S").html("");
    $("#HOLDERS_AREA_A").html("");
    $("#ABILITY_AREA").html("");
    // リセット
    GOUREI = {};
    ALWAYS_ABILITY = [];
    NOW_ABILITY_BUFF = [];
    BUFF_ABILITY = [];
    DEBUFF_ABILITY = [];
    
    setDefaultSkillIryoku();

    let text = $('#skill option:selected').text();

    if (text.indexOf('通常攻撃') !== -1) {
        //$('#input_rank').hide();
        $('#skill_rank').val(1);
        SAVE_OPTION["name"] = "通常攻撃";
        SAVE_OPTION["grade"] = "E";
        SAVE_OPTION["rank"] = 1;
    } else {
        let skillId = $('#skill option:selected').val();
        let skillInfo = SKILL_MASTER[skillId];
        SAVE_OPTION["name"] = skillInfo['Name'];
        SAVE_OPTION["grade"] = skillInfo['PowerGrade'];
        let holders = [];
        for (key in skillInfo['Holders']) {
            let styleId = skillInfo['Holders'][key];
            let styleInfo = STYLE_MASTER[styleId];
            let charInfo = CHAR_MASTER[styleInfo['CharacterId']];
            for(styleIds of charInfo['Holders']){
                holders.push(styleIds);
            }
        }
        holders = holders.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
        for(styleId of holders){
            styleInfo = STYLE_MASTER[styleId];
            let styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, "", true);
            $("#HOLDERS_AREA_"+styleInfo['Rarity'].toUpperCase()).append(styleIcon);
        }

        masterType = $("#type").val();
        if ($.inArray(masterType, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
            masterType = "tsue";
        }

        changeSkillType(masterType, skillInfo);
        //$('#input_rank').show();
    }
});

$(document).on('click', '.HOLDERS_AREA .style', function () {
    styleId = $(this).attr("data-id");

    SAVE_OPTION["styleId"] = styleId;
    styleInfo = STYLE_MASTER[styleId];
    charInfo = CHAR_MASTER[styleInfo['CharacterId']];

    let styleBonus = culcStyleAddintional(styleInfo);
    var map = {"STR": "腕力", "DEX": "器用さ", "AGI": "素早さ", "INT": "知力"};
    for (var key in map ) {
        var paramName = map[key]
        var charBase = charInfo[`MAX${key}`] + LIMIT_BASE;
        let per = styleBonus[paramName][50]["Per"];
        let bonus = styleBonus[paramName][50]["Bonus"];
        let val = addBonus(charBase, per, bonus);
        $("#char" + key).val(charBase);
        $("#style" + key).val(val);
    }

    var abList = [];
    var abIdList = [];
    var dispPer = 0;
    for(lv of Object.keys(styleInfo['StyleAbility'])){
        //abList.push(styleInfo['StyleAbility'][lv]);
        abIdList.push(styleInfo['StyleAbilityIds'][lv]);
        abId = styleInfo['StyleAbilityIds'][lv];
        var abInfo = ABILITY_MASTER[abId];
        var disp = abInfo['Name'];
        var attrs = [];
        for(attr of abInfo['Attr']) {
            if(attr['main'] == "ダメージ強化") {
                var time = (attr['time'] != "必ず(100%)") ? " 確率 " + attr['time'] : "";
                var sub = (attr['sub'] != "常時") ? attr['sub'] : "";
                var size = "+"+filterNumber(attr['size']) + "%";
                attrs.push(size + " " + sub + time);
                if(attr['sub'] == "常時" || attr['sub'] == "武器装備時") {
                    dispPer += filterNumber(attr['size']);
                }
            }
            if(attr['main'] == "ダメージ強化(全体)") {
                var time = (attr['time'] != "必ず(100%)") ? " 確率 " + attr['time'] : "";
                var sub = (attr['sub'] != "常時") ? attr['sub'].replace("属性攻撃","") : "";
                var size = "+"+filterNumber(attr['size']) + "%";
                attrs.push(size + " :" + sub + time);
            }            
        }
        if(attrs.length > 0) {
            disp += "<br>　" + attrs.join(" | ");
        }
        abList.push(disp);
    }
    $("#ability_other").val(dispPer);

    // アビリティの設定
    setAbilityBuffDeBuff(styleInfo);

    $("#ABILITY_AREA").html(abList.join("<br>"));
    damageCalc();
});

function addOptionWithDisable(list, target) {
    $.map(list, function (v, name) {
        $option = $('<option>', {value: v['text'], text: name, disabled: v['disabled'] });
        $('#' + target).append($option);
    });
}
function createSkillOption(list) {
    var result = {};
    list.forEach(function (rows) {
        let iryoku = rows['SkillIryoku'];
        // 0:種別、1:威力、2:Name、3:Grade、4:BP、5:覚醒
        var attr = (rows['AttackAttributes'] != undefined) 
        ? "["+rows['AttackAttributes'].replace(",","")+"] " : "";
        if(rows['ConsumeBp'] == 100) {
            label = attr + rows['Name'];
        } else {
            label = `威力:${iryoku} ${rows['Name']} ${attr} BP:${rows['ConsumeBp']}`;
        }
        result[label] = {'text':rows['Id'], 'disabled': (rows['ConsumeBp'] == 100)};
    });
    return result;
}

function changeSkillType(BattleType, skillInfo){
    // 影響のある陣形を入れ替える
    var SpecialType = skillInfo['SpecialType'] == undefined ? "" : skillInfo['SpecialType'];
    if (BattleType === "tsue" || SpecialType == "知力" ) {
        $("#param_label").text("知力");
        $(".jinkei_label").text("知");
        $(".param_label_teki").text("精神");

        $("#taijyutsu").hide();
    } else if ($.inArray(BattleType, DEX_LIST) > -1) {
        $("#param_label").text("器用さ");
        $(".param_label_teki").text("体力");
        $(".jinkei_label").text("器");
        $("#taijyutsu").hide();
    } else if (BattleType === "tai") {
        $("#param_label").text("腕力");
        $(".param_label_teki").text("体力");
        $(".jinkei_label").text("腕");

        $("#taijyutsu").show();
    } else {
        $("#param_label").text("腕力");
        $(".param_label_teki").text("体力");
        $(".jinkei_label").text("腕");

        $("#taijyutsu").hide();
    }
}

////////////////////////


function setDefaultSkillIryoku() {
    let skillId = $('#skill option:selected').val();
    let skill = SKILL_MASTER[skillId];
    let iryoku = (skill === undefined) ? 7 : skill['SkillIryoku'];
    $("#skill_val").val(iryoku);
}

/**
 * 計算処理
 * @returns {undefined}
 */
function damageCalc() {
    var skill = Number($("#skill_val").val()); // 技威力
    var skill_range = $("#skill_grade").val();    
    if(skill_range == "ALL" || skill != "") {
        $("#CALC_MODE").addClass("d-none");
        _calc(skill);
    } else {
        $("#CALC_MODE").removeClass("d-none");
        var x = IRYOKU_LIST[skill_range].split("〜");
        var min = Number(x[0]);
        var max = Number(x[1])
        dispDamageRangeClear();
        for(var x2 = min; x2 <= max; x2++) {
            _calc(x2, true);
        }
    }
}



function _calc(skill, IryokuCalc = false) {
    var weapon = Number($("#weapon").val());
    let other = Number($("#ability_other").val());
    holy1 = $("#holystone1").val();
    holy2 = $("#holystone2").val();
    holy3 = $("#holystone3").val();
    extraforce = $("#extraforce").val();
    extraforce = 1 + (extraforce/100);
    
    let holy = Number(holy1) + Number(holy2) + Number(holy3);
    adv = Number($("#adventDamage").val());
    
    var ability = other + holy + adv;
    var resist = Number($("#resist").val());
    var skillId = $("#skill").val();
    var rank = Number($("#skill_rank").val());
    
    var vit = Number($("#vit").val());
    var debuff_per = Number($("#debuff_per").val());
    
    var master = Number($("#masterDamage").val());

    var skillInfo = SKILL_MASTER[skillId];
    if(skillInfo == undefined) {
        skillInfo = {
            "BattleType": $('#type option:selected').text(),
        };
    }

    var baseStr = Number($("#styleSTR").val());
    var baseDex = Number($("#styleDEX").val());
    var baseAgi = Number($("#styleAGI").val());
    var baseInt = Number($("#styleINT").val());
    var str = baseStr + Math.floor(Number($("#charSTR").val()) * (Number($("#jinkeiSTR").val()) + Number($("#abSTR").val()) ) / 100);
    var dex = baseDex + Math.floor(Number($("#charDEX").val()) * (Number($("#jinkeiDEX").val()) + Number($("#abDEX").val()) ) / 100);
    var agi = baseAgi + Math.floor(Number($("#charAGI").val()) * (Number($("#jinkeiAGI").val()) + Number($("#abAGI").val()) ) / 100);
    var int = baseInt + Math.floor(Number($("#charINT").val()) * (Number($("#jinkeiINT").val()) + Number($("#abINT").val()) ) / 100);

    // 依存ステータスの変更
    var type = (skillInfo['SpecialType'] == '知力') ? "jutsu" : $("#type").val();
    var battleType = skillInfo['BattleType'];

    var attackParam = str;
    var attackParamBase = baseStr;
    if　(skillInfo['SkillType'] === "術" || skillInfo['SpecialType'] == '知力') {
        attackParam = int;
        attackParamBase = baseInt;
    } else if (["小剣", "弓", "銃"].indexOf(battleType) > -1) {
        attackParam = dex;
        attackParamBase = baseDex;
    }

    dRange = damageStepCulc(type, attackParam, agi, weapon, skill, rank, vit * (1-(debuff_per/100)), master, ability, resist);
    if(!IryokuCalc) {
        dispDamageRangeClear();
    }
    dispDamageRange(skill, dRange, extraforce);

    var masterType = type;
    if (skillInfo['SpecialType'] == '知力' 
    || $.inArray(masterType, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
        masterType = "tsue";
    }
    if (masterType === "ju" || masterType === "sken" || masterType === "yumi" ) {
        st = `器 ${attackParamBase}`;
        stCalc = `器 ${attackParam}`;
    } else if (masterType === "tsue") {
        st = `知 ${attackParamBase}`;
        stCalc = `知 ${attackParam}`;
    } else if (masterType === "tai") {
        st = `腕 ${attackParamBase} / 速 ${baseAgi}`;
        stCalc = `腕 ${attackParam} / 速 ${agi}`;
    } else {
        st = `腕 ${attackParamBase}`;
        stCalc = `腕 ${attackParam}`;
    }

    SAVE_OPTION['weapon'] = weapon;
    SAVE_OPTION['master'] = $("#master").val();
    SAVE_OPTION['masterPer'] = master;
    SAVE_OPTION['ab'] = other;
    SAVE_OPTION['abStone'] = holy;
    SAVE_OPTION['enemy'] = vit;
    SAVE_OPTION['resist'] = resist;
    SAVE_OPTION['damage'] = dRange[5];
    SAVE_OPTION['iryoku'] = skill;
    SAVE_OPTION['rank'] = rank;
    SAVE_OPTION['status'] = st;
    SAVE_OPTION['statusCalc'] = stCalc;
}

function setMasterDamageRate(){
    var master = masterLevel($("#master").val()) * 100;
    var per = Math.round(master * 100) / 100;
    SAVE_OPTION['master'] = $("#master").val();
    SAVE_OPTION['masterPer'] = per;
    var masterOD = overdrive($("#master").val()) * 100;
    var perOd = Math.round(masterOD * 100) / 100;
    $("#masterDamage").val(per);    
    $("#masterODDamage").val(perOd);    
}


function dispDamageRangeClear() {
    $("table#damageRangeTable tbody *").remove();
    $(".DAMAGE_TMPL").remove();
}
function dispDamageRange(skill, dRange, extraforce) {
    $tmpl = $("#DAMAGE_LIST_TEMPLATE").clone().removeAttr("id").removeClass("d-none").addClass("DAMAGE_TMPL");

    $tmpl.find(".iryokuCol").removeClass("d-none");
    $tmpl.find(".iryoku").html(number_format(skill));    
    for (i = 0; i < dRange.length; i++) {
        let d = Math.floor(dRange[i] * extraforce);
        $tmpl.find(".d" + (i+1)).html(number_format(d))
    }
    $("#DAMAGE_LIST_TEMPLATE").after($tmpl);
}


function Compare(a, b) {
    return arr[a] - arr[b];
}

var GOUREI = {};
var ALWAYS_ABILITY = [];
var NOW_ABILITY_BUFF = [];
var BUFF_ABILITY = [];
var DEBUFF_ABILITY = [];

/**
 * ターン開始時、ラウンド開始時100％のものだけ設定する
 */
function setAbilityBuffDeBuff(styleInfo){
    // リセット
    GOUREI = {};
    ALWAYS_ABILITY = [];
    NOW_ABILITY_BUFF = [];
    BUFF_ABILITY = [];
    DEBUFF_ABILITY = [];

    for(var lv in styleInfo['StyleAbilityIds']){
        abInfo = ABILITY_MASTER[styleInfo['StyleAbilityIds'][lv]];
        // アビリティの複合バフは分解して登録してあるので、バラした物は使わない
        if(abInfo['Name'] == "ショウタイム") {
            addShowTime();
            continue;
        }

        for(abCategory of abInfo['Attr']){
            if(abCategory['main'] == "自身強化(バフ)" 
            || abCategory['main'] == "敵弱体化(デバフ)"
            || abCategory['main'] == "全員強化(バフ)"){

                per = filterNumber(abCategory['size']); // "大(20%)"
                time = filterNumber(abCategory['time']); // "必ず(100%)"
                tmp3 = abCategory['when'].split(" ");
                trigger = tmp3[0].trim().replace(); // "Weak攻撃命中時","攻撃命中寺","ターン開始時","ラウンド開始時",""
                trigger = (["味方が全員生存している時"].indexOf(trigger) > -1) ? "常時": trigger;

                // バフ使わない場合は確定発動以外は無視
                if(time != 100) {
                    continue;
                }
                if ($.inArray(trigger, ["ターン開始時", "ラウンド開始時", "常時"]) == -1) {
                    continue;
                }

                var attr = abCategory['sub'].replace(/ダメージ/g, ''); // 斬属性ダメージ,全ダメージ
                attr = attr.replace (/属性/g, ''); // 斬属性ダメージ

                var subs = attr.split("と"); // 「腕力と体力」 「全」「斬」
                var setBuff = false;
                var setDeBuff = false;
                var setGouirei = false;
                var params = [];
                // バフするパラメータを配列でいれる
                for(sub of subs){
                    if(["全","斬","打","突","熱","冷","雷","陰","陽"].indexOf(sub) > -1) {
                        setGouirei = true;
                    } else {
                        params.push(PARAM_KEY[PARAM_NAME.indexOf(sub)]);
                        if(abCategory['main'] == "敵弱体化(デバフ)") {
                            if(["体力", "精神"].indexOf(sub) > -1) {
                                setDeBuff = true;
                            }
                        } else if( ["腕力", "素早さ", "器用さ", "知力"].indexOf(sub) > -1){
                            // バフ利用
                            setBuff = true;
                        }

                    }
                }

                if(setBuff){
                    // 同名アビリティは後勝ち（腕力、素早さ、腕力と素早さ。で登録してあるはず）
                    BUFF_ABILITY = BUFF_ABILITY.filter(ab => ab['NAME'] != abInfo['Name']);
                    BUFF_ABILITY.push({
                        "NAME": abInfo['Name'],
                        "PARAM": params,
                        "TIME": time,
                        "PER" : per,    
                    });
                } else if(setDeBuff){
                    // 同名アビリティは後勝ち（腕力、素早さ、腕力と素早さ。で登録してあるはず）
                    DEBUFF_ABILITY = DEBUFF_ABILITY.filter(ab => ab['NAME'] != abInfo['Name']);
                    DEBUFF_ABILITY.push({
                        "NAME": abInfo['Name'],
                        "PARAM": params,
                        "TIME": time,
                        "PER" : per,
                    });
                } else if (setGouirei) {
                    turn = abCategory['turn'].replace('効果','').replace('ターン', ''); // 効果2ターン
    
                    tmp3 = abCategory['when'].split(" ");
                    trigger = tmp3[0].trim().replace(); // "Weak攻撃命中時","攻撃命中寺","ターン開始時","ラウンド開始時",""
                    trigger = (["味方が全員生存している時"].indexOf(trigger) > -1) ? "常時": trigger;
                    var data = {
                        "NAME" : abInfo['Name'],
                        "ATTR" : attr, // 全,斬,打,突など
                        "TIME" : time, // "必ず(100%)"
                        "PER" : filterNumber(abCategory['size']), // "大(20%)",
                        "TURN": Number(turn),
                        "LIMIT": 1000, // 常時発動
                    };
                    if(trigger != "常時") {
                        if(GOUREI[trigger] == undefined){
                            GOUREI[trigger] = [];
                        }
                        GOUREI[trigger].push(data);
                    } else {
                        ALWAYS_ABILITY.push(data);             
                    }
                }
            }
        }
    }
    // バフ量調整
    var NOW_BUFF = {"STR":0,"DEX":0,"AGI":0,"INT":0};
    for(buffInfo of BUFF_ABILITY) {
        for(p of buffInfo["PARAM"]) {
            NOW_BUFF[p] += buffInfo["PER"];
        }
    }
    for(param in NOW_BUFF) {
        $(`#buf${param}`).html(NOW_BUFF[param]);
    }

}

function setAbBox(id, abIdList){
    $(`${id}`).val(0);
    $(`${id} option`).each(function(i){
        var targetId = $(this).attr("abId");
        var val = $(this).val();
        if(abIdList.indexOf(targetId) > -1){
            $(this).prop('selected', true);
            //$(`${id}`).val(val);
            return false; // break
        }
    });
};

