$(document).ready(function() {
  var heroId;
  var heroSelected = false;
  var opponentId;
  var opponentSelected = false;

  function assignThisOpponent(id) {
    opponentId = id;
    opponentSelected = true;
  }

  function assignThisHero(id) {
    heroId = id;
    heroSelected = true;
  }

  if (heroSelected && opponentSelected) {
    window.location.replace(`./battle/run/:${heroId}/:${opponentId}`);
  }
});
