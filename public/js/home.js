/*function profileNav(){
    history.pushState({id: "profile"}, "contextr.io | Profile", "profile.html");
    window.location.href = "profile.html";
}*/

if ($(window).width() <= 830) {
    window.location.replace('https://contextr.io/in-progress')
}


function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function dhm(ms) {
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    if (hours == 0 && days == 0) {
        return minutes + "m ago"
    } else if (days == 0) {
        return hours + "h " + minutes + "m ago"
    } else {
        return days + "d " + hours + "h " + minutes + "m ago"
    }

}

// function shuffleArray(array) {
//     for (var i = array.length - 1; i > 0; i--) {
//         var j = Math.floor(Math.random() * (i + 1));
//         var temp = array[i];
//         array[i] = array[j];
//         array[j] = temp;
//     }
// }

$(document).ready(function () {

    var sliderPos = 0

    $(document).on('click', '.see-all', function () {
        var buttonId = $(this).attr('id');
        $('#modal-container').removeAttr('class').addClass(buttonId);
        $('body').addClass('modal-active');
    })

    $(document).on('click', '.see-all-comments', (e) => {
        $(e.target).parent().parent().parent().find('.individual-comments').css('display', '')
        $(e.target).css('display', 'none')
    })

    $(document).on('click', '#slide-left', function () {
        if (sliderPos == 0) {
            return
        } else {
            $('.post-style-selections').css('left', (sliderPos + 158).toString() + 'px')
            sliderPos += 158
            console.log(sliderPos);
        }
    })

    $(document).on('click', '#slide-right', function () {
        let max = (6 * 158) / ($(window).width() * 0.320)
        if (sliderPos <= -max * 158 - 158) {
            return
        } else {
            $('.post-style-selections').css('left', (sliderPos - 158).toString() + 'px')
            sliderPos -= 158
            console.log(sliderPos)
        }
    })

    $(document).on('click', '.prompt-name-image', function () {
        $('.prompt-dropdown').css({
            'margin-top': '-35px',
            'margin-bottom': '130px',
            'opacity': '1',
            'pointer-events': 'all',
        });
        //write cite function
        document.getElementById('currently-citing').innerHTML = "Currently citing: " + $('p', this).attr('id')
    })

    $(document).on('input', '#post-text', function () {
        var charCount = document.getElementById('post-text').value.length
        document.getElementById('num-chars').innerHTML = "Characters: " + charCount.toString() + "/175"
    })

    $(document).on('click', '#cancel', function () {
        $('.prompt-dropdown').css({
            'margin-top': '-205px',
            'margin-bottom': '50px',
            'opacity': '0',
            'pointer-events': 'none'
        });
        document.getElementById('post-text').placeholder = "Be ruthless..."
        $('.post-style-selections > button').css({'filter': 'brightness(100%)'});
        document.getElementById('post-text').value = '';
        $('#post-style-selections').attr('data-value', 'null')
    })

    $(document).on('click', '#man-im-dead', function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:nth-child(n+2)').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'man-im-dead')
    })

    /*$('#taking-a-look').click(function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(2))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'taking-a-look')
    })*/

    $(document).on('click', '#taking-a-look', function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(2))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'taking-a-look')
    })

    /*$('#what-did-he-say').click(function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(3))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'what-did-he-say')
    })*/

    $(document).on('click', '#what-did-he-say', function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(3))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'what-did-he-say')
    })

    /*$('#built-different').click(function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(4))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'built-different')
    })*/

    $(document).on('click', '#built-different', function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(4))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'built-different')
    })

    /*$('#my-oh-my').click(function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(5))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'my-oh-my')
    })*/

    $(document).on('click', '#my-oh-my', function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(5))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'my-oh-my')
    })


    /*$('#so-so-sad').click(function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(6))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'so-so-sad')
    })*/

    $(document).on('click', '#so-so-sad', function () {
        $(this).css('filter', 'brightness(150%)')
        $('.post-style-selections > button:not(:nth-child(6))').css('filter', 'brightness(100%)')
        $('#post-style-selections').attr('data-value', 'so-so-sad')
    })

    let postTimeout = null
    let warningTimeout = null
    $(document).on('click', '#confirm', function () {
        clearTimeout(warningTimeout)
        if (!$('#post-text').val().replace(/\s/g, '').length) {
            document.getElementById('post-text').placeholder = "Please write something before posting..."
            return
        }
        if ($('#post-style-selections').attr('data-value') == "null") {
            let warningString = htmlToElement(`<h3 id="warning">Choose a theme!</h3>`)
            $('.prompt-dropdown-actions-container').append(warningString)
            $('#confirm').css('pointer-events', 'none');
            warningTimeout = setTimeout(function () {
                $('#warning').remove()
                $('#confirm').css('pointer-events', '');
            }, 1500)
            return
        }
        clearTimeout(postTimeout);
        $('#confirm').html('Posting...')
        postTimeout = setTimeout(async function () {
            document.getElementById('post-text').placeholder = "Be ruthless..."
            $('#confirm').html('Post')
            $('.post-style-selections > button').css({'filter': 'brightness(100%)'});
            await firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    var postID = createID();
                    var postDate = getPostDate(postID);
                    var writer = firebase.auth().currentUser.uid;
                    var citedPre = document.getElementById('currently-citing').innerHTML.replace('@', '').slice(18);
                    var quote = document.getElementById('post-text').value
                    var theme = $('#post-style-selections').attr('data-value')
                    firebase.firestore().collection('usernames').doc(citedPre).get().then(async function (doc) {
                        var cited = doc.data().username;
                        firebase.firestore().collection('posts').doc(postID).set({
                            poster: writer,
                            postee: cited,
                            theme: theme,
                            text: quote,
                            comments: {},
                            likes: {},
                            dateFormatted: postDate[0],
                            dateRaw: postDate[1]
                        })
                        firebase.firestore().collection('userspublic').doc(cited).update({
                            notifications: firebase.firestore.FieldValue.arrayUnion(postID)
                        })
                        firebase.firestore().collection('users').doc(writer).update({
                            posts: firebase.firestore.FieldValue.arrayUnion(postID)
                        })
                        firebase.firestore().collection('users').doc(writer).get().then(function (doc) {
                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                <div class="post-header">
                                    <h1 style="display: none" data-value = ${postID}></h1>
                                    <a href="https://contextr.io/users/${citedPre}"><h3>@${citedPre}</h3></a>
                                    <a href="https://contextr.io/users/${doc.data().name}"><h4>Quoted by: @${doc.data().name}</h4></a>
                                    <h4>${postDate[0]}</h4>
                                </div>
                                <div class="post-quote">
                                    <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                    <p>${quote}</p>
                                    <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                </div>
                                <div class="post-footer">
                                    <div class="post-actions">
                                        <i class="fab fa-gratipay heart like"></i>
                                        <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                    </div>
                                    <div class="post-stats">
                                        <i class="fab fa-gratipay heart likes"></i>
                                        <h6>0 Likes</h6>
                                        <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                        <h6>0 Comments</h6>
                                    </div>
                                </div>
                                <div class="post-comments">
                                    <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                            $('.profile-posts').after(htmlString)
                        })
                    })
                }
            });
            document.getElementById('post-text').value = '';
            $('#post-style-selections').attr('data-value', 'null')
            $('html,body').animate({
                scrollTop: 350
            }, 500);
        }, 1000)
    })

    $(document).on('click', '.comment', (e) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $(e.target).parent().find('i').css({'visibility': 'visible', 'pointer-events': 'all'})
            }
        })
    })

    $(document).on('click', '.post-the-comment', (e) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var userID = firebase.auth().currentUser.uid
                var postID = $(e.target).parent().parent().find('h1').attr('data-value')
                var commentContent = $(e.target).parent().find('.comment').val()
                if (!commentContent.replace(/\s/g, '').length) {
                    return
                }
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
        var parentAnchor = $('#prompt-section').offset().top + $('#prompt-section').height()
        var childPos = $(e.target).parent().parent().parent().find('textarea').offset().top
        var scrollIt = childPos - parentAnchor
        $('html,body').animate({
            scrollTop: scrollIt
        }, 500);
    })

    $(document).on('click', '.like', (e) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var postID = $(e.target).parent().parent().parent().find('h1').attr('data-value');
                var userID = firebase.auth().currentUser.uid;
                var post = firebase.firestore().collection('posts').doc(postID);
                post.get().then(async function (doc) {
                    // if(doc.data().likes.contains(userID)){
                    if (userID in doc.data().likes) {
                        //Unlike post if liked
                        $(e.target).css({
                            'background': 'linear-gradient(to bottom, rgb(136, 123, 176) 0%,' +
                                ' rgba(203, 157, 156, 1) 100%)',
                            '-webkit-text-fill-color': 'transparent',
                            '-webkit-background-clip': 'text'
                        })
                        let numLikesString = $(e.target).parent().parent().find('.post-stats').children().eq(1).html()
                        let numLikes = numLikesString.match(/\d/g);
                        numLikes = parseInt(numLikes.join(""))
                        let newLikes = numLikes - 1
                        if (numLikes == 2) {
                            $(e.target).parent().parent().find('.post-stats').children().eq(1).html(newLikes.toString() + ' Like')
                        } else {
                            $(e.target).parent().parent().find('.post-stats').children().eq(1).html(newLikes.toString() + ' Likes')
                        }
                        post.set({
                            "likes": {
                                [userID]: firebase.firestore.FieldValue.delete()
                            }
                        }, {merge: true});
                    } else {
                        //Like post if not liked already
                        $(e.target).css({
                            'background': 'transparent',
                            '-webkit-text-fill-color': 'mediumvioletred'
                        })
                        let numLikesString = $(e.target).parent().parent().find('.post-stats').children().eq(1).html()
                        let numLikes = numLikesString.match(/\d/g);
                        numLikes = parseInt(numLikes.join(""))
                        let newLikes = numLikes + 1
                        if (numLikes == 0) {
                            $(e.target).parent().parent().find('.post-stats').children().eq(1).html(newLikes.toString() + ' Like')
                        } else {
                            $(e.target).parent().parent().find('.post-stats').children().eq(1).html(newLikes.toString() + ' Likes')
                        }
                        post.set({
                            "likes": {
                                [userID]: true
                            }
                        }, {merge: true});
                    }
                })
            }
        });
    })

    $(document).on('click', '#Logout', function (e) {
        firebase.auth().signOut().then(function () {
            window.location.replace('https://contextr.io/landing')
        }, function (error) {
            // An error happened.
        });
    })

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


    $(document).on('click', function (event) {
        if (event.target.className == "comment" || $.inArray("post-the-comment", event.target.classList) !== -1) {
            return
        }
        var $target = $(event.target);
        $target.parent().find('.post-the-comment').css({'visibility': 'hidden', 'pointer-events': 'none'})
    })

    $(document).on('click', '.request-actions > :first-child', function (event) {
        $('#modal-container').addClass('out');
        $('body').removeClass('modal-active');
        $('.prompt-dropdown').css({
            'margin-top': '-35px',
            'margin-bottom': '130px',
            'opacity': '1',
            'pointer-events': 'all',
            'cursor': 'pointer'
        });
        //write cite function
        document.getElementById('currently-citing').innerHTML = "Currently citing: " + $(event.target).parent().parent().find('h6').html()
    })

    firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                var userID = firebase.auth().currentUser.uid;
                //write getPosts method
                var unorderedPostsToGenerate = {}
                firebase.firestore().collection("users").doc(userID).get().then(async function (doc) {
                    if (doc.data().friends.length == 0) {
                        $('.see-all').css('display', 'none');
                        $('.prompt').find('h3').html("Add some friends in the 'Friends' tab");
                        $('.prompt').css('padding-bottom', '0');
                    }
                    for (let i = 0; i < doc.data().friends.length && i < 6; i++) {
                        var friendID = await doc.data().friends[i]
                        await firebase.firestore().collection("users").doc(friendID).get().then(async function (doc) {
                            var name = '@' + await doc.data().name
                            let htmlString = htmlToElement(`<div class="prompt-name-image" id='${'prompt' + (i + 1).toString()}'>
                        <p id="${name}">${name}</p>
                    </div>`)
                            document.getElementsByClassName('prompt-images')[0].appendChild(htmlString)
                        })
                        await firebase.storage().ref().child('users/' + friendID + '/profile').getDownloadURL().then(async function (result) {
                            var imgUrl = await result
                            let imgString = await htmlToElement(`<img src='${imgUrl}'>`)
                            document.getElementById("prompt" + (i + 1).toString()).prepend(imgString);
                        })
                    }
                    document.getElementById("loading-gif").style.display = "none";
                    document.getElementsByTagName("html")[0].style.visibility = "visible";
                    document.getElementsByTagName("html")[0].style.position = '';
                    for (let i = 0; i < doc.data().friends.length; i++) {
                        var friendID = await doc.data().friends[i]
                        await firebase.firestore().collection("users").doc(friendID).get().then(async function (doc) {
                            var name = '@' + await doc.data().name
                            let htmlString2 = htmlToElement(`<div class="${'request' + ' ' + i.toString()}">
                    <div class="request-info">
                        <h6>${name}</h6>
                    </div>
                    <div class="request-actions">
                        <a>Cite</a>
                        <a href="https://contextr.io/users/${name.replace('@', '')}">View</a>
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
                await firebase.firestore().collection('users').doc(userID).get().then(async function (doc) {
                    var friends = await doc.data().friends
                    document.getElementById('five').innerHTML = "See all friends (" + friends.length.toString() + ")"
                    var selfPosts = await doc.data().posts
                    for (let i = 1; (i < 4 && i < selfPosts.length + 1) && i < 4; i++) {
                        if ((new Date().getTime() - getPostDate(selfPosts[selfPosts.length - i])[2]) < 604800000) {
                            unorderedPostsToGenerate[getPostDate(selfPosts[selfPosts.length - i])[2]] = selfPosts[selfPosts.length - i]
                        }
                    }
                    for (let i = 0; i < friends.length; i++) {
                        await firebase.firestore().collection('users').doc(friends[i]).get().then(async function (doc) {
                            var allPosts = await doc.data().posts
                            for (let i = 1; (i < 4 && i < allPosts.length + 1) && i < 4; i++) {
                                if ((new Date().getTime() - getPostDate(allPosts[allPosts.length - i])[2]) < 604800000) {
                                    unorderedPostsToGenerate[getPostDate(allPosts[allPosts.length - i])[2]] = allPosts[allPosts.length - i]
                                }
                            }
                        })
                    }
                })
                var postsToGenerate = Object.keys(unorderedPostsToGenerate).sort().reverse().reduce(
                    (obj, key) => {
                        obj[key] = unorderedPostsToGenerate[key];
                        return obj;
                    },
                    {}
                );
                for (const [key, value] of Object.entries(postsToGenerate)) {
                    await firebase.firestore().collection('posts').doc(value).get().then(async function (doc) { //can remove await for performance
                        var poster = doc.data().poster
                        var postee = doc.data().postee
                        var postID = value
                        var dateFormatted = doc.data().dateFormatted
                        var text = doc.data().text
                        var theme = doc.data().theme
                        var likes = doc.data().likes;
                        var transformedLikes = new Map();
                        Object.keys(likes).forEach(e => {
                            transformedLikes.set(String(e), likes[e]);
                        });
                        var liked = transformedLikes.has(userID)
                        var unorderedComments = doc.data().comments
                        var comments = Object.keys(unorderedComments).sort().reduce(
                            (obj, key) => {
                                obj[key] = unorderedComments[key];
                                return obj;
                            },
                            {}
                        );
                        var transformedComments = new Map();
                        Object.keys(comments).forEach(e => {
                            transformedComments.set(String(e), comments[e]);
                        });
                        var numComments = transformedComments.size
                        await firebase.firestore().collection('users').doc(poster).get().then(function (doc) {
                            var posterUsername = doc.data().name
                            firebase.firestore().collection('users').doc(postee).get().then(function (doc) {
                                var posteeUsername = doc.data().name
                                if (!liked) {
                                    if (transformedLikes.size == 1) {
                                        if (numComments == 1) {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                <div class="post-header">
                                    <h1 style="display: none" data-value = ${postID}></h1>
                                    <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                    <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                    <h4>${dateFormatted}</h4>
                                </div>
                                <div class="post-quote">
                                    <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                    <p>${text}</p>
                                    <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                </div>
                                <div class="post-footer">
                                    <div class="post-actions">
                                        <i class="fab fa-gratipay heart like"></i>
                                        <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                    </div>
                                    <div class="post-stats">
                                        <i class="fab fa-gratipay heart likes"></i>
                                        <h6>${transformedLikes.size} Like</h6>
                                        <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                        <h6>${numComments} Comment</h6>
                                    </div>
                                </div>
                                <div class="post-comments">
                                    <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        } else {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                        <div class="post-header">
                                            <h1 style="display: none" data-value = ${postID}></h1>
                                            <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                            <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                            <h4>${dateFormatted}</h4>
                                        </div>
                                        <div class="post-quote">
                                            <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                            <p>${text}</p>
                                            <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                        </div>
                                        <div class="post-footer">
                                            <div class="post-actions">
                                                <i class="fab fa-gratipay heart like"></i>
                                                <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                            </div>
                                            <div class="post-stats">
                                                <i class="fab fa-gratipay heart likes"></i>
                                                <h6>${transformedLikes.size} Like</h6>
                                                <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                                <h6>${numComments} Comments</h6>
                                            </div>
                                        </div>
                                        <div class="post-comments">
                                            <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                            <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                        </div>
                                        
                                    </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        }
                                    } else {
                                        if (numComments == 1) {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                <div class="post-header">
                                    <h1 style="display: none" data-value = ${postID}></h1>
                                    <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                    <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                    <h4>${dateFormatted}</h4>
                                </div>
                                <div class="post-quote">
                                    <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                    <p>${text}</p>
                                    <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                </div>
                                <div class="post-footer">
                                    <div class="post-actions">
                                        <i class="fab fa-gratipay heart like"></i>
                                        <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                    </div>
                                    <div class="post-stats">
                                        <i class="fab fa-gratipay heart likes"></i>
                                        <h6>${transformedLikes.size} Likes</h6>
                                        <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                        <h6>${numComments} Comment</h6>
                                    </div>
                                </div>
                                <div class="post-comments">
                                    <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                                
                            </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        } else {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                        <div class="post-header">
                                            <h1 style="display: none" data-value = ${postID}></h1>
                                            <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                            <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                            <h4>${dateFormatted}</h4>
                                        </div>
                                        <div class="post-quote">
                                            <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                            <p>${text}</p>
                                            <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                        </div>
                                        <div class="post-footer">
                                            <div class="post-actions">
                                                <i class="fab fa-gratipay heart like"></i>
                                                <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                            </div>
                                            <div class="post-stats">
                                                <i class="fab fa-gratipay heart likes"></i>
                                                <h6>${transformedLikes.size} Likes</h6>
                                                <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                                <h6>${numComments} Comments</h6>
                                            </div>
                                        </div>
                                        <div class="post-comments">
                                            <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                            <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                        </div>
                                        
                                    </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        }
                                    }
                                } else {
                                    if (transformedLikes.size == 1) {
                                        if (numComments == 1) {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                <div class="post-header">
                                    <h1 style="display: none" data-value = ${postID}></h1>
                                    <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                    <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                    <h4>${dateFormatted}</h4>
                                </div>
                                <div class="post-quote">
                                    <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                    <p>${text}</p>
                                    <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                </div>
                                <div class="post-footer">
                                    <div class="post-actions">
                                        <i class="fab fa-gratipay heart like" style="background: transparent; -webkit-text-fill-color: mediumvioletred !important"></i>
                                        <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                    </div>
                                    <div class="post-stats">
                                        <i class="fab fa-gratipay heart likes"></i>
                                        <h6>${transformedLikes.size} Like</h6>
                                        <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                        <h6>${numComments} Comment</h6>
                                    </div>
                                </div>
                                <div class="post-comments">
                                    <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        } else {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                <div class="post-header">
                                    <h1 style="display: none" data-value = ${postID}></h1>
                                    <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                    <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                    <h4>${dateFormatted}</h4>
                                </div>
                                <div class="post-quote">
                                    <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                    <p>${text}</p>
                                    <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                </div>
                                <div class="post-footer">
                                    <div class="post-actions">
                                        <i class="fab fa-gratipay heart like" style="background: transparent; -webkit-text-fill-color: mediumvioletred !important"></i>
                                        <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                    </div>
                                    <div class="post-stats">
                                        <i class="fab fa-gratipay heart likes"></i>
                                        <h6>${transformedLikes.size} Like</h6>
                                        <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                        <h6>${numComments} Comments</h6>
                                    </div>
                                </div>
                                <div class="post-comments">
                                    <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        }
                                    } else {
                                        if (numComments == 1) {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                <div class="post-header">
                                    <h1 style="display: none" data-value = ${postID}></h1>
                                    <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                    <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                    <h4>${dateFormatted}</h4>
                                </div>
                                <div class="post-quote">
                                    <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                    <p>${text}</p>
                                    <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                </div>
                                <div class="post-footer">
                                    <div class="post-actions">
                                        <i class="fab fa-gratipay heart like" style="background: transparent; -webkit-text-fill-color: mediumvioletred !important"></i>
                                        <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                    </div>
                                    <div class="post-stats">
                                        <i class="fab fa-gratipay heart likes"></i>
                                        <h6>${transformedLikes.size} Likes</h6>
                                        <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                        <h6>${numComments} Comment</h6>
                                    </div>
                                </div>
                                <div class="post-comments">
                                    <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        } else {
                                            let htmlString = htmlToElement(`<div class="post ${theme}" id="${postID}">
                                <div class="post-header">
                                    <h1 style="display: none" data-value = ${postID}></h1>
                                    <a href="https://contextr.io/users/${posteeUsername}"><h3>@${posteeUsername}</h3></a>
                                    <a href="https://contextr.io/users/${posterUsername}"><h4>Quoted by: @${posterUsername}</h4></a>
                                    <h4>${dateFormatted}</h4>
                                </div>
                                <div class="post-quote">
                                    <img class="funky-quote-open" src="../assets/quote-open.png"/>
                                    <p>${text}</p>
                                    <img class="funky-quote-close" src="../assets/quote-close.png"/>
                                </div>
                                <div class="post-footer">
                                    <div class="post-actions">
                                        <i class="fab fa-gratipay heart like" style="background: transparent; -webkit-text-fill-color: mediumvioletred !important"></i>
                                        <i class="fas fa-comment-dots comment" style="color: #4063a0;"></i>
                                    </div>
                                    <div class="post-stats">
                                        <i class="fab fa-gratipay heart likes"></i>
                                        <h6>${transformedLikes.size} Likes</h6>
                                        <i class="fas fa-comment-dots comments" style="color: #4063a0;"></i>
                                        <h6>${numComments} Comments</h6>
                                    </div>
                                </div>
                                <div class="post-comments">
                                    <textarea class="comment" placeholder="Leave a comment..." maxlength=90></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                            $('.content-area > .container').append(htmlString)
                                        }
                                    }
                                }
                            })
                        })
                        if (numComments > 3) {
                            firebase.firestore().collection('posts').doc(postID).get().then(async function () {
                                var count = 1
                                for (const [key, value] of Object.entries(comments)) {
                                    let time = key
                                    let commentUserID = value[0]
                                    let commentString = value[1]
                                    if (count < 3) {
                                        await firebase.firestore().collection('users').doc(commentUserID).get().then(async function (doc) {
                                            let commentUsername = await doc.data().name
                                            let htmlString = htmlToElement(`<div class="individual-comments" id="${time + commentUserID}">
                                            <div class="container-individual-comments">
                                                <a href="https://contextr.io/users/${commentUsername}"><h6>@${commentUsername}</h6></a>
                                                <p>${commentString}</p>
                                            </div>
                                            <h4>${dhm(new Date().getTime() - time)}</h4>
                                        </div>`)
                                            document.getElementById(postID).appendChild(htmlString)
                                        })
                                        await firebase.storage().ref().child('users/' + commentUserID + '/profile').getDownloadURL().then(async function (result) {
                                            var imgUrl = await result
                                            let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                                            document.getElementById(time + commentUserID).prepend(imgString)
                                        })
                                        count += 1;
                                    } else if (count == 3) {
                                        await firebase.firestore().collection('users').doc(commentUserID).get().then(async function (doc) {
                                            let commentUsername = await doc.data().name
                                            let htmlString = htmlToElement(`<div class="individual-comments" id="${time + commentUserID}">
                                            <div class="container-individual-comments">
                                                <a href="https://contextr.io/users/${commentUsername}"><h6>@${commentUsername}</h6></a>
                                                <p>${commentString}</p>
                                                <p class="see-all-comments" style="color: rgb(77, 77, 201) !important;">See all comments</p>
                                            </div>
                                            <h4>${dhm(new Date().getTime() - time)}</h4>
                                        </div>`)
                                            document.getElementById(postID).appendChild(htmlString)
                                        })
                                        await firebase.storage().ref().child('users/' + commentUserID + '/profile').getDownloadURL().then(async function (result) {
                                            var imgUrl = await result
                                            let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                                            document.getElementById(time + commentUserID).prepend(imgString)
                                        })
                                        count += 1
                                    } else {
                                        await firebase.firestore().collection('users').doc(commentUserID).get().then(async function (doc) {
                                            let commentUsername = await doc.data().name
                                            let htmlString = htmlToElement(`<div style="display: none" class="individual-comments" id="${time + commentUserID}">
                                            <div class="container-individual-comments">
                                                <a href="https://contextr.io/users/${commentUsername}"><h6>@${commentUsername}</h6></a>
                                                <p>${commentString}</p>
                                            </div>
                                            <h4>${dhm(new Date().getTime() - time)}</h4>
                                        </div>`)
                                            document.getElementById(postID).appendChild(htmlString)
                                        })
                                        await firebase.storage().ref().child('users/' + commentUserID + '/profile').getDownloadURL().then(async function (result) {
                                            var imgUrl = await result
                                            let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                                            document.getElementById(time + commentUserID).prepend(imgString)
                                        })
                                    }
                                }
                            })
                        } else {
                            firebase.firestore().collection('posts').doc(postID).get().then(async function () {
                                    for (const [key, value] of Object.entries(comments)) {
                                        let time = key
                                        let commentUserID = value[0]
                                        let commentString = value[1]
                                        await firebase.firestore().collection('users').doc(commentUserID).get().then(async function (doc) {
                                            let commentUsername = await doc.data().name
                                            let htmlString = htmlToElement(`<div class="individual-comments" id="${time + commentUserID}">
                                        <div class="container-individual-comments">
                                            <a href="https://contextr.io/users/${commentUsername}"><h6>@${commentUsername}</h6></a>
                                            <p>${commentString}</p>
                                        </div>
                                        <h4>${dhm(new Date().getTime() - time)}</h4>
                                    </div>`)
                                            console.log(postID)
                                            document.getElementById(postID).appendChild(htmlString)
                                        })
                                        await firebase.storage().ref().child('users/' + commentUserID + '/profile').getDownloadURL().then(async function (result) {
                                            var imgUrl = await result
                                            let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                                            document.getElementById(time + commentUserID).prepend(imgString)
                                        })
                                    }
                                }
                            )
                        }
                    })
                }

                /*$('.see-all').click(function () {
                    var buttonId = $(this).attr('id');
                    $('#modal-container').removeAttr('class').addClass(buttonId);
                    $('body').addClass('modal-active');
                });*/


                /*$('.see-all-comments').on('click', (e) => {
                    $(e.target).parent().parent().parent().find('.individual-comments').css('display', '')
                    $(e.target).css('display', 'none')
                })*/

                /*$('#slide-left').click(function () {
                    $('.post-style-selections').css('left', '0')
                })*/

                /*$('#slide-right').click(function () {
                    let windowSize = $(window).width();
                    $('.post-style-selections').css('left', ((965 - windowSize * 0.336) * -1).toString() + 'px')
                })*/

                /*$('.prompt-name-image').click(function () {
                    $('.prompt-dropdown').css({
                        'margin-top': '-35px',
                        'margin-bottom': '130px',
                        'opacity': '1',
                        'pointer-events': 'all',
                    });
                    //write cite function
                    document.getElementById('currently-citing').innerHTML = "Currently citing: " + $('p', this).attr('id')
                })*/

                /*$('#post-text').on('input', function () {
                    var charCount = document.getElementById('post-text').value.length
                    document.getElementById('num-chars').innerHTML = "Characters: " + charCount.toString() + "/175"
                })*/

                /*$('#cancel').click(function () {
                    $('.prompt-dropdown').css({
                        'margin-top': '-205px',
                        'margin-bottom': '50px',
                        'opacity': '0',
                        'pointer-events': 'none'
                    });
                    document.getElementById('post-text').placeholder = "Be ruthless..."
                    $('.post-style-selections > button').css({'filter': 'brightness(100%)'});
                    document.getElementById('post-text').value = '';
                    $('#post-style-selections').attr('data-value', 'null')
                })*/
            }
        }
    )
});