InportJSFile("../../../../overarching/libraries/vectors.js");
InportJSFile("../../../../overarching/libraries/keyboard input.js");

var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var gl = canvas.getContext("webgl2");
var shader;

var vertex = ` 
    attribute vec4 aVertexPosition;
    varying vec4 v_pos;

    void main(){
        gl_Position = aVertexPosition;
        v_pos = aVertexPosition;
    }
`;
var fragment = `
    #ifdef GL_ES
    precision highp float;
    #endif

    struct Sphere{
        vec3 position;
        vec4 color;
        float radius;
    };

    struct Light{
        vec3 position;
        vec3 color;
        float brightness;
    };

    struct RaymarchReturn{
        bool hit;
        vec4 color;
        int marches;
        float totalDistance;
    };

    varying vec4 v_pos;

    uniform Sphere spheres[2];
    uniform Light lights[1];
    const int sphereArrayLength = 2;
    const int lightArrayLength = 1;
    uniform float floorHight;

    uniform vec3 camPos;
    uniform vec2 viewAngles;
    uniform vec2 FOV;
    uniform vec2 windowSize;

    float seed = 123456.0;

    const int MaxRaySteps = 100;
    const float MinimumDistance = 0.001;

    vec3 Mod(vec3 v1, float v2){
        return ((v1 / v2) - floor(v1/v2)) * v2;
    }

    float Next(){
        seed = mod(seed * 16807.0, 2147483647.0);
        return (seed - 1.0) / 2147483646.0;
    }

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    struct MapTWReturn{
        float minDist;
        bool hitFloor;
        int sphereIndex;
    };

    MapTWReturn MapTheWorld(vec3 point){
        float dists[3];
        dists[0] = point.y - floorHight;
        for(int i = 0; i < sphereArrayLength; ++i){
            dists[i + 1] = distance(point, spheres[i].position) - spheres[i].radius;
        }

        float minDist = dists[0];
        int sphereIndex = -1;
        for(int i = 1; i < sphereArrayLength + 1; ++i){
            if(dists[i] < minDist){
                sphereIndex = i - 1;
                minDist = dists[i];
            }
            //minDist = min(minDist, dists[i]);
        }

        return MapTWReturn(minDist, minDist == dists[0], sphereIndex);
    }

    vec3 CalculateNormal(vec3 point){
        const vec3 smallStep = vec3(0.001, 0.0, 0.0);

        float gradientX = MapTheWorld(point + smallStep.xyy).minDist - MapTheWorld(point - smallStep.xyy).minDist;
        float gradientY = MapTheWorld(point + smallStep.yxy).minDist - MapTheWorld(point - smallStep.yxy).minDist;
        float gradientZ = MapTheWorld(point + smallStep.yyx).minDist - MapTheWorld(point - smallStep.yyx).minDist;

        vec3 normal = vec3(gradientX, gradientY, gradientZ);

        return normalize(normal);
    }

    RaymarchReturn Raymarch(vec3 startPos, vec3 direction){
        RaymarchReturn returnValue = RaymarchReturn(false, vec4(0.0, 0.0, 0.0, 1.0), 0, 0.0);

        float totalDistance = 0.0;
        int stepsTaken = 0;
        vec3 point;
        for(int steps = 0; steps < MaxRaySteps; ++steps){
            stepsTaken = steps;
            point = direction * totalDistance + startPos;
            MapTWReturn TW = MapTheWorld(point);
            totalDistance += TW.minDist;
            if(TW.minDist < MinimumDistance){
                returnValue.hit = true;
                float c = float(steps) / float(MaxRaySteps);
                if(TW.hitFloor){
                    returnValue.color = vec4(1.0, 1.0, 1.0, 1.0);
                }
                else{
                    for(int i = 0; i < sphereArrayLength; i++){
                        if(TW.sphereIndex == i){
                            returnValue.color = vec4(spheres[i].color.xyz, 1.0);
                            break;
                        }
                    }
                }
                break;
            }
        }

        float lightSum = 0.0;
        vec3 lightColor = vec3(0.0, 0.0, 0.0);
        vec3 normal = CalculateNormal(point);
        for(int i = 0; i < lightArrayLength; ++i){
            float apparentBrightness = max(dot(normalize(lights[i].position - point), normal) * lights[i].brightness / distance(point, lights[i].position), 0.0);
            lightSum += apparentBrightness;
            lightColor += lights[i].color * apparentBrightness;
        }
        returnValue.color = vec4((returnValue.color.rgb * lightSum + lightColor) / 2.0, returnValue.color.a);

        float c = float(stepsTaken) / float(MaxRaySteps);
        c = 1.0 - c;
        returnValue.color = vec4(returnValue.color.rgb * c, returnValue.color.a);
        //if(returnValue.hit){
            //c = dot(normalize(lightPos - point), CalculateNormal(point)) / distance(point, lightPos);
            //returnValue.color = vec4(returnValue.color.rgb * c, returnValue.color.a);
        //}

        //returnValue.color = vec4(c, c, c, 1.0);
        //returnValue.color /= totalDistance * totalDistance * 0.25;
        returnValue.marches = stepsTaken;
        returnValue.totalDistance = totalDistance;
        return returnValue;
    }

    void main(){
        //seed = ((v_pos.y)) * windowSize.y * windowSize.x + ((v_pos.x + 1.0) / 2.0) * windowSize.x;
        //seed = Mod(seed, 2147483647.0);
        vec4 color;
        vec2 adjustedVA = vec2(viewAngles.x + v_pos.x * (windowSize.x / windowSize.y) * FOV.x * 0.5, viewAngles.y + v_pos.y * FOV.y * 0.5) ;
        vec3 direction = vec3(cos(adjustedVA.x) * cos(adjustedVA.y), sin(adjustedVA.y), sin(adjustedVA.x) * cos(adjustedVA.y));

        vec3 c = Raymarch(camPos //vec3(v_pos.x * (windowSize.x / windowSize.y), v_pos.y, 0.0) + 
        , direction.zyx).color.xyz;
        color = vec4(c, 1.0);
        gl_FragColor = color;
    }
`;

var playerPos = null;
var playerViewAngles = null;
var FOV = null;

var spheres = [];
var lights = [];

var isPointerCaptured = false;

function LoadStuff() {

    playerPos = new Vec3(0, 0, -2);
    playerViewAngles = new Vec2(0, 0);
    FOV = new Vec2(Math.PI / 4, Math.PI / 4);

    if (gl === null) {
        alert("webgl not working");
        return;
    }

    shader = InitializeShaderProgram(vertex, fragment);

    spheres.push(new Sphere(new Vec3(0.0, 0.0, 0.0), new Vec4(0.0, 1.0, 0.0, 1.0), 0.1));
    spheres.push(new Sphere(new Vec3(0.0, 4.0, 0.0), new Vec4(0.5, 0.0, 0.5, 1.0), 2));

    lights.push(new Light(new Vec3(0, 1.5, 0), new Vec3(1, 1, 1), 1));

    setInterval(Update, 10);
    requestAnimationFrame(Draw);
}

function Update() {
    if (playerPos != null) {
        var forward = new Vec3(Math.cos(playerViewAngles.x) * Math.cos(playerViewAngles.y), Math.sin(playerViewAngles.y), Math.sin(playerViewAngles.x) * Math.cos(playerViewAngles.y));
        if (keysHeld[keyCodes.arrowUp] || keysHeld[keyCodes.w]) {
            playerPos.AddE(new Vec3(forward.z, 0.0, forward.x).Mul(0.01));
        }
        if (keysHeld[keyCodes.arrowDown] || keysHeld[keyCodes.s]) {
            playerPos.SubE(new Vec3(forward.z, 0.0, forward.x).Mul(0.01));
        }
        if (keysHeld[keyCodes.arrowLeft] || keysHeld[keyCodes.a]) {
            playerPos.AddE(new Vec3(-forward.x, 0.0, forward.z).Mul(0.01));
        }
        if (keysHeld[keyCodes.arrowRight] || keysHeld[keyCodes.d]) {
            playerPos.SubE(new Vec3(-forward.x, 0.0, forward.z).Mul(0.01));
        }
        if (keysHeld[keyCodes.space]) {
            playerPos.y += 0.01;
        }
        if (keysHeld[keyCodes.shift]) {
            playerPos.y -= 0.01;
        }

        if (keysHeld[keyCodes.f]) {
            FOV = new Vec2(Math.PI / 16, Math.PI / 16);
        }
        else if (keysHeld[keyCodes.o]) {
            FOV = new Vec2(Math.PI, Math.PI);
        }
        else {
            FOV = new Vec2(Math.PI / 4, Math.PI / 4);
        }
    }
}

function Draw() {
    canvas.style.height = `${window.innerHeight}px`;
    canvas.style.width = `${window.innerWidth}px`;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var verticies = new Float32Array([
        -1, -1, 1, -1, -1, 1, //triangle 1
        -1, 1, 1, 1, 1, -1, //triangle 2
    ]);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.DYNAMIC_DRAW);

    var itemSize = 2;
    var numItems = verticies.length / itemSize;

    gl.useProgram(shader);

    shader.windowSize = gl.getUniformLocation(shader, "windowSize");
    gl.uniform2fv(shader.windowSize, [window.innerWidth, window.innerHeight]);
    shader.camPos = gl.getUniformLocation(shader, "camPos");
    gl.uniform3fv(shader.camPos, [playerPos.x, playerPos.y, playerPos.z]);
    shader.viewAngles = gl.getUniformLocation(shader, "viewAngles");
    gl.uniform2fv(shader.viewAngles, [playerViewAngles.x, playerViewAngles.y]);
    shader.FOV = gl.getUniformLocation(shader, "FOV");
    gl.uniform2fv(shader.FOV, [FOV.x, FOV.y]);
    shader.floorHight = gl.getUniformLocation(shader, "floorHight");
    gl.uniform1fv(shader.floorHight, [-1.0]);

    for (var i = 0; i < spheres.length; i++) {
        spheres[i].AttachToShader(i);
    }
    for (var i = 0; i < lights.length; i++) {
        lights[i].AttachToShader(i);
    }

    shader.aVertexPosition = gl.getAttribLocation(shader, "aVertexPosition");
    gl.enableVertexAttribArray(shader.aVertexPosition);
    gl.vertexAttribPointer(shader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, numItems);


    requestAnimationFrame(Draw);
}

class Sphere {
    constructor(position, color, radius) {
        this.position = position;
        this.color = color;
        this.radius = radius;
    }

    AttachToShader(index) {
        var pos = gl.getUniformLocation(shader, `spheres[${index}].position`);
        gl.uniform3fv(pos, [this.position.x, this.position.y, this.position.z]);
        var col = gl.getUniformLocation(shader, `spheres[${index}].color`);
        gl.uniform4fv(col, [this.color.x, this.color.y, this.color.z, this.color.w]);
        var rad = gl.getUniformLocation(shader, `spheres[${index}].radius`);
        gl.uniform1fv(rad, [this.radius]);
    }
}

class Light {
    constructor(position, color, brightness) {
        this.position = position;
        this.color = color;
        this.brightness = brightness;
    }

    AttachToShader(index) {
        var pos = gl.getUniformLocation(shader, `lights[${index}].position`);
        gl.uniform3fv(pos, [this.position.x, this.position.y, this.position.z]);
        var col = gl.getUniformLocation(shader, `lights[${index}].color`);
        gl.uniform3fv(col, [this.color.x, this.color.y, this.color.z]);
        var bri = gl.getUniformLocation(shader, `lights[${index}].brightness`);
        gl.uniform1fv(bri, [this.brightness])
    }
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
        playerViewAngles.x += e.movementX / 600;
        if (e.movementY < 0 && playerViewAngles.y < Math.PI / 2) { //up
            playerViewAngles.y -= e.movementY / 600;
        }
        if (e.movementY > 0 && playerViewAngles.y > -Math.PI / 2) { //down
            playerViewAngles.y -= e.movementY / 600;
        }
    }
});