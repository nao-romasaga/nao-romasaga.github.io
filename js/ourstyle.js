firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        $("#myStyleInput").hide();
        var uiConfig = {
            // ログイン完了時のリダイレクト先
            signInSuccessUrl: 'https://nao-romasaga.github.io/stylecheck.html',
            // 利用する認証機能
            signInOptions: [
                firebase.auth.TwitterAuthProvider.PROVIDER_ID
            ],
        };
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', uiConfig);
        $(".firebaseui-idp-text").text("Twitterでログインして自分のスタイルを登録")
    } else {
        let icon = $("<img>").attr("src", user.photoURL)
                .attr("style", "width:40px; heidht:40px;    border-radius: 50%;");
        let name = `${user.displayName} さん:ログイン中`;
        $("#firebaseui-auth-container").addClass("bg-white kadomaru")
                .append(icon).append(name);
    }
});
var ANALYZE_DATA;
$(document).ready(function ($) {
    readFile('Style', function (result) {
        STYLE_MASTER = result;
        readAnalyzeFile('STYLECHECK', function (result) {
            ANALYZE_DATA = result;
            let style = result["STYLE"];
            let ss = result["SS"];
            let s = result["S"];
            let a = result["A"];
            let tmp = {"ALL": [], "SS": [], "S": [], "A": []};
            for (let row in style) {
                let info = STYLE_MASTER[style[row]['id']];
                tmp["ALL"].push(style[row]);
                tmp[info['Rarity']].push(style[row]);
            }
            ascSort(tmp["ALL"]);
            ascSort(tmp["SS"]);
            ascSort(tmp["S"]);
            ascSort(tmp["A"]);
            ANALYZE_DATA['ALL'] = tmp["ALL"];
            ANALYZE_DATA['SS'] = tmp["SS"];
            ANALYZE_DATA['S'] = tmp["S"];
            ANALYZE_DATA['A'] = tmp["A"];
            display(ANALYZE_DATA['ALL']);
        });
    });

    $(".baseValue").click(function () {
        $(".baseValue").each(function () {
            $(this).removeClass("icon_btn_off");
            $(this).addClass("icon_btn_on");
        });
        $(this).removeClass("icon_btn_on");
        $(this).addClass("icon_btn_off");
        let rare = $(this).attr("data-id");
        display(ANALYZE_DATA[rare]);
    });
});
function ascSort(list) {
    list.sort(function (a, b) {
        return (a.per >= b.per) ? 1 : -1;
    });
}
function descSort(list) {
    list.sort(function (a, b) {
        return (a.per >= b.per) ? -1 : 1;
    });
}



function display(target) {
    $("#styleArea").html("");
    let limit = 20;
    let i = 0;
    let color = ["rgb(255,255,20)", "rgb(220,220,255)", "rgb(255,170,100)"];
    let shadow = "text-shadow: 1px 1px 10px #000;";
    while (i < limit) {
        let rank;
        let row = target[i];
        let styleId = row['id'];
        let styleInfo = STYLE_MASTER[row['id']];
        let rare = styleInfo['Rarity'];
        // スタイルアイコンの追加
        let icon = $("<button>").addClass("style")
                .addClass(getStyleIconClass(rare))
                .addClass(styleId)
                .attr("style", getImgUrl('style_icon/' + styleId + ".png"))
                .attr("data-id", styleId)
                .attr("data-rare", rare);
        let background = $("<span>")
                .addClass(getStyleIconBgClass(rare))
                .append(icon);
        if (i < 3) {
            rank = `<i class="fas fa-crown h4" style="color: ${color[i]}; ${shadow}">${(i + 1)}位 ${row['per']}%</i>`;
        } else {
            rank = `<span class="h4" style="text-shadow: 1px 1px 10px #FFF;">${(i + 1)}位 ${row['per']}%</span>`;
        }

        let divLeft = $("<div>").addClass("col-3 col-md-2 col-lg-1 text-right");
        let divRight = $("<div>").addClass("col-9 col-md-4 col-lg-3 text-nowrap");
        divLeft.append(background);
        divRight.append(rank + "<br>" + styleInfo['Name'] + "<br>" + styleInfo['AnotherName']);
        $("#styleArea").append(divLeft).append(divRight);
        i++;
    }
}