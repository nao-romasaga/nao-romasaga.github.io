function initialMasterTable(){
    //初期処理
    for(var nameJp in MASTER_LV_KEY) {
        var nameEn = MASTER_LV_KEY[nameJp];
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
        //masterTableTmpl.find(".myNext剣").removeClass("myNext剣").addClass("myNext"+nameJp);
        $("#MASTER_TABLE tbody").append(masterTableTmpl);
    }
    for(let attr of Object.keys(MASTER_LV_KEY)){
        $attrDiv = $(`
        <div class="col-12 col-sm-1">
            <div class="filter-bgcolor width-100 text-center" style="height: 100%; display: flex; align-items: center; justify-content: center;"><img class="width-100" src="https://romasagatool.com/img/icon/icon_${MASTER_LV_KEY[attr]}.png" style="max-width: 40px"></div>
        </div>
        <div class="col-12 col-sm-11">
            <div class="ICON_PARENT pra${MASTER_LV_KEY[attr]}">
                <div class="subtitle-long fuchidori-white smallFont" style="padding-left: 30px; padding-right: 40px;">プラチナ / 恒常 </div><br>
            </div>
            <div class="ICON_PARENT lim${MASTER_LV_KEY[attr]}">
                <div class="subtitle-long fuchidori-white smallFont" style="padding-left: 30px; padding-right: 40px;">限定ガチャ / 限定配布</div><br>
            </div>
        </div>`);
        $("#SSArea").append($attrDiv.clone());
        $("#SArea").append($attrDiv.clone());
        $("#AArea").append($attrDiv.clone());
    }
}

var allCount = {"ALL":[], "SS": [], "S": [], "A": []};
for (let key in WEAPON_ATTR) {
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

var weaponType = {"ALL":[], "SS": [], "S": [], "A": []};
for (let key in WEAPON_ATTR) {
    weaponType['ALL'][key] = [];
    weaponType['SS'][key] = [];
    weaponType['S'][key] = [];
    weaponType['A'][key] = [];
}
$(".DISP_CLASS").hide();
function _noLoginInitial() {
    $("#displaySummary").removeClass("d-none");
    $("#displaySimulator").removeClass("d-none");

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
    $(".DISP_CLASS").show();
    dispClassData("");
}
function _initial() {
    $("#loginInfo").hide();
    loginCard("#firebaseui-auth-container");
    intialMyStyle();
}

var targetId;
$(document).ready(function ($) {
    $(".INIT-CLOSE").slideUp();
    $(".DISP_CLASS").hide();
    $("#styleAreaClass").hide();
    initialMasterTable();
    display();
    if (location.search !== "") {
        targetId = (location.search).substr(1);
        $(".allOn , .allOff , .twitter-share-button").hide();
        $(".myinput").removeClass("d-none");
    }
});

$(document).on('click', '.OPEN-HELP', function () {
    var target = $(this).attr("data-target");
    $("#"+target).slideToggle();
});

function dispClassData(result){
    var ATTR = ["zan","da","totsu",'netsu','rei','rai','yo','in'];
    for(var x of ATTR) {
        var tmpl = $("#CLASS_TEMPLATE").clone().attr("id", 'class'+x).removeClass("d-none");
        tmpl.find(".ICON").addClass("icon_"+x);
        $("#CLASS_TEMPLATE").before(tmpl);
    }
    for(var x of PARAM_KEY) {
        if(x == "AI" || x == "MI"){
            continue;
        }
        var tmpl = $("#JHOTAI_DEBUF_TEMPLATE").clone().attr("id", 'class'+x).removeClass("d-none");
        tmpl.find(".ICON").addClass("icon_debuff_"+x.toLowerCase());
        tmpl.find(".icon_area").addClass("d");
        $("#DEBUF_PARENT").append(tmpl);
    }
    var ATTR2 = ["stan","mahi",  "zzz","sekika", "konran","miryo", "kizetsu", ];
    for(var x of ATTR2) {
        var tmpl = $("#JHOTAI_DEBUF_TEMPLATE").clone().attr("id", 'class'+x).removeClass("d-none");
        tmpl.find(".ICON").addClass("icon_"+x);
        tmpl.find(".icon_area").addClass("j");
        $("#JHOTAI_PARENT").append(tmpl);
    }

    var styleList = [];
    if (result["SS"] !== undefined) {
        var ss = (result["SS"] !== undefined) ? result["SS"] : [];
        var s = (result["S"] !== undefined) ? result["S"] : [];
        var a = (result["A"] !== undefined) ? result["A"] : [];
        styleList = ss.concat(s).concat(a);
    } else {
        for(styleId in STYLE_MASTER){
            //if(STYLE_MASTER[styleId]['Rarity'] == "SS"){
                styleList.push(styleId);
            //}
        }
    }

    for(styleId of styleList){
        if(STYLE_CLASS[styleId] === undefined){
            continue;
        }
        // "単体火力" => "o",
        // "全体火力" => "a",
        // "クエスト攻略" => "q",
        // "Romancing戦" => "r",
        // "デバフ" => "d",
        // "状態異常" => "j",
        // "ファスト" => "f",        
        for(var pattern of ["o","a","q","r","d","j"]){
            if(STYLE_CLASS[styleId][pattern] == undefined){
                continue;
            }
            var styleInfo = STYLE_MASTER[styleId];
            var styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, styleInfo['WeaponType'], true , true);
            var attrs = STYLE_CLASS[styleId][pattern];
            for(attr of attrs){
                $("#class"+attr).find("."+pattern).append(styleIcon.clone());
            }
        }
    }

}

$(document).on('click', '.onlyDisable', function () {
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': "OnlyDisable", 'value': 1});
    $(".allType").removeClass("icon_btn_on").addClass("icon_btn_off");
    $(".onlyDisable").removeClass("icon_btn_off").addClass("icon_btn_on");
    $(".simpleDisplay").removeClass("icon_btn_on").addClass("icon_btn_off");
    $(".style").each(function () {
        if (!$(this).find(".CHECK_COVER").hasClass("icon_nocheck")) {
            $(this).addClass("d-none NONE");
        }
    });
    parentCheck();
    $("#SSArea").slideDown();
    $("#SArea").slideDown();
    $("#AArea").slideDown();
    $("#OnlySSArea").slideUp();
    $("#OnlySArea").slideUp();
    $("#OnlyAArea").slideUp();
});
$(document).on('click', '.allType', function () {
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': "ALL", 'value': 1});
    $(".onlyDisable").removeClass("icon_btn_on").addClass("icon_btn_off");
    $(".allType").removeClass("icon_btn_off").addClass("icon_btn_on");
    $(".simpleDisplay").removeClass("icon_btn_on").addClass("icon_btn_off");

    $(".style").each(function () {
        $(this).removeClass("d-none NONE");
    });
    parentCheck();
    $("#SSArea").slideDown();
    $("#SArea").slideDown();
    $("#AArea").slideDown();
    $("#OnlySSArea").slideUp();
    $("#OnlySArea").slideUp();
    $("#OnlyAArea").slideUp();    
});

function changeSimpleDisplayToAllDisplay(){
    $(".onlyDisable").removeClass("icon_btn_on").addClass("icon_btn_off");
    $(".allType").removeClass("icon_btn_off").addClass("icon_btn_on");
    $(".simpleDisplay").removeClass("icon_btn_on").addClass("icon_btn_off");

    $(".style").each(function () {
        $(this).removeClass("d-none NONE");
    });
}

$(document).on('click', '.simpleDisplay', function () {
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': "SIMPLE_DISP", 'value': 1});
    clickRareTab();
    $(".onlyDisable").removeClass("icon_btn_on").addClass("icon_btn_off");
    $(".allType").removeClass("icon_btn_on").addClass("icon_btn_off");
    $(".simpleDisplay").removeClass("icon_btn_off").addClass("icon_btn_on");
    $("#OnlySSArea").html("");
    $("#OnlySArea").html("");
    $("#OnlyAArea").html("");

    $("#SSArea .style").each(function () {
        if ($(this).find(".CHECK_COVER").hasClass("icon_nocheck")) {
            rare = $(this).attr('data-rare');
            $(`#Only${rare}Area`).append($(this).clone());
        }
    });
    $("#SArea .style").each(function () {
        if ($(this).find(".CHECK_COVER").hasClass("icon_nocheck")) {
            rare = $(this).attr('data-rare');
            $(`#Only${rare}Area`).append($(this).clone());
        }
    });
    $("#AArea .style").each(function () {
        if ($(this).find(".CHECK_COVER").hasClass("icon_nocheck")) {
            rare = $(this).attr('data-rare');
            $(`#Only${rare}Area`).append($(this).clone());
        }
    });

    $("#SSArea").slideUp();
    $("#SArea").slideUp();
    $("#AArea").slideUp();
    $("#OnlySSArea").slideDown();
    $("#OnlySArea").slideDown();
    $("#OnlyAArea").slideDown();    
});

function parentCheck(){
    $(".ICON_PARENT").each(function () {
        var iconSize = $(this).find(".CHECK_COVER").length;
        var hideSize = $(this).find(".NONE").length;
        if (iconSize == hideSize) {
            $(this).addClass("d-none");
        } else {
            $(this).removeClass("d-none");
        }
    });    
}

$(document).on('click', '.filterButton', function () {
    let type = $(this).attr('data-id');
    gtag('event', "filter", {'event_category': "stylecheck", 'event_label': type, 'value': 1});

    if (!$(this).hasClass("filterActive")) {
        // 絞り込み
        $(".filterButton").each(function () {
            $(this).removeClass("filterActive");
        });
        $(this).toggleClass("filterActive");
    }    
    $(".style").each(function () {
        $(this).addClass("d-none");
        if ($(this).attr("data-type") === type) {
            $(this).removeClass("d-none");
        }
    });
});
function updateMyStyle() {
    if (UID !== undefined && targetId === undefined) {
        updateData("STYLECHECK", {"SS": sslist, "S": slist, "A": alist, "timestamp": firebase.database.ServerValue.TIMESTAMP}, true);
    }
}
$(document).on('click', '.style', function () {
    if (targetId !== undefined) {
        return;
    }
    let on = $(this).find(".CHECK_COVER").hasClass("icon_nocheck");
    let rare = $(this).attr('data-rare');
    let styleId = $(this).attr('data-id');
    styleClick(styleId, rare, on);
    calcStyleList();
    updateMyStyle();
    setTwitterURL();
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
    calcStyleList();
    updateMyStyle();
    setTwitterURL();
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
    calcStyleList();
    updateMyStyle();
    setTwitterURL();
});


$(document).on('click', '#tabRare', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Rarity", 'value': 1});
    clickRareTab();
});
function clickRareTab(){
    $("#tabRare").removeClass("icon_btn_negative").addClass("icon_btn_positive");
    $("#tabChar").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#tabGacha").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#styleAreaRare").removeClass("d-none");
    $("#styleAreaChar").parent().addClass("d-none");
    $("#styleAreaGacha").parent().addClass("d-none");
}

$(document).on('click', '#tabChecker', function () {
    $("#tabChecker").removeClass("icon_btn_negative").addClass("icon_btn_positive");
    $("#tabBattle").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#filterArea").slideDown();
    $("#styleAreaRare").show();
    $("#styleAreaClass").hide();
});
$(document).on('click', '#tabBattle', function () {
    $("#tabBattle").removeClass("icon_btn_negative").addClass("icon_btn_positive");
    $("#tabChecker").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#filterArea").slideUp();
    $("#styleAreaClass").show();
    $("#styleAreaRare").hide();
});

$(document).on('click', '#tabChar', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Char", 'value': 1});
    changeSimpleDisplayToAllDisplay();
    $("#tabChar").removeClass("icon_btn_negative").addClass("icon_btn_positive");
    $("#tabRare").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#tabGacha").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#styleAreaRare").addClass("d-none");
    $("#styleAreaChar").parent().removeClass("d-none");
    $("#styleAreaGacha").parent().addClass("d-none");
});

$(document).on('click', '#tabGacha', function () {
    gtag('event', "tab", {'event_category': "stylecheck", 'event_label': "Gacha", 'value': 1});
    changeSimpleDisplayToAllDisplay();
    $("#tabChar").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#tabRare").addClass("icon_btn_negative").removeClass("icon_btn_positive");
    $("#tabGacha").removeClass("icon_btn_negative").addClass("icon_btn_positive");
    $("#styleAreaRare").addClass("d-none");
    $("#styleAreaChar").parent().addClass("d-none");
    $("#styleAreaGacha").parent().removeClass("d-none");
});


$(document).on('click', '.START_GACHA', function () {
    $("#GACHA_SPACE").html("");
    $("#IS_NEW").html("");
    for(var i = 0; i < 5; i ++){
        var random = Math.ceil( Math.random()*100 );
        if(random <= 83){
            target = "A";
            targetList = alist;
            cName="style_icon_a_middle";
            white = 40 * 20;
        } else if (random <= 95) {
            target = "S";
            targetList = slist;
            cName="style_icon_s_middle";
            white = 60 * 30;
        } else {
            target = "SS";
            targetList = sslist;
            cName="style_icon_ss_middle";
            white = 100 * 40;
        }
        var rand = Math.floor(Math.random() * puraGachaList[target].length);
        var sid = puraGachaList[target][rand];
        var styleInfo = STYLE_MASTER[sid];
        var isNew = (targetList.indexOf(sid) == -1);
        var ckClass = (isNew) ? "" : "nocheck";
        //var icon = `<span class="${ckClass}"><button class="style ${cName}" style="background:url(./img/style_icon/${sid}.png) no-repeat;"></button></span>`;
        let styleIcon = getStyleIcon(target, sid, styleInfo['WeaponType'], false, true);        
        if(isNew){
            styleIcon.find(".CHECK_COVER").removeClass("icon_nocheck");
        }
        $("#GACHA_SPACE").append(styleIcon);
        
        $("#USE_TICKET").text(Number($("#USE_TICKET").text())+5);
        $(".simAllSum").text(Number($(".simAllSum").text())+1);
        $(`.sim${target}Sum`).text(Number($(`.sim${target}Sum`).text())+1);
        if(isNew){
            $("#IS_NEW").html(" new!!");
            $(`.simAllNewSum`).text(Number($(`.simAllNewSum`).text())+1);
            $(`.sim${target}NewSum`).text(Number($(`.sim${target}NewSum`).text())+1);
        } else {
            var numA =  Number($(`.simAllWhiteSum`).attr("data-num"))+white;
            var numT =  Number($(`.sim${target}WhiteSum`).attr("data-num"))+white;
            $(`.simAllWhiteSum`).attr("data-num" , numA);
            $(`.sim${target}WhiteSum`).attr("data-num" , numT);
            $(`.simAllWhiteSum`).text(numA.toLocaleString());
            $(`.sim${target}WhiteSum`).text(numT.toLocaleString());
        }
    }

});

$(document).on('click', '#displaySimulator', function () {
    $("#GACHA_SPACE").html("");
    $("#IS_NEW").html("");
    $(`.simAllWhiteSum`).attr("data-num" , 0);
    $(`.simSSWhiteSum`).attr("data-num" , 0);
    $(`.simSWhiteSum`).attr("data-num" , 0);
    $(`.simAWhiteSum`).attr("data-num" , 0);
    $(`.simTarget`).text(0);
    calcMyStyle();
    $("#modal02").fadeIn();
    $("#modalInner2").css("animation", "modal 0.5s forwards");
});

$(document).on('click', '#displaySummary', function () {    
    calcMyStyle();
    $("#modal01").fadeIn();
    $("#modalInner").css("animation", "modal 0.5s forwards");
    return false;
});
function setTwitterURL(){
    let all = allCount["ALL"]["ALL"];
    let myAll = (sslist.length + slist.length + alist.length);
    let br = "%0D%0A";
    let text = `ロマサガRS スタイル所持チェッカー${br}`;
    text += `全 ${myAll}体/${all}体 (${$(".allPer").first().text()}％）${br}`;
    text += `SS ${sslist.length}体/${allCount["SS"]["ALL"]}体 (${$(".SSPer").first().text()}％）${br}`;
    text += `S ${slist.length}体/${allCount["S"]["ALL"]}体 (${$(".SPer").first().text()}％）${br}`;
    text += `A ${alist.length}体/${allCount["A"]["ALL"]}体 (${$(".APer").first().text()}％）${br}`;
    let param = (UID !== undefined) ? "?" + UID : "";
    let href = `https://twitter.com/intent/tweet?text=${text}&url=https://nao-romasaga.github.io/stylecheck.html${param}&hashtags=ロマサガRS便利ツール,スタイル所持チェッカー`;
    $(".twitter-share-button").attr("href", href);    
}

function calcMyStyle(){
    setTwitterURL();
    // 初期化
    var listDtl = {"プラチナ":{"SS": 0, "S": 0, "A": 0}, "限定":{"SS": 0, "S": 0, "A": 0}, "その他":{"SS": 0, "S": 0, "A": 0}};
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

    var allHave = $(".mypAll").first().text() / $(".pAll").first().text() * 100;
    var ssHave = listDtl["プラチナ"]["SS"] / $(".pAllSS").first().text() * 100;
    var sHave = listDtl["プラチナ"]["S"] / $(".pAllS").first().text() * 100;
    var aHave = listDtl["プラチナ"]["A"] / $(".pAllA").first().text() * 100;

    $(".mypAllPer").text(Math.round(allHave * 100) / 100);
    $(".mypSSPer").text(Math.round(ssHave * 100) / 100);
    $(".mypSPer").text(Math.round(sHave * 100) / 100);
    $(".mypAPer").text(Math.round(aHave * 100) / 100);

    var ssGet = (100 - ssHave) * 0.05;
    var sGet = (100 - sHave) * 0.12;
    var aGet = (100 - aHave) * 0.83;
    var allGet = ssGet + sGet + aGet;
    //console.log("獲得率", allGet, ssGet,sGet,aGet);

    $(".mypAllGetPer").text(Math.round(allGet * 100) / 100);
    $(".mypSSGetPer").text(Math.round(ssGet * 100) / 100);
    $(".mypSGetPer").text(Math.round(sGet * 100) / 100);
    $(".mypAGetPer").text(Math.round(aGet * 100) / 100);
    //console.log("獲得率GetPer", Math.round(allGet * 100) / 100, Math.round(ssGet * 100) / 100,Math.round(sGet * 100) / 100,Math.round(aGet * 100) / 100);

    $(".mypAllGetBunsu").text((ssGet + sGet + aGet === 0) ? "排出無" : Math.round(100 / (ssGet + sGet + aGet)));
    $(".mypSSGetBunsu").text((ssGet === 0) ? "排出無" : "1/"+Math.round(100 / ssGet));
    $(".mypSGetBunsu").text((sGet === 0) ? "排出無" : "1/"+Math.round(100 / sGet));
    $(".mypAGetBunsu").text((aGet === 0) ? "排出無" : "1/"+Math.round(100 / aGet));
    //console.log(Math.round(100 / ssGet),Math.round(100 / sGet),Math.round(100 / aGet));

    $(".mypAll5RenPer").text(Math.round((1 - ((100-allGet)/100)**5)*10000)/100 );
    $(".mypSS5RenPer").text(Math.round((1 - ((100-ssGet)/100)**5)*10000)/100 );
    $(".mypS5RenPer").text(Math.round((1 - ((100-sGet)/100)**5)*10000)/100 );
    $(".mypA5RenPer").text(Math.round((1 - ((100-aGet)/100)**5)*10000)/100 );
    $(".mypAll20RenPer").text(Math.round((1 - ((100-allGet)/100)**20)*10000)/100 );
    $(".mypSS20RenPer").text(Math.round((1 - ((100-ssGet)/100)**20)*10000)/100 );
    $(".mypS20RenPer").text(Math.round((1 - ((100-sGet)/100)**20)*10000)/100 );
    $(".mypA20RenPer").text(Math.round((1 - ((100-aGet)/100)**20)*10000)/100 );
    $(".mypAll50RenPer").text(Math.round((1 - ((100-allGet)/100)**50)*10000)/100 );
    $(".mypSS50RenPer").text(Math.round((1 - ((100-ssGet)/100)**50)*10000)/100 );
    $(".mypS50RenPer").text(Math.round((1 - ((100-sGet)/100)**50)*10000)/100 );
    $(".mypA50RenPer").text(Math.round((1 - ((100-aGet)/100)**50)*10000)/100 );
}

$(document).on('click', '.modalClose', function () {
    $("#modal01").fadeOut();
    $("#modalInner").css("animation", "modalClose 0.5s forwards");
    $("#modal02").fadeOut();
    $("#modalInner2").css("animation", "modalClose 0.5s forwards");
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

    let weapon = STYLE_MASTER[styleId]['WeaponType'];
    let target = alist;
    if (rare === "SS") {
        target = sslist;
    } else if (rare === "S") {
        target = slist;
    }
    $("." + styleId).each(function () {
        if (on) {
            $(this).find(".CHECK_COVER").removeClass("icon_nocheck");
        } else {
            $(this).find(".CHECK_COVER").addClass("icon_nocheck");
        }
    });

    if (on) {
        if (target.indexOf(styleId) === -1) {
            target.push(styleId);
        }
        if (weaponType['ALL'][weapon].indexOf(styleId) === -1) {
            weaponType['ALL'][weapon].push(styleId);
        }
        if (weaponType[rare][weapon].indexOf(styleId) === -1) {
            weaponType[rare][weapon].push(styleId);
        }
    } else {
        if (weaponType['ALL'][weapon].indexOf(styleId) > -1) {
            weaponType['ALL'][weapon] = weaponType['ALL'][weapon].filter(n => n !== styleId);
        }
        if (weaponType[rare][weapon].indexOf(styleId) > -1) {
            weaponType[rare][weapon] = weaponType[rare][weapon].filter(n => n !== styleId);
        }
        if (rare === "SS") {
            sslist = target.filter(n => n !== styleId);
        } else if (rare === "S") {
            slist = target.filter(n => n !== styleId);
        } else {
            alist = target.filter(n => n !== styleId);
        }
    }
}

function calcStyleList(){
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
    for (let key in WEAPON_ATTR) {
        let wpSize = Number(weaponType['ALL'][key].length);
        $(".my" + key).text(wpSize);
        $(".mySS" + key).text(Number(weaponType['SS'][key].length));
        $(".myS" + key).text(Number(weaponType['S'][key].length));
        $(".myA" + key).text(Number(weaponType['A'][key].length));
        let nowLv = getMasterLevel(wpSize);
        let maxLv = getMasterLevel(allCount["ALL"][key]);
        $(".myMlv" + key).text(nowLv+"/"+maxLv);
        //let next = MASTER_LEVEL[nowLv] - (wpSize * 5);
        //let need = (next > 5) ? Math.floor(next / 5) + 1 : 1;
        //$(".myNext" + key).text(need);
        $(".myPer" + key).text(calcPer(wpSize / allCount["ALL"][key]).toFixed(1));
        //console.log(key, "now",wpSize, (wpSize*5),"pt", "nowLv:", nowLv, "next", next, "need",need);
    }
    //console.log(on, rare, styleId, all, all2, target);    
}

var puraGachaList = {"SS":[], "S":[], "A":[]};
function display() {
    let gacha = [];
    let gachaNameList = [];
    for (let charId in CHAR_MASTER) {
        let charInfo = CHAR_MASTER[charId];
        var $charArea = $(`<div class="charArea${charId} ICON_PARENT"></div>`);
        $charArea.append(`${charInfo['Name']}<br>`);
        $("#styleAreaChar").find(`.${charInfo['Series']}`).append($charArea);
        for (let styleId of charInfo['Holders']) {
            let styleInfo = STYLE_MASTER[styleId];
            let rare = styleInfo['Rarity'];
            var gachaNameOrg = (styleInfo['gacha'] === "") ? "プラチナガチャ限定" : styleInfo['gacha'];
            var gachaNames = gachaNameOrg.split("/");
            if(gachaNameOrg.indexOf("プラチナガチャ限定") > -1 || gachaNameOrg.indexOf("汎用") > -1) {
                bunrui = "プラチナ"
                if(puraGachaList[rare].indexOf(styleId) === -1){
                    puraGachaList[rare].push(styleId);
                }
            } else if(
                gachaNameOrg.indexOf("スタートダッシュミッション") > -1 ||
                gachaNameOrg.indexOf("キャンペーン配布") > -1 ||
                gachaNameOrg.indexOf("ピース交換") > -1 ||
                gachaNameOrg.indexOf("初期配布") > -1 || gachaNameOrg.indexOf("クエストドロップ") > -1 
            || gachaNameOrg.indexOf("常設イベント") > -1 || gachaNameOrg.indexOf("ストーリー") > -1 ) {
                bunrui = "その他";
            } else {
                bunrui = "限定"
            }
            STYLE_MASTER[styleId]['gachaBunrui'] = bunrui;
            listDtlAll[bunrui][rare]++;
    
            let weapon = STYLE_MASTER[styleId]['WeaponType'];
            allCount[rare][weapon]++;
            allCount[rare]["ALL"]++;
            allCount["ALL"][weapon]++;
            allCount["ALL"]["ALL"]++;

            let styleIcon = getStyleIcon(rare, styleId, styleInfo['WeaponType'], false , true);
            $charArea.append(styleIcon.clone());
            let lim = (bunrui == "限定") ? "lim" : "pra";
            $("#" + rare + "Area").find("." + lim + MASTER_LV_KEY[weapon]).append(styleIcon.clone());

            styleIcon.append(`<span style="position: absolute; top:0px; left:0px; font-size:8px; line-height:10px; color: transparent;">${charInfo['Name']}</span>`);
            for ( idx in gachaNames) {
                var gachaName = gachaNames[idx];
                gachaName += (idx > 0 && kotei.indexOf(gachaName) == -1 && gachaName.indexOf("20") > -1 ) ? "【復刻】": "";
                if (gacha[gachaName] === undefined) {
                    gacha[gachaName] = {"SS": [], "S": [], "A": []};
                    gachaNameList.push(gachaName);
                }
                gacha[gachaName][rare].push(styleIcon.clone());
            }
        }
        //$("#styleAreaChar").append("<br>");
    }
    // 日付順に並び替える
    gachaNameList.sort(function(a,b){
        return (a < b ? 1 : -1);
    });
    // 固定表示のものはリストから除外する
    for(var name of kotei){
        var idx = gachaNameList.indexOf(name);
        delete gachaNameList[idx];
    }
    // オープン中のガチャは除外する
    for(var name of OPEN_GACHA){
        name = (gacha[name] !== undefined) ? name : name + "【復刻】";
        var idx = gachaNameList.indexOf(name);
        delete gachaNameList[idx];
    }
    gachaNameListOrg = gachaNameList.filter(v => v);
    // 固定を差し込む
    gachaNameList = OPEN_GACHA.concat(kotei).concat(gachaNameListOrg);
    // Array.prototype.splice.apply(gachaNameList,[HEAD_DISP,0].concat(kotei));
    for (let name of gachaNameList) {
        name = (gacha[name] !== undefined) ? name : name + "【復刻】";

        var $gachaArea = $(`<div class="ICON_PARENT"></div>`);
        var dispName = $(`<span class="subtitle-long fuchidori-white smallFont">${name}</span><br>`)
        $gachaArea.append(dispName);
        console.log(name, gacha);

        gacha[name]["SS"] = (gacha[name]["SS"] === undefined) ? [] : gacha[name]["SS"];
        gacha[name]["S"] = (gacha[name]["S"] === undefined) ? [] : gacha[name]["S"];
        gacha[name]["A"] = (gacha[name]["A"] === undefined) ? [] : gacha[name]["A"];
        for (let background of gacha[name]["SS"]) {
            $gachaArea.append(background);
        }
        for (let background of gacha[name]["S"]) {
            $gachaArea.append(background);
        }
        for (let background of gacha[name]["A"]) {
            $gachaArea.append(background);
        }
        $("#styleAreaGacha").append($gachaArea);
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

    for (let key in WEAPON_ATTR) {
        $(".all" + key).text(allCount["ALL"][key]);
        $(".allSS" + key).text(allCount["SS"][key]);
        $(".allS" + key).text(allCount["S"][key]);
        $(".allA" + key).text(allCount["A"][key]);
    }
}

function intialMyStyle(){
    let i = (targetId !== undefined) ? targetId : UID;

    readStyleCheckData(i, function (result) {
        if (result !== null) {
            sslist = (result['SS'] !== undefined) ? result['SS'] : [];
            slist = (result['S'] !== undefined) ? result['S'] : [];
            alist = (result['A'] !== undefined) ? result['A'] : [];
            sslist = sslist.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });            
            slist = slist.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
            alist = alist.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });            
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
        dispClassData(result);
        calcStyleList();
        $("#displaySummary").removeClass("d-none");
        $("#displaySimulator").removeClass("d-none");
        $(".DISP_CLASS").show();
        setTwitterURL();        
    }, false);    
}