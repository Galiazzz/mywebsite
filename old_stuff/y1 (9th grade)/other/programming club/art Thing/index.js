//var canvasArea = document.getElementById("canvasArea");
var isMouseDown = false;

var canvas = document.getElementById("layer1");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


function LoadStuff() {
    FindColor();
}

document.addEventListener("mousedown", function (e) {
    isMouseDown = true;
    CreateDot(e);
});

document.addEventListener("mouseup", function () {
    isMouseDown = false;
});

document.addEventListener("mousemove", function (e) {
    if (isMouseDown) {
        CreateDot(e);
    }
});

function CreateDot(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    ctx.moveTo(x, y);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function FindColor() {
    ctx.fillStyle = "rgba(" + document.getElementById("red").value + "," + document.getElementById("green").value + "," + document.getElementById("blue").value + "," + (document.getElementById("transparency").value / 100) + ")";
}

function Download(){
    document.getElementById("download").href = canvas.toDataURL("image/png");
    document.getElementById("download").download = "image.png";
}

function Transparent(){
    if(document.getElementById("backTrans").checked){
        canvas.style.backgroundColor = "rgba(150, 150, 150, 0)"
    }
    else{
        canvas.style.backgroundColor = "rgba(150, 150, 150, 1)"
    }
}