function getPosts(){
    //firebase.auth().currentUser.email
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // User isn't signed in.
            window.location.href = "../html/landing.html";
        } else {
            // User is signed in
            var username = 'zanenasrallah';
            var posts = new Array();
            var storageRef = firebase.storage().ref();
            var listRef = storageRef.child('users/' + username + '/friends');
            listRef.listAll().then(function(res){
                // could be res.prefixes?
                res.items.forEach(function(itemRef){
                    var name = itemRef.name();
                    var listRef2 = storageRef.child('users/' + name + '/posts');
                    listRef2.listAll().then(function(res2){
                        var index = -1;
                        res2.items.some(function(itemRef2){
                            console.log(index);
                            //This could have the extension in it
                            var postID = itemRef2.name;
                            console.log(postID);
                            posts.add(storageRef.child('posts/' + postID));
                            return index++ == 2;
                        })
                    });
                });
            });
        }
    });
}

function createID(){
    var unique = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 7; i++ ) {
        unique += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const now = String(Date.now());
    const middlePos = Math.ceil(now.length / 2);
    let output = ("" + (now.substr(0, middlePos)).concat(unique)).concat(now.substr(middlePos));
    return output;
}

function createPost(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var db = firebase.firestore();
            var postID = createID();
            var writer = firebase.auth().currentUser.uid;
            var cited = "Vf9l4Unb5qdShTx77r2DC1KdMG43"; //Change this to whoever is being posted about
            var quote = "testing quote"; //Change to actual quot
            var theme = "happy"; //Change to theme

            db.collection('posts').doc(postID).set({
                poster: writer,
                postee: cited,
                theme: theme,
                text: quote,
                comments: [],
                likes: []
            })
            db.collection('userspublic').doc(writer).update({
                notifications: firebase.firestore.FieldValue.arrayUnion(postID) 
            })
            db.collection('users').doc(writer).update({
                posts: firebase.firestore.FieldValue.arrayUnion(postID)                
            })
        }
    });
}