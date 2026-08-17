
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight * 4;
canvas.width = window.innerWidth * 4;
var lookingCanvas = document.getElementById("lookingCanvas");
var lookingCtx = lookingCanvas.getContext("2d");
lookingCanvas.height = window.innerHeight;
lookingCanvas.width = window.innerWidth;
var player = null;
var scale = 50;
var noise = [];
var tiles = [];
var x = 0;
var y = -300;

var isPaused = false;

var isDownDown = false;
var isRightDown = false;
var isLeftDown = false;

function LoadStuff() {
    document.getElementById("loadingScreen").style.zIndex = "-1";
    canvas.style.zIndex = "1";
    document.getElementById("loadingScreen").style.display = "none";

    document.getElementById("stage").innerText = "Making Tiles"
    for (i = 0; i < canvas.width / scale + 20; i++) {
        tiles[i] = [];
        document.getElementById("subStage").innerText = "Making array: " + Math.ceil(i / (canvas.width / scale + 20) * 100) + "%";
    }

    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < canvas.height / scale + 20; n++) {
            tiles[i][n] = new Tile(i, n, TileID.Air());
            document.getElementById("subStage").innerText = "Clearing World: " + Math.ceil((i + n / (tiles.length * (canvas.height / scale + 20)) * 100)) * 2 + "%";
        }
    }


    for (i = 0; i < tiles.length / 5; i++) {
        noise[i] = Math.floor(Math.random() * 9) + 1;
    }
    for (i = 0; i < noise.length - 1; i++) {
        for (n = 0; n < 5; n++) {
            tiles[i * 5 + n][Math.floor(Interpolations.Cosine2d(noise[i], noise[i + 1], n * (1 / 5)))].type = TileID.Dirt();
        }
    }

    document.getElementById("stage").innerText = "Making Noise";
    for (i = 0; i < tiles.length; i++) {
        noise[i] = [];
        document.getElementById("subStage").innerText = "setting up: " + Math.ceil(((i + 1) / tiles.length) * 100) + "%";
    }

    for (i = 0; i < tiles.length; i++) {
        for (n = 1; n < tiles[i].length; n++) {
            if (tiles[i][n].type == TileID.Air() && tiles[i][n - 1].type != TileID.Air()) {
                tiles[i][n].type = TileID.Dirt();
            }
            document.getElementById("subStage").innerText = "Merging land: " + Math.ceil(((i + 1 + n + 1) / (tiles.length + tiles[i].length)) * 100) + "%";
        }
    }

    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            for (j = 0; j < 2; j++) {
                if (Math.floor(Math.random() * n) > 7 && tiles[i][n].type == TileID.Dirt()) {
                    tiles[i][n].type = TileID.Stone();
                }
            }
        }
    }

    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            noise[i][n] = 0;
        }
    }

    for (i = 0; i < canvas.height / 70; i++) {
        noise[Math.floor(Math.random() * tiles.length)][Math.floor(Math.random() * (canvas.height / scale)) + 12] = Math.floor(Math.random() * 4) + 4
    }

    for (i = 1; i < tiles.length - 1; i++) {
        for (n = 1; n < tiles[i].length - 1; n++) {
            var highest = 0;
            var maxX = null;
            var maxY = null;
            for (j = -1; j <= 1; j++) {
                for (k = -1; k <= 1; k++) {
                    if (noise[i + j][n + k] > highest) {
                        highest = noise[i + j][n + k];
                        maxX = j;
                        maxY = k;
                    }
                }
            }
            if (maxX != null && maxY != null && highest > 1) {
                noise[i][n] = noise[i + maxX][n + maxY] - 1;
            }
        }
    }

    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            if (noise[i][n] > 1) {
                tiles[i][n].type = TileID.Air();
            }
        }
    }

    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            if (Math.floor(Math.random() * 15) > 13 && tiles[i][n].type == TileID.Stone() && n > 20) {
                tiles[i][n].type = TileID.StrangeOre();
            }
        }
    }

    document.getElementById("stage").innerText = "Grassifying Dirt";
    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            if (tiles[i][n].type == TileID.Dirt() && tiles[i][n - 1].type == TileID.Air()) {
                tiles[i][n].type = TileID.Grass();
            }
            document.getElementById("subStage").innerText = Math.ceil(((i + 1 + n + 1) / (tiles.length + tiles[i].length)) * 100) + "%";
        }
    }
    document.getElementById("stage").innerText = "Initial Block Update";
    for (i = 0; i < tiles.length; i++) {
        for (n = 0; n < tiles[i].length; n++) {
            tiles[i][n].Update();
            document.getElementById("subStage").innerText = Math.ceil(((i + 1 + n + 1) / (tiles.length + tiles[i].length)) * 100) + "%";
        }
    }
    document.getElementById("stage").innerText = "Placing Player";
    document.getElementById("subStage").innerText = "0%";
    player = new Player(lookingCanvas.width / 2 - 16, lookingCanvas.height / 2 - 16 - 300);
    document.getElementById("subStage").innerText = "100%";
    document.getElementById("loadingScreen").style.zIndex = "-1";
    canvas.style.zIndex = "1";
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("lookingCanvas").style.zIndex = "2";
    document.getElementById("UI").style.zIndex = "3";

    TileID.PlayerBlocks();

    setInterval(function () {
        if (!isPaused) {

            lookingCtx.fillStyle = "skyBlue";
            lookingCtx.fillRect(0, 0, window.innerWidth, 300);
            player.Update();
            lookingCtx.drawImage(canvas, x, y, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
            lookingCtx.fillStyle = "green";
            lookingCtx.fillRect(lookingCanvas.width / 2 - 16, lookingCanvas.height / 2 - 16, 32, 32);
        }
        UIUpdate();
    }, 10);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener("keydown", function (e) {
    if (!isInInventory) {
        if (e.key == "ArrowUp" || e.key == "w" || e.key == " ") {
            player.gSpeed = -5
        }
        else if (e.key == "ArrowDown" || e.key == "s") {
            if (player.gSpeed < 0) {
                player.gSpeed = 0;
            }
        }
        if ((e.key == "ArrowLeft" || e.key == "a") && x > 0) {
            if (player.xSpeed > 0) {
                player.xSpeed = 0;
            }
            else {
                player.xSpeed = -4;
            }
        }
        else if ((e.key == "ArrowRight" || e.key == "d") && x + lookingCanvas.width < canvas.width) {
            if (player.xSpeed < -0) {
                player.xSpeed = 0;
            }
            else {
                player.xSpeed = 4;
            }
        }
    }

    if (e.key == "v") {
        switch (isInInventory) {
            case true:
                isPaused = false;
                isInInventory = false;
                UICtx.clearRect(UICanvas.width / 2 - 251, UICanvas.height - 361, 502, 300);
                break;
            case false:
                isPaused = true;
                isInInventory = true;
                Inventory();
                break;
        }
    }

}, true);

document.addEventListener("keyup", function (e) {
    if (!isInInventory) {
        if (e.key == "ArrowUp" || e.key == "w" || e.key == " ") {
            isUpDown = false;
        }
        else if (e.key == "ArrowDown" || e.key == "s") {
            isDownDown = false;
        }
        else if ((e.key == "ArrowLeft" || e.key == "a") && x > 0) {
            isLeftDown = false;
        }
        else if ((e.key == "ArrowRight" || e.key == "d") && x + lookingCanvas.width < canvas.width) {
            isRightDown = false;
        }
    }
});

document.oncontextmenu = function (e) {
    e.preventDefault();
};

document.addEventListener("mousedown", function (e) {
    if (!isInInventory) {
        var selectedTile = tiles[Math.floor((e.clientX + x) / scale)][Math.floor((e.clientY + y) / scale)];
        if (e.which == 1) {
            if (selectedTile.type != TileID.Air()) {
                var hasBeenFound = false;
                for (i = 1; i < player.hotBar.length; i++) {
                    if (player.hotBar[i].type == selectedTile.type) {
                        player.hotBar[i].type = selectedTile.type;
                        player.hotBar[i].amount++;
                        player.hotBar[i].displayName = ItemID.FindName(selectedTile.type);
                        hasBeenFound = true;
                        break;
                    }
                }
                if (!hasBeenFound) {
                    for (i = 1; i < player.hotBar.length; i++) {
                        if (player.hotBar[i].type == -1) {
                            player.hotBar[i].type = selectedTile.type;
                            player.hotBar[i].amount++;
                            player.hotBar[i].displayName = ItemID.FindName(selectedTile.type);
                            break;
                        }
                    }
                }
                selectedTile.type = TileID.Air();
                selectedTile.Update();

            }
        }
        else if (e.which == 3) {
            if (selectedTile.type == TileID.Air() && player.hotBar[player.selectedBlock].amount > 0) {
                player.hotBar[player.selectedBlock].amount--;
                selectedTile.type = player.hotBar[player.selectedBlock].type;
                selectedTile.Update();
            }
            if (player.hotBar[player.selectedBlock].amount <= 0) {
                player.hotBar[player.selectedBlock].type = ItemID.Blank;
            }
        }
        /*
        // Teleporting code
        player.x += e.clientX - (lookingCanvas.width / 2);
        x += e.clientX - (lookingCanvas.width / 2);
        player.y += e.clientY - (lookingCanvas.height / 2);
        y += e.clientY - (lookingCanvas.height / 2);
        */
    }
}, true);

document.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        //console.log("scrolling down");
        if (player.selectedBlock < player.hotBar.length - 1) {
            player.selectedBlock++;
        }
        else {
            player.selectedBlock = 1;
        }
    }
    else {
        //console.log("scrolling up");
        if (player.selectedBlock > 1) {
            player.selectedBlock--;
        }
        else {
            player.selectedBlock = player.hotBar.length - 1;
        }
    }

}, true);

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

class Tile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.maxJumps = 1;
        this.jumps = 0;
    }
    Update() {
        if (this.type != TileID.Air()) {
            this.isSolid = true;
        }
        else {
            this.isSolid = false;
        }
        TileID.FindTexture(this.type);
        TileID.DrawTexture(this.x, this.y);
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.gSpeed = 0;

        this.isOnGround = false;

        this.hotBar = [];
        this.selectedBlock = 1;
        this.inventory = [];
    }
    Update() {

        if (y + lookingCanvas.height < canvas.height) {
            this.gSpeed += 0.098;
        }
        else {
            this.gSpeed = 0;
        }

        if (this.isOnGround) {
            if (this.xSpeed > 0.1) {
                this.xSpeed -= 0.1;
            }
            else if (this.xSpeed < -0.1) {
                this.xSpeed += 0.1;
            }
            else {
                this.xSpeed = 0;
            }
        }
        else {
            if (this.xSpeed > 0.1) {
                this.xSpeed -= 0.05;
            }
            else if (this.xSpeed < -0.1) {
                this.xSpeed += 0.05;
            }
            else {
                this.xSpeed = 0;
            }
        }

        if (x < 0) {
            this.x -= this.xSpeed;
            x -= this.xSpeed;
            this.xSpeed = 0;
        }
        if (x + lookingCanvas.width > canvas.width) {
            this.x -= this.xSpeed + 1;
            x -= this.xSpeed + 1;
            this.xSpeed = 0;
            //x = canvas.width - (lookingCanvas.width);
        }


        this.isOnGround = false;
        if (this.y - 16 > 0 && this.x - 16 > 0) {
            if (tiles[Math.floor((this.x + 30) / scale)][Math.floor((this.y - 15) / scale)].isSolid ||
                tiles[Math.floor((this.x + 30) / scale)][Math.floor((this.y + 15) / scale)].isSolid) {
                if (this.xSpeed > 0) {
                    this.x -= this.xSpeed;
                    x -= this.xSpeed;
                    this.xSpeed = 0;
                }
                else {
                    this.x -= 1;
                    x -= 1;
                }
            }
            if (tiles[Math.floor((this.x + 2) / scale)][Math.floor((this.y + 15) / scale)].isSolid ||
                tiles[Math.floor((this.x + 2) / scale)][Math.floor((this.y - 15) / scale)].isSolid) {
                if (this.xSpeed < 0) {
                    this.x -= this.xSpeed;
                    x -= this.xSpeed;
                    this.xSpeed = 0;
                }
                else {
                    this.x += 1;
                    x += 1;
                }
            }
            if (tiles[Math.floor((this.x + 10) / scale)][Math.floor((this.y - 0) / scale)].isSolid ||
                tiles[Math.floor((this.x + 15) / scale)][Math.floor((this.y - 0) / scale)].isSolid) {
                if (this.gSpeed < 0) {
                    this.y += this.gSpeed + 10;
                    y += this.gSpeed + 10;
                    this.gSpeed = 0;
                }
                else {
                    this.y += 1;
                    y += 1;
                }

            }
            if (tiles[Math.floor((this.x + 10) / scale)][Math.floor((this.y + 26) / scale)].isSolid ||
                tiles[Math.floor((this.x + 15) / scale)][Math.floor((this.y + 9) / scale)].isSolid) {
                this.isOnGround = true;
                if (this.gSpeed > 0) {
                    this.y -= this.gSpeed;
                    y -= this.gSpeed;
                    this.gSpeed = 0;
                }
                else {
                    this.y -= 10;
                    y -= 10;
                }
            }
        }



        this.y += this.gSpeed;
        y += this.gSpeed;

        x += this.xSpeed;
        this.x += this.xSpeed;
    }
}