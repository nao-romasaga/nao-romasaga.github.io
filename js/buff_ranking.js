let SELECTED_ATTACKER = null;
let SELECTED_SKILL = null;


let LAST_RANKING = null;   // 直近 API レスポンス {baseDamage, ranking:[...]}
let RANK_REQ_SEQ = 0;      // リクエスト世代カウンタ（古いレスポンス破棄用）

function recalcRanking() {
    if (!SELECTED_ATTACKER || !SELECTED_SKILL) {
        LAST_RANKING = null;
        $("#BASE_DAMAGE_AREA").addClass("d-none");
        $("#RANKING_AREA").html('<div class="text-center" style="padding:20px;">アタッカーと技を選択してください</div>');
        return;
    }
    const enemy = getEnemyConfig();
    const req = {
        attackerStyleId: SELECTED_ATTACKER['Id'],
        skillId: SELECTED_SKILL['Id'],
        enemy: { count: enemy.count, vit: enemy.vit, mnd: enemy.mnd, resist: enemy.resist },
    };
    const seq = ++RANK_REQ_SEQ;
    $("#RANKING_AREA").html('<div class="text-center" style="padding:20px;">計算中...</div>');
    fetchOkimonoRanking(req)
        .then(function (data) {
            if (seq !== RANK_REQ_SEQ) return;   // 古いレスポンスは破棄
            LAST_RANKING = data;
            renderRanking();
        })
        .catch(function () {
            if (seq !== RANK_REQ_SEQ) return;
            LAST_RANKING = null;
            $("#BASE_DAMAGE_AREA").addClass("d-none");
            $("#RANKING_AREA").html('<div class="text-center" style="padding:20px;">ランキングの取得に失敗しました。時間をおいて再度お試しください</div>');
        });
}

// API を叩いて JSON を返す。非200/ネットワーク失敗は reject。
function fetchOkimonoRanking(req) {
    const base = resolveOkimonoApiBase(location.hostname);
    const url = buildOkimonoQuery(base, req);
    return fetch(url).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    });
}

// キャッシュ済みランキングを描画。フィルタ変更時はこれだけ呼ぶ（再 fetch しない）。
// 既存のフィルタ意味論を維持: 所持チェッカー(MY_FLAG)のみリストを絞る。upRate<=0 は非表示。
function renderRanking() {
    $("#RANKING_AREA").html("");
    // 基本値（アタッカー素ダメージ）とその計算内訳をランキング上部に表示
    if (LAST_RANKING && LAST_RANKING.baseDamage > 0) {
        $("#BASE_DAMAGE_VALUE").text(Math.round(LAST_RANKING.baseDamage).toLocaleString());
        const rows = (typeof buildBaseBreakdownRows === 'function')
            ? buildBaseBreakdownRows(LAST_RANKING.baseBreakdown) : [];
        const html = rows.map(row =>
            `<div class="d-flex justify-content-between"><span class="text-secondary">${row.label}</span><span class="fuchidori-blue">${row.value}</span></div>`
        ).join('');
        $("#BASE_BREAKDOWN").html(html);
        $("#BASE_DAMAGE_AREA").removeClass("d-none");
    } else {
        $("#BASE_BREAKDOWN").html("");
        $("#BASE_DAMAGE_AREA").addClass("d-none");
    }
    if (!LAST_RANKING || !Array.isArray(LAST_RANKING.ranking)) return;
    for (const row of LAST_RANKING.ranking) {
        if (!(row.upRate > 0)) continue;
        const styleId = row.supportStyleId;
        if (MY_FLAG && MY_STYLE.indexOf(styleId) === -1) continue;
        const styleInfo = STYLE_MASTER[styleId];
        if (!styleInfo) continue;
        if (!supportPassesFilters({
            weaponType: styleInfo['WeaponType'],
            breakdown: row.breakdown,
            filterWeapon: FILTER_WEAPON,
            filterAttr: FILTER_ATTR,
            filterRange: FILTER_RANGE,
        })) continue;
        addCard(styleInfo, row.upRate, row.breakdown ?? null, row.damage ?? null);
    }
}

function getEnemyConfig() {
    var resist = {};
    $(".E_RESIST").each(function () {
        resist[$(this).attr("data-attr")] = Number($(this).val()) || 0;
    });
    return {
        count: Math.max(1, Number($("#E_COUNT").val()) || 1),
        vit: Number($("#E_VIT").val()) || 1000,
        mnd: Number($("#E_MND").val()) || 1000,
        resist: resist,
    };
}

let _enemyDebounce = null;
$(document).on('input change', '#E_COUNT,#E_VIT,#E_MND,.E_RESIST', function () {
    clearTimeout(_enemyDebounce);
    _enemyDebounce = setTimeout(recalcRanking, 300);
});


const ICON_LIST_SM = {
    "剣": "icon_ken_sm", "大剣": "icon_dken_sm", "斧": "icon_ono_sm",
    "小剣": "icon_sken_sm", "槍": "icon_yari_sm", "弓": "icon_yumi_sm",
    "棍棒": "icon_kon_sm", "体術": "icon_tai_sm", "銃": "icon_ju_sm", "杖": "icon_tsue_sm",
    "斬": "icon_zan", "突": "icon_totsu", "打": "icon_da",
    "熱": "icon_netsu", "冷": "icon_rei", "雷": "icon_rai",
    "陰": "icon_in", "陽": "icon_yo",
};
let MY_FLAG = false;
let MY_STYLE = [];
function _initial() {
    intialMyStyle();
}
function _noLoginInitial() {
}

function intialMyStyle(){
    readStyleCheckData(UID, function (result) {
        if (result !== null) {
            sslist = (result['SS'] !== undefined) ? result['SS'] : [];
            slist = (result['S'] !== undefined) ? result['S'] : [];
            alist = (result['A'] !== undefined) ? result['A'] : [];
            MY_STYLE = sslist.concat(slist).concat(alist);
        }
    }, false);    
}


$(document).ready(function ($) {
    for(let i in BUFF_RANKING){
        if(i > 50){
            break;
        }
        const styleInfo = STYLE_MASTER[BUFF_RANKING[i]['id']];
        addCard(styleInfo);
    }
});

function addCard(styleInfo, rate = 0, breakdown = null, damage = null) {
    if(styleInfo == undefined) {
        return;
    }
    $card = $("#TEMPLATE").clone();    
    charInfo = CHAR_MASTER[styleInfo['CharacterId']];
    $card.attr("char-id", charInfo['Id']);
    $card.addClass(`SERIES_${charInfo['Series']}`);
    $card.addClass(`WEAPON_${styleInfo['WeaponType']}`);
    // let nameTmpl = $("#SKILL_TEMPLATE").clone().attr("id","").removeClass("d-none");
    //nameTmpl.find(".SKILL_ICON").addClass(ICON_LIST[skillInfo['BattleType']]+"_sm");
    //nameTmpl.find(".SKILL_NAME").append(`[${useCount}回/${turn}T][${params.join()}(${per}%)][${dispArea}] ${skillInfo['Name']}`);
    //$card.find(".SKILL_AREA").append(nameTmpl);
    // ABILITY_MASTER(全アビ収録)を優先し、無ければ BUFF_ABILITY_MASTER にフォールバック。
    // ABILITY_MASTER の Attr は trigger フィールドを持つが when を持たないため when に正規化する。
    function resolveAbInfo(id) {
        const am = (typeof ABILITY_MASTER !== 'undefined') ? ABILITY_MASTER : null;
        if (am && am[id]) {
            const ab = JSON.parse(JSON.stringify(am[id]));
            for (const attr of ab['Attr'] || []) {
                if (!attr['when'] && attr['trigger']) attr['when'] = attr['trigger'];
            }
            return ab;
        }
        const bam = (typeof BUFF_ABILITY_MASTER !== 'undefined') ? BUFF_ABILITY_MASTER : null;
        return bam && bam[id] ? JSON.parse(JSON.stringify(bam[id])) : undefined;
    }

    let dispAbility = [];
    for(let lv in styleInfo['StyleAbilityIds']) {
        const abId = styleInfo['StyleAbilityIds'][lv];
        const abInfo = resolveAbInfo(abId);
        if(abInfo == undefined) {
            continue
        }
        let categories = filterAbilityCategory(abInfo);
        // spliceするので逆からループ
        for (let i = categories.length - 1; i >= 0; i--) {
            const attr = categories[i];
            if(attr["main"] != "アビリティ付与"){
                continue;
            }
            const addAbId = maskId(filterNumber(attr['size'].split(">")[0]));
            let addAbInfo = resolveAbInfo(addAbId);
            if(!addAbInfo) { categories.splice(i, 1); continue; }
            addAbInfo = JSON.parse(JSON.stringify(addAbInfo));
            const addCategories = filterAbilityCategory(addAbInfo, attr["sub"].includes("味方生存者全体") );

            if(addCategories.length > 0) {
                addAbInfo['Attr'] = addCategories;
                dispAbility.push(addAbInfo);
            } else {
                categories.splice(i, 1);
            }
        }
        if(categories.length > 0) {
            abInfo['Attr'] = categories;
            dispAbility.push(abInfo);
        }
    }
    let dispAbilityUnique = new Map();

    // 各Idの出現回数をカウント
    for (const abInfo of dispAbility) {
        dispAbilityUnique.set(abInfo.Id, (dispAbilityUnique.get(abInfo.Id) || 0) + 1);
    }    
    // 各NameにN回を追加
    for (const idx in dispAbility) {
        const abInfo = JSON.parse(JSON.stringify(dispAbility[idx]));
        if(dispAbilityUnique.get(abInfo.Id) > 2) {
            abInfo.Name += " x" + dispAbilityUnique.get(abInfo.Id);
        }
        dispAbility[idx] = abInfo;
    }
    // 重複を削除
    let seenIds = new Set();
    dispAbility = dispAbility.filter(abInfo => {
        if (seenIds.has(abInfo.Id)) {
            return false; // 重複がある場合削除
        }
        seenIds.add(abInfo.Id);
        return true; // 初回のみ残す
    });

    for(const abInfo of dispAbility) {
        let nameTmpl = $("#AB_TEMPLATE").clone().removeAttr("id").removeClass("d-none");
        nameTmpl.find(".AB_ICON").append(getAbilityIcon(abInfo['Icon'] ?? "4010", "xs"));
        nameTmpl.find(".AB_NAME").append(abInfo['Name']);
        let dispAttrUnique = new Map();
        // 各Idの出現回数をカウント
        for(const idx in abInfo['Attr']) {
            attr = abInfo['Attr'][idx]
            const key = attr.main + attr.sub + attr.size;
            dispAttrUnique.set(key, (dispAttrUnique.get(key) || 0) + 1);
        }
        // 各NameにN回を追加
        for(const idx in abInfo['Attr']) {
            const attr2 = JSON.parse(JSON.stringify(abInfo['Attr'][idx]));
            const key = attr2.main + attr2.sub + attr2.size;
            if(dispAttrUnique.get(key) > 2) {
                attr2.size += " x" + dispAttrUnique.get(key);
            }
            abInfo['Attr'][idx] = attr2;
        }
        // 重複を削除
        let seenIds = new Set();
        abInfo['Attr'] = abInfo['Attr'].filter(attr => {
            if (seenIds.has(attr.main + attr.sub + attr.size)) {
                return false; // 重複がある場合削除
            }
            seenIds.add(attr.main + attr.sub + attr.size);
            return true; // 初回のみ残す
        });

        for(attr of abInfo['Attr']) {
            if(attr == undefined) {
                continue;
            }
            categoryTmpl = nameTmpl.find(".FLOVER_TEMPLATE").clone().removeClass("d-none FLOVER_TEMPLATE").addClass("d-flex");
            const sub = attr['sub'].replace("腕力","腕").replace("体力","体力").replace("素早さ","速").replace("器用さ","器")
            .replace("知力","知").replace("精神","精").replace("魅力","魅").replaceAll("と","");
            const size = attr['size'].replace(attr['sub'],"").replace("秘奥・攻","");
            const when = attr['when'].replace("を装備している場合","装備時");
            categoryTmpl.find(".WHEN").append(`[${when}]`);
            categoryTmpl.find(".MAIN").append(attr['main']);
            categoryTmpl.find(".SUB").append(sub);
            categoryTmpl.find(".SIZE").append(size);
            nameTmpl.find(".ab-flover").append(categoryTmpl);
            // nameTmpl.find(".AB_TARGET").append(paramNames.join());
            // nameTmpl.find(".AB_SIZE").append(filterNumber(attr['size']));
            //FLOVER
        }
        $card.find(".AB_AREA").append(nameTmpl);
    }

    $card.removeAttr("id","").removeClass("d-none");
    let styleIcon = getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], styleInfo['WeaponType'], true);
    $card.find(".ICON").append(styleIcon);
    $card.find(".NAME").append(styleInfo['Name']);
    $card.find(".ANOTHER_NAME").append(styleInfo['AnotherName']);

    // バフ量 値追加
    // アビ+（ダメージ強化）値は API breakdown.damage（計算が実際に適用した値）から描く
    // 選択中技の属性集合（「全」は常に含む）
    const skillAttrs = new Set(['全', ...String(SELECTED_SKILL?.['AttackAttributes'] ?? '').split(/[,+]/).filter(Boolean)]);
    const _attrHit = (key) => skillAttrs.has(key)
        || (key.indexOf('・') !== -1 && key.split('・').some(a => skillAttrs.has(a)));

    let sumValue = 0;
    const abValues = (breakdown && breakdown.damage) ? breakdown.damage : {};
    sumValue += (abValues["全"] ?? 0);
    $card.find(".AB_VALUE").append(`<div class="fuchidori-blue">全:${abValues["全"] ?? 0}</div>`);
    for(const attr in abValues) {
        if(attr =="全"){
            continue;
        }
        let isActive = _attrHit(attr) ? "fuchidori-blue":"";
        if(isActive == ""){
            if(attr.includes("エクストラフォース")){
                let exAttr = attr.replace("エクストラフォース","");
                exAttr += (exAttr == "Weak") ? "攻撃" : "";
                isActive = _attrHit(exAttr) ? "fuchidori-blue":"";
            } else if(attr.includes("・")){
                for(a of attr.split("・")){
                    if(skillAttrs.has(a)){
                        isActive = "fuchidori-blue";
                        break;
                    }
                }
            }
        }
        let attrIcon = attr.replace("攻撃","").replace("時","").replace("エクストラフォース","Ex ");
        if(ICON_LIST_SM[attr]){
            let battleIconPath = getImgPath(`icon/${ICON_LIST_SM[attr]}.png`);
            attrIcon = (`<img src="${battleIconPath}" class="icon_xs">`);    
        }

        let displayValue = abValues[attr];
        if(!attr.includes("エクストラフォース")) {
            if(isActive != ""){
                sumValue += abValues[attr];
            }
        } else {
            displayValue = Math.floor(abValues[attr] * 100);
        }

        $card.find(".AB_VALUE").append(`<div class="${isActive}">${attrIcon}:${displayValue}</div>`);
    }
    $card.find(".SUM_PER").append(sumValue);
    if(rate > 0) {
        const incPct = (rate - 1) * 100;
        let dmgHtml = `与ダメ増加率: <span class="fuchidori-blue">+${incPct.toFixed(1)}%</span>`;
        // 実ダメージ（BE 計算の生値）を併記。再計算せず row.damage をそのまま使う＝計算一致
        if(damage != null && damage > 0) {
            dmgHtml += `<br>実ダメージ: <span class="fuchidori-blue">${Math.round(damage).toLocaleString()}</span>`;
        }
        $card.find(".DAMAGE").html(dmgHtml);
    }
    const debuffs = (breakdown && breakdown.debuff) ? breakdown.debuff : null;
    if(debuffs && Object.keys(debuffs).length > 0) {
        const parts = [];
        for(const k in debuffs){
            const d = debuffs[k];
            const scope = d.target === '単体' ? '(単)' : '(全)';
            parts.push(`${k}-${d.per}%${scope}`);
        }
        $card.find(".DAMAGE").append(`<div class="text-secondary" style="font-size:0.8em;">デバフ: ${parts.join(' / ')}</div>`);
    }
    

    // ステ+（ステータスバフ）は API breakdown.buff（timing→param→%）を畳んで描く
    const buffByParam = {};
    const buffSrc = (breakdown && breakdown.buff) ? breakdown.buff : {};
    for(const tm in buffSrc) {
        for(const p in buffSrc[tm]) {
            buffByParam[p] = (buffByParam[p] ?? 0) + buffSrc[tm][p];
        }
    }
    if(Object.keys(buffByParam).length > 0){
        for(const attr in buffByParam) {
            $card.find(".BUFF_VALUE").append(`${attr}:${buffByParam[attr]}<br>`);
        }
    } else {
        $card.find(".BUFF_TITLE").addClass("d-none");
    }

    $("#RANKING_AREA").append($card.clone());
}

function filterAbilityCategory(abInfo, isPartyAbility = false){
    // target が「味方」系かどうか
    const isAllyTarget = (t) => t && (
        t.includes("味方") || t === "対象" || t.includes("自身以外")
    );
    // target が「敵」系かどうか
    const isEnemyTarget = (t) => t && (
        t.includes("敵") || t.includes("デバフ")
    );
    // target が自身のみかどうか
    const isSelfOnly = (t) => t === "自身";

    let filterAttr = [];
    for(const attr of abInfo['Attr'] || []) {
        const m = attr['main'];
        const t = attr['target'] || '';
        if(attr['sub'] && attr['sub'].includes("耐性")){
            continue;
        }
        // アビリティ付与は常に拾う（付与先で再評価）
        if(m === "アビリティ付与"){
            filterAttr.push(attr);
            continue;
        }
        // ダメージ強化: 常に採用（自身向けも含む）
        //   敵向け（防御弱化・属性弱体）・味方向け・自身向けすべて火力関連と見なす
        if(m === "ダメージ強化"){
            filterAttr.push(attr);
            continue;
        }
        // デバフ・被ダメージ増加: 敵向けのみ
        if(m === "デバフ" || m === "被ダメージ増加"){
            if(isEnemyTarget(t)) { filterAttr.push(attr); continue; }
            continue;
        }
        // バフ: 味方全体/自身以外向け → 採用。自身向けは isPartyAbility 時のみ
        if(m === "バフ"){
            if(!isSelfOnly(t) && isAllyTarget(t)) { filterAttr.push(attr); continue; }
            if(isSelfOnly(t) && isPartyAbility) { filterAttr.push(attr); continue; }
            continue;
        }
        // エクストラフォース系(ダメージ強化のサブカテゴリとして sub に含まれる場合)はダメージ強化で拾う
        // 追加: ダメージ弱化（味方向けダメージ軽減）は除外のまま
    }
    return filterAttr;
}


let FILTER_WEAPON = "";
$(".filterWeapon").click(function(){
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
        FILTER_WEAPON = "";
    } else {
        // ON
        $(".filterWeapon").each(function (){
            $(this).removeClass("filterActive");
        });
        $(this).addClass("filterActive");
        FILTER_WEAPON = $(this).attr("data-weapon");
    }
    filter();
});

let FILTER_ATTR = [];
$(".filterAttr").click(function(){
    FILTER_ATTR = [];
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
    } else {
        // ON
        if($(".filterAttr.filterActive").length >= 2){
            return;
        }
        $(this).addClass("filterActive")
    }
    $(".filterAttr.filterActive").each(function(){
        FILTER_ATTR.push($(this).attr("data-attr"));
    });
    filter();
});

let FILTER_RANGE = [];
$(".filterRange").click(function(){
    FILTER_RANGE = [];
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
    } else {
        // ON
        if($(".filterRange.filterActive").length >= 2){
            //return;
        }
        $(this).addClass("filterActive")
    }
    $(".filterRange.filterActive").each(function(){
        FILTER_RANGE.push($(this).attr("data-href"));
    });
    filter();
});
$(".styleChecker").click(function(){
    if($(this).hasClass("filterActive")){
        // OFF
        $(this).removeClass("filterActive")
        $(this).find(".fButton").html("ON");
        MY_FLAG = false;
    } else {
        // ON
        $(this).addClass("filterActive")
        $(this).find(".fButton").html("OFF");
        MY_FLAG = true;
    }
    filter();
});


let FILTER = [];
function filter() { renderRanking(); }

