var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

require('dotenv').config()
app.use(express.static(__dirname + '/build'));  
app.get('/', function(req, res,next) {  
  res.sendFile(__dirname + '/build/index.html');
});

const port = process.env.PORT || 5000;
server.listen(port);  

console.log("Listening!");
