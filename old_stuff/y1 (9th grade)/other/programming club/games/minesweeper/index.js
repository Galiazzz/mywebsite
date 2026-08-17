var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var scale = 30;
var boxnum = 10;
var mines = 10;
ctx.strokeStyle = "black"
ctx.fillStyle = "white";
var boxes = [];
var hasDied = false;
var isFirstTime = true;
var minesFound = 0;

function LoadStuff() {
    document.getElementById("YouWin").style.display = "none";
    hasDied = false;
    document.getElementById("restart").style.display = "none";
    canvas.height = (boxnum - 1) * scale;
    canvas.width = (boxnum - 1) * scale;
    for (i = 0; i < boxnum; i++) {
        ctx.moveTo(i * scale, 0);
        ctx.lineTo(i * scale, (boxnum - 1) * scale);
        ctx.stroke();
        ctx.moveTo(0, i * scale);
        ctx.lineTo((boxnum - 1) * scale, i * scale);
        ctx.stroke();
    }
    for (i = 0; i < boxnum; i++) {
        boxes[i] = [];
        for (n = 0; n < boxnum; n++) {
            boxes[i][n] = new box(false, 0, false, i, n);
        }
    }
    for (i = 0; i < mines; i++) {
        boxes[Math.floor(Math.random() * (boxnum - 1))][Math.floor(Math.random() * (boxnum - 1))].ismine = true;
    }
    for (i = 0; i < boxnum; i++) {
        for (n = 0; n < boxnum; n++) {
            boxes[i][n].FindMines();
        }
    }
    if (isFirstTime) {
        isFirstTime = false;
        refreshSliders();
    }
    mines = 0;
    for (i = 0; i < boxnum; i++) {
        for (n = 0; n < boxnum; n++) {
            if (boxes[i][n].ismine) {
                mines++;
            }
        }
    }
    document.getElementById("slideMine").value = mines;
    document.getElementById("viewMine").value = mines;
}

canvas.oncontextmenu = function (e) {
    e.preventDefault();
};

function refreshSliders() {
    document.getElementById("viewBox").value = document.getElementById("slideBox").value;
    boxnum = document.getElementById("viewBox").value;
    document.getElementById("slideMine").max = boxnum * boxnum;
    document.getElementById("slideMine").style.width = (boxnum + 2).toString() + "px";
    document.getElementById("viewMine").value = document.getElementById("slideMine").value;
    mines = document.getElementById("viewMine").value;
    document.getElementById("viewScale").value = document.getElementById("slideScale").value;
    scale = document.getElementById("viewScale").value;
    LoadStuff();
}

canvas.addEventListener("mousedown", function (e) {
    var x = e.clientX;
    var y = e.clientY;
    if (e.which == 3) {
        switch (boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenFlaged) {
            case true:
                if (boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug) {
                    ctx.fillStyle = "white";
                    boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug.hasBeenDug = false;
                }
                else {
                    ctx.fillStyle = "lightGrey";
                }

                ctx.fillRect((Math.floor(x / scale) * scale) + 1, (Math.floor(y / scale) * scale + 1), scale - 2, scale - 2);
                ctx.fillStyle = "white";
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenFlaged = false;
                break;
            case false:
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenFlaged = true;
                ctx.drawImage(document.getElementById("flag"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale);
                CheckFlags();
                break;
            default: break;
        }

    }
    if (x < (boxnum - 1) * scale && y < (boxnum - 1) * scale && !hasDied && e.which == 1 && !boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenFlaged) {
        UncoverSpaces(x, y);
    }
}, true)

function UncoverSpaces(x, y) {
    if (!boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug) {
        switch (boxes[Math.floor(x / scale)][Math.floor(y / scale)].minesAround) {
            case 1:
                ctx.drawImage(document.getElementById("1"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale);
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            case 2:
                ctx.drawImage(document.getElementById("2"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale)
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            case 3:
                ctx.drawImage(document.getElementById("3"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale)
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            case 4:
                ctx.drawImage(document.getElementById("4"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale)
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            case 5:
                ctx.drawImage(document.getElementById("5"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale)
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            case 6:
                ctx.drawImage(document.getElementById("6"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale)
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            case 7:
                ctx.drawImage(document.getElementById("7"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale)
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            case 8:
                ctx.drawImage(document.getElementById("8"), Math.floor(x / scale) * scale, Math.floor(y / scale) * scale, scale, scale)
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                break;
            default:
                ctx.fillStyle = "white";
                ctx.rect((Math.floor(x / scale) * scale) + 1, (Math.floor(y / scale) * scale) + 1, scale - 2, scale - 2);
                ctx.fill();
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].hasBeenDug = true;
                boxes[Math.floor(x / scale)][Math.floor(y / scale)].UncoverAdacentSpaces();

                break;
        }
    }

    if (boxes[Math.floor(x / scale)][Math.floor(y / scale)].ismine) {
        ctx.drawImage(document.getElementById("redMine"), Math.floor(x / scale) * scale, (Math.floor(y / scale) * scale), scale, scale);
        RevealMines();
        hasDied = true;
        document.getElementById("restart").style.display = "inline";
    }
}

function RevealMines() {
    for (x = 0; x < boxnum; x++) {
        for (y = 0; y < boxnum; y++) {
            if (boxes[x][y].ismine) {
                ctx.drawImage(document.getElementById("redMine"), x * scale, y * scale, scale, scale);
            }
        }
    }
}

function CheckFlags() {
    for (i = 0; i < boxnum; i++) {
        for (n = 0; n < boxnum; n++) {
            if (boxes[i][n].ismine && boxes[i][n].hasBeenFlaged) {
                minesFound++;
            }
        }
    }
    if (minesFound == mines) {
        document.getElementById("YouWin").style.color = "rgba(150, 150, 150, .7)";
        document.getElementById("YouWin").style.display = "inline-block";
        document.getElementById("restart").style.display = "inline-block";
    }
    else {
        minesFound = 0;
    }
}

class box {
    constructor(ismine, minesAround, hasBeenDug, x, y) {
        this.ismine = ismine;
        this.minesAround = minesAround;
        this.hasBeenDug = hasBeenDug;
        this.x = x;
        this.y = y;
        this.hasBeenFlaged = false;
    }

    FindMines() {
        this.minx = -1;
        this.miny = -1;
        this.maxx = 1;
        this.maxy = 1;
        if (this.x == 0) {
            this.minx = 0;
        }
        if (this.y == 0) {
            this.miny = 0;
        }
        if (this.x == boxnum - 1) {
            this.maxx = 0;
        }
        if (this.y == boxnum - 1) {
            this.maxy = 0;
        }
        for (var j = this.minx; j <= this.maxx; j++) {
            for (var b = this.miny; b <= this.maxy; b++) {
                if (boxes[this.x + j][this.y + b].ismine) {
                    this.minesAround++;
                }
            }
        }
    }

    UncoverAdacentSpaces() {
        for (i = this.minx; i < this.maxx + 1; i++) {
            for (n = this.miny; n < this.maxy + 1; n++) {
                UncoverSpaces((this.x + i) * scale, (this.y + n) * scale);
            }
        }
    }
}