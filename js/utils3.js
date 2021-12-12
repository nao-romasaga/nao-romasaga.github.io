var BASE_URL = (location.href.indexOf("localhost") > -1) ? "http://localhost/nao-romasaga.github.io" :"https://nao-romasaga.github.io";
var articleStyleLimit = 8;
var articleOtherLimit = 8;
var device = getDevice();
var LIMIT_BASE = 165; // 45=710
var HP_MAX = (LIMIT_BASE * 10 + 260); // 現時点での最大MP、スタイル戦闘力で使う
var HP_LIMIT = HP_MAX + 110;
var URA = 12;
var URA_HP = 60;
var AUTO_RANKING_SCRIPT = "auto_ranking2";
var HEAL_SKILL = ['癒しの息吹','癒しの神託','オセチアクセル','年始の音','集気法','ふっかつ','ゴールデンシロップ','アイス二段','町長の舞','生命の水','生命の雨','活力の水','アースヒール','ヒールライト','月光','再生光','ケアル'];
var OPEN_GACHA = [
    "2021.12.10.3周年記念はじまりの扉へ サガ魂ガチャ ヌサカーン編",
    "2021.12.10.3周年記念はじまりの扉へ Romancing祭 ロックブーケ編",
    "2021.12.06.祝！12月6日で3周年！Romancing祭2021",
    "2021.12.06.祝！12月6日で3周年！Ultra DXガチャ",
    "2021.11.28.3周年記念はじまりの扉へ Romancing祭 リアム編",
    "2021.11.28.3周年記念はじまりの扉へ Romancing祭 カタリナ編",
    "2021.11.28.限定ガチャ汎用スタイル",
];

var WEAPON_MAP = {"剣" : {"master":50, "weapon":35},"大剣" : {"master":46, "weapon":35},"斧" : {"master":38, "weapon":35},"小剣" : {"master":42, "weapon":35},"槍" : {"master":46, "weapon":35},"弓" : {"master":34, "weapon":35},"棍棒" : {"master":38, "weapon":35},"体術" : {"master":50, "weapon":35},"銃" : {"master":34, "weapon":35},"杖" : {"master":50, "weapon":35},};

var RENSEI_PER = "GB,SF1,SSG,RSR = 80 / その他 = 108 / それ以外 = 70";

var EVENT_DEBUG = true;
var EVENT_ABILITY = [
    {"START":1639105200,"LIMIT":1640026800,"QUEST":"七英雄襲来！暗闇の制圧戦","UP":"2倍","NAME":"[期間限定] 七英雄襲来！暗闇の制圧戦","CHAR":["dotID4e64c","dotID4c89c","dotID34d50","dotID4cdb0","dotIDadbb0","dotID3852c","dotID4e6b0","dotID4c3ec","dotID38590","dotID4e264","dotID3a728","dotID340d0","dotIDadc78","dotID4bd48","dotID4e32c","dotID4ea34","dotID3965c","dotID358a4","dotID353f4","dotID1d13c"],"WEAPON":[],"ATTR":[],"SERIES":[]},
    {"START":1639105200,"LIMIT":1640026800,"QUEST":"七英雄襲来！暗闇の制圧戦","UP":"2倍","NAME":"[期間限定] 七英雄襲来！暗闇の制圧戦・RS2・詩人","CHAR":["dotIDc5cd8"],"WEAPON":[],"ATTR":[],"SERIES":["RS2"]},
    {"START":1638759600,"LIMIT":1640545200,"QUEST":"3周年記念！ミラクルデイパレード","UP":"2倍","NAME":"[期間限定] 3周年当日記念","CHAR":["dotIDadc78"],"WEAPON":[],"ATTR":[],"SERIES":[]},
    {"START":1638500400,"LIMIT":1640545200,"QUEST":"3周年記念！ミラクルデイパレード","UP":"2倍","NAME":"[期間限定] 3周年記念！ミラクルデイパレード","CHAR":["dotIDadbb0","dotID3852c","dotID4e6b0","dotID4c3ec","dotID38590","dotID4e264","dotID3a728","dotID340d0"],"WEAPON":[],"ATTR":[],"SERIES":[]},
    {"START":1638500400,"LIMIT":1640545200,"QUEST":"3周年記念！ミラクルデイパレード","UP":"2倍","NAME":"[期間限定] 3周年記念！ﾐﾗｸﾙﾃﾞｲﾊﾟﾚｰﾄﾞ・斧・体術","CHAR":[],"WEAPON":["体術","斧"],"ATTR":[],"SERIES":[]},
    {"START":1639105200,"LIMIT":1640026800,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 七英雄襲来！暗闇の制圧戦","CHAR":["dotID4e64c","dotID4c89c","dotID34d50","dotID4cdb0","dotIDadbb0","dotID3852c","dotID4e6b0","dotID4c3ec","dotID38590","dotID4e264","dotID3a728","dotID340d0","dotIDadc78","dotID4bd48","dotID4e32c","dotID4ea34","dotID3965c","dotID358a4","dotID353f4","dotID1d13c"],"WEAPON":[],"ATTR":[],"SERIES":[]},
    {"START":1638759600,"LIMIT":1640545200,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 3周年当日記念","CHAR":["dotIDadc78"],"WEAPON":[],"ATTR":[],"SERIES":[]},    
    {"START":1638500400,"LIMIT":1640545200,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 3周年記念！ミラクルデイパレード","CHAR":["dotIDadbb0","dotID3852c","dotID4e6b0","dotID4c3ec","dotID38590","dotID4e264","dotID3a728","dotID340d0"],"WEAPON":[],"ATTR":[],"SERIES":[]},
    {"START":1637982000,"LIMIT":1641322800,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 3周年記念②","CHAR":["dotID3884c","dotID38cfc","dotID4e840","dotID4ee80","dotID4c450","dotID4c7d4","dotID35c8c","dotID35d54","dotID339c8","dotID33af4","dotID971f8","dotID95f38","dotID1db00","dotID643e8","dotID1da9c"],"WEAPON":[],"ATTR":[],"SERIES":[]},
    {"START":1637982000,"LIMIT":1641322800,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 3周年記念①","CHAR":["dotIDadbb0","dotID3852c","dotID4e6b0","dotID4c3ec","dotID38590","dotID4e264","dotID3a728","dotID340d0","dotIDadc78"],"WEAPON":[],"ATTR":[],"SERIES":[]},
    {"START":1639105200,"LIMIT":1640026800,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 七英雄襲来！暗闇の制圧戦・RS2・詩人","CHAR":["dotIDc5cd8"],"WEAPON":[],"ATTR":[],"SERIES":["RS2"]},
    {"START":1637982000,"LIMIT":1641322800,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 3周年記念・大剣・銃","CHAR":[],"WEAPON":["大剣","銃"],"ATTR":[],"SERIES":[]},
    {"START":1638500400,"LIMIT":1640545200,"QUEST":"メイン","UP":"2倍","NAME":"[期間限定] 3周年記念！ﾐﾗｸﾙﾃﾞｲﾊﾟﾚｰﾄﾞ・斧・体術","CHAR":[],"WEAPON":["体術","斧"],"ATTR":[],"SERIES":[]},
];

var ROLE_GL_LIST = {
    "アタッカー" : "Attacker",
    "ディフェンダー" : "Defender",
    "ジャマー" : "Jammer",
    "サポーター" : "Supporter",
}

var RENSEI_ATTRS = {
    "A": {"Name":"威力+", "Type":"All", "Target": "None", "A":9, "S":18,"SS":27},
    "A1": {"Name":"斬+", "Type":"Attrs", "Target": "斬", "A":11, "S":22,"SS":33},
    "A2": {"Name":"打+", "Type":"Attrs", "Target": "打", "A":11, "S":22,"SS":33},
    "A3": {"Name":"突+", "Type":"Attrs", "Target": "突", "A":11, "S":22,"SS":33},
    "A4": {"Name":"熱+", "Type":"Attrs", "Target": "熱", "A":11, "S":22,"SS":33},
    "A5": {"Name":"冷+", "Type":"Attrs", "Target": "冷", "A":11, "S":22,"SS":33},
    "A6": {"Name":"陽+", "Type":"Attrs", "Target": "陽", "A":11, "S":22,"SS":33},
    "A7": {"Name":"陰+", "Type":"Attrs", "Target": "陰", "A":11, "S":22,"SS":33},
    "R1": {"Name":"全体攻撃+", "Type":"Range", "Target": "敵全体", "A":10, "S":20,"SS":30},
    "R2": {"Name":"たて攻撃+", "Type":"Range", "Target": "敵縦一列", "A":13, "S":26,"SS":39},
    "R3": {"Name":"よこ攻撃+", "Type":"Range", "Target": "敵横一列", "A":13, "S":26,"SS":39},
    "R4": {"Name":"単体攻撃+", "Type":"Range", "Target": "敵単体", "A":12, "S":24,"SS":36},
    "G1": {"Name":"男性+", "Type":"Gender", "Target": "男", "A":10, "S":20,"SS":30},
    "G2": {"Name":"女性+", "Type":"Gender", "Target": "女", "A":10, "S":20,"SS":30},
    "G3": {"Name":"性別不明+", "Type":"Gender", "Target": "不明", "A":10, "S":20,"SS":30},
    "LINE1": {"Name":"--黒鉄シリーズ--","Disabled":true},
    "S5": {"Name":"RS1+", "Type":"Series", "Target": "RS1", "A":12, "S":24,"SS":36},
    "S6": {"Name":"RS2+", "Type":"Series", "Target": "RS2", "A":12, "S":24,"SS":36},
    "S7": {"Name":"RS3+", "Type":"Series", "Target": "RS3", "A":12, "S":24,"SS":36},
    "S8": {"Name":"SF2+", "Type":"Series", "Target": "SF2", "A":12, "S":24,"SS":36},
    "S9": {"Name":"US・ES+", "Type":"Series", "Target": "USES", "A":12, "S":24,"SS":36},
    "LINE2": {"Name":"--エンシェントシリーズ--","Disabled":true},
    "S1": {"Name":"SF1+", "Type":"Series", "Target": "SF1", "A":12, "S":24,"SS":36},
    "S2": {"Name":"SSG+", "Type":"Series", "Target": "SS", "A":12, "S":24,"SS":36},
    "S3": {"Name":"SaGaRS+", "Type":"Series", "Target": "RSR", "A":12, "S":24,"SS":36},
    "S4": {"Name":"GB+", "Type":"Series", "Target": "GB", "A":12, "S":24,"SS":36},
};

var WEAPON_ATTR_LIST = {
    "力＋" : "STR",
    "器＋" : "DEX",
    "速＋" : "AGI",
    "知＋" : "INT",
    "火＋" : "INT","水＋" : "INT","土＋" : "INT","風＋" : "INT","光＋" : "INT","闇＋" : "INT",
};


var JUTSU_MASTER = {"hi":51,
"mizu":52,
"tsuchi":53,
"kaze":54,
"hikari":55,
"yami":56};
var WEAPON_MASTER = {
    1:"剣",
    2:"大剣",
    3:"斧",
    4:"棍棒",
    5:"体術",
    6:"銃",
    7:"小剣",
    8:"槍",
    9:"弓",
    10:"杖",
    51:"火術",
    52:"水術",
    53:"土術",
    54:"風術",
    55:"光術",
    56:"闇術",
};
var RENSEI_WEAPON = ["大剣","体術","弓"];

function getEventCharData(){
    var EVENT_STYLE = {};
    var date = new Date();
    // UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
    var now = Math.floor(date.getTime() / 1000);
    //reverseKey = Object.keys(EVENT_ABILITY).reverse();
    for (var i in EVENT_ABILITY) {
        var limit = EVENT_ABILITY[i]['LIMIT'];
        var start = EVENT_ABILITY[i]['START'];
        var quest = EVENT_ABILITY[i]['QUEST'];
        if ((limit > now && now > start) || EVENT_DEBUG) {
            var d = new Date(limit * 1000);
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var hour = ('0' + d.getHours()).slice(-2);
            var min = ('0' + d.getMinutes()).slice(-2);
            var limit = `${month}/${day} ${hour}:${min}まで`;
            if(EVENT_STYLE[quest] == undefined){
                EVENT_STYLE[quest] = [];
            }
            if(EVENT_STYLE[quest][limit] == undefined){
                EVENT_STYLE[quest][limit] = [];
            }
            EVENT_STYLE[quest][limit].push(EVENT_ABILITY[i]);
        }
    }
    return EVENT_STYLE;
}


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
    "火": "icon_hi", "水": "icon_mizu", "風": "icon_kaze",
    "土": "icon_tsuchi", "光": "icon_hikari", "闇": "icon_yami",
    "スタン": "icon_stan", "マヒ": "icon_mahi", "気絶": "icon_kizetsu", "即死": "icon_kizetsu", "毒": "icon_doku", "石化": "icon_sekika",
    "魅了": "icon_miryo", "眠り": "icon_zzz", "混乱": "icon_konran", "狂戦士": "icon_kyosenshi", "暗闇": "icon_kurayami",
    "B": "icon_b", "A": "icon_a", "S": "icon_s", "SS": "icon_ss",
    "腕力上昇": "icon_buff_str", "体力上昇": "icon_buff_vit", "器用さ上昇": "icon_buff_dex", "素早さ上昇": "icon_buff_agi",
    "知力上昇": "icon_buff_int", "精神上昇": "icon_buff_mnd", "愛上昇": "icon_buff_ai", "魅力上昇": "icon_buff_mi",
    "腕力低下": "icon_debuff_str", "体力低下": "icon_debuff_vit", "器用さ低下": "icon_debuff_dex", "素早さ低下": "icon_debuff_agi",
    "知力低下": "icon_debuff_int", "精神低下": "icon_debuff_mnd", "愛低下": "icon_debuff_ai", "魅力低下": "icon_debuff_mi",

    // gl
    "Sword": "icon_ken", "G.Sword": "icon_dken", "Axe": "icon_ono",
    "S.Sword": "icon_sken", "Spear": "icon_yari", "Bow": "icon_yumi",
    "Club": "icon_kon", "M.Arts": "icon_tai", "Gun": "icon_ju", "Staff": "icon_tsue",
    "Slash": "icon_gl_slash", "Pierce": "icon_gl_pierce", "Blunt": "icon_gl_strike",
    "Heat": "icon_gl_hot", "Cold": "icon_gl_rei", "Lightning": "icon_gl_rai",
    "Shadow": "icon_gl_inn", "Sun": "icon_gl_you",
    "Fire": "icon_hi", "Water": "icon_mizu", "Wind": "icon_kaze",
    "Earth": "icon_tsuchi", "Light": "icon_hikari", "Darkness": "icon_yami",
};
const GL_MAPPING = {
    "極小":"very small effect",
    "小":"small effect",
    "中":"medium effect",
    "大":"large effect",
    "特大":"very large effect",
    "極大":"extreme effect",
    "常時":"Always",
    "Weak攻撃":"Weak attack",
    "HP満タン時":"Full HP",
    "瀕死時":"At Critical HP",
    "Critical攻撃":"Critical attacks",
    "HPが満タンではない時":"HP is not full",
    "スタン":"stun",
    "混乱":"confusion",
    "気絶":"unconsciousness",
    "マヒ":"paralysis",
    "暗闇":"darkness",
    "魅了":"charm",
    "毒":"poizon",
    "眠り":"sleep",
    "石化":"petrification",
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
    "E": "6〜9",
    "D": "10〜14",
    "C": "15〜20",
    "B": "21〜27",
    "A": "28〜35",
    "S": "36〜44",
    "SS": "45〜55",
    "SSS": "56〜73",
    "SSSS": "74〜93",
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
function createList(list, key, value) {
    if(typeof list[key] == "undefined") {
        list[key] = value;
    }
    return list;
}

function add2List(list, target) {
    if(typeof list == "undefined") {
        list = target;
    } else {
        list += target;
    }
    return list;
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
    $('body').prepend("header<br>");
    var header = `
    <div class="header-image">
        <div class="fuchidori-white" style="position:absolute; left:0px; max-width:100%;">
            <a href="${BASE_URL}/index.html"><img src="https://romasagatool.com/img/header.png" style="max-width:80%;" alt="ロマンシング・サガ リ・ユニバース 便利ツール"></a>
        </div>
        <div class="d-none d-lg-block" style="position:absolute; left:calc(50% - 83px)">
            <img src="${BASE_URL}/img/cmn_logo01_sp.png" style="height: 80px; width: 163px;">
        </div>
        <div class="text-right login-card"></div>
        <div class="text-right info-card row width-max header-button-list">
            <a href="${BASE_URL}/login.html" class="col-4 icon_btn_positive text-center text-nowrap shadow-black" style="display: inline-block; padding: 5px 15px;"><i class="fab fa-twitter"></i> ログイン <i class="fab fa-google"></i></a> 
            <a href="${BASE_URL}/site.html" class="col-4 icon_btn_positive text-center text-nowrap" style="display: inline-block; width:110px; padding: 5px;">利用規約・免責</a> 
            <a href="${BASE_URL}/kifu.html" class="col-4 icon_btn_negative text-center text-nowrap" style="display: inline-block; width:100px; padding: 5px;">支援について</a>
        </div>
        <div class="d-none d-lg-block fuchidori-white text-center" style="position:absolute; width:100%; bottom:0px; font-size:8px;">
        © 2019 SQUARE ENIX CO., LTD. All Rights Reserved. Powered by Akatsuki Inc.
        </div>
    </div>    
    `;
    // <img src="https://romasagatool.com/img/icon/n14-icon-new.gif">
    $('body').prepend("humNav<br>");
    var humNav = `
    <div id="navArea" class="">
      <h-nav class="bg-simple">
        <div class="inner">
          <ul>
            <li><a href="https://romasagatool.com/blog/" target="_blank"><i class="far fa-newspaper"></i> 攻略ブログ</a></li>
            <li><input  id="acd-check2" class="acd-check" type="checkbox" checked>
                <label for="acd-check2" class="acd-label" 
                >人気のコンテンツ</label>
                <div class="acd-content">
                <a href="${BASE_URL}/autodamage.html"><i class="fas fa-crown"></i> ダメージランキング</a>
                <a href="${BASE_URL}/ourchar.html"><i class="fas fa-tasks"></i> 全スタイル ステータス上限一覧</a>
                </div>
            </li>
            <li><input  id="acd-checktool" class="acd-check" type="checkbox" checked>
                <label for="acd-checktool" class="acd-label" 
                >便利ツール</label>
                <div class="acd-content">
                <a href="${BASE_URL}/party.html"><i class="fas fa-check-circle"></i> ステータス上限チェック</a>
                <a href="${BASE_URL}/rensei.html"><i class="fas fa-gem"></i> 錬成武器チェック</a>
                <a href="${BASE_URL}/stylecheck.html"><i class="fas fa-tasks"></i> スタイル所持チェッカー</a>
                <a href="${BASE_URL}/damage.html"><i class="fas fa-calculator"></i> ダメージ計算</a>
                <a href="${BASE_URL}/auto.html"><i class="fas fa-robot"></i> 全力オートシミュレーター</a>
        
                </div>
            </li>
            <li><input  id="acd-checklogin" class="acd-check" type="checkbox" checked>
                <label for="acd-checklogin" class="acd-label" 
                >ログイン機能</label>
                <div class="acd-content">
                <a href="${BASE_URL}/home.html"><i class="fas fa-home"></i> ホーム</a>
                <a href="${BASE_URL}/mydata.html"><i class="fas fa-map-marked-alt"></i> マイデータ</a>
                </div>
            </li>
            <li><input  id="acd-check1" class="acd-check" type="checkbox" checked>
                <label for="acd-check1" class="acd-label" 
                >スタイル情報</label>
                <div class="acd-content">
                <a href="${BASE_URL}/style.html"><i class="fas fa-user"></i> 全スタイル情報 一覧</a>
                <a href="${BASE_URL}/styleranking.html"><i class="fas fa-user-check"></i> スタイル 評価ランキング</a>
                <a href="${BASE_URL}/limitdata.html"><i class="fas fa-user"></i> スタイルLv50 ステータス一覧</a>
                </div>
            </li>            
            <li><a href="${BASE_URL}/skill.html"><i class="fas fa-lightbulb"></i> 技・術 一覧</a></li>
            <li><input id="acd-checkAilments" class="acd-check" type="checkbox">
                <label for="acd-checkAilments" class="acd-label" 
                >状態異常成功率ランキング(タップで展開)</label>
                <div class="acd-content">
                <a href="${BASE_URL}/ranking/ailments/success/poizon.html"><span class="icon_xs icon_doku"></span> 毒 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/paralysis.html"><span class="icon_xs icon_mahi"></span> マヒ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/darkness.html"><span class="icon_xs icon_kurayami"></span> 暗闇 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/sleep.html"><span class="icon_xs icon_zzz"></span> 眠り 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/petrification.html"><span class="icon_xs icon_sekika"></span> 石化 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/stun.html"><span class="icon_xs icon_stan"></span> スタン 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/confusion.html"><span class="icon_xs icon_konran"></span> 混乱 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/charm.html"><span class="icon_xs icon_miryo"></span> 魅了 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/ailments/success/unconsciousness.html"><span class="icon_xs icon_kizetsu"></span> 気絶 成功率ランキング</a>
                </div>
            </li>
            <li><input id="acd-checkDebuff" class="acd-check" type="checkbox" checked>
                <label for="acd-checkDebuff" class="acd-label" 
                ><img src="https://romasagatool.com/img/icon/n14-icon-new.gif"> デバフ成功率ランキング(タップで展開)</label>
                <div class="acd-content">
                <a href="${BASE_URL}/ranking/debuff/success/str.html">腕力デバフ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/debuff/success/end.html">体力デバフ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/debuff/success/dex.html">器用さデバフ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/debuff/success/agi.html">素早さデバフ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/debuff/success/int.html">知力デバフ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/debuff/success/wil.html">精神デバフ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/debuff/success/lov.html">愛デバフ 成功率ランキング</a>
                <a href="${BASE_URL}/ranking/debuff/success/cha.html">魅力デバフ 成功率ランキング</a>
                </div>                
            </li>

            <li><a href="https://romasagatool.com/blog/archives/12737" target="_new"><i class="fas fa-lightbulb"></i> 技・術練達のやり方とおすすめ一覧 </a></li>
            <li><a href="${BASE_URL}/ability.html"><i class="fas fa-ring"></i> アビリティ 一覧</a></li>
            <li><a href="${BASE_URL}/weapon.html"><i class="fas fa-shield-alt"></i> 武器・防具・装飾品 一覧</a></li>
            <li><input  id="acd-checkknowledge" class="acd-check" type="checkbox" checked>
                <label for="acd-checkknowledge" class="acd-label" 
                >ゲームシステム解説</label>
                <div class="acd-content">
                <a class='yubi' href="https://romasagatool.com/blog/archives/10179" target="_new">最強戦闘力のスタイルランキング</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/10145" target="_new">戦闘力の上げ方</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/8224" target="_new">最強の2属性攻撃の組み合わせ</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=7">「術」と「属性」は別物</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=0">ステータス上限について</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=1">ステータス上昇率について</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=11">HP上昇率ってどれぐらい？</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/2687" target="_new">ステ上限がわかるエフェクトチェックのやり方</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=2">ダメージ計算について</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/1665" target="_new">防具は何装備すれば良い？</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=4">技・術の命中率</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=6">技ランクで上がるダメージ量</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=5">バフ・デバフの効果</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/15562" target="_new">技ランクで効果が変わる技・術一覧</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/14665" target="_new">錬成武器のアビリティ解説</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/15180" target="_new">錬成武器は何%でSS武器を超える？</a>
                <a class='yubi' href="https://romasagatool.com/blog/archives/14688" target="_new">錬成武器で多段攻撃と高威力技の比較</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=10">陣形補正は何を参照する？</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=12">連携/OD連携の行動順について</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=9">裏道場などの「強さに合った敵」とは？</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=3">聖石について</a>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=8">用語集</a>
                </div>
            </li>

            <li><a href="${BASE_URL}/login.html"><i class="fab fa-twitter"></i> ログイン <i class="fab fa-google"></i></a></li>
            <li><a href="${BASE_URL}/site.html"><i class="fas fa-exclamation-triangle"></i> 利用規約・免責</a></li>
            <li><a href="${BASE_URL}/kifu.html"><i class="fas fa-donate"></i> 支援について</a></li>
            <li>　</li>

            <li class="d-none menu-item"><a href="${BASE_URL}/inputchar.html"><i class="fas fa-edit"></i> まとめてステ入力</a></li>
            <li class="d-none menu-item"><a href="${BASE_URL}/calendar.html"><i class="fas fa-calendar"></i> イベント</a></li>
            <li class="d-none menu-item"><a href="${BASE_URL}/quest.html"><i class="fas fa-dragon"></i> クエスト一覧</a></li>  
          </ul>
          <ul>
      </ul>
      <ul class="bgcolor-brawn">
      </ul>          
        </div>
      </h-nav>
      <div class="toggle-btn toggle-btn-border"><span></span><span></span><span></span></div>
      <div id="mask"></div>
    </div>
    `;
    $('body').prepend("sliderMenu<br>");
    var sliderMenu = `
    <nav class="site-header text-nowrap d-none d-sm-block">
        <img class="d-sm-none blinking" src="https://romasagatool.com/img/icon/icon_arrow_right.png" style="position: fixed; right: 0px; height: 50px;">
        <ul>
            <li class="menu-item"><a href="https://romasagatool.com/blog/" target="_blank"><i class="far fa-newspaper"></i> 攻略ブログ</a></li>
            <li class="menu-item"><a href="${BASE_URL}/ourchar.html"><i class="fas fa-tasks"></i> ステータス上限</a></li>
            <li class="menu-item"><a href="${BASE_URL}/autodamage.html"><i class="fas fa-crown"></i> ダメージランキング</a></li>
            <li class="menu-item"><a href="${BASE_URL}/styleranking.html"><i class="fas fa-user-check"></i> スタイル評価</a></li>
            <!--<li class="menu-item"><a href="${BASE_URL}/calendar.html"><i class="fas fa-calendar"></i> イベント</a></li>-->
            
            <li class="d-none menu-item"><a href="${BASE_URL}/quest.html"><i class="fas fa-dragon"></i> クエスト一覧</a></li>
            <li class="menu-item dropdown position-relative text-center">
                <span class="DROPDOWN_OPEN yubi" onclick=""><i class="fas fa-search"></i> ゲームデータ検索 <i class="fas fa-sort-up d-none"></i><i class="fas fa-sort-down"></i></span>
                <a href="${BASE_URL}/style.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-user"></i> スタイル 一覧</a>
                <a href="${BASE_URL}/skill.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-lightbulb"></i> 技・術 一覧</a>
                <a href="${BASE_URL}/ability.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-ring"></i> アビリティ 一覧</a>
                <a href="${BASE_URL}/weapon.html" class="dropdown-item fuchidori-white" style="${closeMenuStyle}"><i class="fas fa-shield-alt"></i> 装備 一覧</a>
            </li>
            <li class="menu-item"><a href="${BASE_URL}/limitdata.html"><i class="fas fa-user"></i> スタイルLv50ステ一覧</a></li>
            <li class="menu-item"><a href="${BASE_URL}/knowledge.html"><i class="fas fa-book"></i> 豆知識</a></li>
        </ul>
        <ul class="bgcolor-brawn">
            <li class="menu-item"><a href="${BASE_URL}/home.html"><i class="fas fa-home"></i> ホーム</a></li>
            <li class="menu-item"><a href="${BASE_URL}/party.html"><i class="fas fa-check-circle"></i> ステータス上限チェック</a></li>
            <li class="menu-item"><a href="${BASE_URL}/rensei.html"><i class="fas fa-gem"></i> 錬成武器チェック</a></li>
            <li class="menu-item"><a href="${BASE_URL}/mydata.html"><i class="fas fa-map-marked-alt"></i> マイデータ</a></li>
            <!--<li class="menu-item"><a href="${BASE_URL}/inputchar.html"><i class="fas fa-edit"></i> まとめてステ入力</a></li>-->
            <li class="menu-item"><a href="${BASE_URL}/stylecheck.html"><i class="fas fa-tasks"></i> スタイル所持チェッカー</a></li>
            <li class="menu-item"><a href="${BASE_URL}/damage.html"><i class="fas fa-calculator"></i> ダメージ計算</a></li>
            <li class="menu-item"><a href="${BASE_URL}/auto.html"><i class="fas fa-robot"></i> 全力オートシミュレーター</a></li>
        </ul>
    </nav>    
    `;

    $('body').prepend("nav<br>");
    var nav = `
    <div class="header-area">
        ${header}
        ${sliderMenu}
        ${humNav}
    </div>
    <!--
    <img src="https://romasagatool.com/img/icon/qe15.gif">
    -->
    `;
    $('body').prepend("nav add start<br>");
    $('body').prepend(nav);
    $('body').prepend("nav add end<br>");
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
    var random = Math.floor(Math.random() * randChar.length);
    var png = getImgPath(`dot/${randChar[random]}.png`);

    var footer = `
    <div class="opacity" id="FOOTER" style="margin-top: 20px; position: relative; padding:10px;">
    <div class="row" style="margin-bottom:20px">
        <div class="col-12 col-sm-6 col-md-4">
            <input  id="acd-check2" class="acd-check" type="checkbox" checked>
                <label for="acd-check2" class="acd-label" 
                >人気のコンテンツ</label>
                <div class="acd-content">
                <a href="https://romasagatool.com/blog/" target="_blank"><i class="far fa-newspaper"></i> 攻略ブログ</a><br>
                <a href="${BASE_URL}/autodamage.html"><i class="fas fa-crown"></i> ダメージランキング</a><br>
                <a href="${BASE_URL}/ourchar.html"><i class="fas fa-tasks"></i> 全スタイル ステータス上限一覧</a><br>
                <a href="${BASE_URL}/styleranking.html"><i class="fas fa-user-check"></i> スタイル 評価ランキング</a><br>
                </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <input  id="acd-checktool" class="acd-check" type="checkbox" checked>
                <label for="acd-checktool" class="acd-label" 
                >便利ツール</label>
                <div class="acd-content">
                <a href="${BASE_URL}/party.html"><i class="fas fa-check-circle"></i> ステータス上限チェック</a><br>
                <a href="${BASE_URL}/rensei.html"><i class="fas fa-gem"></i> 錬成武器チェック</a><br>
                <a href="${BASE_URL}/stylecheck.html"><i class="fas fa-tasks"></i> スタイル所持チェッカー</a><br>
                <a href="${BASE_URL}/damage.html"><i class="fas fa-calculator"></i> ダメージ計算</a><br>
                <a href="${BASE_URL}/auto.html"><i class="fas fa-robot"></i> 全力オートシミュレーター</a><br>
                </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <input  id="acd-check1" class="acd-check" type="checkbox" checked>
                <label for="acd-check1" class="acd-label" 
                >スタイル・装備 情報</label>
                <div class="acd-content">
                <a href="${BASE_URL}/style.html"><i class="fas fa-user"></i> 全スタイル情報 一覧</a><br>
                <a href="${BASE_URL}/limitdata.html"><i class="fas fa-user"></i> スタイルLv50 ステータス一覧</a><br>
                <a href="${BASE_URL}/skill.html"><i class="fas fa-lightbulb"></i> 技・術 一覧</a><br>
                ・<a class='yubi' href="${BASE_URL}/knowledge.html?p=4">技・術の命中率について</a><br>
                ・<a class='yubi' href="${BASE_URL}/knowledge.html?p=7">「術」と「属性」は別物</a><br>
                ・<a class='yubi' href="${BASE_URL}/knowledge.html?p=6">技ランクで上がるダメージ量</a><br>
                ・<a class='yubi' href="https://romasagatool.com/blog/archives/15562" target="_new">技ランクで効果が変わる技・術一覧</a><br>
                ・<a class='yubi' href="https://romasagatool.com/blog/archives/8224" target="_new">最強の2属性攻撃</a><br>
                ・<a class='yubi' href="${BASE_URL}/knowledge.html?p=5">バフ・デバフについて</a><br>

                ・<a href="https://romasagatool.com/blog/archives/12737" target="_new">技・術練達のやり方とおすすめ一覧 </a><br>
                <a href="${BASE_URL}/ability.html"><i class="fas fa-ring"></i> アビリティ 一覧</a><br>
                <a href="${BASE_URL}/weapon.html"><i class="fas fa-shield-alt"></i> 武器・防具・装飾品 一覧</a><br>
                ・<a class='yubi' href="https://romasagatool.com/blog/archives/1665" target="_new">防具は何装備すれば良い？</a><br>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">    
            <input  id="acd-checkAilments" class="acd-check" type="checkbox" checked>
                <label for="acd-checkAilments" class="acd-label" 
                >状態異常成功率ランキング</label>
                <div class="acd-content">
                <a href="${BASE_URL}/ranking/ailments/success/poizon.html"><span class="icon_xs icon_doku"></span> 毒 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/paralysis.html"><span class="icon_xs icon_mahi"></span> マヒ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/darkness.html"><span class="icon_xs icon_kurayami"></span> 暗闇 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/sleep.html"><span class="icon_xs icon_zzz"></span> 眠り 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/petrification.html"><span class="icon_xs icon_sekika"></span> 石化 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/stun.html"><span class="icon_xs icon_stan"></span> スタン 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/confusion.html"><span class="icon_xs icon_konran"></span> 混乱 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/charm.html"><span class="icon_xs icon_miryo"></span> 魅了 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/ailments/success/unconsciousness.html"><span class="icon_xs icon_kizetsu"></span> 気絶 成功率ランキング</a><br>
                </div>
            <br>
        </div>
        <div class="col-12 col-sm-6 col-md-4">    
            <input  id="acd-checkDebuff" class="acd-check" type="checkbox" checked>
                <label for="acd-checkDebuff" class="acd-label" 
                >デバフ成功率ランキング</label>
                <div class="acd-content">
                <a href="${BASE_URL}/ranking/debuff/success/str.html">腕力デバフ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/debuff/success/end.html">体力デバフ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/debuff/success/dex.html">器用さデバフ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/debuff/success/agi.html">素早さデバフ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/debuff/success/int.html">知力デバフ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/debuff/success/wil.html">精神デバフ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/debuff/success/lov.html">愛デバフ 成功率ランキング</a><br>
                <a href="${BASE_URL}/ranking/debuff/success/cha.html">魅力デバフ 成功率ランキング</a><br>
                </div>
            <br>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
            <input  id="acd-checkknowledge" class="acd-check" type="checkbox" checked>
                <label for="acd-checkknowledge" class="acd-label" 
                >戦闘力 / ステータス</label>
                <div class="acd-content">
                <a class='yubi' href="https://romasagatool.com/blog/archives/10179" target="_new">最強戦闘力のスタイルランキング</a><br>
                <a class='yubi' href="https://romasagatool.com/blog/archives/10145" target="_new">戦闘力の上げ方</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=0">ステータス上限について</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=1">ステータス上昇率について</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=11">HP上昇率ってどれぐらい？</a><br>
                <a class='yubi' href="https://romasagatool.com/blog/archives/2687" target="_new">ステ上限の調べ方</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=10">陣形補正は何を参照する？</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=12">連携/OD連携の行動順について</a><br>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
            <input  id="acd-checkknowledge" class="acd-check" type="checkbox" checked>
                <label for="acd-checkknowledge" class="acd-label" 
                >その他</label>
                <div class="acd-content">
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=2">ダメージ計算について</a><br>
                <a class='yubi' href="https://romasagatool.com/blog/archives/14665" target="_new">錬成武器のアビリティ解説</a><br>
                <a class='yubi' href="https://romasagatool.com/blog/archives/15180" target="_new">錬成武器は何%でSS武器を超える？</a><br>
                <a class='yubi' href="https://romasagatool.com/blog/archives/14688" target="_new">錬成武器は多段攻撃と高威力技どっちが強い？</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=9">裏道場などの「強さに合った敵」とは？</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=3">聖石について</a><br>
                <a class='yubi' href="${BASE_URL}/knowledge.html?p=8">用語集</a><br>
                </div>
        </div>        
    </div>
    <br>

    Powered by <a href="https://twitter.com/nao_romasaga_rs" target="new">nao_romasaga_rs</a><br>
    Special thanks :<small>各種データ調査を参考にさせて頂いております<br>
    <a href="https://twitter.com/YamadaMeganeOre" target="new">山田メガネ</a>
    , <a href="https://twitter.com/chin_ohnck" target="new">ちん</a>
    , <a href="https://twitter.com/HarMakeIt" target="new">春巻</a>
    , <a href="https://twitter.com/littleblackbee1" target="new">小黒 蜂一</a>
    , <a href="https://twitter.com/mamu_romasaga" target="new">まむ</a>
    , <a href="https://twitter.com/NEIGEtan" target="new">ねいじゅ</a>
    , <a href="https://twitter.com/RSR60979033" target="new">まどい＿RSR</a>    
    , <a href="https://twitter.com/ruchigame" target="new">ruchi</a>
    , <a href="https://twitter.com/imonoki" target="new">imonoki</a>
    //<a href="https://twitter.com/" target="new"></a>, 
    </small><br>
    <a href="http://junglesurvey.web.fc2.com/" target="new">密林調査記録</a>
    , <a href="https://docs.google.com/spreadsheets/d/1-7VaZCUjcyOBYexa_nQ_yidzupaIhcn523EkBW2jrFU/edit#gid=0" target="new">ロマサガRS調査</a>
    , <a href="https://foollovers.com/" target="new">FOOL LOVERS</a><br>    
    © 2019 SQUARE ENIX CO., LTD. All Rights Reserved. Powered by Akatsuki Inc.<br>
    ILLUSTRATION: TOMOMI KOBAYASHI
    <span class="char-utau footer-liz dot dot_mid dot_liz"></span>
    <div class="row text-right" style="width:100%" id="DOT_FOOTER">
    <div class="col-1 offset-11"><span class="char-utau footer-liz dot dot_mid " style="background:url(${png})"></span></div>    
    </div>
    </div>`;

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
    ["IDaeaec","9900033"], // イーヴリン・魔女
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
    ["ID352ca","ID357dc"], //サルーイン、ミニオン
    ["ID353f4","ID357dc"],
    ["ID3406c","ID353f4"],
    ["ID358a4","ID35840"],
    ["ID3406c","ID340d0"],
    ["213900","ID353f4"],
    ["ID334bc","ID353f4"],
    ["211902","ID3357e"],
    ["211600","ID336ac",],
    ["220405","220306"],
    ["ID363c8","ID35cf4"],
    ["229304","ID37eef"],
    ["ID35c28","ID3771c"],
    ["ID3771c","ID35bc4"],
    ["ID3a72a","ID3a728"],
    ["ID393a0","ID3a278"],
    ["ID3a278","ID3965c"],
    ["ID388b0","711300"],
    ["ID38464","ID388b0"],
    ["IDad9bc","711300"],
    ["IDad63b","711106"],
    ["710109","711106"],
    ["IDad63b","710109"],
    ["ID4bfa0","ID4bf3c"],
    ["ID398b4","ID39850"],
    ["ID38ef6","ID398b4"],
    ["ID3a854","ID3a2dc"],
    ["ID39274","ID3a854"],
];

document.getElementById('debug').innerHTML = "調整<br>";

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
function dispChar2(master, option = {}) {
    let idx = {};
    //let result = {"RS1":[],"RS2":[],"RS3":[],};
    let result = [];

    for (let i in master) {
        if (master[i]['Holders'] === undefined) {
            continue;
        }
        var dotOption = {};
        if(typeof option != undefined && option['jutsu']) {
            dotOption['jutsu'] = master[i]['JutsuAttrs'];
        }

        let series = master[i]['Series'];
        if (idx[series] === undefined) {
            idx[series] = 0;
        }

        let dotId = master[i]['DotId'];
        let id = master[i]['Id'];
        let name = master[i]['Name'];
        var base = getCharBase2(id, dotId, name, '', true, dotOption);
        $("#SEC" + series).append(base);

        for(weaponTypeOrg of master[i]['WeaponType']) {
            let weaponType = ICON_LIST[weaponTypeOrg];

            if (idx[weaponType] === undefined) {
                idx[weaponType] = 0;
            }

            if(weaponType != "icon_tsue") {
                $("#_" + weaponType).append(base.clone());
            } else {
                for(attr of master[i]['JutsuAttrs']) {
                    tmpBase = base.clone();
                    tmpBase.find(`.${ICON_LIST[attr]}_sm`).remove();
                    $("#_" + ICON_LIST[attr]).append(tmpBase.clone());
                }
                if(master[i]['JutsuAttrs'].length == 0) {
                    $("#_icon_noJustu").append(base.clone());
                }
            }
            for(attr of master[i]['AttackAttrs']) {
                if(attr == "斬" && ["icon_ken" , "icon_dken" , "icon_ono"].indexOf(weaponType) > -1){
                    continue;
                } else if(attr == "突" && ["icon_sken" , "icon_yari" , "icon_yumi"].indexOf(weaponType) > -1){
                    continue;
                } else if(attr == "打" && ["icon_kon" , "icon_tai" , "icon_ju"].indexOf(weaponType) > -1){
                    continue;
                } else if(attr == "熱" && weaponType == "icon_tsue" && master[i]['JutsuAttrs'].indexOf("火") > -1){
                    continue;
                } else if(attr == "冷" && weaponType == "icon_tsue" && master[i]['JutsuAttrs'].indexOf("水") > -1){
                    continue;
                } else if(attr == "陽" && weaponType == "icon_tsue" && master[i]['JutsuAttrs'].indexOf("光") > -1){
                    continue;
                } else if(attr == "陰" && weaponType == "icon_tsue" && master[i]['JutsuAttrs'].indexOf("闇") > -1){
                    continue;
                }
                $("#_" + ICON_LIST[attr]).append(base.clone());
            }
        }
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
function getCharBase2(id, dotId, name, rare, isLazyLoad = false, option = {}){
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

    if(typeof option['jutsu'] != "undefined") {
        let jutsuBanner = $(`<div class="char-dot-jutsu-icon-div"></div>`);
        for(jutsu of option['jutsu']) {
            jutsuBanner.append($(`<span class="icon_xs ${ICON_LIST[jutsu]}_sm">　　</span>`));
        }
        base.append(jutsuBanner);
    }
    
    base.append(charDot);

    return base.clone();
}
function getKakuseiIcon(skillInfo, size = 40, jp = true){
    let iconClass = KAKUSEI_COLOR[skillInfo['KakuseiSozai']] + KAKUSEI_ICON[skillInfo['Kakusei']];
    let iconJp = (jp) ? KAKUSEI_JP[skillInfo['KakuseiSozai']] : skillInfo['KakuseiSozai'];

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

function formatDate(d) {
    return `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`.replace(/\n|\r/g, '');
}
function rssCallback(results) {

    var ul = document.createElement("ul");
    ul.className = "trianglelist list5";
    var ul2 = document.createElement("ul");
    ul2.className = "trianglelist list5";
    var catList = [];
    for (var i = 0; i < results.length; i++) {
        var entry = results[i];
        var li = document.createElement("li");
        var a = document.createElement("a");
        entry.title = entry.title.replace("【ロマサガRS】","");
        a.setAttribute("title", entry.title);
        a.setAttribute("href", entry.link);
        a.setAttribute("target", "_blank");

        var pub = new Date(entry.pubdate.replace(/-/g,"/"));
        var mod = new Date(entry.moddate.replace(/-/g,"/"));
        var newDay = new Date();
        newDay.setDate(newDay.getDate() - 1); // 記事が2日前より未来なら
        var modDay = new Date();
        modDay.setDate(modDay.getDate() - 2); // 記事が2日前より未来なら

        if(newDay < pub) {
            var img = document.createElement("img");
            img.setAttribute("src", 'https://romasagatool.com/img/icon/n14-icon-new.gif');
            a.appendChild(img);
            entry.title = " " + entry.title;
        } else if(newDay < mod && modDay < mod) {
            var img = document.createElement("img");
            img.setAttribute("src", 'https://romasagatool.com/img/icon/nb05-icon-up.gif');
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
        if(kousatsuFlag) {
            // 考察記事はこっち
            var date = (entry.pubdate == "") ? entry.oddate : entry.pubdate;
            catList.push({card:li, d:date});
        } else if(ul2.childNodes.length < articleOtherLimit){
            // その他記事はこっち
            ul2.appendChild(li);
        }
    }
    catList.sort(function(a,b){
        if(a.d < b.d) return 1;
        if(a.d > b.d) return -1;
        return 0;
    });    
    for(li of catList){
        // 考察記事はこっち
        if(ul.childNodes.length < articleStyleLimit){
            ul.appendChild(li['card']);
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

function getWeaponIcon(rare, id, weapon, label){
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
    var labelArea = $(`<span></span>`);
    if(label != undefined){
        labelArea = $(`<span class="icon-label"><div class="icon-label-inner">${label}</div></span>`);
    }
return $(`<span class="weapon ${id} style_icon_bg_${smallRare} weapon_icon_bg_base" data-id="${id}" data-rare="${rare}" data-type="${weapon}" style="display:inline-block; vertical-align: middle;">
${illust[0].outerHTML}
<span class="style_icon_frame_base style_icon_frame_${smallRare}"></span>
<span class="weapon_icon_rare_base icon_rare_${smallRare}"></span>
${wpIconFrame}
${weaponIcon[0].outerHTML}
${labelArea[0].outerHTML}
</span>`);
}

function getSkillIcon(skillId, size) {
    icon = getImgPath(`icon/tex_skill_${skillId}.png`);
    return $(`
    <span class="position-relative">
      <span class="icon-back-skill icon-back-skill-${size}">
        <span class="icon-skill icon-skill-${size}" style="background-image: url(${icon});">　</span>
      </span>
    </span>`);
}
function getAbilityIcon(abId, size) {
    icon = getImgPath(`icon/tex_ability_${abId}.png`);
    return $(`
    <span class="position-relative">
      <span class="icon-back-abiligy icon-back-skill-${size}">
        <span class="icon-skill icon-skill-${size}" style="background-image: url(${icon});">　</span>
      </span>
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

function getAbilityDamagePer(styleInfo, skillInfo, isRound, isWeak, isCritical, isHPMax, isNotHPMax) {
    let ability = 0;
    let attackAttrs = skillInfo['AttackAttributes'];
    let abName = [];
    //極小:2% 小:5% 中:10% 大:15% 特大:30% 極大:50%
    for (let key in styleInfo['StyleAbilityIds']) {
        let abilityId = styleInfo['StyleAbilityIds'][key];
        let abInfo = ABILITY_MASTER[abilityId];
        for(attr of abInfo['Attr']) {
            let turn = filterNumber(attr['turn']);
            if(turn > 0 // 効果ターンがあるものはターンチェックが必要なのでここではやらない
            || ["ダメージ強化", "全員強化(バフ)"].indexOf(attr['main']) == -1 
            || attr['time'].indexOf("必ず") == -1 // 確率発動はやらない
            || (attr['main'] == "全員強化(バフ)" && attr['sub'].indexOf("ダメージ") == -1) // ステバフはやらない
            ) {
                continue;
            }
            let size = filterNumber(attr['size']);
            // 氷炎の絆や戦士鼓舞が常時発動
            if(["常時", "武器装備時", "全ダメージ", "味方が全員生存している時"].indexOf(attr['sub']) > -1 
            || (isRound && attr['sub'] == "ラウンド開始時")
            || (isWeak && attr['sub'] == "Weak攻撃")
            || (isCritical && attr['sub'] == "Critical攻撃")
            || (isHPMax && attr['sub'] == "HP満タン時")
            || (isNotHPMax && attr['sub'] == "HPが満タンではない時")
            || (skillInfo['FlavorText'].indexOf("カウンター状態") > -1 && attr['sub'] == "カウンター攻撃")
            ) {
                ability += size;
                if((isRound && attr['sub'] == "ラウンド開始時")
                || (isCritical && attr['sub'] == "Critical攻撃")
                || (skillInfo['FlavorText'].indexOf("カウンター状態") > -1 && attr['sub'] == "カウンター攻撃")){
                    abName.push(abInfo['Name']);
                }
            } else if(attr['sub'].indexOf("属性") > -1) {
                subAttackAttr = attr['sub'].replace("属性攻撃","").replace("属性ダメージ","");
                if (attackAttrs.indexOf(subAttackAttr) > -1) { // 属性攻撃
                    ability += size;
                }
            } else if(["単体攻撃","範囲攻撃","全体攻撃"].indexOf(attr['sub']) > -1) {
                checkAttr = skillInfo['AttackArea']
                .replace("敵単体","単体攻撃")
                .replace("敵縦一列","範囲攻撃")
                .replace("敵横一列","範囲攻撃")
                .replace("敵全体","全体攻撃");
                if(attr['sub'] == checkAttr) {
                    ability += size;
                    abName.push(abInfo['Name']);
                }
            }
        }
    }
    ability += (isCritical && skillInfo['CriticalTargets'] != undefined && skillInfo['CriticalTargets'] !== "") ? 20 : 0;

    return [ability, abName];
}

/**
 * 文字列の中から数字だクエを抜き出す
 * @param String target 
 */
function filterNumber(target){
    return Number(target.replace(/[^0-9]/g, ''));
}
function filterPercent(target){
    return (""+target).replace(/[^0-9%]/g, '');
}


/**
 * オートシミュレーター、ダメージ計算機で使う装備アイコン表示
 */
var NOW_WEAPON = "";
function displayWeaponIcon(charInfo){
    if(NOW_WEAPON == charInfo['WeaponType']){
        return;
    }
    NOW_WEAPON = charInfo['WeaponType'];
    var weaponList = WEAPON_DATA[NOW_WEAPON];
    var ssList = (weaponList['SS'] != undefined) ? weaponList['SS'] : [];
    var sWeapon = {};
    
    for(wp of weaponList['S']){
        if(wp['Name'].indexOf("エンシェント") > -1){
        //if(wp['drop'].indexOf("章") > -1){
            sWeapon = wp;
            break;
        }
    }
    $(".STR-WEAPON").attr("data-STR",sWeapon["STR"] + 4).attr("data-DEX",sWeapon["DEX"])
        .attr("data-AGI",sWeapon["AGI"]).attr("data-INT",sWeapon["INT"]).attr("data-val",sWeapon["WeaponPower"]);
    $(".DEX-WEAPON").attr("data-STR",sWeapon["STR"]).attr("data-DEX",sWeapon["DEX"] + 4)
        .attr("data-AGI",sWeapon["AGI"]).attr("data-INT",sWeapon["INT"]).attr("data-val",sWeapon["WeaponPower"]);
    $(".AGI-WEAPON").attr("data-STR",sWeapon["STR"]).attr("data-DEX",sWeapon["DEX"])
        .attr("data-AGI",sWeapon["AGI"] + 4).attr("data-INT",sWeapon["INT"]).attr("data-val",sWeapon["WeaponPower"]);
    $(".INT-WEAPON").attr("data-STR",sWeapon["STR"]).attr("data-DEX",sWeapon["DEX"])
        .attr("data-AGI",sWeapon["AGI"]).attr("data-INT",sWeapon["INT"] + 4).attr("data-val",sWeapon["WeaponPower"]);
    $(".WEAPON_AREA").find(".style_icon_illust").each(function(){
        $(this).attr("style", `background-size: contain; background-color: rgba(0, 0, 0, 0);background-image: url("https://romasagatool.com/img/equipment/${sWeapon['Illust']}.png");`);
    });

    $(".TEMP_WEAPON").remove();
    $PLUS = { "力＋":"STR", "器＋":"DEX", "速＋":"AGI", "知＋":"INT", "火＋":"INT", "水＋":"INT", "土＋":"INT", "風＋":"INT", "光＋":"INT", "闇＋":"INT"};
    for(weapon of ssList){
        for(key in $PLUS) {
            idx = $PLUS[key];
            // 二段階進化
            if(weapon[key] != 0){
                weapon[idx] += 4;
                break;
            }
        }
        $ssWeapon = $("#SS-TEMPLATE").clone().removeAttr("id").removeClass("d-none").addClass("TEMP_WEAPON d-inline-block");
        $ssWeapon.attr("data-STR",weapon["STR"]).attr("data-DEX",weapon["DEX"])
        .attr("data-AGI",weapon["AGI"]).attr("data-INT",weapon["INT"])
        .attr("data-val",weapon["WeaponPower"])
        .attr("data-type",weapon["JutsuTypes"]);
        
        $ssWeapon.find(".WEAPON_NAME").text(weapon['Name']);
        $icon = $ssWeapon.find(".style_icon_illust");
        $icon.attr("style", `background-size: contain; background-color: rgba(0, 0, 0, 0);background-image: url("https://romasagatool.com/img/equipment/${weapon['Illust']}.png");`);
        $("#SS-TEMPLATE").after($ssWeapon);
    }
}

/**
 * 防具をクリックした場合に表示を切り替える
 * @param {*} target [STR/DEC/AGI/INT]
 */
function clickArmor(target) {
    for(key of ["MAIN","SUB","ACC"]) {
        armor = ARMOR_RANK_DATA[key][target]; 
        $(`#${key}_NAME`).text(ARMOR_RANK_DATA[key][target]['Name']);
        for(st of ["STR","DEX","AGI","INT"]){
            $(`#${key}_${st}`).text(ARMOR_RANK_DATA[key][target][st]);
        }
    }
}

/**
 * 武器、防具の値を反映する
 */
function changeStatus(){
    var result = {"STR":0,"DEX":0,"AGI":0,"INT":0};
    for(key of ["MAIN","SUB","ACC"]) {
        for(st of ["STR","DEX","AGI","INT"]){
            result[st] += Number($(`#${key}_${st}`).text());
        }
    }
    $(".WEAPON_AREA").find(".filterActive").each(function(){
        for(st of ["STR","DEX","AGI","INT"]){
            result[st] += Number($(this).attr(`data-${st}`));
        }
    });
    for(st of ["STR","DEX","AGI","INT"]){
        $(`#eq${st}`).val(result[st] + URA);
    }
}
function dispGachaStyle(){
    var gachaStyle = {};
    for(gacha of OPEN_GACHA){
        gachaStyle[gacha] = [];
    }
    for(styleId in STYLE_MASTER){
        var styleInfo = STYLE_MASTER[styleId];
        for(gacha of OPEN_GACHA){
            if(styleInfo['gacha'].indexOf(gacha) > -1 && styleInfo['gacha'].split("/").length == 1) {
                gachaStyle[gacha].push(styleInfo);
            }
        }
    }
    for(gacha in gachaStyle){
        var styleIdList = sortStyleId(gachaStyle[gacha], "SS", "old");
        for(styleId of styleIdList){
            styleInfo = STYLE_MASTER[styleId];
            var styleIcon = getStyleIcon(styleInfo['Rarity'], styleInfo['Id'], "", true);
            $("#GACHA_AREA").append(styleIcon);
        }
    }    
}


// 錬成関連
function getBestRenseiWeapon($base, $weaponType = null) {
    var id = $base.attr("data-id");
    var charInfo = CHAR_MASTER[id];
    let weaponType = $weaponType?? charInfo['WeaponType'];
    let my_list = [];
    
    if(typeof MY_RENSEI_LIST[weaponType] != "undefined") {
        my_list = my_list.concat(MY_RENSEI_LIST[weaponType]);
    } else if(weaponType == "杖" && $base.attr("data-jutsuattrs") != "") {
        for(idx in $base.attr("data-jutsuattrs")) {
            jutsuName = $base.attr("data-jutsuattrs")[idx] + "杖";
            if(typeof MY_RENSEI_LIST[jutsuName] != "undefined") {
                my_list = my_list.concat(MY_RENSEI_LIST[jutsuName]);
            }
        }
    } else {
        return [allList, multiList, singleList];
    }

    var allList = [];
    var multiList = [];
    var singleList = [];
    for(idx in my_list) {
        rensei = my_list[idx];
        base = $base.clone();
        var all = 0, single = 0, multi = 0;
        [all, single, multi] = getAbilityPer(base, RENSEI_ATTRS[rensei[`ab1`]], rensei[`ab1R`], all, single, multi);
        [all, single, multi] = getAbilityPer(base, RENSEI_ATTRS[rensei[`ab2`]], rensei[`ab2R`], all, single, multi);
        [all, single, multi] = getAbilityPer(base, RENSEI_ATTRS[rensei[`ab3`]], rensei[`ab3R`], all, single, multi);
        
        allRec = Object.assign({}, rensei);
        allRec['total'] = all;
        singleRec = Object.assign({}, rensei);
        singleRec['total'] = single;
        multiRec = Object.assign({}, rensei);
        multiRec['total'] = multi;
        allList.push(allRec);
        singleList.push(singleRec);
        multiList.push(multiRec);
    }
    allList.sort(function(a,b){
        return (a.total <= b.total) ? 1 : -1;
    });
    singleList.sort(function(a,b){
        return (a.total <= b.total) ? 1 : -1;
    });
    multiList.sort(function(a,b){
        return (a.total <= b.total) ? 1 : -1;
    });
    return [allList, multiList, singleList];
}

function getAbilityPer($base, attrs, rare, all, single, multi){
    var type = attrs["Type"];
    var target = attrs["Target"];
    var per = attrs[rare];
    if (type == "All"
    || (type == "Attrs" && $base.attr("data-attrs").indexOf(target) > -1)
    || (type == "Gender" && $base.attr("data-gender") == target)
    ) {
        all += per;
        single += per;
        multi += per;
    } else if (type == "Series") {
        if( $base.attr("data-series") == "OTR"
        || (target == "GB" && $base.attr("data-series").indexOf(target) > -1)
        || (target != "GB" && $base.attr("data-series") == target) ) {
            all += per;
            single += per;
            multi += per;
        }
    } else if (target == "敵全体") {
        multi += per;
    } else if (target == "敵単体") {
        single += per;
    }    
    return [all, single, multi];
}
var ICON_NAME = {
    "剣":101404700,
    "大剣":102404200,
    "斧":103403800,
    "小剣":107403800,
    "弓":109403800,
    "槍":108404100,
    "体術":105404200,
    "手袋":105404300,
    "棍棒":104404100,
    "銃":106403900,
    "火杖":151401200,
    "水杖":152401300,
    "風杖":154401200,
    "土杖":153401200,
    "光杖":155401200,
    "闇杖":156401200,
}

var SERIES_SORT = [
    'RS1','RS2','RS3','SF1','SF2','US','ES','SS','RSR','GB1','GB2','GB3','OTR'
];

var AB_ATTR_GL = {
    "常時" : "Anytime",
    "Weak攻撃" : "Weak attack",
    "Critical攻撃" : "Critical attack",
    "連携攻撃" : "Combo attack",
    "OD攻撃" : "OD attack",
    "カウンター攻撃" : "Counter attack",
    "全体攻撃" : "All-range attack",
    "範囲攻撃" : "Ranged attack",
    "瀕死時": "AT Critical HP",
    "斬属性攻撃": "Slash attack",
    "打属性攻撃": "Blunt attack",
    "突属性攻撃": "Pirce attack",
    "熱属性攻撃": "Heat attack",
    "冷属性攻撃": "Cold attack",
    "雷属性攻撃": "Lightning attack",
    "陽属性攻撃": "Sun attack",
    "陰属性攻撃": "Shadow attack",
};