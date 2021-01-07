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

    $('#slide-left').click(function (){
        $('.post-style-selections').css('left', '0')
    })

    $('#slide-right').click(function (){
        let windowSize = $(window).width();
        console.log(windowSize*0.336);
        $('.post-style-selections').css('left', ((965-windowSize*0.336)*-1).toString() + 'px')
    })

    $('.prompt-name-image').click(function (){
        $('.prompt-dropdown').css({'margin-top': '-85px', 'opacity': '1'});
        //write cite function
    })

    $('#cancel').click(function (){
        $('.prompt-dropdown').css({'margin-top': '-255px', 'opacity': '0'});
    })

});