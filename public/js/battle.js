$(document).ready(function() {
  var Meme = require("./memeconstruct");
  var attackMeme = {};
  var defendMeme = {};
  var battlestart = false;
  var inTurn = false;
  var heroSelected = false;
  var defenderSelected = false;

  //makes sure the game starts in its correct state
  initBattle = () => {
    attackMeme = {};
    defendMeme = {};
    battlestart = false;
    heroSelected = false;
    opponentSelected = false;
  };
  initBattle();

  //will run the functions need to start the battle, only if both have been selected
  run = () => {
    if (heroSelected === true && opponentSelected === true) {
      battlestart = true;
      //postAttacker()
      //postDefender()
    } else {
      return;
    }
  };

  function fighterSelect(id) {
    //call the api
    if (!heroSelected) {
      $.ajax(`/heros/${id}`, {
        type: "GET"
      }).then(function(meme) {
        console.log(`attack meme ${meme}`);
        attackMeme = new Meme(
          meme.name,
          meme.lvl,
          meme.ac,
          meme.link,
          meme.attack_power,
          meme.health_points,
          meme.dice_value,
          true
        );
        run();
      });
    } else {
      return;
    }
  }

  function defendSelect(id) {
    //call api
    if (!defenderSelected) {
      $.ajax(`/combatants/${id}`, {
        type: "GET"
      }).then(function(meme) {
        console.log(`defend meme ${meme}`);
        defendMeme = new Meme(
          meme.name,
          meme.lvl,
          meme.ac,
          meme.link,
          meme.attack_power,
          meme.health_points,
          meme.dice_value,
          false
        );
        run();
      });
    } else {
      return;
    }
  }

  $(".attackButton").on("click", () => {
    if (battlestart && !inTurn) {
      inTurn = true;
      attackMeme.confirm(defendMeme);
      if (defendMeme.hp <= 0) {
        attackMeme.win();
      }
      defendMeme.confirm(attackMeme);
      if (attackMeme.hp <= 0) {
        attackMeme.concede();
      }

      inTurn = false;
    }
  });
});
