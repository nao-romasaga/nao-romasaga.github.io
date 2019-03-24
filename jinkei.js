var wJinkei = {
    "指定なし": "0",
    "スペキュレイション 最前＆前2列": "sp1",
    "アマゾンストライク 最前列": "as1",
    "アマゾンストライク 前列": "as2",
    "龍陣 最前列": "rj1"
};
var kJinkei = {
    "指定なし": "0",
    "ハンターシフト 最後列": "hs2"
};
var sJinkei = {
    "指定なし": "0",
    "スペキュレイション 最前列": "sp1",
    "スペキュレイション 前列": "sp2",
    "スペキュレイション 後列": "sp3",
    "アマゾンストライク 最前列": "as1",
    "アマゾンストライク 前列": "as2",
    "アマゾンストライク 後列": "as3",
    "ラピッドストリーム": "rs",
    "パワーレイズ 前列": "pl1",
    "パワーレイズ 最後列": "pl2",
    "ハンターシフト 前中列": "hs2",
    "デザートランス 最前列": "dr1",
    "デザートランス 後列": "dr2",
    "龍陣 最前列": "rj1",
    "龍陣 前列": "rj2",
    "龍陣 後列": "rj3",
    "インペリアルクロス 前列": "ic",
    "鳳天舞の陣：外周": "hi"
};
function getJinkei(type) {
    var list;
    if (type === 1) {
        list = wJinkei;
    } else if (type === 2) {
        list = kJinkei;
    } else if (type === 3) {
        list = sJinkei;
    }
    return list;
}

/**
 * 陣形補正されたStrとAgiを取得
 * @param {type} str キャラクターの腕力
 * @param {type} j_str 陣形腕力補正
 * @param {type} agi キャラクターの素早さ
 * @param {type} j_agi 陣形素早さ補正
 * @returns {Array} 0:腕力,1:素早さ
 */
function getJinkeiStrAgi(str, j_str, agi, j_agi) {
    var sCJ = new Number(str * j_str / 100).toFixed(0);
    var culcSv = str + Number(sCJ);
    var aCJ = new Number(agi * j_agi / 100).toFixed(0);
    culcAgi = agi + Number(aCJ);
    return [culcSv, culcAgi];
}
