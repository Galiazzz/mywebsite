var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight / 2;
canvas.width = canvas.height * (window.innerWidth / window.innerHeight);

function LoadStuff() {
    setInterval(function () {
        var imageData = ctx.createImageData(canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            var rand = Math.floor(Math.random() * 255);
            imageData.data[i] = Math.floor(Math.random() * 255);
            imageData.data[i + 1] = Math.floor(Math.random() * 255);
            imageData.data[i + 2] = Math.floor(Math.random() * 255);
            imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }, 10);
}