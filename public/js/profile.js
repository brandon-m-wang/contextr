$(document).ready(function () {

    $('.edit-profile').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#modal-container').removeAttr('class').addClass(buttonId);
        $('body').addClass('modal-active');
    })


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
});

$("#submit").submit(function (e) {
    e.preventDefault();
});

function changeProfilePic(e) {
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var imageRef = storageRef.child('users/' + firebase.auth().currentUser.uid + '/profile');
            imageRef.put(file).then(function (snapshot) {
                console.log('Uploaded image');
                document.getElementById('pfp').src = file
            });
        }
    });
}

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
                            };
                        });
                    }).then(function(){
                        const newUrl = nameText;
                        history.pushState({}, null, newUrl);
                    });
                };
            });
        };
    });
};

