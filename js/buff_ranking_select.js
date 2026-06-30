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
    });

    // スタイル選択 → 技一覧＋アビ一覧（委譲）
    $(document).on('click', '.style', function () {
        const styleId = $(this).attr("data-id");
        const styleInfo = STYLE_MASTER[styleId];
        if (!styleInfo) return;
        OKI_NOW_STYLE_ID = styleId;
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
    });

    // 技選択 → SELECTED_* セット → ランキング再計算（委譲）
    $(document).on('click', '[data-skill-id]', function () {
        const skillId = $(this).attr("data-skill-id");
        if (!OKI_NOW_STYLE_ID || !SKILL_MASTER[skillId]) return;
        SELECTED_ATTACKER = STYLE_MASTER[OKI_NOW_STYLE_ID];
        SELECTED_SKILL = SKILL_MASTER[skillId];
        const styleInfo = STYLE_MASTER[OKI_NOW_STYLE_ID];
        const sName = styleInfo?.['Name'] ?? '';
        const skillName = SELECTED_SKILL['Name'];

        // 選択中カードの強調: 他カードから外し、クリックしたカードに付与
        $('#OKI_SKILL_LIST .okimono-skill-card').removeClass('skill-selected');
        $(this).addClass('skill-selected');

        // #OKI_SELECTED にアイコン＋スタイル名 / 技名を表示
        const $selected = $("#OKI_SELECTED").empty();
        if (styleInfo && typeof getStyleIcon === 'function') {
            const $icon = getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], styleInfo['WeaponType']).clone();
            $icon.css({ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' });
            $selected.append($icon);
        }
        $selected.append(
            $('<span>').addClass('fuchidori-white').text(`${sName} / ${skillName}`)
        );

        recalcRanking();
    });
});
