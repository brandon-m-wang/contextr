$(document).ready(function () {

    $(document).on('click', '#Logout', function (e) {
        firebase.auth().signOut().then(function () {
            window.location.replace('https://contextr.io/landing')
        }, function (error) {
            // An error happened.
        });
    })

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    async function findNames(searchTerm) {
        var names = [];
        var numNames = 10; //Change to number that will fit on screen
        let usernames = firebase.firestore().collection('usernames');
        if (searchTerm.length != 0) {
            await usernames.get().then(async function (name) {
                for (doc of name.docs) {
                    if (names.length >= numNames) {
                        break;
                    }
                    if (doc.id.substring(0, searchTerm.length) == searchTerm) {
                        names.push(doc.data().username);
                    }
                }
            });
        }
        return names;
    }

    let friendTimeout = null;
    $(document).on('click', '.remove', function (e) {
        clearTimeout(friendTimeout);
        var friendToRemove = $(e.target).parent().parent().find('h6').html().substr(1)
        console.log(friendToRemove)
        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                var userID = firebase.auth().currentUser.uid;
                firebase.firestore().collection('usernames').doc(friendToRemove).get().then(function (doc) {
                    var friendToRemoveUID = doc.data().username
                    firebase.firestore().collection('users').doc(friendToRemoveUID).update({
                        friends: firebase.firestore.FieldValue.arrayRemove(userID)
                    })
                    firebase.firestore().collection('users').doc(userID).update({
                        friends: firebase.firestore.FieldValue.arrayRemove(friendToRemoveUID)
                    })
                })
            }
        })
        e.target.innerHTML = 'Removing...'
        e.target.style.width = '50px'
        friendTimeout = setTimeout(function () {
            $(e.target).parent().parent().remove()
        }, 1000)
    })

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
                                    <a class="remove">Remove</a>
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
                                        document.getElementById('@' + requestUsername).style.display = "none"
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
                                <a href="https://contextr.io/users/${name.replace('@', '')}"><h6>${name}</h6></a>
                                <p>${bio}</p>
                            </div>
                            <div class="friend-actions">
                                <a class="remove">Remove</a>
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
                document.getElementsByTagName("html")[0].style.position = '';
            });
        }
    });

    $('#requests-toggle').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#requests-toggle').css("opacity", "1").css("text-shadow", "0px 0px 5px #fff")
        $('#search-toggle').css("opacity", "0.6").css("text-shadow", "none")
        $('.requests').css("display", "flex")
        $('.search-pop').css("display", "none")
    })

    $('#search-toggle').click(function () {
        var buttonId = $(this).attr('id');
        console.log(buttonId)
        $('#search-toggle').css("opacity", "1").css("text-shadow", "0px 0px 5px #fff")
        $('#requests-toggle').css("opacity", "0.6").css("text-shadow", "none")
        $('.requests').css("display", "none")
        $('.search-pop').css("display", "flex")
    })

    let timeout = null;
    $('#query').on('input', async function () {
        clearTimeout(timeout);

        timeout = setTimeout(async function () {
            $('.search-pop').children().not(':first-child').remove();
            var search = $('#query').val().toLowerCase()
            var loadArray = await findNames(search)
            console.log(loadArray)
            if (loadArray.length == 0) {
                let htmlString = htmlToElement(`<h6 style="margin: 2rem 0 0 0; color: white;">No results</h6>`)
                $('.search-pop').append(htmlString)
            }
            for (let i = 0; i < loadArray.length; i++) {
                await firebase.auth().onAuthStateChanged(async function (user) {
                    if (user) {
                        var userID = firebase.auth().currentUser.uid;
                        await firebase.firestore().collection('users').doc(loadArray[i]).get().then(function (doc) {
                            var searchedUser = doc.data().name
                            var searchedUserFriends = doc.data().friends
                            var searchedUserBio = doc.data().bio
                            var searchedUserBioSub = doc.data().bio.substr(0, 19)
                            if (searchedUserFriends.includes(userID)) {
                                let htmlString = htmlToElement(`<div id = "${'search' + searchedUser}" class="friend" style="visibility: hidden">
                                <div class="friend-info">
                                <h6 style="margin: 0; color: white;">@${searchedUser}</h6>
                                <p style="margin: 0.5rem 0; color: white; font-size: 0.75rem;">${(searchedUserBio.length > 19) ? searchedUserBioSub + "..." : searchedUserBio}</p>
                                <i class="fas fa-check" style="color: green; margin: 0"></i>
                                </div>
                            </div>`
                                )
                                $('.search-pop').append(htmlString)
                            } else {
                                let htmlString = htmlToElement(`<div id = "${'search' + searchedUser}" class="friend" style="visibility: hidden">
                                <div class="friend-info">
                                <h6 style="margin: 0; color: white;">@${searchedUser}</h6>
                                <p style="margin: 0.5rem 0; color: white; font-size: 0.75rem;">${(searchedUserBio.length > 19) ? searchedUserBioSub + "..." : searchedUserBio}</p>
                                <a href="https://contextr.io/users/${searchedUser}" style="background: rgba(0, 0, 0, 0.3);
                                color: white;
                                text-align: center;
                                border-radius: 5px;
                                font-size: 0.9rem;
                                width: 3.5rem;
                                padding: 2px 0;">View</a>
                                </div>
                            </div>`
                                )
                                $('.search-pop').append(htmlString)
                            }
                            firebase.storage().ref().child('users/' + loadArray[i] + '/profile').getDownloadURL().then(function (result) {
                                var imgUrl = result;
                                let imgString = htmlToElement(`<img style="height: 75px; width: 75px; margin-top: 0.25rem" src="${imgUrl}"/>`)
                                document.getElementById('search' + searchedUser).prepend(imgString);
                                document.getElementById('search' + searchedUser).getElementsByTagName('img')[0].onload = function () {
                                    document.getElementById('search' + searchedUser).style.visibility = 'visible'
                                    document.getElementById('search' + searchedUser).style.margin = '2rem 0 0 0'
                                };
                            })
                        })
                    }
                })
            }
        }, 1000);
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