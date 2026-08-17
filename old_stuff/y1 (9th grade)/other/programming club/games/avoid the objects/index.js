var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var player = null;
var obsticals = [];
var score = 0;
var level = 1;
var levelScore = 0;
var isAlive = true;
var lives = 10;

function LoadStuff() {
    player = new Player(50, 50);
    setInterval(function () {
        if (isAlive) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.Update();
            for (i = 0; i < obsticals.length; i++) {
                obsticals[i].Update();
            }
        }
    }, 10);
    setInterval(function () {
        if (isAlive) {
            var x = Math.floor(Math.random() * (canvas.width - 60));
            var y = Math.floor(Math.random() * (canvas.height - 60))
            if(x >= player.x - 150 && x <= player.x + 210 && y >= player.y - 150 && y <= player.y + 210){
                x = player.x - 150;
                y = player.y + 210;
            }
            
                obsticals.push(new Obstical(x , y, new Vector2(Math.floor(Math.random() * 10) - 5, Math.floor(Math.random() * 10) - 5)));
            
        }
    }, 1000);
    setInterval(function () {
        if (isAlive) {
            score++;
            document.getElementById("score").innerText = "Score: " + score;
            levelScore++;
            if (levelScore == 10) {
                levelScore = 0;
                level++;
                document.getElementById("level").innerText = "Level: " + level;
                setInterval(function () {
                    if (isAlive) {
                        obsticals.push(new Obstical(Math.floor(Math.random() * (canvas.width - 60)), Math.floor(Math.random() * (canvas.height - 60)), new Vector2(Math.floor(Math.random() * 10) - 5, Math.floor(Math.random() * 10) - 5)));
                    }
                }, 1000);
            }
        }
    }, 1000);
}

document.addEventListener("mousemove", function (e) {
    player.x = e.clientX - 25;
    player.y = e.clientY - 25;
}, true)

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Update() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, 50, 50);
    }
}

class Obstical {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    Update() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 60, 60);
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x - 50 < player.x && this.x + 110 > player.x + 50 && this.y - 50 < player.y && this.y + 110 > player.y + 50) {
            lives--;
            document.getElementById("lives").innerText = "Lives: " + lives;
            this.velocity = new Vector2(100, 100);
            if (lives == 0) {
                isAlive = false;
            }
        }
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}