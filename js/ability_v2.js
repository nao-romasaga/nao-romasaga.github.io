var BUFF_COUNT = {};
var DEBUFF_COUNT = {};
var AIL_NAMES = [
    "毒","マヒ", "暗闇","眠り","石化", 
    "スタン", "混乱", "魅了", "狂戦士", "気絶",     
];
let NOW_ABILITY_LIST = [];
var NOW_MAINS = [];
var NOW_SUB = "";
var NOW_FILTER = {};
var NOW_STYLE_FILTER = {};


let ABILITY_MAIN = {
    "ダメージ強化":"damage_up",
    "ダメージ強化(全体)":"damage_up_all",
    "被ダメージ軽減":"damage_down",
    "被ダメージ軽減(全体)":"damage_down_all",
    "バフ":"buff",
    "デバフ":"debuff",
    "敵弱体化(デバフ)":"single_debuff",
    "敵全体弱体化(デバフ)":"all_debuff",
    "追撃":"tsuigeki",
    "カウンター":"counter",
    "BP回復":"bp",
    "HP回復":"hp",
    "HP回復量上昇":"hp_up",
    "命中上昇":"hit",
    "アビリティ付与":"add_ability",
    "ODゲージ上昇":"od",
    "かばう":"kabau",
    "ふんばる":"funbaru",
    "状態異常解除":"dis_down",
    "能力ダウン解除":"dis_ail",
    "回避":"deflect",
    "Critical攻撃追加":"add_critical",
    "状態異常付与":"add_ail",
    "挑発":"hate1",
    "ステルス":"hate2",
    "オーラムドロップ量":"quest1",
    "プレイヤーEXP":"quest2",
    "スタイル強化EXP":"quest3",
    "状態異常付与(味方)":"own_ail",
    "代償":"pay",
    "被ダメージ増加":"own_damage_up",
    "能力アップ解除": "buff_clear",
    "OD攻撃関連": "overdrive",
};
function scrollSubFilter() {
    $("html,body").animate({scrollTop: $('#FILTER_NAME').offset().top});    
}


init();

async function initialMasterSetup() {
    return new Promise(resolve => {
        setTimeout(() => {
            for(styleId in STYLE_MASTER) {
                let cid = STYLE_MASTER[styleId]['CharacterId'];
                let charInfo = CHAR_MASTER[cid];
                STYLE_MASTER[styleId]['Series'] = charInfo['Series'];    
            }

            for(abId in ABILITY_MASTER) {
                let holders = [];
                for (let styleId of ABILITY_MASTER[abId]['Holders']) {
                    holders.push(STYLE_MASTER[styleId]);
                }
                var sortedId = sortStyleId(holders, "SS", "new");    
                ABILITY_MASTER[abId]['Holders'] = sortedId;
                ABILITY_MASTER[abId]['HoldersInfo'] = [];
                for (let sId of sortedId) {
                    ABILITY_MASTER[abId]['HoldersInfo'].push({
                        "Id": sId,
                        "WeaponType": STYLE_MASTER[sId]['WeaponType'],
                        "Series": STYLE_MASTER[sId]['Series'],
                        "Rarity": STYLE_MASTER[sId]['Rarity'],
                    })
                }
            }
        }, 500);
    });    
}

// データの事前処理
function init() {
    reset();
    initialMasterSetup();

    tmpList = [];

    let OD_ABILITY = {'ids':[]};
    for(abId in ABILITY_MASTER) {
        for (let attr of ABILITY_MASTER[abId]['Attr']) {
            if(isOverDriveAbility(attr['when'])) {
                if(typeof OD_ABILITY[attr['main']] == "undefined") {
                    OD_ABILITY[attr['main']] = {'ids':[]};
                }
                OD_ABILITY['ids'].push(abId);
                OD_ABILITY[attr['main']]['ids'].push(abId);
                break;
            }
        }
    }
    ABILITY_COUNT['OD攻撃関連'] = OD_ABILITY;    

    buff_count();
    debuff_count();
    for(main in ABILITY_COUNT) {
        id = ABILITY_MAIN[main];
        let tmpCount = Number($("#count_" + id).html());
        tmpCount = isNaN(tmpCount) ? 0 : tmpCount;
        setCount("#count_" + id, tmpCount + ABILITY_COUNT[main]['ids'].length);
    };
    for(sub in ABILITY_COUNT['オーラム/経験値/スタイルEXP']){
        if(sub == "ids") {
            continue;
        }
        id = ABILITY_MAIN[sub];
        let tmpCount = Number($("#count_" + id).html());
        tmpCount = isNaN(tmpCount) ? 0 : tmpCount;
        setCount("#count_" + id, tmpCount + ABILITY_COUNT['オーラム/経験値/スタイルEXP'][sub]['ids'].length);
    }

    for(ailIdx in AIL_NAMES) {
        let ailName = AIL_NAMES[ailIdx];
        let ailCount = (typeof ABILITY_COUNT['状態異常付与'][ailName] !== "undefined")
        ? ABILITY_COUNT['状態異常付与'][ailName]['ids'].length
        : 0;
        setCount("#count_add_ail_" + ailIdx, ailCount);
    }

    // 旧データ構造の名残でABILITY_COUNTに存在しない対象ボタンはクリックしても動かないため隠す
    $("._FilterLink").each(function(){
        let m = $(this).attr("data-main");
        if(typeof ABILITY_COUNT[m] == "undefined") {
            $(this).removeClass("d-flex d-inline-block").addClass("d-none");
        }
    });
}


$(document).ready(function () {
    $("#INFO_AB_AREA").toggleClass("d-none");
});
    
let tree;
$(document).on('click', '.abilityName', function () {
    let id = $(this).attr("abid");
    $("#ability_label").text(ABILITY_MASTER[id]['Name']);
    $("#ability_flavor").html(ABILITY_MASTER[id]['FlavorText'].replace("　", "<br>"));
    displayAbilityHolder(ABILITY_MASTER[id]);
    scrollStyleList();
});

// 現データ構造は ABILITY_COUNT["バフ"][サブ][効果量]['ids']。
// サブは「腕力」のほか「腕力と素早さ」等の複合キーがあるため部分一致で合算する
function countBuffDebuff(mainKey, stCountPrefix, ailCountPrefix, totalStore) {
    let counts = ABILITY_COUNT[mainKey] ?? {};
    for(idx in PARAM_NAME) {
        let param = PARAM_NAME[idx];
        let ids = [];
        for(subKey in counts) {
            if(subKey == "ids") {
                continue;
            }
            if(subKey.indexOf(param) > -1 || subKey == "全ステ") {
                ids.push(...(counts[subKey]['ids'] ?? []));
            }
        }
        totalStore[param] = {'total': ids};
        setCount(stCountPrefix + idx, [...new Set(ids)].length);
    }
    for(idx in AIL_NAMES) {
        let ailName = AIL_NAMES[idx] + "耐性";
        let ids = [];
        for(subKey in counts) {
            if(subKey == "ids") {
                continue;
            }
            if(subKey.indexOf(ailName) > -1 || subKey == "全耐性") {
                ids.push(...(counts[subKey]['ids'] ?? []));
            }
        }
        totalStore[ailName] = {'total': ids};
        setCount(ailCountPrefix + idx, [...new Set(ids)].length);
    }
}

function buff_count() {
    countBuffDebuff("バフ", "#count_buff_st_", "#count_buff_ail_", BUFF_COUNT);
}

function debuff_count() {
    countBuffDebuff("デバフ", "#count_debuff_st_", "#count_debuff_ail_", DEBUFF_COUNT);
}
   

function reset() {
    NOW_ABILITY_LIST = [];
    NOW_MAINS = [];
    NOW_SUB = "";
    NOW_FILTER = {
        'mainFilter' : new Set(),
        'subFilter' : new Set(),
        'whenFilter' : new Set(),
        'timeFilter' : new Set(),
        'sizeFilter' : new Set(),
    };
    NOW_STYLE_FILTER = {
        'WeaponType' : new Set(),
        'Series' : new Set(),
        'Rarity' : new Set(),
    };    
}
$(document).on('click', '._StyleFilterLink', function () {
    $(this).toggleClass("filterActive");
    var filterOn = $(this).hasClass("filterActive");
    let target = $(this).attr("data-target");
    let value = $(this).attr("data-value");
    if(filterOn) {
        for(value of value.split(",")) {
            NOW_STYLE_FILTER[target].add(value);
        }
    } else {
        for(value of value.split(",")) {
            NOW_STYLE_FILTER[target].delete(value);
        }
    }
    _SubFilter();
});

$(document).on('click', '._SubFilterLink', function () {
    $(this).toggleClass("filterActive");
    var filterOn = $(this).hasClass("filterActive");
    let target = $(this).attr("data-target");
    let value = $(this).attr("data-value") ?? "";
    if(filterOn) {
        NOW_FILTER[target].add(value);
    } else {
        NOW_FILTER[target].delete(value);
    }
    _SubFilter();
});
function _SubFilter(){
    var result = NOW_ABILITY_LIST;    
    for(const[filterName, filter] of Object.entries(NOW_FILTER)){
        var tmp2 = []
        var abSet = new Set();
        for(value of filter) {
            for(abInfo of result) {
                for(v of abInfo[filterName].split("|")) {
                    if(v == value && !abSet.has(abInfo['Id'])) {
                        abSet.add(abInfo['Id']);
                        tmp2.push(Object.assign({},abInfo));
                    }
                }
            }
        }
        if(filter.size > 0) {
            // 大分類で絞ったものに入れ替える。そしてその後次のフィルタでまた絞る
            result = tmp2;
        }
    }

    let whenList = {};
    let isStyleFIlter = (NOW_STYLE_FILTER['WeaponType'].size 
    + NOW_STYLE_FILTER['Series'].size 
    + NOW_STYLE_FILTER['Rarity'].size > 0);

    var dispResult = [];
    for(let rIdx in result) {
        abInfo = result[rIdx];
        abInfo['HoldersTmp'] = [];
        if(isStyleFIlter) {
            for(let i in abInfo['HoldersInfo']) {
                let sInfo = abInfo['HoldersInfo'][i];
                let isSkip = false;
                if(NOW_STYLE_FILTER['WeaponType'].size > 0 && !NOW_STYLE_FILTER['WeaponType'].has(sInfo['WeaponType'])) {
                    isSkip = true;
                }
                if(isSkip || NOW_STYLE_FILTER['Series'].size > 0 && !NOW_STYLE_FILTER['Series'].has(sInfo['Series'])) {
                    isSkip = true;
                }
                if(isSkip || NOW_STYLE_FILTER['Rarity'].size > 0 && !NOW_STYLE_FILTER['Rarity'].has(sInfo['Rarity'])) {
                    isSkip = true;
                }
                if(!isSkip) {
                    abInfo['HoldersTmp'].push(sInfo['Id']);
                }
            }
        } else {
            abInfo['HoldersTmp'] = abInfo['Holders'];
        }
        if(abInfo['HoldersTmp'].length > 0) {
            dispResult.push(abInfo);
        } else {
            continue;
        }

        let whenSet = new Set();
        for(let attrIdx in abInfo['Attr']) {
            let attr = abInfo['Attr'][attrIdx];
            var mainMatch = attr['mainMatch'];
            var subMatch = attr['subMatch'];
            if(!mainMatch){
                continue;
            } else if(!subMatch) {
                continue;
            }
            let when = typeof MAIN_DISP_GROUP[NOW_MAINS[0]] == "undefined" ? attr['when'] : attr[MAIN_DISP_GROUP[NOW_MAINS[0]]];
            whenSet.add(when);
        }

        for(when of whenSet) {
            if(typeof whenList[when] == "undefined") {
                whenList[when] = [];
            }
            whenList[when].push(abInfo);
        }
    }

    addPerFilter(dispResult, NOW_MAINS, NOW_SUB, false);
    dispMainList(whenList);
}

// 旧データでは「自身強化(バフ)」等に分かれていたが、現データは「バフ」等の単一キーに統合済み
let MAIN_GROUP = {}
let MAIN_DISP_GROUP = {
//    "追撃" : "main",
//    "カウンター" : "sizeFilter",
    "かばう" : "sub",
    "ふんばる" : "sub",
}
let MAIN_DISP_SORTKEY = {
    "追撃" : "time",
    "カウンター" : "time",
}

$(document).on('click', '._FilterLink', async function () {
    scrollSubFilter();
    // 初期化
    reset();
    $(".filterActive").removeClass("filterActive");

    $(this).toggleClass("filterActive");
    let main = $(this).attr("data-main");
    let sub = $(this).attr("data-sub") ?? "";

    $("#FILTER_NAME").text(main + " " + sub);
    
    let group = MAIN_GROUP[main] || [main];
    group = (typeof group != "undefined") ? group : [];
    let result = [];
    // subがあるのはバフデバフ系。腕力バフでフィルタするなら腕力バフか全ステバフしか出さない
    if(sub != "") {
        for(key of group) {
            let keyCounts = ABILITY_COUNT[key] ?? {};
            Object.keys(keyCounts).filter(x => x.indexOf(sub) > -1 && x != "ids").forEach((subKey) => {
                g = keyCounts[subKey] ?? {'ids': []};
                result.push(...g['ids']);
            })
            var allStName = (sub.indexOf("耐性") > -1) ? "全耐性" : "全ステ";
            g = keyCounts[allStName] ?? {'ids': []};
            result.push(...g['ids']);
        }
    } else {
        for(key of group) {
            for(subKey in ABILITY_COUNT[key]) {
                if(subKey == "ids") {
                    continue;
                }

                if(Object.keys(ABILITY_COUNT[key][subKey]).length == 1) {
                    result.push(...ABILITY_COUNT[key][subKey]['ids']);
                }
                for(perKey in ABILITY_COUNT[key][subKey]) {
                    if(perKey == "ids") {
                        continue;
                    }                        
                    g = ABILITY_COUNT[key][subKey][perKey] ?? {'ids': []};
                    result.push(...g['ids']);
                }
                
            }
        }
    }

    let abListTmp = [...new Set(result)];
    let abList = [];
    for(id of abListTmp) {
        abList.push(ABILITY_MASTER[id]);
    }

    abList.sort(function(a,b){
        if(a.Name > b.Name) return 1;
        if(a.Name <= b.Name) return -1;
    });

    //abList.sort();

    let whenList = {};
    for(abIdx in abList) {
        let abInfo = abList[abIdx];
        let whenSet = new Set();
        let whenValue = {};

        var mainoncat = [];
        var subConcat = [];
        var whenConcat = [];
        var timeConcat = [];
        var sizeConcat = [];
        for(let attrIdx in abInfo['Attr']) {
            let attr = abInfo['Attr'][attrIdx];
            let mainMatch = (group.indexOf(attr['main']) > -1);
            let subMatch = (sub == "" || String(attr['sub']).indexOf(sub) > -1
            || ((main == "バフ" || main == "デバフ") && attr['sub'] == "全ステ"));
            attr['mainMatch'] = mainMatch;
            attr['subMatch'] = subMatch;
            if(!mainMatch){
                continue;
            } else if(!subMatch) {
                continue;
            }
            let when = typeof MAIN_DISP_GROUP[main] == "undefined" ? attr['when'] : attr[MAIN_DISP_GROUP[main]];
            whenSet.add(when);
            if(typeof whenValue[when] == "undefined") {
                whenValue[when] = 0;
            }

            let tmpSize = typeof MAIN_DISP_SORTKEY[attr['main']] == "undefined" ? attr['size'] : attr[MAIN_DISP_SORTKEY[attr['main']]];
            let size = isNaN(tmpSize) ? Number(String(tmpSize).replace(/[^0-9]/g, '')) : tmpSize;
            size = (size == 0) ? 1 : size;
            size = (size == 54) ? 1.25  : size;
            let time = isNaN(attr['time']) ? Number(attr['time'].replace(/[^0-9]/g, '')) : attr['time'];
            whenValue[when] += (size * time / 100);

            mainoncat.push(attr['main']);
            subConcat.push(...normalizeSubLabels(attr['sub']));
            whenConcat.push(normalizeWhenLabel(attr['when']));
            timeConcat.push(attr['time']);
            let sizefilt = getSkillIds (attr);
            sizeConcat.push(sizefilt);
            attr['sizeFilter'] = sizefilt;
        }
        abInfo['mainFilter'] = mainoncat.join("|");
        abInfo['subFilter'] = subConcat.join("|");
        abInfo['whenFilter'] = whenConcat.join("|");
        abInfo['timeFilter'] = timeConcat.join("|");
        abInfo['sizeFilter'] = sizeConcat.join("|");

        for(when of whenSet) {
            if(typeof whenList[when] == "undefined") {
                whenList[when] = [];
            }
            if(typeof abInfo['sortValue'] == "undefined") {
                abInfo['sortValue'] = {}
            }
            abInfo['sortValue'][when] = whenValue[when];
            //whenList[when].push($tmpl.clone());
            whenList[when].push(abInfo);
        }
    }
    let whenKeys = Object.keys(whenList);

    whenKeys.sort(function(a,b){
        if(whenList[a].length >= whenList[b].length) return -1;
        if(whenList[a].length < whenList[b].length) return 1;
        return 0;
    });
   
    for(let whenKey in whenList) {
        whenList[whenKey].sort(function(a,b){
            if(a['sortValue'][whenKey].length >= b['sortValue'][whenKey].length) return -1;
            if(a['sortValue'][whenKey].length < b['sortValue'][whenKey].length) return 1;
            return 0;
        });
    }
    let newList = {};
    for(let k of whenKeys) {
        newList[k] = whenList[k];
    }

    NOW_ABILITY_LIST = abList;
    NOW_MAINS = group;
    NOW_SUB = sub;
    addPerFilter(NOW_ABILITY_LIST, group, sub, true);

    dispMainList(newList);
});

function isOverDriveAbility(when){
    return when.includes("OD") && !when.includes("満タンでない場合");
}
async function dispMainList(whenList) {
    $("#AB-LIST").html("");
    return new Promise(resolve => {
        setTimeout(() => {
            for(let whenKey in whenList) {
                $group = $("<div class='col-12 when-group'></div>");
                $group.append(`<div class='col-12 label-text-small text-center' style="font-size:1.5rem">${whenKey} (${whenList[whenKey].length}種)</div>`);
        
                for(let abInfo of whenList[whenKey]) {
                    let attrs = [];
        
                    $tmpl = $("#AB-LIST-TMPL").clone().removeClass("d-none").attr("id","");
                    let name = abInfo['Name'].replace(" ", "").replace("　", "").replace("(", "（").replace(")", "）").replace("I","Ⅰ");
                    $tmpl.find(".NAME-AREA").text(name);
                    $tmpl.find(".AB-ICON").attr('style' , `background-image: url(https://romasagatool.com/img/icon/tex_ability_${abInfo['Icon']}.png)`);
                    // 技所持スタイルの挿入
                    let sIdList = (typeof abInfo['HoldersTmp'] != "undefined") ? abInfo['HoldersTmp'] : abInfo['Holders'];
                    for (let styleId of sIdList) {
                        let styleInfo2 = STYLE_MASTER[styleId];
                        // スタイルアイコンの追加
                        $tmpl.find(".ICON-AREA").append(getStyleIcon(styleInfo2['Rarity'], styleId, "", true));
                    }
        
                    for(attr of abInfo['Attr']) {            
                        let subAttr = (attr['sub'] == attr['when'])  ? "" : attr['sub'];
                        subAttr = String(subAttr).replace("を含むダメージ","")
                        .replace("モラルアップ","")
                        .replace("ガードアップ","")
                        .replace("攻撃強化","")
                        .replace("攻撃弱化","")
                        .replace("防御強化","")
                        .replace("防御弱化","")
                        .replace("ヒートアップ","")
                        .replace("ディフェンスアップ","");
                        let timeAttr = (attr['time'] == "必ず(100%)") ? "" : " "+attr['time'].replace(/[^0-9]/g, '') + "%";
                        let whenAttr = (attr['when'] == "常時") ? "" : attr['when'];
                        whenAttr = whenAttr.replace("直接攻撃を受けた時","")
                        .replace("ターン","ﾀｰﾝ")
                        .replace("ラウンド","ﾗｳﾝﾄﾞ");
                        let wtLabel = (whenAttr + timeAttr == "") ? "" : `[${whenAttr}${timeAttr}]`

                        let mainMatch = attr['mainMatch'];
                        let subMatch = attr['subMatch'];
                        let className = (mainMatch && subMatch) ? "fuchidori-blue" : "";
                        let option = attr['size'];
                        if(attr['sub'] == "ダメージブロック") {
                            let t = attr['turn'].replace("ターン","T");
                            let c = attr['maxLimit'] != "" ? `(${attr['maxLimit']})` : "";
                            option = `${c} ${t}`;
                        }
                        if(attr['main'] == "追撃" || attr['main'] == "カウンター"){
                            let tmpSkillNames = [];
                            for(skillId of String(attr['size']).split("/")){
                                let skillInfo = SKILL_MASTER[maskId(skillId)] ?? {"Name":skillId};
                                tmpSkillNames.push(skillInfo['Name'].replace("[追撃]",""));
                            }
                            subAttr = "";
                            option = tmpSkillNames.join("/");
                        }
                        attrs.push(`
                        <div class="d-flex justify-content-between">
                            <div>${wtLabel} ${attr['main']}  </div>
                            <div class="${className}">${subAttr} ${option}</div>
                        </div>
                        `);
                    }            
                    $tmpl.find(".FLAVOR-AREA").html(attrs.join(""));
                    $tmpl.find(".FLAVOR-AREA").attr('abid', abInfo['Id']);
                    $group.append($tmpl);
                }
                $("#AB-LIST").append($group);
            }                
        }, 500);
    });    
}

var LIFE_CYCLE = [
    "極小","小","虫","大","特大","極大","超極大",
    "常時","武器装備時",
    "攻撃を受けた時","Resist攻撃を受けた時","Weak攻撃を受けた時",
    "ヒートアップ","攻撃強化","モラルアップ","ガードダウン",
    "ガードアップ","ディフェンスアップ","防御強化","モラルダウン",
    "Weak攻撃","Critical攻撃","OD攻撃","連携攻撃",
    "HP満タン時","HP満タンでない時","HPが満タンではない時","瀕死時",
    "味方が全員生存している時",
    "バトル開始時","ラウンド開始時",
    "ターン開始時","奇数ターン開始時","偶数ターン開始時",
    "攻撃命中時","Weak攻撃命中時",
    "ODゲージが満タンの場合",
    "奇数ターン終了時","偶数ターン終了時","ターン終了時",
    "単体攻撃","全体攻撃","範囲攻撃",
    "斬属性攻撃","打属性攻撃","突属性攻撃",
    "熱属性攻撃","冷属性攻撃","雷属性攻撃","陽属性攻撃","陰属性攻撃",
    "斬属性を含むダメージ","打属性を含むダメージ","突属性を含むダメージ",
    "熱属性を含むダメージ","冷属性を含むダメージ","雷属性を含むダメージ","陽属性を含むダメージ","陰属性を含むダメージ",
]

// サブフィルターの大分類。ルールに一致しないラベル(バフのステータス名等)はそのまま表示する
var SUB_GROUP_ORDER = [
    "攻撃強化系","属性攻撃","攻撃タイプ","エンハンス系","秘奥・攻","全ダメージ",
];
var SUB_GROUP_RULES = [
    {group: "全ダメージ",   re: /全ダメージ/},
    {group: "エンハンス系", re: /エンハンス|エクストラフォース/},
    {group: "秘奥・攻",     re: /^秘奥・攻/},
    {group: "攻撃タイプ",   re: /Weak|Critical|OD攻撃|連携攻撃|単体攻撃|全体攻撃|範囲攻撃|直接攻撃|間接攻撃|カウンター攻撃|術攻撃|技攻撃/},
    {group: "属性攻撃",     re: /属性攻撃/},
    {group: "攻撃強化系",   re: /攻撃強化|ヒートアップ|モラルアップ|防御強化/},
];
function normalizeSubLabel(sub) {
    sub = String(sub);
    for(let rule of SUB_GROUP_RULES) {
        if(rule.re.test(sub)) {
            return rule.group;
        }
    }
    return sub;
}

// 1つのsubが複数のラベルに対応するケースを返す配列版。
// 全ステは各ステータスでも数えられるように展開し、
// 「腕力と素早さ」のような複合ステータスは個別ステータスに分解する
function normalizeSubLabels(sub) {
    sub = String(sub);
    if(sub == "全ステ") {
        return ["全ステ", ...PARAM_NAME];
    }
    if(sub == "全耐性") {
        return ["全耐性", ...AIL_NAMES.map(a => a + "耐性")];
    }
    if(sub.indexOf("と") > -1) {
        let parts = sub.split("と");
        let isStatCompound = parts.every(p => PARAM_NAME.includes(p) || p.indexOf("耐性") > -1);
        if(isStatCompound) {
            return parts;
        }
    }
    return [normalizeSubLabel(sub)];
}

// 発動タイミングは「/条件」やスキル名つきの複合表記を基本タイミングへ集約する
var WHEN_GROUP_ORDER = [
    "常時","バトル開始時","ラウンド開始時","ターン開始時","ターン終了時",
    "攻撃時","攻撃命中時","攻撃を受けた時","味方が攻撃を受けた時",
    "スキル発動後","回復行動時","装備条件","その他",
];
function normalizeWhenLabel(when) {
    when = String(when);
    if(when.indexOf("常時") == 0) return "常時";
    if(when.indexOf("バトル開始時") > -1) return "バトル開始時";
    if(when.indexOf("ラウンド開始時") > -1) return "ラウンド開始時";
    if(when.indexOf("ターン開始時") > -1) return "ターン開始時";
    if(when.indexOf("ターン終了時") > -1) return "ターン終了時";
    if(/発動後|発動時/.test(when)) return "スキル発動後";
    if(/命中時|命中させた時/.test(when)) return "攻撃命中時";
    if(/味方.*受けた時|自身以外.*受けた時/.test(when)) return "味方が攻撃を受けた時";
    if(/受けた時|受けるたび/.test(when)) return "攻撃を受けた時";
    if(/攻撃時|攻撃後/.test(when)) return "攻撃時";
    if(/装備している場合|装備時/.test(when)) return "装備条件";
    if(when.indexOf("回復行動時") > -1) return "回復行動時";
    return "その他";
}

// 同じアビリティが複数のAttrで同じラベルに該当しても1件として数える
function pushUniqueFilterItem(list, label, abInfo) {
    if(typeof list[label] == "undefined") {
        list[label] = [];
    }
    if(list[label].indexOf(abInfo) == -1) {
        list[label].push(abInfo);
    }
}
// target = ABILITY_COUNT["バフ"]
// param = "精神"
function addPerFilter(nowList, mains, sub, isResetFilterButton) {
    let tagList = {};
    let subList = {};
    let whenList = {};
    let timeList = {};
    let seriesList = {};
    let weaponList = {};
    let rareList = {
        "SS": new Set(),
        "S": new Set(),
        "A": new Set(),
    };
    if(mains.length > 1) {
        for(main of mains) {
            tagList[main] = [];
        }
    }
    for(series of SERIES_SORT) {
        seriesList[series] = new Set();
        $("#count_" + series).html(0);
    }
    $("#count_GB").html(0);
    for(wp in WEAPON_MAP) {
        weaponList[wp] = new Set();
        $("#count_"+ wp).html(0);
    }
    $("#count_SS").html(0);
    $("#count_S").html(0);
    $("#count_A").html(0);


    let validMain = (mains.length > 1) || mains[0] == "OD攻撃関連";
    let validSub = (mains[0] != "追撃");
    let validWhen = (mains[0] != "追撃");
    let validTiming = true;
    for(abInfo of nowList) {
        var sIdList = (typeof abInfo['HoldersTmp'] != "undefined") ? abInfo['HoldersTmp'] : abInfo['Holders'];
        for(sid of sIdList) {
            let wp = STYLE_MASTER[sid]['WeaponType'];
            let rare = STYLE_MASTER[sid]['Rarity'];
            let cid = STYLE_MASTER[sid]['CharacterId'];
            let charInfo = CHAR_MASTER[cid];
            weaponList[wp].add(sid);
            rareList[rare].add(sid);
            seriesList[charInfo['Series']].add(sid);
        }
        for(attr of abInfo['Attr']) {
            if(!mains.includes(attr['main'])) {
                continue;
            } else if(attr['sub'] != "全ステ" && attr['sub'].indexOf(sub) == -1) {
                continue;
            }

            let attrMain = attr['main'];
            let attrSub = mains.indexOf(attrMain) > -1 ? String(attr['sub']) : "";
            let when = attr['when'];
            let time = attr['time'];

            let validWhen2 = validWhen
            && attrSub.replace("時","") != when.replace("時","")
            && when.indexOf("装備時") == -1
            ;

            let groupedSubs = normalizeSubLabels(attrSub);
            let groupedWhen = normalizeWhenLabel(when);

            if(validMain) {
                pushUniqueFilterItem(tagList, attrMain, abInfo);
            }
            if(validSub) {
                for(let groupedSub of groupedSubs) {
                    if(groupedSub != "") {
                        pushUniqueFilterItem(subList, groupedSub, abInfo);
                    }
                }
            }
            if(validWhen2) {
                pushUniqueFilterItem(whenList, groupedWhen, abInfo);
            }
            if(validTiming) {
                pushUniqueFilterItem(timeList, time, abInfo);
            }
        }
    }

    timeSortKeys = keyNumberSort(timeList);

    addFilterList(tagList, "mainFilter","#FILTER_TAG", isResetFilterButton);
    let subSortKeys = SUB_GROUP_ORDER
        .concat(["全ステ"], PARAM_NAME, AIL_NAMES.map(a => a + "耐性"), ["全耐性"])
        .concat(LIFE_CYCLE);
    addFilterList(subList, "subFilter", "#FILTER_SUB", isResetFilterButton, subSortKeys);
    addFilterList(timeList, "timeFilter", "#FILTER_TIME", isResetFilterButton, timeSortKeys);
    addFilterList(whenList, "whenFilter", "#FILTER_WHEN", isResetFilterButton, WHEN_GROUP_ORDER);


    for(series of SERIES_SORT) {
        if (["GB1","GB2","GB3"].indexOf(series) > -1) {
            seriesId = "GB";
        } else {
            seriesId = series;
        }
        let tmpCount = Number($("#count_" + seriesId).html());
        tmpCount = isNaN(tmpCount) ? 0 : tmpCount;

        setCount("#count_" + seriesId , tmpCount + seriesList[series].size , false);
    }
    for(wp in WEAPON_MAP) {
        setCount("#count_" + wp , weaponList[wp].size , false);
        $("#count_" + wp).html();
    }
    for(rare in rareList) {
        setCount("#count_" + rare , rareList[rare].size , false);
    }
}

function addFilterList(data, filterName, targetArea, isResetFilterButton, sortedKey = []) {
    if(isResetFilterButton) {
        $(targetArea).html("");
        let loop = (sortedKey.length == 0) ? LIFE_CYCLE : sortedKey;
        let labels = [];
        for(label of loop) {
            labels.push(label)
        }
        for(label in data){
            if(labels.indexOf(label) == -1) {
                labels.push(label);
            }
        }
        for(label of labels) {
            abList = data[label];
            if(typeof abList == "undefined" || label === "") {
                continue;
            }
            $row = $("#BUFF_PER_TMPL").clone().attr("style",'').attr('id', '');
            $row.find(".BUFF_PER_NAME").html(label.replace("(","<br class='d-sm-none'>("));
            $row.find(".BUFF_PER_COUNT").html(abList.length);
            $row.attr('data-target', filterName);
            $row.attr('data-value', label);

            $(targetArea).append($row);
        }
        // 選択肢が1つしかない対象フィルターは表示しても意味がないため行ごと隠す
        let minVisible = (targetArea == "#FILTER_TAG") ? 1 : 0;
        $(targetArea).closest("ul").toggleClass("d-none", $(targetArea).find("button").length <= minVisible);
    } else {
        $(targetArea).find(".BUFF_PER_COUNT").each(function(){
            $(this).html(0);
        })
        $(targetArea).find(".BUFF_PER_BTN").addClass("noneCount");        
        for(label in data) {
            abList = data[label];
            $(targetArea).find(".BUFF_PER_BTN").each(function(){
                if($(this).attr("data-value") == label) {
                    $(this).removeClass("noneCount");
                    $(this).find(".BUFF_PER_COUNT").html(abList.length);
                    return false; // break
                }
            })
        }
    }
}


function keyNumberSort(list) {
    let sortKey = [];
    let changeFlag = false;
    for(per in list) {
        const p = Number(per.replace(/[^0-9]/g, ''));
        if(p != 0) {
            changeFlag = true;
        }
        sortKey.push({'key':p, 'per':per});
    }
    if(!changeFlag) {
        return [];
    }

    sortKey.sort(function(a, b) {
        return a.key - b.key;
    });
    let result = [];
    for(obj of sortKey) {
        result.push(obj['per']);
    }
    return result;
}

function setCount(tag, count, hide = true) {
    $(tag).html(count);
    if(count == 0) {
        if(hide) {
            $(tag).parent('button').removeClass('d-flex').addClass('d-sm-flex d-none');
        }
        $(tag).addClass('noneCount');
    } else {
        $(tag).removeClass('noneCount');
    }
}

$(document).on('click', '#INFO_AB_OVERLAY,#INFO_AB_AREA', function () {
    $("#INFO_AB_OVERLAY").addClass("d-none");
    $("#INFO_AB_AREA").toggleClass("popup-animation-out popup-animation-in").attr('style','top:10px');
});
$(document).on('click', '.FLAVOR-AREA', function () {
    $("#INFO_AB_OVERLAY").removeClass("d-none");
    let abId = $(this).attr('abid');
    let abInfo = ABILITY_MASTER[abId];
    $("#INFO_AB_NAME").text(abInfo['Name']);
    $("#INFO_AB_TEXT").html(abInfo['FlavorText']);
    $("#INFO_AB_AREA").toggleClass("popup-animation-out popup-animation-in").attr('style','top:10px');
});

function getSkillIds (attr) {
    let isUseSkill = ["追撃", "カウンター"].includes(attr['main']);
    if(!isUseSkill) {
        return attr["size"];
    }
    let tmpSkillNames = new Set();
    for(skillId of String(attr['size']).split("/")){
        let skillInfo = SKILL_MASTER[maskId(skillId)] ?? {"Name":skillId};
        tmpSkillNames.add(skillInfo['AttackArea']);
    }
    // SetをArrayに変換
    const myArray = Array.from(tmpSkillNames);
    // 配列を昇順にソート
    myArray.sort((a, b) => a - b);
    return myArray.join("|");
}

// ============================================================
// v2試作: クエスト用途プリセット
// トップの分類ツリーとは別に「シーン×やりたいこと」で
// main×発動タイミングの組み合わせを一発で絞り込む。
// ============================================================

// 発動タイミングを「行動不要(passive)/要行動(active)」に二値分類する。
// passive判定をactiveより先に評価する(「攻撃を受けた時」は
// active側の「攻撃時」にも部分一致するため順序が結果を左右する)
var TRIGGER_PASSIVE_PAT = /開始時|終了時|常時|装備している|装備時|攻撃を受け|ダメージを受け|HP0になる|満タン|瀕死|登場時|生存している|交代時|倒れた|戦闘不能|控え|被弾|受けるたび|勝利時|気絶・戦線離脱|状態の場合|ふみとどまった/;
var TRIGGER_ACTIVE_PAT = /命中|攻撃時|攻撃を発動|を発動後|発動した時|発動時|倒した時|回復行動|使用時|使用した時|行動時|攻撃した|を与えた|OD攻撃|カウンター|攻撃前|攻撃後|術攻撃|単体攻撃/;
function classifyTrigger(when) {
    when = String(when ?? "");
    if (when == "" || when == "-" || when == "undefined") {
        return "unknown";
    }
    // 「味方が攻撃を受けた時」等は自身の行動ではないためpassive
    if (when.indexOf("味方") > -1 && when.indexOf("自身") == -1
        && /攻撃を受け|倒れ|戦線離脱|HP0/.test(when)) {
        return "passive";
    }
    if (TRIGGER_PASSIVE_PAT.test(when)) {
        return "passive";
    }
    if (TRIGGER_ACTIVE_PAT.test(when)) {
        return "active";
    }
    return "unknown";
}

// 火力に直結するバフのsub(体力・精神などの防御系ステは除外)
var ATTACK_BUFF_SUB_RE = /腕力|器用さ|素早さ|知力|全ステ|攻撃強化|ヒートアップ|モラルアップ/;

var ABILITY_PRESETS = {
    "kanmon": {
        label: "関門：行動せず火力UP",
        mains: ["ダメージ強化", "バフ"],
        match: function (attr) {
            if (classifyTrigger(attr['when']) != "passive") {
                return false;
            }
            if (attr['main'] == "バフ") {
                return ATTACK_BUFF_SUB_RE.test(String(attr['sub']));
            }
            return attr['main'] == "ダメージ強化";
        },
    },
    "raid": {
        label: "レイド：火力盛り",
        mains: ["ダメージ強化", "追撃"],
        match: function (attr) {
            return ["ダメージ強化", "追撃"].includes(attr['main']);
        },
    },
    "gento_bp": {
        label: "幻闘技：BP確保",
        mains: ["BP回復", "最大BP増加"],
        match: function (attr) {
            return ["BP回復", "最大BP増加"].includes(attr['main']);
        },
    },
    "gento_od": {
        label: "幻闘技：OD加速",
        mains: ["ODゲージ上昇"],
        match: function (attr) {
            return attr['main'] == "ODゲージ上昇";
        },
    },
    "counter": {
        label: "対策：カウンター持ち",
        mains: ["カウンター"],
        match: function (attr) {
            return attr['main'] == "カウンター";
        },
    },
    "tank": {
        label: "対策：受け役さがし",
        mains: ["被ダメージ軽減", "かばう", "挑発", "ふんばる"],
        match: function (attr) {
            return ["被ダメージ軽減", "かばう", "挑発", "ふんばる"].includes(attr['main']);
        },
    },
};

$(document).on('click', '._PresetLink', function () {
    scrollSubFilter();
    reset();
    $(".filterActive").removeClass("filterActive");
    $(this).toggleClass("filterActive");
    let preset = ABILITY_PRESETS[$(this).attr("data-preset")];
    $("#FILTER_NAME").text(preset.label);
    renderPresetList(preset);
});

// _FilterLinkハンドラと同じ描画パイプラインを、ABILITY_COUNT経由ではなく
// ABILITY_MASTER全件をプリセット述語で走査して通す
function renderPresetList(preset) {
    let abList = [];
    for (let abId in ABILITY_MASTER) {
        let abInfo = ABILITY_MASTER[abId];
        let hit = false;
        for (let attr of abInfo['Attr']) {
            let isMatch = preset.match(attr);
            attr['mainMatch'] = isMatch;
            attr['subMatch'] = isMatch;
            if (isMatch) {
                hit = true;
            }
        }
        if (hit) {
            abList.push(abInfo);
        }
    }
    abList.sort(function (a, b) {
        if (a.Name > b.Name) return 1;
        return -1;
    });

    let mains = preset.mains;
    let whenList = {};
    for (let abInfo of abList) {
        let whenSet = new Set();
        let whenValue = {};
        let mainoncat = [];
        let subConcat = [];
        let whenConcat = [];
        let timeConcat = [];
        let sizeConcat = [];
        for (let attr of abInfo['Attr']) {
            if (!attr['mainMatch']) {
                continue;
            }
            let when = typeof MAIN_DISP_GROUP[mains[0]] == "undefined" ? attr['when'] : attr[MAIN_DISP_GROUP[mains[0]]];
            whenSet.add(when);
            if (typeof whenValue[when] == "undefined") {
                whenValue[when] = 0;
            }
            let tmpSize = typeof MAIN_DISP_SORTKEY[attr['main']] == "undefined" ? attr['size'] : attr[MAIN_DISP_SORTKEY[attr['main']]];
            let size = isNaN(tmpSize) ? Number(String(tmpSize).replace(/[^0-9]/g, '')) : tmpSize;
            size = (size == 0) ? 1 : size;
            size = (size == 54) ? 1.25 : size;
            let time = isNaN(attr['time']) ? Number(String(attr['time']).replace(/[^0-9]/g, '')) : attr['time'];
            whenValue[when] += (size * time / 100);

            mainoncat.push(attr['main']);
            subConcat.push(...normalizeSubLabels(attr['sub']));
            whenConcat.push(normalizeWhenLabel(attr['when']));
            timeConcat.push(attr['time']);
            let sizefilt = getSkillIds(attr);
            sizeConcat.push(sizefilt);
            attr['sizeFilter'] = sizefilt;
        }
        abInfo['mainFilter'] = mainoncat.join("|");
        abInfo['subFilter'] = subConcat.join("|");
        abInfo['whenFilter'] = whenConcat.join("|");
        abInfo['timeFilter'] = timeConcat.join("|");
        abInfo['sizeFilter'] = sizeConcat.join("|");

        for (let when of whenSet) {
            if (typeof whenList[when] == "undefined") {
                whenList[when] = [];
            }
            if (typeof abInfo['sortValue'] == "undefined") {
                abInfo['sortValue'] = {};
            }
            abInfo['sortValue'][when] = whenValue[when];
            whenList[when].push(abInfo);
        }
    }

    let whenKeys = Object.keys(whenList);
    whenKeys.sort(function (a, b) {
        return whenList[b].length - whenList[a].length;
    });
    for (let whenKey in whenList) {
        whenList[whenKey].sort(function (a, b) {
            return b['sortValue'][whenKey] - a['sortValue'][whenKey];
        });
    }
    let newList = {};
    for (let k of whenKeys) {
        newList[k] = whenList[k];
    }

    NOW_ABILITY_LIST = abList;
    NOW_MAINS = mains;
    NOW_SUB = "";
    addPerFilter(NOW_ABILITY_LIST, mains, "", true);
    dispMainList(newList);
}

function initPresetCounts() {
    for (let key in ABILITY_PRESETS) {
        let preset = ABILITY_PRESETS[key];
        let count = 0;
        for (let abId in ABILITY_MASTER) {
            for (let attr of ABILITY_MASTER[abId]['Attr']) {
                if (preset.match(attr)) {
                    count++;
                    break;
                }
            }
        }
        setCount("#preset_count_" + key, count);
    }
}
$(document).ready(initPresetCounts);