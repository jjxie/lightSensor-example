var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var connectedIDArray = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	console.log('a user connected');
	console.log(socket.id);
	connectedIDArray.push(socket.id);
	console.log("Connected array length: " + connectedIDArray.length); 

	// Send message
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		// send to all
		io.emit('chat message', socket.id + " : " + msg);
		// send to others except the sender
		// socket.broadcast.emit('chat message', msg);
	});

	// Send sensor data red
	socket.on('sensor data red', function(sensorData){
		io.emit('sensor data red',  sensorData);
	});

	// Send sensor data green
	socket.on('sensor data green', function(sensorData){
		io.emit('sensor data green',  sensorData);
	});

	// Send sensor data blue
	socket.on('sensor data blue', function(sensorData){
		io.emit('sensor data blue',  sensorData);
	});

	// Online event
	io.emit('online', socket.id);

	// Disconnect	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		console.log(socket.id);
		var index = connectedIDArray.indexOf(socket.id); 
		if(index > -1){	
			connectedIDArray.splice(index, 1);
		}
		console.log("Connected array length: " + connectedIDArray.length); 
		// Offline event
		io.emit('offline', socket.id);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
