var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(2984, function(){
	console.log('listening to requests on port 2984')
});

// Static files
app.use(express.static('public'));

// Player setup
class PlayerTracker{
	constructor(id, x, y, destX, destY){
		this.id = id;
		this.x = x;
		this.y = y;
		this.destX = destX;
		this.destY = destY;
	}
}

var players = [];

// Socket 
var io = socket(server);

io.on('connection', function(socket){

	console.log('user connected', socket.id);
	
	io.to(socket.id).emit('yourId', socket.id);
	
	io.to(socket.id).emit('currentPlayers', players);
	
	players.push(new PlayerTracker(socket.id, 40, 40, 40, 40));

	io.sockets.emit('newPlayer', players[players.length - 1]);

	socket.on('disconnect', function(){
		console.log('user disconnected', socket.id);
	});

	socket.on('move', function(data){
		io.sockets.emit('move', data);
	});

	socket.on('chat', function(data){
		io.sockets.emit('chat', data);
	});

});