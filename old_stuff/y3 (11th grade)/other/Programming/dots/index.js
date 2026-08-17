var vertex = `#version 300 es

    uniform vec2 screenSize;

    in vec3 position;
    in vec3 color;
    in float brightness;
    out vec3 relPosition;
    out vec3 starColor;
    out float starBrightness;
    uniform vec3 eye;
    
    uniform mat3 yRotation;
    uniform mat3 xRotation;

    void main(){
        vec3 pos = position - eye;
        vec2 projected = vec2(-2.0 * screenSize.x, 0);
        pos = pos * yRotation * xRotation;
        relPosition = pos;
        starColor = color;
        starBrightness = brightness;
        if(pos.z < 0.0){
            projected = vec2(pos.x / pos.z, pos.y / pos.z);
        }
        gl_Position = vec4(projected.x * (screenSize.y / screenSize.x), projected.y,  -pos.z / 10.0, 1);
        gl_PointSize = 4.0 / abs(pos.z);
    } 
`;
var frag = `#version 300 es

    precision highp float;

    out vec4 Color;
    in vec3 relPosition;
    in vec3 starColor;
    in float starBrightness;

    void main(){
        float l = length(relPosition);
        Color = vec4(starColor * starBrightness / (l * l), 1);
    }
`;

var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var gl = canvas.getContext("webgl2");

var isPointerCaptured = false;

var program;

var screenSizeUniformLocation;

var positionAttribLocation;
var colorAttribLocation;
var brightnessAttribLocation;

var eyeUniformLocation;
var yRotationUniformLocation;
var xRotationUniformLocation;

var positionBuffer;
var colorBuffer;
var brightnessBuffer;

var positions = [
    0, 0, 0,
    0, 0.5, 0,
    0.7, 1, 1
];

var color = [
    1, 1, 1,
    1, 0.1, 0,
    0.1, 0.1, 1
];

var brightness = [
    1, 0.8, 2
];

var eyePos = [0, 0, 1];

var rotations = [0, 0];

var vao;

var numParticles = 10000;

function LoadStuff() {
    if (!gl) {
        alert("NO Webgl2");
    }

    setInterval(Update, 15);

    for(var i = 0; i < numParticles - 3; i++){
        positions.push((Math.random() - 0.5) * 10);
        positions.push((Math.random() - 0.5) * 10);
        positions.push((Math.random() - 0.5) * 10);

        var rgb = bv2rgb(Math.random() * 2.4 - 0.4);

        color.push(rgb[0]);
        color.push(rgb[1]);
        color.push(rgb[2]);

        brightness.push(Math.random() * 2);
    }

    program = CreateProgram(vertex, frag);

    screenSizeUniformLocation = gl.getUniformLocation(program, "screenSize");

    eyeUniformLocation = gl.getUniformLocation(program, "eye");
    yRotationUniformLocation = gl.getUniformLocation(program, "yRotation");
    xRotationUniformLocation = gl.getUniformLocation(program, "xRotation");

    positionAttribLocation = gl.getAttribLocation(program, "position");
    colorAttribLocation = gl.getAttribLocation(program, "color");
    brightnessAttribLocation = gl.getAttribLocation(program, "brightness");
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttribLocation);

    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttribLocation, size, type, normalize, stride, offset);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

    brightnessBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, brightnessBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(brightness), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(brightnessAttribLocation);
    gl.vertexAttribPointer(brightnessAttribLocation, 1, gl.FLOAT, false, 0, 0);

    requestAnimationFrame(Render);
}

function Update(){
    if(keydown[0] || keydown[4]){
        eyePos[2] -= 0.01 * Math.cos(rotations[0]);
        eyePos[0] -= 0.01 * Math.sin(rotations[0]);
    }
    if(keydown[1] || keydown[5]){
        eyePos[0] += 0.01 * Math.cos(rotations[0]);
        eyePos[2] -= 0.01 * Math.sin(rotations[0]);
    }
    if(keydown[2] || keydown[6]){
        eyePos[2] += 0.01 * Math.cos(rotations[0]);
        eyePos[0] += 0.01 * Math.sin(rotations[0]);
    }
    if(keydown[3] || keydown[7]){
        eyePos[0] -= 0.01 * Math.cos(rotations[0]);
        eyePos[2] += 0.01 * Math.sin(rotations[0]);
    }
    if(keydown[8]){
        eyePos[1] -= 0.01;
    }
    if(keydown[9]){
        eyePos[1] += 0.01;
    }
    if(keydown[10]){
        rotations[1] += 0.01;
    }
    if(keydown[11]){
        rotations[0] -= 0.01;
    }
    if(keydown[12]){
        rotations[1] -= 0.01;
    }
    if(keydown[13]){
        rotations[0] += 0.01;
    }
}

function Render() {

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    gl.uniform2f(screenSizeUniformLocation, canvas.width, canvas.height);

    gl.uniform3f(eyeUniformLocation, eyePos[0], eyePos[1], eyePos[2]);

    gl.uniformMatrix3fv(yRotationUniformLocation, false, [
        Math.cos(rotations[0]), 0, -Math.sin(rotations[0]),
        0                     , 1, 0                      ,
        Math.sin(rotations[0]), 0, Math.cos(rotations[0])
    ]);
    gl.uniformMatrix3fv(xRotationUniformLocation, false, [
        1, 0, 0,
        0,  Math.cos(rotations[1]), -Math.sin(rotations[1]),
        0,  Math.sin(rotations[1]), Math.cos(rotations[1])
    ]);

    gl.drawArrays(gl.POINTS, 0, numParticles);

    requestAnimationFrame(Render);
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

//original function from: https://stackoverflow.com/questions/21977786/star-b-v-color-index-to-apparent-rgb-color/22630970#22630970
//adapted to js by me
//---------------------------------------------------------------------------
function bv2rgb(bv)    // RGB <0,1> <- BV <-0.4,+2.0> [-]
    {
        var rgb = [0.0, 0.0, 0.0]; // r = rgb[0], g = rgb[1], b = rgb[2]
    var t; if (bv<-0.4) bv=-0.4; if (bv> 2.0) bv= 2.0;
         if ((bv>=-0.40)&&(bv<0.00)) { t=(bv+0.40)/(0.00+0.40); rgb[0]=0.61+(0.11*t)+(0.1*t*t); }
    else if ((bv>= 0.00)&&(bv<0.40)) { t=(bv-0.00)/(0.40-0.00); rgb[0]=0.83+(0.17*t)          ; }
    else if ((bv>= 0.40)&&(bv<2.10)) { t=(bv-0.40)/(2.10-0.40); rgb[0]=1.00                   ; }
         if ((bv>=-0.40)&&(bv<0.00)) { t=(bv+0.40)/(0.00+0.40); rgb[1]=0.70+(0.07*t)+(0.1*t*t); }
    else if ((bv>= 0.00)&&(bv<0.40)) { t=(bv-0.00)/(0.40-0.00); rgb[1]=0.87+(0.11*t)          ; }
    else if ((bv>= 0.40)&&(bv<1.60)) { t=(bv-0.40)/(1.60-0.40); rgb[1]=0.98-(0.16*t)          ; }
    else if ((bv>= 1.60)&&(bv<2.00)) { t=(bv-1.60)/(2.00-1.60); rgb[1]=0.82         -(0.5*t*t); }
         if ((bv>=-0.40)&&(bv<0.40)) { t=(bv+0.40)/(0.40+0.40); rgb[2]=1.00                   ; }
    else if ((bv>= 0.40)&&(bv<1.50)) { t=(bv-0.40)/(1.50-0.40); rgb[2]=1.00-(0.47*t)+(0.1*t*t); }
    else if ((bv>= 1.50)&&(bv<1.94)) { t=(bv-1.50)/(1.94-1.50); rgb[2]=0.63         -(0.6*t*t); }

    return rgb;
    }
//---------------------------------------------------------------------------


var keydown = new Array(10).fill(false);

document.addEventListener("keyup", function(e){
    if(e.key == "w"){keydown[0] = false}
    if(e.key == "a"){keydown[1] = false}
    if(e.key == "s"){keydown[2] = false}
    if(e.key == "d"){keydown[3] = false}
    if(e.key == "ArrowUp"){keydown[4] = false}
    if(e.key == "ArrowLeft"){keydown[5] = false}
    if(e.key == "ArrowDown"){keydown[6] = false}
    if(e.key == "ArrowRight"){keydown[7] = false}
    if(e.key == " "){keydown[8] = false}
    if(e.key == "Shift"){keydown[9] = false}
    if(e.key == "i"){keydown[10] = false}
    if(e.key == "j"){keydown[11] = false}
    if(e.key == "k"){keydown[12] = false}
    if(e.key == "l"){keydown[13] = false}
});

document.addEventListener("keydown", function(e){
    if(e.key == "w"){keydown[0] = true}
    if(e.key == "a"){keydown[1] = true}
    if(e.key == "s"){keydown[2] = true}
    if(e.key == "d"){keydown[3] = true}
    if(e.key == "ArrowUp"){keydown[4] = true}
    if(e.key == "ArrowLeft"){keydown[5] = true}
    if(e.key == "ArrowDown"){keydown[6] = true}
    if(e.key == "ArrowRight"){keydown[7] = true}
    if(e.key == " "){keydown[8] = true}
    if(e.key == "Shift"){keydown[9] = true}
    if(e.key == "i"){keydown[10] = true}
    if(e.key == "j"){keydown[11] = true}
    if(e.key == "k"){keydown[12] = true}
    if(e.key == "l"){keydown[13] = true}
});

function CanvasClick(){
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
        rotations[0] += e.movementX * 0.005;
        rotations[1] -= e.movementY * 0.005;
   }
})