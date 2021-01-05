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
                    } else {
                        firebase.firestore().collection("users").doc(userID).get().then(function (subdoc) {
                            if (subdoc.data().friends.includes(uid)) {
                                const addFriend = htmlToElement("<div class='add-friend' id='five'" +
                                    "style='background-color: rgba(82,169,88," +
                                    " 0.5)'>Friends</div>");
                                const container = document.getElementsByClassName('profile-container')[0]
                                container.appendChild(addFriend);
                            } else {
                                if (!(subdoc.data().requestsOut.includes(uid))) {
                                    const addFriend = htmlToElement("<div class='add-friend' id='five'" +
                                        " onclick='addFriend()'>Add Friend</div>");
                                    const container = document.getElementsByClassName('profile-container')[0]
                                    container.appendChild(addFriend);
                                } else {
                                    const addFriend = htmlToElement("<div class='add-friend' id='five'" +
                                        " onclick='addFriend()' style='background-color: rgba(82,169,88," +
                                        " 0.5)'>Requested!</div>");
                                    const container = document.getElementsByClassName('profile-container')[0]
                                    container.appendChild(addFriend);
                                }
                            }
                        });
                    }
                }
            });
            firebase.firestore().collection("users").doc(uid).get().then(function (doc) {
                const bio = doc.data().bio
                document.getElementById("user-bio").innerHTML = bio
            });
            firebase.storage().ref().child('users/' + uid + '/profile').getDownloadURL().then(function (result) {
                document.getElementById('pfp').src = result;
            }).catch(function (error) {
                console.log(error);
                document.getElementById("loading-gif").style.display = "none";
                document.getElementsByTagName("html")[0].style.visibility = "visible";
                document.getElementById('pfp').src = "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"
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

function addFriend() {

    const pathArray = window.location.pathname.split('/');
    var friendName = pathArray[2];

    var db = firebase.firestore();
    var friendID = db.collection("usernames").doc(friendName);
    console.log(friendID);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid;
            friendID.get().then(function (doc) {
                if (doc.exists) {
                    var friendActualID = doc.data().username;
                    db.collection("users").doc(userID).update({
                        requestsOut: firebase.firestore.FieldValue.arrayUnion(friendActualID)
                    });
                    db.collection("userspublic").doc(friendActualID).update({
                        requestsIn: firebase.firestore.FieldValue.arrayUnion(userID)
                    });
                } else {
                    window.alert("This username doesn't exist!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    });
    const button = document.getElementsByClassName("add-friend")[0];
    button.innerHTML = "Requested!";
    button.style.backgroundColor = "rgba(82,169,88, 0.5)";
}

/*function addFriend() {

    const pathArray = window.location.pathname.split('/');
    var username = pathArray[2];

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const uid = firebase.auth().currentUser.uid;
            firebase.firestore().collection("usernames").doc(username).get().then(function (test) {
                var friendUID = test.data().username;
                console.log(friendUID);
                firebase.firestore().collection("users").doc(uid).set({
                    requestsOut: {
                        [username]: friendUID
                    }
                }, {merge: true});
                firebase.firestore().collection("users").doc(uid).get().then(function (subdoc) {
                    var currUsername = subdoc.data().name
                    firebase.firestore().collection("users").doc(friendUID).set({
                        requestsIn: {
                            [currUsername]: uid
                        }
                    }, {merge: true});
                })
            })
        };
    });

    const button = document.getElementsByClassName("add-friend")[0];
    button.innerHTML = "Requested!";
    button.style.backgroundColor = "rgba(82,169,88, 0.5)";
};*/