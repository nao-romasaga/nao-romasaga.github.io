const STYLE_DATA_ORG = {
    "ADD_ABILITY" : {},
    "BP_HEAL_ABILITY" : {},
    "BP_MAX_UP_ABILITY" : {},
    "BP_MINUS_ABILITY" : {},
    "BUFF_ABILITY" : {},
    "CRITICAL_ABILITY" : {},
    "DAMAGE_ABILITY" : {},
    "LP" : 0,
    "OD_ABILITY" : {},
    "SPEED_ABILITY" : {},
    "TSUIGEKI_ABILITY" : {},
    "USE_COUNT_ABILITY" : {},
    "WAIT_ATTACK_ABILITY" : {},
};

let STYLE_DATA = {};
let NOW_STATE = {
    "dummy": {}
};
let NOW_TURN_ACTION = {};

let NOW_STYLE_ID = "";

function resetBattleData(){
    STYLE_DATA = {};
    NOW_STATE = {
        "dummy": {}
    };
    NOW_TURN_ACTION = {};
}

function clearData(sid) {
    delete NOW_STATE[sid];
    delete NOW_TURN_ACTION[sid];
}

function getStyleAbilityData(sid) {
    NOW_STYLE_ID = sid;
    STYLE_DATA[sid] = Object.assign({}, STYLE_DATA_ORG);
    $.getJSON(`https://romasagatool.com/api/style_simulator.php?&sid=${sid}&c=getAbilityDetail&getAbilityDetail=?`);
}
function getAbilityDetail(result) {
    resetBattleData();
    STYLE_DATA[NOW_STYLE_ID] = JSON.parse(JSON.stringify(result));
    NOW_STATE[NOW_STYLE_ID] = {0:JSON.parse(JSON.stringify(result))};
    debug_log(result);
    callbackGetStyleAbilityData();
}

function debug_log(){
    let log = [];
    for (let i = 0; i < arguments.length; i++) {
      log.push(arguments[i]);
    }
    console.log(log);
}

function setSkill(sid, turn, skillId) {
    NOW_TURN_ACTION[sid][turn] ??= "";
    NOW_TURN_ACTION[sid][turn] = skillId;
}

function setStartState(sid, turn){
    // まずは前ターンの情報をコピーして、そこに追加で値を入れていく
    if(turn > 0) {
        const bTurn = turn - 1;
        _setNestedProperty(NOW_STATE, [sid, turn], NOW_STATE[sid][bTurn]);
        _setNestedProperty(NOW_STATE, ['dummy', bTurn], {});
        _setNestedProperty(NOW_STATE, ['dummy', turn], NOW_STATE['dummy'][bTurn]);
    }
    _setNestedProperty(NOW_STATE, [sid, turn, 'STATE_BP'], 0);
    _setNestedProperty(NOW_STATE, ['dummy', turn, 'STATE_BP'], 0);
    NOW_STATE[sid][turn]['STATE_BP'] = 0;
    NOW_STATE['dummy'][turn]['STATE_BP'] = 0;
    NOW_STATE[sid][turn]['STATE_BUFF'] = {};
    NOW_STATE['dummy'][turn]['STATE_BUFF'] = {};
}
function setState(sid, trigger, turn){
    console.log("setState", trigger);
    addAbility(sid, trigger, turn);
    setAndDecrementAttackPer(sid, trigger, turn);
    setAndDecrementGuardPer(sid, trigger, turn);
    setAndDecrementBPHeal(sid, trigger, turn);
    setAndDecrementBuff(sid, trigger, turn);
}
function setAndDecrementBuff(sid, trigger, turn){
    const dArr = NOW_STATE?.[sid]?.[turn]?.BUFF_ABILITY?.[trigger] ?? [];
    for(idx in dArr){
        const data = dArr[idx];
        for(p of data['PARAM']) {
            if(data['range'] == "味方生存者全体") {
                _setNestedProperty(NOW_STATE, ['dummy', turn, 'STATE_BUFF', p], 0);
                NOW_STATE['dummy'][turn]['STATE_BUFF'][p] += data['PER'];
                _setNestedProperty(NOW_STATE, [sid, turn, 'STATE_BUFF', p], 0);
                NOW_STATE[sid][turn]['STATE_BUFF'][p] += data['PER'];
            } else if(data['range'] == "自身以外の味方生存者全体") {
                _setNestedProperty(NOW_STATE, ['dummy', turn, 'STATE_BUFF', p], 0);
                NOW_STATE['dummy'][turn]['STATE_BUFF'][p] += data['PER'];
            } else {
                _setNestedProperty(NOW_STATE, [sid, turn, 'STATE_BUFF', p], 0);
                NOW_STATE[sid][turn]['STATE_BUFF'][p] += data['PER'];
            }
        }
        if(_decrement(NOW_STATE[sid][turn]["BUFF_ABILITY"][trigger][idx])) {
            delete NOW_STATE[sid][turn]["BUFF_ABILITY"][trigger][idx];
        }
    }
}


function setAndDecrementBPHeal(sid, trigger, turn){
    const dArr = NOW_STATE?.[sid]?.[turn]?.BP_HEAL_ABILITY?.[trigger] ?? [];
    for(idx in dArr){
        const data = dArr[idx];
        if(data['range'] == "味方生存者全体") {
            NOW_STATE['dummy'][turn]['STATE_BP'] += data["bp"];
            NOW_STATE[sid][turn]['STATE_BP'] += data["bp"];
        } else if(data['range'] == "自身以外の味方生存者全体") {
            NOW_STATE['dummy'][turn]['STATE_BP'] += data["bp"];
        } else {
            NOW_STATE[sid][turn]['STATE_BP'] += data["bp"];
        }
        if(_decrement(NOW_STATE[sid][turn]["BP_HEAL_ABILITY"][trigger][idx])) {
            delete NOW_STATE[sid][turn]["BP_HEAL_ABILITY"][trigger][idx];
        }
    }
}


function setAndDecrementAttackPer(sid, trigger, turn){
    const dArr = NOW_STATE?.[sid]?.[turn]?.DAMAGE_ABILITY?.[trigger] ?? [];
    for(attr in dArr) {
        // 攻撃属性
        for(idx in dArr[attr]) {
            const data = dArr[attr][idx];
            debug_log(trigger ,"によりダメージ追加", attr, idx, data);
            if(data['range'] == "味方生存者全体") {
                _setNestedProperty(NOW_STATE, ['dummy', turn, 'STATE_DAMAGE', attr], {"VAL":0, "TMP":[]});
                _addVal(data, NOW_STATE['dummy'][turn]['STATE_DAMAGE'][attr]);
                _setNestedProperty(NOW_STATE, [sid, turn, 'STATE_DAMAGE', attr], {"VAL":0, "TMP":[]});
                _addVal(data, NOW_STATE[sid][turn]['STATE_DAMAGE'][attr]);
            } else if(data['range'] == "自身以外の味方生存者全体") {
                _setNestedProperty(NOW_STATE, ['dummy', turn, 'STATE_DAMAGE', attr], {"VAL":0, "TMP":[]});
                _addVal(data, NOW_STATE['dummy'][turn]['STATE_DAMAGE'][attr]);
            } else {
                _setNestedProperty(NOW_STATE, [sid, turn, 'STATE_DAMAGE', attr], {"VAL":0, "TMP":[]});
                _addVal(data, NOW_STATE[sid][turn]['STATE_DAMAGE'][attr]);
            }
            if(_decrement(NOW_STATE[sid][turn]["DAMAGE_ABILITY"][trigger][attr][idx])) {
                delete NOW_STATE[sid][turn]["DAMAGE_ABILITY"][trigger][attr][idx];
            }
        }
        dArr[attr] = dArr[attr].filter(Boolean);
    }
    if(attr in dArr) {
        debug_log("setAndDecrementAttackPer 追加", sid, trigger, turn, NOW_STATE);
    }    
}

function setAndDecrementGuardPer(sid, trigger, turn){
    const dArr = JSON.parse(JSON.stringify(NOW_STATE?.[sid]?.[turn]?.GUARD_ABILITY?.[trigger] ?? []));
    for(idx in dArr) {
        const data = dArr[idx];
        debug_log(data, idx, dArr);
        const [attr, sub]  = _getGuardAttrPattern(data['SUB']);
        debug_log(trigger ,"により軽減", attr, idx, data);
        const input = {
            "SUB" : sub,
            "PER" : Number(data['PER']),
            "TURN" : data['TURN'] != "" ? Number(data['TURN']) : 999,
        }
        if(data['range'] == "味方生存者全体") {
            _setNestedProperty(NOW_STATE, ['dummy', turn, 'STATE_GUARD', attr], []);
            NOW_STATE['dummy'][turn]['STATE_GUARD'][attr].push(JSON.parse(JSON.stringify(input)));
            _setNestedProperty(NOW_STATE, [sid, turn, 'STATE_GUARD', attr], []);
            NOW_STATE[sid][turn]['STATE_GUARD'][attr].push(JSON.parse(JSON.stringify(input)));
        } else if(data['range'] == "自身以外の味方生存者全体") {
            _setNestedProperty(NOW_STATE, ['dummy', turn, 'STATE_GUARD', attr], []);
            NOW_STATE['dummy'][turn]['STATE_GUARD'][attr].push(JSON.parse(JSON.stringify(input)));
        } else {
            _setNestedProperty(NOW_STATE, [sid, turn, 'STATE_GUARD', attr], []);
            NOW_STATE[sid][turn]['STATE_GUARD'][attr].push(JSON.parse(JSON.stringify(input)));
        }
        if(_decrement(NOW_STATE[sid][turn]["GUARD_ABILITY"][trigger][idx])) {
            delete NOW_STATE[sid][turn]["GUARD_ABILITY"][trigger][idx];
            NOW_STATE[sid][turn]["GUARD_ABILITY"][trigger] = NOW_STATE[sid][turn]["GUARD_ABILITY"][trigger].filter(Boolean);
        }
    }
    
    //debug_log("setAndDecrementGuardPer 結果", sid, trigger, turn, NOW_STATE[sid][turn]['STATE_GUARD']);
}

function decrementAllState(sid, turn){
    const data = NOW_STATE?.[sid]?.[turn]?.STATE_DAMAGE ?? [];
    for(attr in data){
        for(i in data[attr]["TMP"]) {
            NOW_STATE[sid][turn]['STATE_DAMAGE'][attr]["TMP"][i]["TURN"]--;
            if(NOW_STATE[sid][turn]['STATE_DAMAGE'][attr]["TMP"][i]["TURN"] == 0) {
                delete NOW_STATE[sid][turn]['STATE_DAMAGE'][attr]["TMP"][i];
            }
        }
        NOW_STATE[sid][turn]['STATE_DAMAGE'][attr]["TMP"] = NOW_STATE[sid][turn]['STATE_DAMAGE'][attr]["TMP"].filter(Boolean);
    }
    const data2 = NOW_STATE?.[sid]?.[turn]?.STATE_GUARD ?? [];
    debug_log(turn,"ターン目 終了時decrement", JSON.parse(JSON.stringify(data2)));
    for(attr in data2){
        debug_log(turn,"T",sid, attr, JSON.parse(JSON.stringify(data2[attr])));
        for(i in data2[attr]) {
            debug_log(sid, attr, i, JSON.parse(JSON.stringify(NOW_STATE[sid][turn]['STATE_GUARD'][attr][i])));
            NOW_STATE[sid][turn]['STATE_GUARD'][attr][i]["TURN"]--;
            debug_log(sid, attr, i, JSON.parse(JSON.stringify(NOW_STATE[sid][turn]['STATE_GUARD'][attr][i])));
        }
        debug_log(turn,"ターン目 削除前", sid, JSON.parse(JSON.stringify(NOW_STATE[sid][turn]['STATE_GUARD'][attr])));
        NOW_STATE[sid][turn]['STATE_GUARD'][attr] = NOW_STATE[sid][turn]['STATE_GUARD'][attr].filter(x => x.TURN > 0);
        debug_log(turn,"ターン目 削除後", sid, JSON.parse(JSON.stringify(NOW_STATE[sid][turn]['STATE_GUARD'][attr])));
    }    
}

function _decrement(data){
    debug_log("_decrement", data);
    if(data == undefined) {
        return true;
    }
    let limit = 999;
    let key = "LIMIT";
    for (const k of ["LIMIT", "limit"]) {
        if (k in data) {
            key = k;
            limit = Number(data[key] == "" ? 999 : data[key]);
            break;
        }
    }
    if(limit != 999) {
        limit--;
        if(limit == 0) {
            return true;
        } else {
            data[key] = limit;
        }
    }
    return false;
}

/**
 * ターン中に付与された状態を記録しておく
 * @param {*} attr 
 * @param {*} state 
 */
function _addVal(attr, state){
    const turn = Number(attr['TURN'] ?? attr['turn']);
    const val = Number(attr['PER'] ?? attr['size']);
    if(turn == 999) {
        state["VAL"] += val;
    } else {
        state["TMP"].push({
            "SUB": attr['SUB'] ?? attr['sub'],
            "VAL": val,
            "TURN": turn,
        })
    }
}

function _setNestedProperty(obj, keys, value) {
    return keys.reduce((acc, key, index) => {
      // 最後のキーに到達したら
      if (index === keys.length - 1) {
        // キーが既に存在しているか確認
        if (acc[key] === undefined) {
          acc[key] = JSON.parse(JSON.stringify(value)); // 存在しなければ初期値をセット
        }
        return acc[key];
      }
  
      // 中間のキーについても存在確認をし、無ければ空オブジェクトを作成
      if (!acc[key]) {
        acc[key] = {};
      }
      return acc[key];
    }, obj);
}

function _getAttackPerTmp(sid, turn) {
    const state = NOW_STATE?.[sid]?.[turn]?.STATE_DAMAGE ?? [];
    let perTmp = {};
    let perTmpDetail = {};
    for(attr in state) {
        for(tmp of state[attr]["TMP"]){
            perTmp[tmp["SUB"]] ??= 0;
            perTmp[tmp["SUB"]] += tmp["VAL"];
            perTmpDetail[tmp["SUB"]] ??= [];
            perTmpDetail[tmp["SUB"]].push({'val':tmp["VAL"], 'turn':tmp["TURN"]}); 
        }
    }
    return {"per":perTmp,"detail":perTmpDetail};
}
function _getAttackPer(sid, turn) {
    const state = NOW_STATE?.[sid]?.[turn]?.STATE_DAMAGE ?? [];
    let per = {};
    for(attr in state) {
        per[attr] ??= 0;
        per[attr] += state[attr]["VAL"];
        for(tmp of state[attr]["TMP"]){
            per[attr] += tmp["VAL"];
        }
    }
    return per;
}

function _getGuardPer(sid, turn) {
    const ATTR_MAP = {
        "全ダメージ" : "全",
        "攻撃弱化" : "全",
        "ダメージブロック" : "全",
        "防御強化" : "全",
        "ガードアップ" : "全",
        "モラルダウン" : "全",
        "Resist防御強化" : "Resist",
        "行動前防御強化" : "行動前",
        "行動後防御強化" : "行動後",
    };    
    const state = NOW_STATE?.[sid]?.[turn]?.STATE_GUARD ?? [];
    let per = {};
    for(sub in state) {
        const attr = ATTR_MAP[sub] ?? sub;
        per[attr] ??= 1;
        for(idx in state[sub]) {
            debug_log(turn,"T目軽減チェック", "*", (state[sub][idx]["PER"]/100));
            per[attr] *= (1 - (state[sub][idx]["PER"]/100));
        }
    }
    debug_log(sid, turn,"T目軽減チェック", per);
    return per;
}

function addAbility(sid, trigger, turn){
    const adab = STYLE_DATA?.[sid]?.ADD_ABILITY?.[trigger] ?? [];
    if(adab.length == 0) {
        return;
    }
    const ab = JSON.parse(JSON.stringify(adab));
    console.log(ab);
    for(i in ab){
        debug_log('アビリティ追加', trigger, i, ab[i]);
        NOW_STATE[sid][turn] = addAbility2State(ab, ab[i]['attr'], NOW_STATE[sid][turn]);
    }
}


function addAbility2State($abInfo, $abCategory, state){
    const main = $abCategory['main'];
    const sub = $abCategory['sub'];
    const when = $abCategory['when'];
    
    if(main.includes("ダメージ強化")){
        const damageAttr = _getDamageAttrPattern(sub);
        state["DAMAGE_ABILITY"] = state?.DAMAGE_ABILITY ?? [];
        state["DAMAGE_ABILITY"][when] = state?.DAMAGE_ABILITY?.[when] ?? [];
        state["DAMAGE_ABILITY"][when][damageAttr] = state?.DAMAGE_ABILITY?.[when]?.[damageAttr] ?? [];
        state["DAMAGE_ABILITY"][when][damageAttr].push($abCategory);
    } else if($abCategory['main'] == "ダメージ軽減") {
        state["GUARD_ABILITY"][when] = state?.GUARD_ABILITY?.[when] ?? [];
        state["GUARD_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "HP回復") {
        state["HP_HEAL_ABILITY"][when] = state?.HP_HEAL_ABILITY?.[when] ?? [];
        state["HP_HEAL_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "追撃"
    || $abCategory['main'] == "カウンター") {
        state["TSUIGEKI_ABILITY"] = state?.["TSUIGEKI_ABILITY"] ?? [];
        state["TSUIGEKI_ABILITY"][when] = state?.TSUIGEKI_ABILITY?.[when] ?? [];
        state["TSUIGEKI_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "溜め状態") {
        state["WAIT_ATTACK_ABILITY"][when] = state?.WAIT_ATTACK_ABILITY?.[when] ?? [];
        state["WAIT_ATTACK_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "BP回復") {
        //$abCategory['turn'] = $row['turn'] ?? $abCategory['turn'];
        state["BP_HEAL_ABILITY"][when] = state?.BP_HEAL_ABILITY?.[when] ?? [];
        state["BP_HEAL_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "アビリティ付与") {
        state["ADD_ABILITY"][when] = state?.ADD_ABILITY?.[when] ?? [];
        state["ADD_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "行動順補正") {
        state["SPEED_ABILITY"][when] = state?.SPEED_ABILITY?.[when] ?? [];
        state["SPEED_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "最大BP増加") {
        state["BP_MAX_UP_ABILITY"][when] = state?.BP_MAX_UP_ABILITY?.[when] ?? [];
        state["BP_MAX_UP_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "消費BP減少") {
        state["BP_MINUS_ABILITY"][when] = state?.BP_MAX_UP_ABILITY?.[when] ?? [];
        state["BP_MINUS_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "ODゲージ上昇"){
        state["OD_ABILITY"][when] = state?.OD_ABILITY?.[when] ?? [];
        state["OD_ABILITY"][when].push($abCategory);
    } else if($abCategory['main'] == "使用回数制限回復"){
        state["USE_COUNT_ABILITY"][when] = state?.USE_COUNT_ABILITY?.[when] ?? [];
        state["USE_COUNT_ABILITY"][when].push($abCategory);
    } else if(strpos($abCategory['main'], "強化(バフ")
    && !strpos($abCategory['sub'], "耐性")) {
        state["BUFF_ABILITY"][when] = state?.BUFF_ABILITY?.[when] ?? [];
        state["BUFF_ABILITY"][when].push({
            "NAME": $abInfo['Name'],
            "PARAM": $abCategory['sub'].split("と"),
            "PER": Number($abCategory['size']),
            "TIME": Number($abCategory['time']),
            "ZAN_T": Number($abCategory['ZAN_T']),
            "LIMIT": $abCategory['maxLimit'],
            "range": $abCategory['main'] == "自身強化(バフ)" ? "自身": "味方生存者全体",
            "parentRange": $abInfo['range'],
        });
    } else if(strpos($abCategory['main'], "弱化(デバフ")) {
        state["DEBUFF_ABILITY"][when] = state?.DEBUFF_ABILITY?.[when] ?? [];
        state["DEBUFF_ABILITY"][when].push($abCategory);
    }
    return state;
}

function _getDamageAttrPattern($subOrg){
    const ATTACK_ATTR_MAP = {
        "全ダメージ" : "全",
        "攻撃強化" : "全",
        "攻撃弱化" : "全",
        "防御弱化" : "全",
        "単体攻撃強化" : "単体攻撃",
        "Weak防御弱化" : "Weak攻撃",
        "攻撃強化(技)" : "技攻撃",
        "攻撃強化(術)" : "術攻撃",
        "防御弱化(技)" : "技攻撃",
        "防御弱化(術)" : "術攻撃",
        "ヒートアップ" : "全",
        "ヒートダウン" : "全",
        "Weakヒートアップ" : "Weak攻撃",
        "Weak攻撃強化" : "Weak攻撃",
        "モラルアップ" : "全",
        "ガードダウン" : "全",
        "ディフェンスダウン" : "全",
        "オーバーエンハンス" : "OD攻撃",
        "OD攻撃強化" : "OD攻撃",
    };
    $sub = $subOrg.split("属性")[0]; // 斬属性ダメージ
    $sub = ATTACK_ATTR_MAP[$sub] ?? $sub;
    if(strpos($sub, "ウェポンエンハンス")) {
        $sub = str_replace(["ウェポンエンハンス(",")"], "", $sub);
    } else if(strpos($sub, "秘奥・攻")) {
        $sub = str_replace(["秘奥・攻(",")"], "", $sub);
    } else if(strpos($sub, "ヒートアップ(HP満タン")) {
        $sub = "HP満タン時";
    } else if(strpos($sub, "ヒートアップ(")) {
        $sub = str_replace(["ヒートアップ(",")"], "", $sub);
    } else if(strpos($sub, 'エレメントエンハンス')) {
        $sub = str_replace(["エレメントエンハンス(",")"],"",$sub);
    } else if(strpos($sub, 'エリアエンハンス')) {
        $sub = str_replace(["エリアエンハンス(",")"],"",$sub);
    } else if(strpos($sub, 'エクストラフォース')) {
        // エクストラフォースはエクストラフォース突などのAttrとして扱う
        $sub = str_replace(["(",")"],["",""],$sub);
    }
    return $sub;
}
function _getGuardAttrPattern($subOrg){
    const ATTR_MAP = {
        "全ダメージ" : "全",
        "攻撃弱化" : "全",
        "ダメージブロック" : "全",
        "ディフェンスアップ" : "全",
        "防御強化" : "全",
        "ガードアップ" : "全",
        "モラルダウン" : "全",
        "Resist防御強化" : "Resist",
        "行動前防御強化" : "行動前",
        "行動後防御強化" : "行動後",
    };
    $sub = ATTR_MAP[$subOrg] ?? $subOrg;

    $type = "";
    if(["ダメージブロック", "ガードアップ", "モラルダウン", "攻撃弱化"].indexOf($subOrg)) {
        $type = $subOrg;
    }
    if(strpos($sub, "エレメントガード")) {
        debug_log("エレメントガード", $sub, $subOrg, strpos($sub, "エレメントガード"));
        $sub = str_replace(["エレメントガード(",")"], "", $sub);
        $type = "エレメントガード";
    } else if(strpos($sub, '防御態勢(')) {
        $sub = str_replace(["防御態勢("],"",$sub);
        $type = "防御態勢";
    } else if(strpos($sub, "ダメージ無効")) {
        $sub = str_replace(["ダメージ無効","(",")","属性"], "", $sub);
    } else if(strpos($sub, "属性を含むダメージ")) {
        $sub = str_replace("属性を含むダメージ", "", $sub);
    } else if(strpos($sub, 'ディフェンスアップ(')) {
        $sub = str_replace(["ディフェンスアップ(",")"],"",$sub);
    } else if(strpos($sub, '属性防御強化')) {
        $sub = str_replace(["属性防御強化"],"",$sub);
    } else if(strpos($sub, '防御強化(')) {
        $sub = str_replace(["防御強化("],"",$sub);
    } else if(strpos($sub, '攻撃')) {
        $sub = str_replace(["攻撃"],"",$sub);
    }
    return [$sub, $type];
}

function getAttackAttr(skillId, isOd = false, isWeak = false, isHPMax = false){
    const RANGE_LIST = {
        "敵単体" : ["単体攻撃"],
        "ランダム" : ["単体攻撃"],
        "敵横一列" : ["全体攻撃または範囲攻撃","範囲攻撃"],
        "敵縦一列" : ["全体攻撃または範囲攻撃","範囲攻撃"],
        "敵全体" : ["全体攻撃", "全体攻撃または範囲攻撃","範囲攻撃"],
    };
    const skillInfo = SKILL_MASTER[skillId];
    let targetAttr = ["全", NOW_STYLE["WeaponType"], "攻撃命中時", "攻撃時"];
    if(isOd){
        targetAttr.push("OD攻撃");
        targetAttr.push("OD攻撃を発動後");
        if(isWeak) {
            targetAttr.push("OD攻撃を発動後/Weak攻撃命中時");
        }
    }
    targetAttr.push(isHPMax ? "HP満タン時" : "HPが満タンではない時");
    if(isWeak) {
        targetAttr.push("Weak攻撃");
    }
    targetAttr.push(skillInfo['SkillType']+'攻撃'); // 技・術
    targetAttr.push(skillInfo['AttackMethod']+'攻撃時'); // 直接・間接
    targetAttr.push(skillInfo['AttackMethod']+'攻撃命中時'); // 直接・間接
    targetAttr.push(skillInfo['AttackMethod']); // 直接・間接
    for(const attr of skillInfo["AttackAttributes"].split(",")) {
        targetAttr.push(`${attr}属性攻撃命中時`); // 斬
        targetAttr.push(`${attr}属性攻撃時`); // 斬
        targetAttr.push(`${attr}`); // 斬
        //全体攻撃(※)を発動後
        if(isWeak) {
            targetAttr.push(`${attr}属性攻撃時/Weak攻撃命中時`);
        }
        if(isOd){
            targetAttr.push(`OD攻撃を発動後/${attr}属性攻撃時`);
        }
    }
    for(const area of RANGE_LIST[skillInfo["AttackArea"]] ?? []) {
        targetAttr.push(`${area}命中時`); // 単体攻撃
        if(isWeak) {
            targetAttr.push(`${attr}/Weak攻撃命中時`);
        }
    }
    return targetAttr;
}