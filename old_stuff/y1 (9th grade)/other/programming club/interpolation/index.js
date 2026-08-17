var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var points = [[], []];
var type = "cosine";
var dim = 1;
document.getElementById("options").style.left = "-300px";

function Graph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    type = document.getElementById("type").value;
    dim = parseInt(document.getElementById("dimention").value);

    if (dim == 1) {
        for (i = 0; i < canvas.width / 50; i++) {
            points[0][i] = Math.floor(Math.random() * 60) + 10
        }

        for (i = 0; i < points[0].length; i++) {
            ctx.fillStyle = "Green";
            ctx.fillRect(i * 50, (canvas.height - points[0][i]) - 50, 5, 5);
        }
        ctx.fillStyle = "black";

        if (type == "linear") {
            for (i = 0; i < points[0].length - 1; i++) {
                for (n = 0; n < 50; n++) {
                    ctx.fillRect(i * 50 + n, (canvas.height - LinearInterpolate(points[0][i], points[0][i + 1], n * (1 / 50))) - 50, 2, 2);
                }
            }
        }
        else if (type == "cosine") {
            for (i = 0; i < points[0].length - 1; i++) {
                for (n = 0; n < 50; n++) {
                    ctx.fillRect(i * 50 + n, (canvas.height - CosineInterpolate(points[0][i], points[0][i + 1], n * (1 / 50))) - 50, 2, 2);
                }
            }
        }
        else if(type == "Polynomial"){
            for (i = 0; i < points[0].length - 1; i++) {
                for (n = 0; n < 50; n++) {
                    ctx.fillRect(i * 50 + n, (canvas.height - PolynomialInterpolate(points[0][i], points[0][i + 1], n * (1 / 50))) - 50, 2, 2);
                }
            }
        }
    }
    else {
        for (i = 0; i < canvas.width / 50; i++) {
            points[0][i] = i + Math.floor(Math.random() * 200) - 100
        }
        for (i = 0; i < canvas.height / 50; i++) {
            points[1][i] =  i + Math.floor(Math.random() * 200) - 100
        }
        for (i = 0; i < points[0].length; i++) {
            ctx.fillStyle = "Green";
            ctx.fillRect(points[1][i], (canvas.height - points[0][i]) - 50, 5, 5);
        }
        ctx.fillStyle = "black";
        if (type == "linear") {
            for (i = 0; i < points[0].length - 1; i++) {
                for (n = 0; n < 50; n++) {
                    ctx.fillRect(LinearInterpolate(points[1][i], points[1][i + 1], n * (1 / 50)), (canvas.height - LinearInterpolate(points[0][i], points[0][i + 1], n * (1 / 50))) - 50, 2, 2);
                }
            }
        }
        else if (type == "cosine") {
            for (i = 0; i < points[0].length - 1; i++) {
                for (n = 0; n < 50; n++) {
                    ctx.fillRect(CosineInterpolate(points[1][i], points[1][i + 1], n * (1 / 50)), (canvas.height - CosineInterpolate(points[0][i], points[0][i + 1], n * (1 / 50))) - 50, 2, 2);
                }
            }
        }
    }
}

function LinearInterpolate(y1, y2, mu) {
    return y1 * (1 - mu) + y2 * mu;
}

function CosineInterpolate(y1, y2, mu) {
    var mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
    return (y1 * (1 - mu2)) + (y2 * mu2);
}

function PolynomialInterpolate(y1, y2, mu){
    return ((y1 + ((y2 - y1) + mu)) - y1) * Math.pow(((y1 + ((y2 - y1) + mu)) - y2), 1)// + LinearInterpolate(y1, y2, mu);
}

document.addEventListener("keydown", function (e) {
    if (e.key == "o") {

        switch (document.getElementById("options").style.left) {
            case "0px":
                document.getElementById("options").style.left = "-300px";
                break;
            case "-300px":
                document.getElementById("options").style.left = "0px";
                break;
            default: break;
        }

    }
})