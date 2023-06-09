var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_CHAR = {};
var NOW_CHAR_ID = "";
var NOW_STYLE = {};
var MY_STYLE = [];
var IS_SET_MY_STYLE = false; // スタイル所持チェッカー登録してあるかどうか
var IS_SHOW_MY_STYLE = true; // 所持スタイルのみ表示するかどうかのフラグ
var IS_SIMPLE_MODE = false; // 表示のシンプルモード
var IS_SHOW_ONLY_CHOISE_STYLE = false; // 選択中のスタイルのみ表示

var NOW_PARTY = 0;
var PARTY_LIST = [[]];
var BASE = LIMIT_BASE;
var BASE_HP = (BASE + 26) * 10;
var UID;
var dotStyle = " margin-left:0px; position: relative;";
var MY_RENSEI_LIST = {};
var MY_RENSEI_LIST_UNLOADED = true;

// PARTY_LIMIT = 5 Firebaseで設定

var DISPLAY_OPTION = {
    "Q": "",
    "RE": 1,
    "SIM": 0,
    "SEL": 0
};
var DISP_UPDATE_FLG = false;
function _noLoginInitial() {
}
async function _initial() {
    $(".noLogin").hide();
    $(".isLogin").removeClass("d-none");
    $("#loginInfo").hide();
    loginCard("#firebaseui-auth-container");
    await init();
}

async function init() {

    let mystyleFunc = readUserData("STYLECHECK", function (read) {
        let a = (read === null || read["A"] === undefined) ? [] : read["A"];
        let s = (read === null || read["S"] === undefined) ? [] : read["S"];
        let ss = (read === null || read["SS"] === undefined) ? [] : read["SS"];
        MY_STYLE = a.concat(s).concat(ss);
    });
    let partyFunc = readUserData("PARTY", async function (result) {
        if (result === null) {
            PARTY_LIST = [[]];
        } else {
            PARTY_LIST = result;
            $("#NOW_PARTYNUM").text(PARTY_LIST[NOW_PARTY].length);
        }
    });

    let displayFunc = readUserData("DISPLAY/PARTY", async function (result) {
        if (result !== null) {
            DISPLAY_OPTION = result;
        }
    });
    let myRenseiFunc = readUserDataNext("RENSEI", function (read) {
        MY_RENSEI_LIST_UNLOADED = false;
        MY_RENSEI_LIST = (read != null) ? read : {};
    });

    updateDisplayDB();
    dispChar2(CHAR_MASTER);
    $("#PARTY").show();
    $('[data-toggle="tooltip"]').tooltip();

    await Promise.all([partyFunc, mystyleFunc, displayFunc, myRenseiFunc]);

    IS_SET_MY_STYLE = (MY_STYLE.length > 0);
    if (IS_SET_MY_STYLE) {
        // スタイル所持チェッカー登録があればデフォルトは連動する
        IS_SHOW_MY_STYLE = true;
        $("#SHOW_ONLY_MYSTYLE_INFO").hide();
    } else {
        IS_SHOW_MY_STYLE = false;
        $("#SHOW_ONLY_MYSTYLE").hide();
    }

    if (PARTY_LIST === null) {
        DISP_UPDATE_FLG = true;
        return;
    }

    await renderParty();
    $(".initialHide").removeClass("d-none");
    $(".questList").slideUp();
    $(".questListNow").slideDown();
    $(".initialShow").slideUp();

    var eventChar = getEventCharData();
    for(var questName in eventChar){
        $quest = $(`<div id="${questName}">`);
        $quest.append(`<div class="label-text-small d-block text-center">${questName}</div>`);
        for(var limit in eventChar[questName]){
            $quest.append(`<div class="bg-item d-block" style="padding: 6px 15px;">${limit}</div>`);
            var dotList = [];
            for(var idx in eventChar[questName][limit]) {
                var data = eventChar[questName][limit][idx];
                $label = $(`<div class="text-center text-nowrap dot-nbai-label">${data["UP"]}</div>`);
                for (var dotId of data['CHAR']) {
                    if(dotList.indexOf(dotId) > -1) {
                        continue;
                    }
                    dotList.push(dotId);
                    $dot = $(`.${dotId}`).first().parent().clone();
                    $dot.append($label.clone());
                    $quest.append($dot);
                }
                for (var wp of data['WEAPON']) {
                    $quest.append($(`<div class="d-inline-block"><span class="icon_sm ${ICON_LIST[wp]}"></span><br>(${data["UP"]})　</div>`));
                }
                for (var at of data['ATTR']) {
                    $quest.append($(`<div class="d-inline-block"><span class="icon_sm ${ICON_LIST[at]}"></span><br>(${data["UP"]})　</div>`));
                }
                for (var s of data['SERIES']) {
                    $quest.append($(`<div class="d-inline-block">${s}<br>(${data["UP"]})　</div>`));
                }
                //dot-nbai-label
            }
            $("#_icon_toku").append($quest);
        }
    }


    setDisplayOption();
    //firebase.database().goOffline();
    //firebase.database(appUsers).goOffline();
}

function setDisplayOption() {
    if (DISPLAY_OPTION['RE'] === 0) {
        $("#SHOW_ONLY_MYSTYLE").trigger("click");
    }
    if (DISPLAY_OPTION['SEL'] === 1) {
        $("#SHOW_ONLY_CHOISE").trigger("click");
    }
    DISP_UPDATE_FLG = true;
}

$(document).ready(function ($) {
    BASE_HP = (LIMIT_BASE + 25) * 10;  
    $("#baseInput-base").val(LIMIT_BASE);
    $("#baseInput-HP").val(BASE_HP);  
  
    $("#footer_left").hide();
    $("#footer_right").hide();

    // 錬成武器の入力欄表示パターン切り替えボタン
    $(document).on('click', '.RENSEI_CHANGE', function () {
        var target = $(this).attr("data-type");
        var $parent = $(this).parents(".fukidashiInput");
        $parent.find(".RENSEI_CARD").addClass("d-none");
        $parent.find(`.RENSEI_${target}1`).removeClass("d-none");
        $parent.find(`.RENSEI_${target}2`).removeClass("d-none");
        $parent.find(`.RENSEI_${target}3`).removeClass("d-none");
    });

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

    initialHide();

    $('.tab-content').on('click', function () { });

    $('#footer_left').click(function() {
        $('#PARTY_FOOTER').animate({scrollLeft:0}, 'fast', 'swing');
    });
    $('#footer_right').click(function() {
        // 横幅から最大表示キャラ数を出す
        var parentWidth = $('#PARTY_FOOTER').width();
        var maxDispSize = Math.floor(parentWidth / 60);
        var nowPartySize = PARTY_LIST[NOW_PARTY].length;
        var overSize = (nowPartySize - maxDispSize) * 60;
        $('#PARTY_FOOTER').animate({scrollLeft:overSize}, 'fast', 'swing');
    });
    $('#PARTY_FOOTER').scroll(function() {
        var parentWidth = $('#PARTY_FOOTER').width();
        var maxDispSize = Math.floor(parentWidth / 60);
        var nowPartySize = PARTY_LIST[NOW_PARTY].length;
        // 最後の一人が見えたらボタンを消す
        var overSize = (nowPartySize - maxDispSize -1) * 60;
        if($(this).scrollLeft() < 20){
            $("#footer_left").hide();
        } else {
            $("#footer_left").show();
        }
        if($(this).scrollLeft() > overSize){
            $("#footer_right").hide();
        } else {
            $("#footer_right").show();
        }
    });

    var NOW_TABLE_INPUT = false;
    // 入力欄表示パターン切り替えボタン
    $(document).on('click', '.INPUT_DISP_CHANGE', function () {
        // オフだったら次はONだよね
        NOW_TABLE_INPUT = $(this).hasClass("icon_btn_off");
        $("#PARTY").find(".INPUT_DISP_CHANGE").each(function(){
            change2TableInput($(this));
        });
    });
    function change2TableInput(target) {
        target.toggleClass("icon_btn_on");
        target.toggleClass("icon_btn_off");
        target.find(".fas").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
        target.parents(".inputArea").find(".DISP_VERTICAL").toggleClass("d-none");
        target.parents(".inputArea").find(".DISP_TABLE").toggleClass("d-none");        
    }

    // フッターキャラドット
    $(document).on('click', '.btmdot', function () {
        var charId = $(this).attr("data-id");
        $(".charTableParent").each(function(){
            if($(this).attr("data-id") == charId) {
                $("html,body").animate({ scrollTop: $(this).offset().top - 90 }, 500, 'swing');
            }
        });
        if (DISPLAY_OPTION['SIM'] === 1) {
        // var $target = $("#dot" + charId).parents(".charTableParent").find(".CHAR_STATUS");
        // $("html,body").animate({ scrollTop: $target.offset().top - 40 }, 500, 'swing');
        } else {
            //$("html,body").animate({ scrollTop: $("#dot" + charId).offset().top }, 500, 'swing');
        }
    });
    $(document).on('click', '#FOOTER_CLOSE', function () {
        $(".FOOTER_CLOSE_ARROW").toggleClass("d-none");
        $(this).toggleClass("icon_btn_positive").toggleClass("icon_btn_negative");
        $("#FOOTER_PARTY").slideToggle();
    });
    $(document).on('click', '#FOOTER_QUEST', function () {
        $("html,body").animate({ scrollTop: $("#QUEST_CHOISE").offset().top }, 500, 'swing');
    });
    $(document).on('click', '#FOOTER_CHAR', function () {
        $("html,body").animate({ scrollTop: $("#CHAR_CHOISE").offset().top }, 500, 'swing');
    });
    // 未所持スタイルの表示切り替え
    $(document).on('click', '#SHOW_ONLY_MYSTYLE', function () {
        $(this).toggleClass("ONLY_MYSTYLE");
        $(this).toggleClass("icon_btn_on");
        $(this).toggleClass("icon_btn_off");
        $(this).find(".fas").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
        if ($(this).hasClass("ONLY_MYSTYLE")) {
            IS_SHOW_MY_STYLE = true;
        } else {
            IS_SHOW_MY_STYLE = false;
        }
        DISPLAY_OPTION["RE"] = Number(IS_SHOW_MY_STYLE);
        updateDisplayDB();

        changeDisplayStyleLimit();
    });
    // 選択中のスタイルのみ表示の切り替え
    $(document).on('click', '#SHOW_ONLY_CHOISE', function () {
        $(this).toggleClass("SIMPLE_MODE");
        $(this).toggleClass("icon_btn_on");
        $(this).toggleClass("icon_btn_off");
        $(this).find(".fas").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");

        if ($(this).hasClass("SIMPLE_MODE")) {
            IS_SHOW_ONLY_CHOISE_STYLE = true;
        } else {
            IS_SHOW_ONLY_CHOISE_STYLE = false;
        }
        DISPLAY_OPTION["SEL"] = Number(IS_SHOW_ONLY_CHOISE_STYLE);
        updateDisplayDB();

        changeDisplayStyleLimit();
    });

    function changeDisplayStyleLimit() {
        var noneStyle = [];
        $(".LIMIT").each(function () {
            var styleId = $(this).attr("data-styleid");
            // 全てのスタイル表示+選択中以外も表示＝全てを表示
            // 全てのスタイル表示+選択中のみ表示+選択中は表示
            if (!IS_SHOW_MY_STYLE && !IS_SHOW_ONLY_CHOISE_STYLE) {
                $(this).removeClass("d-none");
                return true; // continue;
            }
            // 非表示条件
            if (IS_SHOW_MY_STYLE && MY_STYLE.indexOf(styleId) == -1) {
                // 自分のスタイルのみ＋所持してない
                $(this).addClass("d-none");
                noneStyle.push(styleId);
            } else if (IS_SHOW_ONLY_CHOISE_STYLE && $(this).hasClass("partyOtherStyle")) {
                // 選択中のみ+非選択
                $(this).addClass("d-none");
                // 選択アイコンは消さない
            } else {
                $(this).removeClass("d-none");
            }
        });
        $(".style_icon_bg_base").each(function () {
            $(this).removeClass("d-none");
            var styleId = $(this).attr("data-id");
            if (noneStyle.indexOf(styleId) > -1) {
                $(this).addClass("d-none");
            }
        });

    }

    // シンプル表示の切り替え
    $(document).on('click', '#SHOW_SIMPLE_DISPLAY', function () {
        // $(this).toggleClass("SIMPLE_MODE");
        // $(this).toggleClass("icon_btn_on");
        // $(this).toggleClass("icon_btn_off");
        // $(this).find(".fas").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
        // if ($(this).hasClass("SIMPLE_MODE")) {
        //     IS_SIMPLE_MODE = true;
        // } else {
        //     IS_SIMPLE_MODE = false;
        // }
        // DISPLAY_OPTION["SIM"] = Number(IS_SIMPLE_MODE);
        // updateDisplayDB();

        // if (IS_SIMPLE_MODE) {
        //     $(".SIMPLE_HIDE").each(function () {
        //         $(this).addClass("d-none");
        //     });
        // } else {
        //     $(".SIMPLE_HIDE").each(function () {
        //         $(this).removeClass("d-none");
        //     });
        // }
    });

    // 保存ボタン
    $(document).on('click', '.CHAR_SAVE', function () {
        let charId = $(this).attr("data-id");
        $(this).removeClass("icon_btn_positive").addClass("icon_btn_negative");
        $(this).slideUp(200, function () {
            $(this).slideDown(200);
            updateDB(charId);
            saveCharData(charId);
        });
    });

    // プラスマイナスボタン
    $(document).on('click', '.paramButton', function () {
        let input = $(this).parent().find(".charParam");
        let add = ($(this).attr("data-pm") === "plus") ? 1 : -1;
        let org = input.val();
        let val = Number(org) + add
        input.val(val);
        updateDisplayStatus($(this), val);
    });
    // パラメータフォーム修正時
    $(document).on('change', '.charParam', function () {
        var org = $(this).val();
        $(this).val(Number(org));
        updateDisplayStatus($(this), $(this).val());
    });
    



    $('[data-toggle="tooltip"]').tooltip();

    // 入力ウィンドウ展開
    $(document).on('click', '.openMenu, .nowData > td', function () {
        let charId = ($(this).attr("data-id") !== undefined) ? $(this).attr("data-id") : $(this).parent().attr("data-id");
        NOW_CHAR = CHAR_MASTER[charId];
        // 他のキャラは閉じる
        $(".charTable").each(function () {
            if ($(this).attr("data-charid") !== charId) {
                $(this).find(".fukidashiInput").slideUp();
            }
        });

        let style = $(".charTmpl" + charId).find(".fukidashiInput").attr("style");
        if (style === "display: block;") {
            saveCharData(charId);
        }
        $(".charTmpl" + charId).find(".fukidashiInput").slideToggle(250);

        // 錬成表示
        createRenseiTable(charId);
    });

    // 閉じるボタンクリック
    $(document).on('click', '.btn_close', function () {
        closeInput($(this).attr("data-id"), true);
    });
    // パーティ解散ボタンクリック
    $(document).on('click', '#PARTY_RESET', function () {
        var charList = [];
        for (let key in PARTY_LIST[NOW_PARTY]) {
            var charId = PARTY_LIST[NOW_PARTY][key]['char'];
            charList.push(charId);
        }
        for (charId of charList) {
            charUnset(charId);
        }
    });
    // キャラクターとじる時
    $(document).on('click', '.charUnset', function () {
        let charId = $(this).attr("data-id");
        charUnset(charId);
    });
    // まとめて入力反映
    $(document).on('click', '.hanei', function () {
        showModal($(this).parents(".PARENT_TABLE").find(".allparams"));
    });

    $(document).on('change', '.allparams', function () {
        showModal($(this));
    });

    // キャラクタークリック時
    $(document).on('click', '.dotList .dot-base', async function () {
        firebase.database().goOnline();
        firebase.database(appUsers).goOnline();

        let charId = $(this).find(".char").attr("data-id");
        let idx = getCharFromPartyList(charId);
        if (PARTY_LIST[NOW_PARTY].length >= PARTY_LIMIT || idx !== -1) {
            while (PARTY_LIST[NOW_PARTY].length > PARTY_LIMIT) {
                let size = PARTY_LIST[NOW_PARTY].length;
                let id = PARTY_LIST[NOW_PARTY][size - 1]['char'];
                charUnset(id);
                PARTY_LIST[NOW_PARTY].pop();
            }
            $(this).find(".char")
            .removeClass('char-aruku-left2')
            .removeClass('char-winner2')
            .addClass('char-loser2');
            return;
        }

        // 初回でなければ開いている入力エリアは閉じる
        if (NOW_CHAR['Id'] !== undefined) {
            closeInput(NOW_CHAR['Id'], true);
        }

        NOW_CHAR = CHAR_MASTER[charId];
        $("#NOW_PARTYNUM").text((PARTY_LIST[NOW_PARTY].length) + 1);

        $(".styleInfoArea").show();
        selectDotHensei(NOW_CHAR);

        readUserDataWithId("CHAR", charId, async function (result) {
            // キャラクター情報表示
            await displayCharInfo(CHAR_MASTER[charId], result);
            var styleId = NOW_CHAR['Holders'][0];
            for (var styleId of NOW_CHAR['Holders']) {
                if (IS_SHOW_MY_STYLE) {
                    if (MY_STYLE.indexOf(styleId) > -1) {
                        NOW_STYLE = STYLE_MASTER[styleId];
                        break;
                    }
                } else {
                    NOW_STYLE = STYLE_MASTER[styleId];
                    break;
                }
            }
            // スタイル初期表示
            await displayStyleInfo(NOW_CHAR['Id'], styleId);
            // パーティ登録
            PARTY_LIST[NOW_PARTY].push({
                "char": charId,
                "style": styleId
            });
            var parentWidth = $('#PARTY_FOOTER').width();
            var maxDispSize = Math.floor(parentWidth / 60);
            var nowPartySize = PARTY_LIST[NOW_PARTY].length;
            // オーバーしてる時は出す
            if(nowPartySize > maxDispSize){
                $("#footer_right").show();
            }
    
            $(".charTmpl" + charId).find('.inputArea').removeClass('d-none').slideDown(500);
            if(NOW_TABLE_INPUT) {
                $(".charTmpl" + charId).find(".INPUT_DISP_CHANGE").each(function(){
                    change2TableInput($(this));
                });
            }

            // 複数キャラ選択が大変なのでキャラタップでスクロールは廃止
            //$("html,body").animate({scrollTop: $(".charTmpl" + charId).offset().top - 40}, 500, 'swing');            
            setLimitData(charId);
            updatePartyDB();
            //firebase.database().goOffline();
            //firebase.database(appUsers).goOffline();
        });
        $('[data-toggle="tooltip"]').tooltip();    
    });

    // スタイルクリック時
    $(document).on('click', '.style', async function () {
        let styleId = $(this).attr("data-id");
        NOW_STYLE = STYLE_MASTER[styleId];
        await displayStyleInfo(NOW_CHAR['Id'], styleId);
        let idx = getCharFromPartyList(NOW_CHAR['Id']);
        PARTY_LIST[NOW_PARTY][idx]['style'] = styleId;
        createRenseiTable(NOW_STYLE['CharacterId']);
        updatePartyDB();
    });

    $(".modalClose").click(function () {
        if ($(this).attr("data-id") === "ok") {
            gtag('event', "showModal", { 'event_category': "party", 'event_label': 'save', 'value': 1 });
            let id = $(this).attr("data-charId");
            let input = splitParam($(this).attr("data-input"), 0);
            for (let i in input) {
                $(".charInput" + PARAM_KEY_HP[i] + id).each(function (idx, el) {
                    $(el).val(input[i]);
                });
                $(".char" + PARAM_KEY_HP[i] + id).each(function (idx, el) {
                    $(el).text(input[i]);
                });
            }
            updateDB(); // spanに入れる
        } else {
            gtag('event', "showModal", { 'event_category': "party", 'event_label': 'cancel', 'value': 1 });
        }
        $("#modal01").fadeOut();
        $("#allParamConfirmInner").css("animation", "modalClose 0.5s forwards");
        return false;
    });
    // クエスト表示パターン変更
    $(".baseDispChange").click(function () {
        $(".baseDispChange").each(function () {
            $(this).removeClass("icon_btn_on");
            $(this).addClass("icon_btn_off");
        });
        $(this).removeClass("icon_btn_off");
        $(this).addClass("icon_btn_on");
        questId = Number($(this).attr("data-id"));
        DISPLAY_OPTION["Q"] = questId;
        updateDisplayDB();
        $(".questList").slideUp();
        $(`#quest${questId}`).slideDown();
    });

    $(".baseValue").click(function () {
        $(".baseValue").each(function () {
            $(this).find(`.fa-check-square`).remove();
            $(this).removeClass("icon_btn_on");
            $(this).addClass("icon_btn_off");
        });
        $(this).removeClass("icon_btn_off");
        $(this).addClass("icon_btn_on");
        $(this).prepend(`<i class="fas fa-check-square" style="margin-right:5px;"></i>`);

        updateDisplayDB();
        setLimitData();

        $("#NOW_QUEST").text($(this).text() + ` (HP${BASE_HP})`);
        $(".BASE_HP").text(BASE_HP);
        $(".NOW_BASE").text(BASE);
        $("#baseInput-base").val(BASE);
        $("#baseInput-HP").val(BASE_HP);
    });
    // ベースの直接入力
    $(document).on('change', '.baseInput', function () {
        var tag = $(this).val()
        if(tag < 380) {
            // 入力値はbase
            BASE = Number(tag);
            BASE_HP = Number((tag * 10 + 250));
        } else {
            BASE_HP = Number(tag);
            BASE = Number((tag - 250) / 10);
        }

        $("#baseInput-base").val(BASE);
        $("#baseInput-HP").val(BASE_HP);
        //DISPLAY_OPTION["BS"] = BASE;
        //updateDisplayDB();
        setLimitData();

        $("#NOW_QUEST").text($(this).text() + `BASE:${BASE} (HP${BASE_HP})`);
        $(".BASE_HP").text(BASE_HP);
        $(".NOW_BASE").text(BASE);
    });    

});

async function renderParty() {
    // 初期表示のパーティは0固定かな？
    let idx = 0;
    PARTY_LIST[0] = PARTY_LIST[0].filter(data => CHAR_MASTER[data['char']] !== undefined);
    let data = PARTY_LIST[0][idx];
    let finish = 0;
    let funcList = [];

    while (data !== undefined) {
        let charId = data['char'];
        let styleId = data['style'];

        NOW_CHAR = CHAR_MASTER[charId];
        selectDotHensei(CHAR_MASTER[charId]);
        let func = asyncReadUserDataWithId("CHAR", charId, async function (r) {
            // キャラクター情報表示
            await displayCharInfo(CHAR_MASTER[charId], r);
            // スタイル初期表示
            await displayStyleInfo(charId, styleId);
            // 全部読み込んだらDB切断する
            if (finish === PARTY_LIST[0].length) {
                //firebase.database(appUsers).goOffline();
            }
            // 入力エリアは初期表示は消す
            closeInput(charId, false);
        });
        funcList.push(func);
        data = PARTY_LIST[0][++idx];
    }
    var parentWidth = $('#PARTY_FOOTER').width();
    var maxDispSize = Math.floor(parentWidth / 60);
    var nowPartySize = PARTY_LIST[0].length;
    // オーバーしてる時は出す
    if(nowPartySize > maxDispSize){
        $("#footer_right").show();
    }

    await Promise.all(funcList);
}
function closeInput(charId, saveFlg = false) {
    //$(".LIMIT").attr("style", "border:0px");
    $(".charTmpl" + charId).find(".fukidashiInput").slideUp(250);
    if (saveFlg) {
        saveCharData(charId);
    }
    //$(".charTmpl" + charId).find('.inputArea').addClass('d-none');
}
function updateDisplayStatus(target, val) {
    var $save = target.parents(".charTable").find(".CHAR_SAVE");
    $save.removeClass("icon_btn_negative").addClass("icon_btn_positive");

    let table = target.parents(".charTable");
    let charId = table.attr("data-charid");
    let param = target.attr("data-param");
    $(".char" + param + charId).each(function () {
        $(this).text(val);
    });
    $(".charInput" + param + charId).each(function () {
        $(this).val(val);
    });
    updateDB(charId);
}

function charUnset(charId) {
    let charInfo = CHAR_MASTER[charId];
    selectDotReset(charInfo);
    $(".charTmpl" + charId).parents(".charTableParent").slideUp(500, function () {
        $("#PARTY").find(".charTmpl" + charId).parents(".charTableParent").remove();
    });

    $("#float-footer").find("#btmdot" + charId).parent().remove();
    $("#JINKEI" + charId).remove();
    let idx = getCharFromPartyList(charId);
    if (idx !== -1) {
        PARTY_LIST[NOW_PARTY].splice(idx, 1);
        $("#NOW_PARTYNUM").text(PARTY_LIST[NOW_PARTY].length);
    }
    updatePartyDB();
    saveCharData(charId);

    var parentWidth = $('#PARTY_FOOTER').width();
    var maxDispSize = Math.floor(parentWidth / 60);
    var nowPartySize = PARTY_LIST[NOW_PARTY].length;
    // オーバーしてない時は消す
    if(nowPartySize <= maxDispSize){
        $("#footer_left").hide();
        $("#footer_right").hide();
    }

}

function getCharFromPartyList(charId) {
    for (let key in PARTY_LIST[NOW_PARTY]) {
        if (PARTY_LIST[NOW_PARTY][key]['char'] === charId) {
            return key;
        }
    }
    return -1;
}

function updateDB(id) {
    let charId = (id === undefined) ? NOW_CHAR['Id'] : id;
    for (let key of PARAM_KEY_HP) {
        // Inputから取るのではなく表示値から取る。表示値はあらかじめ更新しておく必要ありよ
        let val = $(".char" + key + charId).first().text();
        CHAR_MASTER[charId]["NOW" + key] = Number(val);
    }

    // キャラ入れ替えた場合は、前のキャラを保存する
    if (NOW_CHAR_ID !== charId) {
        if (NOW_CHAR_ID !== "") {
            saveCharData(NOW_CHAR_ID);
        }
        NOW_CHAR_ID = charId;
    }
    setLimitData(charId);
}
function updatePartyDB() {
    updateData("PARTY", PARTY_LIST);
}
function updateDisplayDB() {
    if (DISP_UPDATE_FLG) {
        updateData("DISPLAY/PARTY", DISPLAY_OPTION);
    }
}
function showModal(allparams) {
    gtag('event', "showModal", { 'event_category': "party", 'event_label': 'show', 'value': 1 });
    $("#allSubmit").attr("data-input", $(allparams).val());
    $("#allSubmit").attr("data-charId", $(allparams).attr("data-id"));

    let input = splitParam($(allparams).val(), LIMIT_BASE);
    let output = "";
        output += `HP: ${input[0]}<br>`;
        output += `腕力: ${input[1]} 体力:${input[2]}<br>`;
        output += `器用さ: ${input[3]} 素早さ:${input[4]}<br>`;
        output += `知力: ${input[5]} 精神:${input[6]}<br>`;
        output += `　愛: ${input[7]} 魅力:${input[8]}<br>`;
        output += "が入力されました<br>";
        output += "この内容を反映してもよろしいですか？";
    $("#allParamConfirm").html(output);
    $("#modal01").fadeIn();
    $("#allParamConfirmInner").css("animation", "modal 0.5s forwards");
    return false;
}

function setLimitData(cid = undefined) {
    var styleList = [];
    $(".LIMIT").each(function () {
        let styleId = $(this).attr("data-styleId");
        if(styleList.indexOf(styleId) > -1){
            return true; // continue
        }
        styleList.push(styleId);
        let styleInfo = STYLE_MASTER[styleId];
        let tr = $(".limit" + styleId);
        let charId = tr.attr("data-charId");
        if (cid !== undefined && charId != cid) {
            return true; // continue
        }
        let sum = 0;

        for (let key of PARAM_KEY) {
            let seicho = styleInfo['Limit' + key];
            let limit = seicho + CHAR_MASTER[charId][key];
            let val = (CHAR_MASTER[charId]["NOW" + key] !== undefined) ? CHAR_MASTER[charId]["NOW" + key] : CHAR_MASTER[charId][key];
            sum += val;
            let limitValue = (styleInfo['Limit' + key] !== 99)
                ? BASE + Number(limit) - Number(val)
                : "?";
            tr.find("." + key).each(function () {
                $(this).removeClass("status_plus").removeClass("status_minus");
                if (limitValue === "?") {
                    $(this).addClass("status_question");
                } else if (limitValue > 0) {
                    $(this).addClass("status_plus");
                } else if (limitValue < 0) {
                    $(this).addClass("status_minus");
                }
                $(this).text(limitValue);
            });

            let ind = (styleInfo['Ind' + key] !== undefined) ? styleInfo['Ind' + key] : 1;
            var indPath = getImgPath(`icon/icon_ind_${ind}.png`);
            let indImg1 = `<img src="${indPath}" style="height:10px;">`;
            tr.find("." + key + "Seicho").each(function () {
                let limitStatus = BASE + Number(limit);
                $(this).html(`<span class="text-nowrap">${indImg1}${limitStatus}</span> (${seicho})`);
            });

        }
        $(".SUM" + charId).text(sum);
    });
}

function saveCharData(charId) {
    $(".charTmpl" + charId).find(".icon_btn_positive").removeClass("icon_btn_positive").addClass("icon_btn_negative");

    update = {};
    let sum = 0;
    for (let key of PARAM_KEY) {
        let v = Number(CHAR_MASTER[charId]["NOW" + key]);
        v = isNaN(v) || (v > LIMIT_BASE + 19) ? 0 : v;
        sum += v;
        update[key] = v;
    }
    let v = Number(CHAR_MASTER[charId]["NOWHP"]);
    update["HP"] = isNaN(v) || (v > HP_LIMIT) ? 0 : v;

    gtag('event', "saveChar", { 'event_category': "party", 'event_label': CHAR_MASTER[charId]['Name'], 'value': 1 });
    if (sum > 0) {
        updateData(`CHAR/${charId}`, update);
    } else {
        //deleteCharData(charId);
    }
}
function initialHide() {
    $("#PARTY").hide();
    $(".tabArea").hide();
    $(".styleInfoArea").hide();
}

function resetRenseiCard(charBaseTmpl) {
    // 錬成エリア作成
    var renseiTable = $("#RENSEI_TABLE").clone().attr("id","").removeClass("d-none");
    charBaseTmpl.find(".RENSEI_BASE1").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_SINGLE1").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_ALL1").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_BASE2").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_SINGLE2").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_ALL2").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_BASE3").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_SINGLE3").html("").append(renseiTable.clone());
    charBaseTmpl.find(".RENSEI_ALL3").html("").append(renseiTable.clone());
}

// キャラクタークリック時
async function displayCharInfo(charInfo, myData) {
    let charId = charInfo['Id'];
    let div = $("#CHAR_TEMPLATE_PARENT").clone().removeClass("d-none").removeAttr("id");    
    div.attr("data-jutsuattrs",charInfo['JutsuAttrs']);
    div.attr("data-attrs",charInfo['AttackAttrs']);
    div.attr("data-series",charInfo['Series']);
    div.attr("data-gender",charInfo['Gender']);
    div.attr("data-weapon",charInfo['WeaponType']);
    div.attr("data-id",charId);
    div.find(".charUnset").attr("data-id", charId);

    if (IS_SIMPLE_MODE) {
        div.find(".SIMPLE_HIDE").addClass("d-none");
    }
    let charBaseTmpl = $("#CHAR_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("charTmpl" + charId)
        .attr("data-charId", charId);
    charBaseTmpl.find(".btn_close").attr("data-id", charId);
    charBaseTmpl.find(".charUnset").attr("data-id", charId);
    charBaseTmpl.find(".char").parent().attr("data-id", charId);
    charBaseTmpl.find(".allparams").attr("data-id", charId);
    charBaseTmpl.find(".CHAR_SAVE").attr("data-id", charId);
    charBaseTmpl.find(".SUM").attr("data-id", charId).addClass("SUM" + charId);
    charBaseTmpl.find(".AVG").attr("data-id", charId).addClass("AVG" + charId);
    var $ikkatuTable = charBaseTmpl.find(".PARENT_TABLE");
    $ikkatuTable.find(".IKKATSU_INFO").slideUp();
    $ikkatuTable.find(".yubi").click(function () {
        $(this).parents('.PARENT_TABLE').find('.IKKATSU_INFO').slideToggle();
    });

    // 錬成エリア作成
    resetRenseiCard(charBaseTmpl);
    
    div.find(".BASE_HP").html(BASE_HP);
    div.find(".SUM").attr("data-id", charId).addClass("SUM" + charId);
    div.find(".AVG").attr("data-id", charId).addClass("AVG" + charId);
    div.find(".RECO").attr("data-id", charId).addClass("RECO" + charId);
    div.find(".openMenu").attr("data-id", charId);

    charBaseTmpl.find("#STYLE_SEICHO").attr("id", "STYLE_SEICHO" + charId);

    // ステータス反映。初回はデフォルト値(+35)を入れる
    if (myData !== null) {
        for (let key of PARAM_KEY_HP) {
            charInfo["NOW" + key] = Number(myData[key]);
        }
    } else if (myData === null) {
        for (let key of PARAM_KEY) {
            charInfo["NOW" + key] = 0;
        }
    }

    let nowInput = charBaseTmpl.find(".nowData");
    nowInput.attr("data-id", charId);
    for (let key of PARAM_KEY_HP) {
        charBaseTmpl.find(".char" + key).removeClass("char" + key).addClass("charInput" + key + charId).val(charInfo["NOW" + key]);
        nowInput.find("." + key).removeClass("char" + key).addClass("char" + key + charId).text(charInfo["NOW" + key]);
    }

    // 所持スタイルの表示。選択部分とリミット部分
    var sList = [];
    for (let styleId of charInfo['Holders']) {
        sList.push(STYLE_MASTER[styleId]);
    }
    var styleIdList = sortStyleId(sList);
    for (let styleId of styleIdList) {
        let styleInfo = STYLE_MASTER[styleId];
        // スタイルアイコンの追加
        let styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, styleInfo['WeaponType']);
        charBaseTmpl.find(".STYLE_ICON").append(styleIcon);

        // 上限チェック部分の画像
        let tr = $("#LIMIT_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("LIMIT limit" + styleId)
            .attr("data-styleId", styleId).attr("data-charId", charId);
        // スタイルを持ってる＆自分のスタイルだけを表示する場合
        if (IS_SET_MY_STYLE && IS_SHOW_MY_STYLE && MY_STYLE.indexOf(styleId) == -1) {
            tr.addClass("d-none");
            styleIcon.addClass("d-none");
        }

        var cutInURL = getImgPath(`style_cutin/${styleId}.png`);

        var rareURL = getImgPath(`icon/icon_${styleInfo['Rarity']}.png`);
        var rare = $(`<img class="" src="${rareURL}" style="position:absolute; left:0; top: 0px; height:22px">`);

        // 画面表示と、編集画面の成長傾向はアイコンが異なるのでアイコンを入れる前にcloneする

        // アイコン追加
        tr.find(".ICON_TD").append(rare).attr("style", `background:url(${cutInURL}) no-repeat; background-size:cover; background-position: calc(50% + 20px);`);

        var styleSeicho = tr.clone();
        styleSeicho.addClass("INPUT_AREA"); // 入力エリアは選択中でもopacityさせない
        //styleSeicho.find(".ICON_TD").append(styleIcon.clone());

        styleSeicho.addClass("status-bgcolor");
        // ここで設定してたけどsetLimitDataでやるようになったので削除
        let fix = (styleInfo['Fix'] === "f");
        let kari = (styleInfo['Fix'] === "c");

        for (let key of PARAM_KEY) {
            let limit = styleInfo['Limit' + key];
            if (limit === 99) {
                tr.find("." + key).text("?");
            } else {
                let fontclass = "";
                if (fix || styleInfo['Fix' + key] == 'k' || styleInfo['Fix' + key] == 'f' 
                || limit === 0
                || (styleInfo['Ind' + key] == 2 && limit == 3)) {
                    fontclass = "fuchidori-blue fix-bgcolor";
                } else if (!kari) {
                    fontclass = "fuchidori-yellow kari-bgcolor";
                }

                styleSeicho.find("." + key)
                    .addClass(fontclass)
                    .removeClass(key)
                    .addClass(key + "Seicho");
            }
        }
        charBaseTmpl.append(tr);
        charBaseTmpl.find("#STYLE_SEICHO" + charId).before(styleSeicho);
    }
    var dot = getCharBase2(charInfo, '', false);
    var btmDot = dot.clone();
    dot.find(".char-aruku-left2").addClass("char-winner2").removeClass("char-aruku-left2").removeAttr("id").attr("id", "dot" + charInfo['Id']);
    div.find(".CHAR_DOT").append(dot.clone());

    div.find(".CHAR_STATUS").append(charBaseTmpl);
    $("#PARTY").append(div);
    var char = btmDot.clone();// find(".char");    
    char.find(".char").attr("id", "btmdot" + charInfo['Id']).attr("data-id", charInfo['Id']).addClass("btmdot");
    char.attr("id", "dot-footer-" + charInfo['Id']);
    $("#float-footer").append(char.clone());
}
// スタイルクリック時
async function displayStyleInfo(charId, styleId) {
    let styleInfo = STYLE_MASTER[styleId];
    if (styleInfo === null) {
        return;
    }

    $(".charTmpl" + charId).attr("data-styleId", styleId);
    // TODO 複数パーティの場合はここを直す必要がある
    $(".charTmpl" + charId).find(".style").each(function () {
        let subStyleId = $(this).attr("data-id");
        $(this).find(".CHECK_COVER").addClass("icon_nocheck");
        if (styleId === subStyleId) {
            $(this).find(".CHECK_COVER").removeClass("icon_nocheck");
            return;
        }
    });

    var noneStyle = [];
    $(".charTmpl" + charId).find(".LIMIT").each(function () {
        if ($(this).hasClass("INPUT_AREA")) {
            return;
        }
        var otherClass = IS_SHOW_ONLY_CHOISE_STYLE ? "d-none" : "";
        if ($(this).hasClass("limit" + styleId)) {
            // 選択中になる
            $(this).removeClass(`partyOtherStyle ${otherClass}`).addClass("partyNowStyle");
        } else {
            // こっちは非選択
            $(this).addClass(`partyOtherStyle ${otherClass}`).removeClass("partyNowStyle");
        }
    });

    let dot = $("#dot-footer-" + charId).find(".char-dot-base");

    let dotId = styleInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    var png = getImgPath(`dot/${pngName}.png`);

    dot.attr('style', `background: url(${png}) no-repeat; position: relative;`);
    var base = getImgPath(`icon/icon_base_${styleInfo['Rarity'].toLowerCase()}.png`);
    dot.parent().find(".dot-base-circle").attr("src", base);

    if (dot.length > 0) {
        animeReset(dot, "char-winner");
    }
}



function splitParam(input, initial) {
    k = (/,|\.|\s|\t|#|\+|\*/g);
    let tmp = input.split(k);

    for (let i = 0; i < 9; i++) {
        if (tmp[i] === undefined || tmp[i] === "") {
            tmp[i] = initial;
        }
    }
    return tmp;
}

function selectDotReset(charInfo) {
    $(".dot" + charInfo['DotId'])
        .removeClass('char-winner2')
        .addClass('char-aruku-left2')
        .find(".series-button").text(charInfo['Series']);
}
function selectDotHensei(charInfo) {
    $(".dot" + charInfo['DotId'])
        .removeClass('char-aruku-left2')
        .removeClass('char-loser2')
        .addClass('char-winner2')
        .find(".series-button").text('編成中');
}

function getNowUnixtime() {
    var date = new Date();
    // UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
    return Math.floor(date.getTime() / 1000);    
}


/*****************************************
 * 錬成関連 start
 *****************************************/

var OPTION_LIST = ["力","体","器","速","知","火","水","土","風","光","闇"];
function createRenseiTable(charId) {
    var $parent = $(".charTmpl" + charId).parents(".charTableParent");
    var wp = $parent.attr("data-weapon");
    var hasRensei = MY_RENSEI_LIST_UNLOADED;
    for(w of wp.split(",")) {
        if(MY_RENSEI_LIST[w] == undefined){
            hasRensei = true;
            break;
        }
    }
    var weapon = null;
    $parent.find(".CHECK_COVER").each(function(){
        var wp = $(this).parent().attr("data-type");
        if(!$(this).hasClass("icon_nocheck")) {
            weapon = wp;
            return;
        }
    });
    var charRensei = $(".charTmpl" + charId).attr("data-rensei");
    if(typeof charRensei == "undefined" || charRensei != weapon) {
        hasRensei = false;
    }

    // 錬成読み込まれてない時は
    if(hasRensei) {
        $(".charTmpl" + charId).find(".NOW_LOADING").removeClass("d-none");
        $(".charTmpl" + charId).find(".RENSEI_CHANGE").addClass("d-none");
        $(".charTmpl" + charId).find(".RENSEI_CARD").addClass("d-none");
    } else if(weapon != null){
        // 錬成エリア作成
        resetRenseiCard($parent);
        [allList, multiList, singleList] = getBestRenseiWeapon($parent, weapon);
        $(".charTmpl" + charId).find(".NOW_LOADING").addClass("d-none");
        $(".charTmpl" + charId).find(".RENSEI_CHANGE").removeClass("d-none");
        $(".charTmpl" + charId).find(".RENSEI_BASE1").removeClass("d-none");
        $(".charTmpl" + charId).find(".RENSEI_BASE2").removeClass("d-none");
        $(".charTmpl" + charId).find(".RENSEI_BASE3").removeClass("d-none");
        createRenseiCard(allList, $(".charTmpl" + charId), "BASE");
        createRenseiCard(singleList, $(".charTmpl" + charId), "SINGLE");
        createRenseiCard(multiList, $(".charTmpl" + charId), "ALL");
        $(".charTmpl" + charId).attr("data-rensei", weapon);
        //createRenseiCard(multiList);
        //createRenseiCard(singleList);
    }
}
function createRenseiCard(list, $target, $range) {
    for(idx in list) {
        rensei = list[idx];
        i = Number(idx) + 1;
        $target.find(`.RENSEI_${$range}${i}`).find(`.ICON`).append(getWeaponIcon("S", ICON_NAME[rensei['wp']], ""));
        $target.find(`.RENSEI_${$range}${i}`).find(`.TOTAL_PER`).append(rensei['total']);
        if(typeof rensei['option'] == "undefined") {
            $target.find(`.RENSEI${i}`).find(".OPTION_LABEL").addClass("d-none");
        } else {
            $target.find(`.RENSEI${i}`).find(".OPTION_LABEL").html(OPTION_LIST[rensei['option']] + "+");
        }
        addAbilityCol($target.find(`.RENSEI_${$range}${i}`).find(`.AB1`), rensei, 1);
        addAbilityCol($target.find(`.RENSEI_${$range}${i}`).find(`.AB2`), rensei, 2);
        addAbilityCol($target.find(`.RENSEI_${$range}${i}`).find(`.AB3`), rensei, 3);
        if(idx >= 2) {
            break;
        }
    }
}
function addAbilityCol($tr, rensei, no) {
    rare = rensei[`ab${no}R`].toLowerCase();
    attrs = RENSEI_ATTRS[rensei[`ab${no}`]];
    //"A": {"Name":"威力+", "Type":"All", "Target": "None", "A":9, "S":18,"SS":27},
    $tr.find(".icon_rare_xx").addClass(`icon_rare_${rare}`);
    $tr.find(".font-xx").addClass(`font-${rare}`);
    $tr.find(".AB_NAME").append(`${attrs['Name']}`);
    $tr.find(".AB_PER").append(`${attrs[rensei[`ab${no}R`]]}`);
    return $tr;
}
/*****************************************
 * 錬成関連 end
 *****************************************/
