var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var cam = new Camera(0, 0);

var blueBird = new Image();
blueBird.src = "GameData/Sprites/characters/bird_blue.png";

var hedgeNPC = new Image();
hedgeNPC.src = "GameData/Sprites/characters/hedgehog.png";
var hedge_npc = new NPC(
  hedgeNPC,
  310,
  315,
  54,
  54,
  0,
  12,
  52,
  84,
  84,
  84,
  84,
  2,
  "flines",
  ""
); //STRING AFTER "flines" CUZ NPC MESSAGE

var townRoom = new Image();
townRoom.src = "GameData/Sprites/rooms/town.png";
var objs = new RoomObject(
  townRoom,
  498,
  372,
  192,
  216,
  0,
  96,
  190,
  1655,
  0,
  192,
  216,
  0
); //Cake
var town = new Room(townRoom, 0, 0, 800, 500, 0, 0, 0, 0, 0, 892, 512, 0); //room bg
var townFG = new RoomObject(
  townRoom,
  0,
  500,
  800,
  500,
  0,
  0,
  500,
  892,
  0,
  763,
  438,
  0
); //room fg
var townObjects = [hedge_npc, objs, townFG];

var domeRoom = new Image();
domeRoom.src = "GameData/Sprites/rooms/dome.png";
var dome = new Room(domeRoom, 0, 0, 800, 500, 0, 0, 0, 0, 0, 579, 365, 0);
var domeObjects = [];

var forestRoom = new Image();
forestRoom.src = "GameData/Sprites/rooms/forest.png";
var forest = new Room(
  forestRoom,
  0,
  0,
  3200,
  1000,
  0,
  0,
  0,
  0,
  0,
  3052,
  876,
  0
);
var forestFG = new Room(
  forestRoom,
  0,
  876,
  3200,
  1000,
  0,
  0,
  876,
  3052,
  0,
  3052,
  876,
  0
);
var forestSS = new Room(
  forestRoom,
  0,
  0,
  3200,
  1000,
  0,
  0,
  0,
  6104,
  0,
  3052,
  876,
  0
);
var forestObjects = [forestSS, forestFG];

//OH GOD OH HECK THIS IS THE ROOM
var room = town;
// ^ This is the room that the player is currently in

//players and npcs lets go
var char = new Character(
  blueBird,
  409,
  380,
  62,
  72,
  0,
  31,
  67,
  144,
  0,
  144,
  172,
  1,
  "Bird",
  ""
); //IT HAS AN EMPTY STRING IN THE END FOR THE CHAT SYSTEM OK THGANKS

var objectsInScene = [char];

function changeRoom(
  newRoom,
  objects,
  playerPosX,
  playerPosY,
  cameraX,
  cameraY
) {
  cam = new Camera(cameraX, cameraY);

  room = newRoom;

  char.x = playerPosX;
  char.destX = playerPosX;
  char.y = playerPosY;
  char.destY = playerPosY;

  objectsInScene = [char, room];

  if (objects != undefined || objects != []) {
    objectsInScene = objectsInScene.concat(objects);
  }

  for (let i = 0; i < objectsInScene.length; i++) {
    if (objectsInScene[i] != undefined) {
      objectsInScene[i].x += cam.x;
      objectsInScene[i].y += cam.y;
    }
  }

  char.destX += cam.x;
  char.destY += cam.y;
}

changeRoom(town, townObjects, 409, 380, 0, 0);

function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  objectsInScene.sort(function (a, b) {
    return a.y - b.y;
  });

  for (let i = 0; i < objectsInScene.length; i++) {
    if (objectsInScene[i] != undefined) {
      objectsInScene[i].draw();
    }
  }

  char.main();

  cameraFollowPlayer();
}

function cameraFollowPlayer() {
  if (
    char.x > room.x + canvas.width / 2 &&
    char.x < room.x + room.width - canvas.width / 2 &&
    char.isMoving
  ) {
    cam.followX();
  }
  if (
    char.y > room.y + canvas.height / 2 &&
    char.y < room.y + room.height - canvas.height / 2 &&
    char.isMoving
  ) {
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

function printObjectsInScene() {
  console.log(objectsInScene);
}
