var MY_CHARDATA_LIST = [];
var MY_STYLEDATA_LIST = [];
var $TABLE = { "char-table": undefined };
var tmpLIMIT_BASE = LIMIT_BASE;
var A_LIST = [];
var S_LIST = [];
var SS_LIST = [];
var SHOW_CHAR = true;
var SHOW_URA = false;
var SHOW_STYLE = true;
var SHOW_STYLE50 = false;
var SHOW_URA_ST = false;
var SHOW_URA_ST50 = false;
var NOW_CHAR;
var SHOW_LV50 = false;
var TAG = "0";


//$("#QUEST_CHOISE").slideUp();
$("#style-table-display").slideUp();
$("#delete_check").slideUp();
$("#URA_ITEM_INFO").slideUp();
$("#STYLE_LV_50").hide();
$("#STYLE_OPTION").hide();

// 入力エリアの初期化
for (idx in PARAM_KEY_HP) {
    // afterするので転置する
    //idx = PARAM_KEY_HP.length - idx - 1;
    var $clone = $("#INPUT_TEMPLATE").clone().removeAttr("id").removeClass("d-none");

    $clone.find(".PLUS").attr("data-param", PARAM_KEY_HP[idx]);
    $clone.find(".MINUS").attr("data-param", PARAM_KEY_HP[idx]);
    $clone.find(".INPUT").attr("data-param", PARAM_KEY_HP[idx]);

    $SU_PLUS = $clone.find(".PLUS").clone().attr("data-type", "SU").attr("data-param", PARAM_KEY_HP[idx]);
    $SU_MINUS = $clone.find(".MINUS").clone().attr("data-type", "SU").attr("data-param", PARAM_KEY_HP[idx]);
    $SU_INPUT = $clone.find(".INPUT").clone().attr("data-type", "SU").attr("data-param", PARAM_KEY_HP[idx])
        .addClass("SUINPUT SUINPUT" + PARAM_KEY_HP[idx]);

    $URA_PLUS = $clone.find(".PLUS").clone().attr("data-type", "URA").attr("data-param", PARAM_KEY_HP[idx]);
    $URA_MINUS = $clone.find(".MINUS").clone().attr("data-type", "URA").attr("data-param", PARAM_KEY_HP[idx]);
    $URA_INPUT = $clone.find(".INPUT").clone().attr("data-type", "URA").attr("data-param", PARAM_KEY_HP[idx])
        .addClass("URAINPUT URAINPUT" + PARAM_KEY_HP[idx]).attr("step", 4);

    $SP_TR = $("#INPUT_SP").clone().removeClass("d-none").removeAttr("id");
    $SP_TR.find(".LABEL").html(PARAM_NAME_HP[idx]);
    $SP_TR.find(".SU").append($SU_PLUS.clone().attr("height", 20)).append($SU_INPUT.clone()).append($SU_MINUS.clone().attr("height", 20));
    $SP_TR.find(".URA").append($URA_PLUS.clone().attr("height", 20)).append($URA_INPUT.clone()).append($URA_MINUS.clone().attr("height", 20));
    $("#INPUT_SP").before($SP_TR);

    // PC用
    if (PARAM_KEY_HP[idx] == "HP") {
        $SU_INPUT.attr("style", "width:60px");
        $URA_INPUT.attr("style", "width:60px");
    }

    $PC_LABEL = $("#PC_LABEL").clone().removeAttr("id").removeClass("d-none").html(PARAM_NAME_HP[idx]);
    $("#PC_LABEL").parent().append($PC_LABEL);
    $("#INPUT_LG_SU").append($("<td>").append($SU_PLUS.clone()).append($SU_INPUT.clone()).append($SU_MINUS.clone()));
    $("#INPUT_LG_URA").append($("<td>").append($URA_PLUS.clone()).append($URA_INPUT.clone()).append($URA_MINUS.clone()));
}

$(".questList").slideUp();
$(".questListNow").slideDown();

// フィルタークリック
$(".filterList").click(function () {
    $(this).find(".fButton").toggleClass("filterActive");
    if ($TABLE === undefined) {
        return;
    }
    filter("char-table");
    filter("style-table");
    gtag('event', "clickFilter", { 'event_category': "mydata", 'event_label': $(this).attr("data-href"), 'value': 1 });
});
function filter(name) {
    let weaopnFilter = [];
    let seriesFilter = [];
    let weaopnLabel = [];
    let seriesLabel = [];
    var date = new Date();
    // UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
    var now = Math.floor(date.getTime() / 1000);
    $(".filterList").each(function () {
        let target = $(this).attr("data-type");
        let value = $(this).attr("data-href");
        if ($(this).find(".fButton").hasClass("filterActive")) {
            if (target === "WeaponTypeFilter") {
                weaopnFilter.push({ field: target, type: "=", value: value });
                weaopnLabel.push($(this).attr("data-label"));
            } else if (target === "TokuFilter") {
                for (var i in EVENT_ABILITY) {
                    if (i > now) {
                        for (var dotId of EVENT_ABILITY[i]) {
                            var id = dotId.substr(3); // dotID36a38;
                            weaopnFilter.push({ field: 'DotId', type: "like", value: id });
                        }
                    }
                }
                weaopnLabel.push($(this).attr("data-label"));
            } else {
                seriesFilter.push({ field: target, type: "=", value: value });
                seriesLabel.push(value);
            }
        }
    });

    let labels = "";
    $TABLE[name].clearFilter();
    // ANDフィルターは配列でまとめる
    let finalFilter = [[{ field: "SUM", type: ">", value: 0 }, { field: "HP", type: ">", value: 0 }]];
    if (weaopnFilter.length > 0) {
        finalFilter.push(weaopnFilter);
        labels += "武器種:" + weaopnLabel.join(",");
    }
    if (seriesFilter.length > 0) {
        finalFilter.push(seriesFilter);
        if (labels !== "") {
            labels += " & "
        }
        labels += seriesLabel.join(",");
    }
    if (labels !== "") {
        labels += "<br>";
    }
    $("#label1").html(labels);
    $TABLE[name].setFilter(finalFilter);
    changeId2Dot();
}


// テーブルクリックされた場合ドット絵書き直し
$(document).on('click', ".tabulator-header, .tabulator-footer, .tabulator-page", function () {
    changeId2Dot();
});

// テーブルクリックした場合(キャラテーブル)
$(document).on('click', "#char-table-display .tabulator-cell, #style-table-display .tabulator-cell", function () {
    $("#LIMIT_TABLE_DIV").slideDown();
    $("#LIMIT_TABLE_AREA").slideDown();
    $(this).parent().find(".tabulator-cell").each(async function () {
        let value = $(this).text();
        let field = $(this).attr("tabulator-field");
        if (field === "Name") {
            gtag('event', "clickChar", { 'event_category': "mydata", 'event_label': value, 'value': 1 });
        } else if (field === "id") {
            NOW_CHAR = (MY_DATA[value] !== undefined) ? MY_DATA[value] : CHAR_MASTER[value];
        }
    });
    dispLimitTable();
    reloadLimitTableRows();
    reloadlimitTableSum();
    dispInputArea();
});

let MY_DATA, MY_STYLE, MY_STYLELV_DATA, MY_URA_DATA;

function _noLoginInitial() {
    var uiConfig = {
        // ログイン完了時のリダイレクト先
        signInSuccessUrl: 'https://nao-romasaga.github.io/mydata.html',
        // 利用する認証機能
        signInOptions: [
            firebase.auth.TwitterAuthProvider.PROVIDER_ID
        ],
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth(appUsers));
    ui.start('#firebaseui-auth-container', uiConfig);
}
async function _initial() {
    $("#LIMIT_TABLE_DIV").slideUp();
    $(".noLogin").hide();
    $(".isLogin").removeClass("d-none");
    $("#loginInfo").hide();
    loginCard("#firebaseui-auth-container");

    let mycharFunc = readUserData("CHAR", function (read) {
        MY_DATA = read;
    });
    let myStyleLvFunc = readUserDataNext("STYLELV", function (read) {
        MY_STYLELV_DATA = (read != null) ? read : {};
    });
    let myUraStFunc = readUserDataNext("URA_ST", function (read) {
        MY_URA_DATA = (read != null) ? read : { "HP": 0, "STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0 };
    });

    let mystyleFunc = readUserData("STYLECHECK", function (read) {
        A_LIST = (read === null || read["A"] === undefined) ? [] : read["A"];
        S_LIST = (read === null || read["S"] === undefined) ? [] : read["S"];
        SS_LIST = (read === null || read["SS"] === undefined) ? [] : read["SS"];
        MY_STYLE = A_LIST.concat(S_LIST).concat(SS_LIST);
    });

    await Promise.all([mystyleFunc, myStyleLvFunc, mycharFunc, myUraStFunc]);


    //delete MY_DATA;
    reloadCharData();
    drawTable("char-table", MY_CHARDATA_LIST);
    drawTable("style-table", MY_STYLEDATA_LIST);
    filter("char-table");
    filter("style-table");

}

function reloadCharData(){
    MY_CHARDATA_LIST = [];
    MY_STYLEDATA_LIST = [];
    let mydata = Object.assign({}, MY_DATA);
    //let styledata = Object.assign({}, MY_DATA);
    for (let i in mydata) {
        mydata[i]['id'] = i;
        imgPath = getImgPath(`dot/${CHAR_MASTER[i]['DotId']}.png`);
        mydata[i]['DotId'] = "Dot" + CHAR_MASTER[i]['DotId']; //`<img src="${imgPath}" style="object-position: -10px -10px">`;
        mydata[i]['Name'] = CHAR_MASTER[i]['Name'];
        mydata[i]['Series'] = CHAR_MASTER[i]['Series'];
        mydata[i]['WeaponType'] = `<span class="icon_mini_zokusei ${ICON_LIST[CHAR_MASTER[i]['WeaponType']]}"></span>`;
        mydata[i]['SeriesFilter'] = CHAR_MASTER[i]['Series'];
        mydata[i]['WeaponTypeFilter'] = ICON_LIST[CHAR_MASTER[i]['WeaponType']];

        var s = 0;
        var us = 0;
        mydata[i]["orgHP"] = Number(mydata[i]["HP"]);
        mydata[i]["URAHP"] = (MY_URA_DATA[i] !== undefined) ? Number(MY_URA_DATA[i]["HP"]) : 0;
        for (let key of PARAM_KEY) {
            mydata[i]["org" + key] = Number(mydata[i][key]);
            mydata[i]["URA" + key] = (MY_URA_DATA[i] !== undefined) ? Number(MY_URA_DATA[i][key]) : 0;
            s += mydata[i]["org" + key];
            us += mydata[i]["URA" + key];
        }
        mydata[i]['URASUM'] = us;
        mydata[i]['SUM'] = s;
        MY_CHARDATA_LIST.push(mydata[i]);
    }

    for (let styleId of MY_STYLE) {
        mydata = {};
        styleInfo = STYLE_MASTER[styleId];
        charId = styleInfo['CharacterId'];
        charInfo = CHAR_MASTER[charId];
        mydata['id'] = charId;
        mydata['styleId'] = styleId;

        icon = getStyleIcon(styleInfo['Rarity'], styleId, charInfo['WeaponType'], true);
        mydata['StyleIcon'] = icon[0].outerHTML;

        let styleBonus = culcStyleAddintional(styleInfo);

        lv = (MY_STYLELV_DATA[styleId] === undefined) ? 1 : MY_STYLELV_DATA[styleId]['lv'];
        mydata['StyleLv'] = lv;
        mydata['Name'] = `<div style="line-height:20px">${styleInfo['Name']}<br>${styleInfo['AnotherName']}</div>`;
        rare = getImgPath(`icon/icon_${styleInfo['Rarity']}.png`);
        mydata['Rarity'] = `<img src="${rare}" width="20">`; //styleInfo['Rarity'];
        mydata['Series'] = charInfo['Series'];
        mydata['WeaponType'] = `<span class="icon_mini_zokusei ${ICON_LIST[charInfo['WeaponType']]}"></span>`;
        mydata['SeriesFilter'] = charInfo['Series'];
        mydata['WeaponTypeFilter'] = ICON_LIST[charInfo['WeaponType']];
        // ["Param"]["Lv"]["Per"] = パーセンテージ
        // ["Param"]["Lv"]["Bonus"] = ボーナス値

        var result = {};
        let sentouRyoku = 0;
        let sentouRyoku50 = 0;
        var SENTOU_PER = [6, 6, 4, 4, 4, 4, 2, 2];

        let totalSt = 0;
        let totalSt50 = 0;
        let totalStUra = 0;
        let totalStUra50 = 0;
        if (MY_DATA[charId] !== undefined) {
            for (let idx in PARAM_KEY) {
                let input = MY_DATA[charId][PARAM_KEY[idx]];
                let ura = (MY_URA_DATA[charId] !== undefined) ? MY_URA_DATA[charId][PARAM_KEY[idx]] : 0;

                let per = styleBonus[PARAM_NAME[idx]][lv]["Per"];
                let bonus = styleBonus[PARAM_NAME[idx]][lv]["Bonus"];
                let st = addBonus(input, per, bonus);
                totalSt += st;
                st += ura;
                sentouRyoku += st * SENTOU_PER[idx];
                // 浦道場用小数計算
                let shosuST = (input * (100 + per) / 100 + bonus);
                totalStUra += (shosuST + ura);

                let per50 = styleBonus[PARAM_NAME[idx]][50]["Per"];
                let bonus50 = styleBonus[PARAM_NAME[idx]][50]["Bonus"];
                let st50 = addBonus(input, per50, bonus50);
                totalSt50 += st50;
                st50 += ura;
                sentouRyoku50 += st50 * SENTOU_PER[idx];
                // 浦道場用小数計算
                let shosuST50 = (input * (100 + per50) / 100 + bonus50);
                totalStUra50 += (shosuST50 + ura);

                mydata[PARAM_KEY[idx]] = st;
                mydata["URA"+PARAM_KEY[idx]] = Math.floor((shosuST + ura) * 10) / 10;
                mydata[PARAM_KEY[idx]+"50"] = st50;
                mydata["URA"+PARAM_KEY[idx]+"50"] = Math.floor((shosuST50 + ura) * 10) / 10;
            }
            for (col of ["ResistDa", "ResistInn", "ResistNetsu", "ResistRai", "ResistRei", "ResistTotsu", "ResistYou", "ResistZan"]) {
                sentouRyoku += styleInfo[col];
                sentouRyoku50 += styleInfo[col];
            }
            sentouRyoku += (MY_DATA[charId]['HP'] !== undefined) ? MY_DATA[charId]['HP'] * 5 : 0;
            sentouRyoku50 += (MY_DATA[charId]['HP'] !== undefined) ? MY_DATA[charId]['HP'] * 5 : 0;
        }
        mydata['SENTOU'] = Math.floor(sentouRyoku);
        mydata['SENTOU50'] = Math.floor(sentouRyoku50);
        mydata['SUM'] = totalSt;
        mydata['SUM50'] = totalSt50;
        mydata['SUMURA'] = Math.floor(totalStUra * 10) / 10;
        mydata['SUMURA50'] = Math.floor(totalStUra50 * 10) / 10;
        MY_STYLEDATA_LIST.push(mydata);
    }
    for (let id in CHAR_MASTER) {
        let styleMax = { "STR": -99, "VIT": -99, "DEX": -99, "AGI": -99, "INT": -99, "MND": -99, "AI": -99, "MI": -99 };
        for (let styleId of CHAR_MASTER[id]['Holders']) {
            let styleInfo = STYLE_MASTER[styleId];

            styleInfo['hasStyle'] = true;
            if (MY_STYLE.indexOf(styleId) === -1) {
                styleInfo['hasStyle'] = false;
                //delete STYLE_MASTER[styleId];
                continue;
            }
            for (let key of PARAM_KEY) {
                if (styleInfo["Limit" + key] !== 99 && styleInfo["Limit" + key] > styleMax[key]) {
                    styleMax[key] = styleInfo["Limit" + key];
                }
            }
        }
        for (let key of PARAM_KEY) {
            CHAR_MASTER[id]["MAX" + key] = styleMax[key];
        }
    }
    reloadUraHoshu();
}

function reloadUraHoshu(){
    const SUM_LIST = [].concat(MY_STYLEDATA_LIST);
    const SUM50_LIST = [].concat(MY_STYLEDATA_LIST);
    SUM_LIST.sort(function(a, b) {
        return (a.SUMURA > b.SUMURA) ? -1 : 1;
    });
    SUM50_LIST.sort(function(a, b) {
        return (a.SUMURA50 > b.SUMURA50) ? -1 : 1;
    });

    $uraInfo = $("#URA_ITEM_INFO");
    var nowHoshu = [0,  ["?","?"],["?","?"],["?","?"],["?","?"]];
    var nextHoshu = [0,  ["?","?"],["?","?"],["?","?"],["?","?"]];
    var max = SUM_LIST[0]["SUMURA"];
    for(var i in DOJO){
        if(max <= DOJO[i][0]) {
            nowHoshu = DOJO[i];
        } else {
            if(i == 0){
                nextHoshu = nowHoshu;
                $(".NEXT_HOSHU_LIST").slideUp();
                $(".NEXT_HOSHU_IS_NONE").slideDown();
            } else {
                nextHoshu = DOJO[i - 2];
                $(".NEXT_HOSHU_LIST").slideDown();
                $(".NEXT_HOSHU_IS_NONE").slideUp();
            }
            break;
        }
    }
    var styleId = SUM_LIST[0]["styleId"];
    var charId = SUM_LIST[0]["id"];
    var styleInfo = STYLE_MASTER[styleId];
    var charInfo = CHAR_MASTER[charId];
    var icon = getStyleIcon(styleInfo['Rarity'], styleId, charInfo['WeaponType'], true);
    $uraInfo.find(".ICON_SM").html("").append(icon);
    $uraInfo.find(".RANK_HEAD_IMG").attr("src" , getImgPath(`style_cutin/${styleId}.png`));
    $uraInfo.find(".NAME").html(styleInfo["Name"]);
    $uraInfo.find(".ANOTHER_NAME").html(styleInfo["AnotherName"]);
    $uraInfo.find(".ST").html(max.toLocaleString());
    $uraInfo.find(".NEXT_ST").html(nextHoshu[0].toLocaleString());
    $uraInfo.find(".NEXT_DIFF").html((nextHoshu[0] - max).toLocaleString());

    hoshuWrite("NOW_HOSHU", nowHoshu);
    hoshuWrite("NEXT_HOSHU", nextHoshu);
}

function hoshuWrite(target, list){
    var p_sum = 0;
    var g_sum = 0;
    for(var i in list){
        if(i == 0){
            continue;
        }
        g_sum += (list[i][0] != "?") ? Number(list[i][0]): 0;
        p_sum += (list[i][1] != "?") ? Number(list[i][1]): 0;
        $uraInfo.find(`.${target} .G_` + i).text(list[i][0]);
        $uraInfo.find(`.${target} .P_` + i).text(list[i][1]);
    }
    $uraInfo.find(`.${target} .SUM_ITEM_P`).text(p_sum);
    $uraInfo.find(`.${target} .SUM_ITEM_G`).text(g_sum);
    var p_sum_week = (p_sum + 20) * 7 ;
    var g_sum_week = (g_sum + 80) * 7 ;
    $uraInfo.find(`.${target} .SUM_ITEM_P_SUM`).text(p_sum_week);
    $uraInfo.find(`.${target} .SUM_ITEM_G_SUM`).text(g_sum_week.toLocaleString());
    var p_item = (p_sum_week > 350) ? 10 : Math.floor(p_sum_week / 35);
    $uraInfo.find(`.${target} .SUM_ITEM_P_MONTH`).text(p_item);
    $uraInfo.find(`.${target} .SUM_ITEM_G_MONTH`).text( Math.floor(g_sum_week / 200) );
    var p_item_mod = (p_sum_week > 350) ? (p_sum_week - 350) : (p_sum_week % 35);
    $uraInfo.find(`.${target} .SUM_ITEM_P_MONTH_MOD`).text(p_item_mod);
    $uraInfo.find(`.${target} .SUM_ITEM_G_MONTH_MOD`).text(g_sum_week % 200);    
}

// ステータス情報の枠を表示
async function dispLimitTable() {
    // キャラ選択時はそっちも更新する
    id = NOW_CHAR['id'];

    if (id === undefined) {
        return;
    }

    $(".charName").text(CHAR_MASTER[id]['Name']);
    // リセット
    $(".STYLE_ROW").remove();
    $(".STYLE_LV_AREA").html("");

    var sList = [];
    for (let styleId of CHAR_MASTER[id]['Holders']) {
        sList.push(STYLE_MASTER[styleId]);
    }
    // appendで逆転するので逆ソートする
    var styleIdList = sortStyleId(sList, "A", "old");

    // スタイルステータス一覧
    for (let styleId of styleIdList) {
        let styleInfo = STYLE_MASTER[styleId];
        // スタイルステータス行
        let styleRow = $("#STYLE_TEMPLATE").clone();
        styleRow.removeAttr("id");
        styleRow.attr("data-id", styleInfo['Id']);
        styleRow.addClass("STYLE_ROW");
        if (STYLE_MASTER[styleId]['hasStyle']) {
            styleRow.removeClass("d-none");
        }
        styleRow.find(".RARE").attr("src", getImgPath(`icon/icon_${styleInfo['Rarity']}.png`));
        var cutinImg = getImgPath(`style_cutin/${styleInfo['IllustId']}.png`);
        styleRow.find(".ICON_TD").attr("style", `background:url(${cutinImg}) no-repeat; background-size:cover; background-position: calc(50% + 20px);`);
        var icon = getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], CHAR_MASTER[id]['WeaponType'], true);
        styleRow.find(".ICON_SM").append(icon.clone());
        $("#styleLabelRow").after(styleRow);
    }

    // スタイル複合最大値のレコード作成
    let styleRowMax = $("#STYLE_TEMPLATE").clone();
    styleRowMax.removeAttr("id").addClass("STYLE_ROW").removeClass("d-none")
        .css("background-color", "rgba(255,255,255, 0.2)");
    styleRowMax.find(".IMG").addClass("d-none");
    styleRowMax.find(".MAXLABEL").removeClass("d-none");
    styleRowMax.find(".ICON").remove();
    styleRowMax.addClass("STYLE_MAX_TR");
    $("#styleLabelRow").after(styleRowMax);
}

function reloadLimitTableRows(){
    limit = (tmpLIMIT_BASE === 0) ? LIMIT_BASE : tmpLIMIT_BASE;

    $(".STYLE_ROW").each(function(){
        var styleRow = $(this);
        styleId = styleRow.attr("data-id");
        if(styleRow.hasClass("d-none") || styleId == undefined){
            return true; // continue
        }
        styleInfo = STYLE_MASTER[styleId];
        let sum = 0;
        let spsum = 0;
        for (let key of PARAM_KEY) {
            let val = limit + Number(styleInfo['Limit' + key]);
            let space;
            if (styleInfo['Limit' + key] < 99) {
                sum += val;
                space = (val <= NOW_CHAR["org"+key]) ? "x" : val - NOW_CHAR["org"+key];
                spsum += (space > 0) ? space : 0;
            } else {
                val = "?";
                space = "?";
                $(this).removeAttr("style");
            }
            if (space !== "?" && space >= 7) {
                styleRow.find("." + key).removeAttr("style");
            } else if (space == "x" || space === "?") {
                styleRow.find("." + key).attr("style", ' background-color: lightslategray; color: white');
            } else if (space <= 2) {
                styleRow.find("." + key).attr("style", ' background-color: pink; color:black;');
            } else {
                styleRow.find("." + key).attr("style", ' background-color: palegreen; color:black;');
            }
            styleRow.find(".ORG" + key).text(val);
            styleRow.find("." + key).text(space);
        }
        styleRow.find(".ORGSUM").text(sum);
        styleRow.find(".SUM").text(spsum);    
    });
}

function dispInputArea(){

    // キャラ選択時はそっちも更新する
    id = NOW_CHAR['id'];
    myUserData = NOW_CHAR;

    if (id === undefined) {
        return;
    }

    var sList = [];
    for (let styleId of CHAR_MASTER[id]['Holders']) {
        if (STYLE_MASTER[styleId] !== undefined) {
            sList.push(STYLE_MASTER[styleId]);
        }
    }
    // appendで逆転するので逆ソートする
    var styleIdList = sortStyleId(sList, "A", "old");

    $(".STYLE_LV_AREA").html("");

    // スタイルレベル 
    for (let styleId of styleIdList) {
        let styleInfo = STYLE_MASTER[styleId];
        var icon = getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], CHAR_MASTER[id]['WeaponType'], STYLE_MASTER[styleId]['hasStyle']);
        icon.addClass("STYLE_CHECK");

        // スタイルレベル アイコン
        let iconArea = $("#STYLE_LV_TEMPLATE").clone();
        iconArea.removeAttr("id").removeClass("d-none");
        iconArea.find("select").removeClass("d-none").attr("id", "select" + styleId);
        iconArea.prepend(icon.clone());
        for (i = 1; i <= 50; i++) {
            iconArea.find("select").prepend(`<option value=${i}>Lv${i}</option>`);
        }
        iconArea.find("select").val(30);
        $(".STYLE_LV_AREA").append(iconArea);
    }

    // 入力ステータスの反映
    for (let key of PARAM_KEY_HP) {
        $(`.SUINPUT${key}`).val(NOW_CHAR[key]);
        // 裏能力の反映
        ura = (MY_URA_DATA[id] !== undefined) ? MY_URA_DATA[id][key] : 0 ;
        $(`.URAINPUT${key}`).val(ura);
    }
}

/**
 * ステータステーブルのスタイル最大値を更新する
 * スタイルが変更された場合と、baseが変更された場合に適応
 */
function reloadlimitTableSum(){
    let styleMax = { "STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0, "SUM": 0 };
    limit = (tmpLIMIT_BASE === 0) ? LIMIT_BASE : tmpLIMIT_BASE;
    // 表示中のもので最大値の更新
    $(".STYLE_ROW").each(function(){
        var styleRow = $(this);
        styleId = styleRow.attr("data-id");
        if(styleRow.hasClass("d-none") || styleId == undefined){
            return true; // continue
        }
        styleInfo = STYLE_MASTER[styleId];
        for (let key of PARAM_KEY) {
            let val = limit + Number(styleInfo['Limit' + key]);
            styleMax[key] = styleMax[key] < val ? val : styleMax[key];
        }
    });

    $styleRowMax = $(".STYLE_MAX_TR");
    let styleSum = 0;
    for (let key of PARAM_KEY) {
        styleSum += (styleMax[key] !== "?") ? styleMax[key] : 0;
        $styleRowMax.find(".ORG" + key).text(styleMax[key]);
        $styleRowMax.find("." + key).text(styleMax[key]);
    }
    $styleRowMax.find(".SUM").text(styleSum);
    $styleRowMax.find(".ORGSUM").text(styleSum);

    // 各スタイルが最大値かどうかチェック
    $(".STYLE_ROW").each(function () {
        for (let key of PARAM_KEY) {
            let td = $(this).find(".ORG" + key);
            td.removeClass("fuchidori-blue maxCol");
            if (td.text() == styleMax[key]) {
                td.addClass("fuchidori-blue maxCol");
            }
        }
    });

    // 自分の入力値
    let mySum = 0;
    for (let key of PARAM_KEY) {
        v = NOW_CHAR["org"+key];
        mySum += v;
        $(".YOUR" + key).text(v);
        let limit = (styleMax[key] === "?") ? "?" : styleMax[key] - v;
        $(".LIMIT" + key).text(limit);
    }
    $(".YOURSUM").text(mySum);
    $(".LIMITSUM").text((styleSum === 0) ? "?" : styleSum - mySum);
    $("#PLUS_LIMIT").text(limit);
}

function changeId2Dot() {
    $("#char-table").find(".tabulator-cell").each(function () {
        let id = $(this).text();
        if (id.indexOf("Dot") > -1) {
            var imgPath = getImgPath(`dot/${id.substr(3)}.png`);
            let src = `<img src="${imgPath}" style="object-position: -10px -10px">`;
            $(this).html(src);
        } else if (id.indexOf("x") > -1) {
            let attr = $(this).attr("style");
            $(this).attr("style", attr + ' background-color: lightslategray; color: white');
        } else if ($(this).attr("tabulator-field") == "HP") {
            let attr = $(this).attr("style");
            if (Number(id) <= -100) {
                $(this).attr("style", attr + ' background-color: gray; color:white;');
            } else if (Number(id) <= 0) {
                $(this).attr("style", attr + ' background-color: pink; color:black;');
            } else if (Number(id) < 200) {
                $(this).attr("style", attr + ' background-color: palegreen; color:black;');
            }
        } else if ($(this).attr("tabulator-field") !== "SUM"
            && $(this).attr("tabulator-field") !== "DotId"
            && $(this).attr("tabulator-field") !== "WeaponType") {
            let attr = $(this).attr("style");
            if (Number(id) <= 2) {
                $(this).attr("style", attr + ' background-color: pink; color:black;');
            } else if (Number(id) < 7) {
                $(this).attr("style", attr + ' background-color: palegreen; color:black;');
            }
        }
    });
}


function drawTable(name, result, sort) {

    let dir = (sort === undefined) ? "desc" : sort;
    $("#" + name).html();
    $("#" + name).attr("style", "width:100%");
    //$("#char-table-display").append('<div id="char-table" style="width:100%"></div>');

    let base = { align: "right", sortable: true, sorter: "number", minWidth: 30, width: "5%", formatter: "html" };
    let styleBase = { align: "right", sortable: true, sorter: "number", width: 45, formatter: "html" };
    let styleUraBase = { align: "right", sortable: true, sorter: "number", width: 60, formatter: "html" };
    var charCol = [
        { title: "", field: "DotId", width: 30, frozen: true },
        { title: "名前", field: "Name", formatter: "html" },
        //{title: "作品", field: "Series", width: 30, responsive: 10},
        //{title: "武器", field: "WeaponType", width: 40, responsive: 9, formatter: "html"},
        { title: "HP", field: "HP", sortable: true, sorter: "number", visible: SHOW_CHAR },
        { title: "", field: "id", visible: false },
        { title: "", field: "SeriesFilter", visible: false },
        { title: "", field: "WeaponTypeFilter", visible: false },
        Object.assign({ title: "腕", field: "STR", visible: SHOW_CHAR }, base),
        Object.assign({ title: "体", field: "VIT", visible: SHOW_CHAR }, base),
        Object.assign({ title: "器", field: "DEX", visible: SHOW_CHAR }, base),
        Object.assign({ title: "速", field: "AGI", visible: SHOW_CHAR }, base),
        Object.assign({ title: "知", field: "INT", visible: SHOW_CHAR }, base),
        Object.assign({ title: "精", field: "MND", visible: SHOW_CHAR }, base),
        Object.assign({ title: "愛", field: "AI", visible: SHOW_CHAR }, base),
        Object.assign({ title: "魅", field: "MI", visible: SHOW_CHAR }, base),
        { title: "HP", align: "right", field: "URAHP", visible: SHOW_URA, sortable: true, sorter: "number" },
        Object.assign({ title: "腕", field: "URASTR", visible: SHOW_URA }, base),
        Object.assign({ title: "体", field: "URAVIT", visible: SHOW_URA }, base),
        Object.assign({ title: "器", field: "URADEX", visible: SHOW_URA }, base),
        Object.assign({ title: "速", field: "URAAGI", visible: SHOW_URA }, base),
        Object.assign({ title: "知", field: "URAINT", visible: SHOW_URA }, base),
        Object.assign({ title: "精", field: "URAMND", visible: SHOW_URA }, base),
        Object.assign({ title: "愛", field: "URAAI", visible: SHOW_URA }, base),
        Object.assign({ title: "魅", field: "URAMI", visible: SHOW_URA }, base),
        { title: "合計", align: "right", field: "URASUM", sortable: true, sorter: "number" , visible: SHOW_URA},
        { title: "合計", align: "right", field: "SUM", sortable: true, sorter: "number" },
    ];

    var styleCol = [
        { title: "", field: "StyleIcon", width: 60, frozen: true, formatter: "html" },
        { title: "名前", field: "Name", width: 100, formatter: "html" },
        //{title: "作品", field: "Series", width: 30, responsive: 10},
        //{title: "武器", field: "WeaponType", width: 40, responsive: 9, formatter: "html"},
        //{title: "Rare", field: "Rarity", width: 30, responsive: 9, formatter: "html"},
        { title: "Lv", field: "StyleLv", width: 50, responsive: 9 },
        { title: "", field: "id", visible: false },
        { title: "", field: "SeriesFilter", visible: false },
        { title: "", field: "WeaponTypeFilter", visible: false },
        Object.assign({ title: "腕", field: "STR", visible: SHOW_STYLE }, styleBase),
        Object.assign({ title: "体", field: "VIT", visible: SHOW_STYLE }, styleBase),
        Object.assign({ title: "器", field: "DEX", visible: SHOW_STYLE }, styleBase),
        Object.assign({ title: "速", field: "AGI", visible: SHOW_STYLE }, styleBase),
        Object.assign({ title: "知", field: "INT", visible: SHOW_STYLE }, styleBase),
        Object.assign({ title: "精", field: "MND", visible: SHOW_STYLE }, styleBase),
        Object.assign({ title: "愛", field: "AI",  visible: SHOW_STYLE }, styleBase),
        Object.assign({ title: "魅", field: "MI",  visible: SHOW_STYLE }, styleBase),
        { title: "合計", align: "right", field: "SUM",  visible: SHOW_STYLE , sortable: true, sorter: "number" },
        Object.assign({ title: "腕", field: "URASTR", visible: SHOW_URA_ST }, styleUraBase),
        Object.assign({ title: "体", field: "URAVIT", visible: SHOW_URA_ST }, styleUraBase),
        Object.assign({ title: "器", field: "URADEX", visible: SHOW_URA_ST }, styleUraBase),
        Object.assign({ title: "速", field: "URAAGI", visible: SHOW_URA_ST }, styleUraBase),
        Object.assign({ title: "知", field: "URAINT", visible: SHOW_URA_ST }, styleUraBase),
        Object.assign({ title: "精", field: "URAMND", visible: SHOW_URA_ST }, styleUraBase),
        Object.assign({ title: "愛", field: "URAAI",  visible: SHOW_URA_ST }, styleUraBase),
        Object.assign({ title: "魅", field: "URAMI",  visible: SHOW_URA_ST }, styleUraBase),
        { title: "合計", align: "right", field: "SUMURA",  visible: SHOW_URA_ST , sortable: true, sorter: "number" },
        Object.assign({ title: "腕", field: "STR50", visible: SHOW_STYLE50 }, styleBase),
        Object.assign({ title: "体", field: "VIT50", visible: SHOW_STYLE50 }, styleBase),
        Object.assign({ title: "器", field: "DEX50", visible: SHOW_STYLE50 }, styleBase),
        Object.assign({ title: "速", field: "AGI50", visible: SHOW_STYLE50 }, styleBase),
        Object.assign({ title: "知", field: "INT50", visible: SHOW_STYLE50 }, styleBase),
        Object.assign({ title: "精", field: "MND50", visible: SHOW_STYLE50 }, styleBase),
        Object.assign({ title: "愛", field: "AI50",  visible: SHOW_STYLE50 }, styleBase),
        Object.assign({ title: "魅", field: "MI50",  visible: SHOW_STYLE50 }, styleBase),
        { title: "合計", align: "right", field: "SUM50",  visible: SHOW_STYLE50 , sortable: true, sorter: "number" },
        Object.assign({ title: "腕", field: "URASTR50", visible: SHOW_URA_ST50 }, styleUraBase),
        Object.assign({ title: "体", field: "URAVIT50", visible: SHOW_URA_ST50 }, styleUraBase),
        Object.assign({ title: "器", field: "URADEX50", visible: SHOW_URA_ST50 }, styleUraBase),
        Object.assign({ title: "速", field: "URAAGI50", visible: SHOW_URA_ST50 }, styleUraBase),
        Object.assign({ title: "知", field: "URAINT50", visible: SHOW_URA_ST50 }, styleUraBase),
        Object.assign({ title: "精", field: "URAMND50", visible: SHOW_URA_ST50 }, styleUraBase),
        Object.assign({ title: "愛", field: "URAAI50",  visible: SHOW_URA_ST50 }, styleUraBase),
        Object.assign({ title: "魅", field: "URAMI50",  visible: SHOW_URA_ST50 }, styleUraBase),
        { title: "合計", align: "right", field: "SUMURA50",  visible: SHOW_URA_ST50 , sortable: true, sorter: "number" },

        { title: "戦闘力", align: "right", field: "SENTOU", sortable: true, sorter: "number" }
    ];

    if (name === "char-table") {
        col = charCol;
    } else {
        col = styleCol;
    }

    $TABLE[name] = new Tabulator("#" + name, {
        layout: "fitData",
        data: result,
        //layout: "fitColumns", //fit columns to width of table
        //responsiveLayout: "hide", //hide columns that dont fit on the table
        tooltips: false, //show tool tips on cells
        history: true, //allow undo and redo actions on the table
        pagination: "local", //paginate the data
        paginationSize: (name == "char-table") ? 10 : 10, //allow 7 rows per page of data
        //movableColumns: true, //allow column order to be changed
        //resizableRows: true, //allow row order to be changed
        initialSort: [//set the initial sort order of the data
            { column: "SUM", dir: dir },
        ],
        autoResize: false,
        resizableRows: false,
        resizableColumns: false,
        //responsiveLayout: true,
        columns: col,
    });
    // フィルター再設定しているのでここでの設定は無意味
    $TABLE[name].setFilter("SUM", ">", 0);
    changeId2Dot();
}

$("#LIMIT_TABLE_TOGGLE").click(function () {
    $("#LIMIT_TABLE_AREA").slideToggle();
});

$("#STYLE_LV_50").click(function(){
    $("#MY_STYLE_LV").show();
    $("#STYLE_LV_50").hide();
    SHOW_LV50 = false;
    changeDisplay();
});
$("#MY_STYLE_LV").click(function(){
    $("#STYLE_LV_50").show();
    $("#MY_STYLE_LV").hide();
    SHOW_LV50 = true;
    changeDisplay();
});

// テーブル表示内容の切り替え
$(".CHANGE_DISP").click(function(){
    TAG = $(this).attr("data-id");
    // ボタンの入れ替え
    $(".CHANGE_DISP").each(function(){
        $(this).addClass("icon_btn_negative").removeClass("icon_btn_positive");
    });
    $(this).addClass("icon_btn_positive").removeClass("icon_btn_negative");

    $("#URA_ITEM_INFO").slideUp();
    if(TAG == "check" || TAG == "0" || TAG == "ura"){
        $("#char-table-display").slideDown();
        $("#style-table-display").slideUp();
    } else {
        $("#char-table-display").slideUp();
        $("#style-table-display").slideDown();
        if(TAG == "uradojo"){
            $("#URA_ITEM_INFO").slideDown();
        }
    }
    // 周回チェック
    if(TAG == "check") {
        $("#QUEST_CHOISE").slideDown();
    } else {
        $("#QUEST_CHOISE").slideUp();
    }
    if(TAG == "uradojo" || TAG == "style") {
        // スタイルステータス
        $("#STYLE_OPTION").slideDown();
    } else {
        $("#STYLE_OPTION").slideUp();
    }
    changeDisplay();
});

function changeDisplay(){
    SHOW_CHAR = (TAG == "0" || TAG == "check");
    SHOW_URA = (TAG == "ura");
    SHOW_STYLE = (!SHOW_LV50) && (TAG == "style");
    SHOW_URA_ST = (!SHOW_LV50) && (TAG == "uradojo");
    SHOW_STYLE50 = (SHOW_LV50) && (TAG == "style");
    SHOW_URA_ST50 = (SHOW_LV50) && (TAG == "uradojo");
    if(SHOW_CHAR || SHOW_URA){
        drawTable("char-table", MY_CHARDATA_LIST);
    } else {
        drawTable("style-table", MY_STYLEDATA_LIST);
    }
}

// クエスト表示パターン変更
$(".baseDispChange").click(function () {
    $(".baseDispChange").each(function () {
        $(this).removeClass("icon_btn_on");
        $(this).addClass("icon_btn_off");
    });
    $(this).removeClass("icon_btn_off");
    $(this).addClass("icon_btn_on");
    questId = Number($(this).attr("data-id"));
    $(".questList").slideUp();
    $(`#quest${questId}`).slideDown();
});

// baseボタンクリック
$(".baseValue").click(function () {

    $(".baseValue").each(function () {
        $(this).removeClass("icon_btn_on").addClass("icon_btn_off");
    })
    $(this).removeClass("icon_btn_off").addClass("icon_btn_on");

    gtag('event', "clickBase", { 'event_category': "mydata", 'event_label': $(this).text(), 'value': 1 });
    let base = Number($(this).attr("data-id"));
    let pm = -1;
    let sort = "desc";
    tmpLIMIT_BASE = base;
    if (base !== 0) {
        $("#label2").html($(this).text() + "周回時ステータス目標値");
    } else {
        //tmpLIMIT_BASE = LIMIT_BASE;
        $("#label2").html("ステータス一覧");
    }

    if (base !== 0) {
        pm = 1;
        sort = "asc";
    }
    for (let mydata of MY_CHARDATA_LIST) {
        let sum = 0;
        for (let key of PARAM_KEY) {
            if (base === 0) {
                mydata[key] = mydata["org" + key];
                sum += mydata["org" + key];
            } else {
                let calc = (base + CHAR_MASTER[mydata["id"]]['MAX' + key] - mydata["org" + key]) * pm;
                if (calc > 0) {
                    mydata[key] = calc;
                    sum += calc;
                } else if (CHAR_MASTER[mydata["id"]]['MAX' + key] === -99) {
                    mydata[key] = "??"
                } else {
                    mydata[key] = "x"
                }
            }
        }
        mydata["HP"] = (base === 0) ? mydata["orgHP"] : ((base * 10 + 260) - mydata["orgHP"]) * pm;
        mydata["SUM"] = sum;
    }
    drawTable("char-table", MY_CHARDATA_LIST, sort);
    filter("char-table");
    if(NOW_CHAR !== undefined){
        reloadLimitTableRows();
        reloadlimitTableSum();
    }
});

// パラメータ±ボタンクリック
$(document).on('click', ".paramButton", function () {
    var param = $(this).attr("data-param");
    var target = $(this).attr("data-type");
    var pm = ($(this).attr("data-pm") == "plus") ? 1 : -1;
    var now = $("." + target + "INPUT" + param).val();
    if (target == "SU") {
        next = 1;
    } else {
        next = (param == "HP") ? 20 : 4;
    }
    $("." + target + "INPUT" + param).val(Number(now) + (next * pm));
});

// スタイルボタンクリック
$(document).on('click', ".STYLE_CHECK", function () {
    var styleId = $(this).attr("data-id");
    var rare = $(this).attr("data-rare");
    var hasStyle = $(this).find(".CHECK_COVER").hasClass("d-none");
    // on/off切り替え
    $(this).find(".CHECK_COVER").toggleClass("d-none");
    $(".STYLE_ROW").each(function(){
        if($(this).attr("data-id") == styleId) {
            $(this).toggleClass("d-none");
        }
    });
    reloadLimitTableRows();
    reloadlimitTableSum();

    if (hasStyle) {
        // 所持の場合は一緒にスタイルレベルもいれる
        MY_STYLELV_DATA[styleId]['lv'] = 30;
        // リストから削除する
        if (rare === "SS") {
            SS_LIST = SS_LIST.filter(n => n !== styleId);
        } else if (rare === "S") {
            S_LIST = S_LIST.filter(n => n !== styleId);
        } else {
            A_LIST = A_LIST.filter(n => n !== styleId);
        }
    } else {
        delete MY_STYLELV_DATA[styleId];
        if (rare === "SS") {
            SS_LIST.push(styleId);
        } else if (rare === "S") {
            S_LIST.push(styleId);
        } else {
            A_LIST.push(styleId);
        }
    }
    STYLE_MASTER[styleId]['hasStyle'] = hasStyle;
    $("#select" + styleId).prop('disabled', hasStyle);
    updateMyStyle();
});


function updateMyStyle() {
    updateData("STYLECHECK", { "SS": SS_LIST, "S": S_LIST, "A": A_LIST }, true);
}

$(document).on('click', "#save", function () {
    updateMyStyleLV();
    updateMyStatus();
    updateMyUraStatus();
    reloadCharData();
    drawTable("char-table", MY_CHARDATA_LIST);
    drawTable("style-table", MY_STYLEDATA_LIST);
    $("#LIMIT_TABLE_DIV").slideUp();
});

function updateMyStyleLV() {
    $area = $(".STYLE_LV_AREA");
    for (x of $area.children()) {
        styleId = $(x).find(".STYLE_CHECK").attr("data-id");
        styleLv = $(x).find("select").val();
        hasStyle = $(x).find(".CHECK_COVER").hasClass("d-none");
        // 存在しないor値が変わってれば更新
        // でも未チェックの場合は更新しない
        if (hasStyle){
            if(MY_STYLELV_DATA[styleId] === undefined) {
                MY_STYLELV_DATA[styleId] = {"lv": 0}
            }
            // 存在してない、あるいは存在するけど値が変わった場合
            if(MY_STYLELV_DATA[styleId]['lv'] !== styleLv) {
                MY_STYLELV_DATA[styleId]['lv'] = styleLv;
                updateDataNext(`STYLELV/${styleId}`, { "lv": styleLv });
            } else {
                //console.log(`SAVE FAILED ${hasStyle} ${styleId} ${MY_STYLELV_DATA[styleId]} Lv${styleLv}`);
            }
        } else {
            //console.log(`SAVE FAILED ${hasStyle} ${styleId} ${MY_STYLELV_DATA[styleId]} Lv${styleLv}`);
        }
    }
}

function updateMyStatus() {
    $area = $("#INPUT_LG_SU");
    charId = NOW_CHAR['id'];
    //console.log("updateMyStatus", Object.assign({}, MY_DATA[charId]));
    var update = { "HP": 0, "STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0 };
    // 存在しない場合はまずは作る
    if(MY_DATA[charId] === undefined){
        MY_DATA[charId] = Object.assign({}, update);
    }
    // 入力値から保存する裏能力をセット
    for (input of $area.find("input")) {
        MY_DATA[charId][$(input).attr("data-param")] = Number($(input).val());
        update[$(input).attr("data-param")] = Number($(input).val());
    }
    //console.log("SAVE updateMyStatus" , charId, update);
    updateData(`CHAR/${charId}`, update);
}

function updateMyUraStatus() {
    $area = $("#INPUT_LG_URA");
    charId = NOW_CHAR['id'];
    var ura = { "HP": 0, "STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0 };
    // 存在しない場合はまずは作る
    if(MY_URA_DATA[charId] === undefined){
        MY_URA_DATA[charId] = Object.assign({}, ura)        
    }
    // 入力値から保存する裏能力をセット
    for (input of $area.find("input")) {
        ura[$(input).attr("data-param")] = Number($(input).val());
    }
    // 裏能力が更新されてたら更新する
    for (param of PARAM_KEY_HP) {
        if (MY_URA_DATA[charId][param] != ura[param]) {
            MY_URA_DATA[charId] = ura;
            //console.log("SAVE" , charId, ura);
            updateDataNext(`URA_ST/${charId}`, ura);
        }
    }
}

function updateMyCharData(charId) {
    updateData(`CHAR/${charId}`, update);
}
function deleteMyCharData(charId) {
    deleteCharData(charId);
}


$("#delete").click(function(){
    $("#delete_check").slideDown();
});
$("#delete_back").click(function(){
    $("#delete_check").slideUp();
});
$("#delete_go").click(function(){
    id = NOW_CHAR['id'];
    deleteMyCharData(id);
    $("#LIMIT_TABLE_AREA").slideUp();
});

