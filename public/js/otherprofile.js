$(document).ready(async function () {

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    $(document).on('click', function (event) {
        if (event.target.className == "comment" || $.inArray("post-the-comment", event.target.classList) !== -1) {
            return
        }
        var $target = $(event.target);
        console.log($target.parent())
        $target.parent().find('.post-the-comment').css({'visibility': 'hidden', 'pointer-events': 'none'})
    })

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

    const pathArray = window.location.pathname.split('/')
    const username = pathArray[2]

    await firebase.firestore().collection("usernames").doc(username).get().then(async function (doc) {
        if (doc.exists) {
            const uid = doc.data().username
            firebase.auth().onAuthStateChanged(async function (user) {
                if (user) {
                    const userID = firebase.auth().currentUser.uid;
                    var postsToGenerate = {}
                    await firebase.firestore().collection('users').doc(uid).get().then(async function (doc) {
                        var allPosts = await doc.data().posts
                        for (let i = 1; i < allPosts.length + 1; i++) {
                            if ((new Date().getTime() - getPostDate(allPosts[allPosts.length - i])[2]) < 604800000) {
                                postsToGenerate[getPostDate(allPosts[allPosts.length - i])[2]] = allPosts[allPosts.length - i]
                            }
                        }
                    })
                    console.log(postsToGenerate)
                    if (userID === uid) {
                        var script = document.createElement('script');
                        script.src = '../js/profile.js';
                        document.head.appendChild(script);
                        const edit = htmlToElement("<div class='change-pfp'><input id='new-pfp' type='file' accept='image/*' onchange='changeProfilePic(event)' style='opacity: 0.0; position: absolute; top: 0; left: 0; bottom:0; right: 0; width: 100%; height:100%;'/><h5>Change picture</h5></div>");
                        const pfpContainer = document.getElementsByClassName('pfp-container')[0]
                        pfpContainer.appendChild(edit);
                        const editDetails = htmlToElement("<div class='edit-profile' id='five'>Edit</div>");
                        const container = document.getElementsByClassName('profile-container')[0]
                        container.appendChild(editDetails);
                    } else {
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
                        firebase.firestore().collection("users").doc(userID).get().then(function (subdoc) {
                            if (subdoc.data().friends.includes(uid)) {
                                const addFriend = htmlToElement("<div class='add-friend' id='five'" +
                                    "style='background-color: rgba(82,169,88," +
                                    " 0.5)'>Friends</div>");
                                const container = document.getElementsByClassName('profile-container')[0]
                                container.appendChild(addFriend);
                            } else {
                                if (!(subdoc.data().requestsOut.includes(uid))) {
                                    const addFriend = htmlToElement("<div class='add-friend' id='five'" +
                                        " onclick='addFriend()'>Add Friend</div>");
                                    const container = document.getElementsByClassName('profile-container')[0]
                                    container.appendChild(addFriend);
                                } else {
                                    const addFriend = htmlToElement("<div class='add-friend' id='five'" +
                                        " onclick='addFriend()' style='background-color: rgba(82,169,88," +
                                        " 0.5)'>Requested!</div>");
                                    const container = document.getElementsByClassName('profile-container')[0]
                                    container.appendChild(addFriend);
                                }
                            }
                        });
                        firebase.firestore().collection('users').doc(uid).get().then(function (subdoc){
                            let friends = subdoc.data().friends
                            let allPosts = subdoc.data().posts
                            document.getElementsByClassName('details')[0].children[2].innerHTML = "<span>" + friends.length.toString() + " " + "</span>Friends"
                            document.getElementsByClassName('details')[0].children[0].innerHTML = "<span>" + allPosts.length.toString() + " " + "</span>Citations"
                        })
                        //generate nondeleteable posts
                        if (Object.entries(postsToGenerate).length == 0){
                            document.getElementsByClassName('details')[0].children[1].innerHTML = "<span>" + "0 " + "</span>Likes"
                        }
                        var totalLikes = 0;
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
                                console.log(transformedLikes)
                                var liked = transformedLikes.has(userID)
                                totalLikes += transformedLikes.size;
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
                }
            });
            firebase.firestore().collection("users").doc(uid).get().then(function (doc) {
                const bio = doc.data().bio
                document.getElementById("user-bio").innerHTML = bio
            });
            firebase.storage().ref().child('users/' + uid + '/profile').getDownloadURL().then(function (result) {
                document.getElementById('pfp').src = result;
            }).catch(function (error) {
                console.log(error);
                document.getElementById("loading-gif").style.display = "none";
                document.getElementsByTagName("html")[0].style.visibility = "visible";
                document.getElementById('pfp').src = "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
            });
            document.getElementById("the-username").innerHTML = '@' + username;

        } else {
            // doc.data() will be undefined in this case
            console.log("That username doesnt exist");
            window.location.href = "../404.html";
        }
    });

    document.getElementById('pfp').onload = function () {
        document.getElementById("loading-gif").style.display = "none";
        document.getElementsByTagName("html")[0].style.visibility = "visible";
        document.getElementsByTagName("html")[0].style.position = '';
    }
});

function addFriend() {

    const pathArray = window.location.pathname.split('/');
    var friendName = pathArray[2];

    var db = firebase.firestore();
    var friendID = db.collection("usernames").doc(friendName);
    console.log(friendID);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid;
            friendID.get().then(function (doc) {
                if (doc.exists) {
                    var friendActualID = doc.data().username;
                    db.collection("users").doc(userID).update({
                        requestsOut: firebase.firestore.FieldValue.arrayUnion(friendActualID)
                    });
                    db.collection("userspublic").doc(friendActualID).update({
                        requestsIn: firebase.firestore.FieldValue.arrayUnion(userID)
                    });
                } else {
                    window.alert("This username doesn't exist!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    });
    const button = document.getElementsByClassName("add-friend")[0];
    button.innerHTML = "Requested!";
    button.style.backgroundColor = "rgba(82,169,88, 0.5)";
}

/*function addFriend() {

    const pathArray = window.location.pathname.split('/');
    var username = pathArray[2];

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const uid = firebase.auth().currentUser.uid;
            firebase.firestore().collection("usernames").doc(username).get().then(function (test) {
                var friendUID = test.data().username;
                console.log(friendUID);
                firebase.firestore().collection("users").doc(uid).set({
                    requestsOut: {
                        [username]: friendUID
                    }
                }, {merge: true});
                firebase.firestore().collection("users").doc(uid).get().then(function (subdoc) {
                    var currUsername = subdoc.data().name
                    firebase.firestore().collection("users").doc(friendUID).set({
                        requestsIn: {
                            [currUsername]: uid
                        }
                    }, {merge: true});
                })
            })
        };
    });

    const button = document.getElementsByClassName("add-friend")[0];
    button.innerHTML = "Requested!";
    button.style.backgroundColor = "rgba(82,169,88, 0.5)";
};*/