var UPDATE_DATE = "2021/09/11";

var RENSEI_ATTRS = {
    "A": {"Name":"威力+", "Type":"All", "Target": "None", "A":9, "S":18,"SS":27},
    "A1": {"Name":"斬+", "Type":"Attrs", "Target": "斬", "A":11, "S":22,"SS":33},
    "A2": {"Name":"打+", "Type":"Attrs", "Target": "打", "A":11, "S":22,"SS":33},
    "A3": {"Name":"突+", "Type":"Attrs", "Target": "突", "A":11, "S":22,"SS":33},
    //"熱+":[11 , 22 , 33],
    //"冷+":[11 , 22 , 33],
    //"陽+":[11 , 22 , 33],
    //"陰+":[11 , 22 , 33],
    "R1": {"Name":"全体攻撃+", "Type":"Range", "Target": "敵全体", "A":10, "S":20,"SS":30},
    "R2": {"Name":"たて攻撃+", "Type":"Range", "Target": "敵縦一列", "A":13, "S":26,"SS":39},
    "R3": {"Name":"よこ攻撃+", "Type":"Range", "Target": "敵横一列", "A":13, "S":26,"SS":39},
    "R4": {"Name":"単体攻撃+", "Type":"Range", "Target": "敵単体", "A":12, "S":24,"SS":36},
    "S1": {"Name":"SF1+", "Type":"Series", "Target": "SF1", "A":12, "S":24,"SS":36},
    "S2": {"Name":"SSG+", "Type":"Series", "Target": "SS", "A":12, "S":24,"SS":36},
    "S3": {"Name":"SaGaRS+", "Type":"Series", "Target": "RSR", "A":12, "S":24,"SS":36},
    "S4": {"Name":"GB+", "Type":"Series", "Target": "GB", "A":12, "S":24,"SS":36},
    "G1": {"Name":"男性+", "Type":"Gender", "Target": "男", "A":10, "S":20,"SS":30},
    "G2": {"Name":"女性+", "Type":"Gender", "Target": "女", "A":10, "S":20,"SS":30},
    "G3": {"Name":"性別不明+", "Type":"Gender", "Target": "不明", "A":10, "S":20,"SS":30},
};

function _noLoginInitial() {
    MY_RENSEI_LIST_UNLOADED = false;
    console.log("_noLoginInitial");
}

var NOW_UID = getMyId();
var IS_LOGIN = (NOW_UID.indexOf("guest") == -1);
var MY_DATA = {};
var MY_RENSEI_LIST = {};
var MY_RENSEI_LIST_UNLOADED = true;

function _initial() {
    $(".IS_LOGIN").removeClass("d-none");
    let myCharFunc = readUserData("CHAR", async function (result) {
        MY_DATA = result;
    });
    let myStyleLvFunc = readUserDataNext("RENSEI", function (read) {
        MY_RENSEI_LIST_UNLOADED = false;
        MY_RENSEI_LIST = (read != null) ? read : {};
        dispMyWeaponList("大剣");
    });
    Promise.all([myCharFunc, myStyleLvFunc]);
}

$(document).ready(function ($) {
    initialDisplaySetUp();
    reCalcAndDispChar();
});

/**
 * ゴミ箱アイコンクリック
 */
$(document).on('click', '.TRASH_BTN', function (e) {
    // WEAPON_ROWは動かさない
    e.stopPropagation();
    // 削除処理
    wp = $(this).attr("data-weapon");
    id = $(this).attr("data-id");
    MY_RENSEI_LIST[wp] = MY_RENSEI_LIST[wp].filter(item => item.id != id);
    $(this).parents(".weapon-border").remove();
});

/**
 * 保存武器クリック
 */
$(document).on('click', '.WEAPON_ROW', function () {
    $trash = $(this).find(".TRASH_BTN");
    wp = $trash.attr("data-weapon");
    id = $trash.attr("data-id");
    rensei = MY_RENSEI_LIST[wp].filter(item => item.id == id);
    rensei = rensei[0];
    _rareSet(rensei, 1);
    _rareSet(rensei, 2);
    _rareSet(rensei, 3);

    // 対象キャラ選定
    reCalcAndDispChar();
});
function _rareSet(rensei, no) {
    var idx = rensei[`ab${no}`];
    var rare = rensei[`ab${no}R`];
    $(`#ab${no}`).val(idx);
    $(`#ab${no}Rare`).find(".weapon-icon-button").each(function(){
        $(this).removeClass("filterActive");
        if($(this).attr("data-rare") == rare) {
            $(this).addClass("filterActive");
        }
    });
    $(`#ab${no}Rare`).find(".AB_PER").val(RENSEI_ATTRS[idx][rare]);
    
}
    
/**
 * メモを変更した場合
 */
$(document).on('change', '.AB_MY_NAME', function () {
    $("#SAVE_NAME").addClass("icon_btn_positive")
    .removeClass("icon_btn_negative");

    $trash = $(this).parents(".weapon-border").find(".TRASH_BTN");
    wp = $trash.attr("data-weapon");
    id = $trash.attr("data-id");

    for(idx in MY_RENSEI_LIST[wp]) {
        if(MY_RENSEI_LIST[wp][idx]['id'] == id) {
            MY_RENSEI_LIST[wp][idx]['Name'] = $(this).val();
            break;
        }
    }    
});

/**
 * 名前を保存ボタン
 */
$(document).on('click', '#SAVE_NAME', function () {
    $(this).slideUp(function(){
        $(this).removeClass("icon_btn_positive");
        $(this).addClass("icon_btn_negative");
        $(this).slideDown();
    });
    save();
});


/**
 * 保存ボタンクリック
 */
$(document).on('click', '#SAVE_NEW', function () {
    if(MY_RENSEI_LIST_UNLOADED) {
        return;
    }

    var weaponType = $("#SAVE_NEW").attr("data-weapon");
    if(typeof MY_RENSEI_LIST[weaponType] == "undefined") {
        MY_RENSEI_LIST[weaponType] = [];
    }
    // Dateオブジェクトを作成
    var date = new Date() ;
    // UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
    var newId = Math.floor( date.getTime() / 1000 ) ;
    var ab1 = $("#ab1").val();
    var ab2 = $("#ab2").val();
    var ab3 = $("#ab3").val();
    var ab1Rare = $("#AB1_AREA").find(".filterActive").attr("data-rare");
    var ab2Rare = $("#AB2_AREA").find(".filterActive").attr("data-rare");
    var ab3Rare = $("#AB3_AREA").find(".filterActive").attr("data-rare");
    var ab1Per = Number($("#AB1_AREA").find(".AB_PER").val());
    var ab2Per = Number($("#AB2_AREA").find(".AB_PER").val());
    var ab3Per = Number($("#AB3_AREA").find(".AB_PER").val());
    var opt = Number($("#AB_OPTION").val());
    MY_RENSEI_LIST[weaponType] = makeList(MY_RENSEI_LIST[weaponType]);
    MY_RENSEI_LIST[weaponType].push({
        "id": newId,
        "wp": weaponType,
        "ab1":ab1, "ab2":ab2, "ab3":ab3, 
        "ab1R":ab1Rare, "ab2R":ab2Rare, "ab3R":ab3Rare, 
        "total":ab1Per+ab2Per+ab3Per,
        "option":opt,
        "Name":""
    });

    dispMyWeaponList(weaponType);

    save();
});

function makeList(list) {
    if(typeof list == "undefined") {
        list = [];
    }
    return list;
}

function dispMyWeaponList(weaponType) {
    if(MY_RENSEI_LIST_UNLOADED) {
        return;
    }
    $("#WEAPON_TABLE > tbody").html("");
    if(typeof MY_RENSEI_LIST[weaponType] == "undefined") {
        MY_RENSEI_LIST[weaponType] = [];
    }
    $LIST = MY_RENSEI_LIST[weaponType];
    $LIST.sort(function(a,b){
        if(a.total < b.total) return 1;
        if(a.total > b.total) return -1;
        return 0;
    });
    
    for(idx in $LIST) {
        var rensei = $LIST[idx];
        total = 0;
        total += Number(RENSEI_ATTRS[rensei[`ab1`]][rensei[`ab1R`]]);
        total += Number(RENSEI_ATTRS[rensei[`ab2`]][rensei[`ab2R`]]);
        total += Number(RENSEI_ATTRS[rensei[`ab3`]][rensei[`ab3R`]]);    
        $tr = createTableRecord(rensei, total);
        $tr.find(".TRASH_BTN").attr("data-weapon", weaponType);
        $tr.find(".TRASH_BTN").attr("data-id", rensei['id']);
        $("#WEAPON_TABLE > tbody").append($tr);
    }
}

function createTableRecord(rensei, total) {
    $tr = $("#LIST_TR_TEMPLATE").clone().removeClass("d-none").attr("id","");
    $tr.find(".WP_ICON").append(getWeaponIcon("S", ICON_NAME[rensei['wp']], ""));
    if(typeof rensei['option'] == "undefined") {
        $tr.find(".OPTION_LABEL").remove();
    } else {
        $tr.find(".OPTION_LABEL").append(OPTION_LIST[rensei['option']] + "+");
    }
    

    $ab = $tr.find(".AB_NAME").clone().removeClass("AB_NAME d-none");
    $tr.find(".AB_NAME").before(addAbilityRow($ab.clone(), rensei, 1));
    $tr.find(".AB_NAME").before(addAbilityRow($ab.clone(), rensei, 2));
    $tr.find(".AB_NAME").before(addAbilityRow($ab.clone(), rensei, 3));
    $tr.find(".ALL_PER").append(`+${total}%`);
    $tr = splitAbilityAttr($tr, rensei);
    $tr.find(".AB_MY_NAME").val(rensei['Name']);
    return $tr;    
}

function addAbilityRow($tr, rensei, no) {
    rare = rensei[`ab${no}R`].toLowerCase();
    attrs = RENSEI_ATTRS[rensei[`ab${no}`]];
    //"A": {"Name":"威力+", "Type":"All", "Target": "None", "A":9, "S":18,"SS":27},
    $tr.find(".icon_rare_xx").addClass(`icon_rare_${rare}`);
    $tr.find(".font-xx").addClass(`font-${rare}`);
    $tr.find(".font-xx").append(`${attrs['Name']}${attrs[rensei[`ab${no}R`]]}%`);
    return $tr;
}
function splitAbilityAttr($tr, rensei) {
    var types = {"All":[],"Attrs":[], "Range":[], "Series":[], "Gender":[]};
    attrs = RENSEI_ATTRS[rensei[`ab1`]];

    types[attrs['Type']] = makeList(types[attrs['Type']]);    
    types[attrs['Type']].push(`${attrs['Name']}${attrs[rensei[`ab1R`]]}%`);
    attrs = RENSEI_ATTRS[rensei[`ab2`]];
    types[attrs['Type']].push(`${attrs['Name']}${attrs[rensei[`ab2R`]]}%`);
    attrs = RENSEI_ATTRS[rensei[`ab3`]];
    types[attrs['Type']].push(`${attrs['Name']}${attrs[rensei[`ab3R`]]}%`);
    for(type in types) {
        $tr.find(`.${type}_PER`).append(types[type].join("<br>"));
    }
    return $tr;
}



var isDisplay = false;
var TopBtn = $('#PageTopBtn');
TopBtn.css('bottom', '-200px');
//スクロール位置が100でボタンを表示
$(window).scroll(function () {
    if ($(this).scrollTop() > 800) {
        if (isDisplay == false) {
            isDisplay = true;
            TopBtn.stop().animate({'bottom': '-10px', 'right': '10px'}, 200);
        }
    } else {
        if (isDisplay) {
            isDisplay = false;
            TopBtn.stop().animate({'bottom': '-200px'}, 200);
        }
    }
});

//ボタンを押下するとトップへ移動
TopBtn.click(function () {
    $("html,body").animate({scrollTop: $('#FILTER').offset().top});
    return false;
});

function createCharBase(charInfo){
    console.log(charInfo);
    let dotId = charInfo['DotId'];
    let id = charInfo['Id'];
    let name = charInfo['Name'];
    let attrs = charInfo['AttackAttrs'];    
    let ranges = charInfo['AttackRanges'];    
    let series = charInfo['Series'];
    let gender = charInfo['Gender'];
    let weaponType = charInfo['WeaponType'];
    
    
    let genderClass = "fa-question gender-unknown";
    if(gender == "男") {
        genderClass = "fa-mars gender-male";
    } else if(gender == "女"){
        genderClass = "fa-venus gender-famale";
    }

    var hp = 0;
    if (typeof MY_DATA[id] !==  "undefined") {
        if (typeof MY_DATA[id]['HP'] !==  "undefined") {
            hp = Number(MY_DATA[id]['HP']);
            hp = isNaN(hp) ? 0 : hp;
        }
    };

    let base = $(`<div class="dot-base yubi" style="margin-bottom: 15px;"
        data-id="${id}" 
        data-gender="${gender}" data-series="${series}" 
        data-attrs="${attrs}" data-ranges="${ranges}"
        data-weapon="${weaponType}" data-hp="${hp}">`);
    var baseUrl = getImgPath(`icon/icon_base_common.png`);
    let baseImg = $(`<img data-src="${baseUrl}" class="dot-base-circle lazyload">`);
    base.append(baseImg);
    let genderIcon = $(`<i class="fas ${genderClass} gender-icon"></i>`);
    base.append(genderIcon);
    let perBanner = $(`<div class="text-center text-nowrap per-banner"><span class="RENSEI_PER">0</span><span class="per">%</span></div>`);
    base.append(perBanner);    
    let seriesBanner = $(`<div class="text-center text-nowrap series-banner">${series}</div>`);
    base.append(seriesBanner);    
    let nameBanner = $(`<div class="text-center text-nowrap dot-name-label">${name}</div>`);
    base.append(nameBanner);

    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    var dotPath = getImgPath(`dot/${pngName}.png`);
    let charDot = $(`<div class="char-dot-base char-aruku-left2 char dot_mid dot dot${pngName} dot-base-char lazyload"
    data-bg="${dotPath}" id="dot${pngName}" data-id="${id}" onclick=""></div>`);
    base.append(charDot);

    return base.clone();
}

function _incrementAbilityPer($base, attrs, per) {
    per = Number(per);
    // <div class="dot-base" data-gender="男" data-series="RS2" data-ranges="敵単体" data-weapon="大剣">
    // 0: {"Name":"威力+", "Type":"All", "Target": "None", "A":9, "S":18,"SS":27},
    // 1: {"Name":"斬+", "Type":"Type", "Target": "斬", "A":11, "S":22,"SS":33},
    // 8: {"Name":"全体攻撃+", "Type":"Range", "Target": "敵全体", "A":10, "S":20,"SS":30},
    // 12: {"Name":"SF1+", "Type":"Series", "Target": "SF1", "A":12, "S":24,"SS":36},
    // 16: {"Name":"男性+", "Type":"Gender", "Target": "男", "A":10, "S":20,"SS":30},
    var type = attrs["Type"];
    var target = attrs["Target"];
    var point = Number($base.find(".RENSEI_PER").html());
    if (type == "All") {
        point += per;
    } else if (type == "Attrs" && $base.attr("data-attrs").indexOf(target) > -1) {
        point += per;
    } else if (type == "Range" && $base.attr("data-ranges").indexOf(target) > -1) {
        point += per;
    } else if (type == "Series") {
        if((target == "GB" && $base.attr("data-series").indexOf(target) > -1)
        || (target != "GB" && $base.attr("data-series") == target) ) {
            $base.find(".series-banner").addClass("blink");
            point += per;
        }
    } else if (type == "Gender" && $base.attr("data-gender") == target) {
        $base.find(".gender-icon").addClass("blink-gender");
        point += per;
    }
    $base.find(".RENSEI_PER").html(point);
    $base.attr("data-per", point);
    return $base;
}

function reCalcAndDispChar() {
    $("#CHAR_LIST").html("");
    $("#SKILL_TABLE > tbody").html("");
    
    var choiseType = "";
    $(".FILTER_LIST").each(function(){
        if($(this).find(".weapon-icon-button").hasClass("filterActive")) {
            choiseType = $(this).attr("data-type");
        }
    });

    var tmpList = [];
    for (let i in CHAR_MASTER) {
        var charInfo = CHAR_MASTER[i];
        if (charInfo == undefined || typeof charInfo['Holders'] == "undefined") {
            continue;
        }

        let dotId = charInfo['DotId'];
        let series = charInfo['Series'];
        let weaponType = charInfo['WeaponType'];


        var base = createCharBase(charInfo);
        base = _incrementAbilityPer(base, RENSEI_ATTRS[$("#ab1").val()], $("#AB1_AREA").find(".AB_PER").val());
        base = _incrementAbilityPer(base, RENSEI_ATTRS[$("#ab2").val()], $("#AB2_AREA").find(".AB_PER").val());
        base = _incrementAbilityPer(base, RENSEI_ATTRS[$("#ab3").val()], $("#AB3_AREA").find(".AB_PER").val());

        if (weaponType == choiseType) {
            tmpList.push(base);
        }
    }
    tmpList = tmpList.sort((a, b) => {
        // 
        if (Number(a.attr("data-per")) > Number(b.attr("data-per"))
        || (Number(a.attr("data-per")) == Number(b.attr("data-per")) && Number(a.attr("data-hp")) > Number(b.attr("data-hp")))
        ) {
            return -1;
        }
        return 1;
    });    
    for(base of tmpList) {
        $("#CHAR_LIST").append(base);
    }

}


/**
 * アビリティのセレクト
 */
$(document).on('change', '.RENSEI_AB', function () {

    var idx = $(this).val();
    var $parent = $(this).parents(".col-12");
    var rare = $parent.find(".filterActive").attr("data-rare");
    $parent.find(".AB_PER").val(RENSEI_ATTRS[idx][rare]);

    // 対象キャラ選定
    reCalcAndDispChar();    
});

/**
 * レアリティのセレクト
 */
 $(document).on('click', '.RARE_BUTTON', function () {
    var $parentUl = $(this).parents(".nav");
    $parentUl.find(".style_icon_limit_base").each(function(){
        $(this).removeClass("filterActive");
    });
    $(this).find(".style_icon_limit_base").addClass("filterActive");
    // 
    var rare = $(this).find(".style_icon_limit_base").attr("data-rare");
    var $parentDiv = $(this).parents(".col-12");
    var idx = $parentDiv.find(".RENSEI_AB").val();
    $parentDiv.find(".AB_PER").val(RENSEI_ATTRS[idx][rare]);

    // 対象キャラ選定
    reCalcAndDispChar();
});

/**
 * フィルタークリック
 */
$(document).on('click', '.FILTER_LIST', function () {
    if ($(this).find(".FILTER_BUTTON").hasClass("filterActive")) {
        return;
    }
    // ボタン差し替え絞り込み
    $(".FILTER_LIST").each(function () {
        $(this).find(".FILTER_BUTTON").removeClass("filterActive");
    });
    $(this).find(".FILTER_BUTTON").toggleClass("filterActive");
    $("#SAVE_NEW").attr("data-weapon", $(this).attr("data-type"));

    // 対象キャラ選定
    reCalcAndDispChar();
    // 装備リロード
    dispMyWeaponList($(this).attr("data-type"));
});

/**
 * キャラドットのクリック
 */
$(document).on('click', '.dot-base', function () {
    var id = $(this).attr("data-id");
    selectBestWeapon($(this));
    var charInfo = CHAR_MASTER[id];
    // スタイルごとの技一覧を取得（練達調整）
    var skillList = {};
    for (let styleId of charInfo['Holders']) {
        var styleInfo = STYLE_MASTER[styleId];
        if(styleInfo === undefined){
            continue;
        }
        skillList[styleId] = [];
        for (let skillId of styleInfo['SkillIds']) {
            let skillInfo = SKILL_MASTER[skillId];
            skillList[styleId].push(skillInfo);
            if(skillInfo['Rentatsu'] != undefined && skillInfo['isRentatsu'] == undefined ){
                skillList[styleId].push(SKILL_MASTER[skillInfo['Rentatsu']]);
            }
        }
    }
    $("#SKILL_TABLE > tbody").html("");
    for (let styleId in skillList) {
        var styleInfo = STYLE_MASTER[styleId];
        var master = masterLevel(WEAPON_MAP[styleInfo["WeaponType"]]["master"]);
        
        // スタイルの持つ全技チェック
        for (let i in skillList[styleId]) {
            skillInfo = skillList[styleId][i];
            $tr = $("#TR_TEMPLATE").clone().attr("id","").removeClass("d-none");
            if(i == 0) {
                $tr.find(".ICON").attr("rowspan",skillList[styleId].length);
            } else {
                $tr.find(".ICON").remove();
            }
            // 名称
            $tr.find(".NAME").html(skillInfo['Name']);
            // 武器種
            $tr.find(".BATTLE_ICON").attr("src", getImgPath(`icon/${ICON_LIST[skillInfo['BattleType']]}_sm.png`));
            // 属性設定
            skillInfo['AttackAttributes'].split(',').forEach(function (value) {
                var imgPath = getImgPath(`icon/${ICON_LIST[value]}.png`);
                let img = $(`<img class="icon_xs" src="${imgPath}" loading="lazy">`);
                $tr.find(".ATTR").append(img.clone());
            });
            $tr.find(".ATTR").attr("data-attrs", skillInfo['AttackAttributes']);

            var iryoku = (skillInfo['SkillIryoku'] === 0) ? IRYOKU_LIST[skillInfo['PowerGrade']] : skillInfo['SkillIryoku'];
            iryoku = `${skillInfo['PowerGrade']} (${iryoku})`;
            $tr.find(".IRYOKU").html(iryoku);
            $tr.attr("data-range",skillInfo['AttackArea'].replace("ランダム","敵単体"));
            $tr.find(".RANGE_L").html(skillInfo['AttackArea']);
            $tr.find(".RANGE_S").html(AREA_SHORT[skillInfo['AttackArea']]);

            $tr.find(".PER").html("+50%");

            var styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, "", true);
            styleIcon.find(".style_icon_rare_base").attr("style", "width:13px; height:13px;");
            $tr.find(".ICON").prepend(styleIcon);
            if(skillInfo['FlavorText'].indexOf("回復") != 0) {
                $tr = _incrementAbilityPerForSkill($(this), $tr, RENSEI_ATTRS[$("#ab1").val()], $("#AB1_AREA").find(".AB_PER").val());
                $tr = _incrementAbilityPerForSkill($(this), $tr, RENSEI_ATTRS[$("#ab2").val()], $("#AB2_AREA").find(".AB_PER").val());
                $tr = _incrementAbilityPerForSkill($(this), $tr, RENSEI_ATTRS[$("#ab3").val()], $("#AB3_AREA").find(".AB_PER").val());            
            } else {
                $tr.find(".SKILL_PER").parent().html("--");
            }
            //var ability = 0, vit = 160, resist = -35, weapon= 45, master=12;
            //damageResult = culcSkillDamageWithStyle(charInfo, LIMIT_BASE, styleInfo, 50, skillInfo, 99, weapon, master, ability, vit, resist);        
            $("#SKILL_TABLE > tbody").append($tr);
        }
    }
    $("html,body").animate({scrollTop: $('#CHAR_AREA').offset().top - 100}, 500, 'swing');

});

function selectBestWeapon($base) {
    var id = $base.attr("data-id");
    var charInfo = CHAR_MASTER[id];
    let weaponType = charInfo['WeaponType'];
    if(typeof MY_RENSEI_LIST[weaponType] == "undefined") {
        return;
    }
    var allList = [];
    var multiList = [];
    var singleList = [];
    for(idx in MY_RENSEI_LIST[weaponType]) {
        rensei = MY_RENSEI_LIST[weaponType][idx];
        base = $base.clone();
        var all = 0, single = 0, multi = 0;
        [all, single, multi] = getAbilityPer(base, RENSEI_ATTRS[rensei[`ab1`]], rensei[`ab1R`], all, single, multi);
        [all, single, multi] = getAbilityPer(base, RENSEI_ATTRS[rensei[`ab2`]], rensei[`ab2R`], all, single, multi);
        [all, single, multi] = getAbilityPer(base, RENSEI_ATTRS[rensei[`ab3`]], rensei[`ab3R`], all, single, multi);
        
        allRec = Object.assign({}, rensei);
        allRec['total'] = all;
        singleRec = Object.assign({}, rensei);
        singleRec['total'] = single;
        multiRec = Object.assign({}, rensei);
        multiRec['total'] = multi;
        allList.push(allRec);
        singleList.push(singleRec);
        multiList.push(multiRec);
    }
    
    addStone(allList, "#ALL_STONE");
    addStone(singleList, "#SINGLE_STONE");
    addStone(multiList, "#MULTI_STONE");
}
function addStone(list, id) {
    list.sort(function(a,b){
        if(a.total <= b.total) return 1;
        return -1;
    });

    $(id).html("");
    $header = $("#WEAPON_TABLE > thead").clone();
    $(id).append($header);
    for(idx in list) {
        if(idx == 3) {
            break;
        }
        $tr = createTableRecord(list[idx], list[idx]['total']);
        text = $tr.find(".AB_MY_NAME").val();
        $tr.find(".AB_MY_NAME").before(text);
        $tr.find(".AB_MY_NAME").remove();
        $tr.find(".TRASH_BTN").remove();
        $(id).append($tr);
    }
}

function getAbilityPer($base, attrs, rare, all, single, multi){
    var type = attrs["Type"];
    var target = attrs["Target"];
    var per = attrs[rare];
    if (type == "All"
    || (type == "Attrs" && $base.attr("data-attrs").indexOf(target) > -1)
    || (type == "Gender" && $base.attr("data-gender") == target)
    ) {
        all += per;
        single += per;
        multi += per;
    } else if (type == "Series") {
        if((target == "GB" && $base.attr("data-series").indexOf(target) > -1)
        || (target != "GB" && $base.attr("data-series") == target) ) {
            all += per;
            single += per;
            multi += per;
        }
    } else if (target == "敵全体") {
        multi += per;
    } else if (target == "敵単体") {
        single += per;
    }    
    return [all, single, multi];
}

function _incrementAbilityPerForSkill($base, $tr, attrs, per) {
    per = Number(per);
    // <div class="dot-base" data-gender="男" data-series="RS2" data-ranges="敵単体" data-weapon="大剣">
    // 0: {"Name":"威力+", "Type":"All", "Target": "None", "A":9, "S":18,"SS":27},
    // 1: {"Name":"斬+", "Type":"Type", "Target": "斬", "A":11, "S":22,"SS":33},
    // 8: {"Name":"全体攻撃+", "Type":"Range", "Target": "敵全体", "A":10, "S":20,"SS":30},
    // 12: {"Name":"SF1+", "Type":"Series", "Target": "SF1", "A":12, "S":24,"SS":36},
    // 16: {"Name":"男性+", "Type":"Gender", "Target": "男", "A":10, "S":20,"SS":30},
    var type = attrs["Type"];
    var target = attrs["Target"];
    var point = Number($tr.find(".SKILL_PER").html());

    if (type == "All") {
        point += per;
    } else if (type == "Attrs" && $tr.find(".ATTR").attr("data-attrs").indexOf(target) > -1) {
        $tr.find(".ATTR").addClass("light-blink");
        point += per;
    } else if (type == "Range" && $tr.attr("data-range") == target) {
        $tr.find(".RANGE").addClass("light-blink");
        point += per;
    } else if (type == "Series") {
        if((target == "GB" && $base.attr("data-series").indexOf(target) > -1)
        || (target != "GB" && $base.attr("data-series") == target) ) {
            point += per;
        }
    } else if (type == "Gender" && $base.attr("data-gender") == target) {
        point += per;
    }
    $tr.find(".SKILL_PER").html(point);
    return $tr;
}



function save() {
    if(IS_LOGIN) {
        updateDataNext(`RENSEI/`, MY_RENSEI_LIST);
    }
}

$(document).on('click', '#DISP_SKILL', function () {
    $("#SKILL_AREA").slideDown();
    $("#WEAPON_AREA").slideUp();
});
$(document).on('click', '#DISP_WEAPON', function () {
   $("#SKILL_AREA").slideUp();
   $("#WEAPON_AREA").slideDown();
});
var ICON_NAME = {
    "剣":101404700,
    "大剣":102404200,
    "斧":103403800,
    "小剣":107403800,
    "弓":109403800,
    "槍":108404100,
    "体術":105404200,
    "手袋":105404300,
    "棍棒":104404100,
    "銃":106403900,
    "火杖":151401200,
    "水杖":152401300,
    "風杖":154401200,
    "土杖":153401200,
    "光杖":155401200,
    "闇杖":156401200,
}
//ICON_LIST
var OPTION_LIST = ["力","体","器","速","知","火","水","土","風","光","闇"];

// 画面初期表示
function initialDisplaySetUp() {
    var $ab_tmp = $("#AB_TEMPLATE").clone().removeClass("d-none").attr("id","");
    $("#AB1_AREA").append($ab_tmp.clone().attr("id", "ab1Rare"));
    $("#AB2_AREA").append($ab_tmp.clone().attr("id", "ab2Rare"));
    $("#AB3_AREA").append($ab_tmp.clone().attr("id", "ab3Rare"));

    $("#UPDATE").html(UPDATE_DATE);
    for(idx in RENSEI_ATTRS) {
        var rName = RENSEI_ATTRS[idx]['Name'];
        $('#ab1').append($('<option>').html(rName).val(idx));
        $('#ab2').append($('<option>').html(rName).val(idx));
        $('#ab3').append($('<option>').html(rName).val(idx));
    }
    for(idx in OPTION_LIST) {
        var rName = OPTION_LIST[idx];
        if(rName == "知") {
            continue;
        }
        $('#AB_OPTION').append($('<option>').html(rName+"+").val(idx));
    }
}

