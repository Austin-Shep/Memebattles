$(document).ready(function () {
  $("#form")
    .validator()
    .on("submit", function (e) {
      if (e.isDefaultPrevented()) {
        // handle the invalid form...
      } else {
        //takes care of adding the new button to database
        e.preventDefault();
        //get the current click Power
        $.ajax("/api/manager-click-check", {
          type: "GET"
        }).then(function (data) {
          //variable that is going to hold the last button entered click power
          var newButtonClickPower;
          //validation for when the manager adds there first button to the database
          if (data.length === 0) {
            //set to 1 because this number is incremented 1 more time, bringing it to 2 for purchasing purposes
            newButtonClickPower = 1;
            //call function and pass over the value
            pushNewButton(newButtonClickPower);
          } else {
            //holds value of the last button entered into the database
            newButtonClickPower = data[0].clickPower;

            pushNewButton(newButtonClickPower);
          }
        });
      }
    });

  function pushNewButton(newButtonClickPower) {
    //this will act as an auto increment for the click power button for purchasing purposes
    newButtonClickPower++;
    //creates an object that holds the new button
    var newButton = {
      clickPower: newButtonClickPower,
      morePerClick: $(".amountIncreasedPerClick")
        .val()
        .trim(),
      cost: $(".costForUpgrade")
        .val()
        .trim()
    };
    //sends the new button object to the database to create the new button for the user to see
    $.ajax("/api/manager-click-check", {
      type: "POST",
      data: newButton
    }).then(function (data) {
      //do like a redirect to a button added
      alert("button added to home page");
      setTimeout(function () {
        location.reload();
      }, 1000);
    });
  }
});
