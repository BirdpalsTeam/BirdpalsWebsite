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
    sourceH
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
  }

  draw() {
    ctx.drawImage(
      this.img,
      this.sourceX,
      this.sourceY,
      this.sourceW,
      this.sourceH,
      this.x - this.originX,
      this.y - this.originY,
      this.width,
      this.height
    );
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
    sourceH
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
      sourceH
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
    sourceH
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
      sourceH
    );

    this.velX = 0;
    this.velY = 0;

    this.destX = x;
    this.destY = y;

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

var charImg = new Image();
charImg.src = "GameData/Sprites/bluebird.png";

var roomImg = new Image();
roomImg.src = "GameData/Sprites/room1.png";

var room = new Room(roomImg, 0, 0, 800, 500, 0, 0, 0, 0, 800, 500);
var char = new Character(charImg, 409, 380, 62, 72, 31, 67, 144, 0, 144, 172);

var objectsInScene = [room, char];

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
