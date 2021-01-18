function loadXHR(url) {

    return new Promise(function (resolve, reject) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = function () {
                reject("Network error.")
            };
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject("Loading error:" + xhr.statusText)
                }
            };
            xhr.send();
        } catch (err) {
            reject(err.message)
        }
    });
}

function logIn() {
    const email = document.getElementById("email_login").value;
    const password = document.getElementById("password_login").value;

    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                // window.location.href = "../index.html";
                window.location.replace('https://contextr.io/')
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert(errorMessage);
            });
    })
}

function signUp(callback) {
    var nameIn = document.getElementById("name_signup").value;
    var email = document.getElementById("email_signup").value;
    var password = document.getElementById("password_signup").value;

    var username = firebase.firestore().collection("usernames").doc(nameIn);
    username.get().then(function (doc) {
        if (doc.exists) {
            window.alert("This username is already in use");
            return
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function (result) {
                    firebase.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                var userID = firebase.auth().currentUser.uid;
                                firebase.firestore().collection('userspublic').doc(userID).set({
                                    requestsIn: [],
                                    notifications: []
                                })
                                firebase.firestore().collection('users').doc(userID).set({
                                    bio: "",
                                    name: nameIn,
                                    friends: [],
                                    requestsOut: [],
                                    posts: []
                                    //gotta somehow add in the other folders here??
                                })
                                firebase.firestore().collection('usernames').doc(nameIn).set({
                                    username: userID
                                });
                            }
                        }
                    );
                }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert(errorMessage);
            }).then(async function(){
                await loadXHR("default.png").then(async function (blob) {
                                var imageRef = await firebase.storage().ref().child('users/' + firebase.auth().currentUser.uid + '/profile');
                                    await imageRef.put(blob).then(function (snapshot) {console.log('Uploaded image');
                                    })
                                }).then(function () {
                                    console.log("User successfully written!");
                                })
                                    .catch(function (error) {
                                        console.error("Error writing document: ", error);
                                    });
            }).then(function () {
                callback()
            })
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function redirect() {
    window.location.replace('https://contextr.io/')
}