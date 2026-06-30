// 技/アビカードのHTML文字列を生成する純粋関数群（隠しDOMテンプレ＋clone を置換）。
// ブラウザでは utils2.js の getSkillIcon/getAbilityIcon/getImgPath/ICON_LIST/IRYOKU_LIST を借用。
// node テスト用に未定義ガードしつつ module.exports。

/**
 * ICON_LIST から weapon/attr の class 名を返す。
 * node テスト時は '' を返す。
 */
function _iconClass(key) {
    return (typeof ICON_LIST !== 'undefined' && ICON_LIST[key]) ? ICON_LIST[key] : '';
}

/**
 * 技アイコン HTML を返す（ブラウザでは getSkillIcon(skillId, 'md') の outerHTML 相当）。
 * node テスト時はフォールバック文字列を返す。
 */
function _skillIconHTML(skillIcon) {
    if (typeof getSkillIcon === 'function') {
        var el = getSkillIcon(skillIcon, 'md');
        // jQuery object → HTML string
        if (el && typeof el.prop === 'function') return el.prop('outerHTML') || '';
        if (el && el[0]) return el[0].outerHTML || '';
    }
    return `<span class="position-relative"><span class="icon-back-skill icon-back-skill-md"><span class="icon-skill icon-skill-md" style="background-image: url();">　</span></span></span>`;
}

/**
 * アビリティアイコン HTML を返す（ブラウザでは getAbilityIcon(abId, 'sm') 相当）。
 * node テスト時はフォールバック文字列を返す。
 */
function _abilityIconHTML(abIcon) {
    if (typeof getAbilityIcon === 'function') {
        var el = getAbilityIcon(abIcon, 'sm');
        if (el && typeof el.prop === 'function') return el.prop('outerHTML') || '';
        if (el && el[0]) return el[0].outerHTML || '';
    }
    return `<span class="position-relative"><span class="icon-back-abiligy icon-back-skill-sm"><span class="icon-skill icon-skill-sm" style="background-image: url();">　</span></span></span>`;
}

// ---- style.js から必要最小限の移植 ----

/**
 * getOrgTarget: utils2.js:2374 の移植。
 * Target 文字列から前置修飾を除去して正規化する。
 */
function getOrgTarget(target) {
    return target.replace("攻撃前に", "")
        .replace("全員に", "").replace("全員の", "")
        .replace("対象に", "");
}

/**
 * getSkillOptionHTML: style.js:getSkillOption のHTML文字列版（最小移植）。
 * バフ/デバフ/バッドステータス印を <span class="skill-icons"> の innerHTML として返す。
 * ICON_LIST が利用できない環境（node テスト）では空文字を返す。
 */
function getSkillOptionHTML(skillInfo) {
    if (typeof ICON_LIST === 'undefined') return '';

    var inner = '';

    // バッドステータス
    for (var basteData of (skillInfo['BadStatus'] ?? [])) {
        if (ICON_LIST[basteData['Name']] != undefined) {
            inner += `<span class="bad icon_xs ${ICON_LIST[basteData['Name']]}">　</span>`;
        }
    }

    // バフ/デバフ
    var buff = [];
    var debuff = [];
    for (var attr of (skillInfo['Mod'] ?? [])) {
        var target = getOrgTarget(attr["Target"]);
        if (target === "HP") {
            buff.push("[HP回復]");
        } else if (target === "BP") {
            buff.push("[BP回復]");
        } else if (target === "全ステ") {
            if (attr["Rank1"] > 0) {
                var path = (typeof getImgPath === 'function') ? getImgPath('icon/icon_formation_up.png') : '';
                buff.push(`[全ステ<img class="icon_xs" src="${path}">]`);
            } else {
                var path2 = (typeof getImgPath === 'function') ? getImgPath('icon/icon_formation_down.png') : '';
                debuff.push(`[全ステ<img class="icon_xs" src="${path2}">]`);
            }
        } else if (ICON_LIST[target + "上昇"] != undefined) {
            if (attr["Rank1"] > 0) {
                buff.push(`<span class="icon_xs ${ICON_LIST[target + "上昇"]}">　</span>`);
            } else {
                debuff.push(`<span class="icon_xs ${ICON_LIST[target + "低下"]}">　</span>`);
            }
        }
    }
    for (var item of [...buff, ...debuff]) {
        inner += item;
    }

    return `<span class="skill-icons">${inner}</span>`;
}

/**
 * renderSkillCardHTML(skillInfo): string
 * createSkillCard + #SKILL_TEMPLATE のDOM構造をテンプレートリテラルで再現する純粋関数。
 * ルートに data-skill-id="<id>" を付与（後続の委譲イベントで拾う用）。
 */
function renderSkillCardHTML(skillInfo) {
    if (!skillInfo) return '';

    var id = skillInfo['Id'] ?? '';
    var name = skillInfo['Name'] ?? '';
    var weaponIconClass = _iconClass(skillInfo['BattleType']);

    // BP 文字列の組み立て（createSkillCard 準拠）
    var bp = 'BP:';
    bp += (skillInfo['ConsumeBp'] == 0)
        ? '0'
        : (skillInfo['ConsumeBp'] - (skillInfo['Kakusei'] ?? 0)) + ' 〜 ' + skillInfo['ConsumeBp'];

    // 連撃補正（Rentatsu）
    if (skillInfo['isRentatsu'] != undefined) {
        // SKILL_MASTER は node テストでは未定義のためガード
        if (typeof SKILL_MASTER !== 'undefined') {
            var orgSkill = SKILL_MASTER[skillInfo['Rentatsu']];
            if (orgSkill && orgSkill['ConsumeBp'] != skillInfo['ConsumeBp']) {
                bp += ` (${orgSkill['ConsumeBp']})`;
            }
        }
    }
    if ((skillInfo['ConsumeLp'] ?? 0) > 0) {
        bp += ' / LP:' + skillInfo['ConsumeLp'];
    }

    // 威力文字列（createSkillCard 準拠）
    var iryoku = '';
    if (skillInfo['PowerGrade'] && skillInfo['PowerGrade'] !== '-') {
        var iv = (skillInfo['SkillIryoku'] === 0 || skillInfo['SkillIryoku'] === '')
            ? ((typeof IRYOKU_LIST !== 'undefined' ? IRYOKU_LIST[skillInfo['PowerGrade']] : '') ?? '')
            : skillInfo['SkillIryoku'];
        iryoku = `威力:${skillInfo['PowerGrade']} (${iv})`;
    }

    // 回復威力・OD（ブラウザ専用ヘルパが必要だが node テストでは空文字）
    var healIryoku = '';
    if (typeof getHealIryoku === 'function') {
        var hv = getHealIryoku(skillInfo);
        if (hv > 0) healIryoku = `<br><span class="small">回復威力</span>(${hv})`;
    }
    var od = '';
    if (typeof skillInfo['OD'] !== 'undefined' && skillInfo['OD'] !== '') {
        od = `<br><span class="small">OD +${skillInfo['OD']}</span>`;
    }

    // フレーバーテキストの整形（createSkillCard 準拠: "攻撃する" 系を除去）
    var textArr = String(skillInfo['FlavorText'] ?? '').split('<br>');
    var text = [];
    for (var i = 0; i < textArr.length; i++) {
        if (i === 0) {
            text.push(textArr[i]);
        } else {
            if (textArr[i] !== '攻撃する' && textArr[i] !== '範囲攻撃する' && textArr[i] !== '全体攻撃する') {
                text.push(textArr[i]);
            }
        }
    }

    // スキルオプション（バフ/デバフ印）
    var skillOptionHtml = getSkillOptionHTML(skillInfo);

    // 技オプション（Mod → テキスト）
    var mod = [];
    for (var modData of (skillInfo['Mod'] ?? [])) {
        var target = getOrgTarget(modData['Target']);
        if (target.includes('回復')
            || target.includes('BP')
            || target.includes('エクストラフォース')
            || modData['Rank1'] == '' || modData['Rank1'] == '-'
        ) {
            continue;
        }
        var rank = modData['Rank1'];
        rank += (modData['Rank99'] !== '' && modData['Rank99'] !== '-') ? ` 〜 ${modData['Rank99']}` : '';
        mod.push(`${target}(${rank}%)`);
    }
    var skillText2 = mod.join('<br>');
    var skillText2Hr = (mod.length > 0) ? `<hr class="skill-text-added" style="margin: 0.2rem 0;">` : `<hr class="skill-text-added d-none" style="margin: 0.2rem 0;">`;
    var skillText2Div = `<div class="skill-text2">${skillText2}</div>`;

    // 属性アイコン
    var attrIcons = String(skillInfo['AttackAttributes'] ?? '').split(',').filter(Boolean)
        .map(function(v) {
            return `<span class="icon_xs ${_iconClass(v)}">　</span>`;
        }).join('');

    // 技アイコン HTML
    var skillIconHtml = _skillIconHTML(skillInfo['SkillIcon']);

    // skill-text の d-none 制御
    var skillTextHidden = (text.length === 0 && mod.length === 0) ? ' d-none' : '';

    return `<table class="width-100 skill-template-table okimono-skill-card" data-skill-id="${id}" id="${id}">
  <tr>
    <td class="weaponIconTd text-center SKILL_ICON" style="vertical-align: top;">${skillIconHtml}</td>
    <td class="text-left d-relative" style="line-height: 20px; padding-left: 5px;">
      <div>
        <div class="d-table-cell">
          <span class="WEAPON_ICON icon_xs ${weaponIconClass}_sm">　</span>
        </div>
        <div class="d-table-cell align-middle text-left skill-name" style="padding-left: 5px; font-size: 20px;">${name}</div>
      </div>
      <div class="text-nowrap d-none d-sm-flex align-items-center">
        <span class="skill-bp">${bp}</span>
        <div class="ICON_AREA_IMG">${attrIcons}</div>
        <div class="SKILL_OPTION">${skillOptionHtml}</div>
      </div>
      <div class="d-sm-none d-block">
        <div class="text-nowrap d-flex align-items-center justify-content-between">
          <span class="skill-bp">${bp}</span>
          <span class="skill-iryoku-sp">${iryoku}</span>
        </div>
        <div class="text-nowrap d-flex align-items-center">
          <div class="ICON_AREA_IMG">${attrIcons}</div>
          <div class="SKILL_OPTION">${skillOptionHtml}</div>
        </div>
      </div>
    </td>
    <td class="text-right skill-iryoku d-none d-sm-table-cell" style="line-height: 1.2rem;">${iryoku}${healIryoku}${od}</td>
    <td class="text-right skill-od d-none d-sm-table-cell"></td>
  </tr>
  <tr>
    <td colspan="4">
      <div class="skill-text${skillTextHidden}">
        <div class="skill-text1">${text.join('<br>')}</div>
        ${skillText2Hr}
        ${skillText2Div}
      </div>
    </td>
  </tr>
</table>`;
}

/**
 * renderAbilityRowHTML(abInfo): string
 * #AB_TEMPLATE の DOM 構造をテンプレートリテラルで再現する純粋関数。
 * data-ability-id="<id>" を付与。
 */
function renderAbilityRowHTML(abInfo) {
    if (!abInfo) return '';

    var id = abInfo['Id'] ?? '';
    var name = abInfo['Name'] ?? '';
    var iconHtml = _abilityIconHTML(abInfo['Icon'] ?? '4010');

    // アビリティ効果テキスト（displayFlavor 相当）
    var flavorText = abInfo['FlavorText'] ?? '';
    var flover = '';
    if (flavorText) {
        // style.js displayFlavor を簡易移植
        var texts = flavorText.split('<br>');
        for (var i = 0; i < texts.length; i++) {
            var line = texts[i];
            if (line.indexOf('※') === 0
                || line.indexOf('Rank1で発動') > 0
                || line.indexOf('反撃を受けると中断') >= 0
            ) {
                line = `<div class="kome">${line}</div>`;
            } else if (line.indexOf('[') === 0 || line.indexOf('＜') === 0) {
                line = line.replace('[タイプが「攻撃」である技・術(※)を命中させた時]', '[攻撃命中時(※)]');
                line = `<span class="flover-cond fuchidori-white">${line}</span>`;
            }
            texts[i] = line;
        }
        flover = `<span class="flover">${texts.join('<br>')}</span>`;
    }

    // Attr 効果の簡易列挙（style.html AB_TEMPLATE の .flover 相当）
    var attrs = Array.isArray(abInfo['Attr']) ? abInfo['Attr'] : [];
    var attrHtml = attrs.map(function(a) {
        return `<div>[${a.when ?? ''}] ${a.main ?? ''} ${a.sub ?? ''} ${a.size ?? ''}</div>`;
    }).join('');

    // option（バフ等の追加テキスト）
    var optionHtml = abInfo['Option'] ? `<span class="option">${abInfo['Option']}</span>` : '';
    var optionHr = (flover || attrHtml) && optionHtml ? `<hr class="skill-text-added" style="margin: 0.2rem 0;">` : `<hr class="skill-text-added d-none" style="margin: 0.2rem 0;">`;

    return `<tr class="okimono-ability-row" data-ability-id="${id}">
  <td style="padding: 5px;">
    <div class="d-flex" style="gap:10px; margin-bottom: 5px;">
      <span class="AB_ICON">${iconHtml}</span>
      <span class="ab-name">${name}</span>
    </div>
    <div class="ab-flover">
      ${flover}${attrHtml}
      ${optionHr}
      ${optionHtml}
    </div>
  </td>
</tr>`;
}

// ブラウザ global ＋ CJS export（二重定義パターン）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderSkillCardHTML, renderAbilityRowHTML, getSkillOptionHTML };
}
