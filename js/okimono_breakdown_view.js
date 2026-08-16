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

// 魂の既定値（2026-08-16 ユーザー指定）。裏(56) と 昇段(40%) は BE の運用定数
// $URA / $SHODAN として既にエンジンが適用済みで statParts から降ってくるため、
// ここで既定値を持つのは「エンジンに存在しない」魂だけ。
var OKIMONO_STAT_EXTRA_DEFAULTS = { soulPer: 59.20, soulFlat: 30 };

// 魂の既定値を各 statPart に埋める。明示的に入っている値は上書きしない
// （0 を「未設定」と誤認して既定値で塗り潰さないよう null/undefined だけを対象にする）。
function applyStatExtraDefaults(bd) {
    if (!bd || !Array.isArray(bd.statParts)) return bd;
    bd.statParts.forEach(function (sp) {
        Object.keys(OKIMONO_STAT_EXTRA_DEFAULTS).forEach(function (k) {
            if (sp[k] == null) sp[k] = OKIMONO_STAT_EXTRA_DEFAULTS[k];
        });
    });
    return bd;
}

// statParts 1件から eff（実効ステ値）を求める。
//
// BE の実際の組み立て（setMaxStatus4Battle / damageCalc.inc:4228）:
//   MAX = statBase + (int)((styleBonusPer + shoudanPer) * statBase / 100) + statusBonus + uraFlat
//   eff = MAX + correction(装備) + floor(buffBase * buffPer / 100)
// 魂(soulPer / soulFlat) はエンジンにまだ無いので、同じ位置に足す。
//
// charBase / styleBonus は promote を含む別の分解で、スタイル補正%の分母にならない
// （こよみ腕力で 1247/540 = 231% となり、実際の 181% と合わなかった。2026-08-16）。
// statBase 系が無い応答は旧分解でフォールバックする。
function calcStatEff(sp) {
    var buffBase = Number(sp.buffBase) || 0;
    var buffPer = Number(sp.buffPer) || 0;
    var buffAdd = Math.floor(buffBase * buffPer / 100);
    var soulFlat = Number(sp.soulFlat) || 0;
    var soulPer = Number(sp.soulPer) || 0;

    if (sp.statBase != null && sp.styleBonusPer != null) {
        var b = Number(sp.statBase) || 0;
        var per = (Number(sp.styleBonusPer) || 0) + (Number(sp.shoudanPer) || 0) + soulPer;
        // PHP の (int) キャストはゼロ方向への切り捨て
        return b + Math.trunc(per * b / 100)
            + (Number(sp.statusBonus) || 0) + (Number(sp.uraFlat) || 0) + soulFlat
            + (Number(sp.correction) || 0) + buffAdd;
    }
    var charBase = Number(sp.charBase);
    if (!isNaN(charBase) && sp.styleBonus != null) {
        return charBase + Number(sp.styleBonus) + (Number(sp.correction) || 0) + buffAdd + soulFlat;
    }
    return (Number(sp.base) || 0) + (Number(sp.correction) || 0) + buffAdd + soulFlat;
}

// 敵ステの実効値。BE の enemyDebuffPer は「負値=低下」の規約
// （damageCalc.inc:1915 `敵ステ debuff 合計%（負値=低下）`）なので (1 + per/100) を掛ける。
// (1 - per/100) だと符号が反転し、デバフが乗っているのに敵ステが増える。
// 実例: 敵体力1000・デバフ-10% を 1100 と表示していた（BEの実計算は900）。2026-08-16 修正。
function effectiveEnemyStat(base, debuffPer) {
    var b = Number(base) || 0;
    var p = Number(debuffPer) || 0;
    return Math.max(0, b * (1 + p / 100));
}

// 素の武器威力 → 実効値。武器種係数（大剣なら1.5）を掛ける。
// 画面には素値（96）を出すが、ダメージ式は実効値（144）を使うため変換が要る。
// per が未指定・不正なら素通し（1倍）。ただし 0 は捨てない ——
// 武器威力を使わない技のヒットが weaponPer=0 で来るため（実測: 神蝕ノ御劔の2ヒット目）、
// 0 を「不明」とみなして 1 に補正すると、そのヒットに武器威力が乗ってしまう。
function effectiveWeapon(raw, weaponPer) {
    var r = Number(raw) || 0;
    var p = Number(weaponPer);
    if (weaponPer == null || !isFinite(p) || p < 0) p = 1;
    return r * p;
}

// 素の技威力 → 実効値。BE の getSkillIryoku と同じ式（素77・rank0 で149）。
function effectiveSkill(raw, rank) {
    var r = Number(raw) || 0;
    if (r <= 0) return 0;
    var k = Number(rank) || 0;
    return r + (r - 5) * (1 + k / 100);
}

// 参照ステのバフ量を取り出す。statParts の先頭が攻撃に使うステ（術なら知力など）。
// ヒットによって参照ステが変わる（例: 技=腕 / 術=知）ため、キーも一緒に返す。
// buffPer は上限適用後の実効値、buffPerRaw は生値、buffCap は上限（BE の $MAX_STATUS_BUFF）。
// 生値が上限以上なら「カンスト」扱いにする。
function _statBuffOf(bd) {
    var sp = (bd && Array.isArray(bd.statParts)) ? bd.statParts[0] : null;
    if (!sp || sp.buffPer == null) return null;
    var cap = Number(sp.buffCap) || 0;
    var raw = (sp.buffPerRaw != null) ? Number(sp.buffPerRaw) : Number(sp.buffPer);
    return {
        key: String(sp.key || ''),
        jp: String(sp.jp || sp.key || ''),
        per: Number(sp.buffPer) || 0,
        capped: cap > 0 && raw >= cap,
    };
}

// ヒット別内訳を [{label, value, unit, delta}] で返す。
// refBd は比較の基準で、2ヒット目以降は「直前のヒット」の内訳を渡す
// （1ヒット目基準の累積ではなく、1発ごとの増分を見せるため。ユーザー指定 2026-08-16）。
// isBase(1ヒット目) は全項目を絶対値で（delta=null）、それ以降は
// 直前ヒットから変わった項目だけを「現在値 + 増加量」で返す。
// 29ヒットの追撃構成で全項目を毎行出すと読めないため、2ヒット目以降は変化分のみに絞る。
// 技威力は表示対象外。
const HIT_FIELDS = [
    { key: 'ability',        label: 'アビ',     unit: '%' },
    { key: 'ex',             label: 'Ex',       unit: ''  },
    { key: 'enemyDebuffPer', label: '敵デバフ', unit: '%' },
];
function hitBreakdownParts(refBd, curBd, isBase) {
    if (!refBd || !curBd) return [];
    var out = [];

    // capped は true のときだけ付ける（常に付けると呼び出し側の比較が煩雑になるため）
    var pushField = function (label, unit, baseVal, curVal, comparable, capped) {
        if (curVal == null) return;
        var cur = Number(curVal);
        var item;
        if (isBase || !comparable || baseVal == null) {
            item = { label: label, value: cur, unit: unit, delta: null };
        } else {
            var b = Number(baseVal);
            // 変化なしの項目は2ヒット目以降では出さない。ただし上限に張り付いている間は
            // 「もう伸びない」ことが情報なので出し続ける
            if (b === cur && !capped) return;
            item = { label: label, value: cur, unit: unit, delta: Number((cur - b).toFixed(10)) };
        }
        if (capped) item.capped = true;
        out.push(item);
    };

    // アビ
    pushField("アビ", "%", refBd.ability, curBd.ability, true);

    // ステバフ量。参照ステが基準ヒットと異なる場合は増加量を出さない（腕と知を引き算しない）
    var sb = _statBuffOf(curBd);
    var sbRef = _statBuffOf(refBd);
    if (sb) {
        var sameStat = !!(sbRef && sbRef.key === sb.key);
        pushField('ステバフ(' + sb.jp + ')', '%', sameStat ? sbRef.per : null, sb.per, sameStat, sb.capped);
    }

    // Ex / 敵デバフ
    for (var i = 1; i < HIT_FIELDS.length; i++) {
        var f = HIT_FIELDS[i];
        pushField(f.label, f.unit, refBd[f.key], curBd[f.key], true);
    }
    return out;
}

// 内訳1項目の表示文字列。「アビ 1100% (+400)」形式。増加量が無ければ値だけ。
function formatHitPart(p) {
    if (!p) return '';
    var s = p.label + ' ' + p.value + p.unit;
    if (p.delta != null && p.delta !== 0) {
        s += ' (' + (p.delta > 0 ? '+' : '') + p.delta + ')';
    }
    return s;
}

// BD 全体から status を再計算する。
// status = 1 + per * Σeff - enemy * enemyStatEff（体術等は比例スケール近似）
function calcStatusAfterBuffChange(bd, weaponTypeName) {
    if (!bd || !Array.isArray(bd.statParts) || bd.statParts.length === 0) return bd.status;
    var enemyStatEff = effectiveEnemyStat(bd.enemyStatBase, bd.enemyDebuffPer);
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

// 1ヒット分のダメージ。BE の damageCalc.inc と同じ式。
// perHit = round(min((weapon+skill)*status*abConst, 99999999) * ex)
// abConst = (1/(1+0.008*resist)) * (1/10) * (1+(ability+holyStone+master)/100)
// capped は Ex を掛ける前に 1ヒット上限へ張り付いたかどうか。
var OKIMONO_HIT_DAMAGE_CAP = 99999999;
function calcHitDamage(bd) {
    if (!bd) return { damage: 0, capped: false };
    var weapon    = Number(bd.weapon)    || 0;
    var skill     = Number(bd.skill)     || 0;
    var ability   = Number(bd.ability)   || 0;
    var holyStone = Number(bd.holyStone) || 0;
    var master    = Number(bd.master)    || 0;
    var resist    = Number(bd.resist)    || 0;
    var ex        = Number(bd.ex)        || 1;
    var status    = Number(bd.status)    || 1;

    var abConst = (1 / (1 + 0.008 * resist)) * (1 / 10)
        * (1 + (ability + holyStone + master) / 100);
    var raw = (weapon + skill) * status * abConst;
    return {
        damage: Math.round(Math.min(raw, OKIMONO_HIT_DAMAGE_CAP) * ex),
        capped: raw >= OKIMONO_HIT_DAMAGE_CAP,
    };
}

// BD 全値からシナリオ合計ダメージを再計算する（単発／ヒット情報が無いとき用）。
// total = perHit × hitRatio（初期化時に baseDamage/perHitDamage から保存）
// 多段・追撃はヒットごとに内訳が違うので recalcHits を使う。
function calcBaseDamageFromBreakdown(bd) {
    var hitRatio = Number(bd._hitRatio) || 1;
    return Math.round(calcHitDamage(bd).damage * hitRatio);
}

// 1ヒット目の内訳に加えた編集を、全ヒットへ適用できる形にまとめる。
//
// 全ヒットで同じ値（武器威力・素ステ・スタイル補正%・裏・魂・昇段）は絶対値で持ち、
// ヒットごとに違う値（アビ%・ステバフ量・敵デバフ・Ex）は「1ヒット目からの差分」で持つ。
// 差分にしないと、災邪の紋で 9500% まで積み上がった最終ヒットのアビが
// 1ヒット目の 800% で塗り潰され、後半のヒットが軒並み過小になる。
// 技威力だけは技ごとに違うので、同じ skillId のヒットにしか効かせない。
function buildHitAdjust(origBd, curBd) {
    origBd = origBd || {};
    curBd = curBd || {};
    var origParts = origBd.statParts || [];
    var statByKey = {};
    var statTouched = false;

    var num = function (v) { return Number(v) || 0; };
    (curBd.statParts || []).forEach(function (sp, idx) {
        var o = origParts[idx] || {};
        // ステ固有の値。キーが一致したヒットにだけ効かせる
        var e = {
            statBase:      Number(sp.statBase),
            styleBonusPer: Number(sp.styleBonusPer),
            statusBonus:   Number(sp.statusBonus),
            correction:    Number(sp.correction),
            buffPerDelta:  num(sp.buffPer) - num(o.buffPer),
        };
        statByKey[String(sp.key != null ? sp.key : idx)] = e;
        if (e.buffPerDelta !== 0
            || num(sp.statBase) !== num(o.statBase)
            || num(sp.styleBonusPer) !== num(o.styleBonusPer)
            || num(sp.statusBonus) !== num(o.statusBonus)
            || num(sp.correction) !== num(o.correction)) {
            statTouched = true;
        }
    });

    // 裏 / 昇段 / 魂 はキャラ全体への投資なので、1ヒット目と別のステを参照するヒット
    // （技は腕力・術は知力、といった混在。実測: 神蝕ノ御劔は STR と INT が混ざる）にも
    // 行き渡らせる。裏(56)と昇段(40%)は BE の $URA / $SHODAN 由来で既に反映済みの値、
    // 魂だけがエンジンに無い新規分。
    var cur0 = (curBd.statParts || [])[0] || {};
    var org0 = origParts[0] || {};
    var extras = {
        shoudanPer: num(cur0.shoudanPer),
        soulPer:    num(cur0.soulPer),
        uraFlat:    num(cur0.uraFlat),
        soulFlat:   num(cur0.soulFlat),
    };
    if (extras.shoudanPer !== num(org0.shoudanPer) || extras.uraFlat !== num(org0.uraFlat)
        || extras.soulPer !== num(org0.soulPer) || extras.soulFlat !== num(org0.soulFlat)) {
        statTouched = true;
    }

    var enemyDebuffDelta = (Number(curBd.enemyDebuffPer) || 0) - (Number(origBd.enemyDebuffPer) || 0);
    return {
        extras:           extras,
        // 武器・技は「素の値」で配り、実効値は各ヒット自身の係数で作り直す。
        // 実効値を全ヒットへ配ると、武器威力を使わないヒット(weaponPer=0)にまで乗る。
        weaponRaw:        Number(curBd.weaponRaw),
        skillId:          String(curBd.skillId || ''),
        skillRaw:         Number(curBd.skillRaw),
        // 聖石(アクセ倍率込み)とマスターLvは武器・キャラ単位の定数で、全ヒットで同じ値
        holyStone:        Number(curBd.holyStone),
        master:           Number(curBd.master),
        statByKey:        statByKey,
        abilityDelta:     (Number(curBd.ability) || 0) - (Number(origBd.ability) || 0),
        exDelta:          (Number(curBd.ex) || 0) - (Number(origBd.ex) || 0),
        enemyDebuffDelta: enemyDebuffDelta,
        // ステか敵ステが動いたときだけ status を計算し直す。動いていないなら
        // BE が返した status をそのまま使う（係数近似による誤差を持ち込まないため）。
        statTouched:      statTouched || enemyDebuffDelta !== 0,
    };
}

// 全ヒットを再計算して {hits, total} を返す。origHits は API 応答（無編集の原本）。
function recalcHits(origHits, adj, weaponTypeName) {
    if (!Array.isArray(origHits) || origHits.length === 0) return { hits: [], total: 0 };
    adj = adj || {};
    var statByKey = adj.statByKey || {};
    var out = [];
    var total = 0;

    for (var i = 0; i < origHits.length; i++) {
        var src = origHits[i];
        var srcBd = src.breakdown || {};
        var bd = JSON.parse(JSON.stringify(srcBd));

        if (!isNaN(adj.weaponRaw)) {
            bd.weaponRaw = adj.weaponRaw;
            bd.weapon = effectiveWeapon(adj.weaponRaw, bd.weaponPer);
        }
        // 技威力は技ごとに違うので、同じ技のヒットだけ差し替える
        if (adj.skillId && !isNaN(adj.skillRaw) && String(bd.skillId || '') === adj.skillId) {
            bd.skillRaw = adj.skillRaw;
            bd.skill = effectiveSkill(adj.skillRaw, bd.skillRank);
        }
        bd.ability        = (Number(bd.ability) || 0)        + (Number(adj.abilityDelta) || 0);
        bd.ex             = (Number(bd.ex) || 0)             + (Number(adj.exDelta) || 0);
        bd.enemyDebuffPer = (Number(bd.enemyDebuffPer) || 0) + (Number(adj.enemyDebuffDelta) || 0);
        if (!isNaN(adj.holyStone)) bd.holyStone = adj.holyStone;
        if (!isNaN(adj.master))    bd.master    = adj.master;

        var extras = adj.extras || {};
        (bd.statParts || []).forEach(function (sp, idx) {
            if (sp._origEff == null) sp._origEff = sp.eff;
            // 裏 / 魂 / 昇段 はキャラ全体への投資なので、参照ステが違うヒットにも効かせる
            sp.shoudanPer = Number(extras.shoudanPer) || 0;
            sp.soulPer    = Number(extras.soulPer)    || 0;
            sp.uraFlat    = Number(extras.uraFlat)    || 0;
            sp.soulFlat   = Number(extras.soulFlat)   || 0;
            var e = statByKey[String(sp.key != null ? sp.key : idx)];
            if (e) {
                // 素ステ・スタイル補正%・限突・バフ量はステごとの値なので、キーが一致したときだけ
                if (!isNaN(e.statBase))      sp.statBase = e.statBase;
                if (!isNaN(e.styleBonusPer)) sp.styleBonusPer = e.styleBonusPer;
                if (!isNaN(e.statusBonus))   sp.statusBonus = e.statusBonus;
                if (!isNaN(e.correction))    sp.correction = e.correction;
                // ステバフは上限($MAX_STATUS_BUFF)を超えない。差分を足して上限で頭打ちにする
                var cap = Number(sp.buffCap) || 0;
                var per = (Number(sp.buffPer) || 0) + (Number(e.buffPerDelta) || 0);
                sp.buffPer = (cap > 0) ? Math.min(per, cap) : per;
            }
            if (adj.statTouched) sp.eff = calcStatEff(sp);
        });

        if (adj.statTouched) {
            bd._origStatus   = srcBd.status;
            bd._origEnemyEff = srcBd.enemyStatEff;
            bd.status = calcStatusAfterBuffChange(bd, weaponTypeName);
        }

        var d = calcHitDamage(bd);
        bd.perHitDamage = d.damage;
        out.push({
            skillId: src.skillId, skillName: src.skillName, first: src.first,
            damage: d.damage, capped: d.capped, breakdown: bd,
        });
        total += d.damage;
    }
    return { hits: out, total: total };
}

// 内訳1行のHTML。label / 中身 の2カラム。SP でも折り返して見切れない。
function _bdRow(label, bodyHtml) {
    return `<div class="bd-row">
        <div class="bd-label">${label}</div>
        <div class="bd-body">${bodyHtml}</div>
    </div>`;
}

// 小ラベルと入力欄を1つの塊にする。折り返しでラベルだけ行末に取り残されるのを防ぐ。
function _bdField(label, innerHtml) {
    return `<span class="bd-field"><span class="bd-sublabel">${label}</span>${innerHtml}</span>`;
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

    var html = '';

    // 武器威力 / 技威力 は「素の値」を出す。
    // 実効値（武器種係数・練達補正の適用後）は内部計算にだけ使い、画面には出さない
    // （素96が144、素77が149と表示されて元の値と結びつかなかったため。2026-08-16）。
    html += _bdRow('武器威力 ／ 技威力（素の値）',
        `<span class="bd-sublabel">武器</span>${_bdInput('weaponRaw', r(bd.weaponRaw))}
         <span class="bd-op">／</span>
         <span class="bd-sublabel">技</span>${_bdInput('skillRaw', r(bd.skillRaw))}
         <span class="bd-note">${bd.skillName ? bd.skillName : ''}</span>`);

    // キャラステ: 素 + スタイル補正(装備込) + バフ%
    (bd.statParts || []).forEach(function(sp, idx) {
        var hasDecomp = sp.statBase != null && sp.styleBonusPer != null;
        if (hasDecomp) {
            // BE の組み立て（setMaxStatus4Battle）をそのまま並べる。
            // 限突(statusBonus)と装備(correction)は動かす対象ではないので素の文字で出す。
            var pct = '<span class="bd-op">%</span>';
            html += _bdRow(`${sp.jp}力`,
                _bdField('素ステ', _bdInput('statBase', sp.statBase, {idx:idx}))
                + '<span class="bd-op">×（</span>'
                + _bdField('スタイル補正', _bdInput('styleBonusPer', sp.styleBonusPer, {idx:idx, step:'0.01'}) + pct)
                + '<span class="bd-op">+</span>'
                + _bdField('昇段', _bdInput('shoudanPer', sp.shoudanPer, {idx:idx, step:'0.01'}) + pct)
                + '<span class="bd-op">+</span>'
                + _bdField('魂', _bdInput('soulPer', sp.soulPer, {idx:idx, step:'0.01'}) + pct)
                + '<span class="bd-op">）+</span>'
                + _bdField('裏', _bdInput('uraFlat', sp.uraFlat, {idx:idx}))
                + '<span class="bd-op">+</span>'
                + _bdField('魂', _bdInput('soulFlat', sp.soulFlat, {idx:idx}))
                + '<span class="bd-op">+</span>'
                + _bdField('限突', _bdInput('statusBonus', sp.statusBonus, {idx:idx}))
                + '<span class="bd-op">+</span>'
                + _bdField('装備', _bdInput('correction', sp.correction, {idx:idx}))
                + '<span class="bd-op">+</span>'
                + _bdField('バフ量', _bdInput('statBuff', sp.buffPer, {idx:idx}) + pct)
                + `<span class="bd-op">=</span> <span class="bd-stat-eff bd-strong" data-idx="${idx}">${calcStatEff(sp)}</span>`);
        } else if (!isNaN(Number(sp.charBase)) && sp.styleBonus != null) {
            // 旧応答フォールバック（statBase 系が無い）
            html += _bdRow(`${sp.jp}力`,
                _bdField('素ステ', _bdInput('statCharBase', Number(sp.charBase), {idx:idx}))
                + `<span class="bd-op">+ ${r(Number(sp.styleBonus) + (Number(sp.correction) || 0))} +</span>`
                + _bdField('バフ量', _bdInput('statBuff', sp.buffPer, {idx:idx}) + '<span class="bd-op">%</span>')
                + `<span class="bd-op">=</span> <span class="bd-stat-eff bd-strong" data-idx="${idx}">${calcStatEff(sp)}</span>`);
        } else {
            html += _bdRow(`${sp.jp}力 + 補正 + バフ`,
                `${_bdInput('statBase', r(sp.base), {idx:idx})} <span class="bd-op">+ ${r(sp.correction)} +</span>
                 ${_bdInput('statBuff', sp.buffPer, {idx:idx})}<span class="bd-op">%</span>`);
        }
    });

    // 敵ステ × デバフ（デバフ編集可）
    // デバフ値は「負値=低下」なので、引き算ではなく (1 + per/100) の掛け算として見せる。
    // `1000 − -10% = 1100` のように、デバフを掛けたのに増えて見える表記を避ける。
    html += _bdRow(`敵${enemyJp} × デバフ`,
        `<span class="bd-strong">${r(bd.enemyStatBase)}</span> <span class="bd-op">×（1 +</span>
         ${_bdInput('enemyDebuffPer', bd.enemyDebuffPer)}<span class="bd-op">%）</span>
         <span class="bd-op">=</span> <span class="bd-enemy-eff bd-strong">${r(effectiveEnemyStat(bd.enemyStatBase, bd.enemyDebuffPer))}</span>`);

    // アビリティ + 聖石 + MasterLV
    // 「聖石」はアクセサリ倍率込みの合算（BE の $SSS_ACC + 聖石。damageCalc.inc:85,113-121）で、
    // 聖石そのものの値ではない。実測 1630 = 1515(アクセ) + 115(関門聖石)。
    var pctOp = '<span class="bd-op">%</span>';
    html += _bdRow('アビ + 聖石 + MasterLv',
        _bdField('アビ', _bdInput('ability', r(bd.ability)) + pctOp)
        + '<span class="bd-op">+</span>'
        + _bdField('聖石＋アクセ', _bdInput('holyStone', bd.holyStone, {wide:true}) + pctOp)
        + '<span class="bd-op">+</span>'
        + _bdField('MasterLv', _bdInput('master', bd.master, {step:'0.1'}) + pctOp));

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
        calcHitDamage,
        calcStatusAfterBuffChange,
        calcStatEff,
        applyStatExtraDefaults,
        buildHitAdjust,
        recalcHits,
        effectiveEnemyStat,
        effectiveWeapon,
        effectiveSkill,
        hitBreakdownParts,
        formatHitPart,
        resolveWeaponTypeName,
        OKIMONO_WEAPON_COEFF,
        OKIMONO_WEAPON_TYPE_NAME,
        OKIMONO_EX_TIERS,
        OKIMONO_STAT_EXTRA_DEFAULTS,
        OKIMONO_HIT_DAMAGE_CAP,
    };
}
