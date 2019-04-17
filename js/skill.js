var SKILL_MASTER, STYLE_MASTER, ABILITY_MASTER, CHAR_MASTER;
var skillTypeList = {};
var optionList = {
    "剣": "skill_ken", "大剣": "skill_dken", "斧": "skill_ono",
    "小剣": "skill_sken", "槍": "skill_yari", "弓": "skill_yumi",
    "棍棒": "skill_kon", "体術": "skill_tai", "銃": "skill_ju",
    "杖": "skill_tsue",
    "近": "skill_kin",
    "遠": "skill_en",
    "斬": "skill_zan", "突": "skill_totsu", "打": "skill_da",
    "熱": "skill_netsu", "冷": "skill_rei", "雷": "skill_rai",
    "陰": "skill_in", "陽": "skill_yo",
    "敵単体": "skill_tantai", "敵縦一列": "skill_tate", "敵横一列": "skill_yoko",
    "敵全体": "skill_zentai", "自身": "skill_jishin", "味方単体": "skill_mikata",
    "ファスト": "skill_fast", "ディレイ": "skill_delay",
    "火術": "skill_hi", "水術": "skill_mizu", "風術": "skill_kaze",
    "土術": "skill_tsuchi", "光術": "skill_hikari", "闇術": "skill_yami",
    "スタン": "skill_sutan", "マヒ": "skill_mahi", "即死": "skill_sokushi", "毒": "skill_doku", "石化": "skill_sekika",
    "魅了": "skill_miryo", "眠り": "skill_nemuri", "混乱": "skill_konran", "狂戦士": "skill_kyosenshi", "暗闇": "skill_kurayami",
    "腕力": "skill_deb_wan", "体力": "skill_deb_tai",
    "器用さ": "skill_deb_kiyo", "素早さ": "skill_deb_suba",
    "知力": "skill_deb_chi", "精神": "skill_deb_sei",
    "E": "skill_iryoku_e", "D": "skill_iryoku_d", "C": "skill_iryoku_c",
    "B": "skill_iryoku_b", "A": "skill_iryoku_a", "S": "skill_iryoku_s",
    "SS": "skill_iryoku_ss", "SSS": "skill_iryoku_sss", "-": "skill_iryoku_none",
};

$(document).ready(function ($) {
    for (let key in optionList) {
        skillTypeList[optionList[key]] = [];
    }

    readFile('Char', function (result) {
        CHAR_MASTER = result;
    });
    readFile('Skill', function (result) {
        SKILL_MASTER = result;
        createSkillList();
    });
    readFile('Style', function (result) {
        STYLE_MASTER = result;
    });
    readFile('Ability', function (result) {
        ABILITY_MASTER = result;
    });

    // 技選択のアイコンなど...ちゃんとクラス名つけた方がよかとよ？
    $(".nav-link").click(function () {
        $("table#skill_holder_table tbody *").remove();
        $("#skill_holder_list").html("");

        let id = $(this).attr('href').substr(1);
        let labelId = $(this).attr('href').substr(7);
        //console.log(labelId);
        $("#skill_name_label").text(SKILL_NAME_LABEL[labelId]); // "#skill_"を除去
        $("#skillList").hide();
        $("#skillList").html("");
        for (let key in skillTypeList[id]) {
            let skillInfo = skillTypeList[id][key];
            let skillName = skillLabel(skillInfo);
            $("#skillList").append(skillName);
        }
        $("#skillList").slideDown(300);
        $("html,body").animate({scrollTop: $('#skill_name_label').offset().top});
    });

    // 後から差し込まれる要素はdocument.onにしないとfunctionがbindされない
    $(document).on('click', '.skill_select', function () {
        var skillId = $(this).attr("data-id");
        displaySkillHolders(skillId);
    });
    function displaySkillHolders(skillId) {
        $("html,body").animate({scrollTop: $('#holder_label').offset().top});
        var skillInfo = SKILL_MASTER[skillId];

        $("table#skill_holder_table tbody *").remove();
        $("#skill_holder_list").html("");

        let holderResult = [];
        for (key in skillInfo['Holders']) {
            let styleId = skillInfo['Holders'][key];
            let styleInfo = STYLE_MASTER[styleId];
            let charInfo = CHAR_MASTER[styleInfo['CharacterId']];
            let result = culcSkillDamageWithStyleBase(charInfo, styleInfo, skillInfo);
            result = Object.assign(result, styleInfo);
            holderResult.push(result);
        }
        holderResult.sort((a, b) => {
            if (a.culcDamage > b.culcDamage) {
                return -1;
            }
            return 1;
        });
        let bgsize = "70px !important;";
        let size = "width:70px;height:70px;";
        for (key in holderResult) {
            let styleInfo = holderResult[key];
            let styleId = styleInfo["Id"];
            // スタイルアイコンの追加
            let icon = $("<div>").addClass("style")
                    .addClass(getStyleIconClass(styleInfo['Rarity']))
                    .attr("style", getImgUrl('style_icon/' + styleId + ".png") + "; " + size + " background-size: " + bgsize)
                    .attr("data-id", styleId);
            let background = $("<span>")
                    .attr("style", size)
                    .addClass(getStyleIconBgClass(styleInfo['Rarity']))
                    .append(icon);

            let padding = $("<div>").addClass('col-3 col-sm-2 text-center')
                    .append(background)
                    .append("<p class='pad0 damage-label'>ダメージ " + styleInfo["culcDamage"] + "</p>")
                    .append("<div class='style-label'>" + styleInfo["Name"] + "</div>")
                    ;
            $("#skill_holder_list").append(padding);
        }
        for (key in holderResult) {
            let styleInfo = holderResult[key];
            let styleId = styleInfo["Id"];
            let colorClass = getStyleBgColor(styleInfo["Rarity"]);
            let trHead = $("<tr>").addClass(colorClass).addClass("darkButton").attr("style", "border:initial;");
            let score = $("<td>").addClass("text-center");
            score.append("<b>" + styleInfo['culcDamage'] + "</b>");
            let button = '　<button class="icon_info" data-toggle="tooltip" data-placement="top" title="' + "アビリティ倍率:" + styleInfo['ability'] + "% " + styleInfo['culcKey'] + ":" + styleInfo['culcValue'] + '"></button>';
            score.append(button);
            trHead.append(score);

            trHead.append("<td colspan=2>" + styleInfo['Name'] + styleInfo['AnotherName'] + "</td>");
            let tr = $("<tr>").addClass(colorClass);
            let iconTD = $("<td>").addClass("text-center");
            // スタイルアイコンの追加
            let icon = $("<div>").addClass("style")
                    .addClass(getStyleIconClass(styleInfo['Rarity']))
                    .attr("style", getImgUrl('style_icon/' + styleId + ".png"))
                    .attr("data-id", styleId);
            let background = $("<span>")
                    .addClass(getStyleIconBgClass(styleInfo['Rarity']))
                    .attr("style", "width:80px")
                    .attr("style", "justify-content: space-between;")
                    .append(icon);
            iconTD.append(background);

            let infoTD = $("<td>").addClass("small");
            infoTD.append(styleInfo['Skill'].join("<br>"));
            let ab = [];
            for (let lv in styleInfo['StyleAbility']) {
                ab.push(styleInfo['StyleAbility'][lv]);
            }
            let abilityTD = $("<td>").addClass("small");
            abilityTD.append(ab.join("<br>"));
            //console.log(styleInfo);

            tr.append(iconTD);
            tr.append(infoTD);
            tr.append(abilityTD);

            $("table#skill_holder_table tbody").append(trHead).append(tr);
        }
        $('[data-toggle="tooltip"]').tooltip();
    }
    //displaySkillHolders("ID69184db");
});


function skillLabel(skillInfo) {
    let skillList = $("<button>").addClass("skill_select").addClass("keishoSkill").attr("data-id", skillInfo['Id']);
    let topDiv = $('<div>').attr('style', 'width:100%; display: inline-flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid;');
    // 武器種別 BattleType、名称、所有数
    let skillName = $("<p>").addClass("text-left").attr('style', 'margin:0;');
    skillName.append(skillInfo['Name']);    // 技名称
    let skillRight = $("<p>").addClass('text-right').addClass('small').attr('style', 'margin:0;');
    skillRight.append("覚醒:" + skillInfo['Kakusei']);
    skillRight.append(" BP:" + skillInfo['ConsumeBp']);
    skillRight.append(" 威力:" + skillInfo['PowerGrade'] + "(" + skillInfo['SkillIryoku'] + ")");
    topDiv.append(skillName).append(skillRight);

    // 属性 AttackAttributes
    let bottomDiv = $('<div>').attr('style', 'display: table-cell; vertical-align: middle; height:30px');
    bottomDiv.append($('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['BattleType']]));
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let img = $('<span>').addClass('icon_sm').addClass(ICON_LIST[value]);
        bottomDiv.append(img);
    });
    if (skillInfo['BadStatus'] != "") {
        let img = $('<span>').addClass('').addClass("icon_sm").addClass(ICON_LIST[skillInfo['BadStatus']]);
        bottomDiv.append(img);
    }
    if (skillInfo['DeBuff'] != "") {
        let img = $('<span>').addClass('icon_sm_buf').addClass(ICON_LIST[skillInfo['DeBuff'] + "低下"]);
        bottomDiv.append(img);
    }
    if (skillInfo['AttackDistance'] !== "近") {
        bottomDiv.append("[" + skillInfo['AttackDistance'] + "]");
    }
    if (skillInfo['AttackArea'] !== "敵単体") {
        bottomDiv.append("[" + AREA_SHORT[skillInfo['AttackArea']] + "]");
    }
    if (skillInfo['Fast']) {
        bottomDiv.append("[ファスト]");
    }
    if (skillInfo['Delay']) {
        bottomDiv.append("[ディレイ]");
    }
    bottomDiv.append(" 所持者(" + skillInfo['Holders'].length + ")");   // 所有者数

    skillList.append(topDiv).append(bottomDiv);

    return skillList;
}


function createSkillList() {
    for (let key in SKILL_MASTER) {
        let row = SKILL_MASTER[key];
        // 威力設定されてないものは未実装もあるので弾いておく
        if (row['Holders'] !== undefined) {
            skillTypeList[optionList[row['BattleType']]].push(row);
            skillTypeList[optionList[row['AttackArea']]].push(row);
            skillTypeList[optionList[row['AttackDistance']]].push(row);

            // 威力だけは再ソートかけるので中身を入れておく
            skillTypeList[optionList[row['PowerGrade']]].push(row);

            // 特殊な奴ら
            if (row['Fast']) {
                skillTypeList[optionList["ファスト"]].push(row);
            }
            if (row['Delay']) {
                skillTypeList[optionList["ディレイ"]].push(row);
            }
            if (row['BadStatus'] != "") {
                skillTypeList[optionList[row['BadStatus']]].push(row);
            }
            if (row['DeBuff'] != "") {
                skillTypeList[optionList[row['DeBuff']]].push(row);
            }

            let attackAttributes = row['AttackAttributes'];
            attackAttributes.split(',').forEach(function (attr) {
                skillTypeList[optionList[attr]].push(row);
            });
        }
    }
    for (let key in skillTypeList) {
        skillTypeList[key] = sortSkill(skillTypeList[key]);
    }
}

function sortSkill(typeList) {
    //console.log(typeList);
    typeList.sort(function (a, b) {
        if (a.SkillIryoku === "-") {
            return 1;
        } else if (a.SkillIryoku > b.SkillIryoku) {
            return -1;
        } else if (a.SkillIryoku < b.SkillIryoku) {
            return 1;
        } else if (a.ConsumeBp < b.ConsumeBp) {
            return -1;
        } else if (a.ConsumeBp > b.ConsumeBp) {
            return 1;
        } else if (a.AttackAttributes > b.AttackAttributes) {
            return -1;
        }
        return 0;
    });
    return typeList;
}

var SKILL_NAME_LABEL = {
    "ken": "剣", "dken": "大剣", "ono": "斧", "yari": "槍", "sken": "小剣", "yumi": "弓", "kon": "棍棒", "tai": "体術", "ju": "銃",
    "hi": "火術", "mizu": "水術", "kaze": "風術", "tsuchi": "土術", "hikari": "光術", "yami": "闇術",
    "netsu": "熱属性", "rei": "冷属性", "rai": "雷属性", "in": "陰属性", "you": "陽属性",
    "doku": "毒付与", "mahi": "マヒ付与", "kurayami": "暗闇付与", "sutan": "スタン付与", "nemuri": "睡眠付与", "sekika": "石化付与", "konran": "混乱付与", "miryo": "魅了付与", "kyosenshi": "狂戦士付与", "sokushi": "即死",
    "deb_wan": "腕力減少付与", "deb_tai": "体力減少付与", "deb_kiyo": "器用さ減少付与", "deb_suba": "素早さ減少付与", "deb_chi": "知力減少付与", "deb_sei": "精神減少付与"
    , "zentai": "全体攻撃", "tate": "縦一列攻撃", "yoko": "横一列攻撃", "mikata": "味方単体対象", "kin": "近接攻撃", "en": "遠距離攻撃",
    "jishin": "自身が対象", "fast": "ファスト効果", "delay": "ディレイ効果",
    "iryoku_e": "技威力[E]", "iryoku_d": "技威力[D]", "iryoku_c": "技威力[C]", "iryoku_b": "技威力[B]", "iryoku_a": "技威力[A]",
    "iryoku_s": "技威力[S]", "iryoku_ss": "技威力[SS]", "iryoku_sss": "技威力[SSS]"
};
$(function () {
    var isDisplay = false;
    var TopBtn = $('#PageTopBtn');
    TopBtn.css('bottom', '-200px');
    var isDisplay = false;
    //スクロール位置が100でボタンを表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            if (isDisplay == false) {
                isDisplay = true;
                TopBtn.stop().animate({'bottom': '-10px'}, 200);
            }
        } else {
            if (isDisplay) {
                isDisplay = false;
                TopBtn.stop().animate({'bottom': '-200px'}, 200);
            }
        }
    });
    //ボタンを押下するとトップへ移動
    TopBtn.click(function () {
        $("html,body").animate({scrollTop: $('#weponLabel').offset().top});
        return false;
    });
});
