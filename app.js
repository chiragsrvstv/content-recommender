const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      request       = require('request');

// setting up server to respond requests at localhost:3000
app.listen(3000, function() {
  console.log("serving port 3000 localhost");
});

//routes

// landing Page
app.get("/", function (req, res) {
  res.redirect("/tonight");

})

//index route
app.get("/tonight", function (req, res) {
  res.render("index.ejs");
});

//movies route
app.get("/tonight/movies", function (req, res) {
  res.render("movies.ejs");
});

//tvseries route
app.get("/tonight/tvseries", function (req, res) {
  res.render("tvseries.ejs");
});

// api connection
app.get("/tonight/results", function (req, res) {


  url = 'https://api.themoviedb.org/3/search/movie?api_key=90dc517176585a03c348c93afdd70126&query=John+Wick'
  request(url, function (error, response, body) {
    if(!error && response.statusCode == 200){
      res.send(JSON.parse(body));
    }
  });
});









