var device = getDevice();
var LIMIT_BASE = 70;
var HP_LIMIT = 1000;

var EVENT_ABILITY = {
    1563735600: ["dotID36a38", "dotID35d54", "dotID39274", "dotID377e4"], // 7/22 夏ガチャ
    1565550000: ["dotID94f34", "dotID94f98", "dotID94ffc", "dotID95060"], // サガスカ2倍
    1565809200: ["dotID33518", "dotID7c8f8", "dotIDad764", "dotID33ce8", "dotID33770"], // 8/15 夏イベント
    1566154800: ["dotID4e264", "dotID4e840", "dotID4e714", "dotID4ec8c"], // 8/19 SF2
    1567623600: ["dotID334b4", "dotID33a2c", "dotID34328", "dotID38aa4"], // 9/4 海賊
    1568487600: ["dotID35cf0", "dotID3839c", "dotID3852c", "dotID38914", 
        "dotID37fb4", "dotID364c0","dotID4bb54","dotID361a0","dotID339c8",
        "dotID4ea34","dotID37eec","dotID3370c","dotID33518"], // 9/15 award
    1568919600: ["dotID336a8", "dotID34328", "dotID33db0",
    "dotID37b04","dotID35c8c", "dotID4e264",
    "dotID38590", "dotID384c8", // エレンカタリナ
    ], // 9/20 アワード2
    1569783600: ["dotID382d4","dotID3839c","dotID3852c","dotID38590","dotID386bc",
    "dotID38784",'dotID387e8','dotID3884c','dotID38914','dotID38978','dotID389dc',
    'dotID38aa4','dotID38b6c','dotID38d60','dotID38dc4','dotID38e28','dotID392d8',
    'dotID39274','dotID3a14c','dotID3a214','dotID38400','dotID3933c','dotID38cfc',
    'dotID3a2dc'
    ], // 9/30 RS3リマスター 
    1569870000: ["dotID384c8", "dotID38338",'dotID38464', // 10/01 award3
    "dotID36a38","dotID36c90","dotID3807c","dotID38ef0","dotID4bc80", // 打2倍
    ], 
    1571079600: ["dotID37b04","dotID3a2dc","dotID38cfc","dotID339c8","dotID37b68"], // ハロウィン
    
    1571338800: ["dotID339c8","dotID361a0","dotID364c0","dotID36b64","dotID37fb4","dotID38784","dotID38e28","dotID392d8","dotID4c7d4","dotIDad69c","dotID94ffc"], // ブルージュピックアップ
    1571598000: ["dotID4bb54","dotID4c3ec","dotID4c70c","dotID4c4b4",], // ブルージュピックアップ
    1572548400: ["dotID4bc80","dotID4bce4","dotID38978","dotID4c1f8","dotID4c2c0"], // SF1ピックアップ
    1573758000: ["dotID33644","dotID4e390","dotID336a8","dotID4e2c9","dotID33b58"], //温泉ピックアップ
    1574190000: ["dotID382d4","dotID38338","dotID3839c","dotID384c8","dotID3852c","dotID38590","dotID386bc",
    "dotID38784",'dotID387e8','dotID3884c','dotID38914','dotID38978','dotID389dc',
    'dotID38aa4','dotID38b6c','dotID38d60','dotID38dc4','dotID38e28',"dotID38ef0", 'dotID392d8',
    'dotID39274','dotID3a14c','dotID3a214','dotID38400','dotID3933c','dotID38cfc',
    'dotID3a2dc',"dotID38464"
    ], // 9/30 RS3リマスター (1574190000)
    1575140400: ["dotID35cf0","dotID4c450", "dotID38cfc","dotID35c28"], // クジンシー
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
const WEPON_ATTR = {
    "剣": "斬", "大剣": "斬", "斧": "斬",
    "小剣": "突", "槍": "突", "弓": "突",
    "棍棒": "打", "体術": "打", "銃": "打", "杖": "打"
};
const AREA_SHORT = {
    "敵単体": "単", "敵全体": "全", "敵縦一列": "縦", "敵横一列": "横", "味方単体": "味単", "自身": "自", "敵ランダム": "ラ"
};
const PARAM_KEY = ["STR", "VIT", "DEX", "AGI", "INT", "MND", "AI", "MI"];
const PARAM_KEY_HP = ["HP"].concat(PARAM_KEY);
const PARAM_NAME = ['腕力', '体力', '器用さ', '素早さ', '知力', '精神', '愛', '魅力'];
const PARAM_NAME_ONE = ['腕', '体', '器', '速', '知', '精', '愛', '魅'];
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
    "SS": "45〜54",
    "SSS": "55〜69",
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
    if (typeof OFUSE_FLG === 'undefined') {
        OFUSE_FLG = false;
    }

    if (localStorage.uid === "ncTVtjyH4qWQQLnMzpmdux39AoD3") {
        label = (typeof CONNECT_DB === undefined) ? CONNECT_DB : "";// + " 混雑度";
    } else if (OFUSE_FLG !== undefined && OFUSE_FLG) {
        label = "プレミアムユーザ枠";// 混雑度";
    } else {
        label = ""; //`サイト混雑度(${CONNECT_DB})`;
    }
    //lavel+= `:<span id="CONNECT">混雑中...</span>`;
    var newIcon = "<img src='./img/icon/icon_new.png'>";
    var upIcon = "<img src='./img/icon/icon_up.png'>";
    var newHot = "<img src='./img/icon/icon_hot.png'>";
    var nav = "";
    nav += '<nav class="navbar navbar-expand-lg navbar-light bg-light">';
    nav += '  <span class="char-aruku dot dot_mid dot_cat" style="position:absolute; left:0; top:0px;"></span>';
    nav += `  <div ><a class="navbar-brand" href="./index.html" style="left:30px; position:relative; line-height: 25px">ロマサガRS <br class="d-none d-lg-block">便利ツール<br>
                <small style="font-size:8px; color:gray;">${label}<span id="CONNECT_GAME" class="d-none"></span><span id="CONNECT_USER" class="d-none"></span></small></a></div>`;
    nav += '  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">';
    nav += '    <span class="navbar-toggler-icon"></span>';
    nav += '  </button>';
    nav += '  <div class="collapse navbar-collapse" id="navbarSupportedContent">';
    nav += '    <ul class="navbar-nav mr-auto ">';
    nav += '      <li class="nav-item text-center" id="headHome">';
    nav += '        <a class="nav-link RequireLoginMenu d-none" href="./home.html"><i class="fas fa-home" style="font-size:30px"></i></a>';
    nav += '        <a class="nav-link LoginHideMenu" href="./home.html"><i class="fas fa-home" style="font-size:30px"></i></a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headCalendar">';
    nav += '        <a class="nav-link" href="./calendar.html">イベント<br class="d-none d-lg-block2">カレンダー</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="">';
    nav += '        <a class="nav-link" href="./knowledge.html">知っておきたい豆知識</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headAuto">';
    nav += '        <a class="nav-link" href="./auto.html">全力AUTO<br class="d-none d-lg-block2">シミュレーター ' + newHot + '</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headAutoDamage">';
    nav += '        <a class="nav-link" href="./autodamage.html">全力AUTO<br class="d-none d-lg-block2">ダメージランキング ' + newIcon + '</a>';
    nav += '      </li>';
    // nav += '  <li class="nav-item dropdown">';
    // nav += '    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    // nav += '      攻略おすすめパーティ';
    // nav += '    </a>';
    // nav += '    <div class="dropdown-menu bg-white" aria-labelledby="navbarDropdown">';
    // nav += '      <a class="dropdown-item" href="./partylist.html">周回攻略おすすめ<br class="d-none d-lg-block2">パーティ編成</a>';
    // nav += '      <a class="dropdown-item" href="./robin.html">R杯攻略<br class="d-none d-lg-block2">パーティ編成</a>';
    // nav += '    </div>';
    // nav += '  </li>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headOurchar">';
    nav += '        <a class="nav-link" href="./ourchar.html">キャラクター<br class="d-none d-lg-block2">育成ランキング ' + newHot + '</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headParty">';
    nav += '        <a class="nav-link" href="./party.html">育成パーティ<br class="d-none d-lg-block2">上限チェック</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headInputchar">';
    nav += '        <a class="nav-link" href="./inputchar.html">まとめて<br class="d-none d-lg-block2">ステータス登録</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headMydata">';
    nav += '        <a class="nav-link" href="./mydata.html">周回適正<br class="d-none d-lg-block2">キャラチェック</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headLimitdata">';
    nav += '        <a class="nav-link" href="./limitdata.html">スタイル補正値+<br class="d-none d-lg-block2">補正込み最大ステ一覧</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item" id="headStyleCheck">';
    nav += '        <a class="nav-link" href="./stylecheck.html">スタイル所持<br class="d-none d-lg-block2">チェッカー</a>';
    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headOurStyle">';
//    nav += '        <a class="nav-link" href="./ourstyle.html">みんなの<br class="d-none d-lg-block2">スタイル</a>';
//    nav += '      </li>';
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
//    nav += '        <a class="nav-link" href="./skill.html">技・術<br class="d-none d-lg-block2">検索</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headAbility">';
//    nav += '        <a class="nav-link" href="./ability.html">アビリティ<br class="d-none d-lg-block2">検索</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headStyle">';
//    nav += '        <a class="nav-link" href="./style.html">キャラ+<br class="d-none d-lg-block2">スタイル詳細</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headDamage">';
//    nav += '        <a class="nav-link" href="./damage.html">ダメージ<br class="d-none d-lg-block2">計算</a>';
//    nav += '      </li>';
//    nav += '      <li class="nav-item" id="headDojo">';
//    nav += '        <a class="nav-link" href="./dojo.html">特訓<br class="d-none d-lg-block2">タイマー</a>';
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
    nav += '        <a class="nav-link" href="./site.html">利用規約・<br class="d-none d-lg-block2">免責事項</a>';
    nav += '      </li>';
    nav += '      <li class="nav-item " id="headKifu">';
    nav += '        <a class="nav-link" href="./kifu.html">寄付に<br class="d-none d-lg-block2">ついて</a>';
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

    let title3 = "現在の負荷状況とお礼";
    let word3 = "";
    let info3 = `<div class="card"><div class="card-header bg-primary" style='color:white'>${title3}</div><div class="card-body">${word3}</div></div>`;
    //$(".title-text").after(info3);

    let title2 = "最新の記事";
    let word2 = "";
//            "<a href='http://romasagatool.com/blog/'>まとめ+開発ブログ始めました</a><br>" +
//            "便利ツールを使った比較検討考察や、開発ブログなどを投稿していく予定です"
//            "<a href='knowledge.html'>他では教えてくれないロマサガRSの豆知識</a>を更新しました<br>"+
//            "・[聖石について]に[ありがちな聖石セット失敗例]を追加<br>"+
//            "他にもこれについての情報教えて欲しい。というのがありましたら<a href='https://peing.net/ja/nao_romasaga_rs' target='_blank'>質問箱</a>まで";
    //"<a href='./robin.html'>R杯攻略パーティ</a>を公開しました<hr>"+
    //"週末はR杯ですね(๑′ᴗ‵๑)戦略が大事なR杯の攻略は<a href='./robin.html'>R杯攻略パーティ</a>に登録されているパーティを試してみましょう<br>"+
    //"目指せ怪傑5クリア！(･∀･)<br>"
    //word2 +="<hr>巷ではヘイトを減らすアビリティ+パリイ戦術で賑わってますね(๑′ᴗ‵๑)<br>ヘイトを減らすアビリティを所持しているスタイルは<a href='ability.html' style='font-size:18px;'>アビリティ検索</a>で調べることができます";
    //let info2 = `<div class="card"><div class="card-header bg-info" style='color:white'>${title2}</div><div class="card-body" id="archives">${word2}</div></div>`;
    //$(".title-text").after(info2);

    var randChar = [
        "ID382d4","ID38338","ID3839c","ID384c8","ID3852c","ID38590","ID386bc",
        "ID38784",'ID387e8','ID3884c','ID38914','ID38978','ID389dc',
        'ID38aa4','ID38b6c','ID38d60','ID38dc4','ID38e28',"ID38ef0", 'ID392d8',
        'ID39274','ID3a14c','ID3a214','ID38400','ID3933c','ID38cfc',
        'ID3a2dc',"ID38464"        
    ];

    var footer = "";
    footer += '<div class="opacity" id="FOOTER" style="position: relative;">';
    footer += '<span class="kadomaru RequireLoginMenu logout d-none" style="background-color: rgba(42,169,239,1); color:white; padding: 2px 5px; background-size: 340px 40px; width:340px" onclick=""><i class="fab fa-twitter"></i>ログアウト</span><br>'
    footer += 'Powered by <a href="https://twitter.com/nao_romasaga_rs" target="new">nao_romasaga_rs</a><br>';
    footer += 'Special thanks <small>';
    footer += '<a href="https://twitter.com/PeNN128RS" target="new">こやん</a>, ';
    footer += '<a href="https://twitter.com/imonoki" target="new">imonoki</a>, ';
    footer += '<a href="https://twitter.com/chin_ohnck" target="new">ちん</a>, ';
    footer += '<a href="https://twitter.com/HarMakeIt" target="new">春巻</a>, ';
    footer += '<a href="https://twitter.com/NEIGEtan" target="new">ねいじゅ</a>, ';
    footer += '<a href="https://twitter.com/ruchigame" target="new">ruchi</a>';
    //footer += '<a href="https://twitter.com/" target="new"></a>, ';
    footer += '</small><br>';
    footer += '© 2019 SQUARE ENIX CO., LTD. All Rights Reserved. Powered by Akatsuki Inc.<br>';
    footer += 'ILLUSTRATION: TOMOMI KOBAYASHI';
    //footer += '<span class="char-utau footer-liz dot dot_mid dot_liz"></span>';
    footer += '<div class="row text-right" style="width:100%" id="DOT_FOOTER">';
    for(var i=0;i<5;i++){
        var random = Math.floor(Math.random() * randChar.length);
        footer += `<div class="col-1 offset-1"><span class="char-utau footer-liz dot dot_mid " style="background:url(../img/dot/${randChar[random]}.png)"></span></div>`;
    }    
    footer += '</div>';
    //footer += '<hr>';
    //footer += '利用規約・免責事項<br>';
    //footer += '当サイトは趣味で運営してる非公式のゲーム攻略サイトです。各社の協力や要請の元作成されたものではありません。また情報の内容の一切の保障を致しません。当サイトを利用したことにより発生する全ての損害を、当管理人はいかなる場合でも一切の責任を負いません。<br>';
    //footer += '当サイトの内容、データ、プログラムの複製を固く禁じます。テキスト、画像の著作権は各社に帰属するものであり当サイトからの引用を固く禁じます。<br>';
    footer += '</div>';
    let imgTank = $("<div>").attr("style", "display:none");
    for (let icon in ICON_LIST) {
        let img = $("<span>");
        let url = `background:url(./img/icon/${ICON_LIST[icon]}.png) no-repeat;`;
        img.attr("style", "background:url(" + url + ")");
        imgTank.append(img);
    }
    $('body').append(footer);
    $('body').append(imgTank);

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
    ["ID39274", "ID3a2dc"],
    ["ID35c2a", "ID36a46"],
    ["ID377e4", "ID35d54"],
    ["ID37fb6", "ID37eec"],
    ["ID37f52", "ID37fb6"],
    ["ID380e2", "ID36511"],
    ["IDad5d8", "IDad63a"],
    ["ID38018", "nushi_musume"],
    ["nushi_musume", "nushi"],
    ["nushi", "ID38018"],
    ["robing", "ID38914"],
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
        let url = `background:url(./img/dot/${pngName}.png) no-repeat; padding-top:35px;`;
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
    let $articleCard = $(`<div class="card"><div class="card-header bg-info" style='color:white'><i class="far fa-newspaper"></i> 最新の記事(永久保存版はページ下部)</div></div>`);
    var $body = $(`<div class="card-body" style="padding:0px 5px;"></div>`);
    $body.append(ul);
    $articleCard.append($body);
    $(".title-text").after($articleCard);
}
function rssCallbackCat(results) {
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
    $(".container").append($articleCard);
}