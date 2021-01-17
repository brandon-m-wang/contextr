$(document).on('click', '#Logout', function (e) {
        firebase.auth().signOut().then(function () {
            window.location.replace('https://contextr.io/landing')
        }, function (error) {
            // An error happened.
        });
    })