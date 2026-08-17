var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = 100;
canvas.width = canvas.height * (window.innerWidth / window.innerHeight);

var imageData = new ImageData(canvas.width, canvas.height);

var playerPoint = { x: 0, y: 0 };

function LoadStuff() {
    setInterval(UpdateMain, 10);
}

function UpdateMain() {
    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            var isAStar = false;
            seed = (y + playerPoint.y) * (x + playerPoint.x);
            isAStar = seededRand() < .01;
            console.log(seededRand() < .5);
            if (isAStar) {
                SetPixel(x, y, new Color(255, 255, 255));
            }
            else {
                SetPixel(x, y, new Color(0, 0, 0));
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "ArrowUp" || "w":
            playerPoint.y -= 10;
            break;
        case "ArrowDown" || "s":
            playerPoint.y += 10;
            break;
        case "ArrowLeft" || "a":
            playerPoint.x -= 10;
            break;
        case "ArrowRight" || "d":
            playerPoint.x += 10;
            break;
        default: break;
    }
})

function SetPixel(x, y, color) {
    var index = y * (canvas.width * 4) + x * 4;
    imageData.data[index] = color.red;
    imageData.data[index + 1] = color.green;
    imageData.data[index + 2] = color.blue;
    imageData.data[index + 3] = color.alpha;
}

var seed = 1;
function seededRand() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

class Color {
    constructor(red, green, blue, alpha = 255) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}