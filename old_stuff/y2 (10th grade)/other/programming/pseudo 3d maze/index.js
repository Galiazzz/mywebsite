const keyCodes = {
    Up: 0,
    Down: 1,
    Right: 2,
    Left: 3,
    W: 4,
    A: 5,
    S: 6,
    D: 7,
    R: 8,
    L: 9,
}

var mainCanvas = document.getElementById("mainCanvas");
var ctx = mainCanvas.getContext("2d");
mainCanvas.height = window.innerHeight;
mainCanvas.width = window.innerWidth;
var mapCanvas = document.getElementById("mapInset");
var mapCtx = mapCanvas.getContext("2d");
mapCanvas.height = 300;
mapCanvas.width = 300;

var keysHeld = [false, false, false, false, false, false, false, false, false, false];

var isPointerCaptured = false;

var player = null;
var numRays = mainCanvas.width / 8;
var mazeWalls = [];
var intersections = [];

function LoadStuff() {
    player = new Player(50, 50, 0, Math.PI / 4);

    mazeWalls.push(new Line(new Vec2(30, 30), new Vec2(160, 60)));
    mazeWalls.push(new Line(new Vec2(200, 70), new Vec2(201, 200)));
    mazeWalls.push(new Line(new Vec2(290, 270), new Vec2(170, 60)));

    setInterval(Update, 10);
    requestAnimationFrame(Draw);
}

function Update() {
    if (keysHeld[keyCodes.Up] || keysHeld[keyCodes.W]) {
        player.pos = player.pos.Add(new Vec2(Math.cos(player.viewDirection), -Math.sin(player.viewDirection)));
    }
    if (keysHeld[keyCodes.Down] || keysHeld[keyCodes.S]) {
        player.pos = player.pos.Sub(new Vec2(Math.cos(player.viewDirection), -Math.sin(player.viewDirection)));
    }
    if (keysHeld[keyCodes.Right] || keysHeld[keyCodes.D]) {
        player.pos = player.pos.Sub(new Vec2(Math.cos(player.viewDirection + Math.PI / 2), -Math.sin(player.viewDirection + Math.PI / 2)));
    }
    if (keysHeld[keyCodes.Left] || keysHeld[keyCodes.A]) {
        player.pos = player.pos.Add(new Vec2(Math.cos(player.viewDirection + Math.PI / 2), -Math.sin(player.viewDirection + Math.PI / 2)));
    }
    if (keysHeld[keyCodes.R]) {
        player.viewDirection -= 0.01;
    }
    if (keysHeld[keyCodes.L]) {
        player.viewDirection += 0.01;
    }

    intersections.length = 0;

    for (var i = player.viewDirection - player.FOVAngle / 2; i < player.viewDirection + player.FOVAngle / 2; i += player.FOVAngle / numRays) {
        var intersectionPoint = null;

        for (var n = 0; n < mazeWalls.length; n++) {
            var point = mazeWalls[n].IntersectingPointLineRaw(-Math.tan(i), player.pos.x, player.pos.y)
            if (point.x >= mazeWalls[n].leftPoint.x && point.x <= mazeWalls[n].rightPoint.x) {
                if (intersectionPoint == null || point.Sub(player.pos).Magnitude() < intersectionPoint.Sub(player.pos).Magnitude()) {
                    if ((Math.cos(i) > 0 && point.x > player.pos.x) || (Math.cos(i) <= 0 && point.x < player.pos.x)) {
                        intersectionPoint = point;
                    }
                }
            }
        }
        if (intersectionPoint != null &&
            ((Math.cos(i) > 0 && intersectionPoint.x > player.pos.x) || (Math.cos(i) <= 0 && intersectionPoint.x < player.pos.x))) {
            intersections.push(intersectionPoint);
        }
        else {
            intersections.push(null);
        }
    }
}

function Draw() {
    mainCanvas.width = window.innerWidth;
    mainCanvas.height = window.innerHeight;

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    mapCtx.clearRect(0, 0, 300, 300);
    mapCtx.strokeStyle = "White";
    for (var i = player.viewDirection - player.FOVAngle / 2; i < player.viewDirection + player.FOVAngle / 2; i += player.FOVAngle / numRays) {
        mapCtx.beginPath();
        if (Math.cos(i) > 0) {
            mapCtx.moveTo(player.pos.x, player.pos.y)
            mapCtx.lineTo(300, -Math.tan(i) * (300 - player.pos.x) + player.pos.y)
        }
        else {
            mapCtx.moveTo(player.pos.x, player.pos.y)
            mapCtx.lineTo(0, -Math.tan(i) * (0 - player.pos.x) + player.pos.y)
        }
        mapCtx.stroke();
    }

    var width = mapCtx.lineWidth;
    mapCtx.lineWidth = 5;
    mapCtx.strokeStyle = "Blue";
    for (var i = 0; i < mazeWalls.length; i++) {
        mapCtx.beginPath();
        mapCtx.moveTo(mazeWalls[i].leftPoint.x, mazeWalls[i].leftPoint.y);
        mapCtx.lineTo(mazeWalls[i].rightPoint.x, mazeWalls[i].rightPoint.y);
        mapCtx.stroke();
    }
    mapCtx.lineWidth = width;

    for (var i = intersections.length - 1; i >= 0; i--) {
        if (intersections[i] != null) {
            ctx.fillStyle = "black";
            mapCtx.beginPath();
            mapCtx.arc(intersections[i].x, intersections[i].y, 4, 0, 2 * Math.PI);
            mapCtx.fill();

            var dist = intersections[i].Sub(player.pos).Magnitude();
            var grey = 255 - dist;
            ctx.fillStyle = `rgb(${grey}, ${grey}, ${grey})`;
            ctx.fillRect(mainCanvas.width - ((mainCanvas.width / numRays) * (i + 1)), mainCanvas.height / 2 - ((mainCanvas.height / 2) / (dist / 70)),
             mainCanvas.width / numRays, 2 * ((mainCanvas.height / 2) / (dist / 70)));
        }
    }


    requestAnimationFrame(Draw);
}

class Player {
    constructor(x, y, viewDirection, FOVAngle) {
        this.pos = new Vec2(x, y);
        this.viewDirection = viewDirection;
        this.FOVAngle = FOVAngle;
    }
}

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    GetQuadrant() {
        if (this.x >= 0 && this.y >= 0) {
            return 1;
        }
        else if (this.x < 0 && this.y >= 0) {
            return 2;
        }
        else if (this.x < 0 && this.y < 0) {
            return 3;
        }
        else if (this.x >= 0 && this.y < 0) {
            return 4;
        }
    }

    Magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    Normalize() {
        return new Vec2(this.x, this.y).Div(this.Magnitude());
    }
    Dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    Add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }
    Sub(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }
    Mul(num) {
        return new Vec2(this.x * num, this.y * num);
    }
    Div(num) {
        return new Vec2(this.x / num, this.y / num);
    }
}

class Line {
    //y = slope(x - offX) + offY
    constructor(point1, point2) {
        var leftX = Math.min(point1.x, point2.x);
        if (point1.x == leftX) {
            this.leftPoint = point1;
            this.rightPoint = point2;
        }
        else {
            this.leftPoint = point2;
            this.rightPoint = point1;
        }

        this.slope = (this.rightPoint.y - this.leftPoint.y) / (this.rightPoint.x - this.leftPoint.x);
        this.offX = this.leftPoint.x;
        this.offY = this.leftPoint.y;
    }

    Evaluate(x) {
        return this.slope * (x - this.offX) + this.offY;
    }

    IntersectingPointLine(line) {
        var xValue = ((line.offY - this.offY - line.slope * line.offX + this.slope * this.offX) / (this.slope - line.slope));
        return new Vec2(xValue, this.Evaluate(xValue));
    }
    IntersectingPointLineRaw(slope, offX, offY) {
        var xValue = ((offY - this.offY - slope * offX + this.slope * this.offX) / (this.slope - slope));
        return new Vec2(xValue, this.Evaluate(xValue));
    }
}

function CanvasClick() {
    mainCanvas.requestPointerLock();
}

document.addEventListener("pointerlockchange", function () {
    if (document.pointerLockElement === mainCanvas) {
        isPointerCaptured = true;
    }
    else {
        isPointerCaptured = false;
    }
});

document.addEventListener("mousemove", function (e) {
    if (isPointerCaptured) {
        player.viewDirection -= e.movementX / 300;
    }
})

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp") {
        keysHeld[keyCodes.Up] = true;
    }
    if (e.key == "ArrowDown") {
        keysHeld[keyCodes.Down] = true;
    }
    if (e.key == "ArrowLeft") {
        keysHeld[keyCodes.Left] = true;
    }
    if (e.key == "ArrowRight") {
        keysHeld[keyCodes.Right] = true;
    }
    if (e.key == "w") {
        keysHeld[keyCodes.W] = true;
    }
    if (e.key == "a") {
        keysHeld[keyCodes.A] = true;
    }
    if (e.key == "s") {
        keysHeld[keyCodes.S] = true;
    }
    if (e.key == "d") {
        keysHeld[keyCodes.D] = true;
    }
    if (e.key == "r") {
        keysHeld[keyCodes.R] = true;
    }
    if (e.key == "l") {
        keysHeld[keyCodes.L] = true;
    }
});
document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowUp") {
        keysHeld[keyCodes.Up] = false;
    }
    if (e.key == "ArrowDown") {
        keysHeld[keyCodes.Down] = false;
    }
    if (e.key == "ArrowLeft") {
        keysHeld[keyCodes.Left] = false;
    }
    if (e.key == "ArrowRight") {
        keysHeld[keyCodes.Right] = false;
    }
    if (e.key == "w") {
        keysHeld[keyCodes.W] = false;
    }
    if (e.key == "a") {
        keysHeld[keyCodes.A] = false;
    }
    if (e.key == "s") {
        keysHeld[keyCodes.S] = false;
    }
    if (e.key == "d") {
        keysHeld[keyCodes.D] = false;
    }
    if (e.key == "r") {
        keysHeld[keyCodes.R] = false;
    }
    if (e.key == "l") {
        keysHeld[keyCodes.L] = false;
    }
});