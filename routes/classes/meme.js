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
    if (confirmVal >= target.ac) {
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
module.exports = Meme;
