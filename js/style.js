var CHAR_MASTER, STYLE_MASTER, SKILL_MASTER;
var NOW_LV = 50;
var NOW_CHAR_INFO;
var NOW_STYLE_INFO;

const RARE_COLOR = {
    "SS": "background-color: rgb(246,236,100);",
    "S": "background-color: rgb(200,224,234);",
    "A": "background-color: rgb(247,170,150);"
};
const PARAM_NAME = ['腕力', '体力', '器用さ', '素早さ', '知力', '精神', '愛', '魅力'];

function readData() {
    firebase.database().ref('Char').once("value").then(function (snapshot) {
        CHAR_MASTER = snapshot.val();
        console.log(CHAR_MASTER);
        var optionList = {
            "RS1": "char_rs1", "RS2": "char_rs2", "RS3": "char_rs3",
            "SF1": "char_sf1", "SF2": "char_sf2",
            "US": "char_us", "SS": "char_ss", "RSR": "char_rsr"
        };
        var seriesList = {};
        for (let key in CHAR_MASTER) {
            let row = CHAR_MASTER[key];
            // スタイルなしは未実装なので弾く
            if (row['Holders'] !== undefined) {
                if (seriesList[row['Series']] == undefined) {
                    seriesList[row['Series']] = {};
                }
                seriesList[row['Series']][row['Name']] = key;
            }
        }
        for (let key in optionList) {
            addOption({"キャラクターを選択してください": 0}, optionList[key]);
            addOption(seriesList[key], optionList[key]);
        }
    });

    firebase.database().ref('Style').once("value").then(function (snapshot) {
        console.log(snapshot.val());
        STYLE_MASTER = snapshot.val();
    });
    firebase.database().ref('Skill').once("value").then(function (snapshot) {
        console.log(snapshot.val());
        SKILL_MASTER = snapshot.val();
    });
}

function dispSkillPattern(useBpList, skills) {
    let totalIryoku = 0;
    let result = [];
    for (let useBp of useBpList) {
        if (useBp === 0) {
            totalIryoku += 7;
            result.push(0);
        } else {
            var id = skills[useBp];
            totalIryoku += culcSkillDamage(SKILL_MASTER[id]['SkillIryoku'], 99);
            result.push(id);
        }
    }
    return {"total": totalIryoku, "list": result};
}

function isSkipAutoCulcSkill(skillInfo, bp) {
    if (bp <= 10 &&
            skillInfo['AttackArea'] !== "味方単体" &&
            skillInfo['AttackArea'] !== "自身" &&
            skillInfo['SkillIryoku'] !== "-"
            ) {
        return false;
    }
    return true;
}





////////////////////////////////////////////////////////////////////////////////////////////////
// 以下、グラフ描画用設定
////////////////////////////////////////////////////////////////////////////////////////////////
var margin = {top: 30, right: 50, bottom: 30, left: 50};
var width = Math.min(200, window.innerWidth / 4);// - margin.left - margin.right,
var height = Math.min(width, window.innerHeight);// - margin.top - margin.bottom);
var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    levels: 5,
    roundStrokes: false,
    labelFactor: 1.1,
    opacityArea: 0.1,
    maxValue: 100,
    //color: d3.scaleOrdinal().range(["#3cb371", "#ffd700", "#ff7f50", "#4169e1"]),
    legend: {title: 'スタイル', translateX: 120, translateY: 0, "font-size": "8px"},
    format: '.0f',
    unit: '%'
};

var lineChartOptions = {
    animationEnabled: true,
    theme: "light2",
    zoomEnabled: true,
    animationDuration: 1000,

    //title: {text: "Monthly Sales Data"},
    axisX: {
        //valueFormatString: "M"
    },
    axisY: {
        title: "補正値",
        suffix: "%",
        labelFormatter: addSymbols
    },
    axisY2: {
        title: "ステータス値",
        titleFontColor: "#C0504E",
        lineColor: "#C0504E",
        labelFontColor: "#C0504E",
        tickColor: "#C0504E",
        includeZero: false
    },
    toolTip: {
        shared: true
    },
    legend: {
        cursor: "pointer",
        itemclick: toggleDataSeries
    },
    data: []
};

function addSymbols(e) {
    var suffixes = ["", "K", "M", "B"];
    var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);

    if (order > suffixes.length - 1)
        order = suffixes.length - 1;

    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
}

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}