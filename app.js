
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  request = require("request"),
  session = require("express-session"),
  redis   = require("redis"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  rp          = require("request-promise"),
  api      = require("./apis/api.js");

const tonightRoute = require("./routes/tonightRoute.js"),
      moviesRoute  = require("./routes/movies/moviesRoute.js"),
      tvsRoute  = require("./routes/tvs/tvsRoute.js"),
      authRoute = require("./routes/authentication/auth.js"),
      authMovieRoute = require("./routes/authentication/movies/authMovie.js"),
      authTvRoute = require("./routes/authentication/tv/authTv.js");


// API configs
const apiKey = api.api_key;
const bearerAuth = api.auth;


// setting up server to respond requests at localhost:3000
app.listen(3000, function() {
  console.log("serving port 3000 localhost");
});

// express public setup
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// redis configuration
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

//passport configuration
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'salty';

// configuring express session
app.use(
  session({
  store: new RedisStore({client: redisClient}),
  secret: 'salty',
  resave: false,
  saveUninitialized: true,
}));

// routes
app.use(tonightRoute);
app.use(moviesRoute);
app.use(tvsRoute);
app.use(authRoute);
app.use(authMovieRoute);
app.use(authTvRoute);


// bad url handler
app.get("/*", function(req, res) {
  res.send("Error 404: You're in outer space now! 👽");
});


// ---------------------------------------- LEGACY -----------------------------


//
// // a function to randomly generate combination of Genres from list of passed genres
// function randomGenres(genresList) {
//   const generatedList = [];
//   for (var i = 0; i < 2; i++) {
//     generatedList.push(
//       genresList[Math.floor(Math.random() * genresList.length)]
//     );
//   }
//   return generatedList;
// }




// AUTHENTICATION

// //initializing requestToken
//  // requestToken = "";
//
// // generating a request token + getting the user to approve it
// app.get("/tonight/login", function(req, res) {
//   const requestTokenOptions = {
//     method: 'POST',
//     url: "https://api.themoviedb.org/4/auth/request_token",
//     headers: {
//       // its the API Read Access token found under API settings(new in v4)
//       authorization: bearerAuth,
//       'content-type': "application/json;charset=utf-8"
//       },
//       // redirecting to our app after TMDB approves our token
//       body: {redirect_to: 'http://localhost:3000/tonight/approved/'},
//       json: true
//     };
//
//   request(requestTokenOptions, function (error, response, body) {
//     if(!error && response.statusCode==200) {
//       console.log(body);
//       requestToken = body["request_token"];
//       //req.session.reqToken = body["request_token"];
//       // after generating a token, we redirect to TMDB to approve the generated token
//       res.redirect('https://www.themoviedb.org/auth/access?request_token='+requestToken);
//
//     }
//     else {
//       res.send("Ah, that's an error !");
//     }
//   });
// });
//
//
// // approved route for redirecting and generating user access token + account id
//  app.get('/tonight/approved/', function (req, res) {
//    const accessTokenOptions = {
//      method: 'POST',
//      url: "https://api.themoviedb.org/4/auth/access_token",
//      headers: {
//        // its the API Read Access token found under API settings(new in v4)
//        authorization: bearerAuth,
//        'content-type': "application/json;charset=utf-8"
//        },
//        // passing the previously generated request token in the body
//        body: {request_token: requestToken},
//        json: true
//    };
//
//    request(accessTokenOptions, function (error, response, body) {
//      if(!error && response.statusCode == 200) {
//        console.log(body);
//       // extracting the accessToken and accountId from the body
//        // const accessToken = body["access_token"];
//        // const accountId = body["account_id"];
//        req.session.accessToken = body["access_token"];
//        req.session.accountId = body["account_id"];
//        //res.redirect("/tonight/approved/"+ accessToken +"/"+accountId);
//        res.redirect("/tonight/approved/access");
//       }
//       else {
//         res.send("Ah 2, that's an error !");
//       }
//    });
//  });
//
// // generating a sessionId
//   app.get("/tonight/approved/access", function (req, res) {
//
//   sessionIdOptions = {
//     method: 'POST',
//     url: 'https://api.themoviedb.org/3/authentication/session/convert/4',
//     qs: {api_key: +apiKey},
//     headers: {authorization: bearerAuth},
//     body: {access_token: req.session.accessToken},
//     json: true
//   };
//
//   request(sessionIdOptions, function (error, response, body) {
//     if(error){
//       console.log(error);
//       res.send("Ah jeez, that's an error !");
//     }
//     else {
//       console.log(body);
//       //const sessionId = body["session_id"];
//       req.session.sessionId = body["session_id"];
//       console.log(req.session.sessionId);
//
//       //getting account details
//       const accountDetailsOptions={
//         method: "GET",
//         url:'https://api.themoviedb.org/3/account?api_key='+apiKey+'',
//         headers: {authorization: 'Bearer ' + req.session.accessToken},
//         qs:{session_id:req.session.sessionId},
//         json:true
//       };
//       // requesting username with promises
//       rp(accountDetailsOptions)
//         .then(function(repos){
//           // extracting username from respos and parsing it to the url
//           req.session.user = repos.username;
//           app.locals.user = repos.username;
//           res.redirect("/tonight/approved/access/"+repos.username);
//         })
//         .catch(function (err) {
//           console.log("ah no, login first");
//           res.redirect("/");
//         });
//     }
//   });
// });
//
// // logout or delete session
//   app.get("/tonight/logout", function(req,res) {
//     logoutOptions = {
//       method: 'DELETE',
//       url: 'https://api.themoviedb.org/3/authentication/session',
//       headers: {'content-type': 'application/json;charset=utf-8'},
//       qs: {api_key: apiKey},
//       body: {session_id: req.session.sessionId},
//       json: true
//     };
//
//     request(logoutOptions, function (error, response, body) {
//       if(error || body["status_code"]===5) {
//         res.send("Ah jeez, can't log you out!");
//       }
//       else {
//         req.session.destroy(function (err) {
//           if(err) {
//             console.log(err);
//             res.send("AH, can't log out");
//           }
//           else {
//             res.redirect("/tonight");
//             console.log(body);
//           }
//         })
//       }
//     })
//   });

// USER ROUTES

// // user index route
// app.get("/tonight/approved/access/:user", isLoggedIn,function (req, res) {
//   const user = req.session.user;
//   recommendedMovieOptions = {
//     method: 'GET',
//     url: 'https://api.themoviedb.org/4/account/'+ req.session.accountId +'/movie/recommendations',
//     qs: {page: '1'},
//     headers: {
//       authorization: 'Bearer ' + req.session.accessToken,
//       'Content-Type': 'application/json'
//     },
//     json: true
//   };
//   request(recommendedMovieOptions, function (error, response, body) {
//     const recommendedMovies = body;
//     console.log(recommendedMovies);
//     if(error) {
//       res.send("Ah boo, that's an error !");
//     }
//     else {
//       res.render("user/userIndex.ejs", {recommendedMovies: recommendedMovies, user: user});
//
//     }
//   })
// });
//


// // show user movie routes
// app.get("/tonight/approved/access/:user/show/:id", isLoggedIn ,function (req, res) {
//   const id = req.params.id;
//   const user = req.session.user;
//   console.log(user,id);
//   showUserMovieOptions = {
//     method: 'GET',
//     url: 'https://api.themoviedb.org/3/movie/'+id,
//     qs: {api_key: apiKey, session_id: req.session.sessionId, append_to_response: "account_states"},
//     json: true
//   };
//   request(showUserMovieOptions, function (error, response, body) {
//     if(!error && response.statusCode == 200){
//       console.log(body);
//       const content = body;
//       res.render("user/showMovies.ejs", {content: content, user: user});
//     }
//     else {
//       res.send("Ah jeez, that's an error !");
//       console.log(response);
//     }
//   })
// });

// // show user tv routes
// app.get("/tonight/approved/access/:user/tv/show/:id", isLoggedIn ,function (req, res) {
//   const id = req.params.id;
//   const user = req.session.user;
//
//   showUserTvOptions = {
//     method: 'GET',
//     url: 'https://api.themoviedb.org/3/tv/'+id+'&language=en-US',
//     qs: {api_key: apiKey, session_id: req.session.sessionId, append_to_response: "account_states" },
//     body:'{}',
//     json: true
//   };
//   request(showUserTvOptions, function (error, response, body) {
//     if(error){
//       res.send("Ah jeez, that's an error !");
//     }
//     else {
//       console.log(body);
//       const content = body;
//       res.render("user/showTv.ejs", {content: content, user: user});
//     }
//   })
// });


// ratings routes
// //movie ratings
// app.post("/tonight/approved/access/:user/movie/show/:id", isLoggedIn,function (req,res) {
//   const ratings = req.body.ratings;
//   const id = req.params.id;
//   const user = req.session.user;
//
//   console.log(ratings, id);
//   ratingOptions = {
//     method: 'POST',
//     url: 'https://api.themoviedb.org/3/movie/'+id+'/rating',
//     qs: {session_id: req.session.sessionId, api_key: apiKey},
//     headers: { 'content-type': 'application/json;charset=utf-8' },
//     body: {value: ratings},
//     json: true
//   }
//   request(ratingOptions, function(error, response, body){
//     //if(!error && response.statusCode==200)
//     if(error){
//       console.log(error);
//     }
//     else{
//       console.log("Rated");
//       res.redirect('/tonight/approved/access/'+user+'/show/'+id);
//     }
//   })
// });
//
// // tv ratings
// app.post("/tonight/approved/access/:user/tv/show/:id", isLoggedIn,function (req,res) {
//   const ratings = req.body.ratings;
//   const id = req.params.id;
//   const user = req.session.user;
//
//   console.log(ratings, id);
//   ratingOptions = {
//     method: 'POST',
//     url: 'https://api.themoviedb.org/3/tv/'+id+'/rating',
//     qs: {session_id: req.session.sessionId, api_key: apiKey},
//     headers: { 'content-type': 'application/json;charset=utf-8' },
//     body: {value: ratings},
//     json: true
//   }
//   request(ratingOptions, function(error, response, body){
//     //if(!error && response.statusCode==200)
//     if(error){
//       console.log(error);
//     }
//     else{
//       console.log("Rated");
//       res.redirect('/tonight/approved/access/'+user+'/tv/show/'+id);
//     }
//   })
// });
//

// // seperate movies page dedicated to the user
// app.get("/tonight/approved/access/:user/movies", isLoggedIn ,function (req, res) {
//   const user = req.session.user;
//   const movieRequest =
//     "https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&region=IN&year=2019&include_adult=true&include_video=false&page=1";
//   request(movieRequest, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       const data = JSON.parse(body);
//       res.render("user/userMovies.ejs", { data: data, user: user });
//     }
//     else {
//       res.send("You're lost !")
//     }
//   })
// });
//
// // seperate tv page dedicated to the user
// app.get("/tonight/approved/access/:user/tv", isLoggedIn ,function (req, res) {
//   const user = req.session.user;
//   const tvRequest =
//     "https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&region=IN&sort_by=popularity.desc&page=1&include_null_first_air_dates=false";
//   request(tvRequest, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       const data = JSON.parse(body);
//       res.render("user/userTvSeries.ejs", { data: data, user: user});
//     }
//     else {
//       res.send("You're lost !")
//     }
//   })
// });
