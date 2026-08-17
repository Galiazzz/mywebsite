var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var gl = canvas.getContext("webgl2");

var angleY = 0, angleX = 0;
var camX = 0, camY = 0, camZ = 0;

var speedModifier = 1;

var quadProgram;
var quadPositions = [];
var quadBuffer;
var quadVAO;

var UBO;
var quadUBOIndex;

const UBOVariableNames = ["screenWidthOverHeight", "cameraPos", "transform"];
var UBOVariableIndicies;
var UBOVariableOffsets;

function LoadStuff(){
    quadProgram = CreateProgram(vertexSource, fragmentSource);

    quadPositions = [
        -1, 1,  -1, -1, 1, -1,
        -1, 1,  1, 1,  1, -1
    ];
    
    quadVAO = gl.createVertexArray();
    gl.bindVertexArray(quadVAO);

    quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadPositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);


    quadUBOIndex = gl.getUniformBlockIndex(quadProgram, "Uniforms");
    var blockSize = gl.getActiveUniformBlockParameter(quadProgram, quadUBOIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
    UBO = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
    gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    //the 0 is the index of the uniform block
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, UBO);

    //for both the indicies and offsets, index 0 is screenWidthOverHeight, index 1 is cameraPos, index 2 is transform mat
    UBOVariableIndicies = gl.getUniformIndices(quadProgram, UBOVariableNames);
    UBOVariableOffsets = gl.getActiveUniforms(quadProgram, UBOVariableIndicies, gl.UNIFORM_OFFSET);

    requestAnimationFrame(Draw);
    setInterval(Update, 10);
}

function Update(){
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
        camX += 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[1]) {
        camX -= 0.01 * Math.cos(angleY) * speedModifier;
        camZ += 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[2]) {
        camZ -= 0.01 * Math.cos(angleY) * speedModifier;
        camX -= 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[3]) {
        camX += 0.01 * Math.cos(angleY) * speedModifier;
        camZ -= 0.01 * Math.sin(angleY) * speedModifier;
    }
    if (keydown[8]) {
        camY += 0.01 * speedModifier;
    }
    if (keydown[9]) {
        camY -= 0.01 * speedModifier;
    }
    if (keydown[4]) {
        angleX -= 0.01;
    }
    if (keydown[5]) {
        angleY -= 0.01;
    }
    if (keydown[6]) {
        angleX += 0.01;
    }
    if (keydown[7]) {
        angleY += 0.01;
    }
}

function Draw(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var index = gl.getUniformBlockIndex(quadProgram, "Uniforms");
    gl.uniformBlockBinding(quadProgram, index, 0); // the 0 is the index of the uniform block

    gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
    gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[0], new Float32Array([canvas.width / canvas.height]));
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
    var combined = MulMatrix3x3(YRot, xRot);
    var rot = [
        combined[0], combined[1], combined[2], 0,
        combined[3], combined[4], combined[5], 0,
        combined[6], combined[7], combined[8], 0,
    ];
    gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[2], new Float32Array(rot));
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(quadProgram);
    gl.bindVertexArray(quadVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(Draw);
}

function MulMatrix3x3(leftMat, rightMat) {
    return [
        rightMat[0] * leftMat[0] + rightMat[3] * leftMat[1] + rightMat[6] * leftMat[2], rightMat[1] * leftMat[0] + rightMat[4] * leftMat[1] + rightMat[7] * leftMat[2], rightMat[2] * leftMat[0] + rightMat[5] * leftMat[1] + rightMat[8] * leftMat[2],
        rightMat[0] * leftMat[3] + rightMat[3] * leftMat[4] + rightMat[6] * leftMat[5], rightMat[1] * leftMat[3] + rightMat[4] * leftMat[4] + rightMat[7] * leftMat[5], rightMat[2] * leftMat[3] + rightMat[5] * leftMat[4] + rightMat[8] * leftMat[5],
        rightMat[0] * leftMat[6] + rightMat[3] * leftMat[7] + rightMat[6] * leftMat[8], rightMat[1] * leftMat[6] + rightMat[4] * leftMat[7] + rightMat[7] * leftMat[8], rightMat[2] * leftMat[6] + rightMat[5] * leftMat[7] + rightMat[8] * leftMat[8]
    ];
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
        angleY += e.movementX * 0.005;
        angleX += e.movementY * 0.005;
        angleX = Math.max(Math.min(angleX, Math.PI / 2), -Math.PI / 2)
    }
})