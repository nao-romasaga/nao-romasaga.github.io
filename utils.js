const ICON_LIST = {
    "剣": "icon_ken", "大剣": "icon_dken", "斧": "icon_ono",
    "小剣": "icon_sken", "槍": "icon_yari", "弓": "icon_yumi",
    "棍棒": "icon_kon", "体術": "icon_tai", "銃": "icon_ju",
    "斬": "icon_zan", "突": "icon_totsu", "打": "icon_da",
    "熱": "icon_netsu", "冷": "icon_rei", "雷": "icon_rai",
    "陰": "icon_in", "陽": "icon_yo",
    "火術": "icon_hi", "水術": "icon_mizu", "風術": "icon_kaze",
    "土術": "icon_tsuchi", "光術": "icon_hikari", "闇術": "icon_yami",
    "スタン": "icon_stan", "マヒ": "icon_mahi", "気絶": "icon_kizetsu", "毒": "icon_doku", "石化": "icon_sekika",
    "魅了": "icon_miryo", "眠り": "icon_zzz", "混乱": "icon_konran", "狂戦士": "icon_kyosenshi", "暗闇": "icon_kurayami"
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

function createSkillOption(list) {
    var result = {};
    list.forEach(function (rows) {
        if (rows[1] != "-" && rows[1] > 0) {
            // 0:種別、1:威力、2:Name、3:Grade、4:BP、5:覚醒
            result[rows[2] + " BP:" + rows[4] + " 威力[" + rows[3] + "]:" + rows[1]] = rows[1];
        }
    });
    return result;
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
    var nav = "";
    nav += '<nav class="navbar navbar-expand-lg navbar-light bg-light">';
    nav += '  <span class="char-aruku" id="dotCat"></span>';
    nav += '  <a class="navbar-brand" href="#">ロマサガRS 便利ツール</a>';
    nav += '  <span class="xs-hide char-aruku" id="dotPoruka"></span>';
    nav += '  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">';
    nav += '    <span class="navbar-toggler-icon"></span>';
    nav += '  </button>';
    nav += '  <div class="collapse navbar-collapse" id="navbarSupportedContent">';
    nav += '    <ul class="navbar-nav mr-auto">';
    nav += '      <li class="nav-item" id="headIndex">';
    nav += '        <a class="nav-link" href="./index.html">ダメージ計算機</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headSkill">';
    nav += '        <a class="nav-link" href="./skill.html">スタイル検索(技・術)</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headAbility">';
    nav += '        <a class="nav-link" href="./ability.html">アビリティツリー</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headAuto">';
    nav += '        <a class="nav-link" href="./auto.html">全力AUTOシミュレーション</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item">';
    nav += '        <a class="nav-link disabled" href="#">スタイル情報(coming soon)</a>';
    nav += '      </li>';
    nav += '    </ul>';
    nav += '  </div>';
    nav += '</nav>';
    $('body').prepend(nav);
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
    footer += '<span class="char-utau footer-riz" id="dotRiz"></span>';
    footer += '<hr>';
    footer += '免責事項<br>';
    footer += '当サイトは趣味で運営してる非公式のゲーム攻略サイトです。各社の協力や要請の元作成されたものではありません。また情報の内容の一切の保障を致しません。当サイトを利用したことにより発生する全ての損害を、当管理人はいかなる場合でも一切の責任を負いません。<br>';
    footer += '<br>';
    footer += '</div>';
    $('body').append(footer);
    showimage("dot/36a44.png", "dotCat", "400px");
    showimage("dot/ad5d4.png", "dotPoruka", "400px");
    showimage("dot/ad638.png", "dotRiz", "400px");
    //$("$header").html(nav);
    let url = $(location).attr('href');
    if (url.indexOf('index.html') != -1) {
        $("#headIndex").addClass("active");
    } else if (url.indexOf('skill.html') != -1) {
        $("#headSkill").addClass("active");
    } else if (url.indexOf('ability.html') != -1) {
        $("#headAbility").addClass("active");
    } else if (url.indexOf('auto.html') != -1) {
        $("#headAuto").addClass("active");
    }

}
$(document).ready(function () {
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
