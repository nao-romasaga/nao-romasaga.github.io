//console.log(firebase);
//firebase.database().ref('Skill').once("value").then(function (snapshot) {});

var NORMAL_ATTACK = {"Name": "通常攻撃", "AttackArea": "敵単体", "ConsumeBp": 0, "AutoUseBp": 0, "UseBp": 0, "isNotUseAuto": false, "UseCount": 0, "isKeisho": 0, "SkillIryoku": 7};
var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_CHAR = {};
var NOW_STYLE = {};
var CHAR_MASTER, STYLE_MASTER, SKILL_MASTER;


$(document).ready(function ($) {
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

    initialHide();
    setSlider();

    // 後から差し込まれる要素はdocument.onにしないとfunctionがbindされない
    $(document).on('click', '.char', function () {
        let charId = $(this).attr("data-id");
        NOW_CHAR = CHAR_MASTER[charId];

        $("html,body").animate({scrollTop: $('.sp-slides-container').offset().top}, 500, 'swing');

        $("#skillAreaParent").hide();
        $("#culcStart").hide();
        $("#keishoKaijo").hide();
        $(".skillChoice").html("");
        $("table#skillArea > tbody *").remove();
        $("table#skillArea > tfoot *").remove();
        $("#keisyoSkill").html(""); // クリア
        $(".culcAfter").hide();
        $("table#culcSummary tbody *").remove();
        $("#culcDetail").html("");


        $(".char-selected").each(function (i, e) {
            $(this).removeClass('char-winner');
            $(this).addClass('char-aruku');
        });
        $(this).removeClass('char-aruku');
        $(this).addClass('char-winner').addClass('char-selected').addClass("dot");
        displayStyleList(charId);

        // 1件目はデフォルトで出しちゃう
        let styleId = NOW_CHAR['Holders'][0];
        clickStyle(styleId);
        gtag('event', "clickChar", {'event_category': "auto", 'event_label': NOW_CHAR['Name'], 'value': 1});
    });
    $(document).on('click', '.style', function () {
        let styleId = $(this).attr("data-id");
        clickStyle(styleId);
        gtag('event', "clickStyle", {'event_category': "auto", 'event_label': NOW_STYLE['Name'] + NOW_STYLE['AnotherName'], 'value': 1});
    });
    function clickStyle(styleId) {
        $("#skillAreaParent").show();
        $("#culcStart").show();
        if (NOW_CHAR['Holders'].length > 1) {
            $("#keishoKaijo").show();
        }
        $(".skillChoice").html("");
        $("table#skillArea > tbody *").remove();
        $("table#skillArea > tfoot *").remove();
        $("table#culcSummary tbody *").remove();
        NOW_STYLE = STYLE_MASTER[styleId];
        displaySkillTable(styleId);
    }

    $(document).on('click', '#keishoKaijo', function () {
        $("#noKeisho").show();
        $("table#skillArea > tfoot").html("");
        USE_SKILL_LIST = BASE_SKILL_LIST.slice();
    });

    $(document).on('click', '.keishoSkill', function () {
        $("#x").remove();
        $(this).children(".floatLeft").append("<span id='x' class='icon_keisho_e'></span>");
        $("#noKeisho").hide();
        $("table#skillArea > tfoot").html("");
        // 中身をイジイジするので値渡しにしておく
        let skillInfo = Object.assign({}, SKILL_MASTER[$(this).attr("data-id")]);
        skillInfo['isKeisho'] = true;
        skillInfo['UseBp'] = skillInfo['ConsumeBp'];
        addSkillArea(skillInfo, "table#skillArea tfoot");
        USE_SKILL_LIST = BASE_SKILL_LIST.slice();
        USE_SKILL_LIST.push(skillInfo);
    });
    
    $("#showJoken").click(function () {
        gtag('event', "showJoken", {'event_category': "auto", 'event_label': "none", 'value': 1});
    });
    $("#culcStart").click(function () {
        gtag('event', "clickCalc", {'event_category': "auto", 'event_label': NOW_STYLE['Name'] + NOW_STYLE['AnotherName'], 'value': 1});
        let skillList = displayResult();
        $("html,body").animate({scrollTop: $('#culcStart').offset().top}, 500, 'swing');
        //console.log(skillList);
        //console.log(NOW_STYLE);
        let br = "%0D%0A";
        let text = `${NOW_STYLE['Name']} ${NOW_STYLE['Rarity']} ${NOW_STYLE['AnotherName']}${br}`;
        text += `${$("#avgDamage").text()}${br}`;
        for (let skill of skillList) {
            if (skill['Id'] == "0") {
                continue;
            }
            let kakusei = Number(skill['ConsumeBp']) - Number(skill['AutoUseBp']);
            //let damage = skill['culcDamage'];
            let use = skill['UseCount'];
            let keisho = "";
            if (skill['isKeisho']) {
                keisho = "[継承]";
            }
            text += `・${skill['Name']}${keisho} 覚醒:${kakusei} 発動:${use}${br}`;
        }
        let href = `https://twitter.com/intent/tweet?text=${text}&url=https://nao-romasaga.github.io/auto.html&hashtags=全力オートシミュレータ`;
        //console.log($(".my-twitter-share-button"));
        //console.log(href);
        $(".my-twitter-share-button").attr("href", href);
    });

    $(".switch .toggle").click(function () {
        $(this).toggleClass("accordionActive").next().slideToggle(300);
    });
});


function displayStyleList(charId) {
    $(".styleChoiceArea").show();
    $("#styleChoice").html("");

    let charInfo = CHAR_MASTER[charId];
    for (let styleId of charInfo['Holders']) {
        let styleInfo = STYLE_MASTER[styleId];
        styleInfo['hasRenki'] = false;
        for (let lv in styleInfo['StyleAbility']) {
            if (styleInfo['StyleAbility'][lv] === "練気高揚") {
                styleInfo['hasRenki'] = true;
            }
        }

        // スタイルアイコンの追加
        let icon = $("<button>").addClass("style")
                .addClass(getStyleIconClass(styleInfo['Rarity']))
                .attr("style", getImgUrl('style_icon/' + styleId + ".png"))
                .attr("data-id", styleId);
        //let link = '<span class="style" data-id="' + styleInfo['Id'] + '">' + styleInfo['AnotherName'] + '</span><br>';
        let background = $("<span>")
                .addClass(getStyleIconBgClass(styleInfo['Rarity']))
                .append(icon);
        $("#styleChoice").append(background);
    }
}

var noKeishoTr = "<tr class='keishoSkillTr' id='noKeisho'><td colspan=5 class='text-center'>継承技未設定</td></tr>";
var noKeishoTd = "<td colspan=5 class='text-center'>継承技未設定</td>";
function displaySkillTable(styleId) {
    $(".skillChoice").html(""); // クリア
    $("table#skillArea > tbody *").remove();
    $("#keisyoSkill").html(""); // クリア
    BASE_SKILL_LIST = []; // クリア
    kakuseiData = {}; // クリア
    // 絵を出す
    let styleInfo = Object.assign({}, STYLE_MASTER[styleId]);
    let url = getImgUrl('style_cutin/' + styleId + ".png");
    let icon = $("<span>")
            .addClass('cutin')
            .attr("style", url + " height:100%;");
    $("#skillCutin").append(icon);

    let hashiruDot = $("<span>")
            .addClass("char-hashiri").addClass("char").addClass("dot").addClass('dot_mid')
            .attr("style", getImgUrl('dot/' + styleInfo['DotId'] + ".png"));
    $("#skillDot").append(hashiruDot);

    // スタイルの所持している技
    for (let skillId of styleInfo['SkillIds']) {
        // 中身をイジイジするので値渡しにしておく
        let skillInfo = Object.assign({}, SKILL_MASTER[skillId]);
        skillInfo['isKeisho'] = false;
        addSkillArea(skillInfo, "table#skillArea tbody");
        skillInfo['UseBp'] = skillInfo['ConsumeBp'];
        BASE_SKILL_LIST.push(skillInfo);
    }
    $("table#skillArea tbody").append(noKeishoTr);
    // 継承を押される前に計算できるように先に控えておく
    USE_SKILL_LIST = BASE_SKILL_LIST.slice();

    // 継承データ
    let isKeishoSkill = [];
    $(".style").each(function () {

        let subStyleId = $(this).attr("data-id");
        $(this).parent().addClass("opacity_nocheck");
        if (styleId === subStyleId) {
            $(this).parent().removeClass("opacity_nocheck");
            return;
        }
        for (let skillId of STYLE_MASTER[subStyleId]['SkillIds']) {
            // 継承エリアに同じスキルは出さない
            if (isKeishoSkill.indexOf(skillId) > -1) {
                continue;
            }
            isKeishoSkill.push(skillId); // 継承枠に表示済みの記録
            let skillInfo = SKILL_MASTER[skillId];
            //console.log(subId, skillId, $(".kakusei" + skillId));
            if ($(".kakusei" + skillId).length === 0) {
                let skillName = kakuseiLabel(skillInfo);
                $("#keisyoSkill").append(skillName);
            }
        }

    });
}
function kakuseiLabel(skillInfo) {
    let skillName = $("<button>").addClass("skill").addClass("keishoSkill");
    skillName.removeAttr("id").attr("data-id", skillInfo['Id']);
    let skillLeft = $("<p>").addClass("floatLeft");
    //BattleType , AttackAttributes
    let id = ICON_LIST[skillInfo['BattleType']];
    let img = $('<span>').addClass('icon_xs');
    img.attr("style", getImgUrl('icon/' + id + ".png"));
    $(skillLeft).append(img);

    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let img = $('<span>').addClass('icon_xs');
        img.attr("style", getImgUrl('icon/' + ICON_LIST[value] + ".png"));
        $(skillLeft).append(img);
    });
    // 名称
    $(skillLeft).append(skillInfo['Name']);
    $(skillLeft).append("(");
    let kakuseiList = [];
    for (let i = 1; i <= skillInfo['Kakusei']; i++) {
        kakuseiList.push("◇");
    }
    $(skillLeft).append(kakuseiList.join(" "));
    $(skillLeft).append(")");


    let skillRight = $("<p>").addClass("floatRight");
    $(skillRight).append(" 覚醒:" + skillInfo['Kakusei']);
    $(skillRight).append(" BP:" + skillInfo['ConsumeBp']);
    $(skillRight).append(" " + skillInfo['PowerGrade'] + "(" + skillInfo['SkillIryoku'] + ")");
    skillName.append(skillLeft).append(skillRight);

    return skillName;
}

var kakuseiData = {};
$(document).on('click', '.kakuseiCheck', function () {
    let id = $(this).attr("data-id");
    let kakusei = Number($(this).attr("data-kakusei"));
    if (kakuseiData[id] === kakusei) {
        kakusei = 0;
    }
    kakuseiData[id] = kakusei;
    let nowBP = $(".nowBP" + id).attr("data-bp");

    nowBP -= kakusei;
    $(".nowBP" + id).html(nowBP);
    $(".kakusei" + id).each(function () {
        let k = $(this).attr("data-kakusei");
        if (k <= kakusei) {
            $(this).html("◆");
        } else {
            $(this).html("◇");
        }
    });
    for (let i in USE_SKILL_LIST) {
        let info = USE_SKILL_LIST[i];
        info['UseBp'] = Number($(".nowBP" + info['Id']).text());
    }
});


function addSkillArea(skillInfo, target) {
    let size = (device === "sp") ? 20 : 35;
    let skillName = $("<span>").addClass("skill").attr("data-id", skillInfo['Id']).html(skillInfo['Name']);
    let kakuseiList = [];
    for (let kakusei = 1; kakusei <= skillInfo['Kakusei']; kakusei++) {
        let kCheck = $("<button>").addClass('kakuseiCheck').addClass("floatLeft")
                .addClass('kakusei' + skillInfo['Id'])
                .attr("data-id", skillInfo['Id']).attr("data-kakusei", kakusei);
        $(kCheck).html("◇");
        kakuseiList.push(kCheck);
    }

    //BattleType , AttackAttributes
    let battleIcon = $('<span>').addClass('icon_xs')
            .attr("style", getImgUrl('icon/' + ICON_LIST[skillInfo['BattleType']] + ".png"));
    let tdIcon = $("<td>").append(battleIcon);

    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let attrIcon = $('<span>').addClass('icon_xs')
                .attr("style", getImgUrl('icon/' + ICON_LIST[value] + ".png"));
        tdIcon.append(attrIcon);
    });
    let tdName = $("<td>").append(skillName);

    let tdKakusei = $("<td>");
    for (let obj of kakuseiList) {
        tdKakusei.append(obj);
    }
    let bp = "";
    bp += '<span class="nowBP' + skillInfo['Id'] + '" data-id="' + skillInfo['Id'] + '" data-bp="' + skillInfo['ConsumeBp'] + '" >' + skillInfo['ConsumeBp'] + '</span>';
    bp += "<br>";
    let tdBP = $("<td>").append(bp);
    let tdIryoku = $("<td>").append(skillInfo['PowerGrade'] + "(" + skillInfo['SkillIryoku'] + ")");
    let tr = $("<tr>").append(tdIcon).append(tdName).append(tdKakusei).append(tdBP).append(tdIryoku);
    $(target).append(tr);
}

function displayResult() {
    let skillList = USE_SKILL_LIST.slice();
    // 先頭に通常攻撃を入れる
    skillList.unshift(Object.assign({}, NORMAL_ATTACK));
    rewriteBP(skillList);
    setSkillDamage(skillList);
    culcAutoMode(skillList);
    return skillList;
}



var dummy = {"Id": 0, "AttackArea": "自身", 'UseBp': 99, 'AutoUseBp': 99};
function rewriteBP(skillList) {
    if ($("table#skillArea > tfoot").html() === "") {
        skillList.push(Object.assign({}, dummy));
    }
    let skill1 = skillList[1];
    let skill2 = skillList[2];
    let skill3 = skillList[3];
    let skill4 = skillList[4];
    skill1['isNotUseAuto'] = isNotUseAuto(skill1);
    skill2['isNotUseAuto'] = isNotUseAuto(skill2);
    skill3['isNotUseAuto'] = isNotUseAuto(skill3);
    skill4['isNotUseAuto'] = isNotUseAuto(skill4);
    // オートで使わない場合は99にする
    // 覚醒後のBPを参照するのでConsumeBpは使わない
    skill1['AutoUseBp'] = skill1['isNotUseAuto'] ? 99 : skill1['UseBp'];
    skill2['AutoUseBp'] = skill2['isNotUseAuto'] ? 99 : skill2['UseBp'];
    skill3['AutoUseBp'] = skill3['isNotUseAuto'] ? 99 : skill3['UseBp'];
    skill4['AutoUseBp'] = skill4['isNotUseAuto'] ? 99 : skill4['UseBp'];
    if (skill4['AutoUseBp'] === skill3['AutoUseBp']) {
        skill3['AutoUseBp'] = 99; // 継承が3を上書き
    }
    if (skill4['AutoUseBp'] === skill2['AutoUseBp']) {
        skill2['AutoUseBp'] = 99; // 継承が2を上書き
    }
    if (skill4['AutoUseBp'] === skill1['AutoUseBp']) {
        skill1['AutoUseBp'] = 99; // 継承が1を上書き
    }
    if (skill1['AutoUseBp'] === skill2['AutoUseBp']) {
        skill2['AutoUseBp'] = 99; // 1が2を上書き
    } else if (skill2['AutoUseBp'] === skill3['AutoUseBp']) {
        skill3['AutoUseBp'] = 99; // skill2が3を上書き
    }
    skill1['UseCount'] = 0;
    skill2['UseCount'] = 0;
    skill3['UseCount'] = 0;
    skill4['UseCount'] = 0;
    skillList.sort((a, b) => {
        if (a.UseBp > b.UseBp) {
            // 基本は使用BP降順
            return -1;
        } else if (a.UseBp === b.UseBp && a.isKeisho > b.isKeisho) {
            // 使用BPが同じ場合は継承を優先(オートで使われないもののみここに入る)
            return -1;
        }
        return 1;
    });
}

function isNotUseAuto(skillInfo) {
    // 回復、補助、パリィ、セルバ
    if (skillInfo["AttackArea"] === "味方単体" || skillInfo["AttackArea"] === "自身") {
        return true;
    }
    // ナップ、足がらめ
    if (skillInfo["Id"] === "ID77973c5" || skillInfo["Id"] === "ID777ed23") {
        return true;
    }
    return false;
}

// ["Param"]["Lv"]["Per"] = パーセンテージ
// ["Param"]["Lv"]["Bonus"] = ボーナス値
var CULC_DAMAGE_PARAM = {};
function setSkillDamage(skillList) {
    // culcStyleBonus依存
    for (let skillInfo of skillList) {
        CULC_DAMAGE_PARAM = culcSkillDamageWithStyle(NOW_CHAR, 40, NOW_STYLE, 50, skillInfo, 99, 28, 5.5, 85, 0);
        skillInfo['culcDamage'] = CULC_DAMAGE_PARAM['culcDamage'];
    }
}

function culcAutoMode(skillList) {
    //console.log(NOW_CHAR);
    //console.log(NOW_STYLE);
    //console.log(skillList);
    let battleType = NOW_STYLE['WeaponType']; // 弓
    $(".culcAfter").show();
    $("table#culcSummary tbody *").remove();
    $("#culcDetail").html("");
    let summary = $("table#culcSummary tbody");

    if (skillList[0]['Id'] === 0) {
        skillList = skillList.slice(1);
    }
    let detail = $("#culcDetail");
    let message = "シミュレーション結果";
    let x = 0;
    if (NOW_STYLE['hasRenki']) {
        message += "<br>練気高揚(25%)発動時はBPに(+1)と表示されます";
        x = 1;
    }
    detail.append('<label class="badge badge-pill badge-light" style="width:90%">' + message + '</label>');

    var bp = 7;
    var maxTurn = 20;
    var renkiCount = 0;
    var renki = [0, 0, 0, x];
    let turnLabel = (device === "sp") ? "T" : "Turn";

    for (let turn = 1; turn <= maxTurn; turn++) {
        let turnDiv = $('<div>').addClass("darkButton").addClass("keishoSkillArea");
        let left = $('<p>').addClass("floatLeft");
        let right = $('<p>').addClass("floatRight");

        var random = Math.floor(Math.random() * renki.length);
        bp += 3;
        let before = bp;
        let noUse = "";
        for (let skill of skillList) {
            if (skill['isNotUseAuto'] && bp >= skill['UseBp']) {
                // AUTOで使わないのでUseBpを参照する
                noUse = " <small>(" + skill['Name'] + ")</small>";
                skill['UseCount']++;
            }
            if (bp >= skill['AutoUseBp']) {
                bp -= skill['AutoUseBp'];

                left.append(turn + turnLabel);
                if (device !== "sp") {
                    if (skill['AttackAttributes'] === undefined) {
                        skill['BattleType'] = battleType;
                        skill['AttackAttributes'] = WEPON_ATTR[battleType];
                    }
                    //BattleType , AttackAttributes
                    let battleIcon = $('<span>').addClass('icon_xs')
                            .attr("style", getImgUrl('icon/' + ICON_LIST[skill['BattleType']] + ".png"));
                    left.append(battleIcon);
                    skill['AttackAttributes'].split(',').forEach(function (value) {
                        let attrIcon = $('<span>').addClass('icon_xs')
                                .attr("style", getImgUrl('icon/' + ICON_LIST[value] + ".png"));
                        left.append(attrIcon);
                    });
                }
                left.append(" " + skill['Name']);
                if (device !== "sp") {
                    left.append(" 消費BP:" + skill['AutoUseBp']);
                }
                left.append(noUse);
                right.append("<small>ダメージ:" + skill['culcDamage'].toLocaleString() + "</small>");
                right.append(" BP:" + before + " > ");
                skill['UseCount']++;
                break;
            }
        }

        if (renki[random] > 0) {
            renkiCount++;
            //console.log("turn " + turn + " 練気高揚発動 BP:" + bp + " > " + (bp + 1));
            bp++;
            right.append(bp + "(+1)");
            turnDiv.removeClass('darkButton').addClass('darkButtonShine');
        } else {
            right.append(bp);
        }
        turnDiv.append(left).append(right);
        detail.append(turnDiv);
    }

    // サマリ
    let totalIryoku = 0;
    let totalDamage = 0;
    for (let skill of skillList) {
        summary.append("<tr>");
        let td = $("<td>");
        if (device !== "sp" && skill['AttackAttributes'] !== undefined) {
            //BattleType , AttackAttributes
            //BattleType , AttackAttributes
            let battleIcon = $('<span>').addClass('icon_xs')
                    .attr("style", getImgUrl('icon/' + ICON_LIST[skill['BattleType']] + ".png"));
            td.append(battleIcon);
            skill['AttackAttributes'].split(',').forEach(function (value) {
                let attrIcon = $('<span>').addClass('icon_xs')
                        .attr("style", getImgUrl('icon/' + ICON_LIST[value] + ".png"));
                td.append(attrIcon);
            });
        }
        td.append(skill["Name"]);
        summary.append(td);
        summary.append("<td>" + skill["UseBp"] + "</td>");
        summary.append("<td>" + skill["UseCount"] + "</td>");
        let sumIryoku = 0;
        if (skill["AutoUseBp"] !== 99) {
            sumIryoku = skill["SkillIryoku"] * skill["UseCount"];
            totalIryoku += sumIryoku;
            totalDamage += skill["culcDamage"] * Number(skill["UseCount"]);
        }
        summary.append("<td>" + sumIryoku + "</td>");
        summary.append("</tr>");
    }
    summary.append("<tr>");
    summary.append("<td colspan=5 class='text-center' id='avgDamage' style='font-size:200%'>平均ダメージ " + Math.round(totalDamage / maxTurn).toLocaleString() + "</td>");
    summary.append("</tr>");
    if (NOW_STYLE['hasRenki']) {
        summary.append("<tr>");
        summary.append("<td colspan=5 class='text-center'>練気高揚発動回数 = " + renkiCount + "回</td>");
        summary.append("</tr>");
    }
    summary.append("<tr style='border-top: 1px solid'>");
    summary.append("<td colspan=5 class='text-center'>" + "合計ダメージ = " + totalDamage + "<br>合計威力 = " + totalIryoku + "</td>");
    summary.append("</tr>");

    $("#styleRank").html("スタイルLV:50 , 全技Rank:99");
    $("#culcSTR").text("腕力:" + CULC_DAMAGE_PARAM['str']);
    $("#culcSTRDtl").text(CULC_DAMAGE_PARAM['orgSTR'] + " * " + CULC_DAMAGE_PARAM['STRPer'] + "% +" + CULC_DAMAGE_PARAM['STRBonus']);
    $("#culcDEX").text("器用さ:" + CULC_DAMAGE_PARAM['dex']);
    $("#culcDEXDtl").text(CULC_DAMAGE_PARAM['orgDEX'] + " * " + CULC_DAMAGE_PARAM['DEXPer'] + "% +" + CULC_DAMAGE_PARAM['DEXBonus']);
    $("#culcAGI").text("素早さ:" + CULC_DAMAGE_PARAM['agi']);
    $("#culcAGIDtl").text(CULC_DAMAGE_PARAM['orgAGI'] + " * " + CULC_DAMAGE_PARAM['AGIPer'] + "% +" + CULC_DAMAGE_PARAM['AGIBonus']);
    $("#culcINT").text("知力:" + CULC_DAMAGE_PARAM['int']);
    $("#culcINTDtl").text(CULC_DAMAGE_PARAM['orgINT'] + " * " + CULC_DAMAGE_PARAM['INTPer'] + "% +" + CULC_DAMAGE_PARAM['INTBonus']);
    $("#culcWepon").text("武器威力/術威力:" + CULC_DAMAGE_PARAM['wepon']);
    $("#culcAbility").text("アビリティ ダメージ補正:" + CULC_DAMAGE_PARAM['ability'] + "%");
    $("#culcMaster").text("マスターレベル ダメージ補正:" + CULC_DAMAGE_PARAM['master'] + "%");
    $("#culcMasterDtl").text("Lv22〜23");
    $("#culcEnemy").text("敵 体力/精神: 85 属性耐性:0");
}

function initialHide() {
    $(".culcAfter").hide();
    $("#keishoKaijo").hide();
    $("#skillAreaParent").hide();
    $("#culcStart").hide();
    $(".styleChoiceArea").hide();
}
