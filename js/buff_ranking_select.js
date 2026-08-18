// 置物ランキングのグラフィカル選択フロー（キャラ→スタイル→技）。style.js は読み込まず
// utils2.js の描画ヘルパ＋style_cards.js のテンプレート関数を委譲で使う。
let OKI_NOW_STYLE_ID = null;   // 現在選択中のスタイルID（style.js の NOW_STYLE は使わない）

$(document).ready(function () {
    if (typeof dispChar2 === 'function' && typeof CHAR_MASTER !== 'undefined') {
        dispChar2(CHAR_MASTER, { jutsu: true });
    }

    // フィルタ（武器種/シリーズ）— セクション表示切替（委譲）
    $(document).on('click', '.filterList', function () {
        $(".dotList").addClass("d-none");
        const value = $(this).attr("data-href");
        $("#_SEC" + value).removeClass("d-none");
        $(".filterList .fButton").removeClass("filterActive");
        $(this).find(".fButton").addClass("filterActive");
    });

    // キャラ選択 → スタイル一覧（委譲）
    $(document).on('click', '.char', function () {
        const charId = $(this).attr("data-id");
        const charInfo = CHAR_MASTER[charId];
        if (!charInfo) return;
        const $list = $("#OKI_STYLE_LIST").html("");
        (charInfo['Holders'] || []).forEach(function (styleId) {
            const s = STYLE_MASTER[styleId];
            if (!s) return;
            $list.append(getStyleIcon(s['Rarity'], s['Id'], s['WeaponType']).clone());
        });
        $("#OKI_SKILL_LIST").html("");
        $("#OKI_ABILITY_LIST").html("");
        $("#OKI_SELECT_AREA").removeClass("d-none");
        $("#OKI_SKILL_SECTION").addClass("d-none");
    });

    // スタイル選択 → 技一覧＋アビ一覧（委譲）
    // セレクタは #OKI_STYLE_LIST 配下に限定する。getStyleIcon が返すボタンは
    // ランキング行・詳細ヘッダにも同じ .style クラスで置かれるので、`.style` だけだと
    // ランキングのアイコンを押しただけでアタッカーが差し替わる（2026-08-17 修正）。
    $(document).on('click', '#OKI_STYLE_LIST .style', function () {
        const styleId = $(this).attr("data-id");
        const styleInfo = STYLE_MASTER[styleId];
        if (!styleInfo) return;
        OKI_NOW_STYLE_ID = styleId;
        // 選択中スタイルは灰カバー(.icon_nocheck = rgba(0,0,0,0.4))を外して明るく見せる。
        // styleranking.js / party.js / auto.js と同じ流儀で「全部に掛けてから対象だけ外す」。
        // getStyleIcon はカバー付きで生成するので、キャラを変えて一覧を作り直した直後は
        // 全部カバー付き＝未選択の状態から始まる。
        $('#OKI_STYLE_LIST .CHECK_COVER').addClass('icon_nocheck');
        $(this).find('.CHECK_COVER').removeClass('icon_nocheck');
        // 技一覧
        let skillHtml = '';
        for (const k in (styleInfo['SkillIds'] || {})) {
            const sk = SKILL_MASTER[styleInfo['SkillIds'][k]];
            if (sk) skillHtml += renderSkillCardHTML(sk);
        }
        document.getElementById('OKI_SKILL_LIST').innerHTML = skillHtml;
        // アビ一覧（全アビを持つ ABILITY_MASTER を優先、無ければ BUFF_ABILITY_MASTER）
        const ABM = (typeof ABILITY_MASTER !== 'undefined') ? ABILITY_MASTER
                   : (typeof BUFF_ABILITY_MASTER !== 'undefined' ? BUFF_ABILITY_MASTER : {});
        let abHtml = '';
        for (const k in (styleInfo['StyleAbilityIds'] || {})) {
            const ab = ABM[styleInfo['StyleAbilityIds'][k]];
            if (ab) abHtml += renderAbilityRowHTML(ab);
        }
        // renderAbilityRowHTML は <tr> を返す（#AB_TEMPLATE 準拠）ため、<table> でラップしないと
        // ブラウザが tr を破棄する。必ず table/tbody で包んで挿入する。
        document.getElementById('OKI_ABILITY_LIST').innerHTML = '<table class="width-100">' + abHtml + '</table>';
        $("#OKI_SKILL_SECTION").removeClass("d-none");
    });

    // アビリティは既定で畳んでおき、見出しのクリックで開閉する。
    // 長文が並ぶと技の選択が見えなくなるため（2026-08-16 ユーザー指定）。
    $(document).on('click', '.okimono-ability-row .ab-head', function () {
        $(this).closest('.okimono-ability-row').toggleClass('ab-collapsed');
    });

    // 技選択 → SELECTED_* セット → ランキング再計算（委譲）
    $(document).on('click', '[data-skill-id]', function () {
        const skillId = $(this).attr("data-skill-id");
        if (!OKI_NOW_STYLE_ID || !SKILL_MASTER[skillId]) return;
        SELECTED_ATTACKER = STYLE_MASTER[OKI_NOW_STYLE_ID];
        SELECTED_SKILL = SKILL_MASTER[skillId];
        // アタッカーのスタイルが変わったら編成（ロック済みサポーター）をリセットする。
        // 新アタッカーと同一キャラのロックが残ると API が 400 を返すため
        if (typeof resetSupportsIfAttackerChanged === 'function') {
            resetSupportsIfAttackerChanged(OKI_NOW_STYLE_ID);
        }
        const styleInfo = STYLE_MASTER[OKI_NOW_STYLE_ID];
        const sName = styleInfo?.['Name'] ?? '';
        const skillName = SELECTED_SKILL['Name'];

        // 選択中カードの強調: 他カードから外し、クリックしたカードに付与
        $('#OKI_SKILL_LIST .okimono-skill-card').removeClass('skill-selected');
        $(this).addClass('skill-selected');

        // #OKI_SELECTED にアイコン＋スタイル名 / 技名を表示
        const $selected = $("#OKI_SELECTED").empty();
        if (styleInfo && typeof getStyleIcon === 'function') {
            // 第4引数 true = カバー無し。ここは「選択済みの表示」なので、
            // 一覧側で「カバー有り=未選択」を意味させる以上、掛かっていると矛盾する。
            const $icon = getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], styleInfo['WeaponType'], true).clone();
            $icon.css({ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' });
            $selected.append($icon);
        }
        $selected.append(
            $('<span>').addClass('fuchidori-white').text(`${sName} / ${skillName}`)
        );

        recalcRanking();
    });
});
