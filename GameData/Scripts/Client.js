var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

class GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name
  ) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.originX = originX;
    this.originY = originY;

    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.sourceW = sourceW;
    this.sourceH = sourceH;

    this.name = name;
    this.type = type;
  }

  draw() {
    ctx.drawImage(this.img, this.sourceX, this.sourceY, this.sourceW, this.sourceH, this.x - this.originX, this.y - this.originY, this.width, this.height);
    
    if(this.type === 1 || this.type === 2){
      ctx.font = "15px sans-serif";
      
      if(this.type === 2){
        ctx.fillStyle = "red";
        ctx.fillText("(NPC)", this.x - ctx.measureText(this.name).width/2 - 5, this.y + this.height/2.5);
        ctx.fillStyle = "black";
        ctx.fillText(this.name, this.x - ctx.measureText(this.name).width/2 + ctx.measureText("(NPC)").width - 3, this.y + this.height/2.5);
      } else {
        ctx.fillStyle = "black";
        ctx.fillText(this.name, this.x - ctx.measureText(this.name).width/2, this.y + this.height/2.5);
      }
    }
  }
}

class Room extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type,
    );
  }
}

class RoomObject extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type
    );
  }
}

class Character extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type,
      name
    );

    this.velX = 0;
    this.velY = 0;

    this.destX = x;
    this.destY = y;

    this.sourceX = sourceX;
    this.sourceY = sourceY;

    this.clickPosX = this.x + this.width / 2;
    this.clickPosY = this.y + this.height - 5;

    this.isMoving = false;
  }

  main() {
    if (
      (this.x >= this.destX - 1 &&
        this.x <= this.destX + 1 &&
        this.y >= this.destY - 1 &&
        this.y <= this.destY + 1) == false
    ) {
      this.x += this.velX;
      this.y += this.velY;
      this.isMoving = true;
    }else{
        this.isMoving = false;
    }
  }

  move(destX, destY) {
    if (destX < this.x){
      this.sourceX = 0;
      this.sourceY = 172;
    } else if (destX > this.x){
      this.sourceX = 144;
      this.sourceY = 172;
    }

    if (destY < this.y){
      this.sourceX = 0;
      this.sourceY = 0;
    } else if (destY > this.y){
      this.sourceX = 144;
      this.sourceY = 0;
    }

    if(destX < this.x - 15 && destY > this.y){
      this.sourceX = 0;
      this.sourceY = 172;
    } else if(destX > this.x + 15 && destY > this.y){
      this.sourceX = 144;
      this.sourceY = 172;
    }

    this.destX = destX;
    this.destY = destY;

    let dx = destX - this.x;
    let dy = destY - this.y;

    let angle = Math.atan2(dy, dx);

    let speed = 1.25;
    this.velX = Math.cos(angle) * speed;
    this.velY = Math.sin(angle) * speed;
  }
}

class NPC extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type,
      name
    );
  }
}

class Camera{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    followX(){
        let prevX = this.x;
        this.x = char.x - canvas.width/2;

        for(let i = 0; i < objectsInScene.length; i++){
            objectsInScene[i].x = objectsInScene[i].x + (prevX - this.x);
        }
        char.destX = char.x;
    }
    followY(){
        let prevY = this.y
        this.y = char.y - canvas.height/2;

        for(let i = 0; i < objectsInScene.length; i++){
            objectsInScene[i].y = objectsInScene[i].y - (prevY - this.y);
        }
        char.destY = char.y;
    }
}

var cam = new Camera(0, 0);

var blueBird = new Image();
blueBird.src = "GameData/Sprites/characters/bird_blue.png";

var hedgeNPC = new Image();
hedgeNPC.src = "GameData/Sprites/characters/hedgehog.png";
var hedge_npc = new NPC(hedgeNPC, 310, 315, 54, 54, 12, 52, 84, 84, 84, 84, 2, "flines"); //basically the same as above, except the type is 2. type 2 means NPCs

var townRoom = new Image();
townRoom.src = "GameData/Sprites/rooms/town.png";
var objs = new RoomObject(townRoom, 498, 372, 192, 216, 96, 190, 1655, 0, 192, 216, 0); //Cake
var townBG = new Room(townRoom, 0, 0, 800, 500, 0, 0, 0, 0, 892, 512, 0);
var townFG = new RoomObject(townRoom, 0, 0, 800, 500, 0, 0, 0, 0, 763, 438, 0);
var townObjects = [hedge_npc, objs];

var domeRoom = new Image();
domeRoom.src = "GameData/Sprites/rooms/dome.png";
var dome = new Room(domeRoom, 0, 0, 800, 500, 0, 0, 0, 0, 579, 365, 0);
var domeObjects = [];

var forestRoom = new Image();
forestRoom.src = "GameData/Sprites/rooms/forest.png";
var forest = new Room(forestRoom, 0, 0, 3200, 1000, 0, 0, 0, 0, 776, 234);
var forestObjects = [];

//OH GOD OH HECK THIS IS THE ROOM
var room = town;
// ^ This is the room that the player is currently in

//players and npcs lets go
var char = new Character(blueBird, 409, 380, 62, 72, 31, 67, 144, 0, 144, 172, 1, "Bird"); //1 before the string cuz it is type 1. type 1 means players, and players have names thats why it has a string, with "Bird" being the player's name

var objectsInScene = [char];

function changeRoom(newRoom, objects, playerPosX, playerPosY){
    cam = new Camera(0, 0);

    room = newRoom;

    char.x = playerPosX;
    char.destX = playerPosX;
    char.y = playerPosY;
    char.destY = playerPosY;

    objectsInScene = [char, room, townFG];

    if(objects != undefined || objects != []){
        objectsInScene = objectsInScene.concat(objects);
    }

}

changeRoom(town, townObjects, 409, 380);

function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  objectsInScene.sort(function (a, b) {
    return a.y - b.y;
  });

  for (let i = 0; i < objectsInScene.length; i++) {
    if(objectsInScene[i] != undefined){
        objectsInScene[i].draw();
    }
  }

  char.main();

  cameraFollowPlayer();
}

function cameraFollowPlayer(){
    if(char.x > room.x + canvas.width/2 && char.x < room.x + room.width - canvas.width/2 && char.isMoving){
        cam.followX();
    }
    if(char.y > room.y + canvas.height/2 && char.y < room.y + room.height - canvas.height/2 && char.isMoving){
        cam.followY();
    }
}

function getMousePos(canvas, e) {
  let rect = canvas.getBoundingClientRect();

  char.move(e.clientX - rect.left, e.clientY - rect.top);

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
canvas.addEventListener(
  "click",
  function (e) {
    let mousePos = getMousePos(canvas, e);
    console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
  },
  false
);

setInterval(main, 5);

function printObjectsInScene(){
    console.log(objectsInScene);
}
