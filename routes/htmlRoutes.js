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
  app.get("/manager", function(req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      res.render("manager", { user: data });
    });
  });

  //this will load the home page
  //we are passing an a parameter id so we can associate to the right account
  app.get("/home", function(req, res) {
    //we will parse out the id later for addition use
    //remember to store the id variable somewhere
    db.Memes.findAll().then(function(data) {
      console.log(data);
      res.render("home", { meme: data });
    });
  });

  //this is for the purchased memes, again passing the id so we know which mean belongs to the user
  app.get("/purchased", function(req, res) {
    db.Boughten_Memes.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function(data) {
      res.render("purchased", { meme: data });
    });
  });

  //renders the clicker page associated with the currently signed in user
  app.get("/more-points", function(req, res) {
    db.ClickerUpgrades.findAll({
      order: [["cost", "ASC"]]
    }).then(function(data) {
      res.render("clicker", { clickUpgrades: data });
    });
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //renders the clicker page associated with the currently signed in user
  app.get("/profile", function(req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      res.render("profile", { user: data });
    });
  });

  app.get("/manager-buttons", function(req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      res.render("upgrade-click-buttons", { user: data });
    });
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///build html route to load battle page with the users meme as a data block for handlebars
  app.get("/battle/select", function(req, res) {}).then(function(data) {});
  //build a secondary battlepage route for when the user selects there opponent.
  app.get("/battle/run", function(req, res) {}).then(function(data) {});
  //this is perfect for us to use, we can redirect them to the error page if they visit a wrong area
  app.get("*", function(req, res) {
    res.render("404");
  });
};
