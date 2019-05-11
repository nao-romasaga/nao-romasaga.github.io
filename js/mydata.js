var tableLimit = 15;
var MY_DATA_LIST = [];
var table;
$(".filterList").click(function () {
    $(this).parent().toggleClass("filterActive");
    if (table === undefined) {
        return;
    }
    filter();
    gtag('event', "clickFilter", {'event_category': "mydata", 'event_label': $(this).attr("href").substr(1), 'value': 1});
});
function filter() {
    let weaopnFilter = [];
    let seriesFilter = [];
    let weaopnLabel = [];
    let seriesLabel = [];
    $(".filterList").each(function () {
        let target = $(this).attr("data-type");
        let value = $(this).attr("href").substr(1);
        if ($(this).parent().hasClass("filterActive")) {
            if (target === "WeaponTypeFilter") {
                weaopnFilter.push({field: target, type: "=", value: value});
                weaopnLabel.push($(this).attr("data-label"));
            } else {
                seriesFilter.push({field: target, type: "=", value: value});
                seriesLabel.push(value);
            }
        }
    });

    let labels = "";
    table.clearFilter();
    let finalFilter = [{field: "SUM", type: ">", value: 0}];
    if (weaopnFilter.length > 0) {
        finalFilter.push(weaopnFilter);
        labels += "武器種:" + weaopnLabel.join(",");
    }
    if (seriesFilter.length > 0) {
        finalFilter.push(seriesFilter);
        if (labels !== "") {
            labels += " & "
        }
        labels += seriesLabel.join(",");
    }
    if (labels !== "") {
        labels += "<br>";
    }
    $("#label1").html(labels);
    table.setFilter(finalFilter);
    changeId2Dot();
}

$(".changeBase").click(function () {
    gtag('event', "clickBase", {'event_category': "mydata", 'event_label': $(this).text(), 'value': 1});
    let base = Number($(this).attr("data-base"));
    let pm = -1;
    let sort = "desc";
    if (base !== 0) {
        $("#label2").html($(this).text() + "周回時ステータス目標値");
    } else {
        $("#label2").html("ステータス一覧");
    }


    if (base !== 0) {
        pm = 1;
        sort = "asc";
    }
    for (let mydata of MY_DATA_LIST) {
        let sum = 0;
        for (let key of PARAM_KEY) {
            if (base === 0) {
                mydata[key] = mydata["org" + key];
                sum += mydata["org" + key];
            } else {
                let calc = (base + CHAR_MASTER[mydata["id"]]['MAX' + key] - mydata["org" + key]) * pm;
                if (calc > 0) {
                    mydata[key] = calc;
                    sum += calc;
                } else {
                    mydata[key] = "x"
                }
            }
        }
        mydata["SUM"] = sum;
    }
    drawTable(MY_DATA_LIST, sort);
    filter();
});

$(document).on('click', ".tabulator-header, .tabulator-footer, .tabulator-page", function () {
    changeId2Dot();
});
$(document).on('click', ".tabulator-cell", function () {
    $(this).parent().find(".tabulator-cell").each(function () {
        let id = $(this).text();
        if (id.indexOf("ID") > -1) {
            //console.log(CHAR_MASTER[id]);
        }
    });
});

let MY_DATA, CHAR_MASTER;
firebase.auth(appUsers).onAuthStateChanged((user) => {
    if (!user) {
        var uiConfig = {
            // ログイン完了時のリダイレクト先
            signInSuccessUrl: 'https://nao-romasaga.github.io/mydata.html',
            // 利用する認証機能
            signInOptions: [
                firebase.auth.TwitterAuthProvider.PROVIDER_ID
            ],
        };
        var ui = new firebaseui.auth.AuthUI(firebase.auth(appUsers));
        ui.start('#firebaseui-auth-container', uiConfig);
    } else {
        UID = user.uid;
        $(".noLogin").hide();
        $(".isLogin").removeClass("d-none");
        $("#loginInfo").hide();
        let icon = $("<img>").attr("src", user.photoURL)
                .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
        let name = `${user.displayName} さん:ログイン中`;
        $("#firebaseui-auth-container").addClass("bg-white kadomaru")
                .append(icon).append(name);
        readMyChar(function (read) {
            MY_DATA = read;
            if (MY_DATA !== undefined && CHAR_MASTER !== undefined) {
                init();
            }
        });
        readFile('Char', function (read) {
            CHAR_MASTER = read;
            if (MY_DATA !== undefined && CHAR_MASTER !== undefined) {
                init();
            }
        });
    }
});

function init() {
    let mydata = MY_DATA;
    for (let i in mydata) {
        //let src = `<img src="./img/dot/${CHAR_MASTER[i]['DotId']}.png">`;
        mydata[i]['id'] = i;
        mydata[i]['DotId'] = "Dot" + CHAR_MASTER[i]['DotId'];
        mydata[i]['Name'] = CHAR_MASTER[i]['Name'];
        mydata[i]['Series'] = CHAR_MASTER[i]['Series'];
        mydata[i]['WeaponType'] = ICON_LIST[CHAR_MASTER[i]['WeaponType']];
        mydata[i]['SeriesFilter'] = CHAR_MASTER[i]['Series'];
        mydata[i]['WeaponTypeFilter'] = ICON_LIST[CHAR_MASTER[i]['WeaponType']];

        for (let key of PARAM_KEY) {
            mydata[i]["org" + key] = mydata[i][key];
        }

        mydata[i]['SUM'] =
                Number(mydata[i]["STR"]) + Number(mydata[i]["VIT"]) + Number(mydata[i]["DEX"]) + Number(mydata[i]["AGI"]) +
                Number(mydata[i]["INT"]) + Number(mydata[i]["MND"]) + Number(mydata[i]["AI"]) + Number(mydata[i]["MI"]);
        MY_DATA_LIST.push(mydata[i]);
    }
    delete MY_DATA;
    drawTable(MY_DATA_LIST);
}

function changeId2Dot() {
    $("#example-table").find(".tabulator-cell").each(function () {
        let id = $(this).text();
        if (id.indexOf("Dot") > -1) {
            let src = `<img src="./img/dot/${id.substr(3)}.png" style="object-position: -10px -10px">`;
            $(this).html(src);
        } else if (id.indexOf("icon") > -1) {
            let src = `<span class="icon_mini_zokusei ${id}"></span>`;
            $(this).html(src);
        } else if (Number(id) < 5
                && $(this).attr("tabulator-field") !== "SUM"
                && $(this).attr("tabulator-field") !== "DotId") {
            let attr = $(this).attr("style");
            $(this).attr("style", attr + ' background-color: palegreen;');
        } else if (id.indexOf("x") > -1) {
            let attr = $(this).attr("style");
            $(this).attr("style", attr + ' background-color: lightslategray; color: white');
        }
    });
}

function drawTable(result, sort) {
    let dir = (sort === undefined) ? "desc" : sort;
    $("#example-table").remove();
    $("#example-table-display").append('<div id="example-table" style="width:100%"></div>');

    let base = {align: "right", sortable: true, sorter: "number", minWidth: 30, width: "8%"};
    table = new Tabulator("#example-table", {
        layout: "fitColumns",
        data: result,
        //layout: "fitColumns", //fit columns to width of table
        //responsiveLayout: "hide", //hide columns that dont fit on the table
        tooltips: false, //show tool tips on cells
        history: true, //allow undo and redo actions on the table
        pagination: "local", //paginate the data
        paginationSize: tableLimit, //allow 7 rows per page of data
        //movableColumns: true, //allow column order to be changed
        //resizableRows: true, //allow row order to be changed
        initialSort: [//set the initial sort order of the data
            {column: "SUM", dir: dir},
        ],
        autoResize: false,
        resizableRows: false,
        resizableColumns: false,
        responsiveLayout: true,
        columns: [
            {title: "", field: "DotId", width: 30, frozen: true},
            {title: "名前", field: "Name", responsive: 8},
            {title: "作品", field: "Series", width: 30, responsive: 10},
            {title: "武器", field: "WeaponType", width: 30, responsive: 9},
            {title: "", field: "id", visible: false},
            {title: "", field: "SeriesFilter", visible: false},
            {title: "", field: "WeaponTypeFilter", visible: false},
            Object.assign({title: "腕", field: "STR"}, base),
            Object.assign({title: "体", field: "VIT", }, base),
            Object.assign({title: "器", field: "DEX", }, base),
            Object.assign({title: "速", field: "AGI", }, base),
            Object.assign({title: "知", field: "INT", }, base),
            Object.assign({title: "精", field: "MND", }, base),
            Object.assign({title: "愛", field: "AI", }, base),
            Object.assign({title: "魅", field: "MI", }, base),
            {title: "合計", field: "SUM", sortable: true, sorter: "number"},
        ],
    });

    table.setFilter("SUM", ">", 0);
    changeId2Dot();
}