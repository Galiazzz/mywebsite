var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var gl = canvas.getContext("webgl2");
var shader;

var offX, offY;
var zoom;

var useColor = 1;

var vertex = `
    attribute vec4 aVertexPosition;
    varying vec4 v_position;

    void main(){
        gl_Position = aVertexPosition;
        v_position = aVertexPosition;
    }
`;

var fragment = `
    precision highp float;

    varying vec4 v_position;

    uniform vec2 windowSize;
    uniform vec2 windowOffset;
    uniform float zoom;
    uniform int useColor;

    const float maxIterations = 128.0;
    const float cutoff = 1000.0;

    //const float infinity = 1.0 / 0.0;

    float HueToRGB(float hue){
        if(hue < 0.0) {hue++;}
        if(hue > 1.0) {hue--;}
        if(hue < 1.0/6.0) {return 6.0 * hue;}
        if(hue < 1.0/2.0) {return 1.0;}
        if(hue < 2.0/3.0) {return (2.0/3.0 - hue) * 6.0;}
        return 0.0;
    }

    void main(){
        
        vec2 screenPos = (vec2(v_position.x * (windowSize.x / windowSize.y), v_position.y) + windowOffset / zoom) * zoom;
        vec2 value = vec2(0.0, 0.0);
        float infIterCount = 0.0;
        for(float i = 0.0; i < maxIterations; i++){
            value = vec2(value.x * value.x - value.y * value.y, 2.0 * value.y * value.x) + screenPos;
            if(value.x * value.x + value.y * value.y > cutoff * cutoff && infIterCount == 0.0){
                infIterCount = i;
                break;
            }
        }

        float v = abs(value.x + value.y);
        if(useColor == 0){
            if(infIterCount == 0.0){
                gl_FragColor = vec4(v, value.x, value.y, 1.0);
            }
            else{
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
        }
        else if(useColor == 1){
            if(infIterCount / maxIterations == 0.0){
                gl_FragColor = vec4(v, value.x, value.y, 1.0);
            }
            else{
                float f = infIterCount / maxIterations;
                
                gl_FragColor = vec4(HueToRGB(f + 1.0/3.0), HueToRGB(f), HueToRGB(f - 1.0/3.0), 1.0);
            }
        }
        else {
            if(v < cutoff && v > cutoff * -1.0 && infIterCount == 0.0){
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
            else if((v == cutoff || v == cutoff * -1.0) && infIterCount == 0.0){
                gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
            }
            else{
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
        }
        
        //gl_FragColor = vec4(v_position.x * 0.5 + 0.5, v_position.y * 0.5 + 0.5, 0.5, 1.0);
    }
`;


function LoadStuff() {
    if (gl === null) {
        alert("webgl not working");
        return;
    }

    offX = 0;
    offY = 0;
    zoom = 1;

    shader = InitializeShaderProgram(vertex, fragment);

    setInterval(Draw, 10);
}

function Draw() {

    if (upPressed) {
        offY += .01 * zoom;
    }
    if (downPressed) {
        offY -= .01 * zoom;
    }
    if (rightPressed) {
        offX += .01 * zoom;
    }
    if (leftPressed) {
        offX -= .01 * zoom;
    }
    if (zoomIn) {
        zoom /= 1.01;
        offX -= 0.0001 * (canvas.width / 2 - mouseX) * zoom;
        offY -= 0.0001 * (mouseY - canvas.height / 2) * zoom;
    }
    if (zoomOut) {
        zoom *= 1.01;
        offX += 0.0001 * (canvas.width / 2 - mouseX) * zoom;
        offY += 0.0001 * (mouseY - canvas.height / 2) * zoom;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var verticies = new Float32Array([
        -1, -1, 1, -1, -1, 1, //triangle 1
        -1, 1, 1, 1, 1, -1, //triangle 2
    ]);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

    var itemSize = 2;
    var numItems = verticies.length / itemSize;
    gl.useProgram(shader);

    shader.windowSize = gl.getUniformLocation(shader, "windowSize");
    gl.uniform2fv(shader.windowSize, [window.innerWidth, window.innerHeight]);
    shader.windowOffset = gl.getUniformLocation(shader, "windowOffset");
    gl.uniform2fv(shader.windowOffset, [offX, offY]);
    shader.zoom = gl.getUniformLocation(shader, "zoom");
    gl.uniform1f(shader.zoom, zoom);
    shader.useColor = gl.getUniformLocation(shader, "useColor");
    gl.uniform1i(shader.useColor, useColor);

    shader.aVertexPosition = gl.getAttribLocation(shader, "aVertexPosition");
    gl.enableVertexAttribArray(shader.aVertexPosition);
    gl.vertexAttribPointer(shader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, numItems);
}

var upPressed = false, downPressed = false, rightPressed = false, leftPressed = false, zoomIn = false, zoomOut = false;

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" || e.key == "w") {
        upPressed = true;
    }
    if (e.key == "ArrowDown" || e.key == "s") {
        downPressed = true;
    }
    if (e.key == "ArrowRight" || e.key == "d") {
        rightPressed = true;
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
        leftPressed = true;
    }
    if (e.key == "z") {
        zoomIn = true;
    }
    if (e.key == "x") {
        zoomOut = true;
    }
    if (e.key == "c") {
        switch (useColor) {
            case 0: useColor = 1; break;
            case 1: useColor = 2; break;
            case 2: useColor = 0; break;
        }
    }
})
document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowUp" || e.key == "w") {
        upPressed = false;
    }
    if (e.key == "ArrowDown" || e.key == "s") {
        downPressed = false;
    }
    if (e.key == "ArrowRight" || e.key == "d") {
        rightPressed = false
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
        leftPressed = false;
    }
    if (e.key == "z") {
        zoomIn = false;
    }
    if (e.key == "x") {
        zoomOut = false;
    }
})

var mouseX = 0, mouseY = 0;
document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
})

function InitializeShaderProgram(vsSource, fsSource) {
    const vertexShader = LoadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = LoadShader(gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("unable to initialize the shader program" + gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
}

function LoadShader(type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);


    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}