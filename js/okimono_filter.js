// 結果ランキングのクライアント側フィルタ判定（純粋関数）。
// 属性: filterAttr のいずれかが breakdown のキー（属性 or 複合 or "全"）に該当すれば通す。
// 「全」を持つサポートは全属性に通す。範囲: filterRange は data-href（カンマ区切りOR）で、
// breakdown.damage のキーにそのトークンを含むものがあれば通す。武器: weaponType 完全一致。
function _breakdownAttrKeys(breakdown) {
    const keys = new Set();
    const dmg = (breakdown && breakdown.damage) ? breakdown.damage : {};
    for (const k in dmg) keys.add(k);
    const deb = (breakdown && breakdown.debuff) ? breakdown.debuff : {};
    for (const k in deb) keys.add(k);
    return keys;
}
function _attrMatches(keys, attr) {
    if (keys.has('全')) return true;
    if (keys.has(attr)) return true;
    for (const k of keys) { if (k.indexOf('・') !== -1 && k.split('・').indexOf(attr) !== -1) return true; }
    return false;
}
function supportPassesFilters(opts) {
    const { weaponType, breakdown, filterWeapon, filterAttr, filterRange } = opts;
    if (filterWeapon && weaponType !== filterWeapon) return false;
    const keys = _breakdownAttrKeys(breakdown);
    if (Array.isArray(filterAttr) && filterAttr.length > 0) {
        // 選択属性のいずれかに一致（OR）
        if (!filterAttr.some(a => _attrMatches(keys, a))) return false;
    }
    if (Array.isArray(filterRange) && filterRange.length > 0) {
        // 各 filterRange エントリ（"a,b,c" は OR）すべてを満たす（AND of entries）
        const dmgKeys = (breakdown && breakdown.damage) ? Object.keys(breakdown.damage) : [];
        const ok = filterRange.every(entry => {
            const toks = String(entry).split(',');
            return toks.some(t => dmgKeys.some(k => k.indexOf(t) !== -1));
        });
        if (!ok) return false;
    }
    return true;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supportPassesFilters };
}
