$( document ).ready(function() {
    const boxWidth = $('.login-box').width();
    const adjustedWidth = boxWidth-76;
    $('.login-box').width(adjustedWidth);

    $('#divider-svg').attr("width", boxWidth);

    $('#line1').attr("x2", boxWidth/2-75)

    $('#line2').attr("x1", boxWidth/2+75)
            .attr("x2", boxWidth);

    $('#divider-svg text').attr("x", boxWidth/2);

    $('#register span').on("click", function() {
        window.location.replace("signup.html");
    })
});


$('#login-button').click(function(event) {
  event.preventDefault();
  $('#login-form').trigger('submit');
});

$('#login-form').on('submit', function(event) {
  console.log('Logging in...');
  event.preventDefault();
  var email = $('#login-email').val();
  var password = $('#login-password').val();
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    console.log('Successfully signed in!');
    window.location.replace("preferenceForm.html");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
  return false;
});
