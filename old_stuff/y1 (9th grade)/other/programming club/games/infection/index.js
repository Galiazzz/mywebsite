var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var people = [];
var germs = [];
var isPaused = false;

function LoadStuff() {
    document.body.style.backgroundColor = "black";

    for (i = 0; i < 85; i++) {
        people.push(new Person(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), false));
    }

    people[Math.floor(Math.random() * people.length)].isInfected = true;

    setInterval(function () {
        if (!isPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < people.length; i++) {
                people[i].Update();
            }
            for (i = 0; i < germs.length; i++) {
                germs[i].Update();
            }
            for (var i = 0; i < germs.length; i++) {
                if (germs[i].isDead) {
                    germs.splice(i, 1);
                }
            }
            for (i = 0; i < people.length; i++) {
                if (people[i].isDead) {
                    people.splice(i, 1);
                }
            }
            document.body.style.backgroundColor = "rgb(" + people.length * (255 / (people.length + 1)) + ", " + people.length * (255 / (people.length + 1)) + ", " + people.length * (255 / (people.length + 1)) + ")";
        }
    }, 10);
}

document.oncontextmenu = function (e) {
    e.preventDefault();
};

document.addEventListener("mousedown", function (e) {
    if (e.which == 1) {
        people.push(new Person(e.clientX, e.clientY, false));
    }
    else if (e.which == 3) {
        people.push(new Person(e.clientX, e.clientY, true));
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key == "p") {
        switch (isPaused) {
            case true:
                isPaused = false;
                break;
            case false: isPaused = true;
                break;
        }
    }
});

class Person {
    constructor(x, y, isInfected) {
        this.x = x;
        this.y = y;
        this.isInfected = isInfected;
        this.direction = [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1];
        this.germCooldown = 100;
        this.lifeSpan = 900;
        this.isDead = false;
    }
    Update() {
        this.x += this.direction[0];
        this.y += this.direction[1];
        if (this.y < 0) {
            this.y = canvas.height;
        }
        if (this.x < 0) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = 0;
        }
        if (this.y > canvas.height) {
            this.y = 0;
        }

        if (this.isInfected) {
            this.germCooldown--;
            this.lifeSpan--;
            ctx.fillStyle = "yellow";
            if (this.germCooldown == 0) {
                this.germCooldown = 100;
                for (var j = -1; j <= 1; j++) {
                    for (var k = -1; k <= 1; k++) {
                        if (j != 0 && k != 0) {
                            germs.push(new Germ(this.x + j * 20, this.y + k * 20, this.direction[0] - 5 * j, this.direction[1] - 5 * k, false));
                        }
                    }
                }
            }
            if (this.lifeSpan <= 0) {
                this.isDead = true;
            }
        }
        else {
            ctx.fillStyle = "green";
        }
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Germ {
    constructor(x, y, xspeed, yspeed, isDead) {
        this.x = x;
        this.y = y;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.isDead = isDead;
    }
    Update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
        if (this.y < 0 || this.x < 0 || this.x > canvas.width || this.y > canvas.height) {
            this.isDead = true;
        }

        for (var n = 0; n < people.length; n++) {
            if (Math.sqrt(Math.pow(this.x - people[n].y, 2) + Math.pow(this.y - people[n].y, 2)) < 10) {
                people[n].isInfected = true;
                this.isDead = true;
            }
        }


        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}