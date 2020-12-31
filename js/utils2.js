var device = getDevice();
var LIMIT_BASE = 116; // 70=960
var HP_MAX = 1420; // 現時点での最大MP、スタイル戦闘力で使う
var HP_LIMIT = 1540;
var URA = 8;
var URA_HP = 40;
var HEAL_SKILL = ['集気法','ふっかつ','ゴールデンシロップ','アイス二段','町長の舞','生命の水','生命の雨','活力の水','アースヒール','ヒールライト','月光','再生光','ケアル'];
var OPEN_GACHA = [
    "2020.12.31.迎春！オールスター謹賀新年祭 Romancing祭",
    "2020.12.31.2021年あけましておめでとう！お年玉ログイン配布",
    "2020.12.31.迎春！オールスター謹賀新年祭 Ultra DXガチャ",
    "2020.12.31.十二支合戦と邪神の塔配布",
]; 
var WEAPON_MAP = {
    "剣" : {"master" : 43,"weapon" : 33}
   ,"大剣" : {"master" : 40,"weapon" : 32}
   ,"斧"   : {"master" : 33,"weapon" : 33}
   ,"小剣" : {"master" : 38,"weapon" : 32}
   ,"槍"   : {"master" : 38,"weapon" : 33}
   ,"弓"   : {"master" : 30,"weapon" : 31}
   ,"棍棒" : {"master" : 33,"weapon" : 33}
   ,"体術" : {"master" : 40,"weapon" : 32}
   ,"銃"   : {"master" : 25,"weapon" : 32}
   ,"杖"   : {"master" : 43,"weapon" : 31}
};
var EVENT_ABILITY = [
    {"START":1608519600,"LIMIT":1610650800,"QUEST":"[ガチャキャラ] ・星夜のサプライズプレゼント4倍・メイン3倍","CHAR":["dotID4c7d4","dotID4c70c","dotID4c964","dotID4cbbc","dotIDaea24","dotID34328","dotID4bd48","dotID4e070","dotIDada20"]},
    {"START":1608519600,"LIMIT":1610650800,"QUEST":"[杖キャラ] ・星夜のサプライズプレゼント3倍・メイン2倍","CHAR":["dotID339c8","dotID361a0","dotID38784","dotID38e28","dotID392d8","dotID4bb54","dotID4c3ec","dotIDad69c","dotID37fb4","dotID4c7d4","dotID36b64","dotID364c0","dotID94ffc","dotID4c70c","dotID38c34","dotID37e88","dotID642bc","dotID35840","dotID352c8","dotID3a660","dotID4c964","dotIDad9bc","dotID38b08","dotID397ec","dotID4e070","dotID9644c","dotID1af40","dotIDaeaec"]},
    {"START":1608519600,"LIMIT":1609441200,"QUEST":"[SaGaRS・SSG・ES・US] ・星夜のサプライズプレゼント4倍・メイン3倍","CHAR":["dotID94f34","dotID94f98","dotID94ffc","dotID95060","dotID95380","dotID9644c","dotID641f4","dotID642bc","dotID6444c","dotID645dc","dotID7c894","dotID7c8f8","dotIDad5d4","dotIDad638","dotIDad69c","dotIDad700","dotIDad764","dotIDad82c","dotIDad890","dotIDad9bc","dotIDada20","dotIDaea24","dotIDaeaec","dotIDc5c74"]},
    {"START":1608519600,"LIMIT":1610650800,"QUEST":"[復刻イベント] ・モニカのクリスマス大作戦3倍・メイン2倍","CHAR":["dotID36c90","dotID3852c","dotID382d4","dotID38dc4","dotID36bc8"]},
    {"START":1608519600,"LIMIT":1610650800,"QUEST":"[復刻イベント] ・クリスマスの奇跡3倍・メイン2倍","CHAR":["dotID334b4","dotID36a38","dotID4e390","dotID386bc","dotID367e0"]},
    {"START":1608519600,"LIMIT":1610650800,"QUEST":"[復刻イベント] ・聖夜のサンタ合戦3倍・メイン2倍","CHAR":["dotID384c8","dotID4e2c9","dotID382d4","dotIDad5d4","dotID4ea34","dotID38e28","dotIDad638","dotID4ec8c","dotID38464","dotIDad700","dotIDaea24","dotID4e32c"]},    

    {"START":1608087600,"LIMIT":1609441200,"QUEST":"[GBキャラ] 超感謝戦で4倍・メインで4倍",
    "CHAR":["dotID1ae14","dotID1ae78","dotID1af40","dotID1d13c","dotID1d90c","dotID1d970","dotID1f8b0"]},
    
    {"START":1608087600,"LIMIT":1609441200,"QUEST":"[ガチャキャラ] 超感謝戦で4倍・メインで4倍",
    "CHAR":["dotIDad5d4","dotIDad69c","dotIDad700","dotIDad764","dotIDad82c","dotIDad638","dotIDad890","dotIDaeaec","dotID94ffc","dotID3a660","dotID39850"]},

    {"START":1607569200,"LIMIT":1608490800,"QUEST":"[SF1,SF2キャラ] 超感謝戦で4倍・メインで3倍 (期間終了で等倍に戻るキャラのみ表示中)","CHAR":["dotID4c3ec","dotID4c70c","dotID4c964"]},

    {"START":1607569200,"LIMIT":1609441200,"QUEST":"[斬打突雷陽キャラ] 超感謝戦で3倍・メインで2倍",
    "CHAR":[
        "dotID334b4","dotID33518","dotID3357c","dotID335e0","dotID33644","dotID336a8","dotID33770","dotID33b58","dotID33ce8","dotID33db0","dotID340d0","dotID34328","dotID353f4","dotID35840",
        "dotID336a8","dotID3370c","dotID3389c","dotID33a2c",
    
        "dotID35bc4","dotID35c28","dotID35c8c","dotID35cf0","dotID35db8","dotID35e1c","dotID35fac","dotID36204","dotID3645c","dotID36524","dotID36588","dotID3677c","dotID368a8","dotID36a38","dotID36a9c","dotID36bc8","dotID37b04","dotID37b68","dotID37f50","dotID38144","dotID364c0",
        "dotID35d54","dotID36394","dotID367e0","dotID3690c","dotID36970","dotID36a38","dotID36b00","dotID36c90","dotID377e4","dotID3807c","dotID380e0",
        "dotID36010","dotID360d8","dotID36268","dotID363f8","dotID365ec","dotID36718","dotID36844","dotID37848","dotID37eec","dotID38018","dotID37fb4",
    
        "dotID382d4","dotID38400","dotID384c8","dotID3852c","dotID38590","dotID388b0","dotID38914","dotID389dc","dotID38aa4","dotID38c34","dotID38c98","dotID392d8","dotID393a0","dotID3a6c4",
        "dotID38338","dotID386bc","dotID387e8","dotID3884c","dotID38b08","dotID38c98","dotID38d60","dotID38dc4","dotID38e28","dotID38ef0","dotID39274","dotID39724","dotID3a14c","dotID3a214","dotID3a2dc","dotID3a728",
        "dotID3839c","dotID38464","dotID38978","dotID38b6c","dotID38cfc","dotID3933c","dotID3965c","dotID38784","dotID397ec",
    
        "dotID4bc1c","dotID4bd48","dotID4bdac","dotID4c1f8","dotID4c2c0","dotID4c450","dotID4c770","dotID4e070",
        "dotID4bbb8","dotID4bc80","dotID4bce4","dotID4bfa0","dotID4c25c","dotID4c4b4","dotID4c518","dotID4ca90","dotID4cbbc","dotID4cd4c",
        "dotID4e714","dotID4ea34","dotID4ec8c","dotID4ee1c",
    
        "dotID4e264","dotID4e32c","dotID4ee80","dotID4ef48",
        "dotID4e2c9","dotID4e390","dotID4e840",    

        "dotID641f4","dotID645dc","dotID6444c",
        "dotID95380","dotID94f34","dotID94f98","dotID95060",
        "dotID7c894","dotID7c8f8",
        "dotIDada20","dotIDad9bc","dotIDc5c74","dotIDaea24",
        "dotIDc5cd8"
    ]},

    {"START":1606186800,"LIMIT":1612119600,"QUEST":"[新スタイル] メイン2倍・聖塔ランスの娘~聖王~（前編・後編）3倍","CHAR":["dotID3965c","dotID39850","dotID39724","dotID397ec"]},
    {"START":1606186800,"LIMIT":1609441200,"QUEST":"[RS3] 聖塔ランスの娘~聖王~（前編・後編）3倍<br>・メインと遺跡潜り2倍","CHAR":["dotID382d4","dotID38338","dotID3839c","dotID384c8","dotID3852c","dotID38590","dotID38784","dotID387e8","dotID3884c","dotID38914","dotID389dc","dotID38aa4","dotID38b6c","dotID38dc4","dotID38e28","dotID38ef0","dotID392d8","dotID3a14c","dotID3a214","dotID386bc","dotID38d60","dotID38978","dotID38400","dotID3933c","dotID39274","dotID38cfc","dotID3a2dc","dotID38464","dotID38c34","dotID3a660","dotID38b08","dotID3965c","dotID39850","dotID39724","dotID397ec","dotID38c98","dotID3a6c4","dotID3a728","dotIDc5cd8","dotID388b0","dotID393a0","dotID3a278"]},
    

];

var VOTE_DB_COLUMN = {
    "col1" : "shukai",
    "col2" : "hanyo",
    "col3" : "only",
};

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
const WEAPON_ATTR = {
    "剣": "斬", "大剣": "斬", "斧": "斬",
    "小剣": "突", "槍": "突", "弓": "突",
    "棍棒": "打", "体術": "打", "銃": "打", "杖": "打"
};
const AREA_SHORT = {
    "敵単体": "単", "敵全体": "全", "敵縦一列": "縦", "敵横一列": "横", "味方単体": "味単", "味方全体": "味全", "自身": "自", "敵ランダム": "ラ", "ランダム": "ラ"
};
const POWER_TABLE = {"HP":5, "STR":6,"VIT":6, "DEX":4, "AGI":4,"INT":4,"MND":4,"AI":2,"MI":2};
const PARAM_KEY = ["STR", "VIT", "DEX", "AGI", "INT", "MND", "AI", "MI"];
const PARAM_KEY_HP = ["HP"].concat(PARAM_KEY);
const PARAM_NAME = ['腕力', '体力', '器用さ', '素早さ', '知力', '精神', '愛', '魅力'];
const PARAM_NAME_ONE = ['腕', '体', '器', '速', '知', '精', '愛', '魅'];
const PARAM_NAME_HP = ['HP', '腕力', '体力', '器用さ', '素早さ', '知力', '精神', '愛', '魅力'];
const PARAM_NAME_HP_ONE = ['HP', '腕', '体', '器', '速', '知', '精', '愛', '魅'];
const CONST_STYLE_BONUS_VAL = {
    "A": {2: 1, 6: 1, 8: 1, 18: 2, 22: 1, 38: 2, 46: 3, 50: 2},
    "S": {2: 1, 6: 1, 8: 2, 18: 3, 22: 1, 38: 3, 46: 4, 50: 2},
    "SS": {2: 1, 6: 2, 8: 3, 18: 3, 22: 2, 38: 4, 46: 5, 50: 3}
};
const MASTER_LV_KEY = {
    "剣": "ken", "大剣": "dken", "斧": "ono",
    "小剣": "sken", "槍": "yari", "弓": "yumi",
    "棍棒": "kon", "体術": "tai", "銃": "ju", "杖": "tsue",
}
const IRYOKU_LIST = {
    "-": "-",
    "E": "7〜9",
    "D": "10〜14",
    "C": "15〜20",
    "B": "21〜27",
    "A": "28〜35",
    "S": "36〜44",
    "SS": "45〜55",
    "SSS": "56〜73",
};
var SKILL_BUFF_TABLE = {
    "敵単体効果小" : 25,
    "敵単体効果中" : 30,
    "敵単体効果大" : 40,
}
var SKILL_DEBUFF_TABLE = {
    "敵単体効果小" : 15,
    "敵単体効果中" : 20,
    "敵全体効果小" : 15,
}

var ENEMY_RESIST = [
    [0, 0, 0, 0, 0, 0, 0, 0, "なし", "なし"],
    [-35, 0, 0, 50, 50, 50, 50, -35, "人間", "キラーマシン"],
    [0, 0, 50, -35, -35, -35, 0, 0, "巨人 男性", "オーガロード"],
    [0, 50, 0, 0, 0, 0, 0, 0, "獣", "ヌエ"],
    [0, 0, -35, 0, 50, 0, 0, 0, "竜 浮遊", "ワンダーラスト"],
    [0, 50, 0, -45, 50, 0, 0, 0, "植物", "ラッフルツリー"],
    [0, -35, 0, 0, -35, 0, 50, 0, "虫 浮遊", "アレフ"],
    [50, 0, -45, 0, -35, -35, 0, 0, "水棲", "首長竜"],
    [0, -35, 0, 0, -35, -35, 0, 0, "魚", "死海魚"],
    [50, 0, 0, 50, -45, -35, 0, 0, "爬虫類", "ザッハーク"],
    [0, 0, 0, 0, -45, -45, 0, 0, "両生類 カエル", "カエル術士"],
    [0, 0, 0, 50, 50, 50, -45, 50, "悪魔", "戦鬼"],
    [0, 0, -35, -35, 50, 0, -45, 50, "巨人 不死", "ポイゾンギアン"],
    [0, -35, 50, -35, 50, 0, -45, 50, "竜 不死 骨", "チャリオット"],
    [-35, 0, 0, 50, 50, 50, 50, 50, "火精,土精,岩石", "マグマ"],
    [30, 125, 30, -35, -35, -35, -35, -35, "虫", "ゴールデンバウム"],
];

scroll_effect();
$(window).scroll(function(){
    scroll_effect();
});
function scroll_effect(){
　$(window).scroll(function (){
    $('.FADEIN').each(function(){
        var elemPos = $(this).offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > elemPos - windowHeight){
            $(this).addClass('FADEIN-SCROLL');
        } else {
            $(this).removeClass('FADEIN-SCROLL');
        }
    });
　});
}

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

function dispHeader() {
    var closeMenuStyle= "font-size:inherit; color:white;";
    var nav2 = "";
    nav2 = `
    <div class="header-area">
        <div class="header-image">
            <div class="fuchidori-white" style="position:absolute; left:0px; max-width:100%;">
                <a href="./index.html" style="color:white"><img src="https://romasagatool.com/img/header.png" style="max-width:80%;"><br>
                <div class="d-none d-sm-inline-block">　ロマンシング・サガ リ・ユニバース 便利ツール</div>
                <div class="d-sm-none" style="display: flex;">
                <span>ロマサガRS 便利ツール</span>
                </div></a>
            </div>
            <div class="d-none d-lg-block" style="position:absolute; left:calc(50% - 132px)">
                <img src="./img/cmn_logo01_sp.png" style="height: 130px; width: 265px;">
            </div>
            <div class="text-right login-card">
                <a href="./login.html" class="icon_btn_positive text-center text-nowrap shadow-black" style="display: inline-block; padding: 5px 15px;"><i class="fab fa-twitter"></i> ログインページ <i class="fab fa-google"></i></a> 
            </div>
            <div class="text-right d-none d-sm-block" style="position:absolute; right:15px; font-size:10px; bottom:5px;">
                <a href="./site.html" class="icon_btn_positive text-center text-nowrap" style="display: inline-block; width:120px; padding: 5px;">利用規約・免責</a> 
                <a href="./kifu.html" class="icon_btn_negative text-center text-nowrap" style="display: inline-block; width:120px; padding: 5px;">支援について</a>
            </div>
            <div class="d-none d-lg-block fuchidori-white text-center" style="position:absolute; width:100%; bottom:0px; font-size:8px;">
            © 2019 SQUARE ENIX CO., LTD. All Rights Reserved. Powered by Akatsuki Inc.
            </div>
        </div>
        <nav class="site-header text-nowrap">
            <img class="d-sm-none blinking" src="https://romasagatool.com/img/icon/icon_arrow_right.png" style="position: fixed; right: 0px; height: 50px;">
            <ul>
                <li class="menu-item"><a href="http://romasagatool.com/blog/" target="_blank"><i class="far fa-newspaper"></i> 攻略ブログ</a></li>
                <li class="menu-item"><a href="./calendar.html"><i class="fas fa-calendar"></i> イベント</a></li>
                <li class="menu-item"><a href="./ourchar.html"><i class="fas fa-crown"></i> 素ステ上限一覧</a></li>
                <li class="menu-item"><a href="./styleranking.html"><i class="fas fa-user-check"></i> スタイル評価</a></li>
                
                <li class="menu-item dropdown position-relative text-center">
                    <span class="DROPDOWN_OPEN yubi" onclick=""><i class="fas fa-robot"></i> 全力オート <i class="fas fa-sort-up d-none"></i><i class="fas fa-sort-down"></i></span>
                    <a href="./auto.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-list-ol"></i> シミュレーター</a>
                    <a href="./autodamage.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-crown"></i> ダメージランキング</a>
                </li>
                <li class="menu-item"><a href="./quest.html"><i class="fas fa-dragon"></i> クエスト一覧</a></li>
                <li class="menu-item dropdown position-relative text-center">
                    <span class="DROPDOWN_OPEN yubi" onclick=""><i class="fas fa-search"></i> ゲームデータ検索 <i class="fas fa-sort-up d-none"></i><i class="fas fa-sort-down"></i></span>
                    <a href="./style.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-user"></i> スタイル 一覧</a>
                    <a href="./skill.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-lightbulb"></i> 技・術 一覧</a>
                    <a href="./ability.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-ring"></i> アビリティ 一覧</a>
                    <a href="./weapon.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-shield-alt"></i> 装備 一覧</a>
                </li>
                <li class="menu-item"><a href="./limitdata.html"><i class="fas fa-user"></i> スタイルLv50ステ一覧</a></li>
                <li class="menu-item"><a href="./knowledge.html"><i class="fas fa-book"></i> 豆知識</a></li>
            </ul>
            <ul class="bgcolor-brawn">
                <li class="menu-item"><a href="./home.html"><i class="fas fa-home"></i> ホーム</a></li>
                <li class="menu-item"><a href="./party.html"><i class="fas fa-check-circle"></i> ステータス上限チェック</a></li>
                <li class="menu-item"><a href="./mydata.html"><i class="fas fa-map-marked-alt"></i> マイデータ</a></li>
                <!--<li class="menu-item"><a href="./inputchar.html"><i class="fas fa-edit"></i> まとめてステ入力</a></li>-->
                <li class="menu-item"><a href="./stylecheck.html"><i class="fas fa-tasks"></i> スタイル所持チェッカー</a></li>
                <li class="menu-item"><a href="./damage.html"><i class="fas fa-calculator"></i> ダメージ計算</a></li>
                <li class="menu-item d-sm-none" style="margin-left:auto;"><a href="./site.html">利用規約・免責</a></li>
                <li class="menu-item d-sm-none"><a href="./kifu.html">支援について</a></li>
            </ul>
        </nav>
    </div>
    <!--
    <img src="http://romasagatool.com/img/icon/qe15.gif">
    -->
    `;
    $('body').prepend(nav2);
}
$(document).on('click', '.DROPDOWN_OPEN', function () {
    $(this).find(".fa-sort-up").toggleClass("d-none");
    $(this).find(".fa-sort-down").toggleClass("d-none");
    $(this).parent().find(".dropdown-item").toggleClass("d-none");
});

function loginCard(target){
    let icon = $("<img>").attr("src", USER.photoURL)
            .attr("style", "width:20px; border-radius: 50%;");
    let name = ` ${USER.displayName} さん:ログイン中`;
    $(target).addClass("bg-item").append(icon).append(name);
}

function insertCommonComponent() {
    var randChar = [
        "ID334b4","ID334b6","ID334b7","ID33518","ID3351b","ID3357c","ID3357e","ID3357f","ID335e0","ID33644","ID33646","ID33647","ID336a8","ID3370c","ID3370e","ID33770","ID33772","ID33774","ID3389c","ID339c8","ID339ca","ID33a2c","ID33db0","ID33db2","ID35bc4","ID35c29","ID35c2a","ID35c2b","ID35c8c","ID35c8f","ID35db8","ID35fac","ID36010","ID360d8","ID361a0","ID361ac","ID36204","ID36210","ID36219","ID36268","ID36394","ID363f8","ID3645c","ID364c0","ID36511","ID36524","ID36575","ID365ec","ID36718","ID3677c","ID367e0","ID367ec","ID367f5","ID36859","ID3685a","ID368a8","ID3690c","ID36970","ID36a38","ID36a44","ID36a45","ID36b00","ID36b64","ID36bc8","ID36bd4","ID36c9b","ID36c90","ID36c9d","ID37849","ID37b04","ID37b68","ID37f50","ID37f52","ID37fb4","ID37fb6","ID37fb7","ID38018","ID3807c","ID3807e","ID380e0","ID380e2","ID382d4","ID382d7","ID382d8","ID38338","ID3833a","ID3839c","ID3839e","ID384c9","ID384c8","ID384cb","ID3852c","ID3852e","ID3852f","ID38590","ID38592","ID38593","ID386bd","ID386be","ID38784","ID387e8","ID387ea","ID3884c","ID38914","ID38978","ID389dc","ID38aa4","ID38ad7","ID38b6c","ID38d60","ID38dc5","ID38dc4","ID38e28","ID38e2b","ID38ef0","ID392d8","ID392db","ID3a14c","ID3a214","ID4bb54","ID4bb56","ID4bbb8","ID4bc81","ID4bc80","ID4bc83","ID4bd4a","ID4c1f8","ID4c25c","ID4c3ec","ID4c3ef","ID4c450","ID4c7d6","ID4e266","ID4e264","ID4e2c9","ID4e2cb","ID4e32c","ID4e390","ID4e392","ID4e393","ID4e840","ID4ea34","ID4ea36","ID641f4","ID645dc","ID94f34","ID94f36","IDad5d4","IDad5d7","IDad69c","IDad700","IDad764","IDad82c","ID37b06","ID38ef4","ID4e714","ID38144","ID38146","ID335e3","ID33ce8","ID7c8f8","ID7c8fb","IDad638","ID336ab","ID36588","ID38400","ID38402","ID35e1c","ID36a9c","ID37eec","ID37eee","ID386bc","IDad767","ID38403","ID3933d","ID4bc1c","ID4bce5","ID4bfa1","IDad702","ID4bd48","ID4bd4b","ID4c7d4","ID4cd4c","ID38cfc","ID39274","ID3933c","ID3a2dc","ID3389f","ID36c9e","ID383a1","IDad5d8","IDad63a","ID35d54","ID95060","ID3351c","ID33773","ID33cea","ID7c8fc","IDad766","ID4e267","ID35d56","ID36a46","ID377e4","ID94f38","ID94f98","ID94ffd","ID4e268","ID4ec8d","ID3432a","ID35cf2","ID36999","ID36ac5","ID3839f","ID38532","ID38918","ID4bdac","IDaea25","ID336ac","ID33db3","ID3432b","ID38464","ID384cd","ID339cb","ID37b07","ID37b6b","ID38cfe","ID3a2de","ID4bb59","ID4c3f0","ID4c4b4","ID4c70c","ID4bce6","ID4c2c0","ID33648","ID336ae","ID33b58","ID4e2cd","ID4e395","ID3884f","ID38c34","ID35cf0","ID38cff","ID4c453","ID384cf","IDad703","ID382d9","IDaea24","ID4e2ce","ID4e32f","ID4ea38","ID4ec8f","ID35c90","ID37e8a","ID37e8c","ID37fbb","ID3801b","ID641f7","ID642bc","ID6444c","IDad63b"
    ];

    var footer = "";
    footer += '<div class="opacity" id="FOOTER" style="position: relative;">';
    footer += 'Powered by <a href="https://twitter.com/nao_romasaga_rs" target="new">nao_romasaga_rs</a><br>';
    footer += 'Special thanks :<small>各種データ調査を参考にさせて頂いております<br>';
    footer += '<a href="https://twitter.com/YamadaMeganeOre" target="new">山田メガネ</a>';
    footer += ', <a href="https://twitter.com/chin_ohnck" target="new">ちん</a>';
    footer += ', <a href="https://twitter.com/HarMakeIt" target="new">春巻</a>';
    footer += ', <a href="https://twitter.com/littleblackbee1" target="new">小黒 蜂一</a>';
    footer += ', <a href="https://twitter.com/mamu_romasaga" target="new">まむ</a>';
    footer += ', <a href="https://twitter.com/NEIGEtan" target="new">ねいじゅ</a>';
    footer += ', <a href="https://twitter.com/RSR60979033" target="new">まどい＿RSR</a>';    
    footer += ', <a href="https://twitter.com/ruchigame" target="new">ruchi</a>';
    footer += ', <a href="https://twitter.com/imonoki" target="new">imonoki</a>';
    //footer += '<a href="https://twitter.com/" target="new"></a>, ';
    footer += '</small><br>';
    footer += '<a href="http://junglesurvey.web.fc2.com/" target="new">密林調査記録</a>';
    footer += ', <a href="https://docs.google.com/spreadsheets/d/1-7VaZCUjcyOBYexa_nQ_yidzupaIhcn523EkBW2jrFU/edit#gid=0" target="new">ロマサガRS調査</a>';
    footer += ', <a href="https://foollovers.com/" target="new">FOOL LOVERS</a><br>';    
    footer += '© 2019 SQUARE ENIX CO., LTD. All Rights Reserved. Powered by Akatsuki Inc.<br>';
    footer += 'ILLUSTRATION: TOMOMI KOBAYASHI';
    //footer += '<span class="char-utau footer-liz dot dot_mid dot_liz"></span>';
    footer += '<div class="row text-right" style="width:100%" id="DOT_FOOTER">';
    for(var i=0;i<1;i++){
        var random = Math.floor(Math.random() * randChar.length);
        var png = getImgPath(`dot/${randChar[random]}.png`);
        footer += `<div class="col-1 offset-11"><span class="char-utau footer-liz dot dot_mid " style="background:url(${png})"></span></div>`;
    }    
    footer += '</div>';
    //footer += '<hr>';
    //footer += '利用規約・免責事項<br>';
    //footer += '当サイトは趣味で運営してる非公式のゲーム攻略サイトです。各社の協力や要請の元作成されたものではありません。また情報の内容の一切の保障を致しません。当サイトを利用したことにより発生する全ての損害を、当管理人はいかなる場合でも一切の責任を負いません。<br>';
    //footer += '当サイトの内容、データ、プログラムの複製を固く禁じます。テキスト、画像の著作権は各社に帰属するものであり当サイトからの引用を固く禁じます。<br>';
    footer += '</div>';

    $('body').append(footer);

    let url = $(location).attr('href');
    if (url.indexOf('debug') === -1) {
        //    $('body').html('<div class="sorry_center"><p class="sorry_cat icon-nemuri"><span class="icon-zzz"></span></p><br>申し訳ございません。<br>現在メンテナンス中です。</div>');
    }

    if (url.indexOf('partylist.html') != -1) {
        $("#headPartylist").addClass("active");
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
    } else if (url.indexOf('limitdata.html') != -1) {
        $("#headLimitdata").addClass("active");
    }

}

var charRand = [
    ["ID33a2c", "ID335e0"],
    ["ID33ce8", "ID7c8f8"],
    ["IDad638", "IDad5d4"],
    ["IDad82c", "ID38400"],
    ["ID38e28", "ID392d8"],
    ["ID387ea", "ID38784"],
    ["ID38978", "ID38914"],
    ["ID35c29", "ID35db8"],
    ["ID4bb56", "ID4c3ef"],
    ["ID4bb54", "ID4c3ec"],
    ["ID4bce4", "ID4bfa0"],
    ["ID4c7d4", "ID4bd48"],
    ["ID4e714", "ID4e264"],
    ["ID4ea34", "ID4e2c9"],
    ["ID339c8", "ID3357c"],
    ["ID39274", "ID3a2dc"], // 16
    ["ID36a46", "ID35c2a"],
    ["ID377e4", "ID35d54"],
    ["ID37fb6", "ID37eec"],
    ["ID37f52", "ID37fb6"],
    ["ID380e2", "ID36511"],
    ["IDad5d8", "IDad63a"],
    ["ID38018", "nushi_musume"],
    ["nushi", "nushi_musume"],
    ["nushi", "ID38018"],
    ["robing", "ID38914"],
    ["rans_musume","ID3965c"],
    ["ID39724","ID3965c"],
    ["ID39850","ID3965c"],
    ["sorp","ID3965c"],
    ["fullb","ID3965c"],
    ["IDad82c","710703"],
    ["IDad5d4","710106"],
    ["IDad638","710205"],
    ["710205","IDad9bc"],
    ["IDada20","IDad9bc"],
    ["ID38e28","IDad9bc"],
    ["ID392d8","IDad9bc"],
    ["IDc5c74","ID36970",],
    ["ID338a0","ID334b9",],
    ["230804","230704",],
    ["9900030","9900031", ],
    ["ID1d90c","120500",],
    ["710105","IDad5d4",],
    ["229304","229203",],
    ["ID38464","231600",],
    ["227500","ID368a8",],
    ["211702","211802",],
    ["211702","ID336a8",],
    ["211802","ID336a8",],
    ["110400","110100",],
    ["ID3a660","ID3a662"],
    ["ID4c2c0","ID4bc81",],
    ["ID4c964","ID4bd4a",],
    ["ID4ca90","ID4bdac",],
    ["ID7c8fa","ID7c894",],
    ["ID33ce8","ID7c8fa",],
    ["ID335e3","ID7c8fa",],
    ["ID37b07","ID38ef4",],
    ["ID3357e","ID336ac",],
    ["ID38534","9900102",],
    ["ID35840","ID33964",],
    ["ID36524","ID35e1c",],
    ["ID38338","ID38b08",],
    ["ID38400","ID3933c"],
    ["ID4ee80","ID4ef48"],
    ["ID4ee1c","ID4e390"],
    ["ID4c1f8","ID4c25c"],
    ["ID38144","IDaea24"],
    ["ID35c8c","ari"],
    ["ID35c8c","ari2"],
    ["ari","ID36b00"],
    ["ari2","ID36b00"],
    ["ID363c7","ID35c8c"], // ハンニバルと陛下
    ["ID363c7","ID35cf2"], // ハンニバルと陛下
    ["9900125","9900124"], // ムー
    ["ID38e2b","ID392db"], // 学園ぼるかの
    ["ID392dc","711103"], // 水着ジョーぼるかの
    ["715500","9900033"], // イーヴリン・魔女
    ["9900040","9900017"],
    ["9900002","710600"],
    ["9900034","IDad764"],
    ["ID1ae14","119100"],
    ["119103","119100"],
    ["9900145","ID1d90c"],
    ["IDc5cd8","IDc5cda"],
    ["ID95380","ID94f98"],
    ["ID94ffc","ID9644c"],
    ["322200","322300"],
    ["ID4e840","ID4e264"],
    ["ID4ea38","ID4e2ce"],
    ["ID4ec8f","ID4e2ce"],
    ["ID4e32c","320207"],
    ["ID4ec8c","320202"],
    ["ID4ea34","320200"],
    ["ID4e070","ID4c70c"],
    ["9900133","711300"],
    ["312900","ID4e070"],
    ["313000","ID4e070"],
    ["314900","ID4e070"],
    ["ID4cbbc","ID4bd48"],
    ["ID4cbbc","ID4c7d4"],
    ["310106","312305"],
    ["312305","310106"],
    ["ID4bbbb","ID4c4b6"],
    ["ID4ca90","ID4bdac"],
    ["ID4c770","ID4e070"],
    ["234600","234500"],


];
$(document).ready(function () {
    dispHeader();
    $(".dropdown-item").addClass("d-none");
    var _window = $(window),
    _header = $('.site-header'),
    lastPos, winScrollTop, heroBottom;
    _window.on('scroll',function(){     
        heroBottom = $('.header-image').height();
        winScrollTop = _window.scrollTop();
        if(winScrollTop > heroBottom){
            if(winScrollTop >= lastPos){
                _header.addClass('fixed hide');   
            } else {
                _header.addClass('fixed').removeClass("hide");
            }
        } else{
            _header.removeClass('fixed hide');
        }
        lastPos = _window.scrollTop();
    }); 
    _window.trigger('scroll');

    $("body").bind("contextmenu", function (e) {
        return false;
    });
    $("body").mousedown(function (e) {
        //return false;
    });
    var loading = $(".loading");
    if (loading.length > 0) {
        loading.each(function(){
            var random = Math.floor(Math.random() * charRand.length)
            dot1 = getImgPath(`dot/${charRand[random][0]}.png`);
            dot2 = getImgPath(`dot/${charRand[random][1]}.png`);
            $(this).parent().find(".CHAR_BACK").attr("style", `background: url(${dot1});`);
            $(this).parent().find(".CHAR_FRONT").attr("style", `background: url(${dot2});`);
        })
    }

    insertCommonComponent();

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
function dispChar_bk(master) {
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
        var png = getImgPath(`dot/${pngName}.png`);
        let url = `background:url(${png}) no-repeat; padding-top:35px;`;
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
function dispChar(master) {
    let idx = {};
    let width = (device === "sp") ? 6 : 12;
    let otherSeries = ["US","SS","ES"];
    var result = [];
    for (let i in master) {
        if (master[i]['Holders'] === undefined) {
            continue;
        }
        let series = master[i]['Series'];
        let weaponType = ICON_LIST[master[i]['WeaponType']];

        if (idx[series] === undefined) {
            idx[series] = 0;
        }
        if (idx[weaponType] === undefined) {
            idx[weaponType] = 0;
        }
        let dotId = master[i]['DotId'];
        let id = master[i]['Id'];
        let name = master[i]['Name'];
        var base = getCharBase(id, dotId, name);

        //series = (otherSeries.indexOf(series) != -1) ? "OTR" :series;
        $("#SEC" + series).append(base);
        if (++idx[series] % width === 0) {
            //$("#" + series).append("<br>");
        }
        $("#_" + weaponType).append(base.clone());
        if (++idx[weaponType] % width === 0) {
            //$("#_" + weaponType).append("<br>");
        }
    }
}
// これを呼び出す場合は下記のimportが必要
// <script src="./js/lib/lazysizes.min.js"></script>
// <script src="./js/lib/ls.unveilhooks.min.js"></script>
function dispChar2(master) {
    let idx = {};
    let result = {"RS1":[],"RS2":[],"RS3":[],};
    for (let i in master) {
        if (master[i]['Holders'] === undefined) {
            continue;
        }
        let series = master[i]['Series'];
        let weaponType = ICON_LIST[master[i]['WeaponType']];

        if (idx[series] === undefined) {
            idx[series] = 0;
        }
        if (idx[weaponType] === undefined) {
            idx[weaponType] = 0;
        }
        let dotId = master[i]['DotId'];
        let id = master[i]['Id'];
        let name = master[i]['Name'];
        var base = getCharBase2(id, dotId, name, '', true);
        $("#SEC" + series).append(base);
        $("#_" + weaponType).append(base.clone());
        //if(master[i]['WeaponType'] == '体術'){
        //if(series == "RS1" || series == "RS2" || series == "RS3") {
            //result[series].push("\"dotID"+dotId+"\"");
        //}
    }
}
function getCharBase(id, dotId, name){
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    var png = getImgPath(`dot/${pngName}.png`);
    let url = `background:url(${png}) no-repeat; position:relative;`;//padding-top:35px; 

    let base = $(`<div class="dot-base">`);
    var baseUrl = getImgPath(`icon/icon_base_common.png`);
    let baseImg = $(`<img src="${baseUrl}" class="dot-base-circle">`);
    base.append(baseImg);
    let charDot = $(`<div class="char-aruku-left char dot_mid dot dot${pngName} dot-base-char"
    id="dot${pngName}" data-id="${id}" style="${url}" onclick=""
    >`);
    let seriesBanner = $(`<div class="text-center text-nowrap dot-name-label">${name}</div>`);
    base.append(seriesBanner);
    base.append(charDot);
    return base.clone();
}
function getCharBase2(id, dotId, name, rare, isLazyLoad = false){
    let pngName = (dotId !== "ID4e2c8") ? dotId : "ID4e2c9";
    var dotPath = getImgPath(`dot/${pngName}.png`);
    var baseCircle = (rare == '' ) ? 'common' : rare.toLowerCase();
    var baseUrl = getImgPath(`icon/icon_base_${baseCircle}.png`);
    let base = $(`<div class="dot-base">`);

    let baseImg = $(`<img src="${baseUrl}" class="dot-base-circle">`);
    let charDot = $(`<div class="char-dot-base char-aruku-left2 char dot_mid dot dot${pngName} dot-base-char"
    id="dot${pngName}" data-id="${id}" onclick=""></div>`);

    if(isLazyLoad){
        charDot.attr('data-bg',dotPath);
        charDot.addClass("lazyload");
        baseImg = $(`<img data-src="${baseUrl}" class="dot-base-circle lazyload">`);
    } else {
        charDot.attr('style',`background:url(${dotPath}) no-repeat; position:relative;`);
    }
    base.append(baseImg);

    let seriesBanner = $(`<div class="text-center text-nowrap dot-name-label">${name}</div>`);
    base.append(seriesBanner);

    base.append(charDot);

    return base.clone();
}
function getKakuseiIcon(skillInfo, size = 40){
    let iconClass = KAKUSEI_COLOR[skillInfo['KakuseiSozai']] + KAKUSEI_ICON[skillInfo['Kakusei']];
    let iconJp = KAKUSEI_JP[skillInfo['KakuseiSozai']];

    return $(`
    <span style="position: relative; width:${size}px;">
    <span class="icon_back_default" style="background-size: ${size}px;">
        <span class="icon_${iconClass}" style="width:${size}px;height:${size}px; display: inline-block; background-size: contain;">　</span>
    </span>
    <span style="position: absolute;
    bottom: -36px;
    right: 0;
    width: ${size}px;
    text-align: center;
    font-size: 8px;">${iconJp}${skillInfo['Kakusei']}</span>
    </span>
    `);    
}

let KAKUSEI_COLOR = {"black": "k", "green": "g", "blue": "b", "orange": "o", "purple": "p", "red": "r", "yellow": "y", "white": "w"};
let KAKUSEI_JP = {"black": "黒", "green": "緑", "blue": "青", "orange": "橙", "purple": "紫", "red": "赤", "yellow": "黄", "white": "白"};
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
    if (skillInfo['Buff'] != "") {
        if (skillInfo['Buff'] === "HP") {
            bottomDiv.append("[HP回復]");
        } else {
            let img = $('<span>').addClass('icon_sm').addClass(ICON_LIST[skillInfo['Buff'] + "上昇"]).text("　");
            bottomDiv.append(img);
        }
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

function rssCallback(results) {
    var ul = document.createElement("ul");
    ul.className = "trianglelist list5";
    var ul2 = document.createElement("ul");
    ul2.className = "trianglelist list5";
    for (var i = 0; i < results.length; i++) {
        var entry = results[i];
        var li = document.createElement("li");
        var a = document.createElement("a");
        entry.title = entry.title.replace("【ロマサガRS】","");
        a.setAttribute("title", entry.title);
        a.setAttribute("href", entry.link);
        a.setAttribute("target", "_blank");

        var pub = new Date(entry.pubdate);
        var mod = new Date(entry.moddate);
        var newDay = new Date();
        newDay.setDate(newDay.getDate() - 1); // 記事が2日前より未来なら
        var modDay = new Date();
        modDay.setDate(modDay.getDate() - 2); // 記事が2日前より未来なら
        if(modDay < mod) {
            var img = document.createElement("img");
            img.setAttribute("src", 'http://romasagatool.com/img/icon/qb15.gif');
            a.appendChild(img);
            entry.title = " " + entry.title;
        } else if(newDay < pub) {
            var img = document.createElement("img");
            img.setAttribute("src", 'http://romasagatool.com/img/icon/q05.gif');
            a.appendChild(img);
            entry.title = " " + entry.title;
        }        
        a.appendChild(document.createTextNode(entry.title));
        var comment = document.createElement("span");
        var font = document.createElement("i");
        font.setAttribute("class", "fas fa-comments");
        comment.appendChild(font);
        comment.appendChild(document.createTextNode(`:${entry.comment}`));
        comment.setAttribute("style", `
        background-color: rgba(100, 100, 80, 0.8);
        color: white;
        padding: 0px 3px;
        border-radius: 6px;
        margin-right:3px;
        font-size: 10px;`);
        //a.appendChild(comment);
        if(Number(entry.comment) > 0){
            li.appendChild(comment);
        }
        li.appendChild(a);
        catIds = entry.catId.split(",");
        kousatsuFlag = false;
        for(cat of catIds) {
            // 考察記事はそっちにいれる
            if(["49", "47", "48", "7","213"].indexOf(cat) > -1){
                kousatsuFlag = true;
            }
        }
        if(kousatsuFlag && ul.childNodes.length < 8){
            // 考察記事はこっち
            ul.appendChild(li);
        } else if(ul2.childNodes.length < 5){
            // その他記事はこっち
            ul2.appendChild(li);
        }
    }
    let $articleCard = $(`<div class="row">
            <div class="col-12 col-lg-6">
                <div class="card">
                    <div class="card-header bg-info" style='color:white'>
                        <i class="far fa-newspaper"></i> スタイル考察記事
                    </div>
                    <div class="card-body text-nowrap" style="padding:0px 5px; overflow-x: auto;">${ul.outerHTML}</div>
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="card">
                    <div class="card-header bg-primary" style='color:white'>
                        <i class="far fa-newspaper"></i> その他 攻略記事
                    </div>
                    <div class="card-body text-nowrap" style="padding:0px 5px; overflow-x: auto;">${ul2.outerHTML}</div>
                </div>
            </div>
        </div>
        `);
    $(".title-text").after($articleCard);
}
function rssCallbackCat(results, target=".container") {
    var ul = document.createElement("ul");
    ul.className = "trianglelist list5";
    for (var i = 0; i < results.length; i++) {
        var entry = results[i];
        var li = document.createElement("li");
        var a = document.createElement("a");
        
        a.setAttribute("title", entry.title);
        a.setAttribute("href", entry.link);
        a.setAttribute("target", "_blank");
        a.appendChild(document.createTextNode(entry.title));
        li.appendChild(a);
        ul.appendChild(li);
    }
    let $articleCard = $(`<div class="card" style="margin:10px 0px;"><div class="card-header bg-primary" style='color:white'><i class="fas fa-file-archive"></i> 永久保存版の記事</div></div>`);
    var $body = $(`<div class="card-body" style="padding:0px 5px;"></div>`);
    $body.append(ul);
    $articleCard.append($body);
    $(target).append($articleCard);
}

function getImgPath(target){
    return "https://romasagatool.com/img/" + target;
}
function getStyleIcon(rare, id, weapon, isPlaneIcon = false, isLazyLoad = false){
    var smallRare = rare.toLowerCase();
    var illust = $(`<button class="style_icon_illust"></button>`);
    if(isLazyLoad){
        illust.attr('data-bg',`https://romasagatool.com/img/style_icon/${id}.png`);
        illust.attr('style',`background-size:contain; background-color: rgba(0,0,0,0);`);
        illust.addClass("lazyload");
    } else {
        illust.attr('style',`background: url(https://romasagatool.com/img/style_icon/${id}.png) no-repeat; background-size:contain;`);
    }

    var wpDisp = (weapon != "") ? "" : "d-none";
    var weaponIcon = $(`<span class="icon_weapon ${wpDisp}"></span>`);
    if(weapon != ""){
        var wpIcon = ICON_LIST[weapon];
        if(isLazyLoad){
            weaponIcon.attr('data-bg',`https://romasagatool.com/img/icon/${wpIcon}.png`);
            weaponIcon.attr('style',`background-size: 100%; background-color: rgba(0,0,0,0);`);
            weaponIcon.addClass("lazyload");
        } else {
            weaponIcon.attr('style',`background: url(https://romasagatool.com/img/icon/${wpIcon}.png); background-size: 100%;`);
        }

    }
    var plane = (isPlaneIcon) ? "d-none" : "" ;
return $(`<span class="style ${id} style_icon_bg_${smallRare} style_icon_bg_base" data-id="${id}" data-rare="${rare}" data-type="${weapon}" style="display:inline-block; vertical-align: middle;">
${illust[0].outerHTML}
<span class="style_icon_frame_base style_icon_frame_${smallRare}"></span>
<span class="style_icon_rare_base icon_rare_${smallRare}"></span>
<span class="icon_weapon_frame ${wpDisp}"></span>
${weaponIcon[0].outerHTML}
<span class="CHECK_COVER icon_nocheck ${plane}"></span>
</span>`);
}

function getWeaponIcon(rare, id, weapon){
    var smallRare = rare.toLowerCase();
    var illust = $(`<button class="style_icon_illust"></button>`);
        illust.attr('data-bg',`https://romasagatool.com/img/equipment/${id}.png`);
        illust.attr('style',`background-size:contain; background-color: rgba(0,0,0,0);`);
        illust.addClass("lazyload");

    var wpIcon = ICON_LIST[weapon];
    var wpIconFrame = `<span class="icon_weapon_frame_small" style="" ></span>`;
    if(wpIcon != undefined){
        var weaponIcon = $(`<span class="icon_weapon_small "></span>`);
        weaponIcon.attr('data-bg',`https://romasagatool.com/img/icon/${wpIcon}.png`);
        weaponIcon.attr('style',`background-size: 100%; background-color: rgba(0,0,0,0);`);
        weaponIcon.addClass("lazyload");
    } else {
        wpIconFrame = ``;
        var weaponIcon = $(`<span></span>`);
    }
return $(`<span class="weapon ${id} style_icon_bg_${smallRare} weapon_icon_bg_base" data-id="${id}" data-rare="${rare}" data-type="${weapon}" style="display:inline-block; vertical-align: middle;">
${illust[0].outerHTML}
<span class="style_icon_frame_base style_icon_frame_${smallRare}"></span>
<span class="weapon_icon_rare_base icon_rare_${smallRare}"></span>
${wpIconFrame}
${weaponIcon[0].outerHTML}
</span>`);
}

function sortStyleId(styleInfoList, upperStyle = "SS", upperId = "new"){
    var rlist = {"SS":[],"S":[],"A":[]};
    for(let styleInfo of styleInfoList){
        var rare = styleInfo['Rarity'];
        rlist[rare].push(styleInfo['Id']);
    }
    var gt = (upperId == "new") ? -1 : 1;
    var lt = (upperId == "new") ? 1 : -1;
    rlist["SS"].sort(function(a,b){ if( a > b ) return gt; if( a < b ) return lt; return 0; });
    rlist["S"].sort(function(a,b){ if( a > b ) return gt; if( a < b ) return lt; return 0; });
    rlist["A"].sort(function(a,b){ if( a > b ) return gt; if( a < b ) return lt; return 0; });
    if(upperStyle == "SS") {
        return rlist["SS"].concat(rlist["S"]).concat(rlist["A"]);
    } else {
        return rlist["A"].concat(rlist["S"]).concat(rlist["SS"]);
    }
}

function copyToClipboard(targetID) {
    // コピー対象をJavaScript上で変数として定義する
    var copyTarget = document.getElementById(targetID);

    // コピー対象のテキストを選択する
    copyTarget.select();

    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");
    // コピーをお知らせする
    alert("コピーしました : " + copyTarget.value);
}
function getStarIcon(value){
    if (value >= 1) {
        iconPath = getImgPath("icon/icon_star10.png");
    } else if(value >= 0.7) {
        iconPath = getImgPath("icon/icon_star07.png");
    } else if(value >= 0.5){
        iconPath = getImgPath("icon/icon_star05.png");
    } else if(value > 0){
        iconPath = getImgPath("icon/icon_star03.png");
    } else {
        iconPath = getImgPath("icon/icon_star00.png");
    }
    return $(`<img class="icon-star" src="${iconPath}">`);
}

function getMyId(){
    var rand = "guest" + Math.floor(Math.random() * ( 999999999 - 100000000 ) + 100000000);
    if (localStorage !== undefined) {
        if(localStorage.uid !== undefined){
            rand =  localStorage.uid;
        } else if(localStorage.uniqid !== undefined) {
            rand = localStorage.uniqid;
        } else {
            localStorage.uniqid = rand;
        }
        return rand;
    } else {
        return false;
    }
}

var STAR_ONE = getImgPath("/icon/icon_star10.png");
var STAR_ZERO = getImgPath("/icon/icon_star00.png");
var VOTE = {
    "shukai" : 3,
    "hanyo" : 3,
    "only" : 3
};

function changeVoteStar(val, type){
    $(".vote").each(function(){
        valTmp = $(this).attr("data-value");
        typeTmp = $(this).attr("data-type");
        if(typeTmp == type){
            if(Number(valTmp) <= Number(val) ){
                $(this).attr("src", STAR_ONE);
            } else {
                $(this).attr("src", STAR_ZERO);
            }
        }
        VOTE[type] = Number(val);
    });        
}