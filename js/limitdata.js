var tableLimit = 15;
var CHAR_MASTER, STYLE_MASTER = [];
var table;
initialLoad();
var tableData = [];

async function initialLoad() {
    let styleFunc = readFile('Style', function (read) {
        STYLE_MASTER = read;
    });
    let charFunc = readFile('Char', function (read) {
        CHAR_MASTER = read;
    });
    await Promise.all([charFunc, styleFunc]);
    firebase.database().goOffline();
    firebase.database(appUsers).goOffline();

    for (let i in STYLE_MASTER) {
        let valueMap = CONST_STYLE_BONUS_VAL[STYLE_MASTER[i]['Rarity']];
        let tmpSt = {}
        for (let p of PARAM_KEY) {
            tmpSt[p] = 0;
        }
        for (let lv in valueMap) {
            let name = STYLE_MASTER[i]["StyleBonus"][lv];
            if (name === "全能力値") {
                for (let p of PARAM_KEY) {
                    tmpSt[p] += valueMap[lv];
                }
            } else {
                tmpSt[PARAM_KEY[PARAM_NAME.indexOf(name)]] += valueMap[lv];
            }
        }
        let tmpTable = {};
        let id = STYLE_MASTER[i]['Id'];
        let charId = STYLE_MASTER[id]['CharacterId'];
        tmpTable['Id'] = i;
        tmpTable['CharId'] = charId;
        tmpTable['Name'] = "<small>" + STYLE_MASTER[i]["Name"] + "<br>" + STYLE_MASTER[i]['AnotherName'] + "</small>";
        tmpTable['rare_icon'] = `./img/icon/icon_${STYLE_MASTER[i]['Rarity']}.png`;
        tmpTable['style_icon'] = `./img/style_icon/${STYLE_MASTER[i]['IllustId']}.png`;
        tmpTable['Series'] = CHAR_MASTER[charId]['Series'];
        tmpTable['WeaponType'] = `./img/icon/${ICON_LIST[CHAR_MASTER[charId]['WeaponType']]}.png`;
        tmpTable['RareFilter'] = STYLE_MASTER[i]['Rarity'];
        tmpTable['SeriesFilter'] = CHAR_MASTER[charId]['Series'];
        tmpTable['WeaponTypeFilter'] = ICON_LIST[CHAR_MASTER[charId]['WeaponType']];
        for (let key of PARAM_KEY) {
            tmpTable["OrgStyleBonusLv50" + key] = STYLE_MASTER[i]["StyleBonusLv50" + key];
            tmpTable["OrgStylePlusLv50" + key] = tmpSt[key];
            tmpTable["StyleBonusLv50" + key] = STYLE_MASTER[i]["StyleBonusLv50" + key];
            tmpTable["StyleBonusLv50" + key] += (tmpSt[key] > 0) ? "%+" + tmpSt[key] : "%";
            tmpTable["org" + key] = STYLE_MASTER[i]["Limit" + key];
            tmpTable["Limit" + key] = (STYLE_MASTER[i]["Limit" + key] === 99) ? "?" : LIMIT_BASE + STYLE_MASTER[i]["Limit" + key];
            tmpTable["Max" + key] = (tmpTable["Limit" + key] === "?") ? "?" :Math.floor(tmpTable["Limit" + key] * (1 + Number(STYLE_MASTER[i]["StyleBonusLv50" + key]) / 100)) + Number(tmpSt[key]);
        }
        tableData.push(tmpTable);
    }
    drawTable();
}

$(".baseValue").click(function () {
    $(".baseValue").each(function () {
        $(this).removeClass("icon_btn_off");
        $(this).addClass("icon_btn_on");
    });
    $(this).addClass("icon_btn_off");
    BASE = Number($(this).attr("data-id"));
    for (let i in tableData) {
        for (let key of PARAM_KEY) {
            tableData[i]["Limit" + key] = (tableData[i]["org" + key] === 99) ? "?" : BASE + tableData[i]["org" + key];
            tableData[i]["Max" + key] = (tableData[i]["Limit" + key] === "?") ? "?" 
            : Math.floor(tableData[i]["Limit" + key] * (1 + Number(tableData[i]["OrgStyleBonusLv50" + key]) / 100)) + tableData[i]["OrgStylePlusLv50"];
        }
    }
    sort = table.getSorters();
    drawTable();
    filter();
    table.setSort(sort);

});

$(".filterList").click(function () {
    $(this).parent().toggleClass("filterActive");
    if (table === undefined) {
        return;
    }
    filter();
    gtag('event', "clickFilter", {'event_category': "limitdata", 'event_label': $(this).attr("href").substr(1), 'value': 1});
});

function filter() {
    let weaopnFilter = [];
    let seriesFilter = [];
    let rareFilter = [];

    $(".filterList").each(function () {
        let target = $(this).attr("data-type");
        let value = $(this).attr("href").substr(1);
        if ($(this).parent().hasClass("filterActive")) {
            if (target === "WeaponTypeFilter") {
                weaopnFilter.push({field: target, type: "=", value: value});
            } else if (target === "RareFilter") {
                rareFilter.push({field: target, type: "=", value: value});
            } else {
                seriesFilter.push({field: target, type: "=", value: value});
            }
        }
    });

    table.clearFilter();
    let finalFilter = [];
    if (weaopnFilter.length > 0) {
        finalFilter.push(weaopnFilter);
    }
    if (seriesFilter.length > 0) {
        finalFilter.push(seriesFilter);
    }
    if (rareFilter.length > 0) {
        finalFilter.push(rareFilter);
    }
    table.setFilter(finalFilter);
}

function drawTable() {
    $("#example-table").remove();
    $("#example-table-display").append('<div id="example-table" style="width:100%"></div>');

    let base = {align: "right", sortable: true, sorter: "number", minWidth: 40, width: 40};
    let base2 = {align: "left", sortable: true, sorter: "number", minWidth: 75, width: 75};
    table = new Tabulator("#example-table", {
        height: "630px",
        layout: "fitData",
        data: tableData,
        //layout: "fitColumns", //fit columns to width of table
        tooltips: false, //show tool tips on cells
        history: true, //allow undo and redo actions on the table
        pagination: "local", //paginate the data
        paginationSize: tableLimit, //allow 7 rows per page of data
        //movableColumns: true, //allow column order to be changed
        //resizableRows: true, //allow row order to be changed
        initialSort: [//set the initial sort order of the data
            //{column: "size", dir: dir},
        ],
        autoResize: false,
        resizableRows: false,
        resizableColumns: false,
        //responsiveLayout: true,
        //responsiveLayout: "hide", //hide columns that dont fit on the table
        columns: [
            {title: "", field: "style_icon", width: 45, frozen: true, formatter: "image", formatterParams: {
                    height: "40px",
                    width: "40px",
                }},
            {title: "", field: "rare_icon", formatter: "image", formatterParams: {
                    height: "30px",
                    width: "30px",
                }},
            {title: "", field: "Id", visible: false},
            {title: "", field: "UserId", visible: false},
            {title: "", field: "RareFilter", visible: false},
            {title: "", field: "SeriesFilter", visible: false},
            {title: "", field: "WeaponTypeFilter", visible: false},
            {title: "rank", field: "rank", visible: false},
            {title: "作品", field: "Series", width: 30, responsive: 10}, // , responsive: 10
            {title: "武器", field: "WeaponType", width: 30, formatter: "image", formatterParams: {
                    height: "30px",
                    width: "30px",
                }},
            {title: "名前", field: "Name", formatter: "html"},
            Object.assign({title: "腕", field: "LimitSTR"}, base),
            Object.assign({title: "体", field: "LimitVIT", }, base),
            Object.assign({title: "器", field: "LimitDEX", }, base),
            Object.assign({title: "速", field: "LimitAGI", }, base),
            Object.assign({title: "知", field: "LimitINT", }, base),
            Object.assign({title: "精", field: "LimitMND", }, base),
            Object.assign({title: "愛", field: "LimitAI", }, base),
            Object.assign({title: "魅", field: "LimitMI", }, base),
            Object.assign({title: "腕% (Lv50)", field: "StyleBonusLv50STR"}, base2),
            Object.assign({title: "体% (Lv50)", field: "StyleBonusLv50VIT", }, base2),
            Object.assign({title: "器% (Lv50)", field: "StyleBonusLv50DEX", }, base2),
            Object.assign({title: "速% (Lv50)", field: "StyleBonusLv50AGI", }, base2),
            Object.assign({title: "知% (Lv50)", field: "StyleBonusLv50INT", }, base2),
            Object.assign({title: "精% (Lv50)", field: "StyleBonusLv50MND", }, base2),
            Object.assign({title: "愛% (Lv50)", field: "StyleBonusLv50AI", }, base2),
            Object.assign({title: "魅% (Lv50)", field: "StyleBonusLv50MI", }, base2),
            Object.assign({title: "腕(Lv50)", field: "MaxSTR"}, base2),
            Object.assign({title: "体(Lv50)", field: "MaxVIT", }, base2),
            Object.assign({title: "器(Lv50)", field: "MaxDEX", }, base2),
            Object.assign({title: "速(Lv50)", field: "MaxAGI", }, base2),
            Object.assign({title: "知(Lv50)", field: "MaxINT", }, base2),
            Object.assign({title: "精(Lv50)", field: "MaxMND", }, base2),
            Object.assign({title: "愛(Lv50)", field: "MaxAI", }, base2),
            Object.assign({title: "魅(Lv50)", field: "MaxMI", }, base2),
        ],
    });

}