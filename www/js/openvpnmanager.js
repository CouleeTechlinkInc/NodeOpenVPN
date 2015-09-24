var OpenVPNManager = function(){
  var self = this;
  self.auth = new Auth();
  self.pages = ko.observableArray(
    [
      { "id" : "clients" , "displayName" : "Clients"}
    ]
  )
  self.showWizard = ko.observable(false);
  self.createClientConfig = function(params){
    console.log( params );
  }
}
