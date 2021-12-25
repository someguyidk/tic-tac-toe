const express = require('express');
const app = express();
const path = require('path');
var users = [];
let user,turn;


app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

const server = app.listen(app.get('port'),()=>{
	console.log('server running on port: ', app.get('port'));
});


const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket)=> {
	console.log('new connection!, ', socket.id);
	socket.on('join', (data) => {
		console.log(data);
		user = data.user;
		users.push(user);
		console.log("users: " + users);

	});
	socket.on('created', (data) => {
		console.log(data);
		user = data.user;
		users.push(user);
		console.log("users: " + users);
		
	});
	socket.on('check', ()=> {
		if (users.includes(1) && users.includes(2)) {
			console.log("check ready")
			io.sockets.emit('game');
		}else {
			console.log("check not ready");
		}
	});
	socket.on('update',(data)=> {
		user = data.user;
		board = data.board;
		x = data.x;
		y = data.y;
		turn = data.turn;
		counter = data.counter;
		if (user) {
			io.sockets.emit('update', {board:board, x:x, y:y, turn:turn, counter:counter});
		} else {
			console.log("update event listener not working");
		}
		console.log("current user: " + user + "\n current board: "+ board+"\n current turn: "+ turn);
	});
});


