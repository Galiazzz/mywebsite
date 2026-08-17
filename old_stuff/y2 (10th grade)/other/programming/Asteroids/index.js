InportJSFile("../../../../overarching/libraries/vectors.js");
InportJSFile("../../../../overarching/libraries/keyboard input.js");
InportJSFile("../../../../overarching/libraries/random.js");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var player = null;
var player2 = null;
var bullets = [];
var asteroids = [];

var level = 1;
var score = 0;

var isPlaying = true;
var isFirstTime = true;
var isPlayingMultiPlayer = false;

var bulletLifeTime = 150;

function LoadStuff() {
    isPlayingMultiPlayer = false;
    if (confirm("Do you want to do 2-player mode?")) {
        player2 = new Player();
        isPlayingMultiPlayer = true;
    }
    player = new Player();
    bullets = [];
    asteroids = [];
    isPlaying = true;
    level = 1;
    score = 0;
    asteroids.push(new Asteroid(1));
    if (isFirstTime) {
        setInterval(Update, 10);
        requestAnimationFrame(Draw);
        isFirstTime = false;
    }
}

function Update() {
    if (isPlaying) {
        if (isPlayingMultiPlayer) {
            if (player == null && player2 == null) {
                if (confirm(`You both lost :(  :(\nYour level was: ${level}, and your score was: ${score}\n Do you want to try again?`)) {
                    LoadStuff();
                }
            }


            if (player != null) {
                if (keysHeld[keyCodes.a]) {
                    player.rotationAngle -= 0.04 * player.spinspeed;
                }
                if (keysHeld[keyCodes.d]) {
                    player.rotationAngle += 0.04 * player.spinspeed;
                }
                if (keysHeld[keyCodes.w] && (player.velocity.Magnitude() < 5 ||
                    player.velocity.Dot(new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle))) < 0)) {
                    player.acceleration = new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle)).Div(50);
                }
                if (keysHeld[keyCodes.s] && (player.velocity.Magnitude() < 5 ||
                    player.velocity.Dot(new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle))) > 0)) {
                    player.acceleration = new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle)).Div(-50);
                }
                if (keysHeld[keyCodes.f] && player.timeSinceLastFire > player.fireCoolDownTime) {
                    bullets.push(new Bullet(player.pos, new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle)).Mul(5).Add(player.velocity)));
                    player.timeSinceLastFire = 0;
                }
            }

            if (player2 != null) {
                if (keysHeld[keyCodes.arrowLeft]) {
                    player2.rotationAngle -= 0.04 * player2.spinspeed;
                }
                if (keysHeld[keyCodes.arrowRight]) {
                    player2.rotationAngle += 0.04 * player2.spinspeed;
                }
                if (keysHeld[keyCodes.arrowUp] && (player2.velocity.Magnitude() < 5 ||
                    player2.velocity.Dot(new Vec2(Math.cos(player2.rotationAngle), Math.sin(player2.rotationAngle))) < 0)) {
                    player2.acceleration = new Vec2(Math.cos(player2.rotationAngle), Math.sin(player2.rotationAngle)).Div(50);
                }
                if (keysHeld[keyCodes.arrowDown] && (player2.velocity.Magnitude() < 5 ||
                    player2.velocity.Dot(new Vec2(Math.cos(player2.rotationAngle), Math.sin(player2.rotationAngle))) > 0)) {
                    player2.acceleration = new Vec2(Math.cos(player2.rotationAngle), Math.sin(player2.rotationAngle)).Div(-50);
                }
                if (keysHeld[keyCodes.shift] && player2.timeSinceLastFire > player2.fireCoolDownTime) {
                    bullets.push(new Bullet(player2.pos, new Vec2(Math.cos(player2.rotationAngle), Math.sin(player2.rotationAngle)).Mul(5).Add(player2.velocity)));
                    player2.timeSinceLastFire = 0;
                }

                player2.Update();
            }
        }
        else {
            if (keysHeld[keyCodes.a] || keysHeld[keyCodes.arrowLeft]) {
                player.rotationAngle -= 0.04 * player.spinspeed;
            }
            if (keysHeld[keyCodes.d] || keysHeld[keyCodes.arrowRight]) {
                player.rotationAngle += 0.04 * player.spinspeed;
            }
            if ((keysHeld[keyCodes.w] || keysHeld[keyCodes.arrowUp]) && (player.velocity.Magnitude() < 5 ||
                player.velocity.Dot(new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle))) < 0)) {
                player.acceleration = new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle)).Div(50);
            }
            if ((keysHeld[keyCodes.s] || keysHeld[keyCodes.arrowDown]) && (player.velocity.Magnitude() < 5 ||
                player.velocity.Dot(new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle))) > 0)) {
                player.acceleration = new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle)).Div(-50);
            }
            if (keysHeld[keyCodes.space] && player.timeSinceLastFire > player.fireCoolDownTime) {
                bullets.push(new Bullet(player.pos, new Vec2(Math.cos(player.rotationAngle), Math.sin(player.rotationAngle)).Mul(5).Add(player.velocity)));
                player.timeSinceLastFire = 0;
            }
        }

        if (player != null) {
            player.Update();
        }
        for (var i = 0; i < bullets.length; ++i) {
            bullets[i].Update();
            if (bullets[i].life > bullets[i].lifeTime) {
                bullets.splice(i, 1);
                --i;
            }
        }
        for (var i = 0; i < asteroids.length; ++i) {
            asteroids[i].Update();
        }

        if (asteroids.length == 0) {
            ++level;
            var numAsteroids = 0;
            while (numAsteroids < level) {
                var size = RandInt(level, 1);
                asteroids.push(new Asteroid(size));
                numAsteroids += (size / 2) * (1 + size);
            }
            if(isPlayingMultiPlayer){
                if(player == null){
                    player = new Player();
                }
                if(player2 == null){
                    player2 = new Player();
                }
            }
        }
    }
}

function Draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    if (player != null) {
        player.Draw();
    }
    if (player2 != null) {
        player2.Draw();
    }
    for (var i = 0; i < bullets.length; ++i) {
        bullets[i].Draw();
    }
    for (var i = 0; i < asteroids.length; ++i) {
        asteroids[i].Draw();
    }
    ctx.font = "30px Arial";
    ctx.fillStyle = "darkGrey";
    ctx.fillText("Level: " + level, 10, 30);
    ctx.fillText("Score: " + score, 10, 70);
    requestAnimationFrame(Draw);
}

class Player {
    constructor() {
        this.size = new Vec2(50, 50);
        this.pos = new Vec2(canvas.width / 2, canvas.height / 2).Sub(this.size.Div(2));
        this.velocity = new Vec2(0, 0);
        this.acceleration = new Vec2(0, 0);
        this.rotationAngle = 0; //remember: RADIENS, NOT DEGREES!!!
        this.fireCoolDownTime = 30;
        this.timeSinceLastFire = 0;
        this.spinspeed = 1;
    }

    Update() {
        this.velocity.AddE(this.acceleration);
        this.pos.AddE(this.velocity);

        if (this.pos.x < -this.size.x / 2) {
            this.pos.x = canvas.width + this.size.x / 2;
        }
        if (this.pos.x > canvas.width + this.size.x / 2) {
            this.pos.x = -this.size.x / 2;
        }
        if (this.pos.y < -this.size.y / 2) {
            this.pos.y = canvas.height + this.size.y / 2;
        }
        if (this.pos.y > canvas.height + this.size.y / 2) {
            this.pos.y = -this.size.y / 2;
        }
        this.acceleration = new Vec2(0, 0);
        ++this.timeSinceLastFire;
    }

    Draw() {
        ctx.beginPath();
        ctx.moveTo(this.pos.x + Math.cos(this.rotationAngle) * this.size.x / 2, this.pos.y + Math.sin(this.rotationAngle) * this.size.x / 2);
        ctx.lineTo(this.pos.x - Math.cos(-this.rotationAngle - Math.PI / 4) * this.size.x / 2, this.pos.y + Math.sin(-this.rotationAngle - Math.PI / 4) * this.size.x / 2);
        ctx.lineTo(this.pos.x - Math.cos(this.rotationAngle - Math.PI / 4) * this.size.x / 2, this.pos.y - Math.sin(this.rotationAngle - Math.PI / 4) * this.size.x / 2);
        ctx.lineTo(this.pos.x + Math.cos(this.rotationAngle) * this.size.x / 2, this.pos.y + Math.sin(this.rotationAngle) * this.size.x / 2);

        ctx.stroke();
    }
}

class Bullet {
    constructor(pos, velocity) {
        this.pos = CopyVec2(pos);
        this.velocity = CopyVec2(velocity);
        this.lifeTime = bulletLifeTime;
        this.life = 0;
    }

    Update() {
        this.pos.AddE(this.velocity);
        if (this.pos.x < -5) {
            this.pos.x = canvas.width + 5;
        }
        if (this.pos.x > canvas.width + 5) {
            this.pos.x = -5;
        }
        if (this.pos.y < -5) {
            this.pos.y = canvas.height + 5;
        }
        if (this.pos.y > canvas.height + 5) {
            this.pos.y = -5;
        }
        this.life++;

        for (var i = 0; i < asteroids.length; i++) {
            var diffX = (this.pos.x - asteroids[i].pos.x),
                diffY = (this.pos.y - asteroids[i].pos.y);
            if (Math.sqrt(diffX * diffX + diffY * diffY) < 5 + asteroids[i].size * asteroids[i].sizeRadius) {
                ++score;
                this.life = this.lifeTime + 1;
                if (asteroids[i].size > 1) {
                    var oldPos = asteroids[i].pos;
                    if (Math.round(Math.random()) == 0) {
                        asteroids.push(new Asteroid(asteroids[i].size - 1));
                        asteroids[asteroids.length - 1].pos = CopyVec2(oldPos);
                    }
                    asteroids.push(new Asteroid(asteroids[i].size - 1));
                    asteroids[asteroids.length - 1].pos = CopyVec2(oldPos);
                    asteroids[i] = new Asteroid(asteroids[i].size - 1);
                    asteroids[i].pos = CopyVec2(oldPos);
                }
                else {
                    asteroids.splice(i, 1);
                }
            }
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Asteroid {
    constructor(size) {
        this.sizeRadius = 15;
        this.size = size;
        this.pos = null;
        switch (RandInt(0, 4)) {
            case 0:
                this.pos = new Vec2(RandNum(0, canvas.width), -this.sizeRadius * size);
                break;
            case 1:
                this.pos = new Vec2(-this.sizeRadius * size, RandNum(0, canvas.height));
                break;
            case 2:
                this.pos = new Vec2(RandNum(0, canvas.width), canvas.height + this.sizeRadius * size);
                break;
            default:
                this.pos = new Vec2(canvas.width + this.sizeRadius * size, RandNum(0, canvas.height));
                break;
        }
        this.velocity = new Vec2(RandNum(1, -1), RandNum(1, -1)).Div(this.size);

        this.changes = [];
        for (var i = 0; i < 2 * Math.PI * 5 * this.size; i++) {
            this.changes.push(RandNum(this.size * this.sizeRadius / 10, this.size * -this.sizeRadius / 10));
        }
    }

    Update() {
        this.pos.AddE(this.velocity);
        if (this.pos.x < -this.sizeRadius * this.size) {
            this.pos.x = canvas.width + this.sizeRadius * this.size;
        }
        if (this.pos.x > canvas.width + this.sizeRadius * this.size) {
            this.pos.x = -this.sizeRadius * this.size;
        }
        if (this.pos.y < -this.sizeRadius * this.size) {
            this.pos.y = canvas.height + this.sizeRadius * this.size;
        }
        if (this.pos.y > canvas.height + this.sizeRadius * this.size) {
            this.pos.y = -this.sizeRadius * this.size;
        }

        if (isPlayingMultiPlayer) {
            if (player != null) {
                var diff1X = player.pos.x - this.pos.x,
                    diff1Y = player.pos.y - this.pos.y;
                if (Math.sqrt(diff1X * diff1X + diff1Y * diff1Y) < this.sizeRadius * this.size + ((player.size.x + player.size.y) / 4)) {
                    player = null;
                }
            }
            if (player2 != null) {
                var diff2X = player2.pos.x - this.pos.x,
                    diff2Y = player2.pos.y - this.pos.y;
                if (Math.sqrt(diff2X * diff2X + diff2Y * diff2Y) < this.sizeRadius * this.size + ((player2.size.x + player2.size.y) / 4)) {
                    player2 = null;
                }
            }
        }
        else {
            var diffX = player.pos.x - this.pos.x,
                diffY = player.pos.y - this.pos.y;

            if (Math.sqrt(diffX * diffX + diffY * diffY) < this.sizeRadius * this.size + ((player.size.x + player.size.y) / 4)) {
                isPlaying = false;
                if (confirm(`You Lost! :( \nYour level was: ${level}, and your score was: ${score}\n Do you want to play again?`)) {
                    LoadStuff();
                }
            }
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.moveTo(this.pos.x + this.sizeRadius * this.size + this.changes[0], this.pos.y);
        for (var i = 1; i < this.changes.length; i++) {
            ctx.lineTo(this.pos.x + Math.cos(2 * Math.PI / (2 * Math.PI * 5 * this.size) * i) * (this.sizeRadius * this.size + this.changes[i]), this.pos.y + Math.sin(2 * Math.PI / (2 * Math.PI * 5 * this.size) * i) * (this.sizeRadius * this.size + this.changes[i]));
        }
        ctx.lineTo(this.pos.x + this.sizeRadius * this.size + this.changes[0], this.pos.y);
        ctx.stroke();
    }
}

document.addEventListener("keypress", function (e) {
    if (e.key == "p") {
        switch (isPlaying) {
            case true:
                isPlaying = false;
                break;
            case false:
                isPlaying = true;
        }
    }
});
