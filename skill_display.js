const ICON_LIST = {
    "剣": "icon_ken", "大剣": "icon_dken", "斧": "icon_ono",
    "小剣": "icon_sken", "槍": "icon_yari", "弓": "icon_yumi",
    "棍棒": "icon_kon", "体術": "icon_tai", "銃": "icon_ju",
    "斬": "icon_zan", "突": "icon_totsu", "打": "icon_da",
    "熱": "icon_netsu", "冷": "icon_rei", "雷": "icon_rai",
    "陰": "icon_in", "陽": "icon_yo",
    "火術": "icon_hi", "水術": "icon_mizu", "風術": "icon_kaze",
    "土術": "icon_tsuchi", "光術": "icon_hikari", "闇術": "icon_yami",
    "スタン": "icon_stan", "マヒ": "icon_mahi", "気絶": "icon_kizetsu", "毒": "icon_doku", "石化": "icon_sekika",
    "魅了": "icon_miryo", "眠り": "icon_zzz", "混乱": "icon_konran", "狂戦士": "icon_kyosenshi", "暗闇": "icon_kurayami"
};
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
setImgTag("icon/icon_doku.png", "icon_doku");
setImgTag("icon/icon_mahi.png", "icon_mahi");
setImgTag("icon/icon_konran.png", "icon_konran");
setImgTag("icon/icon_stan.png", "icon_stan");
setImgTag("icon/icon_miryo.png", "icon_miryo");
setImgTag("icon/icon_kizetsu.png", "icon_kizetsu");
setImgTag("icon/icon_kyosenshi.png", "icon_kyosenshi");
setImgTag("icon/icon_kurayami.png", "icon_kurayami");
setImgTag("icon/icon_sekika.png", "icon_sekika");
setImgTag("icon/icon_zzz.png", "icon_zzz");
setImgTag("icon/icon_a.png", "icon_A");
setImgTag("icon/icon_s.png", "icon_S");
setImgTag("icon/icon_ss.png", "icon_SS");
showimage("dot/35bc4.png", "icon_allSkill", "200px 200px");
showimage("dot/367e0.png", "icon_healSkill", "200px 200px");
showimage("dot/641f4.png", "icon_yokoSkill", "200px 200px");
showimage("dot/36204.png", "icon_tateSkill", "200px 200px");

var skillList, styleList, abilityList;

function readData() {
    firebase.database().ref('Skill').once("value").then(function (snapshot) {
        console.log(snapshot.val());
        skillList = snapshot.val();
        var skillTypeList = {"ファスト": {}, "ディレイ": {},
            "スタン": {}, "マヒ": {}, "即死": {}, "毒": {}, "石化": {},
            "魅了": {}, "眠り": {}, "混乱": {}, "狂戦士": {}, "暗闇": {},
            "腕力": {}, "体力": {}, "器用さ": {}, "素早さ": {}, "知力": {}, "精神": {},
            "E": [], "D": [], "C": [], "B": [], "A": [], "S": [], "SS": [], "SSS": [], "-": []
        };
        var optionList = {
            "剣": "skill_ken", "大剣": "skill_dken", "斧": "skill_ono",
            "小剣": "skill_sken", "槍": "skill_yari", "弓": "skill_yumi",
            "棍棒": "skill_kon", "体術": "skill_tai", "銃": "skill_ju",
            "杖": "skill_tsue",
            "近": "skill_kin",
            "遠": "skill_en",
            "熱": "skill_netsu", "冷": "skill_rei", "雷": "skill_rai",
            "陰": "skill_in", "陽": "skill_you",
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
            "SS": "skill_iryoku_ss", "SSS": "skill_iryoku_sss"
        };
        for (let key in skillList) {
            let row = skillList[key];
            // 威力設定されてないものは未実装もあるので弾いておく
            if (row['Holders'] !== undefined) {
                //console.log(row);
                let x = (row['SkillIryoku'] == 0 || row['SkillIryoku'] == "-") ? "計測中" : row['SkillIryoku'];
                let iryoku = row['PowerGrade'] + "(" + x + ")";
                let name = "[" + row['BattleType'] + "]" +
                        row['Name'] +
                        " 威力:" + iryoku +
                        " BP:" + row['ConsumeBp'] +
                        " " + row["AttackDistance"] + "/" + row["AttackArea"];
                row['dispName'] = name;
                let battleType = row['BattleType'];
                if (skillTypeList[battleType] === undefined) {
                    skillTypeList[battleType] = {};
                }
                skillTypeList[battleType][name] = key;

                let attackArea = row['AttackArea'];
                if (skillTypeList[attackArea] === undefined) {
                    skillTypeList[attackArea] = {};
                }
                skillTypeList[attackArea][name] = key;

                let attackDistance = row['AttackDistance'];
                if (skillTypeList[attackDistance] === undefined) {
                    skillTypeList[attackDistance] = {};
                }
                skillTypeList[attackDistance][name] = key;
                // 威力だけは再ソートかけるので中身を入れておく
                let grade = row['PowerGrade'];
                skillTypeList[grade].push(row);

                // 特殊な奴ら
                if (row['Fast']) {
                    name += " [ファスト]";
                    skillTypeList["ファスト"][name] = key;
                }
                if (row['Delay']) {
                    name += " [ディレイ]";
                    skillTypeList["ディレイ"][name] = key;
                }
                if (row['BadStatus'] != "") {
                    name += " [" + row['BadStatus'] + ":" + row['BadStatusPer'] + "]";
                    skillTypeList[row['BadStatus']][name] = key;
                }
                if (row['DeBuff'] != "") {
                    name += " [" + row['DeBuff'] + ":" + row['DeBuffPer'] + "]";
                    skillTypeList[row['DeBuff']][name] = key;
                }


                let attackAttributes = row['AttackAttributes'];
                attackAttributes.split(',').forEach(function (attr) {
                    if (skillTypeList[attr] === undefined) {
                        skillTypeList[attr] = {};
                    }
                    skillTypeList[attr][name] = key;
                });
            }
        }
        skillTypeList["E"] = sortSkill(skillTypeList["E"]);
        skillTypeList["D"] = sortSkill(skillTypeList["D"]);
        skillTypeList["C"] = sortSkill(skillTypeList["C"]);
        skillTypeList["B"] = sortSkill(skillTypeList["B"]);
        skillTypeList["A"] = sortSkill(skillTypeList["A"]);
        skillTypeList["S"] = sortSkill(skillTypeList["S"]);
        skillTypeList["SS"] = sortSkill(skillTypeList["SS"]);
        skillTypeList["SSS"] = sortSkill(skillTypeList["SSS"]);

        for (key in optionList) {
            addOption({"技(術)を選択してください": 0}, optionList[key]);
            addOption(skillTypeList[key], optionList[key]);
        }
    });
    function sortSkill(typeList) {
        let result = {};
        typeList.sort(function (a, b) {
            if (a.SkillIryoku > b.SkillIryoku) {
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
        for (let row of typeList) {
            result[row['dispName']] = row['Id'];
        }
        return result;
    }

    firebase.database().ref('Style').once("value").then(function (snapshot) {
        //console.log(snapshot.val());
        styleList = snapshot.val();
    });
    firebase.database().ref('Ability').once("value").then(function (snapshot) {
        //console.log(snapshot.val());
        abilityList = snapshot.val();
    });
}
$(".skill_select").change(function (e) {
    var id = $(e.target).attr("id");
    //var text = $('#' + id + ' option:selected').text();
    var skillId = $('#' + id).val();
    if (skillId == 0) {
        return;
    }
    var skillHolders = skillList[skillId];
    // 技の説明表示
    setSkillTable(skillList[skillId]);

    $("table#skill_holder_table tbody *").remove();

    for (key in skillHolders['Holders']) {
        let styleId = skillHolders['Holders'][key];
        let imgId = "cutin" + styleId;
        let imgId2 = "tmp" + styleId;
        let imgSrc = "";
        // 画像が存在する場合は再取得しない
        if ($('#' + imgId).length == 0) {
            $("#imgTank").append("<img src=\"\" id=\"" + imgId + "\">");
            setImgTag("style_cutin/" + styleId.substr(2) + ".png", imgId);
            setImgTag("style_cutin/" + styleId.substr(2) + ".png", imgId2);
        } else {
            imgSrc = $("#" + imgId).attr('src');
        }
        let styleInfo = styleList[styleId];

        let rarityIcon = $("#icon_" + styleInfo['Rarity']).attr('src');

        let color = "background-color: rgb(246,236,100);}";
        if (styleInfo['Rarity'] === "A") {
            color = "background-color: rgb(247,170,150);}";
        } else if (styleInfo['Rarity'] === "S") {
            color = "background-color: rgb(200,224,234);}";
        }
        let col = "";
        let styleName = styleInfo['AnotherName'];
        let Name = styleInfo['Name'];
        let height = 50;
        col += "<td><img src=\"" + rarityIcon + "\" height=" + height + "></td>";
        col += "<td class='text-center'><img src=\"" + imgSrc + "\" height=" + 40 + " id=\"" + imgId2 + "\"><br><small>" + Name + " " + styleName + "<small></td>";
        col += "<td class='xs-hide'>" + styleInfo['Skill'].join("<br>") + "</td>";
        let ab = [];
        for (lv in styleInfo['StyleAbility']) {
            ab.push(lv + ":" + styleInfo['StyleAbility'][lv]);
        }
        col += "<td class='xs-hide'>" + ab.join("<br>") + "</td>";
        col += "<tr class='xs-show' style='" + color + "'><td colspan=2>" + styleInfo['Skill'].join(" / ") + "</td></tr>";
        $("table#skill_holder_table tbody").append("<tr style='" + color + "'>" + col + "</tr>\n");
    }
});

function setSkillTable(skillInfo) {
    //console.log(skillInfo);
    let battleType = skillInfo['BattleType'];
    let id = ICON_LIST[battleType];
    let img = '<img src="' + $("#" + id).attr("src") + '" width="35" height="35" />';
    $("#skill_dtl_btAttr").html(img + "<br>" + battleType); // 武器種別
    $("#skill_dtl_name").text(skillInfo['Name']); // 技名称

    let imgList = [];
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let id = ICON_LIST[value];
        imgList.push('<img src="' + $("#" + id).attr("src") + '" data-value="' + value + '"/>');
    });
    $("#skill_dtl_atAtttr").html(imgList.join("")); // 技属性

    let iryoku = (skillInfo['SkillIryoku'] != 0) ? skillInfo['SkillIryoku'] : "計測中";
    $("#skill_dtl_grade").text(skillInfo['PowerGrade'] + " (" + iryoku + ")"); // 技威力
    $("#skill_dtl_bp").text(skillInfo['ConsumeBp']); //　初期BP
    $("#skill_dtl_minBp").text((skillInfo['ConsumeBp'] - skillInfo['Kakusei'])); // 最大覚醒BP
    $("#skill_dtl_text").html(skillInfo['FlavorText']); // フレーバーテキスト
}

