function logIn() {
    const email = document.getElementById("email_login").value;
    const password = document.getElementById("password_login").value;

    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                // window.location.href = "../index.html";
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
    var nameIn = document.getElementById("name_signup").value;
    var email = document.getElementById("email_signup").value;
    var password = document.getElementById("password_signup").value;
    console.log(nameIn, email, password);

    var username = db.collection("usernames").doc(nameIn);
    username.get().then(function(doc) {
        if (doc.exists) {
            window.alert("This username is already in use");
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(result) {
                firebase.auth().onAuthStateChanged(function(user) {
                    console.log("2");
                    if(user){
                        var userID = firebase.auth().currentUser.uid;
                        db.collection('userspublic').doc(userID).set({
                            requestsIn: [],
                            notifications: []
                        })
                        db.collection('users').doc(userID).set({
                            bio: "",
                            name: nameIn,
                            friends: [],
                            requestsOut: [],
                            posts: []
                            //gotta somehow add in the other folders here??
                        })
                        .then(function() {
                            console.log("User successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                        db.collection('usernames').doc(nameIn).set({
                            username: userID
                        });
                    }
                });
                // window.location.href = "../index.html";
                return result.user.updateProfile({
                    displayName: name
                })
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert(errorMessage);
            });
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}
 