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
    var db = firebase.firestore();
    var username = db.collection("usernames").doc(friendName);
    console.log(username);
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            var userID = firebase.auth().currentUser.uid;
            username.get().then(function(doc) {
                if (doc.exists) {
                    db.collection("users").doc(userID).update({
                        requestsOut: firebase.firestore.FieldValue.arrayUnion(friendName)
                    });
                    console.log("hpwdy");
                }else{
                    window.alert("This username doesn't exist!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }
    });
}