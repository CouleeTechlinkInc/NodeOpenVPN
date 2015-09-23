var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var sys = require('sys')
var exec = require('child_process').exec;
var Auth = require('./auth.js');
Auth.init( Store );

app.use(express.static(__dirname + '/www' ) );
server.listen( 80 );
