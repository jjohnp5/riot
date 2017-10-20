
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var axios = require('axios');
var dotenv = require('dotenv');
var queues = require('./queues.json');
var fs = require('fs'); // temporary  -  for obtaining JSON locally - ashwins93


dotenv.config({path: '.env'});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", path.join(__dirname, '/views'));
app.use(express.static(__dirname + "/public"));

/*
    *
    *
    *
 */
app.get('/', function(req, res){
    res.render('index');
});

app.get('/summoner', function (req, res, next) {

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
app.get('/matches/timelines/:match', function (req, res) {
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

app.get('/calculator', function(req,res) {
    fs.readFile(path.join(__dirname, 'public','items.json'), 'utf-8',function(err, data) {
        if (err) console.error(err);
        else {
            let itemData = JSON.parse(data.toString());
            // console.log(Object.keys(itemData.data).length);
            var query = req.query;
            if(query && query.type === "json" ) {
                res.json(itemData.data);
            } else {
                res.render("calculator", {data: itemData.data });
            }
        }
    });

})



app.listen(process.env.PORT || 3000, function () {
   console.log("RIOT app started");
});
