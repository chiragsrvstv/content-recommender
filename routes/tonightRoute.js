const express = require('express');
const router   = express.Router();

//landing page route
router.get('/', (req, res) => {
  res.redirect("/tonight");
});

router.get("/tonight", function(req, res) {
  // if a session already exists we redirect the user to their accounts landing page
  if(req.session.sessionId != undefined){
    res.redirect("/tonight/approved/access/"+req.session.user);
  } else {
    res.render("index.ejs");
  }
});

module.exports = router;
