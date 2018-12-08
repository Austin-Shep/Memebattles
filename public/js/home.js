$(document).ready(function () {
  //calls loadPoints on load
  loadUserData();

  //executes if a meme is bought
  $(".buy").on("click", function () {
    var currentPoints = $("#meme-points").text();
    var cost = $(this).attr("cost");
    console.log(currentPoints);
    if (currentPoints - cost < 0) {
      alert("Insufficent Meme Tokens");
    } else {
      var boughtMeme = {
        name: $(this).attr("name"),
        link: $(this).attr("link"),
        attack_power: $(this).attr("attack"),
        health_points: $(this).attr("health"),
        cost: cost,
        dice_value: $(this).attr("dice"),
        UserId: $(this).attr("UserId")
      };
      console.log(boughtMeme);

      //now that we have all the data, send a post to the database
      $.ajax("/api/user/id", {
        type: "POST",
        data: boughtMeme
      }).then(function (data) {
        var newPoints = {
          points: currentPoints - cost
        };

        $.ajax("/api/user/id", {
          type: "PUT",
          data: newPoints
        }).then(function (data) {
          console.log(data);
          $("#meme-points").text(data.points);
          location.reload();
        });
      });
    }
  });

  function loadUserData() {
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function (user) {
      //this needs to be an array because that is what is returned
      console.log(user[0].id);
      //gives data to the points section
      $("#meme-points").text(user[0].points);

      //give foreign key to all buttons
      $(".buy").attr("UserId", user[0].id);

      //put the id in the purchased nav
    });
  }
});
