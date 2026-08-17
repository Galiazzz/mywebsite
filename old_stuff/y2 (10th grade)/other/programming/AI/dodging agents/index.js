InportJSFile("../../../../../overarching/libraries/vectors.js");
InportJSFile("../../../../../overarching/libraries/matricies.js");
InportJSFile("../../../../../overarching/libraries/random.js");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var players = [];
var enemies = [];
var isPaused = false;
var isInQuickGen = false;

var numberOfplayers = 100
var numberOfenemies = 10;

var isAnyPlayerAlive = false;

var generations = [];
var currentGeneration = { ticks: 0, bestPerformingPlayer: null, topScore: 0 };

var RandSeed;

function LoadStuff() {
    setInterval(Update, 10);

    for (var i = 0; i < numberOfplayers; i++) {
        var HL1W, HL1B, HL2W, HL2B, OW, OB;
        var vecArr = [];


        HL1W = new Matrix(20, 14);
        for (var row = 0; row < HL1W.rows; row++) {
            for (var column = 0; column < HL1W.columns; column++) {
                HL1W.SetValue(row, column, Math.random() * 2 - 1);
            }
        }
        for (var n = 0; n < 20; n++) {
            vecArr[n] = Math.random() * 2 - 1
        }
        HL1B = new VecN(20, vecArr);

        vecArr = []
        HL2W = new Matrix(20, 20);
        for (var row = 0; row < HL2W.rows; row++) {
            for (var column = 0; column < HL2W.columns; column++) {
                HL2W.SetValue(row, column, Math.random() * 2 - 1);
            }
        }
        for (var n = 0; n < 20; n++) {
            vecArr[n] = Math.random() * 2 - 1
        }
        HL2B = new VecN(20, vecArr);

        vecArr = []
        OW = new Matrix(4, 20);
        for (var row = 0; row < OW.rows; row++) {
            for (var column = 0; column < OW.columns; column++) {
                OW.SetValue(row, column, Math.random() * 2 - 1);
            }
        }
        for (var n = 0; n < 4; n++) {
            vecArr[n] = Math.random() * 2 - 1
        }
        OB = new VecN(4, vecArr);

        players.push(new Player(HL1W, HL1B, HL2W, HL2B, OW, OB))
    }

    RandSeed = RandomSeedParkMiller();
    for (var i = 0; i < numberOfenemies; i++) {
        enemies.push(new Enemy());
    }

    requestAnimationFrame(Draw);
}

function Update() {
    if (!isPaused || isInQuickGen) {
        currentGeneration.ticks++;
        isAnyPlayerAlive = false;
        for (var i = 0; i < players.length; i++) {
            if (players[i].isAlive) {
                isAnyPlayerAlive = true;
                players[i].Update()
            }
        }

        for (var i = 0; i < enemies.length; i++) {
            enemies[i].Update();
        }

        if (!isAnyPlayerAlive) {
            NewGen();
        }
    }
}

function NewGen() {

    //sort players by score best = lower index, worst = higher index
    players.sort(function (a, b) {
        if (a.score < b.score) { //a < b
            return 1;
        }
        if (a.score > b.score) { //a > b
            return -1;
        }
        return 0
    });

    currentGeneration.topScore = players[0].score;
    currentGeneration.bestPerformingPlayer = players[0];
    generations.push(currentGeneration);
    console.log(currentGeneration);
    currentGeneration = { ticks: 0, bestPerformingPlayer: null, topScore: 0 };

    for (var i = 2; i < Math.round(numberOfplayers / 2); i++) {
        for (var rows = 0; rows < players[i].hiddenLayer1Weights.rows; rows++) {
            for (var columns = 0; columns < players[i].hiddenLayer1Weights.columns; columns++) {
                players[i].hiddenLayer1Weights.SetValue(rows, columns, players[0].hiddenLayer1Weights.GetValue(rows, columns) + Math.random() * 0.0625 - 0.03125);
            }
        }
        for (var n = 0; n < players[i].hiddenLayer1biases.values.length; n++) {
            players[i].hiddenLayer1biases.values[n] = players[0].hiddenLayer1biases.values[n] + Math.random() * 0.0625 - 0.03125;
        }

        for (var rows = 0; rows < players[i].hiddenLayer2Weights.rows; rows++) {
            for (var columns = 0; columns < players[i].hiddenLayer2Weights.columns; columns++) {
                players[i].hiddenLayer2Weights.SetValue(rows, columns, players[0].hiddenLayer2Weights.GetValue(rows, columns) + Math.random() * 0.0625 - 0.03125);
            }
        }
        for (var n = 0; n < players[i].hiddenLayer2biases.values.length; n++) {
            players[i].hiddenLayer2biases.values[n] = players[0].hiddenLayer2biases.values[n] + Math.random() * 0.0625 - 0.03125;
        }

        for (var rows = 0; rows < players[i].outputWeights.rows; rows++) {
            for (var columns = 0; columns < players[i].outputWeights.columns; columns++) {
                players[i].outputWeights.SetValue(rows, columns, players[0].outputWeights.GetValue(rows, columns) + Math.random() * 0.0625 - 0.03125);
            }
        }
        for (var n = 0; n < players[i].outputBiases.values.length; n++) {
            players[i].outputBiases.values[n] = players[0].outputBiases.values[n] + Math.random() * 0.0625 - 0.03125;
        }
    }
    for (var i = Math.round(players.length / 2); i < players.length; i++) {
        for (var rows = 0; rows < players[i].hiddenLayer1Weights.rows; rows++) {
            for (var columns = 0; columns < players[i].hiddenLayer1Weights.columns; columns++) {
                players[i].hiddenLayer1Weights.SetValue(rows, columns, Math.random() * 2 - 1);
            }
        }
        for (var n = 0; n < players[i].hiddenLayer1biases.values.length; n++) {
            players[i].hiddenLayer1biases.values[n] = Math.random() * 2 - 1;
        }

        for (var rows = 0; rows < players[i].hiddenLayer2Weights.rows; rows++) {
            for (var columns = 0; columns < players[i].hiddenLayer2Weights.columns; columns++) {
                players[i].hiddenLayer2Weights.SetValue(rows, columns, Math.random() * 2 - 1);
            }
        }
        for (var n = 0; n < players[i].hiddenLayer2biases.values.length; n++) {
            players[i].hiddenLayer2biases.values[n] = Math.random() * 2 - 1;
        }

        for (var rows = 0; rows < players[i].outputWeights.rows; rows++) {
            for (var columns = 0; columns < players[i].outputWeights.columns; columns++) {
                players[i].outputWeights.SetValue(rows, columns, Math.random() * 2 - 1);
            }
        }
        for (var n = 0; n < players[i].outputBiases.values.length; n++) {
            players[i].outputBiases.values[n] = Math.random() * 2 - 1;
        }
    }

    for (var i = 0; i < players.length; i++) {
        players[i].isAlive = true;
        players[i].pos = new Vec2(canvas.width / 2, canvas.height / 2);
        players[i].vel = new Vec2(0, 0);
        players[i].score = 0;
    }
    enemies.length = 0;
    RandSeed = RandomSeedParkMiller();
    for (var i = 0; i < numberOfenemies; i++) {
        enemies.push(new Enemy());
    }
}

function QuickGeneration(numGenerations) {
    isInQuickGen = true;
    for (var i = 0; i < numGenerations; i++) {
        while (isAnyPlayerAlive) {
            Update();
        }
        Update();
    }
    isInQuickGen = false;
}

function DownloadBestPlayer(){
    var jsonString = JSON.stringify(players[0]);
    jsonString = jsonString.replaceAll("\"", "\\\"");

    var link = document.createElement("a");
    link.download = "playerData.txt";
    var blob = new Blob([jsonString], {type: "text/plain"});
    link.href = window.URL.createObjectURL(blob);
    link.click();
    link.remove();
}

function loadBestPlayer(str){
    var HL1W, HL1B, HL2W, HL2B, OW, OB;
    var loadedPlayer = JSON.parse(str);
    HL1W = new Matrix(20, 14);
    HL1W.values = loadedPlayer.hiddenLayer1Weights.values;
    HL1B = new VecN(20, null);
    HL1B.values = loadedPlayer.hiddenLayer1biases.values;
    HL2W = new Matrix(20, 20);
    HL2W.values = loadedPlayer.hiddenLayer2Weights.values;
    HL2B = new VecN(20, null);
    HL2B.values = loadedPlayer.hiddenLayer2biases.values;
    OW = new Matrix(4, 20);
    OW.values = loadedPlayer.outputWeights.values;
    OB = new VecN(4, null);
    OB.values = loadedPlayer.outputBiases.values;
    players[2] = new Player(HL1W, HL1B, HL2W, HL2B, OW, OB);
    console.log(players[2]);
}

function Draw() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    for (var i = 0; i < players.length; i++) {
        if (players[i].isAlive) {
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(players[i].pos.x, players[i].pos.y, 25, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(players[i].pos.x, players[i].pos.y);
            ctx.lineTo(players[i].pos.x + players[i].vel.Normalize().Mul(25).x + players[i].vel.x * 10, players[i].pos.y + players[i].vel.Normalize().Mul(25).y + players[i].vel.y * 10);
            ctx.stroke();
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(enemies[i].pos.x, enemies[i].pos.y, 50, 50);
    }

    requestAnimationFrame(Draw);
}

class Enemy {
    constructor() {
        switch (Math.floor(RandSeed() * 4)) {
            case 0:
                this.pos = new Vec2(0, RandSeed() * canvas.height);
                break;
            case 1:
                this.pos = new Vec2(RandSeed() * canvas.width, 0);
                break;
            case 2:
                this.pos = new Vec2(canvas.width - 50, RandSeed() * canvas.height);
                break;
            case 3:
                this.pos = new Vec2(RandSeed() * canvas.width, canvas.height - 50);
                break;
        }

        this.vel = new Vec2(RandSeed() * 2 - 1, RandSeed() * 2 - 1);
    }

    Update() {
        this.pos.AddE(this.vel);
        if (this.pos.x < -50) {
            this.pos.x = canvas.width;
        }
        if (this.pos.x > canvas.width) {
            this.pos.x = -50;
        }
        if (this.pos.y < -50) {
            this.pos.y = canvas.height;
        }
        if (this.pos.y > canvas.height) {
            this.pos.y = -50;
        }
    }
}

class Player {
    constructor(HL1W, HL1B, HL2W, HL2B, OW, OB) {
        this.isAlive = true;
        this.pos = new Vec2(canvas.width / 2, canvas.height / 2);
        this.vel = new Vec2(0, 0);
        this.score = 0;

        //inputdim = columns, outputdim = rows

        //dist right, dist left, dist top, dist bottom, vel r, vel l , vel t, vel b, dist space left, dist space top, dist space right, dist space bottom, vel x, vel y
        this.inputLayer = new VecN(14, null);
        //20 rows, 14 columns
        this.hiddenLayer1Weights = HL1W;
        //vecN dim = 20 added to output of weights
        this.hiddenLayer1biases = HL1B;
        //perform Math.tanh on each of the values here
        this.hiddenLayer2Weights = HL2W;
        //20 rows, 20 columns
        this.hiddenLayer2biases = HL2B;
        //vecN dim = 20 added to output of weights
        //compute Math.tanh here
        this.outputWeights = OW;
        //columns = 20, rows = 4
        this.outputBiases = OB;
        //vecN dim = 4
        //compute Math.tanh here
    }

    Update() {
        var minDR = [null, null], minDL = [null, null], minDT = [null, null], minDB = [null, null]
        for (var i = 0; i < enemies.length; i++) {
            var distRight = enemies[i].pos.x - (this.pos.x + 25);
            var distLeft = (this.pos.x - 25) - (enemies[i].pos.x + 50);
            var distTop = (this.pos.y - 25) - (enemies[i].pos.y + 50);
            var distBottom = enemies[i].pos.y - (this.pos.y + 25);

            if (distRight < 0 && distLeft < 0 && distTop < 0 && distBottom < 0) {
                this.isAlive = false;
                return;
            }

            if ((distRight < minDR[0] && distRight > 0) || minDR[0] == null) {
                minDR[0] = distRight;
                minDR[1] = i;
            }
            if ((distLeft < minDL[0] && distLeft > 0) || minDL[0] == null) {
                minDL[0] = distLeft;
                minDL[1] = i;
            }
            if ((distTop < minDT[0] && distTop > 0) || minDT[0] == null) {
                minDT[0] = distTop;
                minDT[1] = i;
            }
            if ((distBottom < minDB[0] && distBottom > 0) || minDB[0] == null) {
                minDB[0] = distBottom;
                minDB[1] = i;
            }
        }

        this.inputLayer.values = [minDR[0], minDL[0], minDT[0], minDB[0],
        enemies[minDR[1]].vel.x, enemies[minDL[1]].vel.x, enemies[minDT[1]].vel.y, enemies[minDB[1]].vel.y,
        this.pos.x + 25, this.pos.y + 25, canvas.width - (this.pos.x - 25), canvas.height - (this.pos.y - 25), this.vel.x, this.vel.y];


        this.pos.AddE(this.vel);
        if (this.pos.x > canvas.width + 25) {
            //this.pos.x = -25;
            this.isAlive = false;
        }
        if (this.pos.x < -25) {
            //this.pos.x = canvas.width + 25;
            this.isAlive = false;
        }
        if (this.pos.y > canvas.height + 25) {
            //this.pos.y = -25;
            this.isAlive = false;
        }
        if (this.pos.y < -25) {
            //this.pos.y = canvas.height + 25;
            this.isAlive = false;
        }

        var HL1 = this.hiddenLayer1Weights.Eval(this.inputLayer).Add(this.hiddenLayer1biases);
        for (var i = 0; i < HL1.dim; i++) { HL1.values[i] = Math.tanh(HL1.values[i]); }
        var HL2 = this.hiddenLayer2Weights.Eval(HL1).Add(this.hiddenLayer2biases);
        for (var i = 0; i < HL2.dim; i++) { HL2.values[i] = Math.tanh(HL2.values[i]); }
        var outputLayer = this.outputWeights.Eval(HL2).Add(this.outputBiases);
        for (var i = 0; i < outputLayer.dim; i++) { outputLayer.values[i] = Math.tanh(outputLayer.values[i]); }

        if (outputLayer.values[0] > 0 && this.vel.x < 1.5) {
            this.vel.x += 0.05;
        }
        if (outputLayer.values[1] > 0 && this.vel.x > -1.5) {
            this.vel.x -= 0.05;
        }
        if (outputLayer.values[2] > 0 && this.vel.y < 1.5) {
            this.vel.y += 0.05;
        }
        if (outputLayer.values[3] > 0 && this.vel.y > -1.5) {
            this.vel.y -= 0.05;
        }

        this.score += 1 + (Math.min(Math.min(Math.min(minDB[0], minDL[0]), minDR[0]), minDT[0])) / -4000;
        this.score += 2 * Math.min(Math.min(Math.min(this.pos.x - 25, this.pos.y - 25), canvas.width - (this.pos.x + 25)), canvas.height - (this.pos.y + 25)) / canvas.height;
    }
}

document.addEventListener("keydown", function (e) {
    if (e.key == "p") {
        switch (isPaused) {
            case true:
                isPaused = false;
                break;
            case false:
                isPaused = true;
                break;
        }
    }
    if (e.key == "s") {
        if (isPaused) {
            isPaused = false;
            Update();
            isPaused = true;
        }
        else {
            Update()
        }
    }
    if (e.key == "q") {
        QuickGeneration(1);
    }
});