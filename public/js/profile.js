$(document).ready(function () {

    $('.edit-profile').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#modal-container').removeAttr('class').addClass(buttonId);
        $('body').addClass('modal-active');
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

    function getPostDate(postID){
        var postDate = postID.substr(0, 7) + postID.substr(14);
        var date = new Date(parseInt(postDate));

        //Fri Jan 08 2021 20:35:44 GMT-0600 (Central Standard Time)
        var temp = date.toString().substring(4, 10) + "," +  date.toString().substring(10, 15);
        var hour = parseInt(date.toString().substring(16, 18));
        var suffix = "am"
        if(hour >= 12){
            suffix = 'pm'
        }
        if(hour > 12){
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
                for (let i = 1; i < allPosts.length + 1; i++) {
                    if ((new Date().getTime() - getPostDate(allPosts[allPosts.length - i])[2]) < 604800000) {
                        postsToGenerate[getPostDate(allPosts[allPosts.length - i])[2]] = allPosts[allPosts.length - i]
                    }
                }
            })
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

function changeUserInfo() {
    var db = firebase.firestore();
    var bioText = document.getElementById("bio").value;
    var nameText = document.getElementById("username").value;
    var username = db.collection("usernames").doc(nameText);
    var flag = false;
    console.log(username);

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
        }
        ;
    });
};

