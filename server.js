
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var axios = require('axios');
var dotenv = require('dotenv');
var queues = require('./queues.json');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var sessionHolder;

//dummy data


dotenv.config({path: '.env'});

data = {
    title: "data1",
    champion: "datachamp",
    items: [123, 234],
    spells: [1234, 1234],
    skills: [123, 123, 1234, 1243],
    chapters: [
        { 	title: "chapter1",
            content: "content 1"
        }
    ],
    author: {id: "1234", username: "name"}
};
/*
    Database schemas

 */
//Connect to db

mongoose.connect(process.env.DB_CONNECT);

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);


//ItemID, SpellID,
var guideSchema = new mongoose.Schema({
    title: String,
    champion: String,
    items: [Number],
    spells: [Number],
    skills: [Number],
    chapters: [{title: String, content: String}],
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})
var Guides = mongoose.model('Guides', guideSchema);
// Guides.create(data, function (err, guide) {
//     if(err){
//         console.log(err);
//     }else{
//         console.log(guide);
//     }
// })


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", path.join(__dirname, '/views'));
app.use(express.static(__dirname + "/public"));
app.use(session({secret: 'riotimizer', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

//seedDB


/*
    *
    *
    *
 */
app.get('/', function(req, res){
    sessionHolder = req.session.id; //upon visiting the site, session gets created and stored.
    res.render('index');
});

app.get('/summoner', isSessionExists, function (req, res) {

    axios("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"+req.query.summonername+"?api_key="+process.env.API_KEY)
        .then(function(response){
            summoner = response.data;
            return response.data;
        })
        .then(function(data){
            axios("https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/"+data.accountId+"?endIndex=10&api_key="+process.env.API_KEY)
                .then(function(matchlist){
                    matchList = matchlist.data;
                    // console.log(matchList);
                    // console.log(summoner);
                    return matchlist.data;
                })
                .then(function(matchdata){
                    let matchesArray = [];
                    matchCounter = 0;
                    var promise = new Promise(function(resolve, reject){
                        matchdata.matches.forEach(match => {
                            axios("https://na1.api.riotgames.com/lol/match/v3/matches/" + match.gameId + "?api_key=" + process.env.API_KEY)
                                .then(function(matchResult){
                                    matchesArray[matchCounter] = matchResult.data;
                                    matchCounter++;
                                    if(matchCounter === matchdata.matches.length){
                                        resolve(matchesArray);
                                    }
                                })
                            })

                        });
                    promise.then(function(matchesArray){
                                console.log(matchesArray[0]);
                                console.log(matchList.matches[0]);
                                console.log(summoner);
                                res.render("summoner", {summoner: summoner, matchList: matchList, matchesArray: matchesArray, queues: queues});
                            }).catch(function(error){
                                console.log(error);
                            })
                    })

                //
        }).catch(function(error){
            console.log(error);
    })
   });


app.get('/summoner/spells', isSessionExists,function (req, res) {
    request("http://ddragon.leagueoflegends.com/cdn/"+process.env.PATCH_VERSION+"/data/en_US/summoner.json", function (err, response, spells) {
        if(!err && response.statusCode === 200){
            spell = JSON.parse(spells)
            res.send(spell);
        }else{
            res.sendStatus(response.statusCode)
            console.log(response.statusCode)
        }
    })
})
app.get('/summoner/champs', isSessionExists,function (req, res) {
    request("http://ddragon.leagueoflegends.com/cdn/"+process.env.PATCH_VERSION+"/data/en_US/champion.json", function (err, response, champs) {
        if(!err && response.statusCode === 200){
            champ = JSON.parse(champs);
            res.send(champ)
        }else{
            res.sendStatus(response.statusCode);
        }
    })
})
app.get('/summoner/items', isSessionExists,function (req, res) {
    request("http://ddragon.leagueoflegends.com/cdn/"+process.env.PATCH_VERSION+"/data/en_US/item.json", function (err, response, champs) {
        if(!err && response.statusCode === 200){
            champ = JSON.parse(champs);
            res.send(champ)
        }else{
            res.sendStatus(response.statusCode);
        }
    })
})
app.get('/matches/timelines/:match', isSessionExists,function (req, res) {
    request("https://na1.api.riotgames.com/lol/match/v3/timelines/by-match/"+req.params.match+"?api_key="+process.env.API_KEY, function (err, response, timelines) {
        if(!err && response.statusCode === 200){
            timeline = JSON.parse(timelines);
            res.send(timeline)
        }else{
            res.sendStatus(response.statusCode);
        }
    })
})

/*
 *  Add /calculator route, obtain data from local json file temporarily 
 *   
 *  Todo: Substitute with real API
 *
 *  - ashwins93
 */

app.get('/calculator', isLoggedIn,function(req,res) {
    axios("https://na1.api.riotgames.com/lol/static-data/v3/items?locale=en_US&tags=all&api_key="+process.env.API_KEY)
        .then(function(response){
            let itemData = response.data;
            var query = req.query;
            if(query && query.type === "json" ) {
                res.json(itemData.data);
            } else {
                res.render("calculator", {data: itemData.data });
            }
        }).catch(function(err){
            console.log(err);
    });
});


/*
    Start Collab ROUTES here, we will use a different middle ware later. for now, we'll be using session middleware.

 */

// REGISTER ROUTE
app.get('/register', isSessionExists, function (req, res) {
    res.render('register');
})

app.post('/register', function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/builds');
        })

    })
})

//LOGIN ROUTE
app.get('/login', function (req, res) {
    res.render('login');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: "/builds",
    failureRedirect: "/login"
}), function (req, res) {
    });

//LOGOUT ROUTE
app.get('/logout', isLoggedIn,function (req, res) {
    req.logout();
    res.redirect('/');
})

/*
    BUILDS ROUTE, This is where we display the builds. We store builds in the database and render them to users.
    We will still use data gathered from RIOT api like item IDs and Spells, and champions.
    We will do the refactoring later. All views are currently in the main views folder, we will take care of this at
    a later time.
 */
app.get('/builds', function (req, res) {
    Guides.find({}, function(err, guide){
        if(err){
            console.log(err);
        }else{
            res.render('builds', {guides: guide});
        }
    })
})
//We will add middleware later once authentication, I'm just building routes at the moment. Running low on time.
//Items will be sent as JSON.stringify and parsed as JSON on the backend.
app.post('/builds', isLoggedIn,function (req, res) {
    var title = req.title;
    var champion = req.champion;
    var items = JSON.parse(req.items);
    var spells = JSON.parse(req.spells);
    var skills = JSON.parse(req.skills);
    var chapters = JSON.parse(req.chapters);
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newGuide = {title: title, champion: champion, items: items, spells: spells, skills: skills, chapters: chapters, author: author};
    Guides.create(newGuide, function (err, guide) {
        if(err){
            console.log('failed to add to db');
            console.log(err);
        }else{
            res.redirect('/builds');
        }
    })

})


/*
 *  Middleware for session. need to be added to main routes to prevent API abuse. No need to add this to
 *  /summoner + /items, /spells, /champs
 *
 *  Those routes use an unlimited API call to riot's static data server.
 *
 *
 *
 *  */
function isSessionExists(req, res, next){
    if(sessionHolder && sessionHolder === req.session.id){
        return next();
    }
    res.render("unauthenticated");
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


app.listen(process.env.PORT || 3000, function () {
   console.log("RIOT app started");
});
