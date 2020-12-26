function logIn() {
    const email = document.getElementById("email_field").value;
    const password = document.getElementById("password_field").value;

    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                window.location.href = "../homefeed/homefeed.html";
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert(errorMessage);
            });
    })
}

function signUp(){
        var name = document.getElementById("name_signup");
		var email = document.getElementById("email_signup");
        var password = document.getElementById("password_signup");
        console.log(name.value, email.value, password.value);

		firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((user) => {
                window.location.href = "../homefeed/homefeed.html";
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert(errorMessage);
            });
	}