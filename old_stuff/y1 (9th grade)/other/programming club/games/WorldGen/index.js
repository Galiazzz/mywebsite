console.clear();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var selector = document.getElementById("selectedBlock");
var amountLeft = document.getElementById("amountLeft");
var tiles = [];
var scale = 50;
var player = null;

var grass = document.getElementById("grass");
var stone = document.getElementById("stone");
var dirt = document.getElementById("dirt");

function LoadStuff() {
    console.log("making tiles");
    for (i = 0; i < canvas.width / scale; i++) {
        tiles[i] = [];
    }
    console.log("clearing world");
    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < canvas.height / scale; n++) {
            tiles[i][n] = new Tile(i, n, 0, false);
        }
    }
    console.log("adding variation");
    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            if (Math.floor(Math.random() * n) > 2) {
                tiles[i][n].type++;
            }
            if (Math.floor(Math.random() * n) > 5) {
                tiles[i][n].type++;

            }
            for (j = 0; j < 2; j++) {
                if (Math.floor(Math.random() * n) > 7 && tiles[i][n].type < 2) {
                    tiles[i][n].type++;
                }
            }
        }
    }
    console.log("merging land");
    for (i = 0; i < tiles.length; i++) {
        for (n = 1; n < tiles[i].length; n++) {
            if (tiles[i][n].type == 0 && tiles[i][n - 1].type != 0) {
                tiles[i][n].type++;
            }
        }
    }
    console.log("flatening spikes");
    for (i = 0; i < tiles.length; i++) {
        for (n = 1; n < 5; n++) {
            if (Math.floor(Math.random() * 3) < 2 && tiles[i][n - 1].type == 0) {
                tiles[i][n].type = 0;
            }
        }
    }
    console.log("filling valleys");
    for (i = 0; i < tiles.length - 1; i++) {
        for (n = 1; n < tiles[i].length; n++) {
            if (tiles[i][n].type == 0) {
                for (j = 0; j < tiles[i + 1].length; j++) {
                    if (tiles[i][j].type != 0) {
                        if (j - n < 3) {
                            tiles[i][n].type = 1;
                        }
                    }
                }
            }
        }
    }
    console.log("grassifying dirt")
    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            if (tiles[i][n].type == 1 && tiles[i][n - 1].type == 0) {
                tiles[i][n].isGrass = true;
            }
        }
    }
    player = new Player(canvas.width / 2, 10, scale / 2, scale / 2);
    console.log("starting updates");
    setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < tiles.length; i++) {
            for (n = 0; n < tiles[i].length; n++) {
                tiles[i][n].Update();
            }
        }
        player.Update();
    }, 10);

}

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" || e.key == "w") {
        if (player.jumps < player.maxJumps) {
            player.gSpeed = -5;
            player.y += player.gSpeed;
            player.jumps++;
        }
    }
    else if (e.key == "ArrowDown" || e.key == "s") {
        /*
        player.gSpeed++;
        player.y += player.gSpeed;
        */
    }
    else if (e.key == "ArrowLeft" || e.key == "a") {
        player.xSpeed = -3;
    }
    else if (e.key == "ArrowRight" || e.key == "d") {
        player.xSpeed = 3;
    }
}, true);

document.addEventListener("mousedown", function (e) {
    if (e.which == 1) {
        if (Math.sqrt(Math.pow(e.clientX - player.x, 2) + Math.pow(e.clientY - player.y, 2)) < scale * 5) {
            switch (tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type) {
                case 0:
                    break;
                case 1:
                    if (tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].isGrass) {
                        player.grasses++;
                        tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].isGrass = false;
                        amountLeft.innerText = player.grasses;
                    }
                    else {
                        player.dirts++;
                        amountLeft.innerText = player.dirts;
                    }
                    break;
                case 2:
                    player.stones++;
                    amountLeft.innerText = player.stones;
                    break;
                default: break;
            }
            tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type = 0;
        }
    }
    else if (e.which == 3) {
        if (Math.sqrt(Math.pow(e.clientX - player.x, 2) + Math.pow(e.clientY - player.y, 2)) < scale * 5) {
            if (player.blockSelected == 1 && player.dirts > 0 && tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type == 0) {
                tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type = 1;
                player.dirts--;
                amountLeft.innerText = player.dirts;
            }
            if (player.blockSelected == 0 && player.grasses > 0 && tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type == 0) {
                tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type = 1;
                tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].isGrass = true;
                player.grasses--;
                amountLeft.innerText = player.grasses;
            }
            if (player.blockSelected == 2 && player.stones > 0 && tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type == 0) {
                tiles[Math.floor(e.clientX / scale)][Math.floor(e.clientY / scale)].type = 2;
                player.stones--;
                amountLeft.innerText = player.stones;
            }
        }

    }
}, true);

document.addEventListener("wheel", function (e) {
    if (player.blockSelected < 2) {
        player.blockSelected++;
    }
    else {
        player.blockSelected = 0;
    }
    switch (player.blockSelected) {
        case 0:
            selector.innerHTML = "<img src='grass.png' alt='grass' height='48' width='48'>";
            amountLeft.innerText = player.grasses;
            break;
        case 1:
            selector.innerHTML = "<img src='dirt.png' alt='grass' height='48' width='48'>";
            amountLeft.innerText = player.dirts;
            break;
        case 2:
            selector.innerHTML = "<img src='stone.png' alt='grass' height='48' width='48'>";
            amountLeft.innerText = player.stones;
            break;
        default:
            break;
    }
}, true)

document.oncontextmenu = function (e) {
    e.preventDefault();
};

class Tile {
    constructor(x, y, type, isSolid) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isSolid = isSolid;
        this.isGrass = false;

        switch (this.type) {
            case 0:
                ctx.fillStyle = "lightBlue";
                ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
                break;
            case 1:
                ctx.drawImage(grass, this.x * scale, this.y * scale, scale, scale);
                this.isSolid = true;
                break;
            case 2:
                ctx.drawImage(stone, this.x * scale, this.y * scale, scale, scale);
                this.isSolid = true;
                break;
            default: break;
        }
    }
    Update() {
        switch (this.type) {
            case 0:
                ctx.fillStyle = "lightBlue";
                ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
                this.isSolid = false;
                break;
            case 1:
                if (this.isGrass) {
                    ctx.drawImage(grass, this.x * scale, this.y * scale, scale, scale);
                }
                else {
                    ctx.drawImage(dirt, this.x * scale, this.y * scale, scale, scale);
                }
                this.isSolid = true;
                break;
            case 2:
                ctx.drawImage(stone, this.x * scale, this.y * scale);
                this.isSolid = true;
                break;
            default: break;
        }
    }
}

class Player {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.gSpeed = 0;
        this.xSpeed = 0;
        this.jumps = 0;
        this.maxJumps = 1;

        this.blockSelected = 0;
        this.grasses = 0;
        this.dirts = 0;
        this.stones = 0;

        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }
    Update() {
        if (this.y < canvas.height - this.height && this.y > 0) {
            if (this.gSpeed < scale / 5) {
                this.gSpeed += 0.098;
            }
            else{
                this.gSpeed = scale / 5;
            }
            this.y += this.gSpeed;
        }
        else if (this.y < 0) {
            this.gSpeed = 0;
            this.y = 1;
        }
        else {
            this.gSpeed = 0;
            this.y = canvas.height - this.height;
            this.jumps = 0;
        }

        if (tiles[Math.floor(this.x / scale)][Math.floor((this.y + this.height) / scale)].isSolid) {
            this.jumps = 0;
            this.gSpeed = 0;
            this.y = Math.floor((this.y + 10) / scale) * scale + this.height;
        }
        if (tiles[Math.floor(this.x / scale)][Math.floor(this.y / scale)].isSolid) {
            this.xSpeed = 0;
            this.x = tiles[Math.floor(this.x / scale) + 1][Math.floor(this.y / scale)].x * scale + 1;
        }
        if (tiles[Math.floor(this.x / scale)][Math.floor((this.y) / scale)].isSolid) {
            this.gSpeed = 0;
            this.y = tiles[Math.floor(this.x / scale)][Math.floor((this.y) / scale)].y * scale + (scale + this.height);
        }
        if (tiles[Math.floor((this.x + this.width) / scale)][Math.floor(this.y / scale)].isSolid) {
            this.xSpeed = 0;
            this.x = tiles[Math.floor((this.x + this.width) / scale)][Math.floor(this.y / scale)].x * scale - (this.height + 1);
        }

        if (this.xSpeed > 0.01) {
            this.xSpeed -= 0.1;
        }
        else if (this.xSpeed < -0.01) {
            this.xSpeed += 0.1;
        }
        else {
            this.xSpeed = 0;
        }
        this.x += this.xSpeed;

        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }
}