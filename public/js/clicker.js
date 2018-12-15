$(document).ready(function () {
  //loads data for the page to render all data
  renderPageData();

  //everytime the user click the get points button, this executes
  $("#get-points").on("click", function () {
    //calls the function to increase points for the current user
    increaseUserPoints();
  });

  $(".click-upgrade").on("click", function () {
    //stores the button clicked in an object and passses it to function so it can be referenced
    var currentClickedButton = $(this);
    //executes the buying process with validation
    buyClickerUpgrade(currentClickedButton);
  });

  function renderPageData() {
    //ajax call to grab current user data
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function (user) {
      //stores current user points in variable
      var currentPoints = user[0].points;
      //stores current user click power in variable
      currentClickPower = user[0].clickPower;
      //stores the users current tokens per click
      var tokensPerClick = user[0].tokensPerClick;
      //sets the text for how much money a user has
      $("#meme-points").text(currentPoints);
      //sets text for the users click power on the html page
      $("#tokensPerClick").html('<i class="fas fa-coins mining-tokens"></i> <span class="mining-text">per click</span> : ' + '<span class="mining-points">' + tokensPerClick + '</span>');
      //validation for the click buttons
      checkButtons(currentClickPower);
    });
  }

  function checkButtons(userClickPower) {
    //this checks all the buttons and makes sure to turn off buttons when user is a certain click level
    //first we are going to do an ajax call to get the list of purchased upgrades
    $.ajax("/upgrade-click", {
      type: "GET"
    }).then(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (
          data[i].clickPower ==
          $(`#${data[i].clickPower}`).attr("data-clickPower")
        ) {
          $(`#${data[i].clickPower}`).css("background", "gray");
          $(`#${data[i].clickPower}`).css("border-style", "none");
          $(`#${data[i].clickPower}`).attr("disabled", "disabled");
        }
      }
    });
  }

  function buyClickerUpgrade(currentClickedButton) {
    var currentId;
    //get current user points
    $.ajax("/api/get-current-user-points", {
      type: "GET"
    }).then(function (data) {
      currentId = data[0].id;
      //I parse variables as floats to prevent string concatination of numbers
      //holds current users points
      var currentUserPoints = parseFloat(data[0].points);
      //holds the points to subtract based off the button clicked
      var subtractPoints = parseFloat(currentClickedButton.attr("data-cost"));
      //holds users current click power, it will be increased by one later
      var increaseClickPower = parseInt(data[0].clickPower);
      //holds users current tokens per click
      var currentTokensPerClick = parseFloat(data[0].tokensPerClick);
      //its later, increases the click power
      increaseClickPower++;
      //if user has less money than they can afford
      if (currentUserPoints - subtractPoints < 0) {
        alert("Insufficent Meme Tokens");
      }
      //if user has enough money
      else {
        //subtract userpoints from there purchase
        var temp = currentUserPoints - subtractPoints;
        //increases users click power
        var upgradedTokensPerClick = $(currentClickedButton).attr(
          "data-moreperclick"
        );
        //adds the new amount per click for the user to see
        currentTokensPerClick += parseFloat(upgradedTokensPerClick);
        //an object that holds all the new updated info
        var upgradeClickPower = {
          clickPower: increaseClickPower,
          points: temp,
          tokensPerClick: currentTokensPerClick
        };
        //send over the new data
        $.ajax("/upgrade-click", {
          type: "PUT",
          data: upgradeClickPower
        }).then(function (data) {
          //now we are going to do an association so that click belongs to the user
          var purchasedPointUpgrade = {
            clickPower: currentClickedButton.attr("data-clickPower"),
            morePerClick: currentClickedButton.attr("data-morePerClick"),
            cost: currentClickedButton.attr("data-cost"),
            UserId: currentId
          };
          $.ajax("/upgrade-click", {
            type: "POST",
            data: purchasedPointUpgrade
          }).then(function (data) {
            renderPageData();
          });
        });
      }
    });
  }
  function increaseUserPoints() {
    //holds amount of points to be added on based on users click power
    var morePoints = 0.0;
    var currentPoints = 0.0;
    var currentTokensPerClick;
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function (data) {
      currentPoints = parseFloat(data[0].points);
      currentTokensPerClick = parseFloat(data[0].tokensPerClick);
      $.ajax("/upgrade-click", {
        type: "GET"
      }).then(function (data) {
        for (var i = 0; i < data.length; i++) {
          morePoints += parseFloat(data[i].morePerClick);
        }
        //add .01 to more points so the user has their .01 click point from the start
        morePoints += 0.01;
        if (morePoints === 0) {
          morePoints = 0.01;
        }
        //adds points per click to the users current points
        currentPoints += morePoints;
        //store points as an object because that is how the req.body accepts variables
        var points = {
          points: currentPoints
        };
        //ajax call that updates the databases current points
        $.ajax("/api/user/id", {
          type: "put",
          data: points
        }).then(function () {
          //we call this function so we dont have to re render the whole page again to see changed data
          //this function manually sets text
          renderPageData();
        });
      });
    });
  }
});
