function getPosts(){
    var user = 'zanenasrallah';
    var posts = new Array();
    console.log("helo");
    console.log(posts);
    var storageRef = firebase.storage().ref();
    var listRef = storageRef.child('users/' + user + '/friends');
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