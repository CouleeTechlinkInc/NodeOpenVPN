componentToLoadClass = function( params ){
  var self = this;
  self.ovm = params.ovm;
  self.socket = params.socket;
  self.subpage = ko.observable('clientList');
  self.allClients = ko.observableArray([]);
  self.socket.on("allClients" , function(data){
    self.allClients( data );
  });
  self.socket.emit("getOpenVPNConfigs");
  runOnLogin.push( function(){
    self.socket.emit("getOpenVPNConfigs");
  });
  self.showWizard = ko.observable(false);
  self.createClientConfig = function(params){
    console.log( params );
    socket.emit("createOpenVPNConfig" , params );
  }
}
