$(document).ready(function () {

    $(document).on('click', '#Logout', function (e) {
        firebase.auth().signOut().then(function () {
            window.location.replace('https://contextr.io/landing')
        }, function (error) {
            // An error happened.
        });
    })

    $('.edit-profile').click(function () {
        var buttonId = $(this).attr('id');
        $('#modal-container').removeAttr('class').addClass(buttonId);
        $('body').addClass('modal-active');
        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                const userID = firebase.auth().currentUser.uid;
                firebase.firestore().collection('users').doc(userID).get().then(function (doc) {
                    $('#username').attr('value', doc.data().name)
                    document.getElementById('bio').value = doc.data().bio
                })
            }
        })
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
                                if(numLikes == 2){
                                    $(e.target).parent().parent().find('.post-stats').children().eq(1).html(newLikes.toString() + ' Like')
                                }else{
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
                                if(numLikes == 0){
                                    $(e.target).parent().parent().find('.post-stats').children().eq(1).html(newLikes.toString() + ' Like')
                                }else{
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
    let timeout = null;
    $(document).on('click', '.delete-post', async function (e) {
        clearTimeout(timeout);
        var postToDelete = $(e.target).parent().parent().attr('id')
        await firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                const userID = firebase.auth().currentUser.uid;
                firebase.firestore().collection('users').doc(userID).update({
                    posts: firebase.firestore.FieldValue.arrayRemove(postToDelete)
                })
                firebase.firestore().collection('posts').doc(postToDelete).delete()
            }
        })
        e.target.innerHTML = 'Removing...'
        e.target.style.width = '75px';
        timeout = setTimeout(async function () {
            $(e.target).parent().parent().remove()
        }, 1000)
    })

    $(document).on('click', function (event) {
        if (event.target.className == "comment" || $.inArray("post-the-comment", event.target.classList) !== -1) {
            return
        }
        var $target = $(event.target);
        console.log($target.parent())
        $target.parent().find('.post-the-comment').css({'visibility': 'hidden', 'pointer-events': 'none'})
    })

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

    function getPostDate(postID) {
        var postDate = postID.substr(0, 7) + postID.substr(14);
        var date = new Date(parseInt(postDate));

        //Fri Jan 08 2021 20:35:44 GMT-0600 (Central Standard Time)
        var temp = date.toString().substring(4, 10) + "," + date.toString().substring(10, 15);
        var hour = parseInt(date.toString().substring(16, 18));
        var suffix = "am"
        if (hour >= 12) {
            suffix = 'pm'
        }
        if (hour > 12) {
            hour -= 12;
        }
        temp += " | " + hour + date.toString().substring(18, 21) + " " + suffix;
        return [temp, date, postDate]
    }

    $(document).click(function (event) {
        if (event.target.id == "five") {
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
            const userID = firebase.auth().currentUser.uid;
            var postsToGenerate = {}
            await firebase.firestore().collection('users').doc(userID).get().then(async function (doc) {
                var allPosts = await doc.data().posts
                var friends = await doc.data().friends
                document.getElementsByClassName('details')[0].children[2].innerHTML = "<span>" + friends.length.toString() + " " + "</span>Friends"
                document.getElementsByClassName('details')[0].children[0].innerHTML = "<span>" + allPosts.length.toString() + " " + "</span>Citations"
                for (let i = 1; i < allPosts.length + 1; i++) {
                    if ((new Date().getTime() - getPostDate(allPosts[allPosts.length - i])[2]) < 604800000) {
                        postsToGenerate[getPostDate(allPosts[allPosts.length - i])[2]] = allPosts[allPosts.length - i]
                    }
                }
            })
            var totalLikes = 0
            for (const [key, value] of Object.entries(postsToGenerate)) {
                console.log("ran")
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
                    totalLikes += transformedLikes.size
                    console.log(transformedLikes)
                    var liked = transformedLikes.has(userID)
                    console.log(liked)
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
                    firebase.firestore().collection('users').doc(poster).get().then(function (doc) {
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
                            <a class="delete-post">Remove</a>
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
                                    <a class="delete-post">Remove</a>
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
                            <a class="delete-post">Remove</a>
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
                                    <a class="delete-post">Remove</a>
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
                            <a class="delete-post">Remove</a>
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
                            <a class="delete-post">Remove</a>
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
                            <a class="delete-post">Remove</a>
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
                            <a class="delete-post">Remove</a>
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
                            console.log("run")
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
                                console.log("run")
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
            document.getElementsByClassName('details')[0].children[1].innerHTML = "<span>" + totalLikes.toString() + " " + "</span>Likes"
        }
    })
});

$("#submit").submit(function (e) {
    e.preventDefault();
});

function changeProfilePic(e) {
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref();
    var reader = new FileReader();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var imageRef = storageRef.child('users/' + firebase.auth().currentUser.uid + '/profile');
            imageRef.put(file).then(function (snapshot) {
                console.log('Uploaded image');
            });
        }
    });
    var imgtag = document.getElementById("pfp");
    imgtag.title = file.name;

    reader.onload = function (e) {
        imgtag.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// **01/04 needs support for updating requestsOut (on current user), requestsIn (on other users) for when username
// gets changed. Also split edit into edit username and edit bio.

async function changeUserInfo() {
    var db = firebase.firestore();
    var bioText = document.getElementById("bio").value;
    var nameText = document.getElementById("username").value;
    var username = db.collection("usernames").doc(nameText);
    var flag = false;
    var bioOnly = false;
    console.log(username);
    await firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            bioOnly = true;
            const uid = firebase.auth().currentUser.uid;
            firebase.firestore().collection('users').doc(uid).get().then(function (doc) {
                document.getElementById('user-bio').innerHTML = bioText
                if (doc.data().name == nameText) {
                    db.collection('users').doc('' + uid).update({
                        bio: bioText,
                    })
                }
            })
        }
    })
    if (bioOnly == true) {
        $('#modal-container').addClass('out');
        $('body').removeClass('modal-active');
        return
    }
    username.get().then(function (doc) {
        if (doc.exists) {
            window.alert("This username is already in use");
            flag = true;
        } else {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    const uid = firebase.auth().currentUser.uid;
                    firebase.firestore().collection("users").doc(uid).get().then(function (test) {
                        const currUsername = test.data().name
                        console.log(currUsername)
                        db.collection('usernames').doc(currUsername).delete();
                    }).then(function () {
                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user && flag == false) {
                                var userID = firebase.auth().currentUser.uid;
                                document.getElementById('the-username').innerHTML = "@" + nameText;
                                document.getElementById('user-bio').innerHTML = bioText;
                                db.collection('users').doc('' + userID).update({
                                    bio: bioText,
                                    name: nameText
                                });
                                db.collection('usernames').doc(nameText).set({
                                    username: userID
                                });
                            }
                            ;
                        });
                    }).then(function () {
                        const newUrl = nameText;
                        history.pushState({}, null, newUrl);
                    });
                }
                ;
            });
            document.getElementById('user-bio').innerHTML = bioText
            document.getElementById('the-username').innerHTML = nameText
            $('#modal-container').addClass('out');
            $('body').removeClass('modal-active');
        }
        ;
    });
};

