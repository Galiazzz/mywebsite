/*
 web program to visualize distances to nearby open star clusters for an end-of-year highschool physics project.
 webgl2 is used to render the graphics so as to allow the GPU to do much of the heavy lifting.

 Author: Matthew Prem
 Date of creation: May 16, 2022 (5-16-2022)

 thank you to jialiang for creating the tutorial on Uniform Buffer Objects which I followed
 link: https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880
 */

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var angleY = 0, angleX = 0;
var camX = 0, camY = 0, camZ = 0;

var RAs = [];
var DECs = [];
var dists = [];

var positions = [];
var positionBuffer;

var colors = [];
var colorBuffer;

var globePositions = [];
var globePositionBuffer;

var starProgram;
var globeProgram;

var starVAO;
var globeVAO;

var UBO;
var starUBOIndex;

const UBOVariableNames = ["screenSize", "cameraPos", "transform"];
var UBOVariableIndicies;
var UBOVariableOffsets;

var ticker;

var speedModifier = 1;

function LoadStuff() {

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //var coords = EquitorialCoordsToRadians(0, 90);
    //positions.push(...RadiansToPointOnSphere(coords));
    //colors.push(...[0, 1, 0]);

    /*for(var RA = 0; RA < 360; RA++){
        for(var DEC = -90; DEC < 90; DEC++){
            var coords = EquitorialCoordsToRadians(RA, DEC);
            positions.push(...RadiansToPointOnSphere(coords));

            colors.push(0);
            colors.push(1);
            colors.push(0);
        }
    }*/

    for (var r = 1; r < 10; r++) {
        if (globePositions.length > 3) {
            globePositions.push(globePositions[globePositions.length - 3]);
            globePositions.push(globePositions[globePositions.length - 3]);
            globePositions.push(globePositions[globePositions.length - 3]);
        }

        for (var n = -Math.PI / 2; n <= Math.PI / 2; n += 0.1) {
            for (var i = 0; i <= 2 * Math.PI; i += 0.1) {
                var pos = RadiansToPointOnSphere({ RA: i, DEC: n });
                if (n != -Math.PI / 2 || i != 0) {
                    globePositions.push(pos[0] * r * 5);
                    globePositions.push(pos[1] * r * 5);
                    globePositions.push(pos[2] * r * 5);
                }
                globePositions.push(pos[0] * r * 5);
                globePositions.push(pos[1] * r * 5);
                globePositions.push(pos[2] * r * 5);
            }
        }
    }


    AttachHyades();
    AttachPleiades();
    AttachTrepezium();
    AttachBeehive();
    AttatchDouble();
    AttachRossette();
    AttachComa();
    AttachM7();
    AttachSouthern();
    AttachIC2391();
    AttachM39();

    starProgram = CreateProgram(starVertexShader, starFragmentShader);
    globeProgram = CreateProgram(globeVertexShader, globeFragmentShader);

    starUBOIndex = gl.getUniformBlockIndex(starProgram, "Uniforms");
    var blockSize = gl.getActiveUniformBlockParameter(starProgram, starUBOIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
    UBO = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
    gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    //the 0 is the index of the uniform block
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, UBO);

    //for both the indicies and offsets, index 0 is screenSize, index 1 is cameraPos, index 2 is transform mat
    UBOVariableIndicies = gl.getUniformIndices(starProgram, UBOVariableNames);
    UBOVariableOffsets = gl.getActiveUniforms(starProgram, UBOVariableIndicies, gl.UNIFORM_OFFSET);

    starVAO = gl.createVertexArray();
    gl.bindVertexArray(starVAO);

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

    globeVAO = gl.createVertexArray();
    gl.bindVertexArray(globeVAO);

    globePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, globePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(globePositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    ticker = setInterval(Update, 10);

    requestAnimationFrame(Draw);
}

function Draw() {

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var index = gl.getUniformBlockIndex(starProgram, "Uniforms");
    gl.uniformBlockBinding(starProgram, index, 0); // the 0 is the index of the uniform block

    index = gl.getUniformBlockIndex(globeProgram, "Uniforms");
    gl.uniformBlockBinding(globeProgram, index, 0);

    gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
    gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[0], new Float32Array([canvas.width, canvas.height]));
    gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[1], new Float32Array([camX, camY, camZ]));
    var YRot = [
        Math.cos(angleY), 0, Math.sin(angleY),
        0, 1, 0,
        -Math.sin(angleY), 0, Math.cos(angleY)
    ];
    var xRot = [
        1, 0, 0,
        0, Math.cos(angleX), -Math.sin(angleX),
        0, Math.sin(angleX), Math.cos(angleX)
    ];
    var combined = MulMatrix3x3(xRot, YRot);
    var rot = [
        combined[0], combined[1], combined[2], 0,
        combined[3], combined[4], combined[5], 0,
        combined[6], combined[7], combined[8], 0,
    ];//MulMatrix3x3(xRot, YRot);
    gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[2], new Float32Array(rot));
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(starProgram);
    gl.bindVertexArray(starVAO);
    gl.drawArrays(gl.POINTS, 0, positions.length / 3);

    gl.useProgram(globeProgram);
    gl.bindVertexArray(globeVAO);
    gl.drawArrays(gl.LINES, 0, globePositions.length / 3);

    requestAnimationFrame(Draw);
}

function Update() {

    if (keydown[10]) {
        speedModifier = 5;
    }
    else if (keydown[11]) {
        speedModifier = 0.1;
    }
    else {
        speedModifier = 1;
    }

    if (keydown[0]) {
        camZ += 0.01 * Math.cos(angleY) * speedModifier;
        camX -= 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[1]) {
        camX -= 0.01 * Math.cos(angleY) * speedModifier;
        camZ -= 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[2]) {
        camZ -= 0.01 * Math.cos(angleY) * speedModifier;
        camX += 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[3]) {
        camX += 0.01 * Math.cos(angleY) * speedModifier;
        camZ += 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[8]) {
        camY += 0.01 * speedModifier;
    }
    if (keydown[9]) {
        camY -= 0.01 * speedModifier;
    }
    if (keydown[4]) {
        angleX += 0.01;
    }
    if (keydown[5]) {
        angleY += 0.01;
    }
    if (keydown[6]) {
        angleX -= 0.01;
    }
    if (keydown[7]) {
        angleY -= 0.01;
    }

    document.getElementById("distance").innerText = "Your current distance from Earth: " + (Math.sqrt(camX * camX + camY * camY + camZ * camZ) * 10) + " Parsecs";
}

function MulMatrix3x3(leftMat, rightMat) {
    return [
        rightMat[0] * leftMat[0] + rightMat[3] * leftMat[1] + rightMat[6] * leftMat[2], rightMat[1] * leftMat[0] + rightMat[4] * leftMat[1] + rightMat[7] * leftMat[2], rightMat[2] * leftMat[0] + rightMat[5] * leftMat[1] + rightMat[8] * leftMat[2],
        rightMat[0] * leftMat[3] + rightMat[3] * leftMat[4] + rightMat[6] * leftMat[5], rightMat[1] * leftMat[3] + rightMat[4] * leftMat[4] + rightMat[7] * leftMat[5], rightMat[2] * leftMat[3] + rightMat[5] * leftMat[4] + rightMat[8] * leftMat[5],
        rightMat[0] * leftMat[6] + rightMat[3] * leftMat[7] + rightMat[6] * leftMat[8], rightMat[1] * leftMat[6] + rightMat[4] * leftMat[7] + rightMat[7] * leftMat[8], rightMat[2] * leftMat[6] + rightMat[5] * leftMat[7] + rightMat[8] * leftMat[8]
    ];
}

//convert the value given by SIMBAD in degrees to radians
function EquitorialCoordsToRadians(RA, DEC) {
    var RARad = RA * (Math.PI / 180);
    var DECRad = DEC * (Math.PI / 180);
    return { RA: RARad, DEC: DECRad };
}

//find point on unit sphere given coodinates
function RadiansToPointOnSphere(coordObj) {
    return [
        Math.cos(coordObj.DEC) * -Math.sin(coordObj.RA),
        Math.sin(coordObj.DEC),
        Math.cos(coordObj.DEC) * Math.cos(coordObj.RA)];
}

function CreateShader(source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function CreateProgram(vertexSource, fragmentSource) {
    var vertexShader = CreateShader(vertexSource, gl.VERTEX_SHADER);
    var fragmentShader = CreateShader(fragmentSource, gl.FRAGMENT_SHADER);

    var ShaderProgram = gl.createProgram();
    gl.attachShader(ShaderProgram, vertexShader);
    gl.attachShader(ShaderProgram, fragmentShader);

    gl.linkProgram(ShaderProgram);
    var success = gl.getProgramParameter(ShaderProgram, gl.LINK_STATUS);
    if (success) {
        return ShaderProgram;
    }
    console.error(gl.getProgramInfoLog(ShaderProgram));
    gl.deleteProgram(ShaderProgram);
}

var keydown = new Array(12).fill(false);

document.addEventListener("keyup", function (e) {
    if (e.key == "w") { keydown[0] = false }
    if (e.key == "a") { keydown[1] = false }
    if (e.key == "s") { keydown[2] = false }
    if (e.key == "d") { keydown[3] = false }
    if (e.key == "ArrowUp") { keydown[4] = false }
    if (e.key == "ArrowLeft") { keydown[5] = false }
    if (e.key == "ArrowDown") { keydown[6] = false }
    if (e.key == "ArrowRight") { keydown[7] = false }
    if (e.key == " ") { keydown[8] = false }
    if (e.key == "Shift") { keydown[9] = false }
    if (e.key == "c") { keydown[10] = false }
    if (e.key == "x") { keydown[11] = false }
});

document.addEventListener("keydown", function (e) {
    if (e.key == "w") { keydown[0] = true }
    if (e.key == "a") { keydown[1] = true }
    if (e.key == "s") { keydown[2] = true }
    if (e.key == "d") { keydown[3] = true }
    if (e.key == "ArrowUp") { keydown[4] = true }
    if (e.key == "ArrowLeft") { keydown[5] = true }
    if (e.key == "ArrowDown") { keydown[6] = true }
    if (e.key == "ArrowRight") { keydown[7] = true }
    if (e.key == " ") { keydown[8] = true; e.preventDefault(); }
    if (e.key == "Shift") { keydown[9] = true }
    if (e.key == "c") { keydown[10] = true }
    if (e.key == "x") { keydown[11] = true }
});

var isPointerCaptured = false;

function CanvasClick() {
    canvas.requestPointerLock();
}

document.addEventListener("pointerlockchange", function () {
    if (document.pointerLockElement === canvas) {
        isPointerCaptured = true;
    }
    else {
        isPointerCaptured = false;
    }
});

document.addEventListener("mousemove", function (e) {
    if (isPointerCaptured) {
        angleY -= e.movementX * 0.005;
        angleX -= e.movementY * 0.005;
        angleX = Math.max(Math.min(angleX, Math.PI / 2), -Math.PI / 2)
    }
})