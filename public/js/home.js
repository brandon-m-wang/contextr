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

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

$(document).ready(function () {

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


    $(document).click(function (event) {
        if (event.target.className == "comment" || $.inArray("post-the-comment", event.target.classList) !== -1) {
            return
        }
        var $target = $(event.target);
        console.log($target.parent())
        if ($target.parent().find('.post-the-comment').css('visibility') == 'visible') {
            $target.parent().find('.post-the-comment').css({'visibility': 'hidden', 'pointer-events': 'none'})
        }
    })

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid;
            console.log(userID);
            //write getPosts method
            var postsToGenerate = []
            await firebase.firestore().collection('users').doc(userID).get().then(async function (doc) {
                var friends = await doc.data().friends
                for (let i = 0; i < friends.length; i++) {
                    await firebase.firestore().collection('users').doc(friends[i]).get().then(async function (doc) {
                        var allPosts = await doc.data().posts
                        for (let i = 1; (i < 4 && i < allPosts.length + 1) && i < 4; i++) {
                            if (new Date() - getPostDate(allPosts[allPosts.length - i])[1] < 604800000) {
                                postsToGenerate.push(allPosts[allPosts.length - i])
                            }
                        }
                    })
                }
            })
            shuffleArray(postsToGenerate);
            for (let i = 0; i < postsToGenerate.length; i++) {
                firebase.firestore().collection('posts').doc(postsToGenerate[i]).get().then(async function (doc) {
                    var poster = doc.data().poster
                    var postee = doc.data().postee
                    var postID = postsToGenerate[i]
                    var dateFormatted = doc.data().dateFormatted
                    var text = doc.data().text
                    var theme = doc.data().theme
                    var likes = doc.data().likes;
                    var transformedLikes = new Map();
                    Object.keys(likes).forEach(e => {
                        transformedLikes.set(String(e), likes[e]);
                    });
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
                    await firebase.firestore().collection('users').doc(poster).get().then(function (doc) {
                        var posterUsername = doc.data().name
                        firebase.firestore().collection('users').doc(postee).get().then(function (doc) {
                            var posteeUsername = doc.data().name
                            if (!liked) {
                                if (transformedLikes.size == 1){
                                    if (numComments == 1){
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
                                    <textarea class="comment" placeholder="Leave a comment..."></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                                <div class="individual-comments">test</div>
                            </div>`)
                                $('.content-area > .container').append(htmlString)
                                    }else{
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
                                            <textarea class="comment" placeholder="Leave a comment..."></textarea>
                                            <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                        </div>
                                        <div class="individual-comments">test</div>
                                    </div>`)
                                        $('.content-area > .container').append(htmlString)
                                    }
                                }else{
                                    if (numComments ==1){
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
                                    <textarea class="comment" placeholder="Leave a comment..."></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                                <div class="individual-comments">test</div>
                            </div>`)
                                $('.content-area > .container').append(htmlString)
                                    }else{
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
                                            <textarea class="comment" placeholder="Leave a comment..."></textarea>
                                            <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                        </div>
                                        <div class="individual-comments">test</div>
                                    </div>`)
                                        $('.content-area > .container').append(htmlString)
                                    }
                                }
                            } else {
                                if(transformedLikes.size == 1){
                                    if(numComments == 1){
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
                                    <textarea class="comment" placeholder="Leave a comment..."></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                $('.content-area > .container').append(htmlString)
                                    }else{
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
                                    <textarea class="comment" placeholder="Leave a comment..."></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                $('.content-area > .container').append(htmlString)
                                    }
                                }else{
                                    if (numComments ==1){
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
                                    <textarea class="comment" placeholder="Leave a comment..."></textarea>
                                    <i style="pointer-events: none; visibility: hidden;" class="fas fa-paper-plane post-the-comment"></i>
                                </div>
                            </div>`)
                                $('.content-area > .container').append(htmlString)
                                    }else{
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
                                    <textarea class="comment" placeholder="Leave a comment..."></textarea>
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
                                    if (count < 3){
                                        await firebase.firestore().collection('users').doc(commentUserID).get().then(async function (doc) {
                                            let commentUsername = await doc.data().name
                                            let htmlString = htmlToElement(`<div class="individual-comments" id="${time + commentUserID}">
                                            <div class="container-individual-comments">
                                                <a><h6>@${commentUsername}</h6></a>
                                                <p>${commentString}</p>
                                            </div>
                                        </div>`)
                                            document.getElementById(postID).appendChild(htmlString)
                                        })
                                        await firebase.storage().ref().child('users/' + commentUserID + '/profile').getDownloadURL().then(async function (result) {
                                            var imgUrl = await result
                                            let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                                            document.getElementById(time + commentUserID).prepend(imgString)
                                        })
                                        count += 1;
                                    }else if (count == 3){
                                        await firebase.firestore().collection('users').doc(commentUserID).get().then(async function (doc) {
                                            let commentUsername = await doc.data().name
                                            let htmlString = htmlToElement(`<div class="individual-comments" id="${time + commentUserID}">
                                            <div class="container-individual-comments">
                                                <a><h6>@${commentUsername}</h6></a>
                                                <p>${commentString}</p>
                                                <p class="see-all-comments" style="color: rgb(77, 77, 201) !important;">See all comments</p>
                                            </div>
                                        </div>`)
                                            document.getElementById(postID).appendChild(htmlString)
                                        })
                                        await firebase.storage().ref().child('users/' + commentUserID + '/profile').getDownloadURL().then(async function (result) {
                                            var imgUrl = await result
                                            let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                                            document.getElementById(time + commentUserID).prepend(imgString)
                                        })
                                        count += 1
                                    }else{
                                        await firebase.firestore().collection('users').doc(commentUserID).get().then(async function (doc) {
                                            let commentUsername = await doc.data().name
                                            let htmlString = htmlToElement(`<div style="display: none" class="individual-comments" id="${time + commentUserID}">
                                            <div class="container-individual-comments">
                                                <a><h6>@${commentUsername}</h6></a>
                                                <p>${commentString}</p>
                                            </div>
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
                                        let htmlString = htmlToElement(`<div class="individual-comments" id="${time+commentUserID}">
                                        <div class="container-individual-comments">
                                            <a><h6>@${commentUsername}</h6></a>
                                            <p>${commentString}</p>
                                        </div>
                                    </div>`)
                                        document.getElementById(postID).appendChild(htmlString)
                                    })
                                    await firebase.storage().ref().child('users/' + commentUserID + '/profile').getDownloadURL().then(async function (result) {
                                            var imgUrl = await result
                                            let imgString = htmlToElement(`<img src=${imgUrl}/>`)
                                            document.getElementById(time+commentUserID).prepend(imgString)
                                    })
                                }
                            }
                        )
                    }
                })
            }
            await firebase.firestore().collection("users").doc(userID).get().then(async function (doc) {
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

            $('.see-all').click(function () {
                var buttonId = $(this).attr('id');
                console.log(buttonId)
                $('#modal-container').removeAttr('class').addClass(buttonId);
                $('body').addClass('modal-active');
            });

            $('.comment').on('click', (e) => {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        $(e.target).parent().find('i').css({'visibility': 'visible', 'pointer-events': 'all'})
                    }
                })
            })

            $('.see-all-comments').on('click', (e) => {
                $(e.target).parent().parent().parent().find('.individual-comments').css('display', '')
                $(e.target).css('display', 'none')
            })

            $('.post-the-comment').on('click', (e) => {
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

            $('.post-actions > .comment').on('click', (e) => {
                $(e.target).parent().parent().parent().find('textarea').scrollIntoView()
            })

            $('#slide-left').click(function () {
                $('.post-style-selections').css('left', '0')
            })

            $('#slide-right').click(function () {
                let windowSize = $(window).width();
                console.log(windowSize * 0.336);
                $('.post-style-selections').css('left', ((965 - windowSize * 0.336) * -1).toString() + 'px')
            })

            $('.prompt-name-image').click(function () {
                $('.prompt-dropdown').css({
                    'margin-top': '-35px',
                    'margin-bottom': '130px',
                    'opacity': '1',
                    'pointer-events': 'all',
                    'cursor': 'pointer'
                });
                //write cite function
                document.getElementById('currently-citing').innerHTML = "Currently citing: " + $('p', this).attr('id')
            })

            $('#cancel').click(function () {
                $('.prompt-dropdown').css({
                    'margin-top': '-205px',
                    'margin-bottom': '50px',
                    'opacity': '0',
                    'pointer-events': 'none'
                });
                $('.post-style-selections > button').css({'filter': 'brightness(100%)'});
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
                firebase.auth().onAuthStateChanged(function (user) {
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
            $('.like').on('click', (e) => {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        var postID = $(e.target).parent().parent().parent().find('h1').attr('data-value');
                        var userID = firebase.auth().currentUser.uid;
                        var post = firebase.firestore().collection('posts').doc(postID);
                        post.get().then(async function (doc) {
                            // if(doc.data().likes.contains(userID)){
                            if (userID in doc.data().likes) {
                                //Unlike post if liked
                                console.log("liked already");
                                $(e.target).css({
                                    'background': 'linear-gradient(to bottom, rgb(136, 123, 176) 0%,' +
                                        ' rgba(203, 157, 156, 1) 100%)',
                                    '-webkit-text-fill-color': 'transparent',
                                    '-webkit-background-clip': 'text'
                                })
                                post.set({
                                    "likes": {
                                        [userID]: firebase.firestore.FieldValue.delete()
                                    }
                                }, {merge: true});
                            } else {
                                //Like post if not liked already
                                console.log("not liked already");
                                $(e.target).css({
                                    'background': 'transparent',
                                    '-webkit-text-fill-color': 'mediumvioletred'
                                })
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
        }
    })
});