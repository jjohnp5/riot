
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var axios = require('axios');
var dotenv = require('dotenv');
var queues = require('./queues.json');
var session = require('express-session');
var sessionHolder;



dotenv.config({path: '.env'});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", path.join(__dirname, '/views'));
app.use(express.static(__dirname + "/public"));
app.use(session({secret: 'riotimizer', resave: false, saveUninitialized: true}));

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

app.get('/calculator', isSessionExists,function(req,res) {
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


app.listen(process.env.PORT || 3000, function () {
   console.log("RIOT app started");
});
