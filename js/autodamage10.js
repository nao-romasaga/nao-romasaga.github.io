const METHOD_P = {1:"", 2:"[間]"};
var ATTR_DISP = true;
var METHOD_DISP = false;

var SKIP_YEAR = 2021; // この年未満はスキップ
$("#SKIP_YEAR").html(SKIP_YEAR);

function _initial() {
    intialMyStyle();
}
function _noLoginInitial() {
    $(".noLogin").hide();
}

$(".opacity-char-back").slideUp();
$("#_icon_ken").slideDown();
$("#CHAR_HEADER").hide();
$("#STYLE_HEADER").hide();
$("#howtobody").slideUp();
$("#jokenbody").slideUp();
var SS_WP_ID_LIST = {}; // こっちには全部のIDが入る
var FILTER_SS_WEAPON = {}; 

$("#howtohead").click(function () {
    gtag('event', "clickHowto", { 'event_category': "autodamage", 'event_label': "open", 'value': 1 });
    $("#howtobody").slideToggle()
});
$("#jokenhead").click(function () {
    gtag('event', "clickJoken", { 'event_category': "autodamage", 'event_label': "open", 'value': 1 });
    $("#jokenbody").slideToggle()
});

var limOrder = "";
var rangeOrder = "";
var bpOrder = 10;
var turnOrder = 10;

var cid = "";
var sid = "";
var dup = false;
var lastParam = {
    'same' : false,
};
var SS_WEAPON = {};
$(document).ready(function ($) {
    //$("#SS_WEAPON_AREA").slideToggle();
    $("#SS_WEAPON_TOGGLE").click(function(){
        $("#SS_WEAPON_AREA").slideToggle();
        $("#SS_WEAPON_TOGGLE").find(".fas").toggleClass("fa-caret-down").toggleClass("fa-caret-up");
    });

    nowMaster = [];
    for(key in WEAPON_MAP) {
        nowMaster.push(key+"="+WEAPON_MAP[key]['master']);
    }
    $("#NOW_MASTER_LV_LIST").html(nowMaster.join("、"));
    $("#NOW_SERIES_SETTING").html(RENSEI_PER);
    
    $("#NOW_URA").html(URA);
    
    

    $("#JINKEI_AREA").slideUp();
    $(".SMART_DISP").toggleClass("d-none");
    //setArmorVal();
    dispChar2(CHAR_MASTER);
    dispWeapon();
    dispEventChar();
    callAPI({ 'dup': true , 'wp': getSSIdParam() ,'round': "T", 'multi':[0,2] });
});

function getSSIdParam() {
    // リセット
    FILTER_SS_WEAPON = {};
    $(".weapon").each(function(){
        var id = $(this).attr("data-id");
        var nextOn = $(this).hasClass("ss-checked");    
        if(!nextOn) {
            FILTER_SS_WEAPON[id] = 1;
        }
    });

    var SS_IGNORE = [];
    for(id in SS_WP_ID_LIST) {
        if(FILTER_SS_WEAPON[id] == undefined) {
            SS_IGNORE.push(id);
        }        
    }
    //return Object.keys(FILTER_SS_WEAPON).join(",");
    return SS_IGNORE.join(",");
}

var EVENT_STYLE = [];
function setArmorVal() {
    for(target of ["STR","DEX","AGI","INT"]) {
        for(key of ["MAIN","SUB","ACC"]) {
            armor = ARMOR_RANK_DATA[key][target]; 
            for(st of ["STR","DEX","AGI","INT"]){
                var x = Number($(`#${target}_${st}`).text());
                x = (x == 0) ? URA : x;
                $(`#${target}_${st}`).text(ARMOR_RANK_DATA[key][target][st] + x);
            }
        }
    }    
}

function dispEventChar(){
    var date = new Date();
    // UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
    var now = Math.floor(date.getTime() / 1000);
    for (var i in EVENT_ABILITY) {
        var limit = EVENT_ABILITY[i]['LIMIT'];
        var start = EVENT_ABILITY[i]['START'];
        var quest = EVENT_ABILITY[i]['QUEST'];
        var char = EVENT_ABILITY[i]['CHAR'];
        if (limit > now && now > start) {
            var d = new Date(limit * 1000);
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var hour = ('0' + d.getHours()).slice(-2);
            var min = ('0' + d.getMinutes()).slice(-2);
            var div = $("<div>").append(`<div>${month}/${day} ${hour}:${min}まで<br>${quest}</div>`);
            $("#toku_area").append(div);
            for (var dotId of char) {
                var dotCharDiv = $(`.${dotId}`).first().parent().clone();
                $("#toku_area").append(dotCharDiv);
                var charId = dotCharDiv.find(".dot").attr("data-id");
                EVENT_STYLE.push(charId);
            }
        }
    }
    EVENT_STYLE = EVENT_STYLE.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });
}

$(document).on("click", ".weapon", function () {
    // checkedがあればON。オフにする
    var isOff = $(this).hasClass("ss-checked");
    if(isOff) {
        // 次はonなのでfilter解除
        $(this).removeClass("ss-checked");
    } else {
        // フィルターする
        $(this).addClass("ss-checked");
    }
    $("#SS_FILTER").addClass("icon_btn_positive").removeClass("icon_btn_negative");
    $("#SS_SAVE").addClass("icon_btn_positive").removeClass("icon_btn_negative");    
});

$(document).on("click", "#SS_TOGGLE", function () {
    var nextOff = $(this).hasClass("icon_btn_positive");
    weaponOnOff(nextOff, ".SS_WP_AREA");
    $(this).toggleClass("icon_btn_positive").toggleClass("icon_btn_negative");
    $("#SS_FILTER").addClass("icon_btn_positive").removeClass("icon_btn_negative");
    $("#SS_SAVE").addClass("icon_btn_positive").removeClass("icon_btn_negative");    
});
$(document).on("click", "#SS_TUIOKU_TOGGLE", function () {
    var nextOff = $(this).hasClass("icon_btn_positive");
    weaponOnOff(nextOff, ".SS_TUIOKU_WP_AREA");
    $(this).toggleClass("icon_btn_positive").toggleClass("icon_btn_negative");
    $("#SS_FILTER").addClass("icon_btn_positive").removeClass("icon_btn_negative");
    $("#SS_SAVE").addClass("icon_btn_positive").removeClass("icon_btn_negative");    
});

function weaponOnOff(nextOff, target) {
    $(`${target} .weapon`).each(function(){
        if(nextOff) {
            $(this).addClass("ss-checked");
        } else {
            $(this).removeClass("ss-checked");
        }
    });        
}

$(document).on("click", "#SS_SAVE", function () {
    $("#SS_SAVE").removeClass("icon_btn_positive").addClass("icon_btn_negative");
    $("#SS_LOAD").removeClass("icon_btn_positive").addClass("icon_btn_negative");
    if (UID !== undefined ) {
        // FILTER_SS_WEAPONの中身をリセット
        getSSIdParam();
        var ids = Object.keys(FILTER_SS_WEAPON).join(",");
        updateData("SS_WEAPON", {"id":ids}, true);
    }
});
$(document).on("click", "#SS_LOAD", function () {
    $("#SS_SAVE").removeClass("icon_btn_positive").addClass("icon_btn_negative");
    $("#SS_LOAD").removeClass("icon_btn_positive").addClass("icon_btn_negative");
    if (UID === undefined ) {
        alert("読み込み中です。しばらくお待ちください");
        return;
    }
    readUserData("SS_WEAPON", function (result) {
        if (result !== null) {
            weaponOnOff(true, 9);
            weaponOnOff(true, 12);
            FILTER_SS_WEAPON = {};
            for(ids of result["id"].split(",")) {
                FILTER_SS_WEAPON[ids] = 1;
            }
            $(".weapon").each(function(){
                var id = $(this).attr("data-id");
                if(FILTER_SS_WEAPON[id] != undefined) {
                    $(this).removeClass("ss-checked");
                }
            });
            $("#SS_FILTER").addClass("icon_btn_positive").removeClass("icon_btn_negative");
        } else {
            console.log("no data");
        }
    }, false);        
});

$(document).on("click", "#SS_FILTER", function () {
    $("#SS_FILTER").removeClass("icon_btn_positive").addClass("icon_btn_negative");
    // リセット
    lastParam["wp"] = getSSIdParam();

    callAPI(lastParam);
});
$(".dispFilterButton").click(function () {
    $(this).toggleClass("icon_btn_on icon_btn_off");
    $(this).find(".TOGGLE").toggleClass("fa-toggle-off fa-toggle-on");

    var targetClass = $(this).attr("data-target");
    var on = Boolean($(this).attr("data-on") == "true");
    if(on) {
        $(`.${targetClass}`).addClass("d-none");
    } else {
        $(`.${targetClass}`).removeClass("d-none");
    }

    $(this).attr("data-on", !on);

    if(targetClass == "attr") {
        ATTR_DISP = !on;
    } else {
        METHOD_DISP = !on;
    }
});

$(".optionButton").click(function () {
    var target = $(this).attr("data-name");
    var onoff = $(this).attr("data-on");
    var label = $(this).attr("data-label");

    if (target === "lim") {
        $(this).toggleClass("icon_btn_off");
        $(this).toggleClass("icon_btn_on");
            // 勇健ON/OFF
        if (onoff == 0) {
            limOrder = "lim";
            $(this).attr("data-on", 1);
        } else {
            limOrder = "";
            $(this).attr("data-on", 0);
        }
    } else if (target === "range") {
        // 範囲設定
        if (onoff == 1) {
            // ON→OFFは設置がリセットされる
            rangeOrder = "";
            $(this).removeClass("icon_btn_on")
            .addClass("icon_btn_off")
            .attr("data-on", 0);

        } else {
            // 対象をONにする場合、一度周りを全てOFFにする
            $(".optionButton").each(function () {
                if ($(this).attr("data-name") == target) {
                    $(this).removeClass("icon_btn_on")
                        .addClass("icon_btn_off")
                        .attr("data-on", 0);
                    $(this).find(".TOGGLE").removeClass("fa-toggle-on")
                    .addClass("fa-toggle-off");
                }
            });
            // 自分だけONにする
            $(this).removeClass("icon_btn_off")
            .addClass("icon_btn_on")
            .attr("data-on", 1);
            rangeOrder = label;
        }

    } else if (target === "initBP") {
        // 初期BP変更
        if (onoff == 1) {
            // OFFにするは無し。初期BPは消せない
        } else {
            // 対象をONにする場合、一度周りを全てOFFにする
            $(".optionButton").each(function () {
                if ($(this).attr("data-name") == target) {
                    $(this).removeClass("icon_btn_on")
                        .addClass("icon_btn_off")
                        .attr("data-on", 0);
                }
            });
            // 自分だけONにする
            $(this).removeClass("icon_btn_off")
            .addClass("icon_btn_on")
            .attr("data-on", 1);
            bpOrder = label;
        }
    } else if (target === "turn") {
        // 初期BP変更
        if (onoff == 1) {
            // OFFにするは無し。ターン数は消せない
        } else {
            // 対象をONにする場合、一度周りを全てOFFにする
            $(".optionButton").each(function () {
                if ($(this).attr("data-name") == target) {
                    $(this).removeClass("icon_btn_on")
                        .addClass("icon_btn_off")
                        .attr("data-on", 0);
                }
            });
            // 自分だけONにする
            $(this).removeClass("icon_btn_off")
            .addClass("icon_btn_on")
            .attr("data-on", 1);
            turnOrder = label;
            bpOrder = $(this).attr("data-bp");
        }
    } else if(target == 'multi'){
        if (onoff == 0) {
            $(this).attr("data-on", 1);
        } else {
            $(this).attr("data-on", 0);
        }
        var multi = [0];
        $(".optionButton.MULTI").each(function () {
            if($(this).attr('data-on') == 1){
                multi.push($(this).attr('data-label'));
            }
        });
        if(multi.length == 1) {
            multi.push(2);
        }

        lastParam['multi'] = multi;
        // 自分だけON/off切り替えする
        $(this).toggleClass("icon_btn_off icon_btn_on");
    } else if(target == 'same'){
        var next =  (onoff == 0) ? 1 : 0;
        $(this).attr("data-on", next);
        $(this).toggleClass("icon_btn_off icon_btn_on");
        // 0:強襲系なしスタイル
        // 1:強襲系ありターン運用
        // 99:強襲系ありラウンド運用
        lastParam['same'] = (onoff == 0);
        SAME_ONLY_FILTER_FLG = (onoff == 0); //同じものはフィルタ
    } else if(target == 'round'){
        var next =  (onoff == 0) ? 1 : 0;
        $(this).attr("data-on", next);
        $(this).toggleClass("icon_btn_off icon_btn_on");
        // 0:強襲系なしスタイル
        // 1:強襲系ありターン運用
        // 99:強襲系ありラウンド運用
        lastParam['round'] = (onoff == 0) ? "R" : "T";
    } else if(target == 'checker'){
        var next =  (onoff == 0) ? 1 : 0;
        $(this).attr("data-on", next);
        $(this).toggleClass("icon_btn_off icon_btn_on");
        MY_STYLE_FLG = (onoff == 0);
        var text = (onoff == 0) ? "ON" : "OFF";
        $(this).html(text);
    } else if(target == 'weakFilter'){
        var next =  (onoff == 0) ? 1 : 0;
        $(this).attr("data-on", next);
        $(this).toggleClass("icon_btn_off icon_btn_on");
        WEAK_FILTER_FLG = (onoff == 0);
    } else if(target == 'weaponSFilter'){
        var next =  (onoff == 0) ? 1 : 0;
        $(this).attr("data-on", next);
        $(this).toggleClass("icon_btn_off icon_btn_on");
        WP_S_FILTER_FLG = (onoff == 0);
    } else if(target == 'weaponDupFilter'){
        var next =  (onoff == 0) ? 1 : 0;
        $(this).attr("data-on", next);
        $(this).toggleClass("icon_btn_off icon_btn_on");
        WP_DUP_FILTER_FLG = (onoff == 0);
    }
    
    $(this).find(".TOGGLE").toggleClass("fa-toggle-off fa-toggle-on")

    gtag('event', "clickLimitAbility", { 'event_category': "autodamage", 'event_label': target, 'value': onoff });
    callAPI(lastParam);
});

$(".enemyfilterList").click(function () {
    $("#styleChoice").html("");
    $("#STYLE_HEADER").hide();

    //$(".weaponList").slideUp();

    let value = $(this).attr("href").substr(7);
    let label = $(this).attr("data-label");
    let isActive = $(this).parent().hasClass("filterActive");
    $(".enemyfilterList").each(function () {
        $(this).parent().removeClass("filterActive");
    });
    gtag('event', "clickEnemy", { 'event_category': "autodamage", 'event_label': label, 'value': 1 });
    if (isActive) {
        setResitCrit(ENEMY_RESIST[0]);
        $("#ENEMY").html(``);
        delete lastParam['enemy'];
        lastParam['limit'] = 200;
        callAPI(lastParam);
    } else {
        setResitCrit(ENEMY_RESIST[value]);
        var x = (label !== "無し") ? `VS ${label}の` : "";
        $("#ENEMY").html(x);
        $(this).parent().toggleClass("filterActive");

        lastParam['enemy'] = value;
        lastParam['limit'] = 200;
        callAPI(lastParam);
    }
});
function setResitCrit(list) {
    setTaisei($("#resist_zan"), list[0]);
    setTaisei($("#resist_da"), list[1]);
    setTaisei($("#resist_totsu"), list[2]);
    setTaisei($("#resist_netsu"), list[3]);
    setTaisei($("#resist_rei"), list[4]);
    setTaisei($("#resist_rai"), list[5]);
    setTaisei($("#resist_yo"), list[6]);
    setTaisei($("#resist_in"), list[7]);
    $("#enemy_crit").html(list[8]);
    $("#enemy_name").html(list[9]);
}

$(".eventFilter").click(function(){

});

$(".filterList").click(function () {
    $("#styleChoice").html("").slideUp();
    $("#STYLE_HEADER").hide();

    $(".weaponList").slideUp();

    let value = $(this).attr("href").substr(1);
    let datatype = $(this).attr("data-type");
    delete lastParam['cid'];
    delete lastParam['sid'];
    delete lastParam['btype'];
    delete lastParam['atype'];

    gtag('event', "clickFilter", { 'event_category': "autodamage", 'event_label': value, 'value': 1 });
    if ($(this).parent().hasClass("filterActive")) {
        //$("#TARGET").html(`全スタイル`);
        $("#CHAR_HEADER").hide();
        // 解除
        $(".filterList").each(function () {
            $(this).parent().removeClass("filterActive");
        });
        $("#TARGET").html(`全スタイル`);
        callAPI(lastParam);
    } else {
        $("#TARGET").html(`<span class="icon_mini ${value}"></span>`);
        if (datatype === "WeaponTypeFilter") {
            $("#CHAR_HEADER").show();
            // 絞り込み
            //$(".SeriesChoise").addClass("d-none");
            $("#_" + value).removeClass("d-none", 0, function () {
                $("#_" + value).slideDown();
            });
            if(value != "icon_toku") {
                lastParam['btype'] = value.substr(5);
            } else {
                $("#TARGET").html(`<img src="https://romasagatool.com/img/icon/icon_toku.png">`);
            }
        } else {
            // 属性の場合はキャラは出さない
            $("#CHAR_HEADER").hide();
            lastParam['atype'] = value.substr(5);
        }
        $(".filterList").each(function () {
            $(this).parent().removeClass("filterActive");
        });
        $(this).parent().toggleClass("filterActive");
        //console.log(lastParam);

        callAPI(lastParam);
    }
});


$(document).on("click", ".CLOSE_BTN", function () {
    $(this).parents(".style-skill-list").hide();
});

$(document).on("click", "#SIMPLE_DISP", function () {
    $(".SIMPLE_CARD").toggleClass("d-none");
    $(".DETAIL_CARD").toggleClass("d-none");
    // $(".SMART_DISP").toggleClass("d-none");
    // $(".DETAIL_DISP").toggleClass("d-none");
    // $(".NAME_AREA_INNER").toggleClass("icon-left-margin");

    // $(".NAME_AREA").toggleClass("col-lg-2 col-lg-3 col-md-3 col-md-4 col-6 col-10");
    // $(".WP_NAME").toggleClass("d-none d-inline");
    // $(".TURN_ACTION_BLOCK").toggleClass("col-lg-5 col-lg-7 col-md-5 col-md-6 col-6 d-none d-sm-block");
    // $(".DETAIL_DISP_BLOCK").toggleClass("d-md-block");
    // $(".DETAIL_DISP_BLOCK_LG").toggleClass("d-lg-block");
    // $(".CUTIN").toggleClass("bg-center bg-right"); 
});

$(document).on("click", ".char", function () {
    let charId = $(this).attr("data-id");
    var charInfo = CHAR_MASTER[charId];
    gtag('event', "clickChar", { 'event_category': "autodamage", 'event_label': charInfo['Name'], 'value': 1 });
    $("#TARGET").html(charInfo['Name']);
    $("#STYLE_HEADER").show();
    $("#styleChoice").html("");
    var sList = [];
    for (let styleId of charInfo['Holders']) {
        sList.push(STYLE_MASTER[styleId]);
    }
    var styleIdList = sortStyleId(sList, "asc");
    var styleIconList = {"SS":[],"S":[],"A":[]};
    for (let styleId of styleIdList) {
        let styleInfo = STYLE_MASTER[styleId];
        if(styleInfo['Rarity'] != "SS") {
            continue;
        }
        var gachaOrg = styleInfo['gacha'].split("/")[0];
        var yearData = gachaOrg.split(".");
        if(yearData.length >= 3 &&  yearData[0] >= SKIP_YEAR) {
            // スタイルアイコンの追加
            let styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, charInfo['WeaponType']);
            styleIconList[styleInfo['Rarity']].push(styleIcon);
        }
    }
    for(let rare of ["SS","S","A"]){
        for(let styleIcon of styleIconList[rare]){
            $("#styleChoice").append(styleIcon);
        }
    }

    $("#styleChoice").slideDown();
    lastParam['cid'] = charId;
    delete lastParam['sid'];
    callAPI(lastParam);
});

$(document).on("click", ".style", function () {
    $(".style").each(function(){
        $(this).find(".CHECK_COVER").show();
    });
    $(this).find(".CHECK_COVER").hide();
    let styleId = $(this).attr("data-id");
    var styleInfo = STYLE_MASTER[styleId];
    gtag('event', "clickStyle", { 'event_category': "autodamage", 'event_label': styleInfo['Name'] + styleInfo['AnotherName'], 'value': 1 });
    $("#TARGET").html(styleInfo['Name'] + " <br class=\"hidden spBlock\">" + styleInfo['AnotherName'] + "<br class=\"hidden pcBlock\">");
    lastParam['sid'] = styleId;
    callAPI(lastParam);
});

function callAPI(param) {
    // 異武器種があるので武器は外す
    if((param['cid'] !== undefined)) {
        delete param['btype'];
    }
    lastParam = param;

    var cid = (param['cid'] !== undefined) ? `&cid=${param['cid']}` : "";
    var sid = (param['sid'] !== undefined) ? `&sid=${param['sid']}` : "";
    var enemy = (param['enemy'] !== undefined) ? `&enemy=${param['enemy']}` : "";
    var btype = (param['btype'] !== undefined) ? `&btype=${param['btype']}` : "";
    var limit = (cid !== "") ? 400 : 150;

    var order = (limOrder !== "") ? `&order=${limOrder}` : "";
    var range = (rangeOrder !== "") ? `&range=${rangeOrder}` : "";
    var bp = `&bp=${bpOrder}`;
    var turn = `&turn=${turnOrder}`;
    var round = `&round=${param['round']}`;
    var multi = (param['multi'] !== undefined) ? `&multi=${param['multi'].join(",")}` : "";

    var wp = (param['wp'] != "") ? `&wp=${param['wp']}` : "";
    var rare = (param['wp'] != "") ? `` : "";

    limit = (typeof AUTO_LIMIT !== "undefined") ? AUTO_LIMIT :  limit;

    var dup = (
        cid != "" || sid != "" || SAME_ONLY_FILTER_FLG
    ) 
    ? "" 
    : "&dup=true";
    if(MY_STYLE_FLG && MY_STYLE.length != 0 ) {
        dup = "";
    }

    let TABLE_NM = "";
    let DEV_MODE = "";
    if((location.href.indexOf("localhost") > -1)
    || (location.href.indexOf("Users") > -1)) {
        DEV_MODE = "";
    }    

    //                $("#RANK_AREA").slideUp(200,function(){
    $("#RANK_AREA").html("");

    $.getJSON(`https://romasagatool.com/api/auto_ranking2.php?limit=${limit}&dev=dev&table=${TABLE_NM}${cid}${sid}${enemy}${btype}${rare}${order}${range}${dup}${bp}${turn}${multi}${round}${wp}&callback=?`);
    //                    $("#RANK_AREA").slideDown(200);
    //                });
}

var SS_WEAPON_DATA = {};
function dispWeapon(){
    for(var type in WEAPON_DATA){
        var TUIOKU_NAME = TUIOKU_WP[type];
        var SS_NAME = SS_WP[type];

        for(var wp of WEAPON_DATA[type]['SS']){
            let isTsuioku = false;
            if(TUIOKU_NAME.indexOf(wp['Name']) > -1
            || wp['Name'].indexOf("アビススタッフ") > -1) {
                isTsuioku = true;
            } else if(type != "杖"
            && SS_NAME.indexOf(wp['Name']) == -1
            && wp['Name'].indexOf(")") == -1
            ) {
                //console.log(wp['Name'], wp['Illust'],'skip');
                continue;
            } else if(
                ["(闇)マルカ","(光)カドゥケウス","(風)アポディス","哀の手袋"].indexOf(wp['Name']) > -1
            ) {
                continue;
            }

            var jutsuType = (wp['JutsuTypes']+"").replace(",","");
            for(key in WEAPON_ATTR_LIST) {
                if(wp[key] == 1) {
                    var attr = WEAPON_ATTR_LIST[key];
                    var idSecond = attr + wp['Illust'];
                    SS_WP_ID_LIST[idSecond] = 1; // 1段階はデフォルトオフ

                    //var wpType = (type=="杖") ? ICON_LIST[type] + jutsuType: ICON_LIST[type];
                    var wpType = ICON_LIST[type] + jutsuType;
                    var second = Object.assign({}, wp);
                    second['Name'] += "(" + key + ")";
                    SS_WEAPON[idSecond] = second;
                    let wpLabel = (wp['Name'].indexOf(")") == -1) ? wp['Name'] : wp['Name'].substr(wp['Name'].indexOf(")") + 1);
                    $icon = getWeaponIcon("SS", wp['Illust'], wp['Name'], wpLabel);
                    // 二段階は指定したもの以外はオフ
                    if(FILTER_SS_WEAPON[idSecond] == undefined){
                        $icon.addClass('ss-checked');
                    } 
                    $icon.find('.icon-label').attr("style","left: -5px;bottom: -8px;");
                    $icon.find('.icon-label-inner').attr("style","min-width: 50px; max-width: 50px; overflow: hidden;text-overflow: ellipsis;padding: 6px 3px;");
                    $icon.attr('data-id', idSecond);
                    targetId = (isTsuioku) ? "#SS_TUIOKU_" + wpType : "#SS_" + wpType;
                    $icon = $icon.clone().attr("style","margin-bottom:10px;");
                    $(targetId).append($icon.clone());
                    secondWp = Object.assign({}, wp);              
                    secondWp[attr] += 4;
                    SS_WEAPON_DATA[idSecond] = secondWp;
                }
            }
        }
    }
}

var NORMAL_ATTACK = {"Id":"normal","Name":"通常攻撃", "SkillIryoku":7};
var SKILL_RESULT;

function callback(data) {

    var map = {
        "tate": {"敵単体":1, "敵縦一列":3, "敵全体":3},
        "yoko": {"敵単体":1, "敵横一列":3, "敵全体":3},
        "all": {"敵単体":1, "敵縦一列":2, "敵横一列":2, "敵全体":4},
    };
    var filterWeakAttrs = [];
    if(WEAK_FILTER_FLG) {
        $(".enemyfilterList").each(function(){
            if($(this).parent().hasClass("filterActive")) {
                filterWeakAttrs.push($(this).attr("data-label").replace("弱点",""));
            }
        });
    }
    var usedWpList = [];
    var useStyleList = [];

    var damageKey = (rangeOrder == "") ? "damage" : "damage_"+rangeOrder;
    var kobetuKey = (rangeOrder == "") ? "one" : rangeOrder;
    var styleList = [];
    var rowCount = 0;
    var MY_FLAG = (MY_STYLE_FLG && MY_STYLE.length != 0 );
    $("#MORE_BUTTON").hide();
    SKILL_RESULT = data;
    var cIdCount = [];
    var sIdCount = [];
    for (var rank in data) {
        var rec = data[rank];
        if(WP_S_FILTER_FLG && rec['weapon'].indexOf("+") > -1) {
            continue;
        }

        if(MY_FLAG && MY_STYLE.indexOf(rec['sid']) == -1){
            continue;
        }

        if($("#TOKU_LI").hasClass("filterActive")) {
            //MY_SKILL[sInfo['CharacterId']]
            if(EVENT_STYLE.indexOf(rec['cid']) == -1) {
                continue;
            }
        }
        var color = "fuchidori-blue" ;
        var wpName = rec['weapon'];
        if(rec['rare'] == "SS"){
            color = "fuchidori-yellow";
            wpName = (typeof SS_WEAPON[rec['weapon']] !== "undefined") ? SS_WEAPON[rec['weapon']]['Name'] : rec['weapon'];
        }
        if(WP_DUP_FILTER_FLG) {
            if(useStyleList.indexOf(rec['sid']) > -1 || usedWpList.indexOf(wpName) > -1) {
                continue;
            }
        }
        useStyleList.push(rec['sid']);
        usedWpList.push(wpName);

        var dispFlag = (rowCount++ >= 10) ? "d-none" : "";

        var $rank_card = $("#CARD_TEMPLATE").clone().attr("id","").removeClass("d-none").addClass("col-12");

        $rank_card.addClass(`CARD ${dispFlag} ${rec['cid']}`);
        $rank_card.find(".NAME_AREA_INNER").attr("data-rec", rank);
        var styleInfo = STYLE_MASTER[rec['sid']];

        var dotImg = getImgPath(`dot/${styleInfo['DotId']}.png`);
        var cutImg = getImgPath(`style_cutin/${rec['sid']}.png`);
        var allImg = getImgPath(`style_all/${rec['sid']}.png`);
        let styleIcon = getStyleIcon(styleInfo['Rarity'], rec['sid'], "", true, true);
        $rank_card.find(".STYLE_ICON").append(styleIcon);
        
        $rank_card.find(".CHAR_NAME").html(styleInfo['Name']);
        if(rangeOrder == "all") {
            console.log(styleInfo['CharacterId']);
            console.log(CHAR_MASTER[styleInfo['CharacterId']]);
            var charBase = CHAR_MASTER[styleInfo['CharacterId']][`MAXAGI`] + LIMIT_BASE;
            let styleBonus = culcStyleAddintional(styleInfo);
            var agi = Math.floor(charBase * (1 + (styleBonus[`素早さ`][50]["Per"] / 100)))
                     + styleBonus[`素早さ`][50]["Bonus"];
            $rank_card.find(".AGI").html(`速:${agi}`);
        }
        $rank_card.find(".ANOTHER_NAME").html(styleInfo['AnotherName']);
        $rank_card.find(".WEAPON_RARE").attr("src", getImgPath(`icon/icon_${rec['rare']}.png`));

        $rank_card.find(".WEAPON").html(wpName).addClass(color);
        
        style = $rank_card.find(".dot").attr('style');
        $rank_card.find(".dot").attr('data-bg', `${dotImg}` );
        cutinStyle = $rank_card.find(".CUTIN").attr('style');
        $rank_card.find(".CUTIN").attr('data-bg', `${cutImg}` );
        
        if ($.inArray(rec['sid'], styleList) > -1) {
            continue;
        }

        var damageInfo = {};
        var dKey = ["Id","one","tate","yoko","all","status","ab","resist"];
        var tmpSkillSplit = rec['skill'].split("|");

        var turnAction = {};
        // ターンごとのアクション
        var totalDamage = 0;
        var skipFlag = false;
        skipFlag = WEAK_FILTER_FLG && filterWeakAttrs.length > 0;

        var useSkill = {};
        for (var turn in tmpSkillSplit){
            turnAction[turn] = [];

            tmpSkillData = tmpSkillSplit[turn];
            var multi = tmpSkillData.split("_");
            var onlyFilter = multi[0].split("/");
            useSkill[onlyFilter[0]] = true;

            // 多段攻撃のアクション
            var before = "";
            var before = "";
            var beforeName = "";
            var multiCount = 1;
            var isAlreadyWait = false;
            for (var j in multi){
                var d = multi[j].split("/");
                var tmp = {};
                for(var key in dKey){
                    tmp[dKey[key]] = d[key];
                }
                // 溜め攻撃待機状態
                if(tmp["Id"] == "wait"){
                    var output = ["┗溜め状態", 0, tmp['status'], "--", "--", 1];
                    if(!isAlreadyWait) {
                        turnAction[turn].push(output);
                        isAlreadyWait = true;
                    }
                    continue;
                }
                if(tmp["Id"] == "stop"){
                    var output = ["行動不能", 0, tmp['status'], "--", "--", 1];
                    turnAction[turn].push(output);
                    continue;
                }

                var skillInfo = tmp["Id"] != "normal" ? SKILL_MASTER[tmp["Id"]] : NORMAL_ATTACK;
                if(skillInfo == undefined) {
                    continue;
                }
                // 多段攻撃の2撃目以降はチェック対象外
                if(MY_FLAG && MY_SKILL[rec['cid']] != undefined && j == 0) {
                    // ため短縮は大元の技IDをチェック
                    checkId = (skillInfo['OrgSkill'] != undefined) ? skillInfo['OrgSkill'] : skillInfo['Id'];
                    // 通常攻撃は対象外
                    if(checkId == "normal") {
                        
                    } else if(MY_SKILL[rec['cid']].indexOf(checkId) == -1 
                    && MY_SKILL[rec['cid']].indexOf(skillInfo['Rentatsu']) == -1) {
                        skipFlag = true;
                        break;
                    }
                }
                if(WEAK_FILTER_FLG && tmp['resist'] != 0) {
                    skipFlag = false;
                }


                var damageOrg = Number(tmp[kobetuKey]);
                var damage = damageOrg;
                var damageTarget = 1;
                if(rangeOrder != ""){
                    var area = skillInfo['AttackArea'];
                    if (j > 0) {
                        area = (skillInfo['Name'] == "縦横無斬") ? "敵横一列" : area;
                        area = (skillInfo['Name'] == "ロアリングサンダー") ? "敵単体" : area;
                    }
                    var constMap = map[rangeOrder];
                    damageTarget = (constMap[area] !== undefined) ? constMap[area] : 1;
                }
                damage /= damageTarget;
                if(rangeOrder != ""){
                    if(damageTarget > 1) {
                        totalDamage += damageOrg;
                    }
                } else {
                    totalDamage += damageOrg;
                }


                var Attrs = tmp["Id"] === "normal" ? WEAPON_ATTR[styleInfo['WeaponType']] : skillInfo['AttackAttributes'];
                Attrs = (typeof Attrs === "undefined") ? "" : Attrs;
                attrDiv = "";
                Attrs.split(',').forEach(function (value) {
                    attrDiv += `<span class="icon_xs ${ICON_LIST[value]} attr ${(ATTR_DISP ? "" : "d-none")}">　</span>`;
                });    
                var output = [
                    `${attrDiv} <span class="method ${(METHOD_DISP ? "" : "d-none")}">${METHOD_P[skillInfo['AttackMethod']]}</span> ${skillInfo['Name']}`,
                    damage,
                    tmp['status'],
                    tmp['resist'],
                    tmp['ab'],
                1];

                // 全体攻撃などでヒット数が上がってる場合は追加
                if(damageTarget > 1) {
                    output[5] = damageTarget;
                }
                if (beforeName != skillInfo['Name'] ||
                    (before != (turn + skillInfo['Name'] + damage)) ||
                    (rangeOrder != "" && 
                    (["縦横無斬","ロアリングサンダー","デフェルブレイク"].indexOf(skillInfo['Name']) > -1 ) )
                    ){
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

            if(skipFlag) {
                break;
            }
        }

        skipFlag2 = (SAME_ONLY_FILTER_FLG && (Object.keys(useSkill).length > 1) );
        
        if(skipFlag || skipFlag2){
            rowCount--;
            continue;
        }
        if(rangeOrder != ""){
            totalDamage /= map[rangeOrder]['敵全体'];
            $rank_card.find(".AVG_DAMAGE").html(Math.floor(Number(totalDamage/tmpSkillSplit.length)).toLocaleString());
        } else {
            $rank_card.find(".AVG_DAMAGE").html(Number(totalDamage).toLocaleString());
        }
        //$rank_card.find(".AVG_DAMAGE").html(Number(rec[damageKey]).toLocaleString());

        // ターンアクションの表示
        for(var i in turnAction){
            var t = (Number(i) + 1) + rec['round'];
            for(var d in turnAction[i]) {
                var row = turnAction[i][d];
                var count = row[5];
                var cnt = "";
                if(count > 1){
                    cnt = "*"+count;
                }
                $class = (row[3] < 0) ? "weakTaisei" : "notWeakTaisei";
                $tr = $(`<tr>
                <td>${t}</td>
                <td class="fuchidori-blue text-right">${Number(row[1]).toLocaleString()}</td>
                <td>${cnt}</td>
                <td class="wp-name-cell">${row[0]}</td>
                <td>${row[2]}</td>
                <td class="${$class}">耐性:${row[3]}</td>
                <td>ｱﾋﾞ:${row[4]}%</td>
                </tr>`);
                $rank_card.find(".TURN_ACTION").append($tr);
                // 多段攻撃ように消す
                t = "";
            }
        }

        var kuakuseis = rec['kakusei'].split("|");
        // ID69c334c:1|ID69c334d:3|ID69c334e:1|ID69c334f:2
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
            if(skillId === "normal") {
                continue;
            }

            var skillInfo = dispSkill[i];

            var $skill_card = $rank_card.find(".SKILL_TEMPLATE").clone().attr("id","").removeClass("d-none SKILL_TEMPLATE");
            $skill_card.addClass(`${skillId}`);
            var numClass = (damageInfo[skillId] != undefined) ? "fuchidori-white" : "fuchidori-red";

            var topLine = (skillInfo['isKeisho'] == 1) ? `border-top: 2px ivory dotted;` : "";

            // 属性設定
            var Attrs = skillId === "normal" ? WEAPON_ATTR[styleInfo['WeaponType']] : skillInfo['AttackAttributes'];
            var skillDiv = "";
            var skillType = skillId === "normal" ? ICON_LIST[styleInfo['WeaponType']] : ICON_LIST[skillInfo['BattleType']];
            skillDiv += `<span class="icon_xs ${skillType}_sm">　</span>`;
            Attrs.split(',').forEach(function (value) {
                skillDiv += `<span class="icon_xs ${ICON_LIST[value]} attr ${(ATTR_DISP ? "" : "d-none")}">　</span>`;
            });
            $skill_card.find(".ATTR_ICON").append(skillDiv);
            // todo
            var skillName = `<span class="method ${(METHOD_DISP ? "" : "d-none")}">${METHOD_P[skillInfo['AttackMethod']]}</span> ${skillInfo['Name']} (${skillInfo['SkillIryoku']})`;
            $skill_card.find(".SKILL_NAME").append(skillName).addClass(numClass);
            $skill_card.attr("style", topLine);
            $rank_card.find(".SKILL_TEMPLATE").before($skill_card)

            if(skillId === "normal" ) {
                $skill_card.find(".BP").addClass("d-none");
            } else {
                var ret = ( ' ' + Number(skillInfo['UseBp']) ).slice( -2 );
                $skill_card.find(".BP").append(ret).addClass(numClass);
            }

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
            $skill_card.find(".KAKUSEI").append(k);

            //$rank_card.find(".KAKUSEI_TEMPLATE").append(k + "<br>");
        }
        if(cIdCount.indexOf(rec['cid']) == -1) {
            cIdCount.push(rec['cid']);
        }
        if(sIdCount.indexOf(rec['sid']) == -1) {
            sIdCount.push(rec['sid']);
        }
        
        $rank_card.find(".CHAR_RANK").text(sIdCount.length);
        $rank_card.attr("data-char-rank", cIdCount.length);
        $rank_card.attr("data-style-rank", sIdCount.length);
        var gachaArr = styleInfo['gacha'].split("/")[0];
        $rank_card.attr("data-gacha", gachaArr);
        

        $("#RANK_AREA").append($rank_card);
    }
    if(rowCount >= 10) {
        $("#MORE_BUTTON").show();
    }
};

$("#MORE_BUTTON").click(function(){
    $("#MORE_BUTTON").hide();
    $(".CARD").removeClass("d-none");
});

var MY_STYLE = [];
var MY_STYLE_FLG = false;
var MY_SKILL = {};
var WEAK_FILTER_FLG = false;
var SAME_ONLY_FILTER_FLG = false;
var WP_DUP_FILTER_FLG = false;
var WP_S_FILTER_FLG = false;
var ANYA_FLG = false;
var RYUJIN_FLG = false;
var OTOKO_FLG = false;
var VALDO_FLG = false;

function intialMyStyle(){
    readStyleCheckData(UID, function (result) {
        if (result !== null) {
            sslist = (result['SS'] !== undefined) ? result['SS'] : [];
            slist = (result['S'] !== undefined) ? result['S'] : [];
            alist = (result['A'] !== undefined) ? result['A'] : [];
            MY_STYLE = sslist.concat(slist).concat(alist);
            for(styleId of MY_STYLE){
                var sInfo = STYLE_MASTER[styleId];
                if(MY_SKILL[sInfo['CharacterId']] == undefined) {
                    MY_SKILL[sInfo['CharacterId']] = [];
                }
                MY_SKILL[sInfo['CharacterId']] = MY_SKILL[sInfo['CharacterId']].concat(sInfo['SkillIds']);
            }
            $(".CHECKER").removeClass("d-none");
        }
    }, false);    
}



////////////////////////
// 陣形シミュレーションまわり
////////////////////////
var ATTACK_LIST = {};
$(document).on("click", ".NAME_AREA_INNER", function () {
    var rank = $(this).attr("data-rec");
    var data = Object.assign(SKILL_RESULT[rank], {});
    var sid = data['sid'];

    if(ATTACK_LIST[sid] == undefined && Object.keys(ATTACK_LIST).length < 5 ) {
        ATTACK_LIST[sid] = data;
        var styleInfo = STYLE_MASTER[sid];
        var styleIcon = getStyleIcon(styleInfo['Rarity'], sid, styleInfo['WeaponType'], true);
        styleIcon.addClass("SIM_ICON").removeClass("style");
        $("#float-footer").append(styleIcon);
    }
});

$(document).on("click", ".SIM_ICON", function () {
    var sid = $(this).attr("data-id");
    $(this).remove();
    delete(ATTACK_LIST[sid]);
});