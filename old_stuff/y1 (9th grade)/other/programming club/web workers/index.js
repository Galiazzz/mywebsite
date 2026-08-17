var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var worker = null;

function LoadStuff() {
    worker = new Worker("workers/worker1.js");
    ctx.font = "20px Arial";

    worker.onmessage = function (e) {
        console.log(e.data[0]);
        if (!e.data[1]) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText(e.data[0], 100, 100);
        } else {
            ctx.fillText(e.data[0], 100, 200);
        }
    }
}

