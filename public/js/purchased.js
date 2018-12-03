$(document).ready(function () {
    console.log("test");

    //on page load, get the id so we can assign it to all the nav bars
    getId();

    function getId() {
        $.ajax("/api/user/id", {
            type: "GET"
        }).then(function (user) {
            console.log(user[0].id);
            $(".purchased").attr("href", "/purchased/" + user[0].id);
            $(".home").attr("href", "/home/" + user[0].id);
            $("#meme-points").text(user[0].points);
            $(".more-points").attr("href", "/more-points/" + user[0].id);

        })
    }

})