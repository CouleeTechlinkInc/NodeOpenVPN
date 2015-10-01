var runOnLogin = [];
ko.components.register('login', {
  template : { url : "components/login.html" },
  viewModel : { url : "components/login.js"}
});
ko.components.register('wizard', {
  template : { url : "components/wizard.html" },
  viewModel : { url : "components/wizard.js"}
});
ko.components.register('pageClients', {
  template : { url : "components/clients.html" },
  viewModel : { url : "components/clients.js"}
});
var componentLoader = {
    loadTemplate: function(name, config, callback) {
        if (config.url) {
            $.get(config.url, function(markupString) {
                ko.components.defaultLoader.loadTemplate(name, markupString, callback);
            });
        } else {
            callback(null);
        }
    },
    loadViewModel: function(name, config, callback) {
        if (config.url) {
          $.get(config.url, function(fileStr) {
            var componentToLoadClass = function(){};
            eval(fileStr);
            if( typeof componentToLoadClass == "function" ) {
              ko.components.defaultLoader.loadViewModel(name, componentToLoadClass , callback);
            } else {
              callback(null);
            }
          });

        } else {
            callback(null);
        }
    }
};
ko.components.loaders.unshift(componentLoader);
