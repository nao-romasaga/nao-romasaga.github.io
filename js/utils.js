var device = getDevice();
var LIMIT_BASE = 58;

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
const PARAM_KEY_HP = ["HP"].concat(PARAM_KEY);
const PARAM_NAME = ['腕力', '体力', '器用さ', '素早さ', '知力', '精神', '愛', '魅力'];
const CONST_STYLE_BONUS_VAL = {
    "A": {2: 1, 6: 1, 8: 1, 18: 2, 22: 1, 38: 2, 46: 3, 50: 2},
    "S": {2: 1, 6: 1, 8: 2, 18: 3, 22: 1, 38: 3, 46: 4, 50: 2},
    "SS": {2: 1, 6: 2, 8: 3, 18: 3, 22: 2, 38: 4, 46: 5, 50: 3}
};

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
    console.log("UTIL");

    if (OFUSE_FLG === undefined) {
        OFUSE_FLG = false;
    }

    if (localStorage.uid === "ncTVtjyH4qWQQLnMzpmdux39AoD3") {
        label = CONNECT_DB + " 混雑度";
    } else if (OFUSE_FLG !== undefined && OFUSE_FLG) {
        label = "プレミアムユーザ枠 混雑度";
    } else {
        label = `サイト混雑度(${CONNECT_DB})`;
    }
    var newIcon = "<img src='./img/icon/icon_new.png'>";
    var upIcon = "<img src='./img/icon/icon_up.png'>";
    var newHot = "<img src='./img/icon/icon_hot.png'>";
    var nav = "";
    nav += '<nav class="navbar navbar-expand-lg navbar-light bg-light">';
    nav += '  <span class="char-aruku dot dot_mid dot_cat"></span>';
    nav += `  <div><a class="navbar-brand" href="./index.html">ロマサガRS 便利ツール</a><br><small>${label}:<span id="CONNECT">混雑中...</span><span id="CONNECT_GAME" class="d-none"></span><span id="CONNECT_USER" class="d-none"></span></small></div>`;
    nav += '  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">';
    nav += '    <span class="navbar-toggler-icon"></span>';
    nav += '  </button>';
    nav += '  <div class="collapse navbar-collapse" id="navbarSupportedContent">';
    nav += '    <ul class="navbar-nav mr-auto small">';
    nav += '      <li class="nav-item RequireLoginMenu d-none" id="headAuto">';
    nav += '        <a class="nav-link" href="./home.html"><i class="fas fa-home" style="font-size:30px"></i></a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headCalendar">';
    nav += '        <a class="nav-link" href="./calendar.html">イベント<br class="hidden pcBlock">カレンダー</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headAuto">';
    nav += '        <a class="nav-link" href="./auto.html">全力AUTO<br class="hidden pcBlock">シミュレーター ' + newHot + '</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headOurchar">';
    nav += '        <a class="nav-link" href="./ourchar.html">キャラクター<br class="hidden pcBlock">育成ランキング ' + newHot + '</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headParty">';
    nav += '        <a class="nav-link" href="./party.html">育成パーティ<br class="hidden pcBlock">上限チェック</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headInputchar">';
    nav += '        <a class="nav-link" href="./inputchar.html">まとめて<br class="hidden pcBlock">ステータス登録</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headMydata">';
    nav += '        <a class="nav-link" href="./mydata.html">周回適正<br class="hidden pcBlock">キャラチェック</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headStyleCheck">';
    nav += '        <a class="nav-link" href="./stylecheck.html">スタイル所持<br class="hidden pcBlock">チェッカー</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headOurStyle">';
    nav += '        <a class="nav-link" href="./ourstyle.html">みんなの<br class="hidden pcBlock">スタイル</a>';
    nav += '      </li>';
    nav += '  <li class="nav-item dropdown">';
    nav += '    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    nav += '      ゲームデータ検索';
    nav += '    </a>';
    nav += '    <div class="dropdown-menu bg-white" aria-labelledby="navbarDropdown">';
    nav += '      <a class="dropdown-item" href="./skill.html">技・術検索</a>';
    nav += '      <a class="dropdown-item" href="./ability.html">アビリティ検索</a>';
    nav += '      <a class="dropdown-item" href="./style.html">スタイル検索</a>';
    nav += '      <div class="dropdown-divider"></div>';
    nav += '      <a class="dropdown-item" href="./damage.html">ダメージ計算</a>';
    nav += '      <a class="dropdown-item" href="./dojo.html">特訓タイマー</a>';
    nav += '    </div>';
    nav += '  </li>';
//    nav += '      <li class="nav-item" id="headSkill">';
//    nav += '        <a class="nav-link" href="./skill.html">技・術<br class="hidden pcBlock">検索</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headAbility">';
//    nav += '        <a class="nav-link" href="./ability.html">アビリティ<br class="hidden pcBlock">検索</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headStyle">';
//    nav += '        <a class="nav-link" href="./style.html">キャラ+<br class="hidden pcBlock">スタイル詳細</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headDamage">';
//    nav += '        <a class="nav-link" href="./damage.html">ダメージ<br class="hidden pcBlock">計算</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headDojo">';
//    nav += '        <a class="nav-link" href="./dojo.html">特訓<br class="hidden pcBlock">タイマー</a>';
//    nav += '      </li>';
    nav += '  <li class="nav-item dropdown">';
    nav += '    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    nav += '      おもちゃ';
    nav += '    </a>';
    nav += '    <div class="dropdown-menu bg-white" aria-labelledby="navbarDropdown">';
    nav += '      <a class="dropdown-item" href="./renkei.html">連携ジェネレーター</a>';
    nav += '      <a class="dropdown-item" href="./kururin.html">無限ステアップ</a>';
    nav += '    </div>';
    nav += '  </li>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headSite">';
    nav += '        <a class="nav-link" href="./site.html">利用規約・<br class="hidden pcBlock">免責事項</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headKifu">';
    nav += '        <a class="nav-link" href="./kifu.html">寄付に<br class="hidden pcBlock">ついて</a>';
    nav += '      </li>';
    //nav += '      <li class="nav-item " id="headConvert">';
    //nav += '        <a class="nav-link" href="./convert.html">データ移行</a>';
    //nav += '      </li>';
    //nav += '      <li class="nav-item">';
    //nav += '        <a class="nav-link disabled" href="#">スタイル情報(coming soon)</a>';
    //nav += '      </li>';
    nav += '    </ul>';
    nav += '  </div>';
    nav += '</nav>';
    $('body').prepend(nav);

    let title3 = "6/14 21時ごろからのアクセス急増について";
    let word3 = ""
            + "何やら6/14 21時ごろから非常に多くのアクセスがきており画面が表示しにくいなど発生していますorz<br>"
            + "取り急ぎサーバ増設を行いましたが、しばらく繋ぎにくい状況が続くかもしません<br>"
            + "ユーザの皆様にはご不便をおかけし申し訳ございませんm(_ _)m💦💦<br>"
    let info3 = `<div class="card"><div class="card-header bg-danger" style='color:white'>${title3}</div><div class="card-body">${word3}</div></div>`;

    let title2 = "お知らせ ";
    let word2 = ""
            + "6/14 [更新] <br>"
            + "・<a href=\"./developer.html\" style='font-size:20px;'>開発者からのメッセージ</a> 追加<br>"
            + "<br>"
            + "6/16 [更新] <br>"
            + "・<a href='./skill.html'>技・術検索</a>：検索項目に消費BPを追加。選択した技を消費BP>威力>所持スタイル数で並べて表示<br>"
            + "・<a href='./kifu.html'>寄付について</a>：内容整理、比較内容を追加<br>"
            + "6/15 [更新] <br>"
            + "・<a href='./inputchar.html'>まとめてステータス入力</a>：複数キャラまとめて入力できるようにしました<br>"
            + "6/8 [新規/更新] <br>"
            + "・<a href='./limitdata.html'>スタイル別/素ステ・補正最大値一覧</a>を作成。公開忘れてました💦<br>"
            ;
    let info2 = `<div class="card"><div class="card-header bg-info" style='color:white'>${title2}</div><div class="card-body">${word2}</div></div>`;
    $(".title-text").after(info2);
    $(".title-text").after(info3);

    var footer = "";
    footer += '<div class="opacity" style ="position: relative;">';
    footer += '<span class="kadomaru RequireLoginMenu logout d-none" style="background-color: rgba(42,169,239,1); color:white; padding: 2px 5px; background-size: 340px 40px; width:340px" onclick=""><i class="fab fa-twitter"></i>ログアウト</span><br>'
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
    //footer += '<span class="char-utau footer-liz dot dot_mid dot_liz"></span>';
    footer += '<div class="row text-right" style="width:100%">';
    footer += '<div class="col-1 offset-5"><span class="char-utau footer-liz dot dot_mid " style="background:url(https://nao-romasaga.github.io/img/dot/ID4bd48.png)"></span></div>';
    footer += '<div class="col-1"><span class="char-utau footer-liz dot dot_mid " style="background:url(https://nao-romasaga.github.io/img/dot/ID4c7d4.png)"></span></div>';
    footer += '</div>';
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
    } else if (url.indexOf('mydata.html') != -1) {
        $("#headMydata").addClass("active");
    } else if (url.indexOf('ourchar.html') != -1) {
        $("#headOurchar").addClass("active");
    } else if (url.indexOf('inputchar.html') != -1) {
        $("#headInputchar").addClass("active");
    } else if (url.indexOf('calendar.html') != -1) {
        $("#headCalendar").addClass("active");
    }
}

var charRand = [
    ["ID335e0", "ID33a2c"],
    ["ID33ce8", "ID7c8f8"],
    ["IDad638", "IDad5d4"],
    ["IDad82c", "ID38400"],
    ["ID38e28", "ID392d8"],
    ["ID38784", "ID387ea"],
    ["ID38978", "ID38914"],
    ["ID35c29", "ID35db8"],
    ["ID4bb56", "ID4c3ef"],
    ["ID4bb54", "ID4c3ec"],
    ["ID4bce4", "ID4bfa0"],
    ["ID4bd48", "ID4c7d4"],
    ["ID4e714", "ID4e264"],
    ["ID4ea34", "ID4e2c9"],
    ["ID339c8", "ID3357c"],
];
$(document).ready(function () {
    $("body").bind("contextmenu", function (e) {
        return false;
    });
    $("body").mousedown(function (e) {
        //return false;
    });
    var loading = $(".loading");
    if (loading.length > 0) {
        var random = Math.floor(Math.random() * charRand.length)
        $("#char1").attr("style", `background: url(./img/dot/${charRand[random][0]}.png);`);
        $("#char2").attr("style", `background: url(./img/dot/${charRand[random][1]}.png);`);
    }

    insertCommonComponent();

});
$(document).on('click', '.logout', function () {
    firebase.auth(appUsers).signOut().then(() => {
        console.log("ログアウトしました");
        $(".RequireLoginMenu").addClass("d-none");
    }).catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
    });
});

function getDevice() {
    let width = window.innerWidth;
    var ua = navigator.userAgent;
    if (width < 700) {
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
        let weaponType = ICON_LIST[master[i]['WeaponType']];
        if (idx[series] >= 24) {
            series = series + "2";
        }

        if (idx[series] === undefined) {
            idx[series] = 0;
        }
        if (idx[weaponType] === undefined) {
            idx[weaponType] = 0;
        }

        let dotId = master[i]['DotId'];
        let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
        let id = master[i]['Id'];
        let url = getImgUrl('dot/' + pngName + ".png") + " padding-top:35px;";
        let charDot = $("<span>").attr("id", "dot" + pngName)
                .addClass("char-aruku char char-bottom dot_mid dot")
                .addClass("dot" + pngName)
                .attr("data-id", id).attr('style', url).attr("onclick", "");
        let seriesBanner = $("<span>").addClass("series-button");
        seriesBanner.append(master[i]['Series']);
        charDot.append(seriesBanner);
        $("#" + series).append(charDot.clone());
        if (++idx[series] % width === 0) {
            $("#" + series).append("<br>");
        }
        $("#_" + weaponType).append(charDot.clone());
        if (++idx[weaponType] % width === 0) {
            $("#_" + weaponType).append("<br>");
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
let KAKUSEI_COLOR = {"black": "k", "green": "g", "blue": "b", "orange": "o", "purple": "p", "red": "r", "yellow": "y", "white": "w"};
let KAKUSEI_ICON = ["", "sand", "stone", "jewel"];
function skillLabel(skillInfo) {
    let skillList = $("<button>").addClass("skill_select").addClass("keishoSkill").attr("data-id", skillInfo['Id']);
    let topDiv = $('<div>').attr('style', 'width:100%; display: inline-flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid;');
    // 武器種別 BattleType、名称、所有数
    let skillName = $("<p>").addClass("text-left skillNameClass").attr('style', 'margin:0;');
    skillName.append(skillInfo['Name']);    // 技名称
    let skillRight = $("<p>").addClass('text-right').addClass('small').attr('style', 'margin:0;');
    skillRight.append("覚醒:" + skillInfo['Kakusei']);
    let iconClass = KAKUSEI_COLOR[skillInfo['KakuseiSozai']] + KAKUSEI_ICON[skillInfo['Kakusei']];
    skillRight.append(`<span class="icon_${iconClass}" style="width:25px;height:25px; display: inline-block;background-size: contain;">　</span>`);

    skillRight.append("BP:" + skillInfo['ConsumeBp']);
    skillRight.append(" 威力:" + skillInfo['PowerGrade'] + "(" + skillInfo['SkillIryoku'] + ")");
    topDiv.append(skillName).append(skillRight);

    // 属性 AttackAttributes
    let bottomDiv = $('<div>').addClass("iconClass").attr('style', 'display: table-cell; vertical-align: middle; height:30px');
    bottomDiv.append($('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['BattleType']]).text("　"));
    skillInfo['AttackAttributes'].split(',').forEach(function (value) {
        let img = $('<span>').addClass('icon_sm').addClass(ICON_LIST[value]).text("　");
        bottomDiv.append(img);
    });
    if (skillInfo['BadStatus'] != "") {
        let img = $('<span>').addClass('').addClass("icon_sm").addClass(ICON_LIST[skillInfo['BadStatus']]).text("　");
        bottomDiv.append(img);
    }
    if (skillInfo['DeBuff'] != "") {
        let img = $('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['DeBuff'] + "低下"]).text("　");
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

async function getStyleInfo(id) {
    if (STYLE_MASTER[id] === undefined) {
        await readFileWithId('Style', id, function (result) {
            STYLE_MASTER[id] = result;
        });
        return STYLE_MASTER[id];
    } else {
        return STYLE_MASTER[id];
    }
}
let USER_DATA = [];
async function getUserCharData(id) {
    if (USER_DATA[id] === undefined) {
        await readAnalyzeWithId('OUR_CHAR/DETAIL', id, function (result) {
            USER_DATA[id] = result;
        });
        return USER_DATA[id];
    } else {
        return USER_DATA[id];
    }
}