componentToLoadClass = function( params ){
  var self = this;
  self.show = params.show;
  self.name = ko.observable(params.name || "Wizard");
  self.questions = ko.observableArray([]);
  self.currentPage = ko.computed( function(){
    return self.questions();
  })
  var classQuestion = function( data ){
    var me = this; //Using me because it is in the class to load
    me.name = ko.observable('');
    me.value = ko.observable('');
    me.description = ko.observable('');
    me.keyname = ko.observable('');
    switch( typeof data ){
      case "object":
        me.name( data.name || '' );
        me.value( data.value || '' );
        me.description( data.description || '' );
        me.keyname( data.keyname || data.name );
      break;
      default:
        me.name(data);
        me.keyname(data);
      break;
    }
  }
  $.each(params.questions , function( key , val ){
    self.questions.push( new classQuestion( val ) );
  });
  self.submit = function(){
    var data = {};
    $.each( self.questions() , function(key,val){
      data[val.keyname()] = val.value();
    });
    params.complete(data);
    self.show( false );
  }
}
