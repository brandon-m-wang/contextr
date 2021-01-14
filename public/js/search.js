async function findNames() {
    var names = [];
    var searchTerm = "z";
    var numNames = 10; //Change to number that will fit on screen
    let usernames = firebase.firestore().collection('usernames');
    if(searchTerm.length != 0){
        await usernames.get().then(async function(name) {
            for (doc of name.docs) {
                if(names.length >= numNames){
                    break;
                }
                if(doc.id.substring(0, searchTerm.length) == searchTerm){
                    names.push(doc.data().username);
                }
            }
        });
    }
    console.log(names);
    return names;
}