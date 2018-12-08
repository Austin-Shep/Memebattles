$(document).ready(function() {
  var Meme = require("./memeconstruct");
  var attackMeme = {};
  var defendMeme = {};
  var battlestart = false;
  var inTurn = false;
  var heroSelected = false;
  var defenderSelected = false;

  initBattle = () => {
    attackMeme = {};
    defendMeme = {};
    battlestart = false;
    heroSelected = false;
    opponentSelected = false;
  };
  initBattle();
  run = () => {
    if (heroSelected === true && opponentSelected === true) {
      battlestart = true;
    } else {
      return;
    }
  };
  //////////////////////////////////end of meme class////////////////////////////////////////
  function fighterSelect(id) {
    //call the api
    if (!heroSelected) {
      $.ajax(`/heros/${id}`, {});
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
    } else {
      return;
    }
  }

  function defendSelect(id) {
    //call api
    if (!defenderSelected) {
      $.ajax(`/combatants/${id}`, {});
      defendMeme = new Meme(
        $(this).attr("data-name"),
        $(this).attr("data-lvl"),
        $(this).attr("data-link"),
        $(this).attr("data-ap"),
        $(this).attr("data-hp"),
        $(this).attr("data-dv"),
        false
      );
      run();
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
