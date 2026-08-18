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

// 属性の並び（「斬」「斬・冷」「斬・打・突」…）
var ATTR_SEQ_RE = /(?:斬|打|突|熱|冷|雷|陽|陰)(?:・(?:斬|打|突|熱|冷|雷|陽|陰))*/;

// 詳細パネルに出す効果名を main/sub から決める（2026-08-17 ユーザー指摘の修正）。
//
// ABILITY_MASTER では「味方の属性攻撃強化」と「敵の属性防御弱化」の sub が同一。
//   攻勢激化Ⅶ(斬・冷) の実データ:
//     { main:'ダメージ強化',   sub:'斬・冷属性攻撃', size:'斬・冷属性攻撃強化超極大+(150%)' }
//     { main:'被ダメージ増加', sub:'斬・冷属性攻撃', size:'斬・冷属性防御弱化超極大(60%)'  }
// 区別は main にしかないので、sub だけで名前を作ると両方「斬・冷属性攻撃」に潰れる。
// 弱化系は「敵〜防御」と明記し、必ず「敵」から始まる形に揃える（ステデバフ行と同じ流儀）。
//
// 戻り値:
//   { kind:'text',   text }  そのまま表示する名前
//   { kind:'buff',   sub  }  ステバフ。呼び出し側が sub をアイコン列に変換する
//   { kind:'debuff', sub  }  ステデバフ。同上（呼び出し側が「敵」を前置する）
function effectName(main, sub) {
    var m = String(main == null ? '' : main);
    var s = String(sub == null ? '' : sub);

    if (m === 'バフ') return { kind: 'buff', sub: s };
    if (m === 'デバフ') return { kind: 'debuff', sub: s };

    if (m === '被ダメージ増加') {
        // sub は '斬・冷属性攻撃'（属性防御弱化）か '防御弱化'（無属性）。
        // 属性が取れたら「敵<属性>防御」、取れなければ「敵防御」。
        var hit = s.match(ATTR_SEQ_RE);
        return { kind: 'text', text: hit ? '敵' + hit[0] + '防御' : '敵防御' };
    }

    var name = s || m;
    name = name.replace('エクストラフォース', 'Ex');
    // 「斬・冷属性攻撃」「斬・冷属性攻撃強化」→「斬・冷攻撃」。
    // 実データの sub は '強化' なしなので、旧regex（属性攻撃強化 のみ）は一度も効いていなかった。
    name = name.replace(new RegExp('(' + ATTR_SEQ_RE.source + ')属性攻撃(?:強化)?'), '$1攻撃');
    // 「単体攻撃強化」→「単体攻撃」（無印の「攻撃強化」はそのまま残す）
    name = name.replace(/^(単体|全体|範囲|Weak|直接|間接)攻撃強化$/, '$1攻撃');
    return { kind: 'text', text: name };
}

// 効果量の表示文字列。size は呼び出し側で sub を除去済みの文字列が来る。
// 敵にかかる効果（デバフ・被ダメージ増加）はマイナス表記にして、強化系と向きを区別する。
function effectValue(main, size) {
    var raw = String(size == null ? '' : size);
    var val;
    var m = raw.match(/([0-9.]+)\s*%/);
    if (m) {
        val = m[1] + '%';
    } else {
        m = raw.match(/([0-9.]+)\s*倍/);
        if (m) return '×' + (1 + parseFloat(m[1])).toFixed(2);
        return raw; // 数値なし（付与アビ名等）はそのまま
    }
    var isDown = (main === 'デバフ' || main === '被ダメージ増加');
    return isDown ? '-' + val : val;
}

// ロック中サポーターとの重複により実質無効化される属性キーかどうかを判定する。
// BE(engine_okimonoBreakdown)が breakdown.duplicateSuppressed として返す一覧をそのまま
// 使うだけで、重複ルール（エクストラフォース/モラルアップ系はmax()採用）自体はFEで
// 再実装しない。duplicateSuppressed が無い/配列でない応答（旧キャッシュ等）は「重複なし」扱い。
function isDuplicateSuppressedAttr(attrKey, duplicateSuppressed) {
    if (!Array.isArray(duplicateSuppressed)) return false;
    return duplicateSuppressed.includes(attrKey);
}

// ブラウザでは global 関数として定義（export 無し）。node テスト用にのみ module.exports。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { signedPct, hiddenTriggerGroup, effectName, effectValue, isDuplicateSuppressedAttr };
}
