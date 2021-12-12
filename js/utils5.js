$('body').prepend("///////これはjsファイルの内部<br>");


function beforeFunction () {
    $('body').prepend("beforeFunction<br>");
}

$(document).ready(function () {
    $('body').prepend("///////これはjsファイルの内部のready<br>");
    $('body').prepend("dispHeader<br>");
    $('body').prepend("dispHeader check " + (typeof dispHeader) + "<br>");
    $('body').prepend("beforeFunction check " + (typeof beforeFunction) + "<br>");
    $('body').prepend("afterFunction check " + (typeof afterFunction) + "<br>");
    $('body').prepend("tfunction check " + (typeof tfunction) + "<br>");
    function tfunction () {
        $('body').prepend("test<br>");
    }
    $('body').prepend("tfunction check " + (typeof tfunction) + "<br>");
});
function afterFunction () {
    $('body').prepend("afterFunction<br>");
}

