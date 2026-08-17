var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var offset = [800, 600];

var searchAngle = Math.PI / 4;
var searchDirection = 1;

var mirrorDiameter = 4;
var apetureSize = 5;
var hight = 16;
var centralObstruction = 1;
var centralObstructionHeight = 15;

var PPIn = 25;

var aValue = FocalLengthToAValue(5);
var FL;


var angle = 0;
var drawLines = true;
var newLines = false;

var lines = []; // [aValue, bValue, cValue, leftBound, Bound, colorIndex];
var numRays = 100;
var raySpread = 50;
var rayRadius = hight + 5;

var lineColor = ["Black", "Blue", "Orange", "Purple"];

function LoadStuff() {
    //aValue = FocalLengthToAValue(17.51);
    Calculate();
    setInterval(Update, 10);
    requestAnimationFrame(Draw)
}

function LineInverse(y, a, b) {
    return (y - b) / a;
}

function LineLineIntersection(a1, b1, a2, b2) {
    return ((b2 - b1) / (a1 - a2));
}

function LineParaIntersection(a1, b1, a2, b2, c2) {
    return [
        (-b2 + a1 + Math.sqrt(b2 * b2 - 2 * a1 * b2 + a1 * a1 - 4 * a2 * c2 + 4 * a2 * b1)) / (2 * a2),
        (-b2 + a1 - Math.sqrt(b2 * b2 - 2 * a1 * b2 + a1 * a1 - 4 * a2 * c2 + 4 * a2 * b1)) / (2 * a2)
    ];
}

function GetNormalSlopeOfLine(slope) {
    return (-1 / slope);
}

function GetNormalSlopeOfPara(a, b, c, x) {
    var slope = ((a * (x + 1e-5) * (x + 1e-5) + b * (x + 1e-5) + c) - (a * x * x + b * x + c)) / (1e-5);
    return GetNormalSlopeOfLine(slope);
}

function GetSlopeOfPara(a, b, x) {
    return (2 * a * x + b);
}

function Distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

//this function is its own inverse so f(f(x)) = x
function FocalLengthToAValue(focalLength) {
    //Math.tan(-2 * Math.atan(2 * focalLength) + Math.PI / 2) + focalLength;
    //these two seem to be exactly equal. I don't really know why though. May be able to
    //prove this through the use of imaginary numbers someday.
    return (1 / (4 * focalLength));
}
function SlopeOfReflection(slopeOfReflectiveSuface, slopeOfLight) {
    var angleOfReflectiveSuface = Math.atan(slopeOfReflectiveSuface);
    var angleOfLight = Math.atan(slopeOfLight);
    return Math.tan(AngleOfReflection(angleOfReflectiveSuface, angleOfLight));
}
function AngleOfReflection(surfaceAngle, lightAngle) {
    return (-lightAngle + 2 * surfaceAngle);
}

function Calculate() {
    lines.length = 0;
    var slope = -Math.tan(3.1415 / 2 + angle);
    for (var i = 0; i < numRays; ++i) {
        var pointPos = i * (raySpread / numRays) - raySpread / 2;
        var point = [pointPos * Math.cos(angle + Math.PI) - rayRadius * Math.sin(angle + Math.PI), pointPos * Math.sin(angle + Math.PI) + rayRadius * Math.cos(angle + Math.PI)];
        
        var line = new Line();
        line.a = slope;
        line.SetBToOffsets(point[0], -point[1]);
        // lines.push(line); 


        var rightWallIntercect = LineLineIntersection(1000, 1000 * (-apetureSize / 2), slope, line.b);
        var rbottomXValue = LineInverse(0, 1000, 1000 * (-apetureSize / 2));
        var rtopXValue = LineInverse(hight, 1000, 1000 * (-apetureSize / 2));
        var leftWallIntercect = LineLineIntersection(1000, 1000 * (apetureSize / 2), slope, line.b);
        var lbottomXValue = LineInverse(0, 1000, 1000 * (apetureSize / 2));
        var ltopXValue = LineInverse(hight, 1000, 1000 * (apetureSize / 2));

        var obstructionIntersect = LineLineIntersection(1, centralObstructionHeight, slope, line.b);

        if (rightWallIntercect > rbottomXValue && rightWallIntercect < rtopXValue &&
            !(leftWallIntercect > lbottomXValue && leftWallIntercect < ltopXValue)) {
                line.SetHorizontalBounds(apetureSize / 2, LineInverse(-point[1], slope, line.b));
                lines.push(line);
            lines.push(line);
        }
        else if (leftWallIntercect > lbottomXValue && leftWallIntercect < ltopXValue &&
                !(rightWallIntercect > rbottomXValue && rightWallIntercect < rtopXValue)) {
                line.SetHorizontalBounds(-apetureSize / 2, LineInverse(-point[1], slope, line.b));
                lines.push(line);
        }
        else if(obstructionIntersect >= -centralObstruction / 2 && obstructionIntersect <= centralObstruction / 2){
            line.SetHorizontalBounds(obstructionIntersect, LineInverse(-point[1], slope, line.b));
            lines.push(line);
        }
        else {
            var xIntercects = LineParaIntersection(slope, line.b, aValue, 0, 0);
            var xIntersect = null;
            if (Math.abs(xIntercects[0]) < mirrorDiameter / 2) {
                xIntersect = xIntercects[0];
                line.SetHorizontalBounds( LineInverse(aValue * xIntercects[0] * xIntercects[0], slope, line.b),
                LineInverse(-point[1], slope, line.b));
                lines.push(line);
            }
            else if (Math.abs(xIntercects[1]) < mirrorDiameter / 2) {
                xIntersect = xIntercects[1];
                line.SetHorizontalBounds(LineInverse(aValue * xIntercects[1] * xIntercects[1], slope, line.b),
                LineInverse(-point[1], slope, line.b));
                lines.push(line);
            }

            if (xIntersect != null) {
                var slopeOfReflectiveSuface = GetSlopeOfPara(aValue, 0, xIntersect);
                var reflectedSlope = SlopeOfReflection(slopeOfReflectiveSuface, slope);
                rbValue = reflectedSlope * -xIntersect + aValue * xIntersect * xIntersect;
                var line = new Line();
                line.SetStandard(reflectedSlope, rbValue,
                    LineInverse(aValue * xIntersect * xIntersect, reflectedSlope, rbValue),
                    LineInverse(FocalLengthToAValue(aValue), reflectedSlope, rbValue), 1);
                lines.push(line);
            }
        }
    }
}

function Draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "Green";
    ctx.fillRect(10, 10, 120, 50);
    ctx.font = "20px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Calculate!", 15, 45);

    var firstTime = true;
    ctx.beginPath();
    for (var i = -(PPIn * mirrorDiameter / 2); i < PPIn * mirrorDiameter / 2; ++i) {
        var x = i / PPIn;
        if (firstTime) {

            ctx.moveTo(i + offset[0], offset[1] - aValue * x * x * PPIn);
            firstTime = false;
        }
        else {
            ctx.lineTo(i + offset[0], offset[1] - aValue * x * x * PPIn);
        }
    }
    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(apetureSize / 2 * PPIn + offset[0], offset[1] - hight * PPIn);
    ctx.lineTo(apetureSize / 2 * PPIn + offset[0], offset[1]);
    ctx.moveTo(-apetureSize / 2 * PPIn + offset[0], offset[1] - hight * PPIn);
    ctx.lineTo(-apetureSize / 2 * PPIn + offset[0], offset[1]);
    ctx.moveTo(-centralObstruction / 2 * PPIn + offset[0], offset[1] - centralObstructionHeight * PPIn + 0.5 * centralObstruction * PPIn);
    ctx.lineTo(centralObstruction / 2 * PPIn + offset[0],  offset[1] - centralObstructionHeight * PPIn - 0.5 * centralObstruction * PPIn);
    ctx.stroke();


    if (drawLines) {
        for (var c = 0; c < lineColor.length; ++c) {
            for (var i = 0; i < lines.length; ++i) {
                if (lines[i].colorIndex == c) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor[lines[i].colorIndex];
                    ctx.moveTo(lines[i].leftBound * PPIn + offset[0], offset[1] - PPIn * lines[i].EvalAt(lines[i].leftBound));
                    ctx.lineTo(lines[i].rightBound * PPIn + offset[0], offset[1] - PPIn * lines[i].EvalAt(lines[i].rightBound));
                    ctx.stroke();

                    if(lines[i].offX != null && lines[i].offY != null){
                        ctx.beginPath();
                        ctx.arc(lines[i].offX * PPIn + offset[0], -lines[i].offY * PPIn + offset[1], raySpread * PPIn / (numRays * 3), 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
            }
        }

    }

    //ctx.fillStyle = "green";
    //ctx.fillRect(offset[0] - 25, offset[1] - PPIn - 50, 50, 50);

    requestAnimationFrame(Draw);
}

function Update() {
    if(Math.abs(angle) < searchAngle / 2){
        angle += 0.001 * searchDirection;
    }
    else{
        searchDirection *= -1;
        angle += 0.001 * searchDirection;
    }
    Calculate();
}

document.addEventListener("click", function (e) {
    if (e.clientX > 10 && e.clientX < 130 && e.clientY > 10 && e.clientY < 60) {
        Calculate();
    }
});

class Line {
    constructor(){
        this.a = 0;
        this.b = 0;
        this.leftBound = -1000;
        this.rightBound = 1000;
        this.colorIndex = 0;

        this.offX = null;
        this.offY = null;

        this.angle = 0;
    }

    SetStandard(aValue, bValue, leftBound = -1000, rightBound = 1000, colorIndex = 0) {
        this.a = aValue;
        this.b = bValue;
        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.colorIndex = colorIndex;

        this.angle = Math.atan(this.a);
    }

    SetSlopeToAngle(angle){
        this.a = Math.tan(angle);
        this.angle = angle;
    }
    SetHorizontalBounds(leftBound = -1000, rightBound = 1000){
        this.leftBound = leftBound;
        this.rightBound = rightBound;
    }
    SetBToOffsets(offsetX, offsetY){
        this.b = (this.a * -offsetX) + offsetY;
        this.offX = offsetX;
        this.offY = offsetY;
    }
    EvalAt(x){
        return this.a * x + this.b;
    }
}

class MirrorIntersection{
    constructor(distance, xValue){
        this.dist = distance;
        this.xValue = xValue;
    }
}

class LinearMirror{
    constructor(){
        this.line = null;
    }

    SetLine(line){
        this.line = line;
        this.line.colorIndex = 0;
    }
    SetStandard(aValue, bValue, leftBound, rightBound){
        this.line = new Line();
        this.line.SetStandard(aValue, bValue, leftBound, rightBound, 0)
    }
    SetAngled(angle, offX, offY, leftDist, rightDist){
        this.line = new Line();
        this.line.SetStandard(Math.tan(angle), (Math.tan(angle) * -offX) + offY, offX - leftDist, offX + rightDist, 0);
    }

    ReflectionAngle(incomingLightAngle){
        return (2 * incomingLightAngle - this.line.angle);
    }
    ReflectedLine(incomingLine){
        var intersectX = LineLineIntersection(this.line.a, this.line.b, incomingLine.a, incomingLine.b);
        var angle = this.ReflectionAngle(incomingLine.angle);
        var line = new Line();
        line.SetStandard(Math.tan(angle), (Math.tan(angle) * -intersectX) + this.line.EvalAt(intersectX), -apetureSize / 2, intersectX);
    }
}