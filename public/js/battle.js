$(document).ready(function() {
  var attackMeme = {};
  var defendMeme = {};
  var battlestart = false;
  var inTurn = false;
  var heroSelected = false;
  var defenderSelected = false;

  class Meme {
    //used to construct the meme that will battle
    constructor(id, name, lvl, ac, link, ap, hp, diceVal, boo) {
      this.id = id;
      this.name = name;
      this.ac = ac;
      this.lvl = lvl;
      this.imgLink = link;
      this.ap = ap;
      this.hp = hp;
      this.diceVal = diceVal;
      this.isAttacker = boo;
    }

    //used to get dmg for attack
    dmg() {
      return this.diceroll(this.diceVal) + this.ap;
    }

    diceroll(value) {
      var randomNumber = Math.floor(Math.random() * value) + 1;
      return randomNumber;
    }
    //used to see if one hits
    confirm(target) {
      let confirmVal = this.diceroll(20) + this.ap;
      console.log(`value to beat: ${target.ac}`, `confirm roll: ${confirmVal}`);
      if (confirmVal >= target.ac) {
        var thisAttk = this.dmg();
        console.log(`${this.name} dealt ${thisAttk} damage!`);
        target.hp -= thisAttk;
      } else {
        console.log(`${this.name} missed!`);
      }
    }

    //used to determin how many coins and how much exp you get
    expCoinGain(target) {
      var lvlDiff = target.lvl - this.lvl;
      var newValue = target.lvl * 5 + target.lvl * 2;
      if (lvlDiff > 0) {
        newValue += lvlDiff * 11;
      }
      console.log(`coins value ${newValue}`);
      return newValue;
      //structure this for mysql addition
    }

    concede() {
      $.ajax({
        type: "DESTROY",
        url: `/api/user/memes/${this}`
      }).then(data => {
        //display loss modal, display total coin loss and then call update User Profile api through ajax , and then redirect to the profile page
      });
    }

    win() {
      //re-direct to meme page
      $.ajax({
        type: "PUT",
        URL: "/api/user/id",
        data: this.expCoinGain //win exp and coins of equal amt
      }).then(data => {
        //display win modal with exp and coin gains, then redirect to meme page
      });
    }
  }

  //will run the functions need to start the battle, only if both have been selected
  var run = function() {
    if (heroSelected === true && defenderSelected === true) {
      battlestart = true;
      postCombatant(attackMeme, "He");
      postCombatant(defendMeme, "En");
      $("#selectScreen").css("display", "none");
      $("#battleScreen").css("display", "initial");
    } else {
      return;
    }
  };

  function postCombatant(
    meme,
    pos /*pos will be the class that dictates the suffix for post points*/
  ) {
    $(`#imgPost-${pos}`).attr("src", meme.imgLink);
    $(`#hp-${pos}`).text(meme.hp);
    $(`#name-${pos}`).text(meme.name);
  }

  function updateHP(meme, pos) {
    $(`#hp-${pos}`).text(meme.hp);
  }

  function fighterSelect(id) {
    //call the api
    if (!heroSelected) {
      $.ajax(`/heros/${id}`, {
        type: "GET"
      }).then(function(meme) {
        console.log(`attack meme ${JSON.stringify(meme)}`);
        attackMeme = new Meme(
          meme.id,
          meme.name,
          meme.lvl,
          meme.ac,
          meme.link,
          meme.attack_power,
          meme.health_points,
          meme.dice_value,
          true
        );
        console.log(attackMeme);
        heroSelected = true;
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
        console.log(`defend meme ${JSON.stringify(meme)}`);
        defendMeme = new Meme(
          meme.id,
          meme.name,
          meme.lvl,
          meme.ac,
          meme.link,
          meme.attack_power,
          meme.health_points,
          meme.dice_value,
          false
        );
        console.log(defendMeme);
        defenderSelected = true;
        run();
      });
    } else {
      return;
    }
  }

  $(".fighterSelect").on("click", function() {
    var fighterId = $(this).attr("id");
    fighterSelect(fighterId);
  });

  $(".defendSelect").on("click", function() {
    var defenderId = $(this).attr("id");
    defendSelect(defenderId);
  });

  $("#attackButton").on("click", function() {
    if (battlestart && !inTurn) {
      inTurn = true;
      attackMeme.confirm(defendMeme);
      updateHP(defendMeme, "En");
      if (defendMeme.hp <= 0) {
        attackMeme.win();
        return;
      }
      defendMeme.confirm(attackMeme);
      updateHP(attackMeme, "He");
      if (attackMeme.hp <= 0) {
        attackMeme.concede();
        return;
      }

      inTurn = false;
    }
  });
});
