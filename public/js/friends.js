$(document).ready(function () {

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    var friendRequests = document.getElementsByClassName("requests")[0];

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userID = firebase.auth().currentUser.uid;
            console.log(userID);
            firebase.firestore().collection("userspublic").doc(userID).get().then(function (doc) {
                for (let i = 0; i < doc.data().requestsIn.length; i++) {
                    console.log(i);
                    const requestID = doc.data().requestsIn[i];
                    firebase.firestore().collection("users").doc(requestID).get().then(function (doc) {
                        var name = '@' + doc.data().name
                        console.log(name);
                        firebase.storage().ref().child('users/' + requestID + '/profile').getDownloadURL().then(function (result) {
                            var imgUrl = result;
                            let htmlString = `<div class='request'><img src='${imgUrl}'/><div class='request-info'><h6>${name}</h6></div><div class='request-actions'> <a><h5>Accept</h5></a> <a><h5>Reject</h5></a> </div> </div>`
                            let request = htmlToElement(htmlString);
                            friendRequests.appendChild(request);
                        }).catch(function (error) {
                            console.log(error);
                            let htmlString = `<div class='request'><img src='https://prod.wp.cdn.aws.wfu.edu/sites/202/2017/11/empty-avatar-700x480.png'/><div class='request-info'><h6>${name}</h6></div><div class='request-actions'> <a><h5>Accept</h5></a> <a><h5>Reject</h5></a> </div> </div>`
                            let request = htmlToElement(htmlString);
                            friendRequests.appendChild(request);
                        });
                    });
                }
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