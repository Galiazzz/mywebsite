var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
ctx.fillStyle = "white";

var playerLeft = null;
var playerRight = null;
var ball = null;
var rightScore = 0;
var leftScore = 0;

var isUpDown = false;
var isDownDown = false;
var isWDown = false;
var isSDown = false;

var context = new AudioContext();

function LoadStuff() {
    playerLeft = new Player(100, canvas.height / 2 - 75, false, "blue");
    playerRight = new Player(canvas.width - 100, canvas.height / 2 - 75, true, "red");
    ball = new Ball();
    setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playerLeft.Update();
        playerRight.Update();
        ball.Update();
    }, 10);
}

function UpdateScore() {
    document.getElementById("scoreDisplayer").innerText = leftScore + " : " + rightScore;
}

function PlaySound(type, length, frequency, volume) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.connect(g);
    g.gain.value = volume;
    o.type = type;
    o.frequency.value = frequency;
    g.connect(context.destination);
    o.start(0);
    g.gain.exponentialRampToValueAtTime(0.000000001, context.currentTime + length);
}

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp") {
        isUpDown = true;
    }
    if (e.key == "ArrowDown") {
        isDownDown = true;
    }
    if (e.key == "w") {
        isWDown = true;
    }
    if (e.key == "s") {
        isSDown = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowUp") {
        isUpDown = false;
    }
    if (e.key == "ArrowDown") {
        isDownDown = false;
    }
    if (e.key == "w") {
        isWDown = false;
    }
    if (e.key == "s") {
        isSDown = false;
    }
});

class Ball {
    constructor() {
        this.x = canvas.width / 2 - 25;
        this.y = canvas.height / 2 - 25;
        this.direction = [(Math.floor(Math.random() * 2) == 1) ? 3 : -3, 0];
        this.color = "white";
    }
    Update() {
        if (this.x + 50 >= canvas.width) {
            this.x = canvas.width / 2 - 25;
            this.y = canvas.height / 2 - 25;
            this.direction = [(Math.floor(Math.random() * 2) == 1) ? 3 : -3, 0];
            leftScore++;
            UpdateScore();
            PlaySound("sine", 4, 100, 2);
            this.color = "white";
        }
        else if (this.x <= 0) {
            this.x = canvas.width / 2 - 25;
            this.y = canvas.height / 2 - 25;
            this.direction = [(Math.floor(Math.random() * 2) == 1) ? 3 : -3, 0];
            rightScore++;
            UpdateScore();
            PlaySound("sine", 4, 100, 2);
            this.color = "white";
        }

        if (this.x < 150 && this.x > 50 && this.y + 50 > playerLeft.y && this.y < playerLeft.y + 150) {
            this.direction[0] *= -1;
            if (isWDown) {
                this.direction[1] -= 1;
            }
            else if (isSDown) {
                this.direction[1] += 1;
            }
            this.color = "blue";
        }
        else if (this.x > canvas.width - 150 && this.x < canvas.width - 50 && this.y + 50 > playerRight.y && this.y < playerRight.y + 150) {
            this.direction[0] *= -1;
            if (isUpDown) {
                this.direction[1] -= 1;
            }
            else if (isDownDown) {
                this.direction[1] += 1;
            }
            this.color = "red";
        }

        if (this.y <= 0 || this.y + 50 >= canvas.height) {
            this.direction[1] *= -1;
        }

        this.x += this.direction[0];
        this.y += this.direction[1];
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 50, 50);
    }
}

class Player {
    constructor(x, y, isRightPlayer, color) {
        this.x = x;
        this.y = y;
        this.isRightPlayer = isRightPlayer;
        this.color = color;
    }
    Update() {
        if (this.isRightPlayer) {
            if (isUpDown && this.y > 0) {
                this.y -= 3;
            }
            else if (isDownDown && this.y + 150 < canvas.height) {
                this.y += 3;
            }
        }
        else if (!this.isRightPlayer) {
            if (isWDown && this.y > 0) {
                this.y -= 3;
            }
            else if (isSDown && this.y + 150 < canvas.height) {
                this.y += 3;
            }
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 50, 150);
    }
}