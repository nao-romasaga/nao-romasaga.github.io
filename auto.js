$(document).ready(function ($) {
    let option = {
        buttons: true, //スライダーのページャを表示する
        startSlide: 0, //最初のスライドを指定する
        arrows: true, //左右の矢印ボタンを表示する
        width: '100%', //横幅を設定する
        height: 250, //高さを設定する
        //autoHeight: true, //高さを設定する
        autoplay: false, //自動再生の設定
        loop: true, //スライドをループさせる設定
        visibleSize: '100%', //前後のスライドを表示するかの設定
        forceSize: 'fullWidth' //スライダーの幅をブラウザ幅に設定する
    };
    option['height'] = (device === "sp") ? 310 : 250;
    $('#slider-pro').sliderPro(option);

    // 後から差し込まれる要素はdocument.onにしないとfunctionがbindされない
    $(document).on('click', '.char', function () {
        $("#skillAreaParent").hide();
        $("#culcStart").hide();
        $("#keishoKaijo").hide();
        $(".skillChoice").html("");
        $("table#skillArea > tbody *").remove();
        $("table#skillArea > tfoot *").remove();
        $("#keisyoSkill").html(""); // クリア
        $("#culcSummaryArea").hide();
        $("table#culcSummary tbody *").remove();
        $("#culcDetail").html("");

        let charId = $(this).attr("data-id");
        $(".char-selected").each(function (i, e) {
            $(this).removeClass('char-winner');
            $(this).addClass('char-aruku');
        });
        $(this).removeClass('char-aruku');
        $(this).addClass('char-winner').addClass('char-selected');
        displayStyleList(charId);
    });
    $(document).on('click', '.style', function () {
        $("#skillAreaParent").show();
        $("#culcStart").show();
        $("#keishoKaijo").show();
        $(".skillChoice").html("");
        $("table#skillArea > tbody *").remove();
        $("table#skillArea > tfoot *").remove();
        $("table#culcSummary tbody *").remove();
        let styleId = $(this).attr("data-id");
        NOW_STYLE = STYLE_MASTER[styleId];
        displaySkillTable(styleId);
    });
    $(document).on('click', '#keishoKaijo', function () {
        $("#noKeisho").show();
        $("table#skillArea > tfoot").html("");
        USE_SKILL_LIST = BASE_SKILL_LIST.slice();
    });

    $(document).on('click', '.keishoSkill', function () {
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
});


var device = getDevice();
var NORMAL_ATTACK = {"Name": "通常攻撃", "AttackArea": "敵単体", "ConsumeBp": 0, "AutoUseBp": 0, "UseBp": 0, "isNotUseAuto": false, "UseCount": 0, "isKeisho": 0, "SkillIryoku": 7};
var BASE_SKILL_LIST = [];
var USE_SKILL_LIST = [];
var NOW_STYLE = {};
$("#culcSummaryArea").hide();
$("#keishoKaijo").hide();
$("#skillAreaParent").hide();
$("#culcStart").hide();
$(".styleChoiceArea").hide();

$("#culcStart").click(function () {
    displayResult();
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
        let color = "background-color: rgb(246,236,100);}";
        if (styleInfo['Rarity'] === "A") {
            color = "background-color: rgb(247,170,150);}";
        } else if (styleInfo['Rarity'] === "S") {
            color = "background-color: rgb(200,224,234);}";
        }

        let imgId = "icon" + styleId;
        let icon = $("<img>");
        icon.attr("id", imgId).addClass("style")
                .attr("data-id", styleId).attr("width", 80).attr("style", color);
        setImgTag("style_icon/" + styleId.substr(2) + ".png", imgId);
        //let link = '<span class="style" data-id="' + styleInfo['Id'] + '">' + styleInfo['AnotherName'] + '</span><br>';
        $("#styleChoice").append(icon);
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
    let imgId = "cutin" + styleId;
    let icon = $("<img>").attr("id", imgId).attr("width", (device === "sp") ? 200 : 320);
    setImgTag("style_cutin/" + styleId.substr(2) + ".png", imgId);
    $("#skillCutin").append(icon);
    let dotId = styleInfo['DotId'].substr(2);
    let img = $("<span>").attr("id", "dot2" + dotId).addClass("char-hashiri").addClass("char");
    $("#skillDot").append(img);
    showimage("dot/" + dotId + ".png", "dot2" + dotId, "400px");

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
        if (styleId === subStyleId) {
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
    let size = (device === "sp") ? 20 : 35;
    let skillLeft = $("<p>").addClass("floatLeft");
    //BattleType , AttackAttributes
    let id = ICON_LIST[skillInfo['BattleType']];
    let img = '<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '" />';
    $(skillLeft).append(img);
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let id = ICON_LIST[value];
        $(skillLeft).append('<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '"/>');
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
            $(this).html(" ◆");
        } else {
            $(this).html(" ◇");
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
        let kCheck = $("<p>").addClass('kakuseiCheck').addClass("floatLeft")
                .addClass('kakusei' + skillInfo['Id'])
                .attr("data-id", skillInfo['Id']).attr("data-kakusei", kakusei);
        $(kCheck).html("◇");
        kakuseiList.push(kCheck);
    }
    let link = "";
    link += '<span class="nowBP' + skillInfo['Id'] + '" data-id="' + skillInfo['Id'] + '" data-bp="' + skillInfo['ConsumeBp'] + '" >' + skillInfo['ConsumeBp'] + '</span>';
    link += "<br>";

    //BattleType , AttackAttributes
    let id = ICON_LIST[skillInfo['BattleType']];
    let img = '<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '" />';
    let tdIcon = $("<td>").append(img);

    let td1 = $("<td>");
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let id = ICON_LIST[value];
        td1.append('<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '"/>');
    });
    td1.append(skillName);

    let td2 = $("<td>");
    for (let obj of kakuseiList) {
        td2.append(obj);
    }
    let td3 = $("<td>").append(link);
    let td4 = $("<td>").append(skillInfo['PowerGrade'] + "(" + skillInfo['SkillIryoku'] + ")");
    let tr = $("<tr>").append(tdIcon).append(td1).append(td2).append(td3).append(td4);
    $(target).append(tr);
}

function displayResult() {
    let skillList = USE_SKILL_LIST.slice();
    // 先頭に通常攻撃を入れる
    skillList.unshift(Object.assign({}, NORMAL_ATTACK));
    rewriteBP(skillList);
    culc(skillList);
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
    // ナップ
    if (skillInfo["Id"] === "ID77973c5") {
        return true;
    }
    return false;
}

function culc(skillList) {
    $("#culcSummaryArea").show();
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
    var renkiCount = 0;
    var renki = [0, 0, 0, x];
    let turnLabel = (device === "sp") ? "T" : "Turn";
    let size = 30;

    for (let turn = 1; turn <= 20; turn++) {
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
                noUse = " <small>(" + skill['Name'] + "チャンス)</small>";
                skill['UseCount']++;
            }
            if (bp >= skill['AutoUseBp']) {
                bp -= skill['AutoUseBp'];

                left.append(turn + turnLabel);
                if (device !== "sp" && skill['AttackAttributes'] !== undefined) {
                    //BattleType , AttackAttributes
                    let id = ICON_LIST[skill['BattleType']];
                    left.append('<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '" />');
                    skill['AttackAttributes'].split(',').forEach(function (value) {
                        let id = ICON_LIST[value];
                        left.append('<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '"/>');
                    });
                }
                left.append(" " + skill['Name']);
                if (device !== "sp") {
                    left.append(" 消費BP:" + skill['AutoUseBp']);
                }
                left.append(noUse);
                right.append("BP:" + before + " > ");
                skill['UseCount']++;
                break;
            }
        }

        if (renki[random] > 0) {
            renkiCount++;
            //console.log("turn " + turn + " 練気高揚発動 BP:" + bp + " > " + (bp + 1));
            bp++;
            right.append(bp + "(+1)");
        } else {
            right.append(bp);
        }
        turnDiv.append(left).append(right);
        detail.append(turnDiv);
    }

    let totalIryoku = 0;
    for (let skill of skillList) {
        summary.append("<tr>");
        let td = $("<td>");
        if (device !== "sp" && skill['AttackAttributes'] !== undefined) {
            //BattleType , AttackAttributes
            let id = ICON_LIST[skill['BattleType']];
            td.append('<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '" />');
            skill['AttackAttributes'].split(',').forEach(function (value) {
                let id = ICON_LIST[value];
                td.append('<img src="' + $("#" + id).attr("src") + '" width="' + size + '" height="' + size + '"/>');
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
        }
        summary.append("<td>" + sumIryoku + "</td>");
        summary.append("</tr>");
    }
    summary.append("<tr>");
    summary.append("<td colspan=5 class='text-center' style='font-size:200%'>合計威力=" + totalIryoku + "</td>");
    summary.append("</tr>");
    if (NOW_STYLE['hasRenki']) {
        summary.append("<tr>");
        summary.append("<td colspan=5 class='text-center'>練気高揚発動回数:" + renkiCount + "回</td>");
        summary.append("</tr>");
    }


}

var CHAR_MASTER, STYLE_MASTER, SKILL_MASTER;
firebase.database().ref('Skill').once("value").then(function (snapshot) {
    SKILL_MASTER = snapshot.val();
    //console.log(snapshot.val());
});
firebase.database().ref('Style').once("value").then(function (snapshot) {
    STYLE_MASTER = snapshot.val();
    //console.log(snapshot.val());
});

firebase.database().ref('Char').once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    CHAR_MASTER = snapshot.val();
    let idx = {};
    let width = (device === "sp") ? 6 : 12;
    for (let i in CHAR_MASTER) {
        if (CHAR_MASTER[i]['Holders'] === undefined) {
            continue;
        }
        let series = CHAR_MASTER[i]['Series'];
        if (idx[series] >= 24) {
            series = series + "2";
        }

        if (idx[series] === undefined) {
            idx[series] = 0;
        }
        let dotId = CHAR_MASTER[i]['DotId'];
        let pngName = (dotId !== "ID4e2c8") ? dotId.substr(2) : "4e2c9";
        let id = CHAR_MASTER[i]['Id'];
        let img = $("<span>").attr("id", "dot" + dotId)
                .addClass("char-aruku").addClass("char").addClass("char-bottom").attr("data-id", id);
        $("#" + series).append(img);
        if (++idx[series] % width == 0) {
            $("#" + series).append("<br>");
        }
        showimage("dot/" + pngName + ".png", "dot" + dotId, "400px");
    }
});
setImgTag("icon/icon_ken.png", "icon_ken");
setImgTag("icon/icon_dken.png", "icon_dken");
setImgTag("icon/icon_sken.png", "icon_sken");
setImgTag("icon/icon_ono.png", "icon_ono");
setImgTag("icon/icon_yumi.png", "icon_yumi");
setImgTag("icon/icon_yari.png", "icon_yari");
setImgTag("icon/icon_kon.png", "icon_kon");
setImgTag("icon/icon_tai.png", "icon_tai");
setImgTag("icon/icon_ju.png", "icon_ju");
setImgTag("icon/icon_hi.png", "icon_hi");
setImgTag("icon/icon_mizu.png", "icon_mizu");
setImgTag("icon/icon_tsuchi.png", "icon_tsuchi");
setImgTag("icon/icon_kaze.png", "icon_kaze");
setImgTag("icon/icon_hikari.png", "icon_hikari");
setImgTag("icon/icon_yami.png", "icon_yami");
setImgTag("icon/icon_zan.png", "icon_zan");
setImgTag("icon/icon_da.png", "icon_da");
setImgTag("icon/icon_totsu.png", "icon_totsu");
setImgTag("icon/icon_netsu.png", "icon_netsu");
setImgTag("icon/icon_rei.png", "icon_rei");
setImgTag("icon/icon_rai.png", "icon_rai");
setImgTag("icon/icon_in.png", "icon_in");
setImgTag("icon/icon_yo.png", "icon_yo");
