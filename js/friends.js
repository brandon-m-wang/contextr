$(document).ready(function () {

    $('#requests-toggle').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#requests-toggle').css("opacity", "1").css("text-shadow", "0px 0px 5px #fff")
        $('#search-toggle').css("opacity", "0.6").css("text-shadow", "none")
        $('.requests').css("display", "flex")
        $('.search-bar').css("display", "none")
    })

    $('#search-toggle').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#search-toggle').css("opacity", "1").css("text-shadow", "0px 0px 5px #fff")
        $('#requests-toggle').css("opacity", "0.6").css("text-shadow", "none")
        $('.requests').css("display", "none")
        $('.search-bar').css("display", "flex")
    })
});