function logIn() {
    const email = document.getElementById("email_login").value;
    const password = document.getElementById("password_login").value;

    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                window.location.href = "../html/home.html";
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert(errorMessage);
            });
    })
}

function signUp(){
    var db = firebase.firestore();
    var name = document.getElementById("name_signup").value;
    var email = document.getElementById("email_signup").value;
    var password = document.getElementById("password_signup").value;
    console.log(name.value, email.value, password.value);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            firebase.auth().onAuthStateChanged(function(user) {
                console.log("2");
                if(user){
                    var userID = firebase.auth().currentUser.uid;
                    db.collection('users').doc('' + userID).set({
                        bio: "",
                        name: name
                        //gotta somehow add in the other folders here??
                    })
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });     
                }
            });
            window.location.href = "../html/home.html";
            return result.user.updateProfile({
                displayName: name
            })
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
        });
}