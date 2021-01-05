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
                        var file = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXT09PZ2dlvb29kZGRYWFhNTU1DQ0M4ODhCQkJLS0siIiLg4OB0dHQGBgYlJSUoKCgtLS1fX19UVFQ8PDxP1g+TAAABX0lEQVR4nO3dOVLDAAAEQcm3LHHY/P+vKCChCKDIRur+weRbtcPL69v79Xq9XW7TeXX68jh+c/i/468epz94nv9guvxwH6Z53LJ5Gc7jsGXjYQeFz80XnhS2KexT2KewT2Gfwr618LH5wqPCNoV9CvsU9insU9insE9hn8I+hX0K+xT2KexT2KewT2HfLgoPCtsU9insU9insE9hn8I+hX0K+xT2KexT2KewT2Gfwj6FfQr7FPYp7FPYt4vFkMI4hX0K+xT2KexT2KewT2Gfwj6FfQr7FPYp7FPYp7BPYZ/CPoV9CvsU9u3iZ0ZhnMI+hX0K+xT2KexT2KewT2Gfwj6FfQr7FPYp7FPYp7BPYZ/CvrXwrLBNYZ/CPoV9CvsU9insU9insE9hn8I+hX0K+xT2KexT2KewT2HfWjhtvvCisE1hn8I+hX0K+xT2KexT2LePwnncsnkZ7sthy5aPT3rrDlIBlNiKAAAAAElFTkSuQmCC";
                        var storageRef = firebase.storage().ref();
                        var imageRef = storageRef.child('users/' + firebase.auth().currentUser.uid + '/profile');
                        imageRef.put(file);
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
 