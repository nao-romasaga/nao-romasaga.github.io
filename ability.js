// 動的に追加されるものに対してはonで対応する
$(document).on('click', '.switch .toggle', function () {
    $(this).toggleClass("accordionActive").next().slideToggle(300);
});


setImgTag("icon/icon_a.png", "icon_A");
setImgTag("icon/icon_s.png", "icon_S");
setImgTag("icon/icon_ss.png", "icon_SS");

var ABILITY_MASTER, STYLE_MASTER;
var data = {"name": "Abiliry", "children": []};
var tree;
$(function () {
    firebase.database().ref('Ability').once("value").then(function (snapshot) {
        ABILITY_MASTER = snapshot.val();
        let tmpList = {};
        for (let key in ABILITY_MASTER) {
            let row = ABILITY_MASTER[key];
            let main = row['main'];
            let sub = row['sub'];
            let when = row['when'];
            let time = row['time'];
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
            /*
             if (tmpList[main][sub][size][when] === undefined) {
             tmpList[main][sub][size][when] = {};
             }
             if (tmpList[main][sub][size][when][time] === undefined) {
             tmpList[main][sub][size][when][time] = [];
             }
             */
            tmpList[main][sub][size].push(row);
        }
        if (getDevice() != "sp") {
            initialSkillTree(tmpList);
        } else {
            for (let main in tmpList) {
                let li = $('<li>');
                let mainLink = '<a class="toggle menu parent">' + main + '</a>';
                li.append(mainLink);
                let ul = $('<ul class="inner child child01">');
                for (let sub in tmpList[main]) {
                    if (sub != "") {
                        let liSub = $('<li>');
                        let subLink = '<a class="toggle menu">' + sub + '</a>';
                        liSub.append(subLink);
                        let ulSub = $('<ul class="inner child child02">');
                        for (let size in tmpList[main][sub]) {
                            for (let row of tmpList[main][sub][size]) {
                                let time = (row['time'] !== undefined && row['time'] !== "") ? " " + getTime(row['time']) : "";
                                let size = (row['size'] !== undefined && row['size'] !== "") ? " " + row['size'] : "";
                                let disp = '<li class="abilityName" abid="' + row['Id'] + '"><p style="text-align:left;float: left;">' + row['Name'] + "</p><p style='text-align:right;'><small>" + row['when'] + time + size + "</small></p></li>";
                                ulSub.append(disp);
                            }
                        }
                        liSub.append(ulSub);
                        ul.append(liSub);
                    } else {
                        for (let size in tmpList[main][sub]) {
                            for (let row of tmpList[main][sub][size]) {
                                let time = (row['time'] !== undefined && row['time'] !== "") ? " " + getTime(row['time']) : "";
                                let size = (row['size'] !== undefined && row['size'] !== "") ? " " + row['size'] : "";
                                let disp = '<li class="abilityName" abid="' + row['Id'] + '"><p style="text-align:left;float: left;">' + row['Name'] + "</p><p style='text-align:right;'><small>" + row['when'] + time + size + "</small></p></li>";
                                ul.append(disp);
                            }
                        }
                    }
                }
                li.append(ul);

                $("#sp_skill_tree > ul").append(li);
            }
            $(".abilityName").click(function () {
                let id = $(this).attr("abid");
                //console.log(id, ABILITY_MASTER[id]);
                displayAbilityHolder(ABILITY_MASTER[id]);
                scrollStyleList();
            });

        }
    });
});
function scrollStyleList() {
    $("html,body").animate({scrollTop: $('#abilty_label').offset().top});
}
firebase.database().ref('Style').once("value").then(function (snapshot) {
    //console.log(snapshot.val());
    STYLE_MASTER = snapshot.val();
});


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
    var imgPath = (getDevice() != "sp") ? "cutin" : "icon";
    for (key in holders['Holders']) {

        let styleId = holders['Holders'][key];
        let imgId = imgPath + styleId;
        let imgId2 = "tmp" + styleId;
        let imgSrc = "";
        // 画像が存在する場合は再取得しない
        if ($('#' + imgId).length == 0) {
            $("#imgTank").append("<img src=\"\" id=\"" + imgId + "\">");
            setImgTag("style_" + imgPath + "/" + styleId.substr(2) + ".png", imgId);
            setImgTag("style_" + imgPath + "/" + styleId.substr(2) + ".png", imgId2);
        } else {
            imgSrc = $("#" + imgId).attr('src');
        }
        let styleInfo = STYLE_MASTER[styleId];
        let rarityIcon = $("#icon_" + styleInfo['Rarity']).attr('src');

        let color = "background-color: rgb(246,236,100);}";
        if (styleInfo['Rarity'] === "A") {
            color = "background-color: rgb(247,170,150);}";
        } else if (styleInfo['Rarity'] === "S") {
            color = "background-color: rgb(200,224,234);}";
        }

        let col = "";
        let styleName = styleInfo['AnotherName'];
        let Name = styleInfo['Name'];
        let height = 50;
        if ((getDevice() != "sp")) {
            col += "<td><img src=\"" + rarityIcon + "\" height=" + height + "></td>";
            col += "<td class='text-center'>";
            col += "<img src=\"" + imgSrc + "\" height=" + height + " id=\"" + imgId2 + "\"><br>";
            col += "<small style='line-height:0px !important;'>" + Name;
            col += "<p class='xs-hide'>" + styleName + "</p>";
            col += "</small></td>";
            col += "<td class='xs-hide'>" + styleInfo['Skill'].join("<br>") + "</td>";
            let ab = [];
            for (let lv in styleInfo['StyleAbilityIds']) {
                let abId = styleInfo['StyleAbilityIds'][lv];
                let abInfo = ABILITY_MASTER[abId];
                ab.push(lv + ":" + abInfo["Name"] + " <small>" + abInfo["FlavorText"] + "</small>");
            }
            col += "<td>" + ab.join("<br>") + "</td>";
            col = "<tr style='" + color + "'>" + col + "</tr>\n";
        } else {
            col += "<td><img src=\"" + rarityIcon + "\" height=" + height + "><br>";
            col += "<img src=\"" + imgSrc + "\" height=" + height + " id=\"" + imgId2 + "\"></td>";
            col += "<td><small>" + Name + styleName + "</small><br>";
            let ab = [];
            for (let lv in styleInfo['StyleAbilityIds']) {
                let abId = styleInfo['StyleAbilityIds'][lv];
                let abInfo = ABILITY_MASTER[abId];
                let button = '<span data-toggle="tooltip" data-placement="top" title="' + abInfo["FlavorText"] + '">' + lv + ":" + abInfo["Name"] + '</span>';
                //ab.push(abInfo["Name"] + " <small>" + abInfo["FlavorText"] + "</small>");
                ab.push(button);
            }
            col += ab.join("<br>") + "</td>";
            col = "<tr style='" + color + "'>" + col + "</tr>\n";
        }
        $("table#ability_holder_table tbody").append(col);
        $('[data-toggle="tooltip"]').tooltip();
    }
}
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
