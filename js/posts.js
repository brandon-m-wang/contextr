function getPosts(user){
    var posts = new Array();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var listRef = storageRef.child('users/' + user + 'friends');
    listRef.listAll().then(function(res){
        // could be res.prefixes?
        res.items.forEach(function(itemRef){
            let name = itemRef.name;
            var listRef2 = storageRef.child('users/' + name + 'posts');
            listRef2.listAll().then(function(res2){
                let index = 0;
                res2.items.forEach(function(itemRef2){
                    if(index >= 2){
                        break;
                    }else{
                        index++;
                    }
                    //This could have the extension in it
                    var postID = itemRef2.name;
                    posts.add(storageRef.child('posts/' + postID));
                })
            });
        });
    }).catch(function(error) {
        console.log("error");
    });
}

var today = new Date();
function isRecent(date) {
    
}