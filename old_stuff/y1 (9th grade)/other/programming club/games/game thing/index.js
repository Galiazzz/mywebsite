var canvas = document.getElementById("gameArea");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var player = new player(100, 100, "black");
var domove = false;
var directionMain = null;


function LoadStuff() {
    for (i = 0; i < blocks.length; i++) {
        ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
    }
    setInterval(function () { UpdateMain(); }, 10, true);
    setInterval(function () { if (domove) { player.move(directionMain); } }, 10, true);
}

function UpdateMain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    for(i = 0; i < blocks.length; i++){
        blocks[i].update();
    }
}

function player(x, y, color) {
    this.x = x;
    this.y = y;
    this.gspeed = 0;
    this.volocityX = 0;
    this.color = color;
    this.dograv = true;
    this.jumpAmount = 1;
    this.hasCompleated = false;
    this.isDead = false;
    this.move = function (direction) {
        switch (direction) {
            case "up":
                if (this.jumpAmount > 0) {
                    this.gspeed = -6;
                    this.jumpAmount--;
                }
                break;
            case "down":
                this.gspeed += 1;
                break;
            case "left":
                this.volocityX = -3;
                break;
            case "right":
                this.volocityX = 3;
                break;
            default: break;
        }
    }
    this.update = function () {
        for (i = 0; i < blocks.length; i++) {
            if (this.y > blocks[i].y - 15 && this.y < blocks[i].y + blocks[i].height && this.x < blocks[i].x + blocks[i].width && this.x > blocks[i].x - 14) {
                if (this.y < 100 && !this.hasCompleated) {
                    this.hasCompleated = true;
                    if (window.confirm("You Win! \n\n do you want to play again?")) {
                        console.log("hi");
                        this.x = 100;
                        this.y = 100;
                        this.hasCompleated = false;
                    }

                }

                if (this.y < blocks[i].y) {
                    this.y = blocks[i].y - 15;

                    if (this.jumpAmount == 0) {
                        this.jumpAmount = 1;
                    }
                    if(blocks[i].direction == "right"){
                        this.x += 1;
                    }
                    if(blocks[i].direction == "left"){
                        this.x -= 1;
                    }
                }
                else if (this.y > blocks[i].y) {
                    this.y = blocks[i].y + blocks[i].height;
                    this.gspeed = 0;

                }

                if (this.x < blocks[i].x) {
                    this.x = blocks[i].x - 15;
                    this.volocityX /= -2;
                }
                else if (this.x > blocks[i].x + blocks[i].width - 15) {
                    this.x = blocks[i].x + blocks[i].width;
                    this.volocityX /= -2;
                }


                if (this.gspeed > 0) {
                    this.gspeed = 0;
                }

                this.y += this.gspeed;
            }
            ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
        }

        this.x += this.volocityX;
        if (this.volocityX.toFixed(3) > 0) {
            this.volocityX -= 0.09;
        }
        else if (this.volocityX.toFixed(3) < -0) {
            this.volocityX += 0.09;
        }
        if (this.dograv) {
            if (this.y < canvas.height - 15) {
                this.gspeed += 0.098;
                this.y += this.gspeed;
            }
            else {
                if (this.jumpAmount == 0) {
                    this.jumpAmount = 1;
                }

                this.y = canvas.height - 15;
                if (this.gspeed > 0) {
                    this.gspeed = 0;
                }

                this.y += this.gspeed;
            }
        }
        ctx.fillRect(this.x, this.y, 15, 15);
    }
}

//var blocks = [new Block(200, canvas.height - 20, 100, 20), new Block(400, canvas.height - 100, 100, 20), new Block(500, canvas.height - 300, 100, 20), new Block(700, canvas.height - 400, 100, 20)];

let blocks = [];

for (var i = 0; i < 12; i++) {
    blocks.push(new Block((100 * i) + (Math.floor(Math.random() * 30) - 10), (canvas.height - 50 * i - 20) + (Math.floor(Math.random() * 80) - 40), 100, 20, Math.floor(Math.random() * 300) - 100));
}

function Block(x, y, width, height, rightBound) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = "right";
    this.update = function () {
        if(this.direction == "right"){
            this.x += 1;
            if(this.x > x + rightBound){
                this.direction = "left";
            }
        }
        else{
            this.x -= 1;
            if(this.x < x){
                this.direction = "right"
            }
        }
    }
}

document.addEventListener("keydown", function (e) {
    domove = true;
    switch (e.key) {
        case "ArrowUp" || "w":
            directionMain = "up"
            break;
        case "ArrowDown" || "s":
            directionMain = "down";
            break;
        case "ArrowRight" || "d":
            directionMain = "right"
            break;
        case "ArrowLeft" || "a":
            directionMain = "left";
            break;
        default: break;
    }
}, true);

document.addEventListener("keyup", function (e) {
    domove = false;
    directionMain = null;
}, true);
