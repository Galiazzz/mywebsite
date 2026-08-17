var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var begins = [[canvas.width / 2, canvas.height / 2, 0]];
var angleS = 0;
var angleM = 0;
var angleH = 0;

var isPaused = false;
var isLive = true;
var handCount = 3;

function LoadStuff() {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.font = "20px white Arial";

    var date = new Date();
    angleH = ((date.getHours() + 1) % 12) * ((Math.PI / 2) / 3);
    angleM = (date.getMinutes() + 1) * ((Math.PI / 2) / 15);
    angleS = (date.getSeconds() + 1) * ((Math.PI / 2) / 15);

    setInterval(function () {
        if (!isPaused) {
            Update();
        }
    }, 50);

    setInterval(function () {
        if (isLive) {
            var d = new Date();
            angleH = ((d.getHours() + 1) % 12) * ((Math.PI / 2) / 3);
            angleM = (d.getMinutes() + 1) * ((Math.PI / 2) / 15);
            angleS = (d.getSeconds() + 1) * ((Math.PI / 2) / 15);
        }
    }, 10000);
}

function Update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 250, 0, 2 * Math.PI);
    ctx.stroke();
    var theta = 0;
    for (var i = 1; i < 13; i++) {
        theta += (Math.PI / 2) / 3;
        ctx.fillText(i, canvas.width / 2 + Math.sin(theta) * 260 - 5, canvas.height / 2 - Math.cos(theta) * 260 + 5);
    }

    begins = [[canvas.width / 2, canvas.height / 2, 0]];
    var maxCount;
    switch (handCount) {
        case 1: maxCount = 15; break;
        case 2: maxCount = 13; break;
        case 3: maxCount = 8; break;
    }
    for (var i = 1; i <= maxCount; i++) {
        var arr = [];
        ctx.strokeStyle = "hsl(" + (i * 50 + angleS * (180 / Math.PI)) % 360 + ", 100%, 50%)";
        for (var n = 0; n < begins.length; n++) {
            var a;
            ctx.beginPath();
            ctx.moveTo(begins[n][0], begins[n][1]);
            a = [begins[n][0] + Math.cos(begins[n][2] + angleS + (i == 1) * -Math.PI / 2) * (200 * Math.pow(.7, i)), begins[n][1] + Math.sin(begins[n][2] + angleS + (i == 1) * -Math.PI / 2) * (200 * Math.pow(.7, i)), begins[n][2] + angleS + (i == 1) * -Math.PI / 2];
            arr.push(a);
            ctx.lineTo(a[0], a[1]);
            ctx.stroke();
            if (handCount >= 2) {
                ctx.beginPath();
                ctx.moveTo(begins[n][0], begins[n][1]);
                a = [begins[n][0] + Math.cos(begins[n][2] + angleM + (i == 1) * -Math.PI / 2) * (150 * Math.pow(.7, i)), begins[n][1] + Math.sin(begins[n][2] + angleM + (i == 1) * -Math.PI / 2) * (150 * Math.pow(.7, i)), begins[n][2] + angleM + (i == 1) * -Math.PI / 2];
                arr.push(a);
                ctx.lineTo(a[0], a[1]);
                ctx.stroke();
            }
            if (handCount == 3) {
                ctx.beginPath();
                ctx.moveTo(begins[n][0], begins[n][1]);
                a = [begins[n][0] + Math.cos(begins[n][2] + angleH + (i == 1) * -Math.PI / 2) * (100 * Math.pow(.7, i)), begins[n][1] + Math.sin(begins[n][2] + angleH + (i == 1) * -Math.PI / 2) * (100 * Math.pow(.7, i)), begins[n][2] + angleH + (i == 1) * -Math.PI / 2];
                arr.push(a);
                ctx.lineTo(a[0], a[1]);
                ctx.stroke();
            }
        }
        begins = arr;
    }
    angleS += ((Math.PI / 2) / 3) / 100;
    angleM += (((Math.PI / 2) / 3) / 100) / 60;
    angleH += ((((Math.PI / 2) / 3) / 100) / 60) / 60;

}

document.addEventListener("keydown", function (e) {
    if (e.key == "p") {
        switch (isPaused) {
            case true: isPaused = false; break;
            case false: isPaused = true; break;
        }
    }
    if (e.key == "s") {
        Update();
    }
    if (e.key == "r") {
        angleH = 0;
        angleM = 0;
        angleS = 0;

        isLive = false;
    }
    if (e.key == "h") {
        switch (handCount) {
            case 1: handCount = 2; break;
            case 2: handCount = 3; break;
            case 3: handCount = 1; break;
        }
    }
    if (e.key == "t") {
        switch (isLive) {
            case true: isLive = false; break;
            case false: isLive = true; break;
        }
    }
});