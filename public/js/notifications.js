function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

$(document).ready(function () {

    $(document).on('click', '#Logout', function (e) {
        firebase.auth().signOut().then(function () {
            window.location.replace('https://contextr.io/landing')
        }, function (error) {
            // An error happened.
        });
    })

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid;
            await firebase.firestore().collection('userspublic').doc(userID).get().then(async function (doc) {
                var notifs = doc.data().notifications
                for (let i = 0; i < notifs.length && i < 10; i++) {
                    await firebase.firestore().collection('posts').doc(notifs[i]).get().then(function (doc) {
                        var formattedDate = doc.data().dateFormatted
                        var writer = doc.data().poster
                        var theme = doc.data().theme
                        firebase.firestore().collection('users').doc(writer).get().then(function (doc) {
                            var writerUser = doc.data().name
                            let htmlString = htmlToElement(`<div class="post ${theme}" id=${notifs[i]}>
                        <h3>${writerUser} cited you @ ${formattedDate}</h3>
                    </div>`)
                            $('.content-area > .container').append(htmlString)
                        })
                    })
                }
            })
            document.getElementById("loading-gif").style.display = "none";
            document.getElementsByTagName("html")[0].style.visibility = "visible";
            document.getElementsByTagName("html")[0].style.position = '';
        }
    })

})