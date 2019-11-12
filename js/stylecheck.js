function initialMasterTable(){
    //初期処理
    for(var nameJp in MASTER_LV_KEY) {
        var nameEn = MASTER_LV_KEY[nameJp];
        console.log(nameJp, nameEn);

        var masterTableTmpl = $("#masterTableTmpl").clone();
        masterTableTmpl.attr("id","").removeClass("d-none");
        masterTableTmpl.find(".icon_ken").removeClass("icon_ken").addClass("icon_"+nameEn);
        masterTableTmpl.find(".my剣").removeClass("my剣").addClass("my"+nameJp);
        masterTableTmpl.find(".mySS剣").removeClass("mySS剣").addClass("mySS"+nameJp);
        masterTableTmpl.find(".myS剣").removeClass("myS剣").addClass("myS"+nameJp);
        masterTableTmpl.find(".myA剣").removeClass("myA剣").addClass("myA"+nameJp);
        masterTableTmpl.find(".all剣").removeClass("all剣").addClass("all"+nameJp);
        masterTableTmpl.find(".allSS剣").removeClass("allSS剣").addClass("allSS"+nameJp);
        masterTableTmpl.find(".allS剣").removeClass("allS剣").addClass("allS"+nameJp);
        masterTableTmpl.find(".allA剣").removeClass("allA剣").addClass("allA"+nameJp);
        masterTableTmpl.find(".myPer剣").removeClass("myPer剣").addClass("myPer"+nameJp);
        masterTableTmpl.find(".myMlv剣").removeClass("myMlv剣").addClass("myMlv"+nameJp);
        masterTableTmpl.find(".myNext剣").removeClass("myNext剣").addClass("myNext"+nameJp);
        $("#MASTER_TABLE tbody").append(masterTableTmpl);
    }
}

var allCount = {"ALL":[], "SS": [], "S": [], "A": []};
for (let key in WEPON_ATTR) {
    allCount['ALL'][key] = 0;
    allCount['SS'][key] = 0;
    allCount['S'][key] = 0;
    allCount['A'][key] = 0;
}
allCount['ALL']['ALL'] = 0;
allCount['SS']['ALL'] = 0;
allCount['S']['ALL'] = 0;
allCount['A']['ALL'] = 0;

let myCount = {"SS": 0, "S": 0, "A": 0};
var sslist = [];
var slist = [];
var alist = [];
var listDtl = {"プラチナ":{"SS": 0, "S": 0, "A": 0}, "限定":{"SS": 0, "S": 0, "A": 0}, "その他":{"SS": 0, "S": 0, "A": 0}};
var listDtlAll = {"プラチナ":{"SS": 0, "S": 0, "A": 0}, "限定":{"SS": 0, "S": 0, "A": 0}, "その他":{"SS": 0, "S": 0, "A": 0}};

var weponType = {"ALL":[], "SS": [], "S": [], "A": []};
for (let key in WEPON_ATTR) {
    weponType['ALL'][key] = [];
    weponType['SS'][key] = [];
    weponType['S'][key] = [];
    weponType['A'][key] = [];
}

function _noLoginInitial() {
    var uiConfig = {
        // ログイン完了時のリダイレクト先
        signInSuccessUrl: 'https://nao-romasaga.github.io/stylecheck.html',
        // 利用する認証機能
        signInOptions: [
            firebase.auth.TwitterAuthProvider.PROVIDER_ID
        ],
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth(appUsers));
    ui.start('#firebaseui-auth-container', uiConfig);
}
function _initial() {
    $("#loginInfo").hide();
    let icon = $("<img>").attr("src", USER.photoURL)
            .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
    let name = `${USER.displayName} さん:ログイン中`;
    $("#firebaseui-auth-container").addClass("bg-white kadomaru")
            .append(icon).append(name);
    intialMyStyle();
}

var targetId;
$(document).ready(function ($) {
    initialMasterTable();
    display();
    if (location.search !== "") {
        targetId = (location.search).substr(1);
        $(".allOn , .allOff , .twitter-share-button").hide();
        $(".myinput").removeClass("d-none");
    }
});

$(document).on('click', '.onlyDisable', function () {
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': "OnlyDisable", 'value': 1});
    $(".style").each(function () {
        if (!$(this).parent().hasClass("nocheck")) {
            $(this).parent().addClass("d-none");
        }
    });
});
$(document).on('click', '.allType', function () {
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': "ALL", 'value': 1});
    $(".style").each(function () {
        $(this).parent().removeClass("d-none");
    });
});

$(document).on('click', '.filterButton', function () {
    let type = $(this).attr('data-id');
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': type, 'value': 1});
    $(".style").each(function () {
        $(this).parent().addClass("d-none");
        if ($(this).attr("data-type") === type) {
            $(this).parent().removeClass("d-none");
        }
    });
});
function updateMyStyle() {
    if (UID !== undefined && targetId === undefined) {
        updateData("STYLECHECK", {"SS": sslist, "S": slist, "A": alist}, true);
    }
}
$(document).on('click', '.style', function () {
    if (targetId !== undefined) {
        return;
    }
    let on = $(this).parent().hasClass("nocheck");
    let rare = $(this).attr('data-rare');
    let styleId = $(this).attr('data-id');
    styleClick(styleId, rare, on);
    updateMyStyle();
});
$(document).on('click', '.allOn', function () {
    let r = $(this).attr("data-rare");
    $(".style").each(function () {
        if ($(this).attr("data-rare") === r && !$(this).hasClass("d-none")) {
            let rare = $(this).attr('data-rare');
            let styleId = $(this).attr('data-id');
            styleClick(styleId, rare, true);
        }
    });
    updateMyStyle();
});
$(document).on('click', '.allOff', function () {
    let r = $(this).attr("data-rare");
    $(".style").each(function () {
        if ($(this).attr("data-rare") === r && !$(this).hasClass("d-none")) {
            let rare = $(this).attr('data-rare');
            let styleId = $(this).attr('data-id');
            styleClick(styleId, rare, false);
        }
    });
    updateMyStyle();
});


$(document).on('click', '#tabRare', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Rarity", 'value': 1});
    $("#tabRare").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#tabChar").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabGacha").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#styleAreaRare").removeClass("d-none");
    $("#styleAreaChar").parent().addClass("d-none");
    $("#styleAreaGacha").parent().addClass("d-none");
    $("#tabRare").attr("style", "width:33%")
    $("#tabChar").attr("style", "width:30%")
    $("#tabGacha").attr("style", "width:30%")
});
$(document).on('click', '#tabChar', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Char", 'value': 1});
    $("#tabChar").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#tabRare").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabGacha").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#styleAreaRare").addClass("d-none");
    $("#styleAreaChar").parent().removeClass("d-none");
    $("#styleAreaGacha").parent().addClass("d-none");
    $("#tabRare").attr("style", "width:30%")
    $("#tabChar").attr("style", "width:33%")
    $("#tabGacha").attr("style", "width:30%")
});

$(document).on('click', '#tabGacha', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Gacha", 'value': 1});
    $("#tabChar").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabRare").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabGacha").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#styleAreaRare").addClass("d-none");
    $("#styleAreaChar").parent().addClass("d-none");
    $("#styleAreaGacha").parent().removeClass("d-none");
    $("#tabRare").attr("style", "width:30%")
    $("#tabChar").attr("style", "width:30%")
    $("#tabGacha").attr("style", "width:33%")
});

$(document).on('click', '#displaySummary', function () {
    let all = allCount["ALL"]["ALL"];
    let myAll = (sslist.length + slist.length + alist.length);

    let br = "%0D%0A";
    let text = `スタイル所持チェッカー [ロマサガRS便利ツール] ${br}`;
    text += `全 ${myAll}体/${all}体 (${$(".allPer").first().text()}％）${br}`;
    text += `SS ${sslist.length}体/${allCount["SS"]["ALL"]}体 (${$(".SSPer").first().text()}％）${br}`;
    text += `S ${slist.length}体/${allCount["S"]["ALL"]}体 (${$(".SPer").first().text()}％）${br}`;
    text += `A ${alist.length}体/${allCount["A"]["ALL"]}体 (${$(".APer").first().text()}％）${br}`;
    let param = (UID !== undefined) ? "?" + UID : "";
    let href = `https://twitter.com/intent/tweet?text=${text}&url=https://nao-romasaga.github.io/stylecheck.html${param}&hashtags=ロマサガRS便利ツール,スタイル所持チェッカー`;
    $(".twitter-share-button").attr("href", href);
    //$("#allParamConfirm").html("test");

    // 初期化
    listDtl = {"プラチナ":{"SS": 0, "S": 0, "A": 0}, "限定":{"SS": 0, "S": 0, "A": 0}, "その他":{"SS": 0, "S": 0, "A": 0}};
    for(styleId of sslist.concat(slist).concat(alist)){
        bunrui = STYLE_MASTER[styleId]['gachaBunrui'];
        rare = STYLE_MASTER[styleId]['Rarity'];
        listDtl[bunrui][rare]++;
    }
    $(".mypAll").text(listDtl["プラチナ"]["SS"] + listDtl["プラチナ"]["S"] + listDtl["プラチナ"]["A"]);
    $(".mylimAll").text(listDtl["限定"]["SS"] + listDtl["限定"]["S"] + listDtl["限定"]["A"]);
    $(".myoAll").text(listDtl["その他"]["SS"] + listDtl["その他"]["S"] + listDtl["その他"]["A"]);
    $(".mypSS").text(listDtl["プラチナ"]["SS"]);
    $(".mypS").text(listDtl["プラチナ"]["S"]);
    $(".mypA").text(listDtl["プラチナ"]["A"]);
    $(".mylimSS").text(listDtl["限定"]["SS"]);
    $(".mylimS").text(listDtl["限定"]["S"]);
    $(".mylimA").text(listDtl["限定"]["A"]);
    $(".myoSS").text(listDtl["その他"]["SS"]);
    $(".myoS").text(listDtl["その他"]["S"]);
    $(".myoA").text(listDtl["その他"]["A"]);
    
    $("#modal01").fadeIn();
    $("#modalInner").css("animation", "modal 0.5s forwards");
    return false;
});

$(document).on('click', '.modalClose', function () {
    $("#modal01").fadeOut();
    $("#modalInner").css("animation", "modalClose 0.5s forwards");
    return false;
});

let MASTER_LEVEL = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, 19,
    22, 25, 28, 31, 35, 39, 43, 48, 53, 58,
    64, 70, 76, 83, 90, 98, 106, 115, 124, 134,
    144, 155, 167, 179, 192, 206, 220, 235, 251, 267,
    284,302,321,341,361,382,404,427,451,476
];    

function getMasterLevel(styleNum) {
    let point = Number(styleNum) * 5;
    let nowLv = 1;
    for (let lv in MASTER_LEVEL) {
        let total = MASTER_LEVEL[lv];
        if (point < total) {
            break;
        }
        nowLv = lv;
    }
    return Number(nowLv) + 1;
}
function calcPer(i) {
    return Math.round(i * 10000) / 100;
}
function styleClick(styleId, rare, on) {
    let wepon = STYLE_MASTER[styleId]['WeaponType'];
    let target = alist;
    if (rare === "SS") {
        target = sslist;
    } else if (rare === "S") {
        target = slist;
    }
    $("." + styleId).each(function () {
        if (on) {
            $(this).parent().removeClass("nocheck");
        } else {
            $(this).parent().addClass("nocheck");
        }
    });

    if (on) {
        if (target.indexOf(styleId) === -1) {
            target.push(styleId);
        }
        if (weponType['ALL'][wepon].indexOf(styleId) === -1) {
            weponType['ALL'][wepon].push(styleId);
        }
        if (weponType[rare][wepon].indexOf(styleId) === -1) {
            weponType[rare][wepon].push(styleId);
        }
    } else {
        if (weponType['ALL'][wepon].indexOf(styleId) > -1) {
            weponType['ALL'][wepon] = weponType['ALL'][wepon].filter(n => n !== styleId);
        }
        if (weponType[rare][wepon].indexOf(styleId) > -1) {
            weponType[rare][wepon] = weponType[rare][wepon].filter(n => n !== styleId);
        }
        if (rare === "SS") {
            sslist = target.filter(n => n !== styleId);
        } else if (rare === "S") {
            slist = target.filter(n => n !== styleId);
        } else {
            alist = target.filter(n => n !== styleId);
        }
    }
    $(".myAll").text(sslist.length + slist.length + alist.length);
    $(".mySS").text(sslist.length);
    $(".myS").text(slist.length);
    $(".myA").text(alist.length);

    let all = sslist.length + slist.length + alist.length;
    let all2 = allCount["ALL"]["ALL"];
    $(".allPer").text(calcPer(all / all2).toFixed(2));
    $(".SSPer").text(calcPer(sslist.length / allCount["SS"]["ALL"]).toFixed(2));
    $(".SPer").text(calcPer(slist.length / allCount["S"]["ALL"]).toFixed(2));
    $(".APer").text(calcPer(alist.length / allCount["A"]["ALL"]).toFixed(2));
    for (let key in WEPON_ATTR) {
        let wpSize = Number(weponType['ALL'][key].length);
        $(".my" + key).text(wpSize);
        $(".mySS" + key).text(Number(weponType['SS'][key].length));
        $(".myS" + key).text(Number(weponType['S'][key].length));
        $(".myA" + key).text(Number(weponType['A'][key].length));
        let nowLv = getMasterLevel(wpSize);
        let maxLv = getMasterLevel(allCount["ALL"][key]);
        $(".myMlv" + key).text(nowLv+"/"+maxLv);
        let next = MASTER_LEVEL[nowLv] - (wpSize * 5);
        let need = (next > 5) ? Math.floor(next / 5) + 1 : 1;
        $(".myNext" + key).text(need);
        $(".myPer" + key).text(calcPer(wpSize / allCount["ALL"][key]).toFixed(2));
        //console.log(key, "now",wpSize, (wpSize*5),"pt", "nowLv:", nowLv, "next", next, "need",need);
    }
    //console.log(on, rare, styleId, all, all2, target);
}

function display() {
    let gacha = [];
    let gachaNameList = [];
    for (let charId in CHAR_MASTER) {
        let charInfo = CHAR_MASTER[charId];
        $("#styleAreaChar").append(charInfo['Name'] + "<br>");
        for (let styleId of charInfo['Holders']) {
            let styleInfo = STYLE_MASTER[styleId];
            //console.log(styleInfo);
            let rare = styleInfo['Rarity'];
            var gachaNameOrg = (styleInfo['gacha'] === "") ? "プラチナガチャ限定" : styleInfo['gacha'];
            var gachaNames = gachaNameOrg.split("/");
            if(gachaNameOrg.indexOf("プラチナガチャ限定") > -1 || gachaNameOrg.indexOf("汎用") > -1) {
                bunrui = "プラチナ"
            } else if(gachaNameOrg.indexOf("配布") > -1 || gachaNameOrg.indexOf("クエストドロップ") > -1 
            || gachaNameOrg.indexOf("常設イベント") > -1 || gachaNameOrg.indexOf("ストーリー") > -1 ) {
                bunrui = "その他";
            } else {
                bunrui = "限定"
            }
            //console.log(gachaNameOrg, bunrui, rare, gachaNameOrg.indexOf("配布"));
            STYLE_MASTER[styleId]['gachaBunrui'] = bunrui;
            listDtlAll[bunrui][rare]++;
    
            let wepon = STYLE_MASTER[styleId]['WeaponType'];
            allCount[rare][wepon]++;
            allCount[rare]["ALL"]++;
            allCount["ALL"][wepon]++;
            allCount["ALL"]["ALL"]++;
            // スタイルアイコンの追加
            let icon = $("<button>").addClass("style")
                    .addClass(getStyleIconClass(rare))
                    .addClass(styleId)
                    .attr("style", getImgUrl('style_icon/' + styleId + ".png"))
                    .attr("data-id", styleId)
                    .attr("data-rare", rare)
                    .attr("data-type", styleInfo['WeaponType']);
            let background = $("<span>")
                    .addClass(getStyleIconBgClass(rare))
                    .addClass("nocheck")
                    .append(icon);
            $("#styleAreaChar").append(background.clone());
            $("#" + rare + "Area").append(background.clone());
            for(gachaName of gachaNames) {
                if (gacha[gachaName] === undefined) {
                    gacha[gachaName] = {"SS": [], "S": [], "A": []};
                    gachaNameList.push(gachaName);
                }
                gacha[gachaName][rare].push(background.clone());
            }
        }
        $("#styleAreaChar").append("<br>");
    }
    gachaNameList.sort(function(a,b){
        return (a < b ? 1 : -1);
    });
    var kotei = ["プラチナガチャ限定","螺旋回廊ガチャ限定","クエストドロップ","常設イベント","ストーリー","汎用","キャンペーン配布","初期配布","七英雄襲来イベント配布",]
    for(var name of kotei){
        var idx = gachaNameList.indexOf(name);
        delete gachaNameList[idx];
    }
    gachaNameList = gachaNameList.filter(v => v);
    Array.prototype.splice.apply(gachaNameList,[3,0].concat(kotei));
    for (let name of gachaNameList) {
        $("#styleAreaGacha").append(name + "<br>");
        //console.log(name,gacha[name]);
        gacha[name]["SS"] = (gacha[name]["SS"] === undefined) ? [] : gacha[name]["SS"];
        gacha[name]["S"] = (gacha[name]["S"] === undefined) ? [] : gacha[name]["S"];
        gacha[name]["A"] = (gacha[name]["A"] === undefined) ? [] : gacha[name]["A"];
        for (let background of gacha[name]["SS"]) {
            $("#styleAreaGacha").append(background);
        }
        for (let background of gacha[name]["S"]) {
            $("#styleAreaGacha").append(background);
        }
        for (let background of gacha[name]["A"]) {
            $("#styleAreaGacha").append(background);
        }
        $("#styleAreaGacha").append("<br>");
    }
    $(".all").text(allCount["ALL"]["ALL"]);
    $(".allSS").text(allCount["SS"]["ALL"]);
    $(".allS").text(allCount["S"]["ALL"]);
    $(".allA").text(allCount["A"]["ALL"]);
    $(".pAll").text(listDtlAll["プラチナ"]["SS"] + listDtlAll["プラチナ"]["S"] + listDtlAll["プラチナ"]["A"]);
    $(".pAllSS").text(listDtlAll["プラチナ"]["SS"]);
    $(".pAllS").text(listDtlAll["プラチナ"]["S"]);
    $(".pAllA").text(listDtlAll["プラチナ"]["A"]);
    $(".limAll").text(listDtlAll["限定"]["SS"] + listDtlAll["限定"]["S"] + listDtlAll["限定"]["A"]);
    $(".limAllSS").text(listDtlAll["限定"]["SS"]);
    $(".limAllS").text(listDtlAll["限定"]["S"]);
    $(".limAllA").text(listDtlAll["限定"]["A"]);
    $(".oAll").text(listDtlAll["その他"]["SS"] + listDtlAll["その他"]["S"] + listDtlAll["その他"]["A"]);
    $(".oAllSS").text(listDtlAll["その他"]["SS"]);
    $(".oAllS").text(listDtlAll["その他"]["S"]);
    $(".oAllA").text(listDtlAll["その他"]["A"]);

    for (let key in WEPON_ATTR) {
        $(".all" + key).text(allCount["ALL"][key]);
        $(".allSS" + key).text(allCount["SS"][key]);
        $(".allS" + key).text(allCount["S"][key]);
        $(".allA" + key).text(allCount["A"][key]);
    }
}
function intialMyStyle(){
    let i = (targetId !== undefined) ? targetId : UID;
    //console.log("readStyleCheckData start");
    readStyleCheckData(i, function (result) {
        //console.log("readStyleCheckData end", result);
        if (result !== null) {
            sslist = (result['SS'] !== undefined) ? result['SS'] : [];
            slist = (result['S'] !== undefined) ? result['S'] : [];
            alist = (result['A'] !== undefined) ? result['A'] : [];
            for (let styleId of sslist) {
                styleClick(styleId, "SS", true);
            }
            for (let styleId of slist) {
                styleClick(styleId, "S", true);
            }
            for (let styleId of alist) {
                styleClick(styleId, "A", true);
            }
        }
    }, true);    
}