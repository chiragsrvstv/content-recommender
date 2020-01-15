const express  = require('express'),
      router   = express.Router(),
      request  = require("request"),
      rp          = require("request-promise"),
      api      = require("../../apis/api.js"),
      config   = require("../../config.js");

// API configs
const apiKey = api.api_key;
const bearerAuth = api.auth;

// AUTHENTICATION INITIALIZATION


// generating a request token + getting the user to approve it
router.get("/tonight/login", function(req, res) {
  const requestTokenOptions = {
    method: 'POST',
    url: "https://api.themoviedb.org/4/auth/request_token",
    headers: {
      // its the API Read Access token found under API settings(new in v4)
      authorization: bearerAuth,
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
 router.get('/tonight/approved/', function (req, res) {
   const accessTokenOptions = {
     method: 'POST',
     url: "https://api.themoviedb.org/4/auth/access_token",
     headers: {
       // its the API Read Access token found under API settings(new in v4)
       authorization: bearerAuth,
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
  router.get("/tonight/approved/access", function (req, res) {

  sessionIdOptions = {
    method: 'POST',
    url: 'https://api.themoviedb.org/3/authentication/session/convert/4',
    qs: {api_key: +apiKey},
    headers: {authorization: bearerAuth},
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

      //getting account details
      const accountDetailsOptions={
        method: "GET",
        url:'https://api.themoviedb.org/3/account?api_key='+apiKey+'',
        headers: {authorization: 'Bearer ' + req.session.accessToken},
        qs:{session_id:req.session.sessionId},
        json:true
      };
      // requesting username with promises
      rp(accountDetailsOptions)
        .then(function(repos){
          // extracting username from respos and parsing it to the url
          req.session.user = repos.username;
          app.locals.user = repos.username;
          res.redirect("/tonight/approved/access/"+repos.username);
        })
        .catch(function (err) {
          console.log("ah no, login first");
          res.redirect("/");
        });
    }
  });
});

// logout or delete session
  router.get("/tonight/logout", function(req,res) {
    logoutOptions = {
      method: 'DELETE',
      url: 'https://api.themoviedb.org/3/authentication/session',
      headers: {'content-type': 'application/json;charset=utf-8'},
      qs: {api_key: apiKey},
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

module.exports = router;
