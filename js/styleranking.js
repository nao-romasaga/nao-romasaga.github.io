var NOW_UID = getMyId();
$("#TOTAL_STYLE").html(Object.keys(STYLE_MASTER).length);


$("#VOTE_AREA").slideUp();
var hanyoText = "周回、ボス戦、ツヴァイク、R杯など様々なシーンに対応可能かを評価したランキングです";
var onlyText= "他のスタイルでは代用が聞かない物を持っているかを評価したランキングです<br>例：全体即死の王者の剣、トーマスの高知力デルタペトラ、バルテルミーの強襲アバドンハンズ";
var totalText = "汎用性、周回性、唯一性の総合評価値のランキングです";
var giwakuText = "評価は高いのですが、投票数が少ないため信憑性が低いスタイルです。<br>ぜひ皆さんの投票で信憑性をあげていただけると助かります◝(*º꒳​º)◜";

$hanyoInfo = $("#RANK_TEMPLATE").clone().removeAttr("id");
$hanyoInfo.find(".TITLE").html("汎用性ランキング");
$hanyoInfo.find("#V1_RANK").attr("id","V2_RANK");
$hanyoInfo.find(".INFO").html(hanyoText);

$onlyInfo = $("#RANK_TEMPLATE").clone().removeAttr("id");
$onlyInfo.find(".TITLE").html("唯一性ランキング");
$onlyInfo.find("#V1_RANK").attr("id","V3_RANK");
$onlyInfo.find(".INFO").html(onlyText);

$totalInfo = $("#RANK_TEMPLATE").clone().removeAttr("id");
$totalInfo.find(".TITLE").html("総合ランキング");
$totalInfo.find("#V1_RANK").attr("id","ALL_RANK");
$totalInfo.find(".INFO").html(totalText);

$giwakuInfo = $("#RANK_TEMPLATE").clone().removeAttr("id");
$giwakuInfo.find(".TITLE").html("もう少しデータ欲しいランキング");
$giwakuInfo.find("#V1_RANK").attr("id","G_RANK");
$giwakuInfo.find(".INFO").html(giwakuText);
$giwakuInfo.find(".DISP_CHANGE").parent().remove();
$giwakuInfo.find(".RANK").remove();
$giwakuInfo.find("#G_RANK").html(`<div class="col-12 ALL"></div>`);

$gachaInfo = $("#RANK_TEMPLATE").clone().removeAttr("id");
$gachaInfo.find(".TITLE").html("開催中ガチャ ピックアップスタイル");
$gachaInfo.find("#V1_RANK").attr("id","GACHA_RANK");
$gachaInfo.find(".INFO").remove();
$gachaInfo.find(".DISP_CHANGE").parent().remove();
$gachaInfo.find(".RANK").remove();
$gachaInfo.find("#GACHA_RANK").html(`<div class="col-12 ALL"></div>`);


// 逆順に
$("#RANK_TEMPLATE").after($onlyInfo);
$("#RANK_TEMPLATE").after($hanyoInfo);
$("#RANK_TEMPLATE").before($giwakuInfo);
$("#RANK_TEMPLATE").before($gachaInfo);
$("#RANK_TEMPLATE").before($totalInfo);

$hanyoInfo.ready(function(){
    $(".ZAN").slideUp();
    $(".DA").slideUp();
    $(".TOTSU").slideUp();
    $(".TSUE").slideUp();
});

$.getJSON(`http://romasagatool.com/api/vote_info.php?uid=${NOW_UID}&c=dispVoteInfo&dispVoteInfo=?`);

// スタイルアイコンクリック
$(document).on('click', '.style', function () {
    for(var type in VOTE_DB_COLUMN){
        changeVoteStar(3, VOTE_DB_COLUMN[type] );
    }

    var styleId = $(this).attr("data-id");
    $("#VOTE_STAR").attr('data-id', styleId);
    uid = (NOW_UID) ? `&uid=${NOW_UID}` : "" ;
    $.getJSON(`https://romasagatool.com/api/vote_style.php?sid=${styleId}${uid}&c=dispVoteRadar&dispVoteRadar=?`);    

    var styleInfo = STYLE_MASTER[styleId];
    $("#VOTE_ICON").html("").append($(this).clone());
    $("#VOTE_NAME").html(styleInfo['Name']);
    $("#VOTE_ANOTHRNAME").html(styleInfo['AnotherName']);
    $("#RANK_HEAD_IMG").attr('src', getImgPath(`style_cutin/${styleId}.png`) );
    $("#VOTE_HREF").attr('href', `https://nao-romasaga.github.io/style.html?s=${styleId}` );
    var v1 = (RANK_RESULT[styleId] != undefined) ? Number(RANK_RESULT[styleId]['v1_avg']) : 0;
    var v2 = (RANK_RESULT[styleId] != undefined) ? Number(RANK_RESULT[styleId]['v2_avg']) : 0;
    var v3 = (RANK_RESULT[styleId] != undefined) ? Number(RANK_RESULT[styleId]['v3_avg']) : 0;
    $("#VOTE_SHUKAI").html((Math.round(v1 * 100) / 100).toFixed(2));
    $("#VOTE_HANYO").html((Math.round(v2 * 100) / 100).toFixed(2));
    $("#VOTE_ONLY").html((Math.round(v3 * 100) / 100).toFixed(2));

    $("#VOTE_AREA").slideDown();
    $('.js-cover').removeClass('active');            
});
// 投票ボタン
$(document).on('click', '#VOTE_STAR', function () {
    var styleId = $("#VOTE_STAR").attr('data-id');
    voteAPI(styleId);
    var speech = SPEECH_DATA[styleId];
    $("#SPEECH").html(speech[Math.floor(Math.random() * Math.floor(3))]);
    $("#SPEECH_ICON").attr('src', getImgPath(`style_icon/${styleId}.png`));
    dotPath = getImgPath(`dot/${STYLE_MASTER[styleId]['DotId']}.png`);
    $("#SPEECH_DOT").attr('style', `background: url(${dotPath}) no-repeat;`);
    
    $("#VOTE_AREA").slideUp();
    $('.js-cover').addClass('active');
    setTimeout(function(){$('.js-cover').removeClass('active')}, 2000);
});
// 投票閉じるボタン
$(document).on('click', '#CLOSE', function () {
    $("#VOTE_AREA").slideUp();
});

// 評価の星クリック時
$(document).on('click', '.vote', function () {
    var val = $(this).attr("data-value");
    var type = $(this).attr("data-type");
    changeVoteStar(val, type);
});
function voteAPI(styleId){
    var param = `uid=${NOW_UID}&sid=${styleId}&v1=${VOTE['shukai']}&v2=${VOTE['hanyo']}&v3=${VOTE['only']}`;
    $.getJSON(`https://romasagatool.com/api/vote_style.php?${param}&c=dispVoteRadar&dispVoteRadar=?`);    
}
function dispVoteRadar(data){
    // 自分が投票してるスタイルじゃないから元に戻す
    for(var type in VOTE_DB_COLUMN){
        val = (data['mydata']['col1'] !== undefined) ? data['mydata'][type] : 3;
        changeVoteStar(val, VOTE_DB_COLUMN[type] );
    }
}

function dispVoteInfo(data){
    var total = data['total'];
    var nealy = data['nearly'];
    var myCnt = Number(data['myvote']['cnt']);

    var myRank = 1;
    var totalVote = 0;
    var totalUser = 0;
    for(row of total){
        userConut = Number(row['user']);
        voteCount = Number(row['cnt']);
        totalVote += voteCount;
        totalUser += userConut;
        if(voteCount >= myCnt){
            myRank += userConut;
        }
    }
    $("#TOTAL_VOTE").html(totalVote.toLocaleString());
    $("#TOTAL_USER").html(totalUser.toLocaleString());
    $("#YOUR_VOTE").html(myCnt.toLocaleString());

    for(row of nealy){
        $tr = $("#VOTE_ROW").clone().removeAttr('id').removeClass("d-none");
        styleId = row['sid'];
        styleInfo = STYLE_MASTER[styleId];
        let styleIcon = getStyleIcon(styleInfo['Rarity'], styleId, CHAR_MASTER[styleInfo['CharacterId']], true, true);
        $tr.find(".ICON").append(styleIcon);
        $tr.find(".NAME").html(styleInfo['Name'] +"<br>" + styleInfo['AnotherName']);
        $tr.find(".LINK").attr('href', `https://nao-romasaga.github.io/style.html?s=${styleId}`);
        $tr.find(".GACHA").html((styleInfo['gacha'].split("/"))[0]);
        $tr.find(".V1").html(row['col1']);
        $tr.find(".V2").html(row['col2']);
        $tr.find(".V3").html(row['col3']);
        $tr.find(".STIME").html(row['updated_at'].substr(5,11));
        $tr.find(".LTIME").html(row['updated_at']);
        $("#VOTE_ROW").before($tr);
    }

}

var singleRanking, multiRanking, v1Ranking, v2Ranking, v3Ranking,vAllRanking, cntRanking, giwakuRanking;
var RANK_RESULT = {};

$.getJSON(`https://romasagatool.com/api/select_vote_style.php?c=dispDamageRatio&dispDamageRatio=?`)
function dispDamageRatio(result){
    for(res of result['calc']){
        RANK_RESULT[res['sid']] = res;
    }
    $("#VOTE_STYLE").html(Object.keys(RANK_RESULT).length);

    setData(result['calc']);
    //createCard("#SINGLE_RANK", singleRanking, "singleHensa");
    //createCard("#MULTI_RANK", multiRanking, "multiHensa");
    createCard("#V1_RANK", v1Ranking, "v1_avg");
    createCard("#V2_RANK", v2Ranking, "v2_avg");
    createCard("#V3_RANK", v3Ranking, "v3_avg");
    createCard("#ALL_RANK", vAllRanking, "vAll_avg");
    createCard("#G_RANK", giwakuRanking, "vAll_avg");
    
    var gachaStyle = {};
    for(gacha of OPEN_GACHA){
        gachaStyle[gacha] = [];
    }
    for(styleId in STYLE_MASTER){
        var styleInfo = STYLE_MASTER[styleId];
        for(gacha of OPEN_GACHA){
            if(styleInfo['gacha'].indexOf(gacha) > -1) {
                gachaStyle[gacha].push(styleInfo);
            }
        }
    }
    var gachaSort = [];
    for(gacha in gachaStyle){
        for(styleInfo of gachaStyle[gacha]){
            result = (RANK_RESULT[styleInfo['Id']] !== undefined) ? RANK_RESULT[styleInfo['Id']] : {"sid": styleInfo['Id']} ; 
            gachaSort.push(result);
        }
    }
    createCard("#GACHA_RANK", gachaSort, "vAll_avg");
    
    //createCard("#CNT_RANK", cntRanking, "cnt");
}
$(".DISP_CHANGE").click(function(){
    // ボタン切り替え
    $target = $(this).parents(".PARENT");
    $target.find(".DISP_CHANGE").removeClass("icon_btn_positive").addClass("icon_btn_negative");
    $(this).addClass("icon_btn_positive").removeClass("icon_btn_negative");
    $target.find(".RANK").slideUp();
    $target.find(".ZAN").slideUp();
    $target.find(".DA").slideUp();
    $target.find(".TOTSU").slideUp();
    $target.find(".TSUE").slideUp();

    var id = $(this).attr("data-id");
    if(id == "ATTR"){
        $target.find(".ZAN").slideDown();
        $target.find(".DA").slideDown();
        $target.find(".TOTSU").slideDown();
        $target.find(".TSUE").slideDown();
    } else {
        $target.find("." + id).slideDown();
    }
});

function createCard(div, rankingList, target){
    var LV = {
        "vAll_avg": [4.75, 4.5, 4.25],
        "v1_avg": [4.8, 4.6, 4.4],
        "v2_avg": [4.75, 4.5, 4.25],
        "v3_avg": [4.8, 4.7, 4.6],
    }
    //$(div).html("");
    limit = 12;
    for(d of rankingList) {
        $card = $("#TEMPLATE").clone();
        $card.attr("id","").removeClass("d-none").addClass("d-inline-block");
        styleInfo = STYLE_MASTER[d['sid']];
        charInfo = CHAR_MASTER[styleInfo['CharacterId']];
        weaponAttr = (charInfo['WeaponType'] == "杖") ? "杖" : WEAPON_ATTR[charInfo['WeaponType']];
        val = (d[target] != undefined) ? (Math.round(Number(d[target]) * 100) / 100).toFixed(2) : 0;
        if(val >= LV[target][0]) {
            star = "LV3"
        } else if(val >= LV[target][1]) {
            star = "LV2"
        } else if(val >= LV[target][2]) {
            star = "LV1"
        } else {
            star = "";
        }
        var fontClass = (styleInfo['gacha'].indexOf("プラチナガチャ") > -1) ? "fuchidori-yellow": "fuchidori-blue";
        let styleIcon = getStyleIcon(styleInfo['Rarity'], d['sid'], charInfo['WeaponType'], true, true);
        $card.find(".ICON").append(styleIcon);
        $card.find(".NAME").append(styleInfo['Name']);
        $card.find(".ANOTHER").append(styleInfo['AnotherName']);
        $card.find(".VALUE").html(val);
        $card.find(".VALUE").addClass(fontClass);                
        $card.find(".CNT").html((d['cnt'] != undefined) ? d['cnt'] : 0);

        if(div == "#G_RANK" || div == "#GACHA_RANK" ) {
            $(div).find(`.ALL`).append($card.clone());
            continue;
        }

        if($(div).find(`.斬`).find(".style").length >= limit &&
            $(div).find(`.打`).find(".style").length >= limit &&
            $(div).find(`.突`).find(".style").length >= limit &&
            $(div).find(`.杖`).find(".style").length >= limit){
            break;
        }
        if($(div).find(`.${weaponAttr}`).find(".style").length >= limit){
            //console.log(weaponAttr, $(div).find(`.${weaponAttr}`).find(".style").length , "skip");
            continue;
        }
        $(div).find(`.${weaponAttr}`).append($card.clone());

        if(star == "" || $(div).find(`.${star}`).find(".style").length > limit){
            continue;
        }
        $(div).find(`.${star}`).append($card.clone());
    }
}


function setData(data){
    for(d of data){
        d['singleHensa'] = STYLE_DAMAGE_HENSA[d['sid']]['singleHensa'] / 100;
        d['multiHensa'] = STYLE_DAMAGE_HENSA[d['sid']]['multiHensa'] / 100;
        d['vAll_avg'] = (Number(d['v1']) +Number(d['v2']) + Number(d['v3'])) / 3 / d['cnt'];
        d['cnt'] = Number(d['cnt']);
    }
    data.sort(function(a,b){
        if(a.singleHensa < b.singleHensa) return 1;
        if(a.singleHensa > b.singleHensa) return -1;
        return 0;
    });
    singleRanking = data.slice(0, 10);
    data.sort(function(a,b){
        if(a.multiHensa < b.multiHensa) return 1;
        if(a.multiHensa > b.multiHensa) return -1;
        return 0;
    });
    multiRanking = data.slice(0, 10);

    data.sort(function(a,b){
        if(a.v1_avg < b.v1_avg) return 1;
        if(a.v1_avg > b.v1_avg) return -1;
        return 0;
    });
    v1Ranking = data.slice(0, 200);
    data.sort(function(a,b){
        if(a.v2_avg < b.v2_avg) return 1;
        if(a.v2_avg > b.v2_avg) return -1;
        return 0;
    });
    v2Ranking = data.slice(0, 200);
    data.sort(function(a,b){
        if(a.v3_avg < b.v3_avg) return 1;
        if(a.v3_avg > b.v3_avg) return -1;
        return 0;
    });
    v3Ranking = data.slice(0, 200);

    data.sort(function(a,b){
        if(a.vAll_avg < b.vAll_avg) return 1;
        if(a.vAll_avg > b.vAll_avg) return -1;
        return 0;
    });
    vAllRanking = data.slice(0, 200);

    giwaku = [];
    for(res of data){
        if(res['vAll_avg'] > 4 && res['cnt'] < 50){
            giwaku.push(res);
        }
    }

    giwaku.sort(function(a,b){
        if(a.vAll_avg < b.vAll_avg) return 1;
        if(a.vAll_avg > b.vAll_avg) return -1;
        return 0;
    });
    giwakuRanking = giwaku.slice(0, 200);

}