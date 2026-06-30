// TODO 追撃が発動しなくなってるっぽい
let BP_LIMIT = 20;
let DEBUG = true;
let OD_ST_BONUS = 20;
let OD_ATTACK_BONUS = 0; // 2,3=30,4=40,5=50
let OD_AUTO_USE = true;
let OD_MANUAL_USE_TURN;
const NO_LIMIT = 1000;
//OD_MANUAL_USE_TURN = {4:true, 5:true};
OD_MANUAL_USE_TURN = OD_MANUAL_USE_TURN ?? {};
const ATTACK_RANGE = {"敵単体":"single","ランダム":"single","敵ランダム":"single","敵横一列":"範囲攻撃","敵縦一列":"範囲攻撃","敵全体":"all",};
const ATTACK_RANGE_JP = {"敵単体":"単体","ランダム":"単体","敵ランダム":"単体","敵横一列":"範囲","敵縦一列":"範囲","敵全体":"全体",};
const WHEN_MAP = {
    "味方が全員生存している時":"常時",
    "武器装備時":"常時",
};


let IRYOKU_MAP = {"E":7,"D":10,"C":15,"B":21,"A":28,"S":36,"SS":45,"SSS":58, "SSSS":74};
const RAND_PATTERN = {
    RAND: 1, // ランダム（初期値）
    FIX: 2,  // 50% => 2回毎の固定
    CONFIRM: 3, // 100%発生
    NONE: 0, // 0%発生
};
let JINKEI_RYUJIN = false;
let JINKEI_OTOKO = false;
let COUNTER_STATE = RAND_PATTERN.RAND;
let BUFF_STATE = RAND_PATTERN.RAND;
let TSUIGEKI_STATE = RAND_PATTERN.RAND;

let BP_HEAL_ABILITY = 0;
let BP_HEAL_SKILL = 0;
let BP_KEIGEN_SKILL = 0;
let NOW_LP = 0;
let INIT_OD = false;
let NOW_TURN = 1;
let TOTAL_DAMAGE = 0;
let THIS_TURN_DAMAGE = {};
let NOW_OD = 0;
let DISP_ABILITY_NAMES = [];
const NORMAL_ATTACK = {"Id":"normal", "Name": "通常攻撃", "AttackArea": "敵単体", "AttackMethod":1, "ConsumeBp": 0, "AutoUseBp": 0, "UseBp": 0, "isNotUseAuto": false, "UseCount": 0, "isKeisho": 0, "SkillIryoku": 7, "Buff":"" ,"Debuff":"", "MinActionTime":1,"MaxActionTime":1, "SkillType":"技", "Type": "攻撃", "OD":25, "rank":1, "SortKey":0};
let NOW_CHAR = {};
let NOW_STYLE = {};
let MY_MASTER_LV = {};

let isAddCounter = false;
let isTokkou = false;
let isBuf = true;
let is1TNormal = false;
let changeAddPer = false;
let isHojoPrimary = false;
let isLimitPrimary = false;
let BUFF_RAND_STATE = {};
let COUNTER_RAND_STATE = {};
let TSUIGEKI_RAND_STATE = {};
let OD_ABILITY = {};
let DEBUFF_ABILITY = {};
let ADD_ABILITY = {};
let TSUIGEKI_ABILITY = {};
let BUFF_RESET_ABILITY = {};
let COUNTER_ABILITY = [];

// DAMAGE_ABILITY: キーは発生条件。攻撃命中時に攻撃強化やターン開始時にヒートアップなど。
// 発生条件を元にNOW_DAMAGE_STATEに登録する
//   ターン開始時、攻撃強化を2ターン付与。上限なしはNOW_DAMAGE_STATEにTURN:2 NO LIMITで登録
//   アビによる追加で「攻撃を受けた場合、攻撃強化を2ターン、上限1回」の場合NOW_DAMAGE_STATEにTURN:2 LIMIT:1で登録
// ターン開始時に「被弾時攻撃強化2ターン」の効果1ターンを付与の場合は
// 唐津の紅葉を付与、効果1ターン、回数無制限はADD_ABILITYに追加
// ・ターン開始時：アビリティ付与、1ターン　この効果は累積しない
// ・被弾時：攻撃強化、2ターン
// の2つの状態を管理する必要がある
let DAMAGE_ABILITY = {};
let SKILL_USE_UP_ABILITY = {};
let SKILL_USE_COUNT = {};
let MULTI_NOW_COUNT = {}; // マルチヒットがあるヒット回数を交互に出す
// NOW_DAMAGE_STATE: キーは属性。現在有効なダメージアビ。ターン制限か使用制限があるので減衰していく
let NOW_DAMAGE_STATE = {
    "ALWAYS": {},
    "TEMP": {},
};
// BUFF_ABILITY: キーは発生タイミング。ステータスバフとBP回復が格納される
let BUFF_ABILITY = {};
// NOW_BUFF_STATE: キーはパラメータ。現在のバフ状況と、残りターン数が格納される
let NOW_BUFF_STATE = {};


// ABILITY
//    アビリティが入ってる。テンションアップや、攻撃時バフ、ターン開始時ヒートアップ、追撃など
//    702102414,海賊の狂宴,[ターン開始時]<br>味方生存者全体に「<special_effect=800000355>略奪者</special_effect>」を付与する( 効果1ターン )<br><br>[タイプが「攻撃」である技・術(※)を命中させた時]<br>「<skill=110300358>二連薙ぎ+</skill>」が発動する<br>( 技Rank1で発動 )<br>※「アビリティ効果により発動する技・術」「カウンター効果による反撃技・術」は含まない,
//    800000355,略奪者,攻撃命中時、以下の効果が発動する( 上限回数:2回 )<br>・対象に「<special_effect=800000035>防御弱化</special_effect>」( 効果小/効果1ターン )を付与する<br>・自身に「<special_effect=800000001>攻撃強化</special_effect>」( 効果大/効果2ターン )を付与する
//    海賊の饗宴はABILITYで管理。毎ターン「略奪者」を1ターン付与する。
//      略奪者はNOW_STATEで管理。攻撃命中時に弱化強化が発動、2回で消えるし、上記の通り1ターンで消える
//    702102297,狂おしき恋のリズム,[バトル開始時]<br>敵全体に「<special_effect=800000326>狂愛(3回)</special_effect>」を付与する( 効果2ターン )<br><br>[ターン開始時]<br>味方生存者全体に「<special_effect=800000327>トリプルリズム(3回)</special_effect>」を付与する( 効果1ターン )
//    702102296,狂愛(3回),攻撃を受けた時、敵生存者全体に「攻撃強化」( 効果中/効果2ターン )を付与する( 上限回数:3回 ※攻撃が命中した時のみ発動 )<br>※タイプが「攻撃」である技・術の効果によってこの特殊状態が付与された場合、その攻撃も含む,
//    くるおしき恋のリズムは敵にアビリティ付与と、ターン開始時味方にトリプルリズム付与
//      くるおしき恋のリズムはNOW_STATEで管理。敵に「攻撃を受けた時、攻撃強化」2ターン3回を付与。
//      トリプルリズムはNOW_STATEで管理。毎ターン無くなる
//    702102249,ウィークマキシマムボルテージ,,ダメージ強化,Weakヒートアップ,必ず(100%),ターン開始時,,Weakヒートアップ超極大(50%),バトル中永続,バトル中4
//      ウィークマキシマムボルテージはABILITYで管理。毎ターンヒートアップが付与されていく
//      ヒートアップはNOW_STATEで管理。永続
// ABILTIYはアビリティそのものを管理。そこから派生するアビリティや
// NOW_STATE
//    現在の状態が入ってる。ターン開始時腕力バフとか、ターン開始時ヒートアップとか
// ENEMY_STATE
//
// NOW_BUFF_STATE
//    バフ状態が入ってる。減衰処理も特殊


function resetVar() {
    INIT_OD = false; // 初期化
    BUFF_RAND_STATE = {};
    COUNTER_RAND_STATE = {};
    TSUIGEKI_RAND_STATE = {};
    SKILL_USE_COUNT = {};
    MULTI_NOW_COUNT = {};
    APPEND_ABILITY = {};
    
    NOW_LP = Number($("#SET_LP").val()); // リセット
    NOW_OD = 0;
    TOTAL_DAMAGE = 0;

    DISP_ABILITY_NAMES = [];

    DAMAGE_ABILITY = {};
    SKILL_USE_UP_ABILITY = {};
    BUFF_ABILITY = {};
    DEBUFF_ABILITY = {};
    ADD_ABILITY = {};

    OD_ABILITY = {};
    TSUIGEKI_ABILITY = {};
    CRITICAL_ABILITY = [];
    COUNTER_ABILITY = [];

    NOW_DAMAGE_STATE = {
        "ALWAYS": {},
        "TEMP": {},
    };
    NOW_BUFF_STATE = {};
}

let APPEND_ABILITY = {};

function displayResult(skillList = []) {
    resetVar();

    // 練達でIDは書き換わってる
    if(skillList.length == 0 ) {
        skillList = setSkillList();
    }
    // シミュレーション開始
    culcAutoMode(skillList);

    return skillList;
}
function culcAutoMode(skillList) {
    let maxTurn = $("#SET_TURN").val();
    // culcStyleBonus依存
    let masterTmp = masterLevel($("#SET_MLV").val()) * 100;
    MASTER_LV_ABILITY = (Math.round(masterTmp * 100) / 100);


    let NOW_WAITING = {"wait":0};
    for (let turn = 1; turn <= maxTurn; turn++) {
        THIS_TURN_DAMAGE[turn] = 0;
    }

    $(".culcAfter").show();
    $("#culcDetail > tbody").html("");
    let $detail = $("#culcDetail");


    let initBp = $("#SET_BP").val();
    const odTurn = Number($("#SET_OD").val());
    const dmgCountTurn = Number($("#SET_DMG_COUNT").val());    
    initBp = (initBp < 3) ? 3 : initBp;
    let bp = initBp;
    let lp = Number(NOW_LP);

    
    updateStateFromAbility("バトル開始時");
    updateStateFromAbility("ラウンド開始時");

    let $card;

    // フラグのリセット
    let isHPMax = false;

    // ターンごとの作業開始
    //console.log(BUFF_ABILITY);
    //console.log(Object.assign({},DAMAGE_ABILITY));
    let maxTsuigekiCount = maxTurn;
    let tsuigekiCount = 0;

    if(JINKEI_RYUJIN) {
        BUFF_ABILITY["ターン終了時"].push({
            "NAME": "龍陣",
            "PARAM": "BP",
            "TIME": 100,
            "PER" : 1,
            "LIMIT": 100,
            "OPTION": true,
        });
    }
    if(JINKEI_OTOKO) {
        DAMAGE_ABILITY["ターン開始時"].push({
            "NAME" : "漢街道",
            "ADD_NAME" : "漢街道",
            "ATTR" : "直接", // 全,斬,打,突など
            "TIME" : 100, // "必ず(100%)"
            "PER" : 75,
            // "TURN": 1,
            "LIMIT": 999,
            "TURN": 999,
            "OPTION": true,
        });
    }

    // ターン進行で増える追撃
    let addTsuigeki = {};
    for(i in NOW_STYLE['StyleAbilityIds']){
        let abId = NOW_STYLE['StyleAbilityIds'][i];
    }

    let result = [];
    for (let turn = 1; turn <= maxTurn; turn++) {
        NOW_TURN = turn;
        if(DEBUG) {
            console.log(turn +"T START NOW_BUFF_STATE",JSON.parse(JSON.stringify(NOW_BUFF_STATE ?? {})));
        }        

        // リセット
        if(typeof addTsuigeki[turn] != "undefined") {
            for(tsuigekiInfo of addTsuigeki[turn]) {
                if(typeof canTsuigeki[tsuigekiInfo["targetSkill"]] == "undefined") {
                        canTsuigeki[tsuigekiInfo["targetSkill"]] = [];
                }
                canTsuigeki[tsuigekiInfo["targetSkill"]].push(tsuigekiInfo);
            }
        }

        bp += 3;
        bp = (bp > BP_LIMIT) ? BP_LIMIT : bp;
        let hpmaxTurn = Number($("#SET_HPMAX").val());
        isHPMax = (turn <= hpmaxTurn);

        // デバフのリセット
        delete(NOW_BUFF_STATE["ENEMY_VIT"]);
        delete(NOW_BUFF_STATE["ENEMY_MND"]);

        BUFF_ABILITY["ターン開始時"] = BUFF_ABILITY["ターン開始時"] ?? [];
        if(false && NOW_STYLE['Id'] != "IDadffe") { // シィレイ
            DAMAGE_ABILITY["ターン開始時"].push({"NAME" : "攻防の鼓舞Ⅱ","ADD_NAME" : "攻撃強化","ATTR" : "全", "TIME" : 100, "PER" : 15, "TURN": 1,"LIMIT": 1,"OPTION":false});

            // 長期戦
            // if([1,5,8,11,14,18].includes(turn)) {
            //     BUFF_ABILITY["ターン終了時"].push({"NAME": "琴詩花伝","PARAM": "BP","TIME": 100,"PER" : 10,"LIMIT": 1});
            // } else {
            //     BUFF_ABILITY["ターン終了時"].push({"NAME": "光弦詩吟","PARAM": ["STR","DEX","INT"],"TIME": 100,"PER" : 40,"LIMIT": 1,"OPTION":true});
            // }
            // 通常攻撃ループ
            if([1,4,6,9,11,14].includes(turn)) {
                BUFF_ABILITY["ターン終了時"].push({"NAME": "琴詩花伝","PARAM": "BP","TIME": 100,"PER" : 10,"LIMIT": 1});
            // if([1,3,5,7,8,10,12,14,15].includes(turn)) {
            //     BUFF_ABILITY["ターン終了時"].push({"NAME": "光弦詩吟","PARAM": ["STR","DEX","INT"],"TIME": 100,"PER" : 40,"LIMIT": 1,"OPTION":true});
            } else {
                BUFF_ABILITY["ターン終了時"].push({"NAME": "光弦詩吟","PARAM": ["STR","DEX","INT"],"TIME": 100,"PER" : 15,"LIMIT": 1,"OPTION":true});
            }            
            // if([4,11].includes(turn)) {
            //     BUFF_ABILITY["ターン終了時"].push({"NAME": "魔女の呪法","PARAM": ["INT"],"TIME": 100,"PER" : 15,"LIMIT": 1,"OPTION":true});
            // } else {
            //     BUFF_ABILITY["ターン終了時"].push({"NAME": "魔女の呪法","PARAM": ["INT"],"TIME": 100,"PER" : 40,"LIMIT": 1,"OPTION":true});
            // }
            // if([2,5,8].includes(turn)) {
            //     BUFF_ABILITY["ターン終了時"].push({"NAME": "光弦詩吟","PARAM": ["STR","DEX","INT"],"TIME": 100,"PER" : 15,"LIMIT": 1,"OPTION":true});
            // } else {
            //     BUFF_ABILITY["ターン終了時"].push({"NAME": "光弦詩吟","PARAM": ["STR","DEX","INT"],"TIME": 100,"PER" : 40,"LIMIT": 1,"OPTION":true});
            // }
        }

        if(false) { // ライーザ
            DAMAGE_ABILITY["ターン開始時"].push({"NAME" : "弱点結束","ADD_NAME" : "攻撃強化","ATTR" : "Weak攻撃", "TIME" : 100, "PER" : 30, "TURN": 1,"LIMIT": 1,"OPTION":false});            
            if(turn > 1 && (turn -1) % 3 == 0) {
                DAMAGE_ABILITY["ターン開始時"].push({"NAME" : "ウィークスティンガー","ADD_NAME" : "攻撃強化","ATTR" : "Weak攻撃", "TIME" : 100, "PER" : 65, "TURN": 3,"LIMIT": 1,"OPTION":false});            
            }
        }
        //DAMAGE_ABILITY["ターン開始時"].push({"NAME" : "エンハンスマジック","ADD_NAME" : "ヒートアップ","ATTR" : "全", "TIME" : 100, "PER" : 50, "TURN": 99,"LIMIT": 1,                    });

        let isOverDrive = ""
        console.log("OD", NOW_OD, OD_AUTO_USE, INIT_OD, turn , odTurn, turn % odTurn);

        if( (OD_AUTO_USE &&  ( INIT_OD || turn % odTurn == 0 || NOW_OD >= 95))
        || OD_MANUAL_USE_TURN[turn] != undefined) {
        //if((turn) % 2 == 0){
            arrayPush(DAMAGE_ABILITY, "ターン開始時", {
                "NAME": "OverDrive",
                "ATTR": "全",
                "TIME": 100,
                "PER" : (INIT_OD || turn == 1) ? 0 : OD_ATTACK_BONUS,
                "LIMIT": 1,
                "TURN": 1
            });
            INIT_OD = false;
            isOverDrive = "overdrive";
        }
        

        let before = bp;

        $card = $("#DETAIL_TEMPLATE").clone().removeAttr("id").removeClass("d-none").addClass("SIM_TR");
        $card.find(".NOW_BP").html(before);
        $card.find(".NOW_TURN").html((turn < 10) ? "&nbsp;"+turn: turn);

        let battleType = NOW_STYLE['WeaponType']; // 弓
        // ターン開始時のupdateStateFromAbilityをまとめて実行
        updateStateWithTurnStart(turn, isOverDrive, NOW_OD);

        // ため技発動かどうかチェック
        let tmpSkillList = skillList;
        if(NOW_WAITING['wait'] == 0 && NOW_WAITING['skill'] != undefined) {
            let tameSkill = SKILL_MASTER[NOW_WAITING['skill']];
            tameSkill['AutoUseBp'] = 0;
            tameSkill['rank'] = NOW_WAITING['rank'];
            delete(NOW_WAITING['skill']);
        }

        if(NOW_WAITING["wait"] > 0){
            // ため状態
            let NOW_STR = initBuffMap(NOW_BUFF_STATE, "STR");
            let NOW_DEX = initBuffMap(NOW_BUFF_STATE, "DEX");
            let NOW_AGI = initBuffMap(NOW_BUFF_STATE, "AGI");
            let NOW_INT = initBuffMap(NOW_BUFF_STATE, "INT");
            if (battleType === "体術") {
                $card.find(".BUFF").html(NOW_STR["PER"]+"/"+NOW_AGI["PER"] + "%");
            } else {
                if (battleType.indexOf("術") > -1) {
                    $card.find(".BUFF").html(NOW_INT["PER"] + "%");
                } else if (["小剣", "弓", "銃"].indexOf(battleType) > -1) {
                    $card.find(".BUFF").html(NOW_DEX["PER"] + "%");
                } else {
                    $card.find(".BUFF").html(NOW_STR["PER"] + "%");                    
                }
            }
            let skillName = "┗溜め待機";
            let useBp = `<span class="fuchidori-blue">0</span>`;
            $card.find(".USEBP").html(useBp);
            $card.find(".SKILL_NAME_SM").html(skillName);
            $card.find(".SKILL_NAME").html(skillName);
            $card.find(".DEBUFF").html("");
            $card.find(".DAMAGE").html("0");
            $card.find(".AVG").html(Math.floor(TOTAL_DAMAGE/turn).toLocaleString());
            $card.find(".ABILITY_PER").html("");
            $card.find(".ENEMY_RESIST").html("");
            $card.find(".ATTACK_PARAM").html("");
            $card.find(".ENEMY_PARAM").html("");
            //　ターン処理があるのでcontinueなどはしない
        } else {
            const resultRecords = [];
            // 優先される補助技はBP並び替えの時点で決定済みなので順に見ていく
            for (let skill of tmpSkillList) {
                if(skill['Name'] == undefined) {
                    continue;
                }
                // ターン毎に使用する技を固定するデバッグ
                if(DEBUG) {
                    if(typeof ACTION_PATTERN[NOW_STYLE['Id']] != "undefined"
                    && typeof ACTION_PATTERN[NOW_STYLE['Id']][turn-1] != "undefined") {
                        console.log(turn, skill['Name'] , ACTION_PATTERN[NOW_STYLE['Id']][turn-1]);
                        if(skill['Name'] != ACTION_PATTERN[NOW_STYLE['Id']][turn-1]) {
                            continue;
                        }
                    }
                }
                // ODたまったら補助は使わない
                // if(isOverDrive && skill['Type'] !== "攻撃") {
                //     isOverDrive = "";
                //     continue;
                // }
                let consumeBp = skill['AutoUseBp'];
                _getBpKeigen(consumeBp);
                consumeBp += BP_KEIGEN_SKILL;
                consumeBp = consumeBp < 0 ? 0 : consumeBp;
                if(bp < consumeBp) {
                    continue;
                }
                let ConsumeLp = typeof skill['ConsumeLp'] != "undefined" ? skill['ConsumeLp'] : 0;
                if (lp <= ConsumeLp) {
                    continue;
                }
                // 技をスキップするパターンまとめ
                if(skipSkillPattern(skill, turn, bp)) {
                    continue;
                }
                console.log('BP is', bp , skill['Name'], 'use', consumeBp);
                bp -= consumeBp;
                lp -= ConsumeLp;
                for(idx in (skill['Mod'] ?? []) ){
                    const tag = skill['Mod'][idx];
                    if(tag == "攻撃前に回復威力" && skill['Mod1'][idx] > 15) {
                        isHPMax = true;
                    }
                }

                let useBp = skill['AutoUseBp'];
                if (skill['AttackAttributes'] === undefined) {
                    skill['BattleType'] = NOW_STYLE['WeaponType'];
                    skill['AttackAttributes'] = WEAPON_ATTR[NOW_STYLE['WeaponType']];
                }
                battleType = skill['BattleType'];

                // ターン開始時バフ
                if(isOverDrive && skill['Type'] == "攻撃"){
                    updateStateFromAbility("OD攻撃時");
                }

                let skillIds = getThisTurnAttack(skill, turn, isHPMax, isOverDrive);

                // 使用技、多段ヒット、追撃のまとめ
                const resultRecord = buffAndCalcDamage(skill, turn, true, isHPMax, isOverDrive);                                        
                // 追撃を行うか確認する
                let skillId = skill['Id'];
                // 多段攻撃対応
                let count = getMultiAttackCount(skillId);
                while(count--){
                    let addRecord = addAttack(skill['Id'], (skill['rank'] ?? 99), turn, false, isHPMax, isOverDrive);
                    resultRecords.push(addRecord);
                }


                if(skill['Name'] == "セルフバーニング") {
                    TOTAL_DAMAGE -= resultRecord['damage'];
                    THIS_TURN_DAMAGE[NOW_TURN] -= resultRecord['damage'];
                    resultRecord['damage'] = 0;
                }
                if(isOverDrive && skill['Type'] == "攻撃"){
                    updateStateFromAbility("OD攻撃(※)を発動後");
                }

                resultRecords.push(resultRecord);

                if (hasCriticalTargets(skill)){
                    DISP_ABILITY_NAMES.push("特効:" + skill['CriticalTargets']);
                }

                // 追撃発生
                // 攻撃前追撃追加なので、直接追加する
                    canTsuigeki = setAddAttackFromSkill(skill, canTsuigeki);
                addSkill = typeof skill['AddSkill'] !== "undefined" ? skill['AddSkill'] : [];
                if(typeof skill['isTamewaza'] !== "undefined") {
                    // 溜め技は状態管理する
                    NOW_WAITING = {"wait":skill['isTamewaza'], "skill":skill['AddSkill']};
                } else if((skill["Mod"] ?? []).join().indexOf("カウンター") == -1){
                    // カウンターの追加は後で行う
                    for(addSkillId of addSkill) {
                        if(SKILL_MASTER[addSkillId] == undefined) {
                            continue;
                        }
                        let per = 100;
                        if(getTsuigekiRand(addSkillId, per)) {
                            SKILL_MASTER[addSkillId]['rank'] = (skill['rank'] ?? 99);
                            calcAddAttack(resultRecords, SKILL_MASTER[addSkillId], $card, turn, isHPMax, isOverDrive, nextTurnTsuigeki)
                        }
                    }
                }


                function getThisTurnAttack(skill, turn, isHPMax, isOverDrive) {
                    let thisTurnSkills = [skill["Id"]];
                    if(skill['Type'] != "攻撃") {
                        thisTurnSkills;
                    }
                    let patternList = [
                        "攻撃を発動後",
                        "タイプが「攻撃」である技・術(※)を命中させた時",
                        "OD攻撃(※)を発動後",
                        "Critical攻撃(※)を命中させた時",
                    ];
                    addAbilityFromAbility(pattern);
                    // 追撃チェック
                    [x1, x2, x3, resist] = skill['culcData'];
                    oddEven = (turn % 2 == 1) ? "any-odd" : "any-even";
                    hpMapTuigeki = (isHPMax) ? "any-HPMax" : "any-HPMin";
                    skillRange = ATTACK_RANGE[skill['AttackArea']];
                    let checkTsuigekiPattern = [skillId, 'any', 'any-'+turn, oddEven, hpMapTuigeki, skillRange, isOverDrive + skill['Type']];
                    if(turn % 3 == 0 && skillRange == 'single'){
                        checkTsuigekiPattern.push("single-3");
                    }
                    if(resist <= -35) {
                        checkTsuigekiPattern.push(`${isOverDrive}${skill['Type']}/Weak攻撃時`);
                        checkTsuigekiPattern.push("Weak攻撃時");
                    }
                    console.log('追撃パターンチェック',checkTsuigekiPattern);
                    console.log('canTsuigeki',JSON.parse(JSON.stringify(canTsuigeki)));

                    // 追撃を減衰もある
                    let keys = skill['Type'] == "攻撃" ? Object.keys(canTsuigeki) : [];
                    for(let targetId of keys) {
                        for(let diffId of checkTsuigekiPattern) {
                            if(targetId == diffId) {
                                for(let idx in canTsuigeki[targetId]) {
                                    tsuigekiSkill = canTsuigeki[targetId][idx];
                                    if(tsuigekiSkill == null) {
                                        continue;
                                    }

                                    let addAttackPer = (changeAddPer === false) ? tsuigekiSkill["PER"] : changeAddPer;
                                    let excludeSkill = typeof tsuigekiSkill['exclude'] == "undefined" ? [] : tsuigekiSkill['exclude'];

                                    if(excludeSkill.includes(skillId)){
                                        continue;
                                    }
                                    if(!getTsuigekiRand(targetId + idx, addAttackPer)) {
                                        continue;
                                    }
                                    let rank = tsuigekiSkill['rank'] ?? 1;

                                    // ため技に移行するタイプ
                                    if(typeof tsuigekiSkill['moveToWaiting'] != "undefined") {
                                        // 溜め技は状態管理する
                                        NOW_WAITING = {
                                            "wait": tsuigekiSkill['moveToWaiting']['turn'],
                                            "rank": tsuigekiSkill['moveToWaiting']['rank'],
                                            "skill": tsuigekiSkill['moveToWaiting']['id'],
                                        };
                                        continue;
                                    }
                                    // デバッグ用の追撃回数キャップ
                                    tsuigekiCount++;
                                    let cupTsuigekiCount = Math.floor(maxTsuigekiCount * addAttackPer / 100);
                                    if(cupTsuigekiCount < tsuigekiCount) {
                                        //continue;
                                    }
                                    // これなんだっけ
                                    if( turn % (100 /addAttackPer) != 0 ) {
                                        //continue;
                                    }
                                    if(typeof ABILITY_MASTER[tsuigekiSkill["abId"]] != "undefined") {
                                        let abInfoTmp = ABILITY_MASTER[tsuigekiSkill["abId"]];
                                        DISP_ABILITY_NAMES.push(abInfoTmp['Name']);
                                    }
                                    for(let addSkillId of tsuigekiSkill["addSkill"]){
                                        // 追撃からの追撃（プレゼント忍法など）
                                        nextTurnTsuigeki = setAddAttackFromSkill(SKILL_MASTER[addSkillId], nextTurnTsuigeki);
                                        // 追撃だって多段攻撃する
                                        let count = getMultiAttackCount(addSkillId);
                                        for(let i = 0; i < count; i++){
                                            // 追撃時も最初の1回はバフが入る
                                            let canBaff = (i == 0);
                                            let addRecord = addAttack(addSkillId, rank, turn, canBaff, isHPMax, isOverDrive);
                                            resultRecords.push(addRecord);
                                        }
                                    }
                                    if(typeof tsuigekiSkill['limit'] != "undefined") {
                                        nextTurnTsuigeki[targetId][idx]['limit']['time']--;
                                        if(nextTurnTsuigeki[targetId][idx]['limit']['time'] <= 0) {
                                            //delete canTsuigeki[targetId][idx];
                                            delete nextTurnTsuigeki[targetId][idx];                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                // カウンターチェック
                for(let record of resultRecords) {
                    if(record == undefined || record['skill'] == undefined) {
                        continue;
                    }
                    let skill = record['skill'];
                    for(let modIdx in skill["Mod"]) {
                        if(skill["Mod"][modIdx].indexOf("カウンター") > -1){
                            console.log(turn , skill);
                            // カウンターはアビリティ登録する
                            COUNTER_ABILITY.push({
                                "skill" : SKILL_MASTER[skill['AddSkill'][0]],
                                "time" : 100,
                                "limit": 100,
                                "TURN": Number(skill["ModTurn"][modIdx]), 
                                "Rank": skill['culcData'][2],
                            });
                        }
                    }                    
                }
                // ループダメージにカウンターは入れない
                // if(COUNTER[skillId] !== undefined){
                //     // 一時設定
                //     SKILL_MASTER[COUNTER[skillId]['Name']] = COUNTER[skillId];
                //     let addRecord = addAttack(COUNTER[skillId]['Name'], COUNTER[skillId]['Rank'], true, isHPMax, isOverDrive);
                //     resultRecords.push(addRecord);
                // }
                for(let counterIdx = 0; counterIdx < dmgCountTurn; counterIdx++) {
                    updateStateFromAbility("攻撃を受けた時");
                    updateStateFromAbility("直接攻撃を受けた時");
                    updateStateFromAbility("自身以外の味方生存者が攻撃を受けた時");     
                    NOW_OD += 8;
                    // 直接攻撃を受けた場合も必要かも
                    for(const cIdx in COUNTER_ABILITY) {
                        const counter = COUNTER_ABILITY[cIdx];
                        if(getCounterRand(counter['skill']['Name'], counter['time'])){
                            let count = getMultiAttackCount(counter['skill']['Id']);
                            for(let i = 0; i < count; i++){
                                // セルバのみRankありで反撃する
                                const rank = (counter['skill']['Id'] == "ID774dfee") ? 99 : counter['Rank'] ?? 1;
                                // 追撃時も最初の1回はバフが入る
                                let canBaff = (i == 0);
                                let addRecord = addAttack(counter['skill']['Id'], rank, turn, canBaff, false, false);
                                resultRecords.push(addRecord);
                            }
                            COUNTER_ABILITY[cIdx]["limit"]--;
                            if(COUNTER_ABILITY[cIdx]["limit"] <= 0) {
                                delete COUNTER_ABILITY[cIdx];
                            }                                
                        }
                    }
                    updateStateFromAbility("攻撃を受けた時_カウンター後");
                }

                if(BP_HEAL_SKILL > 0){
                    bp += BP_HEAL_SKILL;
                    bp = (bp > BP_LIMIT) ? BP_LIMIT : bp;
                    useBp += `<span class="fuchidori-blue">(+${BP_HEAL_SKILL})</span>`;
                    BP_HEAL_SKILL = 0;
                }
                if(BP_KEIGEN_SKILL < 0){
                    useBp += `<span class="fuchidori-blue">(${BP_KEIGEN_SKILL})</span>`;
                }

                $card.find(".USEBP").html(useBp); // + noUse 補助わざ

                addSkillResultRow($card, resultRecords, isOverDrive);
                // ターン中に追加したものを反映する
                canTsuigeki = nextTurnTsuigeki
                break;
            }
        }


        // ODした後はゲージがたまらない
        if(isOverDrive != "") {
            NOW_OD = 0;
        }
        
        // ターン終了処理
        if(NOW_WAITING["wait"] > 0){
            NOW_WAITING["wait"]--;
        }
        if(isHPMax) {
            updateStateFromAbility("自身がダメージを受けていなかった場合",[]);
        }
        updateStateWithTurnEnd(turn, isOverDrive, NOW_OD);

        // バフ内容の不要なものを削除
        clearBuff(BUFF_ABILITY);
        clearBuff(DEBUFF_ABILITY);
        clearBuff(DAMAGE_ABILITY);
        for(abInfo of (OD_ABILITY['ターン終了時'] ?? []) ) {
            NOW_OD += !!abInfo['PER'] && !isNaN(abInfo['PER']) ? Number(abInfo['PER']) : 0;
        }
        if(turn % 2 == 0) {
            for(abInfo of (OD_ABILITY['偶数ターン終了時'] || [])) {
                NOW_OD += !!abInfo['PER'] && !isNaN(abInfo['PER']) ? Number(abInfo['PER']) : 0;
            }    
        } else {
            for(abInfo of (OD_ABILITY['奇数ターン終了時'] || [])) {
                NOW_OD += !!abInfo['PER'] && !isNaN(abInfo['PER']) ? Number(abInfo['PER']) : 0;
            }
        }
        // アビリティ名の空と追撃などでの重複は排除
        let dList = [];
        for(abName of DISP_ABILITY_NAMES) {
            let n = abName.trim();
            // 技によるヒートアップなどは強制的に重複させる
            if((n != "" && dList.indexOf(n) == -1) && n.indexOf("スキル") == -1){
                dList.push(n);
            }
        }
        $card.find(".ABILITY").html(dList.join("<br>"));
        // バフの色付け
        for(key of ["STR", "DEX", "AGI", "INT"]) {
            let BUFF = initBuffMap(NOW_BUFF_STATE, key);
            if(BUFF["TURN"] == 4){
                $card.find(".BUFF").addClass("fuchidori-blue");
            }
        }

        // BP回復
        let plus = 0;
        if(BP_HEAL_ABILITY > 0){
            plus += BP_HEAL_ABILITY;
            BP_HEAL_ABILITY = 0;
        }

        if (plus > 0 ) {
            bp += plus;
            bp = (bp > BP_LIMIT) ? BP_LIMIT : bp;
            $card.find(".LEFT_BP").html(`${bp}(+${plus})`);
            $card.find(".LEFT_BP").addClass("shadow-blue");
        } else {
            $card.find(".LEFT_BP").html(bp);
        }

        $detail.append($card);
        result.push(`${turn}T\tOD:${NOW_OD}\t${THIS_TURN_DAMAGE[turn]}`);

        // ターン終了時バフの減衰
        decrement();
        if(DEBUG) {
            console.log(turn +"T 終了時 NOW_DAMAGE_STATE",JSON.parse(JSON.stringify(NOW_DAMAGE_STATE ?? [])));
            console.log(turn +"T 終了時 NOW_BUFF_STATE",JSON.parse(JSON.stringify(NOW_BUFF_STATE ?? {})));

            console.log(turn +"T 終了時 COUNTER_ABILITY",JSON.parse(JSON.stringify(COUNTER_ABILITY ?? [])));
            console.log(turn +"T 終了時 TSUIGEKI_ABILITY",JSON.parse(JSON.stringify(TSUIGEKI_ABILITY ?? [])));
            console.log(turn +"T 終了時 OD_ABILITY",JSON.parse(JSON.stringify(OD_ABILITY ?? [])));

            console.log(turn +"T 終了時 ADD_ABILITY",JSON.parse(JSON.stringify(ADD_ABILITY ?? [])));        
        }
    }
    if(DEBUG) {
        console.log(THIS_TURN_DAMAGE);
        console.log(result.join("\n"));
    }

    // サマリ
    $("#culcSummary .SKILL_TR").remove();
    let $summary = $("#culcSummary");
    $summary.find(".WEAPON").html($("#SET_WEAPON").val());
    $summary.find(".SEISEKI").html($("#SET_SEISEKI").val());
    $summary.find(".TURN").html(maxTurn);

    let strFlg = true;
    let dexFlg = false;
    let agiFlg = false;
    let intFlg = false;
    for (let skill of skillList) {
        if　(skill['SkillType'] === "術" || skill['SpecialType'] == '知力') {
            intFlg = true;
        }
    }



    // 画面表示設定
    if　(NOW_STYLE['WeaponType'] == "体術") {
        agiFlg = true;
    } else if (["小剣", "弓", "銃"].indexOf(NOW_STYLE['WeaponType']) > -1) {
        strFlg = false;
        dexFlg = true;
    }
    let st = "";
    if(strFlg){
        st += `腕:${$("#styleSTR").val()}+${$("#eqSTR").val()}(+${$("#jinkeiSTR").val()}%) `;
    }
    if(dexFlg){
        st += `器:${$("#styleDEX").val()}+${$("#eqDEX").val()}(+${$("#jinkeiDEX").val()}%) `;
    }
    if(agiFlg){
        st += `速:${$("#styleAGI").val()}+${$("#eqAGI").val()}(+${$("#jinkeiAGI").val()}%) `;
    }
    if(intFlg){
        st += `知:${$("#styleINT").val()}+${$("#eqINT").val()}(+${$("#jinkeiINT").val()}%) `;
    }
    $summary.find(".STATUS").html(st);
    $summary.find(".E_VIT").html($("#enemy_vit").val());
    $summary.find(".E_MND").html($("#enemy_mnd").val());
    $summary.find(".Mlv").html($("#SET_MLV").val());
    $summary.find(".MlvPer").html(MASTER_LV_ABILITY);


    // 技リストを表示用に並び替える
    // 所持技ｰ>継承技ｰ>通常攻撃ｰ>追撃など、の順に並べる
    let skillListSorted = [];
    for (let skillId of NOW_STYLE['SkillIds']){
        for (let idx in skillList) {
            let useId = skillList[idx]['Id'];
            let skillInfo = SKILL_MASTER[useId];
            if(skillInfo == undefined) {
                continue;
            }
            if(skillId == skillList[idx]['Id'] 
            || (skillInfo['Rentatsu'] !==undefined && skillId == skillInfo['Rentatsu']) ){
                skillListSorted.push(skillList[idx]);
                delete(skillList[idx]);
                break;
            }
        }
    }
    let normal ={};
    for (let skill of skillList) {
        if(skill !== undefined){
            if(skill['Name'] == "通常攻撃"){
                normal = skill;
            } else if(skill['Id'] != 0){
                skillListSorted.push(skill);
            }
        }
    }
    skillListSorted.push(normal);

    // サマリに追加する技設定
    for (let skill of skillListSorted) {
        let $tr = $summary.find(".TR_TEMPLATE").clone().removeClass("TR_TEMPLATE d-none").addClass("SKILL_TR");
        if (skill['AttackAttributes'] !== undefined) {
            //BattleType , AttackAttributes
            //BattleType , AttackAttributes
            let battleIcon = getImgPath(`icon/${ICON_LIST[skill['BattleType']]}.png`);
            let bIcon = $(`<img src="${battleIcon}" class="icon_xs d-none d-lg-inline">`);
            $tr.find(".NAME").append(bIcon);
            skill['AttackAttributes'].split(',').forEach(function (value) {
                let attrIcon = getImgPath(`icon/${ICON_LIST[value]}.png`);
                let aIcon = $(`<img src="${attrIcon}" class="icon_xs d-none d-lg-inline">`);
                $tr.find(".NAME").append(aIcon);
            });
        }
        let setKakusei = skill['ConsumeBp'] - skill['UseBp'];
        for (let i = 1; i <= skill['Kakusei']; i++) {
            $tr.find(".KAKUSEI").append((setKakusei >= i) ? "◆" :"◇");
        }
        $tr.find(".NAME").append(skill["Name"]);
        $tr.find(".BP").html(skill["UseBp"]);
        $tr.find(".USE").html(skill["UseCount"]);
        let MULTI = (skill['MinActionTime'] + skill['MaxActionTime']) / 2;
        let multiHit = (MULTI > 1) ? ` * ${MULTI}Hit`: '';
        $tr.find(".IRYOKU").html(skill["SkillIryoku"] + multiHit);
        let avg = 0;
        if((skill["DamageList"] ?? []).length > 0){
            let sum = 0;
            for(let d of skill["DamageList"]){
                sum += d;
            }
            avg = number_format(Math.round(sum / skill["DamageList"].length, 2));
        }
        $tr.find(".DAMAGE").html(avg);
        if(skill["UseCount"] == 0){
            $tr.find(".IRYOKU").addClass("fuchidori-red");
            $tr.find(".DAMAGE").addClass("fuchidori-red");
        }
        if (skill['Name'] == "通常攻撃"){
            //$tr.addClass("NORMAL");
        }
        $summary.find(".TR_TEMPLATE").before($tr.clone());
    }
    
    $summary.find(".SUMMARY_CUTIN").attr("src", getImgPath(`style_cutin/${NOW_STYLE['Id']}.png`));
    let styleIcon = getStyleIcon(NOW_STYLE['Rarity'], NOW_STYLE['Id'], NOW_STYLE['WeaponType'], true);
    styleIcon.removeClass("style").addClass("test");
    $summary.find(".SUMMARY_ICON").html("").append(styleIcon);
    let avgDamage = Math.round(TOTAL_DAMAGE / maxTurn ).toLocaleString();
    $summary.find(".AVG_DMG").html(avgDamage);
    $summary.find(".TOTAL_DMG").html(TOTAL_DAMAGE.toLocaleString());

    $summary.find(".OPTION").html("");
    let diffCard = $summary.clone().addClass("col-12 col-sm-6").removeAttr("id");
    diffCard.find(".NORMAL").remove();
    diffCard.find(".TR_TEMPLATE").remove();
    diffCard.find(".CLOSE_BTN").removeClass("d-none");
    diffCard.find(".CLOSE_BTN").click(function(){
        $(this).parent().remove();
    });

    $("#culcSummaryArea").append(diffCard);
}


let LOGIN_FLG = false;
if(typeof firebase !== 'undefined'){
    firebase.auth(appUsers).onAuthStateChanged((user) => {
        if (user) {
            USER = user;
            UID = user.uid;
            LOGIN_FLG = true;
            initial();
        }
    });
}

async function initial() {
    firebase.database().goOffline();
    firebase.database(appUsers).goOffline();
}

$(document).ready(function ($) {
    for(p of ["STR","DEX","INT","AGI"]) {
        $("#eq"+p).val(URA);
    }

    dispGachaStyle();    
    dispChar2(CHAR_MASTER);
    initialHide();

    if (location.search !== "") {
        const params = new URLSearchParams(location.search);
        const styleId = params.get("s");
        if (STYLE_MASTER[styleId] !== undefined) {
            let charId = STYLE_MASTER[styleId]['CharacterId'];
            //Title変更
            document.title = `【ロマサガRS】${STYLE_MASTER[styleId]['Name']}[${STYLE_MASTER[styleId]['Rarity']}]の全力AUTOシミュレーター`;
            //Description変更
            let desc = `${STYLE_MASTER[styleId]['Name']} ${STYLE_MASTER[styleId]['Rarity']} ${STYLE_MASTER[styleId]['AnotherName']} の全力オートシミュレーターです。技の覚醒や継承にご利用ください。ダメージ計算もできます。`;
            $("meta[name='description']").attr("content", desc);
            clickDotChar(charId, styleId);
        }
    }
    /**
     * 武器ボタンクリック
     */
    $(document).on('click', '.WEAPON_CHOISE', function () {
        $(".WEAPON_AREA").find(".filterActive").each(function(){
            $(this).removeClass("filterActive");
        });
        $(this).parents(".d-inline-block").addClass("filterActive");
        let wp = Number($(this).parents(".d-inline-block").attr("data-val"));
        let jpType = $(this).parents(".d-inline-block").attr("data-type");
        $("#SET_WEAPON").val(wp);
        for(i = 51; i<=56; i++) {
            $("#SET_WEAPON_"+i).val(wp < 40 ? wp: 0);
        }
        (jpType ?? "").split(",").forEach(type => {
            $("#SET_WEAPON_"+type).val(wp);
        });
        
        if(typeof $(this).parents(".d-inline-block").attr("data-stone") != "undefined") {
            $("#SET_SEISEKI").val(Number($(this).parents(".d-inline-block").attr("data-stone")));
        } else if($("#SET_SEISEKI").val() == "99" || $("#SET_SEISEKI").val() == "60") {
            $("#SET_SEISEKI").val(80);
        }
        changeStatus();
    });

    /**
     * 装備ボタンクリック
     */
    $(".ARMOR_CHOISE").click(function(){
        let type = $(this).attr("data-type");
        clickArmor(type);
        $(".ARMOR_CHOISE").each(function(){
            $(this).removeClass("icon_btn_positive").addClass("icon_btn_negative");
        });
        $(this).removeClass("icon_btn_negative").addClass("icon_btn_positive");
        changeStatus();
    });

    $("#HISTORY_RESET").click(function(){
        $("#culcSummaryArea").find(".bg-simple").each(function(){
            $(this).slideUp(100, function(){
                $(this).remove();
            });
        });
    });

    $(".filterList").click(function () {
        $(".dotList").addClass("d-none");
        let value = $(this).attr("data-href");
        $("#" + value).removeClass("d-none");
        if (!$(this).find(".fButton").hasClass("filterActive")) {
            // 絞り込み
            $(".filterList").each(function () {
                $(this).find(".fButton").removeClass("filterActive");
            });
            $(this).find(".fButton").toggleClass("filterActive");
        }
    });
    $(".ONOFF_JINKEI").click(function(){
        const target = $(this).attr("data-value");
        const v = $(this).hasClass("icon_btn_negative");
        JINKEI_RYUJIN = false;
        JINKEI_OTOKO = false;    
        JINKEI_RYUJIN = (target == "ryujin" && v);
        JINKEI_OTOKO = (target == "otoko" && v);
        toggleRadioButton($(this), v, ".ONOFF_JINKEI");
    });
    $(".ONOFF_BUFF").click(function(){
        const value = $(this).attr("data-value");
        const nextTrue = $(this).hasClass("icon_btn_negative");
        BUFF_STATE = nextTrue ? Number(value) : RAND_PATTERN.RAND;
        toggleRadioButton($(this), nextTrue, ".ONOFF_BUFF");
    });
    $(".ONOFF_COUNTER").click(function(){
        const value = $(this).attr("data-value");
        const nextTrue = $(this).hasClass("icon_btn_negative");
        COUNTER_STATE = nextTrue ? Number(value) : RAND_PATTERN.RAND;
        toggleRadioButton($(this), nextTrue, ".ONOFF_COUNTER");
    });    
    

    $(".ONOFF_TSUIGEKI").click(function(){
        const value = $(this).attr("data-value");
        const nextTrue = $(this).hasClass("icon_btn_negative");
        TSUIGEKI_STATE = nextTrue ? Number(value) : RAND_PATTERN.RAND;
        toggleRadioButton($(this), nextTrue, ".ONOFF_TSUIGEKI");
    });

    
    function toggleRadioButton(button, value, clz){
        $(clz).each(function(){
            $(this).find(".fas").addClass("fa-toggle-off").removeClass("fa-toggle-on");
            $(this).addClass("icon_btn_negative").removeClass("icon_btn_positive");      
        });
        toggleButton(button, value);
    }
    function toggleButton(button, nextTrue) {
        if(nextTrue) {
            button.find(".fas").removeClass("fa-toggle-off").addClass(" fa-toggle-on");
            button.removeClass("icon_btn_negative").addClass("icon_btn_positive");           
        } else {
            button.find(".fas").addClass("fa-toggle-off").removeClass(" fa-toggle-on");
            button.addClass("icon_btn_negative").removeClass("icon_btn_positive");       
        }
    }

    $(".ONOFF_BTN").click(function(){
        if($(this).hasClass("icon_btn_off")){
            if(($(this).attr("data-type") == "counter")){
                isAddCounter = true;
            } else if(($(this).attr("data-type") == "crit")){
                isTokkou = true;
            } else if(($(this).attr("data-type") == "buf")){
                isBuf = true;
            } else if(($(this).attr("data-type") == "normal")){
                is1TNormal = true;
            } else if(($(this).attr("data-type") == "isHojoPrimary")){
                isHojoPrimary = true;
            } else if(($(this).attr("data-type") == "isLimitPrimary")){
                isLimitPrimary = true;
            } else if($(this).attr("data-type") == "add100" || $(this).attr("data-type") == "add0"){
                if($(this).attr("data-type") == "add100"){
                    $(".ONOFF_BTN"+".ADD0").find(".fas").addClass("fa-toggle-off").removeClass(" fa-toggle-on");
                    $(".ONOFF_BTN"+".ADD0").addClass("icon_btn_off").removeClass("icon_btn_on");
                } else {
                    $(".ONOFF_BTN"+".ADD100").find(".fas").addClass("fa-toggle-off").removeClass(" fa-toggle-on");
                    $(".ONOFF_BTN"+".ADD100").addClass("icon_btn_off").removeClass("icon_btn_on");
                }
                changeAddPer = Number($(this).attr("data-value"));
            } 

        } else {
            if(($(this).attr("data-type") == "counter")){
                isAddCounter = false;
            } else if(($(this).attr("data-type") == "crit")){
                isTokkou = false;
            } else if(($(this).attr("data-type") == "buf")){
                isBuf = false;
            } else if(($(this).attr("data-type") == "normal")){
                is1TNormal = false;
            } else if(($(this).attr("data-type") == "isHojoPrimary")){
                isHojoPrimary = false;
            } else if(($(this).attr("data-type") == "isLimitPrimary")){
                isLimitPrimary = false;
            } else if($(this).attr("data-type") == "add100" || $(this).attr("data-type") == "add0"){
                changeAddPer = false;
            }        
        }
        $(this).find(".fas").toggleClass("fa-toggle-off").toggleClass(" fa-toggle-on");
        $(this).toggleClass("icon_btn_off").toggleClass("icon_btn_on");
    });

    $(document).on('click', '#OPTION_BUTTON', function () {
        $("#OPTION_BODY").slideToggle(200);
    });

    // 後から差し込まれる要素はdocument.onにしないとfunctionがbindされない
    $(document).on('click', '.dot-base', function () {
        let charId = $(this).find(".char").attr("data-id");
        clickDotChar(charId);
        changeStatus();
        gtag('event', "clickChar", {'event_category': "auto", 'event_label': NOW_CHAR['Name'], 'value': 1});
    });

    // 後から差し込まれる要素はdocument.onにしないとfunctionがbindされない
    $(document).on('click', '#GACHA_AREA .style', function () {
        let styleId = $(this).attr("data-id");
        let styleInfo = STYLE_MASTER[styleId];
        let charId = styleInfo['CharacterId'];
        NOW_STYLE = styleInfo;
        clickDotChar(charId);
        changeStatus();
        gtag('event', "clickNewStyle", {'event_category': "auto", 'event_label': styleInfo['AnotherName'], 'value': 1});
    });

    /**
     * スタイルクリック
     */
    $(document).on('click', '.style', function () {
        let styleId = $(this).attr("data-id");
        clickStyle(styleId);
        gtag('event', "clickStyle", {'event_category': "auto", 'event_label': NOW_STYLE['Name'] + NOW_STYLE['AnotherName'], 'value': 1});
    });


    $(document).on('click', '#keishoKaijo', function () {
        $("#noKeisho").show();
        $("table#skillArea > tfoot .SKILL_TR").remove();
    });

    $(document).on('click', '.KEISHO_SKILL', function () {
        $("#x").remove();
        $(this).children(".floatLeft").append("<span id='x' class='icon_keisho_e'></span>");
        $("#noKeisho").hide();
        $("table#skillArea > tfoot .SKILL_TR").remove();
        // 中身をイジイジするので値渡しにしておく
        let skillId = $(this).attr("data-id");
        let skillInfo = Object.assign({}, SKILL_MASTER[skillId]);
        skillInfo['isKeisho'] = 1;
        skillInfo['UseBp'] = skillInfo['ConsumeBp'];
        if(SKILL_MASTER[skillId]['Type'] == "攻撃") {
            SKILL_MASTER[skillId]['SkillIryoku'] = ((skillInfo['SkillIryoku'] == "" || skillInfo['SkillIryoku'] == 0) && skillInfo['PowerGrade'] != '-') 
            ? IRYOKU_MAP[skillInfo['PowerGrade']] : skillInfo['SkillIryoku'];    
        }
    });

    $("#showJoken").click(function () {
        gtag('event', "showJoken", {'event_category': "auto", 'event_label': "none", 'value': 1});
    });
    $(".culcStart").click(function () {
        gtag('event', "clickCalc", {'event_category': "auto", 'event_label': NOW_STYLE['Name'] + NOW_STYLE['AnotherName'], 'value': 1});

        displayResult();
        $("html,body").animate({scrollTop: $('#HISTORY_RESET').offset().top}, 500, 'swing');
    });

    $(".switch .toggle").click(function () {
        $(this).toggleClass("accordionActive").next().slideToggle(300);
    });

    $(".enemyfilterList").click(function () {
        let value = $(this).attr("data-id");
        let label = $(this).attr("data-label");
        let isActive = $(this).hasClass("filterActive");
        gtag('event', "clickEnemy", { 'event_category': "auto", 'event_label': label, 'value': 1 });
        $(".enemyfilterList").each(function () {
            $(this).removeClass("filterActive");
        });
        let enemy = (isActive) ? ENEMY_RESIST[0] : ENEMY_RESIST[value];
        if (!isActive) {
            $(this).toggleClass("filterActive");
        }
        $("#taisei_zan").val(enemy[0]);
        $("#taisei_da").val(enemy[1]);
        $("#taisei_totsu").val(enemy[2]);
        $("#taisei_netsu").val(enemy[3]);
        $("#taisei_rei").val(enemy[4]);
        $("#taisei_rai").val(enemy[5]);
        $("#taisei_you").val(enemy[6]);
        $("#taisei_in").val(enemy[7]);
    });    
});

/**
 * キャラクタークリック時
 * @param {type} charId
 * @param {type} styleId
 * @returns {undefined}
 */
function clickDotChar(charId, styleId = "") {
    $("#styleLabel").show();
    NOW_CHAR = CHAR_MASTER[charId];
    console.log(charId, NOW_CHAR);
    // 1件目はデフォルトで出しちゃう
    styleId = (styleId !== "") ? styleId : NOW_CHAR['Holders'][NOW_CHAR['Holders'].length-1];
    NOW_STYLE = STYLE_MASTER[styleId];
    $("#SET_LP").val(NOW_STYLE['Lp']);
    
    $("#RANK_LINK").attr("href", "./ourchar.html?c="+charId);
    $(".CHAR_NAME").text(NOW_CHAR['Name']);
    let dotId = NOW_CHAR['DotId'];
    // リセット
    $("#skillAreaParent").hide();
    $(".culcStart").hide();
    $("#keishoKaijo").hide();
    $(".skillChoice").html("");
    $("table#skillArea > tbody .SKILL_TR").remove();
    $("table#skillArea > tfoot .SKILL_TR").remove();
    $("#keisyoSkill").html(""); // クリア
    $(".culcAfter").hide();
    $("#culcSummary .SKILL_TR").remove();
    $("#culcDetail > tbody").html("");

    //SET_MLV
    $("#NOW_MAX_ML").html(WEAPON_MAP[NOW_STYLE['WeaponType']]['master']);
    $("#SET_MLV").html(WEAPON_MAP[NOW_STYLE['WeaponType']]['master']);

    $(".char-selected").each(function (i, e) {
        $(this).removeClass('char-winner');
        $(this).addClass('char-aruku-left');
    });
    
    $(`.dot${dotId}`).each(function(){
        $(this).removeClass('char-aruku-left').addClass('char-winner').addClass('char-selected');
    });

    displayStyleList(charId);
    displayWeaponIcon(NOW_STYLE);
    clickStyle(styleId);

    $("html,body").animate({scrollTop: $('#styleLabel').offset().top}, 500, 'swing');
}

let PARTY_DATA = {};
function analyzeAbility(result) {
    const styleId = NOW_STYLE['Id'];
    PARTY_DATA[styleId] = result;
}


/**
 * スタイルクリック時
 * @param {type} styleId
 * @returns {undefined}
 */
function clickStyle(styleId) {
    console.log("clickStyle");
    $.getJSON(`https://romasagatool.com/api/style_simulator.php?sid=${styleId}&c=analyzeAbility&analyzeAbility=?`);

    history.replaceState('','',`battle.html?s=${styleId}`);

    NOW_STYLE = STYLE_MASTER[styleId];
    console.log(NOW_STYLE);

    let initBp = 10;
    $("#styleAbility").html("");
    let dispAbNameList = [];
    for(let id in NOW_STYLE['StyleAbilityIds']){
        let ab = ABILITY_MASTER[NOW_STYLE['StyleAbilityIds'][id]];
        for(attr of ab['Attr']) {
            if(attr['main'] == "BP回復" && attr['when'] == "バトル開始時") {
                initBp += attr['size'];
            }
        }
        dispAbNameList.push(ab['Name']);
    }
    $("#SET_BP").val(initBp);

    $("#styleAbility").append(dispAbNameList.join("<br>"));
    
    $("#skillAreaParent").show();
    $(".skillChoiceArea").show();
    $("#STYLE_LINK").attr("href", "./style.html?s="+styleId);

    $(".culcStart").show();
    if (NOW_CHAR['Holders'].length > 1) {
        $("#keishoKaijo").show();
    }
    $(".skillChoice").html("");
    $("table#skillArea > tbody .SKILL_TR").remove();
    $("table#skillArea > tfoot .SKILL_TR").remove();
    $("#culcSummary .SKILL_TR").remove();
    let map = {"S": "STR", "D": "DEX", "A": "AGI", "I": "INT"};
    for (let key of["S", "D", "A", "I"]) {
        let charBase = NOW_CHAR[map[key]] + NOW_CHAR[`MAX${map[key]}`] + LIMIT_BASE;
        let x = Math.floor(charBase * (1 + (NOW_STYLE[`Lv50${key}`]["Per"] + SHODAN) / 100))
                + NOW_STYLE[`Lv50${key}`]["Bonus"];
        $("#char" + map[key]).val(charBase);
        $("#style" + map[key]).val(x);
    }

    $(".style").each(function(){
        $(this).find(".CHECK_COVER").addClass("icon_nocheck");
        if(styleId == $(this).attr("data-id")){
            $(this).find(".CHECK_COVER").removeClass("icon_nocheck");
        }
    });
    displaySkillTable(styleId);
}

function displayStyleList(charId) {
    $(".styleChoiceArea").show();
    $("#styleChoice").html("");

    let charInfo = CHAR_MASTER[charId];
    let styleIdList = [];
    for (let styleId of charInfo['Holders']) {
        let styleInfo = STYLE_MASTER[styleId];
        if(styleInfo === undefined){
            continue;
        }
        styleIdList.push(styleInfo);
    }
    styleIdList = sortStyleId(styleIdList, "SS", "new");

    for (let styleId of styleIdList) {
        let styleInfo = STYLE_MASTER[styleId];
        // スタイルレベル50の補正値を記録しておく
        let tmpInfo = Object.assign({}, styleInfo);
        tmpInfo['StyleBonusLv50STR'] = tmpInfo['L5S'];
        tmpInfo['StyleBonusLv50STR'] = tmpInfo['L5S'];
        tmpInfo['StyleBonusLv50DEX'] = tmpInfo['L5D'];
        tmpInfo['StyleBonusLv50AGI'] = tmpInfo['L5A'];
        tmpInfo['StyleBonusLv50INT'] = tmpInfo['L5I'];
        tmpInfo['StyleBonusLv1STR'] = 0;
        tmpInfo['StyleBonusLv1DEX'] = 0;
        tmpInfo['StyleBonusLv1AGI'] = 0;
        tmpInfo['StyleBonusLv1INT'] = 0;
        addStatus = culcStyleAddintional(tmpInfo);
        styleInfo['Lv50S'] = addStatus["腕力"][50];
        styleInfo['Lv50D'] = addStatus["器用さ"][50];
        styleInfo['Lv50A'] = addStatus["素早さ"][50];
        styleInfo['Lv50I'] = addStatus["知力"][50];

        // スタイルアイコンの追加
        let styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, styleInfo['WeaponType']);
        $("#styleChoice").append(styleIcon);
    }
}

let noKeishoTr = "";
function displaySkillTable(styleId) {
    $(".skillChoice").html(""); // クリア
    $("table#skillArea > tbody .SKILL_TR").remove();
    $("#keisyoSkill").html(""); // クリア
    kakuseiData = {}; // クリア
    // 絵を出す
    let styleInfo = STYLE_MASTER[styleId];

    // スタイルの所持している技
    for (let skillId of styleInfo['SkillIds']) {
        // 中身をイジイジするので値渡しにしておく
        let skillInfo = Object.assign({}, SKILL_MASTER[skillId]);
        SKILL_MASTER[skillId]['SkillIryoku'] = ((skillInfo['SkillIryoku'] == "" || skillInfo['SkillIryoku'] == 0) && skillInfo['PowerGrade'] != '-') 
        ? IRYOKU_MAP[skillInfo['PowerGrade']] : skillInfo['SkillIryoku'];

        skillInfo['isKeisho'] = 0;
        skillInfo['UseBp'] = skillInfo['ConsumeBp'];
    }
    $("table#skillArea tbody").append(noKeishoTr);

    // 継承データ
    let isKeishoSkill = [];
    $("#styleChoice .style").each(function () {

        let subStyleId = $(this).attr("data-id");
        if (styleId === subStyleId) {
            return;
        }
        let subStyleInfo = STYLE_MASTER[subStyleId];
        let tmpIdList = Object.assign([], subStyleInfo['SkillIds']);
        for (let skillId of tmpIdList) {
            // 継承エリアに同じスキルは出さない
            if (isKeishoSkill.indexOf(skillId) > -1) {
                continue;
            }
            isKeishoSkill.push(skillId); // 継承枠に表示済みの記録

            let skillInfo = SKILL_MASTER[skillId];
            if ($(".kakusei" + skillId).length === 0) {
                let skillName = kakuseiLabel(skillInfo);
                $("#keisyoSkill").append(skillName);
            }
        }

    });
}
function kakuseiLabel(skillInfo) {
    let $button = $("#KEISHO_TEMPLATE").clone().removeAttr("id").attr("data-id", skillInfo['Id']).removeClass("d-none");
    let $name = $button.find(".NAME");
    let weaponPath = getImgPath('icon/' + ICON_LIST[skillInfo['BattleType']] + ".png");
    $name.before($(`<img class="icon_xs" src="${weaponPath}">`));
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let attrPath = getImgPath('icon/' + ICON_LIST[value] + ".png");
        $name.before($(`<img class="icon_xs" src="${attrPath}">`));
    });
    // 名称
    $name.append(skillInfo['Name']);
    $name.append("(");
    let kakuseiList = [];
    for (let i = 1; i <= skillInfo['Kakusei']; i++) {
        kakuseiList.push("◇");
    }
    $name.append(kakuseiList.join(" "));
    $name.append(")");

    let $skillRight = $button.find(".floatRight");
    $skillRight.append(" 覚醒:" + skillInfo['Kakusei']);
    $skillRight.append(" BP:" + skillInfo['ConsumeBp']);
    $skillRight.append(" " + skillInfo['PowerGrade'] + "(" + skillInfo['SkillIryoku'] + ")");

    return $button;
}

let kakuseiData = {};
$(document).on('click', '.kakuseiCheck', function () {
    let id = $(this).parents(".SKILL_TR").attr("data-id");
    let kakusei = Number($(this).attr("data-kakusei"));
    if (kakuseiData[id] === kakusei) {
        kakusei = 0;
    }
    kakuseiData[id] = kakusei;
    $(this).parents(".SKILL_TR").find(".kakuseiCheck").each(function () {
        let k = $(this).attr("data-kakusei");
        if (k <= kakusei) {
            $(this).html("◆");
        } else {
            $(this).html("◇");
        }
    });
});
$(document).on('click', '.ON_OFF', function () {
    now = $(this).find(".BTN_LABEL").text();
    nextOFF = (now == "ON");
    $(this).toggleClass("icon_btn_positive").toggleClass("icon_btn_negative");
    $(this).find(".TOGGLE").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
    if(nextOFF){
        $(this).find(".BTN_LABEL").text("OFF");
    } else {
        $(this).find(".BTN_LABEL").text("ON");
    }
    $(this).parents(".SKILL_TR").attr('data-onoff', (nextOFF) ? 0 : 1);
});
$(document).on('click', '.RENTATSU', function () {
    // OFFを持ってる=次はON
    $(this).toggleClass("icon_btn_positive").toggleClass("icon_btn_negative");
    $(this).find(".TOGGLE").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
    // 練達前ID
    let id = $(this).parents(".SKILL_TR").attr("data-id");
    // 練達後ID
    let rentatsuId = SKILL_MASTER[id]['Rentatsu'];
    // 入力された覚醒は引き継ぐ
    if(kakuseiData[id] != undefined){
        kakuseiData[rentatsuId] = kakuseiData[id];
    }
    let skillInfo = SKILL_MASTER[rentatsuId];
    SKILL_MASTER[rentatsuId]['SkillIryoku'] = ((skillInfo['SkillIryoku'] == "" || skillInfo['SkillIryoku'] == 0) && skillInfo['PowerGrade'] != '-') 
    ? IRYOKU_MAP[skillInfo['PowerGrade']] : skillInfo['SkillIryoku'];

    $(this).parents(".SKILL_TR").find(".SKILL_NAME").text(SKILL_MASTER[rentatsuId]['Name']);
    $(this).parents(".SKILL_TR").find(".SKILL_BP").text(SKILL_MASTER[rentatsuId]['ConsumeBp']);
    $(this).parents(".SKILL_TR").find(".SKILL_IRYOKU").text(`${SKILL_MASTER[rentatsuId]['PowerGrade']}(${SKILL_MASTER[rentatsuId]['SkillIryoku']})`);    
    $(this).parents(".SKILL_TR").attr("data-id", rentatsuId);
});





function isNotUseAuto(skillInfo) {
    if (skillInfo['isNotUseAuto'] !== undefined) {
        return skillInfo['isNotUseAuto'];
    }
    return skillInfo["Type"] != "攻撃"; 
}

// ["Param"]["Lv"]["Per"] = パーセンテージ
// ["Param"]["Lv"]["Bonus"] = ボーナス値
let CULC_DAMAGE_PARAM = {};
let RESIST_MAP = {
    "斬": "zan",
    "打": "da",
    "突": "totsu",
    "熱": "netsu",
    "冷": "rei",
    "雷": "rai",
    "陰": "in",
    "陽": "you",
};

let MASTER_LV_ABILITY = 0;

function hasCriticalTargets(skillInfo){
    return (isTokkou 
        && typeof skillInfo['CriticalTargets'] != "undefined" 
        && skillInfo['CriticalTargets'] !== "");
}

function addAttack(addSkillId, rank, turn, canBuf, isHPMax, isOverDrive){
    if(typeof SKILL_MASTER[addSkillId] == "undefined") {
        return;
    }

    let addskillInfo = Object.assign({}, SKILL_MASTER[addSkillId]);
    if (hasCriticalTargets(addskillInfo)) {
        DISP_ABILITY_NAMES.push("特効:" + addskillInfo['CriticalTargets']);
    }
    // 技ランクを入れ替える
    skillInfo['rank'] = rank;

    // ダメージ再計算
    return buffAndCalcDamage(addskillInfo, turn, canBuf, isHPMax, isOverDrive)
}

function getDamageAbility(skillInfo, isOverDrive) {
    [x1, x2, x3, resist] = skillInfo['culcData'];
    let abBase = 0;
    let attrList = skillInfo["AttackAttributes"].split(","); // 斬とか
    attrList.push("全");
    attrList.push(skillInfo['Name']); // 技名のヒートアップとか
    attrList.push(skillInfo['SkillType'] + "攻撃"); // 技攻撃
    if(resist <= -35) {
        attrList.push("Weak攻撃");
    }
    attrList.push(METHOD[skillInfo['AttackMethod']] + "攻撃"); // 直接,間接
    if(isOverDrive){
        attrList.push("OD攻撃");
    }
    
    for(let attr of attrList){
        abBase += _getAbilityValue(attr);
    }
    return abBase;
}

function getStatusAndType(skillInfo, isOverDrive){
    let odBuff = (isOverDrive) ? OD_ST_BONUS : 0;
    let NOW_STR = initBuffMap(NOW_BUFF_STATE, "STR");
    let NOW_DEX = initBuffMap(NOW_BUFF_STATE, "DEX");
    let NOW_AGI = initBuffMap(NOW_BUFF_STATE, "AGI");
    let NOW_INT = initBuffMap(NOW_BUFF_STATE, "INT");
    let strBuff = (odBuff + Number($("#jinkeiSTR").val()) + NOW_STR["PER"]) / 100
    let dexBuff = (odBuff + Number($("#jinkeiDEX").val()) + NOW_DEX["PER"]) / 100
    let agiBuff = (odBuff + Number($("#jinkeiAGI").val()) + NOW_AGI["PER"]) / 100
    let intBuff = (odBuff + Number($("#jinkeiINT").val()) + NOW_INT["PER"]) / 100

    let str = Number($("#eqSTR").val()) + Number($("#styleSTR").val()) + Math.floor(Number($("#charSTR").val()) * strBuff);
    let dex = Number($("#eqDEX").val()) + Number($("#styleDEX").val()) + Math.floor(Number($("#charDEX").val()) * dexBuff);
    let agi = Number($("#eqAGI").val()) + Number($("#styleAGI").val()) + Math.floor(Number($("#charAGI").val()) * agiBuff);
    let int = Number($("#eqINT").val()) + Number($("#styleINT").val()) + Math.floor(Number($("#charINT").val()) * intBuff);

    // 敵ステータスの調整
    let vit = Number($((skillInfo['SkillType'] === "術" ? "#enemy_mnd" : "#enemy_vit")).val());
    let enemyTarget = (skillInfo['SkillType'] === "術") ? "ENEMY_MND" : "ENEMY_VIT";
    let enm_buff = initBuffMap(NOW_BUFF_STATE, enemyTarget);
    let per = Math.floor(Number(vit * enm_buff["PER"] / 100));
    vit -= Math.abs(per);

    // 依存ステータスの変更
    let battleType = skillInfo['BattleType']; // 弓とか
    let btType = 'other';
    if (battleType === "体術") {
        btType = 'tai';
    } else if (battleType === "銃") {
        btType = 'ju';
    }

    let buff_target = NOW_STR;
    let attackParam = str;
    if (skillInfo['SkillType'] === "術" || skillInfo['SpecialType'] == '知力') {
        attackParam = int;
        btType = "jutsu";
        buff_target = NOW_INT;
    } else if (["小剣", "弓", "銃"].indexOf(battleType) > -1) {
        attackParam = dex;
        buff_target = NOW_DEX;
    }
    return [btType, attackParam, agi, buff_target, NOW_AGI, vit, enm_buff];
}

function calcDamage(skillInfo, isOverDrive) {
    // ステータス変動がある場合を考慮して計算し直し(abilityTmpは使わない)
    [weapon, iryoku, rank, resist] = skillInfo['culcData'];
    let abBase = getDamageAbility(skillInfo, isOverDrive);
    let ability = abBase + Number($("#SET_SEISEKI").val());

    [btType, attackParam, agi, buff_target, buff_agi, enemyStatus, enm_buff] = getStatusAndType(skillInfo, isOverDrive);

    // ダメージ再計算
    let damagePoint = (iryoku > 0) 
        ? damage(btType, attackParam, agi, weapon, iryoku, rank, enemyStatus, MASTER_LV_ABILITY, ability, resist, 6)
        : 0;
    SKILL_USE_COUNT[skillInfo['Name']] = SKILL_USE_COUNT[skillInfo['Name']] ?? 0;
    SKILL_USE_COUNT[skillInfo['Name']]++;
    let record =  {
        'damage': damagePoint,
        'skill': skillInfo,
        'count':1,
        'attackParam':attackParam,
        'enemyParams':enemyStatus,
        'ability': abBase,
        'abilityFlag': false,
        'resist' : resist,
        'buff': buff_target["PER"],
        'buffFlag': buff_target["TURN"] == 4 || isOverDrive,
        'buffAgi': buff_agi["PER"],
        'buffFlagAgi': buff_agi["TURN"] == 4 || isOverDrive,
        'debuff': enm_buff["PER"],
        'debuffFlag': enm_buff["TURN"] == 4,
    };
    return record;
}

function initialHide() {
    $(".culcAfter").hide();
    $("#keishoKaijo").hide();
    $("#skillAreaParent").hide();
    $(".culcStart").hide();
    $(".styleChoiceArea").hide();
    $(".skillChoiceArea").hide();
}

function setBeforeSkillBuffDeBuff(skillInfo){
    if(skillInfo['Mod'] === undefined){
        return;
    }

    let tmpSkill = JSON.parse(JSON.stringify(skillInfo));
    for(idx in tmpSkill['Mod']){
        tmpSkill['Mod'][idx] = (tmpSkill['Mod'][idx].indexOf("攻撃前に") > -1) 
        ? tmpSkill['Mod'][idx].replace(/攻撃前に/g, '')
        : "";
    }
    setSkillBuffDeBuff(tmpSkill, "攻撃前補助");
}
function setAfterSkillBuffDeBuff(skillInfo){
    if(skillInfo['Name'] == "通常攻撃" && skillInfo['BattleType'] == "杖"){
        _setStatusBuff("INT", 10)
    }
    let tmpSkill = JSON.parse(JSON.stringify(skillInfo));
    // 攻撃前バフは別の関数でやってるのでここではバフしない
    for(idx in tmpSkill['Mod']){
        tmpSkill['Mod'][idx] = (tmpSkill['Mod'][idx].indexOf("攻撃前に") == -1) 
        ? tmpSkill['Mod'][idx]
        : "";
    }
    setSkillBuffDeBuff(tmpSkill, "補助");
}

function setSkillBuffDeBuff(skillInfo, keyName){
    // Critical追加技をどうにか検討したい
    if(skillInfo['Id'] == "ID69c3411" && keyName == "補助") {
        CRITICAL_ABILITY.push(
            {"targetSkill": "any", "CriticalTargets": "全", "LIMIT": 5},
        );
    };

    for(idx in skillInfo['Mod']){
        let targetParam = skillInfo['Mod'][idx];
        let modPer = (skillInfo['ModPer'][idx] != "")? Number(skillInfo['ModPer'][idx]) : 100;
        let modTurn = (skillInfo['ModTurn'][idx] != "")? Number(skillInfo['ModTurn'][idx]) : NO_LIMIT;
        let modLimit = setDefaultValue(skillInfo['ModLimit'] ?? "", {idx: ""})[idx];
        modLimit = (modLimit != "") ? Number(modLimit) : NO_LIMIT;
        if(targetParam.includes("自身以外の")
        || targetParam.includes("最大BP")) {
            continue;
        }
        
        if(targetParam == "ターン終了時ODゲージを上昇") {
            arrayPush(OD_ABILITY, "ターン終了時", {
                "NAME": skillInfo['Name'],
                "TIME": modPer,
                "PER" : skillInfo['Mod1'][idx],
                "TURN": modTurn,
            });
        } else if(targetParam.includes("ターン終了時BP") ) {
            arrayPush(BUFF_ABILITY, "ターン終了時", {
                "NAME": skillInfo['Name'],
                "PARAM": "BP",
                "TIME": 100, // "必ず(100%)"
                "PER" : Number(skillInfo['Mod1'][idx]),    
                "TURN": modTurn,
                "LIMIT": modLimit,
            });
        } else if(targetParam == "消費BP減少" ) {
            arrayPush(BUFF_ABILITY, "消費BP減少", {
                "NAME": skillInfo['Name'],
                "PER" : Number(skillInfo['Mod1'][idx]),
                "TURN": modTurn,
                "LIMIT": modLimit,
            });
        } else if(targetParam.includes("BP") ) {
            // 即時回復
            let healList = String(skillInfo['Mod1'][idx]).split("/");
            let healSize = healList.length;
            let rand = Math.floor(Math.random() * healSize);

            if(modPer == 100) {
                BP_HEAL_SKILL += Number(healList[rand]);
            }            
        } else if(targetParam.indexOf("ヒートアップ") > -1
        || targetParam.indexOf("ディフェンスダウン") > -1
        || targetParam.indexOf("エンハンスソーサリー") > -1
        || targetParam.indexOf("エレメントエンハンス") > -1
        ) {
            let tag = "全";
            if(targetParam.indexOf("エレメントエンハンス") > -1) {
                tag = targetParam.replace("エレメントエンハンス(","").replace(")","");
            } else if(targetParam == "Weakヒートアップ") {
                tag = "Weak攻撃";
            } else if(targetParam.indexOf("ヒートアップ(") > -1) {
                // ヒートアップ(技名)対応
                tag = targetParam.replace("エレメントエンハンス(","").replace(")","");
            }
            ALWAYS_ABILITY[tag] = Math.abs(Number(skillInfo['Mod1'][idx]));
        } else if(targetParam.indexOf("モラルアップ") > -1
        || targetParam.indexOf("ガードダウン") > -1
        || targetParam.indexOf("防御弱化") > -1
        || targetParam.indexOf("攻撃強化") > -1){
            let perKey = (skillInfo['Mod99'][idx] == "-" || skillInfo['Mod99'][idx] == "") ? 'Mod1' : "Mod99";
            let attr = targetParam == "防御弱化(術)" ? "術" : "全";
            let info = {
                "NAME" : targetParam,
                "TIME" : 100,
                "PER" : Math.abs(Number(skillInfo[perKey][idx])),
                "TURN": Number(skillInfo['ModTurn'][idx]),
                "LIMIT": Number((skillInfo['ModTurn'] ?? {idx: NO_LIMIT})[idx]),
            };
            let updatedFlg = false;
            if(targetParam.indexOf("モラルアップ") > -1
            || targetParam.indexOf("ガードダウン") > -1) {
                for(idx in NOW_DAMAGE_STATE[attr]){
                    if(NOW_DAMAGE_STATE[attr][idx]['NAME'] == targetParam) {
                        // 存在する場合は上書き
                        updatedFlg = true;
                        NOW_DAMAGE_STATE[attr][idx] = info;
                    }
                }
            }
            if(!updatedFlg) {
                arrayPush(NOW_DAMAGE_STATE, attr, JSON.parse(JSON.stringify(info)));
            }
        }

        targetParam = targetParam.replace("全員の","");
        targetParam = targetParam.replace (/全ステ/g, '腕力と体力と器用さと素早さと知力と精神と愛と魅力');
        for(p of targetParam.split("と")) {
            let param = PARAM_KEY[PARAM_NAME.indexOf(p)];
            if(param == undefined) {
                continue;
            }
            if(!getBuffRand(skillInfo['Name']+p, modPer)) {
                console.log("skip");
                continue;
            }
            let per = (skillInfo['Mod99'][idx] != "") ? Number(skillInfo['Mod99'][idx]) : Number(skillInfo['Mod1'][idx]);
            if(per > 0) {
                _setStatusBuff(param, Number(per));
            } else {
                per = Math.abs(Number(per));
                _setStatusBuff("ENEMY_"+param, Number(per));
            }
        } 
    }
}

function setAddAttackFromSkill(skillInfo, canTsuigeki){  
    if(typeof skillInfo == "undefined") {
        return canTsuigeki;
    }
    return canTsuigeki;
}
let CRITICAL_ABILITY = [
    // {"targetSkill": "any", "CriticalTargets": "骨", "LIMIT": 4},
];

function setStyleAbility(){
    for(let lv in NOW_STYLE['StyleAbilityIds']){
        abInfo = ABILITY_MASTER[NOW_STYLE['StyleAbilityIds'][lv]];
        setOriginalAbilityData(abInfo);
    }
}

function setOriginalAbilityData($abInfo){
    $calcTurnSet = ($TURN_LIST[0][0]?? 1);
    $abInfo = $ABILITY_MASTER[$abId];

    for(abCategory of abInfo['Attr']){
        // 被ダメに使わないものと、100%でないものは入れない
        $time = filterNumber( $abCategory['time']);
        $turn = filterNumber( $abCategory['turn']);
        $per = filterNumber( $abCategory['size']);
        $maxLimit = filterNumber( $abCategory['maxLimit']); // バトル中:1
        $when = trimWhen($abCategory['when']);

        if($abCategory["main"] == "追撃"
        || strpos($abCategory['main'], "バフ") > -1
        || strpos($abCategory['main'], 'ダメージ強化') !== false
        || $abCategory['main'] == "アビリティ付与"
        || $abCategory['main'] == "ODゲージ上昇"
        || $abCategory['main'] == "BP回復"
        ) {
            // 追撃は確率発動でも追加する
            // バフもダメージ強化もOD回復も、5ターン計測の場合は発動させる
        } else if($time != 100) {
            // 追撃以外の確率発動はパス
            continue;
        }

        if($abCategory['main'] == "最大BP増加"){
            // BP回復アビリティ判定
            $BP_MAX_UP_ABILITY_ORG = addBpMaxUpAbility($abInfo, $abCategory, $BP_MAX_UP_ABILITY_ORG);
        } else if($abCategory['main'] == "BP回復"){
            // BP回復アビリティ判定
            $BP_HEAL_ABILITY_ORG = addBpHealAbility($abInfo, $abCategory, $BP_HEAL_ABILITY_ORG);
        } else if($abCategory['main'] == "消費BP減少"){
            // BP軽減アビリティ判定
            $BP_MINUS_ABILITY_ORG = addBpMinusAbility($abInfo, $abCategory, $BP_MINUS_ABILITY_ORG);
        } else if($abCategory['main'] == "アビリティ付与") {
            $ADD_ABILITY_ORG = addAddintionalAbility($abInfo, $abCategory, $ADD_ABILITY_ORG);
        } else if($abCategory['main'] == "行動順補正") {
            $SPEED_ABILITY_ORG = addSpeedAbility($abInfo, $abCategory, $SPEED_ABILITY_ORG);
        } else if($abCategory['main'] == "追撃"){
            if(isset($TSUIGEKI[$abId])) {
                continue;
            }
            $TSUIGEKI_ABILITY_ORG = addTsuigekiAbility($abInfo, $abCategory, $TSUIGEKI_ABILITY_ORG);
        } else if($abCategory['main'] == "溜め状態"){
            if(isset($TSUIGEKI[$abId])) {
                continue;
            }
            $WAIT_ATTACK_ABILITY_ORG = addWaitAttackAbility($abInfo, $abCategory, $WAIT_ATTACK_ABILITY_ORG);
        } else if($abCategory['main'] == "Critical攻撃追加"){
            $CRITICAL_ABILITY_ORG = addCriticalAbility($abInfo, $abCategory, $CRITICAL_ABILITY_ORG);
        } else if($abCategory['main'] == "代償" && $abCategory['sub'] == "LP") {
            $LP_ORG += $abCategory['size'];
        } else if($abCategory['main'] == "ODゲージ上昇"){
            $OD_ABILITY_ORG = addOdUpAbility($abInfo, $abCategory, $OD_ABILITY_ORG);
        } else if($abCategory['main'] == "使用回数制限回復"){
            $USE_COUNT_ABILITY_ORG = addUseCountAbility($abInfo, $abCategory, $USE_COUNT_ABILITY_ORG);                                        
        } else if(strpos($abCategory['main'], 'ダメージ強化') !== false && strpos($abCategory['main'], '自身以外') === false
        || strpos($abCategory['main'], 'ダメージ弱化') !== false) {
            $DAMAGE_ABILITY_ORG = addDamageAbility($abInfo, $abCategory, $DAMAGE_ABILITY_ORG);
        } else if(strpos($abCategory['main'], "強化(バフ") > -1) {
            $BUFF_ABILITY_ORG = addBuffAbility($abInfo, $abCategory, $BUFF_ABILITY_ORG);
        } else if(preg_match('[デバフ]', $abCategory['main'])) {
            $BUFF_ABILITY_ORG = addDeBuffAbility($abInfo, $abCategory, $BUFF_ABILITY_ORG);
        }
    }
}

function setAbilitySubData(abInfo){
    for(abCategory of abInfo['Attr']){
        if(trigger == "回復行動時" || trigger == "攻撃対象を倒した時") { 
            continue;
        }
        if(abCategory['main'] == "追撃") {
            addTsuigekiAbility(abInfo, abCategory);
        } else if(abCategory['main'].includes("アビリティ付与")) {
            addAddintionalAbility(abInfo, abCategory);
        } else if(abCategory['main'] == "カウンター") {
            addCounterState(abInfo, abCategory);
        }else if(abCategory['main'] =="ODゲージ上昇") {
            addOdAbility(abInfo, abCategory);
        } else if(abCategory['main'] == "代償" && abCategory['sub'] == "LP" ) {
            NOW_LP += per;
        } else if(abCategory['main'] == "ダメージ強化"
        || abCategory['main'] == "ダメージ強化(全体)"){
            addDamageAbility(abInfo, abCategory);
        } else if(abCategory['main'] == "自身強化(バフ)" 
        || abCategory['main'] == "全員強化(バフ)" ){
            addBuffAbility(abInfo, abCategory);
        } else if(abCategory['main'] == "使用回数制限回復") {
            addSkillUseUpAbility(abInfo, abCategory);
        } else if((abCategory['main'] == "BP回復")) {
            if(abCategory['sub'] != "自身" && abCategory['sub'] != "全体") { // ランダムは対象にしない
                continue;
            }
            if(trigger == "バトル開始時"){ // 別タイミングで確認する
                continue;
            }
            arrayPush(BUFF_ABILITY, trigger, {
                "NAME": abInfo['Name'],
                "PARAM": "BP",
                "TIME": time,
                "PER" : per,
                "TURN" : turn,
                "LIMIT": maxLimit,
            });
        } else if(abCategory['main'] == "能力アップ解除" && abCategory['sub'] == "自身"){
            BUFF_RESET_ABILITY[trigger] = true;
        }
    }    
}
function getParamater(abCategory){
    per = filterNumber(abCategory['size']); // "大(20%)"
    time = filterNumber(abCategory['time']); // "必ず(100%)"
    turn = filterNumber(abCategory['turn']); // "効果3ターン"
    turn = (turn == "" || turn == "バトル中永続") ? NO_LIMIT : turn;
    maxLimit = filterNumber(abCategory['maxLimit']); // "バトル中3"
    maxLimit = (maxLimit == "") ? NO_LIMIT : maxLimit;

    trigger = WHEN_MAP[abCategory['when']] ?? abCategory['when'];
    trigger = trigger.replace("命中時","時");// "Weak攻撃時","攻撃寺","ターン開始時","ラウンド開始時",""
    return [trigger, per, time, turn ,maxLimit];
}

// 発動タイミングごとの確認
function updateStateFromAbility(pattern) {

    addAbilityFromAbility(pattern);
    incrementStatusBuff(pattern);
    incrementDamageBuff(pattern);
    // メソッド化は後で
    for(let i in SKILL_USE_UP_ABILITY[pattern] ?? []) {
        SKILL_USE_UP_ABILITY[pattern][i]["LIMIT"]--;
        let skillName = SKILL_USE_UP_ABILITY[pattern][i]["TARGET"];
        //"TIME" : time, // "必ず(100%)"
        if(SKILL_USE_COUNT[skillName]) {
            SKILL_USE_COUNT[skillName] -= SKILL_USE_UP_ABILITY[pattern][i]["PER"];
        }
    }
    // メソッド化は後で
    if(BUFF_RESET_ABILITY[pattern]) {
        for(let paramKey of Object.keys(NOW_BUFF_STATE)){
            NOW_BUFF_STATE[paramKey]['TURN'] = 0;
        }
    }
}

function incrementStatusBuff(pattern) {
    // ステータスバフとBP回復が同時に発生するアビとかどうしようかなぁ....
    for(let i of (BUFF_ABILITY[pattern] ?? [])){
        console.log(pattern, bufInfo);
        bufInfo = BUFF_ABILITY[pattern][i];
        BUFF_ABILITY[pattern][i]['LIMIT']--;
        params = (!Array.isArray(bufInfo["PARAM"])) ? [bufInfo["PARAM"]] : bufInfo["PARAM"];
        for(param of params){
            if(param == "BP") {
                BP_HEAL_ABILITY += bufInfo["PER"];
            } else {
                _setStatusBuff(param, bufInfo["PER"]);
            }
        }
        console.log("バフ追加", JSON.parse(JSON.stringify(NOW_BUFF_STATE)));
        if(typeof bufInfo["OPTION"] == "undefined") {
            DISP_ABILITY_NAMES.push(bufInfo["NAME"]);
        }
    }    
}

function _setStatusBuff(param, per) {
    NOW_BUFF_STATE[param] = initBuffMap(NOW_BUFF_STATE, param);
    NOW_BUFF_STATE[param]["TURN"] = 4;
    NOW_BUFF_STATE[param]["PER"] += per;
    NOW_BUFF_STATE[param]["MINUS"] = Math.ceil(Number(NOW_BUFF_STATE[param]["PER"]) / 4);
}

function setSkillList() {
    let skillList = [];
    $("#skillArea .SKILL_TR").each(function(){
        let id = $(this).attr('data-id');
        let isUse = $(this).attr('data-onoff');
        let skillInfo = Object.assign({},SKILL_MASTER[id]);
        skillInfo['isNotUseAuto'] = (isUse == 0);
        skillInfo['UseBp'] = skillInfo['ConsumeBp']
        if(kakuseiData[id] != undefined){
            skillInfo['UseBp'] -= kakuseiData[id];
        }
        skillInfo['isKeisho'] = $(this).attr('data-onoff');
        skillList.push(skillInfo);
    });
    return skillList;
}

function _notUse(skill) {
    // 補助じゃなくて無制限である
    return skill['Type'] != "補助" && skill['LimitCount'] == 0;
}
let dummy = {"Id": 0, "AttackArea": "自身", 'UseBp': 99, 'AutoUseBp': 99, 'AttackAttributes': ''};

const PER_MAP = {50:0.5, 37:0.375, 25: 0.25, 11: 0.1112};

function getCounterRand(name, per) {
    
    if(per == 100) {
        return true; // 確定発動は消せない
    } else if(COUNTER_STATE == RAND_PATTERN.RAND) {
        return Math.floor(Math.random() * 100) < per; // 0-99 37の場合0-36なら発動
    } else if(COUNTER_STATE == RAND_PATTERN.CONFIRM) {
        return true;
    } else if(COUNTER_STATE == RAND_PATTERN.NONE) {
        return false;
    } else if(COUNTER_STATE == RAND_PATTERN.FIX) {
        per = PER_MAP[per];
        if(typeof COUNTER_RAND_STATE[name] == "undefined") {
            COUNTER_RAND_STATE[name] = 0;
        }
        COUNTER_RAND_STATE[name]++;
        return (COUNTER_RAND_STATE[name] % (1/per)) < 1;
    }    
}
function getBuffRand(name, per) {
    if(per == 100) {
        return true; // 確定発動は消せない
    } else if(BUFF_STATE == RAND_PATTERN.RAND) {
        return Math.floor(Math.random() * 100) < per; // 0-99 37の場合0-36なら発動
    } else if(BUFF_STATE == RAND_PATTERN.CONFIRM) {
        return true;
    } else if(BUFF_STATE == RAND_PATTERN.NONE) {
        return false;
    } else if(BUFF_STATE == RAND_PATTERN.FIX) {
        per = PER_MAP[per];
        if(typeof BUFF_RAND_STATE[name] == "undefined") {
            BUFF_RAND_STATE[name] = 0;
        }
        BUFF_RAND_STATE[name]++;
        return BUFF_RAND_STATE[name] % (1/per) < 1;
    }
}
function getTsuigekiRand(name, per) {
    if(per == 100) {
        return true; // 確定発動は消せない
    } else if(TSUIGEKI_STATE == RAND_PATTERN.RAND) {
        return Math.floor(Math.random() * 100) < per; // 0-99 37の場合0-36なら発動
    } else if(TSUIGEKI_STATE == RAND_PATTERN.CONFIRM) {
        return true;
    } else if(TSUIGEKI_STATE == RAND_PATTERN.NONE) {
        return false;
    } else if(TSUIGEKI_STATE == RAND_PATTERN.FIX) {
        per = PER_MAP[per];
        if(typeof TSUIGEKI_RAND_STATE[name] == "undefined") {
            TSUIGEKI_RAND_STATE[name] = 0;
        }
        TSUIGEKI_RAND_STATE[name]++;
        console.log(name, per, TSUIGEKI_RAND_STATE);
        return TSUIGEKI_RAND_STATE[name] % (1/per) < 1;
    }
}


function calcAddAttack(resultRecords, skill, $card, turn, isHPMax, isOverDrive, nextTurnTsuigeki){
    if(typeof (skill['Mod'] ?? []).join(",").indexOf("カウンター") > -1 && !isAddCounter) {
        return;
    }
    // 追撃のダメージ計算
    let addRecord = addAttack(skill['Id'], skill['rank'] ?? 99, turn, true, isHPMax, isOverDrive);
    resultRecords.push(addRecord);

    let addSkill = typeof skill['AddSkill'] !== "undefined" ? skill['AddSkill'] : [];
    // カウンターは通常入れない
    for(addSkillId of addSkill) {
        if(SKILL_MASTER[addSkillId] == undefined) {
            continue;
        }
        // 追撃で、さらに追撃発生（プレゼント忍法）
        nextTurnTsuigeki = setAddAttackFromSkill(SKILL_MASTER[addSkillId], nextTurnTsuigeki);
        calcAddAttack(SKILL_MASTER[addSkillId], $card, turn, isHPMax, isOverDrive)
    }
}

function getMultiAttackCount(skillId) {
    let skill = SKILL_MASTER[skillId];
    if(skill == undefined || typeof skill['MinActionTime'] == "undefined") {
        return 1;
    }
    // 少数切り捨て、2-5hitは3.5=3
    let MULTI = Math.floor( (skill['MinActionTime'] + skill['MaxActionTime']) / 2);
    if(MULTI !== ( (skill['MinActionTime'] + skill['MaxActionTime']) / 2)) {
        // 割り切れない場合は交互に実施
        if(MULTI_NOW_COUNT[skillId] !== undefined) {
            MULTI++;
            delete MULTI_NOW_COUNT[skillId];
        } else {
            MULTI_NOW_COUNT[skillId] = 1;
        }
    }
    return MULTI;
}


function buffAndCalcDamage(skill, turn, canBuff, isHPMax, isOverDrive) {
    // 先行バフ追加
    setBeforeSkillBuffDeBuff(skill);
    updateStateFromAbility("攻撃前補助");
    const record = calcDamage(skill, isOverDrive);
    // ODゲージの増加
    NOW_OD += !!skill['OD'] && !isNaN(skill['OD']) ? Number(skill['OD']) : 10;
    TOTAL_DAMAGE += record['damage'];
    THIS_TURN_DAMAGE[NOW_TURN] += record['damage'];

    // 断撃など技によるバフデバフ追加
    setAfterSkillBuffDeBuff(skill);
    updateStateFromAbility("補助");

    let buffList = (canBuff && typeof skill['Type'] != "undefined") ? ["時", "のたび"] : ["のたび"];
    for(pt of buffList){
        for(attr of skill['AttackAttributes'].split(",")) {
            updateStateFromAbility(`${attr}属性攻撃${pt}`);
        }
        updateStateFromAbility(`${skill['Name']}をさせた${pt}`);
        updateStateFromAbility(`${skill['Name']}を命中させた${pt}`);
        updateStateFromAbility(`${skill['Name']}を発動${pt}`);
        for(let turnOver =1; turnOver<= turn; turnOver++) {
            updateStateFromAbility(`${turnOver}ターン目以降の攻撃${pt}`);
        }
        updateStateFromAbility(`攻撃${pt}`);
        tmpTsuigeki = addAbilityFromAbility(`攻撃${pt}`, {});
        updateStateFromAbility(`${ATTACK_RANGE_JP[skill['AttackArea']]}攻撃${pt}`);
        if(skill['Id'] == "normal") {
            updateStateFromAbility(`通常攻撃${pt}`);
        }
        if(isHPMax) {
            updateStateFromAbility(`攻撃${pt}/HP満タンの場合`);
        } else {
            updateStateFromAbility(`攻撃${pt}/HPが満タンではない場合`);
        }
        // 技攻撃 or 術攻撃
        updateStateFromAbility(`${skill['SkillType']}攻撃${pt}`);
        if(skill['AttackMethod'] == 1) {
            updateStateFromAbility(`直接攻撃${pt}`);
        } else {
            updateStateFromAbility(`間接攻撃${pt}`);
        }
        if(resist <= -35){
            updateStateFromAbility(`Weak攻撃${pt}`);
        }
        if(isCritical(skill)) {
            updateStateFromAbility(`Critical攻撃${pt}`);
        }             
        if(isOverDrive) {
            if(pt == "時") {
                updateStateFromAbility("OD攻撃(※)を発動後");
            }
            updateStateFromAbility(`OD攻撃時/Weak攻撃${pt}`);
        }
    }

    return record;
}

function addSkillResultRow($card, result, isOverDrive) {
    // 不要なレコードの削除
    let resultRecords = {};
    result = result.filter(Boolean);
    console.log("結果出力", result);
    for(const idx in result) {
        record = result[idx];
        if(record == undefined || typeof record['damage'] == "undefined"){
            continue;
        }
        // ウインドｰ>アンチｰ>ウインドなど混在する場合があるのでダメージも見る必要がある
        let key = record['skill']['Id'] + record['damage'];
        // 同一ターンで連続で同じ攻撃だった場合はレコードをまとめる
        if(resultRecords[key] != undefined) {
            resultRecords[key]['count']++;
        } else {
            resultRecords[key] = record;
        }
    }

    let skillIcons = [];
    let names = [];
    let damages = [];
    let attackParams = [];
    let enemyParams = [];
    let abilities = [];
    let resists = [];
    let buffs = [];
    let debuffs = [];

    // レコード情報の構築
    let idx = -1;
    let odLabel = (isOverDrive != "") ? ` <span class="fuchidori-blue">[OD]</span>` : "";
    let odBuff = isOverDrive ? 20 : 0;
    for (record of Object.values(resultRecords)) {
        idx++;
        let skill = record['skill'];
        [x1, x2, rank, x3] = skill['culcData'];
        let battleType = skill['BattleType'];

        let battleIconArea = [];
        let battleIconPath = getImgPath(`icon/${ICON_LIST[battleType]}.png`);
        battleIconArea.push(`<img src="${battleIconPath}" class="icon_xs">`);
        skill['AttackAttributes'].split(',').forEach(function (value) {
            let attrIconPath = getImgPath(`icon/${ICON_LIST[value]}.png`);
            battleIconArea.push(`<img src="${attrIconPath}" class="icon_xs">`);
        });
        skillIcons.push(battleIconArea.join(""));
        names.push((idx == 0 ? "" : "→") + skill['Name']
        + (idx == 0 ? odLabel : "")
        + (rank != 99 ? "[R1]" : "")
        + (record['count'] > 1 ? ` * ${record['count']}` : ""));
        damages.push((record['damage'] * record['count']).toLocaleString());
        attackParams.push(record['attackParam']);
        enemyParams.push(record['enemyParams']);

        abilityclass = record['abilityFlag'] ? "fuchidori-blue" : "";
        ability = record['ability'];
        abilities.push(`<span class="${abilityclass}">${ability}%</span>`);

        resistclass = getTaiseiClass(record['resist']);
        resists.push(`<span class="${resistclass}">${record['resist']}</span>`);

        bufFlag = (isOverDrive || record['buffFlag']) ? "fuchidori-blue" : "";
        buff = record['buff'] + odBuff;
        buffs.push(`<span class="${bufFlag}">${buff}%</span>`);

        debufFlag = (isOverDrive || record['debuffFlag']) ? "fuchidori-blue" : ""; 
        debuffs.push(`<span class="${debufFlag}">${record['debuff']}%</span>`);
    }

    // レコード情報の挿入
    $card.find(".SKILL_ICON").append(skillIcons.join("<br>"));
    $card.find(".SKILL_NAME").append(names.join("<br>"));
    $card.find(".DAMAGE").append(damages.join("<br>"));
    $card.find(".AVG").html(Math.floor(TOTAL_DAMAGE/NOW_TURN).toLocaleString());
    $card.find(".ABILITY_PER").html(abilities.join("<br>"));
    $card.find(".ATTACK_PARAM").html(attackParams.join("<br>"));
    $card.find(".ENEMY_PARAM").html(enemyParams.join("<br>"));
    $card.find(".ENEMY_RESIST").html(resists.join("<br>"));
    $card.find(".BUFF").html(buffs.join("<br>"));
    $card.find(".DEBUFF").html(debuffs.join("<br>"));
}
function _isHojyoAndPrimary(skill) {
    return skill['Type'] == "補助" && isHojoPrimary;
}
function initBuffMap(map, key) {
    return map[key] ?? {"TURN":0, "PER":0, "MINUS":0};
}
function clearBuff(buff) {
    for(let idx in buff){
        if(buff[idx].length == 0) {
            delete buff[idx];
        }
    }
    return buff;
}

function addAbilityFromAbility(timing){
    if(ADD_ABILITY[timing] == undefined) {
        return;
    }
    // 追加アビリティを各種変数に入れる
    // 702102414,海賊の狂宴,,アビリティ付与,全体,必ず(100%),ターン開始時,,<special_effect=800000355>略奪者</special_effect>,効果1ターン,
    // 800000355,略奪者,,ダメージ強化,防御弱化,必ず(100%),攻撃命中時,,防御弱化小(10%),効果1ターン,2回
    for(let idx in ADD_ABILITY[timing]) {
        let row = ADD_ABILITY[timing][idx];
        // row["TIME"] 一旦確率発動は無視
        setAbilitySubData(ABILITY_MASTER[row["ADD_ABILITY_ID"]]);
        ADD_ABILITY[timing][idx]['LIMIT']--;
        if(ADD_ABILITY[timing][idx]['LIMIT'] <= 0) {
            delete(ADD_ABILITY[timing][idx]);
        }
    }
}

let ATTR_MAP = {
    "オーバーエンハンス": "OD攻撃",
    "防御崩し(技)": "技攻撃",
    "防御崩し(術)": "術攻撃",
    "Weakヒートアップ":"Weak攻撃",
    "Weak攻撃強化":"Weak攻撃",
};
function getAttackSub(attr){
    //     [0] => 全ダメージ
    //     [13] => 攻撃強化
    //     [20] => 防御弱化
    //     [15] => モラルアップ
    //     [17] => ヒートアップ
    //     [1] => Weak攻撃
    //     [30] => Weak攻撃強化
    //     [32] => Weakヒートアップ
    //     [6] => X属性攻撃
    //     [25] => 冷属性防御弱化
    //     [19] => エレメントエンハンス(冷)
    //     [2] => OD攻撃
    //     [3] => 連携攻撃
    //     [4] => Critical攻撃
    //     [5] => カウンター攻撃
    //     [11] => 単体攻撃/全体攻撃/範囲攻撃
    //     [18] => オーバーエンハンス
    //     [29] => ヒートアップ(踏み込みの矢)
    //     [24] => 術攻撃
    //     [24] => 直接攻撃
    //     [22] => 防御崩し(技)
    if(ATTR_MAP[attr] != undefined) {
        return ATTR_MAP[attr];
    }

    attr = attr.replace(/属性防御弱化/g, '');
    attr = attr.replace(/属性攻撃/g, ''); // 斬属性ダメージ
    if(["ヒートアップ","モラルアップ","全ダメージ","攻撃強化","防御弱化"].includes(attr)){
        attr = "全";
    } else if(attr.indexOf("エレメントエンハンス") > -1) {
        attr = attr.replace("エレメントエンハンス(","").replace(")","");
    } else if(attr.indexOf("ヒートアップ(") > -1) {
        // ヒートアップ(技名)対応
        attr =  attr.replace("ヒートアップ(","").replace(")","");
    }

    return attr;
}

function setDefaultValue(target, value) {
    return target == "" ? value : target;
}

function incrementDamageBuff(timing) {
    for(k in (DAMAGE_ABILITY[timing] ?? [])){
        info = DAMAGE_ABILITY[timing][k];
        if(!getBuffRand(info["NAME"], info["TIME"])) {
            console.log("追加しませんでした");
            continue;
        }    
        _setDamageBuff(attr, info['TURN'], info['PER']);

        DAMAGE_ABILITY[timing][k]['LIMIT']--;
        if(DAMAGE_ABILITY[timing][k]['LIMIT'] <= 0) {
            delete DAMAGE_ABILITY[timing][$k];
            DAMAGE_ABILITY[timing] = DAMAGE_ABILITY[timing].filter(Boolean);
        }
    }
}

function _setDamageBuff(attr, turn, per) {
    NOW_DAMAGE_STATE["ALWAYS"][attr] = NOW_DAMAGE_STATE["ALWAYS"][attr] ?? 0;
    NOW_DAMAGE_STATE["TEMP"][attr] = NOW_DAMAGE_STATE["TEMP"][attr] ?? [];
    if(turn == NO_LIMIT){
        NOW_DAMAGE_STATE["ALWAYS"][attr] += per;
    } else {
        NOW_DAMAGE_STATE["TEMP"][attr].push({
            "PER" : per,
            "TURN" : turn,
            "MINUS" : 0,
        });
    }
}

function _getAbilityValue(attr) {
    ability = NOW_DAMAGE_STATE["ALWAYS"][attr] ?? 0;
    for(row of (NOW_DAMAGE_STATE["TEMP"][attr] ?? [])) {
        ability += row["PER"];
    }
    return ability;
}

function addTsuigekiAbility(abInfo, abCategory) {
    if(abCategory['main'] != "追撃") {
        return;
    }
    //    "ID29d936dd": [{ "targetSkill":"any", "PER": 50,"addSkill":["ID77c81fb"]}] ,// 吸命魔導
    // canTsuigeki[tsuigekiInfo["targetSkill"]].push(tsuigekiInfo);
    // TODO excludeやlimitは後で考える
    [trigger, per, time, turn ,maxLimit] = getParamater(abCategory);

    let tsuigekiSkillIds = [];
    for(sId of String(abCategory['size']).split("/")) { // sizeにスキルIDが入ってる
        tsuigekiSkillIds.push(maskId(sId));
    }
    // アビリティから追加される場合、付与する側でターン指定がある（おてんば娘のウィークスタンプとか）
    // 702102330,わがまま娘,,アビリティ付与,自身,必ず(100%),ターン開始時/ODゲージが満タンの場合,,<special_effect=800000340>ウィークスタンプ</special_effect>,効果2ターン
    // 800000340,ウィークスタンプ,,追撃,確定,必ず(100%),Weak攻撃命中時,,110400339/110400339,    
    let tmp = {
        "PER" : time,
        "addSkill": tsuigekiSkillIds,
        "TURN": turn,
    }
    maxLimit = filterNumber(abCategory['maxLimit']);
    if(!maxLimit) {
        maxLimitWhen = $abCategory['maxLimit'].replace(maxLimit, '');
        tmp["limit"] = {"when" : maxLimitWhen, "time" : maxLimit};
    }
    arrayPush(TSUIGEKI_ABILITY, abCategory['when'], tmp);
}
function addAddintionalAbility(abInfo, abCategory){
    // アビリティを付与するアビリティを追加
    [trigger, per, time, turn ,maxLimit] = getParamater(abCategory);
    let subAbilityId = filterNumber(abCategory['size'].split(">")[0]);
    if(ABILITY_MASTER[subAbilityId] == undefined) {
        console.log(`${abInfo['Name']} ${abCategory['sub']} がアビリティ付与登録されていません`);
        return;
    } else {
        console.log("アビリティが付与されます", ABILITY_MASTER[subAbilityId]);
    }
    // タチアナのわがまま娘はターン開始時に「Weak攻撃時に追撃」を2ターン付与、制限なし
    // ブーケの狂愛は「攻撃時に攻撃強化（1ターン継続、3回まで）」を2ターン付与、上限1回
    // 追加したアビリティがさらに状態を増やす（ヒートアップや攻撃強化など）ならターン制限は分割管理
    // そうでない場合は、ターン制限は親アビリティと同じものが付与される

    // フォーマット
    // 702102414,海賊の狂宴,,アビリティ付与,全体,必ず(100%),ターン開始時,,<special_effect=800000355>略奪者</special_effect>,効果1ターン,
    // 800000355,略奪者,,ダメージ強化,防御弱化,必ず(100%),攻撃命中時,,防御弱化小(10%),効果1ターン,2回
    // ADD_ABILITYは「このtriggerになったら、アビリティを追加する」というものが入っている
    // なのでここには「ターン開始時、略奪者、1ターン、無制限」が入る
    // ADD_ABILITYは、略奪者の中身を判定してDAAMGE_ABILITYに対して攻撃命中時、防御弱化、1ターン、2回」が入る。そしてこのアビリティは1ターンで消える
    // なのでADD_ABILITYに入ったアビリティはターン制限や使用回数制限があるものであり、ADD_ABILITYには減衰処理が入る
    arrayPush(ADD_ABILITY, trigger, {
        "NAME": abInfo['Name'],
        "ADD_ABILITY_ID": subAbilityId,
        "TIME": time,
        "TURN" : turn,
        "LIMIT": maxLimit,
    });
}
function addCounterState(abInfo, abCategory){
    if(abCategory['main'] != "カウンター"){
        return;
    }
    [trigger, per, time, turn ,maxLimit] = getParamater(abCategory);
    let counterId = filterNumber(abCategory['size'].split(">")[0]);
    let skillInfo = SKILL_MASTER[maskId(counterId)];
    if(typeof skillInfo == "undefined") {
        console.log(`${abInfo["Name"]}のカウンター[${counterId}]はまだ設定されていません`);
        return;
    }
    COUNTER_ABILITY.push({
        "skill" : skillInfo,
        "time" : time,
        "limit": maxLimit,
        "TURN": NO_LIMIT, 
    });
}
function addOdAbility(abInfo, abCategory){
    if(abCategory['main'] != "ODゲージ上昇") {
        return ;
    }
    [trigger, per, time, turn ,maxLimit] = getParamater(abCategory);
    // ここに登録するものはTURNがないので無限に使用する
    arrayPush(OD_ABILITY, trigger, {
        "NAME": abInfo['Name'],
        "TIME": time,
        "PER" : per,
        "TURN" : turn,
        "LIMIT" : maxLimit
    });
}
function addDamageAbility(abInfo, abCategory){
    if(!abCategory['main'].includes("ダメージ強化")
    || abCategory['sub'] == "攻撃強化(男性)") {
        return;
    }
    [trigger, per, time, turn ,maxLimit] = getParamater(abCategory);
    let attr = getAttackSub(abCategory['sub']);
    arrayPush(DAMAGE_ABILITY, trigger, {
        "NAME" : abInfo['Name'],
        "ATTR" : attr, // 全,斬,打,突など
        "TIME" : time, // "必ず(100%)"
        "PER" : per, // "大(20%)",
        "TURN": turn,
        "LIMIT": maxLimit, // 常時発動
    });
}
function addSkillUseUpAbility(abInfo, abCategory){
    if(abCategory['main'] != "使用回数制限回復") {
        return;
    }
    [trigger, per, time, turn ,maxLimit] = getParamater(abCategory);
    arrayPush(SKILL_USE_UP_ABILITY, trigger, {
        "NAME" : abInfo['Name'],
        "TARGET" : abCategory['sub'], // 技名
        "TIME" : time, // "必ず(100%)"
        "PER" : per, // 回数
        "LIMIT": maxLimit, // 常時発動
    });
}
function addBuffAbility(abInfo, abCategory){
    if(abCategory['main'] != "自身強化(バフ)" 
    && abCategory['main'] != "全員強化(バフ)" ) {
        return;
    }
    [trigger, per, time, turn ,maxLimit] = getParamater(abCategory);                
    let params = [];
    let subs = abCategory['sub'].replace(/全ステ/g, '腕力と体力と器用さと素早さと知力と精神と愛と魅力');
    // バフするパラメータを配列でいれる
    for(sub of subs.split("と")){
        // 攻撃バフ以外は使わない
        if(["腕力", "素早さ", "器用さ", "知力"].indexOf(sub) === false){
            continue;
        }
        // 腕力=>STR変換
        params.push(PARAM_KEY[PARAM_NAME.indexOf(sub)]);
    }
    if(params.length > 0){
        arrayPush(BUFF_ABILITY, trigger, {
            "NAME": abInfo['Name'],
            "PARAM": params,
            "TIME": time,
            "PER" : per,
            "TURN" : turn,
            "LIMIT": maxLimit,
        });
    }
}
function decrement() {
    DISP_ABILITY_NAMES = []; // リセット 
    COUNTER_ABILITY = decrementState(COUNTER_ABILITY);
    TSUIGEKI_ABILITY = decrementState(TSUIGEKI_ABILITY);
    OD_ABILITY = decrementState(OD_ABILITY);
    ADD_ABILITY = decrementState(ADD_ABILITY);
    NOW_DAMAGE_STATE["TEMP"] = decrementState(NOW_DAMAGE_STATE["TEMP"]);
    // バフは1/4ずつ減衰する
    for(let paramKey of Object.keys(NOW_BUFF_STATE)){
        // 減衰が終わってたらスキップ
        if(NOW_BUFF_STATE[paramKey]["TURN"] <= 0) {
            NOW_BUFF_STATE[paramKey]["PER"] = 0;
            continue;
        }
        NOW_BUFF_STATE[paramKey]["PER"] -= Math.abs(NOW_BUFF_STATE[paramKey]["MINUS"]);
        NOW_BUFF_STATE[paramKey]["PER"] = (NOW_BUFF_STATE[paramKey]["PER"] < 0) ? 0 : NOW_BUFF_STATE[paramKey]["PER"];
        NOW_BUFF_STATE[paramKey]["TURN"]--;
    }
}
function decrementState(target) {
    // trigger
    for(let i of Object.keys(target)){
        // data
        for(let j in target[i]){
            target[i][j]["TURN"]--;
            if(target[i][j]["TURN"] <= 0) {
                delete target[i][j];
            }
        }
        target[i] = target[i].filter(Boolean);
    }
    return target;
}

function updateStateWithTurnStart(turn, isOverDrive, NOW_OD) {
    updateState(turn, isOverDrive, NOW_OD, "開始")
}
function updateStateWithTurnEnd(turn, isOverDrive, NOW_OD) {
    updateState(turn, isOverDrive, NOW_OD, "終了");
}

function updateState(turn, isOverDrive, NOW_OD, timing) {
    let triggerList = [];
    triggerList.push(`ターン${timing}時`);

    let odTiming = (isOverDrive != "" || NOW_OD >= 100) ? "ODゲージが満タンの場合" : "ODゲージが満タンでない場合";
    let oddEven = turn % 2 == 0 ? "偶数" : "奇数";
    //console.log(turn, '追撃チェック前', JSON.parse(JSON.stringify(canTsuigeki)));
    triggerList.push(`ターン${timing}時/${odTiming}`);
    triggerList.push(`${oddEven}ターン${timing}時`);
    for(x of [3,4,5]) {
        if(turn % x == 0) {
            triggerList.push(`${x}の倍数のターン${timing}時`);
        }    
    }
    for(let turnOver = 3; turnOver <= turn; turnOver++) {
        triggerList.push(`${turnOver}ターン目以降のターン${timing}時`);
    }
    // ここまでがターン開始時処理
    for(trigger of triggerList) {
        updateStateFromAbility(trigger);
    }
}

function _getBpKeigen() {
    BP_KEIGEN_SKILL = 0;
    if(BUFF_ABILITY["消費BP減少"] != undefined) {
        for(info of BUFF_ABILITY["消費BP減少"]) {
            BP_KEIGEN_SKILL -= Number(info["PER"]);
        }
    }
}


function skipSkillPattern(skill, turn, bp){
    // この場合は通常攻撃のみを許可する
    if(is1TNormal && turn == 1 && skill['Name'] != "通常攻撃"){
        return true;
    }

    let skillLimitCount = skill['LimitCount'] ?? 9999;
    if (skillLimitCount <= (SKILL_USE_COUNT[skill['Name']] ?? 0)) {
        console.log(skill['Name'],'は',skill['LimitCount'],'回数制限. ',SKILL_USE_COUNT[skill['Name']],"回使用済み");
        return true;
    }

    // 剣豪の構えは1+3の倍数ターンしか使わない
    if(NOW_STYLE['Id'] == "ID37f5b"){
        // 剣豪の構えを使う前はBP8確保が必要
        if(turn % 3 == 0){
            if((bp - consumeBp) < 3) {
                return true;
            }
        }
    }
    if((skill['Id'] == "ID68fff48" || skill['Id'] == "ID69186a1")){
        // (turn -1 ) % 3 > 0
        if((turn-1) % 3 == 0){
        } else {
            return true;
        }
    }                    
    // 抜刀心眼剣は3の倍数ターンしか使わない
    if(skill['Id'] == "ID68fff49" && (turn ) % 3 > 0){
        return true;
    }   
    return false;
}
