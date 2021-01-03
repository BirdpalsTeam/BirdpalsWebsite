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

var blueBird = new Image();
blueBird.src = "GameData/Sprites/characters/bird_blue.png";

var hedgeNPC = new Image();
hedgeNPC.src = "GameData/Sprites/characters/hedgehog.png";

var townRoom = new Image();
townRoom.src = "GameData/Sprites/rooms/town.png";

//OH GOD OH HECK THIS IS THE ROOM
var room = new Room(townRoom, 0, 0, 800, 500, 0, 0, 0, 0, 892, 512, 0); //0 in the end cuxz it is type 0. type 0 means room
var objs = new RoomObject(townRoom, 498, 372, 192, 216, 96, 190, 892, 0, 192, 216, 0) //same as above am i right

//players and npcs lets go
var char = new Character(blueBird, 409, 380, 62, 72, 31, 67, 144, 0, 144, 172, 1, "Bird"); //1 before the string cuz it is type 1. type 1 means players, and players have names thats why it has a string, with "Bird" being the player's name
var hedge_npc = new NPC(hedgeNPC, 310, 315, 54, 54, 12, 52, 84, 84, 84, 84, 2, "flines"); //basically the same as above, except the type is 2. type 2 means NPCs

var objectsInScene = [room, char, hedge_npc, objs];

function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  objectsInScene.sort(function (a, b) {
    return a.y - b.y;
  });

  for (let i = 0; i < objectsInScene.length; i++) {
    objectsInScene[i].draw();
  }

  char.main();
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
