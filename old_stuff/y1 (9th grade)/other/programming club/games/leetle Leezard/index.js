var canvas = document.getElementById("canvas");
var seeingCanvas = document.getElementById("seeCanvas");
var ctx = canvas.getContext("2d");
var c = seeingCanvas.getContext("2d");
seeingCanvas.height = window.innerHeight;
seeingCanvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;
canvas.width = window.innerWidth * 2;

var pictures = document.getElementsByClassName("images");
var isFlipped = false;
var player = null;
var cameraX = 0;
var cameraY = 0;
var isPaused = false;

var obsticals = [];

function LoadStuff() {
    player = new Player(50, 50);
    obsticals.push(new Obstical(0, window.innerHeight - 50, 50, window.innerWidth, "black"));
    obsticals.push(new Obstical(0, 0, canvas.height, 50, "black"));
    obsticals.push(new Obstical(0, 0, 50, canvas.width, "black"));
    obsticals.push(new Obstical(0, canvas.height - 50, 50, canvas.width, "black"));
    obsticals.push(new Obstical(canvas.width - 50, 0, canvas.height, 50, "black"));

    for (i = 0; i < obsticals.length; i++) {
        obsticals[i].Update();
    }
    setInterval(function () {
        if (!isPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "grey";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            c.clearRect(0, 0, window.innerWidth, window.innerHeight);
            player.Update();
            for (i = 0; i < obsticals.length; i++) {
                obsticals[i].Update();
            }
            c.drawImage(canvas, cameraX, cameraY, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
        }

    }, 10);
}

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowLeft" || e.key == "a") {
        isFlipped = true;
        player.velocity.x = -5;
    }
    if (e.key == "ArrowRight" || e.key == "d") {
        isFlipped = false;
        player.velocity.x = 5;
    }
    if (e.key == "ArrowUp" || e.key == "w") {
        if (player.jumps < player.jumpsMax) {
            player.velocity.y = -8;
            jumps++;
        }

    }
    if (e.key == "p") {
        switch (isPaused) {
            case true:
                isPaused = false;
                break;
            case false:
                isPaused = true;
                break;
        }
    }
});

class Player {
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0.098);
        this.jumps = 0;
        this.jumpsMax = 1;
    }
    Update() {
        this.velocity.Add(this.acceleration);
        this.position.Add(this.velocity);
        if (this.velocity.x < -.1) {
            this.velocity.x += .05;
        }
        else if (this.velocity.x > .1) {
            this.velocity.x -= .05;
        }
        else {
            this.velocity.x = 0;
        }
        cameraX = (this.position.x - window.innerWidth / 2) + (pictures[0].width * 3 / 2);
        cameraY = this.position.y - window.innerHeight / 2;
        if (isFlipped) {
            ctx.drawImage(pictures[0], this.position.x, this.position.y, pictures[0].width * 3, pictures[0].height * 3);
        }
        else {
            ctx.drawImage(pictures[1], this.position.x, this.position.y, pictures[1].width * 3, pictures[1].height * 3);
        }
    }
}

class Obstical {
    constructor(x, y, height, width, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
    }
    Update() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if ((player.position.x + 1 > this.x && player.position.y + pictures[0].height * 3 > this.y) || (player.position.x + (pictures[0].width * 3 - 1) < this.x && player.position.y + pictures[0].height * 3 > this.y)) {
            player.position.y -= player.velocity.y;
            player.velocity.y = 0;
        }
        if((player.position.x + 1 > this.x && player.position.y + pictures[0].height * 3 > this.y) || (player.position.x + (pictures[0].width * 3 - 1) < this.x && player.position.y + pictures[0].height * 3 > this.y)){

        }
        /*if (player.position.x + pictures[0].width * 3 > this.x && player.position.x + pictures[0].width * 3 < this.x + pictures[0].width * 3 + this.width && player.position.y + pictures[0].height * 3 > this.y && player.position.y < this.y + this.height) {
            player.jumps = 0;
            if (player.position.y < this.y || player.position.y > this.y) {
                player.position.y -= player.velocity.y;
                player.velocity.y = 0;
            }
            if (player.position.x + pictures[0].width > this.x || player.position.x < this.x + this.width) {
                player.velocity.x /= -1;
            }

        }*/
    }
}