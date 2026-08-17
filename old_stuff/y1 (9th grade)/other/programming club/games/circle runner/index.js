var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var player = null;
ctx.strokeStyle = "white";
var enemies = [];
var isDead = false;
var speed = 1;
var score = 0;
var scoreCounter = 0;
var level = 1;
var levelCounter = 0;
var highScore = 0;
var intervals = [];

function LoadStuff() {
    player = new Player(3);
    ctx.strokeStyle = "white";
    enemies = [];
    isDead = false;
    speed = 1;
    score = 0;
    scoreCounter = 0;
    level = 1;
    levelCounter = 0;
    for (i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
    }
    intervals = [];
    document.getElementById("playAgain").style.display = "none";

    intervals[0] = setInterval(function () {
        if (!isDead) {
            scoreCounter++;
            if (scoreCounter >= 10) {
                score++;
                scoreCounter = 0;
            }
            document.getElementById("score").innerText = "Score: " + score;
            Update();
        }
        else {
            if (highScore < score) {
                highScore = score;
            }
            document.getElementById("highScore").innerText = "High Score: " + highScore;
            document.getElementById("playAgain").style.display = "block";
        }
    }, 10);

    intervals[1] = setInterval(function () {
        if (!isDead) {
            enemies.push(new Enemy(Math.floor(Math.random() * 5) + 1, getRandomColor()));
        }
    }, 500)

    intervals[2] = setInterval(function () {
        if (!isDead) {
            speed += 1 + Math.floor(speed / 5);
            level++;
            levelCounter++;
            if (levelCounter == 3) {
                intervals.push(setInterval(function () {
                    if (!isDead) {
                        enemies.push(new Enemy(Math.floor(Math.random() * 5) + 1, getRandomColor()));
                    }
                }, 500 + Math.floor(Math.random() * 200) - 100));
                levelCounter = 0;
            }
            document.getElementById("level").innerText = "Level: " + level;
        }

    }, 15000);
}

function Update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath()
    for (i = 1; i < 6; i++) {
        ctx.moveTo(0, i * canvas.height / 6);
        ctx.lineTo(canvas.width, i * canvas.height / 6);
    }
    ctx.stroke();
    player.Update();
    for (i = 0; i < enemies.length; i++) {
        enemies[i].Update();
    }
}

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" || e.key == "w") {
        if (player.lineNum > 1) {
            player.lineNum--;
        }
    }
    if (e.key == "ArrowDown" || e.key == "s") {
        if (player.lineNum < 5) {
            player.lineNum++;
        }
    }
});

function getRandomColor() {
    var letters = '123456789ABCDEFF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


class Enemy {
    constructor(lineNum, color) {
        this.lineNum = lineNum;
        this.color = color;
        this.x = canvas.width;
    }
    Update() {
        this.x -= speed;

        if (this.x < 0) {
            enemies.shift();
        }

        if (this.lineNum == player.lineNum && Math.abs(this.x - 150) < 25) {
            isDead = true;
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.lineNum * (canvas.height / 6));
        ctx.arc(this.x, this.lineNum * (canvas.height / 6), 25, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Player {
    constructor(lineNum) {
        this.lineNum = lineNum;
    }
    Update() {
        ctx.fillStyle = "white";
        ctx.fillRect(100, this.lineNum * (canvas.height / 6) - 25, 50, 50);
    }
}