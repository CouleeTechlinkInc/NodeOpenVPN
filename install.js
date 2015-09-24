/*if( user.hasOwnProperty(user.username) && user.hasOwnProperty(user.hash)){
    var u = Users.get(user.username);
    if( u === undefined){
        user.challange = '';
        self.Users.set(user.username , user );
        self.updateChallange(user.username);
    }
}*/
var prompt = require('prompt');
var schema = {
    properties: {
      username: {
        pattern: /^[a-zA-Z1-9]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      password: {
        hidden: true
      },
      rePassword: {
        hidden: true
      }
    }
  };
  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  prompt.get(schema, function (err, result) {
    console.log('  name: ' + result.username);
    console.log('  password: ' + result.password);
    console.log('  rePassword: ' + result.rePassword);
  });
