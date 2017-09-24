/**
<<<<<<< HEAD
 * Created by John on 6/19/2017.
=======
 * Created by john on 9/20/2017.
>>>>>>> 492cbe4ecf58eb92099f0166116add153419535e
 */

var express = require('express');
var app = express();
<<<<<<< HEAD
var path = require("path");
var request = require('request');
var bodyParser = require('body-parser');

app.set("views", path.join(__dirname, '/views'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.render("landing");
});
app.post("/summoners/search", function(req, res){
    name = req.body.summonername;
    request("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"+name+"?api_key=RGAPI-0873819f-5f04-47a9-abd9-28582f39bfd1", function (error, response, body){
        result = JSON.parse(body);
        res.render("summoner", {result: result});
    });

});
app.post("/movies/search", function (req, res) {
    var query = req.body.query;
    var queryArr = query.split(" ");
    var keyword = "";
    for(var i = 0; i < queryArr.length; i++){
        if (i === 0 ){
            keyword = queryArr[i];
        }else{
            var base = "%20" + queryArr[i];
            keyword += base;
        }
    }
    console.log(keyword);
    request("https://api.themoviedb.org/3/search/movie?api_key=f2542b8b01898f42918c9addc4ed07a0&language=en-US&query="+keyword, function(error, response, body){
        var result = JSON.parse(body);
        res.render("search", {result: result})
    });
});

app.get("/movies/popular", function (req, res) {
    request("https://api.themoviedb.org/3/movie/popular?api_key=f2542b8b01898f42918c9addc4ed07a0", function (error, response, body) {
        var result = JSON.parse(body);
        res.render("popular", {results: result.results});
    })
});
app.get("/movies/:id", function (req, res) {
    console.log(req.params.id);
    request("https://api.themoviedb.org/3/movie/"+req.params.id+"?api_key=f2542b8b01898f42918c9addc4ed07a0", function (error, response, movie) {
        var result = JSON.parse(movie);
        request("https://api.themoviedb.org/3/movie/"+req.params.id+"/reviews?api_key=f2542b8b01898f42918c9addc4ed07a0&language=en-US&page=1", function (error, response, revs) {
            var reviews = JSON.parse(revs);
            res.render("movie", {result: result, reviews: reviews});

        });
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("movie api started");
});


/**
 * Created by John on 9/18/2017.
 */
=======

var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var axios = require('axios');
var dotenv = require('dotenv');


dotenv.config({path: '.env.text'});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", path.join(__dirname, '/views'));
app.use(express.static(__dirname + "/public"));


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
                   res.render("summoner", {result: result, matches: matches});

               }else{
                   console.log(response.statusCode);
               }
               });
               }else{
           console.log(response.statusCode);
       }
           });
   });
app.get("/matches/:id", function(req, res){
    request("https://na1.api.riotgames.com/lol/match/v3/matches/" + req.params.id + "?api_key=" + process.env.API_KEY, function (err, response, match) {
        if (!err && response.statusCode === 200) {
                data = JSON.parse(match);
                res.send(data);
            }else {
            res.sendStatus(response.statusCode);
        }
        })
});

app.get('/summoner/spells', function (req, res) {
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
app.get('/summoner/champs', function (req, res) {
    request("http://ddragon.leagueoflegends.com/cdn/"+process.env.PATCH_VERSION+"/data/en_US/champion.json", function (err, response, champs) {
        if(!err && response.statusCode === 200){
            champ = JSON.parse(champs);
            res.send(champ)
        }else{
            res.sendStatus(response.statusCode);
        }
    })
})
app.get('/summoner/items', function (req, res) {
    request("http://ddragon.leagueoflegends.com/cdn/"+process.env.PATCH_VERSION+"/data/en_US/item.json", function (err, response, champs) {
        if(!err && response.statusCode === 200){
            champ = JSON.parse(champs);
            res.send(champ)
        }else{
            res.sendStatus(response.statusCode);
        }
    })
})

app.listen(process.env.PORT || 3000, function () {
   console.log("app started");
});
>>>>>>> 492cbe4ecf58eb92099f0166116add153419535e
