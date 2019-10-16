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
  //const random = Math.floor(Math.random()*1000)
  //api key
  key = "90dc517176585a03c348c93afdd70126";
  const url1 =
    "https://api.themoviedb.org/3/discover/movie?api_key=90dc517176585a03c348c93afdd70126&language=en-US&sort_by=popularity.desc&region=IN&year=2019&include_adult=true&include_video=false&page=1";
  request(url1, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      //console.log(data);
      res.render("movies.ejs", { data: data });
    }
  });
});

//movies result route
app.post("/tonight/movies/moviesresults", function(req, res) {
  var genres = req.body.genre;
  console.log(genres);
  const url3 =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=90dc517176585a03c348c93afdd70126&language=en-US&region=US&include_adult=true&include_video=false&page=1&with_genres=" +
    genres;
  request(url3, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("movieResults.ejs", { data: data });
      console.log(data);
    }
  });
});

// tv series route and api connection
app.get("/tonight/tvseries", function(req, res) {
  const url2 =
    "https://api.themoviedb.org/3/discover/tv?api_key=90dc517176585a03c348c93afdd70126&language=en-US&region=IN&sort_by=popularity.desc&page=1&include_null_first_air_dates=false";
  request(url2, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      //console.log(data);
      res.render("tvseries.ejs", { data: data });
    }
  });
});

// tvseries result oute
app.post("/tonight/tvseries/tvresults", function(req, res) {
  const genres = req.body.genre;
  const tvResultsUrl = "https://api.themoviedb.org/3/discover/tv?api_key=90dc517176585a03c348c93afdd70126&language=en-US&region=IN,US&sort_by=popularity.desc&include_null_first_air_dates=false&with_genres="+
  genres;
  request(tvResultsUrl, function (error, response, body) {
    if(!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("tvresults.ejs", {data: data});
      console.log(data);
    }
  });
});
