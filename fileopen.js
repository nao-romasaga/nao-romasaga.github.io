const xhr = new XMLHttpRequest();
var data;

function loadTSV(path) {
    xhr.open('GET', path, false); // GETでローカルファイルを開く
    xhr.onload = () => {
        data = xhr.responseText;
    };
    xhr.onerror = () => {
        console.log("error!");
    };

    xhr.send();
    var split_data = data.split("\n");
    var result = [];
    split_data.forEach(function (line) {
        var cols = line.split("\t");
        if (!result[cols[0]]) {
            result[cols[0]] = [];
        }
        result[cols[0]].push(cols);
    });
    return result;
}
