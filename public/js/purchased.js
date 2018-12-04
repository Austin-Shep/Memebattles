$(document).ready(function() {
  console.log("test");

  //on page load, get the id so we can assign it to all the nav bars
  getId();

  function getId() {
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function(user) {
      console.log(user[0].id);

      $("#meme-points").text(user[0].points);
    });
  }
});
