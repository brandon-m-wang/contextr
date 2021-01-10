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

            await $('#cancel').click(function () {
                $('.prompt-dropdown').css({'margin-top': '-255px', 'opacity': '0'});
            })

            await $('#confirm').click(function () {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        var db = firebase.firestore();
                        var postID = createID();
                        var writer = firebase.auth().currentUser.uid;
                        //var cited =  document.getElementById('currently-citing').innerHTML.replace('@', '')
                        var quote = document.getElementById('post-text').value
                        var theme = "happy"; //Change to theme
                        firebase.firestore().collection('usernames').
                        db.collection('posts').doc(postID).set({
                            poster: writer,
                            postee: cited,
                            theme: theme,
                            text: quote,
                            comments: [],
                            likes: {}
                        })
                        db.collection('userspublic').doc(writer).update({
                            notifications: firebase.firestore.FieldValue.arrayUnion(postID) 
                        })
                        db.collection('users').doc(writer).update({
                            posts: firebase.firestore.FieldValue.arrayUnion(postID)                
                        })
                    }
                });
            })
        }
    })
});