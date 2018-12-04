$(document).ready(function() {
  //on page load, get the id so we can assign it to all the nav bars
  var id;
  var currentPoints;
  getId();

  function getId() {
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function(user) {
      currentPoints = user[0].points;
      id = user[0].id;
      console.log(user[0].id);

      $("#meme-points").text(user[0].points);
    });
  }

  $("#get-points").on("click", function() {
    var morePoints = 0.01;
    morePoints = parseFloat(morePoints);
    currentPoints = parseFloat(currentPoints);
    currentPoints += morePoints;

    var points = {
      points: currentPoints
    };

    $.ajax("/api/user/id", {
      type: "put",
      data: points
    }).then(function() {
      getId();
    });
  });
  //code below here is for the buttons for increasing click

  $("#500").on("click", function() {
    $(this).css("display", "none");
  });
  $("#1000").on("click", function() {
    $(this).css("display", "none");
  });
  $("#2000").on("click", function() {
    $(this).css("display", "none");
  });
  $("#3000").on("click", function() {
    $(this).css("display", "none");
  });
});
