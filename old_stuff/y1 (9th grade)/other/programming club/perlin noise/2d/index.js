var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var numbers = [];
var size = 30;

function LoadStuff() {
    for (i = 0; i < size; i++) {
        numbers[i] = [];
        for (n = 0; n < size; n++) {
            numbers[i][n] = Math.floor(Math.random() * 2) * 255;
        }
    }
    for (o = 0; o < 3; o++) {
        for (i = 1; i < numbers.length - 1; i++) {
            for (n = 0; n < 2; n++) {
                var value = 0;
                for (j = -1; j <= 1; j++) {
                    for (k = 0; k <= 1; k++) {
                        value += numbers[i + j][n + k];
                    }
                }
                numbers[i][n] = value / 6;
            }
        }
        for (i = 0; i < numbers.length - 1; i++) {
            for (n = numbers.length - 1; n < numbers.length - 2; n--) {
                var value = 0;
                for (j = -1; j <= 1; j++) {
                    for (k = 0; k <= 0; k++) {
                        value += numbers[i + j][n + k];
                    }
                }
                numbers[i][n] = value / 6;
            }
        }
        for (i = 1; i < numbers.length - 1; i++) {
            for (n = 1; n < numbers[i].length - 1; n++) {
                var value = 0;
                for (j = -1; j <= 1; j++) {
                    for (k = -1; k <= 1; k++) {
                        value += numbers[i + j][n + k];
                    }
                }
                numbers[i][n] = value / 9;
            }
        }
    }

    DrawNumbers();
}

function DrawNumbers() {
    for (i = 0; i < numbers.length; i++) {
        for (n = 0; n < numbers[i].length; n++) {
            ctx.fillStyle = "rgb( " + numbers[i][n] + ", " + numbers[i][n] + "," + numbers[i][n] + " )";
            ctx.fillRect(i * 20, n * 20, 20, 20);
        }
    }
}