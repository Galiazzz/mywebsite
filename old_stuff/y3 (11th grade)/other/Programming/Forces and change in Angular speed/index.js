var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var deltaTime;
var timeToSimulate;
var force;
var radius;
var mass;

var initialPos = [0, 0, 0];
var initialSpeeds = [0, -5, 5];
var initialAcceleration = [0, 0, 0];

var pos = [0, 0, 0];
var speeds = [0, -5, 5];
var acceleration = [0, 0, 0];
var simulationTime = 0;

var time;
var timerActive = false;

var perpendicularForces = false;

function LoadStuff() {
    UpdateValues();
    requestAnimationFrame(Draw);
}

function StartSimulation(){
    if(!timerActive){
        timer = setInterval(Update, deltaTime * 1000);
        timerActive = true;
    }
}

function Update() {
    for(var i = 0; i < 3; i++){
        var torque;
        if(perpendicularForces){
            torque = radius * 0.5 * -force;
        }
        else{
            torque = radius * 0.5 * -force * Math.sin(pos[i] + Math.PI / 2);
        }

        acceleration[i] = (2 * torque) /  (mass * radius * radius);
        speeds[i] += acceleration[i] * deltaTime;
        pos[i] += speeds[i] * deltaTime;
    }
    simulationTime += deltaTime;
    document.getElementById("displayTime").innerText = simulationTime.toFixed(4) + "s";
    if(simulationTime >= timeToSimulate){
        clearInterval(timer);
        timerActive = false;
    }
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < 3; i++){
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc((1 + i) * (canvas.width / 4), canvas.height / 2, Math.min(canvas.height / 2, canvas.width / 10), 0, 2 * Math.PI);

        ctx.moveTo((1 + i) * (canvas.width / 4), canvas.height / 2);
        ctx.lineTo((1 + i) * (canvas.width / 4) + Math.cos(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10),
         canvas.height / 2 - Math.sin(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10));
        ctx.stroke();
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        if(perpendicularForces){
            ctx.moveTo((1 + i) * (canvas.width / 4) + Math.cos(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5,
            canvas.height / 2 - Math.sin(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5);
            ctx.lineTo((1 + i) * (canvas.width / 4) + Math.cos(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5 - Math.sin(pos[i]) * -force * 20,
            canvas.height / 2 - Math.sin(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5 - Math.cos(pos[i]) * -force * 20);
        }
        else{
            ctx.moveTo((1 + i) * (canvas.width / 4) + Math.cos(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5,
            canvas.height / 2 - Math.sin(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5);
            ctx.lineTo((1 + i) * (canvas.width / 4) + Math.cos(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5,
            canvas.height / 2 - Math.sin(pos[i]) * Math.min(canvas.height / 2, canvas.width / 10) * 0.5 + force * 20);
        }
        ctx.stroke();

        document.getElementsByClassName("currentPos")[i].innerText = pos[i];
        document.getElementsByClassName("currentVel")[i].innerText = speeds[i];
        document.getElementsByClassName("currentAcc")[i].innerText = acceleration[i];

        document.getElementsByClassName("changePos")[i].innerText = pos[i] - initialPos[i];
        document.getElementsByClassName("changeVel")[i].innerText = speeds[i] - initialSpeeds[i];
        document.getElementsByClassName("changeAcc")[i].innerText = acceleration[i] - initialAcceleration[i];
    }
    requestAnimationFrame(Draw);
}

function Reset() {
    pos = [0, 0, 0];
    speeds = [0, -5, 5];
    acceleration = [0, 0, 0];
    simulationTime = 0;
    timeToSimulate = 0.5;
    mass = 2;
    radius = 1;
    force = 5;
    deltaTime = 0.01;
    perpendicularForces = false;
    
    document.getElementById("dtIn").value = deltaTime;
    document.getElementById("Force").value = force;
    document.getElementById("massIn").value = mass;
    document.getElementById("radiusIn").value = radius;
    document.getElementById("timeIn").value = timeToSimulate;
    document.getElementById("perpForces").checked = perpendicularForces;

    UpdateValues();

    clearInterval(timer);
    timerActive = false;
}

function UpdateValues() {
    deltaTime = Number(document.getElementById("dtIn").value);
    force = Number(document.getElementById("Force").value);
    mass = Number(document.getElementById("massIn").value);
    radius = Number(document.getElementById("radiusIn").value);
    timeToSimulate = Number(document.getElementById("timeIn").value);
    perpendicularForces = document.getElementById("perpForces").checked;
    document.getElementById("displaydt").value = deltaTime;
    document.getElementById("displayForce").value = force;
    document.getElementById("displayMass").value = mass;
    document.getElementById("displayRadius").value = radius;

    for(var i = 0; i < 3; i++){
        document.getElementsByClassName("initialPos")[i].innerText = initialPos[i];
        document.getElementsByClassName("initialVel")[i].innerText = initialSpeeds[i];
        document.getElementsByClassName("initialAcc")[i].innerText = initialAcceleration[i];
    }
}