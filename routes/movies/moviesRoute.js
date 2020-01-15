const express  = require('express'),
      router   = express.Router(),
      request  = require("request"),
      api      = require("../../apis/api.js"),
      config   = require("../../config.js");

// API configs
const apiKey = api.api_key;
const bearerAuth = api.auth;


// movies route and api connection
router.get("/tonight/movies", function(req, res) {


  // making api request for popular movies
  const movieRequest =
    "https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&region=IN&year=2019&include_adult=true&include_video=false&page=1";
  request(movieRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("movies.ejs", { data: data });
    }
  });
});

//movies result route
router.post("/tonight/movies/moviesresults", function(req, res) {
  // fetching genres from the form submitted
  var genres = req.body.genre;

  // generating random genres when the user has not specified it.
  if (genres == undefined) {
    const movieGenreList = [12, 28, 35, 18, 53, 27, 80, 878];
    genres = config.randomGenres(movieGenreList);
  }
  // // making api request for top_rated movies results
  const movieResultsRequest =
    "https://api.themoviedb.org/3/movie/top_rated?api_key="+apiKey+"&language=en-US&region=US&include_adult=true&include_video=false&page=1&with_genres=" +
    genres;
  request(movieResultsRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("movieResults.ejs", { data: data });
    }
  });
});

//show movie details routes
router.get("/tonight/movies/show/:id", function(req, res) {
  id = req.params.id;
  const showRequest =
    "https://api.themoviedb.org/3/movie/" + id + "?api_key="+apiKey+"&language=en-US"
    request(showRequest, function (error, response, body) {
      if(!error && response.statusCode==200) {
        const foundContent = JSON.parse(body);
        res.render("showMovie.ejs", {movieContent: foundContent, user:req.session.user});
        // console.log(foundContent);
      }
    })
});



module.exports = router;
