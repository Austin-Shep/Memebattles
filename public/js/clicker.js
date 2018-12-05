$(document).ready(function () {
  //on page load, get the id so we can assign it to all the nav bars
  var id;
  var currentPoints;
  var currentClickPower;
  getId();

  function getId() {
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function (user) {
      currentPoints = user[0].points;
      currentClickPower = user[0].clickPower;
      id = user[0].id;


      $("#meme-points").text(user[0].points);
      $("#clickPower").text("Click Power: " + user[0].clickPower);

      checkButtons(user[0].clickPower);
      //validation for the click buttons
    });
  }
  //everytime the user click the get points button, this executes
  $("#get-points").on("click", function () {
    var morePoints;

    $.ajax("/api/get-current-power", {
      type: "GET"
    }).then(function (data) {
      console.log("/n/n/n/n");
      console.log("current power test");
      console.log(data);
      if (data[0].clickPower == 1) {
        morePoints = 0.01;
      }

      if (data[0].clickPower == 2) {
        morePoints = 0.05;
      }

      if (data[0].clickPower == 3) {
        morePoints = 0.10;
      }

      if (data[0].clickPower == 4) {
        morePoints = 1.00;
      }
      if (data[0].clickPower == 5) {
        morePoints = 2.00;
      }

      morePoints = parseFloat(morePoints);
      currentPoints = parseFloat(currentPoints);
      currentPoints += morePoints;

      var points = {
        points: currentPoints
      };

      $.ajax("/api/user/id", {
        type: "put",
        data: points
      }).then(function () {
        getId();
      });
    });
  })

  //code below here is for the buttons for increasing click

  $(".click-upgrade").on("click", function () {

    //get current user points
    $.ajax("/api/get-current-user-points", {
      type: "GET"
    }).then(function (data) {
      var currentUserPoints = parseFloat(data[0].points);
      var subtractPoints = parseFloat($(this).attr("data-cost"));
      console.log("test");






      var upgradeClickPower = {
        clickPower: $(this).attr("data-clickPower")
      };

      $.ajax("/upgrade-click", {
        type: "PUT",
        data: upgradeClickPower
      }).then(function (data) {
        getId();
      })

    })

  });

  function checkButtons(userClickPower) {
    for (var i = 2; i <= 5; i++) {
      if (userClickPower >= $(`button[data-clickPower=${i}]`).data().clickpower) {
        $(`button[data-clickPower=${i}]`).attr('disabled', "disabled");
        $(`button[data-clickPower=${i}]`).css("background", "gray");
      }
    }
  }
});
