ko.components.register('login', {
  template : { url : "components/login.html" },
  viewModel : { url : "components/login.js"}
});
var templateFromUrlLoader = {
    loadTemplate: function(name, config, callback) {
        if (config.url) {
            $.get(config.url, function(markupString) {
                ko.components.defaultLoader.loadTemplate(name, markupString, callback);
            });
        } else {
            // Unrecognized config format. Let another loader handle it.
            callback(null);
        }
    }
};
var viewModelCustomLoader = {
    loadViewModel: function(name, config, callback) {
        if (config.url) {
          $.get(config.url, function(fileStr) {
            var componentToLoadClass = "";
            eval(fileStr);
            if( componentToLoadClass !== "" ) {
              ko.components.defaultLoader.loadViewModel(name, componentToLoadClass , callback);
            } else {
              callback(null);
            }
          });

        } else {
            // Unrecognized config format. Let another loader handle it.
            callback(null);
        }
    }
};

// Register it
ko.components.loaders.unshift(viewModelCustomLoader);
// Register it
ko.components.loaders.unshift(templateFromUrlLoader);
var OpenVPNManager = function(){
  var self = this;
  self.auth = new Auth();
}
