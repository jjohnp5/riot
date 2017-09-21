/**
 * Created by john on 9/20/2017.
 */

var express = require('express');
var app = express();

var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var axios = require('axios');
var dotenv = require('dotenv');


dotenv.config({path: 'secret.env'});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", path.join(__dirname, '/views'));

app.get('/', function(req, res){
    res.render('index');
});

app.get('/summoner', function (req, res) {
   request("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"+req.query.summonername+"?api_key="+process.env.API_KEY, function (err, response, body) {
       if(!err && response.statusCode === 200){
           result = JSON.parse(body);
           request("https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/"+result.accountId+"/recent?api_key="+process.env.API_KEY, function (err, response, match) {
               if(!err && response.statusCode === 200) {
                   matches = JSON.parse(match);
                   var games;
                   var promise = matches.matches.map(function(game){
                       console.log(game.gameId);
                       iterateMatches(game.gameId);
                   });
                   Promise.all(promise)
                       .then(function(results){
                     console.log(results);
                   });

                    console.log(games);
                   res.render("summoner", {result: result, matches: matches, games: games});
               }
               });
               }else{
           console.log(process.env.API_KEY);
       }
           });
   });

function iterateMatches(match){
    request("https://na1.api.riotgames.com/lol/match/v3/matches/"+match+"?api_key="+process.env.API_KEY, function(err, response, game){
        if(!err && response.statusCode ===200){
            return JSON.parse(game);
        }else{
            return 'dummy'
        }
    });

}


app.listen(process.env.PORT || 3000, function () {
   console.log("app started");
});