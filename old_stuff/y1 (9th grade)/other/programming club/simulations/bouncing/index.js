
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight - 50;
canvas.width = window.innerWidth - 50;
var doTick = true;
var cursorPositions = [];

var points = [new Point(100, 100, 2, 0.098, "blue", 0), new Point(200, 50, 2, 0.098, "blue", 0), new Point(300, 300, 2, 0.098, "orange", 0), new Point(300, 350, 2, 0.098, "yellow", 0)]
var pointsCreated = 4;

function LoadStuff() {
    setInterval(function () {
        if (doTick) {
            UpdateMain();
        }
    }, 10);
}

function UpdateMain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < points.length; i++) {
        points[i].Update();
    }
}

function Point(x, y, bounciness, gravity, color, volocityx) { //volocityx: - = left, + = right
    this.x = x;
    this.y = y;
    this.gSpeed = 0;
    this.bounciness = bounciness;
    this.gravity = gravity;
    this.color = color;
    this.volocityx = volocityx;

    this.Update = function () {
        if (Math.abs(this.volocityx) < 0.001) {
            this.volocityx = 0;
        }
        if (this.volocityx < 0) {
            this.volocityx += .098;
        }
        else if (this.volocityx > -0) {
            this.volocityx -= .098;
        }
        if (this.y < canvas.height - 10) {
            this.gSpeed += this.gravity;
            this.y += this.gSpeed;
        }
        else {
            this.y = canvas.height - 10;
            this.gSpeed /= -(this.bounciness);
            this.y += this.gSpeed;
        }

        for (var n = 0; n < points.length; n++) {
            if (i != n) {
                if (this.y - 5 <= points[n].y && this.y >= points[n].y - 5 && this.x <= points[n].x + 5 && this.x >= points[n].x - 5) {

                    this.gSpeed /= -(this.bounciness);
                    this.gSpeed = 0;
                    this.y += this.bounciness;
                    this.y = points[n].y - 6;
                    
                }
            }
        }
        this.x += this.volocityx;
        ctx.beginPath();
        ctx.rect(this.x, this.y, 5, 5);
        ctx.fillStyle = this.color;
        ctx.fill();
        //ctx.fillRect(this.x, this.y, 5, 5);
    }
}


function TickToggle() {
    switch (doTick) {
        case true:
            doTick = false;
            document.getElementById("state").value = "auto tick = off";
            break;
        case false:
            doTick = true;
            document.getElementById("state").value = "auto tick = on";
            break;
    }
}

function IsTouching(componant1, part, componant2) {
    if (part == "under") {
        if (componant1.y > componant2.y + 5) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (part == "over") {
        if (componant1.y + 5 < componant2.y) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (part == "right") {
        if (componant1.x > componant2.x + 5) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (part == "left") {
        if(componant1.x + 5 < componant2.x){
            return true;
        }
        else {
            return false;
        }
    }
}

function getCursorPosition(c, event, stage) {
    const rect = c.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    //console.log("x: " + x + " y: " + y)
    if (stage == 2) {
        cursorPositions[3] = x;
        cursorPositions[4] = y;
        points[pointsCreated] = new Point(x, y, 2, 0.098, "blue", -((cursorPositions[1] - cursorPositions[3]) / 20));
        pointsCreated++;
    }
    else {
        cursorPositions[1] = x;
        cursorPositions[2] = y;
    }

}

const c = document.querySelector('canvas')
c.addEventListener('mousedown', function (e) {
    getCursorPosition(c, e, 1);

})

c.addEventListener("mouseup", function (e) {
    getCursorPosition(c, e, 2);
}, true);

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "t":
            TickToggle();
            break;
        case "s":
            UpdateMain();
            break;
        default:
            break;
    }
}, true);