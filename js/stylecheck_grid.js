/**
 * stylecheck 用 所持編集グリッド（単一ユーザー版・adminのMode1を移植）
 * - 年代別 / ガチャ別 の表示切替（ビューはキャッシュして高速スワップ）
 * - レア/武器種アイコンフィルタ・未所持のみ・一括(既存.allOn/.allOff流用)
 * - スクショ所持登録（ocr_style.js）
 *
 * 所持の真実は stylecheck.js の sslist/slist/alist。アイコンは getStyleIcon の .style を
 * 直接並べるだけ＝既存の `.style` クリック/allOn/allOff/styleClick/calc/保存がそのまま効く。
 * バッジ等のマルチ垢機能は持ち込まない。
 */

var SC_VIEW = "year";                 // "year" | "gacha"
var SC_DOM = {};                      // 構築済みビューのキャッシュ
var SC_FILTER = { rarity: "ALL", weapon: "ALL", year: "ALL", text: "", unownedOnly: false };

function scEsc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
}

function scIsOwned(sid) {
    return sslist.indexOf(sid) > -1 || slist.indexOf(sid) > -1 || alist.indexOf(sid) > -1;
}

/* ---------- アイコン生成（.style 直置き、検索用に名前を埋め込み） ---------- */
/* styleId→キャラ名 逆引き（CHAR_MASTER.Holders経由。例: 忍者→アザミ等のスタイル） */
var SC_CHARNAME = null;
function scCharNameMap() {
    if (SC_CHARNAME) return SC_CHARNAME;
    SC_CHARNAME = {};
    if (typeof CHAR_MASTER !== "undefined") {
        for (var cid in CHAR_MASTER) {
            var hs = CHAR_MASTER[cid].Holders || [];
            for (var hi = 0; hi < hs.length; hi++) SC_CHARNAME[hs[hi]] = CHAR_MASTER[cid].Name;
        }
    }
    return SC_CHARNAME;
}

function scStyleEl(s) {
    var $btn = getStyleIcon(s.Rarity, s.Id, s.WeaponType, false, true);
    $btn.addClass("year" + s.year);
    $btn.attr("data-year", scYearBucket(s.year));
    $btn.attr("data-nametext", s.Name);
    var cn = scCharNameMap()[s.Id] || "";
    $btn.attr("data-search", (s.Name || "") + " " + (s.AnotherName || "") + " " + cn);
    $btn.append('<span style="position:absolute;top:0;left:0;font-size:8px;line-height:10px;color:transparent;">' + scEsc(s.Name) + ' ' + scEsc(s.AnotherName) + '</span>');
    return $btn;
}

/* ---------- ガチャ初出ヘルパ ---------- */
function scDebutSeg(g) { return String(g || "").split("/")[0]; }
function scHasDate(s) { return /^\d{4}\.\d{2}\.\d{2}/.test(s); }
function scGachaDate(s) { return s.slice(0, 10); }
function scGachaName(s) { return scHasDate(s) ? (s.slice(11) || s) : s; }
function scIsRevival(s) { return /復刻|Re;?vival/i.test(s); }

var SC_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "恒常"];
/* year生値→表示バケット（2019〜2026以外＝2018/空/異常値は「恒常」へ） */
function scYearBucket(y) { y = String(y); return (SC_YEARS.indexOf(y) >= 0 && y !== "恒常") ? y : "恒常"; }
/* スタイルの初出ガチャ実装日キー（YYYY.MM.DD、日付なしは ""） */
function scStyleDateKey(s) { var seg = scDebutSeg(s.gacha); return scHasDate(seg) ? scGachaDate(seg) : ""; }
/* ガチャ実装日 降順（日付なしは末尾、安定ソート） */
function scStyleSort(a, b) {
    var ka = scStyleDateKey(a), kb = scStyleDateKey(b);
    if (ka && kb) return kb > ka ? 1 : (kb < ka ? -1 : 0);
    if (ka) return -1; if (kb) return 1; return 0;
}

function scAllStyles() {
    var arr = [];
    for (var sid in STYLE_MASTER) arr.push(STYLE_MASTER[sid]);
    return arr;
}

/* ---------- 年代別 ---------- */
function scBuildYear($root) {
    var byYear = {}; SC_YEARS.forEach(function (y) { byYear[y] = []; });
    scAllStyles().forEach(function (s) { var y = String(s.year); (byYear[y] || byYear["恒常"]).push(s); });
    SC_YEARS.forEach(function (yr) {
        var styles = byYear[yr]; if (!styles || !styles.length) return;
        var $sec = $('<div class="sc-section" data-year="' + yr + '"></div>');
        $sec.append('<span class="sc-section-title">' + yr + (yr === "恒常" ? "" : "年") + '</span>');
        var $grid = $('<div class="sc-grid-row"></div>');
        styles.slice().sort(scStyleSort).forEach(function (s) { $grid.append(scStyleEl(s)); });
        $sec.append($grid); $root.append($sec);
    });
}

/* ---------- ガチャ別（年 > 初出ガチャの小カード・復刻除外・日付なし末尾） ---------- */
function scBuildGacha($root) {
    var byYear = {}; SC_YEARS.forEach(function (y) { byYear[y] = {}; });
    scAllStyles().forEach(function (s) {
        var seg = scDebutSeg(s.gacha);
        if (!seg || scIsRevival(seg)) return;
        var y = String(s.year); if (!byYear[y]) y = "恒常";
        (byYear[y][seg] = byYear[y][seg] || []).push(s);
    });
    function segSort(a, b) {
        var da = scHasDate(a), db = scHasDate(b);
        if (da && db) return scGachaDate(b) > scGachaDate(a) ? 1 : -1;
        if (da) return -1; if (db) return 1; return a > b ? 1 : -1;
    }
    SC_YEARS.forEach(function (yr) {
        var segs = byYear[yr]; var keys = Object.keys(segs); if (!keys.length) return;
        keys.sort(segSort);
        var $sec = $('<div class="sc-section" data-year="' + yr + '"></div>');
        $sec.append('<span class="sc-section-title">' + yr + (yr === "恒常" ? "" : "年") + '</span>');
        var $wrap = $('<div class="gacha-cards-wrap"></div>');
        keys.forEach(function (seg) {
            var $card = $('<div class="gacha-card"></div>');
            $card.append('<span class="gacha-card-title">' + (scHasDate(seg) ? scGachaDate(seg) + ' ' + scEsc(scGachaName(seg)) : scEsc(seg)) + '</span>');
            var $g = $('<div class="sc-grid-row"></div>');
            segs[seg].forEach(function (s) { $g.append(scStyleEl(s)); });
            $card.append($g); $wrap.append($card);
        });
        $sec.append($wrap); $root.append($sec);
    });
}

/* ---------- ビュー構築（キャッシュ＆スワップ） ---------- */
function scBuildGrid() {
    var $area = $("#sc-grid");
    if (!SC_DOM[SC_VIEW]) {
        var $root = $('<div class="sc-viewroot"></div>');
        if (SC_VIEW === "gacha") scBuildGacha($root); else scBuildYear($root);
        SC_DOM[SC_VIEW] = $root;
    }
    $area.children().detach();
    $area.toggleClass("gacha-view", SC_VIEW === "gacha");
    $area.append(SC_DOM[SC_VIEW]);
}

/* ---------- 所持カバーの一括反映（native, 高速） ---------- */
function scRefreshOwned() {
    var icons = document.querySelectorAll("#sc-grid .style");
    for (var i = 0; i < icons.length; i++) {
        var el = icons[i], sid = el.getAttribute("data-id");
        var cover = el.querySelector(".CHECK_COVER");
        if (cover) cover.classList.toggle("icon_nocheck", !scIsOwned(sid));
    }
}

/* ---------- フィルタ（.style に d-none） ---------- */
function scApplyFilter() {
    var fr = SC_FILTER.rarity, fw = SC_FILTER.weapon, fy = SC_FILTER.year, ft = SC_FILTER.text, un = SC_FILTER.unownedOnly;
    var icons = document.querySelectorAll("#sc-grid .style");
    for (var i = 0; i < icons.length; i++) {
        var el = icons[i];
        var show = true;
        if (fr !== "ALL" && el.getAttribute("data-rare") !== fr) show = false;
        if (show && fw !== "ALL" && el.getAttribute("data-type") !== fw) show = false;
        if (show && fy !== "ALL" && String(el.getAttribute("data-year")) !== String(fy)) show = false;
        if (show && ft && (el.getAttribute("data-search") || "").indexOf(ft) === -1) show = false;
        if (show && un) {
            var cover = el.querySelector(".CHECK_COVER");
            var owned = cover && !cover.classList.contains("icon_nocheck");
            if (owned) show = false;
        }
        el.classList.toggle("d-none", !show);
    }
    // 空セクション/空カードは隠す
    document.querySelectorAll("#sc-grid .gacha-card").forEach(function (c) {
        c.classList.toggle("d-none", !c.querySelector(".style:not(.d-none)"));
    });
    document.querySelectorAll("#sc-grid .sc-section").forEach(function (s) {
        s.classList.toggle("d-none", !s.querySelector(".style:not(.d-none)"));
    });
}

/* ---------- OCR 確定 → 所持に追加 ---------- */
function scOcrConfirm(sids) {
    var added = 0;
    sids.forEach(function (sid) {
        var info = STYLE_MASTER[sid]; if (!info) return;
        if (scIsOwned(sid)) return;
        styleClick(sid, info.Rarity, true);   // 既存ロジックで配列/weaponType/カバー更新
        added++;
    });
    calcStyleList();
    if (typeof calcMyStyle === "function") calcMyStyle();
    updateMyStyle();
    setTwitterURL();
    scRefreshOwned();
    scApplyFilter();
    if (typeof showOcrToast === "function") showOcrToast("✅ " + added + " 件を所持に追加しました");
}

/* ---------- 集計（旧display()の非描画部分を移植）＋分母描画＋グリッド描画 ---------- */
function scDisplayAggregate() {
    for (var charId in CHAR_MASTER) {
        var holders = CHAR_MASTER[charId]["Holders"] || [];
        for (var h = 0; h < holders.length; h++) {
            var info = STYLE_MASTER[holders[h]]; if (!info) continue;
            var rare = info.Rarity, weapon = info.WeaponType;
            var bunrui = changeGachaBunrui(info.gachaBunrui);
            listDetaiAll[bunrui] = listDetaiAll[bunrui] || { "SS": 0, "S": 0, "A": 0 };
            listDetaiAll[bunrui][rare]++;
            allCount[rare][weapon]++; allCount[rare]["ALL"]++;
            allCount["ALL"][weapon]++; allCount["ALL"]["ALL"]++;
        }
    }
    $(".all").text(allCount["ALL"]["ALL"]);
    $(".allSS").text(allCount["SS"]["ALL"]);
    $(".allS").text(allCount["S"]["ALL"]);
    $(".allA").text(allCount["A"]["ALL"]);
    for (var label in listDetaiIdKeys) {
        $("." + listDetaiIdKeys[label] + "All").text(listDetaiAll[label]["SS"] + listDetaiAll[label]["S"] + listDetaiAll[label]["A"]);
        $("." + listDetaiIdKeys[label] + "AllSS").text(listDetaiAll[label]["SS"]);
        $("." + listDetaiIdKeys[label] + "AllS").text(listDetaiAll[label]["S"]);
        $("." + listDetaiIdKeys[label] + "AllA").text(listDetaiAll[label]["A"]);
    }
    for (var key in WEAPON_ATTR) {
        $(".all" + key).text(allCount["ALL"][key]);
        $(".allSS" + key).text(allCount["SS"][key]);
        $(".allS" + key).text(allCount["S"][key]);
        $(".allA" + key).text(allCount["A"][key]);
    }
    scRender();
}

/* ---------- 描画エントリ ---------- */
function scRender() {
    scBuildGrid();
    scRefreshOwned();
    scApplyFilter();
}

/* ---------- イベント（一度だけ） ---------- */
function scBindEvents() {
    // 表示切替
    $(document).on("click", ".sc-view-btn", function () {
        var v = $(this).attr("data-view"); if (v === SC_VIEW) return;
        SC_VIEW = v;
        $(".sc-view-btn").removeClass("active"); $(this).addClass("active");
        scRender();
    });
    // レア/武器種フィルタ
    $(document).on("click", ".sc-chip", function () {
        var type = $(this).attr("data-ftype"), val = $(this).attr("data-fval");
        $(".sc-chip[data-ftype='" + type + "']").removeClass("active");
        $(this).addClass("active");
        SC_FILTER[type] = val;
        scApplyFilter();
    });
    // 未所持のみ
    $(document).on("click", "#sc-unowned", function () {
        SC_FILTER.unownedOnly = !SC_FILTER.unownedOnly;
        $(this).toggleClass("active", SC_FILTER.unownedOnly);
        scApplyFilter();
    });
    // 名前検索
    $(document).on("input", "#sc-search", function () {
        SC_FILTER.text = $(this).val().trim();
        scApplyFilter();
    });
    // 既存 .style クリック後にフィルタ再適用（未所持のみ時に即反映）
    $(document).on("click", ".style", function () { setTimeout(scApplyFilter, 0); });
}

/* ---------- CSS 注入 ---------- */
function scInjectStyles() {
    if (document.getElementById("sc-grid-styles")) return;
    var css =
        "#sc-filter{background:rgba(50,50,50,.85);border:2px solid rgb(197,187,147);border-radius:10px;padding:8px;margin-bottom:10px;}" +
        ".sc-frow{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-bottom:6px;}" +
        ".sc-frow>label{font-size:11px;color:#ccc;min-width:48px;}" +
        ".sc-view-btn{padding:5px 16px;border-radius:8px;cursor:pointer;font-size:13px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;}" +
        ".sc-view-btn.active{background:rgba(41,163,239,.9);border-color:transparent;font-weight:bold;}" +
        ".sc-chip{padding:3px 8px;border-radius:12px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font-size:11px;cursor:pointer;}" +
        ".sc-chip.active{background:rgba(41,163,239,.8);border-color:transparent;}" +
        ".sc-chip.chip-icon{padding:3px 5px;line-height:0;display:inline-flex;align-items:center;}" +
        "#sc-unowned{padding:3px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font-size:11px;cursor:pointer;}" +
        "#sc-unowned.active{background:rgba(239,120,41,1);border-color:rgba(255,160,60,.9);font-weight:bold;}" +
        "#sc-search{padding:3px 8px;border-radius:12px;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.4);color:#fff;font-size:16px;width:160px;}" + /* iOSの自動ズーム抑止のため16px以上 */
        // 一括操作（adminのm1-bulkに合わせる）
        ".sc-bulk-on,.sc-bulk-off{padding:3px 8px;border-radius:12px;border:none;color:#fff;font-size:11px;cursor:pointer;}" +
        ".sc-bulk-on{background:rgba(41,163,100,.85);}.sc-bulk-on:hover{background:rgba(41,163,100,1);}" +
        ".sc-bulk-off{background:rgba(200,60,60,.85);}.sc-bulk-off:hover{background:rgba(200,60,60,1);}" +
        "#sc-grid{background:rgba(30,30,30,.8);border:2px solid rgb(197,187,147);border-radius:10px;padding:10px;}" +
        ".sc-section{margin-bottom:18px;}" +
        ".sc-section-title{display:block;padding:4px 16px;margin-bottom:6px;font-size:13px;font-weight:bold;background:rgba(0,0,0,.75);border-radius:6px;color:#faf0b4;}" +
        ".sc-grid-row{display:flex;flex-wrap:wrap;}" +
        ".gacha-cards-wrap{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;}" +
        ".gacha-card{width:164px;padding:6px;background:rgba(30,30,30,.85);border:1px solid rgb(197,187,147);border-radius:8px;}" +
        ".gacha-card-title{display:block;font-size:11px;padding:3px 8px;margin-bottom:4px;background:rgba(0,0,0,.75);border-radius:6px;color:#faf0b4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
        "#sc-grid.gacha-view .style_icon_bg_base{width:45px !important;height:45px !important;}";
    var st = document.createElement("style"); st.id = "sc-grid-styles"; st.textContent = css;
    document.head.appendChild(st);
}

/* ---------- 初期化（stylecheck.js の ready から呼ぶ） ---------- */
function scInit() {
    scInjectStyles();
    scBindEvents();
    if (typeof initOcrUI === "function") {
        initOcrUI("#sc-ocr-area", scOcrConfirm, scIsOwned);
    }
}
