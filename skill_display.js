var skillList, styleList, abilityList;

function readData() {
    firebase.database().ref('Skill').once("value").then(function (snapshot) {
        //console.log(snapshot.val());
        skillList = snapshot.val();
        var skillTypeList = {"ファスト": {}, "ディレイ": {},
            "スタン": {}, "マヒ": {}, "即死": {}, "毒": {}, "石化": {},
            "魅了": {}, "眠り": {}, "混乱": {}, "狂戦士": {}, "暗闇": {},
            "腕力": {}, "体力": {}, "器用さ": {}, "素早さ": {}, "知力": {}, "精神": {}
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
            "知力": "skill_deb_chi", "精神": "skill_deb_sei"
        };
        for (key in skillList) {
            var row = skillList[key];
            // 威力設定されてないものは未実装もあるので弾いておく
            if (row['Holders'] !== undefined) {
                var x = (row['SkillIryoku'] == 0) ? "計測中" : row['SkillIryoku'];
                var iryoku = row['PowerGrade'] + "(" + x + ")";
                var name = row['Name'] +
                        " 威力:" + iryoku +
                        " BP:" + row['ConsumeBp'] +
                        " " + row["AttackDistance"] + "/" + row["AttackArea"];
                var battleType = row['BattleType'];
                if (skillTypeList[battleType] === undefined) {
                    skillTypeList[battleType] = {};
                }
                skillTypeList[battleType][name] = key;

                var attackArea = row['AttackArea'];
                if (skillTypeList[attackArea] === undefined) {
                    skillTypeList[attackArea] = {};
                }
                skillTypeList[attackArea][name] = key;

                var attackDistance = row['AttackDistance'];
                if (skillTypeList[attackDistance] === undefined) {
                    skillTypeList[attackDistance] = {};
                }
                skillTypeList[attackDistance][name] = key;

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


                var attackAttributes = row['AttackAttributes'];
                attackAttributes.split(',').forEach(function (attr) {
                    if (skillTypeList[attr] === undefined) {
                        skillTypeList[attr] = {};
                    }
                    skillTypeList[attr][name] = key;
                })
            }
        }

        for (key in optionList) {
            addOption({"技(術)を選択してください": 0}, optionList[key]);
            addOption(skillTypeList[key], optionList[key]);
        }
    });

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
        var styleId = skillHolders['Holders'][key];
        var styleInfo = styleList[styleId];
        //console.log(styleInfo);
        var color = "background-color: rgb(246,236,100);}";
        if (styleInfo['Rarity'] === "A") {
            color = "background-color: rgb(247,170,150);}";
        } else if (styleInfo['Rarity'] === "S") {
            color = "background-color: rgb(200,224,234);}";
        }
        var col = "";
        col += "<td>" + styleInfo['Rarity'] + "</td>";
        col += "<td>" + styleInfo['Name'] + "</td>";
        col += "<td>" + styleInfo['AnotherName'] + "</td>";
        col += "<td>" + styleInfo['WeaponType'] + "</td>";
        col += "<td>" + styleInfo['Role'] + "</td>";
        col += "<td>" + styleInfo['Skill'].join("<br>") + "</td>";
        var ab = [];
        for (lv in styleInfo['StyleAbility']) {
            ab.push(lv + ":" + styleInfo['StyleAbility'][lv]);
        }
        col += "<td>" + ab.join("<br>") + "</td>";
        $("table#skill_holder_table tbody").append("<tr style='" + color + "'>" + col + "</tr>\n");
    }
});

function setSkillTable(skillInfo) {
    //console.log(skillInfo);
    $("#skill_dtl_btAttr").text(skillInfo['BattleType']); // 武器種別
    $("#skill_dtl_name").text(skillInfo['Name']); // 技名称
    $("#skill_dtl_atAtttr").text(skillInfo['AttackAttributes']); // 技属性
    var iryoku = (skillInfo['SkillIryoku'] != 0) ? skillInfo['SkillIryoku'] : "計測中";
    $("#skill_dtl_grade").text(skillInfo['PowerGrade'] + " (" + iryoku + ")"); // 技威力
    $("#skill_dtl_bp").text(skillInfo['ConsumeBp']); //　初期BP
    $("#skill_dtl_minBp").text((skillInfo['ConsumeBp'] - skillInfo['MaxKakuseiCount'])); // 最大覚醒BP
    $("#skill_dtl_text").html(skillInfo['FlavorText']); // フレーバーテキスト
}
