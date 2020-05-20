if(typeof firebase === 'undefined'){
    // 接続がない場合は即実行。そうでない場合はログイン処理待ち
    initialLoad();
}
var NOW_UID = getMyId();
var MY_VOTE = {};

var tableLimit = 15;
var MY_DATA_LIST = [];
var CHAR_RANK;
var table;
// 合計の外れ範囲通常7、3倍
var totalThreathold = 13;
var OVER_LIMIT = 2; // 通常はオーバーして良いのは1。3倍中は2
var login = false;

function _noLoginInitial() {
    var uiConfig = {
        // ログイン完了時のリダイレクト先
        signInSuccessUrl: 'https://nao-romasaga.github.io/ourchar.html',
        // 利用する認証機能
        signInOptions: [
            firebase.auth.TwitterAuthProvider.PROVIDER_ID
        ],
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth(appUsers));
    ui.start('#firebaseui-auth-container', uiConfig);
    initialLoad();
}
function _initial() {
    login = true;
    $(".noLogin").hide();
    $(".isLogin").removeClass("d-none");
    $("#loginInfo").hide();
    loginCard("#firebaseui-auth-container");
    initialLoad();
}

async function initialLoad() {
    CHAR_RANK = RANK_LIST['LIST'];
    $("#UPDATE").text(RANK_LIST['UPDATE']);

    $("#CHAR_COUNT").text(CHAR_RANK.length);
    let nowSize = 99999;
    let nowRank = 1;
    for (let i in CHAR_RANK) {
        let id = CHAR_RANK[i]['Id'];
        if (CHAR_MASTER[id] === undefined) {
            continue;
        }
        CHAR_RANK[i]['DotId'] = "Dot" + CHAR_MASTER[id]['DotId'];
        CHAR_RANK[i]['Name'] = CHAR_MASTER[id]['Name'];
        CHAR_RANK[i]['Series'] = CHAR_MASTER[id]['Series'];
        CHAR_RANK[i]['WeaponType'] = ICON_LIST[CHAR_MASTER[id]['WeaponType']];
        CHAR_RANK[i]['SeriesFilter'] = CHAR_MASTER[id]['Series'];
        CHAR_RANK[i]['WeaponTypeFilter'] = ICON_LIST[CHAR_MASTER[id]['WeaponType']];
        if (nowSize > Number(CHAR_RANK[i]['size'])) {
            nowSize = Number(CHAR_RANK[i]['size']);
            nowRank = Number(i) + 1;
        }
        CHAR_RANK[i]['rank'] = nowRank;
    }
    drawTable(CHAR_RANK);
    $(".initialHide").removeClass("d-none");
    $(".initialShow").slideUp();
    $(".HANREI").slideUp();

    if (location.search !== "") {
        let tmp = (location.search).substr(3)
        let input = tmp.split("&");
        if (CHAR_MASTER[input[0]] !== undefined) {
            dispRanking(input[0]);
            $("html,body").animate({scrollTop: $('#RANKKING_TABLE').offset().top}, 500, 'swing');
        }
    }
}


$(".filterList").click(function () {
    $(this).find(".fButton").toggleClass("filterActive");
    if (table === undefined) {
        return;
    }
    filter();
    gtag('event', "clickFilter", {'event_category': "ourchar", 'event_label': $(this).attr("href").substr(1), 'value': 1});
});

//let rand = Math.floor(Math.random() * 5);
//$(".dotBackground").addClass("bg" + (rand + 1));

function filter() {
    let weaopnFilter = [];
    let seriesFilter = [];
    let weaopnLabel = [];
    let seriesLabel = [];
    $(".filterList").each(function () {
        let target = $(this).attr("data-type");
        let value = $(this).attr("href").substr(1);
        if ($(this).find(".fButton").hasClass("filterActive")) {
            if (target === "WeaponTypeFilter") {
                weaopnFilter.push({field: target, type: "=", value: value});
                weaopnLabel.push($(this).attr("data-label"));
            } else {
                seriesFilter.push({field: target, type: "=", value: value});
                seriesLabel.push(value);
            }
        }
    });

    let labels = "";
    table.clearFilter();
    let finalFilter = [{field: "MAXSUM", type: ">", value: 0}];
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
    table.setFilter(finalFilter);
    changeId2Dot();
}

$(document).on('click', ".tabulator-header, .tabulator-footer, .tabulator-page", function () {
    changeId2Dot();
});
$(document).on('click', "#VOTE_BUTTON", function () {
    $(this).parents(".TABLE").find("select").slideDown();
    $("#VOTE_BUTTON").addClass("d-none");
    $("#SEND_BUTTON").removeClass("d-none");
    $(".HANREI").slideDown();
});
$(document).on('click', "#SEND_BUTTON", function () {
    $(this).parents(".TABLE").find("select").slideUp();
    $("#VOTE_BUTTON").removeClass("d-none");
    $("#SEND_BUTTON").addClass("d-none");
    $(".HANREI").slideUp();

    $(".VOTE_ROW").each(function(){
        var sid = $(this).attr("data-id");
        var shukai = Number($(this).find(".SHUKAI").find("select").val());
        var hanyo = Number($(this).find(".HANYO").find("select").val());
        var only = Number($(this).find(".ONLY").find("select").val());
        var p = {
            'Id' : sid,
            'shukai' : shukai,
            'hanyo' : hanyo,
            'only' : only
        };
        // 無駄な更新はしない
        if(shukai != 0 && hanyo != 0 && only != 0) {
            // 未登録、あるいは値が変更された場合は登録する
            if(MY_VOTE[sid] == undefined) {
                writeVoteAPI(p);
            } else {
                var updateFlg = false;
                for(var colName in VOTE_DB_COLUMN){
                    if(Number(MY_VOTE[sid][colName]) != p[VOTE_DB_COLUMN[colName]]){
                        updateFlg = true;
                        break;
                    }
                }
                if(updateFlg){
                    writeVoteAPI(p);
                }
            }    
        }
    });
});
$(document).on('click', "#HANREI_OPEN", function () {
    $(".HANREI").slideToggle();
});

$(document).on('click', ".tabulator-cell", function () {
    // キャラが変わったら登録ボタンをリセットする
    $("#SEND_BUTTON").addClass("d-none");
    $("#VOTE_BUTTON").removeClass("d-none");

    $(this).parent().find(".tabulator-cell").each(async function () {
        let id = $(this).text();
        let field = $(this).attr("tabulator-field");
        if (id.indexOf("ID") > -1) {
            dispRanking(id);
        } else if (field === "Name") {
            gtag('event', "clickChar", {'event_category': "ourchar", 'event_label': id, 'value': 1});
        }
    });
    $("html,body").animate({scrollTop: $('#badge').offset().top}, 500, 'swing');
});

async function dispRanking(id, sort = "list") {
    $("#STYLE_LINK").attr('href', `./style.html?s=${CHAR_MASTER[id]['Holders'][0]}`);
    $("#ST_SORT").attr('data-id', id);
    $("#COM_SORT").attr('data-id', id);

    $("#initialHide").removeClass("d-none");
    let styleMax = {"STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0, "SUM": 0};
    for (let key of PARAM_KEY) {
        styleMax[key] = (CHAR_MASTER[id]["MAX" + key] === -99) ? "?" : LIMIT_BASE + Number(CHAR_MASTER[id]["MAX" + key]);
    }
    var MAX_HP = 0;
    for (let idx in CHAR_RANK) {
        if (CHAR_RANK[idx]['Id'] === id) {
            for (let key of PARAM_KEY) {
                //$(".MAX" + key).text(CHAR_RANK[idx]["MAX" + key]);
            }
            MAX_HP = CHAR_RANK[idx]["MAXHP"];
            $(".MAXSUM").text(CHAR_RANK[idx]["MAXSUM"]);
            $("#RANK_COUNT").text(CHAR_RANK[idx]['rank']);
            $("#INPUT_COUNT").text(CHAR_RANK[idx]['size']);
            break;
        }
    }
    $(".STYLE_ROW").remove();
    $(".VOTE_ROW").remove();
    $(".charName").text(CHAR_MASTER[id]['Name']);
    var sList = [];
    for (let styleId of CHAR_MASTER[id]['Holders']) {
        sList.push(STYLE_MASTER[styleId]);
    }
    var styleIdList = sortStyleId(sList);

    // 所持しているスタイルの上限と評判を表示
    for (let styleId of styleIdList) {
        let styleInfo  = STYLE_MASTER[styleId];

        let styleRow = $("#STYLE_TEMPLATE").clone().removeAttr("id").addClass("STYLE_ROW").removeClass("d-none");
        var icon = getStyleIcon(styleInfo['Rarity'], styleId, CHAR_MASTER[id]['WeaponType'], true);
        icon.addClass("d-md-none");
        var cutinImg = getImgPath(`style_cutin/${styleId}.png`);
        var rareImg = getImgPath(`icon/icon_${styleInfo['Rarity']}.png`);
        styleRow.find(".IMG_CUTIN").attr("src", cutinImg);
        styleRow.find(".IMG_RARE").attr("src", rareImg);
        styleRow.find(".IMG").prepend(icon.clone());

        let voteRow = $("#VOTE_ROW_TEMPLATE").clone().attr("id", `vote${styleId}`).attr("data-id", styleId).addClass("VOTE_ROW").removeClass("d-none");
        voteRow.find(".IMG").prepend(icon.clone());
        voteRow.find(".IMG_CUTIN").attr("src", cutinImg);
        voteRow.find(".IMG_RARE").attr("src", rareImg);
        $("#VOTE_ROW_HEADER").after(voteRow);
        readVoteAPI(styleId);

        let sum = 0;
        let styleLimitSum = 0;
        var size2 = {1:8,2:12,3:12};

        for (let key of PARAM_KEY) {
            let val = LIMIT_BASE + Number(styleInfo['Limit' + key]);
            var ind = (styleInfo["Ind"+key] !== undefined) ? styleInfo["Ind"+key] : 1;
            var indPath = getImgPath(`icon/icon_ind_${ind}.png`);
            var indicator1= `<img src="${indPath}" class="pcInd" >`;
            var indicator2 = `<img src="${indPath}" width=${size2[ind]}>`;
            var lim = styleInfo["Limit" + key] - CHAR_MASTER[id][key];
            styleLimitSum += lim;
            if (styleInfo['Limit' + key] < 99) {
                sum += val;
            } else {
                val = "?";
            }
            var mark = "";
            if(styleInfo['Fix'] == "f"){
                mark = "確";
            } else if(styleInfo['Fix' + key] == "k" || (ind == "2" && lim == 3) || (ind == "1" && lim == 0) ) {
                mark = "確";
            }
            var markPC = (mark != "") ? `<span class="kaku">[${mark}]</span>` : "";
            var htmlPC = $(`<span class="d-none d-md-inline">${indicator1}<span class="val">${val}</span>${markPC}</span>`);
            var htmlSP = $(`<span class="d-md-none">${indicator2}<p style="margin-top:-5px">${val}</p><span class="kaku">${mark}</span></span>`);
            styleRow.find("." + key).html("").append(htmlPC).append(htmlSP);
        }
        var sumLimit = `<span class="d-none d-md-inline">(${styleLimitSum})</span>`;
        styleRow.find(".SUM").html(`${sum}`);
        $("#styleLabelRow").after(styleRow);
    }
    $(".STYLE_ROW").each(function () {
        for (let key of PARAM_KEY) {
            let td = $(this).find("." + key).find(".val");
            var x = td.text().split(" "); // スタイル成長傾向を入れるようにしたので対応
            if (x[0] == styleMax[key]) {
                //td.css("background-color", "lightgreen");
                $(this).find("." + key).addClass("fuchidori-blue maxCol");
            }
        }
    });
    // スタイル複合最大値
    let styleRowMax = $("#STYLE_TEMPLATE").clone();
    styleRowMax.removeAttr("id").addClass("STYLE_ROW fuchidori-blue").removeClass("d-none")
            .css("background-color", "rgba(0,0,0, 0.2)");
    styleRowMax.find(".IMG").html("最大値");
    let styleSum = 0;
    for (let key of PARAM_KEY) {
        styleSum += (styleMax[key] !== "?") ? styleMax[key] : 0;
        styleRowMax.find("." + key).text(styleMax[key]);
    }
    styleRowMax.find(".SUM").text(styleSum);
    styleRowMax.find(".SUM").addClass("STYLE_MAX");
    $("#styleLabelRow").after(styleRowMax);

    // 自分の入力値
    let myUserData = null;
    if (login) {
        let funcList = [];
        var func = asyncReadUserDataWithId('CHAR', id, function (result) {
            myUserData = result;
        });
        funcList.push(func);
        await Promise.all(funcList);
    }
    
    if (myUserData === null) {
        myUserData = {"STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0};
    }
    let sum = 0;
    for (let key of PARAM_KEY) {
        sum += Number(myUserData[key]);
        $(".YOUR" + key).text(myUserData[key]);
        let limit = (styleMax[key] === "?") ? "?" : styleMax[key] - myUserData[key];
        $(".LIMIT" + key).text(limit);
    }

    $(".YOURSUM").text(sum);
    $(".LIMITSUM").text((styleSum === 0) ? "?" : styleSum - sum);

    dispRankingRow(id, sort);
}

async function dispRankingRow(id, sort = "list"){
    let styleMax = {"STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0, "SUM": 0};
    for (let key of PARAM_KEY) {
        styleMax[key] = (CHAR_MASTER[id]["MAX" + key] === -99) ? "?" : LIMIT_BASE + Number(CHAR_MASTER[id]["MAX" + key]);
    }
    
    let MAX_HP = 0; // 今は使ってない
    let dispRank = "";
    let br = "%0D%0A";
    // 自分の入力値
    let myUserData = null;
    if (login) {
        let funcList = [];
        var func = asyncReadUserDataWithId('CHAR', id, function (result) {
            myUserData = result;
        });
        funcList.push(func);
        await Promise.all(funcList);
    } 
    
    let myDataFlg = "MATCH";
    if (myUserData === null) {
        myDataFlg = "NONE";
        myUserData = {"HP":0, "STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0};
    }

    let myHp = myUserData["HP"];
    let myCombat = 0;
    let mySum = 0;
    for (let key of PARAM_KEY) {
        myCombat += Number(myUserData[key]) * POWER_TABLE[key];
        mySum += Number(myUserData[key])
    }
    myCombat += Number(myUserData["HP"]) * POWER_TABLE["HP"];

    let myRankValue = (sort == 'list') ? mySum : myCombat;

    // ランキング表示
    let userData = RANK_DETAIL[id];
    let myRank = "";
    let myTmpRank = 1;
    let nowRankValue = 99999;
    var nowrank = 0;
    $(".USER_RANK_DISP").remove();
    var myRowInsert = false;
    var maxRankValue = 0;
    var nowHp = 0;

    for (let idx in userData['kyogiList']) {
        if (UID !== undefined && UID.substr(0,4) === userData['kyogiList'][idx]['UID']) {
            myRowInsert = true;
        }
    }

    for (let idx in userData[sort]) {
        let row = userData[sort][idx];
        let rowSum = 0;
        let hp = row["HP"];
        for (let key in PARAM_KEY) {
            rowSum += Number(row[key]);
        }
        let rowRankValue = (sort == "list") ? rowSum : row["COMBAT"];

        if(maxRankValue < rowRankValue){
            maxRankValue = rowRankValue;
        }
        // 合計値が変わった or 同じだけどHPが違う場合はランクも変える。
        if (nowRankValue > rowRankValue || (nowRankValue == rowRankValue && nowHp != hp) ) {
            nowRankValue = rowRankValue;
            nowrank = nowrank + 1;
        }
        nowHp = hp;

        if (nowRankValue > myRankValue) {
            // 自分より大きい場合は自分のランクを落とす
            myTmpRank = nowrank + 1;
        }
        if (!myRowInsert && myRankValue > 0) {
            // 合計が高いか、合計が同じでHPが高い場合自分を差し込む
            if(myRankValue > rowRankValue || (myRankValue == rowRankValue && myHp >= nowHp) ){
                myRowInsert = true;
                myTmpRank = nowrank;
                addRankRow(nowrank, myUserData, MAX_HP, styleMax, mySum, true, myCombat);
                nowrank++;
            }
        }

        // 表示行数を超えてない
        // 自分の行は入れない（すでに入れているので）
        // すでに入れている場合も入れない
        if (idx < OURSTYLE_LIMIT) {
            if (UID !== undefined && UID.substr(0,4) === row['UID'] && myRowInsert) {
            } else {
                addRankRow(nowrank, row, MAX_HP, styleMax, rowSum, false, myCombat);
            }
        }
    }
    // 最後まで自分が入らなかった場合は最後に入れる
    if (!myRowInsert && myDataFlg !== "NONE" && myRankValue > 0) {
        var tag = (sort == "list") ? "RANK" : "RANK_C";

        var result = userData[tag];
        let sumKeys = Object.keys(result);
        var countRank = 0;
        for (let keyIdx = sumKeys.length - 1; keyIdx > 0; keyIdx--) {
            if (myRankValue < Number(sumKeys[keyIdx])) {
                countRank += result[sumKeys[keyIdx]];
            } else {
                break;
            }
        }
        myTmpRank = countRank;
        addRankRow(countRank, myUserData, MAX_HP, styleMax, mySum, true, myCombat);
    }

    if (userData['kyogiList'] !== undefined && userData['kyogiList'].length > 0) {
        $("#USER_RANK").before("<tr class='USER_RANK_DISP' style=''><td colspan=12 class='icon_btn_negative fuchidori-red' style='display:table-cell; color:coral;'><i class='fas fa-arrow-down'></i> 協議中 <i class='fas fa-arrow-down'></i></td></tr>");
    }
    nowrank = "協議中";
    for (let idx in userData['kyogiList']) {
        let rowSum = 0;
        let myRow = false;
        for (let key in PARAM_KEY) {
            rowSum += Number(userData['kyogiList'][idx][key]);
        }
        
        if (UID !== undefined && UID.substr(0,4) === userData['kyogiList'][idx]['UID']) {
            myDataFlg = "KYOGI";
            myRow = true;
        }
        userData['kyogiList'][idx]['kyogi'] = true;
        // 表示行数を超えてない
        if (myRow) {
            addRankRow(nowrank, userData['kyogiList'][idx], MAX_HP, styleMax, rowSum, true, myCombat);
        } else {
            addRankRow(nowrank, userData['kyogiList'][idx], MAX_HP, styleMax, rowSum, false);
        }
    }

    // myDataFlg = KYOGI : 協議に入ってる
    // myDataFlg = NONE : 登録なし
    myTmpRank = (myTmpRank == 1 && maxRankValue > myRankValue) ? "計算中" : myTmpRank+"位";
    $(".rankingTweet").parent().removeClass("d-none");
    dispRank = myTmpRank;
    if (myDataFlg === "KYOGI") {
        dispRank = `暫定${myTmpRank}`;
        myRank = `${myTmpRank}(${myRankValue}pt)<br>入力内容を再確認するか画像付きで報告お願い致します`;
    } else if(myDataFlg === "MATCH"){
        myRank = `${myTmpRank}(${number_format(myRankValue)}pt)`;
    } else {
        $(".rankingTweet").parent().addClass("d-none");
        myRank = "登録がありません";
    }
    $("#MY_RANK").html(myRank);

    var charDot = getCharBase("", CHAR_MASTER[id]['DotId'], "");
    charDot.find(".char-aruku-left").addClass("char-winner").removeClass("char-aruku-left");
    $("#charDotAruku").html("").append(charDot);
    let charName = CHAR_MASTER[id]['Name'];
    let t = (sort == "list") ? "ステータス" : "キャラ戦闘力";
    let textBase = `${charName}で${t}ランキング${dispRank}!!${br}`;
    textBase += "====" + br;
    if(sort != "list"){
        textBase += "戦闘力:"+ myCombat + br;
    }
    textBase += "HP:" + parseInt(myUserData['HP']) +br;
    textBase += "腕:" + myUserData['STR'] + br;
    textBase += "体:" + myUserData['VIT'] + br;
    textBase += "器:" + myUserData['DEX'] + br;
    textBase += "速:" + myUserData['AGI'] + br;
    textBase += "知:" + myUserData['INT'] + br;
    textBase += "精:" + myUserData['MND'] + br;
    textBase += "愛:" + myUserData['AI'] + br;
    textBase += "魅:" + myUserData['MI'] + br;
    textBase += "合計:" + mySum + br;
    let hash = "ロマサガRS便利ツール,ロマサガRS育成ランキング";

    let textRanking = `育成ランキング [ロマサガRS便利ツール] ${br}` + textBase;
    let href1 = `https://twitter.com/intent/tweet?text=${textRanking}&url=https://nao-romasaga.github.io/ourchar.html?c=${id}&hashtags=${hash}`;
    $(".rankingTweet").attr("href", href1);

    let textImage = `@nao_romasaga_rs 育成ランキング 協議解除申請 ${br}` + textBase;
    let href2 = `https://twitter.com/intent/tweet?text=${textImage}&url=https://nao-romasaga.github.io/ourchar.html?c=${id}&hashtags=${hash}`;
    $(".kaijoTweet").attr("href", href2);    
}

function readVoteAPI(sid){
    var param = `uid=${NOW_UID}&sid=${sid}`;
    $.getJSON(`https://romasagatool.com/api/vote_style.php?${param}&c=dispVoteRadar&dispVoteRadar=?`);    
    $.getJSON(`https://romasagatool.com/api/style_damage_rank.php?sid=${sid}&c=dispDamageRatio&dispDamageRatio=?`);    
}
function writeVoteAPI(p){
    var param = `uid=${NOW_UID}&sid=${p['Id']}&v1=${p['shukai']}&v2=${p['hanyo']}&v3=${p['only']}`;
    $.getJSON(`https://romasagatool.com/api/vote_style.php?${param}&c=dispVoteRadar&dispVoteRadar=?`);    
}

function dispVoteRadar(data){
    var sid = data['calc']['sid'];
    var $tr = $(`#vote${sid}`);
    $tr.find(`.VOTE`).html(data['calc']['cnt']);

    for(var colName in VOTE_DB_COLUMN){
        var val = (data['calc'][colName] == undefined) ? 0 : data['calc'][colName]; 
        var clazzName = VOTE_DB_COLUMN[colName].toUpperCase();
        $tr.find(`.${clazzName}`).html("");
        for(var i = 0; i<5; i++){
            $star = getStarIcon(val-i);
            $star.addClass("d-none d-lg-inline icon-star-small").removeClass("icon-star");
            $tr.find(`.${clazzName}`).append($star);
        }
        $tr.find(`.${clazzName}`).append("<br class='d-none d-lg-inline'>"+Number(val).toFixed(2));
        var $select = $(`#VOTE_INPUT`).clone().attr("id","").removeClass("d-none");
        $tr.find(`.${clazzName}`).append($select.slideUp());
    }
    if(data['mydata']['col1'] !== undefined){
        // 一時保存しておいてあとで確認する
        MY_VOTE[sid] = data['mydata'];
        for(var colName in VOTE_DB_COLUMN){
            var val = (data['mydata'][colName] == undefined) ? 0 : data['mydata'][colName]; 
            var clazzName = VOTE_DB_COLUMN[colName].toUpperCase();
            $tr.find(`.${clazzName}`).find("select").val(val);
        }
    }
}

function dispDamageRatio(data){
    var sid = data['sid'];
    var $tr = $(`#vote${sid}`);
    var single = Math.floor(data['singleHensa'] - 25)/10;
    single = (single > 5) ? 5.00 : single;
    single = (single < 0) ? 0.01 : single;
    var multi = Math.floor(data['multiHensa'] - 25)/10;
    multi = (multi > 5) ? 5.00 : multi;
    multi = (multi < 0) ? 0.01 : multi;
    for(var i = 0; i<5; i++){
        $star = getStarIcon(single-i);
        $star.addClass("d-none d-lg-inline icon-star-small").removeClass("icon-star");
        $tr.find(`.SINGLE_FIRE`).append($star.clone());
        $star2 = getStarIcon(multi-i);
        $star2.addClass("d-none d-lg-inline icon-star-small").removeClass("icon-star");
        $tr.find(`.MULTI_FIRE`).append($star2.clone());
    }
    $tr.find(`.SINGLE_FIRE`).append("<br class='d-none d-lg-inline'>"+Number(single).toFixed(2));
    $tr.find(`.MULTI_FIRE`).append("<br class='d-none d-lg-inline'>"+Number(multi).toFixed(2));
}


function addRankRow(nowrank, data, MAX_HP, styleMax, sum, myFlg, combat = 0) {
    let sizeClass = (nowrank === "協議中") ? "small" : "";
    let tr = $("<tr>").addClass(`text-center USER_RANK_DISP ${sizeClass}`);
    if (myFlg) {
        tr.addClass("bg-white");
    }
    tr.append(`<td class='paramCell2 text-nowrap'>${nowrank} </td>`);

    var combat = (data['COMBAT'] !== undefined) ? data['COMBAT'] : combat;
    tr.append(`<td class='paramCell2 small D_COM'>${number_format(combat)}</td>`);
        
    let hp = (data["HP"] === undefined) ? "-" : data["HP"];
    //if (MAX_HP === hp && nowrank !== "協議中") {
    //    hp = `★${hp}`;
    //}
    var hpStyle = "";
    if(hp > 999 && data['kyogi'] !== undefined ){
        hpStyle = "  background-color:red; color:white;";
        hp += '<i class="fas fa-question"></i>';
    }
    tr.append(`<td class='paramCell2 small' style='${hpStyle}'>${hp}</td>`)
    for (let idx in PARAM_KEY) {
        let key = PARAM_KEY[idx];
        let myVal = (data[idx] === undefined) ? data[key]: data[idx];
        let style = "";
        if(styleMax[key] > 0){
            if (myVal < styleMax[key]) {
                style = "";
            } else if (myVal === styleMax[key]) {
                style = " background-color:lightgreen;";
            } else if(myVal < styleMax[key] + OVER_LIMIT) {
                style = " background-color:yellow;";
            } else if(myVal == styleMax[key] + OVER_LIMIT) {
                style = " background-color:darkorchid; color:yellow;";
            } else {
                style = " background-color:red; color:white;";
            }
        }
        tr.append(`<td class='paramCell2 small' style='${style}'>${myVal}</td>`);
    }

    if (Number($(".STYLE_MAX").text()) > sum) {
        tr.append(`<td class='paramCell2 small D_SUM'>${sum}</td>`)
    } else if (Number($(".STYLE_MAX").text()) == sum) {
        tr.append(`<td class='paramCell2 D_SUM' style='background-color:lightgreen;'>${sum}</td>`)
    } else if (Number($(".STYLE_MAX").text() + totalThreathold) < sum ) {
        tr.append(`<td class='paramCell2 D_SUM' style='background-color:red; color:white;'>${sum}</td>`)
    } else {
        tr.append(`<td class='paramCell2 D_SUM' style='background-color:yellow;'>${sum}</td>`)
    }
    $("#USER_RANK").before(tr);
}

$(document).on('click', "#ST_SORT", function () {
    $("#ST_SORT").addClass("icon_btn_positive").removeClass("icon_btn_negative");
    $("#COM_SORT").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    dispRankingRow($(this).attr("data-id"), 'list');
});
$(document).on('click', "#COM_SORT", function () {
    $("#COM_SORT").addClass("icon_btn_positive").removeClass("icon_btn_negative");
    $("#ST_SORT").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    dispRankingRow($(this).attr("data-id"), 'list_c');
});



function changeId2Dot() {
    $("#example-table").find(".tabulator-cell").each(function () {
        let id = $(this).text();
        if (id.indexOf("Dot") > -1) {
            var png = getImgPath(`dot/${id.substr(3)}.png`);
            let src = `<img src="${png}" style="object-position: -10px -10px">`;
            $(this).html(src);
        } else if (id.indexOf("icon") > -1) {
            let src = `<span class="icon_mini_zokusei ${id}"></span>`;
            $(this).html(src);
        }
    });
}

function drawTable(result, sort) {
    let dir = (sort === undefined) ? "desc" : sort;
    $("#example-table").remove();
    $("#example-table-display").append('<div id="example-table" style="width:100%"></div>');

    let base = {align: "right", sortable: true, sorter: "number", minWidth: 30, width: 30, responsive: 13};
    table = new Tabulator("#example-table", {
        layout: "fitColumns",
        data: result,
        //layout: "fitColumns", //fit columns to width of table
        //responsiveLayout: "hide", //hide columns that dont fit on the table
        tooltips: false, //show tool tips on cells
        history: true, //allow undo and redo actions on the table
        pagination: "local", //paginate the data
        paginationSize: tableLimit, //allow 7 rows per page of data
        //movableColumns: true, //allow column order to be changed
        //resizableRows: true, //allow row order to be changed
        initialSort: [//set the initial sort order of the data
            {column: "MAXSUM", dir: dir},
        ],
        autoResize: false,
        resizableRows: false,
        resizableColumns: false,
        responsiveLayout: true,
        columns: [
            {title: "", field: "DotId", width: 30, frozen: true},
            {title: "", field: "Id", visible: false},
            {title: "", field: "UserId", visible: false},
            {title: "", field: "SeriesFilter", visible: false},
            {title: "", field: "WeaponTypeFilter", visible: false},
            {title: "rank", field: "rank", visible: false},
            {title: "名前", field: "Name", width: 100},
            {title: "作品", field: "Series", width: 30, responsive: 14},
            {title: "武器", field: "WeaponType", width: 30, responsive: 14},
            {title: "HP", field: "MAXHP", align: "right", sortable: true, sorter: "number", minWidth: 55, width: 55, responsive: 12},
            Object.assign({title: "腕", field: "MAXSTR"}, base),
            Object.assign({title: "体", field: "MAXVIT", }, base),
            Object.assign({title: "器", field: "MAXDEX", }, base),
            Object.assign({title: "速", field: "MAXAGI", }, base),
            Object.assign({title: "知", field: "MAXINT", }, base),
            Object.assign({title: "精", field: "MAXMND", }, base),
            Object.assign({title: "愛", field: "MAXAI", }, base),
            Object.assign({title: "魅", field: "MAXMI", }, base),
            {title: '<span class="hidden pcBlock">合</span>計', field: "MAXSUM", sortable: true, sorter: "number"},
            {title: '平均', field: "AVG", sortable: true, sorter: "number", responsive: 11},
            {title: '戦闘力', field: "MAXCOMBAT", sortable: true, sorter: "number", responsive: 13},
            {title: "登録数", field: "size", responsive: 12},
        ],
    });

    table.setFilter("MAXSUM", ">", 0);
    changeId2Dot();
}