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
    var result = {};
    list.forEach(function (rows) {
        if (rows[1] != "-" && rows[1] > 0) {
            // 0:種別、1:威力、2:Name、3:Grade、4:BP、5:覚醒
            result[rows[2] + " BP:" + rows[4] + " 威力[" + rows[3] + "]:" + rows[1]] = rows[1];
        }
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
