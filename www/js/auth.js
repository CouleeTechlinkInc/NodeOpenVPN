var Auth = function(){
  var self = this;
  self.baseHash = ko.observable('');
  self.username = ko.observable('');
  self.password = ko.observable('');
  self.displayName = ko.observable('');
  self.loggedIn = ko.observable(false);
  self.loggedIn.subscribe( function( val ){
    if( val ){
      runOnLogin.forEach( function( rol ){
        if( typeof rol == "function" ){
          rol();
        }
      })
    }
  })
  self.login = function(){
      self.baseHash( CryptoJS.SHA256(  self.username() + '' +  self.password()  ).toString() );
      self.password(''); // Clear the password it is no loner needed
      socket.emit('checkAuth' , self.username() );
  }
  self.sendLogin = function( challange ){
    //Hash this with the challenge to create a token that is unique to prevent playback attacks
    var authHash = CryptoJS.SHA256(  self.baseHash() + '' + challange ).toString();
    socket.emit( 'verifyAuth' , { hash : authHash , username : self.username() } );
  }
  self.onEnter = function( e ){
    if (e.keyCode == 13) {
        self.login();
    }
  }
  socket.on('challangeAuth' , function( challange ){
      self.sendLogin(challange);
  });
  socket.on('loginSuccessful' , function(userInfo){
      self.displayName(userInfo.displayName);
      self.loggedIn(true);
  });
}
