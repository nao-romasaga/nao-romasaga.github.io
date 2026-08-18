// 置物ランキングの「編成」（ロック済みサポーター）状態を扱う純粋関数群。
// ブラウザでは <script> 直読みでグローバル定義。node テスト用に module.exports も付ける
// （okimono_api.js / okimono_format.js と同じ二重定義パターン）。
var PARTY_MAX_SUPPORTS = 4;   // アタッカー1 + サポーター4 = パーティ5人

// list に styleId を追加した新しい配列を返す。重複・満員・falsy は元と同内容のコピーを返す。
function partyAdd(list, styleId, max) {
    var m = (typeof max === 'number') ? max : PARTY_MAX_SUPPORTS;
    if (!styleId || list.indexOf(styleId) !== -1 || list.length >= m) {
        return list.slice();
    }
    return list.concat([styleId]);
}

// list から styleId を除いた新しい配列を返す。
function partyRemove(list, styleId) {
    return list.filter(function (id) { return id !== styleId; });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { partyAdd: partyAdd, partyRemove: partyRemove, PARTY_MAX_SUPPORTS: PARTY_MAX_SUPPORTS };
}
