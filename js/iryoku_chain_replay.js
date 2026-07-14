// iryoku_chain_replay.js — GAP H Task R: 追撃チェーンを engine忠実 per-hit ループでリプレイし、
// 各(skillIndex,hit)の {ability,ex,status,enemyStatEff} を記録する。
// 完全ライブstate駆動: スタイルアビ=registry(IRYOKU_REG)+トリガー機構、技Mod=incrementSkillBuffDebuff、
// '>'グラント=IRYOKU_SKILLMARKERのstateful適用（すべて iryoku_engine.js）。
// エンジンでは技Mod効果も同じNOW_DAMAGE_STATE/NOW_BUFF_STATEに積まれ次の発動へ持ち越されるため、
// 発動内閉形式(computeHitAbilityPer等)をここで使ってはならない（チェーン横断アンカーが壊れる＋二重計上）。
// チェーン構造は data_IRYOKU_CHAIN.js（Task O）をlookupするのみで、FEでは再構築しない。

(function (root, factory) {
    if (typeof module !== "undefined" && module.exports) {
        var engine = require("./iryoku_engine.js");
        var core = require("./iryoku_core.js");
        module.exports = factory(engine, core);
    } else {
        root.replayChain = factory(root, root).replayChain;
    }
})(typeof self !== "undefined" ? self : this, function (engineNs, coreNs) {

    // ブラウザ直読み込み時は engineNs===coreNs===window なので、グローバル関数をそのまま参照する。
    var createEngineState = engineNs.createEngineState;
    var setTimingAttrs = engineNs.setTimingAttrs;
    var addAbilityFromAbilityWithBuff = engineNs.addAbilityFromAbilityWithBuff;
    var fireEnemyMarkersOnHit = engineNs.fireEnemyMarkersOnHit;
    var recalcBuffStatus = engineNs.recalcBuffStatus;
    var recalcEnemyStat = engineNs.recalcEnemyStat;
    var setNowState = engineNs.setNowState;
    var isCriticalAttack = engineNs.isCriticalAttack;
    var getAbilityValue = engineNs.getAbilityValue;
    var applyDefenceDownToAbility = engineNs.applyDefenceDownToAbility;
    var incrementSkillBuffDebuff = engineNs.incrementSkillBuffDebuff;
    var incrementSkillBuffDebuffPreCheck = engineNs.incrementSkillBuffDebuffPreCheck;
    var applyMarkerRowsOnHit = engineNs.applyMarkerRowsOnHit;
    var RANGE_LIST = engineNs.IRYOKU_ENGINE_RANGE_LIST;
    var MAX_FIRE_DAMAGE = engineNs.IRYOKU_ENGINE_MAX_FIRE_DAMAGE;

    // iryoku_core からはEF名前付き条件の判定のみ共用する（Step 0のadditive export。
    // resolveT1Ability/computeHitAbilityPer等は使わない — Global Constraints参照）。
    var isEfNamedConditionMet = coreNs._isEfNamedConditionMet;
    var EF_CONDITION_MAP = coreNs.IRYOKU_EF_CONDITION_MAP;

    // calcDamage の ability/ex 決定部（damageCalc.inc:1369-1520）を「静的rows」ではなく
    // 「ライブ state.nowDamageState/nowDebuffState」から読む形で忠実移植する。
    // resolveT1Abilityとは別データソース(スタイルアビ由来 vs 技Mod由来)を読むため二重計上しない。
    function calcAbilityAndEx(state, opts) {
        var skillInfo = opts.skillInfo, weaponType = opts.weaponType;
        // 補助技は damageCalc.inc:1373-1375 で早期return([0,0,1])。ability/ex中立値を返す。
        if (String(skillInfo.FlavorText || "").indexOf("補助") === 0) {
            return { ability: 0, ex: 1, isCrit: false };
        }
        var targetAttr = { "全": 1 };
        targetAttr[weaponType] = 1;
        String(skillInfo.AttackAttributes || "").split(",").forEach(function (a) { if (a) targetAttr[a] = 1; });
        (RANGE_LIST[skillInfo.AttackArea] || []).forEach(function (r) { targetAttr[r] = 1; });
        targetAttr[skillInfo.AttackArea] = 1;

        // NOW_DAMAGE_STATEの複合属性キー("斬・冷"等)がtargetAttrと交差するなら追加(damageCalc.inc:1393-1399)
        Object.keys(state.nowDamageState).forEach(function (key) {
            if (key.indexOf("・") === -1 || key.indexOf("エクストラフォース") !== -1) return;
            if (key.split("・").some(function (s) { return targetAttr[s]; })) targetAttr[key] = 1;
        });

        var skillName = String(skillInfo.Name || "").replace(/\+|\[追撃\]/g, "");
        targetAttr[skillName] = 1;
        targetAttr[skillName + "を発動後"] = 1;
        if (opts.isOD) { targetAttr["OD攻撃"] = 1; targetAttr["連携攻撃"] = 1; }
        targetAttr[opts.isRoundCalcOrTurn1 !== false ? "HP満タン時" : "HPが満タンではない時"] = 1;
        if (opts.resist <= -35) targetAttr["Weak攻撃"] = 1;
        targetAttr[skillInfo.SkillType + "攻撃"] = 1;
        targetAttr[skillInfo.AttackMethod + "攻撃"] = 1;
        targetAttr[skillInfo.AttackMethod] = 1;

        var isCrit = opts.isCrit || isCriticalAttack(state, skillInfo, opts.enemyType);
        var ability = 0;
        if (isCrit) { targetAttr["Critical攻撃"] = 1; ability += 20; }

        Object.keys(targetAttr).forEach(function (attr) { ability += getAbilityValue(state, attr); });

        var defenceDownAttrs = [weaponType].concat(String(skillInfo.AttackAttributes || "").split(",").filter(Boolean));
        ability += applyDefenceDownToAbility(state.nowDebuffState, defenceDownAttrs);

        var efConditions = Object.assign({}, targetAttr);
        efConditions[skillInfo.SkillType] = 1;
        if (opts.resist <= -35) efConditions["Weak"] = 1;
        if (opts.isOD) { efConditions["OD"] = 1; efConditions["連携"] = 1; }
        if (isCrit) efConditions["Critical"] = 1;
        if (efConditions["全体"] || efConditions["範囲"]) { efConditions["全体"] = 1; efConditions["範囲"] = 1; }

        var extraForce = 0;
        var efPrefix = "エクストラフォース";
        Object.keys(state.nowDamageState).forEach(function (stateKey) {
            if (stateKey.indexOf(efPrefix) !== 0) return;
            var efCond = stateKey.slice(efPrefix.length);
            if (efCond === "") return;
            // 名前付き条件（キャラ/シリーズ/技名。例: 神憑りの力）を先に全体照合し、
            // マッチしなければ "・" AND分割（damageCalc.inc:1487-1517と同順。単純AND分割だけだと
            // こよみの エクストラフォース神憑りの力 +0.75 を落とし ex=2.75 が再現できない）。
            var allMet;
            var efCondStripped = efCond.split("/")[0]; // "/特大"等のサフィックス除去
            if (EF_CONDITION_MAP[efCond] !== undefined || EF_CONDITION_MAP[efCondStripped] !== undefined) {
                allMet = isEfNamedConditionMet(efCond, opts.skillInfo, opts.charInfo);
            } else if (efConditions[efCond]) {
                allMet = true;
            } else {
                allMet = efCond.split("・").every(function (part) {
                    return !!efConditions[part] || isEfNamedConditionMet(part, opts.skillInfo, opts.charInfo);
                });
            }
            if (allMet) extraForce += getAbilityValue(state, stateKey);
        });
        extraForce += 1;
        ability = Math.min(ability, MAX_FIRE_DAMAGE);

        return { ability: ability, ex: extraForce, isCrit: isCrit };
    }

    // per(skillIndex,hit)のhit後トリガー文字列群を「ptごとに」組み立てる（damageCalc.inc:1888-1944）。
    // ⚠エンジンは foreach ptList as pt でptごとに build→fire する。一括にすると「時」で付与された
    // アビが同hit内の「のたび」パスで発火するカスケードを取りこぼすため、呼び出し側もptごとに回すこと。
    function buildHitTriggers(skillInfo, opts, isOD, isCrit, isFirstOfChain, i, pt) {
        var list = [];
        if (skillInfo.Id === "normal") {
            list.push("通常攻撃" + pt, skillInfo.SkillType + "攻撃" + pt);
        } else {
            var s = String(skillInfo.Name || "").replace("[追撃]", ""); // '+'は残す
            list.push(skillInfo.SkillType + "攻撃" + pt, s + "を命中させた" + pt);
            if (pt === "のたび") list.push(s + "を受けるたび");
        }
        if (isOD) list.push("OD攻撃" + pt);
        (RANGE_LIST[skillInfo.AttackArea] || []).forEach(function (r) { list.push(r + pt); });
        list.push("攻撃" + pt);
        list.push("攻撃" + pt + "/HP満タンの場合"); // T1は常に満タン側（:1705,1917）
        list.push(skillInfo.AttackMethod === "直接" ? "直接攻撃" + pt : "間接攻撃" + pt);
        var attrs = String(skillInfo.AttackAttributes || "").split(",").filter(Boolean);
        if (attrs.length > 1) {
            list.push(attrs[0] + "+" + attrs[1] + "属性攻撃" + pt);
            list.push(attrs[1] + "+" + attrs[0] + "属性攻撃" + pt);
        }
        attrs.forEach(function (a) { list.push(a + "属性攻撃" + pt); });
        if (opts.resist <= -35) {
            // エンジンはpt条件なしで毎ptパスに"Weak攻撃時(初撃)"を積む（:1934-1939のptループ内）。
            // 同一文字列が複数パスで発火しLIMITを消費する挙動も含めて忠実に踏襲する。
            if (isFirstOfChain && i === 1) list.push("Weak攻撃時(初撃)");
            list.push("Weak攻撃" + pt);
        }
        if (isCrit) list.push("Critical攻撃" + pt);
        return list;
    }

    // 攻撃に使うステのキー。既存perhitハーネス(attackKeyOf)と同規約（体術=AGI、術/知力=INT）。
    var PARAM_TARGET = { "剣": "STR", "斧": "STR", "大剣": "STR", "槍": "STR", "棍棒": "STR", "杖": "STR", "体術": "AGI", "小剣": "DEX", "弓": "DEX", "銃": "DEX" };
    function statKeyOf(skillInfo, weaponType) {
        if (skillInfo && (JUTSU_BATTLE_TYPES[skillInfo.BattleType] || skillInfo.SpecialType === "知力")) return "INT";
        return PARAM_TARGET[weaponType] || "STR";
    }

    // calcConstWpPowerAndStatus（damageCalc.inc:2118-2183）の $status 決定部。
    // "status" 出力フィールドは単純なバフ後ステ値ではなく、武器種別係数×実効ステ－敵ステ×係数の
    // 合成値（ダメージ式にそのまま使われる中間値）。ゴールデンの statParts.eff は
    // buffParam[key]（recalcBuffStatus）+ correction(装備由来のwp[key]+armor_params[key])。
    // correction はチェーン内で不変の装備値なので呼び出し側が opts.statCorrection として渡す
    // （replayChainは装備マスタを持たないため注入が必要。既存の effectiveStat 系と同じ切り分け:
    // 「eff - correction」までがreplay/engineの責務、correction自体はUI/装備側の責務）。
    var WEAPON_STATUS_COEF = {
        "剣": { per: 4, enemy: 1.5 }, "大剣": { per: 4, enemy: 1.5 }, "斧": { per: 4, enemy: 1.5 },
        "小剣": { per: 4, enemy: 1.5 }, "槍": { per: 4, enemy: 1.5 }, "弓": { per: 4, enemy: 1.5 },
        "棍棒": { per: 4, enemy: 1.5 }, "銃": { per: 3.6, enemy: 1.25 }, "杖": { per: 4, enemy: 1.5 }
    };
    var JUTSU_BATTLE_TYPES = { "火術": 1, "水術": 1, "土術": 1, "風術": 1, "光術": 1, "闇術": 1 };
    function computeStatusValue(skillInfo, weaponType, statKey, buffParam, correction, enemyStatEff) {
        correction = correction || {};
        function eff(key) { return (buffParam[key] || 0) + (correction[key] || 0); }
        var bt = skillInfo.BattleType;
        var special = skillInfo.SpecialType || "";
        if (bt === "体術" && special === "") {
            return 1 + 2 * eff("STR") + 2.5 * eff("AGI") - 1.2 * enemyStatEff;
        }
        if (JUTSU_BATTLE_TYPES[bt] || special === "知力") {
            return 1 + 4 * eff(statKey) - 1.5 * enemyStatEff;
        }
        var coef = WEAPON_STATUS_COEF[bt] || WEAPON_STATUS_COEF[weaponType] || { per: 4, enemy: 1.5 };
        return 1 + coef.per * eff(statKey) - coef.enemy * enemyStatEff;
    }

    // 通常攻撃のmethodは数値(1=直接,2=間接)で入っている場合がある（Task O申し送り）ため正規化する。
    function normalizeMethod(m) {
        if (m === 1 || m === "1") return "直接";
        if (m === 2 || m === "2") return "間接";
        return m;
    }

    // engineFinalizeSkillMulti（damageCalc.inc:274-280）: FE配布の data_SKILLMASTER.js には
    // 'MULTI' フィールドがBE実行時に付与される値のため含まれておらず、代わりに MinActionTime/
    // MaxActionTime から都度導出する必要がある（Step4デバッグで確認: 鬼八 鳴神十六閃 MULTI=16回は
    // MinActionTime=MaxActionTime=16から算出。IRYOKU_CHAIN由来のseq.multiは生成時点でBEが
    // 付与済みの値をそのまま持っているため対象外＝mainSkillInfoフォールバック時のみ使う）。
    function deriveMulti(skillInfo) {
        if (!skillInfo) return 1;
        if (typeof skillInfo.MULTI === "number") return skillInfo.MULTI;
        var min = Number(skillInfo.MinActionTime), max = Number(skillInfo.MaxActionTime);
        if (isFinite(min) && isFinite(max)) return Math.floor((min + max) / 2);
        return 1;
    }

    // メインAPI。opts:
    //   styleId, mainSkillId, weaponType, charInfo, charBasePlusLimit{4キー}, styleMaxByKey{4キー},
    //   resist, isWeak, isOD, isCrit, enemyType, baseEnemyVit, baseEnemyMnd,
    //   skillMasterOf(skillId) -> skillInfo, chainOn -> variant選択用フラグ配列(既定[])
    //   reg (IRYOKU_REG[styleId]), chain (IRYOKU_CHAIN[styleId][mainSkillId]),
    //   markersOf(skillId) -> IRYOKU_SKILLMARKER行（F-gapのみ。styleT1.enemyMarkerはregistry経由なので渡さない）
    //   statCorrection{4キー, 省略可・既定0} -> 装備由来のwp[key]+armor_params[key]（"status"出力の合成に必要。
    //   Step4デバッグで判明: ability/ex/enemyStatEffと違い、"status"はrecalcBuffStatusの生値ではなく
    //   calcConstWpPowerAndStatus(damageCalc.inc:2118-2183)の合成値。correction自体は装備マスタ由来で
    //   replayChainのスコープ外のため、呼び出し側から注入する。省略時はcorrection=0として計算する。
    function replayChain(opts) {
        var chainEntry = opts.chain;
        var variant;
        if (chainEntry) {
            var onFlags = (opts.chainOn || []).slice().sort();
            variant = chainEntry.variants.find(function (v) {
                // on はフラグ集合の配列。集合として一致（順不同）するvariantを選ぶ。
                return v.on.some(function (flagSet) {
                    var fs = flagSet.slice().sort();
                    return fs.length === onFlags.length && fs.every(function (f, i) { return f === onFlags[i]; });
                });
            }) || chainEntry.variants[0];
        } else {
            // IRYOKU_CHAINに該当エントリが無い＝getThisTurnTsuigeki/AddSkillが何も返さない
            // 「追撃なし」の通常ケース（generate_iryokuChain.phpはseq長<=1の(style,skill)を
            // データ削減のため丸ごとスキップして出力する。Step4デバッグで確認: デミルーンナイト/
            // 忍法神速プレゼント剣(単発hit)・鬼八鳴神十六閃(MULTI多段だがskillIndexは0のみ)は
            // いずれもこのケース）。mainSkillId単体・MULTI回のみの合成seqにフォールバックする。
            var mainSkillInfo = opts.skillMasterOf(opts.mainSkillId) || {};
            variant = { on: [[]], seq: [{ order: 0, skillId: opts.mainSkillId, name: mainSkillInfo.Name || "", multi: deriveMulti(mainSkillInfo), src: "main" }] };
        }

        // charName plumbing（キャラ条件付きアビ判定用。CARRY-FORWARD FIX）。
        var state = createEngineState(opts.reg, opts.charInfo && opts.charInfo.Name);
        // バトル開始時（damageCalc.inc:1689-1690。setTimingAttrs→addAbility...の順）
        setTimingAttrs(state, ["バトル開始時"]);
        addAbilityFromAbilityWithBuff(state, ["バトル開始時"]);
        // ターン状態＋ターン開始トリガー（damageCalc.inc:1699-1759を turn==1 固定で転記）。
        // isODMax（ODゲージが事前に満タンか）はopts.isOD以外の情報源が無いため、opts.isODで代用する
        // （isOverDrive=isODMax&&useOverDriveなのでisOD=trueならisODMaxは必ずtrue。isOD=falseの場合は
        // T1開始時点でODゲージ0が通常のため「満タンでない場合」側になる、が妥当な近似）。
        setNowState(state, "常時");
        var isODMax = !!opts.isOD;
        var turnTriggers = [
            "ターン開始時",
            "ターン開始時/" + opts.weaponType + "を装備している場合",
            "ターン開始時/防御カウンター状態でない", // NOW_STATE['防御カウンター']はT1開始時常にempty(:1722-1724)
            isODMax ? "ターン開始時/ODゲージが満タンの場合" : "ターン開始時/ODゲージが満タンでない場合", // :1725-1729
            "奇数ターン開始時", // turn=1は常に奇数(:1730-1734)
            "ラウンド開始時" // turn==1(:1717-1720)
        ];
        // PHPは setNowState("ラウンド開始時",...) を triggers配列構築中(:1719、setTimingAttrs呼び出し:1758より前)に呼ぶ。
        setNowState(state, "ラウンド開始時");
        setTimingAttrs(state, turnTriggers);
        addAbilityFromAbilityWithBuff(state, turnTriggers);

        var skillUseCount = {}; // SKILL_USE_COUNT_FOR_PER相当（技名キー: [追撃]除去・'+'は残す :1796）
        var perHit = [];

        variant.seq.forEach(function (seqEntry, index) {
            var skillInfo = Object.assign({}, opts.skillMasterOf(seqEntry.skillId));
            skillInfo.AttackMethod = normalizeMethod(skillInfo.AttackMethod);
            // rank: メイン/技派生(AddSkill)=99、アビ由来追撃=1（:1772-1773 + Task O の src フィールド）
            skillInfo.rank = (seqEntry.src === "ability") ? 1 : 99;
            var multi = seqEntry.multi || deriveMulti(skillInfo);
            var s = String(skillInfo.Name || "").replace("[追撃]", "");
            var markerRows = opts.markersOf(seqEntry.skillId);
            var isOD = !!opts.isOD; // ODはチェーン全体でメイン技のフラグ基準（:1811,:1907）

            for (var i = 1; i <= multi; i++) {
                skillUseCount[s] = (skillUseCount[s] || 0) + 1;
                // (a) 攻撃前Mod（:1805-1806）。addAbilityFromSkillPreCheck相当はABILITY_MASTER要のため
                //     no-op（Global Constraintsの既知の限界。per-hitグラントはIRYOKU_SKILLMARKERがカバー）。
                incrementSkillBuffDebuffPreCheck(state, skillInfo, skillUseCount[s]);
                // (b) 初hitのみ「攻撃前」タイミングアビ（:1807-1809。setTimingAttrsのみ。addAbility...は呼ばない）
                if (i === 1) setTimingAttrs(state, ["攻撃前"]);
                // (c) ステ再計算（:1811-1813）
                var buffParam = recalcBuffStatus(state, isOD, opts.charBasePlusLimit, opts.styleMaxByKey);
                var statKey = statKeyOf(skillInfo, opts.weaponType);
                var enemyStatKind = (JUTSU_BATTLE_TYPES[skillInfo.BattleType] && skillInfo.SpecialType !== "知力") ? "MND" : "VIT";
                var enemyStatEff = recalcEnemyStat(state, enemyStatKind === "MND" ? opts.baseEnemyMnd : opts.baseEnemyVit, enemyStatKind);
                // (d) _calc相当（ability/ex算出。閉形式のhitIncは一切足さない — 全てstateが持っている）
                var calc = calcAbilityAndEx(state, {
                    skillInfo: skillInfo, weaponType: opts.weaponType, isOD: isOD,
                    resist: opts.resist, isCrit: opts.isCrit, enemyType: opts.enemyType,
                    charInfo: opts.charInfo, isRoundCalcOrTurn1: true
                });
                var statusValue = computeStatusValue(skillInfo, opts.weaponType, statKey, buffParam, opts.statCorrection, enemyStatEff);
                perHit.push({
                    skillIndex: index, hit: i, skillId: seqEntry.skillId, skillName: skillInfo.Name,
                    ability: calc.ability, ex: calc.ex, status: statusValue, statKey: statKey,
                    // statBuffed: recalcBuffStatusが返す生の実効ステ値（武器/防具correction加算前）。
                    // "status"合成値とは別に、UI側の表示用透明性フィールドとして追加するのみ
                    // （既存の status→str逆算パス invertStatusToStrEff は変更しない。Opusトラック
                    // の同フィールドを追加ポート — additive only）。
                    statBuffed: buffParam[statKey],
                    enemyStatEff: enemyStatEff, enemyStatKind: enemyStatKind, isCrit: calc.isCrit
                });
                // (e) hit後の技Mod（:1879-1880）＋'>'グラント（IRYOKU_SKILLMARKER）
                incrementSkillBuffDebuff(state, skillInfo, skillUseCount[s], false);
                applyMarkerRowsOnHit(state, markerRows, skillInfo, seqEntry.skillId);
                // (f)(g) 時/後/のたびトリガー＋敵マーカー発火は damageCalc.inc:1883/1890-1893 で
                // skill.Id="wait"/"stop"/補助FlavorText、またはAttackAreaが味方単体/味方全体/自身の場合
                // まるごとスキップされる（"何もしない"）。fireEnemyMarkersOnHit自体は内部でも
                // 味方/wait/stop側のガードを持つ（defence in depth）が、PHPの単一スキップ境界に
                // 揃えるためここでもptListループとまとめてガードする。
                var skipHitTrigger = skillInfo.Id === "wait" || skillInfo.Id === "stop" ||
                    String(skillInfo.FlavorText || "").indexOf("補助") === 0 ||
                    skillInfo.AttackArea === "味方単体" || skillInfo.AttackArea === "味方全体" ||
                    skillInfo.AttackArea === "自身";
                if (!skipHitTrigger) {
                    // (f) 時/後/のたびトリガー（:1887-1947）。エンジン同様「ptごとに」build→fireする。
                    var ptList = (i === 1) ? ["時", "後", "のたび"] : ["のたび"];
                    ptList.forEach(function (pt) {
                        var triggers = buildHitTriggers(skillInfo, opts, isOD, calc.isCrit, index === 0, i, pt);
                        setTimingAttrs(state, triggers);
                        addAbilityFromAbilityWithBuff(state, triggers);
                    });
                    // (g) 敵マーカー発火（:1949-1951。効果は次hitから＝calcの後に呼ぶ順序で自然に実現）
                    fireEnemyMarkersOnHit(state, skillInfo, opts.resist);
                }
                // (h) 初hitのみ「{生Name}を発動後」（:1953-1961。エンジンは addAbility...→setTimingAttrs の順・
                //     生Name（'+'含む）で発火する。順序と生Nameの両方を忠実に守ること）
                if (i === 1) {
                    var after1 = [skillInfo.Name + "を発動後"];
                    addAbilityFromAbilityWithBuff(state, after1);
                    setTimingAttrs(state, after1);
                    var after2 = [skillInfo.Name + "を発動後/1ターン目の場合"];
                    addAbilityFromAbilityWithBuff(state, after2);
                    setTimingAttrs(state, after2);
                }
            }
        });

        return { perHit: perHit, variant: variant, state: state };
    }

    return { replayChain: replayChain };
});
