$(document).ready(function () {
  //loads data for the page to render all data
  renderPageData();


  //everytime the user click the get points button, this executes
  $("#get-points").on("click", function () {
    //calls the function to increase points for the current user
    increaseUserPoints();
  })

  $(".click-upgrade").on("click", function () {
    //stores the button clicked in an object and passses it to function so it can be referenced
    var currentClickedButton = $(this);
    //executes the buying process with validation
    buyClickerUpgrade(currentClickedButton);
  })

  function renderPageData() {
    //ajax call to grab current user data
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function (user) {
      //stores current user points in variable
      var currentPoints = user[0].points;
      //stores current user click power in variable
      currentClickPower = user[0].clickPower;
      //sets the text for how much money a user has
      $("#meme-points").text(currentPoints);
      //sets text for the users click power on the html page
      $("#clickPower").text("Click Power: " + currentClickPower);
      //validation for the click buttons
      checkButtons(currentClickPower);
    });
  }


  function checkButtons(userClickPower) {
    //this checks all the buttons and makes sure to turn off buttons when user is a certain click level
    for (var i = 2; i <= 5; i++) {
      if (userClickPower >= $(`button[data-clickPower=${i}]`).data().clickpower) {
        $(`button[data-clickPower=${i}]`).attr('disabled', "disabled");
        $(`button[data-clickPower=${i}]`).css("background", "gray");
      }
    }
  }

  function buyClickerUpgrade(currentClickedButton) {


    //get current user points
    $.ajax("/api/get-current-user-points", {
      type: "GET"
    }).then(function (data) {

      //I parse variables as floats to prevent string concatination of numbers
      var currentUserPoints = parseFloat(data[0].points);
      var subtractPoints = parseFloat(currentClickedButton.attr("data-cost"));

      //if user has less money than they can afford
      if ((currentUserPoints - subtractPoints) < 0) {
        alert("Insufficent Meme Tokens");

      }
      //if user has enough money 
      else {
        //subtract userpoints from there purchase
        var temp = currentUserPoints - subtractPoints;

        //send over the new click power
        var upgradeClickPower = {
          clickPower: currentClickedButton.attr("data-clickPower"),
          points: temp
        };
        $.ajax("/upgrade-click", {
          type: "PUT",
          data: upgradeClickPower
        }).then(function (data) {
          renderPageData();
        })
      }

    })
  }


  function increaseUserPoints() {
    //holds amount of points to be added on based on users click power
    var morePoints = 0.0;

    $.ajax("/api/get-current-power", {
      type: "GET"
    }).then(function (data) {
      var currentClickPower = data[0].clickPower;
      var currentPoints = parseFloat(data[0].points);

      //series of if statments checking current users click power
      //so we can add correct amount of points per click
      if (currentClickPower == 1) {
        morePoints = 0.01;
      }

      if (currentClickPower == 2) {
        morePoints = 0.05;
      }

      if (currentClickPower == 3) {
        morePoints = 0.10;
      }

      if (currentClickPower == 4) {
        morePoints = 1.00;
      }
      if (currentClickPower == 5) {
        morePoints = 2.00;
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
  }
});
