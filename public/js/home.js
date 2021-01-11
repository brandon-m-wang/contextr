/*function profileNav(){
    history.pushState({id: "profile"}, "contextr.io | Profile", "profile.html");
    window.location.href = "profile.html";
}*/
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

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

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid;
            console.log(userID);
            //write getPosts method
            var postsToGenerate = []
            await firebase.firestore().collection('users').doc(userID).get().then(async function (doc){
                var friends = await doc.data().friends
                for (let i = 0; i < friends.length; i++){
                    await firebase.firestore().collection('users').doc(friends[i]).get().then(async function (doc){
                        var allPosts = await doc.data().posts
                        for (let i = 1; (i < 4 && i < allPosts.length+1) && i < 4; i++){
                            if (new Date() - getPostDate(allPosts[allPosts.length - i])[1] < 604800000) {
                                postsToGenerate.push(allPosts[allPosts.length - i])
                            }
                        }
                    })
                }
            })
            for (let i = 0; i < postsToGenerate.length; i++){
                firebase.firestore().collection('posts').doc(postsToGenerate[i]).get().then(async function (doc){
                    //taking a break
                })

            }
            await firebase.firestore().collection("users").doc(userID).get().then(async function (doc) {
                for (let i = 0; i < doc.data().friends.length && i < 6; i++) {
                    var friendID = await doc.data().friends[i]
                    await firebase.firestore().collection("users").doc(friendID).get().then(async function (doc) {
                        var name = '@' + await doc.data().name
                        let htmlString = htmlToElement(`<div class="prompt-name-image" id='${'prompt' + (i+1).toString()}'>
                        <p id="${name}">${name}</p>
                    </div>`)
                        document.getElementsByClassName('prompt-images')[0].appendChild(htmlString)
                    })
                    await firebase.storage().ref().child('users/' + friendID + '/profile').getDownloadURL().then(async function (result) {
                        var imgUrl = await result
                        let imgString = await htmlToElement(`<img src='${imgUrl}'>`)
                        document.getElementById("prompt" + (i+1).toString()).prepend(imgString);
                    })
                }
                for (let i = 0; i < doc.data().friends.length; i++){
                    var friendID = await doc.data().friends[i]
                    await firebase.firestore().collection("users").doc(friendID).get().then(async function (doc) {
                        var name = '@' + await doc.data().name
                        let htmlString2 = htmlToElement(`<div class="${'request' + ' ' + i.toString()}">
                    <div class="request-info">
                        <h6>${name}</h6>
                    </div>
                    <div class="request-actions">
                        <a>Cite</a>
                        <a>View</a>
                    </div>
                </div>`)
                        document.getElementsByClassName('requests')[0].appendChild(htmlString2)
                    })
                    await firebase.storage().ref().child('users/' + friendID + '/profile').getDownloadURL().then(async function (result) {
                        var imgUrl = await result
                        let imgString = await htmlToElement(`<img src='${imgUrl}'>`)
                        document.getElementsByClassName(i.toString())[0].prepend(imgString);
                    })
                }
            });
            await $('#slide-left').click(function () {
                $('.post-style-selections').css('left', '0')
            })

            await $('#slide-right').click(function () {
                let windowSize = $(window).width();
                console.log(windowSize * 0.336);
                $('.post-style-selections').css('left', ((965 - windowSize * 0.336) * -1).toString() + 'px')
            })

            await $('.prompt-name-image').click(function () {
                $('.prompt-dropdown').css({'margin-top': '-85px', 'opacity': '1'});
                //write cite function
                document.getElementById('currently-citing').innerHTML = "Currently citing: " + $('p', this).attr('id')
            })

            $('#cancel').click(function () {
                $('.prompt-dropdown').css({'margin-top': '-255px', 'opacity': '0'});
                $('.post-style-selections > button').css('filter', 'brightness(100%)');
                document.getElementById('post-text').value = '';
                $('#post-style-selections').attr('data-value', 'null')
            })

            $('#man-im-dead').click(function () {
                $(this).css('filter', 'brightness(150%)')
                $('.post-style-selections > button:nth-child(n+2)').css('filter', 'brightness(100%)')
                $('#post-style-selections').attr('data-value', 'man-im-dead')
            })

            $('#taking-a-look').click(function () {
                $(this).css('filter', 'brightness(150%)')
                $('.post-style-selections > button:not(:nth-child(2))').css('filter', 'brightness(100%)')
                $('#post-style-selections').attr('data-value', 'taking-a-look')
            })

            $('#what-did-he-say').click(function () {
                $(this).css('filter', 'brightness(150%)')
                $('.post-style-selections > button:not(:nth-child(3))').css('filter', 'brightness(100%)')
                $('#post-style-selections').attr('data-value', 'what-did-he-say')
            })

            $('#built-different').click(function () {
                $(this).css('filter', 'brightness(150%)')
                $('.post-style-selections > button:not(:nth-child(4))').css('filter', 'brightness(100%)')
                $('#post-style-selections').attr('data-value', 'built-different')
            })

            $('#my-oh-my').click(function () {
                $(this).css('filter', 'brightness(150%)')
                $('.post-style-selections > button:not(:nth-child(5))').css('filter', 'brightness(100%)')
                $('#post-style-selections').attr('data-value', 'my-oh-my')
            })

            $('#so-so-sad').click(function () {
                $(this).css('filter', 'brightness(150%)')
                $('.post-style-selections > button:not(:nth-child(6))').css('filter', 'brightness(100%)')
                $('#post-style-selections').attr('data-value', 'so-so-sad')
            })

            $('#confirm').click(function () {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        var postID = createID();
                        var postDate = getPostDate(postID);
                        var writer = firebase.auth().currentUser.uid;
                        var citedPre = document.getElementById('currently-citing').innerHTML.replace('@', '').slice(18);
                        var quote = document.getElementById('post-text').value
                        var theme = $('#post-style-selections').attr('data-value')
                        firebase.firestore().collection('usernames').doc(citedPre).get().then(async function (doc){
                            var cited = doc.data().username;
                            firebase.firestore().collection('posts').doc(postID).set({
                                poster: writer,
                                postee: cited,
                                theme: theme,
                                text: quote,
                                comments: [],
                                likes: {},
                                dateFormatted: postDate[0],
                                dateRaw: postDate[1]
                            })
                            firebase.firestore().collection('userspublic').doc(writer).update({
                                notifications: firebase.firestore.FieldValue.arrayUnion(postID)
                            })
                            firebase.firestore().collection('users').doc(writer).update({
                                posts: firebase.firestore.FieldValue.arrayUnion(postID)
                            })
                        })
                    }
                });
            })
        }
    })
});