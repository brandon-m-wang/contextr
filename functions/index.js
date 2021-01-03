const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

exports.loadUser = functions.https.onRequest((req, res) => {
    res.status(200).send(`<!DOCTYPE html>
<html lang="en" style="visibility: hidden;">
<head>
    <meta charset="UTF-8">
    <title>contextr.io / Home</title>
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
<img src="https://media.tenor.com/images/3a10caa07d3684023e0418b4096eec55/tenor.gif" style="position: absolute;
    top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);"/>
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

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="../js/otherprofile.js"></script>
<div class="company">
    <img src="../assets/square-logo-white.png" style="width: 75px; height: 75px;"/>
</div>
<section class="sidebar-nav">
    <div class="container">
        <h3 id="Home"><i class="fas fa-home"></i> <a href="../html/home.html">Home</a></h3>
        <h3 id="Profile"><i class="fas fa-user"></i> <a href="../html/profile.html">Profile</a></h3>
        <h3 id="Friends"><i class="fas fa-users"></i> <a href="../html/friends.html">Friends</a></h3>
        <h3 id="Notifications"><i class="fas fa-bell"></i> <a href="../html/notifications.html">Notifications</a></h3>
        <h3 id="Help"><i class="fas fa-question-circle"></i> <a href="../html/help.html">Help</a></h3>
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
                <input id="submit" onclick="changeUserInfo()" type="submit" style="margin-top: 1rem;" value="Save">
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
                     src=/>
            </div>
            <div class="username-and-details">
                <h3>@Username</h3>
                <div class="details">
                    <h6><span>12 </span>Citations</h6>
                    <h6><span>142 </span>Likes</h6>
                    <h6><span>15 </span>Friends</h6>
                </div>
                <p>Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
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
        <div class="post man-im-dead">
            <div class="post-header">
                <h3>@Username</h3>
                <h4>Quoted by: @Username</h4>
            </div>
            <div class="post-quote">
                <img class="funky-quote-open" src="../assets/quote-open.png"/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.</p>
                <img class="funky-quote-close" src="../assets/quote-close.png"/>
            </div>
            <div class="post-footer">
                <div class="post-actions">
                    <i class="fab fa-gratipay heart"></i>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                </div>
                <div class="post-stats">
                    <i class="fab fa-gratipay heart"></i>
                    <h6>Likes</h6>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                    <h6>Comments</h6>
                </div>
            </div>
            <div class="post-comments">
                <h6>Leave a comment...</h6>
            </div>
        </div>
        <div class="post taking-a-look">
            <div class="post-header">
                <h3>@Username</h3>
                <h4>Quoted by: @Username</h4>
            </div>
            <div class="post-quote">
                <img class="funky-quote-open" src="../assets/quote-open.png"/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.</p>
                <img class="funky-quote-close" src="../assets/quote-close.png"/>
            </div>
            <div class="post-footer">
                <div class="post-actions">
                    <i class="fab fa-gratipay heart"></i>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                </div>
                <div class="post-stats">
                    <i class="fab fa-gratipay heart"></i>
                    <h6>Likes</h6>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                    <h6>Comments</h6>
                </div>
            </div>
            <div class="post-comments">
                <h6>Leave a comment...</h6>
            </div>
        </div>
        <div class="post what-did-he-say">
            <div class="post-header">
                <h3>@Username</h3>
                <h4>Quoted by: @Username</h4>
            </div>
            <div class="post-quote">
                <img class="funky-quote-open" src="../assets/quote-open.png"/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.</p>
                <img class="funky-quote-close" src="../assets/quote-close.png"/>
            </div>
            <div class="post-footer">
                <div class="post-actions">
                    <i class="fab fa-gratipay heart"></i>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                </div>
                <div class="post-stats">
                    <i class="fab fa-gratipay heart"></i>
                    <h6>Likes</h6>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                    <h6>Comments</h6>
                </div>
            </div>
            <div class="post-comments">
                <h6>Leave a comment...</h6>
            </div>
        </div>
        <div class="post built-different">
            <div class="post-header">
                <h3>@Username</h3>
                <h4>Quoted by: @Username</h4>
            </div>
            <div class="post-quote">
                <img class="funky-quote-open" src="../assets/quote-open.png"/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.</p>
                <img class="funky-quote-close" src="../assets/quote-close.png"/>
            </div>
            <div class="post-footer">
                <div class="post-actions">
                    <i class="fab fa-gratipay heart"></i>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                </div>
                <div class="post-stats">
                    <i class="fab fa-gratipay heart"></i>
                    <h6>Likes</h6>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                    <h6>Comments</h6>
                </div>
            </div>
            <div class="post-comments">
                <h6>Leave a comment...</h6>
            </div>
        </div>
        <div class="post my-oh-my">
            <div class="post-header">
                <h3>@Username</h3>
                <h4>Quoted by: @Username</h4>
            </div>
            <div class="post-quote">
                <img class="funky-quote-open" src="../assets/quote-open.png"/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.</p>
                <img class="funky-quote-close" src="../assets/quote-close.png"/>
            </div>
            <div class="post-footer">
                <div class="post-actions">
                    <i class="fab fa-gratipay heart"></i>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                </div>
                <div class="post-stats">
                    <i class="fab fa-gratipay heart"></i>
                    <h6>Likes</h6>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                    <h6>Comments</h6>
                </div>
            </div>
            <div class="post-comments">
                <h6>Leave a comment...</h6>
            </div>
        </div>
        <div class="post so-so-sad">
            <div class="post-header">
                <h3>@Username</h3>
                <h4>Quoted by: @Username</h4>
            </div>
            <div class="post-quote">
                <img class="funky-quote-open" src="../assets/quote-open.png"/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.</p>
                <img class="funky-quote-close" src="../assets/quote-close.png"/>
            </div>
            <div class="post-footer">
                <div class="post-actions">
                    <i class="fab fa-gratipay heart"></i>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                </div>
                <div class="post-stats">
                    <i class="fab fa-gratipay heart"></i>
                    <h6>Likes</h6>
                    <i class="fas fa-comment-dots" style="color: #4063a0;"></i>
                    <h6>Comments</h6>
                </div>
            </div>
            <div class="post-comments">
                <h6>Leave a comment...</h6>
            </div>
        </div>
    </div>
</section>
<script src="../js/buffer.js"></script>
</body>
</html>`);
});
