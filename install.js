/*if( user.hasOwnProperty(user.username) && user.hasOwnProperty(user.hash)){
    var u = Users.get(user.username);
    if( u === undefined){
        user.challange = '';
        self.Users.set(user.username , user );
        self.updateChallange(user.username);
    }
}*/
var prompt = require('prompt');

  //
  // Start the prompt
  //
  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  prompt.get(['username', 'email'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
  });
