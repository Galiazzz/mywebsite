var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var gl = canvas.getContext("webgl");
var shader;
var offsetX = 0;
var offsetY = 0;
var offsetZ = 0;
var viewAngleX = 0;
var viewAngleY = 0;

var vertex = `
    attribute vec4 aVertexPosition;
    uniform vec4 u_offset;
    varying vec4 v_positionWithOffset;

    void main(){
        gl_Position = aVertexPosition;// + u_offset;   //vec4(aVertexPosition, 0.0, 1.0);
        v_positionWithOffset = aVertexPosition + u_offset;
    }
`;

var fragment = `
    #ifdef GL_ES
    precision highp float;
    #endif

    //uniform vec4 uColor;
    uniform vec4 windowSize;
    uniform vec2 viewAngles;

    varying vec4 v_positionWithOffset;

    const float MaxRaySteps = 100.0;
    const float MinimumDistance = 1.0;

    float DistanceFromSphere(vec3 point, vec3 centerOfRadius, float radius){
        return distance(point, centerOfRadius) - radius;
    }

    float MapTheWorld(vec3 point){
        float sphere1_dist = DistanceFromSphere(point, vec3(0.0, 0.0, 60.0), 50.0);

        return sphere1_dist;
    }

    vec3 CalculateNormal(vec3 point){
        const vec3 smallStep = vec3(0.001, 0.0, 0.0);

        float gradientX = MapTheWorld(point + smallStep.xyy) - MapTheWorld(point - smallStep.xyy);
        float gradientY = MapTheWorld(point + smallStep.yxy) - MapTheWorld(point - smallStep.yxy);
        float gradientZ = MapTheWorld(point + smallStep.yyx) - MapTheWorld(point - smallStep.yyx);

        vec3 normal = vec3(gradientX, gradientY, gradientZ);

        return normalize(normal);
    }

    float RayMarch(vec3 rayOrigin, vec3 rayDirection){
        float totalDistance = 0.0;
        for(float steps = 0.0; steps < MaxRaySteps; steps++){
            vec3 point = rayDirection * totalDistance + rayOrigin;
            float distance = MapTheWorld(point);
            totalDistance += distance;
            if(distance < MinimumDistance){
                vec3 normal = CalculateNormal(point);

                vec3 lightPosition = vec3(2.0, -5.0, 10.0);
                vec3 directionToLight = normalize(point - lightPosition);
                float intensity = max(0.0, dot(normal, directionToLight));

                return intensity;
            }
        }
        return 0.0;
    }

    void main(){
        float value = RayMarch(vec3(v_positionWithOffset.x * (windowSize.x / windowSize.y), v_positionWithOffset.y, v_positionWithOffset.z),
            vec3(0.1 * (v_positionWithOffset.x * (windowSize.x / windowSize.y)), 0.1 * v_positionWithOffset.y, 0.07));
        vec4 color = vec4(value, value, value, 1.0);
        gl_FragColor = color;// + v_positionWithOffset;
    }
`;

function LoadStuff() {

    canvas.style.height = `${window.innerHeight}px`;
    canvas.style.width = `${window.innerWidth}px`;
    if (gl === null) {
        alert("webgl not working");
        return;
    }

    shader = InitializeShaderProgram(vertex, fragment);

    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    canvas.requestPointerLock();

    setInterval(Draw, 10);
}

function Draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //var shader = InitializeShaderProgram(vertex, fragment);

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
    //shader.uColor = gl.getUniformLocation(shader, "uColor");
    //gl.uniform4fv(shader.uColor, [0.0, 0.0, 0.0, 1.0]);
    shader.u_offset = gl.getUniformLocation(shader, "u_offset");
    gl.uniform4fv(shader.u_offset, [offsetX, offsetY, offsetZ, 0]);
    shader.windowSize = gl.getUniformLocation(shader, "windowSize");
    gl.uniform4fv(shader.windowSize, [window.innerWidth, window.innerHeight, 1, 1]);
    shader.viewAngles = gl.getUniformLocation(shader, "viewAngles");
    gl.uniform2fv(shader.viewAngles, [viewAngleX, viewAngleY]);

    shader.aVertexPosition = gl.getAttribLocation(shader, "aVertexPosition");
    gl.enableVertexAttribArray(shader.aVertexPosition);
    gl.vertexAttribPointer(shader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, numItems);
}

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

document.addEventListener("keydown", function (e) {
    if (e.key == "w") {
        offsetY += 0.05;
    }
    if (e.key == "s") {
        offsetY -= 0.05;
    }
    if (e.key == "a") {
        offsetX -= 0.05;
    }
    if (e.key == "d") {
        offsetX += 0.05;
    }

    if (e.key == "ArrowUp") {
        viewAngleY -= 0.05;
    }
    if (e.key == "ArrowDown") {
        viewAngleY += 0.05;
    }
    if (e.key == "ArrowLeft") {
        viewAngleX += 0.05;
    }
    if (e.key == "ArrowRight") {
        viewAngleX -= 0.05;
    }
});

document.addEventListener("wheel", function (e) {
    if (e.deltaY < 0) {
        offsetZ += 0.5;
    }
    else if (e.deltaY > 0) {
        offsetZ -= 0.5;
    }
});

/*var prevMousePoints = [null, null];
document.addEventListener("mousedown", function (e) {
    prevMousePoints[0] = e.clientX;
    prevMousePoints[1] = e.clientY;
});
document.addEventListener("mousemove", function (e) {
    if (prevMousePoints[0] != null) {
        viewAngleX = (e.clientX - prevMousePoints[0]) * 0.001;
        viewAngleY = (e.clientY - prevMousePoints[1]) * 0.001;
    }
})
document.addEventListener("mouseup", function (e) {
    prevMousePoints = [null, null];
});*/

/*function InitializeBuffers(){
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -1,  1,
         1,  1,
        -1, -1,
         1, -1,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
    };
}*/
