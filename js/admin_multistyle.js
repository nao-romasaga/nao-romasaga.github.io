/**
 * admin_multistyle.js
 * 管理人専用 マルチアカウント スタイル所持管理ツール
 * - localStorage キー: "ADMIN_MULTISTYLE_V1"
 * - 8アカウント固定
 * - utils2.js を読み込まず、必要関数を内包
 */

// ===== getStyleIcon (utils2.js から抜粋) =====
function getStyleIcon(rare, id, weapon, isPlaneIcon, isLazyLoad) {
    isPlaneIcon = isPlaneIcon || false;
    isLazyLoad  = isLazyLoad  !== false; // default true
    var plane = isPlaneIcon ? "d-none" : "";
    var illust = $('<button data-id="' + id + '" data-rare="' + rare + '" data-type="' + weapon + '" class="style ' + id + ' style_icon_bg_base"><span class="CHECK_COVER icon_nocheck ' + plane + '"></span></button>');
    if (isLazyLoad) {
        illust.attr('data-bg', 'https://romasagatool.com/img/style_icon_bg/' + id + '.png');
        illust.attr('style', 'background-size:contain; background-color: rgba(0,0,0,0);');
        illust.addClass('lazyload');
    } else {
        illust.attr('style', 'background: url(https://romasagatool.com/img/style_icon_bg/' + id + '.png) no-repeat; background-size:contain;');
    }
    return illust;
}

// ===== ストレージ管理 =====
var STORAGE_KEY = "ADMIN_MULTISTYLE_V1";
var NUM_ACCOUNTS = 8;

var DEFAULT_ACCOUNT_NAMES = ["メイン", "BlackShark1", "BlackShark2", "LY", "Stanby", "iPad", "白", "黒"];

function defaultData() {
    var accounts = [];
    for (var i = 0; i < NUM_ACCOUNTS; i++) {
        accounts.push({ name: DEFAULT_ACCOUNT_NAMES[i], styles: {} });
    }
    return { accounts: accounts, activeIndex: 0, updatedAt: "" };
}

// データを必ず正規化（name/styles を補完）。
// 重要: Firebaseは空オブジェクト styles:{} を保存しないため、所持0の垢は読み戻すと
// styles が欠落する。配列がオブジェクト化して返るケースもあるので両方を吸収する。
function normalizeData(d) {
    if (!d || typeof d !== "object") return defaultData();
    var accs = d.accounts;
    if (!Array.isArray(accs)) {
        if (accs && typeof accs === "object") { var a = []; for (var k in accs) a[+k] = accs[k]; accs = a; }
        else accs = [];
    }
    var out = [];
    for (var i = 0; i < NUM_ACCOUNTS; i++) {
        var s = accs[i] || {};
        out.push({
            name: (typeof s.name === "string" && s.name) ? s.name : DEFAULT_ACCOUNT_NAMES[i],
            styles: (s.styles && typeof s.styles === "object") ? s.styles : {}
        });
    }
    return { accounts: out, activeIndex: d.activeIndex || 0, ts: d.ts || 0, updatedAt: d.updatedAt || "" };
}

function loadData() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultData();
        return normalizeData(JSON.parse(raw));
    } catch (e) {
        return defaultData();
    }
}

function saveData() {
    APP.data.activeIndex = APP.activeIndex;
    APP.data.ts = Date.now();
    APP.data.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(APP.data));
    scheduleFbPush();
}

/* ===== Firebase 同期（PC↔実機）=====
 * ログイン中のみ user_data/{UID}/ADMIN_MULTISTYLE に全体blobを保存/読込。
 * 端末間は blob 丸ごと last-write-wins（ts で新しい方を採用）。localStorageはオフラインキャッシュ。
 */
var FB_KEY = "ADMIN_MULTISTYLE";
var fbPushTimer = null;

function isLoggedIn() { return (typeof UID !== "undefined" && !!UID); }

// 認証コールバックが ready より先に発火しても安全に（冪等）
function ensureInit() {
    if (!APP.data) { APP.data = loadData(); APP.activeIndex = APP.data.activeIndex || 0; }
    if (!APP.styleList || !APP.styleList.length) buildStyleList();
}

function setSyncStatus(msg) { $("#admin-sync-status").text(msg); }

// 連続保存をまとめてアップロード（アイコン連打対策のデバウンス）
function scheduleFbPush() {
    if (!isLoggedIn()) return;
    if (fbPushTimer) clearTimeout(fbPushTimer);
    fbPushTimer = setTimeout(function () {
        if (typeof updateData === "function" && isLoggedIn()) {
            updateData(FB_KEY, APP.data);
            setSyncStatus("☁️ 同期済 (" + (APP.data.updatedAt || "") + ")");
        }
    }, 1200);
}

// ログイン確定時：クラウドとローカルを ts で突き合わせて新しい方を採用
function _initial() {
    ensureInit();
    if (typeof loginCard === "function") loginCard("#firebaseui-auth-container");
    setSyncStatus("☁️ 同期中…");
    if (typeof readUserData !== "function") return;
    readUserData(FB_KEY, function (remote) {
        var localTs = (APP.data && APP.data.ts) || 0;
        // Firebaseは空stylesや配列を省略/オブジェクト化することがあるので正規化してから判定
        var validRemote = remote && typeof remote === "object" && (Array.isArray(remote.accounts) || typeof remote.accounts === "object");
        if (validRemote && (remote.ts || 0) > localTs) {
            // クラウドが新しい → 採用（正規化で name/styles を必ず補完）
            APP.data = normalizeData(remote);
            APP.activeIndex = APP.data.activeIndex || 0;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(APP.data));
            renderAccountTabs();
            if (APP.mode === 1) renderMode1();
            setSyncStatus("☁️ クラウドから読込 (" + (remote.updatedAt || "") + ")");
        } else if (!validRemote || localTs > (remote.ts || 0)) {
            // クラウド無し or ローカルが新しい → アップロード
            scheduleFbPush();
            setSyncStatus("☁️ ローカルをアップロード");
        } else {
            setSyncStatus("☁️ 同期済");
        }
    });
}

// 未ログイン時：ログインUIを起動（ログインすると同期できる）
function _noLoginInitial() {
    ensureInit();
    if (typeof getFirebaseUIConfig === "function" && typeof firebaseui !== "undefined") {
        var uiConfig = getFirebaseUIConfig('https://nao-romasaga.github.io/admin_multistyle.html');
        var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth(appUsers));
        ui.start('#firebaseui-auth-container', uiConfig);
    }
    setSyncStatus("ℹ️ ログインするとPC↔実機でデータ同期できます（未ログインは端末内のみ保存）");
}

// ===== アプリ状態 =====
var APP = {
    data: null,
    activeIndex: 0,
    mode: 1,
    mode1view: "year",   // "year"=年代別 / "gacha"=ガチャ別
    // フィルタ状態
    filter: {
        rarity: "ALL",
        weapon: "ALL",
        year: "ALL",
        text: "",
        unownedOnly: false,
        unfixedOnly: false
    },
    // スタイルID→{名, 二つ名, レア, 武器種, year, gacha}
    styleList: [],   // [{id, name, another, rare, weapon, year, gacha}, ...]
    // モード3
    limitData: null, // CSVパース結果: {id→rowObj}
    mode3OnlyOwned: true,
};

// ===== 初期化 =====
$(document).ready(function() {
    APP.data = loadData();
    APP.activeIndex = APP.data.activeIndex || 0;

    buildStyleList();
    renderAccountTabs();
    renderMode1();
    bindEvents();

    // スクショ所持登録（ocr_style.js のモジュールを再利用）
    if (typeof initOcrUI === "function") {
        initOcrUI("#admin-ocr-area", onAdminOcrConfirm, function (sid) {
            var st = APP.data.accounts[APP.activeIndex].styles;
            return !!(st && st[sid]);
        });
    }

    // モード3用CSV取得
    fetchLimitCSV();
});

// スクショ読取の確定 → 現在のアカウントの所持に追加（マージ）
function onAdminOcrConfirm(sids) {
    var acct = APP.data.accounts[APP.activeIndex];
    var styles = acct.styles;
    var added = 0, skipped = 0;
    sids.forEach(function (sid) {
        if (typeof STYLE_MASTER !== "undefined" && !STYLE_MASTER[sid]) { skipped++; return; }
        if (!styles[sid]) { styles[sid] = 1; added++; }
    });
    saveData();
    renderAccountTabs();
    if (APP.mode === 1) renderMode1();
    var msg = "✅ 「" + acct.name + "」に " + added + " 件追加しました（既所持はスキップ）";
    if (skipped) msg += " / 辞書外 " + skipped + " 件";
    if (typeof showOcrToast === "function") showOcrToast(msg);
}

function buildStyleList() {
    APP.styleList = [];
    if (typeof STYLE_MASTER === "undefined") {
        console.warn("STYLE_MASTER が未定義です。dataloadの完了を待ってください。");
        return;
    }
    // CHAR_MASTER から名前とyearを取得
    var charNameMap = {}; // charId→Name
    if (typeof CHAR_MASTER !== "undefined") {
        for (var cid in CHAR_MASTER) {
            charNameMap[cid] = CHAR_MASTER[cid].Name;
        }
    }
    for (var sid in STYLE_MASTER) {
        var s = STYLE_MASTER[sid];
        APP.styleList.push({
            id: sid,
            name: s.Name || "",
            another: s.AnotherName || "",
            rare: s.Rarity || "",
            weapon: s.WeaponType || "",
            year: s.year || "",
            gacha: s.gacha || "",
            gachaBunrui: s.gachaBunrui || "",
        });
    }
    // year降順→同年内はgacha降順でソート
    APP.styleList.sort(function(a, b) {
        var ya = String(a.year), yb = String(b.year);
        if (ya !== yb) {
            // 数字年代は大きい方を先、"恒常"は末尾
            var na = parseInt(ya), nb = parseInt(yb);
            if (isNaN(na) && isNaN(nb)) return 0;
            if (isNaN(na)) return 1;
            if (isNaN(nb)) return -1;
            return nb - na;
        }
        return b.gacha > a.gacha ? 1 : -1;
    });
}

// ===== アカウントタブ =====
function renderAccountTabs() {
    var $wrap = $("#account-tabs-wrapper");
    $wrap.empty();
    for (var i = 0; i < NUM_ACCOUNTS; i++) {
        var acct = APP.data.accounts[i];
        var count = Object.keys(acct.styles || {}).length;
        var $tab = $('<button class="acct-tab" data-idx="' + i + '"></button>');
        if (i === APP.activeIndex) $tab.addClass("active");
        $tab.append('<span class="acct-name-label">' + escHtml(acct.name) + '</span>');
        $tab.append('<span class="acct-count-label">(' + count + ')</span>');
        $wrap.append($tab);
    }
}

function escHtml(str) {
    return $("<div>").text(str).html();
}

// ===== イベントバインド =====
function bindEvents() {
    // アイコンクリック（wrapperのdata-idで所持トグル）— 委譲で一度だけ設定
    $(document).on("click", ".style-wrapper", function () {
        var id = $(this).attr("data-id");
        var styles = APP.data.accounts[APP.activeIndex].styles;
        if (styles[id]) delete styles[id]; else styles[id] = 1;
        saveData();
        updateIconState(id);
        renderAccountTabs();
    });

    // Mode1 表示切替（年代別 / ガチャ別）
    $(document).on("click", ".m1-view-btn", function () {
        var view = $(this).attr("data-view");
        if (view === APP.mode1view) return;
        APP.mode1view = view;
        $(".m1-view-btn").removeClass("active");
        $(this).addClass("active");
        renderMode1();           // キャッシュ済みビューへ即スワップ
    });

    // アカウントタブクリック
    $(document).on("click", ".acct-tab", function() {
        var idx = parseInt($(this).attr("data-idx"));
        APP.activeIndex = idx;
        APP.data.activeIndex = idx;
        saveData();
        renderAccountTabs();
        renderMode1();
    });

    // アカウント名ダブルクリック → インライン編集
    $(document).on("dblclick", ".acct-tab", function(e) {
        var idx = parseInt($(this).attr("data-idx"));
        var $tab = $(this);
        var currentName = APP.data.accounts[idx].name;
        var $input = $('<input class="acct-name-edit" type="text" value="' + escHtml(currentName) + '">');
        $tab.find(".acct-name-label").replaceWith($input);
        $input.focus().select();
        $input.on("blur keydown", function(ev) {
            if (ev.type === "keydown" && ev.key !== "Enter") return;
            var newName = $input.val().trim() || currentName;
            APP.data.accounts[idx].name = newName;
            saveData();
            renderAccountTabs();
        });
    });

    // モード切替
    $(document).on("click", ".mode-tab-btn", function() {
        var mode = parseInt($(this).attr("data-mode"));
        $(".mode-tab-btn").removeClass("active");
        $(this).addClass("active");
        $(".mode-panel").removeClass("active");
        $("#mode-panel-" + mode).addClass("active");
        APP.mode = mode;
        if (mode === 1) renderMode1();
        if (mode === 2) renderMode2();
        if (mode === 3) renderMode3();
    });

    // モード1: アイコンクリック（所持トグル）
    $(document).on("click", ".admin-style-icon", function(e) {
        e.stopPropagation();
        var id = $(this).attr("data-id");
        var styles = APP.data.accounts[APP.activeIndex].styles;
        if (styles[id]) {
            delete styles[id];
        } else {
            styles[id] = 1;
        }
        saveData();
        updateIconState(id);
        renderAccountTabs();
    });

    // モード1: フィルタチップ
    $(document).on("click", ".filter-chip", function() {
        var type = $(this).attr("data-filter-type");
        var val  = $(this).attr("data-filter-val");
        $(".filter-chip[data-filter-type='" + type + "']").removeClass("active");
        $(this).addClass("active");
        APP.filter[type] = val;
        applyMode1Filter();
    });

    // モード1: テキスト検索
    $(document).on("input", "#m1-text-search", function() {
        APP.filter.text = $(this).val();
        applyMode1Filter();
    });

    // モード1: 未所持のみ
    $(document).on("click", "#m1-unowned-toggle", function() {
        APP.filter.unownedOnly = !APP.filter.unownedOnly;
        $(this).toggleClass("active", APP.filter.unownedOnly);
        applyMode1Filter();
    });

    // モード1: 上限未確定のみ
    $(document).on("click", "#m1-unfixed-toggle", function() {
        if (!APP.filter.unfixedOnly && !APP.limitData) {
            alert("StyleLimitデータが読み込めていません");
            return;
        }
        APP.filter.unfixedOnly = !APP.filter.unfixedOnly;
        $(this).toggleClass("active", APP.filter.unfixedOnly);
        applyMode1Filter();
    });

    // モード2: テキスト検索
    $(document).on("input", "#mode2-search-box", function() {
        renderMode2Result($(this).val());
    });

    // モード3: 所持のみトグル
    $(document).on("click", "#mode3-owned-toggle", function() {
        APP.mode3OnlyOwned = !APP.mode3OnlyOwned;
        $(this).toggleClass("off", !APP.mode3OnlyOwned);
        $(this).text(APP.mode3OnlyOwned ? "所持アカウントありのみ表示 ON" : "所持アカウントありのみ表示 OFF");
        renderMode3();
    });

    // モード1: レアリティ一括チェック ON
    $(document).on("click", ".m1-bulk-on", function() {
        var rare = $(this).attr("data-rare");
        var styles = APP.data.accounts[APP.activeIndex].styles;
        var acctName = APP.data.accounts[APP.activeIndex].name;

        // フィルタにマッチ かつ 未所持 が対象
        var targets = [];
        $(".style-wrapper[data-rare='" + rare + "']").each(function() {
            var $w = $(this);
            if (!styleMatchesFilter($w)) return;
            var id = $w.attr("data-id");
            if (!styles[id]) targets.push(id);
        });

        if (targets.length === 0) {
            alert("【" + rare + " 全チェック】対象がありません。");
            return;
        }

        var msg = "【" + rare + " 全チェック】\n"
            + "対象: " + targets.length + "件\n"
            + "（" + filterSummaryText() + "）\n"
            + "アカウント「" + acctName + "」に反映します。\n\nよろしいですか？";
        if (!confirm(msg)) return;

        for (var i = 0; i < targets.length; i++) {
            styles[targets[i]] = 1;
        }
        saveData();
        for (var j = 0; j < targets.length; j++) {
            updateIconState(targets[j]);
        }
        renderAccountTabs();
        applyMode1Filter();
    });

    // モード1: レアリティ一括チェック OFF
    $(document).on("click", ".m1-bulk-off", function() {
        var rare = $(this).attr("data-rare");
        var styles = APP.data.accounts[APP.activeIndex].styles;
        var acctName = APP.data.accounts[APP.activeIndex].name;

        // フィルタにマッチ かつ 所持済み が対象
        var targets = [];
        $(".style-wrapper[data-rare='" + rare + "']").each(function() {
            var $w = $(this);
            if (!styleMatchesFilter($w)) return;
            var id = $w.attr("data-id");
            if (styles[id]) targets.push(id);
        });

        if (targets.length === 0) {
            alert("【" + rare + " 全て外す】対象がありません。");
            return;
        }

        var msg = "【" + rare + " 全て外す】\n"
            + "対象: " + targets.length + "件\n"
            + "（" + filterSummaryText() + "）\n"
            + "アカウント「" + acctName + "」から所持解除します。\n\nよろしいですか？";
        if (!confirm(msg)) return;

        for (var i = 0; i < targets.length; i++) {
            delete styles[targets[i]];
        }
        saveData();
        for (var j = 0; j < targets.length; j++) {
            updateIconState(targets[j]);
        }
        renderAccountTabs();
        applyMode1Filter();
    });

    // エクスポート
    $(document).on("click", "#btn-export", function() {
        var json = JSON.stringify(APP.data, null, 2);
        var blob = new Blob([json], {type: "application/json"});
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "admin_multistyle_backup.json";
        a.click();
        URL.revokeObjectURL(url);
    });

    // インポートボタン
    $(document).on("click", "#btn-import", function() {
        $("#import-file-input").click();
    });

    // インポートファイル選択
    $(document).on("change", "#import-file-input", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            try {
                var d = JSON.parse(ev.target.result);
                // 構造検証
                if (!d || !Array.isArray(d.accounts) || d.accounts.length !== NUM_ACCOUNTS) {
                    alert("インポート失敗: データ構造が正しくありません（accounts配列が8要素必要です）");
                    return;
                }
                for (var i = 0; i < NUM_ACCOUNTS; i++) {
                    if (!d.accounts[i] || typeof d.accounts[i].name !== "string" || typeof d.accounts[i].styles !== "object") {
                        alert("インポート失敗: アカウント" + (i+1) + "のデータが正しくありません");
                        return;
                    }
                }
                APP.data = d;
                APP.activeIndex = d.activeIndex || 0;
                saveData();
                renderAccountTabs();
                renderMode1();
                alert("インポート完了しました");
            } catch(err) {
                alert("インポート失敗: JSONの解析に失敗しました\n" + err.message);
            }
        };
        reader.readAsText(file);
        // リセット（同じファイルを再選択できるように）
        $(this).val("");
    });
}

// ===== モード1: アイコン一覧生成 =====
// 各ビューの構築済みDOMをキャッシュ（切替のたびに2000+アイコンを作り直さない＝2回目以降は即時）
var MODE1_DOM = {};

function renderMode1() {
    buildMode1Icons();
    refreshIconStates();   // 表示中ビューの所持状態をまとめて更新（native DOMで高速）
    applyMode1Filter();
}

// 表示中の全wrapperの所持カバー＆8垢バッジを native DOM で一括更新（jQuery×2005より高速）
function refreshIconStates() {
    var accs = APP.data.accounts, active = APP.activeIndex;
    var wraps = document.querySelectorAll("#mode1-icon-area .style-wrapper");
    for (var w = 0; w < wraps.length; w++) {
        var el = wraps[w], id = el.getAttribute("data-id");
        var cover = el.querySelector(".CHECK_COVER");
        if (cover) cover.classList.toggle("icon_nocheck", !accs[active].styles[id]);
        var badges = el.querySelectorAll(".acct-badge");
        for (var i = 0; i < badges.length; i++) {
            var ai = +badges[i].getAttribute("data-acct");
            badges[i].classList.toggle("on", !!accs[ai].styles[id]);
        }
    }
}

// スタイル1件分の wrapper(アイコン＋所持バッジ)を生成（年代別/ガチャ別で共通）
function buildStyleWrapper(s2) {
    var $btn = getStyleIcon(s2.rare, s2.id, s2.weapon, false, true);
    $btn.addClass("admin-style-icon");
    $btn.attr("data-year", s2.year);
    $btn.attr("data-another", s2.another);
    $btn.attr("data-nametext", s2.name);
    // 名前をアイコン内に透明テキストとして埋め込み（テキスト検索用）
    $btn.append('<span style="position:absolute;top:0;left:0;font-size:8px;line-height:10px;color:transparent;">' + escHtml(s2.name) + ' ' + escHtml(s2.another) + '</span>');
    var $badges = $('<div class="acct-badges"></div>');
    for (var n = 0; n < NUM_ACCOUNTS; n++) {
        $badges.append('<span class="acct-badge" data-acct="' + n + '">' + (n + 1) + '</span>');
    }
    var $wrapper = $('<div class="style-wrapper" data-id="' + s2.id + '" data-year="' + s2.year + '" data-rare="' + s2.rare + '" data-weapon="' + s2.weapon + '" data-name="' + escHtml(s2.name) + ' ' + escHtml(s2.another) + '"></div>');
    $wrapper.append($btn);
    $wrapper.append($badges);
    return $wrapper;
}

// ガチャ初出グルーピング用ヘルパ
function debutSeg(g) { return String(g || "").split("/")[0]; }
function gachaHasDate(s) { return /^\d{4}\.\d{2}\.\d{2}/.test(s); }
function gachaDate(s) { return s.slice(0, 10); }
function gachaName(s) { return gachaHasDate(s) ? (s.slice(11) || s) : s; }
function isRevivalGacha(s) { return /復刻|Re;?vival/i.test(s); }

function buildMode1Icons() {
    var $area = $("#mode1-icon-area");
    var view = APP.mode1view;
    // 未構築ならビューを作ってキャッシュ
    if (!MODE1_DOM[view]) {
        var $root = $('<div class="m1-viewroot"></div>');
        if (view === "gacha") buildGachaView($root); else buildYearView($root);
        MODE1_DOM[view] = $root;
    }
    // 現在の表示をdetach(破棄せず退避)して目的ビューを差し込む＝再構築不要で軽い
    $area.children().detach();
    $area.toggleClass("gacha-view", view === "gacha");
    $area.append(MODE1_DOM[view]);
}

// 年セクションを作る共通処理（styles配列を icon-grid で並べる）
function buildYearSection(yr, styles) {
    var $section = $('<div class="year-section" data-year="' + yr + '"></div>');
    $section.append('<span class="subtitle-long year-section-title">' + yr + (yr === "恒常" ? "" : "年") + '</span>');
    return $section;
}

// 年代別（現行）
function buildYearView($root) {
    var years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "恒常"];
    var byYear = {};
    for (var i = 0; i < years.length; i++) byYear[years[i]] = [];
    for (var j = 0; j < APP.styleList.length; j++) {
        var s = APP.styleList[j]; var y = String(s.year);
        if (byYear[y]) byYear[y].push(s); else byYear["恒常"].push(s);
    }
    for (var k = 0; k < years.length; k++) {
        var yr = years[k]; var styles = byYear[yr];
        if (!styles || !styles.length) continue;
        var $section = buildYearSection(yr, styles);
        var $grid = $('<div class="icon-grid"></div>');
        for (var m = 0; m < styles.length; m++) $grid.append(buildStyleWrapper(styles[m]));
        $section.append($grid); $root.append($section);
    }
}

// ガチャ別：年セクションの中を「初出ガチャ」で小カード分割（復刻除外・日付なしは末尾）
function buildGachaView($root) {
    var years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "恒常"];
    var byYear = {};
    for (var i = 0; i < years.length; i++) byYear[years[i]] = {};
    for (var j = 0; j < APP.styleList.length; j++) {
        var s = APP.styleList[j];
        var seg = debutSeg(s.gacha);
        if (!seg || isRevivalGacha(seg)) continue;
        var y = String(s.year); if (!byYear[y]) y = "恒常";
        (byYear[y][seg] = byYear[y][seg] || []).push(s);
    }
    function segSort(a, b) {
        var da = gachaHasDate(a), db = gachaHasDate(b);
        if (da && db) return gachaDate(b) > gachaDate(a) ? 1 : -1;
        if (da) return -1; if (db) return 1; return a > b ? 1 : -1;
    }
    for (var k = 0; k < years.length; k++) {
        var yr = years[k]; var segs = byYear[yr];
        var segKeys = Object.keys(segs);
        if (!segKeys.length) continue;
        segKeys.sort(segSort);
        var $section = buildYearSection(yr, null);
        var $wrap = $('<div class="gacha-cards-wrap"></div>');
        for (var i2 = 0; i2 < segKeys.length; i2++) {
            var seg = segKeys[i2]; var styles = segs[seg];
            var $card = $('<div class="gacha-card"></div>');
            $card.append('<span class="gacha-card-title">' + (gachaHasDate(seg) ? gachaDate(seg) + ' ' + escHtml(gachaName(seg)) : escHtml(seg)) + '</span>');
            var $grid = $('<div class="icon-grid"></div>');
            for (var m = 0; m < styles.length; m++) $grid.append(buildStyleWrapper(styles[m]));
            $card.append($grid); $wrap.append($card);
        }
        $section.append($wrap); $root.append($section);
    }
}

function updateIconState(id) {
    var $wrappers = $(".style-wrapper[data-id='" + id + "']");
    $wrappers.each(function() {
        var $w = $(this);
        var $btn = $w.find(".admin-style-icon, .style");
        var owned = APP.data.accounts[APP.activeIndex].styles[id] ? true : false;
        if (owned) {
            $btn.find(".CHECK_COVER").removeClass("icon_nocheck");
        } else {
            $btn.find(".CHECK_COVER").addClass("icon_nocheck");
        }
        // バッジ更新
        for (var i = 0; i < NUM_ACCOUNTS; i++) {
            var isOn = APP.data.accounts[i].styles[id] ? true : false;
            $w.find(".acct-badge[data-acct='" + i + "']").toggleClass("on", isOn);
        }
    });
}

/**
 * 指定された .style-wrapper 要素が現在の APP.filter にマッチするか判定する。
 * applyMode1Filter / m1-bulk-on / m1-bulk-off の共通判定ロジック。
 * unownedOnly フィルタは「一括操作」では別途扱うため、このメソッドでは考慮しない。
 * unfixedOnly フィルタはここで判定する（一括操作にも反映）。
 */
function styleMatchesFilter($wrapper) {
    var rf = APP.filter.rarity;
    var wf = APP.filter.weapon;
    var yf = APP.filter.year;
    var tf = APP.filter.text.toLowerCase();

    var rare   = $wrapper.attr("data-rare");
    var weapon = $wrapper.attr("data-weapon");
    var year   = $wrapper.attr("data-year");
    var name   = ($wrapper.attr("data-name") || "").toLowerCase();

    if (rf !== "ALL" && rare !== rf) return false;
    if (wf !== "ALL" && weapon !== wf) return false;
    if (yf !== "ALL" && String(year) !== String(yf)) return false;
    if (tf && name.indexOf(tf) < 0) return false;

    // 上限未確定のみフィルタ
    if (APP.filter.unfixedOnly) {
        var id = $wrapper.attr("data-id");
        if (!APP.limitData) return false;
        var limitRow = APP.limitData[id];
        // limitData に存在しないIDは確定扱い → 非表示
        if (!limitRow) return false;
        // Fix.trim() === "f" は確定 → 非表示
        if (limitRow.Fix.trim() === "f") return false;
    }

    return true;
}

/** 現在のフィルタ条件を人が読める文字列にして返す */
function filterSummaryText() {
    var f = APP.filter;
    var parts = [];
    var yearLabel = (f.year === "ALL") ? "全年代 ⚠" : f.year;
    parts.push("年代: " + yearLabel);
    parts.push("レア: " + (f.rarity === "ALL" ? "全て" : f.rarity));
    parts.push("武器種: " + (f.weapon === "ALL" ? "全て" : f.weapon));
    parts.push("検索: " + (f.text ? f.text : "なし"));
    if (f.unfixedOnly) parts.push("上限未確定のみ: ON");
    return parts.join(" / ");
}

function applyMode1Filter() {
    var uf = APP.filter.unownedOnly;
    var ff = APP.filter.unfixedOnly;

    $(".style-wrapper").each(function() {
        var $w = $(this);
        var id    = $w.attr("data-id");
        var owned = APP.data.accounts[APP.activeIndex].styles[id] ? true : false;

        var show = styleMatchesFilter($w);
        if (uf && owned) show = false;

        $w.toggle(show);
    });

    // 年セクション: 全アイコン非表示なら隠す
    // ※ :visible はセクション自身が display:none だと子も不可視判定になり
    //    一度隠れたセクションが二度と再表示されないため、インラインスタイルで判定する
    $(".year-section").each(function() {
        var hasVisible = $(this).find(".style-wrapper").filter(function() {
            return this.style.display !== "none";
        }).length > 0;
        $(this).toggle(hasVisible);
    });

    // 0件時の空状態メッセージ表示
    // ※ .year-section が display:none になると :visible では拾えないため、
    //    .style-wrapper 自体のインラインスタイルで判定する
    var totalVisible = 0;
    $("#mode1-icon-area .style-wrapper").each(function() {
        if (this.style.display !== "none") totalVisible++;
    });
    var $emptyMsg = $("#m1-empty-message");
    if (totalVisible === 0) {
        if ($emptyMsg.length === 0) {
            $emptyMsg = $('<div id="m1-empty-message" style="padding:24px 16px;text-align:center;color:#ffa;font-size:14px;line-height:1.7;"></div>');
            $("#mode1-icon-area").prepend($emptyMsg);
        }
        var msg = "条件に一致するスタイルがありません。";
        var hints = [];
        if (uf) hints.push("「未所持のみ」");
        if (ff) hints.push("「上限未確定のみ」");
        if (hints.length > 0) {
            msg += "<br><span style=\"color:#f93;font-weight:bold;\">" + hints.join("・") + " フィルタがONです。</span><br>OFFにすると全てのスタイルが表示されます。";
        } else {
            msg += "<br>フィルタ条件を変更してみてください。";
        }
        $emptyMsg.html(msg).show();
    } else {
        $emptyMsg.hide();
    }
}

// ===== モード2: 横断検索 =====
function renderMode2() {
    var q = $("#mode2-search-box").val();
    renderMode2Result(q);
}

function renderMode2Result(query) {
    var $result = $("#mode2-result");
    if (!query || query.length < 1) {
        $result.html('<p style="color:#ccc;font-size:13px;">キーワードを入力してください</p>');
        return;
    }
    var q = query.toLowerCase();
    var hits = [];
    for (var i = 0; i < APP.styleList.length; i++) {
        var s = APP.styleList[i];
        if (s.name.toLowerCase().indexOf(q) >= 0 || s.another.toLowerCase().indexOf(q) >= 0) {
            hits.push(s);
        }
    }
    if (hits.length === 0) {
        $result.html('<p style="color:#ccc;font-size:13px;">ヒットなし</p>');
        return;
    }

    // ヘッダ
    var thead = '<thead><tr><th>アイコン</th><th>キャラ名・二つ名</th><th>レア</th><th>武器</th>';
    for (var a = 0; a < NUM_ACCOUNTS; a++) {
        thead += '<th>' + escHtml(APP.data.accounts[a].name) + '</th>';
    }
    thead += '<th>所持数</th></tr></thead>';

    var tbody = '<tbody>';
    for (var j = 0; j < hits.length; j++) {
        var s2 = hits[j];
        var ownCount = 0;
        var cells = '';
        for (var b = 0; b < NUM_ACCOUNTS; b++) {
            var has = APP.data.accounts[b].styles[s2.id] ? true : false;
            if (has) ownCount++;
            cells += has
                ? '<td class="have-mark">○</td>'
                : '<td class="not-have-mark">×</td>';
        }
        var iconHtml = '<span class="style_icon_bg_base" style="display:inline-block;width:44px;height:44px;background:url(https://romasagatool.com/img/style_icon_bg/' + s2.id + '.png) no-repeat;background-size:contain;"></span>';
        tbody += '<tr>';
        tbody += '<td class="icon-cell">' + iconHtml + '</td>';
        tbody += '<td class="name-cell">' + escHtml(s2.name) + '<br><small>' + escHtml(s2.another) + '</small></td>';
        tbody += '<td>' + escHtml(s2.rare) + '</td>';
        tbody += '<td>' + escHtml(s2.weapon) + '</td>';
        tbody += cells;
        tbody += '<td>' + ownCount + '/8</td>';
        tbody += '</tr>';
    }
    tbody += '</tbody>';

    $result.html('<table id="mode2-table">' + thead + tbody + '</table>');
}

// ===== モード3: ステ上限未確定 =====
var CSV_URL = "../romasaga-tool-be/php/data_StyleLimit.csv";
var STAT_NAMES = {
    iStr: "腕力", iVit: "体力", iDex: "器用さ", iAgi: "素早さ",
    iInt: "知力", iMnd: "精神", iAi: "愛", iMi: "魅力"
};

function fetchLimitCSV() {
    fetch(CSV_URL + "?up=" + Date.now())
        .then(function(res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.text();
        })
        .then(function(text) {
            APP.limitData = parseStyleLimitCSV(text);
            if (APP.mode === 3) renderMode3();
        })
        .catch(function(err) {
            console.warn("StyleLimit CSV取得失敗:", err);
            APP.limitData = null;
            if (APP.mode === 3) renderMode3();
        });
}

function parseStyleLimitCSV(text) {
    var lines = text.split(/\r?\n/);
    if (lines.length === 0) return {};
    // ヘッダ行をスキップ
    var result = {};
    var EXPECTED_COLS = 22;
    for (var i = 1; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        var cols = line.split(",");
        // AnotherNameにカンマが含まれる場合の救済
        if (cols.length > EXPECTED_COLS) {
            var extra = cols.splice(3, cols.length - EXPECTED_COLS);
            cols[2] = cols[2] + "," + extra.join(",");
        }
        if (cols.length < EXPECTED_COLS) {
            console.warn("StyleLimit: 列数不足でskip:", line);
            continue;
        }
        var rawId = cols[0].trim();
        if (!/^\d+$/.test(rawId)) {
            console.warn("StyleLimit: IdがdigitでないのでSkip:", rawId);
            continue;
        }
        var styleId = "ID" + parseInt(rawId, 10).toString(16);
        result[styleId] = {
            Id:       rawId,
            Name:     cols[1],
            AnotherName: cols[2],
            Rare:     cols[3],
            Fix:      cols[4],
            Str:      cols[5],  Vit: cols[6],  Dex: cols[7],  Agi: cols[8],
            Int:      cols[9],  Mnd: cols[10], Ai:  cols[11], Mi:  cols[12],
            Sum:      cols[13],
            iStr:     cols[14], iVit: cols[15], iDex: cols[16], iAgi: cols[17],
            iInt:     cols[18], iMnd: cols[19], iAi:  cols[20], iMi:  cols[21],
        };
    }
    return result;
}

function renderMode3() {
    var $error = $("#mode3-error");
    var $summary = $("#mode3-summary");
    var $tbody = $("#mode3-tbody");

    if (!APP.limitData) {
        $error.text("romasaga-tool-be がローカルに無いか、Apacheが起動していません（StyleLimit.csvを取得できませんでした）").show();
        $summary.text("データなし");
        $tbody.empty();
        return;
    }
    $error.hide();

    // Fix !== "f" のスタイルを抽出
    var unconfirmed = [];
    for (var sid in APP.limitData) {
        var row = APP.limitData[sid];
        if (row.Fix.trim() === "f") continue;
        // STYLE_MASTERにも存在するか確認
        var masterEntry = (typeof STYLE_MASTER !== "undefined") ? STYLE_MASTER[sid] : null;
        unconfirmed.push({ sid: sid, row: row, master: masterEntry });
    }

    // ソート: 1つ以上所持アカウントがあるもの → year降順
    unconfirmed.sort(function(a, b) {
        var aOwned = anyOwned(a.sid);
        var bOwned = anyOwned(b.sid);
        if (aOwned !== bOwned) return bOwned ? 1 : -1;
        // year降順
        var ay = a.master ? (parseInt(a.master.year) || 0) : 0;
        var by2 = b.master ? (parseInt(b.master.year) || 0) : 0;
        return by2 - ay;
    });

    // サマリ
    var totalUnconf = unconfirmed.length;
    var coveredCount = 0;
    for (var i = 0; i < unconfirmed.length; i++) {
        if (anyOwned(unconfirmed[i].sid)) coveredCount++;
    }
    $summary.html("未確定総数: <strong>" + totalUnconf + "</strong>件 / うち所持カバー済み: <strong>" + coveredCount + "</strong>件");

    $tbody.empty();

    for (var j = 0; j < unconfirmed.length; j++) {
        var u = unconfirmed[j];
        var hasAny = anyOwned(u.sid);

        // 所持アカウントありのみ表示トグル
        if (APP.mode3OnlyOwned && !hasAny) continue;

        // 未確定ステ名列挙
        var unconfStats = [];
        for (var statKey in STAT_NAMES) {
            if (u.row[statKey] && u.row[statKey].trim() !== "k") {
                unconfStats.push(STAT_NAMES[statKey]);
            }
        }

        // アイコン
        var iconHtml = '<span class="style_icon_bg_base" style="display:inline-block;width:44px;height:44px;background:url(https://romasagatool.com/img/style_icon_bg/' + u.sid + '.png) no-repeat;background-size:contain;"></span>';

        // 名前
        var name = u.master ? (u.master.Name || u.row.Name) : u.row.Name;
        var another = u.master ? (u.master.AnotherName || u.row.AnotherName) : u.row.AnotherName;

        // Fix値表示
        var fixVal = u.row.Fix.trim();
        var fixClass = (fixVal === "" || fixVal === "c") ? "fix-val-c" : "";

        // アカウント所持列
        var acctCells = "";
        for (var k = 0; k < NUM_ACCOUNTS; k++) {
            var has = APP.data.accounts[k].styles[u.sid] ? true : false;
            acctCells += has
                ? '<td class="have-mark">○</td>'
                : '<td class="not-have-mark">×</td>';
        }

        var $tr = $('<tr></tr>');
        $tr.append('<td class="icon-cell">' + iconHtml + '</td>');
        $tr.append('<td class="name-cell">' + escHtml(name) + '<br><small>' + escHtml(another) + '</small></td>');
        $tr.append('<td>' + escHtml(u.row.Rare || (u.master ? u.master.Rarity : "")) + '</td>');
        $tr.append('<td class="' + fixClass + '">' + escHtml(fixVal) + '</td>');
        $tr.append('<td class="unconf-cell">' + escHtml(unconfStats.join(", ")) + '</td>');
        $tr.append(acctCells);
        $tbody.append($tr);
    }
}

function anyOwned(sid) {
    for (var i = 0; i < NUM_ACCOUNTS; i++) {
        if (APP.data.accounts[i].styles[sid]) return true;
    }
    return false;
}
