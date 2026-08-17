var canvas = document.getElementById("drawPlace");
var c = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

for(var x = 0; x < canvas.width; x++){
    for(var y = 0; y <= canvas.height; y++){
        c.fillRect(x,Math.pow(x - 100,2),1,1)
    }
}






c.fillStyle = "red"
c.strokeStyle = "orange"

c.moveTo(150,0);
c.lineTo(190,20);
c.lineTo(110,20);
c.lineTo(150,0);
c.stroke();
c.moveTo(180,20);
c.lineTo(180,100);
c.lineTo(120,100);
c.lineTo(120,20);
c.stroke();
/*
c.moveTo(140,100);
c.lineTo(140,50);
c.lineTo(160,50);
c.lineTo(160,100);
c.lineTo(140,100);

c.stroke();
*/

c.fillRect(140,100,20,-50)