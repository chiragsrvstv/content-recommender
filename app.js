const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  request = require("request"),
  session = require("express-session"),
  redis   = require("redis"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  rp          = require("request-promise");

  // redis configuration
  let RedisStore = require('connect-redis')(session);
  let redisClient = redis.createClient();

  //passport configuration
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'salty';

  "use strict"

  // configuring express session
  app.use(
    session({
    store: new RedisStore({client: redisClient}),
    secret: 'salty',
    resave: false,
    saveUninitialized: true,
  }));

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
  id = req.params.id;
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

//initializing requestToken
 // requestToken = "";

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
      body: {redirect_to: 'http://localhost:3000/tonight/approved/'},
      json: true
    };

  request(requestTokenOptions, function (error, response, body) {
    if(!error && response.statusCode==200) {
      console.log(body);
      requestToken = body["request_token"];
      //req.session.reqToken = body["request_token"];
      // after generating a token, we redirect to TMDB to approve the generated token
      res.redirect('https://www.themoviedb.org/auth/access?request_token='+requestToken);

    }
    else {
      res.send("Ah, that's an error !");
    }
  });
});


// approved route for redirecting and generating user access token + account id
 app.get('/tonight/approved/', function (req, res) {
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
       // const accessToken = body["access_token"];
       // const accountId = body["account_id"];
       req.session.accessToken = body["access_token"];
       req.session.accountId = body["account_id"];
       //res.redirect("/tonight/approved/"+ accessToken +"/"+accountId);
       res.redirect("/tonight/approved/access");
      }
      else {
        res.send("Ah 2, that's an error !");
      }
   });
 });

// generating a sessionId
// app.get("/tonight/approved/:access/:account/", function (req, res) {
  app.get("/tonight/approved/access", function (req, res) {
  // const accountId = req.params.account;
  // const accessToken = req.params.access;

  sessionIdOptions = {
    method: 'POST',
    url: 'https://api.themoviedb.org/3/authentication/session/convert/4',
    qs: {api_key: '90dc517176585a03c348c93afdd70126'},
    headers: {authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGRjNTE3MTc2NTg1YTAzYzM0OGM5M2FmZGQ3MDEyNiIsInN1YiI6IjVkODM5NzVhOWU0NTg2MDIzZjk1MjhjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9O7f4lThGGXu7OKWrlo7kvZS3rMozSecTSQnVJRvoSQ'},
    body: {access_token: req.session.accessToken},
    json: true
  };

  request(sessionIdOptions, function (error, response, body) {
    if(error){
      console.log(error);
      res.send("Ah jeez, that's an error !");
    }
    else {
      console.log(body);
      //const sessionId = body["session_id"];
      req.session.sessionId = body["session_id"];
      console.log(req.session.sessionId);
      res.redirect("/tonight/approved/access/home/");
    }
  });
});

// logout or delete session
  app.get("/tonight/logout", function(req,res) {
    logoutOptions = {
      method: 'DELETE',
      url: 'https://api.themoviedb.org/3/authentication/session',
      headers: {'content-type': 'application/json;charset=utf-8'},
      qs: {api_key: '90dc517176585a03c348c93afdd70126'},
      body: {session_id: req.session.sessionId},
      json: true
    };

    request(logoutOptions, function (error, response, body) {
      if(error || body["status_code"]===5) {
        res.send("Ah jeez, can't log you out!");
      }
      else {
        req.session.destroy(function (err) {
          if(err) {
            console.log(err);
            res.send("AH, can't log out");
          }
          else {
            res.redirect("/tonight");
            console.log(body);
          }
        })
      }
    })
  });

// USER ROUTES

// user index route
app.get("/tonight/approved/access/home/", function (req, res) {
  recommendedMovieOptions = {
    method: 'GET',
    url: 'https://api.themoviedb.org/4/account/'+ req.session.accountId +'/movie/recommendations',
    qs: {page: '1'},
    headers: {
      authorization: 'Bearer ' + req.session.accessToken,
      'Content-Type': 'application/json'
    },
    json: true
  };
  request(recommendedMovieOptions, function (error, response, body) {
    const recommendedMovies = body;
    console.log(recommendedMovies);

    //getting account details
    const accountDetailsOptions={
      method: "GET",
      url:'https://api.themoviedb.org/3/account?api_key=90dc517176585a03c348c93afdd70126',
      headers: {authorization: 'Bearer ' + req.session.accessToken},
      qs:{session_id:req.session.sessionId},
      json:true
    };
    if(error) {
      res.send("Ah boo, that's an error !");
    }
    else {
      // requesting username with promises
      rp(accountDetailsOptions)
        .then(function(repos){
          console.log(repos);
          res.render("user/userIndex.ejs", {recommendedMovies: recommendedMovies, user: repos});
        })
        .catch(function (err) {
          console.log("ah no, login first");
          res.redirect("/");
        })
      }
    })
});

// show user movie routes
app.get("/tonight/approved/access/home/show/:id", function (req, res) {
  const id = req.params.id;
  // const sessionId = req.params.session;
  // const accountId = req.params.account;
  showUserMovieOptions = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/'+id,
    qs: {api_key: '90dc517176585a03c348c93afdd70126', session_id: req.session.sessionId, append_to_response: "account_states" },
    body:'{}',
    json: true
  };
  request(showUserMovieOptions, function (error, response, body) {
    if(error){
      res.send("Ah jeez, that's an error !");
    }
    else {
      console.log(body);
      const content = body;
      res.render("user/showMovies.ejs", {content: content});
    }
  })
});


// ratings routes
app.post("/tonight/approved/access/home/show/:id", function (req,res) {
  const ratings = req.body.ratings;
  const id = req.params.id;
  // const sessionId = req.params.session;
  // const accountId = req.params.account;
  // const sessionid = req.params.
  console.log(ratings, id);
  ratingOptions = {
    method: 'POST',
    url: 'https://api.themoviedb.org/3/movie/'+id+'/rating',
    qs: {session_id: req.session.sessionId, api_key:'90dc517176585a03c348c93afdd70126'},
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
      res.redirect('/tonight/approved/access/home/show/'+id);
    }
  })
});

// bad url handler
app.get("/*", function(req, res) {
  res.send("Error 404: You're in outer space now! 👽");
});
