const express  = require('express'),
      router   = express.Router(),
      request  = require("request"),
      rp          = require("request-promise"),
      api      = require("../../../apis/api.js"),
      config   = require("../../../config.js");

// API configs
const apiKey = api.api_key;
const bearerAuth = api.auth;

// show user movie routes
router.get("/tonight/approved/access/:user/show/:id", isLoggedIn ,function (req, res) {
  const id = req.params.id;
  const user = req.session.user;
  console.log(user,id);
  showUserMovieOptions = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/'+id,
    qs: {api_key: apiKey, session_id: req.session.sessionId, append_to_response: "account_states"},
    json: true
  };
  request(showUserMovieOptions, function (error, response, body) {
    if(!error && response.statusCode == 200){
      console.log(body);
      const content = body;
      res.render("user/showMovies.ejs", {content: content, user: user});
    }
    else {
      res.send("Ah jeez, that's an error !");
      console.log(response);
    }
  })
});


//movie ratings
router.post("/tonight/approved/access/:user/movie/show/:id", isLoggedIn,function (req,res) {
  const ratings = req.body.ratings;
  const id = req.params.id;
  const user = req.session.user;

  console.log(ratings, id);
  ratingOptions = {
    method: 'POST',
    url: 'https://api.themoviedb.org/3/movie/'+id+'/rating',
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
      res.redirect('/tonight/approved/access/'+user+'/show/'+id);
    }
  })
});

// seperate movies page dedicated to the user
router.get("/tonight/approved/access/:user/movies", isLoggedIn ,function (req, res) {
  const user = req.session.user;
  const movieRequest =
    "https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&region=IN&year=2019&include_adult=true&include_video=false&page=1";
  request(movieRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("user/userMovies.ejs", { data: data, user: user });
    }
    else {
      res.send("You're lost !")
    }
  })
});


module.exports = router;
