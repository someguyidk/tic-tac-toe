//client-side server, pre-game comm

const socket = io();
let start = document.getElementById('start');
let room = document.getElementById('room-input');
let enter = document.getElementById('enter');
let user = 0; 

start.addEventListener('click',()=> {
  document.getElementById('para').innerHTML = "new room!: " + socket.id;
  user = 1;
  socket.emit('created', {
    id: socket.id,
    user: user,
    room: socket.id,
  });
  document.getElementById('para2').innerHTML = "room joined: " + socket.id;
});

enter.addEventListener('click', () => {
  user = 2;
  socket.emit('join', {
    id: socket.id,
    user: user,
    room: room.value,
  });
  document.getElementById('para2').innerHTML = "room joined: " + room.value;
  socket.emit('check',"checking...");
});

socket.on('game', ()=> {
  console.log("game on!");
  document.getElementById('para3').innerHTML = "GAME ON!";
  init();
  createBoard();
});


//actual game vvvv

let gameCanvas, ctx,XO,x,y,turn;
var game = true;
let counter = 0;

let winCons = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]]
var board =[0,0,0,
			     0,0,0,
			     0,0,0]
const made = []

socket.on('update', (data)=> {
  made.push(data.x,data.y);
  board = data.board;
  counter = data.counter;
  console.log("global board: "+board+"\n" +"global counter: "+data.counter+"\n" +"moves made: "+made);
  counter++;
  turn = counter % 2;
  winCon();
  draw(data.x,data.y,turn,board);

});

class ficha {
	constructor(x,y,turn) {
		this.x = x;
		this.y = y;
		this.XO = turn ==0 ? 'blue':'red';
		console.log("turn inside of ficha: " + turn)
		ctx.fillStyle = this.XO;
		ctx.fillRect(x + 50,y + 50,100,100);
		console.log("succesfully created object!");
		
	}
}

function init() {
	gameCanvas = document.getElementById('canvas');
	gameCanvas.width = 600;
	gameCanvas.height = 600;
	ctx = gameCanvas.getContext('2d');	
}

function draw(x,y,turn, board) {
	let XO1 = new ficha(x,y,turn);

}

function winCon(){
  for (let i = 0; i<8;i++){
  if (board[winCons[i][0]]==board[winCons[i][1]] && board[winCons[i][0]] == board[winCons[i][2]] && board[winCons[i][2]] == board[winCons[i][1]] && board[winCons[i][0]] != 0){ 
    game = false;
    console.log('game over!');
    document.getElementById("demo").innerHTML = "Congrats, we have a winner!";
    break;
} else {
    game = true;
    console.log('game not over!');
    }
  }
}

function mouseClicked(event) {
  if (game == true && counter < 9) {
    var mx = event.clientX;
    var my = event.clientY;
    var rect = gameCanvas.getBoundingClientRect();
    
    if (mx - rect.left < 200) {
      x = 0;
    } else if (mx - rect.left <400) {
      x = 200;
    } else if (mx - rect.left <600) {
      x = 400;
    }
    if (my - rect.top < 200) {
      y = 0;
    } else if (my - rect.top <400) {
      y = 200;
    } else if (my - rect.top <600) {
      y = 400;
    }
    var coords = "X coords: " + mx + ", Y coords: " + my + "\n x: " + x +", y: "+ y;
    document.getElementById("demo").innerHTML = coords;

    console.log('counter: ' + counter);
    console.log('turn: ' + turn);
    console.log('current board: ' + board)
    board[(x/200)+((y/200)*3)] = (counter%2)+1;
    socket.emit('update', {user: user, board: board, turn:turn, x:x, y:y, counter:counter});
  } else {
  
  }
  
}
function createBoard() {
	for (let i = 200; i <600; i += 200) {
		ctx.beginPath();
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
		ctx.stroke();
	}
	for (let i = 200; i <600; i += 200) {
		ctx.beginPath();
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.stroke();
	}
	console.log("board created succesfully");
}

function handleInit(msg){
  console.log(msg);
}
