var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_CHAR = {};
var NOW_STYLE = {};
var CHAR_MASTER, STYLE_MASTER;

var NOW_PARTY = 0;
var PARTY_LIST = [[]];
var BASE = 45;

$(document).ready(function ($) {
    $('.tab-content').on('click', function(){});
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            var uiConfig = {
                // ログイン完了時のリダイレクト先
                signInSuccessUrl: 'https://nao-romasaga.github.io/party.html',
                // 利用する認証機能
                signInOptions: [
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID
                ],
            };
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        } else {
            $(".noLogin").hide();
            $(".isLogin").removeClass("d-none");
            $("#loginInfo").hide();
            let icon = $("<img>").attr("src", user.photoURL)
                    .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
            let name = `${user.displayName} さん:ログイン中`;
            $("#firebaseui-auth-container").addClass("bg-white kadomaru")
                    .append(icon).append(name);
        }
    });
    $('[data-toggle="tooltip"]').tooltip();

    readFile('Char', function (result) {
        CHAR_MASTER = result;
        dispChar(CHAR_MASTER);
        $("#charData").show();
        readPartyData(function (result) {
            if (result === null) {
                return;
            }
            PARTY_LIST = result;
            // 初期表示のパーティは0固定かな？
            for (let data of result[0]) {
                console.log(data);
                let charId = data['char'];
                let styleId = data['style'];
                NOW_CHAR = CHAR_MASTER[charId];
                selectDotHensei(CHAR_MASTER[charId]);
                readCharData(charId, function (r) {
                    // キャラクター情報表示
                    displayCharInfo(CHAR_MASTER[charId], r);
                    // スタイル初期表示
                    displayStyleInfo(charId, styleId);
                    // 入力エリアは初期表示は消す
                    closeInput(charId);
                });
            }
        });
        //$("#PARTY1").sortable();
        $('[data-toggle="tooltip"]').tooltip();
    });
    readFile('Style', function (result) {
        STYLE_MASTER = result;
    });

    initialHide();

    $(document).on('click', '.openMenu, .nowData > td', function () {
        let charId = ($(this).attr("data-id") !== undefined) ? $(this).attr("data-id") : $(this).parent().attr("data-id");
        NOW_CHAR = CHAR_MASTER[charId];
        $('.inputArea').slideDown(500).addClass('d-none');
        $(".charTmpl" + charId).find('.inputArea').removeClass('d-none').slideDown(500);
        $(".LIMIT").attr("style", "border:0px");

// ソートについては保留なのでコメントアウト
//        PARTY_LIST[NOW_PARTY] = [];
//        $(".ui-sortable").find(".charTable").each(function (idx, el) {
//            console.log(idx, $(el).attr("data-charId"));
//            PARTY_LIST[NOW_PARTY].push({
//                "char": $(el).attr("data-charId"),
//                "style": $(el).attr("data-styleId")
//            });
//        });
//        updatePartyDB();
    });

    $(document).on('click', '.btn_close', function () {
        closeInput($(this).attr("data-id"));
    });
    function closeInput(charId) {
        $(".LIMIT").attr("style", "border:0px");
        $(".charTmpl" + charId).find('.inputArea').slideUp(500).addClass('d-none');
    }

    // キャラクターとじる時
    $(document).on('click', '.charUnset', function () {
        let charId = $(this).attr("data-id");
        let charInfo = CHAR_MASTER[charId];
        selectDotReset(charInfo);
        $("#PARTY1").find(".charTmpl" + charId).remove();
        let idx = getCharFromPartyList(charId);
        if (idx !== -1) {
            PARTY_LIST[NOW_PARTY].splice(idx, 1);
        }
        updatePartyDB();
    });
    function getCharFromPartyList(charId) {
        console.log(PARTY_LIST[NOW_PARTY]);
        for (let key in PARTY_LIST[NOW_PARTY]) {
            if (PARTY_LIST[NOW_PARTY][key]['char'] === charId) {
                return key;
            }
        }
        return -1;
    }

    // キャラクタークリック時
    $(document).on('click', '.tab-content .char', function () {
        let charId = $(this).attr("data-id");
        let idx = getCharFromPartyList(charId);
        if (PARTY_LIST[NOW_PARTY].length === 5 || idx !== -1) {
            return;
        }

        // 初回でなければ開いている入力エリアは閉じる
        if (NOW_CHAR !== undefined) {
            closeInput(NOW_CHAR['Id']);
        }

        NOW_CHAR = CHAR_MASTER[charId];
        let styleId = NOW_CHAR['Holders'][0];
        NOW_STYLE = STYLE_MASTER[styleId];

        // パーティ登録
        PARTY_LIST[NOW_PARTY].push({
            "char": charId,
            "style": styleId
        });

        updatePartyDB();

        $(".styleInfoArea").show();
        selectDotHensei(NOW_CHAR);

        readCharData(charId, function (result) {
            // キャラクター情報表示
            displayCharInfo(CHAR_MASTER[charId], result);
            // スタイル初期表示
            displayStyleInfo(NOW_CHAR['Id'], styleId);
            //setSliderChart();
            $(".charTmpl" + charId).find('.inputArea').removeClass('d-none').slideDown(500);

            $("html,body").animate({scrollTop: $(".charTmpl" + charId).offset().top}, 500, 'swing');
        });
        //$("#PARTY1").sortable();
        $('[data-toggle="tooltip"]').tooltip();
    });

    // スタイルクリック時
    $(document).on('click', '.style', function () {
        let styleId = $(this).attr("data-id");
        NOW_STYLE = STYLE_MASTER[styleId];
        displayStyleInfo(NOW_CHAR['Id'], styleId);
        let idx = getCharFromPartyList(NOW_CHAR['Id']);
        PARTY_LIST[NOW_PARTY][idx]['style'] = styleId;
        updatePartyDB();
    });

    // パラメータ修正時
    $(document).on('change', '.charParam', function () {
        updateDB();
    });

    function updateDB() {
        let charId = NOW_CHAR['Id'];
        let update = {};
        for (let key of PARAM_KEY) {
            // TODO firstじゃなくて修正したところの値を拾う必要があるので、PARTYNoをあとで設定する
            let val = $(".charInput" + key + charId).first().val();
            $(".char" + key + charId).each(function (idx, el) {
                $(el).text(val);
            });
            NOW_CHAR[key] = Number(val);
            update[key] = Number(val);
        }
        setLimitData();
        updateData("CHAR", {[NOW_CHAR['Id']]: update});
    }
    function updatePartyDB() {
        updateData("PARTY", PARTY_LIST);
    }
    $(document).on('click', '.hanei', function () {
        showModal($(this).parent().find(".allparams"));
    });

    $(document).on('change', '.allparams', function () {
        showModal($(this));
    });
    function showModal(allparams) {
        $("#allSubmit").attr("data-input", $(allparams).val());
        $("#allSubmit").attr("data-charId", $(allparams).attr("data-id"));

        let input = splitParam($(allparams).val(), "不明");
        let output = "";
        output += `腕力: ${input[0]} 体力:${input[1]}<br>`;
        output += `器用さ: ${input[2]} 素早さ:${input[3]}<br>`;
        output += `知力: ${input[4]} 精神:${input[5]}<br>`;
        output += `　愛: ${input[6]} 魅力:${input[7]}<br>`;
        output += "が入力されました<br>";
        output += "この内容を反映してもよろしいですか？";

        $("#allParamConfirm").html(output);
        $("#modal01").fadeIn();
        $("#allParamConfirmInner").css("animation", "modal 0.5s forwards");
        return false;
    }

    $(".modalClose").click(function () {
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
        $("#allParamConfirmInner").css("animation", "modalClose 0.5s forwards");
        return false;
    });
    $(".baseValue").click(function () {
        $(".baseValue").each(function () {
            $(this).removeClass("icon_btn_off");
            $(this).addClass("icon_btn_on");
        });
        $(this).addClass("icon_btn_off");
        BASE = Number($(this).attr("data-id"));
        setLimitData();
    });

    function setLimitData() {
        $(".LIMIT").each(function () {
            let styleId = $(this).attr("data-styleId");
            let styleInfo = STYLE_MASTER[styleId];
            let tr = $(".limit" + styleId);
            let charId = tr.attr("data-charId");
            for (let key of PARAM_KEY) {
                let limit = styleInfo['Limit' + key];
                let limitValue = (styleInfo['Limit' + key] !== 99)
                        ? BASE + Number(limit) - Number(CHAR_MASTER[charId][key])
                        : "?";
                tr.find("." + key).each(function () {
                    $(this).removeClass("status_plus").removeClass("status_minus");
                    if (limitValue === "?") {
                    } else if (limitValue > 0) {
                        $(this).addClass("status_plus");
                    } else if (limitValue < 0) {
                        $(this).addClass("status_minus");
                    }
                    $(this).text(limitValue);
                });

            }
        });
    }

});

function initialHide() {
    $("#charData").hide();
    $(".tabArea").hide();
    $(".styleInfoArea").hide();
}


// キャラクタークリック時
function displayCharInfo(charInfo, myData) {
    let charId = charInfo['Id'];
    let charBaseTmpl = $("#CHAR_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("charTmpl" + charId)
            .attr("data-charId", charId);
    charBaseTmpl.find(".darkButton").html(charInfo['Name']);
    charBaseTmpl.find(".icon_btn_on").attr("data-id", charId);
    charBaseTmpl.find(".charUnset").attr("data-id", charId);
    charBaseTmpl.find(".openMenu").attr("data-id", charId);
    charBaseTmpl.find(".char").parent().attr("data-id", charId);
    charBaseTmpl.find(".allparams").attr("data-id", charId);


    let dotId = charInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    charBaseTmpl.find(".dot_mid").attr('style', getImgUrl('dot/' + pngName + ".png") + " margin-left:20px;");
    // ステータス反映。初回はデフォルト値(+45)を入れる
    if (myData !== null) {
        for (let key of PARAM_KEY) {
            charInfo[key] = Number(myData[key]);
        }
    } else if (myData === null) {
        for (let key of PARAM_KEY) {
            charInfo[key] = Number(charInfo[key]) + 45;
        }
    }

    let nowInput = charBaseTmpl.find(".nowData");
    nowInput.attr("data-id", charId);
    for (let key of PARAM_KEY) {
        charBaseTmpl.find(".char" + key).removeClass("char" + key).addClass("charInput" + key + charId).val(charInfo[key]);
        nowInput.find("." + key).removeClass("char" + key).addClass("char" + key + charId).text(charInfo[key]);
    }

    // 所持スタイルの表示。選択部分とリミット部分
    for (let styleId of charInfo['Holders']) {
        let styleInfo = STYLE_MASTER[styleId];
        // スタイルアイコンの追加
        let icon = $("<button>").addClass("style")
                .addClass(getStyleIconClass(styleInfo['Rarity']))
                .attr("style", getImgUrl('style_icon/' + styleId + ".png"))
                .attr("data-id", styleId);
        let background = $("<span>")
                .addClass(getStyleIconBgClass(styleInfo['Rarity']))
                .append(icon);
        charBaseTmpl.find(".STYLE_ICON").append(background);

        let tr = $("#LIMIT_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("LIMIT limit" + styleId)
                .attr("data-styleId", styleId).attr("data-charId", charId)
                ;
        tr.find(".rare").attr("src", "./img/icon/icon_" + styleInfo['Rarity'] + ".png");
        tr.find(".icn").attr("src", "./img/style_icon/" + styleId + ".png");
        for (let key of PARAM_KEY) {
            let limit = styleInfo['Limit' + key];
            if (limit === 99) {
                tr.find("." + key).text("?");
            } else {
                let limitValue = BASE + Number(limit) - Number(charInfo[key]);
                tr.find("." + key).text(limitValue);
                if (limitValue > 0) {
                    tr.find("." + key).addClass("status_plus");
                } else if (limitValue < 0) {
                    tr.find("." + key).addClass("status_minus");
                }
            }
        }
        charBaseTmpl.append(tr);
    }
    $("#PARTY1").append(charBaseTmpl);
}

// スタイルクリック時
function displayStyleInfo(charId, styleId) {
    $(".charTmpl" + charId).attr("data-styleId", styleId);
    // TODO 複数パーティの場合はここを直す必要がある
    $(".charTmpl" + charId).find(".style").each(function () {
        let subStyleId = $(this).attr("data-id");
        $(this).parent().addClass("opacity_nocheck");
        if (styleId === subStyleId) {
            $(this).parent().removeClass("opacity_nocheck");
            return;
        }
    });
    $(".charTmpl" + charId).find(".LIMIT").each(function () {
        if ($(this).hasClass("limit" + styleId)) {
            $(this).removeClass("inputArea").attr("style", "border: 1px solid #faf0b4");
        } else {
            $(this).addClass("inputArea").attr("style", "border: 0px");
        }
    });

    let styleInfo = STYLE_MASTER[styleId];
    let dotId = styleInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    let dot = $(".charTmpl" + charId).find(".char");
    dot.attr('style', getImgUrl('dot/' + pngName + ".png") + " margin-left:20px;");
    animeReset(dot, "char-winner");
}


function getSmallIcon(styleInfo) {
    // スタイルアイコンの追加
    let icon = $("<button>")
            .addClass(getStyleIconClass(styleInfo['Rarity']) + "_small")
            .attr("style", getImgUrl('style_icon/' + styleInfo['Id'] + ".png"))
    let background = $("<span>").addClass(getStyleIconBgClass(styleInfo['Rarity']))
            .attr("style", "height: 30px;")
            .append(icon);
    return background;
}

function setSliderChart() {
    let option = {
        buttons: true, //スライダーのページャを表示する
        startSlide: 0, //最初のスライドを指定する
        arrows: true, //左右の矢印ボタンを表示する
        width: '100%', //横幅を設定する
        //height: 300, //高さを設定する
        autoHeight: true, //高さを設定する
        autoplay: false, //自動再生の設定
        loop: true, //スライドをループさせる設定
        visibleSize: '100%', //前後のスライドを表示するかの設定
        //forceSize: 'fullWidth' //スライダーの幅をブラウザ幅に設定する
    };
    //option['height'] = (device === "sp") ? 310 : 250;
    $('#slider-pro-party').sliderPro(option);
}



function splitParam(input, initial) {
    k = (/,|\.|\s|\t/g);
    let tmp = input.split(k);

    if (tmp.length === 1) {
        tmp[0] = input.substr(0, 2);
        tmp[1] = input.substr(2, 2);
        tmp[2] = input.substr(4, 2);
        tmp[3] = input.substr(6, 2);
        tmp[4] = input.substr(8, 2);
        tmp[5] = input.substr(10, 2);
        tmp[6] = input.substr(12, 2);
        tmp[7] = input.substr(14, 2);
    }
    for (let i = 0; i < 8; i++) {
        if (tmp[i] === undefined || tmp[i] === "") {
            tmp[i] = initial;
        }
    }
    return tmp;
}
function selectDotReset(charInfo) {
    $("#dot" + charInfo['DotId'])
            .removeClass('char-winner')
            .addClass('char-aruku')
            .find(".series-button").text(charInfo['Series']);
}
function selectDotHensei(charInfo) {
    $("#dot" + charInfo['DotId'])
            .removeClass('char-aruku')
            .addClass('char-winner')
            .find(".series-button").text('編成中');
}