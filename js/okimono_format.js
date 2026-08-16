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

// 詳細パネルに出さないトリガーの判定（2026-08-17 ユーザー指定）。
// 置物ランキングは「サポーターは行動しない・1ターン目のみのサポート」を前提に計算しているので、
// 発動しようがないトリガーを表示すると、効いているように誤読される。
// - サポーター自身の行動系トリガー（攻撃時/命中時/発動後）→ 隠す
// - 2ターン目以降にしか起きないトリガー（Nターン目以降/Nの倍数/偶数ターン/ターン終了時）→ 隠す
//   ※ターン終了時の効果が効くのは次ターンの開始時で、消費側（engine_rankOkimono）は
//     1ターン目開始時の値しか読まないため
// ただし味方へ付与されたアビ（grantedToParty。ダークボルテージⅣ等）の行動系トリガーは
// アタッカーの行動で発動して計算にも入っているので出す。敵マーカー（isMarker）も同様。
function hiddenTriggerGroup(e) {
    if (!e) return false;
    var w = String(e.when || '');
    if (e.isMarker) return false;

    // 2ターン目以降にしか起きないトリガー
    if (/[2-9]ターン目以降|[0-9]+の倍数のターン/.test(w)) return true;
    if (w.indexOf('偶数ターン') !== -1) return true;
    if (w.indexOf('ターン終了時') !== -1) return true;

    // サポーター自身の行動系（「〜を受けた時」は受け身なので除く）
    var isAction = /攻撃|命中|発動後/.test(w) && w.indexOf('受け') === -1;
    if (isAction && !e.grantedToParty) return true;

    return false;
}

// ブラウザでは global 関数として定義（export 無し）。node テスト用にのみ module.exports。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { signedPct, hiddenTriggerGroup };
}
