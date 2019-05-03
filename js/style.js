var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_CHAR = {};
var NOW_STYLE = {};
var CHAR_MASTER, STYLE_MASTER, SKILL_MASTER, ABILITY_MASTER;


$(document).ready(function ($) {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            var uiConfig = {
                // ログイン完了時のリダイレクト先
                signInSuccessUrl: 'https://nao-romasaga.github.io/style.html',
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
        dispChar(CHAR_MASTER, device);
    });
    readFile('Skill', function (result) {
        SKILL_MASTER = result;
    });
    readFile('Style', function (result) {
        STYLE_MASTER = result;
    });
    readFile('Ability', function (result) {
        ABILITY_MASTER = result;
    });

    initialHide();
    setSlider();
    setSliderChart();

    // キャラクタークリック時
    $(document).on('click', '.char', function () {
        $("#displayDamage").removeClass("icon_btn_off");
        $("#displayDamage").addClass("icon_btn_on");
        $("#displayDamage").find("#msg").addClass("d-none");
        $(".culcDamageResultClass").slideDown();
        $("#charData").show();
        $(".styleInfoArea").show();
        $(".tabArea").show();
        tabChange($("#tabStyle"));
        $(".styleChoiceArea").show();
        $(".styleSkillArea").hide();
        $(".styleDiffArea").hide();
        $("html,body").animate({scrollTop: $('#charData').offset().top}, 500, 'swing');


        let charId = $(this).attr("data-id");
        NOW_CHAR = CHAR_MASTER[charId];
        console.log(Object.assign({},NOW_CHAR));
        let styleId = NOW_CHAR['Holders'][0];
        NOW_STYLE = STYLE_MASTER[styleId];
        console.log(NOW_STYLE);

        $(".char-selected").each(function (i, e) {
            $(this).removeClass('char-winner');
            $(this).addClass('char-aruku');
        });
        $(this).removeClass('char-aruku');
        $(this).addClass('char-winner').addClass('char-selected').addClass("dot");
        readCharData(charId, function (result) {
            // キャラクター情報表示
            displayCharInfo(result);
            // スタイル一覧表示
            displayStyleList();
            // スタイル初期表示
            displayStyleInfo(styleId);
        });

    });

    $(document).on('click', '.style', function () {
        let styleId = $(this).attr("data-id");
        NOW_STYLE = STYLE_MASTER[styleId];
        displayStyleInfo(styleId);
    });

    $("#displayDamage").click(function () {
        $(this).toggleClass("icon_btn_off");
        $(this).toggleClass("icon_btn_on");
        $(this).find("#msg").toggleClass("d-none");
        $(".culcDamageResultClass").slideToggle();
    });

    $(".charParam").change(function () {
        updateDB();
        reculc();
    });

    function updateDB() {
        let update = {}
        for (let key of PARAM_KEY) {
            NOW_CHAR[key] = Number($("#char" + key).val());
            update[key] = Number($("#char" + key).val());
        }
        console.log(update);
        updateData(`CHAR/${NOW_CHAR['Id']}`, update);
    }

    $("#allparams").change(function () {
        let input = splitParam("不明");
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
    });

    $(".modalClose").click(function () {
        if ($(this).attr("data-id") === "ok") {
            let input = splitParam(0);
            for (let i in input) {
                $("#char" + PARAM_KEY[i]).val(input[i]);
            }
            updateDB();
            reculc();
        }
        $("#modal01").fadeOut();
        $("#allParamConfirmInner").css("animation", "modalClose 0.5s forwards");
        return false;
    });
    function splitParam(initial) {
        let input = $("#allparams").val();
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

    $("#styleChartLv").change(function () {
        reculc();
    });

    $("#tabStyle").click(function () {
        $(".styleChoiceArea").show();
        $(".styleSkillArea").hide();
        $(".styleDiffArea").hide();
        tabChange($(this));
    });
    $("#tabSkill").click(function () {
        $(".styleChoiceArea").hide();
        $(".styleSkillArea").show();
        $(".styleDiffArea").hide();
        tabChange($(this));
    });
    $("#tabDiff").click(function () {
        $(".styleChoiceArea").hide();
        $(".styleSkillArea").hide();
        $(".styleDiffArea").show();
        tabChange($(this));
    });

});

function reculc() {
    NOW_LV = Number($("#styleChartLv").val());
    $(".nowStyleLevel").html(NOW_LV);
    for (let key of PARAM_KEY) {
        NOW_CHAR[key] = Number($("#char" + key).val());
    }

    calcAndDisplaySkill(NOW_CHAR, NOW_LV);
    changeStyleStatusDiffTable(NOW_STYLE);
    displayStyleStatusTable(NOW_STYLE, NOW_LV);

    RADER_DATA_PER = createPercentChartData(NOW_CHAR, NOW_LV);
    RadarChart("#perChart", RADER_DATA_PER, radarChartOptions);

    RADER_DATA_VAL = createValueChartData(NOW_CHAR, NOW_LV);
    RadarChart("#valueChart", RADER_DATA_VAL, radarChartOptionsValue);

    if ($("#displayDamage").hasClass("icon_btn_on")) {
        $(".culcDamageResultClass").slideToggle();
    }
    let w = $("#charData").width();
    $(".chartLabel").attr("style", "width:" + w + "px !important;");
}

function tabChange(target) {
    $(".styleTab").each(function () {
        $(this).removeClass("style-tab-active");
        $(this).addClass("style-tab-disabled");
    });
    target.removeClass("style-tab-disabled");
    target.addClass("style-tab-active");
}
function initialHide() {
    $("#charData").hide();
    $(".tabArea").hide();
    $(".styleInfoArea").hide();
    $(".styleChoiceArea").hide();
    $(".styleDiffArea").hide();
    $(".styleSkillArea").hide();

}

// スタイルクリック時
function displayStyleInfo(styleId) {
    $("#styleDot").show();
    $(".style").each(function () {
        let subStyleId = $(this).attr("data-id");
        $(this).parent().addClass("opacity_nocheck");
        if (styleId === subStyleId) {
            $(this).parent().removeClass("opacity_nocheck");
            return;
        }
    });
    let styleInfo = STYLE_MASTER[styleId];
    let another = $("<p>").attr('style', 'font-size:10px; margin-bottom:0px;').append(styleInfo['AnotherName']);
    let rareIcon = $("<div>").addClass('icon_rare_large float-left')
            .attr('style', getImgUrl('icon/icon_' + styleInfo['Rarity'] + ".png"));
    $("#styleNameLabel").html('').append(rareIcon).append(another).append(styleInfo['Name']);

    $("#styleBgImg").attr("style", getImgUrl("style_all/" + styleInfo['IllustId'] + ".png") + " background-size: contain;");

    let dotId = styleInfo['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    $("#styleDot").attr('style', getImgUrl('dot/' + pngName + ".png") + " margin-left:20px;");

    displayStyleStatusTable(styleInfo, NOW_LV);

    $("#abilityList").html("");
    let abList = [];
    for (let key in styleInfo['StyleAbilityIds']) {
        let abInfo = ABILITY_MASTER[styleInfo['StyleAbilityIds'][key]];
        let name = $("<span>").append(abInfo["Name"]);
        let infoBtn = createInfoButton();
        infoBtn.attr("style", "margin-left:10px")
                .attr("title", abInfo["FlavorText"]);
        name.append(infoBtn);
        abList.push(name.html());
    }
    $("#abilityList").append(abList.join("<br>"));
    $("#skillList").html("");
    let skillList = [];
    for (let key in styleInfo['SkillIds']) {
        let skillInfo = SKILL_MASTER[styleInfo['SkillIds'][key]];
        let name = $("<span>").append(skillInfo["Name"]);
        let infoBtn = createInfoButton();
        infoBtn.attr("style", "margin-left:10px")
                .attr("title", skillInfo["FlavorText"]);
        name.append(infoBtn);
        skillList.push(name.html());
    }
    $("#skillList").append(skillList.join("<br>"));
    $('[data-toggle="tooltip"]').tooltip();
    changeStyleStatusDiffTable(styleInfo);
}

// スタイルLv50の表示テーブル
function displayStyleStatusTable(styleInfo, lv) {
    let styleBonus = culcStyleAddintional(styleInfo);
    for (let key in PARAM_KEY) {
        let input = $("#char" + PARAM_KEY[key]).val();
        let per = styleBonus[PARAM_NAME[key]][lv]["Per"];
        let bonus = styleBonus[PARAM_NAME[key]][lv]["Bonus"];
        let v = addBonus(input, per, bonus);
        let disp = PARAM_NAME[key].substr(0, 1) + " " + v + " <span style='color:cyan'>" + per + "%";
        if (bonus > 0) {
            disp += "+" + bonus;
        }
        disp += "</span>";
        $("#style" + PARAM_KEY[key]).html(disp);
    }
}

// スタイルレベルごとのステータステーブル
function changeStyleStatusDiffTable(styleInfo) {
    $("table#statusDiffTable tbody *").remove();
    let raderResult = createStyleValueTableData(styleInfo);
    for (let lv in raderResult) {
        let tdLv = $("<td>").append(lv);
        let tr = $("<tr>").append(tdLv);
        for (let pName in raderResult[lv]) {
            let tdParam = $("<td>").append(raderResult[lv][pName]);
            tr.append(tdParam);
        }
        $("table#statusDiffTable tbody").append(tr);
    }
}

var STATUS_TABLE = "<table class='table table-sm width-100 small'>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>腕力</td><td id='tdStr' class='text-right'></td><td>体力</td><td id='tdVit' class='text-right'></td></tr>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>器用さ</td><td id='tdDex' class='text-right'></td><td>素早さ</td><td id='tdAgi' class='text-right'></td></tr>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>知力</td><td id='tdInt' class='text-right'></td><td>精神</td><td id='tdMnd' class='text-right'></td></tr>";
STATUS_TABLE += "<tr class='char-bottom text-nowrap'><td>愛</td><td id='tdAi' class='text-right'></td><td>魅力</td><td id='tdMi' class='text-right'></td></tr>";
STATUS_TABLE += "</table>";

var RADER_DATA_PER;
var NOW_LV = 50;
// キャラクタークリック時
function displayCharInfo(charData) {
    $("#charName").html(NOW_CHAR['Name']);
    console.log(charData);

    let dotId = NOW_CHAR['DotId'];
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    $("#charDot").attr('style', getImgUrl('dot/' + pngName + ".png") + " margin-left:20px;");

    if (charData !== null) {
        for (let key of PARAM_KEY) {
            NOW_CHAR[key] = Number(charData[key]);
        }
    } else if (NOW_CHAR['init'] === undefined) {
        for (let key of PARAM_KEY) {
            NOW_CHAR[key] = Number(NOW_CHAR[key]) + 45;
        }
    }
    NOW_CHAR['init'] = false;
    for (let key of PARAM_KEY) {
        $("#char" + key).val(NOW_CHAR[key]);
    }
}
// キャラクタークリック時
function displayStyleList() {
    // キャラクター再選択でリセットされる
    $(".styleChoiceArea").show();
    $("#styleChoice").html("");

    let charInfo = NOW_CHAR;

    // 所持スタイルの表示
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
        //let styleLevel = $("<select>");
        //for (let i = 50; i > 30; i--) {
        //    styleLevel.append("<option>" + i + "</option>");
        //}
        //background.append(styleLevel);
        $("#styleChoice").append(background);
    }

    // ステータスなど計算
    reculc();
    // 初回は閉じておく
    $(".culcDamageResultClass").slideUp();
}

function calcAndDisplaySkill(charInfo, lv) {
    $("#styleSkill").html("");
    // スタイルが持つ技を並べる
    for (let styleId of charInfo['Holders']) {
        let styleInfo = STYLE_MASTER[styleId];
        for (let skillId of styleInfo['SkillIds']) {
            let skillInfo = SKILL_MASTER[skillId];
            let skillButton = skillLabel(skillInfo);
            skillButton.find(".holderClass").remove();
            let infoBtn = createInfoButton();
            infoBtn.attr("title", skillInfo["FlavorText"].replace(" ) ", " ) <br>"));
            skillButton.find(".skillNameClass").append(" ").append(infoBtn);

            let smallIcon = getSmallIcon(styleInfo);
            skillButton.find(".iconClass").prepend(smallIcon);
            // ダメージリストの追加
            let damageList = $("<div>").attr("style", "border-top:1px solid").addClass("culcDamageResultClass");
            for (let styleId of NOW_CHAR['Holders']) {
                let styleInfo = STYLE_MASTER[styleId];
                let smallIcon = getSmallIcon(styleInfo);

                // charInfo, stBonus, styleInfo, styleLevel, skillInfo, rank, wepon, master, vit, resist
                let result = culcSkillDamageWithStyle(NOW_CHAR, 0, styleInfo, lv, skillInfo, 99, 28, 5.5, 85, 0);
                let p;
                if (result['SkillType'] === "術") {
                    p = "知:" + result['culcValue'] + " (" + result['orgINT'] + "+" + result['INTPer'] + "%";
                    if (result['INTBonus'] > 0) {
                        p += "+" + result['INTBonus'];
                    }
                } else if (result['BattleType'] === '小剣' || result['BattleType'] === '弓') {
                    p = "器:" + result['culcValue'] + " (" + result['orgDEX'] + "+" + result['DEXPer'] + "%";
                    if (result['DEXBonus'] > 0) {
                        p += "+" + result['DEXBonus'];
                    }
                } else if (result['BattleType'] === '体術') {
                    p = "腕:" + result['str'] + " (" + result['orgSTR'] + "+" + result['STRPer'] + "%";
                    if (result['STRBonus'] > 0) {
                        p += "+" + result['STRBonus'];
                    }
                    p += ")<br>"
                    p += "速:" + result['agi'] + " (" + result['orgAGI'] + "+" + result['AGIPer'] + "%";
                    if (result['AGIBonus'] > 0) {
                        p += "+" + result['AGIBonus'];
                    }
                } else {
                    p = "腕:" + result['culcValue'] + " (" + result['orgSTR'] + "+" + result['STRPer'] + "%";
                    if (result['STRBonus'] > 0) {
                        p += "+" + result['STRBonus'];
                    }
                }
                p += ")<br>";

                let tip = "ダメージ計算条件<br>";
                tip += "スタイルLv:50 技Rank:99<br>";
                tip += p;
                tip += "アビリティ: +" + result['ability'] + "%";

                smallIcon.attr("data-toggle", "tooltip").attr("data-placement", "top")
                        .attr("data-html", 'true')
                        .attr("title", tip);

                damageList.append(smallIcon);
                damageList.append(result['culcDamage'].toLocaleString() + " ");
            }
            if (skillInfo['SkillIryoku'] !== "-" && skillInfo['SkillIryoku'] !== 0) {
                skillButton.append(damageList);
            }

            $("#styleSkill").append(skillButton);
        }
    }
    $('[data-toggle="tooltip"]').tooltip();
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

// スタイル補正の値なのでパラメータに影響されない
function createPercentChartData(charInfo, lv) {
    let raderResult = [];

    // ["StyleName"]["Param"]["Lv"]["Per"] = パーセンテージ
    // ["StyleName"]["Param"]["Lv"]["Bonus"] = ボーナス値
    // var STYLE_ADD = {};
    for (let key in charInfo['Holders']) {
        let styleId = charInfo['Holders'][key];
        let styleInfo = STYLE_MASTER[styleId];
        // result["腕力"][50] = {Per :56, Bonus: 3 }
        let result = culcStyleAddintional(styleInfo);

        let styleMax = {"name": styleInfo['AnotherName'], "axes": []};
        for (let pName of PARAM_NAME) {
            styleMax["axes"].push({"axis": pName, "value": result[pName][lv]["Per"]});
        }
        raderResult.push(styleMax);
    }
    return raderResult;
}

function createStyleValueTableData(styleInfo) {
    let raderLvList = [30, 34, 38, 42, 46, 50];
    // キャラクター変換でリセットする
    let chart = {};
    // result["腕力"][50] = {Per :56, Bonus: 3 }
    let result = culcStyleAddintional(styleInfo);
    for (let lv of raderLvList) {
        chart[lv] = {};
        for (let i in PARAM_NAME) {
            let pName = PARAM_NAME[i];
            let input = $("#char" + PARAM_KEY[i]).val();
            let per = result[pName][lv]["Per"];
            let bonus = result[pName][lv]["Bonus"];
            let v = addBonus(input, per, bonus);
            chart[lv][PARAM_KEY[i]] = v;
        }
    }
    return chart;
}

function createValueChartData(charInfo, lv) {
    // キャラクター変換でリセットする
    let chartData = [];

    for (let key in charInfo['Holders']) {
        let styleId = charInfo['Holders'][key];
        let styleInfo = STYLE_MASTER[styleId];
        // result["腕力"][50] = {Per :56, Bonus: 3 }
        let cuclResult = culcStyleAddintional(styleInfo);

        let styleMax = {"name": styleInfo['AnotherName'], "axes": []};
        for (let i in PARAM_NAME) {
            let pName = PARAM_NAME[i];
            let input = $("#char" + PARAM_KEY[i]).val();
            let per = cuclResult[pName][lv]["Per"];
            let bonus = cuclResult[pName][lv]["Bonus"];
            let v = addBonus(input, per, bonus);
            styleMax["axes"].push({"axis": pName, "value": v});
        }
        chartData.push(styleMax);
    }
    return chartData;
}
////////////////////////////////////////////////////////////////////////////////////////////////
// 以下、グラフ描画用設定
////////////////////////////////////////////////////////////////////////////////////////////////
var margin = {top: 30, right: 50, bottom: 30, left: 50};
var width = 200; //Math.min(200, window.innerWidth / 4);// - margin.left - margin.right,
var height = 200; //Math.min(width, window.innerHeight);// - margin.top - margin.bottom);
var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    levels: 5,
    roundStrokes: false,
    labelFactor: 1.1,
    opacityArea: 0.1,
    maxValue: 100,
    legend: {title: 'スタイル名称', translateX: -130, translateY: 0, "font-size": "8px"},
    format: '.0f',
    unit: '%'
};
var radarChartOptionsValue = {
    w: width,
    h: height,
    margin: margin,
    levels: 10,
    roundStrokes: false,
    labelFactor: 1.1,
    opacityArea: 0.1,
    maxValue: 100,
    legend: {title: 'スタイル名称', translateX: -130, translateY: 0, "font-size": "8px"},
    format: '.0f',
    //unit: ''
};

function setSliderChart() {
    let option = {
        buttons: true, //スライダーのページャを表示する
        startSlide: 0, //最初のスライドを指定する
        arrows: true, //左右の矢印ボタンを表示する
        width: '100%', //横幅を設定する
        height: 300, //高さを設定する
        //autoHeight: true, //高さを設定する
        autoplay: false, //自動再生の設定
        loop: true, //スライドをループさせる設定
        visibleSize: '100%', //前後のスライドを表示するかの設定
        //forceSize: 'fullWidth' //スライダーの幅をブラウザ幅に設定する
    };
    //option['height'] = (device === "sp") ? 310 : 250;
    $('#slider-pro-chart').sliderPro(option);
}




/**
 * 一旦保留
 * @param {type} styleInfo
 * @param {type} nowLv
 * @returns {Array|createStyleValueChartData.chart}
 */
function createStyleValueChartData(styleInfo, nowLv) {
    let tmpLv = [30, 50];
    //tmpLv.push(Number(nowLv));
    let raderLvList = tmpLv.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });
    raderLvList.sort(function (a, b) {
        return (a < b) ? -1 : 1;
    });

    // キャラクター変換でリセットする
    let chart = [];
    // result["腕力"][50] = {Per :56, Bonus: 3 }
    let result = culcStyleAddintional(styleInfo);
    for (let lv of raderLvList) {
        let styleMax = {"name": lv, "axes": []};
        for (let i in PARAM_NAME) {
            let pName = PARAM_NAME[i];
            let input = $("#char" + PARAM_KEY[i]).val();
            let per = result[pName][lv]["Per"];
            let bonus = result[pName][lv]["Bonus"];
            let v = addBonus(input, per, bonus);
            styleMax["axes"].push({"axis": pName, "value": v});
        }
        chart.push(styleMax);
    }
    return chart;
}