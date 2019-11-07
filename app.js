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
  for (var i = 0; i < 2; i++) {
    generatedList.push(
      genresList[Math.floor(Math.random() * genresList.length)]
    );
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
  if (genres == undefined) {
    const movieGenreList = [12, 28, 35, 18, 53, 27, 80, 878];
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

// tvseries result route
app.post("/tonight/tvseries/tvresults", function(req, res) {
  // fetching genres from the form submitted
  var genres = req.body.genre;

  // generating random genres when the user has not specified it.
  if (genres == undefined) {
    const tvGenreList = [10759, 18, 35, 10762, 10765, 9648, 80];
    genres = randomGenres(tvGenreList);
  }

  // making api request for popular tv shows
  const tvResultsRequest =
    "https://api.themoviedb.org/3/discover/tv?api_key=90dc517176585a03c348c93afdd70126&language=en-US&region=IN,US&sort_by=popularity.desc&include_null_first_air_dates=false&with_genres=" +
    genres;
  request(tvResultsRequest, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.render("tvresults.ejs", { data: data });
    }
  });
});
//show movie details routes
app.get("/tonight/movies/show/:id", function(req, res) {
  id = req.params.id
  const showRequest =
    "https://api.themoviedb.org/3/movie/" + id + "?api_key=90dc517176585a03c348c93afdd70126&language=en-US"
    request(showRequest, function (error, response, body) {
      if(!error && response.statusCode==200) {
        const foundContent = JSON.parse(body);
        res.render("showMovie.ejs", {movieContent: foundContent});
        // console.log(foundContent);
      }
    })
});

//show tv series details routes
app.get("/tonight/tvseries/show/:id", function(req, res) {
  id = req.params.id
  const showRequest =
    "https://api.themoviedb.org/3/tv/"+ id +"?api_key=90dc517176585a03c348c93afdd70126&language=en-US"
    request(showRequest, function (error, response, body) {
      if(!error && response.statusCode==200) {
        const foundContent = JSON.parse(body);
        res.render("showTV.ejs", {tvContent: foundContent});
        // console.log(foundContent);
      }
    })
});

// AUTHENTICATION

// generating a request token + getting the user to approve it
app.get("/tonight/login", function(req, res) {
  const requestTokenOptions = {
    method: 'POST',
    url: "https://api.themoviedb.org/4/auth/request_token",
    headers: {
      // its the API Read Access token found under API settings(new in v4)
      authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGRjNTE3MTc2NTg1YTAzYzM0OGM5M2FmZGQ3MDEyNiIsInN1YiI6IjVkODM5NzVhOWU0NTg2MDIzZjk1MjhjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9O7f4lThGGXu7OKWrlo7kvZS3rMozSecTSQnVJRvoSQ',
      'content-type': "application/json;charset=utf-8"
      },
      // redirecting to our app after TMDB approves our token
      body: {redirect_to: 'http://localhost:3000/tonight/approved'},
      json: true
    };

  request(requestTokenOptions, function (error, response, body) {
    if(!error && response.statusCode==200) {
      console.log(body);
      requestToken = body["request_token"];
      // after generating a token, we redirect to TMDB to approve the generated token
      res.redirect('https://www.themoviedb.org/auth/access?request_token='+requestToken);
    }
  });
});


// approved route for redirecting and generating user access token + account id
 app.get('/tonight/approved', function (req, res) {
   const accessTokenOptions = {
     method: 'POST',
     url: "https://api.themoviedb.org/4/auth/access_token",
     headers: {
       // its the API Read Access token found under API settings(new in v4)
       authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGRjNTE3MTc2NTg1YTAzYzM0OGM5M2FmZGQ3MDEyNiIsInN1YiI6IjVkODM5NzVhOWU0NTg2MDIzZjk1MjhjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9O7f4lThGGXu7OKWrlo7kvZS3rMozSecTSQnVJRvoSQ',
       'content-type': "application/json;charset=utf-8"
       },
       // passing the previously generated request token in the body
       body: {request_token: requestToken},
       json: true
   };

   request(accessTokenOptions, function (error, response, body) {
     if(!error && response.statusCode == 200) {
       console.log(body);
      // extracting the accessToken and accountId from the body
       accessToken = body["access_token"];
       accountId = body["account_id"];
       res.redirect("/tonight");
     }
   });
 });
