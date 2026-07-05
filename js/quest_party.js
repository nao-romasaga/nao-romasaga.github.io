const v = 1.02;
var MAX_TEXT = 200;
var PARTY_DATA = {
    "quest_lv": "",
    "quest": "",
    "party": [],
    "jinkei": "1058",
};
var USER_PARTY_LIST = [];
var SEARCH_DATA = {
    "quest_lv": "",
    "quest": "",
    "jinkei": "",
    "my": 0,
};

var UID;
var dotStyle = " margin-left:0px; position: relative; bottom: -20px;";
var QUEST_NAME = {
    "tobatsu":{
        "Name": "討伐",
        "QUEST" : ["アンルー",""],
    },
    "rasen" :{
        "Name": "螺旋回廊",
        "QUEST": [350, 310],
    },
    "gento": {
        "Name": "追憶の幻闘場",
        "QUEST": {
            5:"ビーナス",
            4:"ブッチャー",
            3:"カエル戦士",
            2:"道を塞ぐ者",
            1:"メガリスドラゴン"
        }
    }
};


function _noLoginInitial() {
    var uiConfig = {
        // ログイン完了時のリダイレクト先
        signInSuccessUrl: 'https://nao-romasaga.github.io/robin.html',
        // 利用する認証機能
        signInOptions: [
            firebase.auth.TwitterAuthProvider.PROVIDER_ID
        ],
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth(appUsers));
    ui.start('#firebaseui-auth-container', uiConfig);
}
async function _initial() {
    $(".isLogin").removeClass("d-none");
    for (let q in QUEST_NAME["gento"]["QUEST"]) {
        //$("#QUEST").append(`<option value="${q}">${QUEST_NAME[q]['Name']}</option>`);
        $("#QUEST_SEARCH").append(`<option value="${q}">${QUEST_NAME["gento"]["QUEST"][q]}</option>`);
    }

    let icon = $("<img>").attr("src", USER.photoURL)
            .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
    let name = `${USER.displayName} さん:ログイン中`;
    $("#firebaseui-auth-container").addClass("bg-white kadomaru")
            .append(icon).append(name);
    await init();
}

MY_STYLE = [];
async function init() {
    $(".noLogin").hide();
    console.log("slide up");
    //$("#INPUT_ZONE").slideUp();
    $("#SEARCH_ZONE").slideUp();
    $("#SAVE_SUCCESS").slideUp(300);

    dispChar2(CHAR_MASTER);
    $("#charData").show();
    $('[data-toggle="tooltip"]').tooltip();
    let myCharFunc = readStyleCheckData(UID, function (result) {
        console.log(result);
        $("#mySS").text((result["SS"] !== undefined ? result["SS"].length : 0) + "体");
        $("#myS").text((result["S"] !== undefined ? result["S"].length : 0) + "体");
        $("#myA").text((result["A"] !== undefined ? result["A"].length : 0) + "体");
        for (let i in result) {
            if(i == "timestamp") continue;
            for (let styleId of result[i]) {
                MY_STYLE.push(styleId);
            }
        }
    });

    await Promise.all([myCharFunc]);
    let REF = databaseUser.ref("robin_data/");
    REF
            .orderByChild('time').limitToFirst(20)
            .once('value', function (snapshot) {
                displayParty(snapshot.val());
            });
    $(".initialHide").removeClass("d-none");
    $(".initialShow").slideUp();
}
$(document).on('click', '#tabInput', function () {
    $(".setsumi").hide();
    $("#tabInput").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#tabSearch").addClass("style-tab-disabled").removeClass("style-tab-active");
    // $("#SEARCH_ZONE").slideUp(300, function () {
    //     $("#INPUT_ZONE").slideDown(300);
    // });
});
$(document).on('click', '#tabSearch', function () {
    $(".setsumi").hide();
    $("#tabSearch").removeClass("style-tab-disabled").addClass("style-tab-active");
    $("#tabInput").addClass("style-tab-disabled").removeClass("style-tab-active");
    // $("#INPUT_ZONE").slideUp(300, function () {
    //     $("#SEARCH_ZONE").slideDown(300);
    // });
});

function closeInput() {
    $(".fukidashiInput").each(function () {
        $(this).slideUp(250)
    });
}

function reSortPartyData(target) {
    let newParty = [];
    let nowParty = PARTY_DATA["party"];
    target.each(function () {
        let cId = $(this).attr('data-charId');
        for (let i in nowParty) {
            if (nowParty[i]['char'] === cId) {
                newParty.push(Object.assign({}, nowParty[i]));
            }
        }
    });
    PARTY_DATA["party"] = newParty;
    checkSave();
}

function reSortVertical() {
    // PARTY_DATAの通りにverticalを並べ直す
    var $charList = {};
    $("#JINKEI_VERTICAL").children().each(function () {
        $charList[$(this).attr("data-charId")] = $(this).clone();
        $(this).remove();
    });
    for (let i = 0; i < PARTY_DATA["party"].length; i++) {
        $("#JINKEI_VERTICAL").append($charList[PARTY_DATA["party"][i]["char"]]);
    }
    $("#JINKEI_VERTICAL").find(".formation-area2").each(function(i, el){
        $(el).find(".f-pos").removeClass("myPos");
        $(el).find(`.pos${i+1}`).addClass("myPos");
    });
};

function reSortFormationDot() {
    var charList = {};
    $("#JINKEI").children().each(function () {
        charList[$(this).find(".char").attr("data-charId")] = $(this).clone();
        $(this).remove();
    });
    for (let i = 0; i < PARTY_DATA["party"].length; i++) {
        let cId = PARTY_DATA["party"][i]["char"];
        $("#JINKEI").append(charList[cId]);
    }

    let num = 1;
    $("#JINKEI").find(".series-button").each(function () {
        $(this).text(num++);
    });
}
;

async function displayParty(data) {
    for (let i in data) {
        let p = data[i]['party'];
        try {
            data[i]['party'] = JSON.parse(p);
        } catch (e) {
        }
        await setPartyList(i, data[i]);
    }
}

$(document).ready(function ($) {
    $(".challenge-div").addClass("d-none");
    $(".challenge-div.rasen").removeClass("d-none");
    
    for(step of Object.keys(RASEN_STEP).reverse()) {
        $("#rasen-step").append($('<option>').html(`${step}階 ${RASEN_STEP[step]}`).val(step));
    }
    for(step of Object.keys(GENTO_STEP)) {
        $("#gento-step").append($('<option>').html(`${GENTO_STEP[step]}`).val(step));
    }

    displayFilteredFormation(data_FORMATION.reverse());

    $(".filterList").click(function () {
        $(".dotList").addClass("d-none");
        let value = $(this).attr("data-href");
        $("#_SEC" + value).removeClass("d-none");
        if (!$(this).find(".fButton").hasClass("filterActive")) {
            // 絞り込み
            $(".filterList").each(function () {
                $(this).find(".fButton").removeClass("filterActive");
            });
            $(this).find(".fButton").toggleClass("filterActive");
        }
    });

    // 陣形クリック
    $(document).on('click', '.FORMATION_ICON', function () {
        $(".formation-selected").each(function () {
            $(this).slideUp(300, function () {
                $(this).addClass("d-none");
            });
            $(this).slideDown(300);
        });
        let jinkei = $(this).attr("id");
        PARTY_DATA["jinkei"] = jinkei;
        $(`#JINKEI`).attr('class', `formation-${jinkei}`);

        //const BIG_MAP = 5.5;
        $("#JINKEI").children().slideUp(300, function() {
            // $("#JINKEI").children().each(function (i, el) {
            //     let top = Number(formation['Pos'][i]['y']);
            //     let left = Number(formation['Pos'][i]['x']);
            //     $(el).attr("style", `top: ${top * BIG_MAP}px; left: ${left * BIG_MAP}px;`);
            // });
        });
        $("#JINKEI").children().slideDown(300);

        let $formationDiv = $(this).clone().removeClass("flex-column");
        $formationDiv.find(".f-name").remove();

        $("#JINKEI_VERTICAL").find(".JINKEI_IMG").each(function (i, el) {
            $(el).html("");
            let $myFormation = $formationDiv.clone();
            let now = i+1;
            $myFormation.find(`.pos${now}`).addClass("myPos");
            $(el).append($myFormation);
        });
        $(this).find(".formation-selected").slideUp(300, function () {
            $(this).removeClass("d-none");
        });
        $(this).find(".formation-selected").slideDown(300);

    });

    Sortable.create(JINKEI, {
        animation: 500,
        onChoose: function (evt) {
            //console.log(evt.item);
            //console.log($(evt.item).find(".char"));
            //console.log("onChoose", evt.oldIndex);
            $(".JINKEI_CHAR").each(function () {
                $(this).removeClass("char-damage").addClass("char-winner");
            });
            $(evt.item).find(".char").removeClass("char-winner").addClass("char-damage");
        },
        // Element dragging ended
        onEnd: function (evt) {
            $(evt.item).find(".char").removeClass("char-damage").addClass("char-winner");

            reSortPartyData($("#JINKEI").find(".char"));
            reSortVertical();
            reSortFormationDot();

        },
        onSort: function (/**Event*/evt) {
            //console.log("onSort", evt);
            // same properties as onEnd
        },
        // Called when dragging element changes position
        onChange: function (/**Event*/evt) {
            //console.log("onChange", evt.newIndex) // most likely why this event is used is to get the dragging element's current index
            // same properties as onEnd
        },
    });
    Sortable.create(JINKEI_VERTICAL, {
        animation: 500,
        onChoose: function (evt) {
        },
        // Element dragging ended
        onEnd: function (evt) {
            reSortPartyData($("#JINKEI_VERTICAL").find(".vertical"));
            reSortVertical();
            reSortFormationDot();
        },
        onSort: function (/**Event*/evt) {
        },
        onChange: function (/**Event*/evt) {
        },
    });

    initialHide();

    $('.tab-content').on('click', function () {});

    $('[data-toggle="tooltip"]').tooltip();

    $(document).on('click', '.openMenu, .nowData > td, .btn_close', function () {
        let charId = $(this).parents(".charTable").attr("data-charId");
        $(".charTmpl" + charId).find(".fukidashiInput").slideToggle(250);
    });

    // キャラクターとじる時
    $(document).on('click', '.charUnset', function () {
        let charId = $(this).parents(".filter-bgcolor").attr("data-charid");
        charUnset(charId);
        reSortFormationDot();
    });

    function charUnset(charId) {
        let charInfo = CHAR_MASTER[charId];
        console.log(charId, charInfo);
        $(".charTmpl" + charId).parents(".charTableParent").slideUp(500);
        selectDotReset(charInfo);
        $("#PARTY").find(".charTmpl" + charId).remove();
        $(".JINKEI" + charId).remove();
        $(".party-parent-" + charId).remove();
        let idx = getCharIndexFromPartyList(charId);
        if (idx !== -1) {
            PARTY_DATA["party"].splice(idx, 1);
        }
        checkSave();
    }



    // クエスト難易度変更
    $("#QUEST").change(function () {
        let vh = $('#QUEST option:selected').val();
        PARTY_DATA["quest_lv"] = vh;
        checkSave();
    });
    // クエスト詳細変更
    $("#QUEST_CHOICE").change(function () {
        let vh = $('#QUEST_CHOICE option:selected').val();
        PARTY_DATA["quest"] = vh;
        checkSave();
    });
    // クエスト詳細変更
    $("#BATTLE_MODE").change(function () {
        let vh = $('#BATTLE_MODE option:selected').val();
        PARTY_DATA["mode"] = vh;
        checkSave();
    });


    // 保存ボタン
    $("#SAVE").click(function () {
        if ($(this).hasClass("icon_btn_on")) {
            let path = `robin_data`;
            let save = Object.assign({}, PARTY_DATA);
            save["party"] = JSON.stringify(PARTY_DATA["party"]);
            var date = new Date();
            save["time"] = Math.floor(date.getTime() / 1000) * -1;
            save["text"] = encodeURI($("#FREE_TEXT").val());
            save["quest"] = encodeURI(PARTY_DATA["quest"]);
            save["quest_lv"] = encodeURI(PARTY_DATA["quest_lv"]);
            addData(path, save);
            $(this).removeClass("icon_btn_on").addClass("icon_btn_off");
            $("#SAVE_SUCCESS").slideDown(300);
        }
    });
    
    // フリーテキスト入力時
    $("#FREE_TEXT").keyup(function () {
        $("#nowtext").text($("#FREE_TEXT").val().length);
    });
    // フリーテキスト入力時
    $(document).on('keyup', '.battle', function () {
        let $parent = $(this).parents(".charTable");
        let charId = $parent.attr("data-charId");
        let power = Number($(this).val());
        if (!isNaN(power) && power > 0) {
            power = (power > 9999) ? 9999 : power;
            let img = '<img src="./img/icon/icon_battle.png" width=20>';
            $parent.find(".battlePower").html(" / " + img + power.toLocaleString());
        } else {
            power = 0;
            $parent.find(".battlePower").text("");
        }
        for (let i = 0; i < PARTY_DATA["party"].length; i++) {
            if (charId === PARTY_DATA["party"][i]["char"]) {
                PARTY_DATA["party"][i]["battle"] = power;
                break;
            }
        }
    });


    $(document).on('click', '.DELETE_BTN', function () {
        let id = $(this).attr("data-id");
        $(".row" + id).each(function () {
            $(this).remove();
        });
        let REF = databaseUser.ref("robin_data/" + id);
        REF.remove();
    });
    $(document).on('click', '.QUEST_TYPE', function () {
        $(".QUEST_TYPE").each(function () {
            $(this).removeClass("filterActive");
        })
        $(this).addClass("filterActive");
        $(".challenge-div").addClass("d-none");
        const id = $(this).attr("data-id");
        $("." + id).removeClass("d-none");
        if(id == "gento") {
            
        } else if(id == "rasen") {

        } else {

        }
    });

    // 
    $(".JINKEI_SEARCH").click(function () {
        let jinkei = $(this).attr("data-id");
        var op = $(this).hasClass("on") ? 1 : 0.5;
        SEARCH_DATA["jinkei"] = $(this).hasClass("on") ? "" : jinkei;
        $(".JINKEI_SEARCH").each(function () {
            $(this).removeClass("on");
            $(this).css("opacity", op);
        });
        if ($(this).hasClass("on")) {
            $(this).removeClass("on");
        } else {
            $(this).addClass("on");
        }
        $(this).css("opacity", 1);
    });

    $("#QUEST_SEARCH").change(function () {
        let vh = $('#QUEST_SEARCH option:selected').val();
        SEARCH_DATA["quest_lv"] = vh;
    });
    $("#QUEST_CHOICE_SEARCH").change(function () {
        let vh = $('#QUEST_CHOICE_SEARCH option:selected').val();
        SEARCH_DATA["quest"] = (vh === "0") ? "" : vh;
    });
    $("#ALLSTYLE_SEARCH").click(function () {
        SEARCH_DATA["my"] = 0;
    });
    $("#MYSTYLE_SEARCH").click(function () {
        SEARCH_DATA["my"] = 1;
    });


    $("#SEARCH").click(function () {
        if (USER_PARTY_LIST.length === 0) {
            let REF = databaseUser.ref("robin_data/");
            REF.once('value', function (snapshot) {
                USER_PARTY_LIST = snapshot.val();
                reDrawParty();
            })
        } else {
            reDrawParty();
        }
    });
});
function reDrawParty() {
    var result = USER_PARTY_LIST;
    var mylist = [];
    for (let i in result) {
        if (SEARCH_DATA["quest"] != "" && SEARCH_DATA["quest"] != 0) {
            if (result[i]['quest'] != SEARCH_DATA["quest"]) {
                continue;
            }
        }
        if (SEARCH_DATA["quest_lv"] != "" && SEARCH_DATA["quest_lv"] != 0) {
            if (result[i]['quest_lv'] != SEARCH_DATA["quest_lv"]) {
                continue;
            }
        }
        if (SEARCH_DATA["jinkei"] != "" && SEARCH_DATA["jinkei"] != 0) {
            if (result[i]['jinkei'] != SEARCH_DATA["jinkei"]) {
                continue;
            }
        }
        if (SEARCH_DATA["my"] === 1) {
            let p = result[i]['party'];
            try {
                result[i]['party'] = JSON.parse(p);
            } catch (e) {
            }
            var breakFlg = false;
            var style;
            for (let styleInfo of result[i]['party']) {
                if (MY_STYLE.indexOf(styleInfo['style']) === -1) {
                    style = styleInfo['style'];
                    breakFlg = true;
                }
            }
            if (breakFlg) {
                continue;
            }
        }
        mylist.push(result[i]);
    }
    $("#PARTY_TABLE").html("");
    displayParty(mylist);
}

function checkSave() {
    $("#SAVE_SUCCESS").slideUp(300);
    PARTY_DATA["uid"] = UID;
    if (PARTY_DATA["uid"] !== undefined
            && PARTY_DATA["quest_lv"] !== "" && PARTY_DATA["quest_lv"] !== "0"
            && PARTY_DATA["quest"] !== "" && PARTY_DATA["quest"] !== "0"
            && PARTY_DATA["jinkei"] !== ""
            && PARTY_DATA["party"].length === 3
            && $("#FREE_TEXT").val().length <= MAX_TEXT
            ) {
        $("#SAVE").addClass("icon_btn_on").removeClass("icon_btn_off");
    } else {
        $("#SAVE").addClass("icon_btn_off").removeClass("icon_btn_on");
    }
}

function initialHide() {
    //$("#charData").hide();
    //$(".tabArea").hide();
    //$(".styleInfoArea").hide();
}

// キャラクタークリック時
async function displayCharRow(styleInfo) {
    let charId = styleInfo['CharacterId'];
    let charBaseTmpl = $("#STYLE_SELECT_TEMPLATE").clone().removeClass("d-none").removeAttr("id").addClass("charTmpl" + charId)
            .attr("data-charId", charId);
    charBaseTmpl.find(".CHAR_NAME").html(styleInfo['Name']);

    // 所持スタイルの表示。選択部分とリミット部分
    let charInfo = CHAR_MASTER[charId];
    for (let styleId of charInfo['Holders'].reverse()) {
        let sInfo = STYLE_MASTER[styleId];
        // スタイルアイコンの追加
        let isPlaneIcon = false;
        let isLazyLoad = true;
        let styleIcon = getStyleIcon(sInfo['Rarity'], styleId, sInfo['WeaponType'], isPlaneIcon, isLazyLoad );
        if(styleInfo['Id'] == sInfo['Id']) {
            styleIcon.find(".CHECK_COVER").addClass("d-none");
        }
        charBaseTmpl.find(".STYLE_ICON_AREA").append(styleIcon);
    }
    $("#PARTY").append(charBaseTmpl);
    
    let num = $("#JINKEI").children().length + 1;
    let label = `<p class="JINKEI_POS series-button text-center jinkei_pos">${num}</p>`;
    let dotId = styleInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    let dot = `<span class="JINKEI_CHAR char-winner char dot_mid dot" style="${getImgUrl('dot/' + pngName + ".png")}" data-charId='${charId}' data-dotId='${pngName}' data-styleId=''></span>`;

    $("#JINKEI").append($("<div>").addClass("position-absolute JINKEI" + charId).append(label + dot));

    $row = $("#ROW_TMPL").clone().attr('id','').removeClass("d-none");
    $row.addClass(`vertical-parent-${styleInfo["Rarity"].toLowerCase()}`);
    $row.addClass("party-parent-" + charId);
    $row.attr("data-charId", charId);
    $row.find(".rare").attr("src", getImgPath(`icon/icon_${styleInfo["Rarity"]}.png`));
    $row.find(".weapon").attr("src", getImgPath(`icon/${ICON_LIST[styleInfo['WeaponType']]}.png`));
    $row.find(".vertical").addClass(`ver${charId}`);
    $row.find(".vertical").attr("src", getImgPath(`style_vertical/${styleInfo['Id']}.png`));
    $row.find(".vertical").attr("data-charId", charId);

    let $myFormation = $("#"+PARTY_DATA["jinkei"]).clone().removeClass("flex-column");

    let now = Number($("#JINKEI_VERTICAL").children().length) + 1;
    $myFormation.find(`.f-pos`).removeClass("myPos");
    $myFormation.find(`.pos${now}`).addClass("myPos");
    $myFormation.find(".f-name").remove();
    $myFormation.find(".formation-selected").remove();    
    $row.find(".JINKEI_IMG").append($myFormation);
    $("#JINKEI_VERTICAL").append($row);
}
async function setPartyList(id, data) {
    if ($("#" + id).length > 0) {
        return;
    }
    let text = decodeURI(data["text"]);
    text = (text === undefined) ? "" : text;
    let q = decodeURI(data["quest"]);
    let q_lv = decodeURI(data["quest_lv"]);
    let quest = q;
    if (QUEST_NAME[q_lv] !== undefined) {
        quest = QUEST_NAME[q_lv] + " / " + q;
    }
    var MODE = ["", "[全力オート]", "[手動]", "[手動+オート]"]
    let mode = (data["mode"] !== undefined) ? Number(data['mode']) : 0;

    $row1 = $("#TMPL_ROW1").clone().attr("id", id).addClass("row" + id);
    $row2 = $("#TMPL_ROW2").clone().attr("id", "").addClass("row" + id);
    $row3 = $("#TMPL_ROW3").clone().attr("id", "").addClass("row" + id);
    var sum = 0;
    for (let i in data["party"]) {
        let no = Number(i) + 1;
        let styleId = data["party"][i]['style'];
        let power = (data["party"][i]['battle'] !== undefined) ? Number(data["party"][i]['battle']) : 0;
        sum += power;
        let styleInfo = STYLE_MASTER[styleId];
        let rare = styleInfo['Rarity'];
        let color = "gold";
        if (rare === "S") {
            color = "silver";
        } else if (rare === "A") {
            color = "coral";
        }
        let icon = `<img src="./img/style_icon/${styleId}.png" width="40" style="border: 2px solid ${color}; border-radius: 5px;">`;
        let jinkei = `<img src="./img/icon/icon_jinkei_3_${data['jinkei']}${no}.png" width="40">`;
        let powerImg = (power > 0) ? `<br><img src="./img/icon/icon_battle.png" class="hidden pcBlock" width="22">${power.toLocaleString()}` : "";
        $row2.find(".char" + no).append(icon).append(jinkei).append(powerImg);

    }
    quest += (mode > 0) ? '<br>' + MODE[mode] : "";
    if (sum > 0) {
        quest += (mode > 0) ? "" : "<br>";
        quest += '<img src="./img/icon/icon_battle.png" width="22">' + sum.toLocaleString();
    }
    $row1.find(".TMPL_QUEST").html(quest);
    $row2.find(".TMPL_QUEST").html(quest);
    $row2.find(".TMPL_ADVICE").text(text);
    $row3.find(".TMPL_ADVICE").text(text);
    $row2.find(".DELETE_BTN").attr("data-id", id);
    $row3.find(".DELETE_BTN").attr("data-id", id);
    if (data["uid"] !== UID) {
        $row2.find(".DELETE_BTN").addClass("d-none").attr("data-id", id);
        $row3.find(".DELETE_BTN").addClass("d-none").attr("data-id", id);
    }
    $("#PARTY_TABLE").prepend($row3);
    $("#PARTY_TABLE").prepend($row2);
    $("#PARTY_TABLE").prepend($row1);
}
// スタイルクリック時
async function displayStyleData(charId, styleId) {
    let styleInfo = STYLE_MASTER[styleId];
    if (styleInfo === null) {
        return;
    }

    let parent = $(`.party-parent-` + charId);
    parent.removeClass("vertical-parent-ss vertical-parent-s vertical-parent-a");
    parent.addClass(`vertical-parent-${styleInfo["Rarity"].toLowerCase()}`);

    let rare = parent.find(".rare");
    rare.slideUp(100);
    let weapon = parent.find(".weapon");
    weapon.slideUp(100);
    let vertical = $(".ver" + charId);
    vertical.slideUp(300, function () {
        vertical.attr("src", getImgPath(`style_vertical/${styleInfo['Id']}.png`));
        rare.attr("src", getImgPath(`icon/icon_${styleInfo["Rarity"]}.png`));
        weapon.attr("src", getImgPath(`icon/${ICON_LIST[styleInfo['WeaponType']]}.png`));
    });
    vertical.slideDown(300);
    rare.slideDown(300);
    weapon.slideDown(300);

    let dotImg = getImgPath(`dot/${styleInfo['DotId']}.png`);
    $(".JINKEI" + charId).find('span').attr('style', `background:url(${dotImg}) no-repeat;`);
    parent.find(".dot").attr('style', `background:url(${dotImg}) no-repeat;`);
}


function getSmallIcon(styleInfo) {
    // スタイルアイコンの追加
    // let icon = $("<button>")
    //         .addClass(getStyleIconClass(styleInfo['Rarity']) + "_small")
    //         .attr("style", getImgUrl('style_icon/' + styleInfo['Id'] + ".png"))
    let background = $("<span>").addClass(getStyleIconBgClass(styleInfo['Rarity']))
            .attr("style", "height: 30px;")
            .append(getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], "", true));
    return background;
}


function selectDotReset(charInfo) {
    console.log(charInfo);
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

// キャラクタークリック時
$(document).on('click', '.char-dot-base', async function () {
    let charId = $(this).attr("data-id");
    let idx = getCharIndexFromPartyList(charId);
    if (PARTY_DATA["party"].length >= 5 || idx !== -1) {
        while (PARTY_DATA["party"].length > 5) {
            let size = PARTY_DATA["party"].length;
            let id = PARTY_DATA["party"][size - 1]['char'];
            charUnset(id);
            PARTY_DATA["party"].pop();
        }
        $(this).removeClass("char-aruku-left2").addClass("char-loser2");
        return;
    }

    let holders = CHAR_MASTER[charId]['Holders'];
    let styleId = holders[holders.length-1];
    let styleInfo = STYLE_MASTER[styleId];

    // パーティ登録
    PARTY_DATA["party"].push({
        "char": charId,
        "style": styleId
    });

    selectDotHensei(CHAR_MASTER[charId]);

    readUserDataWithId("CHAR", charId, async function (result) {
        // キャラクター情報表示
        await displayCharRow(styleInfo);
        // スタイル初期表示
        await displayStyleData(charId, styleId);
        if(PARTY_DATA["party"].length ==5) {
            $("html,body").animate({scrollTop: $("#charData").offset().top}, 500, 'swing');
        }        
    });
    $('[data-toggle="tooltip"]').tooltip();
    checkSave();
});

// スタイルクリック時
$(document).on('click', '.style', async function () {
    let styleId = $(this).attr("data-id");
    let charId = STYLE_MASTER[styleId]['CharacterId'];
    $(this).parent().find(".style").each(function(){
        $(this).find(".CHECK_COVER").removeClass("d-none");
    });
    $(this).find(".CHECK_COVER").addClass("d-none");
    await displayStyleData(charId, styleId);
    let idx = getCharIndexFromPartyList(charId);
    PARTY_DATA["party"][idx]['style'] = styleId;
    checkSave();
});

function getCharIndexFromPartyList(charId) {
    for (let key in PARTY_DATA["party"]) {
        if (PARTY_DATA["party"][key]['char'] === charId) {
            return key;
        }
    }
    return -1;
}


let FORMATION_MASTER = {};
function displayFilteredFormation(formations){
    
    let output = "";
    for(let i in formations){
        const formation = formations[i];
        FORMATION_MASTER[formation['Id']] = formation;
        let formationBox = $("#FORMATION_LIST_TEMPLATE").clone().attr("id",formation['Id']).removeClass("d-none").addClass("d-flex");
        formationBox.find(".f-name").html(formation['Name']);

        for(let j in formation['Pos']){
            const pos = formation['Pos'][j];
            let num = Number(j)+1;
            let top = Number(pos['y']) * 6;
            let right = Number(pos['x']) * 5.5;
            let rightPc = Number(pos['x']) * 8;
            output += `.formation-${formation['Id']} div:nth-child(${num}) { 
                top: ${top}px;
                left: ${right}px;
            }\n`;
            formationBox.find(`.pos${num}`).attr('style', `top: ${Number(pos['y']) * v - 5}px; left: ${Number(pos['x']) * v + 3}px;`);
        }
        if(formation['Id'] == "1058") {
            formationBox.find(".formation-selected").removeClass("d-none");
        }
        formationBox.attr('data-plus', formation['plus']);
        formationBox.attr('data-minus', formation['minus']);
        $("#F_LIST_AREA").append(formationBox);
    }
    console.log(output);
}