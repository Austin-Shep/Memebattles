var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  //this portion of code is for passport to work
  app.post("/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      isManager: req.body.isManager
    }).then(function(data) {
      res.json(data);
    });
  });
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //this will load the login page, if they do not have an account, we can redirect them to the sign up page
  app.get("/", function(req, res) {
    res.render("login");
  });

  //this will load the sign up page
  app.get("/signup", function(req, res) {
    res.render("sign-up");
  });

  //this will load the manager page
  app.get("/manager/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      res.render("manager", { user: data });
    });
  });

  //this will load the home page
  //we are passing an a parameter id so we can associate to the right account
  app.get("/home/:id", function(req, res) {
    //we will parse out the id later for addition use
    //remember to store the id variable somewhere
    db.Memes.findAll().then(function(data) {
      console.log(data);
      res.render("home", { meme: data });
    });
  });

<<<<<<< HEAD
  //this is for the purchased memes
=======
  //this is for the purchased memes, again passing the id so we know which mean belongs to the user
>>>>>>> 4537af891bc99cffd4a846458cd1c1a9dc3cc941
  app.get("/purchased/:id", function(req, res) {
    db.Boughten_Memes.findAll({
      where: {
        UserId: req.params.id
      }
    }).then(function(data) {
      res.render("purchased", { meme: data });
    });
  });

<<<<<<< HEAD
=======
  //renders the clicker page associated with the currently signed in user
>>>>>>> 4537af891bc99cffd4a846458cd1c1a9dc3cc941
  app.get("/more-points/:id", function(req, res) {
    res.render("clicker");
  });

  //this is perfect for us to use, we can redirect them to the error page if they visit a wrong area
  app.get("*", function(req, res) {
    res.render("404");
  });
};
