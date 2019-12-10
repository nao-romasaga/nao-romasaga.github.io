if(typeof firebase === 'undefined'){
    // 接続がない場合は即実行。そうでない場合はログイン処理待ち
    initialLoad();
}

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
    let icon = $("<img>").attr("src", USER.photoURL)
            .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
    let name = `${USER.displayName} さん:ログイン中`;
    $("#firebaseui-auth-container").addClass("bg-white kadomaru")
            .append(icon).append(name);
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
    $(this).parent().toggleClass("filterActive");
    if (table === undefined) {
        return;
    }
    filter();
    gtag('event', "clickFilter", {'event_category': "ourchar", 'event_label': $(this).attr("href").substr(1), 'value': 1});
});

let rand = Math.floor(Math.random() * 5);
$(".dotBackground").addClass("bg" + (rand + 1));

function filter() {
    let weaopnFilter = [];
    let seriesFilter = [];
    let weaopnLabel = [];
    let seriesLabel = [];
    $(".filterList").each(function () {
        let target = $(this).attr("data-type");
        let value = $(this).attr("href").substr(1);
        if ($(this).parent().hasClass("filterActive")) {
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
$(document).on('click', ".tabulator-cell", function () {
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

async function dispRanking(id) {
    //firebase.database().goOnline();
    //firebase.database(appUsers).goOnline();
    $("#STYLE_LINK").attr('href', `./style.html?s=${CHAR_MASTER[id]['Holders'][0]}`);

    $("#initialHide").removeClass("d-none");
    let styleMax = {"STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0, "SUM": 0};
    for (let key of PARAM_KEY) {
        styleMax[key] = (CHAR_MASTER[id]["MAX" + key] === -99) ? "?" : LIMIT_BASE + Number(CHAR_MASTER[id]["MAX" + key]);
    }
    var MAX_HP = 0;
    for (let idx in CHAR_RANK) {
        if (CHAR_RANK[idx]['Id'] === id) {
            for (let key of PARAM_KEY) {
                $(".MAX" + key).text(CHAR_RANK[idx]["MAX" + key]);
            }
            MAX_HP = CHAR_RANK[idx]["MAXHP"];
            $(".MAXSUM").text(CHAR_RANK[idx]["MAXSUM"]);
            $("#RANK_COUNT").text(CHAR_RANK[idx]['rank']);
            $("#INPUT_COUNT").text(CHAR_RANK[idx]['size']);
            break;
        }
    }
    let charName = "";
    let dispRank = "";
    let br = "%0D%0A";


    $(".STYLE_ROW").remove();
    charName = CHAR_MASTER[id]['Name'];
    $(".charName").text(charName);

    for (let styleId of CHAR_MASTER[id]['Holders']) {
        let styleInfo  = STYLE_MASTER[styleId];

        let styleRow = $("#STYLE_TEMPLATE").clone();
        styleRow.removeAttr("id");
        styleRow.addClass("STYLE_ROW");
        styleRow.removeClass("d-none");
        styleRow.find(".rare").attr("src", `./img/icon/icon_${styleInfo['Rarity']}.png`);
        styleRow.find(".icn").attr("src", `./img/style_icon/${styleId}.png`);
        let sum = 0;
        let styleLimitSum = 0;
        for (let key of PARAM_KEY) {
            let val = LIMIT_BASE + Number(styleInfo['Limit' + key]);
            var ind = (styleInfo["Ind"+key] !== undefined) ? styleInfo["Ind"+key] : 1;
            var indicator = `<img src="./img/icon/icon_ind_${ind}.png" width=15>`
            var lim = styleInfo["Limit" + key] - CHAR_MASTER[id][key];
            styleLimitSum += lim;
            if (styleInfo['Limit' + key] < 99) {
                sum += val;
            } else {
                val = "?";
            }
            styleRow.find("." + key).html(`${val} <span class="d-none d-md-inline">${indicator}(${lim})</span>`);
        }
        styleRow.find(".SUM").html(`${sum} <span class="d-none d-md-inline">(${styleLimitSum})</span>`);
        $("#styleLabelRow").after(styleRow);
    }
    $(".STYLE_ROW").each(function () {
        for (let key of PARAM_KEY) {
            let td = $(this).find("." + key);
            var x = td.text().split(" "); // スタイル成長傾向を入れるようにしたので対応
            if (x[0] == styleMax[key]) {
                td.css("background-color", "lightgreen");
            }
        }
    });
    // スタイル複合最大値
    let styleRowMax = $("#STYLE_TEMPLATE").clone();
    styleRowMax.removeAttr("id").addClass("STYLE_ROW").removeClass("d-none")
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
        console.log("isLogin");
        let funcList = [];
        var func = asyncReadUserDataWithId('CHAR', id, function (result) {
            myUserData = result;
        });
        funcList.push(func);
        await Promise.all(funcList);
    } else {
        console.log("no login");
    }
    
    let myDataFlg = "MATCH";
    if (myUserData === null) {
        myDataFlg = "NONE";
        myUserData = {"STR": 0, "VIT": 0, "DEX": 0, "AGI": 0, "INT": 0, "MND": 0, "AI": 0, "MI": 0};
    }
    let sum = 0;
    let myHp = myUserData["HP"];
    for (let key of PARAM_KEY) {
        sum += Number(myUserData[key]);
        $(".YOUR" + key).text(myUserData[key]);
        let limit = (styleMax[key] === "?") ? "?" : styleMax[key] - myUserData[key];
        $(".LIMIT" + key).text(limit);
    }

    $(".YOURSUM").text(sum);
    $(".LIMITSUM").text((styleSum === 0) ? "?" : styleSum - sum);
    let mySum = sum;


    // ランキング表示
    let userData = RANK_DETAIL[id];
    let myRank = "";
    let myTmpRank = 1;
    let nowsum = 999;
    var nowrank = 0;
    $(".USER_RANK_DISP").remove();
    var myRowInsert = false;
    var maxSum = 0;
    var nowHp = 0;
    for (let idx in userData['list']) {
        let rowSum = 0;
        let hp = userData['list'][idx]["HP"];
        for (let key in PARAM_KEY) {
            rowSum += Number(userData['list'][idx][key]);
        }
        if(maxSum < rowSum){
            maxSum = rowSum;
        }
        // 合計値が変わった or 同じだけどHPが違う場合はランクも変える。
        if (nowsum > rowSum || (nowsum == rowSum && nowHp > hp) ) {
            nowsum = rowSum;
            nowrank = Number(idx) + 1;
        }
        nowHp = hp;

        if (nowsum > mySum) {
            // 自分より大きい場合は自分のランクを落とす
            myTmpRank = nowrank + 1;
        }
        if (!myRowInsert && mySum > 0) {
            // 合計が高いか、合計が同じでHPが高い場合自分を差し込む
            if(mySum > rowSum || (mySum == rowSum && myHp >= nowHp) ){
                myRowInsert = true;
                myTmpRank = nowrank;
                addRankRow(nowrank, myUserData, MAX_HP, styleMax, mySum, true);
                nowrank++;
            }
        }

        // 表示行数を超えてない
        // 自分の行は入れない（すでに入れているので）
        // すでに入れている場合も入れない
        if (idx < OURSTYLE_LIMIT) {
                if (UID !== undefined && UID.substr(0,4) === userData['list'][idx]['UID'] && myRowInsert) {
            } else {
                addRankRow(nowrank, userData['list'][idx], MAX_HP, styleMax, rowSum, false);
            }
        }
    }
    // 最後まで自分が入らなかった場合は最後に入れる
    if (!myRowInsert && myDataFlg !== "NONE" && mySum > 0) {
        var sortList = [];
        for(let i in userData["RANK"]){
            sortList.push({"p":i, "s":userData["RANK"][i]});
        }
        sortList.sort((a, b) => {
            if (a.p < b.p){
                return -1
            }else{
                return -1
            }
        });
        var countRank = 1;
        var cntFlg = false;
        for(var sortRow of sortList){
            if(mySum >= sortRow["p"]){
                myTmpRank = countRank;
                cntFlg = true;
                break;
            } else {
                countRank += Number(sortRow["s"]);
            }
        }
        if(!cntFlg){
            myTmpRank = countRank;
        }
        addRankRow(myTmpRank, myUserData, MAX_HP, styleMax, mySum, true);
    }

    if (userData['kyogiList'] !== undefined) {
        $("#USER_RANK").before("<tr class='USER_RANK_DISP' style='background-color:red; color:white;'><td colspan=11>協議中</td></tr>");
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
        // 表示行数を超えてない
        //if (idx < 10) {
            if (myRow) {

                addRankRow(nowrank, userData['kyogiList'][idx], MAX_HP, styleMax, rowSum, true);
            } else {
                addRankRow(nowrank, userData['kyogiList'][idx], MAX_HP, styleMax, rowSum, false);
            }
        //}
    }

    // myDataFlg = KYOGI : 競技に入ってる
    // myDataFlg = NONE : 登録なし
    myTmpRank = (myTmpRank == 1 && maxSum > mySum) ? "計算中" : myTmpRank+"位";
    $(".rankingTweet").parent().removeClass("d-none");
    if (myDataFlg === "KYOGI") {
        dispRank = `暫定${myTmpRank}位`;
        myRank = `${myTmpRank}(${mySum}pt)<br>入力内容を再確認するか画像付きで報告お願い致します`;
    } else if(myDataFlg === "MATCH"){
        dispRank = myTmpRank;
        myRank = `${myTmpRank}(${mySum}pt)`;
    } else {
        $(".rankingTweet").parent().addClass("d-none");
        myRank = "登録がありません";
    }
    $("#MY_RANK").html(myRank);

    $("#charDotAruku").removeClass("char-utau").removeClass("char-aruku").removeClass("char-hashiri");
    if (Number(myTmpRank) === 1) {
        $("#charDotAruku").addClass("char-utau");
    } else if (Number(myTmpRank) <= 10) {
        $("#charDotAruku").addClass("char-hashiri");
    } else {
        $("#charDotAruku").addClass("char-aruku");
    }

    $("#charDot").html(`<span class="char dot_mid dot char-winner" style="background: url(./img/dot/${CHAR_MASTER[id]['DotId']}.png) no-repeat; margin: 0 10px;"></span>`);
    $("#charDotAruku").attr("style", `background: url(./img/dot/${CHAR_MASTER[id]['DotId']}.png) no-repeat; margin: 0 10px;`);

    let textBase = `${charName}でランキング${dispRank}!!${br}`;
    textBase += `HP/腕/体/器/速/知/精/愛/魅/合計${br}`;
    textBase += ('0' + myUserData['HP']).slice(-3) + "/";
    textBase += ('0' + myUserData['STR']).slice(-2) + "/";
    textBase += ('0' + myUserData['VIT']).slice(-2) + "/";
    textBase += ('0' + myUserData['DEX']).slice(-2) + "/";
    textBase += ('0' + myUserData['AGI']).slice(-2) + "/";
    textBase += ('0' + myUserData['INT']).slice(-2) + "/";
    textBase += ('0' + myUserData['MND']).slice(-2) + "/";
    textBase += ('0' + myUserData['AI']).slice(-2) + "/";
    textBase += ('0' + myUserData['MI']).slice(-2) + "/";
    textBase += ('0' + sum).slice(-3) + br;
    let hash = "ロマサガRS便利ツール,ロマサガRS育成ランキング";

    let textRanking = `育成ランキング [ロマサガRS便利ツール] ${br}` + textBase;
    let href1 = `https://twitter.com/intent/tweet?text=${textRanking}&url=https://nao-romasaga.github.io/ourchar.html?c=${id}&hashtags=${hash}`;
    $(".rankingTweet").attr("href", href1);

    let textImage = `@nao_romasaga_rs 育成ランキング 協議解除申請 ${br}` + textBase;
    let href2 = `https://twitter.com/intent/tweet?text=${textImage}&url=https://nao-romasaga.github.io/ourchar.html?c=${id}&hashtags=${hash}`;
    $(".kaijoTweet").attr("href", href2);

    //firebase.database().goOffline();
    //firebase.database(appUsers).goOffline();

}
function addRankRow(nowrank, data, MAX_HP, styleMax, sum, myFlg) {

    let sizeClass = (nowrank === "協議中") ? "small" : "";
    let tr = $("<tr>").addClass(`text-center USER_RANK_DISP ${sizeClass}`);
    if (myFlg) {
        tr.addClass("bg-white");
    }
    tr.append(`<td class='paramCell2'>${nowrank} </td>`)
    let hp = (data["HP"] === undefined) ? "-" : data["HP"];
    if (MAX_HP === hp && nowrank !== "協議中") {
        hp = `<i class="fas fa-crown small">${hp}</i>`;
    }
    var hpStyle = "";
    if(hp > 999){
        //hpStyle = "  background-color:red; color:white;";
        //hp += '<i class="fas fa-question"></i>';
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
        tr.append(`<td class='paramCell2' style='${style}'>${myVal}</td>`)
    }
    if (Number($(".STYLE_MAX").text()) > sum) {
        tr.append(`<td class='paramCell2 small'>${sum}</td>`)
    } else if (Number($(".STYLE_MAX").text()) == sum) {
        tr.append(`<td class='paramCell2' style='background-color:lightgreen;'>${sum}</td>`)
    } else if (Number($(".STYLE_MAX").text() + totalThreathold) < sum ) {
        tr.append(`<td class='paramCell2' style='background-color:red; color:white;'>${sum}</td>`)
    } else {
        tr.append(`<td class='paramCell2' style='background-color:yellow;'>${sum}</td>`)
    }
    $("#USER_RANK").before(tr);
}



function changeId2Dot() {
    $("#example-table").find(".tabulator-cell").each(function () {
        let id = $(this).text();
        if (id.indexOf("Dot") > -1) {
            let src = `<img src="./img/dot/${id.substr(3)}.png" style="object-position: -10px -10px">`;
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
            {title: "登録数", field: "size", responsive: 12},
        ],
    });

    table.setFilter("MAXSUM", ">", 0);
    changeId2Dot();
}