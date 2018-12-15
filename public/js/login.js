$(document).ready(function () {
  // Getting references to our form and inputs
  var loginForm = $("form.login");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function (user) {
        //  console.log(user);
        //if the user that signs in is a manager redirect them to manager page
        if (user.isManager === true) {
          window.location.assign("/manager");
        } else {
          //if they are not a manager redirect them to regular home page
          window.location.assign("/home");
        }

        // If there's an error, log the error
      })
      .catch(function (err) {
        if (err.status == 401) {
          alert("INCORRECT OR UNKNOWN EMAIL/PASSWORD COMBINATION. PLEASE TRY AGAIN OR MAKE A NEW ACCOUNT.");
        }
      });
  }
});
