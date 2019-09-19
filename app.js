const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser');

// setting up server to respond requests at localhost:3000
app.listen(3000, function() {
  console.log("serving port 3000 localhost");
});

//routes

//index route

app.get("/tonight", function (req, res) {
  res.render("index.ejs")

});