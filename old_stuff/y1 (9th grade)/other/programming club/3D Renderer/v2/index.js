var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var cube1 = null;
var camera = { x: 50, y: 5, z: 4 };
var camRotate = { x: 0, y: 0, z: 0 };
var pinhole = { x: 100, y: 100, z: 4};

function LoadStuff() {
    cube1 = new Cube(20, 10, 3, 50, 50, 4);
    setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cube1.Update();
    }, 10);
}

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" || e.key == "w") {
        cube1.y -= 100;
    }
    if (e.key == "ArrowDown" || e.key == "s") {
        cube1.y += 100;
    }
    if (e.key == "ArrowRight" || e.key == "d") {
        cube1.x += 10;
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
        cube1.x -= 10;
    }
});

document.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        cube1.z += 1;
    }
    else {
        cube1.z -= 1;
    }
});

class Cube {
    constructor(x, y, z, height, width, depth) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.points = [
            new Point(x, y, z), new Point(x + width, y, z), new Point(x, y + height, z), new Point(x, y, z + depth),
            new Point(x + width, y + height, z), new Point(x + width, y, z + depth), new Point(x, y + height, z + depth),
            new Point(x + width, y + height, z + depth)
        ];
        this.lines = [
            [0, 1],
            [0, 2],
            [0, 3],
            [1, 4],
            [2, 4],
            [2, 6],
            [3, 6],
            [3, 5],
            [1, 5],
            [4, 7],
            [5, 7],
            [6, 7]
        ]
        this.rotaion = 0;
    }
    Update() {
        this.points = [
            new Point(this.x, this.y, this.z), new Point(this.x + this.width, this.y, this.z), new Point(this.x, this.y + this.height, this.z), new Point(this.x, this.y, this.z + this.depth),
            new Point(this.x + this.width, this.y + this.height, this.z), new Point(this.x + this.width, this.y, this.z + this.depth), new Point(this.x, this.y + this.height, this.z + this.depth),
            new Point(this.x + this.width, this.y + this.height, this.z + this.depth)
        ];


        for (var n = 0; n < this.points.length; n++) {
            this.points[n].Project();
        }
        for (var n = 0; n < this.lines.length; n++) {
            //ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(this.points[this.lines[n][0]].projectedX, this.points[this.lines[n][0]].projectedY);
            ctx.lineTo(this.points[this.lines[n][1]].projectedX, this.points[this.lines[n][1]].projectedY);
            ctx.stroke();
        }
    }
}
class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Project() {
        var C = { x: Math.cos(camRotate.x), y: Math.cos(camRotate.y), z: Math.cos(camRotate.z) };
        var S = { x: Math.sin(camRotate.x), y: Math.sin(camRotate.y), z: Math.sin(camRotate.z) };
        var Diff = { x: this.x - camera.x, y: this.y - camera.y, z: this.z - camera.z };

        var step1 = {
            x: camera.y * (S.z * Diff.y + C.z * Diff.x) - S.y * Diff.z,
            y: S.x * (C.y * Diff.z + S.y * (S.z * Diff.y + C.z * Diff.x)) + C.x * (C.z * Diff.y - S.z * Diff.x),
            z: C.x * (C.y * Diff.z + S.y * (S.z * Diff.y + C.z * Diff.x)) - S.x * (C.z * Diff.y - S.z * Diff.x)
        }

        this.projectedX = (pinhole.z / step1.z) * step1.x + pinhole.x;
        this.projectedY = (pinhole.z / step1.z) * step1.y + pinhole.y;

        //ctx.fillRect(this.projectedX, this.projectedY, 15, 15);
    }
}