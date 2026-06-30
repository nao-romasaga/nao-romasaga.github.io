// 置物ランキング 基本値の計算内訳を表示用の {label, value} 行配列に整形するピュア関数。
// 値は API（BE 計算）由来の baseBreakdown をそのまま整形するだけ＝計算は一切しない（表示=計算一致）。
function buildBaseBreakdownRows(bd) {
    if (!bd || typeof bd !== 'object' || !Array.isArray(bd.statParts) || bd.statParts.length === 0) {
        return [];
    }
    const r = Math.round;
    const enemyJp = bd.enemyStatKind === 'MND' ? '精' : '体';
    const statStr = bd.statParts
        .map(p => `${p.jp}${r(p.base)} + ${r(p.correction)} + ${p.buffPer}%`)
        .join(' / ');
    const rows = [
        { label: '武器威力 + 技威力',       value: `${r(bd.weapon)} + ${r(bd.skill)}` },
        { label: 'キャラステ + 補正 + バフ', value: statStr },
        { label: '敵ステ + デバフ',          value: `${enemyJp}${r(bd.enemyStatBase)} + ${bd.enemyDebuffPer}%` },
        { label: 'アビリティ + 聖石 + MasterLV', value: `+${r(bd.ability)}% + ${r(bd.holyStone)}% + ${r(bd.master)}%` },
        { label: 'Ex',                       value: `×${Number(bd.ex).toFixed(2)}` },
    ];
    if (bd.enemyCount > 1) {
        rows.push({ label: '敵数', value: `× ${bd.enemyCount}体` });
    }
    return rows;
}

// ブラウザでは global 関数として定義（export 無し）。node テスト用にのみ module.exports。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildBaseBreakdownRows };
}
