var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  //this portion of code is for passport to work
  app.post("/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      isManager: req.body.isManager
    }).then(function (data) {
      res.json(data);
    });
  });
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //this will load the login page, if they do not have an account, we can redirect them to the sign up page
  app.get("/", function (req, res) {
    res.render("login");
  });

  //this will load the sign up page
  app.get("/signup", function (req, res) {
    res.render("sign-up");
  });

  //this will load the manager page
  app.get("/manager", function (req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function (data) {
      res.render("manager", { user: data });
    });
  });

  //this will load the home page
  //we are passing an a parameter id so we can associate to the right account
  app.get("/home", function (req, res) {
    //we will parse out the id later for addition use
    //remember to store the id variable somewhere
    var meme;
    var user;
    db.Memes.findAll({
      order: [["cost", "ASC"]]
    }).then(function (data) {

      meme = data;
      db.User.findOne({
        where: {
          id: req.user.id
        }
      }).then(function (data) {
        user = data;

        var pageContent = {
          meme: meme,
          user: user
        };
        res.render("home", { page: pageContent });
      });
    });
  });
  //route to filter out the memes based on lvl
  app.get("/home/:lvl", function (req, res) {
    var meme;
    var user;
    db.Memes.findAll({
      where: {
        lvl: req.params.lvl
      },
      order: [["cost", "ASC"]]

    }).then(function (data) {

      meme = data;
      db.User.findOne({
        where: {
          id: req.user.id
        }
      }).then(function (data) {
        user = data;

        var pageContent = {
          meme: meme,
          user: user
        };
        res.render("home", { page: pageContent });
      });
    });
  });




  //this is for the purchased memes, again passing the id so we know which mean belongs to the user
  app.get("/purchased", function (req, res) {
    //we will parse out the id later for addition use
    //remember to store the id variable somewhere
    var purchasedMeme;
    var user;
    db.Boughten_Memes.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function (data) {
      purchasedMeme = data;
      db.User.findOne({
        where: {
          id: req.user.id
        }
      }).then(function (data) {
        user = data;

        var pageContent = {
          meme: purchasedMeme,
          user: user
        };
        res.render("purchased", { page: pageContent });
      });
    });
  });

  //renders the clicker page associated with the currently signed in user
  app.get("/more-points", function (req, res) {
    var clicker;
    var user;
    db.ClickerUpgrades.findAll({
      order: [["cost", "ASC"]]
    }).then(function (data) {
      clicker = data;
      db.User.findOne({
        where: {
          id: req.user.id
        }
      }).then(function (data) {
        user = data;

        var pageContent = {
          clickUpgrades: clicker,
          user: user
        };
        res.render("clicker", { page: pageContent });
      });
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //renders the clicker page associated with the currently signed in user
  app.get("/profile", function (req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function (data) {
      res.render("profile", { user: data });
    });
  });

  app.get("/manager-buttons", function (req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function (data) {
      res.render("upgrade-click-buttons", { user: data });
    });
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///=====BATTLE STUFF=====///

  ///build html route to load battle page with the users meme as a data block for handlebars
  app.get("/battle/select/:lvl", function (req, res) {
    var selection;
    var heros;

    db.Boughten_Memes.findAll({
      where: {
        lvl: req.params.lvl,
        UserId: req.user.id
      }
    }).then(function (data) {
      heros = data;
    });

    db.Memes.findAll({
      where: {
        lvl: req.params.lvl
      }
    }).then(function (data) {
      var enemies = data;
      selection = {
        heros: heros,
        enemies: enemies
      };
      res.render("battleSelect", { memes: selection });
    });
  });

  //this is perfect for us to use, we can redirect them to the error page if they visit a wrong area
  app.get("*", function (req, res) {
    res.render("404");
  });
};
