$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const uid = firebase.auth().currentUser.uid;
            console.log(uid);

            firebase.firestore().collection("users").doc(uid).get().then(function (doc) {
                const bio = doc.data().bio
                const username = doc.data().name
                document.getElementById("user-bio").innerHTML = bio
                document.getElementById("the-username").innerHTML = '@' + username;
            });
            firebase.storage().ref().child('users/' + uid + '/profile').getDownloadURL().then(function (result) {
                document.getElementById('pfp').src = result;
            }).catch(function (error) {
                console.log("Error getting document:", error);
                document.getElementById("loading-gif").style.display = "none";
                document.getElementsByTagName("html")[0].style.visibility = "visible";
            });
        }
    });
    document.getElementById('pfp').onload = function () {
        document.getElementById("loading-gif").style.display = "none";
        document.getElementsByTagName("html")[0].style.visibility = "visible";
    }
});