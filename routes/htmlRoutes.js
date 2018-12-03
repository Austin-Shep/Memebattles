var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {

  //this portion of code is for passport to work
  app.post("/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      isManager: req.body.isManager
    }).then(function (data) {

      res.json(data);
    })
  });
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //this will load the login page, if they do not have an account, we can redirect them to the sign up page
  app.get("/", function (req, res) {
    res.render("login");

  });

  //this will load the sign up page
  app.get("/signup", function (req, res) {
    res.render("sign-up");
  })

  //this will load the manager page
  app.get("/manager/:id", function (req, res) {

    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (data) {
      res.render("manager", { user: data });
    })

  })

  //this will load the home page
  //we are passing an a parameter id so we can associate to the right account
  app.get("/home/:id", function (req, res) {
    //we will parse out the id later for addition use
    //remember to store the id variable somewhere
    db.Memes.findAll().then(function (data) {
      console.log(data);
      res.render("home", { meme: data });
    })
  })

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    // db.Example.findOne({ where: { id: req.params.id } }).then(function (
    //   dbExample
    // ) {
    //   res.render("example", {
    //     example: dbExample
    //   });
    // });
  });

  //this is perfect for us to use, we can redirect them to the error page if they visit a wrong area
  app.get("*", function (req, res) {
    res.render("404");
  });
};
