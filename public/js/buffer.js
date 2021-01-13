$(document).ready(function(){

$(document).on('click', '.comment', (e) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $(e.target).parent().find('i').css({'visibility': 'visible', 'pointer-events': 'all'})
        }
    })
})

$(document).on('click', '.see-all-comments', (e) => {
    $(e.target).parent().parent().parent().find('.individual-comments').css('display', '')
    $(e.target).css('display', 'none')
})

$(document).on('click', 'post-the-comment', (e) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid
            var postID = $(e.target).parent().parent().find('h1').attr('data-value')
            var commentContent = $(e.target).parent().find('.comment').val()
            var currTime = new Date().getTime()
            console.log(currTime)
            console.log(commentContent);
            firebase.firestore().collection('posts').doc(postID).set({
                "comments": {
                    [currTime]: [userID, commentContent]
                }
            }, {merge: true})
        }
    })
})

})