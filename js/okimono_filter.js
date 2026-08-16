// 「サポート（置物）スタイル」のクライアント側フィルタ判定（純粋関数）。
// アタッカーの絞り込みではない点に注意。アタッカーはスタイル単位で直接選ぶ。
//
// 2026-08-16: 攻撃属性(filterAttr)・オプション(filterRange)は使わなくなったので廃止し、
// 武器種・シリーズの2軸に絞った（所持チェッカー連動は呼び出し側の MY_FLAG で処理）。
// 古い呼び出しが filterAttr/filterRange を渡してきても無視する。

// シリーズ一致。実データの Series は
// RS1/RS2/RS3/SF1/SF2/US/ES/IS/SSG/SEB/RSR/GB1/GB2/GB3/OTR。
// GB だけは 1/2/3 に分かれているが UI は「GB」1つにまとめるので、接頭辞で拾う。
function seriesMatches(series, filterSeries) {
    if (!filterSeries) return true;
    var s = String(series == null ? '' : series);
    if (s === filterSeries) return true;
    if (filterSeries === 'GB' && s.indexOf('GB') === 0) return true;
    return false;
}

function supportPassesFilters(opts) {
    opts = opts || {};
    if (opts.filterWeapon && opts.weaponType !== opts.filterWeapon) return false;
    if (!seriesMatches(opts.series, opts.filterSeries)) return false;
    return true;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supportPassesFilters, seriesMatches };
}
