// 置物（火力サポート）ランキングの表示フォーマット用の純粋関数。
// buff_ranking.js は jQuery 前提で node から require できないため、
// テストしたい書式ロジックだけをこのモジュールに切り出している。

// 符号付きのパーセント文字列を返す。
// 従来は `+${v}%` とテンプレートで '+' を固定前置していたため、負値が '+-50%' になっていた
// （加藤忍[充実した日々を] の 全:-50 で発生。2026-08-16）。
// digits は小数桁。丸めた結果が 0 になる負値は '-0.0%' ではなく '+0.0%' に倒す。
function signedPct(value, digits) {
    var d = (typeof digits === 'number' && digits >= 0) ? digits : 0;
    var n = Number(value);
    if (!isFinite(n)) n = 0;
    var body = Math.abs(n).toFixed(d);
    var sign = (parseFloat(body) === 0 || n > 0) ? '+' : '-';
    return sign + body + '%';
}

// ブラウザでは global 関数として定義（export 無し）。node テスト用にのみ module.exports。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { signedPct };
}
