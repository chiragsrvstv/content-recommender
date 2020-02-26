const express  = require('express'),
      router   = express.Router(),
      request  = require("request"),
      rp          = require("request-promise"),
      api      = require("../../../apis/api.js"),
      config   = require("../../../config.js");

// API configs
const apiKey = api.api_key;
const bearerAuth = api.auth;

// show user tv routes
router.get("/tonight/approved/access/:user/tv/show/:id", isLoggedIn ,function (req, res) {
  const id = req.params.id;
  const user = req.session.user;

  showUserTvOptions = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/tv/'+id+'&language=en-US',
    qs: {api_key: apiKey, session_id: req.session.sessionId, append_to_response: "account_states" },
    body:'{}',
    json: true
  };
  request(showUserTvOptions, function (error, response, body) {
    if(error){
      res.send("Ah jeez, that's an error !");
    }
    else {
      console.log(body);
      const content = body;
      res.render("user/showTv.ejs", {content: content, user: user});
    }
  })
});


// tv ratings
router.post("/tonight/approved/access/:user/tv/show/:id", isLoggedIn,function (req,res) {
  const ratings = req.body.ratings;
  const id = req.params.id;
  const user = req.session.user;

  console.log(ratings, id);
  ratingOptions = {
    method: 'POST',
    url: 'https://api.themoviedb.org/3/tv/'+id+'/rating',
    qs: {session_id: req.session.sessionId, api_key: apiKey},
    headers: { 'content-type': 'application/json;charset=utf-8' },
    body: {value: ratings},
    json: true
  }
  request(ratingOptions, function(error, response, body){
    //if(!error && response.statusCode==200)
    if(error){
      console.log(error);
    }
    else{
      console.log("Rated");
      res.redirect('/tonight/approved/access/'+user+'/tv/show/'+id);
    }
  })
});

// seperate tv page dedicated to the user
router.get("/tonight/approved/access/:user/tv", isLoggedIn ,function (req, res) {
  const user = req.session.user;
  const tvRequest =
    "https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&region=IN&sort_by=popularity.desc&page=1&include_null_first_air_dates=false";
  request(tvRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("user/userTvSeries.ejs", { data: data, user: user});
    }
    else {
      res.send("You're lost !")
    }
  })
});



module.exports = router;
