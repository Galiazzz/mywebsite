var vertex = `#version 300 es

    layout(std140) uniform;

    layout(location=0) in vec3 pos;
    layout(location=1) in vec3 vel;

    out vec3 position;
    out vec3 velocity;

    struct Planet{
        vec3 pos;
        float mass;
        float radius;
    };

    uniform Planet planets[2];
    uniform vec2 windowSize;
    uniform float scale;
    uniform vec2 offset;
    uniform bool isPaused;

    void main(){
        position = pos;
        velocity = vel;

        if(!isPaused){
            vec3 force = vec3(0.0, 0.0, 0.0);

            //float dist = distance(position, planets[0].pos);
            //force -= (normalize(position - planets[0].pos)) * 0.001 + (normalize(position - planets[1].pos)) * 0.001;

            for(int i = 0; i < 2; ++i){
                if(planets[i].mass != 0.0){
                    float dist = distance(position, planets[i].pos);
                    if(dist < planets[i].radius){
                        velocity = vec3(0.0, 0.0, 0.0);
                        position = planets[i].pos;
                    }
                    else{
                        force += (normalize(position - planets[i].pos)) * -0.0001 * ((planets[i].mass * 0.1) / (dist * dist));
                    }
                }
            }

            velocity += force;

            position += velocity;
        }

        gl_PointSize = 1.0;
        gl_Position = vec4(position.x * (windowSize.y / windowSize.x) * scale - offset.x * scale, position.y * scale - offset.y * scale, position.z, 1.0);//vec4(position, 1.0);
    }

`;

var fragment = `#version 300 es
    precision highp float;

    out vec4 color;

    void main(){
        float alpha = 1.0;
        color = vec4(alpha);
    }
`;

var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var gl = canvas.getContext("webgl2");
var planetCanvas = document.getElementById("planetcanvas");
planetCanvas.height = window.innerHeight;
planetCanvas.width = window.innerWidth;
var ctx = planetCanvas.getContext("2d");

var shader;
var numPoints = 100000;

var isPaused = false;

const numPlanets = 2;
var planets = [];

var scale = 0.35;
var offsetX = 0;
var offsetY = 0;

var positionData = new Float32Array(numPoints * 3);
var velocityData = new Float32Array(numPoints * 3);

var currentVertexArray;
var currentTransformFeedback;

var positionBufferA, positionBufferB;
var velocityBufferA, velocityBufferB;
var transformFeedbackA, transformFeedbackB;
var vertexArrayA, vertexArrayB;

var windSizeLocation;
var scaleLocation;
var offsetLocation;
var isPausedLoaction;

function LoadStuff() {
    if (!gl) {
        alert("webgl2 not working");
        return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    shader = SetUpProgram(vertex, fragment);
    gl.useProgram(shader);

    planets.push(new Planet(4, .3, 1, 0, 0.1, 0, 0.0008));
    planets.push(new Planet(-4, .1, 1, 1, 0.1, 0, -0.0008));

    for (var i = 0; i < numPoints; ++i) {
        var index = i * 3;

        var planIndex = Math.floor(Math.random() * numPlanets);

        var angle = Math.random() * 2 * Math.PI
        var dist = Math.random() * 3 + 1
        positionData[index] = planets[planIndex].x + Math.cos(angle) * 2 * planets[planIndex].radius * dist;
        positionData[index + 1] = planets[planIndex].y + Math.sin(angle) * 2 * planets[planIndex].radius * dist;

        velocityData[index] = Math.sin(angle) * 0.008 * planets[planIndex].mass * Math.pow(dist, -0.5) + planets[planIndex].velX;
        velocityData[index + 1] = Math.cos(angle) * -0.008 * planets[planIndex].mass * Math.pow(dist, -0.5) + planets[planIndex].velY;
    }

    vertexArrayA = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayA);

    positionBufferA = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferA);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STREAM_COPY);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    velocityBufferA = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBufferA);
    gl.bufferData(gl.ARRAY_BUFFER, velocityData, gl.STREAM_COPY);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    transformFeedbackA = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbackA);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferA);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferA);

    vertexArrayB = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayB);

    positionBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferB);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STREAM_COPY);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    velocityBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBufferB);
    gl.bufferData(gl.ARRAY_BUFFER, velocityData, gl.STREAM_COPY);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    transformFeedbackB = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbackB);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferB);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferB);

    gl.bindVertexArray(null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    currentVertexArray = vertexArrayA;
    currentTransformFeedback = transformFeedbackB;

    windSizeLocation = gl.getUniformLocation(shader, "windowSize");
    scaleLocation = gl.getUniformLocation(shader, "scale");
    offsetLocation = gl.getUniformLocation(shader, "offset");
    isPausedLoaction = gl.getUniformLocation(shader, "isPaused");

    setInterval(Update, 10);

    requestAnimationFrame(Draw);
}

function Draw() {
    //if (!isPaused) {

    planetCanvas.height = window.innerHeight;
    planetCanvas.width = window.innerWidth;

    //scale = canvas.height / window.innerHeight;

    for (var i = 0; i < numPlanets; ++i) {
        planets[i].AttachToShader();
    }

    gl.uniform2fv(windSizeLocation, [window.innerWidth, window.innerHeight]);
    gl.uniform1f(scaleLocation, scale);
    gl.uniform2fv(offsetLocation, [offsetX, offsetY]);
    gl.uniform1i(isPausedLoaction, isPaused);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindVertexArray(currentVertexArray);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, currentTransformFeedback);

    if (currentTransformFeedback == transformFeedbackA) {
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferA);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferA);
    }
    else {
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferB);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferB);
    }

    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numPoints);
    gl.endTransformFeedback();

    if (currentVertexArray == vertexArrayA) {
        currentVertexArray = vertexArrayB;
        currentTransformFeedback = transformFeedbackA;
    }
    else {
        currentVertexArray = vertexArrayA;
        currentTransformFeedback = transformFeedbackB;
    }

    ctx.fillStyle = "green";
    for (var i = 0; i < planets.length; ++i) {
        ctx.beginPath();
        ctx.arc(((planets[i].x * (planetCanvas.height / planetCanvas.width) - offsetX) * planetCanvas.width / 2 * scale + planetCanvas.width / 2),
            (-planets[i].y + offsetY) * planetCanvas.height / 2 * scale + planetCanvas.height / 2,
            ((-planets[i].y + offsetY + planets[i].radius) * planetCanvas.height / 2 * scale + planetCanvas.height / 2) - ((-planets[i].y + offsetY) * planetCanvas.height / 2 * scale + planetCanvas.height / 2), 0, 2 * Math.PI);
        ctx.fill();
    }

    //}

    requestAnimationFrame(Draw);
}

function Update() {

    if (!isPaused) {
        for (var i = 0; i < planets.length; ++i) {
            var forceX = 0, forceY = 0;
            for (var n = 0; n < planets.length; ++n) {
                if (i != n) {
                    var diffX = planets[i].x - planets[n].x;
                    var diffY = planets[i].y - planets[n].y;
                    var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                    var pix = ((planets[i].x * (planetCanvas.height / planetCanvas.width) - offsetX) * planetCanvas.width / 2 * scale + planetCanvas.width / 2);
                    var piy = (-planets[i].y + offsetY) * planetCanvas.height / 2 * scale + planetCanvas.height / 2;
                    var pnx = ((planets[n].x * (planetCanvas.height / planetCanvas.width) - offsetX) * planetCanvas.width / 2 * scale + planetCanvas.width / 2);
                    var pny = (-planets[n].y + offsetY) * planetCanvas.height / 2 * scale + planetCanvas.height / 2;

                    var rad1 = ((-planets[i].y + offsetY + planets[i].radius) * planetCanvas.height / 2 * scale + planetCanvas.height / 2) - ((-planets[i].y + offsetY) * planetCanvas.height / 2 * scale + planetCanvas.height / 2);
                    var rad2 = ((-planets[n].y + offsetY + planets[n].radius) * planetCanvas.height / 2 * scale + planetCanvas.height / 2) - ((-planets[n].y + offsetY) * planetCanvas.height / 2 * scale + planetCanvas.height / 2);

                    if (Math.sqrt((pix - pnx) * (pix - pnx) + (piy - pny) * (piy - pny)) > rad1 + rad2) {
                        var directionX = diffX / dist;
                        var directionY = diffY / dist;
                        forceX += directionX * -0.0001 * (planets[i].mass * planets[n].mass) / (dist * dist);
                        forceY += directionY * -0.0001 * (planets[i].mass * planets[n].mass) / (dist * dist);
                    }
                    else {
                        if (planets[i].mass > planets[n].mass) {
                            planets[i].mass += planets[n].mass;
                            planets[i].radius += Math.sqrt(planets[n].radius) * 0.2;
                            planets[n].radius = 0;
                            planets[n].mass = 0;
                        }
                        else {
                            planets[n].mass += planets[i].mass;
                            planets[n].radius += Math.sqrt(planets[i].radius) * 0.2;
                            planets[i].radius = 0;
                            planets[i].mass = 0;
                        }
                    }
                }
            }
            planets[i].velX += forceX / planets[i].mass;
            planets[i].velY += forceY / planets[i].mass;

            planets[i].x += planets[i].velX;
            planets[i].y += planets[i].velY;
        }
    }
    if (keysHeld[keyCodes.z]) {
        scale *= 1.01;
    }
    if (keysHeld[keyCodes.x]) {
        scale *= 0.99;
    }

    if (keysHeld[keyCodes.w] || keysHeld[keyCodes.up]) {
        offsetY += 0.01 / scale;
    }
    if (keysHeld[keyCodes.s] || keysHeld[keyCodes.down]) {
        offsetY -= 0.01 / scale;
    }
    if (keysHeld[keyCodes.d] || keysHeld[keyCodes.right]) {
        offsetX += 0.01 / scale;
    }
    if (keysHeld[keyCodes.a] || keysHeld[keyCodes.left]) {
        offsetX -= 0.01 / scale;
    }

}

function SetUpProgram(vertexShaderSource = "", fragmentShaderSource = "") {
    var vsSource = vertexShaderSource.trim();
    var fsSource = fragmentShaderSource.trim();

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader));
        console.error(gl.getShaderInfoLog(vertexShader));
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader));
        console.error(gl.getShaderInfoLog(fragmentShader));
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //probabbly should be removed if not used, not entirely sure how to use
    gl.transformFeedbackVaryings(program, ["position", "velocity"], gl.SEPARATE_ATTRIBS);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert(gl.getProgramInfoLog(program));
        console.error(gl.getProgramInfoLog(program));
    }

    return program;
}

class Planet {
    constructor(x, y, mass, index, radius = 10, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.radius = radius;
        this.velX = vx;
        this.velY = vy;

        this.posLocation = gl.getUniformLocation(shader, `planets[${index}].pos`);
        this.massLocation = gl.getUniformLocation(shader, `planets[${index}].mass`);
        this.radiusLocation = gl.getUniformLocation(shader, `planets[${index}].radius`);
    }

    AttachToShader() {
        gl.uniform3fv(this.posLocation, [this.x, this.y, 0.0]);
        gl.uniform1f(this.massLocation, this.mass);
        gl.uniform1f(this.radiusLocation, this.radius);
    }
}

const keyCodes = { z: 0, x: 1, w: 2, a: 3, s: 4, d: 5, up: 6, left: 7, down: 8, right: 9 };
var keysHeld = [false, false, false, false, false, false, false, false, false, false];

document.addEventListener("keydown", function (e) {
    if (e.key == "p") {
        switch (isPaused) {
            case false:
                isPaused = true;
                break;
            case true:
                isPaused = false;
                break;
        }
    }
    if (e.key == "z") {
        keysHeld[keyCodes.z] = true;
    }
    if (e.key == "x") {
        keysHeld[keyCodes.x] = true;
    }
    if (e.key == "w") {
        keysHeld[keyCodes.w] = true;
    }
    if (e.key == "a") {
        keysHeld[keyCodes.a] = true;
    }
    if (e.key == "s") {
        keysHeld[keyCodes.s] = true;
    }
    if (e.key == "d") {
        keysHeld[keyCodes.d] = true;
    }
    if (e.key == "ArrowUp") {
        keysHeld[keyCodes.up] = true;
    }
    if (e.key == "ArrowLeft") {
        keysHeld[keyCodes.left] = true;
    }
    if (e.key == "ArrowDown") {
        keysHeld[keyCodes.down] = true;
    }
    if (e.key == "ArrowRight") {
        keysHeld[keyCodes.right] = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key == "z") {
        keysHeld[keyCodes.z] = false;
    }
    if (e.key == "x") {
        keysHeld[keyCodes.x] = false;
    }
    if (e.key == "w") {
        keysHeld[keyCodes.w] = false;
    }
    if (e.key == "a") {
        keysHeld[keyCodes.a] = false;
    }
    if (e.key == "s") {
        keysHeld[keyCodes.s] = false;
    }
    if (e.key == "d") {
        keysHeld[keyCodes.d] = false;
    }
    if (e.key == "ArrowUp") {
        keysHeld[keyCodes.up] = false;
    }
    if (e.key == "ArrowLeft") {
        keysHeld[keyCodes.left] = false;
    }
    if (e.key == "ArrowDown") {
        keysHeld[keyCodes.down] = false;
    }
    if (e.key == "ArrowRight") {
        keysHeld[keyCodes.right] = false;
    }
});