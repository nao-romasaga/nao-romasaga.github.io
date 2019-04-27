// 動的に追加されるものに対してはonで対応する
//$(document).on('click', '.switch .toggle', function () {
//    $(this).toggleClass("accordionActive").next().slideToggle(300);
//});

var ABILITY_MASTER, STYLE_MASTER;
var tree;
$(document).on('click', '.abilityName', function () {
    let id = $(this).attr("abid");
    //console.log(id, ABILITY_MASTER[id]);
    displayAbilityHolder(ABILITY_MASTER[id]);
    scrollStyleList();
});
$(document).on('click', '.switch .toggle', function () {
    $(this).toggleClass("accordionActive").next().slideToggle(300);
});


$(function () {
    readFile('Ability', function (result) {
        ABILITY_MASTER = result;
        initial();
        $('.container').on('click', function(){});
    });
    readFile('Style', function (result) {
        STYLE_MASTER = result;
        $('.container').on('click', function(){});
    });
});

function scrollStyleList() {
    $("html,body").animate({scrollTop: $('#abilty_label').offset().top});
}

function sortTree(tmpList) {
    let mainList = ["", "ダメージ強化", "自身強化(バフ)", "敵弱体化(デバフ)", "状態異常付与", "HP回復", "BP回復", "状態異常解除"];
    let subList = ["腕力", "体力", "器用さ", "素早さ", "知力", "精神", "愛", "魅力",
        "毒", "暗闇", "スタン", "マヒ", "眠り", "石化", "混乱", "魅了", "狂戦士", "気絶",
        "毒耐性", "暗闇耐性", "スタン耐性", "マヒ耐性", "眠り耐性", "石化耐性", "混乱耐性", "魅了耐性", "狂戦士耐性", "気絶耐性",
        "全て", "技", "術"];
    let result = [];
    for (let main in tmpList) {
        let tmp3 = [];
        for (let sub in tmpList[main]) {
            let tmp2 = [];
            for (let size in tmpList[main][sub]) {
                let tmp1 = [];
                for (let idx in tmpList[main][sub][size]) {
                    tmp1.push(tmpList[main][sub][size][idx]);
                }
                tmp2.push({"name": size, "list": tmp1});
            }
            tmp3.push({"name": sub, "sort": subList.indexOf(sub), "list": tmp2});
        }
        result.push({"name": main, "sort": mainList.indexOf(main), "list": tmp3});
    }
    // メインの並び替え
    result.sort(function (a, b) {
        if (a.sort === -1)
            return 1;
        if (b.sort === -1 || a.sort === b.sort)
            return -1;
        return a.sort - b.sort;
    });
    // サブの並び替え
    for (let tmp of result) {
        tmp['list'].sort(function (a, b) {
            if (a.sort === -1)
                return 1;
            if (b.sort === -1 || a.sort === b.sort)
                return -1;
            return a.sort - b.sort;
        });
    }
    return result;
}

function initial() {
    let tmpList = {};
    for (let key in ABILITY_MASTER) {
        let row = ABILITY_MASTER[key];
        let main = row['main'];
        let sub = row['sub'];
        let size = row['size'];

        if (tmpList[main] === undefined) {
            tmpList[main] = {};
        }
        if (tmpList[main][sub] === undefined) {
            tmpList[main][sub] = {};
        }
        if (tmpList[main][sub][size] === undefined) {
            tmpList[main][sub][size] = [];
        }
        tmpList[main][sub][size].push(row);
    }

    tmpList = sortTree(tmpList);
    let ICON_LIST = {
        "自身強化(バフ)腕力": "icon_buff_str",
        "自身強化(バフ)体力": "icon_buff_vit",
        "自身強化(バフ)器用さ": "icon_buff_dex",
        "自身強化(バフ)素早さ": "icon_buff_agi",
        "自身強化(バフ)知力": "icon_buff_int",
        "自身強化(バフ)精神": "icon_buff_mnd",
        "自身強化(バフ)愛": "icon_buff_ai",
        "自身強化(バフ)魅力": "icon_buff_mi",
        "敵弱体化(デバフ)腕力": "icon_debuff_str",
        "敵弱体化(デバフ)体力": "icon_debuff_vit",
        "敵弱体化(デバフ)器用さ": "icon_debuff_dex",
        "敵弱体化(デバフ)素早さ": "icon_debuff_agi",
        "敵弱体化(デバフ)知力": "icon_debuff_int",
        "敵弱体化(デバフ)精神": "icon_debuff_mnd",
        "敵弱体化(デバフ)愛": "icon_debuff_ai",
        "敵弱体化(デバフ)魅力": "icon_debuff_mi",
        "毒": "icon_doku", "暗闇": "icon_kurayami", "スタン": "icon_stan", "マヒ": "icon_mahi", "眠り": "icon_zzz",
        "石化": "icon_sekika", "混乱": "icon_konran", "魅了": "icon_miryo", "狂戦士": "icon_kyosenshi", "気絶": "icon_kizetsu",
    }
    for (let main of tmpList) {
        let li = $('<li>');
        let mainLink = '<a class="toggle menu parent">' + main['name'] + '</a>';
        li.append(mainLink);
        let ul = $('<ul class="inner child child01">');
        for (let sub of main['list']) {
            if (sub['name'] != "") {
                let subLink;
                let icon = "";

                if (ICON_LIST[main['name'] + sub['name']] !== undefined) {
                    icon = ICON_LIST[main['name'] + sub['name']];
                } else if (ICON_LIST[sub['name']] !== undefined) {
                    icon = ICON_LIST[sub['name']];
                } else if (ICON_LIST[sub['name'].replace("耐性", "")] !== undefined) {
                    icon = ICON_LIST[sub['name'].replace("耐性", "")];
                }

                if (icon !== "") {
                    let subIcon = $("<span>").addClass("icon_xs_zokusei").addClass(icon)
                            .addClass("text-nowrap")
                            .attr("style", "padding-left:30px;")
                            .text(sub['name']);
                    subLink = $("<a>").addClass("toggle menu").append(subIcon);
                } else {
                    subLink = '<a class="toggle menu">' + sub['name'] + '</a>';
                }

                let liSub = $('<li>');
                liSub.append(subLink);
                let ulSub = $('<ul class="inner child child02">');
                for (let size of sub['list']) {
                    for (let row of size['list']) {
                        let time = (row['time'] !== undefined && row['time'] !== "" && row['time'] !== null) ? " " + getTime(row['time']) : "";
                        let size = (row['size'] !== undefined && row['size'] !== "" && row['size'] !== null) ? " " + row['size'] : "";
                        let holders = " (" + row['Holders'].length + ")";
                        let disp = '<li class="abilityName" abid="' + row['Id'] + '"><p style="text-align:left;float: left;">' + row['Name'] + holders + "</p><p style='text-align:right;'><small>" + row['when'] + time + size + "</small></p></li>";
                        ulSub.append(disp);
                    }
                }
                liSub.append(ulSub);
                ul.append(liSub);
            } else {
                for (let size of sub['list']) {
                    for (let row of size['list']) {
                        let time = (row['time'] !== undefined && row['time'] !== "" && row['time'] !== null) ? " " + getTime(row['time']) : "";
                        let size = (row['size'] !== undefined && row['size'] !== "" && row['size'] !== null) ? " " + row['size'] : "";
                        let holders = " (" + row['Holders'].length + ")";
                        let disp = '<li class="abilityName" abid="' + row['Id'] + '"><p style="text-align:left;float: left;">' + row['Name'] + holders + "</p><p style='text-align:right;'><small>" + row['when'] + time + size + "</small></p></li>";
                        ul.append(disp);
                    }
                }
            }
        }
        li.append(ul);
        $("#sp_skill_tree > ul").append(li);
        // SP画面
//    if (getDevice() != "sp") {
//        initialSkillTree(tmpList);
//    } else {
//        }
    }
}

function initialSkillTree(tmpList) {
    for (let main in tmpList) {
        let mainList = {"name": main, "children": []};
        for (let sub in tmpList[main]) {
            var subList = {"name": sub, "children": []};
            for (let size in tmpList[main][sub]) {
                var sizeList = {"name": size, "children": []};
                for (let row of tmpList[main][sub][size]) {
                    let when = row['when'];
                    let time = row['time'];

                    let name = row['Name'] + "(" + when;
                    if (row['time'] !== undefined && time !== "") {
                        name += "/" + time + "(" + getTime(time) + ")";
                    }
                    name += ")";
                    sizeList['children'].push({"name": name, "id": row["Id"]});
                    /*
                     var whenList = {"name": when, "children": []};
                     for (let time in tmpList[main][sub][size][when]) {
                     let map = {"name": tmpList[main][sub][size][when][time]};
                     whenList['children'].push(map);
                     }
                     sizeList['children'].push(whenList);
                     */
                }
                subList['children'].push(sizeList);
            }
            mainList['children'].push(subList);
        }
        data['children'].push(mainList);
    }

    // 2. 描画用データの準備
    var width = document.querySelector("svg").clientWidth;
    var height = document.querySelector("svg").clientHeight;
    // 3. 描画用データの変換(ふわっと出る起点)
    root = d3.hierarchy(data);
    root.x0 = height / 2;
    root.y0 = 0;

    tree = d3.tree().size([height, width - 160]);

    // 4. svgデータの描画用データの変換
    g = d3.select("svg").append("g").attr("transform", "translate(80,0)");
    update(root);

    // 初期表示の場合はたたむ
    $(".node").each(function (i, d) {
        // この無理矢理感たるや
        if (i > 0 && i <= 16) {
            toggle(d["__data__"]);
            update(d["__data__"]);
        }
    });
}

function displayAbilityHolder(holders) {
    $("table#ability_holder_table tbody *").remove();
    for (key in holders['Holders']) {
        let styleId = holders['Holders'][key];
        let styleInfo = STYLE_MASTER[styleId];

        let tr1 = $("<tr>").addClass("darkButton");
        let td = $("<td>").attr('colspan', 2);
        let name = $("<small>").addClass('text-nowrap')
                .append(styleInfo['Name'] + styleInfo['AnotherName']);
        tr1.append(td.append(name));

        let tdAb = $("<td>").addClass("style-skill-window small").attr("style", "padding: 10px 20px !important; width:270px;");
        for (let lv in styleInfo['StyleAbilityIds']) {
            let abInfo = ABILITY_MASTER[styleInfo['StyleAbilityIds'][lv]];
            let ab = $("<span>").append(lv + ":" + abInfo["Name"])
                    .attr("data-toggle", "tooltip").attr("data-placement", "right")
                    .attr("data-html", 'true').attr("title", abInfo["FlavorText"].replace("　", "<br>"));
            tdAb.append(ab);
            if (lv !== 30) {
                tdAb.append("<br>");
            }
        }
        let tr2 = $("<tr>").addClass(getStyleBgColor(styleInfo['Rarity']));
        let rare = $("<span>").addClass('icon_rare_large float-left')
                .attr('style', getImgUrl('icon/icon_' + styleInfo['Rarity'] + ".png") +
                        "width:30px; height:30px; background-size:cover; position:absolute; z-index:3;");
        // スタイルアイコンの追加
        let icon = $("<button>")
                .addClass(getStyleIconClass(styleInfo['Rarity']))
                .attr("style", getImgUrl('style_icon/' + styleId + ".png"));
        let background = $("<span>")
                .addClass(getStyleIconBgClass(styleInfo['Rarity']))
                .append(icon);

        let tdImg = $("<td>").append(rare).append(background);
        tr2.append(tdAb).append(tdImg);

        $("table#ability_holder_table tbody").append(tr1).append(tr2);
        $('[data-toggle="tooltip"]').tooltip();
    }
}





// 以下、PCのグラフ用
// 5. クリック時の呼び出し関数
function toggle(d) {
    // childrenが定義されているかどうかで末端ノードを判断する
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    if (d.data["children"] === undefined) {
        let ab = ABILITY_MASTER[d.data["id"]];
        displayAbilityHolder(ab);
    }
}

// ６.svg要素の更新関数
var i = 0;
function update(source) {

    // tree レイアウト位置を計算
    tree(root);

    // 子、孫方向の位置設定
    root.each(function (d) {
        d.y = d.depth * 100;
    });

    // ノードデータをsvg要素に設定
    var node = g.selectAll('.node')
            .data(root.descendants(), function (d) {
                return d.id || (d.id = ++i);
            });

    // ノード enter領域の設定
    var nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", function (d) {
                toggle(d);
                update(d);
            });

    nodeEnter.append("circle")
            .attr("r", 5)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

    nodeEnter.append("text")
            .attr("x", function (d) {
                // ラベル表示位置
                return d.children || d._children ? -13 : 13;
            })
            .attr("dy", "3")
            .attr("font-size", "80%")
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                return d.data.name;
            })
            .style("fill-opacity", 1e-6);

    // ノード enter+update領域の設定
    var nodeUpdate = nodeEnter.merge(node);
    var duration = 500;

    nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

    nodeUpdate.select("circle")
            .attr("r", 8)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

    nodeUpdate.select("text")
            .style("fill-opacity", 1);

    // ノード exit領域の設定
    var nodeExit = node
            .exit()
            .transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

    nodeExit.select("circle").attr("r", 1e-6);

    nodeExit.select("text")
            .style("fill-opacity", 1e-6);

    // リンクデータをsvg要素に設定
    var link = g.selectAll(".link")
            .data(root.links(), function (d) {
                return d.target.id;
            });

    // リンク enter領域のsvg要素定義
    var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr("d", d3.linkHorizontal()
                    .x(function (d) {
                        return source.y0;
                    })
                    .y(function (d) {
                        return source.x0;
                    }));

    // リンク enter+update領域の設定
    var linkUpdate = linkEnter.merge(link);
    linkUpdate
            .transition()
            .duration(duration)
            .attr("d", d3.linkHorizontal()
                    .x(function (d) {
                        return d.y;
                    })
                    .y(function (d) {
                        return d.x;
                    }));

    // リンク exit領域の設定
    link.exit().transition()
            .duration(duration)
            .attr("d", d3.linkHorizontal()
                    .x(function (d) {
                        return source.y;
                    })
                    .y(function (d) {
                        return source.x;
                    })
                    )
            .remove();

    // 次の動作のために現在位置を記憶
    node.each(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

