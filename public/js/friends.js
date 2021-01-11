$(document).ready(function () {

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    var friendRequests = document.getElementsByClassName("requests")[0];

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid;
            console.log(userID);
            firebase.firestore().collection("userspublic").doc(userID).get().then(async function (doc) {
                for (let i = 0; i < doc.data().requestsIn.length; i++) {
                    console.log(i);
                    var requestID = doc.data().requestsIn[i];
                    await firebase.firestore().collection("users").doc(requestID).get().then(function (doc) {
                        var name = '@' + doc.data().name
                        let htmlString = `<div id = '${name}' class='${'request' + ' ' + i.toString()}'><div class='request-info'><h6>${name}</h6></div><div class='request-actions'> <a class='${'accept' + ' ' + 'accept' + i.toString()}'>Accept</a> <a class='${'reject' + ' ' + 'reject' + i.toString()}'>Reject</a> </div> </div>`
                        let request = htmlToElement(htmlString);
                        friendRequests.appendChild(request);
                    })
                    await firebase.storage().ref().child('users/' + requestID + '/profile').getDownloadURL().then(function (result) {
                        var imgUrl = result;
                        let imgString = `<img src='${imgUrl}'/>`
                        let request = htmlToElement(imgString);
                        let target = document.getElementsByClassName(i.toString())[0]
                        target.prepend(request)
                    }).then(function () {
                        $('.accept' + i.toString()).click(async function () {
                            var requestUsername = $(this).parent().parent().attr('id').replace("@", '');
                            firebase.auth().onAuthStateChanged(async function (user) {
                                if (user) {
                                    var userID = firebase.auth().currentUser.uid;
                                    console.log(userID);
                                    console.log("requestUsername: " + requestUsername)
                                    await firebase.firestore().collection("usernames").doc(requestUsername).get().then(async function (doc) {
                                        const requestID = await doc.data().username
                                        console.log(requestID)
                                        firebase.firestore().collection("users").doc(requestID).update({
                                            friends: firebase.firestore.FieldValue.arrayUnion(userID)
                                        })
                                        firebase.firestore().collection("users").doc(userID).update({
                                            friends: firebase.firestore.FieldValue.arrayUnion(requestID)
                                        })
                                        firebase.firestore().collection("users").doc(userID).update({
                                            requestsOut: firebase.firestore.FieldValue.arrayRemove(requestID)
                                        })
                                        firebase.firestore().collection("users").doc(requestID).update({
                                            requestsOut: firebase.firestore.FieldValue.arrayRemove(userID)
                                        })
                                        firebase.firestore().collection("userspublic").doc(userID).update({
                                            requestsIn: firebase.firestore.FieldValue.arrayRemove(requestID)
                                        })
                                        firebase.firestore().collection("userspublic").doc(requestID).update({
                                            requestsIn: firebase.firestore.FieldValue.arrayRemove(userID)
                                        })
                                        await firebase.firestore().collection("users").doc(requestID).get().then(function (doc) {
                                            var name = '@' + doc.data().name
                                            var bio = doc.data().bio
                                            let newFriend = htmlToElement(`<div id = "${requestUsername}" class="friend">
                                <div class="friend-info">
                                <h6>${name}</h6>
                                <p>${bio}</p>
                                </div>
                                <div class="friend-actions">
                                    <a class="Remove">Remove</a>
                                    <a class="Report">Report</a>
                                </div>
                            </div>`)
                                            document.getElementById(name).style.display = "none"
                                            document.getElementsByClassName('friends-container')[0].appendChild(newFriend)
                                            firebase.storage().ref().child('users/' + requestID + '/profile').getDownloadURL().then(function (result) {
                                                var imgUrl = result;
                                                let imgString = htmlToElement(`<img src="${imgUrl}"/>`)
                                                document.getElementById(requestUsername).prepend(imgString);
                                            })
                                        })
                                    })
                                }
                            })
                        })
                        $('.reject' + i.toString()).click(async function () {
                            var requestUsername = $(this).parent().parent().attr('id').replace("@", '');
                            firebase.auth().onAuthStateChanged(async function (user) {
                                if (user) {
                                    var userID = firebase.auth().currentUser.uid;
                                    console.log(userID);
                                    console.log("requestUsername: " + requestUsername)
                                    firebase.firestore().collection("usernames").doc(requestUsername).get().then(async function (doc) {
                                        const requestID = await doc.data().username
                                        console.log(requestID)
                                        firebase.firestore().collection("users").doc(userID).update({
                                            requestsOut: firebase.firestore.FieldValue.arrayRemove(requestID)
                                        })
                                        firebase.firestore().collection("users").doc(requestID).update({
                                            requestsOut: firebase.firestore.FieldValue.arrayRemove(userID)
                                        })
                                        firebase.firestore().collection("userspublic").doc(userID).update({
                                            requestsIn: firebase.firestore.FieldValue.arrayRemove(requestID)
                                        })
                                        firebase.firestore().collection("userspublic").doc(requestID).update({
                                            requestsIn: firebase.firestore.FieldValue.arrayRemove(userID)
                                        })
                                        document.getElementById('@'+requestUsername).style.display = "none"
                                    })
                                }
                            })
                        })
                    })
                }
            });
            firebase.firestore().collection("users").doc(userID).get().then(async function (doc) {
                for (let i = 0; i < doc.data().friends.length; i++) {
                    var friendID = doc.data().friends[i]
                    await firebase.firestore().collection("users").doc(friendID).get().then(function (doc) {
                        var name = '@' + doc.data().name
                        var bio = doc.data().bio
                        let htmlString = htmlToElement(`<div class="friend" id=${"friend" + i.toString()}>
                            <div class="friend-info">
                                <h6>${name}</h6>
                                <p>${bio}</p>
                            </div>
                            <div class="friend-actions">
                                <a class="remove">Remove</a>
                                <a class="report">Report</a>
                            </div>
                        </div>`)
                        document.getElementsByClassName('friends-container')[0].appendChild(htmlString)
                    })
                    await firebase.storage().ref().child('users/' + friendID + '/profile').getDownloadURL().then(function (result) {
                        var imgUrl = result
                        let imgString = htmlToElement(`<img src='${imgUrl}'>`)
                        document.getElementById("friend" + i.toString()).prepend(imgString)
                    })
                }
                document.getElementById("loading-gif").style.display = "none";
                document.getElementsByTagName("html")[0].style.visibility = "visible";
            });
        }
    });

    $('#requests-toggle').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#requests-toggle').css("opacity", "1").css("text-shadow", "0px 0px 5px #fff")
        $('#search-toggle').css("opacity", "0.6").css("text-shadow", "none")
        $('.requests').css("display", "flex")
        $('.search-bar').css("display", "none")
    })

    $('#search-toggle').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#search-toggle').css("opacity", "1").css("text-shadow", "0px 0px 5px #fff")
        $('#requests-toggle').css("opacity", "0.6").css("text-shadow", "none")
        $('.requests').css("display", "none")
        $('.search-bar').css("display", "flex")
    })

});

/*

function addFriend(){
    var friendName = document.getElementById("query").value;
    if(friendName = ""){
        return;
    }
    var db = firebase.firestore();
    var friendID = db.collection("usernames").doc(friendName);
    console.log(friendID);
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            var userID = firebase.auth().currentUser.uid;
            friendID.get().then(function(doc) {
                if (doc.exists) {
                        var friendActualID = doc.data().username;
                    db.collection("users").doc(userID).update({
                        requestsOut: firebase.firestore.FieldValue.arrayUnion(friendActualID)
                    });
                    db.collection("userspublic").doc(friendActualID).update({
                        requestsIn: firebase.firestore.FieldValue.arrayUnion(userID)
                    });
                }else{
                    window.alert("This username doesn't exist!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }
    });
}*/