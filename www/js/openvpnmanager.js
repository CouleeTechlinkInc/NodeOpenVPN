var OpenVPNManager = function(){
  var self = this;
  self.auth = new Auth();
  self.socket = socket;
  self.pages = ko.observableArray(
    [
      { "id" : "clients" , "displayName" : "Clients" , "componentName" : "pageClients" }
    ]
  );
  self.page = ko.observable('clients');
  self.componentToUse = ko.computed( function(){
    var component = ko.utils.arrayFirst(self.pages() , function(page){
      return page.id == self.page();
    });
    if( component ){
      return component.componentName;
    } else {
      return "pageClients";
    }
  });
  self.showWizard = ko.observable(false);

  self.createClientConfig = function(params){
    socket.emit("createOpenVPNConfig" , params );
  }
}
