var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_CHAR = {};
var NOW_STYLE = {};
var CHAR_MASTER, STYLE_MASTER = [];

var NOW_PARTY = 0;
var PARTY_LIST = [[]];
var BASE = 58;
var UID;
var dotStyle = " margin-left:0px; position: relative; bottom: -20px;";
$(document).ready(function ($) {
    $(document).on('change', '.roleClass', function () {
        console.log($(this).val(), $(this).parent().attr("data-id"));
        console.log($(this).parentsUntil(".charTable"));
        console.log($(this).parentsUntil(".charTable").find(".role"));
        $(this).parentsUntil(".charTable").find(".role").html(`<i class="fas fa-${$(this).val()}"></i>`);
    });

    $(".icon_jinkei").click(function () {
        let jinkei = $(this).attr("data-id");
        console.log($("#JINKEI").attr("class"), jinkei);
        $("#JINKEI").children().slideUp(300, function () {
            $("#JINKEI").attr("class", jinkei);
        });
        $("#JINKEI").children().slideDown(300);
    });
    Sortable.create(JINKEI, {
        animation: 500,
        onChoose: function (evt) {
            console.log(evt.item);
            console.log($(evt.item).find(".char"));
            console.log("onChoose", evt.oldIndex);
            $(evt.item).find(".char").removeClass("char-winner").addClass("char-damage");
        },
        // Element dragging ended
        onEnd: function (evt) {
            $(evt.item).find(".char").removeClass("char-damage").addClass("char-winner");

            let num = 1;
            $("#JINKEI").find(".series-button").each(function () {
                $(this).text(num++);
            });
            let newParty = [];
            let nowParty = PARTY_LIST[NOW_PARTY];
            $("#JINKEI").find(".char").each(function () {
                let cId = $(this).attr('data-charId');
                for(let i in nowParty){
                    if(nowParty[i]['char'] === cId){
                        newParty.push(Object.assign({},nowParty[i]));
                    }
                }
            });
            PARTY_LIST[NOW_PARTY] = newParty;
            console.log(PARTY_LIST[NOW_PARTY]);
            updatePartyDB();
            console.log("onEnd");
        },
        onSort: function (/**Event*/evt) {
            console.log("onSort", evt);
            // same properties as onEnd
        },
        // Called when dragging element changes position
        onChange: function (/**Event*/evt) {
            console.log("onChange", evt.newIndex) // most likely why this event is used is to get the dragging element's current index
            // same properties as onEnd
        },
    });

    initialHide();

    $('.tab-content').on('click', function () {});
    $(document).on('click', '.paramButton', function () {
        let input = $(this).parent().find(".charParam");
        let add = ($(this).attr("data-pm") === "plus") ? 1 : -1;
        let org = input.val();
        input.val(Number(org) + add);
        updateDB();
    });
    // パラメータ修正時
    $(document).on('change', '.charParam', function () {
        updateDB();
    });


    firebase.auth(appUsers).onAuthStateChanged((user) => {
        if (!user) {
            var uiConfig = {
                // ログイン完了時のリダイレクト先
                signInSuccessUrl: 'https://nao-romasaga.github.io/party.html',
                // 利用する認証機能
                signInOptions: [
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID
                ],
            };
            var ui = new firebaseui.auth.AuthUI(firebase.auth(appUsers));
            ui.start('#firebaseui-auth-container', uiConfig);
        } else {
            UID = user.uid;
            $(".noLogin").hide();
            $(".isLogin").removeClass("d-none");
            $("#loginInfo").hide();
            let icon = $("<img>").attr("src", user.photoURL)
                    .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
            let name = `${user.displayName} さん:ログイン中`;
            $("#firebaseui-auth-container").addClass("bg-white kadomaru")
                    .append(icon).append(name);

            readPartyData(function (result) {
                if (result === null) {
                    return;
                }
                PARTY_LIST = result;
                partyFlg = true;
                if (charFlg && partyFlg) {
                    renderParty();
                }
            });
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
    let charFlg = false, partyFlg = false;
    readFile('Char', function (result) {
        CHAR_MASTER = result;
        dispChar(CHAR_MASTER);
        $("#charData").show();
        charFlg = true;
        if (charFlg && partyFlg) {
            renderParty();
        }
        $('[data-toggle="tooltip"]').tooltip();
    });

    $(document).on('click', '.openMenu, .nowData > td', function () {
        setLimitData();
        let charId = ($(this).attr("data-id") !== undefined) ? $(this).attr("data-id") : $(this).parent().attr("data-id");
        NOW_CHAR = CHAR_MASTER[charId];
        let openFlg = ($(".charTmpl" + charId).find('.inputArea').first().hasClass('d-none'));
        $('.inputArea').slideDown(500).addClass('d-none');
        if (openFlg) {
            $(".charTmpl" + charId).find('.inputArea').removeClass('d-none').slideDown(500);
        } else {
            $(".charTmpl" + charId).find('.inputArea').addClass('d-none').slideUp(500);
        }
        $(".LIMIT").attr("style", "border:0px");
    });
    function renderParty() {
        // 初期表示のパーティは0固定かな？
        let idx = 0;
        let data = PARTY_LIST[0][idx];
        while (data !== undefined ) {
            let charId = data['char'];
            let styleId = data['style'];
            NOW_CHAR = CHAR_MASTER[charId];
            //console.log(PARTY_LIST, CHAR_MASTER[charId]);
            selectDotHensei(CHAR_MASTER[charId]);
            readCharData(charId, async function (r) {
                // キャラクター情報表示
                await displayCharInfo(CHAR_MASTER[charId], r);
                // スタイル初期表示
                await displayStyleInfo(charId, styleId);
                // 入力エリアは初期表示は消す
                closeInput(charId);
            });
            data = PARTY_LIST[0][++idx];
        }
        setLimitData();
    }

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
        $("#PARTY").find(".charTmpl" + charId).remove();
        let idx = getCharFromPartyList(charId);
        if (idx !== -1) {
            PARTY_LIST[NOW_PARTY].splice(idx, 1);
        }
        updatePartyDB();
    });
    function getCharFromPartyList(charId) {
        for (let key in PARTY_LIST[NOW_PARTY]) {
            if (PARTY_LIST[NOW_PARTY][key]['char'] === charId) {
                return key;
            }
        }
        return -1;
    }

    // キャラクタークリック時
    $(document).on('click', '.tab-content .char', async function () {
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
        NOW_STYLE = await getStyleInfo(styleId);

        // パーティ登録
        PARTY_LIST[NOW_PARTY].push({
            "char": charId,
            "style": styleId
        });

        updatePartyDB();

        $(".styleInfoArea").show();
        selectDotHensei(NOW_CHAR);

        readCharData(charId, async function (result) {
            // キャラクター情報表示
            await displayCharInfo(CHAR_MASTER[charId], result);
            // スタイル初期表示
            await displayStyleInfo(NOW_CHAR['Id'], styleId);
            //setSliderChart();
            $(".charTmpl" + charId).find('.inputArea').removeClass('d-none').slideDown(500);
            $("html,body").animate({scrollTop: $(".charTmpl" + charId).offset().top}, 500, 'swing');
            setLimitData();
        });
        $('[data-toggle="tooltip"]').tooltip();
    });

    // スタイルクリック時
    $(document).on('click', '.style', async function () {
        let styleId = $(this).attr("data-id");
        NOW_STYLE = await getStyleInfo(styleId);
        await displayStyleInfo(NOW_CHAR['Id'], styleId);
        let idx = getCharFromPartyList(NOW_CHAR['Id']);
        PARTY_LIST[NOW_PARTY][idx]['style'] = styleId;
        updatePartyDB();
    });

    function updateDB() {
        let charId = NOW_CHAR['Id'];
        let update = {};
        for (let key of PARAM_KEY_HP) {
            // TODO firstじゃなくて修正したところの値を拾う必要があるので、PARTYNoをあとで設定する
            let val = $(".charInput" + key + charId).first().val();
            $(".char" + key + charId).each(function (idx, el) {
                $(el).text(val);
            });
            NOW_CHAR["NOW" + key] = Number(val);
            update[key] = Number(val);
        }
        setLimitData();
        //console.log(update);
        updateData(`CHAR/${NOW_CHAR['Id']}`, update);
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

    $(".modalClose").click(function () {
        if ($(this).attr("data-id") === "ok") {
            let id = $(this).attr("data-charId");
            let input = splitParam($(this).attr("data-input"), 0);
            for (let i in input) {
                $(".charInput" + PARAM_KEY_HP[i] + id).each(function (idx, el) {
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
        $(".LIMIT").each(async function () {
            let styleId = $(this).attr("data-styleId");
            let styleInfo = await getStyleInfo(styleId);
            let tr = $(".limit" + styleId);
            let charId = tr.attr("data-charId");
            let sum = 0;
            for (let key of PARAM_KEY) {
                let limit = styleInfo['Limit' + key];
                let val = (CHAR_MASTER[charId]["NOW" + key] !== undefined) ? CHAR_MASTER[charId]["NOW" + key] : CHAR_MASTER[charId][key];
                sum += val;
                let limitValue = (styleInfo['Limit' + key] !== 99)
                        ? BASE + Number(limit) - Number(val)
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
            let avg = (sum - 369) / 8;
            let dAvg = "+" + avg;
            if (sum === 369) {
                dAvg = 0;
            } else if (avg < 0) {
                dAvg = avg
            }
            let reco = "遠征";
            if (avg >= 9) {
                reco = "VH11(最大:+13)"; // 9~13
            } else if (avg > 5) {
                reco = "VH10(最大:+11)"; // 5~9
            } else if (avg > 0) {
                reco = "VH9(最大:+9)";
            } else if (avg > -3) {
                reco = "VH415(最大:+0)";
            } else if (avg > -6) {
                reco = "H712(最大:-2)";
            }
            //console.log($(".SUM" + charId), sum, ((sum - 369) / 8));
            $(".SUM" + charId).text(sum);
            $(".AVG" + charId).text(dAvg);
            $(".RECO" + charId).text(reco);
        });
    }

});

function initialHide() {
    $("#charData").hide();
    $(".tabArea").hide();
    $(".styleInfoArea").hide();
}

// キャラクタークリック時
async function displayCharInfo(charInfo, myData) {
    let charId = charInfo['Id'];
    let charBaseTmpl = $("#CHAR_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("charTmpl" + charId)
            .attr("data-charId", charId);
    charBaseTmpl.find(".charName").html(charInfo['Name']);
    charBaseTmpl.find(".icon_btn_on").attr("data-id", charId);
    charBaseTmpl.find(".charUnset").attr("data-id", charId);
    charBaseTmpl.find(".openMenu").attr("data-id", charId);
    charBaseTmpl.find(".char").parent().attr("data-id", charId);
    charBaseTmpl.find(".allparams").attr("data-id", charId);
    charBaseTmpl.find(".SUM").attr("data-id", charId).addClass("SUM" + charId);
    charBaseTmpl.find(".AVG").attr("data-id", charId).addClass("AVG" + charId);
    charBaseTmpl.find(".RECO").attr("data-id", charId).addClass("RECO" + charId);
    charBaseTmpl.find("#insotsu").parent().attr("data-id", charId);
    charBaseTmpl.find("#insotsu").attr("id", "insotsu" + charId).attr("name", "roleType" + charId);
    charBaseTmpl.find("#baby").attr("id", "baby" + charId).attr("name", "roleType" + charId);
    charBaseTmpl.find(".insotsuLabel").attr("for", "insotsu" + charId);
    charBaseTmpl.find(".babyLabel").attr("for", "baby" + charId);

    let dotId = charInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    let dotSrc = getImgUrl('dot/' + pngName + ".png") + dotStyle;
    charBaseTmpl.find(".dot_mid").attr('style', dotSrc);
    // ステータス反映。初回はデフォルト値(+35)を入れる
    if (myData !== null) {
        for (let key of PARAM_KEY_HP) {
            charInfo["NOW" + key] = Number(myData[key]);
        }
    } else if (myData === null) {
        for (let key of PARAM_KEY) {
            charInfo["NOW" + key] = Number(charInfo[key]) + 35;
        }
    }

    let nowInput = charBaseTmpl.find(".nowData");
    nowInput.attr("data-id", charId);
    for (let key of PARAM_KEY_HP) {
        charBaseTmpl.find(".char" + key).removeClass("char" + key).addClass("charInput" + key + charId).val(charInfo["NOW" + key]);
        nowInput.find("." + key).removeClass("char" + key).addClass("char" + key + charId).text(charInfo["NOW" + key]);
    }

    // 所持スタイルの表示。選択部分とリミット部分
    for (let styleId of charInfo['Holders']) {
        let styleInfo = await getStyleInfo(styleId);
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
                let limitValue = BASE + Number(limit) - Number(charInfo["NOW" + key]);
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
    let num = $("#JINKEI").children().length + 1;
    let label = `<p class="series-button text-center" style="width:30px; margin-bottom:0px;">${num}</p>`;
    let dot = `<span class="char-winner char dot_mid dot" style="${getImgUrl('dot/' + pngName + ".png")}" data-charId='${charId}' data-styleId=''></span>`;
    $("#JINKEI").append($("<div>").append(label + dot));
    $("#PARTY").append(charBaseTmpl);
}
// スタイルクリック時
async function displayStyleInfo(charId, styleId) {
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

    let styleInfo = await getStyleInfo(styleId);
    let dotId = styleInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    let dot = $(".charTmpl" + charId).find(".char");
    dot.attr('style', getImgUrl('dot/' + pngName + ".png") + dotStyle);
    if (dot.length > 0) {
        animeReset(dot, "char-winner");
    }
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
        tmp[0] = input.substr(0, 3);
        tmp[1] = input.substr(3, 2);
        tmp[2] = input.substr(5, 2);
        tmp[3] = input.substr(7, 2);
        tmp[4] = input.substr(9, 2);
        tmp[5] = input.substr(11, 2);
        tmp[6] = input.substr(13, 2);
        tmp[7] = input.substr(15, 2);
        tmp[8] = input.substr(17, 2);
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
