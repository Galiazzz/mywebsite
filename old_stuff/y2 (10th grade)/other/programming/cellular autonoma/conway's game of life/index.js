var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var cells = [];

var isPaused = false;

function LoadStuff() {
    ctx.fillStyle = "white";
    for (var i = 0; i < canvas.width / 10; i++) {
        cells[i] = [];
        for (var n = 0; n < canvas.height / 10; n++) {
            cells[i][n] = Math.round(Math.random());
        }
    }

    ctx.strokeStyle = "rgb(50, 50, 50)";
    Draw();
    setInterval(function () {
        if (!isPaused) {
            Update();
        }
    }, 10);
}

function Update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var stepCells = [];
    for (var i = 0; i < canvas.width / 10; i++) {
        stepCells[i] = [];
        for (var n = 0; n < canvas.height / 10; n++) {
            stepCells[i][n] = 0;
        }
    }
    for (var x = 1; x < cells.length - 1; x++) {
        for (var y = 1; y < cells[x].length - 1; y++) {
            var numAliveNeibors = 0;
            numAliveNeibors += cells[x - 1][y - 1];
            numAliveNeibors += cells[x][y - 1];
            numAliveNeibors += cells[x + 1][y - 1];
            numAliveNeibors += cells[x - 1][y];
            numAliveNeibors += cells[x + 1][y];
            numAliveNeibors += cells[x - 1][y + 1];
            numAliveNeibors += cells[x][y + 1];
            numAliveNeibors += cells[x + 1][y + 1];

            if ((numAliveNeibors == 2 || numAliveNeibors == 3) && cells[x][y] == 1) {
                stepCells[x][y] = cells[x][y];
            }
            else if (cells[x][y] == 0 && numAliveNeibors == 3) {
                stepCells[x][y] = 1;
            }
            else {
                stepCells[x][y] = 0;
            }
        }
    }
    cells = stepCells;
    Draw();
}

function Draw() {
    
    for (var x = 0; x < cells.length; x++) {
        for (var y = 0; y < cells[x].length; y++) {
            if (cells[x][y] == 1) {
                ctx.fillRect(x * 10, y * 10, 10, 10);
            }
            ctx.beginPath();
            ctx.rect(x * 10, y * 10, 10, 10);
            ctx.stroke();
        }
    }
}

document.addEventListener("mousedown", function (e) {
    var x = Math.floor(e.clientX / 10);
    var y = Math.floor(e.clientY / 10);

    if (e.which == 1) {
        cells[x][y] = 1;
    }
    else if(e.which == 2){
        cells[x][y] = 0;
    }
    else if (e.which == 3) {
        var numAliveNeibors = 0;
        numAliveNeibors += cells[x - 1][y - 1];
        numAliveNeibors += cells[x][y - 1];
        numAliveNeibors += cells[x + 1][y - 1];
        numAliveNeibors += cells[x - 1][y];
        numAliveNeibors += cells[x + 1][y];
        numAliveNeibors += cells[x - 1][y + 1];
        numAliveNeibors += cells[x][y + 1];
        numAliveNeibors += cells[x + 1][y + 1];

        alert(numAliveNeibors);
    }
    Draw();
});

document.addEventListener("keydown", function (e) {
    if (e.key == "p") {
        switch (isPaused) {
            case true: isPaused = false; break;
            case false: isPaused = true; break;
        }
    }
    if (e.key == "u") {
        Update();
    }
    if (e.key == "Backspace") {
        for (var i = 0; i < cells.length; i++) {
            for (var n = 0; n < cells[i].length; n++) {
                cells[i][n] = 0;
            }
        }
        Draw();
    }
});