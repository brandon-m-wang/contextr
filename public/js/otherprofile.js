$(document).ready(function () {

    const pathArray = window.location.pathname.split('/')
    const username = pathArray[2]

    console.log(username)

    firebase.firestore().collection("usernames").doc(username).get().then(function (doc) {
        if (doc.exists) {
            const uid = doc.data().username
            firebase.storage().ref().child('users/' + uid + '/profile.JPG').getDownloadURL().then(function (result) {
                document.getElementById('pfp').src = result;
            });
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