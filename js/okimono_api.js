// 置物ランキング API (okimono_rank.php) のリクエスト URL を組み立てる純粋関数群。
// ブラウザでは <script> 直読みでグローバル定義。node テスト用に module.exports も付ける。

// hostname から API ベース URL を解決する。
// localhost/127.0.0.1 → 同一オリジン相対パス（ローカル php -S と同居・CORS 不要）
// それ以外（本番 GitHub Pages 等） → romasagatool.com 絶対 URL
function resolveOkimonoApiBase(hostname) {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'api/okimono_rank.php';
    }
    return 'https://romasagatool.com/api/okimono_rank.php';
}

// req を okimono_rank.php のクエリ文字列へ。
// 構造ブラケット（enemy[count] 等）は literal、属性キーと値は encodeURIComponent。
// PHP は key を urldecode してからブラケット解析するため %エンコード済み属性も正しく配列化される。
function buildOkimonoQuery(base, req) {
    const parts = [];
    const add = (k, v) => parts.push(k + '=' + encodeURIComponent(v));
    add('attackerStyleId', req.attackerStyleId);
    add('skillId', req.skillId);
    const e = req.enemy || {};
    if (e.count != null) add('enemy[count]', e.count);
    if (e.vit != null) add('enemy[vit]', e.vit);
    if (e.mnd != null) add('enemy[mnd]', e.mnd);
    const resist = e.resist || {};
    for (const attr in resist) {
        add('enemy[resist][' + encodeURIComponent(attr) + ']', resist[attr]);
    }
    if (req.weaponIllust != null) add('weaponIllust', req.weaponIllust);
    return base + '?' + parts.join('&');
}

// ブラウザでは global 関数として定義（export 無し）。node テスト用にのみ module.exports。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { resolveOkimonoApiBase, buildOkimonoQuery };
}
