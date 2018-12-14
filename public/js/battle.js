$(document).ready(function() {
  //variables thayt will be used throughout th battle system
  var attackMeme = {}; //stores the users hero
  var defendMeme = {}; //stores the enemy hero
  var battlestart = false; //boolean to dictate if the battle has started or not
  var inTurn = false; //boolean used to block multiple turns from happining at once
  var heroSelected = false; //boolean used to check if the user has selected their hero
  var defenderSelected = false; //boolean used to check if the user has slected the opponent

  var API = {
    winsCoinsOnWin: function() {
      $.ajax({
        url: "/api/get-current-user-points",
        type: "GET"
      }).then(function(data) {
        console.log("got current values on win");
        var currentWins = parseFloat(data[0].wins);
        currentWins += 1;
        console.log(`current profile wins: ${currentWins}`);

        var currentPoints = parseFloat(data[0].points);
        var pointChange = attackMeme.expCoinGain(defendMeme);
        currentPoints += pointChange;

        var update = {
          wins: currentWins,
          points: currentPoints
        };
        console.log(update);

        $.ajax({
          url: "/api/user/wins",
          type: "PUT",
          data: update
        }).then(function(data) {
          /*modal stuff */
          console.log("updated currency after wins");
          $("#winlossPost").text("YOU WON!");
          $("#expPost").text(`TOTAL WINS: ${currentWins}`);
          $("#coinPost").text(`POINTS WON: ${pointChange}
          NEW TOTAL POINTS: ${currentPoints}`);
          $("#myModal").modal("toggle");
          console.log("triggered modal on win");
        });
      });
    },

    pointsOnLoss: function() {
      $.ajax({
        url: "/api/get-current-user-points",
        type: "GET"
      }).then(function(data) {
        console.log("got current values on loss");
        var currentLoss = parseFloat(data[0].loss);
        currentLoss += 1;
        console.log(`current profile loss: ${currentLoss}`);

        var currentPoints = parseFloat(data[0].points);
        var pointChange = attackMeme.expCoinGain(defendMeme);
        currentPoints -= pointChange;

        var update = {
          loss: currentLoss,
          points: currentPoints
        };
        console.log(update);

        $.ajax({
          url: "/api/user/loss",
          type: "PUT",
          data: update
        }).then(function(data) {
          console.log("updated currency on loss");
          $.ajax({
            url: `/api/user/memes/${attackMeme.id}`,
            type: "DELETE"
          }).then(function(data) {
            console.log("deleted meme after loss");
            $("#winlossPost").text("YOU LOST!");
            $("#expPost").text(`TOTAL LOSSES: ${currentLoss}`);
            $("#coinPost").text(`POINTS LOST: ${pointChange}
          NEW TOTAL POINTS: ${currentPoints}`);
            $("#myModal").modal("toggle");
            console.log("triggered modal on loss"); //modal stuff
          });
        });
      });
    }
  };

  class Meme {
    //used to construct the meme that will battle, will grab the data from an api route
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

    //takes in a value to determine how many "sides" the dice and utilizes that on the roll
    diceroll(value) {
      var randomNumber = Math.floor(Math.random() * value) + 1;
      //returns the result
      return randomNumber;
    }
    //used to see if one hits the the other, passing in a target so that both attacker and defender can use this function
    confirm(target) {
      //to confirm your hit, you roll a 20 sided dice and add your Attack Power(AP) to see if you can get higher than the opponents Armor Class(ac)
      let confirmVal = this.diceroll(20) + this.ap;
      console.log(`value to beat: ${target.ac}`, `confirm roll: ${confirmVal}`);
      //conditional to check and see if you beat the targets Armor Class (ac).
      if (confirmVal >= target.ac) {
        //grab the damage value from the dmg() function
        var thisAttk = this.dmg();
        //console.log it for transparency
        console.log(`${this.name} dealt ${thisAttk} damage!`);
        //subtract this attack from the targets hp
        target.hp -= thisAttk;
      } else {
        //unless you miss, should probably display all this info somewhere onscreen instead of just in the console
        console.log(`${this.name} missed!`);
      }
    }

    //used to determine how many coins and how much exp you get
    expCoinGain(target) {
      var newValue = Math.pow(target.lvl, 2) + 8 * this.diceroll(10);
      console.log(`coins value ${newValue}`);
      return newValue;
    }
    //this method will set of the callback chain that happens after the user loses, first it delets the meme you lost with, then it updates your profiles currency, then it redirects you to the profile page.
    concede() {
      console.log("you lost!");
      API.pointsOnLoss();
    } //end of this.concede()

    //the method that sets off the callback chain for when the user wins
    win() {
      console.log("You win!");
      API.winsCoinsOnWin();
    }
  }
  //will run the functions need to start the battle, only if both have been selected
  var run = function() {
    if (heroSelected === true && defenderSelected === true) {
      battlestart = true;
      //populates the combatant block using specific suffixes deenoted on the "posy combatant function"
      postCombatant(attackMeme, "He");
      postCombatant(defendMeme, "En");
      //switches the screen display from select to the battle screen.
      $("#selectScreen").css("display", "none");
      $("#battleScreen").css("display", "initial");
    } else {
      //unless the criteria havent been met
      return;
    }
  };
  //function for populating the battle page
  function postCombatant(
    meme, //will be either (attackerMeme or defenderMeme)
    pos /*pos will be the class that dictates the suffix for post points "He" or "En"*/
  ) {
    $(`#imgPost-${pos}`).attr("src", meme.imgLink);
    $(`#hp-${pos}`).text(meme.hp);
    $(`#name-${pos}`).text(meme.name);
  }
  //called each turn to post the current hp
  function updateHP(meme, pos) {
    $(`#hp-${pos}`).text(meme.hp);
  }
  //used to assign the chosen meme to the proper class and object, attacker
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
        //console.log the choice
        console.log(attackMeme);
        //set boolean to true so the game can start
        heroSelected = true;
        //check run to see if the game can start
        run();
      });
    } else {
      return;
    }
  }
  //used to assign the chosen meme to the proper class and object, attacker
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
        //console.log the choice
        console.log(defendMeme);
        //set boolean to true so the game can start
        defenderSelected = true;
        //check run to see if the game can start
        run();
      });
    } else {
      return;
    }
  }
  /////these functions are the event listeners to trigger the combatant set
  $("#postBattleDismiss").on("click", function() {
    window.location.replace("../../profile");
  });

  $(".fighterSelect").on("click", function() {
    var fighterId = $(this).attr("id");
    fighterSelect(fighterId);
  });

  $(".defendSelect").on("click", function() {
    var defenderId = $(this).attr("id");
    defendSelect(defenderId);
  });
  // this is the event listener to set off the attack turns
  $("#attackButton").on("click", function() {
    //checks to make sure there isnt a turn in progress
    if (battlestart && !inTurn) {
      // sets the turn in progress
      inTurn = true;
      //runs the confirm methodchain to deal damage
      attackMeme.confirm(defendMeme);
      //updates the hp
      updateHP(defendMeme, "En");
      //checks to see if you won yet
      if (defendMeme.hp <= 0) {
        attackMeme.win();
        return;
      } // repeat in the other direction
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
