var device = getDevice();

const ICON_LIST = {
    "剣": "icon_ken", "大剣": "icon_dken", "斧": "icon_ono",
    "小剣": "icon_sken", "槍": "icon_yari", "弓": "icon_yumi",
    "棍棒": "icon_kon", "体術": "icon_tai", "銃": "icon_ju", "杖": "icon_tsue",
    "斬": "icon_zan", "突": "icon_totsu", "打": "icon_da",
    "熱": "icon_netsu", "冷": "icon_rei", "雷": "icon_rai",
    "陰": "icon_in", "陽": "icon_yo",
    "火術": "icon_hi", "水術": "icon_mizu", "風術": "icon_kaze",
    "土術": "icon_tsuchi", "光術": "icon_hikari", "闇術": "icon_yami",
    "スタン": "icon_stan", "マヒ": "icon_mahi", "気絶": "icon_kizetsu", "即死": "icon_kizetsu", "毒": "icon_doku", "石化": "icon_sekika",
    "魅了": "icon_miryo", "眠り": "icon_zzz", "混乱": "icon_konran", "狂戦士": "icon_kyosenshi", "暗闇": "icon_kurayami",
    "B": "icon_b", "A": "icon_a", "S": "icon_s", "SS": "icon_ss",
    "腕力上昇": "icon_buff_str", "体力上昇": "icon_buff_vit", "器用さ上昇": "icon_buff_dex", "素早さ上昇": "icon_buff_agi",
    "知力上昇": "icon_buff_int", "精神上昇": "icon_buff_mnd", "愛上昇": "icon_buff_ai", "魅力上昇": "icon_buff_mi",
    "腕力低下": "icon_debuff_str", "体力低下": "icon_debuff_vit", "器用さ低下": "icon_debuff_dex", "素早さ低下": "icon_debuff_agi",
    "知力低下": "icon_debuff_int", "精神低下": "icon_debuff_mnd", "愛低下": "icon_debuff_ai", "魅力低下": "icon_debuff_mi"
};
const WEPON_ATTR = {
    "剣": "斬", "大剣": "斬", "斧": "斬",
    "小剣": "突", "槍": "突", "弓": "突",
    "棍棒": "打", "体術": "打", "銃": "打", "杖": "打"
};
const AREA_SHORT = {
    "敵単体": "単", "敵全体": "全", "敵縦一列": "縦", "敵横一列": "横", "味方単体": "味単", "自身": "自"
};
const PARAM_KEY = ["STR", "VIT", "DEX", "AGI", "INT", "MND", "AI", "MI"];
const PARAM_NAME = ['腕力', '体力', '器用さ', '素早さ', '知力', '精神', '愛', '魅力'];

function masterLevel(lv) {
    var skill = Math.ceil((lv - 1) / 2) * 0.005;
    return Number(skill);
}

function overdrive(lv) {
    var od = Math.ceil((lv - 2) / 2) * 0.005;
    return Number(od);
}


function addOption(list, target) {
    $.map(list, function (name, value) {
        $option = $('<option>', {value: name, text: value});
        $('#' + target).append($option);
    });
}
function culcSkillDamage(iryoku, rank) {
    var v = Number(iryoku);
    return v + (v - 5) * (1 + rank / 100);
}

function showimage(path, id, size) {
    $("#" + id).css("background", "url(https://nao-romasaga.github.io/img/" + path + ") no-repeat");
    if (size !== undefined) {
        $("#" + id).css("background-size", size);
    }
}

// 正規表現でセパレート
function number_format(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function arrayAvg(arr) {
    var sum = 0;
    arr.forEach(function (elm) {
        sum += elm;
    });
    return sum / arr.length;
}

function insertCommonComponent() {
    var newIcon = "<img src='./img/icon/icon_new.gif'>";
    var nav = "";
    nav += '<nav class="navbar navbar-expand-lg navbar-light bg-light">';
    nav += '  <span class="char-aruku dot dot_mid dot_cat"></span>';
    nav += '  <a class="navbar-brand" href="./index.html">ロマサガRS 便利ツール</a>';
    nav += '  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">';
    nav += '    <span class="navbar-toggler-icon"></span>';
    nav += '  </button>';
    nav += '  <div class="collapse navbar-collapse" id="navbarSupportedContent">';
    nav += '    <ul class="navbar-nav mr-auto small">';
    nav += '      <li class="nav-item " id="headAuto">';
    nav += '        <a class="nav-link" href="./auto.html">全力AUTO<br class="hidden pcBlock">シミュレーター</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headSkill">';
    nav += '        <a class="nav-link" href="./skill.html">技・術<br class="hidden pcBlock">検索</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headAbility">';
    nav += '        <a class="nav-link" href="./ability.html">アビリティ<br class="hidden pcBlock">検索</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headStyle">';
    nav += '        <a class="nav-link" href="./style.html">キャラ+<br class="hidden pcBlock">スタイル詳細</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headParty">';
    nav += '        <a class="nav-link" href="./party.html">ステータス<br class="hidden pcBlock">上限チェック</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headDamage">';
    nav += '        <a class="nav-link" href="./damage.html">ダメージ<br class="hidden pcBlock">計算</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headStyleCheck">';
    nav += '        <a class="nav-link" href="./stylecheck.html">スタイル所持<br class="hidden pcBlock">チェッカー</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headOurStyle">';
    nav += '        <a class="nav-link" href="./ourstyle.html">みんなの<br class="hidden pcBlock">スタイル</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headDojo">';
    nav += '        <a class="nav-link" href="./dojo.html">特訓<br class="hidden pcBlock">タイマー</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headRenkei">';
    nav += '        <a class="nav-link" href="./renkei.html">連携<br class="hidden pcBlock">ジェネレーター '+newIcon+'</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headSite">';
    nav += '        <a class="nav-link" href="./site.html">利用規約・<br class="hidden pcBlock">免責事項</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headKifu">';
    nav += '        <a class="nav-link" href="./kifu.html">寄付について</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headConvert">';
    nav += '        <a class="nav-link" href="./convert.html">データ移行 '+newIcon+'</a>';
    nav += '      </li>';
    //nav += '      <li class="nav-item">';
    //nav += '        <a class="nav-link disabled" href="#">スタイル情報(coming soon)</a>';
    //nav += '      </li>';
    nav += '    </ul>';
    nav += '  </div>';
    nav += '</nav>';
    $('body').prepend(nav);
    let title = "お知らせ";
    let word = "<b>データコンバートについて<b><hr>"
            + "5/9に行いましたメンテナンスで御入力頂いておりましたユーザ情報が一時的に消えております。<br>";
    word += "データの復旧にはデータ移行処理が必要であるため、下記から移行処理(Twitter再ログイン)をお願い致します<br>";
    word += '<a href="./convert.html" class="text-center icon_btn_on" style="width:100%; background-size: 100% 100%;">データ移行</a>'
    word += "ご迷惑をおかけし誠に申し訳ございません(･ω･)💦<br>";
    let info = `<div class="card"><div class="card-header bg-warning">${title}</div><div class="card-body">${word}</div></div>`;
    // Firebase側で暫定的に削除してるのでそっちも修正すること
    $(".title-text").after(info);

    var footer = "";
    footer += '<div class="opacity" style ="position: relative;">';
    footer += 'Powered by <a href="https://twitter.com/nao_romasaga_rs" target="new">nao_romasaga_rs</a><br>';
    footer += 'Special thanks <small>';
    footer += '<a href="https://twitter.com/imonoki" target="new">imonoki</a>, ';
    footer += '<a href="https://twitter.com/chin_ohnck" target="new">ちん</a>, ';
    footer += '<a href="https://twitter.com/HarMakeIt" target="new">春巻</a>, ';
    footer += '<a href="https://twitter.com/PeNN128RS" target="new">こやん</a>, ';
    footer += '<a href="https://twitter.com/ruchigame" target="new">ruchi</a>';
    footer += '</small><br>';
    footer += '© 2019 SQUARE ENIX CO., LTD. All Rights Reserved. Powered by Akatsuki Inc.<br>';
    footer += 'ILLUSTRATION: TOMOMI KOBAYASHI';
    footer += '<span class="char-utau footer-liz dot dot_mid dot_liz"></span>';
    //footer += '<hr>';
    //footer += '利用規約・免責事項<br>';
    //footer += '当サイトは趣味で運営してる非公式のゲーム攻略サイトです。各社の協力や要請の元作成されたものではありません。また情報の内容の一切の保障を致しません。当サイトを利用したことにより発生する全ての損害を、当管理人はいかなる場合でも一切の責任を負いません。<br>';
    //footer += '当サイトの内容、データ、プログラムの複製を固く禁じます。テキスト、画像の著作権は各社に帰属するものであり当サイトからの引用を固く禁じます。<br>';
    footer += '</div>';
    let imgTank = $("<div>").attr("style", "display:none");
    for (let icon in ICON_LIST) {
        let img = $("<span>");
        let url = getImgUrl() + "/icon/" + ICON_LIST[icon] + ".png";
        img.attr("style", "background:url(" + url + ")");
        imgTank.append(img);
    }
    $('body').append(footer);
    $('body').append(imgTank);

    let url = $(location).attr('href');
    if (url.indexOf('debug') === -1) {
    //    $('body').html('<div class="sorry_center"><p class="sorry_cat icon-nemuri"><span class="icon-zzz"></span></p><br>申し訳ございません。<br>現在メンテナンス中です。</div>');
    }
    
    if (url.indexOf('damage.html') != -1) {
        $("#headDamage").addClass("active");
    } else if (url.indexOf('skill.html') != -1) {
        $("#headSkill").addClass("active");
    } else if (url.indexOf('style.html') != -1) {
        $("#headStyle").addClass("active");
    } else if (url.indexOf('ability.html') != -1) {
        $("#headAbility").addClass("active");
    } else if (url.indexOf('auto.html') != -1) {
        $("#headAuto").addClass("active");
    } else if (url.indexOf('site.html') != -1) {
        $("#headSite").addClass("active");
    } else if (url.indexOf('kifu.html') != -1) {
        $("#headKifu").addClass("active");
    } else if (url.indexOf('dojo.html') != -1) {
        $("#headDojo").addClass("active");
    } else if (url.indexOf('party.html') != -1) {
        $("#headParty").addClass("active");
    } else if (url.indexOf('stylecheck.html') != -1) {
        $("#headStyleCheck").addClass("active");
    } else if (url.indexOf('oursytle.html') != -1) {
        $("#headOurStyle").addClass("active");
    } else if (url.indexOf('renkei.html') != -1) {
        $("#headRenkei").addClass("active");
    }


}
$(document).ready(function () {
    $("body").bind("contextmenu", function (e) {
        return false;
    });
    $("body").mousedown(function (e) {
        //return false;
    });
    insertCommonComponent();
});
function getDevice() {
    let width = window.innerWidth;
    var ua = navigator.userAgent;
    if (width < 800 || ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        return 'sp';
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        return 'tab';
    } else {
        return 'other';
    }
}

function getTime(time) {
    var x = {"まれに": "25%", "ごくまれに": "10%", "僅かな確率で": "10%未満", "必ず": "100%"};
    if (time == "") {
        return "";
    } else {
        return x[time];
    }
}

function getStyleBgColor(rare) {
    let colorClass = "bg_ss";
    if (rare === "A") {
        colorClass = "bg_a";
    } else if (rare === "S") {
        colorClass = "bg_s";
    }
    return colorClass;
}
function getStyleIconClass(rare) {
    let colorClass = "style_icon_ss";
    if (rare === "A") {
        colorClass = "style_icon_a";
    } else if (rare === "S") {
        colorClass = "style_icon_s";
    }
    return colorClass;
}
function getStyleIconBgClass(rare) {
    let colorClass = "icon_bg_ss";
    if (rare === "A") {
        colorClass = "icon_bg_a";
    } else if (rare === "S") {
        colorClass = "icon_bg_s";
    }
    return colorClass;
}
function dispChar(master) {
    let idx = {};
    let width = (device === "sp") ? 6 : 12;
    for (let i in master) {
        if (master[i]['Holders'] === undefined) {
            continue;
        }
        let series = master[i]['Series'];
        if (idx[series] >= 24) {
            series = series + "2";
        }

        if (idx[series] === undefined) {
            idx[series] = 0;
        }
        let dotId = master[i]['DotId'];
        let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
        let id = master[i]['Id'];
        let url = getImgUrl('dot/' + pngName + ".png") + " padding-top:35px;";
        let charDot = $("<span>").attr("id", "dot" + pngName)
                .addClass("char-aruku").addClass("char").addClass("char-bottom").addClass('dot_mid').addClass("dot")
                .attr("data-id", id).attr('style', url);
        let seriesBanner = $("<span>").addClass("series-button");
        seriesBanner.append(series);
        charDot.append(seriesBanner);
        $("#" + series).append(charDot);
        if (++idx[series] % width === 0) {
            $("#" + series).append("<br>");
        }
    }
}
function setSlider() {
    let option = {
        buttons: true, //スライダーのページャを表示する
        startSlide: 0, //最初のスライドを指定する
        arrows: true, //左右の矢印ボタンを表示する
        width: '100%', //横幅を設定する
        height: 250, //高さを設定する
        //autoHeight: true, //高さを設定する
        autoplay: false, //自動再生の設定
        loop: true, //スライドをループさせる設定
        visibleSize: '100%', //前後のスライドを表示するかの設定
        forceSize: 'fullWidth' //スライダーの幅をブラウザ幅に設定する
    };
    option['height'] = (device === "sp") ? 310 : 250;
    $('#slider-pro').sliderPro(option);
}

function skillLabel(skillInfo) {
    let skillList = $("<button>").addClass("skill_select").addClass("keishoSkill").attr("data-id", skillInfo['Id']);
    let topDiv = $('<div>').attr('style', 'width:100%; display: inline-flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid;');
    // 武器種別 BattleType、名称、所有数
    let skillName = $("<p>").addClass("text-left skillNameClass").attr('style', 'margin:0;');
    skillName.append(skillInfo['Name']);    // 技名称
    let skillRight = $("<p>").addClass('text-right').addClass('small').attr('style', 'margin:0;');
    skillRight.append("覚醒:" + skillInfo['Kakusei']);
    skillRight.append(" BP:" + skillInfo['ConsumeBp']);
    skillRight.append(" 威力:" + skillInfo['PowerGrade'] + "(" + skillInfo['SkillIryoku'] + ")");
    topDiv.append(skillName).append(skillRight);

    // 属性 AttackAttributes
    let bottomDiv = $('<div>').addClass("iconClass").attr('style', 'display: table-cell; vertical-align: middle; height:30px');
    bottomDiv.append($('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['BattleType']]));
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let img = $('<span>').addClass('icon_sm').addClass(ICON_LIST[value]);
        bottomDiv.append(img);
    });
    if (skillInfo['BadStatus'] != "") {
        let img = $('<span>').addClass('').addClass("icon_sm").addClass(ICON_LIST[skillInfo['BadStatus']]);
        bottomDiv.append(img);
    }
    if (skillInfo['DeBuff'] != "") {
        let img = $('<span>').addClass('icon_sm_buf').addClass(ICON_LIST[skillInfo['DeBuff'] + "低下"]);
        bottomDiv.append(img);
    }
    if (skillInfo['AttackDistance'] !== "近") {
        bottomDiv.append("[" + skillInfo['AttackDistance'] + "]");
    }
    if (skillInfo['AttackArea'] !== "敵単体") {
        bottomDiv.append("[" + AREA_SHORT[skillInfo['AttackArea']] + "]");
    }
    if (skillInfo['Fast']) {
        bottomDiv.append("[ファスト]");
    }
    if (skillInfo['Delay']) {
        bottomDiv.append("[ディレイ]");
    }
    bottomDiv.append(" <span class='holderClass'>所持者(" + skillInfo['Holders'].length + ")</span>");   // 所有者数

    skillList.append(topDiv).append(bottomDiv);

    return skillList;
}
function createInfoButton() {
    return $("<button>")
            .addClass("icon_info_md").attr("data-toggle", "tooltip").attr("data-placement", "top")
            .attr("data-html", 'true');
}

function addBonus(org, per, add) {
    return Number(org) + Math.floor(org * per / 100) + Number(add);
}

function animeReset(selector, animeClass) {
    $(selector).removeClass(animeClass);
    $(selector)[0].offsetWidth = $(selector)[0].offsetWidth;
    $(selector).addClass(animeClass);
}
function setTaisei(target, val) {
    target.removeClass("resist_plus");
    target.removeClass("resist_minus");
    if (val > 0) {
        target.addClass("resist_plus");
    } else if (val < 0) {
        target.addClass("resist_minus");
    }
    target.html(val);
}