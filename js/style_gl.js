var BASE_WEAPON = 34;
const PARAM_NAME_MAP = {'HP':"HP", '腕力':"STR", '体力':"END", '器用さ':"DEX", '素早さ':"AGI",
'知力':"INT", '精神':"WIL", '愛':"LOV", '魅力':"CHA"};

var BattleTypeWeapon = {
    "体術体術" : [BASE_WEAPON,41,45],
    "棍棒棍棒" : [BASE_WEAPON,41,45],
    "弓弓" : [BASE_WEAPON,41,45],
    "杖杖" : [BASE_WEAPON,41,45],
    "銃銃" : [BASE_WEAPON,41,45],

    "剣火術" : [BASE_WEAPON,41,45],
    "剣水術" : [BASE_WEAPON,41,45],
    "槍水術" : [BASE_WEAPON,41,45],
    "剣光術" : [BASE_WEAPON,41,45],
    "棍棒光術" : [BASE_WEAPON,41,45],
    "杖水術" : [BASE_WEAPON,40,44],
    "弓水術" : [BASE_WEAPON,40,44],
    "杖土術" : [BASE_WEAPON],
    "杖光術" : [BASE_WEAPON,40,44],
};
var RESIT_MAP = ["Zan", "Da", "Totsu", "Netsu", "Rei", "Rai", "Inn", "You"];
let GACHA_STYLE = [];
let Role = ["Attacker","Defender","Supporter","Jammer"];

for(sid in STYLE_MASTER){
    styleInfo = STYLE_MASTER[sid];
    if(styleInfo['gacha'] == undefined) {
        continue;
    }
    let gachaList = styleInfo['gacha'].split('/');
    for(gacha of gachaList){
        if(gacha.indexOf(".") > -1){
            if(GACHA_STYLE[gacha] == undefined){
                GACHA_STYLE[gacha] = [];
            }
            GACHA_STYLE[gacha].push(styleInfo['Id']);
        }
    }
}


var CHAR_ST_RANK = {"STR": {}, "VIT": {}, "DEX": {}, "AGI": {}, "INT": {}, "MND": {}, "AI": {}, "MI": {}};
var TYPE_MAP = {
    "Sword": "Slash", "G.Sword": "Slash", "Axe": "Slash",
    "S.Sword": "Pierce", "Spear": "Pierce", "Bow": "Pierce",
    "Club": "Blunt", "M.Arts": "Blunt", "Gun": "Blunt", "Staff": "Staff"
}

var RARE_ICON ={
    "A" : getImgPath("icon/icon_A.png"),
    "S" : getImgPath("icon/icon_S.png"),
    "SS" : getImgPath("icon/icon_SS.png"),
}
var IND_ICON = {
    "1" : getImgPath("icon/icon_ind_1.png"),
    "2" : getImgPath("icon/icon_ind_2.png"),
    "3" : getImgPath("icon/icon_ind_3.png"),
}
var CHAR_ST_RANK_TYPE = {};

var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_CHAR = {};
var NOW_STYLE = {};
//var SKILL_MASTER;
//var ABILITY_MASTER;

var NOW_UID = getMyId();

function _noLoginInitial() {
    console.log("_noLoginInitial");
    $(".noLogin").hide();
}
function _initial() {
    $("#loginInfo").hide();
    loginCard("#firebaseui-auth-container");
    
    var TopBtn = $('#PageTopBtn');
    TopBtn.css('bottom', '-200px');
    var isDisplay = false;
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
}
var ARMOR_DATA = {
    "lightam_ss" : {"name":"ヒドラレザー", "resist" : [22,32,32, 28,28,0,0,0], "vit":0, "mnd":-3, "cat":"main"},
    "lightam_s" : {"name":"聖獣石の鎧", "resist" : [22,30,30, 0,0,0,0,0], "vit":2, "mnd":-2, "cat":"main"},
    "armor_202500500" : {"name":"聖王の鎧", "resist" : [36,25,36, 0,0,0,0,0], "vit":0, "mnd":-2, "cat":"main"},
    "heavyam_s" : {"name":"赤のローリーカ(+)", "resist" : [25,19,25, 26,0,0,0,0], "vit":3, "mnd":0, "cat":"main"},
    "fullam_ss" : {"name":"スプリガンスーツ", "resist" : [38,38,27, 0,0,0,0,0], "vit":5, "mnd":0, "cat":"main"},
    "fullam_s" : {"name":"フォートスーツ(+)", "resist" : [30,30,22, 0,0,0,0,0], "vit":2, "mnd":0, "cat":"main"},
    "armor_204500400" : {"name":"星辰のローブ", "resist" : [13,13,13, 21,21,21,0,0], "vit":0, "mnd":2, "cat":"main"},
    "robe_s" : {"name":"星屑のローブ", "resist" : [10,10,10, 17,17,17,0,0], "vit":1, "mnd":0, "cat":"main"},

    "helm_ss" : {"name":"ねじりヒドラ", "resist" : [0,32,0, 28,28,0,0,0], "vit":2, "mnd":0, "cat":"sub"},
    "helm_s" : {"name":"ふかふかフード", "resist" : [0,30,0, 0,26,0,0,0], "vit":0, "mnd":0, "cat":"sub"},
    "armor_307500900" : {"name":"聖王の小手", "resist" : [34,0,0, 0,0,0,0,0], "vit":4, "mnd":4, "cat":"sub"},
    "arm_s" : {"name":"耐熱手袋", "resist" : [28,0,0, 28,0,0,0,0], "vit":0, "mnd":0, "cat":"sub"},
    "leg_ss" : {"name":"ヒドラブーツ", "resist" : [0,0,32, 28,28,0,0,0], "vit":0, "mnd":0, "cat":"sub"},
    "leg_s" : {"name":"ラバーソウル(+)", "resist" : [0,0,28, 0,0,28,0,0], "vit":0, "mnd":1, "cat":"sub"},
    "armor_305500600" : {"name":"聖王のマント", "resist" : [8,8,8, 0,0,0,38,38], "vit":3, "mnd":0, "cat":"sub"},
    "fuku_s" : {"name":"強化服", "resist" : [6,6,6, 0,0,0,30,30], "vit":2, "mnd":2, "cat":"sub"},

    "acc_ss" : {"name":"王家の指輪", "resist" : [0,0,0, 16,16,16,16,16], "vit":0, "mnd":1, "cat":"acc"},
    "accessory_409513700" : {"name":"魚鱗(+)", "resist" : [0,0,0, 0,20,0,0,0], "vit":0, "mnd":2, "cat":"acc"},
    "acc_s" : {"name":"スターアームレット", "resist" : [0,0,0, 0,0,0,0,0], "vit":4, "mnd":2, "cat":"acc"},
}
function dispArmor() {
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("SS", `lightam_ss`, ""));
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("SS", `armor_202500500`, ""));
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("SS", `fullam_ss`, ""));
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("SS", `armor_204500400`, ""));
    $("#ARMOR_AREA").find(".main").append("<br class='hidden spBlock'>");
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("S", `lightam_s`, ""));
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("S", `heavyam_s`, ""));
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("S", `fullam_s`, ""));
    $("#ARMOR_AREA").find(".main").append(getWeaponIcon("S", `robe_s`, ""));

    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("SS", `helm_ss`, ""));
    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("SS", `armor_307500900`, ""));
    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("SS", `leg_ss`, ""));
    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("SS", `armor_305500600`, ""));
    $("#ARMOR_AREA").find(".sub").append("<br class='hidden spBlock'>");
    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("S", `helm_s`, ""));
    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("S", `arm_s`, ""));
    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("S", `leg_s`, ""));
    $("#ARMOR_AREA").find(".sub").append(getWeaponIcon("S", `fuku_s`, ""));

    $("#ARMOR_AREA").find(".acc").append(getWeaponIcon("SS", `acc_ss`, ""));
    $("#ARMOR_AREA").find(".acc").append(getWeaponIcon("SS", `accessory_409513700`, ""));
    $("#ARMOR_AREA").find(".acc").append(getWeaponIcon("S", `acc_s`, ""));
};

$(document).ready(function ($) {
    //dispGachaStyle();
    dispArmor();
    $("#UPDATE").html(UPDATE);

    dispChar2(CHAR_MASTER, {"jutsu":true});

    initialHide();

    if (location.search !== "") {
        let styleId = (location.search).substr(3);
        if (STYLE_MASTER[styleId] !== undefined) {
            var charId = STYLE_MASTER[styleId]['CharacterId'];
            clickChar(charId, styleId);
        }
    }

    $("#PLUS_LIMIT").text(LIMIT_BASE);
    $("#HP_MAX").text(HP_MAX);
    
    
    /**
     * フィルタークリック
     */
    $(".filterList").click(function () {
        $(".dotList").addClass("d-none");
        let value = $(this).attr("data-href");
        $("#" + value).removeClass("d-none");
        if (!$(this).find(".fButton").hasClass("filterActive")) {
            // 絞り込み
            $(".filterList").each(function () {
                $(this).find(".fButton").removeClass("filterActive");
            });
            $(this).find(".fButton").toggleClass("filterActive");
        }
    });
    /**
     * ステータスランキングのフィルタ
     */
    $(".nearFilter").click(function(){
        if($(this).hasClass("statusFilter")){
            $(this).find(".style_icon_rare_base").toggleClass("filterActive");
        } else if($(this).hasClass("roleFilter")){
            $(this).toggleClass("filterActive");
        }
        displayNearTableParent();
    });

    // 評価の星クリック時
    $(document).on('click', '.vote', function () {
        var val = $(this).attr("data-value");
        var type = $(this).attr("data-type");
        changeVoteStar(val, type);
    });
    // 評価の投票クリック時
    $(document).on('click', '#VOTE_STAR', async function () {
        voteAPI();
        changeVoteButton();
    });

    // 装備クリック
    $(document).on('click', '.weapon', function(){
        var offFlag = ($(this).hasClass('filterActive'));
        $(this).parent().find(".filterActive").each(function(){
            $(this).removeClass('filterActive');    
        })

        var id = $(this).attr("data-id");
        var data = ARMOR_DATA[id];
        var disp = "";
        if(!offFlag) {
            $(this).addClass('filterActive');
            //"acc_ss" : {"name":"王家の指輪", "resist" : [0,0,0, 16,16,16,16,16], "vit":0, "mnd":1, "cat":"acc"},
            var dispVit = (data['vit'] != 0) ? " 体:" + data['vit'] : "";
            var dispMnd = (data['mnd'] != 0) ? " 精:" + data['mnd'] : "";
            var dispResist = `斬:${data['resist'][0]} 打:${data['resist'][1]} 突:${data['resist'][2]} 熱:${data['resist'][3]}<br>`+
            `冷:${data['resist'][4]} 雷:${data['resist'][5]} 陽:${data['resist'][6]} 陰:${data['resist'][7]}`;
            disp = data['name'] + "<br>" + dispResist + "<br>" + dispVit + dispMnd;
        }
        $("." + data['cat']+ "_detail").html(disp);
        reCulcGetDamage();
    });

    // ダメージ計算のアビリティボタンクリック
    $(document).on('click', '.ability_switch', function () {
        $(this).toggleClass("icon_btn_negative icon_btn_positive");
        ABILITY_DAMAGE_CUT_CALC = ABILITY_DAMAGE_CUT;
        ABILITY_DAMAGE_CUT_DISP_CALC = ABILITY_DAMAGE_CUT_DISP;
        $(".ability_switch").each(function(){
            if($(this).hasClass("icon_btn_positive")) {
                var per = $(this).attr("data-per");
                if(per.indexOf("=") > -1) {
                    per = per.split("=")[1];
                }
                ABILITY_DAMAGE_CUT_CALC *= (100 - per ) / 100;
                ABILITY_DAMAGE_CUT_DISP_CALC += per + "%,";
            }
        });
        reCulcGetDamage();
    });

    // 技一覧のタブクリック時
    $(document).on('click', '.SKILL_TAB', async function () {
        let target = $(this).attr("data-target");
        $(".SKILL_TAB").removeClass("style-tab-active").addClass("style-tab-disabled");
        $(this).removeClass("style-tab-disabled").addClass("style-tab-active");
        $(".STYLE_SKILL_TAB").slideUp();
        $("#"+target).slideDown();
        gtag('event', "clickChar", {'event_category': "skilltab", 'event_label': target, 'value': 1});
    });
    // 継承一覧のタブクリック時
    $(document).on('click', '.AUTO_TAB', async function () {
        $("#AUTO_PATTERN_ALL").removeClass("d-none");
        let target = $(this).attr("data-target");
        $(".AUTO_TAB").removeClass("style-tab-active").addClass("style-tab-disabled");
        $(this).removeClass("style-tab-disabled").addClass("style-tab-active");
        $(".AUTO_TAB_AREA").slideUp();
        $("#"+target).parent().slideDown();
        gtag('event', "clickChar", {'event_category': "autotab", 'event_label': target, 'value': 1});
    });

    // キャラクタークリック時
    $(document).on('click', '.char', async function () {
        let charId = $(this).attr("data-id");
        clickChar(charId);
        gtag('event', "clickChar", {'event_category': "style", 'event_label': NOW_CHAR['Name'], 'value': 1});
    });
    // スタイルクリック時
    $(document).on('click', '.style', function () {
        let styleId = $(this).attr("data-id");
        NOW_STYLE = STYLE_MASTER[styleId];
        if(NOW_CHAR['Id'] != NOW_STYLE['CharacterId']) {
            NOW_CHAR = CHAR_MASTER[NOW_STYLE['CharacterId']];
            var charId = NOW_STYLE['CharacterId'];
            clickChar(charId);
        }
        displayAbilityButton();
        displayStyleInfo(styleId);
        history.replaceState('','',`style_gl.html?s=${styleId}`);
        gtag('event', "clickStyle", {'event_category': "auto", 'event_label': NOW_STYLE['Name'] + NOW_STYLE['AnotherName'], 'value': 1});
    });

    $(document).on('click', '#MAX_STATUS', function () {
        $(".DISP_ST").html("Cap");
        $(".ISMAX").html("Max");
        $(".charParam").slideUp(200, function () {
            for (let key of PARAM_KEY) {
                $(".char" + key).val(NOW_CHAR["MAX" + key] + LIMIT_BASE);
                $(".INPUT" + key).val(NOW_CHAR["MAX" + key] + LIMIT_BASE);
            }
            $(".charParam").slideDown(200);
            reCulcStyleParam();
        });
    });

    $(document).on('click', '#MY_STATUS', function () {
        $(".DISP_ST").html("My Data");
        $(".ISMAX").html("");
        var charId = NOW_CHAR["Id"];
        readUserDataWithId("CHAR", charId, function (result) {
            $(".myst").slideUp(200, function () {
                for (let key of PARAM_KEY) {
                    $(".char" + key).val((result === null) ? NOW_CHAR[key] : result[key]);
                    $(".INPUT" + key).val((result === null) ? NOW_CHAR[key] : result[key]);
                }
                $(".myst").slideDown(200);
                reCulcStyleParam();
            });
        });
    });
    $(document).on('change', '.charParam1', function () {
        $(".DISP_ST").html("自分のステータス");
        $(".ISMAX").html("");
        $(".charParam1").each(function () {
            key = $(this).attr("data-param");
            val = $(this).val();
            $(".char" + key).val(val);
            $(".INPUT" + key).val(val);
        });
        reCulcStyleParam();
    });
    $(document).on('change', '.charParam2', function () {
        $(".DISP_ST").html("自分のステータス");
        $(".ISMAX").html("");
        $(".charParam2").each(function () {
            key = $(this).attr("data-param");
            val = $(this).val();
            $(".char" + key).val(val);
            $(".INPUT" + key).val(val);
        });
        reCulcStyleParam();
    });

    $(document).on('change', '.MY_STYLE_LV', function () {
        lv = $(this).val();
        lv = (lv < 1) ? 1 : (lv > 50) ? 50 : lv;
        NOW_LV = Number(lv);
        $(".DISP_LV").html(lv);
        reCulcStyleParam();
    });

});

function reCulcGetDamage() {
    var armResist = [0,0,0, 0,0,0,0,0];
    var armVit = 0;
    var armMnd = 0;
    $(".weapon.filterActive").each(function(){
        var id = $(this).attr("data-id");
        var data = ARMOR_DATA[id];
        armVit += data['vit'];
        armMnd += data['mnd'];
        for(let idx in RESIT_MAP){
            armResist[idx] += data['resist'][idx];
        }
    })
    for(let idx in RESIT_MAP){
        var z = RESIT_MAP[idx];
        var styleResist = Number($(".taisei_" + z).html());
        var r = styleResist + armResist[idx];
        var damage = Math.round((1 / (1 + 0.008 * r)) * 100) / 100;

        setTaisei($(".calc_taisei_" + z), r);
        setTaisei($(".calc_bairitsu_" + z), r);
        $(".calc_bairitsu_" + z).html(damage*100 + "%");
    }
    displayGetDamageValue(NOW_STYLE, armVit, armMnd);    
}

function reCulcStyleParam() {
    $(".STYLE_VAL_ROW").each(function () {
        var styleId = $(this).attr("data-id");
        if (styleId === undefined) {
            return true; // continue
        }
        var $styleVal = $(this);

        var styleInfo = STYLE_MASTER[styleId];
        var styleStatus = getStyleStatusWithLV(styleInfo, NOW_LV);
        var sum = 0;
        var sumPer = 0;
        for (let key of PARAM_KEY) {
            var v = styleStatus[key]['val'];
            var per = styleStatus[key]['per'];
            $styleVal.find("." + key).find(".val").html(isNaN(v) ? "<small>調査中</small>" : v);
            $styleVal.find("." + key).find(".per").html(`<span class="d-sm-inline d-none">${per}</span><span class="d-sm-none">${Math.round(per)}</span>%`);
            $styleVal.find("." + key).find(".bonus").html("+" + styleStatus[key]['bonus']);
            sum += v;
            sumPer += per;
        }
        $styleVal.find(".SUM").find(".val").html(sum);
        $styleVal.find(".SUM").find(".per").html(`<span class="d-sm-inline d-none">${sumPer}</span><span class="d-sm-none">${Math.round(sumPer)}</span>%`);

    });
    // ステータス計算し直したらこっちもやり直す
    displayGetDamageValue(NOW_STYLE);
    displayHealValue(NOW_STYLE);
}

function initialHide() {
    $("#STYLE_DATA").hide();
    $(".styleInfoArea").hide();
    $(".styleChoiceArea").hide();
    $("#styleSkillIryoku").slideUp();
    $("#styleSkillRange").slideUp();
}

// スタイルクリック時に呼ばれる
var HIT_VALUE = 0;
var JUTSU_VALUE = 0;

function displayStyleInfo(styleId) {
    $(".gacha-fukidashi").addClass("d-none");
    var speech = SPEECH_DATA[styleId];
    for(var i =0; i<= 2; i++){
        $(".SPEECH"+i).find("span").html(speech[i]);
        $(".SPEECH"+i).find("img").attr("src", getImgPath(`style_icon/${styleId}.png`));
    }
    var artist = (ILLUST_DATA[styleId] !== undefined) ? ILLUST_DATA[styleId] : "";
    if(artist != ""){
        $("#ARTIST_PARENT").show();
        $("#ARTIST").html(artist);
    } else {
        $("#ARTIST_PARENT").hide();
    }

    

    $("#styleDot").show();
    $(".style").each(function () {
        let subStyleId = $(this).attr("data-id");
        $(this).find(".CHECK_COVER").addClass("icon_nocheck");
        if (styleId === subStyleId) {
            $(this).find(".CHECK_COVER").removeClass("icon_nocheck");
            return;
        }
    });
    let styleInfo = STYLE_MASTER[styleId];
    $("#tableRole").html(ROLE_GL_LIST[styleInfo['Role']]);

    if(styleInfo['gacha'] != undefined) {
        let gachaList = styleInfo['gacha'].split('/');
        $("#GACHA_TEMPLATE_AREA").html("");
        for(gacha of gachaList){
            if(gacha.indexOf(".") > -1){
                let tmpl = $("#GACHA_TEMPLATE").clone().removeClass("d-none").removeAttr("id");
                tmpl.find(".subtitle-long").html(gacha);
                for(gachaSid of GACHA_STYLE[gacha]){
                    let sInfoTmp = STYLE_MASTER[gachaSid];
                    var styleIcon = getStyleIcon(sInfoTmp['Rarity'], gachaSid, "", true);
                    tmpl.find(".styleIconArea").append(styleIcon);
                }
                $("#GACHA_TEMPLATE_AREA").append(tmpl);
            }
        }
    }



    let dotId = styleInfo['DotId'];

    for (let z of RESIT_MAP) {
        setTaisei($(".taisei_" + z), styleInfo["Resist" + z]);
        setTaisei($(".bairitsu_" + z), styleInfo["Resist" + z]);
        setTaisei($(".calc_taisei_" + z), styleInfo["Resist" + z]);
        setTaisei($(".calc_bairitsu_" + z), styleInfo["Resist" + z]);
        var damage = (1 / (1 + 0.008 * Number(styleInfo["Resist" + z])));
        damage = Math.round(damage * 100) / 100;
        $(".bairitsu_" + z).html(damage*100 + "%");
        $(".calc_bairitsu_" + z).html(damage*100 + "%");
    }

    var rPath = getImgPath(`bg_styleback_${styleInfo['Rarity'].toLowerCase()}.jpg`);
    var p = styleInfo['Rarity'] == "SS" ? "style_bg" : "style_all";
    var sPath = getImgPath(`${p}/${styleInfo['IllustId']}.png`);
    var gPath = getImgPath(`bg_gacha.png`);
    $("#styleBgImg").attr("style", `background:url(${rPath}) repeat-y; background-size: contain;`);
    $("#styleImageBox").attr("style", `background:url(${sPath}) no-repeat; background-size:contain; background-position-x: center;`);

    // レアリティ画像
    var rareIconPath = getImgPath(`icon/icon_title_stylename_${styleInfo['Rarity'].toLowerCase()}.png`);
    
    $("#styleRareTitle").attr("src", rareIconPath);
    // スタイル名称
    $(".style-another-name").html(styleInfo['AnotherName']);
    $(".style-name").html(styleInfo['Name']);
    // ドット絵
    $("#styleDot").html("");
    var dotIcon = getCharBase("", dotId, "");
    dotIcon.find(".char-aruku-left").removeClass("char-aruku-left").addClass("char-winner");
    dotIcon.find(".dot-base-circle").attr("src", getImgPath(`/icon/icon_base_${styleInfo['Rarity'].toLowerCase()}.png`) );
    $("#styleDot").append(dotIcon); //.attr("style",`background:url(${dotPath}) no-repeat;`);
    
    //$("#styleBgImg").attr("style-img", `background: url(${gPath}) no-repeat; background-size: cover;`);
    if(styleInfo['GachaText'] != ""){
        $(".gacha-fukidashi").removeClass("d-none");
        $("#styleGachaMessage").html(styleInfo['GachaText']);
    }
    $("#styleFlavor").html(styleInfo['FlavorText'].replace("　","<br>"));
    
    $("#styleBgImg").off("click");
    
    var styleStatus = getStyleStatusWithLV(styleInfo, NOW_LV);

    let WeaponType = NOW_CHAR['WeaponType'];
    let zokusei = TYPE_MAP[WeaponType];
    dClass = (WeaponType == "杖") ? "d-none" : "";

    $(`.style_rank_td`).remove();
    $(`.style_near`).html("");
    $(".RANK_HEAD_IMG").attr("src" , getImgPath(`style_cutin/${styleId}.png`));
    $(`#RANK_HEAD`).find(".WEAPON_ICON").html("").append(`<span class="icon_sm ${ICON_LIST[WeaponType]}">　</span>`);
    if(dClass === ""){
        $(`#RANK_HEAD`).find(".ATTR_ICON").removeClass("d-none").html("").append(`<span class="icon_sm ${ICON_LIST[zokusei]}">　</span>`);
    } else {
        $(`#RANK_HEAD`).find(".ATTR_ICON").addClass("d-none")
    }

    $(`#RANK_HEAD2`).append(`<td class="paramHead paramCell2 style_rank_td">${TYPE_RANK_STYLE["All"]["ALL"]}体</td>`);
    $(`#RANK_HEAD2`).append(`<td class="paramHead paramCell2 right_parts style_rank_td">${TYPE_RANK_STYLE[WeaponType]["ALL"]}体</td>`);
    $(`#RANK_HEAD2`).append(`<td class="paramHead paramCell2 right_parts style_rank_td ${dClass}">${TYPE_RANK_STYLE[zokusei]["ALL"]}体</td>`);
    var sum = 0;
    var sumUraDojo = 0;
    var combatPower = 0;
    var POWER_TABLE = {"STR":6,"VIT":6, "DEX":4, "AGI":4,"INT":4,"MND":4,"AI":2,"MI":2}
    // ステータスランキングフィルタのリセット
    // $(".statusFilter").each(function(){
    //     $span = $(this).find(".icon_mini");
    //     $span.removeClass("filterActive");
    //     if($span.hasClass("icon_rare_ss")) {
    //         $span.addClass("filterActive");
    //     }
    // });
    // for (let idx in PARAM_KEY) {
    //     var key = PARAM_KEY[idx];
    //     let label = PARAM_NAME_MAP[PARAM_NAME[idx]];
    //     let param = styleStatus[key]['val'];
    //     var indicator = `<img src="${IND_ICON[styleInfo["Ind" + key]]}" class="icon_ind${styleInfo["Ind" + key]}">`
    //     let per = styleStatus[key]['per'];
    //     let bonus = (styleStatus[key]['bonus'] > 0) ? " +" + styleStatus[key]['bonus'] : "";
    //     var limit = styleInfo['Limit' + key];
    //     var styleSeicho = limit - NOW_CHAR["seicho" + key];
    //     limit += LIMIT_BASE;
    //     sum += param;

    //     $(`#RANK_${key}`).append(`<td class="style_rank_td paramCell2">${param}</td>`);
    //     $(`#RANK_${key}`).append(`<td class="style_rank_td paramCell2 text-right">${TYPE_RANK_STYLE["All"][key][param]}位</td>`);
    //     $(`#RANK_${key}`).append(`<td class="style_rank_td paramCell2 text-right right_parts">${TYPE_RANK_STYLE[WeaponType][key][param]}位</td>`);
    //     $(`#RANK_${key}`).append(`<td class="style_rank_td paramCell2 text-right right_parts ${dClass}">${TYPE_RANK_STYLE[zokusei][key][param]}位</td>`);        
    //     $(`#RANK_${key}`).append(`<td class="style_rank_td paramCell2 text-left near_td NEAR_TD"></td>`);  
    //     $("#table"+key).find(".IND").html(indicator);
    //     $("#table"+key).find(".game-font").html(label);
    //     $("#table"+key).find(".ST").html(limit);
    //     $("#table"+key).find(".STLIMIT").html(`(${styleSeicho})`);        
    //     $("#table"+key).find(".STYLE_ST").html(param);
    //     $("#table"+key).find(".BNSPER").html(per + "%");
    //     $("#table"+key).find(".BNSVAL").html(bonus);
    //     //displayNearTable(key, param);
    //     var st = (NOW_CHAR["MAX" + key] + LIMIT_BASE) * (1+(styleStatus[key]['per']/100)) + styleStatus[key]['bonus'];
    //     sumUraDojo += st ;
    //     combatPower += (st + URA )* POWER_TABLE[key];
    // }
    // $("#combatPower").html(`${Math.floor(combatPower + 5000).toLocaleString()}`);

    
    // HIT_VALUE = styleInfo['MAXskill'];
    // JUTSU_VALUE = styleInfo['MAXjutsu'];

    // $(`#RANK_skill`).append(`<td class="style_rank_td paramCell2 val">${HIT_VALUE}</td>`);
    // $(`#RANK_skill`).append(`<td class="style_rank_td paramCell2 text-right ">${TYPE_RANK_STYLE["All"]["skill"][HIT_VALUE]}位</td>`);
    // $(`#RANK_skill`).append(`<td class="style_rank_td paramCell2 text-right right_parts">${TYPE_RANK_STYLE[WeaponType]["skill"][HIT_VALUE]}位</td>`);
    // $(`#RANK_skill`).append(`<td class="style_rank_td paramCell2 text-right right_parts ${dClass}">${TYPE_RANK_STYLE[zokusei]["skill"][HIT_VALUE]}位</td>`);
    // $(`#RANK_skill`).append(`<td class="style_rank_td paramCell2 text-left near_td NEAR_TD"></td>`);

    // if(JUTSU_VALUE == 0) {
    //     $(`#RANK_jutsu`).addClass("d-none");
    // } else {
    //     $(`#RANK_jutsu`).removeClass("d-none");
    // }
    // $(`#RANK_jutsu`).append(`<td class="style_rank_td paramCell2 val">${JUTSU_VALUE}</td>`);
    // $(`#RANK_jutsu`).append(`<td class="style_rank_td paramCell2 text-right ">--位</td>`);
    // $(`#RANK_jutsu`).append(`<td class="style_rank_td paramCell2 text-right right_parts">--位</td>`);
    // $(`#RANK_jutsu`).append(`<td class="style_rank_td paramCell2 text-right right_parts ${dClass}">--位</td>`);
    // $(`#RANK_jutsu`).append(`<td class="style_rank_td paramCell2 text-left near_td NEAR_TD"></td>`);

    // $(`#RANK_SUM`).append(`<td class="style_rank_td">${sum}</td>`);
    // $(`#RANK_SUM`).append(`<td class="style_rank_td">${TYPE_RANK_STYLE["All"]["SUM"][sum]}位</td>`);
    // $(`#RANK_SUM`).append(`<td class="style_rank_td right_parts">${TYPE_RANK_STYLE[WeaponType]["SUM"][sum]}位</td>`);
    // $(`#RANK_SUM`).append(`<td class="style_rank_td right_parts ${dClass}">${TYPE_RANK_STYLE[zokusei]["SUM"][sum]}位</td>`);

    $("#abilityList").html("");
    for (let key in styleInfo['StyleAbilityIds']) {
        let abInfo = ABILITY_MASTER[styleInfo['StyleAbilityIds'][key]];
        var div = $("#AB_TEMPLATE").clone();
        div.attr("id","").removeClass("d-none");
        div.find(".ab-name").html(abInfo["Name"]);
        div.find(".AB_ICON").append(getAbilityIcon(abInfo['Icon'], "md"));

        option = [];
        for(abAttr of abInfo['Attr']){
            if(abInfo['Attr'].length > 1 && abAttr['sub'].indexOf("と") > -1) {
                continue;
            }
            var param = (PARAM_NAME.indexOf(abAttr['sub']) > -1) ? abAttr['sub'] : "";
            if(abAttr['main'] == "被ダメージ軽減") {
                param = "軽減";
            }
            if(abAttr['main'] == "状態異常解除" || abAttr['main'] == "能力ダウン解除" ) {
                param = abAttr['main'];
            }

            console.log(abInfo, abAttr);
            var omake = [];
            var sub = filterPercent(abAttr['sub']);
            if(abAttr['main'] == "ダメージ強化") {
                omake.push("Chance: " + (AB_ATTR_GL[abAttr['sub']] ?? "") );
            } else {
                var time = filterPercent(abAttr['time']);
                omake.push(abAttr['time'] != "" ? "Chance: " + time : "");
            }
            var size = filterPercent(abAttr['size']);
            omake.push( "Effect:" + (PARAM_NAME_MAP[param] ?? '') +" "+ size);

            option.push(omake.filter(word => word != "").join("　/　"));
        }
        div.find(".ab-flover").html(abInfo["FlavorText"] + "<br>" + option.join("<br>"));
        $("#abilityList").append(div.clone());
    }
    $("#skillList").html("");
    for (let key in styleInfo['SkillIds']) {
        let skillInfo = SKILL_MASTER[styleInfo['SkillIds'][key]];
        let base = createSkillCard(skillInfo);
        $("#skillList").append(base.clone());
        $(".flv" + skillInfo['Id']).slideUp();
    }
    displaySkillTable(NOW_CHAR, 50, styleInfo);
    
    displayGetDamageValue(styleInfo);
    displayHealValue(styleInfo);

    // 全力オート計算
    var param = {"cid": NOW_CHAR["Id"], "sid": styleInfo['Id']};
    callAPI(param);
    displayNearTableParent();
}
function displayNearTableParent(){
    var rares = [];
    $(".statusFilter").each(function(){
        if($(this).find(".style_icon_rare_base").hasClass("filterActive")){
            rares.push( $(this).attr("data-href") );
        }
    });
    var roles = [];
    $(".roleFilter").each(function(){
        if($(this).hasClass("filterActive")){
            roles.push( Number($(this).attr("data-href")) );
        }
    });
    for (let idx in PARAM_KEY) {
        var key = PARAM_KEY[idx];
        var param = $("#table"+key).find(".STYLE_ST").html();
        displayNearTable(key, Number(param), roles, rares);
    }        
    displayNearTable('skill', Number(HIT_VALUE), roles, rares);
    displayNearTable('jutsu', Number(JUTSU_VALUE), roles, rares);
}
async function displayNearTable (key, param, role = [0,1,2,3], rare = ["SS"]){
    $("#RANK_"+key).find(".NEAR_TD").html("");
    var keyVals = Object.keys(TYPE_RANK_STYLE_NEAR["All"][key]);
    var minVal = keyVals[0];
    var maxVal = keyVals[keyVals.length - 1];

    var stylePermit = [];
    for(var sid in STYLE_MASTER){
        let r = Role.indexOf(STYLE_MASTER[sid]['Role']);
        if(role.indexOf(r) > -1 && rare.indexOf(STYLE_MASTER[sid]['Rarity']) > -1){
            stylePermit.push(sid);
        }
    }

    var $targetTD = $("#RANK_"+key).find(".NEAR_TD");

    var plane = (sId != NOW_STYLE['Id']);
    var upList = [];
    up_loop:
    for (i = (param+1); i<=maxVal; i++) {
        var list = TYPE_RANK_STYLE_NEAR["All"][key][i];
        if(list == undefined) {
            continue;
        }
        for(sid of list) {
            if(stylePermit.indexOf(sid) == -1) {
                continue;
            }
            upList.push({id:sid, val:i});
            if(upList.length >= 4){
                break up_loop;
            }
        }
    }
    upList.reverse();
    upList.push({id:NOW_STYLE['Id'], val:param});
    up_loop2:
    for (i = param; i>=minVal; i--) {
        var list = TYPE_RANK_STYLE_NEAR["All"][key][i];
        if(list == undefined) {
            continue;
        }
        for(sid of list) {
            if(sid == NOW_STYLE['Id'] || stylePermit.indexOf(sid) == -1) {
                continue;
            }
            upList.push({id:sid, val:i});
            if(upList.length >= 15){
                break up_loop2;
            }
        }
    }
    for(var i in upList) {
        var sId = upList[i]['id'];
        var val = upList[i]['val'];

        var plane = (sId != NOW_STYLE['Id']);

        let sInfo = STYLE_MASTER[sId];
        var styleIcon = getStyleIcon(sInfo['Rarity'], sId, "", plane);
        styleIcon.removeClass("style yubi");
        styleIcon.append(`<div style="
        position: absolute;
        font-size: 12px;
        bottom: 10px;
        width: 100%;
        text-align: center;
        color:white;" class="shadow-blue">${val}</div>`)
        if(sInfo['Rarity'] != "SS") {
            styleIcon.addClass("d-none");
        }
        $targetTD.append(styleIcon.clone());
    }
}

function createSkillCard(skillInfo){
    let template = $("#SKILL_TEMPLATE").clone().attr("id", skillInfo['Id']).attr("data-id", skillInfo['Id']).removeClass("d-none");
    template.find(".skill-name").html(skillInfo["Name"]);
    console.log(skillInfo['Name'], skillInfo['BattleType']);
    template.find(".WEAPON_ICON").addClass(ICON_LIST[skillInfo['BattleType']]+"_sm").append("　");
    template.find(".SKILL_ICON").append(getSkillIcon(skillInfo["SkillIcon"], 'md'));
    
    // BP設定
    let bp = "BP:" + (skillInfo['ConsumeBp'] - skillInfo['Kakusei']) 
    + " 〜 " + skillInfo['ConsumeBp'];
    if(skillInfo['isRentatsu'] != undefined) {
        let orgSkill = SKILL_MASTER[skillInfo['Rentatsu']];
        if(orgSkill['ConsumeBp'] != skillInfo['ConsumeBp']) {
            bp += ` (${orgSkill['ConsumeBp']})`;
        }
    }
    bp += (skillInfo['ConsumeLp'] > 0) ? " / LP:" + skillInfo['ConsumeLp'] : "";
    var iryoku = "";
    if(skillInfo['PowerGrade'] != "-") {
        iryoku = (skillInfo['SkillIryoku'] === 0 || skillInfo['SkillIryoku'] === "") ? IRYOKU_LIST[skillInfo['PowerGrade']] : skillInfo['SkillIryoku'];
        iryoku = `Power:${skillInfo['PowerGrade']} (${iryoku})`;
    }
    var healIryoku = (skillInfo['HealIryoku'] != undefined) ? skillInfo['HealIryoku'] : 0;
    var spIryoku = (healIryoku != 0 ) ? `　<span class="small">H.Power</span>(${healIryoku})` : ``;
    template.find(".skill-bp").html(bp + `<span class='d-sm-none'>　${iryoku}${spIryoku}</span>`);

    healIryoku = (healIryoku != 0 ) ? `<br><span class="small">H.Power</span>(${healIryoku})` : ``;
    template.find(".skill-iryoku").html(iryoku + healIryoku);
    // フレーバーテキストの挿入
    var text = [];
    var textArr = skillInfo['FlavorText'].split("<br>");
    template.find(".SKILL_FLAVOR").html(textArr[0].split("※")[0]);

    for(var i in textArr){
        if(i == 0){
            var pos = textArr[i].indexOf("※");
            if( textArr[i].indexOf("※") == -1) {
                continue;
            } else {
                text.push(textArr[i].substr(pos));
            }
        } else {
            if(textArr[i] == "攻撃する" || textArr[i] == "範囲攻撃する"  || textArr[i] == "全体攻撃する" ){
            } else {
                text.push(textArr[i]);
            }
        }
    }
    if(skillInfo['Mod'] !== undefined){
        var mod = [];
        for(idx in skillInfo['Mod']){
            var target = skillInfo['Mod'][idx];
            if(target == "回復威力" || target.indexOf("BP") > -1) {
                continue;
            }
            var rank = skillInfo['Mod1'][idx];
            rank += (skillInfo['Mod99'][idx] != "") ? ` 〜 ${skillInfo['Mod99'][idx]}` : "";
            mod.push(`${target}(${rank}%)`);
        }
        text.push(mod.join(" / "));
    }

    template.find(".skill-text").html(text.join("<br>"));
    
    // 属性設定
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        console.log(value, ICON_LIST[value]);
        let img = $('<span>').addClass('icon_xs').addClass(ICON_LIST[value]).append("　");
        template.find(".ICON_AREA_IMG").append(img.clone());
    });
    // オプション
    var option = getSkillOption(skillInfo);
    template.find(".SKILL_OPTION").append(option);
    // 覚醒
    kakuseiIcon = getKakuseiIcon(skillInfo, 40, false);
    template.find(".skillKakuseiArea").append(kakuseiIcon);

    return template;
}
function createSkillKeishoCard(skillInfo){
    let template = $("#SKILL_KEISHO_TEMPLATE").clone().removeClass("d-none").attr("id","");

    var styleIcon = getStyleIcon(skillInfo['Rarity'], skillInfo['StyleId'], "", true);
    styleIcon.find(".style_icon_rare_base").attr("style", "width:13px; height:13px;");
    template.find(".STYLE_ICON").prepend(styleIcon);
    template.find(".RANK_HEAD_IMG").attr("src" , getImgPath(`style_cutin/${skillInfo['StyleId']}.png`));
    template.find(".BATTLE_ICON").attr("src", getImgPath(`icon/${ICON_LIST[skillInfo['BattleType']]}_sm.png`));
    template.find(".skill-name").html(skillInfo["Name"]);
    // 属性設定
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        console.log(value, ICON_LIST[value]);

        var imgPath = getImgPath(`icon/${ICON_LIST[value]}.png`);
        let img = $(`<img class="icon_xs" src="${imgPath}" loading="lazy">`);
        template.find(".SKILL_ATTR").append(img.clone());
    });
    // BP設定
    let orgBp = skillInfo['ConsumeBp'];
    if(skillInfo['isRentatsu'] != undefined) {
        let orgSkill = SKILL_MASTER[skillInfo['Rentatsu']];
        if(orgSkill['ConsumeBp'] != skillInfo['ConsumeBp']) {
            orgBp += `[${orgSkill['ConsumeBp']}]`;
        }
    }    
    let bp = (skillInfo['ConsumeBp'] - skillInfo['Kakusei']) + "-" + orgBp;
    template.find(".consume-bp").html(bp);
    let lp = (skillInfo['ConsumeLp'] > 0) ? "| LP:" + skillInfo['ConsumeLp'] : "";
    template.find(".consume-lp").html(lp);

    var iryoku = (skillInfo['SkillIryoku'] === 0) ? IRYOKU_LIST[skillInfo['PowerGrade']] : skillInfo['SkillIryoku'];
    iryoku = `${skillInfo['PowerGrade']} (${iryoku})`;
    template.find(".skill-iryoku").html(iryoku);

    // フレーバーテキストの挿入
    var textTmp = skillInfo['FlavorText'].split("<br>");
    if(textTmp[1].indexOf("[") > 1) {
        textTmp[1] = textTmp[1].slice(textTmp[1].indexOf("["));
        textTmp[0] += " " + textTmp[1];
        textTmp[1] = "";
    }
    if(["攻撃する","範囲攻撃する","全体攻撃する","対象のHPを回復する"].indexOf(textTmp[1]) > -1){
        textTmp[1] = "";
    }

    var flavor = textTmp.filter(function(v){ return v !=""; }).join("<br>");
    template.find(".TOGGLE_FLAVOR").addClass(`flv${skillInfo['Id']}`);
    template.find(".TOGGLE_FLAVOR").append("Power:"+iryoku);
    template.find(".TOGGLE_FLAVOR").append(" BP:"+bp);
    template.find(".TOGGLE_FLAVOR").append(lp);
    template.find(".TOGGLE_FLAVOR").append("<br>");
    template.find(".SKILL_TEXT").append(flavor);
    template.find(".INFO_BTN").attr('onclick', `$(".flv${skillInfo['Id']}").slideToggle(100);`);
    // table>tbody>tr
    return template.children().children();
}
function getSkillOption(skillInfo){

    let name = $('<span>');
    if (skillInfo['BadStatus'] !== undefined && skillInfo['BadStatus'] !== "") {
        var badTmp = skillInfo['BadStatus'].split(",");
        var badPerTmp = skillInfo['BadStatusPer'].split(",");
        for(var idx in badTmp){
            if(ICON_LIST[badTmp[idx]] != undefined) {
                let img = $('<span>').addClass('bad').addClass("icon_xs").addClass(ICON_LIST[badTmp[idx]]).append("　");
                name.append(img);
                name.append(":<span class='small'>" + badPerTmp[idx] + "</span>");
            }
        }
    }

    if (skillInfo['Buff'] != undefined && skillInfo['Buff'] != "") {
        var bufTmp = skillInfo['Buff'].split(",");
        for(var bufTxt of bufTmp){
            bufTxt = bufTxt.replace("全員の","");
            if (bufTxt === "HP") {
                name.append("[HP回復]");
            } else if (bufTxt === "BP") {
                name.append("[BP回復]");
            } else if (bufTxt === "すべての状態異常を解除する") {
                name.append("[全状態異常回復]");
            } else if (bufTxt === "全ステ") {
                for(var p of PARAM_NAME) {
                    let img = $('<span>').addClass('icon_xs').addClass(ICON_LIST[p+"上昇"]).text("　");
                    name.append(img);
                }
            } else if(ICON_LIST[bufTxt+"上昇"] != undefined){
                let img = $('<span>').addClass('icon_xs').addClass(ICON_LIST[bufTxt+"上昇"]).text("　");
                name.append(img);
            }    
        }
    }

    if (skillInfo['DeBuff'] != undefined && skillInfo['DeBuff'] != "") {
        var deBufTmp = skillInfo['DeBuff'].split(",");
        for(var txt of deBufTmp){
            if(ICON_LIST[txt + "低下"] != undefined) {
                name.append($('<span>').addClass('icon_xs').addClass(ICON_LIST[txt + "低下"]).text("　"));
            }
        }
    }

    if (skillInfo['AttackDistance'] !== "近" && skillInfo['AttackArea'] !== "敵全体") {
        //name.append(`[${skillInfo['AttackDistance']}]`);
    }
    if (skillInfo['AttackArea'] !== "敵単体") {
        //name.append(`[${skillInfo['AttackArea']}]`);
    }
    if (skillInfo['AttackKansetsu']) {
        //name.append(`[間接]`);
    }
    if (skillInfo['Fast']) {
        //name.append(`[Fast]`);
    }
    if (skillInfo['Delay']) {
        //name.append(`[Delay]`);
    }
    return name;
}

// スタイルLv50の表示テーブル
function getStyleStatusWithLV(styleInfo, lv) {
    let styleBonus = culcStyleAddintional(styleInfo);
    var result = {};
    for (let idx in PARAM_KEY) {
        let input = $(".char" + PARAM_KEY[idx]).val();
        
        let per = styleBonus[PARAM_NAME[idx]][lv]["Per"];
        let bonus = styleBonus[PARAM_NAME[idx]][lv]["Bonus"];
        let val = addBonus(input, per, bonus);
        result[PARAM_KEY[idx]] = {"val": val, "per": per, "bonus": bonus};
    }
    return result;
}


var STATUS_TABLE = "<table class='table table-sm width-100 small'>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>STR</td><td id='tdStr' class='text-right'></td><td>END</td><td id='tdVit' class='text-right'></td></tr>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>DEX</td><td id='tdDex' class='text-right'></td><td>AGI</td><td id='tdAgi' class='text-right'></td></tr>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>INT</td><td id='tdInt' class='text-right'></td><td>WIL</td><td id='tdMnd' class='text-right'></td></tr>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>LOV</td><td id='tdAi' class='text-right'></td><td>CHA</td><td id='tdMi' class='text-right'></td></tr>";
STATUS_TABLE += "</table>";

var NOW_LV = 50;
// キャラクタークリック時のスタイル表示
function displayStyleList() {
    // キャラクター再選択でリセットされる
    $(".styleChoiceArea").show();
    $("#styleChoice").html("");
    $("#STYLE_HISTORY_AREA").html("");
    
    $(".STYLE_ROW").remove();

    let charInfo = NOW_CHAR;
    // 所持スタイルの表示
    var sList = [];
    for (let styleId of charInfo['Holders']) {
        sList.push(STYLE_MASTER[styleId]);
    }

    var styleIdList = sortStyleId(sList, "SS", "new");

    for (let styleId of styleIdList) {
        if(STYLE_MASTER[styleId] === undefined){
            console.log(styleId, "not found");
            continue;
        }
        let styleInfo = STYLE_MASTER[styleId];
        // スタイルアイコンの追加
        let styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, charInfo['WeaponType'])
        $("#styleChoice").append(styleIcon.clone());
        let historyRow = $("#HISTORY_TEMPLATE").clone().removeAttr("id").removeClass("d-none");
        let iconTmp = styleIcon.clone();
        iconTmp.find(".CHECK_COVER").removeClass("CHECK_COVER icon_nocheck");
        historyRow.find(".icon").append(iconTmp.clone());
        if(styleInfo['gacha'] != undefined) {
            historyRow.find(".gacha").html(styleInfo['gacha'].replace("/","<br>"));
        }
        $("#STYLE_HISTORY_AREA").append(historyRow);

        var styleStatus = getStyleStatusWithLV(styleInfo, 50);
        var $styleVal = $("#STYLE_TABLE_TEMPLATE").clone().attr('id', '').removeClass('d-none').addClass('STYLE_ROW STYLE_VAL_ROW height-small').attr("data-id", styleId);
        var $styleSt = $("#STYLE_TABLE_TEMPLATE").clone().attr('id', '').removeClass('d-none').addClass('STYLE_ROW ');
        var sum = 0;
        var sumLimit = 0;
        var sumPer = 0;
        var sumUraDojo= 0;
        var sumStatus = 0;

        for (let key of PARAM_KEY) {
            var v = styleStatus[key]['val'];
            var limit = STYLE_MASTER[styleId]['Limit' + key];
            var styleSeicho = limit - NOW_CHAR["seicho" + key];
            sum += (limit + LIMIT_BASE);
            sumUraDojo += (NOW_CHAR["MAX" + key] + LIMIT_BASE) * (1+(styleStatus[key]['per']/100)) + styleStatus[key]['bonus'];
            sumStatus += v;

            sumLimit += styleSeicho;
            sumPer += styleStatus[key]['per'];

            var limitVal = "<small class='d-none d-lg-inline'>調査中</small><small class='d-lg-none'>?</small>";
            if (limit !== 99) {
                if (limit == NOW_CHAR["MAX" + key]) {
                    $styleSt.find("." + key).addClass("fuchidori-blue maxCol");
                }
                limitVal = (limit + LIMIT_BASE);
            }            
            $styleVal.find("." + key).find(".val").html(isNaN(v) ? "<small>調査中</small>" : v);
            $styleVal.find("." + key).find(".per").html(Math.round(styleStatus[key]['per'])+"%");
            $styleVal.find("." + key).find(".bonus").html("+" + styleStatus[key]['bonus']);

            var ind = "";
            if(styleInfo["Ind" + key] != "1"){
                ind = `<img class="icon_ind${styleInfo["Ind" + key]}" src="${IND_ICON[styleInfo["Ind" + key]]}">`;
            }
            var dLimit = `<span class="fuchidori-white val">${limitVal}</span><br><span class="">(${ind}${styleSeicho})</span>`;
            //$styleSt.find("." + key).html(dLimit);
            $styleSt.find("." + key).find(".val").html(limitVal);
            $styleSt.find("." + key).find(".per").html(`(${ind}${styleSeicho})`);
            $styleSt.find("." + key).find(".bonus").html("");
        }
        //$styleSt.find(".SUM").html(`${sum}<br>(${sumLimit})`);
        $styleSt.find(".SUM").find(".val").html(sum);
        $styleSt.find(".SUM").find(".per").html(`(${sumLimit})`);
        $styleVal.find(".SUM").find(".val").html(`${Math.floor(sumStatus).toLocaleString()}`);
        $styleVal.find(".SUM").find(".per").html(`${sumPer}%`);
        //$styleVal.find(".SUM").remove();

        // 非表示とかやらないし、クリック対応させないので消す
        styleIcon.removeClass(".style").find(".CHECK_COVER").remove();
        $styleVal.find(".IMG").append(styleIcon.clone()); //$rareImg).append(mini.clone());
        $styleSt.find(".IMG").append(styleIcon.clone()); //$rareImg).append(mini.clone());
        $("#STYLE_VAL_ROW").parent().append($styleVal);
        $("#STYLE_ST_ROW").parent().append($styleSt);
    }

    // 初回は閉じておく
    $(".culcDamageResultClass").slideUp();
}

var healSkill = [];
function displaySkillTable(charInfo, lv, nowStyle) {
    $(".STYLE_SKILL_TAB").html("");

    // 所持回復スキルのリセット
    healSkill = [];
    var head = $(`<tr class="text-center small status-row" style="border-bottom: 1px solid gray;">
    <td class="d-none d-sm-table-cell"></td>
    <td>Type<br>Attr</td>
    <td>Name</td>
    <td class="d-none d-sm-table-cell">Grade</td>
    <td class="d-none d-sm-table-cell">Consume<br>BP/LP</td>
    <td></td></tr>`);
    var head2 = $(`<tr class="text-center small status-row" style="border-bottom: 1px solid gray;">
    <td>Type<br>Attr</td>
    <td>Name</td>
    <td class="d-none d-sm-table-cell">Grade</td>
    <td class="d-none d-sm-table-cell">Consume<br>BP/LP</td>
    <td></td></tr>`);    
    $("#styleSkillOrg").append(head);
    $("#styleSkillIryoku").append(head2);

    // キャラクターの全スタイルチェック
    let nowStyleId = nowStyle['Id'];
    var styleList = [nowStyleId];
    for (let styleId of charInfo['Holders']) {
        if (nowStyleId !== styleId) {
            styleList.push(styleId);
        }
    }
    var range = {
        "All Foes":[],
        "Row of Foes":[],
        "Column of Foes":[],
        "Single Foes":[],
        "random":[],
        "other":[],
    };
    
    var iryoku = [];
    var skillList = {};
    for (let styleId of styleList) {
        var styleInfo = STYLE_MASTER[styleId];
        if(styleInfo === undefined){
            continue;
        }
        skillList[styleId] = [];
        for (let skillId of styleInfo['SkillIds']) {
            let skillInfo = SKILL_MASTER[skillId];
            skillList[styleId].push(skillInfo);
            if(skillInfo['Rentatsu'] != undefined 
            && skillInfo['isRentatsu'] == undefined 
            && SKILL_MASTER[skillInfo['Rentatsu']] != undefined ){
                skillList[styleId].push(SKILL_MASTER[skillInfo['Rentatsu']]);
            }
        }
    }
    for (let styleId in skillList) {
        var styleInfo = STYLE_MASTER[styleId];
        // スタイルの持つ全技チェック
        for (let i in skillList[styleId]) {
            skillInfo = skillList[styleId][i];
            var key = (range[skillInfo['AttackArea']] !== undefined ) ? skillInfo['AttackArea'] : "other";
            // 暫定コピー
            var tmpSkill = Object.assign({}, skillInfo);
            tmpSkill['Rarity'] = styleInfo['Rarity'];
            tmpSkill['StyleId'] = styleInfo['Id'];

            range[key].push(tmpSkill);
            iryoku.push(tmpSkill);
            let card = createSkillKeishoCard(tmpSkill);
            if(i == 0){
                card.find(".STYLE_ICON").attr("rowspan", skillList[styleId].length);
            } else {
                card.find(".STYLE_CUTIN").remove();
                card.find(".STYLE_ICON").remove();
            }
            $("#styleSkillOrg").append(card);
            skillId = skillInfo['Id'];
            var healFlag = false;
            if(skillInfo['Mod'] != undefined) {
                for(var k in skillInfo['Mod']) {
                    var target = skillInfo['Mod'][k];
                    if(target == "回復威力") {
                        healFlag = true;
                        break;
                    }
                }
            }
            healFlag = (healFlag || skillInfo['FlavorText'].indexOf("回復/") > -1);
            if(healFlag && healSkill.indexOf(skillId) == -1){
                healSkill.push(skillId);
            }            
        }
    }
    iryoku.sort(function (a, b) {
        return (a.SkillIryoku > b.SkillIryoku) ? -1 : 1;
    });
    var alreadyIrykuInsert = [];
    for(skillInfo of iryoku){
        var id = skillInfo['Id'];
        if(alreadyIrykuInsert.indexOf(id) > -1){
            continue;
        } else {
            alreadyIrykuInsert.push(id);
        }
        var card = createSkillKeishoCard(skillInfo);
        card.find(".STYLE_CUTIN").remove();
        card.find(".STYLE_ICON").remove();        
        $("#styleSkillIryoku").append(card);
    }
    var alreadyRangeInsert = [];
    for(target in range){
        range[target].sort(function (a, b) {
            return (a.SkillIryoku > b.SkillIryoku) ? -1 : 1;
        });
        if(range[target].length > 0){
            var label = $("#RANGE_TITLE").clone().removeClass("d-none").attr("id","").html(target);
            $("#styleSkillRange").append(label);
            for(skillInfo of range[target]){
                var id = skillInfo['Id'];
                if(alreadyRangeInsert.indexOf(id) > -1){
                    continue;
                } else {
                    alreadyRangeInsert.push(id);
                }        
                var card = createSkillKeishoCard(skillInfo);
                card.find(".STYLE_CUTIN").remove();
                card.find(".STYLE_ICON").remove();
                $("#styleSkillRange").append(card);
            }
        }
    }
    $(".TOGGLE_FLAVOR").slideUp();
}

function getSmallIcon(styleInfo) {
    var styleImg = getImgPath(`style_icon/${styleInfo['Id']}.png`);    
    // スタイルアイコンの追加
    let icon = $("<button>")
            .addClass(getStyleIconClass(styleInfo['Rarity']) + "_small")
            .attr("style", `background:url(${styleImg}) no-repeat;`)
    let background = $("<span>").addClass(getStyleIconBgClass(styleInfo['Rarity']))
            .attr("style", "height: 30px;")
            .append(icon);
    return background;
}

////////////////////////////////////////////////////////////////////////////////////////////////
// 以下、グラフ描画用設定
////////////////////////////////////////////////////////////////////////////////////////////////
var margin = {top: 30, right: 50, bottom: 30, left: 50};
var width = 200; //Math.min(200, window.innerWidth / 4);// - margin.left - margin.right,
var height = 200; //Math.min(width, window.innerHeight);// - margin.top - margin.bottom);

function setSliderChart() {
    let option = {
        buttons: true, //スライダーのページャを表示する
        startSlide: 0, //最初のスライドを指定する
        arrows: true, //左右の矢印ボタンを表示する
        width: '100%', //横幅を設定する
        height: 300, //高さを設定する
        //autoHeight: true, //高さを設定する
        autoplay: false, //自動再生の設定
        loop: true, //スライドをループさせる設定
        visibleSize: '100%', //前後のスライドを表示するかの設定
        //forceSize: 'fullWidth' //スライダーの幅をブラウザ幅に設定する
    };
    //option['height'] = (device === "sp") ? 310 : 250;
    //$('#slider-pro-chart').sliderPro(option);
}




/**
 * 一旦保留
 * @param {type} styleInfo
 * @param {type} nowLv
 * @returns {Array|createStyleValueChartData.chart}
 */
function createStyleValueChartData(styleInfo, nowLv) {
    let tmpLv = [30, 50];
    //tmpLv.push(Number(nowLv));
    let raderLvList = tmpLv.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });
    raderLvList.sort(function (a, b) {
        return (a < b) ? -1 : 1;
    });

    // キャラクター変換でリセットする
    let chart = [];
    // result["腕力"][50] = {Per :56, Bonus: 3 }
    let result = culcStyleAddintional(styleInfo);
    for (let lv of raderLvList) {
        let styleMax = {"name": lv, "axes": []};
        for (let i in PARAM_NAME) {
            let pName = PARAM_NAME[i];
            let input = $("#char" + PARAM_KEY[i]).val();
            let per = result[pName][lv]["Per"];
            let bonus = result[pName][lv]["Bonus"];
            let v = addBonus(input, per, bonus);
            styleMax["axes"].push({"axis": pName, "value": v});
        }
        chart.push(styleMax);
    }
    return chart;
}

function addRankParam(list) {
    if (list === undefined) {
        return 1;
    } else {
        return Number(list) + 1;
    }
}
;

function clickChar(charId, styleId = null) {
    var dotId = CHAR_MASTER[charId]['DotId'];
    NOW_CHAR = CHAR_MASTER[charId];
    // パラメータの中身は最大値で書き変わるのでキャラ成長傾向は別で持っておく
    if(NOW_CHAR["seichoSTR"] === undefined){
        for (let key of PARAM_KEY) {
            NOW_CHAR["seicho" + key] = NOW_CHAR[key];
        }
    }

    if (styleId === null || STYLE_MASTER[styleId] === undefined) {
        styleId = NOW_CHAR['Holders'][NOW_CHAR['Holders'].length - 1];
    }
    NOW_STYLE = STYLE_MASTER[styleId];

    $("#displayDamage").removeClass("icon_btn_off");
    $("#displayDamage").addClass("icon_btn_on");
    $("#displayDamage").find("#msg").addClass("d-none");
    $(".culcDamageResultClass").slideDown();
    $("#STYLE_DATA").show();
    $(".styleInfoArea").show();
    $(".tabArea").show();
    $(".styleChoiceArea").show();
    $("html,body").animate({scrollTop: $('#CHAR_DATA').offset().top}, 500, 'swing');

    let WeaponType = CHAR_MASTER[charId]['WeaponType'];
    let zokusei = TYPE_MAP[WeaponType];
    $(".TR_RANK").remove();

    // let $allTr = $("#RANK_TEMPLATE").clone().attr("id", "ALL").removeClass("d-none").addClass("TR_RANK");
    // let $weaponTr = $("#RANK_TEMPLATE").clone().attr("id", "ALL").removeClass("d-none").addClass("TR_RANK opacity");
    // let $typeTr = $("#RANK_TEMPLATE").clone().attr("id", "ALL").removeClass("d-none").addClass("TR_RANK");
    let sum = 0;
    var RANK = "<span class='small'>位</span>";
    for (let key of PARAM_KEY) {
        let val = NOW_CHAR["MAX" + key];
        NOW_CHAR[key] = Number(val) + LIMIT_BASE;
        sum += (val != "-99") ? Number(val) + LIMIT_BASE : 0;
        var i = (val != "-99") ? Number(val) + LIMIT_BASE : "?";
        $(".MAX" + key).html(i);
        $(".INPUT" + key).val(i);
        // $allTr.find("." + key).html(`<span class='d-none d-md-inline'>${TYPE_RANK_CHAR["All"][key][val]}</span><p class="d-block d-md-none" style='margin-bottom:0px;'>${TYPE_RANK_CHAR["All"][key][val]}</p>` + RANK);
        // $weaponTr.find("." + key).html(`<span class='d-none d-md-inline'>${TYPE_RANK_CHAR[WeaponType][key][val]}</span><p class="d-block d-md-none" style='margin-bottom:0px;'>${TYPE_RANK_CHAR[WeaponType][key][val]}</p>` + RANK);
        // $typeTr.find("." + key).html(`<span class='d-none d-md-inline'>${TYPE_RANK_CHAR[zokusei][key][val]}</span><p class="d-block d-md-none" style='margin-bottom:0px;'>${TYPE_RANK_CHAR[zokusei][key][val]}</p>` + RANK);
    }
    // $allTr.find(".SUM").text(TYPE_RANK_CHAR["All"]["SUM"][sum] + "位");
    // $weaponTr.find(".SUM").text(TYPE_RANK_CHAR[WeaponType]["SUM"][sum] + "位");
    // $typeTr.find(".SUM").text(TYPE_RANK_CHAR[zokusei]["SUM"][sum] + "位");

    $(".MAXSUM").text(sum);
    //$allTr.find(".IMG").html(`全キャラ<br>${TYPE_RANK_CHAR["All"]["ALL"]}キャラ中`);
    var wpIcon = getImgPath(`icon/${ICON_LIST[WeaponType]}.png`);
    var zokIcon = getImgPath(`icon/${ICON_LIST[zokusei]}.png`)
    //$weaponTr.find(".IMG").html(`<img src="${wpIcon}" width=30><br>${TYPE_RANK_CHAR[WeaponType]["ALL"]}キャラ中`);
    //$typeTr.find(".IMG").html(`<img src="${zokIcon}" width=30><br>${TYPE_RANK_CHAR[zokusei]["ALL"]}キャラ中`);

    // if (WeaponType !== "杖") {
    //     $("#styleLabelRow").after($typeTr).after($weaponTr).after($allTr);
    // } else {
    //     $("#styleLabelRow").after($weaponTr).after($allTr);
    // }

    $(".char-selected").each(function () {
        $(this).removeClass('char-winner');
        $(this).addClass('char-aruku');
    });
    $(".dot" + dotId).removeClass('char-aruku');
    $(".dot" + dotId).addClass('char-winner').addClass('char-selected').addClass("dot");
    $(".CHAR_NAME").html(NOW_CHAR['Name']);
    $("#RANK_LINK").attr("href", `./ourchar.html?c=${NOW_CHAR['Id']}`);
    dotId = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    var dotChar = getCharBase(charId, dotId, "");
    //dotChar.removeClass("dot-base");
    dotChar.find(".char-aruku-left").removeClass("char-aruku-left").addClass("char-winner");
    dotChar.find(".dot-base-circle").attr("style","left: 0px; bottom: 0px; width:100%");
    dotChar.attr("style", "width:60px; height:70px;");
    $("#charDot").html("");
    $("#charDot").append(dotChar);

    for (let key of PARAM_KEY) {
        $(".char" + key).val(NOW_CHAR["MAX" + key] + LIMIT_BASE);
    }
    // スタイル一覧表示
    displayStyleList();

    displayAbilityButton();
    // スタイル初期表示
    displayStyleInfo(styleId);
    var name = NOW_CHAR['Name'].replace(/\(\)/, "").trim();
    $.getJSON(`https://romasagatool.com/blog/get_the_archives.php?tag=${name}&callback=rssCallbackTag&rssCallbackTag=?`);
}
;

function callAPI(param) {
    var cid = (param['cid'] !== undefined) ? `&cid=${param['cid']}` : "";
    var sid = (param['sid'] !== undefined) ? `&sid=${param['sid']}` : "";
    var rareWeapon = [101500600, 102500200, 104500400,105500400,105500500,106500300,108500400,109500400,110500900,155500300,151500400];
    var rare = `&rare=S`; // + rareWeapon.join(",");
    var limit = 5;
//    $.getJSON(`https://romasagatool.com/api/${AUTO_RANKING_SCRIPT}.php?limit=${limit}${cid}${sid}${rare}&turn=2&round=0,99&multi=0,2&c=dispAutoRank2&dispAutoRank2=?`);
//    $.getJSON(`https://romasagatool.com/api/${AUTO_RANKING_SCRIPT}.php?limit=${limit}${cid}${sid}${rare}&turn=3&round=0,99&multi=0,2&c=dispAutoRank3&dispAutoRank3=?`);
//    $.getJSON(`https://romasagatool.com/api/${AUTO_RANKING_SCRIPT}.php?limit=${limit}${cid}${sid}${rare}&turn=3&round=0,99&multi=0,2&range=all&c=dispAutoRankAll&dispAutoRankAll=?`);
//    $.getJSON(`https://romasagatool.com/api/style_damage_rank.php?sid=${param['sid']}&c=dispDamageRatio&dispDamageRatio=?`);    
 
    uid = (NOW_UID) ? `&uid=${NOW_UID}` : "" ;
//    $.getJSON(`https://romasagatool.com/api/vote_style.php?${sid}${uid}&c=dispVoteRadar&dispVoteRadar=?`);    
}
function dispDamageRatio(data){
    $(".SINGLE_FIRE_IMG").html("");
    $(".MULTI_FIRE_IMG").html("");
    //var single = Math.floor(data['singleRank'])/100;
    var single = Math.floor(data['singleHensa'] - 25)/10;
    single = (single > 5) ? 5.00 : single;
    single = (single < 0) ? 0.01 : single;
    for(var i = 0; i<5; i++){
        $star = getStarIcon((single - i));
        $(".SINGLE_FIRE_IMG").append($star);
    }
    $(".SINGLE_FIRE").html(single.toFixed(2));
    $(".SINGLE_FIRE_DTL").html("偏差値:"+data['singleHensa'].toFixed(2));
    
    //var multi = Math.floor(data['multiRank'])/100;
    var multi = Math.floor(data['multiHensa'] - 25)/10;
    multi = (multi > 5) ? 5 : multi;
    multi = (multi < 0) ? 0.01 : multi;
    for(var i = 0; i<5; i++){
        $star = getStarIcon((multi - i));
        $(".MULTI_FIRE_IMG").append($star);
    }
    $(".MULTI_FIRE").html(multi.toFixed(2));
    $(".MULTI_FIRE_DTL").html("偏差値:"+data['multiHensa'].toFixed(2));
    

}

function changeVoteButton(){
    $("#VOTE_STAR").removeClass("icon_btn_positive").addClass("icon_btn_negative");
    $(".NO_VOTE").addClass("d-none");
    $(".ALREADY_VOTE").removeClass("d-none");
}
function resetVoteButton(){
    $("#VOTE_STAR").addClass("icon_btn_positive").removeClass("icon_btn_negative");
    $(".NO_VOTE").removeClass("d-none");
    $(".ALREADY_VOTE").addClass("d-none");
}


function dispVoteRadar(data){
    if(data['mydata']['col1'] !== undefined){
        for(var type in data['mydata']){
            changeVoteStar(data['mydata'][type], VOTE_DB_COLUMN[type] );
        }
        changeVoteButton();
    } else {
        // 自分が投票してるスタイルじゃないから元に戻す
        for(var type in VOTE_DB_COLUMN){
            changeVoteStar(3, VOTE_DB_COLUMN[type] );
        }
        resetVoteButton();
    }
    if(data['calc']['col1'] !== undefined){
        for(var type in data['calc']){
            if(VOTE_DB_COLUMN[type] == undefined){
                continue;
            }
            var clazzName = VOTE_DB_COLUMN[type].toUpperCase();
            var val = data['calc'][type];
            $(`.${clazzName}`).html(Number(val).toFixed(2));
            $(`.${clazzName}_IMG`).html("");
            $(`.${clazzName}_DTL`).html("投票数:"+data['calc']['cnt']);
            for(var i = 0; i<5; i++){
                $star = getStarIcon(val-i);
                $(`.${clazzName}_IMG`).append($star);
            }
        }
    } else {
        for(var type in VOTE_DB_COLUMN){
            var clazzName = VOTE_DB_COLUMN[type].toUpperCase();
            var val = 0;
            $(`.${clazzName}`).html("0.00");
            $(`.${clazzName}_IMG`).html("");
            $(`.${clazzName}_DTL`).html("投票数:0");
            for(var i = 0; i<5; i++){
                $star = getStarIcon(val-i);
                $(`.${clazzName}_IMG`).append($star);
            }
        }
    }
}

function rssCallbackTag(data){
    $("#CHAR_ARTICLE_BODY").html("");
    if(data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var entry = data[i];
            var $article = $("#ARTICLE_CARD").clone().removeClass("d-none").addClass("d-inline-block").attr("id","");
            $article.find("a").attr("href", entry.link);
            $article.find(".sImg").attr("src", entry.thumb);
            $article.find(".lImg").attr("src", entry.thumb);
            $article.find(".title").html(entry.title);
            $article.find(".update").html(entry.pubdate);
            $("#CHAR_ARTICLE_BODY").append($article);
        }
        $("#CHAR_ARTICLE").removeClass("d-none");
    } else {
        $("#CHAR_ARTICLE").addClass("d-none");
    }
}

function voteAPI(){
    var param = `uid=${NOW_UID}&sid=${NOW_STYLE['Id']}&v1=${VOTE['shukai']}&v2=${VOTE['hanyo']}&v3=${VOTE['only']}`;
    $.getJSON(`https://romasagatool.com/api/vote_style.php?${param}&c=dispVoteRadar&dispVoteRadar=?`);    
}
function dispAutoRank2(data){
    callbackTmp(data, "AUTO_PATTERN2", "normal");
}
function dispAutoRank3(data){
    callbackTmp(data, "AUTO_PATTERN3", "normal");
}
function dispAutoRankAll(data){
    callbackTmp(data, "AUTO_PATTERN_ALL", "all");
}
function callbackTmp(data, target, rangeOrder) {

    var NORMAL_ATTACK = {"Id":"normal","Name":"通常攻撃", "SkillIryoku":7};
    $("#"+target).html("");
    var map = {
        "tate": {"敵単体":1, "敵縦一列":3, "敵全体":3},
        "yoko": {"敵単体":1, "敵横一列":3, "敵全体":3},
        "all": {"敵単体":1, "敵縦一列":2, "敵横一列":2, "敵全体":4},
    };

    var kobetuKey = (rangeOrder == "normal") ? "one" : rangeOrder;
    var styleList = [];
    for (var rank in data) {
        var rec = data[rank];

        var $rank_card = $("#CARD_TEMPLATE").clone().attr("id","").removeClass("d-none").addClass("col-12");
        var styleInfo = STYLE_MASTER[rec['sid']];
        var cutImg = getImgPath(`style_cutin/${rec['sid']}.png`);
        
        $rank_card.find(".CHAR_NAME").html(styleInfo['Name']);
        $rank_card.find(".ANOTHER_NAME").html(styleInfo['AnotherName']);
        $rank_card.find(".WEAPON_RARE").attr("src", getImgPath(`icon/icon_${rec['rare']}.png`));
        var color = "fuchidori-blue" ;
        var wpName = rec['weapon'];
        if(rec['rare'] == "SS"){
            color = "fuchidori-yellow";
            wpName = SS_WEAPON[rec['weapon']]['Name'];
        }
        $rank_card.find(".WEAPON").html(wpName).addClass(color);
        
        style = $rank_card.find(".dot").attr('style');
        cutinStyle = $rank_card.find(".CUTIN").attr('style');
        $rank_card.find(".CUTIN").attr('style', ` background: url(${cutImg}) no-repeat;` + cutinStyle);
        
        if ($.inArray(rec['sid'], styleList) > -1) {
            continue;
        }
        var damageInfo = {};
        var dKey = ["Id","one","tate","yoko","all","status","ab","resist"];
        var tmpSkillSplit = rec['skill'].split("|");

        var turnAction = {};
        // ターンごとのアクション
        var totalDamage = 0;
        for (var turn in tmpSkillSplit){
            turnAction[turn] = [];

            tmpSkillData = tmpSkillSplit[turn];
            var multi = tmpSkillData.split("_");
            // 多段攻撃のアクション
            var before = "";
            var before = "";
            var beforeName = "";
            var multiCount = 1;
            for (var j in multi){
                var d = multi[j].split("/");
                var tmp = {};
                for(var key in dKey){
                    tmp[dKey[key]] = d[key];
                }

                var skillInfo = (["normal","wait"].indexOf(tmp["Id"]) == -1) ? SKILL_MASTER[tmp["Id"]] : NORMAL_ATTACK;
                var damageOrg = Number(tmp[kobetuKey]);
                var damage = damageOrg;
                var damageTarget = 1;
                if(rangeOrder != "normal"){
                    var area = skillInfo['AttackArea'];
                    var constMap = map[rangeOrder];
                    damageTarget = (constMap[area] !== undefined) ? constMap[area] : 1;
                }
                damage /= damageTarget;
                totalDamage += damageOrg;

                if(tmp["Id"] == "wait"){
                    skillInfo["Name"] = "┗溜め状態";
                    var output = [skillInfo["Name"], 0, tmp['status'], "--", "--", 1];
                } else {
                    var output = [skillInfo['Name'], damage, tmp['status'], tmp['resist'],tmp['ab'], 1];
                }

                // 全体攻撃などでヒット数が上がってる場合は追加
                if(damageTarget > 1) {
                    output[5] = damageTarget;
                }
                if (beforeName != skillInfo['Name'] ||
                    (before != (turn + skillInfo['Name'] + damage)) ) {
                    //console.log("無条件あり追加", beforeName , before, turn , turnAction[turn]);
                    // 技名称が変わってれば追加
                    turnAction[turn].push(output);
                } else if(before == (turn + skillInfo['Name'] + damage) ){
                    multiCount++;

                    //console.log("書き換え", beforeName , before, multiCount);
                    // ダメージが変わってなければインクリメント
                    output[5] = multiCount;
                    turnAction[turn].pop();
                    turnAction[turn].push(output);
                }
                if(j == 0){
                    damageInfo[tmp["Id"]] = tmp;
                }

                beforeName = skillInfo['Name'];
                before = (turn + skillInfo['Name'] + damage);
            }
        }
        if(rangeOrder != "normal"){
            totalDamage /= 4;
        }

        $rank_card.find(".AVG_DAMAGE").html(Math.floor(Number(totalDamage/tmpSkillSplit.length)).toLocaleString());

        // ターンアクションの表示
        for(var i in turnAction){
            var tr = rec['round'] == 1 ? "R" : "T";
            var t = (Number(i) + 1) + tr;
            for(var d in turnAction[i]) {
                var row = turnAction[i][d];
                var count = row[5];
                var cnt = "";
                if(count > 1){
                    cnt = "*"+count;
                }
                $tr = $(`<tr>
                <td>${t}</td>
                <td class="fuchidori-blue text-right">${Number(row[1]).toLocaleString()}</td>
                <td>${cnt}</td>
                <td>${row[0]}</td>
                <td>${row[2]}</td>
                <td>耐性:${row[3]}</td>
                <td>ｱﾋﾞ:${row[4]}%</td>
                </tr>`);
                $rank_card.find(".TURN_ACTION").append($tr);
                // 多段攻撃ように消す
                t = "";
            }
        }

        var kuakuseis = rec['kakusei'].split("|");
        var kakuseiMap = {};
        for(k of kuakuseis){
            var tmp = k.split(":");
            kakuseiMap[tmp[0]] = SKILL_MASTER[tmp[0]];
            kakuseiMap[tmp[0]]['nowKakusei'] = Number(tmp[1]);
            kakuseiMap[tmp[0]]['isKeisho'] = 0;
            kakuseiMap[tmp[0]]['RentatsuBp'] = kakuseiMap[tmp[0]]['ConsumeBp'];
            if(SKILL_MASTER[tmp[0]]['Rentatsu'] != undefined) {
                var orgInfo = SKILL_MASTER[SKILL_MASTER[tmp[0]]['Rentatsu']];
                // 練達でBPが変化する場合
                if(orgInfo['ConsumeBp'] != kakuseiMap[tmp[0]]['ConsumeBp']) {
                    kakuseiMap[tmp[0]]['RentatsuBp'] = orgInfo['ConsumeBp'];
                }
            }
            kakuseiMap[tmp[0]]['UseBp'] = kakuseiMap[tmp[0]]['RentatsuBp'] - tmp[1];
        }

        var dispSkill = [NORMAL_ATTACK];
        for (var skillId of STYLE_MASTER[rec['sid']]['SkillIds']) {
            var skillInfo = SKILL_MASTER[skillId];
            // 使用済みは問題なし
            if(kakuseiMap[skillId] !== undefined){
                dispSkill.push(kakuseiMap[skillId]);
                delete kakuseiMap[skillId];
            } else if(kakuseiMap[skillInfo['Rentatsu']] !== undefined){
                // 練達した物を使ってる場合はそっちを利用する
                dispSkill.push(kakuseiMap[skillInfo['Rentatsu']]);
                delete kakuseiMap[skillInfo['Rentatsu']];
            }
        }
        for (var skillId in kakuseiMap) {
            kakuseiMap[skillId]['isKeisho'] = 1;
            dispSkill.push(kakuseiMap[skillId]);
            delete kakuseiMap[skillId];
        }

        // 技一覧
        for (var i in dispSkill) {
            var skillId = dispSkill[i]['Id'];
            if(skillId == "normal") {
                continue;
            }

            var skillInfo = dispSkill[i];

            var $skill_card = $rank_card.find(".SKILL_TEMPLATE").clone().attr("id","").removeClass("d-none SKILL_TEMPLATE");
            var numClass = (damageInfo[skillId] != undefined) ? "" : "fuchidori-red";

            var kakusei = skillId === "normal" ? 0 : skillInfo['Kakusei'];
            var kakuseid = skillId === "normal" ? 0 : skillInfo['nowKakusei'];
            var topLine = (skillInfo['isKeisho'] == 1) ? `border-top: 2px ivory dotted;` : "";

            // 属性設定
            var Attrs = skillId === "normal" ? WEAPON_ATTR[styleInfo['WeaponType']] : skillInfo['AttackAttributes'];
            var skillDiv = "";
            Attrs.split(',').forEach(function (value) {
                skillDiv += `<span class="icon_xs ${ICON_LIST[value]}">　</span>`;
            });
            $skill_card.find(".ATTR_ICON").append(skillDiv);

            var skillName = `${skillInfo['Name']} (${skillInfo['SkillIryoku']})`;
            $skill_card.find(".SKILL_NAME").append(skillName).addClass(numClass);
            $skill_card.attr("style", topLine);
            $rank_card.find(".SKILL_TEMPLATE").before($skill_card)

            if(skillId === "normal" ) {
                $skill_card.find(".BP").addClass("d-none");
            } else {
                var ret = ( ' ' + Number(skillInfo['UseBp']) ).slice( -2 );
                $skill_card.find(".BP").append(ret).addClass(numClass);
            }

            ////////////
            var k = "";
            var rentatsu = "";
            var kakusei = skillInfo['Kakusei'];
            var kakuseid = skillInfo['nowKakusei'];
            // 練達前後でBPが違う場合は覚醒可能回数を調整する
            if(skillInfo['RentatsuBp'] != skillInfo['ConsumeBp']) {
                rentatsu = (kakuseid > 0) ? "(◆)" : "(◇)";
                kakuseid--;
            }
            for (var j = 0; j < kakusei; j++) {
                k += (j >= kakuseid) ? "◇" : "◆";
            }
            k += rentatsu;
            ////////////            
            $rank_card.find(".KAKUSEI_TEMPLATE").append(k + "<br>");
        }
        $("#" + target).append($rank_card);
    }
};


function displayGetDamageValue(styleInfo, armVit=0, armMnd=0) {
    // 計算用のステータスを取得
    $(".STYLE_VAL_ROW").each(function(){
        if(styleInfo['Id'] == $(this).attr("data-id")) {
            vit = $(this).find(".VIT").find(".val").text();
            mnd = $(this).find(".MND").find(".val").text();
        }
    });
    $("#STYLE_ST_ROW").each(function(){
        charVit = $(this).find(".MAXVIT").text();
        charMnd = $(this).find(".MAXMND").text();
    });

    var optionKeigen = (1 - 0);
    //mnd = Number(vit) + armVit + parseInt(charVit * 0.60);
    vit = Number(vit) + armVit + parseInt(charVit * 0);
    mnd = Number(mnd) + armMnd + parseInt(charMnd * 0);

    var ability = 0.9 * 0.9 * ABILITY_DAMAGE_CUT_CALC;
    var dispAb = ABILITY_DAMAGE_CUT_DISP_CALC;

    var WEAPON = 0, RANK = 40,MASTER = 0,ABILITY_BAI = 0,HOSEI = 30, TYPE ="dken", STR = 190, AGI = 0, N = 6;
    $("#calcVit").html(vit);
    $("#calcMnd").html(mnd);
    // 90%*90% = 81% = 19%
    // 90%*90%*30 = 81% = 19%
    var dispKeigen = Math.floor((1-ability) * 1000) /10;
    $("#calcResistAb").html(`${dispKeigen}% (${dispAb}10%,10%)`);

    var skillIryoku = [12,24,36];
    for (let idx in RESIT_MAP) {
        var z = RESIT_MAP[idx];
        resist = $(".calc_taisei_" + z).html();
        // 162, 183
        for(let skillIdx in skillIryoku) {
            skill = skillIryoku[skillIdx]
            //STR = 297;
            if(ABILITY_DAMAGE_ZERO[idx] == 1) {
                d = 0;
                m = 0;
            } else {
                d = damage(TYPE, STR, AGI, WEAPON, skill, RANK, vit, MASTER, ABILITY_BAI, resist, N, HOSEI);
                m = damage(TYPE, STR, AGI, WEAPON, skill, RANK, mnd, MASTER, ABILITY_BAI, resist, N, HOSEI);
                d = parseInt(d * ability);
                m = parseInt(m * ability * optionKeigen);
            }
            $(".damage_"+z+"_" + skillIdx +"v").html(d.toLocaleString());
            $(".damage_"+z+"_" + skillIdx +"m").html(m.toLocaleString());
            //$(".col_"+(skillIdx*2)).html(vit.toLocaleString());
            //$(".col_"+(skillIdx*2+1)).html(mnd.toLocaleString());
        }
    }
}
function displayHealValue(styleInfo) {
    $("#HEAL_AREA").hide();
    $("#HEAL_AREA").find(".TMP").remove();
    var ai = 0;
    var mi = 0;
    var OTHER_BUFF = 0 / 100;
    var MI_LIST = [
        230 + parseInt(LIMIT_BASE * OTHER_BUFF),
        250 + parseInt(LIMIT_BASE * OTHER_BUFF), 
    ];
    // 計算用のステータスを取得
    $(".STYLE_VAL_ROW").each(function(){
        if(styleInfo['Id'] == $(this).attr("data-id")) {
            ai = $(this).find(".AI").find(".val").text();
            mi = $(this).find(".MI").find(".val").text();
        }
    });
    $("#STYLE_ST_ROW").each(function(){
        charAi = $(this).find(".MAXAI").text();
        charMi = $(this).find(".MAXMI").text();
    });
    ai = Number(ai) + parseInt(Number(charAi) * OTHER_BUFF);
    mi = Number(mi) + parseInt(Number(charMi) * OTHER_BUFF);

    $("#HEAL_AREA").find(".HEAL_AI").html(ai);

    var ability = 0;
    for(var idx in styleInfo['StyleAbilityIds']) {
        abilityId = styleInfo['StyleAbilityIds'][idx];
        let abInfo = ABILITY_MASTER[abilityId];
        for(var attr of abInfo['Attr']) {
            if(attr['main'] == "追撃") {
                addId = attr['text'];                
                if(SKILL_MASTER[addId] != undefined 
                    && SKILL_MASTER[addId]['Mod'].indexOf("回復威力") > -1) {
                    healSkill.push(addId);
                }
            }
        }

        if (["ID29d93233"].indexOf(abilityId) > -1) {
            ability += 15; // 回復強化III
        } else if (["ID29d93234"].indexOf(abilityId) > -1) {
            ability += 10; // 回復強化II
        } else if (abilityId === "ID29d93235") {
            ability += 5; // 回復強化I
        }
    }
    for(skillId of healSkill){
        var skillInfo = SKILL_MASTER[skillId];
        var hs = skillInfo['HealIryoku'];
        var miList = [mi];
        var rank = 0;
        var weapon = [0];
        var jimae = true;
        var tmpAbility = 0;
        // 技の追加効果で回復するものじゃない＝回復行動
        if(hs === undefined){
            hs = skillInfo['SkillIryoku'];
            // 対象をとるものは相手の魅力を参照する
            if(skillInfo['FlavorText'].indexOf("対象のHP") > -1) {
                miList = MI_LIST;
            }
            rank = 99;
            weapon = (BattleTypeWeapon[styleInfo['WeaponType'] + skillInfo['BattleType']] !== undefined) 
                ? BattleTypeWeapon[styleInfo['WeaponType'] + skillInfo['BattleType']] : [WEAPON_MAP[styleInfo['WeaponType']]['weapon']];
            jimae = false;
            tmpAbility = ability;
        }
        if(skillInfo['FlavorText'].indexOf("全体のHPを回復") > -1) {
            miList = MI_LIST.concat(mi);
        }

        for(wp of weapon){
            var wpIcon = "";
            if(wp >= 40) {
                wpIcon = getImgPath("icon/icon_SS.png");
                wpIcon = $(`<img src="${wpIcon}" style="width:25px">`);
            } else if (wp > 0) {
                wpIcon = getImgPath("icon/icon_S.png");
                wpIcon = $(`<img src="${wpIcon}" style="width:25px">`);
            } else {
                wp = "---";
            }
            for(tmpMi of miList){
                var isGokusho = (skillInfo['FlavorText'].indexOf("極小") > -1) ? 4 : 1;
                var healRange = getHeal(jimae, wp, Number(hs), rank, Number(ai), Number(tmpMi), tmpAbility);
                var $row = $("#HEAL_AREA").find(".ROW").clone().removeClass("d-none").removeClass("ROW").addClass("TMP");
                $row.find(".HEAL_NAME").html(skillInfo['Name']);
                if(wp > 0) {
                    $row.find(".HEAL_WEAPON").append(wpIcon.clone());
                }
                $row.find(".HEAL_WEAPON").append(wp);
                $row.find(".HEAL_IRYOKU").html(hs);
                $row.find(".HEAL_MI").html(tmpMi);
                $row.find(".HEAL_RANGE").html(`<span class="d-sm-none">${Math.floor(healRange[6]/isGokusho)}</span><span class="d-none d-sm-inline">${Math.floor(healRange[0]/isGokusho)}〜${Math.floor(healRange[9]/isGokusho)}</span>`);
                $row.find(".HEAL_ABILITY").html((tmpAbility > 0) ? "+"+tmpAbility+"%" : "");
                $("#HEAL_AREA").find(".ROW").before($row);
            }
        }
    }

    for(var idx in styleInfo['StyleAbilityIds']) {
        abilityId = styleInfo['StyleAbilityIds'][idx];
        let abInfo = ABILITY_MASTER[abilityId];
        abilityName = abInfo['Name'];
        hs = 0;
        miList = [mi];
        isGokusho = false;
        for(var attr of abInfo['Attr']) {
            if(attr['main'] != "HP回復") {
                continue;
            }
            size = filterNumber(attr['size']);
            hs += (size == 54) ? 5 : size;
            isGokusho = (size == 54);
            if(attr['sub'].indexOf("味方生存者") > -1 ) {
                miList = MI_LIST.concat(mi);
            }
        }
        if(hs == 0){
            continue;
        }
        for(tmpMi of miList){
            var target = (tmpMi != mi && miList.length > 1) ? " (味方)" : "";
            $("#HEAL_AREA").find(".HEAL_AI").html(ai);

            var healRange = getHeal(true, 0, Number(hs), 0, Number(ai), Number(tmpMi), 0);
            healRange[0] = isGokusho ? Math.floor(healRange[0] / 4) : healRange[0];
            healRange[6] = isGokusho ? Math.floor(healRange[6] / 4) : healRange[6];
            healRange[9] = isGokusho ? Math.floor(healRange[9] / 4) : healRange[9];
            var $row = $("#HEAL_AREA").find(".ROW").clone().removeClass("d-none").removeClass("ROW").addClass("TMP");
            $row.find(".HEAL_NAME").html(abilityName + target);
            $row.find(".HEAL_WEAPON").html("---");
            $row.find(".HEAL_IRYOKU").html(hs);
            $row.find(".HEAL_MI").html(tmpMi);
            $row.find(".HEAL_RANGE").html(`<span class="d-sm-none">${healRange[6]}</span><span class="d-none d-sm-inline">${healRange[0]}〜${healRange[9]}</span>`);
            $row.find(".HEAL_ABILITY").html();
            $("#HEAL_AREA").find(".ROW").before($row);
        }        
    }
    if($("#HEAL_AREA").find(".TMP").length > 0) {
        $("#HEAL_AREA").show();
    }
}


var ABILITY_DAMAGE_CUT = 1;
var ABILITY_DAMAGE_CUT_DISP = "";
var ABILITY_DAMAGE_CUT_CALC = 1;
var ABILITY_DAMAGE_CUT_DISP_CALC = "";
var ABILITY_DAMAGE_ZERO = [0,0,0, 0,0,0,0,0];
var ABILITY_DAMAGE_ATTR_CUT = {"VIT":[0,0,0, 0,0,0,0,0], "MND":[0,0,0, 0,0,0,0,0] } ;
var ABILITY_DAMAGE_MAP = ["斬","打","突", "熱","冷","雷","陽","陰"];
function displayAbilityButton() {
    // 初期化
    ABILITY_DAMAGE_CUT = 1;
    ABILITY_DAMAGE_CUT_DISP = "";
    ABILITY_DAMAGE_CUT_CALC = 1;
    ABILITY_DAMAGE_CUT_DISP_CALC = "";
    ABILITY_DAMAGE_ZERO = [0,0,0, 0,0,0,0,0];
    ABILITY_DAMAGE_ATTR_CUT = {"VIT":[0,0,0, 0,0,0,0,0], "MND":[0,0,0, 0,0,0,0,0] } ;
    $("#BUTTON_AREA").html("");

    styleInfo = NOW_STYLE;
    var showButton = false;

    for(var idx in styleInfo['StyleAbilityIds']) {
        abilityId = styleInfo['StyleAbilityIds'][idx];
        var abInfo = ABILITY_MASTER[abilityId];
        for(attr of abInfo['Attr']) {
            if(
                (attr['main'] == "かばう" && attr['sub'] == "ダメージ軽減あり")
                || (attr['main'] == "カウンター" && attr['sub'] == "ダメージ軽減")
             ) {
                // 軽減がある場合は使う
            } else if(attr['main'] != "被ダメージ軽減" && attr['main'] != "被ダメージ軽減(全体)") {
                continue;
            }
            if(attr['sub'].indexOf("を含むダメージ") > -1) {
                var target = attr['sub'].replace("属性を含むダメージ", '');
                ABILITY_DAMAGE_ZERO[ABILITY_DAMAGE_MAP.indexOf(target)] = 1;
                continue;
            }
            
            var per = (attr['main'] != "カウンター")
                ? attr['size'].replace(/[^0-9]/g, '')
                : 35; // "特大(30%)"
            // 常時発動は計算に入れる
            if(attr['sub'] == "攻撃を受けた時" && attr['time'] == "必ず(100%)" 
            && attr['size'].indexOf("上限") == -1
            && attr['maxLimit'] == "") {
                ABILITY_DAMAGE_CUT *= (100 - per ) / 100;
                ABILITY_DAMAGE_CUT_DISP += per + "%,"
                continue;
            }
            // 条件発動ばボタンにする
            showButton = true;
            $btn = $("#AB_BTN_TMPL").clone().attr("id","").addClass("ability_switch").removeClass("d-none");
            $btn.attr("data-per", per);
            $btn.html(abInfo['Name']);
            $("#BUTTON_AREA").append($btn.clone());
        }
    }
    ABILITY_DAMAGE_CUT_CALC = ABILITY_DAMAGE_CUT;
    ABILITY_DAMAGE_CUT_DISP_CALC = ABILITY_DAMAGE_CUT_DISP;

    for (let styleId of NOW_CHAR['Holders']) {
        var styleInfo = STYLE_MASTER[styleId];
        if(styleInfo === undefined){
            continue;
        }
        for (let skillId of styleInfo['SkillIds']) {
            let skillInfo = SKILL_MASTER[skillId];
            // TODO 魔法たてはあとで考える
            for(modIdx in skillInfo['Mod']) {
                if(skillInfo['Mod'][modIdx].indexOf("ガードアップ") > -1 
                || skillInfo['Mod'][modIdx].indexOf("防御強化") > -1 
                || skillInfo['Mod'][modIdx].indexOf("防御カウンター") > -1 ) {
                    var per = skillInfo['Mod99'][modIdx] != "" ? skillInfo['Mod99'][modIdx] : skillInfo['Mod1'][modIdx];
                    // 条件発動ばボタンにする
                    showButton = true;
                    $btn = $("#AB_BTN_TMPL").clone().attr("id","").addClass("ability_switch").removeClass("d-none");
                    $btn.attr("data-per", per);
                    $btn.html(skillInfo['Name'] + "<br>"+skillInfo['Mod'][modIdx]);
                    $("#BUTTON_AREA").append($btn.clone());
                }
            }
        }
    }

    if (showButton) {
        $("#ABILITY_BUTTON_AREA").removeClass("d-none");
    } else {
        $("#ABILITY_BUTTON_AREA").addClass("d-none");
    }
};

