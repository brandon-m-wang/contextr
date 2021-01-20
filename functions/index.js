const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.loadUser = functions.https.onRequest((req, res) => {
    res.status(200).send(`<!DOCTYPE html>
<html lang="en" style="visibility: hidden; overflow-x: hidden; position: fixed">
<head>
    <meta charset="UTF-8">
    <title>contextr.io / User</title>
    <link rel="icon" type="image/png" href="../assets/square-logo-cutout.png"/>
    <link rel="stylesheet" href="../css/home.css"/>
    <link rel="stylesheet" href="../css/profile.css"/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css">
    <link href="https://fonts.googleapis.com/css2?family=Yantramanav:wght@100;300;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"/>
</head>
<div id="loading-gif" style="visibility: visible; height: 100vh; width: 100vw;">
    <div class="company">
        <img src="../assets/square-logo-white.png" style="width: 75px; height: 75px;"/>
    </div>
    <section class="sidebar-nav">
        <div class="container">
            <h3><i class="fas fa-home"></i> <a href="home.html">Home</a></h3>
            <h3 style="text-shadow: 0px 0px 5px #fff;
    opacity: 1; !important"><i class="fas fa-user"></i> <a href="profile.html">Profile</a></h3>
            <h3><i class="fas fa-users"></i> <a href="friends.html">Friends</a></h3>
            <h3><i class="fas fa-bell"></i> <a href="notifications.html">Notifications</a></h3>
            <h3><i class="fas fa-question-circle"></i> <a href="help.html">Help</a></h3>
            <i class="fas fa-sign-out-alt"></i>
        </div>
    </section>
    <img src="https://contextr.io/loading.gif" style="position: absolute; height: 100px; width: 100px;
    top: 50%; left: 65%; transform: translateX(-50%) translateY(-50%); filter: drop-shadow(0 0 0.5rem dimgrey);"/>
    <section class="footer">
    <div class="footer-container">
        <h6>© 2021 Brandon Wang | build v0.0.1</h6>
    </div>
</section>
</div>
<body>
<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-analytics.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-storage.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-auth.js"></script>
<script>
    var firebaseConfig = {
        apiKey: "AIzaSyDlCzdF70uR7X2fZ7o0p0ga__0M3zCm1v4",
        authDomain: "contextr.firebaseapp.com",
        projectId: "contextr",
        storageBucket: "contextr.appspot.com",
        messagingSenderId: "794463682882",
        appId: "1:794463682882:web:00e5cb985b2eb9f684c8db",
        measurementId: "G-9EGE324T37"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
</script>
<script>
firebase.auth().onAuthStateChanged(async function (user) {
        if (!window.HELP_HTML_) {
            window.HELP_HTML_ = true;
            if (!(user)) {
                window.alert('Please log-in to continue')
                window.location.replace("https://contextr.io/landing")
            }
        }
    })
</script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<script src="../js/otherprofile.js"></script>
<div class="company">
    <img src="../assets/square-logo-white.png" style="width: 75px; height: 75px;"/>
</div>
<section class="sidebar-nav">
    <div class="container">
        <h3 id="Home"><i class="fas fa-home"></i> <a href="../index.html">Home</a></h3>
        <h3 id="Profile"><i class="fas fa-user"></i> <a href="../profile.html">Profile</a></h3>
        <h3 id="Friends"><i class="fas fa-users"></i> <a href="../friends.html">Friends</a></h3>
        <h3 id="Notifications"><i class="fas fa-bell"></i> <a href="../notifications.html">Notifications</a></h3>
        <h3 id="Help"><i class="fas fa-question-circle"></i> <a href="../help.html">Help</a></h3>
        <i id="Logout" class="fas fa-sign-out-alt"></i>
    </div>
</section>
<div id="modal-container">
    <div class="modal-background">
        <div class="modal" id="the-modal">
            <form action="">
                <label for="username">New username:</label><br>
                <input type="text" id="username" name="username" placeholder="Username..."><br><br>
                <label for="bio">Bio:</label><br>
                <textarea id="bio" rows="4" placeholder="Bio..."></textarea><br>
                <button id="submit" onclick="changeUserInfo(); return false">Save</button>
            </form>
            <rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
            </svg>
        </div>
    </div>
</div>
<section class="profile-area">
    <div class="container">
        <div class="profile-container">
            <div class="pfp-container">
                <img id="pfp"
                     src="https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"/>
            </div>
            <div class="username-and-details">
                <h3 id="the-username">@Username</h3>
                <div class="details">
                    <h6><span>- </span>Citations</h6>
                    <h6><span>- </span>Likes</h6>
                    <h6><span>- </span>Friends</h6>
                </div>
                <p id="user-bio">Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua.</p>
            </div>
        </div>
    </div>
    <div class="profile-posts">
        <h6 class="fancy-header"><span>POSTS</span></h6>
    </div>
</section>
<section class="content-area">
    <div class="container">
        
    </div>
</section>
<section class="footer">
    <div class="footer-container">
        <h6>© 2021 Brandon Wang | build v0.0.1</h6>
    </div>
</section>
<script src="../js/buffer.js"></script>
</body>
</html>`);
});
