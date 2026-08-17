var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var verticies = [[100, 100], [200, 200], [125, 125], [175, 175]];

ctx.strokeStyle = "white";

ctx.rect(verticies[0][0], verticies[0][1], 100, 100);
ctx.stroke();
ctx.rect(verticies[2][0], verticies[2][1], 50, 50);
ctx.stroke();
