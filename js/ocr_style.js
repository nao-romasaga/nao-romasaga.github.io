/**
 * スクショ所持登録（アイコン画像マッチング / dHash）
 *
 * 方針: スタイルアイコン（img/style_icon_bg/{sid}.png, 枠付き＝ゲーム画面に近い）を
 * dHash(64bit) で辞書化し、スクショから切り出したアイコンの dHash と
 * ハミング距離で照合する。辞書生成も照合も同一の dhashFromCanvas を使うことで
 * 計算式のズレを防ぐ。
 *
 * 公開関数:
 *   dhashFromCanvas(canvas) -> hex(16桁)
 *   hamming(aHex, bHex) -> number
 *   matchIcon(hashHex) -> {sid, dist}        ※ STYLE_ICON_HASH を辞書に使用
 *   loadImage(url) -> Promise<HTMLImageElement>
 *   imgToCanvas(img, sx, sy, sw, sh, dw, dh) -> canvas
 *   generateHashDict(sids, onProgress) -> Promise<{sid:hex}>   ※辞書生成用
 */

var STYLE_ICON_HASH = (typeof STYLE_ICON_HASH !== "undefined") ? STYLE_ICON_HASH : null;

/* ---------- カラー署名（8x8 RGB） ----------
 * グレースケールdHashだとアニメ調アイコンの髪色/衣装色を捨ててしまい識別力が低い。
 * 8x8にダウンサンプルしたRGB(=192値)をL1距離で比較する方が圧倒的に正確（実測100%）。
 * 縮小により位置/JPEGノイズ/小オーバーレイにも頑健。
 */
var SIG_N = 8; // 8x8

// canvas → Uint8Array(192) RGB署名
function colorSigBytes(srcCanvas) {
    var t = document.createElement("canvas");
    t.width = SIG_N; t.height = SIG_N;
    var g = t.getContext("2d");
    g.drawImage(srcCanvas, 0, 0, SIG_N, SIG_N);
    var d = g.getImageData(0, 0, SIG_N, SIG_N).data;
    var out = new Uint8Array(SIG_N * SIG_N * 3);
    for (var i = 0, o = 0; i < d.length; i += 4) { out[o++] = d[i]; out[o++] = d[i + 1]; out[o++] = d[i + 2]; }
    return out;
}

// Uint8Array → base64（辞書保存用）
function sigToB64(u8) {
    var s = ""; for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    return btoa(s);
}
function b64ToSig(b64) {
    var s = atob(b64), u8 = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
    return u8;
}

// L1距離
function colorDist(a, b) { var s = 0; for (var i = 0; i < a.length; i++) { var x = a[i] - b[i]; s += x < 0 ? -x : x; } return s; }

// 辞書(base64)を Uint8Array にデコードしてキャッシュ
var DICT_SIG = null;
function ensureDictSig() {
    if (DICT_SIG || !STYLE_ICON_HASH) return DICT_SIG;
    DICT_SIG = {};
    for (var sid in STYLE_ICON_HASH) DICT_SIG[sid] = b64ToSig(STYLE_ICON_HASH[sid]);
    return DICT_SIG;
}

// sig(Uint8Array) → 最良一致（基本辞書＋全体共有の学習辞書）
function matchIcon(sig) {
    var dict = ensureDictSig();
    var best = null, bd = 1e9;
    if (dict) for (var sid in dict) { var dd = colorDist(sig, dict[sid]); if (dd < bd) { bd = dd; best = sid; } }
    // 学習辞書（皆の差し替え訂正例）も照合。端末ごとの色味に適応する
    for (var s in LEARNED_SIG) {
        var arr = LEARNED_SIG[s];
        for (var i = 0; i < arr.length; i++) { var d2 = colorDist(sig, arr[i]); if (d2 < bd) { bd = d2; best = s; } }
    }
    return { sid: best, dist: bd };
}

/* ---------- 全体共有 学習辞書（差し替え訂正を皆で蓄積し精度UP） ---------- */
var LEARNED_SIG = {};            // {sid: [Uint8Array,...]} 実行時にデコード保持
var LEARN_CAP_PER_SID = 30;      // 1スタイルあたりの上限（肥大化防止）

// Firebase の ocr_learn/{sid} から全件読込（ログイン不要・閲覧は誰でも）
function loadLearnedSigs(cb) {
    if (typeof firebase === "undefined" || typeof appUsers === "undefined") { if (cb) cb(); return; }
    try {
        firebase.database(appUsers).ref("ocr_learn").once("value").then(function (snap) {
            var val = snap.val() || {}, out = {};
            for (var sid in val) {
                var arr = [];
                for (var k in val[sid]) { try { arr.push(b64ToSig(val[sid][k].s)); } catch (e) { } }
                if (arr.length) out[sid] = arr;
            }
            LEARNED_SIG = out;
            if (cb) cb();
        }).catch(function () { if (cb) cb(); });
    } catch (e) { if (cb) cb(); }
}

// 差し替え訂正を全体辞書へ寄与（荒らし対策でログイン必須＋上限＋重複抑制）
function contributeLearned(sid, sigBytes) {
    if (!sid || !sigBytes) return;
    if (typeof firebase === "undefined" || typeof appUsers === "undefined") return;
    if (typeof UID === "undefined" || !UID) return;                // ログイン必須
    var existing = LEARNED_SIG[sid] || [];
    if (existing.length >= LEARN_CAP_PER_SID) return;              // 上限
    for (var i = 0; i < existing.length; i++) { if (colorDist(sigBytes, existing[i]) < 1500) return; } // 酷似は追加しない
    try {
        if (typeof addData === "function") addData("ocr_learn/" + sid, { s: sigToB64(sigBytes), t: (new Date()).getTime(), u: UID });
        (LEARNED_SIG[sid] = LEARNED_SIG[sid] || []).push(sigBytes); // ローカル即反映
    } catch (e) { }
}

// 上位N候補（差し替え用）
function matchIconTopN(sig, n) {
    n = n || 6;
    var dict = ensureDictSig();
    if (!dict) return [];
    var arr = [];
    for (var sid in dict) arr.push({ sid: sid, dist: colorDist(sig, dict[sid]) });
    arr.sort(function (a, b) { return a.dist - b.dist; });
    return arr.slice(0, n);
}

/* ---------- 画像ユーティリティ ---------- */

function loadImage(url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () { resolve(img); };
        img.onerror = function () { reject(new Error("load fail: " + url)); };
        img.src = url;
    });
}

// img の (sx,sy,sw,sh) を (dw,dh) の canvas に描いて返す
function imgToCanvas(img, sx, sy, sw, sh, dw, dh) {
    var cv = document.createElement("canvas");
    cv.width = dw; cv.height = dh;
    cv.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
    return cv;
}

/* ---------- 辞書生成（一度だけ実行する用） ---------- */

// sids: [sid...], 画像は ./img/style_icon_bg/{sid}.png から読む
async function generateHashDict(sids, onProgress) {
    var dict = {};
    var done = 0;
    for (var i = 0; i < sids.length; i++) {
        var sid = sids[i];
        try {
            var img = await loadImage("./img/style_icon_bg/" + sid + ".png");
            var cv = imgToCanvas(img, 0, 0, img.width, img.height, 64, 64);
            dict[sid] = sigToB64(colorSigBytes(cv));
        } catch (e) {
            // 読めない画像はスキップ
        }
        done++;
        if (onProgress && (done % 100 === 0 || done === sids.length)) onProgress(done, sids.length);
    }
    return dict;
}

/* ---------- スクショ → グリッド切出 → 照合 ---------- */

// 距離しきい値（カラーL1, 8x8 RGB=192値）。これ以下を「自信あり」とみなす
// 実測: 正解一致は概ね 5600〜7300。辞書に無いスタイルはこれより大きくなる傾向。
var OCR_DIST_OK = 8000;

// 画像→グレースケール輝度の2次元配列（検出用、キャッシュ）
function imgLumGrid(img) {
    var W = img.width, H = img.height;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var g = cv.getContext("2d"); g.drawImage(img, 0, 0);
    var d = g.getImageData(0, 0, W, H).data;
    var lum = new Float32Array(W * H);
    for (var i = 0, p = 0; i < d.length; i += 4, p++) lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    return { lum: lum, W: W, H: H };
}

// 暗い帯（アイコン）を検出する汎用バンド検出
function detectBands(prof, thr, below, minLen, gapTol) {
    var res = [], st = -1, gap = 0;
    for (var i = 0; i < prof.length; i++) {
        var hit = below ? (prof[i] < thr) : (prof[i] >= thr);
        if (hit) { if (st < 0) st = i; gap = 0; }
        else if (st >= 0) { gap++; if (gap > gapTol) { if (i - gap - st >= minLen) res.push([st, i - gap]); st = -1; } }
    }
    if (st >= 0) res.push([st, prof.length - 1]);
    return res;
}

// スタイル一覧スクショからアイコンのセル矩形 [{x,y,w,h}] を自動検出
function detectGridCells(img) {
    var G = imgLumGrid(img), W = G.W, H = G.H, lum = G.lum;
    var L = function (x, y) { return lum[y * W + x]; };
    var yTop = Math.round(H * 0.08), yBot = Math.round(H * 0.92);

    // 分散プロファイル（背景の明暗・色に依存せず、アイコン=高分散/余白=低分散で効く）
    function varProfileCols() {
        var arr = new Array(W);
        for (var x = 0; x < W; x++) { var s = 0, s2 = 0, n = 0; for (var y = yTop; y < yBot; y += 3) { var v = L(x, y); s += v; s2 += v * v; n++; } var mn = s / n; arr[x] = s2 / n - mn * mn; }
        return arr;
    }
    function varProfileRows(rx0, rx1) {
        var arr = new Array(H);
        for (var y = 0; y < H; y++) { var s = 0, s2 = 0, n = 0; for (var x = rx0; x < rx1; x += 3) { var v = L(x, y); s += v; s2 += v * v; n++; } var mn = s / n; arr[y] = s2 / n - mn * mn; }
        return arr;
    }
    // 周期を自己相関で推定（ノイジーな余白でも周期構造は強い）
    function autocorrPitch(sig, s0, s1, lo, hi) {
        var mean = 0, cnt = 0; for (var i = s0; i < s1; i++) { mean += sig[i]; cnt++; } mean /= cnt;
        var best = lo, bc = -1e18;
        for (var lag = lo; lag <= hi; lag++) {
            var c = 0, n = 0;
            for (var j = s0; j + lag < s1; j += 2) { c += (sig[j] - mean) * (sig[j + lag] - mean); n++; }
            if (n) c /= n;   // 項数で正規化（小lagへの偏りを除去＝列数の取り違え防止）
            if (c > bc) { bc = c; best = lag; }
        }
        return best;
    }
    // 位相: 周期 pitch・幅 cellW のセル群を off だけずらし、セル内分散和が最大の off を選ぶ
    function bestPhase(sig, lo, hi, pitch, cellW, count) {
        var bestOff = lo, bestS = -1;
        for (var off = lo; off < lo + pitch; off += 1) {
            var sc = 0;
            for (var k = 0; (off + k * pitch) < hi; k++) {
                var st = off + k * pitch; var en = Math.min(st + cellW, hi);
                for (var x = st; x < en; x += 2) sc += sig[x] || 0;
            }
            if (sc > bestS) { bestS = sc; bestOff = off; }
        }
        return bestOff;
    }

    var colVar = varProfileCols();

    // --- 列検出① 高分散バンド中心から直接（明背景で正確。列数/ピッチ非依存）---
    function colsFromBands() {
        var mx = 0; for (var x = 0; x < W; x++) if (colVar[x] > mx) mx = colVar[x];
        var thr = mx * 0.30, bands = [], st = -1;
        for (var x = 0; x < W; x++) {
            if (colVar[x] >= thr) { if (st < 0) st = x; }
            else { if (st >= 0) { if (x - st > W * 0.05) bands.push([st, x - 1]); st = -1; } }
        }
        if (st >= 0 && (W - st) > W * 0.05) bands.push([st, W - 1]);
        if (bands.length < 4 || bands.length > 8) return null;
        var lefts = bands.map(function (b) { return b[0]; });
        var widths = bands.map(function (b) { return b[1] - b[0]; });
        var diffs = []; for (var i = 1; i < lefts.length; i++) diffs.push(lefts[i] - lefts[i - 1]);
        var mn = Math.min.apply(null, diffs), mxd = Math.max.apply(null, diffs);
        if (mxd / mn > 1.4) return null;   // 間隔が不均一＝バンド融合等→信頼しない
        return { colLefts: lefts, cellW: Math.round(median(widths)) };
    }

    var cellW, colLefts, colPitch;
    var byBand = colsFromBands();
    if (byBand) {
        colLefts = byBand.colLefts; cellW = byBand.cellW;
        colPitch = colLefts.length > 1 ? Math.round((colLefts[colLefts.length - 1] - colLefts[0]) / (colLefts.length - 1)) : cellW;
    } else {
        // --- 列検出② 自己相関→位相（暗背景でバンドが融合する場合のフォールバック）---
        colPitch = autocorrPitch(colVar, Math.round(W * 0.02), Math.round(W * 0.98), Math.round(W * 0.13), Math.round(W * 0.24));
        cellW = Math.round(colPitch * 0.88);
        var nCol = Math.round(W / colPitch);
        var colOff = bestPhase(colVar, 0, W, colPitch, cellW, nCol);
        colLefts = [];
        for (var k = 0; k < nCol; k++) { var st2 = colOff + k * colPitch; if (st2 >= 0 && st2 + cellW <= W) colLefts.push(st2); }
    }
    if (colLefts.length < 2) return null;

    // --- 行: 「アイコン列の大半が同時に高分散」な行だけを拾う ---
    // 上部のソート/フィルタUI・検索ボックス・タブや下部のボタン帯は、5列全てが
    // 同時に高分散になることはほぼ無い。列ごとの行分散を出し、列方向の中央値を
    // 行スコアにすると、アイコン行だけが高くなりUIヘッダ/フッタを自然に除外できる。
    function colRowVarProfiles() {
        var profs = [];
        for (var c = 0; c < colLefts.length; c++) {
            var x0 = colLefts[c], x1 = Math.min(W, colLefts[c] + cellW);
            var arr = new Float64Array(H);
            for (var y = 0; y < H; y++) {
                var s = 0, s2 = 0, n = 0;
                for (var x = x0; x < x1; x += 3) { var v = L(x, y); s += v; s2 += v * v; n++; }
                var mn = s / n; arr[y] = s2 / n - mn * mn;
            }
            profs.push(arr);
        }
        return profs;
    }
    var cprofs = colRowVarProfiles();
    var rowScore = new Float64Array(H);
    var tmpC = new Array(cprofs.length);
    for (var ys = 0; ys < H; ys++) {
        for (var c2 = 0; c2 < cprofs.length; c2++) tmpC[c2] = cprofs[c2][ys];
        tmpC.sort(function (a, b) { return a - b; });
        rowScore[ys] = tmpC[Math.floor(tmpC.length / 2)]; // 列方向の中央値
    }
    var rowPitch = autocorrPitch(rowScore, yTop, yBot, Math.round(cellW * 1.05), Math.round(cellW * 1.95));
    var rowOff = bestPhase(rowScore, yTop, yBot, rowPitch, cellW, 0);
    // しきい値: アイコン行スコアの最大値に対する比
    var rsMax = 0; for (var yr = yTop; yr < yBot; yr++) if (rowScore[yr] > rsMax) rsMax = rowScore[yr];
    var rsThr = rsMax * 0.18;
    // 画像全体から候補行を生成し、アイコン本体のスコアがしきい値以上の行だけ残す
    // （= ヘッダ/フッタ/余白行を捨てる）
    var rowTops = [];
    for (var ty = rowOff % rowPitch; ty + cellW * 0.6 < H; ty += rowPitch) {
        var top = Math.round(ty); if (top < 0) continue;
        var a = top + Math.round(cellW * 0.15), b = Math.min(H, top + Math.round(cellW * 0.85));
        var sum = 0, cnt = 0; for (var yy = a; yy < b; yy += 2) { sum += rowScore[yy]; cnt++; }
        if (cnt && (sum / cnt) >= rsThr) rowTops.push(top);
    }
    if (!rowTops.length) return null;

    var cells = [];
    for (var ri = 0; ri < rowTops.length; ri++) {
        for (var ci = 0; ci < colLefts.length; ci++) {
            cells.push({ x: Math.round(colLefts[ci]), y: rowTops[ri], w: cellW, h: cellW });
        }
    }
    return { cells: cells, cols: colLefts.length, rows: rowTops.length, cellW: cellW, pitch: colPitch, colLefts: colLefts.map(Math.round), rowTops: rowTops };
}

function median(a) { var b = a.slice().sort(function (x, y) { return x - y; }); return b[Math.floor(b.length / 2)]; }

// 1セルを ±オフセットで微調整しながら最良一致を探す（位置ズレ吸収）。
// カラー署名は縮小で位置ズレに頑健なので軽量な3x3探索で十分。
function matchCellSnap(img, box) {
    var best = null;
    var s = Math.max(2, Math.round(box.w * 0.04)); // セル幅に比例した微調整幅（細かめ）
    var offs = [-2 * s, -s, 0, s, 2 * s];
    for (var di = 0; di < offs.length; di++) {
        for (var dj = 0; dj < offs.length; dj++) {
            var x = box.x + offs[di], y = box.y + offs[dj];
            var w = box.w, h = box.h;
            if (x < 0 || y < 0 || x + w > img.width || y + h > img.height) continue;
            var cv = imgToCanvas(img, x, y, w, h, 64, 64);
            var sig = colorSigBytes(cv);
            var m = matchIcon(sig);
            if (!best || m.dist < best.dist) best = { sid: m.sid, dist: m.dist, hash: sig, x: x, y: y, w: w, h: h };
        }
    }
    if (best) best.crop = imgToCanvas(img, best.x, best.y, best.w, best.h, 64, 64).toDataURL("image/png");
    return best;
}

// 自動検出 → セル毎スナップ照合
function analyzeScreenshotAuto(img) {
    var grid = detectGridCells(img);
    if (!grid) return { grid: null, cells: [] };
    var out = [];
    for (var i = 0; i < grid.cells.length; i++) {
        var b = matchCellSnap(img, grid.cells[i]);
        if (b) { b.col = i % grid.cols; b.row = Math.floor(i / grid.cols); out.push(b); }
    }
    return { grid: grid, cells: out };
}

// 旧API（手動uniformグリッド）。スナップ付きに更新
function processScreenshot(img, opt) {
    var res = [];
    for (var r = 0; r < opt.rows; r++) {
        for (var c = 0; c < opt.cols; c++) {
            var x = Math.round(opt.left + c * (opt.cellW + opt.gapX));
            var y = Math.round(opt.top + r * (opt.cellH + opt.gapY));
            if (x + opt.cellW > img.width + 2 || y + opt.cellH > img.height + 2) continue;
            var b = matchCellSnap(img, { x: x, y: y, w: opt.cellW, h: opt.cellH });
            if (b) { b.col = c; b.row = r; res.push(b); }
        }
    }
    return res;
}

function guessGridOpt(img, cols) {
    cols = cols || 5;
    var cell = Math.floor(img.width / cols);
    var rows = Math.max(1, Math.floor(img.height / cell));
    return { cols: cols, rows: rows, top: 0, left: 0, cellW: cell, cellH: cell, gapX: 0, gapY: 0 };
}

/* ---------- 確認・修正UI ---------- */

var OCR_SHOTS = [];        // [{img, opt, $row}]
var OCR_CANDIDATES = [];   // [{sid, dist, crop, excluded, owned}]
var OCR_ON_CONFIRM = null; // function(sids)
var OCR_IS_OWNED = null;   // function(sid)->bool（所持済み判定。任意）

function iconUrl(sid) { return "https://romasagatool.com/img/style_icon_bg/" + sid + ".png"; }
function altButtonHtml(sid) {
    return '<button type="button" class="ocr-alt" data-sid="' + sid + '">' +
        '<img src="' + iconUrl(sid) + '"><span>' + escHtml(styleName(sid)) + '</span></button>';
}
function styleName(sid) {
    var info = (typeof STYLE_MASTER !== "undefined") ? STYLE_MASTER[sid] : null;
    return info ? (info.Name || sid) : sid;
}

// OCR UI のCSSを一度だけ注入（admin/mystyle 共通。背景色付きで視認性を確保）
function injectOcrStyles() {
    if (document.getElementById("ocr-injected-styles")) return;
    var css =
        ".ocr-panel{margin:8px 0 14px;}" +
        // 目玉機能: スクショ所持登録の大型トグル
        ".ocr-toggle-big{display:block;width:100%;max-width:480px;margin:6px auto;font-size:19px;font-weight:bold;padding:16px 20px;letter-spacing:.5px;cursor:pointer;border-radius:8px;box-shadow:0 0 0 0 rgba(120,230,150,.6);animation:ocrPulse 2.2s infinite;}" +
        ".ocr-toggle-big:hover{filter:brightness(1.08);}" +
        ".ocr-toggle-sub{display:inline-block;font-size:12px;font-weight:normal;background:rgba(0,0,0,.35);color:#fff;border-radius:10px;padding:1px 8px;margin-left:6px;vertical-align:middle;}" +
        "@keyframes ocrPulse{0%{box-shadow:0 0 0 0 rgba(120,230,150,.55);}70%{box-shadow:0 0 0 12px rgba(120,230,150,0);}100%{box-shadow:0 0 0 0 rgba(120,230,150,0);}}" +
        "#ocrBody{background:rgba(0,0,0,0.55);border-radius:8px;padding:10px;margin-top:8px;}" +
        "#ocrFiles{display:block;margin:8px 0;color:#fff;font-size:13px;}" +
        "#ocrAnalyze{font-size:16px;padding:12px 44px;margin:12px auto;display:block;}" +
        ".ocr-help{font-size:12px;margin:6px 0;padding:7px 10px;background:rgba(0,0,0,0.6);color:#ffeebb;border-radius:6px;line-height:1.4;}" +
        ".ocr-shot{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;margin:10px 0;padding:8px;background:rgba(0,0,0,0.6);border-radius:8px;}" +
        ".ocr-prev{max-width:300px;border:1px solid rgba(255,255,255,.35);border-radius:4px;}" +
        ".ocr-detinfo{display:inline-block;font-size:12px;margin-top:6px;padding:4px 10px;background:rgba(0,0,0,0.75);color:#bfe9c8;border-radius:6px;}" +
        // 縦1列。左=アイコン＋下に名前 / 右=ボタン（視線は縦スクロールのみ）
        ".ocr-cands{display:flex;flex-direction:column;gap:6px;margin-top:8px;padding:8px;background:rgba(0,0,0,0.62);border-radius:8px;}" +
        ".ocr-cand{display:flex;align-items:flex-start;flex-wrap:wrap;gap:10px;padding:6px 8px;border-radius:6px;background:rgba(255,255,255,.10);color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.4);}" +
        ".ocr-cand.ocr-warn{background:rgba(255,90,90,.30);}" +
        ".ocr-cand.ocr-ex{opacity:.4;}" +
        ".ocr-cand.ocr-owned{background:rgba(255,255,255,.04);opacity:.7;}" +
        ".ocr-divider{flex:1 1 100%;text-align:center;font-size:11px;color:#9ab;margin:6px 0 2px;border-top:1px dashed rgba(255,255,255,.25);padding-top:6px;}" +
        ".ocr-left{display:flex;flex-direction:column;align-items:center;flex:0 0 auto;}" +
        ".ocr-pair{display:flex;align-items:center;gap:4px;}" +
        ".ocr-pair img{width:48px;height:48px;border-radius:4px;}" +
        ".ocr-arrow{font-size:14px;opacity:.7;}" +
        ".ocr-name-label{margin-top:3px;max-width:108px;text-align:center;background-color:rgba(100,100,80,0.8);color:#fff;padding:2px 6px;border-radius:6px;font-size:12px;line-height:1.25;word-break:break-all;}" +
        ".ocr-actions{display:flex;flex-direction:column;gap:8px;flex:0 0 auto;align-self:center;}" +
        ".ocr-cand .icon_btn_red,.ocr-cand .icon_btn_on{font-size:12px;padding:6px 30px;cursor:pointer;white-space:nowrap;}" +
        ".ocr-alts{flex:1 1 100%;margin-top:4px;}" +
        "@media(min-width:768px){.ocr-cand{align-items:center;}.ocr-alts{flex:1 1 auto;}}" +
        ".ocr-alt-hint{font-size:11px;color:#cde;margin:2px 0;}" +
        ".ocr-alt-head{display:flex;align-items:center;gap:8px;flex-wrap:nowrap;margin-bottom:4px;}" +
        ".ocr-alt-title{font-size:12px;min-width:96px;text-align:center;flex:0 0 auto;}" +
        ".ocr-search-wrap{display:flex;align-items:center;gap:4px;font-size:12px;color:#cde;white-space:nowrap;flex:1 1 auto;min-width:0;}" +
        // 候補はgridでアイコンサイズ据え置きのまま列数を最大化（SP390で5列）
        ".ocr-alt-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:4px;}" +
        ".ocr-search-input{flex:1 1 auto;min-width:60px;width:100%;padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.4);color:#fff;font-size:16px;}" + /* iOSの自動ズーム抑止のため16px以上 */
        ".ocr-alt{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:9px;padding:3px 0;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:4px;width:auto;}" +
        ".ocr-alt img{width:40px;height:40px;}" +
        ".ocr-toast{margin:8px 0;padding:8px 12px;background:rgba(40,140,70,0.92);color:#fff;border-radius:6px;font-size:13px;font-weight:bold;}" +
        ".ocr-progress{height:10px;background:rgba(0,0,0,0.5);border-radius:5px;overflow:hidden;margin-top:4px;}" +
        ".ocr-progress-bar{height:100%;background:linear-gradient(90deg,#3aa564,#7be0a0);transition:width .2s;}";
    var st = document.createElement("style");
    st.id = "ocr-injected-styles";
    st.textContent = css;
    document.head.appendChild(st);
}

function initOcrUI(containerSel, onConfirm, isOwnedFn) {
    injectOcrStyles();
    loadLearnedSigs();           // 全体共有の学習辞書を読込
    OCR_ON_CONFIRM = onConfirm;
    OCR_IS_OWNED = (typeof isOwnedFn === "function") ? isOwnedFn : null;  // 所持判定（任意）
    OCR_SHOTS = [];
    OCR_CANDIDATES = [];
    var html =
        '<div class="ocr-panel">' +
        '  <button type="button" class="icon_btn_positive ocr-toggle-big" id="ocrToggle">📷 スクショで所持登録</button>' +
        '  <div id="ocrBody" style="display:none;margin-top:10px;">' +
        '    <p class="ocr-help">ゲームの「スタイル一覧」画面のスクショを選んでね（複数可）。アイコンを自動で読み取ります。</p>' +
        '    <input type="file" id="ocrFiles" accept="image/*" multiple>' +
        '    <div id="ocrShots"></div>' +
        '    <button type="button" class="icon_btn_positive" id="ocrAnalyze" style="display:none;">🔍 読み取る</button>' +
        '    <div id="ocrToast" class="ocr-toast" style="display:none;"></div>' +
        '    <div id="ocrResult"></div>' +
        '  </div>' +
        '</div>';
    $(containerSel).html(html);

    $("#ocrToggle").on("click", function () { $("#ocrBody").toggle(); });
    $("#ocrFiles").on("change", onOcrFiles);
    $("#ocrAnalyze").on("click", runOcrAnalyze);
}

function onOcrFiles(e) {
    var files = e.target.files;
    $("#ocrShots").empty(); OCR_SHOTS = []; $("#ocrResult").empty();
    var pending = files.length;
    if (!pending) return;
    Array.prototype.forEach.call(files, function (file) {
        var url = URL.createObjectURL(file);
        loadImage(url).then(function (img) {
            var shot = { img: img };
            shot.$row = $('<div class="ocr-shot"><canvas class="ocr-prev"></canvas><div class="ocr-detinfo"></div></div>');
            OCR_SHOTS.push(shot);
            $("#ocrShots").append(shot.$row);
            drawDetectPreview(shot);
            if (--pending === 0) $("#ocrAnalyze").show();
        }).catch(function () { if (--pending === 0 && OCR_SHOTS.length) $("#ocrAnalyze").show(); });
    });
}

// 自動検出したセル枠をプレビュー表示（読取前の確認用）
function drawDetectPreview(shot) {
    var grid = detectGridCells(shot.img);
    shot.grid = grid;
    var cv = shot.$row.find(".ocr-prev")[0];
    var img = shot.img;
    var maxW = 300, scale = Math.min(1, maxW / img.width);
    cv.width = img.width * scale; cv.height = img.height * scale;
    var g = cv.getContext("2d");
    g.drawImage(img, 0, 0, cv.width, cv.height);
    if (grid) {
        g.strokeStyle = "rgba(80,200,120,.95)"; g.lineWidth = 1.5;
        grid.cells.forEach(function (b) { g.strokeRect(b.x * scale, b.y * scale, b.w * scale, b.h * scale); });
        shot.$row.find(".ocr-detinfo").text("検出: " + grid.cols + "列 × " + grid.rows + "行 = " + grid.cells.length + "個");
    } else {
        shot.$row.find(".ocr-detinfo").html('<span style="color:#f88">アイコンを検出できませんでした。別のスクショを試してね。</span>');
    }
}

function runOcrAnalyze() {
    if (!STYLE_ICON_HASH) { alert("辞書が読み込まれていません"); return; }
    $("#ocrToast").hide();
    var byBest = {};                 // sid -> {sid,dist,crop,hash}
    var total = OCR_SHOTS.length, idx = 0;
    $("#ocrAnalyze").prop("disabled", true);

    function progress(done) {
        var pct = total ? Math.round(done / total * 100) : 0;
        $("#ocrResult").html(
            '<p class="ocr-help">読み取り中… ' + done + ' / ' + total + ' 枚目（重いので少し待ってね）</p>' +
            '<div class="ocr-progress"><div class="ocr-progress-bar" style="width:' + pct + '%"></div></div>');
    }

    function step() {
        if (idx >= total) {
            var arr = Object.keys(byBest).map(function (s) { var o = byBest[s]; o.excluded = false; o.owned = OCR_IS_OWNED ? !!OCR_IS_OWNED(s) : false; return o; })
                .sort(function (a, b) { return a.dist - b.dist; });
            // 未所持を先頭・所持済みを末尾に（各グループ内はdist順を維持）
            OCR_CANDIDATES = arr.filter(function (o) { return !o.owned; }).concat(arr.filter(function (o) { return o.owned; }));
            $("#ocrAnalyze").prop("disabled", false);
            renderConfirmUI();
            return;
        }
        progress(idx + 1);
        // 進捗テキストを描画させてから重い1枚分を処理（UIが固まって見えないように）
        setTimeout(function () {
            try {
                var r = analyzeScreenshotAuto(OCR_SHOTS[idx].img);
                r.cells.forEach(function (cell) {
                    if (!cell.sid) return;
                    if (!byBest[cell.sid] || cell.dist < byBest[cell.sid].dist) {
                        byBest[cell.sid] = { sid: cell.sid, dist: cell.dist, crop: cell.crop, hash: cell.hash };
                    }
                });
            } catch (e) { /* この画像は検出失敗 → スキップ */ }
            idx++;
            step();
        }, 30);
    }
    step();
}

// 登録後に取込/候補をクリア（次の登録でスクロールしないように）
function clearOcrInputs() {
    OCR_SHOTS = [];
    OCR_CANDIDATES = [];
    $("#ocrShots").empty();
    $("#ocrResult").empty();
    var f = document.getElementById("ocrFiles"); if (f) f.value = "";
    $("#ocrAnalyze").hide();
}

function renderConfirmUI() {
    var $r = $("#ocrResult").empty();
    if (!OCR_CANDIDATES.length) { $r.html('<p class="ocr-help">候補が見つかりませんでした。グリッドを調整して再解析してね。</p>'); return; }
    var ok = OCR_CANDIDATES.filter(function (x) { return x.dist <= OCR_DIST_OK; }).length;
    var ownedCount = OCR_CANDIDATES.filter(function (x) { return x.owned; }).length;
    var newCount = OCR_CANDIDATES.length - ownedCount;
    $r.append('<p class="ocr-help">検出 ' + OCR_CANDIDATES.length + ' 件（未所持 ' + newCount + ' 件 / 登録済み ' + ownedCount +
        ' 件）。<span style="color:#f88">赤=要確認</span>。違うものは「除外」か「差替」してね。</p>');
    var $grid = $('<div class="ocr-cands"></div>');
    var dividerShown = false;
    OCR_CANDIDATES.forEach(function (cand, i) {
        // 未所持→登録済み の切れ目に区切りを入れる
        if (cand.owned && !dividerShown) {
            dividerShown = true;
            $grid.append('<div class="ocr-divider">― ここから登録済み（' + ownedCount + '件）―</div>');
        }
        var warn = cand.dist > OCR_DIST_OK;
        // 縦1列・大アイコン。視線は縦スクロールのみ
        var $c = $('<div class="ocr-cand' + (warn ? " ocr-warn" : "") + (cand.excluded ? " ocr-ex" : "") + (cand.owned ? " ocr-owned" : "") + '" data-i="' + i + '"></div>');
        // 左: アイコン(切出→正解) ＋ その下に名前 / 右: ボタン
        $c.append('<div class="ocr-left">' +
            '<div class="ocr-pair"><img class="ocr-crop" src="' + cand.crop + '">' +
            '<span class="ocr-arrow">→</span><img class="ocr-ref" src="' + iconUrl(cand.sid) + '"></div>' +
            '<span class="ocr-name-label">' + escHtml(styleName(cand.sid)) + '</span>' +
            '</div>');
        $c.append('<div class="ocr-actions">' +
            '<button type="button" class="icon_btn_red ocr-exbtn">' + (cand.excluded ? "戻す" : "除外") + '</button>' +
            '<button type="button" class="icon_btn_on ocr-replace">差替</button>' +
            '</div>');
        $c.append('<div class="ocr-alts" style="display:none;"></div>');
        $grid.append($c);
    });
    $r.append($grid);
    $r.append('<div style="margin-top:12px;text-align:center;"><button type="button" class="icon_btn_positive" id="ocrSave">この内容で登録</button></div>');

    $grid.on("click", ".ocr-exbtn", function () {
        var $cand = $(this).closest(".ocr-cand"); var i = $cand.data("i");
        OCR_CANDIDATES[i].excluded = !OCR_CANDIDATES[i].excluded;
        $cand.toggleClass("ocr-ex", OCR_CANDIDATES[i].excluded);
        $(this).text(OCR_CANDIDATES[i].excluded ? "戻す" : "除外");
    });
    $grid.on("click", ".ocr-replace", function () {
        var $cand = $(this).closest(".ocr-cand"); var i = $cand.data("i");
        var $alts = $cand.find(".ocr-alts");
        if ($alts.is(":visible")) { $alts.hide(); return; }
        // 近い候補(色)＋「名前検索で全スタイルから選ぶ」（候補に無い時の救済）
        // 近い候補の数: PC(>=1024)=12 / iPad縦など(768-1023)=10 / SP(<768)=5
        var w = window.innerWidth;
        var topN = (w >= 1024) ? 12 : (w >= 768 ? 10 : 5);
        var tops = matchIconTopN(OCR_CANDIDATES[i].hash, topN);
        $alts.empty();
        $alts.append('<div class="ocr-alt-head">' +
            '<span class="bg-item ocr-alt-title">近い候補</span>' +
            '<span class="ocr-search-wrap">名前で検索：<input type="text" class="ocr-search-input" placeholder="例：デューン"></span>' +
            '</div>');
        var $sug = $('<div class="ocr-alt-row ocr-suggest"></div>');
        tops.forEach(function (t) { $sug.append(altButtonHtml(t.sid)); });
        $alts.append($sug);
        $alts.append('<div class="ocr-alt-row ocr-search-results"></div>');
        $alts.show();
    });
    // 名前検索（候補に無い正解を全スタイルから探す）
    $grid.on("input", ".ocr-search-input", function () {
        var q = $(this).val().trim();
        var $res = $(this).closest(".ocr-alts").find(".ocr-search-results").empty();
        if (q.length < 1 || typeof STYLE_MASTER === "undefined") return;
        var hit = 0;
        for (var sid in STYLE_MASTER) {
            var info = STYLE_MASTER[sid];
            var hay = (info.Name || "") + (info.AnotherName || "");
            if (hay.indexOf(q) > -1) { $res.append(altButtonHtml(sid)); if (++hit >= 24) break; }
        }
        if (!hit) $res.append('<div class="ocr-alt-hint">該当なし</div>');
    });
    $grid.on("click", ".ocr-alt", function () {
        var $cand = $(this).closest(".ocr-cand"); var i = $cand.data("i");
        OCR_CANDIDATES[i].sid = $(this).data("sid");
        OCR_CANDIDATES[i].corrected = true;   // 差し替え＝学習用の正解ラベル
        renderConfirmUI();
    });
    $("#ocrSave").on("click", function () {
        var sids = OCR_CANDIDATES.filter(function (x) { return !x.excluded; }).map(function (x) { return x.sid; });
        // 重複排除
        var uniq = []; var seen = {};
        sids.forEach(function (s) { if (!seen[s]) { seen[s] = 1; uniq.push(s); } });
        // 差し替え訂正したものを全体学習辞書へ寄与（登録された＝確定ラベル）
        OCR_CANDIDATES.forEach(function (c) { if (c.corrected && !c.excluded && c.hash) contributeLearned(c.sid, c.hash); });
        if (OCR_ON_CONFIRM) OCR_ON_CONFIRM(uniq);
        // 取込・候補をクリアして次の登録に備える（成功メッセージは #ocrToast に残す）
        clearOcrInputs();
    });
}

// 成功メッセージ表示（ページの onConfirm から呼ぶ。クリア後も残る）
function showOcrToast(msg) {
    $("#ocrToast").text(msg).show();
}

function escHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
}
