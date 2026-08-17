var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var cube = null;

function LoadStuff() {
    //for (i = 0; i < 800; i++) {
    //    points.push(new Point());
    //}
    cube = new Cube(100, 100, 100, 100, 100, 100);
    setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cube.Update();
        /*for (i = 0; i < points.length; i++) {
            points[i].Draw();
        }*/
    }, 10);
}

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowRight" || e.key == "d") {
        cube.x += 10;
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
        cube.x -= 10;
    }
    if (e.key == "ArrowUp" || e.key == "w") {
        cube.y -= 10;
    }
    if (e.key == "ArrowDown" || e.key == "s") {
        cube.y += 10;
    }
});
document.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        cube.z += 10;
    }
    else {
        cube.z -= 10;
    }
});

var perspective = canvas.width * .5;
var projectionCenterX = canvas.width / 2;
var projectionCenterY = canvas.height / 2;
var points = [];

class Point {
    constructor(x, y, z) {
        this.position = new Vector3(x, y, z);
        //this.x = (Math.random() - .5) * canvas.width;
        //this.y = (Math.random() - .5) * canvas.height;
        //this.z = Math.random() * canvas.width;
        this.radius = 10;

        this.xProjected = 0;
        this.yProjected = 0;
        this.scaleProjected = 0;
    }
    Project() {
        this.scaleProjected = perspective / (perspective + this.position.z);
        this.xProjected = (this.position.x * this.scaleProjected) + projectionCenterX;
        this.yProjected = (this.position.y * this.scaleProjected) + projectionCenterY;
    }
    Update() {
        //this.position.x += Math.floor(Math.random() * 9) - 4;
        //this.position.y += Math.floor(Math.random() * 9) - 4;
        //this.position.z += Math.floor(Math.random() * 9) - 4;
        this.Project();
        //ctx.fillStyle = "rgba(255, 255, 255, " + Math.abs(1 - this.position.z / canvas.width) + ")";
        //ctx.fillRect(this.xProjected - this.radius, this.yProjected - this.radius, this.radius * 2 * this.scaleProjected, this.radius * 2 * this.scaleProjected);
    }
}

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
            this.points[n].Update();
        }
        for (var n = 0; n < this.lines.length; n++) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(this.points[this.lines[n][0]].xProjected, this.points[this.lines[n][0]].yProjected);
            ctx.lineTo(this.points[this.lines[n][1]].xProjected, this.points[this.lines[n][1]].yProjected);
            ctx.stroke();
        }
    }
}