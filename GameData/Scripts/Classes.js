class GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name,
    message
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
    this.message = message;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(this.img, this.sourceX, this.sourceY, this.sourceW, this.sourceH, this.x - this.originX, this.y - this.originY, this.width, this.height);
    ctx.restore();

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
      
      if(this.message.length > 0){
        bubble_image.draw();
        ctx.fillText(this.message, this.x - ctx.measureText(this.message).width/2, this.y - this.height+18);
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
    rotation,
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
      rotation,
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
    rotation,
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
      rotation,
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

class HUD extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
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
      rotation,
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
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name,
    message
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      rotation,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type,
      name,
      message
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
   chatMessage(msg){
     this.message = msg;
   }
  
  setInterval(function() { if(this.message.length > 0) { this.message = " "; } }, 5000);
}

class NPC extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name,
    message
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      rotation,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type,
      name,
      message
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
        this.x = char.x + this.x - canvas.width/2;

        for(let i = 0; i < objectsInScene.length; i++){
            objectsInScene[i].x = objectsInScene[i].x + (prevX - this.x);
        }
        char.destX = char.destX + (prevX - this.x);
    }
    followY(){
        let prevY = this.y
        this.y = char.y + this.y - canvas.height/2;

        for(let i = 0; i < objectsInScene.length; i++){
            objectsInScene[i].y = objectsInScene[i].y + (prevY - this.y);
        }
        char.destY = char.destY + (prevY - this.y);
    }
}
