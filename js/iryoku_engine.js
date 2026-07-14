// iryoku_engine.js — 技・術威力逆算計算機（iryoku.html）のエンジン忠実リプレイ状態機械。
// BE damageCalc.inc の calcAutoDamage が使う状態機械(BUFF_ABILITY/DAMAGE_ABILITY/DEBUFF_ABILITY/
// ADD_ABILITY/CRITICAL_ABILITY/NOW_DAMAGE_STATE/NOW_BUFF_STATE/NOW_DEBUFF_STATE/ACTIVE_STATES)を
// T1(1ターン目)スコープに限定してJS移植する。ブラウザでは <script> 直読み込みでグローバル関数として
// 動く（iryoku_core.js より後、iryoku_calc.js より前に読み込む）。Node からは module.exports 経由。
//
// スコープ外（呼ばれないため未実装）: ターン跨ぎの減衰(decrementBuff/decrementTsuigeki)、
// 3の倍数ターンリセット、5T計測限定トリガー、撃破時トリガー、確率発動(isKakurituHatsudou の
// TIME<100)、SUPPORT_RANKINGのパーティ人数分岐、ABILITY_MASTER要のネストしたアビリティ付与解決。

// BE damageCalc.inc:10-11
var IRYOKU_ENGINE_MAX_STATUS_BUFF = 3000;
var IRYOKU_ENGINE_MAX_FIRE_DAMAGE = 10000;
// BE generate_include.php:11
var IRYOKU_ENGINE_NO_DUPLICATE_ATTRS = ["モラルアップ", "ガードダウン", "致命の烙印"];
// BE damageCalc.inc:256-261。技Modの確率発動テーブル（添字は hitCount % 15）。
// アビ側の確率(isKakurituHatsudou)はターン基準でT1不発だが、技Mod側はhit番号基準なのでT1でも作動する。
var IRYOKU_ENGINE_PER_TABLE = {
    12: [false, false, false, true, false, false, false, false, false, true, false, false, false, false, false],
    25: [false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
    37: [false, true, false, true, false, false, true, false, true, false, true, false, true, false, false],
    50: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true]
};
// BE damageCalc.inc:254
var IRYOKU_ENGINE_PARAM_NAME = { "腕力": "STR", "体力": "VIT", "器用さ": "DEX", "素早さ": "AGI", "知力": "INT", "精神": "MND" };
// BE damageCalc.inc:208-213（既存 iryoku_core.js の IRYOKU_RANGE_LIST と同内容。エンジン側の呼称に合わせて再定義）
var IRYOKU_ENGINE_RANGE_LIST = {
    "敵単体": ["単体攻撃", "単体"], "ランダム": ["単体攻撃", "単体"],
    "敵横一列": ["全体攻撃または範囲攻撃", "範囲攻撃", "範囲"],
    "敵縦一列": ["全体攻撃または範囲攻撃", "範囲攻撃", "範囲"],
    "敵全体": ["全体攻撃または範囲攻撃", "範囲攻撃", "全体"]
};
// BE damageCalc.inc:1287-1307
var IRYOKU_ENGINE_ATTACK_ATTR_MAP = {
    "全ダメージ": "全", "攻撃強化": "全", "攻撃弱化": "全", "防御弱化": "全",
    "単体攻撃強化": "単体攻撃", "Weak防御弱化": "Weak攻撃",
    "攻撃強化(技)": "技攻撃", "攻撃強化(術)": "術攻撃",
    "防御弱化(技)": "技攻撃", "防御弱化(術)": "術攻撃",
    "ヒートアップ": "全", "ヒートダウン": "全",
    "Weakヒートアップ": "Weak攻撃", "Weak攻撃強化": "Weak攻撃",
    "モラルアップ": "全", "ガードダウン": "全", "ディフェンスダウン": "全",
    "オーバーエンハンス": "OD攻撃", "OD攻撃強化": "OD攻撃"
};

function _deepClone(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }

// resetAbilityInfo(styleInfo,false) 相当（damageCalc.inc:331-401）。
// reg = IRYOKU_REG[styleId]（Task 1出力）。作業コピーは _ORG のディープクローンから開始する
// （PHPの代入は値コピーだがJSはリファレンスのため、リプレイ中の変更がregを汚さないようclone必須）。
// charName = 現スタイルのキャラクター名（CHAR_MASTER[..].Name 相当）。
// isSingleConditionMet の「キャラクターが〜のいずれかの場合」判定に使う（damageCalc.inc:2724-2739）。
// registry(reg)にはキャラ名が無いため呼び出し側(replayChain)から注入する。省略時は空文字。
function createEngineState(reg, charName) {
    reg = reg || {};
    return {
        buffAbility: _deepClone(reg.buffAbilityOrg) || {},
        debuffAbility: _deepClone(reg.debuffAbilityOrg) || {},
        damageAbility: _deepClone(reg.damageAbilityOrg) || {},
        addAbility: _deepClone(reg.addAbilityOrg) || {},
        criticalAbility: _deepClone(reg.criticalAbilityOrg) || {},
        activeStates: _deepClone(reg.activeStatesOrg) || { self: [], enemy: [] },
        nowDamageState: _deepClone(reg.nowDamageStateOrg) || {},
        charName: charName || "",
        // 以下は常に空スタート（damageCalc.inc:353-355,363-364,376-381 と同じ）
        enemyMarkerAbility: [],
        nowDebuffState: {},
        nowBuffState: {},
        nowState: {},
        skillModAbCounter: {}
    };
}

// _setDamageBuff（damageCalc.inc:666-714）。
// persistToOrgは実装しない: NOW_DAMAGE_STATE_ORGへの書き込みは「次回resetAbilityInfo後」にのみ
// 意味を持つが、replayChain()は毎回createEngineState()で新規stateを作るため単一呼び出し内では
// 無効(dead)。よってpersistToOrg分岐は省略する。
function setDamageBuff(state, attr, turn, per, range) {
    range = range || "自身";
    state.nowDamageState[attr] = state.nowDamageState[attr] || { ALWAYS: 0, TEMP: [] };
    var isNoDup = attr.indexOf("エクストラフォース") !== -1 || attr.indexOf("モラルアップ") !== -1;
    if (turn === 999) {
        if (isNoDup) {
            state.nowDamageState[attr].ALWAYS = Math.max(state.nowDamageState[attr].ALWAYS, per);
        } else {
            state.nowDamageState[attr].ALWAYS += per;
        }
        if (range !== "自身") {
            state.nowDamageState[attr].ALWAYS_ALL = state.nowDamageState[attr].ALWAYS_ALL || 0;
            if (isNoDup) {
                state.nowDamageState[attr].ALWAYS_ALL = Math.max(state.nowDamageState[attr].ALWAYS_ALL, per);
            } else {
                state.nowDamageState[attr].ALWAYS_ALL += per;
            }
        }
    } else {
        state.nowDamageState[attr].TEMP.push({ PER: per, ZAN_T: turn, MINUS: 0, range: range });
    }
}

// _setStatusBuff（damageCalc.inc:851-871）。ZAN_T/MINUSはT1減衰が無いため保持のみ（消費されない）。
function setStatusBuff(state, target, per, range) {
    var p = IRYOKU_ENGINE_PARAM_NAME[target];
    if (!p || typeof per !== "number" || isNaN(per)) return;
    state.nowBuffState[p] = state.nowBuffState[p] || { PER: 0 };
    state.nowBuffState[p].PER += per;
}

// _setDeBuff（damageCalc.inc:715-727。persistToOrg分岐はBE側で既にdead-write判定され削除済み）。
function setDeBuff(state, attr, turn, per, range) {
    range = range || "敵全体";
    state.nowDebuffState[attr] = state.nowDebuffState[attr] || { ALWAYS: 0, ALWAYS_ALL: 0, TEMP: [] };
    if (turn === 999) {
        state.nowDebuffState[attr].ALWAYS += per;
        state.nowDebuffState[attr].ALWAYS_RANGE = range;
    } else {
        state.nowDebuffState[attr].TEMP.push({ PER: per, ZAN_T: turn, MINUS: 0, range: range });
    }
}

// _getAbilityValue（damageCalc.inc:1543-1570）。
function getAbilityValue(state, attr) {
    var entry = state.nowDamageState[attr];
    if (!entry) return 0;
    var isNoDup = attr.indexOf("モラルアップ") !== -1 || attr.indexOf("エクストラフォース") !== -1;
    var ability = entry.ALWAYS || 0;
    var dupPer = 0;
    (entry.TEMP || []).forEach(function (row) {
        if (!isNoDup) {
            ability += row.PER;
        } else if (dupPer < row.PER) {
            dupPer = row.PER;
        }
    });
    if (isNoDup) ability = Math.max(ability, dupPer);
    return ability;
}

// _applyDefenceDownToAbility（damageCalc.inc:1588-1612）。nowDebuffState は setDeBuff が積む。
function applyDefenceDownToAbility(debuffState, attackAttrs) {
    var sum = 0;
    var attackSet = {};
    attackAttrs.forEach(function (a) { attackSet[a] = true; });
    Object.keys(debuffState || {}).forEach(function (attr) {
        var entry = debuffState[attr];
        if (!entry || typeof entry !== "object") return;
        var matched = false;
        if (attr === "全") {
            matched = true;
        } else if (attr.indexOf("・") !== -1) {
            matched = attr.split("・").some(function (part) { return attackSet[part]; });
        } else {
            matched = !!attackSet[attr];
        }
        if (!matched) return;
        sum += entry.ALWAYS || 0;
        (entry.TEMP || []).forEach(function (row) { sum += row.PER || 0; });
    });
    return sum;
}

// _getDamageAttrPattern（damageCalc.inc:2868-2907）。skill Mod の Target 文字列 → attackAttrバケット名。
function getDamageAttrPattern(subOrg) {
    var sub = String(subOrg).split(/ダメージ|属性/)[0];
    if (sub.indexOf("ウェポンエンハンス") !== -1) {
        sub = sub.replace("ウェポンエンハンス(", "").replace(")", "");
    } else if (sub.indexOf("秘奥・攻") !== -1) {
        sub = sub.replace("秘奥・攻(", "").replace(")", "");
    } else if (sub.indexOf("Weakヒートアップ") !== -1) {
        sub = "Weak攻撃";
    } else if (sub.indexOf("ヒートアップ(HP満タン)") !== -1) {
        sub = "HP満タン時";
    } else if (sub.indexOf("攻撃強化(") !== -1) {
        sub = sub.replace("攻撃強化(", "").replace(")", "");
    } else if (sub.indexOf("ヒートアップ(") !== -1) {
        sub = sub.replace("ヒートアップ(", "").replace(")", "");
    } else if (sub.indexOf("エレメントエンハンス") !== -1) {
        sub = sub.replace("エレメントエンハンス(", "").replace(")", "");
    } else if (sub.indexOf("デュアルエンハンス") !== -1) {
        sub = sub.replace("デュアルエンハンス(", "").replace(")", "");
    } else if (sub.indexOf("エリアエンハンス") !== -1) {
        sub = sub.replace("エリアエンハンス(", "").replace(")", "");
    } else if (sub.indexOf("ディフェンスダウン(") !== -1) {
        sub = sub.replace("ディフェンスダウン(", "").replace(")", "");
    } else if (sub.indexOf("エクストラフォース") !== -1) {
        sub = sub.replace("(", "").replace(")", "");
    }
    return IRYOKU_ENGINE_ATTACK_ATTR_MAP[sub] || sub;
}

// _isAttackAbilityName（damageCalc.inc:2909-2924）
function isAttackAbilityName(sub) {
    sub = String(sub);
    return ["ヒートアップ", "ヒートダウン", "ディフェンスダウン", "モラルアップ", "ガードダウン",
        "攻撃", "防御弱化", "全ダメージ", "エンハンス", "エクストラフォース", "秘奥・攻", "秘伝", "流伝"]
        .some(function (kw) { return sub.indexOf(kw) !== -1; });
}
// _isEnemyDefenceDebuffSub（damageCalc.inc:2928-2932)
function isEnemyDefenceDebuffSub(sub) {
    sub = String(sub);
    return sub.indexOf("防御弱化") !== -1 || sub.indexOf("ガードダウン") !== -1 || sub.indexOf("ディフェンスダウン") !== -1;
}
// eitherAttrCheck（damageCalc.inc:2828-2839）
function eitherAttrCheck(timing) {
    return timing.indexOf("・") !== -1 && timing.indexOf("属性攻撃") !== -1
        && timing.indexOf("戦線離脱") === -1 && timing.indexOf("上昇していない時") === -1
        && timing.indexOf("を発動後") === -1;
}
// isKakurituHatsudou（damageCalc.inc:2959-2971）。T1では MAX_TURN=1<5 のため
// per===100（確定発動）以外は常にfalse（確率発動テーブルはT1では使われない）。
function isKakurituHatsudou(per) {
    return Number(per) === 100;
}

// _isSingleConditionMet（damageCalc.inc:2658-2768）。T1スコープでは NOW_TURN は常に1固定。
// 「行動前/行動後状態」「毒等の状態異常」「ふみとどまった後」「ダメージを受けていなかった場合」等は
// T1のリプレイでは管理対象外のため、ソースの分岐そのまま(常にfalse寄り=保守的)を維持する。
function isSingleConditionMet(state, condition) {
    condition = String(condition || "").trim();
    if (!condition) return true;
    if (condition === "行動前状態の場合" || condition === "自身が行動前状態の場合") {
        return !!(state.nowState.idDeley);
    }
    if (condition === "行動後状態の場合" || condition === "自身が行動後状態の場合") {
        return !(state.nowState.idDeley);
    }
    if (condition.indexOf("対象が") !== -1) {
        var m = condition.match(/「(.+?)」/);
        var stateName = m ? m[1] : "";
        if (stateName && state.activeStates.enemy.indexOf(stateName) !== -1) {
            if (condition.indexOf("状態でない場合") !== -1) return false;
            if (condition.indexOf("状態の場合") !== -1) return true;
        }
        return false;
    }
    if (condition.indexOf("状態でない場合") !== -1) {
        for (var i = 0; i < state.activeStates.self.length; i++) {
            if (condition === "「" + state.activeStates.self[i] + "」状態でない場合") return false;
        }
        for (var j = 0; j < state.activeStates.enemy.length; j++) {
            if (condition === "「" + state.activeStates.enemy[j] + "」状態でない場合") return false;
        }
        return true;
    }
    if (condition.indexOf("状態の場合") !== -1) {
        for (var k = 0; k < state.activeStates.self.length; k++) {
            if (condition === "「" + state.activeStates.self[k] + "」状態の場合") return true;
        }
        for (var l = 0; l < state.activeStates.enemy.length; l++) {
            if (condition === "「" + state.activeStates.enemy[l] + "」状態の場合") return true;
        }
        var extracted = condition.replace(/^「(.+)」状態の場合$/, "$1");
        var found = Object.keys(state.nowDamageState).some(function (sn) { return sn.indexOf(extracted) !== -1; });
        return found;
    }
    // キャラクターがXXXのいずれかの場合 → 現スタイルのキャラ名がリストに含まれるか（damageCalc.inc:2724-2739）。
    // 未実装だと非該当キャラでもアビが誤発火する（保守的にfalseへ倒すエンジン挙動を忠実移植）。
    if (condition.indexOf("キャラクターが") !== -1 && condition.indexOf("のいずれかの場合") !== -1) {
        var charName = state.charName || "";
        var listStr = condition.replace(/^キャラクターが/, "").replace(/のいずれかの場合$/, "");
        return listStr.split("、").map(function (s) { return s.trim(); }).some(function (name) {
            var baseName = name.replace(/\([^)]*\)$/, ""); // モニカ(RS3) 等の括弧付き表記に対応
            return charName === name || charName === baseName;
        });
    }
    if (condition.indexOf("状態") !== -1) return false; // 毒/マヒ等は管理外
    if (condition.indexOf("ふみとどまった後") !== -1) return !!(state.nowState["ふみとどまった後"]);
    if (condition.indexOf("ダメージを受けていなかった場合") !== -1) return false;
    if (condition.indexOf("味方生存者が自身のみ") !== -1) return false;
    var mm;
    if ((mm = condition.match(/^(\d+)ターン目以降/))) return 1 >= Number(mm[1]); // T1: NOW_TURN=1固定
    if ((mm = condition.match(/^(\d+)ターン目以内/))) return 1 <= Number(mm[1]);
    return true; // タイミング系セグメント等は成立扱い
}
// isStateConditionMet（damageCalc.inc:2648-2656）。"/"でAND結合。
function isStateConditionMet(state, condition) {
    condition = String(condition || "");
    if (!condition) return true;
    return condition.split("/").every(function (seg) { return isSingleConditionMet(state, seg.trim()); });
}

// incrementBuff（damageCalc.inc:465-559）。
// 敵VIT/MND(体力/精神)デバフはNOW_BUFF_STATEに直接負値で乗る(damageCalc.inc:516-524相当)。
// rangeが敵スコープ("敵"を含む/"対象")かつPER<0のときのみ体力/精神をDEBUFF側にも複製する。
function incrementBuff(state, timings) {
    Object.keys(state.buffAbility).forEach(function (timing) {
        if (eitherAttrCheck(timing)) {
            var parts = timing.replace(/属性攻撃時|属性攻撃のたび/g, "").split("・");
            var anyMatch = parts.some(function (p) { return timings.indexOf(p + "属性攻撃時") !== -1; });
            if (!anyMatch) return;
        } else if (timings.indexOf(timing) === -1) {
            return;
        }
        var rows = state.buffAbility[timing] || [];
        for (var k = rows.length - 1; k >= 0; k--) {
            var buf = rows[k];
            if (!isKakurituHatsudou(buf.TIME !== undefined ? buf.TIME : 100)) continue;
            if (buf.CONDITION && !isStateConditionMet(state, buf.CONDITION)) continue;
            var range = (!buf.parentRange || buf.parentRange === "自身") ? buf.range : "味方生存者全体";
            var origBufRange = buf.range || "自身";
            var isEnemyVitMndDebuf = (origBufRange.indexOf("敵") !== -1 || origBufRange === "対象") && buf.PER < 0;
            buf.PARAM.forEach(function (p) {
                if (isEnemyVitMndDebuf && (p === "体力" || p === "精神")) {
                    setStatusBuff(state, p, buf.PER, "自身");
                    setDeBuff(state, p, buf.ZAN_T || 4, Math.abs(buf.PER), origBufRange);
                } else {
                    setStatusBuff(state, p, buf.PER, range);
                }
            });
            buf.LIMIT--;
            if (buf.LIMIT <= 0) rows.splice(k, 1);
        }
    });
}

// incrementDamageBuff（damageCalc.inc:561-631）。NO_DUPLICATE_ATTRSは発火前に同名グループの
// 最大PERのみ発火可とする(「(」前で切ったNAME単位)。
function incrementDamageBuff(state, timings) {
    Object.keys(state.damageAbility).forEach(function (timing) {
        if (eitherAttrCheck(timing)) {
            var parts = timing.replace(/属性攻撃時|属性攻撃のたび/g, "").split("・");
            var isTokiSuffix = timing.indexOf("属性攻撃時") !== -1;
            var anyMatch = parts.some(function (p) { return timings.indexOf(p + (isTokiSuffix ? "属性攻撃時" : "属性攻撃のたび")) !== -1; });
            if (!anyMatch) return;
        } else if (timings.indexOf(timing) === -1) {
            return;
        }
        var byAttr = state.damageAbility[timing] || {};
        var noDupMax = {};
        Object.keys(byAttr).forEach(function (attr) {
            (byAttr[attr] || []).forEach(function (row) {
                var name = String(row.NAME).split("(")[0];
                if (IRYOKU_ENGINE_NO_DUPLICATE_ATTRS.indexOf(name) === -1) return;
                var name2 = String(row.NAME).split("/")[0];
                if (noDupMax[name2] === undefined || noDupMax[name2] < row.PER) noDupMax[name2] = row.PER;
            });
        });
        Object.keys(byAttr).forEach(function (attr) {
            var rows = byAttr[attr] || [];
            for (var k = rows.length - 1; k >= 0; k--) {
                var row = rows[k];
                var name2 = String(row.NAME).split("/")[0];
                if (!isKakurituHatsudou(row.TIME !== undefined ? row.TIME : 100)) continue;
                if (noDupMax[name2] !== undefined && noDupMax[name2] > row.PER) continue;
                if (row.CONDITION && !isStateConditionMet(state, row.CONDITION)) continue;
                setDamageBuff(state, attr, row.TURN, row.PER, row.range);
                row.LIMIT--;
                if (row.LIMIT <= 0) rows.splice(k, 1);
            }
        });
    });
}

// incrementDeBuffAbility（damageCalc.inc:633-664）。
function incrementDeBuffAbility(state, timings) {
    Object.keys(state.debuffAbility).forEach(function (timing) {
        if (timings.indexOf(timing) === -1) return;
        var byAttr = state.debuffAbility[timing] || {};
        Object.keys(byAttr).forEach(function (attr) {
            var rows = byAttr[attr] || [];
            for (var k = rows.length - 1; k >= 0; k--) {
                var row = rows[k];
                if (!isKakurituHatsudou(row.TIME !== undefined ? row.TIME : 100)) continue;
                if (row.CONDITION && !isStateConditionMet(state, row.CONDITION)) continue;
                setDeBuff(state, attr, row.TURN, row.PER, row.target || row.range || "敵全体");
                row.LIMIT--;
                if (row.LIMIT <= 0) rows.splice(k, 1);
            }
        });
    });
}

// setTimingAttrs（damageCalc.inc:1362-1367）。
function setTimingAttrs(state, timings) {
    incrementBuff(state, timings);
    incrementDamageBuff(state, timings);
    incrementDeBuffAbility(state, timings);
}

// BE damageCalc.inc:1308-1311
var IRYOKU_ENGINE_ATTACK_WHEN_MAP = { "武器装備時": "常時", "味方が全員生存している時": "常時" };
// trimWhen（damageCalc.inc:1634-1655）。when文字列を登録キー用に正規化する。
function trimWhen(when) {
    when = String(when == null ? "" : when).trim().split(/\s+/)[0];
    when = when.replace(/\(<special_effect=\d+>※適用外条件あり<\/special_effect>\)/g, "");
    // PHP str_replace の順次置換（命中時→時 / (※)除去 / 発動時→を発動後 / /味方が全員生存している場合 除去）
    when = when.replace(/命中時/g, "時").replace(/\(※\)/g, "").replace(/発動時/g, "を発動後").replace(/\/味方が全員生存している場合/g, "");
    if (when.indexOf("を発動後") !== -1) when = when.replace(/\+|「|」|\[追撃\]/g, "");
    return when;
}

// addBuffAbility/addDeBuffAbility（damageCalcAbilityAdd.inc:3-96）。
// 新規バフ/デバフエントリを state.buffAbility[when] に登録する（即時適用ではない。
// 登録後、該当タイミングでincrementBuffが発火する）。isDebuff=trueならPERの符号を反転する。
function addBuffAbility(state, abInfo, abCategory, isDebuff) {
    var isBuffMain = String(abCategory.main).indexOf("(バフ)") !== -1 || abCategory.main === "バフ";
    var isDebufMain = String(abCategory.main).indexOf("(デバフ)") !== -1 || abCategory.main === "デバフ";
    if (!isDebuff && !isBuffMain) return;
    if (isDebuff && !isDebufMain) return;

    var isSelfDebuf = abCategory.main === "自身弱化(デバフ)" || (abCategory.main === "デバフ" && abCategory.target === "自身");
    var subs = [];
    if (!isDebuff || isSelfDebuf) {
        subs = (abCategory.sub === "全ステ") ? ["腕力", "器用さ", "素早さ", "知力"]
            : String(abCategory.sub).split("と").filter(function (t) { return /腕力|器用さ|素早さ|知力/.test(t); });
    } else {
        subs = (abCategory.sub === "全ステ") ? ["体力", "精神"]
            : String(abCategory.sub).split("と").filter(function (t) { return /体力|精神/.test(t); });
    }
    if (!subs.length) return;

    var per = parseFloat(String(abCategory.size).replace(/[^0-9.\-]/g, ""));
    if (isNaN(per)) return; // PHP is_numeric チェック（damageCalcAbilityAdd.inc:70-74）相当。JSはexit不可のためno-op
    var turn = parseInt(String(abCategory.limitTurn || "").replace(/[^0-9\-]/g, ""), 10);
    var time = parseInt(String(abCategory.time).replace(/[^0-9\-]/g, ""), 10);
    var maxLimit = parseInt(String(abCategory.maxLimit).replace(/[^0-9\-]/g, ""), 10);
    turn = isNaN(turn) ? 999 : turn;
    maxLimit = isNaN(maxLimit) ? 999 : maxLimit;

    // when 正規化（damageCalcAbilityAdd.inc:62-69）。condition が優先だが、状態条件("状態の場合"/"状態でない場合")は when を使う。
    var conditionSrc = (abCategory.condition !== undefined && abCategory.condition !== null) ? abCategory.condition : abCategory.when;
    var when;
    if (String(conditionSrc).indexOf("状態の場合") !== -1 || String(conditionSrc).indexOf("状態でない場合") !== -1) {
        when = trimWhen(abCategory.when);
    } else {
        when = trimWhen(conditionSrc);
    }
    when = IRYOKU_ENGINE_ATTACK_WHEN_MAP[when] || when;
    when = String(when).trim();
    var range = (abCategory.target !== undefined && abCategory.target !== "")
        ? abCategory.target
        : (String(abCategory.main).indexOf("全員強化") !== -1 ? "味方生存者全体" : "自身");

    state.buffAbility[when] = state.buffAbility[when] || [];
    state.buffAbility[when].push({
        NAME: abInfo.Name, PARAM: subs, PER: per * (isDebuff ? -1 : 1), TIME: time,
        ZAN_T: turn, LIMIT: maxLimit, range: range, parentRange: abInfo.range || "自身",
        CONDITION: abCategory.condition || ""
    });
}
function addDeBuffAbility(state, abInfo, abCategory) { addBuffAbility(state, abInfo, abCategory, true); }

// addDamageAbility（damageCalcAbilityAdd.inc:98-224）。防御弱化系(sub)はDEBUFF側に振り替える。
function addDamageAbility(state, abInfo, abCategory) {
    var sub = abCategory.sub;
    if (sub === "ディフェンスダウン" && abCategory.size) {
        var ddm = String(abCategory.size).match(/ディフェンスダウン\(([^)]+)\)/);
        if (ddm) sub = "ディフェンスダウン(" + ddm[1] + ")";
    }
    if (!isAttackAbilityName(sub)) return;
    var attackAttr = getDamageAttrPattern(sub);
    if (attackAttr === "") return;

    var turn = parseInt(String(abCategory.turn).replace(/[^0-9\-]/g, ""), 10);
    var per = parseFloat(String(abCategory.size).replace(/[^0-9.\-]/g, ""));
    if (String(abCategory.main || "").indexOf("ダメージ弱化") !== -1 && per > 0) per = -per;
    if (isNaN(per)) return;
    turn = isNaN(turn) ? 999 : turn;
    // TIME/LIMIT導出（damageCalcAbilityAdd.inc:102,124-131,187-188）。time はNaNのままでもよい（PHP同様ガードしない）
    var time = parseInt(String(abCategory.time).replace(/[^0-9\-]/g, ""), 10);
    var maxLimit = parseInt(String(abCategory.maxLimit).replace(/[^0-9\-]/g, ""), 10);
    maxLimit = isNaN(maxLimit) ? 999 : maxLimit;

    // when 正規化（damageCalcAbilityAdd.inc:136-155）。「○○/××を装備している場合」は前半をwhen・
    // 後半(を装備している場合を除去)を attackAttr に上書きする。
    // (bare "WeaponType装備時"→常時 分岐は実データに0件のため未移植=to-reachでない)
    var conditionSrc2 = (abCategory.condition !== undefined && abCategory.condition !== null) ? abCategory.condition : abCategory.when;
    var whenSrc = (String(conditionSrc2).indexOf("状態の場合") !== -1 || String(conditionSrc2).indexOf("状態でない場合") !== -1) ? abCategory.when : conditionSrc2;
    var when = trimWhen(whenSrc);
    if (String(conditionSrc2).indexOf("装備している場合") !== -1 && String(conditionSrc2).indexOf("/") !== -1) {
        var tmp = String(conditionSrc2).split("/");
        when = tmp[0];
        attackAttr = tmp[1].replace("を装備している場合", "");
    }
    when = IRYOKU_ENGINE_ATTACK_WHEN_MAP[when] || when;
    when = String(when).trim();

    var range;
    if (abInfo.range !== undefined && String(abCategory.main).indexOf("ダメージ強化(") === -1
        && !(abCategory.main === "ダメージ強化" && abCategory.target !== undefined)) {
        range = abInfo.range;
    } else if (abCategory.target !== undefined && abCategory.target !== "") {
        range = abCategory.target;
    } else {
        range = String(abCategory.main).indexOf("ダメージ強化(全体") !== -1 ? "味方生存者全体"
            : (String(abCategory.main).indexOf("ダメージ強化(自身以外") !== -1 ? "自身以外" : "自身");
    }

    if (isEnemyDefenceDebuffSub(sub)) {
        if (String(range).indexOf("自身") !== -1) return; // 自己防御弱化はデメリット効果でありdrop
        state.debuffAbility[when] = state.debuffAbility[when] || {};
        state.debuffAbility[when][attackAttr] = state.debuffAbility[when][attackAttr] || [];
        state.debuffAbility[when][attackAttr].push({ NAME: abInfo.Name, PER: per, TURN: turn, TIME: time, LIMIT: maxLimit, target: range, CONDITION: abCategory.condition || "" });
        return;
    }
    state.damageAbility[when] = state.damageAbility[when] || {};
    state.damageAbility[when][attackAttr] = state.damageAbility[when][attackAttr] || [];
    state.damageAbility[when][attackAttr].push({ NAME: abInfo.Name, PER: per, TURN: turn, TIME: time, LIMIT: maxLimit, range: range, CONDITION: abCategory.condition || "" });
}

// _tryStoreEnemyMarker（damageCalc.inc:734-750）。
function tryStoreEnemyMarker(state, row, abCategory) {
    var outerTgt = row.outer_target || "";
    if (outerTgt.indexOf("敵") === -1 && outerTgt !== "対象") return false;
    if (abCategory.main !== "デバフ" && abCategory.main !== "被ダメージ増加") return false;
    var when = abCategory.condition || abCategory.when || "";
    if (when.indexOf("受け") === -1) return false;
    var lim = parseInt(String(abCategory.maxLimit || "").replace(/[^0-9]/g, ""), 10);
    state.enemyMarkerAbility.push({ Name: row.Name || "", attr: abCategory, when: when, LIMIT: lim || 999, target: outerTgt });
    return true;
}

// _consumeAddAbilityEntry（damageCalc.inc:2802-2825）。
function consumeAddAbilityEntry(state, timing, idx) {
    var row = (state.addAbility[timing] || [])[idx];
    state.addAbility[timing].splice(idx, 1);
    if (!row) return;
    var baseName = row.BaseName || "";
    if (!baseName) return;
    var isEnemyTarget = (row.outer_target || "").indexOf("敵") !== -1 || row.outer_target === "対象";
    var side = isEnemyTarget ? "enemy" : "self";
    var stillActive = Object.keys(state.addAbility).some(function (t) {
        return (state.addAbility[t] || []).some(function (e) { return (e.BaseName || "") === baseName; });
    });
    if (stillActive) return;
    state.activeStates[side] = state.activeStates[side].filter(function (n) { return n !== baseName; });
}

// addAbilityFromAbilityWithBuff（damageCalcAbilityAdd.inc:1018-1198）。
// SUPPORT_RANKING分岐(partyGrantMult)は常に1固定（iryoku.htmlは単体ダメ計算専用のため。Global Constraints参照）。
// main="アビリティ付与"の再帰付与（ABILITY_MASTER要のネスト解決）は実装しない（既知の限界）。
function addAbilityFromAbilityWithBuff(state, timings) {
    Object.keys(state.addAbility).forEach(function (timing) {
        if (eitherAttrCheck(timing)) {
            if (timing.indexOf("装備") !== -1) return;
            var parts = timing.replace(/属性攻撃時|属性攻撃のたび/g, "").split("・");
            var anyMatch = parts.some(function (p) { return timings.indexOf(p + "属性攻撃時") !== -1; });
            if (!anyMatch) return;
        } else if (timings.indexOf(timing) === -1) {
            return;
        }
        var rows = state.addAbility[timing] || [];
        for (var idx = rows.length - 1; idx >= 0; idx--) {
            var row = rows[idx];
            if (!isKakurituHatsudou(row.time !== undefined ? row.time : 100)) continue;
            if (row.outer_condition) {
                if (String(row.outer_condition).indexOf("装備している場合") !== -1) continue;
                if (!isStateConditionMet(state, row.outer_condition)) continue;
            }
            var abCategory = row.attr;
            if (abCategory.main !== "アビリティ付与" && abCategory.condition && !isStateConditionMet(state, abCategory.condition)) continue;

            var isSelfDebufV2 = (abCategory.main === "デバフ" && abCategory.target === "自身");
            var consumed = true;
            if (tryStoreEnemyMarker(state, row, abCategory)) {
                // 敵付与マーカー登録（発火は fireEnemyMarkersOnHit）
            } else if (String(abCategory.main).indexOf("強化(バフ") !== -1
                || String(abCategory.main).indexOf("自身弱化(デバフ") !== -1
                || abCategory.main === "バフ" || isSelfDebufV2) {
                abCategory.limitTurn = row.turn;
                addBuffAbility(state, row, abCategory);
            } else if (/デバフ/.test(abCategory.main)) {
                abCategory.limitTurn = row.turn;
                addDeBuffAbility(state, row, abCategory);
            } else if (abCategory.main === "アビリティ付与") {
                // ABILITY_MASTER が無いためネスト解決不可。既知の限界として no-op。
            } else if (String(abCategory.main).indexOf("ダメージ軽減") !== -1) {
                // no-op（火力に無関係）
            } else if (String(abCategory.main).indexOf("ダメージ強化(自身以外)") !== -1) {
                // no-op（元PHPも同様にスキップ）
            } else if (String(abCategory.main).indexOf("ダメージ強化") !== -1
                || abCategory.main === "被ダメージ増加" || String(abCategory.main).indexOf("ダメージ弱化") !== -1) {
                if (abCategory.main === "被ダメージ増加") {
                    var outerTarget = row.outer_target || "";
                    var isEnemyGrant = outerTarget.indexOf("敵") !== -1 || outerTarget === "対象" || outerTarget === "";
                    var isDefDown = isEnemyDefenceDebuffSub(abCategory.sub || "");
                    if (!isEnemyGrant && !isDefDown) { consumed = false; }
                }
                if (consumed) {
                    var range;
                    if (abCategory.target !== undefined && abCategory.target !== "") {
                        range = abCategory.target;
                        if (abCategory.main === "被ダメージ増加" && range === "自身") range = "対象";
                    } else {
                        range = row.range !== undefined ? row.range
                            : (String(abCategory.main).indexOf("(全体)") !== -1 ? "味方生存者全体" : "自身");
                    }
                    abCategory.limitTurn = row.turn;
                    addDamageAbility(state, row, abCategory);

                    var attr = getDamageAttrPattern(abCategory.sub);
                    var per = parseFloat(String(abCategory.size).replace(/[^0-9.\-]/g, ""));
                    if (String(abCategory.main).indexOf("ダメージ弱化") !== -1 && per > 0) per = -per;
                    if (attr !== "" && !isNaN(per)) {
                        if (abCategory.when === "常時" || abCategory.when === "味方が全員生存している時") {
                            setDamageBuff(state, attr, row.turn, per, range);
                        } else if (abCategory.sub === "ヒートアップ(HP満タン)") {
                            setDamageBuff(state, "HP満タン時", row.turn, per, range);
                        } else if (String(abCategory.when).indexOf("HP") !== -1) {
                            setDamageBuff(state, abCategory.when, row.turn, per, range);
                        }
                    }
                }
            } else {
                consumed = false;
            }
            if (!consumed) continue;
            row.maxLimit--;
            if (row.maxLimit <= 0) consumeAddAbilityEntry(state, timing, idx);
        }
    });
}

// _enemyMarkerHitMatches（damageCalc.inc:753-768）。
function enemyMarkerHitMatches(when, skill, attackAttrs, resist) {
    var cond = String(when).split("/")[0];
    if (cond === "攻撃を受けた時" || cond === "攻撃を受けるたび") return true;
    if (cond.indexOf("直接攻撃を受け") !== -1) return skill.AttackMethod === "直接";
    if (cond.indexOf("間接攻撃を受け") !== -1) return skill.AttackMethod === "間接";
    if (cond.indexOf("Weak攻撃を受け") !== -1) return resist <= -35;
    if (cond.indexOf("Resist攻撃を受け") !== -1) return resist >= 35;
    var m = cond.match(/^(.+?)属性攻撃を受け/);
    if (m) return m[1].split("・").some(function (a) { return attackAttrs.indexOf(a) !== -1; });
    return false; // 技名固有トリガーは既存の"{技名}を受けるたび"側で処理する
}

// fireEnemyMarkersOnHit（damageCalc.inc:775-816）。効果は次hitから反映される
// （このリプレイでは _calc相当の直後に呼ぶことで自然にそうなる。呼び出し順序はTask 7で担保する）。
function fireEnemyMarkersOnHit(state, skill, resist) {
    if (!state.enemyMarkerAbility.length) return;
    if (skill.AttackArea === "味方単体" || skill.AttackArea === "味方全体" || skill.AttackArea === "自身") return;
    if (skill.Id === "wait" || skill.Id === "stop") return;
    var attackAttrs = String(skill.AttackAttributes || "").split(",");
    for (var k = state.enemyMarkerAbility.length - 1; k >= 0; k--) {
        var m = state.enemyMarkerAbility[k];
        var attr = m.attr;
        if (!enemyMarkerHitMatches(m.when, skill, attackAttrs, resist)) continue;
        if (!isKakurituHatsudou(attr.time !== undefined ? attr.time : 100)) continue;
        var per = parseInt(String(attr.size || "").replace(/[^0-9|\-]/g, ""), 10); // PHP:/[^0-9|\-]/ に合わせ|を残す(parseIntが|で止まる)
        if (!(per > 0)) continue;
        var turnN = parseInt(String(attr.turn || "").replace(/[^0-9\-]/g, ""), 10) || 4;
        var fired = false;
        if (attr.main === "デバフ") {
            var subs = (attr.sub === "全ステ") ? ["体力", "精神"] : String(attr.sub || "").split("と");
            subs.forEach(function (p) {
                p = p.trim();
                if (p !== "体力" && p !== "精神") return;
                setStatusBuff(state, p, -per, "自身");
                setDeBuff(state, p, turnN, per, m.target);
                fired = true;
            });
        } else if (attr.main === "被ダメージ増加" && isEnemyDefenceDebuffSub((attr.sub || "") + (attr.size || ""))) {
            var ddSub = (attr.sub !== "" && attr.sub != null) ? attr.sub : attr.size;
            var attrKey = getDamageAttrPattern(ddSub);
            if (attrKey !== "") { setDeBuff(state, attrKey, turnN, per, m.target); fired = true; }
        }
        if (!fired) continue;
        m.LIMIT--;
        if (m.LIMIT <= 0) state.enemyMarkerAbility.splice(k, 1);
    }
}

// recalcBuffStatus（damageCalc.inc:1044-1071）。
// charBasePlusLimit = {STR,DEX,AGI,INT}（既存 CURRENT_CHAR_BASE = charMax + LIMIT_BASE(529) と同値）。
// styleMaxByKey = {STR,DEX,AGI,INT}（既存 #styleSTR等の入力値 = NOW_STYLE["MAXkey"]）。
function recalcBuffStatus(state, isOverDrive, charBasePlusLimit, styleMaxByKey) {
    var param = {};
    ["STR", "DEX", "AGI", "INT"].forEach(function (key) {
        var base = charBasePlusLimit[key];
        var addPer = (state.nowBuffState[key] && state.nowBuffState[key].PER) || 0;
        if (isOverDrive) addPer += 20;
        addPer = Math.min(addPer, IRYOKU_ENGINE_MAX_STATUS_BUFF);
        var add = Math.floor(base * addPer / 100);
        param[key] = styleMaxByKey[key] + add;
    });
    return param;
}

// 敵実効VIT/MND（damageCalc.inc:2127-2130相当。calcConstWpPowerAndStatus内のfloor(base×(100+per)/100)）。
function recalcEnemyStat(state, baseStat, kind) {
    var per = (state.nowBuffState[kind] && state.nowBuffState[kind].PER) || 0;
    return Math.floor(baseStat * (100 + per) / 100);
}

// _setNowState（damageCalc.inc:2935-2946）。SPEED_ABILITY(行動順補正/idDeley)はT1リプレイでは
// 消費する分岐が無いため実装しない（既知の限界。isStateConditionMetの行動前/後判定は常に「行動後」扱い）。
function setNowState(state, timing) {
    var rows = state.criticalAbility[timing] || [];
    for (var k = rows.length - 1; k >= 0; k--) {
        var row = rows[k];
        state.nowState.criticalAdd = { CriticalTargets: row.CriticalTargets, ZAN_T: row.ZAN_T };
        row.ZAN_T--;
        if (row.ZAN_T === 0) rows.splice(k, 1);
    }
}

// isCriticalAttack（damageCalc.inc:3001-3024）。種族限定(獣/魚等)はenemyType未提供のため
// 常にfalse側（"全"の無条件ケースのみ自動検出。種族限定は既存の手動isCritトグルで代替する）。
function isCriticalAttack(state, skill, enemyType) {
    var myCrit = [];
    if (state.nowState.criticalAdd) {
        if (state.nowState.criticalAdd.CriticalTargets === "全") return true;
        myCrit = String(state.nowState.criticalAdd.CriticalTargets).split(",");
    }
    if (!enemyType) return false;
    myCrit = myCrit.concat(String(skill.CriticalTargets || "").split(","));
    return myCrit.some(function (c) { return c !== "" && enemyType.indexOf(c) !== -1; });
}

// isDisableBuffWhen（damageCalc.inc:2770-2798）。T1リプレイでは使用回数=1回目固定・NOW_TURN=1固定。
function isDisableBuffWhen(state, when, skill) {
    when = String(when || "");
    if (!when) return false;
    if (when.indexOf("回目に使用した場合") !== -1) return when !== "1回目に使用した場合"; // T1=初回使用
    if (when.indexOf("状態でない場合") !== -1 || when.indexOf("状態の場合") !== -1) return !isStateConditionMet(state, when);
    // PHP: empty($NOW_BUFF_STATE["INT"])。INTキーは setStatusBuff が一度でも触れると生成され以後消えないため、
    // 「一度でも知力に触れたか」で判定する（PER が後で相殺され 0 に戻っても disabled にはならない = sticky）。
    if (when === "知力が上昇している場合") return state.nowBuffState.INT === undefined;
    if (when === "腕力・素早さのいずれかが上昇している場合") return false; // エンジンの暫定挙動（常に有効）を踏襲
    if (when === "腕力・素早さが上昇していない場合") return true;          // 同上
    return false;
}

// incrementSkillBuffDebuff（damageCalc.inc:2476-2628）の技Mod処理部。
// SKILL_MASTER[..].Mod（FE配布データ data_SKILLMASTER.js に含まれる）を読み、per-hitでstateへ反映する。
// エンジンでは技Mod効果もNOW_DAMAGE_STATE/NOW_BUFF_STATEに積まれ次の発動へ持ち越されるため、
// 閉形式(computeHitAbilityPer)ではなくstateful適用が必須（チェーン横断アンカーの再現に必須）。
// Size'>'のアビ付与サブ効果はABILITY_MASTER必須のため本関数では扱わず（returnでスキップ）、
// 事前解決済みIRYOKU_SKILLMARKERをapplyMarkerRowsOnHitで別途反映する（二重適用しないこと）。
// hitCountはSKILL_USE_COUNT_FOR_PER相当（技名"[追撃]除去・+残し"キーの通しhit数。呼び出し側が管理）。
function incrementSkillBuffDebuff(state, skillInfo, hitCount, isPre) {
    var rank = (skillInfo.rank !== undefined) ? skillInfo.rank : 99;
    if (String(skillInfo.DeBuff || "").indexOf("自身に気絶") !== -1) return;
    (skillInfo.Mod || []).forEach(function (modData) {
        var p = modData.Target;
        if (!p) return;
        if (p.indexOf("カウンター") !== -1) { state.nowState[p] = { ZAN_T: modData.Turn }; return; }
        if (String(modData.Size || "").indexOf(">") !== -1) return; // '>'グラントはapplyMarkerRowsOnHit側
        // 注: エンジンの strpos($p,"自身以外")===TRUE は恒偽（strposはint|false）のため
        // 「自身以外」Modはスキップされない。この癖をそのまま踏襲する（スキップ分岐を書かない）。
        if (isPre && p.indexOf("攻撃前") === -1) return;
        if (!isPre && p.indexOf("攻撃前") !== -1) return;
        if (p === "攻撃強化(男性)") return;
        var modPer = parseInt(String(modData.Per !== undefined ? modData.Per : 100).replace(/[^0-9\-]/g, ""), 10);
        if (modPer < 100) {
            var table = IRYOKU_ENGINE_PER_TABLE[modPer];
            if (!table) return;
            if (!table[hitCount % table.length]) return;
        }
        if (isDisableBuffWhen(state, modData.When || "", skillInfo)) return;
        var per;
        if (p.indexOf("エクストラフォース") !== -1) {
            per = parseFloat(modData.Rank1); // 0.5等の小数をそのまま使う
        } else if (modData.Rank99 === "" || modData.Rank99 === "-" || modData.Rank99 === undefined || rank === 1) {
            per = parseInt(modData.Rank1, 10);
        } else {
            per = parseInt(modData.Rank99, 10);
        }
        var range = (p.indexOf("全員") !== -1) ? "味方生存者全体" : "自身";
        var paramName = p.replace(/攻撃前に|全員の|全員に|自身に/g, "");
        if (IRYOKU_ENGINE_PARAM_NAME[paramName] || paramName === "全ステ") {
            if (!/自身の/.test(p)) {
                var ps = (paramName === "全ステ") ? ["腕力", "器用さ", "素早さ", "知力", "体力", "精神"] : [paramName];
                ps.forEach(function (pp) {
                    // 腕〜知はバフ(per>0のみ)、体精はデバフ(per<0のみ)（damageCalc.inc:2602-2608）
                    if (/腕力|器用さ|素早さ|知力/.test(pp) && per > 0) setStatusBuff(state, pp, per, range);
                    else if (/体力|精神/.test(pp) && per < 0) setStatusBuff(state, pp, per);
                });
            } else if (/腕力|器用さ|素早さ|知力/.test(p)) {
                setStatusBuff(state, paramName, per); // 自身のデバフ
            }
        } else if (isAttackAbilityName(paramName)) {
            if (typeof per !== "number" || isNaN(per)) return;
            var absPer = (p === "自身に攻撃弱化") ? per : Math.abs(per);
            var attackAttr = getDamageAttrPattern(paramName);
            if (attackAttr !== "") {
                // Turn列: "999"のみALWAYS、空/数値はTEMP（PHPの ""==999 はPHP8でfalse。T1では読み出し結果は同値）
                var turnN = parseInt(String(modData.Turn || "").replace(/[^0-9\-]/g, ""), 10);
                setDamageBuff(state, attackAttr, (turnN === 999) ? 999 : (isNaN(turnN) ? 1 : turnN), absPer, range);
            }
        }
    });
}
function incrementSkillBuffDebuffPreCheck(state, skillInfo, hitCount) {
    return incrementSkillBuffDebuff(state, skillInfo, hitCount, true);
}

// IRYOKU_SKILLMARKER（Size'>'アビ付与サブ効果の事前解決済み行。Task J出力）をper-hitでstateに反映する。
// エンジンの incrementSkillBuffDebuff 2501-2553（'>'分岐）相当。maxLimitはstate.skillModAbCounterで管理。
// 行形式: {src, ch:"dmg"|"stat", tgt:"enemy"|"self", b|stat, p, sign?, maxLimit, trigger?, cond?}
var IRYOKU_ENGINE_ATTR8 = ["斬", "打", "突", "熱", "冷", "雷", "陽", "陰"];
function applyMarkerRowsOnHit(state, markerRows, skillInfo, counterKeyPrefix) {
    var attrs = String(skillInfo.AttackAttributes || "").split(",");
    var skillName = String(skillInfo.Name || "").replace(/\+|\[追撃\]/g, "");
    (markerRows || []).forEach(function (m, idx) {
        if (m.cond && m.cond.indexOf(skillName) === -1) return; // SC技名gating
        if (m.trigger) {
            // "斬属性攻撃を受けた時"等の属性接頭辞トリガーはその属性を持つhitのみ（iryoku_core._matchTriggerと同規則）
            for (var i = 0; i < IRYOKU_ENGINE_ATTR8.length; i++) {
                if (m.trigger.indexOf(IRYOKU_ENGINE_ATTR8[i] + "属性") === 0) {
                    if (attrs.indexOf(IRYOKU_ENGINE_ATTR8[i]) === -1) return;
                    break;
                }
            }
        }
        var key = counterKeyPrefix + "_" + idx;
        var maxLimit = (m.maxLimit === undefined || m.maxLimit === null) ? 999 : m.maxLimit;
        var used = state.skillModAbCounter[key] || 0;
        if (used >= maxLimit) return;
        state.skillModAbCounter[key] = used + 1;
        if (m.ch === "dmg") {
            setDamageBuff(state, m.b, 999, m.p, m.tgt === "enemy" ? "敵生存者全体" : "自身");
        } else if (m.ch === "stat") {
            // statは"VIT"/"MND"/"STR"等のENキー（PARAM_NAME変換済み）なのでnowBuffStateへ直接加算する
            var sign = (m.sign === undefined) ? (m.tgt === "enemy" ? -1 : 1) : m.sign;
            state.nowBuffState[m.stat] = state.nowBuffState[m.stat] || { PER: 0 };
            state.nowBuffState[m.stat].PER += sign * m.p;
        }
    });
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        createEngineState, setDamageBuff, setStatusBuff, setDeBuff, getAbilityValue,
        applyDefenceDownToAbility, getDamageAttrPattern, isAttackAbilityName, isEnemyDefenceDebuffSub,
        eitherAttrCheck, isKakurituHatsudou, isSingleConditionMet, isStateConditionMet,
        incrementBuff, incrementDamageBuff, incrementDeBuffAbility, setTimingAttrs,
        addBuffAbility, addDeBuffAbility, addDamageAbility, tryStoreEnemyMarker, consumeAddAbilityEntry,
        addAbilityFromAbilityWithBuff, enemyMarkerHitMatches, fireEnemyMarkersOnHit,
        recalcBuffStatus, recalcEnemyStat, setNowState, isCriticalAttack,
        isDisableBuffWhen, incrementSkillBuffDebuff, incrementSkillBuffDebuffPreCheck, applyMarkerRowsOnHit,
        IRYOKU_ENGINE_MAX_STATUS_BUFF, IRYOKU_ENGINE_MAX_FIRE_DAMAGE, IRYOKU_ENGINE_NO_DUPLICATE_ATTRS,
        IRYOKU_ENGINE_PARAM_NAME, IRYOKU_ENGINE_RANGE_LIST, IRYOKU_ENGINE_ATTACK_ATTR_MAP,
        IRYOKU_ENGINE_PER_TABLE, IRYOKU_ENGINE_ATTR8
    };
}
