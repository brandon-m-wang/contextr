$(document).ready(function () {

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

function addFriend(){
    var friendName = document.getElementById("query").value;
    if(freindName = ""){
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
}