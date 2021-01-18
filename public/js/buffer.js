$(document).ready(function () {

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

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

    $(document).on('click', '.post-the-comment', (e) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var userID = firebase.auth().currentUser.uid
                var postID = $(e.target).parent().parent().find('h1').attr('data-value')
                var commentContent = $(e.target).parent().find('.comment').val()
                var currTime = new Date().getTime()
                firebase.firestore().collection('posts').doc(postID).set({
                    "comments": {
                        [currTime]: [userID, commentContent]
                    }
                }, {merge: true})
                firebase.firestore().collection('users').doc(userID).get().then(async function (doc) {
                    $(e.target).parent().parent().find('textarea').val('')
                    let htmlString = htmlToElement(`<div class="individual-comments" id="${currTime + userID}">
                                            <div class="container-individual-comments">
                                                <a href="https://contextr.io/users/${doc.data().name}"><h6>@${doc.data().name}</h6></a>
                                                <p>${commentContent}</p>
                                            </div>
                                            <h4 style="margin: 10px 0 0 0 !important">0m ago<h4>
                                        </div>`)
                    $(e.target).parent().parent().find('.post-comments').after(htmlString)
                    await firebase.storage().ref().child('users/' + userID + '/profile').getDownloadURL().then(async function (result) {
                        var imgUrl = await result
                        let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                        document.getElementById(currTime + userID).prepend(imgString)
                    })
                })
            }
        })
    })

    $(document).on('click', '.post-actions > .comment', (e) => {
        var parentAnchor = $('.profile-container').offset().top + $('.profile-container').height()
        var childPos = $(e.target).parent().parent().parent().find('textarea').offset().top
        var scrollIt = childPos - parentAnchor
        $('html,body').animate({
            scrollTop: scrollIt
        }, 500);
    })

})