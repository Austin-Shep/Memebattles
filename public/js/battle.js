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
      //take the dice roll, passes through the dice val and adds the users attack power
      return this.diceroll(this.diceVal) + this.ap;
    }

    //takes in the users dice val and uses that to determine how many sides are on the roll
    diceroll(value) {
      var randomNumber = Math.floor(Math.random() * value) + 1;
      return randomNumber;
    }
    //used to see if one hits
    confirm(target) {
      //to confirm your hit, you roll a 20 sided dice and add your ap to see if you can get higher than the opponents armor class
      let confirmVal = this.diceroll(20) + this.ap;
      console.log(`value to beat: ${target.ac}`, `confirm roll: ${confirmVal}`);
      //conditional to check and see if you beat ther targets ac.
      if (confirmVal >= target.ac) {
        //grab the dmg value
        var thisAttk = this.dmg();
        console.log(`${this.name} dealt ${thisAttk} damage!`);
        //subtract this attack from the targets hp
        target.hp -= thisAttk;
      } else {
        //unless you miss
        console.log(`${this.name} missed!`);
      }
    }

    //used to determin how many coins and how much exp you get
    expCoinGain(target) {
      var lvlDiff = parseFloat(target.lvl) - parseFloat(this.lvl);
      var newValue = parseFloat(target.lvl) * 5 + parseFloat(this.lvl) * 2;
      if (lvlDiff >= 0) {
        newValue += parseFloat(lvlDiff) * 11;
      }
      console.log(`coins value ${newValue}`);
      return newValue;
    }

    //used to grab the current ammount of points in your accou t so that you can subtract fom it
    getCurrentPoints() {
      var currentUserPoints;
      $.ajax("/api/get-current-user-points", {
        type: "GET"
      }).then(function(data) {
        currentUserPoints = parseFloat(data[0].points);
      });
      return currentUserPoints;
    }

    //used to get the current exp so you can add to it later.
    getCurrentEXP() {
      var currentUserExp;
      $.ajax("/api/get-current-user-points", {
        type: "GET"
      }).then(function(data) {
        currentUserExp = parseFloat(data[0].exp);
      });
      return currentUserExp;
    }

    //add will denote wether or not you won or lost using boolean
    //used to handle the transfer of points
    calculatePointChange(add) {
      var pointChange = this.expCoinGain(defendMeme);
      var newUserPoints = getCurrentPoints();
      if (add === true) {
        //will grab the current and new values and add them
        newUserPoints += pointChange;
        return newUserPoints;
      } else {
        //will grab the current and new values and find the difference
        newUserPoints -= pointChange;
        return newUserPoints;
      }
    }

    calculateNewEXP() {
      var currentUserExp = parseFloat(this.getCurrentEXP());
      var expAdded = this.expCoinGain(defendMeme);
      currentUserExp += expAdded;
      return currentUserExp;
    }

    lossProfileUpdate() {
      var curLost = this.calculatePointChange(false);
      var updatePoints = {
        points: curLost,
        exp: getCurrentEXP()
      };

      $.ajax({
        type: "PUT",
        URL: "api/user/currency",
        data: updatePoints
      }).then(data => {
        //populate the modal
        $("#winlossPost").text("You Lost!");
        $("#expPost").text("You gained: 0 exp");
        $("#coinPost").text(`You Lost: ${curLost} Tokens`);
        //show the modal
        $("#myModal").modal("show");
      });
    }

    concede() {
      //destroys the meme you lost with because you dont deserve it
      $.ajax({
        type: "DESTROY",
        url: `/api/user/memes/${this.id}`
      }).then(data => {
        console.log(`${data[0].name} destroyed`);
        this.lossProfileUpdate();
      });
    } //end of this.concede()

    win() {
      //calculate the new coin and exp
      var curGain = this.calculatePointChange(true);
      var expGain = this.calculateNewEXP();
      //stor it as json
      var updatePoints = {
        points: curGain,
        exp: expGain
      };
      //update the dang thing
      $.ajax({
        type: "PUT",
        URL: "api/user/currency",
        data: updatePoints
      }).then(data => {
        //populate the modal
        $("#winlossPost").text("You Won!");
        $("#expPost").text(`You Gained: ${expGain} exp`);
        $("#coinPost").text(`You Gained: ${curGain} Tokens`);
        //show the modal
        $("#myModal").modal("show");
      });
    } //end of win()
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
    pos /*pos will be the class that dictates the suffix for post points "He" or "En"*/
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
        //build your fighter
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
        //build your opponent
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
      //maybe break this into distinct turns like jamie was mentioning
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
