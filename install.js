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
      displayName : {
        pattern: /^[a-zA-Z1-9 ]+$/,
        message: 'your Name',
        required: true
      },
      username: {
        pattern: /^[a-zA-Z1-9]+$/,
        message: 'Name must be only letters or numbers',
        required: true
      },
      password: {
        hidden: true
      }
    }
  };
  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  prompt.get(schema, function (err, result) {
    var sha256 = function( string ){
      return crypto.createHash('sha256').update( string ).digest('hex') ;
    }
    var hash = sha256(  result.username + '' +  result.password );
    var crypto = require('crypto');
    var Store = require('ministore')('db');
    var Users = Store('users');
    var challange = sha256( Math.random() + 'x' + Math.random() + new Date().getTime() + "Y" + self.counter + hash + result.displayName );
    var user = { "username" : result.username , "hash" : hash , "challange" : challange , "displayName" : result.displayName }
    Users.set(result.username , user );
    console.log('  name: ' + result.username);

  });
