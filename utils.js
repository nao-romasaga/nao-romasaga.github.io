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
function createSkillOption(list) {
    var result = {"通常攻撃 BP:0 威力:7":7};
    list.forEach(function (rows) {
        result[rows[1]  + " BP:" + rows[3] + " 威力["+rows[2]+"]:" + rows[5]] = rows[5];
    });
    return result;
}
// 正規表現でセパレート
function number_format(num){
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function arrayAvg(arr) {
    var sum = 0;
    arr.forEach(function(elm) {
        sum += elm;
    });
    return sum / arr.length;
};
