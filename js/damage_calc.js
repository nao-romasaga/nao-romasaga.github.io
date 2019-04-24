let ENEMY_DATA, SKILL_MASTER;
let SKILL_LIST = {
    "剣": [], "大剣": [], "斧": [],
    "小剣": [], "槍": [], "弓": [],
    "棍棒": [], "体術": [],
    "火術": [], "水術": [], "風術": [],
    "土術": [], "光術": [], "闇術": []};


function createSkillOption(list) {
    var result = {};
    list.forEach(function (rows) {
        let iryoku = rows['SkillIryoku'];
        if (iryoku !== "-" && iryoku > 0) {
            // 0:種別、1:威力、2:Name、3:Grade、4:BP、5:覚醒
            result[rows['Name'] + " BP:" + rows['ConsumeBp'] + " 威力[" + rows['PowerGrade'] + "]:" + iryoku] = rows['Id'];
        }
    });
    return result;
}

$(function () {
    //SKILL_LIST = loadTSV("https://nao-romasaga.github.io/skill_list.tsv");
    //console.log(SKILL_LIST);
    //var data = {"剣": [], "大剣": [], "小剣": [], "体術": []};
    $("#taijyutsu").hide();
    $(".vitCulc").hide();
    $("#jinkei_w").hide();
    $("#jinkei_k").hide();
    $("#jinkei_s").hide();
    $(".charOnly").hide(); // 初期表示は陣形ないので入れない
    //$("#input_rank").hide(); // 初期表示は通常攻撃なので入れない
    readFile('Enemy', function (result) {
        ENEMY_DATA = result;
        for (let idx in ENEMY_DATA) {
            let row = ENEMY_DATA[idx];
            let disp = row['quest'] + " " + row['name'] + " 体:" + row['vit'] + " 精:" + row['mnd'];
            //" 推定HP:" + row['hp'];
            $option = $('<option>', {value: idx, text: disp});
            $('#enemy_vit').append($option);
        }
        //console.log(ENEMY_DATA);
    });
    readFile('Skill', function (result) {
        SKILL_MASTER = result;
        for (let idx in result) {
            let row = result[idx];
            SKILL_LIST[row['BattleType']].push(row);
        }
        for (let name in SKILL_LIST) {
            SKILL_LIST[name].sort(function (a, b) {
                if (a.SkillIryoku === "-" || b.SkillIryoku === "-"
                        || a.SkillIryoku > b.SkillIryoku) {
                    return -1;
                } else if (a.SkillIryoku < b.SkillIryoku || a.ConsumeBp > b.ConsumeBp) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        // 初回表示
        addOption(createSkillOption(SKILL_LIST["剣"]), "skill");
        setDefaultSkillIryoku();
    });
    /**
     * 技が変更された場合
     * 通常攻撃はrankを非表示で1に設定。それ以外はrankを表示
     */
    $('#skill').change(function () {
        setDefaultSkillIryoku();

        let text = $('#skill option:selected').text();
        if (text.indexOf('通常攻撃') !== -1) {
            //$('#input_rank').hide();
            $('#skill_rank').val(1);
        } else {
            //$('#input_rank').show();
        }
    });

// 武器種別が変更された場合
    $('#type').change(function () {
        type = $("#type").val();
        // 技リストを更新する
        type_tx = $('#type option:selected').text();
        $('#skill').children().remove();
        addOption(createSkillOption(SKILL_LIST[type_tx]), "skill");
        setDefaultSkillIryoku();

        // 影響のある陣形を入れ替える
        $('#jinkei > option').remove();
        if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
            //console.log($(".param_label_teki"), 1, type, $.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]));
            $(".param_label_teki").text("精神");
            $(".jinkei_label").text("知");
        } else {
            //console.log($(".param_label_teki"), 2, type, $.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]));
            $(".param_label_teki").text("体力");
            $(".jinkei_label").text("腕");
        }
        if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
            //console.log(type, $.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]));
            $("#param_label").text("知力");
            $("#taijyutsu").hide();
            addOption(jJinkei, "jinkei");
        } else if ($.inArray(type, ["yumi", "sken"]) > 0) {
            $("#param_label").text("器用さ");
            $("#taijyutsu").hide();
            addOption(kJinkei, "jinkei");
        } else if (type === "tai") {
            $("#param_label").text("腕力");
            $("#taijyutsu").show();
            addOption(sJinkei, "jinkei");
        } else {
            $("#param_label").text("腕力");
            $("#taijyutsu").hide();
            addOption(wJinkei, "jinkei");
        }
        // 必要な陣形が変わるので対応
        jinkeiHosei();
    });

    $('#jinkei').change(function () {
        jinkeiHosei();
    });

    $('#resist').change(function () {
        var r = $('#resist').val();
        $("#resistDamage").val(Math.round(1 / (1 + 0.008 * r) * 100 * 100) / 100);
    });


    $('.damage').change(function () {
        culc();
        //patternReCulc();
    });

    $('#ability_list').change(function () {
        let abVal = Number($("#ability_list").val());
        if ($("#tokkouCheck").prop('checked')) {
            abVal += 20;
        }
        $("#ability").val(abVal);
        // abilityの値を入れ替えるので計算はこのタイミング
        culc();
    });
    $('#enemy_vit').change(function () {
        let idx = $("#enemy_vit").val();
        if (idx === "x") {
            return;
        }
        let row = ENEMY_DATA[idx];
        type = $("#type").val();
        if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
            $("#vit").val(row['mnd']);
        } else {
            $("#vit").val(row['vit']);
        }
        for (let z of ["zan", "da", "totsu", "netsu", "rei", "rai", "in", "you"]) {
            setTaisei($("#taisei_" + z), row[z]);
        }
        // vitの値を入れ替えるので計算はこのタイミング
        culc();
    });
    $("#tokkouCheck").click(function () {
        let isTokkou = $(this).prop('checked');
        let org = Number($("#ability").val());
        if (isTokkou) {
            $("#ability").val(org + 20);
        } else {
            $("#ability").val(org - 20);
        }
        culc();
    });


});
function setDefaultSkillIryoku() {
    let skillId = $('#skill option:selected').val();
    let skill = SKILL_MASTER[skillId];
    $("#skill_val").val(skill['SkillIryoku']);
}

function setTaisei(target, val) {
    target.removeClass("resist_plus");
    target.removeClass("resist_minus");
    if (val > 0) {
        target.addClass("resist_plus");
    } else if (val < 0) {
        target.addClass("resist_minus");
    }
    target.html(val);
}

/**
 * 計算処理
 * @returns {undefined}
 */
function culc() {
    var wepon = Number($("#wepon").val());
    var ability = Number($("#ability").val());
    var resist = Number($("#resist").val());
    var skill = Number($("#skill_val").val());
    var rank = Number($("#skill_rank").val());
    var type = $("#type").val();
    var vit = Number($("#vit").val());
    var master = masterLevel($("#master").val()) * 100;
    $("#masterDamage").val(Math.round(master * 100) / 100);
    // 陣形込みの値を取得
    var tmpStrAgi = getStrAgi();
    var str = tmpStrAgi[0];
    var agi = tmpStrAgi[1];

    dRange = damageStepCulc(type, str, agi, wepon, skill, rank, vit, master, ability, resist);
    //console.log("damageRange: " + dRange);
    dispDamageRange(dRange);
}


function damageColor(damage, max, min, target) {
    if (damage > 0 && (damage == max || damage == min)) {
        target.removeClass("bg-warning");
        target.addClass("bg-success");
        target.addClass("text-white");
    } else if (damage > 0) {
        target.addClass("bg-warning");
        target.removeClass("bg-success");
        target.removeClass("text-white");
    } else {
        target.removeClass("bg-warning");
        target.removeClass("bg-success");
        target.removeClass("text-white");
    }
}

/**
 * パターン毎にダメージを出して何が強いかみる
 * @returns {undefined}
 */
function patternReCulc() {
    var wepon = Number($("#wepon").val());
    var ability = Number($("#ability").val()) / 100;
    var resist = Number($("#resist").val());
    var skill = Number($("#skill_val").val());
    var rank = Number($("#skill_rank").val());
    var type = $("#type").val();
    var vit = Number($("#vit").val());
    var master = masterLevel($("#master").val());

    var result = [];
    //console.log("ダメージランキング作成");
    var orgJinkei = $("#jinkei").val();

    var list = ($("#strOnlyChar").val() != 0) ? getJinkei() : {"フリーファイト": 0};
    for (key in list) {
        $("#jinkei").val(list[key]); // 陣形を入れ替える
        jinkeiHosei(); // #jinkeiを入れ替えたら実行
        // 陣形込みの値を取得
        var tmpStrAgi = getStrAgi();
        var str = tmpStrAgi[0];
        var agi = tmpStrAgi[1];
        var dRange = damageStepCulc(type, str, agi, wepon, skill, rank, vit, master, ability, resist);

        var map = {name: "陣形: " + key, d1: dRange[0], d10: dRange[9], avg: arrayAvg(dRange), jinkei: list[key]};
        result.push(map);
    }
    $("#jinkei").val(orgJinkei); // 元に戻す
    jinkeiHosei(); // #jinkeiを入れ替えたら実行                    

    var orgStr = Number($("#str").val());
    var orgAgi = Number($("#agi").val());
    var culcSv = orgStr;
    var culcAgi = orgAgi;
    var lavel = "";
    if (type !== 'tai') {
        var lavel = (type === "yumi" || type === "sken") ? "器用さ+" : "腕力+";
        [...Array(3)].map((_, i) => {
            if ($("#jinkei").val() != "0") {
                var tmpStrAgi = getStrAgi();
                var str = tmpStrAgi[0];
            }
            var fieldSTR = getFieldSTR((str + i + 1), orgAgi, v);
            var baseDamage = baseDamageCulc(fieldSTR);
            var dRange = damageStepCulc(type, str, agi, wepon, skill, rank, vit, master, ability, resist);
            var map = {name: lavel + (i + 1), d1: baseDamage};
            result.push(map);
        });
    } else {
        //console.log("陣形:" + $("#jinkei").val());
        [...Array(3)].map((_, i) => {
            if ($("#jinkei").val() != "0") {
                var jinkeiStrAgi = getJinkeiStrAgi();
                culcSv = jinkeiStrAgi[0];
                culcAgi = jinkeiStrAgi[1];
            }
            var fieldSTR = getFieldSTR((culcSv + i + 1), culcAgi, v);
            var baseDamage = baseDamageCulc(fieldSTR);
            var map = {name: "腕力+" + (i + 1), d1: baseDamage};
            result.push(map);

            fieldSTR = getFieldSTR(culcSv, (culcAgi + i + 1), v);
            baseDamage = baseDamageCulc(fieldSTR);
            map = {name: "素早さ+" + (i + 1), d1: baseDamage};
            result.push(map);
            fieldSTR = getFieldSTR((culcSv + i + 1), (culcAgi + i + 1), v);
            baseDamage = baseDamageCulc(fieldSTR);
            map = {name: "腕力+" + (i + 1) + " 素早さ+" + (i + 1), d1: baseDamage};
            result.push(map);
        });
    }
    var orgWepon = Number($("#wepon").val());
    var orgWepK = wepK;
    [...Array(3)].map((_, i) => {
        if ($("#jinkei").val() != "0") {
            var jinkeiStrAgi = getJinkeiStrAgi();
            culcSv = jinkeiStrAgi[0];
            culcAgi = jinkeiStrAgi[1];
        }
        var fieldSTR = getFieldSTR(culcSv, orgAgi, v);
        if (type == 3) { // 他のfunctionでも使うのでここで定義（やり方としては下の下）
            wepK = ((orgWepon + 9 + i + 1) / 10.5);
        } else {
            wepK = ((orgWepon + 6 + i + 1) / 7);
        }
        var baseDamage = baseDamageCulc(fieldSTR);
        var map = {name: "武器威力+" + (i + 1), d1: baseDamage};
        result.push(map);
    });
    //console.log(result);
    // 変数は元に戻す
    wepK = orgWepK;
    dispDamageRank(result);
}


/**
 * 陣形補正込みの値を取得
 * @returns {Array} 0:str, 1:agi
 */
function getStrAgi() {
    var culcSv = Number($("#str").val());
    var culcAgi = Number($("#agi").val());
    // 陣形を使っている場合こちらも必要
    if ($("#jinkei").val() != "0") {
        var charStr = Number($("#strOnlyChar").val());
        var charAgi = Number($("#agiOnlyChar").val());
        var soubiStr = culcSv - charStr;
        var soubiAgi = culcAgi - charAgi;

        var jinkeiStr = Number($("#jinkei_w_v").val());
        var jinkeiAgi = Number($("#jinkei_s_v").val());
        // 器用さの場合は入れ替える
        if (type === "sken" || type === "yumi") {
            jinkeiStr = Number($("#jinkei_k_v").val());
        }
        var jinkeiStrAgi = getJinkeiStrAgi(charStr, jinkeiStr, charAgi, jinkeiAgi);
        culcSv = jinkeiStrAgi[0] + soubiStr;
        culcAgi = jinkeiStrAgi[1] + soubiAgi;
    }
    return [culcSv, culcAgi];
}

function dispDamageRange(dRange) {
    $("table#damageRangeTable tbody *").remove();

    var col1 = "";
    var col2 = "";
    var sum = 0;
    for (i = 0; i < 5; i++) {
        col1 += "<td class=\"small opacity col-xs-1\" >" + number_format(dRange[i]) + "</td>";
        sum += dRange[i];
    }
    for (i = 5; i < dRange.length; i++) {
        col2 += "<td class=\"small opacity col-xs-1\" >" + number_format(dRange[i]) + "</td>";
        sum += dRange[i];
    }
    $("table#damageRangeTable tbody").append("<tr>");
    $("table#damageRangeTable tbody").append("<th class=\"table-primary col-xs-1\">平均</th>");
    $("table#damageRangeTable tbody").append("<td class=\"opacity col-xs-1\" colspan=5>" + number_format(Math.round(sum / dRange.length)) + "</td>");
    $("table#damageRangeTable tbody").append("</tr>");
    $("table#damageRangeTable tbody").append("<tr>");
    $("table#damageRangeTable tbody").append("<th class=\"table-primary small col-xs-1\">乱数1〜5</th>");
    $("table#damageRangeTable tbody").append(col1);
    $("table#damageRangeTable tbody").append("</tr>\n");
    $("table#damageRangeTable tbody").append("<tr>");
    $("table#damageRangeTable tbody").append("<th class=\"table-primary small col-xs-1\">乱数6〜10</th>");
    $("table#damageRangeTable tbody").append(col2);
    $("table#damageRangeTable tbody").append("</tr>\n");
}

function dispDamageRank(dRange) {
    dRange.sort(function (a, b) {
        if (a.d1 > b.d1)
            return -1;
        if (a.d1 <= b.d1)
            return 1;
    });
    var nowJinkei = $("#jinkei :selected").val();
    $("table#damageRankTable tbody *").remove();
    dRange.forEach(function (element, index, array) {
        var classColor = ((index % 2) == 0) ? "opacity-even" : "opacity-odd";
        if (nowJinkei == element.jinkei) {
            classColor += " bg-primary text-white"
        }
        var col = "";
        col += "<tr>";
        col += "<td class=\"small " + classColor + " \" >" + element.name + "</td>";
        col += "<td class=\"small " + classColor + " \" >" + Math.round(element.d1 * 1.045) + "</td>";
        col += "<td class=\"small " + classColor + " \" >" + Math.round(element.d1) + "</td>";
        col += "</tr>\n";
        $("table#damageRankTable tbody").append(col);
    });
}
function Compare(a, b) {
    return arr[a] - arr[b];
}

function jinkeiHosei() {
    var r = $('#jinkei').val();
    $("#jinkei_w").hide();
    $("#jinkei_k").hide();
    $("#jinkei_s").hide();
    $("#jinkei_w_v").val(0);
    $("#jinkei_k_v").val(0);
    $("#jinkei_s_v").val(0);
    $(".charOnly").hide();
    if (r != "0") {
        $(".charOnly").show();
    }
    if (r == "ic") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-50);
    }
    if (r == "hs1") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(25);
    }
    if (r == "hs2") {
        $("#jinkei_k").show();
        $("#jinkei_k_v").val(50);
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-50);
    }
    if (r == "dr1") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(25);
    }
    if (r == "dr2") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-10);
    }
    if (r == "hjs") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-25);
    }
    if (r == "hjc") {
        $("#jinkei_w").show();
        $("#jinkei_w_v").val(25);
    }
    if (r == "sp1") {
        $("#jinkei_w").show();
        $("#jinkei_w_v").val(25);
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(50);
    }
    if (r == "sp2") {
        $("#jinkei_w").show();
        $("#jinkei_w_v").val(25);
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(25);
    }
    if (r == "sp3") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-50);
    }
    if (r == "pl1") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(25);
    }
    if (r == "pl2") {
        type = $("#type").val();
        if ($.inArray(type, ["hi", "mizu", "tsuchi", "kaze", "hikari", "yami"]) > -1) {
            $("#jinkei_w").show();
            $("#jinkei_w_v").val(50);
        }
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-50);
    }
    if (r == "rs") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(50);
    }
    if (r == "as1") {
        $("#jinkei_w").show();
        $("#jinkei_w_v").val(50);
    }
    if (r == "as2") {
        $("#jinkei_w").show();
        $("#jinkei_w_v").val(25);
    }
    if (r == "as3") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-25);
    }
    if (r == "rj1") {
        $("#jinkei_w").show();
        $("#jinkei_w_v").val(25);
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(25);
    }
    if (r == "rj2") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(10);
    }
    if (r == "rj3") {
        $("#jinkei_s").show();
        $("#jinkei_s_v").val(-25);
    }
}
