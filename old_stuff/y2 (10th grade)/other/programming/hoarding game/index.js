var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var isPaused = false;
var points = [];
var height = 50;
var width = 50;
var tileEdgeLength = 50;

var cameraOff = new Vector2(0, 0);

var currentImageId = 0;
const TileSpriteSheet = LoadSprite("images/tileSpriteSheet.png");

const TileTypes = {
    Air: 0,
    Grass: 1,
    Dirt: 2,
    Stone: 3,
}

function LoadSprite(filepath){
    var obj = document.createElement("img");
    obj.id = "imageID:" + currentImageId;
    obj.src = filepath;
    obj.alt = "failed to load image at:" + filepath;
    obj.style.display = "none";
    document.body.appendChild(obj);
    //document.body += `<img id="imageID:${currentImageId}" src="${filepath}" alt="failed to load image at: ${filepath}" style="display:none;">`;
    currentImageId++;
    return document.getElementById(`imageID:${currentImageId - 1}`);
}

function LoadStuff() {
    for (var i = 0; i < width; i++) {
        points[i] = [];
        for (var n = 0; n < height; n++) {
            points[i][n] = TileTypes.Air;
        }
    }
    var heights = [];
    for(var i = 0; i < 11; i++){
        heights[i] = Math.floor(Math.random() * 12 + 3);
    }
    for(var x = 0; x < heights.length - 1; x++){
        for(var n = 0; n < 5; n++){
            points[x * 5 + n][Math.floor(heights[x] * (1 - 1/5 * n) + heights[x + 1] * (1/5 * n))] = TileTypes.Dirt;
        }
    }
    for(var x = 0; x < points.length; x++){
        for(var y = 1; y < points[x].length; y++){
            if(points[x][y - 1] != TileTypes.Air && points[x][y] == TileTypes.Air){
                points[x][y] = TileTypes.Dirt;
            }
            if((points[x][y - 1] == TileTypes.Air && points[x][y] == TileTypes.Dirt) || (points[x][y - 2] == TileTypes.Air && points[x][y] == TileTypes.Dirt && y > 1)){
                points[x][y] = TileTypes.Grass;
            }
        }
    }

    setInterval(() => {
        if (isPaused) {
            Update();
        }
    }, 10);

    requestAnimationFrame(Draw);
}

function Update() {

}

function DrawLineV(point1, point2){
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
}
function DrawLineN(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function GetMarchValue(upperLeft, upperRight, lowerRight, lowerLeft, value){
    return 8 * (upperLeft == value) + 4 * (upperRight == value) + 2 * (lowerRight == value) + (lowerLeft == value);
}

function ContainsValue(values, type){
    var containsValue = false;
    for(var i = 0; i < values.length; i++){
        if(type == values[i]){
            containsValue = true;
        }
    }
    if(!containsValue){
        values.push(type);
    }
    return values;
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < height - 1; y++) {
        for (var x = 0; x < width - 1; x++) {
            var value = points[x][y] * 75;
            var m1 = new Vector2(x * tileEdgeLength + tileEdgeLength / 2, y * tileEdgeLength);
            var m2 = new Vector2((x + 1) * tileEdgeLength, y * tileEdgeLength + tileEdgeLength / 2);
            var m3 = new Vector2(x * tileEdgeLength + tileEdgeLength / 2, (y + 1) * tileEdgeLength);
            var m4 = new Vector2(x * tileEdgeLength, y * tileEdgeLength + tileEdgeLength / 2);
            var tileTypesInSquare = [];
            tileTypesInSquare = ContainsValue(tileTypesInSquare, points[x][y]);
            tileTypesInSquare = ContainsValue(tileTypesInSquare, points[x + 1][y]);
            tileTypesInSquare = ContainsValue(tileTypesInSquare, points[x + 1][y + 1]);
            tileTypesInSquare = ContainsValue(tileTypesInSquare, points[x][y + 1]);

            for(var i = 0; i < tileTypesInSquare.length; i++){
                var msCase = GetMarchValue(points[x][y], points[x + 1][y], points[x + 1][y + 1], points[x][y + 1], tileTypesInSquare[i]);
                ctx.drawImage(TileSpriteSheet, msCase * 50, tileTypesInSquare[i] * 50, 50, 50, x * tileEdgeLength + cameraOff.x, y * tileEdgeLength + cameraOff.y, tileEdgeLength, tileEdgeLength);
            }

            /*var casenum = 8 * (points[x][y] > 0) + 4 * (points[x + 1][y] > 0) + 2 * (points[x + 1][y + 1] > 0) + (points[x][y + 1] > 0);
            switch (casenum) {
                case 0:
                    break;
                case 1:
                    DrawLineV(m3, m4);
                    break;
                case 2:
                    DrawLineV(m3, m2);
                    break;
                case 3:
                    DrawLineV(m4, m2);
                    break;
                case 4:
                    DrawLineV(m1, m2);
                    break;
                case 5:
                    DrawLineV(m3, m4);
                    DrawLineV(m1, m2);
                    break;
                case 6:
                    DrawLineV(m3, m1);
                    break;
                case 7:
                    DrawLineV(m4, m1);
                    break;
                case 8:
                    DrawLineV(m4, m1);
                    break;
                case 9:
                    DrawLineV(m3, m1);
                    break;
                case 10:
                    DrawLineV(m1, m4);
                    DrawLineV(m2, m3);
                    break;
                case 11:
                    DrawLineV(m1, m2);
                    break;
                case 12:
                    DrawLineV(m4, m2);
                    break;
                case 13:
                    DrawLineV(m2, m3);
                    break;
                case 14:
                    DrawLineV(m4, m3);
                    break;
                case 15:
                    break;
            }*/

            ctx.fillStyle = "rgb(" + value + ", " + value + ", " + value + ")";
            ctx.beginPath();
            ctx.arc(x * tileEdgeLength + cameraOff.x, y * tileEdgeLength + cameraOff.y, 5, 0, 2 * Math.PI);
            ctx.fill();

        }
    }

    requestAnimationFrame(Draw);
}

function DrawTriangle(point1, point2, point3, Fill = false, color = "black") {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point1.x, point1.y);
    ctx.closePath();
    if (Fill) {
        var pastColor = ctx.fillStyle;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = pastColor;
    }
    ctx.stroke();
}

document.addEventListener("keydown", function(e){
    if(e.key == "ArrowUp" || e.key == "w"){
        cameraOff.y += 10;
    }
    if(e.key == "ArrowDown" || e.key == "s"){
        cameraOff.y -= 10;
    }
    if(e.key == "ArrowRight" || e.key == "d"){
        cameraOff.x -= 10;
    }
    if(e.key == "ArrowLeft" || e.key == "a"){
        cameraOff.x += 10;
    }
})
document.addEventListener("keyup", function(e){

});


function Vector2(x = 0, y = 0) {
    this.x = x;
    this.y = y;

    this.Add = function (vec) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }
    this.Sub = function (vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }
    this.Mult = function (value) {
        return new Vector2(this.x * vec.x, this.y * value);
    }
    this.Div = function (value) {
        return new Vector2(this.x / value, this.y / value);
    }
}