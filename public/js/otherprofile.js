$(document).ready(function () {

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    const pathArray = window.location.pathname.split('/')
    const username = pathArray[2]

    firebase.firestore().collection("usernames").doc(username).get().then(function (doc) {
        if (doc.exists) {
            const uid = doc.data().username
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    const userID = firebase.auth().currentUser.uid;
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
                    }
                }
            });
            firebase.firestore().collection("users").doc(uid).get().then(function (doc) {
                const bio = doc.data().bio
                document.getElementById("user-bio").innerHTML = bio
            });
            firebase.storage().ref().child('users/' + uid + '/profile').getDownloadURL().then(function (result) {
                document.getElementById('pfp').src = result;
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
    }
});