InportJSFile("../../../../overarching/libraries/vectors.js");
InportJSFile("../../../../overarching/libraries/matricies.js");
InportJSFile("../../../../overarching/libraries/interpolation.js");

const keys = {
    W: 0, A: 1, S: 2, D: 3, Up: 4, Down: 5, Right: 6, Left: 7, Z: 8, X: 9,
    Equal: 10, Minus: 11, Zero: 12
};
var keysDown = [false, false, false, false, false, false, false, false, false, false, false, false,
    false];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var mousePoint = null;
var isHoldingMouse = false;
var isInteractingWithCanvas = true;
var draggingIndex = null;
var draggingLine = false;
var points = [];
var newPointPos = [];
var transitionAmount = 0;

var offset = null;
var zoom = 1;

var transformationMatrix = null;

function LoadStuff() {
    mousePoint = new Vec2(0, 0);
    isHoldingMouse = false;
    draggingIndex = null;
    draggingLine = false;
    points = [];
    newPointPos = [];
    transitionAmount = 0;

    offset = new Vec2(0, 0);
    zoom = 1;

    transformationMatrix = new Matrix(2, 2);

    setInterval(Update, 10);
    requestAnimationFrame(Draw);
}

function Update() {
    if (isInteractingWithCanvas) {
        if (keysDown[keys.W] || keysDown[keys.Up]) {
            offset.y += (4) / zoom;
        }
        if (keysDown[keys.S] || keysDown[keys.Down]) {
            offset.y -= (4) / zoom;
        }
        if (keysDown[keys.D] || keysDown[keys.Right]) {
            offset.x -= (4) / zoom;
        }
        if (keysDown[keys.A] || keysDown[keys.Left]) {
            offset.x += (4) / zoom;
        }

        if (keysDown[keys.Z]) {
            zoom *= 1.01;
        }
        if (keysDown[keys.X]) {
            zoom *= 0.99;
        }

        if (keysDown[keys.Equal]) {
            zoom = 1;
        }
        if (keysDown[keys.Minus]) {
            offset.x = 0;
            offset.y = 0;
        }
        if (keysDown[keys.Zero]) {
            zoom = 1;
            offset.x = 0;
            offset.y = 0;
        }
    }

    if (newPointPos.length != 0) {
        for (var i = 0; i < points.length; i++) {
            points[i].pos.x = LinearInterpolate(newPointPos[i].old.x, newPointPos[i].new.x, transitionAmount);
            points[i].pos.y = LinearInterpolate(newPointPos[i].old.y, newPointPos[i].new.y, transitionAmount);
        }
        transitionAmount += 0.001;
    }
    if (transitionAmount >= 1) {
        transitionAmount = 0;
        newPointPos.length = 0;
    }
}

function Draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    for (var i = 0; i < points.length; i++) {
        ctx.beginPath();
        var wPos = WorldToScreen(points[i].pos);
        ctx.arc(wPos.x, wPos.y, 8, 0, 2 * Math.PI);
        ctx.fill();

        if (points[i].CI != null) {
            ctx.strokeStyle = "white"
            ctx.moveTo(wPos.x, wPos.y);
            var wPos2 = WorldToScreen(points[points[i].CI].pos);
            ctx.lineTo(wPos2.x, wPos2.y);
            ctx.stroke();
        }
    }

    ctx.strokeStyle = "white";
    if (draggingLine) {
        var wPos = WorldToScreen(points[draggingIndex].pos);
        ctx.moveTo(wPos.x, wPos.y);
        if (mousePoint != null) {
            ctx.lineTo(mousePoint.x, mousePoint.y);
            ctx.stroke();
        }
    }

    requestAnimationFrame(Draw);
}

function TransformPoints() {
    if (newPointPos.length != 0) {
        for (var i = 0; i < newPointPos.length; i++) {
            points[i].pos = newPointPos[i].new;
        }
    }
    newPointPos = [];
    transitionAmount = 0;
    var mv = document.getElementsByClassName("mv");
    transformationMatrix.SetValue(0, 0, parseFloat(mv[0].value));
    transformationMatrix.SetValue(0, 1, parseFloat(mv[1].value));
    transformationMatrix.SetValue(1, 0, parseFloat(mv[2].value));
    transformationMatrix.SetValue(1, 1, parseFloat(mv[3].value));
    for (var i = 0; i < points.length; i++) {
        newPointPos.push({ old: points[i].pos, new: transformationMatrix.Eval(points[i].pos) });
    }
}

function WorldToScreen(p) {
    return (p.Add(offset).Mul(zoom)).Add(new Vec2(canvas.width / 2, canvas.height / 2).Mul(1 - zoom));
}

function ScreenToWorld(p) {
    return p.Sub(new Vec2(canvas.width / 2, canvas.height / 2).Mul(1 - zoom)).Div(zoom).Sub(offset);
}

document.addEventListener("mousemove", function (e) {
    if (mousePoint != null) {
        mousePoint.x = e.clientX;
        mousePoint.y = e.clientY;
    }

    if (isHoldingMouse && draggingIndex != null && !draggingLine) {
        points[draggingIndex].pos = ScreenToWorld(mousePoint);
        //points[draggingIndex].pos.x = mousePoint.x;
        //points[draggingIndex].pos.y = mousePoint.y;
    }
});

//prevents right-clicking on the canvas createing an option menu
canvas.oncontextmenu = function (e) {
    e.preventDefault();
};

document.addEventListener("mousedown", function (e) {
    if (isInteractingWithCanvas) {
        isHoldingMouse = true;
        draggingIndex = null;

        var index = null;
        var isInPoint = false;
        for (var i = 0; i < points.length; i++) {
            var screenPos = WorldToScreen(points[i].pos);
            var diffX = e.clientX - screenPos.x;
            var diffY = e.clientY - screenPos.y;
            if (Math.sqrt(diffX * diffX + diffY * diffY) < 8) {
                index = i;
                isInPoint = true;
                break;
            }
        }
        if (e.button == 0) {
            if (isInPoint) {
                draggingIndex = index;
            }
            else {
                points.push({ pos: ScreenToWorld(new Vec2(e.clientX, e.clientY)), CI: null });
            }
        }
        else if (e.button == 2) {
            if (isInPoint) {
                draggingLine = true;
                draggingIndex = index;
            }
        }
    }
});

document.addEventListener("mouseup", function (e) {
    isHoldingMouse = false;
    if (draggingLine) {
        var index = null;
        var isInPoint = false;
        for (var i = 0; i < points.length; i++) {
            var screenPos = WorldToScreen(points[i].pos);
            var diffX = e.clientX - screenPos.x;
            var diffY = e.clientY - screenPos.y;
            if (Math.sqrt(diffX * diffX + diffY * diffY) < 8) {
                index = i;
                isInPoint = true;
                break;
            }
        }
        if (isInPoint) {
            points[draggingIndex].CI = index;
        }
    }
    draggingLine = false;
});

document.addEventListener("keydown", function (e) {
    if (e.key == "w") { keysDown[keys.W] = true; }
    if (e.key == "ArrowUp") { keysDown[keys.Up] = true; }
    if (e.key == "s") { keysDown[keys.S] = true; }
    if (e.key == "ArrowDown") { keysDown[keys.Down] = true; }
    if (e.key == "a") { keysDown[keys.A] = true; }
    if (e.key == "ArrowLeft") { keysDown[keys.Left] = true; }
    if (e.key == "d") { keysDown[keys.D] = true; }
    if (e.key == "ArrowRight") { keysDown[keys.Right] = true; }
    if (e.key == "z") { keysDown[keys.Z] = true; }
    if (e.key == "x") { keysDown[keys.X] = true; }
    if (e.key == "=") { keysDown[keys.Equal] = true; }
    if (e.key == "-") { keysDown[keys.Minus] = true; }
    if (e.key == "0") { keysDown[keys.Zero] = true; }
});
document.addEventListener("keyup", function (e) {
    if (e.key == "w") { keysDown[keys.W] = false; }
    if (e.key == "ArrowUp") { keysDown[keys.Up] = false; }
    if (e.key == "s") { keysDown[keys.S] = false; }
    if (e.key == "ArrowDown") { keysDown[keys.Down] = false; }
    if (e.key == "a") { keysDown[keys.A] = false; }
    if (e.key == "ArrowLeft") { keysDown[keys.Left] = false; }
    if (e.key == "d") { keysDown[keys.D] = false; }
    if (e.key == "ArrowRight") { keysDown[keys.Right] = false; }
    if (e.key == "z") { keysDown[keys.Z] = false; }
    if (e.key == "x") { keysDown[keys.X] = false; }
    if (e.key == "=") { keysDown[keys.Equal] = false; }
    if (e.key == "-") { keysDown[keys.Minus] = false; }
    if (e.key == "0") { keysDown[keys.Zero] = false; }
});