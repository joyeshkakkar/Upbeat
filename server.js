var bodyParser = require('body-parser');
var multer = require('multer');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var app = express();

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/upbeat';
mongoose.connect(connectionString);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'secret string' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());// do not ask everytime for user credentials, check in session for username and password

//To check the server process env
//app.get('/process', function (req, res) {
//    res.json(process.env);
//});

var SchdeuleStep = new mongoose.Schema({
    schdeuleid: Number,
    workoutid: Number
},
{ collection: "upbeat" });

//  Set the environment variables
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ip);

app.post("/api/sendMail", function (req, res) {
    var toMail = req.body.email;
    var sender = req.body.username;
    var auth = {
        auth: {
            api_key: 'key-f7eeef970cdedbdfd659aaa56e6cec27',
            domain: 'sandbox428b7233e69d40cbba8b5eb6b9ed57fd.mailgun.org'
        }
    };
    var transporter = nodemailer.createTransport(mg(auth));

    var mailOptionsForSender = {
        from: 'Upbeat support',
        to: sender + '<'+toMail+'>',
        subject: "Query submitted:"+ req.body.subject,
        text: "Your query is submitted.\n\nQuery submitted: " + req.body.message + "\n\nSender Details: \nName: " + sender + "\nEmail: " + toMail + "\n", // plaintext body
        //html: 'Hello&nbsp;<b>'+sender+'</b> <br/> Your query is submitted.<br/><br/> <b>Query submitted:</b> <br/> <p>' + req.body.message + '</p>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptionsForSender, function (error, info) {
        if (error) {
            console.log(error, "Error in sending mail to sender");
        } else {
            console.log('Message sent to sender' + info);
        }
    });

    var mailOptions = {
        from: 'Upbeat support <joyeshkakkar@gmail.com>',
        to: 'Upbeat support <kakkar.j@husky.neu.edu>',
        subject: req.body.subject,
        text: "Query submitted: " + req.body.message + "\n\nSender Details: \nName: " + sender + "\nEmail: " + toMail + "\n", // plaintext body
        //html: '<b>Hello</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error, "Error in sending mail to support");
        } else {
            console.log('Message sent: ' + info);
            res.send(200);
        }
    });
    
});


/**********DB data and functions START**********/
var TrackSchema = new mongoose.Schema({
    name: String,
    id: String,
    preview_url: String,
    external_url: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "track" });

var AlbumSchema = new mongoose.Schema({
    name: String,
    id: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "album" });

var ArtistSchema = new mongoose.Schema({
    name: String,
    id: String,
    addedOn: { type: Date, default: Date.now}
}, { collection: "artist" });

var CommentSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    lastName: String,
    commentText: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "comment" });

var PlaylistSchema = new mongoose.Schema({
    name: String,
    tracks: [TrackSchema],
    comments: [CommentSchema],
    publish: { type: Boolean, default: 'false' },
    userId: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "playlist" });

var FollowerSchema = new mongoose.Schema({
    playlistId: String,
    followerUserId: String
}, { collection: "follower" });

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    role: { type: String, default: 'Member' },
    email: String,
    phone: String,
    tracks: [TrackSchema],
    albums: [AlbumSchema],
    artists: [ArtistSchema]
}, { collection: "user" });

var UserModel = mongoose.model("User", UserSchema);

var initialUser = new UserModel({
    username: "admin", 
    password: "admin", 
    firstName: "admin", 
    lastName: "admin", 
    role: "Admin", 
    email: "kakkar.j@husky.neu.edu", 
    phone: "123-456-789",
    tracks: [], albums: [], artists: []
})

//initialUser.save();

var PlaylistModel = mongoose.model("Playlist", PlaylistSchema);
var FollowerModel = mongoose.model("Follower", FollowerSchema);

//Find all users
app.get("/api/user", function (req, res) {
    UserModel.find(function (err, data) {
        res.json(data);
    });
});

//Delete one user
app.delete("/api/user/:id", function (req, res) {
    UserModel.findById(req.params.id, function (err, doc) {
        doc.remove();
        UserModel.find(function (err, data) {
            res.json(data);
        });
    });
});

//Adds one user
app.post("/api/user", function (req, res) {
    var user = new UserModel(req.body);
    user.save(function (err, doc) {
        UserModel.find(function (err, data) {
            res.json(data);
        });
    });
});

//Adds one playlist
app.post("/api/playlist", function (req, res) {
    var playlist = new PlaylistModel(req.body);
    playlist.save(function (err, doc) {
        PlaylistModel.find(function (err, data) {
            res.json(data);
        });
    });
});
//Adds one follower
app.post("/api/follower", function (req, res) {
    var follower = new FollowerModel(req.body);
    follower.save(function (err, doc) {
        FollowerModel.find(function (err, data) {
            res.json(data);
        });
    });
});


//Get playlists for a user
app.get("/api/playlist/:userId", function (req, res) {
    PlaylistModel.find({ userId: req.params.userId }, function (err, docs) {
        res.json(docs);
    });
}); 

app.get("/api/playlistByPlaylistIds", function (req, res) {
    PlaylistModel.find({ _id: { $in: req.body.playlistIds } }, function (err, docs) {
        res.json(docs);
    });
});

//Get followed playlist of a user
app.get("/api/followedPlaylist/:userId", function (req, res) {
    FollowerModel.find({ followerUserId: req.params.userId }, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            var playlistIdArray = [];
            for (var doc in docs) {
                playlistIdArray.push(docs[doc].playlistId);
            }
            PlaylistModel.find({ _id: { $in: playlistIdArray } }, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(docs);
                }
            });
        }
    });
});

app.get("/api/searchFollowersForPlaylist/:playlistId", function (req, res) {    
    FollowerModel.find({ playlistId: req.params.playlistId }, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            var followerIdArray = [];
            for (var doc in docs) {
                followerIdArray.push(docs[doc].followerUserId);
            }
            UserModel.find({ _id: { $in: followerIdArray } }, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(docs);
                }
            });
        }
    });
});


//Unfollow playlist 
app.post("/api/unfollow", function (req, res) {
    FollowerModel.find({
        $and: [
            { followerUserId: req.body.followerUserId },
            { playlistId: req.body.playlistId }
        ]
    }, function (err, docs) {
        for (var doc in docs) {
            (docs[doc].remove());
        }        
        FollowerModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.delete("/api/playlist/:id", function (req, res) {
    PlaylistModel.findById(req.params.id, function (err, doc) {
        doc.remove();
        PlaylistModel.find(function (err, data) {
            res.json(data);
        });
    });
});

//Get all playlists not for a specific user
app.get("/api/playlistNotForUserId/:userId", function (req, res) {    
    FollowerModel.find({ followerUserId: req.params.userId }, function (err, docs) {
        var playlistIdArray = [];
        for (var doc in docs) {
            playlistIdArray.push(docs[doc].playlistId);
        }
        PlaylistModel.find({
            $and: [
                { userId: { $ne: req.params.userId } },
                { publish: true },
                { _id: { $nin: playlistIdArray } }
            ]
        }, function (err, docs) {
            res.json(docs);
        });
    });
    
});

//Update playlist
app.put("/api/playlist",  function (req, res){
    PlaylistModel.update({ _id: req.body._id }, { $set: { tracks: req.body.tracks, comments: req.body.comments, publish: req.body.publish, name: req.body.name } }, function (err, doc) {
        PlaylistModel.find(function (err, data) {
            res.json(data);
        });
    });
});


//Delete a playlist
app.delete("/api/playlist/:id", function (req, res) {
    PlaylistModel.findById(req.params.id, function (err, doc) {
        doc.remove();
        PlaylistModel.find(function (err, data) {
            res.json(data);
        });
    });
});

//Update a user record
app.put("/api/user/:id", function (req, res) {
    UserModel.update({ _id: req.params.id }, { $set: { tracks: req.body.tracks, albums: req.body.albums, artists: req.body.artists } }, function (err, doc) {
        UserModel.find(function (err, data) {
            res.json(data);
        });
    });
});

//Find by Id
app.get("/api/user/:id", function (req, res) {
    UserModel.findById(req.params.id, function (err, doc) {
        res.json(doc);
    });
});

//Find tracks for a user
app.get("/api/user/:id/tracks", function (req, res) {
    UserModel.findById(req.params.id, function (err, doc) {
        res.json(doc.tracks);
    });
});
/**********DB data and functions END**********/


/*****************Passport related functions****************************/
passport.use(new LocalStrategy(
    function (username, password, done) {
        UserModel.findOne({ username: username, password: password }, function (err, user) {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.post("/api/login", passport.authenticate('local'),
    function (req, res) { // once user is authenticated by passport it puts the user object in req 
        var user = req.user;
        res.json(user);
    });

app.post("/api/logout", function (req, res) {
    req.logout();
    res.send(200);
});

app.get("/api/loggedin", function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
