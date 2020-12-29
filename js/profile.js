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

/*function loadProfile(){
    var user = 
}*/

function changeProfilePic(e){
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref();
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            var imageRef = storageRef.child('users/' + firebase.auth().currentUser.uid + '/profile');
            imageRef.put(file).then(function(snapshot) {
                console.log('Uploaded image');
            });
        }
    });
}

function changeUserInfo(){
    var db = firebase.firestore();
    var bioText = document.getElementById("bio").value;
    var nameText = document.getElementById("username").value;
    var username = db.collection("usernames").doc(nameText);
    console.log(username);

    username.get().then(function(doc) {
        if (doc.exists) {
            window.alert("This username is already in use");
        } else {
            firebase.auth().onAuthStateChanged(function(user) {
                if(user){
                    var userID = firebase.auth().currentUser.uid;
                    db.collection('users').doc('' + userID).update({
                        bio: bioText,
                        name: nameText
                    })
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });     
                }
            });
        }
    });
}
