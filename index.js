var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Archiver = require('archiver');
var sys = require('sys')
var exec = require('child_process').exec;
var Store = require('ministore')('db');
var Auth = require('./auth.js');
Auth.init( Store );
var openvpnconfig = Store('openvpnconfig');
function run_cmd(cmd, args, cb, end) {
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
        me.stdout = "";
    child.stdout.on('data', function (buffer) { cb(me, buffer) });
    child.stdout.on('end', end);
}

app.get('/configs/:config', function(req, res) {
  var confReq = req.param("config");
  /*res.zip([
    { path: '/client.crt', name: 'easy-rsa/keys/' + confReq + '.crt'  },
    { path: '/client.key', name: 'easy-rsa/keys/' + confReq + '.key'  },
    { path: 'dh2048.pem' , name: 'easy-rsa/keys/dh2048.pem'  }
  ]);*/
  res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': 'attachment; filename=' + confReq + '.zip'
    });

    var archzip = Archiver('zip');

    // Send the file to the page output.
    archzip.pipe(res);

    // Create zip with some files. Two dynamic, one static. Put #2 in a sub folder.
    archzip.append('Some text to go in file 1.', { name: 'client.ovpn' })
        .file('easy-rsa/keys/' + confReq + '.crt', { name: 'client.crt' })
        .file('easy-rsa/keys/' + confReq + '.key', { name: 'client.key' })
        .file('easy-rsa/keys/dh2048.pem', { name: 'dh2048.pem' })
        .finalize();
});

io.on('connection' , function(socket){
  Auth.onConnect( socket );
  socket.on( 'createOpenVPNConfig' , function( data ){
      if( socket.loggedIn === true && socket.username !== '' ){
        var runCommand = new run_cmd(
            './createclient', [ data.clientName ],
            function (me, buffer) { me.stdout += buffer.toString() },
            function () {
              socket.emit("clientCreated" , { "clientName" : data.clientName } );
            }
        );
      }
  });
  socket.on('getOpenVPNConfigs' , function( data ){

  });
});
app.use(express.static(__dirname + '/www' ) );
server.listen( 80 );
