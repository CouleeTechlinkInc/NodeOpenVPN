componentToLoadClass = function( params ){
  var self = this;
  $.each( params.auth , function( key ,val ){
    self[key] = val;
  });
}
