// ["Param"]["Lv"]["Per"] = パーセンテージ
// ["Param"]["Lv"]["Bonus"] = ボーナス値
var CONST_STYLE_BONUS_VAL = {
    "A": {2: 1, 6: 1, 8: 1, 18: 2, 22: 1, 38: 2, 46: 3, 50: 2},
    "S": {2: 1, 6: 1, 8: 2, 18: 3, 22: 1, 38: 3, 46: 4, 50: 2},
    "SS": {2: 1, 6: 2, 8: 3, 18: 3, 22: 2, 38: 4, 46: 5, 50: 3}
};

function culcStyleAddintional(styleInfo) {
    var STYLE_ADD = {};
    var bonusMap = {'腕力': 0, '体力': 0, '器用さ': 0, '素早さ': 0, '知力': 0, '精神': 0, '愛': 0, '魅力': 0};
    var bonus = Object.assign({}, bonusMap);

    // スタイル補正の計算
    var stylePer = culcStyle(styleInfo);
    // パラメータ別
    // Lv別
    for (var lv in stylePer["腕力"]) {
        var l = lv.replace("Lv", "");
        // スタイルボーナスの取得
        if (styleInfo['StyleBonus'][l] !== undefined) {
            var value = CONST_STYLE_BONUS_VAL[styleInfo['Rarity']][l];
            var name = styleInfo['StyleBonus'][l];
            if (name === "全能力値") {
                for (var n in bonus) {
                    bonus[n] += Number(value);
                }
            } else {
                bonus[name] += Number(value);
            }
        }
        for (var pName in stylePer) {
            if (STYLE_ADD[pName] === undefined) {
                STYLE_ADD[pName] = {};
            }
            if (STYLE_ADD[pName][l] === undefined) {
                STYLE_ADD[pName][l] = {};
            }
            STYLE_ADD[pName][l]["Per"] = stylePer[pName][lv];
            STYLE_ADD[pName][l]["Bonus"] = bonus[pName];
        }
    }
    return STYLE_ADD;
}


////////////////////////////////////
//以下、ぷらいべ〜とめそっど
////////////////////////////////////
function culcStyle(styleInfo) {
    var rare = styleInfo['Rarity'];
    var minStr = styleInfo['StyleBonusLv1STR'];
    var minVit = styleInfo['StyleBonusLv1VIT'];
    var minDex = styleInfo['StyleBonusLv1DEX'];
    var minAgi = styleInfo['StyleBonusLv1AGI'];
    var minInt = styleInfo['StyleBonusLv1INT'];
    var minMid = styleInfo['StyleBonusLv1MND'];
    var minAi = styleInfo['StyleBonusLv1AI'];
    var minMi = styleInfo['StyleBonusLv1MI'];

    var maxStr = styleInfo['StyleBonusLv50STR'];
    var maxVit = styleInfo['StyleBonusLv50VIT'];
    var maxDex = styleInfo['StyleBonusLv50DEX'];
    var maxAgi = styleInfo['StyleBonusLv50AGI'];
    var maxInt = styleInfo['StyleBonusLv50INT'];
    var maxMid = styleInfo['StyleBonusLv50MND'];
    var maxAi = styleInfo['StyleBonusLv50AI'];
    var maxMi = styleInfo['StyleBonusLv50MI'];
    var result = {};
    result["腕力"] = culc(minStr, maxStr, rare);
    result["体力"] = culc(minVit, maxVit, rare);
    result["器用さ"] = culc(minDex, maxDex, rare);
    result["素早さ"] = culc(minAgi, maxAgi, rare);
    result["知力"] = culc(minInt, maxInt, rare);
    result["精神"] = culc(minMid, maxMid, rare);
    result["愛"] = culc(minAi, maxAi, rare);
    result["魅力"] = culc(minMi, maxMi, rare);
    //console.log(result);
    return result;
}

function culc(min, max, rare) {
    var result = {};
    if (rare == "SS") {
        result = culcSS(min, max);
    } else {
        result = culcAS(min, max);
    }
    return result;
}

function culcAS(min, max) {
    var result = {};
    result['Lv1'] = min;
    for (lv = 2; lv < 50; lv++) {
        if (lv < 30) {
            result['Lv' + lv] = round(min + (max - min) * 13 / 20 * Math.sin(Math.PI / 60 * lv));
        } else {
            result['Lv' + lv] = round(min + (max - min) / 8 * (1 + 7 * lv / 50));
        }
    }
    result['Lv50'] = max;
    return result;
}

function culcSS(min, max) {
    var result = {};
    result["Lv1"] = min;
    for (lv = 2; lv < 50; lv++) {
        if (lv < 30) {
            result['Lv' + lv] = round(min + (max - min) * 3 / 5 * Math.sin(Math.PI / 60 * lv));
        } else {
            result['Lv' + lv] = round(min + (max - min) * lv / 50);

        }
    }
    result["Lv50"] = max;
    return result;
}

function round(val) {
    return Math.round(val * 100) / 100;
}
