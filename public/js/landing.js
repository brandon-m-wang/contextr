console.clear();

window.onload = function () {
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signup');

    loginBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode.parentNode;
        Array.from(e.target.parentNode.parentNode.classList).find((element) => {
            if (element !== "slide-up") {

            } else {
                signupBtn.parentNode.classList.add('slide-up')
                parent.classList.remove('slide-up')
                document.getElementById('landing-logo').style.display = "none"
            }
        });
    });

    signupBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode;
        Array.from(e.target.parentNode.classList).find((element) => {
            if (element !== "slide-up") {

            } else {
                loginBtn.parentNode.parentNode.classList.add('slide-up')
                parent.classList.remove('slide-up')
                document.getElementById('landing-logo').style.display = ""
            }
        });
    });
}
$(document).ready(function () {

	firebase.auth().onAuthStateChanged(function (user) {
	    if (!window.HELP_HTML_) {
            window.HELP_HTML_ = true;
            if (user) {
                window.location.replace("https://contextr.io/")
            }
        }
	})

    document.getElementById('name_signup').onkeydown = function (e) {
        var value = e.target.value;
        //only allow a-z, A-Z, digits 0-9 and comma, with only 1 consecutive comma ...
        if (!e.key.match(/[a-zA-Z0-9,]/) || (e.key == ',' && value[value.length - 1] == ',')) {
            e.preventDefault();
        }
    };
})