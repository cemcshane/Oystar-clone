$( document ).ready(function() {
    const boxWidth = $('.signup-box').width();
    const adjustedWidth = boxWidth-76;
    $('.signup-box').width(adjustedWidth);

    $('#signin span').on("click", function() {
      window.location.replace("login.html");
  })
});

$('#signup-form').on('submit', function(event) {
  console.log('Submitting signup...');
  event.preventDefault();
  var email = $('#signup-email').val();
  var password = $('#signup-password').val();
  var password2 = $('#signup-password-2').val();
  if (password !== password2) {
    console.log('Passwords do not match.');
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((user) => {
    console.log('Successfully signed up!');
    var user = firebase.auth().currentUser;
    userId = user.uid;
    firebase.database().ref('users/' + userId).set({
      email: email,
      realName: $('#signup-name').val(),
    });
    console.log('Added database records.');
    window.location.replace("login.html");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
  return false;
});
