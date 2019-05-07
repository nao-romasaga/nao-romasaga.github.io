let charFlg = false, styleFlg = false;
let allCount = {"SS": 0, "S": 0, "A": 0};
for (let key in WEPON_ATTR) {
    allCount[key] = 0;
}
let myCount = {"SS": 0, "S": 0, "A": 0};
var sslist = [];
var slist = [];
var alist = [];
var weponType = Object.assign({}, WEPON_ATTR);
for (let key in weponType) {
    weponType[key] = [];
}

$(document).ready(function ($) {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            var uiConfig = {
                // ログイン完了時のリダイレクト先
                signInSuccessUrl: 'https://nao-romasaga.github.io/stylecheck.html',
                // 利用する認証機能
                signInOptions: [
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID
                ],
            };
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        } else {
            $("#loginInfo").hide();
            let icon = $("<img>").attr("src", user.photoURL)
                    .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
            let name = `${user.displayName} さん:ログイン中`;
            $("#firebaseui-auth-container").addClass("bg-white kadomaru")
                    .append(icon).append(name);
        }
    });
    readFile('Char', function (result) {
        CHAR_MASTER = result;
        charFlg = true;
        if (charFlg && styleFlg) {
            display();
        }
    });
    readFile('Style', function (result) {
        STYLE_MASTER = result;
        styleFlg = true;
        if (charFlg && styleFlg) {
            display();
        }
    });
});


$(document).on('click', '.onlyDisable', function () {
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': "OnlyDisable", 'value': 1});
    $(".style").each(function () {
        if(!$(this).parent().hasClass("nocheck")){
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

$(document).on('click', '.style', function () {
    let on = $(this).parent().hasClass("nocheck");
    let rare = $(this).attr('data-rare');
    let styleId = $(this).attr('data-id');
    styleClick(styleId, rare, on);
    updateData("STYLECHECK", {"SS": sslist, "S": slist, "A": alist});
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
    updateData("STYLECHECK", {"SS": sslist, "S": slist, "A": alist});
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
    updateData("STYLECHECK", {"SS": sslist, "S": slist, "A": alist});
});


$(document).on('click', '#tabRare', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Rarity", 'value': 1});
    $("#tabRare").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#tabChar").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabGacha").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#styleAreaRare").removeClass("d-none");
    $("#styleAreaChar").parent().addClass("d-none");
    $("#styleAreaGacha").parent().addClass("d-none");
});
$(document).on('click', '#tabChar', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Char", 'value': 1});
    $("#tabChar").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#tabRare").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabGacha").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#styleAreaRare").addClass("d-none");
    $("#styleAreaChar").parent().removeClass("d-none");
    $("#styleAreaGacha").parent().addClass("d-none");
});

$(document).on('click', '#tabGacha', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Gacha", 'value': 1});
    $("#tabChar").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabRare").addClass("style-tab-disabled").removeClass("style-tab-active");
    $("#tabGacha").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#styleAreaRare").addClass("d-none");
    $("#styleAreaChar").parent().addClass("d-none");
    $("#styleAreaGacha").parent().removeClass("d-none");
});

$(document).on('click', '#displaySummary', function () {
    let all = allCount["SS"] + allCount["S"] + allCount["A"];
    let myAll = (sslist.length + slist.length + alist.length);
    let br = "%0D%0A";
    let text = `スタイル所持チェッカー [ロマサガRS便利ツール] ${br}`;
    text += `全 ${myAll}体/${all}体 (${$(".allPer").first().text()}％）${br}`;
    text += `SS ${sslist.length}体/${allCount["SS"]}体 (${$(".SSPer").first().text()}％）${br}`;
    text += `S ${slist.length}体/${allCount["S"]}体 (${$(".SPer").first().text()}％）${br}`;
    text += `A ${alist.length}体/${allCount["A"]}体 (${$(".APer").first().text()}％）${br}`;
    let href = `https://twitter.com/intent/tweet?text=${text}&url=https://nao-romasaga.github.io/stylecheck.html&hashtags=ロマサガRS便利ツール,スタイル所持チェッカー`;
    $(".twitter-share-button").attr("href", href);
    //$("#allParamConfirm").html("test");
    $("#modal01").fadeIn();
    $("#modalInner").css("animation", "modal 0.5s forwards");
    return false;
});

$(document).on('click', '.modalClose', function () {
    if ($(this).attr("data-id") === "ok") {
        let id = $(this).attr("data-charId");
        let input = splitParam($(this).attr("data-input"), 0);
        for (let i in input) {
            $(".charInput" + PARAM_KEY[i] + id).each(function (idx, el) {
                $(el).val(input[i]);
            });
        }
        updateDB(); // spanに入れる
    }
    $("#modal01").fadeOut();
    $("#modalInner").css("animation", "modalClose 0.5s forwards");
    return false;
});

let MASTER_LEVEL = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, 19,
    22, 25, 28, 31, 35, 39, 43, 48, 53, 58,
    64, 70, 76, 83, 90, 98, 106, 115, 124, 134,
    144];
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
        if (weponType[wepon].indexOf(styleId) === -1) {
            weponType[wepon].push(styleId);
        }
    } else {
        if (weponType[wepon].indexOf(styleId) > -1) {
            weponType[wepon] = weponType[wepon].filter(n => n !== styleId);
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
    let all2 = allCount["SS"] + allCount["S"] + allCount["A"];
    $(".allPer").text(calcPer(all / all2).toFixed(2));
    $(".SSPer").text(calcPer(sslist.length / allCount["SS"]).toFixed(2));
    $(".SPer").text(calcPer(slist.length / allCount["S"]).toFixed(2));
    $(".APer").text(calcPer(alist.length / allCount["A"]).toFixed(2));
    for (let key in WEPON_ATTR) {
        let wpSize = Number(weponType[key].length);
        $(".my" + key).text(wpSize);
        let nowLv = getMasterLevel(wpSize);
        $(".myMlv" + key).text(nowLv);
        let next = MASTER_LEVEL[nowLv] - (wpSize * 5);
        let need = (next > 5) ? Math.floor(next / 5) + 1 : 1;
        $(".myNext" + key).text(need);
        $(".myPer" + key).text(calcPer(wpSize / allCount[key]).toFixed(2));
        //console.log(key, "now",wpSize, (wpSize*5),"pt", "nowLv:", nowLv, "next", next, "need",need);
    }
    //console.log(on, rare, styleId, all, all2, target);
}

function display() {
    let gacha = [];
    for (let charId in CHAR_MASTER) {
        let charInfo = CHAR_MASTER[charId];
        $("#styleAreaChar").append(charInfo['Name'] + "<br>");
        for (let styleId of charInfo['Holders']) {
            let styleInfo = STYLE_MASTER[styleId];
            //console.log(styleInfo);
            let rare = styleInfo['Rarity'];
            let wepon = STYLE_MASTER[styleId]['WeaponType'];
            allCount[rare]++;
            allCount[wepon]++;
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
            if (gacha[styleInfo['gacha']] === undefined) {
                gacha[styleInfo['gacha']] = {"SS":[], "S":[], "A":[]};
            }
            gacha[styleInfo['gacha']][rare].push(background.clone());
        }
        $("#styleAreaChar").append("<br>");
    }
    for (let name in gacha) {
        let d = (name === "") ? "汎用" : name;
        $("#styleAreaGacha").append(d + "<br>");
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
    $(".all").text(allCount["SS"] + allCount["S"] + allCount["A"]);
    $(".allSS").text(allCount["SS"]);
    $(".allS").text(allCount["S"]);
    $(".allA").text(allCount["A"]);
    for (let key in WEPON_ATTR) {
        $(".all" + key).text(allCount[key]);
    }
    readStyleCheckData(function (result) {
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
    });
}
