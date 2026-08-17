var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 5;
canvas.height = window.innerHeight;

//var octave1 = [];
//var octave2 = [];
var points = [];
var pointsCopy = [];
var octaves = 3;

function LoadStuff() {
    for (i = 0; i < 10; i++) {
        points.push(Math.floor(Math.random() * 300));
    }
    for (o = 1; o <= octaves; o++) {
        pointsCopy = [];
        for (i = 0; i < points.length - 1; i++) {
            for (n = 0; n < 10; n++) {
                pointsCopy.push(CosineInterpolate(points[i], points[i + 1], n * (1 / 10)) + Math.floor(Math.random() * (300 / o)));
            }
        }
        points = pointsCopy;

    }
    for (i = 0; i < points.length - 1; i++) {
        ctx.fillRect(i * 3, points[i], 5, 5);
        /*for (n = 0; n < 50; n++) {
            ctx.fillRect((i * 50 + n) / 10,canvas.height -  CosineInterpolate(points[i], points[i + 1], n * (1 / 50)), 5, 5);
        }*/
    }
    /*for (i = 0; i < 28; i++) {
        octave1.push(Math.floor(Math.random() * 150));
    }
    for (i = 0; i < 280; i++) {
        octave2.push(Math.floor(Math.random() * 25) - 10);
    }
    for (i = 0; i < octave1.length - 1; i++) {
        for (n = 0; n < 10; n++) {
            points.push(CosineInterpolate(octave1[i], octave1[i + 1], n * (1 / 10)) + octave2[i + n]);
        }
    }
    for(i = 0; i < points.length; i++){
        for(n = 0; n < 50; n++){
            ctx.fillRect((i * 50 + n) / 2,canvas.height - ((CosineInterpolate(points[i], points[i + 1], n * (1 / 50))) + 20), 5, 5);
        }
    }*/
}

function CosineInterpolate(y1, y2, mu) {
    var mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
    return (y1 * (1 - mu2)) + (y2 * mu2);
}