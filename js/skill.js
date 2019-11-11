if(typeof firebase !== 'undefined'){
    firebase.database().goOffline();
    firebase.database(appUsers).goOffline();
}

var SKILL_MASTER_LIST = [];
var skillTypeList = {};
var NOW_LIST;
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
    "直接": "skill_cyoku", "間接": "skill_kan",
    "敵全体": "skill_zentai", "自身": "skill_jishin", "味方単体": "skill_mikata","敵ランダム": "skill_random",
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
    "浮遊": "skill_crit_fuyu", "不死": "skill_crit_fushi", "水棲": "skill_crit_suise", "植物": "skill_crit_shoku",
    "虫": "skill_crit_mushi", "骨": "skill_crit_hone", "岩石": "skill_crit_gan", "人間": "skill_crit_nin", "女性": "skill_crit_jo",
    "カエル": "skill_crit_kaeru", "獣": "skill_crit_kemo", "火精": "skill_crit_fire", "魚": "skill_crit_fish", "悪魔": "skill_crit_devil","巨人": "skill_crit_giant", 
};
let color = ["black", "blue", "green", "orange", "purple", "red", "yellow", "white"];
let color2 = ["黒", "青", "緑", "橙", "紫", "赤", "黄", "白"];
var SKILL_NAME_LABEL = {
    "ken": "剣", "dken": "大剣", "ono": "斧", "yari": "槍", "sken": "小剣", "yumi": "弓", "kon": "棍棒", "tai": "体術", "ju": "銃",
    "hi": "火術", "mizu": "水術", "kaze": "風術", "tsuchi": "土術", "hikari": "光術", "yami": "闇術",
    "zan": "斬属性", "da": "打属性", "totsu": "突属性",
    "netsu": "熱属性", "rei": "冷属性", "rai": "雷属性", "in": "陰属性", "you": "陽属性",
    "doku": "毒付与", "mahi": "マヒ付与", "kurayami": "暗闇付与", "sutan": "スタン付与", "nemuri": "睡眠付与", "sekika": "石化付与", "konran": "混乱付与", "miryo": "魅了付与", "kyosenshi": "狂戦士付与", "sokushi": "即死",
    "deb_wan": "腕力減少付与", "deb_tai": "体力減少付与", "deb_kiyo": "器用さ減少付与", "deb_suba": "素早さ減少付与", "deb_chi": "知力減少付与", "deb_sei": "精神減少付与"
    , "zentai": "全体攻撃", "tate": "縦一列攻撃", "yoko": "横一列攻撃", "mikata": "味方単体対象", "kin": "近接攻撃", "en": "遠距離攻撃",
    "jishin": "自身が対象", "fast": "ファスト効果", "delay": "ディレイ効果",
    "iryoku_e": "技威力[E]", "iryoku_d": "技威力[D]", "iryoku_c": "技威力[C]", "iryoku_b": "技威力[B]", "iryoku_a": "技威力[A]",
    "iryoku_s": "技威力[S]", "iryoku_ss": "技威力[SS]", "iryoku_sss": "技威力[SSS]",
    "kan": "間接攻撃", "cyoku": "直接攻撃"
    , "crit_fuyu": "浮遊特効", "crit_fushi": "不死特効", "crit_suise": "水棲特効", "crit_shoku": "植物特効", "crit_mushi": "虫特効"
    , "crit_hone": "骨特効", "crit_gan": "岩石特効", "crit_nin": "人間特効", "crit_jo": "女性特効", "crit_kaeru": "カエル特効"
    , "crit_kemo": "獣特効", "crit_fire": "火精特効", "crit_fish": "魚特効", "crit_devil": "悪魔特効"
};
var SKILL_NAME_SEARCH = {
    "ken": "剣", "dken": "大剣", "ono": "斧", "yari": "槍", "sken": "小剣", "yumi": "弓", "kon": "棍棒", "tai": "体術", "ju": "銃",
    "hi": "火術", "mizu": "水術", "kaze": "風術", "tsuchi": "土術", "hikari": "光術", "yami": "闇術",
    "zan": "斬", "da": "打", "totsu": "突",
    "netsu": "熱", "rei": "冷", "rai": "雷", "in": "陰", "yo": "陽",
    "doku": "毒", "mahi": "マヒ", "kurayami": "暗闇", "sutan": "スタン", "nemuri": "眠り", "sekika": "石化", "konran": "混乱", "miryo": "魅了", "kyosenshi": "狂戦士", "sokushi": "即死",
    "deb_wan": "腕力", "deb_tai": "体力", "deb_kiyo": "器用さ", "deb_suba": "素早さ", "deb_chi": "知力", "deb_sei": "精神",
    "zentai": "敵全体", "tate": "敵縦一列", "yoko": "敵横一列", "mikata": "味方単体", "kin": "近", "en": "遠",
    "jishin": "自身",
    "iryoku_e": "E", "iryoku_d": "D", "iryoku_c": "C", "iryoku_b": "B", "iryoku_a": "A", "iryoku_s": "S", "iryoku_ss": "SS", "iryoku_sss": "SSS"
    , "crit_fuyu": "浮遊", "crit_fushi": "不死", "crit_suise": "水棲", "crit_shoku": "植物", "crit_mushi": "虫"
    , "crit_hone": "骨", "crit_gan": "岩石", "crit_nin": "人間", "crit_jo": "女性", "crit_kaeru": "カエル"
    , "crit_kemo": "獣", "crit_fire": "火精", "crit_fish": "魚", "crit_devil": "悪魔", "crit_giant": "巨人"
};

for (let i in color) {
    let c = color[i];
    optionList[c + "1"] = "skill_" + c + "1";
    optionList[c + "2"] = "skill_" + c + "2";
    optionList[c + "3"] = "skill_" + c + "3";
    SKILL_NAME_LABEL[c + "1"] = color2[i] + "砂";
    SKILL_NAME_LABEL[c + "2"] = color2[i] + "石";
    SKILL_NAME_LABEL[c + "3"] = color2[i] + "宝石";
}
for (let i = 1; i <= 20; i++) {
    optionList["bp" + i] = "skill_bp" + i;
    SKILL_NAME_SEARCH["bp" + i] = i;
}


for (let key in optionList) {
    skillTypeList[optionList[key]] = [];
}

createSkillMasterList(SKILL_MASTER);

function filterList(skillList, arySearch, targetCol) {
    let equalMatch = (["BattleType", "PowerGrade", "ConsumeBp"].indexOf(targetCol) > -1) ? true : false;
    if (targetCol === "AttackKansetsu") {
        for (let i in arySearch) {
            arySearch[i] = (arySearch[i] === "kan") ? true : false;
        }
        equalMatch = true;
    }

    let result = [];
    for (let i in skillList) {
        for (let word of arySearch) {
            if (equalMatch && skillList[i][targetCol] === word) {
                result.push(skillList[i]);
            } else if (!equalMatch && skillList[i][targetCol].indexOf(word) > -1) {
                result.push(skillList[i]);
            }
        }
    }
    return result;
}

$(document).ready(function ($) {
    countSkill(SKILL_MASTER);

    $(".selectJoken").hide();
    $("._FilterLink").click(function () {
        $(".selectJoken").hide();

        $(this).toggleClass("filterActive");

        $("#skill_holder_list").html("");
        let nowList = SKILL_MASTER_LIST.concat();
        let searchList = {};
        let dispLabel = [];
        let dispFlag = false;
        $("._FilterLink").each(function () {
            if ($(this).hasClass("filterActive")) {
                dispFlag = true;
                let id = $(this).attr('href').substr(1);
                let labelId = $(this).attr('href').substr(7);
                dispLabel.push(SKILL_NAME_LABEL[labelId]);
                let targetCol = $(this).attr('data-col');
                if (searchList[targetCol] === undefined) {
                    searchList[targetCol] = [];
                }
                let label = (SKILL_NAME_SEARCH[labelId] !== undefined) ? SKILL_NAME_SEARCH[labelId] : labelId;
                searchList[targetCol].push(label);
            }
        });
        for (let col in searchList) {
            nowList = filterList(nowList, searchList[col], col);
        }
        countSkill(nowList);
        NOW_LIST = nowList;

        $("#skill_name_label").text(dispLabel.join("&")); // "#skill_"を除去
        $("#skillList").hide();
        $("#skillList").html("");
        $("#skill_damage_ranking").html("");
        $("#SKILL_NAME").html("");
        $("#SKILL_TEXT").html("");

        if (dispFlag) {
            $(".selectJoken").show();

            var sort = "bp";
            var desc = true;
            if ($("#SORT_IRYOKU").hasClass("icon_btn_on")) {
                sort = "iryoku";
                desc = $("#SORT_IRYOKU").hasClass("desc");
            } else {
                desc = $("#SORT_BP").hasClass("desc");
            }
            if (sort === "bp") {
                sortSkillBP(nowList, desc);
            } else {
                sortSkillIryoku(nowList, desc);
            }
        }
    });

    // 後から差し込まれる要素はdocument.onにしないとfunctionがbindされない
    $(document).on('click', '.skill_select', function () {
        var skillId = $(this).attr("data-id");
        displaySkillHolders(skillId);
    });
    //displaySkillHolders("ID69184db");
    $(".sortButton").click(function () {
        $(".sortButton").removeClass("icon_btn_on").addClass("icon_btn_off");
        $(this).removeClass("icon_btn_off").addClass("icon_btn_on");
        var desc = false;
        if ($(this).hasClass("asc")) {
            desc = true;
            $(this).removeClass("asc").addClass("desc");
        } else {
            $(this).removeClass("desc").addClass("asc");
        }

        var id = $(this).attr("data-id");
        if (id === "bp") {
            $("#BP_SORT_ASC").toggleClass("d-none");
            $("#BP_SORT_DESC").toggleClass("d-none");
            sortSkillBP(NOW_LIST, desc);
        } else {
            $("#IRYOKU_SORT_ASC").toggleClass("d-none");
            $("#IRYOKU_SORT_DESC").toggleClass("d-none");
            sortSkillIryoku(NOW_LIST, desc);
        }
    });
});
function skillLabelDiplay(skillInfo) {
    let template = $("#SKILL_TEMPLATE").clone().attr("id", "").attr("data-id", skillInfo['Id']).removeClass("d-none");
    template.find(".skillNameClass")
            .append($('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['BattleType']]).text("　"))
            .append(skillInfo['Name']);
    let iconClass = KAKUSEI_COLOR[skillInfo['KakuseiSozai']] + KAKUSEI_ICON[skillInfo['Kakusei']];
    let iconJp = KAKUSEI_JP[skillInfo['KakuseiSozai']];
    template.find(".skillKakuseiArea")
            .append("覚醒:" + skillInfo['Kakusei'])
            .append(` <span class="fukidashi" style="display: inline-block"><span class="icon_${iconClass}" style="width:25px;height:25px; display: inline-block;background-size: contain;">　</span></span>${iconJp}`);


    let iconArea = template.find(".iconArea");
    // 属性 AttackAttributes
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        iconArea.append($('<span>').addClass('icon_sm').addClass(ICON_LIST[value]).text("　"));
    });
    if (skillInfo['BadStatus'] != "") {
        iconArea.append($('<span>').addClass("icon_sm").addClass(ICON_LIST[skillInfo['BadStatus']]).text("　"));
    }
    if (skillInfo['Buff'] != "") {
        if (skillInfo['Buff'] === "HP") {
            iconArea.append("[HP回復]");
        } else {
            let img = $('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['Buff'] + "上昇"]).text("　");
            iconArea.append(img);
        }
    }
    if (skillInfo['DeBuff'] != "") {
        iconArea.append($('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['DeBuff'] + "低下"]).text("　"));
    }

    if (skillInfo['AttackDistance'] !== "近" && skillInfo['AttackArea'] !== "敵全体") {
        iconArea.append("[" + skillInfo['AttackDistance'] + "]");
    }
    if (skillInfo['AttackArea'] !== "敵単体") {
        iconArea.append("[" + AREA_SHORT[skillInfo['AttackArea']] + "]");
    }
    if (skillInfo['AttackKansetsu']) {
        iconArea.append("[間接]");
    }
    if (skillInfo['Fast']) {
        iconArea.append("[ファスト]");
    }
    if (skillInfo['Delay']) {
        iconArea.append("[ディレイ]");
    }
    let iryoku = (skillInfo['SkillIryoku'] === 0) ? IRYOKU_LIST[skillInfo['PowerGrade']] : skillInfo['SkillIryoku'];
    template.find(".iryokuArea")
            .append("　BP:" + skillInfo['ConsumeBp'])
            .append(" 威力:" + skillInfo['PowerGrade'] + "(" + iryoku + ")");
    let holder = template.find(".holderStyleArea");
    for (let key in skillInfo['Holders']) {
        let styleId = skillInfo['Holders'][key];
        let styleInfo2 = STYLE_MASTER[styleId];
        // スタイルアイコンの追加
        let icon = $("<div>").addClass("style")
                .addClass(getStyleIconClass(styleInfo2['Rarity']))
                .attr("style", getImgUrl('style_icon/' + styleId + ".png") + "; width:35px;height:35px; background-size: 35px !important;")
                .attr("data-id", styleId);
        let background = $("<span>")
                .attr("style", "width:35px;height:35px;")
                .addClass(getStyleIconBgClass(styleInfo2['Rarity']))
                .append(icon);

        holder.append(background);
    }
    return template;
}

var STYLE_ICON_BG_SIZE = "70px !important;";
var STYLE_ICON_SIZE = "width:70px;height:70px;";
function createStyleIcon(styleInfo, skillInfo) {
    let styleId = styleInfo["Id"];
    // スタイルアイコンの追加
    let icon = $("<div>").addClass("style")
            .addClass(getStyleIconClass(styleInfo['Rarity']))
            .attr("style", getImgUrl('style_icon/' + styleId + ".png") + "; " + STYLE_ICON_SIZE + " background-size: " + STYLE_ICON_BG_SIZE)
            .attr("data-id", styleId);
    let background = $("<span>")
            .attr("style", STYLE_ICON_SIZE)
            .addClass(getStyleIconBgClass(styleInfo['Rarity']))
            .append(icon);

    let padding = $("<div>").addClass('col-3 col-sm-2 text-center')
            .append(background);
    if (skillInfo['SkillIryoku'] !== "-") {
        padding.append("<p class='pad0 damage-label'>ダメージ " + styleInfo["culcDamage"] + "</p>")
                .append("<div class='style-label'>" + styleInfo["Name"] + "</div>");
    }
    return padding;
}
function displaySkillHolders(skillId) {
    $("html,body").animate({scrollTop: $('#SKILL_NAME').offset().top});
    var skillInfo = SKILL_MASTER[skillId];
    $("#SKILL_NAME").html(`<h5 style="padding:top: 5px;">${skillInfo['Name']}</h5>`);
    $("#SKILL_TEXT").html(`${skillInfo['FlavorText']}`);

    $("#skill_holder_list").html("");

    // 技所持者の表示
    let holderResult = [];
    for (key in skillInfo['Holders']) {
        let styleId = skillInfo['Holders'][key];
        let styleInfo = STYLE_MASTER[styleId];
        let charInfo = CHAR_MASTER[styleInfo['cId']];
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

    // 技所持者の継承含めたスタイル分の追加
    let holderStyleResult = [];
    let tmpStyle = [];
    for (key in skillInfo['Holders']) {
        let styleInfo = STYLE_MASTER[skillInfo['Holders'][key]];
        let charInfo = CHAR_MASTER[styleInfo['cId']];
        for (key in charInfo['Holders']) {
            let styleInfoTmp = STYLE_MASTER[charInfo['Holders'][key]];
            if (tmpStyle.indexOf(styleInfoTmp["Id"]) > -1) {
                continue;
            }
            tmpStyle.push(styleInfoTmp["Id"]);
            let result = culcSkillDamageWithStyleBase(charInfo, styleInfoTmp, skillInfo);
            result = Object.assign(result, styleInfoTmp);
            holderStyleResult.push(result);
        }
    }
    holderStyleResult.sort((a, b) => {
        if (a.culcDamage > b.culcDamage) {
            return -1;
        }
        return 1;
    });
    $("#skill_damage_ranking").html("");
    for (key in holderStyleResult) {
        var card = createSkillCard(holderStyleResult[key]);
        $("#skill_damage_ranking").append(card);
    }
    // 技所持者の詳細表示
    for (key in holderResult) {
        var card = createSkillCard(holderResult[key]);
        $("#skill_holder_list").append(card);
    }
}

function createSkillCard(styleInfo){
    let ab = [];
    for (let lv in styleInfo['StyleAbility']) {
        ab.push(styleInfo['StyleAbility'][lv]);
    }

    var card = `<div class="col-12 style-skill-list" style="padding: 0px 5px;">`;
    card+=`<div class="row no-gutters">`;
    card+=`<div style="width:35px; height:35px; position: absolute;background: url(./img/icon/icon_${styleInfo['Rarity']}.png) no-repeat; background-size: cover;"></div>`;
    card+=`<div style="width:100%;height:100%;position: absolute;background: url(./img/style_cutin/${styleInfo['Id']}.png) no-repeat; background-size: cover; opacity: 0.5;"></div>`;
    card+=`<div class="col-12 text-center">${styleInfo['Name']}<small>${styleInfo['AnotherName']}</small></div>`;
    card+=`<div class="col-7"><span style="font-size:30px">${styleInfo['culcDamage'].toLocaleString()}</span></div>`;
    card+=`<div class="col-5 text-nowrap small">`+ styleInfo['dispValue'];
    if(styleInfo['ability'] > 0){
        card+= "<br>アビリティ:+"+styleInfo['ability'] + "%</div>";
    }
    card+=`</div>`; // アビリティ
    card+=`<div class="col-12 text-nowrap small">${ab.join("/")}</div>`;
    card+=`</div>`; // row
    card+=`</div>`; // style-skill
    return card;    
}

function createSkillMasterList(result) {
    for (let i in result) {
        if (result[i]["Fast"]) {
            result[i]["FastDelay"] = "fast";
        } else if (result[i]["Delay"]) {
            result[i]["FastDelay"] = "delay";
        } else {
            result[i]["FastDelay"] = "";
        }
        result[i]["KakuseiSearch"] = result[i]["KakuseiSozai"] + result[i]["Kakusei"];
        if (result[i]['Holders'] !== undefined) {
            SKILL_MASTER_LIST.push(result[i]);
        }
    }
}
function countSkill(targetList) {
    let tmpList = {};
    for (let key in optionList) {
        tmpList[optionList[key]] = [];
    }
    for (let key in targetList) {
        let row = targetList[key];
        // 威力設定されてないものは未実装もあるので弾いておく
        if (row['Holders'] !== undefined) {
            tmpList["skill_bp" + row['ConsumeBp']].push(row);
            tmpList[optionList[row['BattleType']]].push(row);
            tmpList[optionList[row['AttackArea']]].push(row);
            tmpList[optionList[row['AttackDistance']]].push(row);
            tmpList[optionList[row['KakuseiSozai'] + row['Kakusei']]].push(row);
            if (row['CriticalTargets'] !== "") {
                let cList = row['CriticalTargets'].split(",");
                for (let c of cList) {
                    tmpList[optionList[c]].push(row);
                }
            }

            // 威力だけは再ソートかけるので中身を入れておく
            tmpList[optionList[row['PowerGrade']]].push(row);

            // 特殊な奴ら
            if (row['Fast']) {
                tmpList[optionList["ファスト"]].push(row);
            }
            if (row['Delay']) {
                tmpList[optionList["ディレイ"]].push(row);
            }
            if (row['BadStatus'] != "") {
                tmpList[optionList[row['BadStatus']]].push(row);
            }
            if (row['DeBuff'] != "") {
                tmpList[optionList[row['DeBuff']]].push(row);
            }
            let cyokukan = (row['AttackKansetsu']) ? "skill_kan" : "skill_cyoku";
            tmpList[cyokukan].push(row);

            let attackAttributes = row['AttackAttributes'];
            attackAttributes.split(',').forEach(function (attr) {
                tmpList[optionList[attr]].push(row);
            });
        }
    }
    for (let name in optionList) {
        let key = optionList[name];
        $("#count_" + key).text(("  " + tmpList[key].length).slice(-3));
    }
}


function sortSkillIryoku(nowList, desc = true) {
    $("#skillList").html("");
    var tmpList = nowList.slice(0,nowList.length);
    tmpList.sort(function (a, b) {
        if (a.SkillIryoku === "-") {
            return (desc) ? 1 : -1;
        } else if (a.SkillIryoku > b.SkillIryoku) {
            return (desc) ? -1 : 1;
        } else if (a.SkillIryoku < b.SkillIryoku) {
            return (desc) ? 1 : -1;
        } else if (a.ConsumeBp < b.ConsumeBp) {
            return (desc) ? -1 : 1;
        } else if (a.ConsumeBp > b.ConsumeBp) {
            return (desc) ? 1 : -1;
        } else if (a.AttackAttributes > b.AttackAttributes) {
            return (desc) ? -1 : 1;
        }
        return 0;
    });
    for (let i in tmpList) {
        $("#skillList").append(skillLabelDiplay(tmpList[i]));
    }
    $("#skillList").slideDown(300);
}

function sortSkillBP(nowList, desc = true) {
    $("#skillList").html("");
    var tmpList = nowList.slice(0,nowList.length);
    tmpList.sort(function (a, b) {
        if (a.ConsumeBp > b.ConsumeBp) {
            return (desc) ? -1 : 1;
        } else if (a.ConsumeBp < b.ConsumeBp) {
            return (desc) ? 1 : -1;
        }
        if (b.SkillIryoku === "-" || a.SkillIryoku > b.SkillIryoku) {
            return (desc) ? -1 : 1;
        } else if (a.SkillIryoku === "-" || a.SkillIryoku < b.SkillIryoku) {
            return (desc) ? 1 : -1;
        }
        if (a.Holders.length > b.Holders.length) {
            return (desc) ? -1 : 1;
        }
    });

    for (let i in tmpList) {
        $("#skillList").append(skillLabelDiplay(tmpList[i]));
    }
    $("#skillList").slideDown(300);
}

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