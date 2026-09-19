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

// 付与する追撃・行動トリガー効果（BE breakdown.grant）を1行にまとめる。
// DAMAGE/BUFF/DEBUFF は「溜め計測で出た静的%」だけなので、追撃のように攻撃シミュレーション
// 時にしか発火しない寄与はどのバケットにも現れない。出さないと「火力15%しか無いのに1位」に
// 見える（2026-09-16: タチアナ＝よくばり娘が配る ウィークスタンプ の追撃で upRate 1.008→4.51）。
function buildGrantNoteHTML(breakdown) {
    var grant = breakdown && breakdown.grant;
    if (!Array.isArray(grant) || grant.length === 0) return '';
    var items = grant.map(function (g) {
        var name = g.GrantName || '';
        var when = g.when || g.trigger || '';
        var body;
        if (g.main === '追撃') {
            // size は発動する技IDの '/' 連結。同じIDが並ぶ＝その回数だけ発動する
            var ids = String(g.size || '').split('/').filter(Boolean);
            var names = ids.map(function (id) {
                var sk = (typeof SKILL_MASTER !== 'undefined') ? SKILL_MASTER['ID' + Number(id).toString(16)] : null;
                return (sk && sk['Name']) ? sk['Name'] : id;
            });
            var uniq = [];
            names.forEach(function (n) {
                var hit = uniq.find(function (u) { return u.name === n; });
                if (hit) hit.n++; else uniq.push({ name: n, n: 1 });
            });
            body = '追撃 ' + uniq.map(function (u) {
                return u.name + (u.n > 1 ? '×' + u.n + '回' : '');
            }).join(' / ');
        } else {
            body = (g.main || '') + (g.sub && g.sub !== '-' ? ' ' + g.sub : '') + ' ' + (g.size || '');
        }
        return '<span class="fuchidori-blue">' + name + '</span>'
             + '<span class="dtl-off">（' + when + '）</span> ' + body;
    });
    return '<div><span class="dtl-tag">付与</span>' + items.join('<br>') + '</div>';
}

// ランダムな味方1体への付与（BE breakdown.randomGrants）。
// ランキングはアタッカーに当たった前提の理論値なので、その旨を明示する。
// 効果自体は静的%へ畳み込まれ damage/buff にも含まれている（二重計上ではない）。
function buildRandomGrantNoteHTML(breakdown) {
    var list = breakdown && breakdown.randomGrants;
    if (!Array.isArray(list) || list.length === 0) return '';
    var names = list.map(function (r) { return r.grantedName || r.GrantName || ''; })
                    .filter(Boolean).join(' / ');
    return '<div><span class="dtl-tag dtl-random">ランダム</span>'
         + '<span class="fuchidori-blue">' + names + '</span> '
         + '<span class="dtl-off">は味方1体へランダムに付与。アタッカーに乗った場合の理論値です</span></div>';
}

// いま成立しているエクストラフォース（BE baseBreakdown.exList: 名前 => 加算倍率）を
// 表示用に整える。置物候補の Ex と重複不可を人が見比べるための材料。
// 表記は既存の Ex 表示と揃えて「×1.75」形式（エンジンの最終倍率 = 1 + Σex と同じ読み方）。
function formatExList(exList) {
    if (!exList || typeof exList !== 'object' || Array.isArray(exList)) return [];
    return Object.keys(exList)
        .map(function (name) { return { name: name, raw: Number(exList[name]) || 0 }; })
        .sort(function (a, b) { return b.raw - a.raw; })
        .map(function (e) { return { name: e.name, mult: '×' + (1 + e.raw).toFixed(2) }; });
}

// 火力アビ（攻撃強化＋ダメージ強化＋防御弱化の合算）の上限。BE の $MAX_FIRE_DAMAGE と同値。
// BE は damageCalc.inc でこの値に clamp してから DAMAGE_BREAKDOWN.ability へ入れるので、
// 応答の ability が上限と等しければ「張り付いている」と判定できる（生値は応答に無い）。
// ステバフの上限は応答が statParts[].buffCap で運んでくるのでここには持たない。
var OKIMONO_ABILITY_CAP = 10000;

// 編成セクションに出す「現在の合計（アタッカー＋編成中サポーター）」の要約を作る。
// bd は DAMAGE_BREAKDOWN のスナップショットで、呼び出し側は行動終了時＝最終ヒットの
// ものを渡す（多段で防御弱化が積み上がる構成だと1ヒット目とは値が違う。カンスト条件が
// 「アタッカーが行動終了時にカンストしている」なので最終ヒットを見る。2026-09-20 ユーザー指定）。
//
// カンスト印を付けるのは火力アビとステバフの2つだけ。敵デバフと Ex はエンジンに上限が
// 無いので、印を付けると実装に無い制限を画面が主張することになる。
// 値が0（＝効果なし）の行は出さない。読む価値が無い行で縦を使わないため。
//
// 戻り値: [{key, label, segments:[{text, capped}], note?, total?}]
function partyEffectSummary(bd) {
    if (!bd || typeof bd !== 'object') return [];
    var rows = [];

    // --- 火力アビ（防御弱化込み。BE が ability% 項へ線形加算している） ---
    var ability = Number(bd.ability) || 0;
    if (ability > 0) {
        rows.push({
            key: 'ability',
            label: '火力アビ',
            segments: [{ text: Math.round(ability) + '%', capped: ability >= OKIMONO_ABILITY_CAP }],
            note: '攻撃強化・ダメージ強化・防御弱化の合算',
        });
    }

    // --- ステバフ（参照ステごと。体術のように2つ使う武器種では2件出る） ---
    var statSegs = (Array.isArray(bd.statParts) ? bd.statParts : []).map(function (sp) {
        var per = Number(sp.buffPer) || 0;
        var cap = Number(sp.buffCap) || 0;
        // buffPerRaw は上限適用前の生値。無い応答（旧キャッシュ）では buffPer を生値とみなす
        var raw = (sp.buffPerRaw != null) ? Number(sp.buffPerRaw) : per;
        return {
            per: per,
            text: String(sp.jp || sp.key || '') + ' ' + Math.round(per) + '%',
            capped: cap > 0 && raw >= cap,
        };
    // 0% のステは出さない（火力アビ・敵デバフの0と同じ扱い）。statParts は参照ステを
    // 常に全部並べてくるので、素のアタッカーだと「腕 0%」だけの行が残っていた。
    }).filter(function (s) { return s.per !== 0; })
      .map(function (s) { return { text: s.text, capped: s.capped }; });
    if (statSegs.length) {
        rows.push({ key: 'statBuff', label: 'ステバフ', segments: statSegs });
    }

    // --- 敵ステデバフ（負値＝低下）。上限はエンジンに無いので印は付けない ---
    var enemyDebuff = Number(bd.enemyDebuffPer) || 0;
    if (enemyDebuff !== 0) {
        rows.push({
            key: 'enemyDebuff',
            label: '敵デバフ',
            segments: [{ text: signedPct(enemyDebuff), capped: false }],
        });
    }

    // --- Ex（成立中のエクストラフォース）。同名は重複不可＝最大のみ採用される ---
    var exItems = formatExList(bd.exList);
    if (exItems.length) {
        rows.push({
            key: 'ex',
            label: 'Ex',
            segments: exItems.map(function (e) {
                return { text: e.name + ' ' + e.mult, capped: false };
            }),
            total: '×' + (Number(bd.ex) || 1).toFixed(2),
            note: '同名のExは重複しません（一番大きいものだけが乗ります）',
        });
    }

    return rows;
}

// ブラウザでは global 関数として定義（export 無し）。node テスト用にのみ module.exports。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        signedPct, hiddenTriggerGroup, effectName, effectValue, isDuplicateSuppressedAttr,
        buildGrantNoteHTML, buildRandomGrantNoteHTML, formatExList,
        partyEffectSummary, OKIMONO_ABILITY_CAP,
    };
}
