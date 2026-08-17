
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = new AudioContext();

var enemies = [];
var lazers = [];
var playerMain = null;
var score = 0;
var levelScore = 0;
var level = 1;
var enemySpawners = [];
var enemySpawnersCreated = 0;
var lives = 1;
var shotsLeft = 15;
var hasDied = false;
var isPaused = false;
var hasStarted = false;
var money = 0;
var maxLives = 1;
var maxShots = 15;
var isInShop = false;
var lifeCost = 20;
var shotCost = 2;

var bullet = document.getElementById("bullet");
var enemyBase = document.getElementById("enemy");
var playerImg = document.getElementById("player");


function LoadStuff() {
    hasStarted = true;
    document.getElementById("home").style.zIndex = "-1";
    document.getElementById("upgrades").style.zIndex = "-1";
    document.getElementById("canvas").style.zIndex = "1";
    document.getElementById("score").style.zIndex = "2";
    document.getElementById("lives").style.zIndex = "2";
    document.getElementById("level").style.zIndex = "2";
    document.getElementById("shots").style.zIndex = "2";
    playerMain = new player(canvas.width / 2, canvas.height - 50);
    PlaySound("sine", 10, 150, 3);
    setInterval(function () {
        if (!isPaused) {
            if (!hasDied && !isInShop) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                playerMain.update();
                for (i = 0; i < lazers.length; i++) {
                    lazers[i].update();
                }
                for (i = 0; i < enemies.length; i++) {
                    enemies[i].update();
                }

                if (levelScore == 10) {
                    levelScore = 0;
                    level++;
                    document.getElementById("level").innerText = "Level: " + level;

                    enemySpawners[enemySpawnersCreated] = setInterval(function () {
                        enemies.push(new enemy(Math.floor(Math.random() * (canvas.width - 55)), 55, level));
                    }, 2000 * (level));
                }
            }
            else if (hasDied && !isInShop) {
                isInShop = true;
                document.getElementById("deadButton").style.zIndex = "3";
                money += score;
                for (i = 0; i < enemySpawners.length; i++) {
                    clearInterval(enemySpawners[i]);
                }
            }
        }


    }, 10);
    setInterval(function () {
        if (!isPaused) {
            if (!hasDied) {
                enemies.push(new enemy(Math.floor(Math.random() * (canvas.width - 55)), 55, 1));
            }
        }
    }, 2000);
}

function SetUpShop() {
    document.getElementById("deadButton").style.zIndex = "-1";
    document.getElementById("home").style.zIndex = "-1";
    document.getElementById("upgrades").style.zIndex = "1";
    document.getElementById("canvas").style.zIndex = "-1";
    document.getElementById("score").style.zIndex = "-1";
    document.getElementById("lives").style.zIndex = "-1";
    document.getElementById("level").style.zIndex = "-1";
    document.getElementById("shots").style.zIndex = "-1";
    document.getElementById("continue").style.zIndex = "2";


    document.getElementById("money").innerText = "Money: " + money;
    document.getElementById("maxLives").innerText = "MaxLives: " + maxLives;
    document.getElementById("maxShots").innerText = "MaxShots: " + maxShots;
    document.getElementById("lifeUpgrade").innerHTML = "Upgrade Max Lives <br> Cost: " + lifeCost;
    document.getElementById("shotUpgrade").innerHTML = "Upgrade Max Shots <br> Cost: " + shotCost;
    if (money < lifeCost) {
        document.getElementById("lifeUpgrade").style.backgroundColor = "red";
    }
    else {
        document.getElementById("lifeUpgrade").style.backgroundColor = "green";
    }
    if (money < shotCost) {
        document.getElementById("shotUpgrade").style.backgroundColor = "red";
    }
    else {
        document.getElementById("shotUpgrade").style.backgroundColor = "green";
    }
}

function PlayAgain() {
    document.getElementById("home").style.zIndex = "-1";
    document.getElementById("upgrades").style.zIndex = "-1";
    document.getElementById("canvas").style.zIndex = "1";
    document.getElementById("score").style.zIndex = "2";
    document.getElementById("lives").style.zIndex = "2";
    document.getElementById("level").style.zIndex = "2";
    document.getElementById("shots").style.zIndex = "2";
    hasDied = false;
    shotsLeft = maxShots;
    lives = maxLives;
    score = 0;
    levelScore = 0;
    level = 1;
    enemies = [];
    lazers = [];
    enemySpawnersCreated = 0;
    enemySpawners = [];
    isInShop = false;

    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("lives").innerText = "lives: " + maxLives;
    document.getElementById("level").innerText = "level: 0";
    document.getElementById("shots").innerText = "Shots Left: " + maxShots;
    PlaySound("sine", 10, 150, 3);
}

function PlaySound(type, length, frequency, volume) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.connect(g);
    g.gain.value = volume;
    o.type = type;
    o.frequency.value = frequency;
    //g.gain = volume;
    g.connect(context.destination);
    o.start(0);
    g.gain.exponentialRampToValueAtTime(0.000000001, context.currentTime + length);
}

document.addEventListener("keydown", function (e) {
    if (!isPaused) {
        if (!hasDied && hasStarted) {
            if (e.key == "ArrowLeft") {
                playerMain.x -= 10;
            }
            else if (e.key == "ArrowRight") {
                playerMain.x += 10;
            }
            else if (e.key == " " && shotsLeft > 0) {
                PlaySound("triangle", .7, 500, 1.5);
                lazers.push(new Lazer(playerMain.x, playerMain.y));
                shotsLeft--;
                document.getElementById("shots").innerText = "Shots Left: " + shotsLeft;
            }
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
            default: break;
        }
    }
}, true);

document.addEventListener("mousedown", function (e) {
    if (hasStarted) {
        if (shotsLeft > 0) {
            PlaySound("triangle", .7, 500, 1.5);
            lazers.push(new Lazer(playerMain.x, playerMain.y));
            shotsLeft--;
            document.getElementById("shots").innerText = "Shots Left: " + shotsLeft;
        }
    }
}, true);

document.addEventListener("mousemove", function (e) {
    if (!isPaused) {
        if (!hasDied && hasStarted) {
            playerMain.x = e.clientX - 10;
        }
    }
}, true)

class player {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        ctx.fillStyle = "green";
        ctx.drawImage(playerImg, this.x - 10, this.y, 30, 30);
    }
}

class Lazer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isAlive = true;
    }

    update() {
        if (this.isAlive) {
            ctx.fillStyle = "blue"
            ctx.drawImage(bullet, this.x, this.y, 10, 10);
        }
        this.y -= 10;
        if (this.y < 0) {
            lazers.shift();
        }
    }
}

class enemy {

    constructor(x, y, health) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.isAlive = true;
    }

    update() {
        if (this.isAlive) {
            ctx.fillStyle = "rgba(" + this.health * 25 + "," + (255 - this.health * 50) + "," + (255 - this.health * 50) + ", .5)";
            ctx.drawImage(enemyBase, this.x, this.y, 55, 55);
            ctx.fillRect(this.x, this.y, 55, 55);
        }
        this.y += 1;

        for (var n = 0; n < lazers.length; n++) {
            if (this.x < lazers[n].x && this.x + 55 > lazers[n].x && this.y + 55 > lazers[n].y && this.y < lazers[n].y && lazers[n].isAlive && this.isAlive) {
                this.health--;
                score++;
                PlaySound("sine", .9, 70, 3);
                if (this.health <= 0) {
                    this.isAlive = false;
                    PlaySound("square", 1.4, 50, 2);
                    score++;
                    levelScore++;
                }
                lazers[n].isAlive = false;
                document.getElementById("score").innerText = "Score: " + score;
            }
        }
        if (this.y > canvas.height) {
            enemies.shift();
            if (this.isAlive) {
                PlaySound("sawtooth", 2, 40, 2);
                lives--;
            }
            document.getElementById("lives").innerText = "Lives: " + lives;
            if (lives == 0) {
                hasDied = true;
            }
        }
    }
}