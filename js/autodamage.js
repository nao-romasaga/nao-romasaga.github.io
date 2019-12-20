var ENEMY_RESIST = [
    [0,0,0,0,0,0,0,0,"なし","なし"],
    [-45,0,0,30,30,30,30,-45,"人間","キラーマシン"],
    [0,0,30,-45,-45,-45,0,0,"巨人 男性","オーガロード"],
    [0,30,0,0,0,0,0,0,"獣","ヌエ"],
    [0,0,-35,0,50,0,0,0,"竜 浮遊","ワンダーラスト"],
    [0,30,0,-55,30,0,0,0,"植物","ラッフルツリー"],
    [0,-35,0,0,-35,0,50,0,"虫 浮遊","アレフ"],
    [30,0,-55,0,-45,-45,0,0,"水棲","首長竜"],
    [0,-35,0,0,-35,-35,0,0,"魚","死海魚"],
    [30,0,0,30,-55,-45,0,0,"爬虫類","ザッハーク"],
    [0,0,0,0,-45,-45,0,0,"両生類 カエル","カエル術士"],
    [0,0,0,50,50,50,-45,50,"悪魔","戦鬼"],
    [0,0,-35,-35,50,0,-55,50,"巨人 不死","ポイゾンギアン"],
    [0,-35,30,-45,50,0,-55,50,"竜 不死 骨","チャリオット"],
    [-45,0,0,30,30,30,30,30,"火精,土精,岩石","マグマ"],
    [30,50,30,-45,-45,-45,-45,-45,"虫","ゴールデンバウム"],
];

$(".opacity-char-back").slideUp();
$("#_icon_ken").slideDown();
$("#CHAR_HEADER").hide();
$("#STYLE_HEADER").hide();
$("#howtobody").slideUp();
$("#jokenbody").slideUp();

$("#howtohead").click(function(){
    gtag('event', "clickHowto", {'event_category': "autodamage", 'event_label': "open", 'value': 1});
    $("#howtobody").slideToggle()
});
$("#jokenhead").click(function(){
    gtag('event', "clickJoken", {'event_category': "autodamage", 'event_label': "open", 'value': 1});
    $("#jokenbody").slideToggle()
});

var limOrder = "";
var rangeOrder = "";
var limlabel = "";
var ranglabel = "";

var cid = "";
var sid = "";
var dup = false;
var lastParam = {};

$(".optionButton").click(function () {
    $(this).toggleClass("icon_btn_off");
    $(this).toggleClass("icon_btn_on");
    var target = $(this).attr("data-name");
    var onoff = $(this).attr("data-on");
    gtag('event', "clickLimitAbility", {'event_category': "autodamage", 'event_label': target, 'value': onoff});
    if(onoff == 0) {
        // オン
        if(target === "lim"){
            limOrder = "lim";
            limlabel = "勇健発動 ";
        } else {
            rangeOrder = "true";
            ranglabel = "範囲攻撃ON";
        }
        $(this).attr("data-on", 1);
    }else {
        // オフ
        if(target === "lim"){
            limOrder = "";
            limlabel = "";
        } else {
            rangeOrder = "";
            ranglabel = "";
        }
        $(this).attr("data-on", 0);
    }
    $("#LIMIT_LABEL").text(limlabel+ranglabel);
    console.log("limit", lastParam);
    callAPI(lastParam);
});

$(".enemyfilterList").click(function () {
    $("#styleChoice").html("");
    $("#STYLE_HEADER").hide();

    //$(".weaponList").slideUp();

    let value = $(this).attr("href").substr(7);
    let label = $(this).attr("data-label");
    let isActive = $(this).parent().hasClass("filterActive");
    $(".enemyfilterList").each(function () {
        $(this).parent().removeClass("filterActive");
    });
    gtag('event', "clickEnemy", {'event_category': "autodamage", 'event_label': label, 'value': 1});
    if (isActive) {
        setResitCrit(ENEMY_RESIST[0]);
        $("#ENEMY").html(``);
        //lastParam['dup'] = true;
        delete lastParam['enemy'];
        lastParam['limit'] = 1000;
        callAPI(lastParam);
    } else {
        setResitCrit(ENEMY_RESIST[value]);
        var x = (label !== "無し") ? `VS ${label}の` : "";
        $("#ENEMY").html(x);
        $(this).parent().toggleClass("filterActive");

        //lastParam['dup'] = true;
        lastParam['enemy'] = value;
        lastParam['limit'] = 1000;
        callAPI(lastParam);
    }
});
function setResitCrit(list){
    setTaisei($("#resist_zan"), list[0]);
    setTaisei($("#resist_da"), list[1]);
    setTaisei($("#resist_totsu"), list[2]);
    setTaisei($("#resist_netsu"), list[3]);
    setTaisei($("#resist_rei"), list[4]);
    setTaisei($("#resist_rai"), list[5]);
    setTaisei($("#resist_yo"), list[6]);
    setTaisei($("#resist_in"), list[7]);
    $("#enemy_crit").html(list[8]);
    $("#enemy_name").html(list[9]);
}


$(".filterList").click(function () {
    $("#styleChoice").html("");
    $("#STYLE_HEADER").hide();
    
    $(".weaponList").slideUp();

    let value = $(this).attr("href").substr(1);
    let datatype = $(this).attr("data-type");
    lastParam['dup'] = true;
    delete lastParam['cid'];
    delete lastParam['sid'];
    delete lastParam['btype'];
    delete lastParam['atype'];

    gtag('event', "clickFilter", {'event_category': "autodamage", 'event_label': value, 'value': 1});
    if ($(this).parent().hasClass("filterActive")) {
        //$("#TARGET").html(`全スタイル`);
        $("#CHAR_HEADER").hide();
        // 解除
        $(".filterList").each(function () {
            $(this).parent().removeClass("filterActive");
        });
        $("#TARGET").html(`全スタイル`);
        callAPI(lastParam);
    } else {
        if(datatype === "WeaponTypeFilter") {
            $("#CHAR_HEADER").show();
            // 絞り込み
            //$(".SeriesChoise").addClass("d-none");
            $("#_" + value).removeClass("d-none",0, function(){
                $("#_" + value).slideDown();
            });
            lastParam['btype'] = value.substr(5);
        } else {
            // 属性の場合はキャラは出さない
            $("#CHAR_HEADER").hide();
            lastParam['atype'] = value.substr(5);
        }
        $("#TARGET").html(`<span class="icon_mini ${value}"></span>`);
        $(".filterList").each(function () {
            $(this).parent().removeClass("filterActive");
        });
        $(this).parent().toggleClass("filterActive");
        console.log(lastParam);

        callAPI(lastParam);
    }
});

$(document).on("click",".char",function(){
    let charId = $(this).attr("data-id");
    var charInfo = CHAR_MASTER[charId];
    gtag('event', "clickChar", {'event_category': "autodamage", 'event_label': charInfo['Name'], 'value': 1});
    $("#TARGET").html(charInfo['Name']);
    $("#STYLE_HEADER").show();
    $("#styleChoice").html("");
    for (let styleId of charInfo['Holders']) {
        if(STYLE_MASTER[styleId] === undefined){
            continue;
        }
        let styleInfo = STYLE_MASTER[styleId];
        // スタイルアイコンの追加
        var styleImg = getImgPath(`style_icon/${styleId}.png`);
        let icon = $("<button>").addClass("style")
                .addClass(getStyleIconClass(styleInfo['Rarity']))
                .attr("style", `background:url(${styleImg}) no-repeat;`)
                .attr("data-id", styleId);
        let background = $("<span>")
                .addClass(getStyleIconBgClass(styleInfo['Rarity']))
                .append(icon);
        $("#styleChoice").append(background);
    }
    lastParam['dup'] = false;
    lastParam['cid'] = charId;
    callAPI(lastParam);
});

$(document).on("click",".style",function(){
    let styleId = $(this).attr("data-id");
    var styleInfo = STYLE_MASTER[styleId];
    gtag('event', "clickStyle", {'event_category': "autodamage", 'event_label': styleInfo['Name']+styleInfo['AnotherName'], 'value': 1});
    $("#TARGET").html(styleInfo['Name']+" <br class=\"hidden spBlock\">"+styleInfo['AnotherName']+"<br class=\"hidden pcBlock\">");
    lastParam['dup'] = false;
    lastParam['sid'] = styleId;
    callAPI(lastParam);
});
var dupDelFlg = true;

$(document).ready(function ($) {
    dispChar(CHAR_MASTER);
});
callAPI({'dup':true});

function callAPI(param){
    lastParam = param;
    //console.log(lastParam);
    dupDelFlg = param['dup'];
    var cid = (param['cid'] !== undefined) ? `&cid=${param['cid']}` : "";
    var sid = (param['sid'] !== undefined) ? `&sid=${param['sid']}` : "";
    var enemy = (param['enemy'] !== undefined) ? `&enemy=${param['enemy']}` : "";
    var btype = (param['btype'] !== undefined) ? `&btype=${param['btype']}` : "";
    var atype = (param['atype'] !== undefined) ? `&atype=${param['atype']}` : "";
    var limit = (cid !== "") ? 30 : 1000;
    var order = (limOrder !== "") ? `&order=${limOrder}` : "";
    var range = (rangeOrder !== "") ? `&range=${rangeOrder}` : "";
    var dup = (dupDelFlg) ? "&dup=true" : "";
//                $("#RANK_AREA").slideUp(200,function(){
        $("#RANK_AREA").html("");
        $.getJSON(`https://romasagatool.com/api/auto_ranking2.php?limit=${limit}${cid}${sid}${enemy}${btype}${atype}${order}${range}${dup}&callback=?`);
        //console.log(`?limit=${limit}${cid}${sid}${enemy}${btype}${order}${range}${dup}`);
//                    $("#RANK_AREA").slideDown(200);
//                });
}

function callback(data){
    var styleList = [];
    for(var rank in data) {
        var rec = data[rank];
        if($.inArray(rec['sid'], styleList) > -1){
            continue;
        }
        if(dupDelFlg){
            //styleList.push(rec['sid']);
        }

        var skills = rec['pattern'].split("/");
        var skillList = [];
        var skillMap = {};
        //console.log(STYLE_MASTER[rec['sid']]);
        var turnAction = rec['turnaction'].split("/");
        for(var tmp of skills) {
            var tmpdata = tmp.split(":");
            var skillId = tmpdata[0];
            var bp = tmpdata[1];
            var damage = (rangeOrder == "") ? tmpdata[2] : tmpdata[5];
            var limDamage = (rangeOrder == "") ? tmpdata[3] : tmpdata[6];
            var useCount = tmpdata[4];
            var name = (SKILL_MASTER[skillId] !== undefined) ? SKILL_MASTER[skillId]['Name'] : "通常攻撃";
            skillList.push(skillId);
            skillMap[skillId] = {};
            skillMap[skillId]['id'] = skillId;
            skillMap[skillId]['name'] = name;
            skillMap[skillId]['damage'] = (limOrder == "") ? damage : limDamage;
            skillMap[skillId]['bp'] = bp;
            skillMap[skillId]['count'] = useCount;
        }
        var key = (limOrder == "") ? 'anydamage' : 'limdamage';
        key += (rangeOrder != "") ? 'Range' : '';
        var totalDamage = rec[key];
        var skillDiv = "";

        var mySkill = [skillMap['normal']];
        var dispSkill = [skillMap['normal']];
        delete skillMap['normal'];
        for(var skillId of STYLE_MASTER[rec['sid']]['SkillIds']){
            mySkill.push(skillId);
            dispSkill.push(skillMap[skillId]);
            delete skillMap[skillId];
        }
        for(var skillId in skillMap){
            dispSkill.push(skillMap[skillId]);
            delete skillMap[skillId];
        }
        var skillDivSmList = [];
        for(var i in dispSkill){
            // console.log(i, dispSkill);
            // console.log(dispSkill[i]);
            var skillId = dispSkill[i]['id']; 
            var numClass = (dispSkill[i]['count'] > 0) ? "fuchidoriWhite" : "fuchidoriRed";
            
            var isKeisho = (mySkill.indexOf(skillId) === -1) ? true : false;
            var kakusei = skillId === "normal" ? 0 : SKILL_MASTER[skillId]['Kakusei'];
            var kakuseid = skillId === "normal" ? 0 : Number(SKILL_MASTER[skillId]['ConsumeBp']) - Number(dispSkill[i]['bp']);
            var topLine = isKeisho ? `style="border-top: 2px ivory solid;"` : "";

            var k = "";
            for(var j = 0; j<kakusei; j++){
                k+= (j >= kakuseid) ? "◇" : "◆";
            }
            var bpDisp = skillId === "normal" ? "" : `BP:${dispSkill[i]['bp']} (${k}) `;
            skillDiv += `<div class="col-2 text-center d-none d-lg-block text-nowrap">${dispSkill[i]['name']}<br>`+
                `<div class="${numClass} damageNumber">${Number(dispSkill[i]['damage']).toLocaleString() }</div>`+
                `${bpDisp}${dispSkill[i]['count']}回`+
                `</div>`;
            skillDivSmList.push(`<tr ${topLine} ><td>${dispSkill[i]['name']}(${dispSkill[i]['bp']})</td><td><span class="${numClass} damageNumber">${Number(dispSkill[i]['damage']).toLocaleString() } </span></td><td>${k}</td><td class="text-nowrap">${dispSkill[i]['count']}回</td></tr>`);
        }
        var skillDvSm = `<div class="col-12 d-lg-none"><table class="width-100">` +skillDivSmList.join("")+"</table></div>";

        var turnSkill = [];
        for(var tmp of turnAction){
            var x = tmp.split(":");
            var name = x[1] === "normal" ? "通常攻撃" : SKILL_MASTER[x[1]]['Name'];
            name = name.length > 4 ? name.substr(0,4)+"…" : name;
            turnSkill.push(`${name}(${x[2]})`);
        }
        var dotImg = getImgPath(`dot/${STYLE_MASTER[rec['sid']]['DotId']}.png`);
        var cutImg = getImgPath(`style_cutin/${rec['sid']}.png`);
        var allImg = getImgPath(`style_all/${rec['sid']}.png`);
        $rank = $(`
        <div class="col-12 col-md-12 style-skill-list" style="padding: 0px 5px;">
            <div class="row no-gutters" onclick="$(&quot;.flvID68ffe21&quot;).slideToggle();">
            <div class="char dot_mid dot char-hashiri" style="top:5px; position: absolute; background: url(${dotImg});"></div>
            <div class="d-none d-md-block" style="width:100%;height:100%;position: absolute;background: url(${cutImg}) no-repeat; background-size: contain; background-position: center; opacity: 0.3;"></div>
            <div class="d-md-none" style="width:100%;height:100%;position: absolute;background: url(${allImg}) no-repeat; background-size: contain; background-position: center; opacity: 0.3;"></div>
                <div class="col-md-3 col-lg-2  d-none d-sm-block text-nowrap">
                    <div style="padding-left:50px;">${STYLE_MASTER[rec['sid']]['Name']}<br><span class="fuchidoriJewel damageNumber" style="font-size:25px">${totalDamage}</span></div>
                    <div>${STYLE_MASTER[rec['sid']]['AnotherName']}</div>
                </div>
                <div class="col-9 d-none d-md-block d-lg-none">${turnSkill.join(" ⇨ ")}</div>
                ${skillDiv}
                <div class="col-12 d-sm-none text-nowrap">
                    <div style="padding-left:50px;">${STYLE_MASTER[rec['sid']]['Name']} ${STYLE_MASTER[rec['sid']]['AnotherName']}<br><span class="fuchidoriJewel damageNumber" style="font-size:25px">${totalDamage}</span></div>
                </div>
                ${skillDvSm}
                <div class="col-12 d-none d-lg-block" style="border-top: 2px solid ivory;">${turnSkill.join(" ⇨ ")}</div>
            </div>
        </div>

        `);
        $("#RANK_AREA").append($rank);
    }
};
