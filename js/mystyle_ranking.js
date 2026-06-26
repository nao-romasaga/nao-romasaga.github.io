/**
 * マイ最適ランキング
 * 所持スタイルで火力ランキングを絞り込んで表示する。
 * - dev-mock: URL に ?mock=1 を付けると STYLE_MASTER 先頭30件を所持とみなす（ログイン不要・検証用）
 * - 本番: Firebase ログイン後の STYLECHECK を読み込む
 */

var MY_STYLE = [];           // 所持スタイルID（sid）配列
var LAST_RANKING = null;     // 直近APIレスポンス（再描画用）

/* ---------- 所持データ取得 ---------- */

function isMockMode() {
    return location.search.indexOf("mock=1") > -1;
}

// 検証用: ランキング上位から間引いてN件を所持とみなす（絞り込みが見えるように）
function setMockMyStyleFromRanking(data, n) {
    n = n || 30;
    var rows = dedupBySid(data);
    var step = Math.max(1, Math.floor(rows.length / n));
    MY_STYLE = rows.filter(function (_, i) { return i % step === 0; }).slice(0, n)
        .map(function (r) { return r.sid; });
    return MY_STYLE;
}

function loadMyStyle(cb) {
    if (isMockMode()) {
        // mock は fetchRanking 後にランキングからサンプリングするためここでは空
        MY_STYLE = [];
        return cb(MY_STYLE);
    }
    // 本番: Firebase の STYLECHECK を読む（UID は Firebase.js が認証後に設定）
    if (typeof UID === "undefined" || !UID) {
        MY_STYLE = [];
        return cb(MY_STYLE);
    }
    readStyleCheckData(UID, function (result) {
        if (!result) { MY_STYLE = []; return cb(MY_STYLE); }
        MY_STYLE = (result.SS || []).concat(result.S || []).concat(result.A || []);
        cb(MY_STYLE);
    }, false);
}

/* ---------- ランキングAPI ---------- */

// JSONP（サーバは固定で callback(...) を返す）
function fetchRanking(opt, cb) {
    opt = opt || {};
    var limit = opt.limit || 300;
    var turn = "&turn=" + (opt.turn || 2);
    var url = "https://romasagatool.com/api/auto_ranking2.php?limit=" + limit + "&dev=dev&table=" + turn;
    $.ajax({
        url: url,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callback",
        cache: true,
        success: function (data) { cb(data); },
        error: function (e) { console.error("ranking api error", e); $("#rankingList").html('<p class="mys-empty">ランキングの取得に失敗しました。</p>'); }
    });
}

/* ---------- 描画 ---------- */

// 同一 sid は最高ダメージのみ残す（スタイル×武器の重複を排除）
function dedupBySid(records) {
    var best = {};
    for (var k in records) {
        var rec = records[k];
        var dmg = Number(rec.damage) || 0;
        if (!best[rec.sid] || dmg > Number(best[rec.sid].damage)) {
            best[rec.sid] = rec;
        }
    }
    return Object.keys(best).map(function (sid) { return best[sid]; })
        .sort(function (a, b) { return Number(b.damage) - Number(a.damage); });
}

function renderRanking(data) {
    LAST_RANKING = data;
    var $list = $("#rankingList").empty();
    if (!data) { $list.html('<p class="mys-empty">データがありません。</p>'); return; }

    // 所持が空（未ログイン/未登録）はプレビュー：全体ランキングを上位だけ表示
    var previewMode = (MY_STYLE.length === 0);
    if (previewMode) {
        $list.append('<div class="mys-guide">所持登録すると、ここが<b>あなたの所持スタイルだけ</b>の' +
            'ランキングに切り替わるよ。下は全体ランキングのプレビュー（上位50件）。</div>');
    }

    var mySet = {};
    MY_STYLE.forEach(function (sid) { mySet[sid] = true; });

    var rows = dedupBySid(data);
    var rank = 0;
    rows.forEach(function (rec) {
        if (previewMode) { if (rank >= 50) return; }       // プレビューは上位50件
        else if (!mySet[rec.sid]) return;                  // 所持で絞る
        var info = (typeof STYLE_MASTER !== "undefined") ? STYLE_MASTER[rec.sid] : null;
        if (!info) return;
        rank++;
        var rare = info.Rarity || rec.rare || "SS";
        var icon = getStyleIcon(rare, rec.sid, info.WeaponType || "", true);
        var dmg = Number(rec.damage) || 0;
        var $row = $('<div class="rank-row"></div>');
        $row.append('<span class="rank-no">' + rank + '</span>');
        $row.append(icon);
        $row.append('<span class="rank-name">' + esc(info.Name || "") +
            '<small>' + esc(info.AnotherName || "") + '</small></span>');
        $row.append('<span class="rank-dmg">' + dmg.toLocaleString() + '</span>');
        $list.append($row);
    });

    if (rank === 0) {
        $list.html('<p class="mys-empty">所持スタイルがランキングに見つかりませんでした。<br>所持登録をするとここに表示されます。</p>');
    }
}

function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
}

/* ---------- コンテンツ選択UI ---------- */

function renderSelector() {
    var html = '<label for="selTurn">ターン</label>' +
        '<select id="selTurn" class="form-control" style="width:auto;display:inline-block;">' +
        '<option value="2">2ターン</option>' +
        '<option value="10">10ターン</option>' +
        '</select>';
    $("#contentSelector").html(html);
    $("#contentSelector").off("change").on("change", "select", reload);
}

function reload() {
    fetchRanking({ limit: 300, turn: $("#selTurn").val() }, function (data) {
        if (isMockMode()) { setMockMyStyleFromRanking(data, 30); }
        renderRanking(data);
    });
}

/* ---------- 所持保存 ---------- */

// 確定 sid 配列 → レアリティ別に振り分けて Firebase STYLECHECK へ保存
function saveOwnership(sids) {
    var out = { SS: [], S: [], A: [] };
    sids.forEach(function (sid) {
        var info = (typeof STYLE_MASTER !== "undefined") ? STYLE_MASTER[sid] : null;
        if (!info) return;
        var r = info.Rarity;
        if (out[r]) out[r].push(sid);
    });
    if (typeof updateData === "function") {
        updateData("STYLECHECK", out, true);
    }
    return out;
}

// OCR確定時のコールバック
function onOcrConfirm(sids) {
    MY_STYLE = sids.slice();
    if (isMockMode()) {
        console.log("[mock] 登録される所持(保存はスキップ):", sids.length, "件");
    } else {
        saveOwnership(sids);
    }
    if (typeof showOcrToast === "function") showOcrToast("✅ 登録しました（" + sids.length + "件）。ランキングを更新しました。");
    renderRanking(LAST_RANKING);
    $("html,body").animate({ scrollTop: $("#rankingList").offset().top - 20 }, 300);
}

/* ---------- 起動 ---------- */

function startMystyle() {
    renderSelector();
    if (typeof initOcrUI === "function") {
        initOcrUI("#ocrArea", onOcrConfirm, function (sid) { return MY_STYLE.indexOf(sid) > -1; });
    }
    loadMyStyle(function () {
        reload();
    });
}

// STYLE_MASTER は dataload(document.write+defer) のため準備待ちしてから cb
function whenDataReady(cb) {
    var tries = 0;
    var t = setInterval(function () {
        if (typeof STYLE_MASTER !== "undefined") { clearInterval(t); cb(); }
        else if (++tries > 100) { clearInterval(t); console.error("STYLE_MASTER load timeout"); }
    }, 50);
}

// 本番: Firebase.js が認証確定後に呼ぶフック（ページ側で上書き）
// 未ログイン
function _noLoginInitial() {
    if (isMockMode()) return;   // mock は Firebase を介さないため上書き防止
    if (typeof getFirebaseUIConfig === "function" && typeof firebaseui !== "undefined") {
        var uiConfig = getFirebaseUIConfig('https://nao-romasaga.github.io/mystyle_ranking.html');
        var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth(appUsers));
        ui.start('#firebaseui-auth-container', uiConfig);
    }
    whenDataReady(function () {
        MY_STYLE = [];          // プレビュー（全体ランキング）
        startMystyle();
    });
}

// ログイン済
function _initial() {
    if (isMockMode()) return;   // mock は Firebase を介さないため上書き防止
    if (typeof loginCard === "function") { loginCard("#firebaseui-auth-container"); }
    whenDataReady(function () {
        startMystyle();         // loadMyStyle が UID から STYLECHECK を読む
    });
}

$(function () {
    // mock モードは Firebase を介さず即起動
    if (isMockMode()) {
        whenDataReady(startMystyle);
    }
});
