// async function findNames2() {
//     var input = "b";
//     let query = firebase.firestore().collection("usernames");
//     if (input) {
//         const end = input.replace(
//           /.$/, c => String.fromCharCode(c.charCodeAt(0) + 1),
//         );
//         query = query
//           .where(firebase.firestore.FieldPath.documentId(), '>=', input)
//           .where(firebase.firestore.FieldPath.documentId(), '<', end);
//     }
//     const result = await query.get(function(doc) {
//         console.log(doc);
//     });
//     // console.log(result);
//     return result;
// }

async function findNames() {
    var names = [];
    var searchTerm = document.getElementById("query").value.toLowerCase();
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