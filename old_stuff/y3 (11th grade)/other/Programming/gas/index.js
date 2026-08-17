var pointVertex = `#version 300 es

    in vec2 position;

    void main(){
        gl_Position = vec4(position, 0, 1);
    }

`
var pointFragment = `#version 300 es
    precision highp float;

    uniform sampler2D texture;
    uniform int pass;

    out vec4 Color;

    void main(){
        ivec2 texelCoord = ivec2(gl_FragCoord);
        vec3 value = texelFetch(texture, texelCoord, 0).xyz;

        float f = value[pass];
        int i = floatBitsToInt(f);
        //The crazy first line is because glsl doesn't have >>> so this makes sure that the first bit doesn't get 'smeared' and make it -1
        //otherwise it would be float((i & 0xff000000) >> 0x18) / float(0xff);

        float  top = float((((i & 0xff000000) >> 0x04) & 0x0ff00000) >> 0x14 ) / float(0xff);
        float tmid = float((i & 0x00ff0000) >> 0x10) / float(0xff);
        float lmid = float((i & 0x0000ff00) >> 0x08) / float(0xff);
        float  low = float((i & 0x000000ff) >> 0x00) / float(0xff);
        
        Color = vec4(low, lmid, tmid, top);//vec4(top, tmid, lmid, low);
    }
`

var renderVertex = `#version 300 es
    in vec2 position;
    
    out vec2 screenSpace;

    void main(){
        screenSpace = position;
        gl_Position = vec4(position, 0, 1);
    }
`
var renderFragment = `#version 300 es
    precision highp float;

    in vec2 screenSpace;

    out vec4 Color;

    uniform sampler2D texture;

    const float PI = 3.14159265359;
    const vec2 FOV = vec2(PI/4.0, PI/4.0);

    void main(){
        vec2 angle = screenSpace * FOV;
        Color = vec4(screenSpace * 0.5 + 0.5, 0, 1);
    }
`

var canvas = document.getElementById("canvas");
var rendergl = canvas.getContext("webgl2");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


var pointProgram;
var renderProgram;

var numParticles = 3;

var computeCanvas = document.getElementById("computeCanvas");
var computegl = computeCanvas.getContext("webgl2");
computeCanvas.height = 1;
computeCanvas.width = numParticles;

var positions = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];

var pointPositionAttribLocation;
var pointPositionBuffer;

var pointVAO;

var pointTexture;
var pointTextureUniformLocation;
var pointPassUniformLocation;

var renderVAO;
var renderPoisitionArribLocation;
var renderPositionBuffer;
var renderTextureUniformLocation;

function LoadStuff() {
    if (!rendergl || !computegl) {
        alert("NO GL FOR YOU!")
    }

    for (var i = positions.length / 3; i < numParticles; i++) {
        positions.push(Math.random());
        positions.push(Math.random());
        positions.push(Math.random());
    }

    pointProgram = CreateProgram(computegl, pointVertex, pointFragment);
    renderProgram = CreateProgram(rendergl, renderVertex, renderFragment);

    pointVAO = computegl.createVertexArray();
    computegl.bindVertexArray(pointVAO);

    pointPositionAttribLocation = computegl.getAttribLocation(pointProgram, "position");

    pointPositionBuffer = computegl.createBuffer();
    computegl.bindBuffer(computegl.ARRAY_BUFFER, pointPositionBuffer);
    computegl.bufferData(computegl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1]), computegl.STATIC_DRAW);
    computegl.enableVertexAttribArray(pointPositionAttribLocation);
    computegl.vertexAttribPointer(pointPositionAttribLocation, 2, computegl.FLOAT, false, 0, 0);

    pointTextureUniformLocation = computegl.getUniformLocation(pointProgram, "texture");
    pointPassUniformLocation = computegl.getUniformLocation(pointProgram, "pass");

    var pointTextureWidth = numParticles;
    var pointTextureHeight = 1;
    pointTexture = computegl.createTexture();
    computegl.bindTexture(computegl.TEXTURE_2D, pointTexture);
    computegl.pixelStorei(computegl.UNPACK_ALIGNMENT, 4);
    computegl.texImage2D(
        computegl.TEXTURE_2D,
        0,
        computegl.RGB32F, //internal format
        pointTextureWidth,
        pointTextureHeight,
        0, //border
        computegl.RGB, //format
        computegl.FLOAT,
        new Float32Array(positions)
    );
    computegl.texParameteri(computegl.TEXTURE_2D, computegl.TEXTURE_MIN_FILTER, computegl.NEAREST);
    computegl.texParameteri(computegl.TEXTURE_2D, computegl.TEXTURE_MAG_FILTER, computegl.NEAREST);
    computegl.texParameteri(computegl.TEXTURE_2D, computegl.TEXTURE_WRAP_S, computegl.CLAMP_TO_EDGE);
    computegl.texParameteri(computegl.TEXTURE_2D, computegl.TEXTURE_WRAP_T, computegl.CLAMP_TO_EDGE);


    renderVAO = rendergl.createVertexArray();
    rendergl.bindVertexArray(renderVAO);
    renderPoisitionArribLocation = rendergl.getAttribLocation(renderProgram, "position");
    renderPositionBuffer = rendergl.createBuffer();
    rendergl.bindBuffer(rendergl.ARRAY_BUFFER, renderPositionBuffer);
    rendergl.bufferData(rendergl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1]), rendergl.STATIC_DRAW);
    rendergl.enableVertexAttribArray(renderPoisitionArribLocation);
    rendergl.vertexAttribPointer(renderPoisitionArribLocation, 2, rendergl.FLOAT, false, 0, 0);
    renderTextureUniformLocation = rendergl.getUniformLocation(renderProgram, "texture");
    


    requestAnimationFrame(Render);
}

function Render() {

    computegl.useProgram(pointProgram);
    computegl.uniform1i(pointTextureUniformLocation, 0);
    computegl.uniform1i(pointPassUniformLocation, 0);
    computegl.drawArrays(computegl.TRIANGLES, 0, 6);

    var r = new Uint8Array(numParticles * 4);
    computegl.readPixels(0, 0, numParticles, 1, computegl.RGBA, computegl.UNSIGNED_BYTE, r, 0);
    var floatR = new Float32Array(r.buffer);

    computegl.uniform1i(pointPassUniformLocation, 1);
    computegl.drawArrays(computegl.TRIANGLES, 0, 6);

    var g = new Uint8Array(numParticles * 4);
    computegl.readPixels(0, 0, numParticles, 1, computegl.RGBA, computegl.UNSIGNED_BYTE, g, 0);
    var floatG = new Float32Array(g.buffer);

    computegl.uniform1i(pointPassUniformLocation, 2);
    computegl.drawArrays(computegl.TRIANGLES, 0, 6);

    var b = new Uint8Array(numParticles * 4);
    computegl.readPixels(0, 0, numParticles, 1, computegl.RGBA, computegl.UNSIGNED_BYTE, b, 0);
    var floatB = new Float32Array(b.buffer);


    var result = new Float32Array(floatR.length + floatG.length + floatB.length);
    for (var i = 0; i < numParticles; ++i) {
        result[i * 3] = floatR[i];
        result[i * 3 + 1] = floatG[i];
        result[i * 3 + 2] = floatB[i];
    }

    computegl.texImage2D(
        computegl.TEXTURE_2D,
        0,
        computegl.RGB32F, //internal format
        numParticles,
        1,
        0, //border
        computegl.RGB, //format
        computegl.FLOAT,
        new Float32Array(result)
    );

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    rendergl.viewport(0, 0, rendergl.canvas.width, rendergl.canvas.height);

    rendergl.clearColor(0, 0, 0, 1);
    rendergl.clear(rendergl.COLOR_BUFFER_BIT);

    rendergl.useProgram(renderProgram);
    rendergl.uniform1i(renderTextureUniformLocation, 0);
    rendergl.drawArrays(rendergl.TRIANGLES, 0, 6);

    //requestAnimationFrame(Render);
}

function CreateShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function CreateProgram(gl, vertexSource, fragmentSource) {
    var vertexShader = CreateShader(gl, vertexSource, gl.VERTEX_SHADER);
    var fragmentShader = CreateShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

    var Program = gl.createProgram();
    gl.attachShader(Program, vertexShader);
    gl.attachShader(Program, fragmentShader);
    gl.linkProgram(Program);
    if (gl.getProgramParameter(Program, gl.LINK_STATUS)) {
        return Program;
    }
    console.error(gl.getProgramInfoLog(Program));
    gl.deleteProgram(Program);
}