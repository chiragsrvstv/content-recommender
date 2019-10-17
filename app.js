const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  request = require("request");

// setting up server to respond requests at localhost:3000
app.listen(3000, function() {
  console.log("serving port 3000 localhost");
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// a function to randomly generate combination of Genres from list of passed genres
function randomGenres(genresList) {
  const generatedList = [];
  for(var i=0; i<2; i++) {
  generatedList.push(genresList[Math.floor(Math.random()*genresList.length)]);
}
return generatedList;
}

//-----------------------routes--------------------------------

// landing Page
app.get("/", function(req, res) {
  res.redirect("/tonight");
});

//index route
app.get("/tonight", function(req, res) {
  res.render("index.ejs");
});

// movies route and api connection
app.get("/tonight/movies", function(req, res) {
  key = "90dc517176585a03c348c93afdd70126";

  // making api request for popular movies
  const movieRequest =
    "https://api.themoviedb.org/3/discover/movie?api_key=90dc517176585a03c348c93afdd70126&language=en-US&sort_by=popularity.desc&region=IN&year=2019&include_adult=true&include_video=false&page=1";
  request(movieRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("movies.ejs", { data: data });
    }
  });
});

//movies result route
app.post("/tonight/movies/moviesresults", function(req, res) {
  // fetching genres from the form submitted
  var genres = req.body.genre;

  // generating random genres when the user has not specified it.
  if(genres == undefined) {
    const movieGenreList = [12,28,35,18,53,27,80,878];
    genres = randomGenres(movieGenreList);
  }
  // // making api request for top_rated movies results
  const movieResultsRequest =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=90dc517176585a03c348c93afdd70126&language=en-US&region=US&include_adult=true&include_video=false&page=1&with_genres=" +
    genres;
  request(movieResultsRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("movieResults.ejs", { data: data });
    }
  });
});

// tv series route and api connection
app.get("/tonight/tvseries", function(req, res) {

  // making api request for popular tv shows
  const tvRequest =
    "https://api.themoviedb.org/3/discover/tv?api_key=90dc517176585a03c348c93afdd70126&language=en-US&region=IN&sort_by=popularity.desc&page=1&include_null_first_air_dates=false";
  request(tvRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("tvseries.ejs", { data: data });
    }
  });
});

// tvseries result oute
app.post("/tonight/tvseries/tvresults", function(req, res) {
  // fetching genres from the form submitted
  var genres = req.body.genre;

  // generating random genres when the user has not specified it.
  if(genres == undefined) {
    const tvGenreList = [10759,18,35,10762,10765,9648,80];
    genres = randomGenres(tvGenreList);
  }

  // making api request for popular tv shows
  const tvResultsRequest = "https://api.themoviedb.org/3/discover/tv?api_key=90dc517176585a03c348c93afdd70126&language=en-US&region=IN,US&sort_by=popularity.desc&include_null_first_air_dates=false&with_genres="+
  genres;
  request(tvResultsRequest, function (error, response, body) {
    if(!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("tvresults.ejs", {data: data});
    }
  });
});
