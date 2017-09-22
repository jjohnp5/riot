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


dotenv.config({path: '.env.text'});

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
                console.log(data);
                res.send(data);
            }else {
            res.sendStatus(response.statusCode);
        }
        })
});
// function callAPI(url){
//     return new Promise((resolve, reject) => {
//
//             .then(res => JSON.parse(res))
//             .then(data => resolve(data))
//             .catch(err = >)
// }
//         })
// }
//

app.listen(process.env.PORT || 3000, function () {
   console.log("app started");
});