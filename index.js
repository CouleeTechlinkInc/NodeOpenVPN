var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Archiver = require('archiver');
var sys = require('sys')
var exec = require('child_process').exec;
var Store = require('ministore')('db');
var Auth = require('./auth.js');
var crypto = require('crypto');
var fs = require('fs');
var sha256 = function( data ){
    return crypto.createHash('sha256').update(data).digest('hex');
}
Auth.init( Store );
var configStore = Store( "config");
var saltySalt = configStore.get("salt");

if( saltySalt === undefined ){
  var saltRounds = 30;
  var randNum = 0;
  var saltRound = 1;
  console.log("Salt not found, Generating one, Please wait a few min");
  while( saltRounds >= saltRound ){
    saltySalt = String( Math.random(1 , 9999 ) ) + String( Math.random(1,9999) ) + String( Math.random(1,9999) ) + String( Math.random(1,9999) ) + String( Math.random(1 , 9999 ) ) + String( Math.random(1,9999) );
    var randNum =  Math.round( ( Math.random( ) * 100000 ) + 150 );
    while( randNum > 0 ){
      saltySalt = sha256( saltySalt );
      randNum--;
    }
    console.log("Round " + saltRound +"  Done");
    saltRound++;
  }
  configStore.set("salt" , saltySalt );
  console.log("Salt Generated" );
}

var openvpnconfig = Store('openvpnconfig');
function getAllOpenVPNConfigs(cb){
  var path = 'easy-rsa/keys';
  var allConfigs = [];
  fs.readdir(path, function(err, items) {
    items.forEach( function(item ){
      var tmpsplt = item.split(".");
        if( tmpsplt.length == 2 && ["crt" , "key" ].indexOf( tmpsplt[1] ) !== -1 ){
          if( !allConfigs.hasOwnProperty( tmpsplt[0] ) ){
            allConfigs[tmpsplt[0]] = { "crt" : false , "key" : false };
          }
          allConfigs[tmpsplt[0]][ tmpsplt[1] ] = true;
        }
      });
      var clean = [];
      for( var configName in allConfigs ){
        if( allConfigs[ configName ].crt == true && allConfigs[ configName ].key == true ){
          clean.push( configName );
        }
      }
      cb( clean );
  });
}
function generateOpenVPNConfig( params ){
  var configString = "";
  configString += "client\n";
  configString += "dev tun\n";
  configString += "proto udp\n";
  configString += "remote vpn.timholum.com 1194\n";
  configString += "resolv-retry infinite\n";
  configString += "nobind\n";
  configString += "persist-key\n";
  configString += "persist-tun\n";
  configString += "ca ca.crt\n";
  configString += "cert client.crt\n";
  configString += "key client.key\n";
  configString += "remote-cert-tls server\n";
  configString += "comp-lzo\n";
  configString += "verb 3\n";
  return configString;
}
function run_cmd(cmd, args, cb, end) {
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
        me.stdout = "";
    child.stdout.on('data', function (buffer) { cb(me, buffer) });
    child.stdout.on('end', end);
}

app.get('/configs/:config/:authhash', function(req, res) {
  /*
    Configs links are unique per ip, If your ip changes, the link will be invalid
  */
  var confReq = req.params.config;
  var authhash = req.params.authhash;
  var hashCheck = sha256( req.connection.remoteAddress + confReq + saltySalt );
  if( authhash == hashCheck ){
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': 'attachment; filename=' + confReq + '.zip'
    });
    var archzip = Archiver('zip');
    archzip.pipe(res);
    archzip.append( generateOpenVPNConfig() , { name: 'client.ovpn' })
        .file('easy-rsa/keys/' + confReq + '.crt', { name: 'client.crt' })
        .file('easy-rsa/keys/' + confReq + '.key', { name: 'client.key' })
        .file('easy-rsa/keys/dh2048.pem', { name: 'dh2048.pem' })
        .finalize();
  }
});

io.on('connection' , function(socket){
  Auth.onConnect( socket );

  socket.on('getIp' , function(data){
    socket.emit('myIp' , socket.handshake.address );
  });
  socket.on( 'createOpenVPNConfig' , function( data ){
      if( socket.loggedIn === true && socket.username !== '' ){
        var runCommand = new run_cmd(
            './createclient', [ data.clientName ],
            function (me, buffer) { me.stdout += buffer.toString() },
            function () {
              socket.emit("clientCreated" , { "clientName" : data.clientName , "hash" : sha256( socket.handshake.address + data.clientName + saltySalt ) } );
            }
        );
      }
  });
  socket.on('getOpenVPNConfigs' , function( data ){
    if( socket.loggedIn === true && socket.username !== '' ){
      getAllOpenVPNConfigs(function(configs){
        var goodConfigs = [];
        configs.forEach( function(item){
          goodConfigs.push( { "clientName" : item , "hash" : sha256( socket.handshake.address + item + saltySalt ) } );
        });
        socket.emit('allClients' , goodConfigs );
      });
    }
  });
});
app.use(express.static(__dirname + '/www' ) );
server.listen( 80 );
