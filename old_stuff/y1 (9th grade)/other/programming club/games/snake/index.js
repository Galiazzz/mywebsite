var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var snakeXs = [10];
var snakeYs = [10];
var score = 0;
var scale = 30;
var direction = "right";
var appleX = 20;
var appleY = 10;
var isAlive = true;

setInterval(function () {
    Update();
}, 300);

function LoadStuff() {
    snakeXs = [10];
    snakeYs = [10];
    score = 0;
    scale = 30;
    direction = "right";
    appleX = 20;
    appleY = 10;
    isAlive = true;
    document.getElementById("redo").style.display = "none";
    document.getElementById("score").innerText = "score: " + score;
}

function Update() {
    if (isAlive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (snakeXs[0] == appleX && snakeYs[0] == appleY) {
            score++;
            var isAvalible = false;
            var isOverLapping = false;
            while (!isAvalible) {
                isOverLapping = false;
                appleX = Math.floor(Math.random() * 20 + 2);
                appleY = Math.floor(Math.random() * 20 + 2);
                for(i = 0; i < snakeXs.length; i++){
                    if(appleX == snakeXs[i] && appleY == snakeYs[i]){
                        isOverLapping = true;
                    }
                }
                if(!isOverLapping){
                    isAvalible = true;
                }
                else{
                    isAvalible = false;
                }
            }
            document.getElementById("score").innerText = "score: " + score;
        }

        switch (direction) {
            case "up":
                snakeXs.unshift(snakeXs[0]);
                snakeYs.unshift(snakeYs[0] - 1);
                break;
            case "left":
                snakeXs.unshift(snakeXs[0] - 1);
                snakeYs.unshift(snakeYs[0]);
                break;
            case "down":
                snakeXs.unshift(snakeXs[0]);
                snakeYs.unshift(snakeYs[0] + 1);
                break;
            case "right":
                snakeXs.unshift(snakeXs[0] + 1);
                snakeYs.unshift(snakeYs[0]);
                break
            default: break;
        }

        snakeXs.length = score + 1;
        snakeYs.length = score + 1;

        ctx.fillStyle = "red";
        ctx.fillRect(appleX * scale, appleY * scale, scale, scale);
        ctx.fillStyle = "black";
        for (i = 0; i < snakeXs.length; i++) {
            ctx.fillRect(snakeXs[i] * scale, snakeYs[i] * scale, scale, scale);
        }
        ctx.fillStyle = "green";
        for (i = 0; i < snakeXs.length; i++) {
            ctx.fillRect(snakeXs[i] * scale + 2, snakeYs[i] * scale + 2, scale - 4, scale - 4);
        }


        if (snakeXs[0] > canvas.width / scale || snakeXs[0] < 0 || snakeYs[0] > canvas.height / scale || snakeYs[0] < 0) {
            isAlive = false;
        }

        for (i = 1; i < snakeXs.length; i++) {
            if (snakeXs[0] == snakeXs[i] && snakeYs[0] == snakeYs[i]) {
                isAlive = false;
            }
        }
    }
    else {
        document.getElementById("redo").style.display = "inline-block";
    }
}

function Death() {

}

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" || e.key == "w") {
        if (direction != "down") {
            direction = "up";
            Update();
        }
    }
    else if (e.key == "ArrowDown" || e.key == "s") {
        if (direction != "up") {
            direction = "down";
            Update();
        }
    }
    else if (e.key == "ArrowRight" || e.key == "d") {
        if (direction != "left") {
            direction = "right";
            Update();
        }
    }
    else if (e.key == "ArrowLeft" || e.key == "a") {
        if (direction != "right") {
            direction = "left"
            Update();
        }
    }

}, true);