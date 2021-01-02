var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

class GameObject
{
	constructor(img, x, y, width, height, originX, originY){
		this.img = img;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.originX = originX;
		this.originY = originY;
	}

	draw(){
		ctx.drawImage(this.img, this.x - this.originX, this.y - this.originY, this.width, this.height);
	}
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

class Music
{
	constructor(src, duration, loops){
		this.src = src;
		this.duration = duration;
		this.music = new sound(src);
	}

	playMusic(){
		this.music.play();
	}
}

class Room extends GameObject
{

	constructor(img, x, y, width, height, originX, originY, src, duration)
	{
		super(img, x, y, width, height, originX, originY);

		this.music = new Music("GameData/Audio/Music/Cidade dos Ursos.mp3", 40, false);
		this.music.playMusic();
	}
	
}

class Character extends GameObject
{
	
	constructor(img, x, y, width, height, originX, originY, username, isLocalPlayer, id)
	{
		super(img, x, y, width, height, originX, originY);

		this.velX = 0;
		this.velY = 0;

		this.destX = x;
		this.destY = y;

		this.username = username;
		this.isLocalPlayer = isLocalPlayer;
		this.id = id;

		this.clickPosX = this.x + this.width/2;
		this.clickPosY = this.y + this.height - 5;

	}

	main(){

		if((this.x >= this.destX-1 && this.x <= this.destX+1 && this.y >= this.destY-1 && this.y <= this.destY+1) == false){
			this.x += this.velX;
			this.y += this.velY;
		}
	}

	move(destX, destY){
		this.destX = destX;
		this.destY = destY;
		
		let dx = destX - this.x;
		let dy = destY - this.y;

		let angle = Math.atan2(dy, dx);

		let speed = 0.75;
		this.velX = Math.cos(angle) * speed;
		this.velY = Math.sin(angle) * speed;
	}

}

var charImg = new Image();
charImg.src = "GameData/Sprites/bluebird.png";

var roomImg = new Image();
roomImg.src = "GameData/Sprites/room1.png"

var room = new Room(roomImg, 0, 0, canvas.width, canvas.height, 0, 0);
var char = new Character(charImg, 40, 40, 62, 72, 31, 67, "Bird", true, myId);

var dummy = new GameObject(charImg, 100, 100, 40, 40, 20, 20);

var objectsInScene = [room, char, dummy];
var playersInScene = [char];

function main(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	objectsInScene.sort(function(a, b){return a.y - b.y});

	for(let i = 0; i < objectsInScene.length; i++){
		objectsInScene[i].draw();
	}
	
	for(let i = 0; i < playersInScene.length; i++){
		playersInScene[i].main();
	}

}

function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();

	char.move(e.clientX - rect.left, e.clientY - rect.top);

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  canvas.addEventListener('click', function(e) {
    let mousePos = getMousePos(canvas, e);
    console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);

	socket.emit('move', {
		x: char.x,
		y: char.y,
		destX: mousePos.x,
		destY: mousePos.y,
		id: char.id
	});

  }, false);

setInterval(main, 5);

// Socket.io stuff

socket.on('newPlayer', function(data){
	if(myId != data.id){
		objectsInScene.push(new Character(charImg, 40, 40, 62, 72, 31, 67, "bird", false, data.id));
		playersInScene.push(new Character(charImg, 40, 40, 62, 72, 31, 67, "bird", false, data.id));
		console.log("new player");
	}
});

socket.on('currentPlayers', function(data){
	let playerConverterArray = [];

	for(let i = 0; i < data.length; i++){
		playerConverterArray.push(new Character(charImg, data[i].x, data[i].y, 62, 72, 31, 67, "bird", false, data[i].id))
		playerConverterArray[i].destX = data[i].destX;
		playerConverterArray[i].destY = data[i].destY;
	}

	objectsInScene = objectsInScene.concat(playerConverterArray);
    playersInScene = playersInScene.concat(playerConverterArray);
    console.log("players gotten");
});

socket.on('move', function(data){
	console.log('detected movement');
	for(let i = 0; i < playersInScene.length; i++){
		if(playersInScene[i].id == data.id){
			if(playersInScene[i].id != char.id){
				playersInScene[i].destX = data.destX;
                playersInScene[i].destY = data.destY;
            }
	    }
	}
});