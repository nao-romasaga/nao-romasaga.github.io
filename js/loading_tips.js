// ランキング系ページ（buff_ranking / autodamage）の API 待ち中に出す Tips。
// 文言はここに直書き（データ連携なし）。ゲーム仕様に踏み込む内容は
// romasaga-workspace/CLAUDE.md「ゲームルール / ドメイン知識」と食い違わないこと。
var LOADING_TIPS = [
    '「攻撃時」発動のアビリティは、多段技でも1HIT目でしか判定されません',
    'ステータスバフ（腕力+など）は4ターンかけて毎ターン減衰します',
    '攻撃強化・ダメージ強化などの状態付与は残ターンが切れるまで効果量が変わりません',
    '追撃で発動した技は、次のアビリティ発動のトリガーになりません',
    'トリガーの「/」区切りは AND 条件。順番は関係ありません',
    '火力サポートランキングでは、行の「＋」でサポーターを最大4体まで編成に追加できます',
    '敵の防御・耐性を変えると、有利なバッファーの順位も入れ替わります',
    'ODで撃つと発動するアビリティは、OD時のダメージランキングで確認できます',
    '弱点属性で殴ると「Weak攻撃命中時」系のアビリティが乗ります',
    '同じ名前のアビリティでも、効果量や発動条件はスタイルごとに違うことがあります',
];

// tips から直前(prevIdx)以外の1本を選び、その index を返す。
// rand は 0<=r<1 を返す関数（テストで差し替え可能）。tips が1本なら prevIdx をそのまま返す。
function pickTip(tips, prevIdx, rand) {
    var r = rand || Math.random;
    if (tips.length <= 1) return 0;
    if (prevIdx < 0 || prevIdx >= tips.length) return Math.floor(r() * tips.length);
    var idx = Math.floor(r() * (tips.length - 1));
    if (idx >= prevIdx) idx += 1;
    return idx;
}

// ローディング表示の HTML。直前の Tips と被らないように前回の index を保持する。
var LOADING_TIPS_PREV = -1;
function buildLoadingTipsHTML(label) {
    LOADING_TIPS_PREV = pickTip(LOADING_TIPS, LOADING_TIPS_PREV);
    var tip = LOADING_TIPS[LOADING_TIPS_PREV];
    return '<div class="loading-tips"><div class="loading-tips-inner">' +
        '<div class="loading-tips-label blinking">' + (label || '計算中...') + '</div>' +
        '<div class="loading-tips-body"><span class="loading-tips-head">Tips</span>' + tip + '</div>' +
        '</div></div>';
}

if (typeof module !== 'undefined') module.exports = { pickTip: pickTip, LOADING_TIPS: LOADING_TIPS };
