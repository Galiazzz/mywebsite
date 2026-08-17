console.clear();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var player = null;
var boxes = [];
var isDead = false
var score = 0;

var topPipe = document.getElementById("topPipe");
var bottomPipe = document.getElementById("bottomPipe");
var bird = document.getElementById("bird");

function LoadStuff() {
    player = new Player(canvas.width / 4, canvas.height / 2, 25, 25);
    setInterval(function () {
        if (!isDead) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < boxes.length; i++) {
                boxes[i].Update();
            }
            player.Update();
        }

    }, 10);
    setInterval(function () {
        var height = Math.floor(Math.random() * (canvas.height - 200)) + 200;
        boxes.push(new Box(canvas.width, height, true));
        boxes.push(new Box(canvas.width, height - (Math.floor(Math.random() * 100) + 100), false));
    }, 2000);

}

document.addEventListener("keydown", function (e) {
    player.gSpeed = -4;
}, true);

document.addEventListener("mousedown", function(e){
    player.gSpeed = -4;
}, true);

class Box {
    constructor(x, y, isUp) {
        this.x = x;
        this.y = y;
        this.isUp = isUp;
    }
    Update() {
        this.x -= 2;
        if (this.isUp) {
            ctx.drawImage(bottomPipe, this.x, this.y, 50, canvas.height);
        }
        else {
            ctx.drawImage(topPipe, this.x, this.y, 50, -canvas.height);
        }
        if (this.x + 50 <= 0) {
            boxes.shift();
            score += .5;
            document.getElementById("score").innerText = "Score: " + score;
        }
    }
}

class Player {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.gSpeed = 0;
    }
    Update() {
        this.gSpeed += 0.098;
        this.y += this.gSpeed

        if (this.y + 25 >= canvas.height) {
            isDead = true;
        }
        for (var n = 0; n < boxes.length; n++) {
            if (boxes[n].isUp) {
                if (this.x + 25 > boxes[n].x && this.x < boxes[n].x + 50 && this.y + 25 > boxes[n].y) {
                    isDead = true;
                }
            }
            else {
                if (this.x + 25 > boxes[n].x && this.x < boxes[n].x + 50 && this.y < boxes[n].y) {
                    isDead = true;
                }
            }

        }

        ctx.drawImage(bird, this.x, this.y);
    }
}