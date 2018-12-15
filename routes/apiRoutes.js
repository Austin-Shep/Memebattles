var db = require("../models");

var passport = require("../config/passport");

module.exports = function(app) {
  //this portion of code is all for passport to work

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed

    //we are setting the current ID here because we need to be able to reference the user throughout other pages

    //sent back the current logged in users data
    var user = {
      isManager: req.user.isManager,
      id: req.user.id
    };
    res.json(user);
  });
  //^^^^^^^^^^^^^^

  //this route is for storing into the database new memes
  app.post("/api/manager", function(req, res) {
    //send this data to the meme table
    db.Memes.create(req.body).then(function(data) {
      res.json(data);
    });
  });

  //a get route for the memes
  app.get("/api/manager", function(req, res) {
    db.Memes.findAll({}).then(function(data) {
      res.json(data);
    });
  });

  //sends back the currently signed in user
  app.get("/api/user/id", function(req, res) {
    db.User.findAll({
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  // grab the meme for battle, will attach this to a button on the purchased page.
  app.get("/api/user/memes/:id", function(req, res) {
    db.Boughten_Memes.findOne({
      where: {
        UserId: req.user.id,
        id: req.params.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  //deletes the meme on lose condition
  app.delete("/api/user/memes/:id", function(req, res) {
    db.Boughten_Memes.destroy({
      where: {
        UserId: req.user.id,
        id: req.params.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  //allows us to update which meme belongs to a signed in account
  app.post("/api/user/id", function(req, res) {
    db.Boughten_Memes.create(req.body).then(function(data) {
      res.json(data);
    });
  });
  //allows us to update the currently signed in users points
  app.put("/api/user/id", function(req, res) {
    db.User.update(
      {
        points: req.body.points
      },
      {
        where: {
          id: req.user.id
        }
      }
    ).then(function(data) {
      res.json(data);
    });
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/get-current-power", function(req, res) {
    db.User.findAll({
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });
  app.get("/api/get-current-user-points", function(req, res) {
    db.User.findAll({
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  //all the api's for upgrading click
  app.get("/upgrade-click", function(req, res) {
    db.PurchasedClickerUpgrades.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });
  app.post("/upgrade-click", function(req, res) {
    db.PurchasedClickerUpgrades.create(req.body).then(function(data) {
      res.json(data);
    });
  });
  //this route handles upgrading the click power
  app.put("/upgrade-click", function(req, res) {
    db.User.update(
      {
        clickPower: req.body.clickPower,
        points: req.body.points,
        tokensPerClick: req.body.tokensPerClick
      },
      {
        where: {
          id: req.user.id
        }
      }
    ).then(function(data) {
      res.json(data);
    });
  });

  //this will return the last upgrade button so we can auto increment every time future buttons are
  //added by the manager, this helps with the purchasing algorithm
  app.get("/api/manager-click-check", function(req, res) {
    db.ClickerUpgrades.findAll({
      limit: 1,
      order: [["clickPower", "DESC"]]
    }).then(function(data) {
      res.json(data);
    });
  });
  //creates a new upgradable button
  app.post("/api/manager-click-check", function(req, res) {
    db.ClickerUpgrades.create(req.body).then(function(data) {
      res.json(data);
    });
  });

  app.get("/user/level", function(req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      res.json(data[0].lvl);
    });
  });

  app.put("/api/user/avatar", function(req, res) {
    db.User.update(
      {
        avatar: req.body.avatar
      },
      {
        where: {
          id: req.user.id
        }
      }
    ).then(function(data) {
      res.json(data);
    });
  });

  //=====================================BATTLE STUFFFFFFFF====================//////////////////
  //used to grab the enemy meme from the battle select screen, queries the whole meme database
  app.get("/combatants/:opId", function(req, res) {
    db.Memes.findOne({
      where: {
        id: req.params.opId
      }
    }).then(function(data) {
      res.json(data);
    });
  });
  //used to grab the hero meme from the battle select screen, queries the list of purchased memes
  app.get("/heros/:heroId", function(req, res) {
    db.Boughten_Memes.findOne({
      where: {
        id: req.params.heroId,
        UserId: req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  //used to add and subtracrt coins and exp for the end of battles

  app.put("/api/user/wins", function(req, res) {
    db.User.update(
      {
        wins: req.body.wins,
        points: req.body.points
      },
      {
        where: {
          id: req.user.id
        }
      }
    ).then(function(data) {
      res.json(data);
    });
  });

  app.put("/api/user/loss", function(req, res) {
    db.User.update(
      {
        points: req.body.points,
        loss: req.body.loss
      },
      {
        where: {
          id: req.user.id
        }
      }
    ).then(function(data) {
      res.json(data);
    });
  });
};
