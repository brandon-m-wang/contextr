/*function profileNav(){
    history.pushState({id: "profile"}, "contextr.io | Profile", "profile.html");
    window.location.href = "profile.html";
}*/

$(document).ready(function () {

    $('.see-all').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#modal-container').removeAttr('class').addClass(buttonId);
        $('body').addClass('modal-active');
    });


    $(document).click(function (event) {
        if (event.target.id == "five" || event.target.className == "see-all") {
            return
        }
        var $target = $(event.target);
        if (!$target.closest('#the-modal').length && ($("body").hasClass("modal-active"))) {
            $('#modal-container').addClass('out');
            $('body').removeClass('modal-active');
        }
    });
});