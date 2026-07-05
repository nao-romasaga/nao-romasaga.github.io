// 置物ランキング「基本値」パネル: 編集可能な計算内訳フォームの生成と再計算ロジック。
// 値は API（BE 計算）由来の baseBreakdown を初期値とし、入力変更でクライアント側再計算する。

// 武器種名 → (per係数, enemy係数)。generate_include.php の WEAPON_MAP に対応。
// STYLE_MASTER の WeaponType は「棍棒」等の文字列。
var OKIMONO_WEAPON_COEFF = {
    '剣':   { per: 4,   enemy: 1.5  },
    '大剣': { per: 4,   enemy: 1.5  },
    '斧':   { per: 4,   enemy: 1.5  },
    '棍棒': { per: 4,   enemy: 1.5  },
    '槍':   { per: 4,   enemy: 1.5  },
    '弓':   { per: 4,   enemy: 1.5  },
    '小剣': { per: 4,   enemy: 1.5  },
    '杖':   { per: 4,   enemy: 1.5  },
    '銃':   { per: 3.6, enemy: 1.25 },
    // 体術は 腕2 + 速2.5 - 敵体1.2 の複合式のため比例スケールで近似
};

// SELECTED_ATTACKER.WeaponType から武器種名を解決する。
// 文字列（"棍棒"等）ならそのまま、数値IDなら変換する。
var OKIMONO_WEAPON_TYPE_NAME = {
    1: '剣', 2: '大剣', 3: '斧', 4: '棍棒', 5: '体術',
    6: '銃', 7: '小剣', 8: '槍', 9: '弓', 10: '杖',
};
function resolveWeaponTypeName(weaponType) {
    if (typeof weaponType === 'string' && weaponType !== '') {
        return OKIMONO_WEAPON_TYPE_NAME[weaponType] || weaponType;
    }
    return OKIMONO_WEAPON_TYPE_NAME[weaponType] || null;
}

// Ex 加算ボタンのティア（AbilityCategory_v2 の実値）
var OKIMONO_EX_TIERS = [
    { label: '極小', val: 0.12 },
    { label: '小',   val: 0.25 },
    { label: '中',   val: 0.5  },
    { label: '大',   val: 0.75 },
];

// statParts 1件から eff（実効ステ値）を求める。
// PHP formula: eff = base + correction + floor(buffBase * buffPer / 100)
//   base = charBase(素) + styleBonus(スタイル補正)
// 入力フォームでは 素(charBase) と 補正(styleCorr = styleBonus + correction) を編集するため
// eff = charBase + styleCorr + floor(buffBase * buffPer / 100)
function calcStatEff(sp) {
    var charBase = Number(sp.charBase);
    var hasSplit = !isNaN(charBase) && sp.styleBonus != null;
    var buffBase = Number(sp.buffBase) || 0;
    var buffPer = Number(sp.buffPer) || 0;
    var add = Math.floor(buffBase * buffPer / 100);
    if (hasSplit) {
        var styleCorr = Number(sp.styleBonus) + (Number(sp.correction) || 0);
        return charBase + styleCorr + add;
    }
    // 旧形式フォールバック
    return (Number(sp.base) || 0) + (Number(sp.correction) || 0) + add;
}

// BD 全体から status を再計算する。
// status = 1 + per * Σeff - enemy * enemyStatEff（体術等は比例スケール近似）
// enemyStatEff = enemyStatBase * (1 - enemyDebuffPer/100)
function calcStatusAfterBuffChange(bd, weaponTypeName) {
    if (!bd || !Array.isArray(bd.statParts) || bd.statParts.length === 0) return bd.status;
    var enemyDebuffPer = Number(bd.enemyDebuffPer) || 0;
    var enemyStatEff = Math.max(0, (Number(bd.enemyStatBase) || 0) * (1 - enemyDebuffPer / 100));
    var coeff = OKIMONO_WEAPON_COEFF[weaponTypeName];

    var effSum = 0;
    for (var i = 0; i < bd.statParts.length; i++) {
        effSum += calcStatEff(bd.statParts[i]);
    }

    if (coeff) {
        return 1 + coeff.per * effSum - coeff.enemy * enemyStatEff;
    }

    // 体術など係数不明: ステ項と敵項を分離して近似する。
    // origStatus = 1 + K*origEffSum - E*origEnemyEff とみなし、
    // K*origEffSum ≒ (origStatus - 1 + E近似*origEnemyEff) で逆算。E近似は体術の1.2を採用。
    var E = 1.2;
    var origEffSum = bd.statParts.reduce(function(s, sp) {
        return s + (Number(sp._origEff) || Number(sp.eff) || 0);
    }, 0);
    var origEnemyEff = Number(bd._origEnemyEff != null ? bd._origEnemyEff : bd.enemyStatEff) || 0;
    var origStatus = Number(bd._origStatus) || Number(bd.status) || 1;
    if (origEffSum <= 0) return bd.status;
    var statTerm = (origStatus - 1) + E * origEnemyEff; // = K * origEffSum
    return 1 + statTerm * (effSum / origEffSum) - E * enemyStatEff;
}

// BD 全値からシナリオ合計ダメージを再計算する。
// perHit = round(min((weapon+skill)*status*abConst, 99999999) * ex)
// abConst = (1/(1+0.008*resist)) * (1/10) * (1+(ability+holyStone+master)/100)
// total = perHit × hitRatio（初期化時に baseDamage/perHitDamage から保存）
function calcBaseDamageFromBreakdown(bd) {
    var weapon    = Number(bd.weapon)    || 0;
    var skill     = Number(bd.skill)     || 0;
    var ability   = Number(bd.ability)   || 0;
    var holyStone = Number(bd.holyStone) || 0;
    var master    = Number(bd.master)    || 0;
    var resist    = Number(bd.resist)    || 0;
    var ex        = Number(bd.ex)        || 1;
    var status    = Number(bd.status)    || 1;
    var hitRatio  = Number(bd._hitRatio) || 1;

    var abConst = (1 / (1 + 0.008 * resist)) * (1 / 10)
        * (1 + (ability + holyStone + master) / 100);
    var perHit = Math.round(Math.min((weapon + skill) * status * abConst, 99999999) * ex);
    return Math.round(perHit * hitRatio);
}

// 内訳1行のHTML。label / 中身 の2カラム。SP でも折り返して見切れない。
function _bdRow(label, bodyHtml) {
    return `<div class="bd-row">
        <div class="bd-label">${label}</div>
        <div class="bd-body">${bodyHtml}</div>
    </div>`;
}

function _bdInput(key, value, opts) {
    opts = opts || {};
    var idx = (opts.idx != null) ? ` data-idx="${opts.idx}"` : '';
    var step = opts.step ? ` step="${opts.step}"` : '';
    var cls = 'bd-input' + (opts.wide ? ' bd-input-wide' : '');
    return `<input type="number" class="${cls}" data-bd="${key}"${idx}${step} value="${value}">`;
}

// 基本値エリアのブレークダウンを編集可能な入力フォームとして描画する。
function buildBaseBreakdownInputHTML(bd) {
    if (!bd || typeof bd !== 'object') return '';
    var r = Math.round;
    var enemyJp = bd.enemyStatKind === 'MND' ? '精神' : '体力';
    var weaponSum = r(bd.weapon) + r(bd.skill);

    var html = '';

    // 武器威力 + 技威力 = 合計
    html += _bdRow('武器威力 + 技威力',
        `${_bdInput('weapon', r(bd.weapon))} <span class="bd-op">+</span> ${_bdInput('skill', r(bd.skill))}
         <span class="bd-op">=</span> <span class="bd-sum bd-strong">${weaponSum}</span>`);

    // キャラステ: 素 + スタイル補正(装備込) + バフ%
    (bd.statParts || []).forEach(function(sp, idx) {
        var charBase = Number(sp.charBase);
        var hasSplit = !isNaN(charBase) && sp.styleBonus != null;
        if (hasSplit) {
            var styleCorr = Number(sp.styleBonus) + (Number(sp.correction) || 0);
            html += _bdRow(`${sp.jp}力（素 + 補正 + バフ）`,
                `${_bdInput('statCharBase', charBase, {idx:idx})} <span class="bd-op">+</span>
                 ${_bdInput('statStyleCorr', styleCorr, {idx:idx})} <span class="bd-op">+</span>
                 ${_bdInput('statBuff', sp.buffPer, {idx:idx})}<span class="bd-op">%</span>
                 <span class="bd-op">=</span> <span class="bd-stat-eff bd-strong" data-idx="${idx}">${calcStatEff(sp)}</span>`);
        } else {
            html += _bdRow(`${sp.jp}力 + 補正 + バフ`,
                `${_bdInput('statBase', r(sp.base), {idx:idx})} <span class="bd-op">+ ${r(sp.correction)} +</span>
                 ${_bdInput('statBuff', sp.buffPer, {idx:idx})}<span class="bd-op">%</span>`);
        }
    });

    // 敵ステ + デバフ（デバフ編集可）
    html += _bdRow(`敵${enemyJp} − デバフ`,
        `<span class="bd-strong">${r(bd.enemyStatBase)}</span> <span class="bd-op">−</span>
         ${_bdInput('enemyDebuffPer', bd.enemyDebuffPer)}<span class="bd-op">%</span>
         <span class="bd-op">=</span> <span class="bd-enemy-eff bd-strong">${r((Number(bd.enemyStatBase)||0) * (1 - (Number(bd.enemyDebuffPer)||0)/100))}</span>`);

    // アビリティ + 聖石 + MasterLV
    html += _bdRow('アビ + 聖石 + MasterLv',
        `${_bdInput('ability', r(bd.ability))}<span class="bd-op">%</span>
         <span class="bd-op">+ ${r(bd.holyStone)}% + ${r(bd.master)}%</span>`);

    // Ex + ティア加算ボタン
    var exBtns = OKIMONO_EX_TIERS.map(function(t) {
        return `<button type="button" class="bd-ex-add" data-ex-add="${t.val}">${t.label}<span class="bd-ex-val">+${t.val}</span></button>`;
    }).join('');
    html += _bdRow('Ex倍率',
        `<span class="bd-op">×</span>${_bdInput('ex', Number(bd.ex).toFixed(2), {step:'0.01', wide:true})}
         <span class="bd-ex-btns">${exBtns}</span>`);

    // 敵数（2体以上のみ）
    if ((bd.enemyCount || 1) > 1) {
        html += _bdRow('敵数', `<span class="bd-strong">× ${bd.enemyCount}体</span>`);
    }

    return html;
}

// ブラウザでは global 関数として定義（export 無し）。node テスト用にのみ module.exports。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        buildBaseBreakdownInputHTML,
        calcBaseDamageFromBreakdown,
        calcStatusAfterBuffChange,
        calcStatEff,
        resolveWeaponTypeName,
        OKIMONO_WEAPON_COEFF,
        OKIMONO_WEAPON_TYPE_NAME,
        OKIMONO_EX_TIERS,
    };
}
