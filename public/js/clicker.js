$(document).ready(function() {
  //on page load, get the id so we can assign it to all the nav bars
  var id;
  var currentPoints;
  getId();

  function getId() {
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function (user) {
      currentPoints = user[0].points;
      id = user[0].id;
      console.log(user[0].id);
      $(".purchased").attr("href", "/purchased/" + user[0].id);
      $(".home").attr("href", "/home/" + user[0].id);
      $("#meme-points").text(user[0].points);
      $(".more-points").attr("href", "/more-points/" + user[0].id);
    });
  }

  $("#get-points").on("click", function () {
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
    }).then(function () {
      getId();
    });
  });
});
