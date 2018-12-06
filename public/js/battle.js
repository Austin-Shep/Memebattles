$(document).ready(function() {
  var attackMeme = {};
  var defendMeme = {};
  var battlestart = false;
  var inTurn = false;
  var battleLvl;
  initBattle = () => {
    attackMeme = {};
    defendMeme = {};
    battlestart = false;
  };
  initBattle();
  //=== HOT, HOT, DICE ===//
  var dice = {
    sides: 0,
    roll: function() {
      var randomNumber = Math.floor(Math.random() * this.sides) + 1;
      return randomNumber;
    }
  };

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
    get dmg() {
      dice.sides = this.diceVal;
      return dice.roll + this.ap;
    }
    //used to see if one hits
    confirm(target) {
      dice.sides = 20;
      let confirmVal = dice.roll + this.ap;
      if (confirmVal >= 10) {
        target.hp -= this.dmg();
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
  //////////////////////////////////end of meme class////////////////////////////////////////
  function fighterSelect(id) {
    $.ajax({
      type: "GET",
      url: `/api/user/memes/${id}`
    }).then(meme => {
      attackMeme = new Meme(
        meme.name,
        meme.lvl,
        meme.link,
        meme.attack_power,
        meme.health_points,
        meme.dice_value,
        true
      );
    });
  }

  function opponentDisplay(id) {
    $.ajax({
      type: "GET",
      url: "/api/manager"
    }).then(meme => {
      var applcMemes = meme.filter(meme => (meme.lvl = battleLvl));

      applcMemes.forEach(meme => {
        //display the memes that the user can select to battle.
        //post their stats as attributes on the link, so that when they click the meme they can pass it through the class.
        //should i use handlebars for this or javascript functions? discuss with group.
      });
    });
  }

  $(".defendSelect").on("click", function() {
    defendMeme = new Meme(
      $(this).attr("data-name"),
      $(this).attr("data-lvl"),
      $(this).attr("data-link"),
      $(this).attr("data-ap"),
      $(this).attr("data-hp"),
      $(this).attr("data-dv"),
      false
    );
    battlestart = true;
  });

  $(".attackButton").on("click", () => {
    if (battlestart && !inTurn) {
      inTurn = true;
      attackMeme.confirm(defendMeme);
      if (defendMeme.hp <= 0) {
        defendMeme.concede;
      }
      defendMeme.confirm(attackMeme);
      if (attackMeme.hp <= 0) {
        attackMeme.concede;
      }
      //maybe put in an animation if we have time, set timeout so there is some sort of dynamics
      inTurn = false;
    }
  });
});
