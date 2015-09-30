var OpenVPNManager = function(){
  var self = this;
  self.auth = new Auth();
  self.pages = ko.observableArray(
    [
      { "id" : "clients" , "displayName" : "Clients"}
    ]
  )
  self.showWizard = ko.observable(false);
  socket.on("myIp" , function( data ){console.log( data ); });
  socket.on("clientCreated" , function(data){
    console.log("clientCreated");
    console.log( data );
  });
  self.createClientConfig = function(params){
    console.log( params );
    socket.emit("createOpenVPNConfig" , params );
  }
}
