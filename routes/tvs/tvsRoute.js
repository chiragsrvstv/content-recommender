const express  = require('express'),
      router   = express.Router(),
      request  = require("request"),
      api      = require("../../apis/api.js"),
      config   = require("../../config.js");

// API configs
const apiKey = api.api_key;
const bearerAuth = api.auth;

// tv series route and api connection
router.get("/tonight/tvseries", function(req, res) {
  // making api request for popular tv shows
  const tvRequest =
    "https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&region=IN&sort_by=popularity.desc&page=1&include_null_first_air_dates=false";
  request(tvRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("tvseries.ejs", { data: data });
    }
  });
});

// tvseries result route
router.post("/tonight/tvseries/tvresults", function(req, res) {
  // fetching genres from the form submitted
  var genres = req.body.genre;

  // generating random genres when the user has not specified it.
  if (genres == undefined) {
    const tvGenreList = [10759, 18, 35, 10762, 10765, 9648, 80];
    genres = randomGenres(tvGenreList);
  }

  // making api request for popular tv shows
  const tvResultsRequest =
    "https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&region=IN,US&sort_by=popularity.desc&include_null_first_air_dates=false&with_genres=" +
    genres;
  request(tvResultsRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("tvresults.ejs", { data: data });
    }
  });
});


//show tv series details routes
router.get("/tonight/tvseries/show/:id", function(req, res) {
  id = req.params.id
  const showRequest =
    "https://api.themoviedb.org/3/tv/"+ id +"?api_key="+apiKey+"&language=en-US"
    request(showRequest, function (error, response, body) {
      if(!error && response.statusCode==200) {
        const foundContent = JSON.parse(body);
        res.render("showTV.ejs", {tvContent: foundContent, user:req.session.user});
        // console.log(foundContent);
      }
    })
});


module.exports = router;
