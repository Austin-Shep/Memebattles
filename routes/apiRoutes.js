var db = require("../models");

var passport = require("../config/passport");

var currentId;

module.exports = function (app) {
  //this portion of code is all for passport to work

  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed

    //we are setting the current ID here because we need to be able to reference the user throughout other pages
    currentId = req.user.id;
    //sent back the current logged in users data
    var user = {
      isManager: req.user.isManager,
      id: req.user.id
    };
    res.json(user);
  });
  //^^^^^^^^^^^^^^

  //this route is for storing into the database new memes
  app.post("/api/manager", function (req, res) {
    //send this data to the meme table
    db.Memes.create(req.body).then(function (data) {
      res.json(data);
    });
  });

  //a get route for the memes
  app.get("/api/manager", function (req, res) {
    db.Memes.findAll({}).then(function (data) {
      res.json(data);
    });
  });

  //sends back the currently signed in user
  app.get("/api/user/id", function (req, res) {
    console.log("test " + currentId);
    db.User.findAll({
      where: {
        id: currentId
      }
    }).then(function (data) {
      console.log(data);
      res.json(data);
    });
  });

  //allows us to upadte which meme belongs to a signed in account
  app.post("/api/user/id", function (req, res) {
    db.Boughten_Memes.create(req.body).then(function (data) {
      res.json(data);
    });
  });
  //allows us to update the currently signed in users points
  app.put("/api/user/id", function (req, res) {
    console.log(req.body);
    db.User.update(
      {
        points: req.body.points
      },
      {
        where: {
          id: currentId
        }
      }
    ).then(function (data) {
      res.json(data);
    });
  });
};
