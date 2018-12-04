$(document).ready(function() {
  var attackMeme = {};
  var defendMeme = {};
  var battlestart = false;
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
    constructor(name, link, ap, hp, diceVal, boo) {
      this.name = name;
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

    concede() {
      //loss conditions, discuss with team
      //lose points/lose this meme
    }

    win() {
      //win conditions, discuss with team, will add a certain amount of memecoins based on the power lvl of the opponent
      //win exp and cooins of equal amt
      //re-direct to meme page
    }
  }

  $.ajax("/api/user/meme", {
    type: "GET"
  }).then(meme => {
    attackMeme = new Meme(
      meme.name,
      meme.link,
      meme.attack_power,
      meme.health_points,
      meme.dice_value,
      true
    );
  });
});

//ajax call to get the users most recent "meme" from the db and a random second meme of the same level; <<
//both with get a boolean and a name to indicate what position they are(attack, defender)
//
//.then() pass that object through the meme class to create an object that has fucntion attached too it;
//functions on the meme class: attack, concede, win;
//
