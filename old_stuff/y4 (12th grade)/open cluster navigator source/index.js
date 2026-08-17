/*
 web program to visualize distances to nearby open star clusters for an end-of-year highschool physics project.
 webgl2 is used to render the graphics so as to allow the GPU to do much of the heavy lifting.

 Author: Matthew Prem
 Date of creation: May 16, 2022 (5-16-2022)

 Feel free to use this visualizer for any purpose, but please attribute me as the creator and provide a link to the original 
 page.

 thank you to jialiang for creating the tutorial on Uniform Buffer Objects which I followed
 link: https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880
 */

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var loadingScreen = document.getElementById("loadingScreen");

var angleY = 0, angleX = 0;
var camX = 0, camY = 0, camZ = 0;
var rot3;

var positions = [];
var positionBuffer;

var colors = [];
var colorBuffer;

var globePositions = [];
var globePositionBuffer;

var globeColors = [];
var globeColorBuffer;

var starProgram;
var depthProgram
var globeProgram;

var starVAO;
var globeVAO;

var UBO;
var starUBOIndex;

const UBOVariableNames = ["transform"];
var UBOVariableIndicies;
var UBOVariableOffsets;

var ticker;

var speedModifier = 1;

var canvasFocused = false;
var showDetails = false;

var drawReferenceSpheres = true;
var drawOctreeNodeBoundaries = false;
var chunkRenderDistance = 25;
var zoom = 1;

var currentDist = -1;
var currentParallax = -1;
var currentRA = {H:-1, M:-1, S:-1};
var currentDEC = {D:-1, M:-1, S:-1};

function LoadStuff() {
	if (!gl) {
		alert("Sorry, Webgl2 doesn't appear to be supported on this device\n:(");
	}

	var skipPrompt = sessionStorage.getItem("skipPrompt");
	if (skipPrompt == null || skipPrompt == "false") {
		if (confirm("Welcome to the open cluster navigator!\nTo see a description of what it is showing and to read the controls, scroll down.\nTo refresh the page and reset everything (not including if this option box is shown), refresh the page (ctrl+R)\n\nDo you want to see this prompt next time the page is loaded?")) {
			sessionStorage.setItem("skipPrompt", "false");
		}
		else {
			sessionStorage.setItem("skipPrompt", "true");
		}
	}

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	//gl.enable(gl.DEPTH_TEST);
  //gl.depthFunc(gl.LESS);
	//gl.depthMask(true);

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
		if (r > 1) {
			globePositions.push(globePositions[globePositions.length - 3]);
			globePositions.push(globePositions[globePositions.length - 3]);
			globePositions.push(globePositions[globePositions.length - 3]);
			globeColors.push(0.0);
			globeColors.push(1.0);
			globeColors.push(0.0);
		}

		for (var n = -Math.PI / 2; n <= Math.PI / 2 + 0.01; n += Math.PI / 18) {
			for (var i = 0; i <= 2 * Math.PI; i += Math.PI / 18) {
				var pos = RadiansToPointOnSphere({ RA: i, DEC: n });
				if (n != -Math.PI / 2 || i != 0) {
					globePositions.push(pos[0] * r * 5);
					globePositions.push(pos[1] * r * 5);
					globePositions.push(pos[2] * r * 5);
					globeColors.push(0.0);
					globeColors.push(1.0);
					globeColors.push(0.0);
				}
				globePositions.push(pos[0] * r * 5);
				globePositions.push(pos[1] * r * 5);
				globePositions.push(pos[2] * r * 5);
				globeColors.push(0.0);
				globeColors.push(1.0);
				globeColors.push(0.0);
			}
		}
	}

	globePositions.push(globePositions[globePositions.length - 3]);
	globePositions.push(globePositions[globePositions.length - 3]);
	globePositions.push(globePositions[globePositions.length - 3]);
	globeColors.push(1.0);
	globeColors.push(0.0);
	globeColors.push(0.0);

	for (var r = 1; r < 10; r++) {

		for (var i = Math.PI / 18; i <= 2 * Math.PI - Math.PI / 18; i += Math.PI / 18) {
			for (var n = -Math.PI / 2; n <= Math.PI / 2 + 0.01; n += Math.PI / 18) {
				var pos = RadiansToPointOnSphere({ RA: i, DEC: n });
				if (n > -Math.PI / 2 + Math.PI / 18) {
					globePositions.push(globePositions[globePositions.length - 3]);
					globePositions.push(globePositions[globePositions.length - 3]);
					globePositions.push(globePositions[globePositions.length - 3]);
					globeColors.push(1.0);
					globeColors.push(0.0);
					globeColors.push(0.0);
				}

				globePositions.push(pos[0] * r * 5);
				globePositions.push(pos[1] * r * 5);
				globePositions.push(pos[2] * r * 5);
				globeColors.push(1.0);
				globeColors.push(0.0);
				globeColors.push(0.0);
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
	attachFieldStars();

	starProgram = CreateProgram(starVertexShader, starFragmentShader);
	depthProgram = CreateProgram(depthVertexShader, starFragmentShader);
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

	globeVAO = gl.createVertexArray();
	gl.bindVertexArray(globeVAO);

	globePositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, globePositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(globePositions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

	globeColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, globeColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(globeColors), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//only necessary beacuse we are asynchronously loading nearby stars from a csv file
function finishSetUp() {
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
	gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

	loadingScreen.style.display = "none";

	ticker = setInterval(Update, 10);

	requestAnimationFrame(Draw);
}

var startTime = Date.now();
var minFPS = 100;
var sumTime = 0;
var sumFrames = 0;
var totalElapsedTime = 0;
var averageFPS = -1;

var infoPointer = document.getElementById("info");
function Draw() {
	var elapsedTime = Date.now() - startTime;
	totalElapsedTime += elapsedTime;
	minFPS = Math.min(minFPS, 1000 / elapsedTime);
	if(showDetails){
			infoPointer.innerText = "Frame time (ms): " + elapsedTime.toFixed(2) + "\nFPS: " + (1000 / elapsedTime).toFixed(2) + "\nminFPS: " + minFPS.toFixed(2) + "\nAverage FPS: " + averageFPS.toFixed(2) + "\nAverage frame time (ms): " + (1000 / averageFPS).toFixed(2) + "\n\nYour current distance from Earth (parsecs): " + (currentDist * 10).toFixed(2) + "\nA star located at your current position would have these coordinates:\nRA:\n\tHours: " + currentRA.H + "\n\tMinutes: " + currentRA.M + "\n\tSeconds: " + currentRA.S.toFixed(2) + "\nDEC:\n\tDegrees: " + currentDEC.D + "\n\tMinutes: " + currentDEC.M + "\n\tSeconds: " + currentDEC.S.toFixed(2) + "\n\tParallax: " + currentParallax;
	}
	sumFrames++;
	sumTime += elapsedTime;
	if(totalElapsedTime > 4000){
		totalElapsedTime = 0;
		minFPS = 100;
		averageFPS = 1000 * sumFrames / sumTime;
		sumFrames = 0;
		sumTime = 0;
	}
	startTime = Date.now();

	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;

	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var index = gl.getUniformBlockIndex(starProgram, "Uniforms");
	gl.uniformBlockBinding(starProgram, index, 0); // the 0 is the index of the uniform block

	index = gl.getUniformBlockIndex(globeProgram, "Uniforms");
	gl.uniformBlockBinding(globeProgram, index, 0);

	index = gl.getUniformBlockIndex(homeProgram, "Uniforms");
	gl.uniformBlockBinding(homeProgram, index, 0);

	gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
	//gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[0], new Float32Array([canvas.width, canvas.height]));
	//gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[1], new Float32Array([camX, camY, camZ]));
	var translate = [
		1, 0, 0, -camX,
		0, 1, 0, -camY,
		0, 0, 1, -camZ,
		0, 0, 0, 1
	];
	var yRot = [
		Math.cos(angleY), 0, -Math.sin(angleY), 0,
		0, 1, 0, 0,
		Math.sin(angleY), 0, Math.cos(angleY), 0,
		0, 0, 0, 1
	];
	var xRot = [
		1, 0, 0, 0,
		0, Math.cos(angleX), -Math.sin(angleX), 0,
		0, Math.sin(angleX), Math.cos(angleX), 0,
		0, 0, 0, 1
	];
	var project = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 1, 0
	]
	var screenStretch = [
		(canvas.width > canvas.height) ? canvas.height / canvas.width : 1, 0, 0, 0,
		0, (canvas.width < canvas.height) ? canvas.width / canvas.height : 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]
	var zoomMat = [
		zoom, 0, 0, 0,
		0, zoom, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]
	var combined = MulMatrix4x4(yRot, translate);
	combined = MulMatrix4x4(xRot, combined);
	combined = MulMatrix4x4(project, combined);
	combined = MulMatrix4x4(screenStretch, combined);
	combined = MulMatrix4x4(zoomMat, combined);

	var yRot3 = [
		Math.cos(angleY), 0, -Math.sin(angleY),
		0, 1, 0,
		Math.sin(angleY), 0, Math.cos(angleY)
	]
	var xRot3 = [
		1, 0, 0,
		0, Math.cos(angleX), -Math.sin(angleX),
		0, Math.sin(angleX), Math.cos(angleX)
	];
	var screenStretch3 = [
		(canvas.width > canvas.height) ? canvas.height / canvas.width : 1, 0, 0,
		0, (canvas.width < canvas.height) ? canvas.width / canvas.height : 1, 0,
		0, 0, 1
	]
	var zoom3 = [
		zoom, 0, 0,
		0, zoom, 0,
		0, 0, 1
	]
	rot3 = MulMatrix3x3(zoom3, MulMatrix3x3(screenStretch3,MulMatrix3x3(xRot3, yRot3)));
	//no longer necessary since we are using a mat4
	/*
	var rot = [
		combined[0], combined[1], combined[2], 0,
		combined[3], combined[4], combined[5], 0,
		combined[6], combined[7], combined[8], 0,
	];*/
	//MulMatrix3x3(xRot, YRot);
	//UBOVariableOffsets[0] used to be UBOVariableOffsets[2] before putting all the transformations in a premultiplied matrix
	gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[0], new Float32Array(combined));
	gl.bindBuffer(gl.UNIFORM_BUFFER, null);

	gl.viewport(0, 0, canvas.width, canvas.height);
	
	gl.useProgram(starProgram);
	octree.draw();
	gl.bindVertexArray(starVAO);
	gl.drawArrays(gl.POINTS, 0, positions.length / 3);

	if(drawReferenceSpheres){
		gl.useProgram(globeProgram);
		gl.bindVertexArray(globeVAO);
		gl.drawArrays(gl.LINES, 0, globePositions.length / 3);
	}

	if(drawHome){
		gl.useProgram(homeProgram);
		gl.uniform2f(screenUniformPos, canvas.width, canvas.height);
		gl.bindVertexArray(homeVAO);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	requestAnimationFrame(Draw);
}

var updateStartTime = Date.now();
var aladinFrame = document.getElementById("aladinFrame");
function Update() {
	var newTime = Date.now();
	var elapsedTime = newTime - updateStartTime;
	var timeMultiplier = elapsedTime * 0.1;
	updateStartTime = newTime;
	
	if (keydown[10]) {
		speedModifier = 5;
	}
	else if (keydown[11]) {
		speedModifier = 0.1;
	}
	else {
		speedModifier = 1;
	}

	if (keydown[0] && canvasFocused) {
		camZ += 0.01 * Math.cos(angleY) * speedModifier * timeMultiplier;
		camX += 0.01 * Math.sin(angleY) * speedModifier * timeMultiplier;
	}
	if (keydown[1] && canvasFocused) {
		camX -= 0.01 * Math.cos(angleY) * speedModifier * timeMultiplier;
		camZ += 0.01 * Math.sin(angleY) * speedModifier * timeMultiplier;
	}
	if (keydown[2] && canvasFocused) {
		camZ -= 0.01 * Math.cos(angleY) * speedModifier * timeMultiplier;
		camX -= 0.01 * Math.sin(angleY) * speedModifier * timeMultiplier;
	}
	if (keydown[3] && canvasFocused) {
		camX += 0.01 * Math.cos(angleY) * speedModifier * timeMultiplier;
		camZ -= 0.01 * Math.sin(angleY) * speedModifier * timeMultiplier;
	}
	if (keydown[8] && canvasFocused) {
		camY += 0.01 * speedModifier * timeMultiplier;
	}
	if (keydown[9] && canvasFocused) {
		camY -= 0.01 * speedModifier * timeMultiplier;
	}
	if (keydown[4] && canvasFocused) {
		angleX += 0.01 * timeMultiplier;
		angleX = Math.max(Math.min(angleX, Math.PI / 2), -Math.PI / 2)
	}
	if (keydown[5] && canvasFocused) {
		angleY -= 0.01 * timeMultiplier;
	}
	if (keydown[6] && canvasFocused) {
		angleX -= 0.01 * timeMultiplier;
		angleX = Math.max(Math.min(angleX, Math.PI / 2), -Math.PI / 2)
	}
	if (keydown[7] && canvasFocused) {
		angleY += 0.01 * timeMultiplier;
	}

	var currDistance = Math.sqrt(camX * camX + camY * camY + camZ * camZ);
	currentDist = currDistance;
	currentParallax = 100 / currentDist;
	
	document.getElementById("distance").innerText = "Your current distance from Earth: " + (currDistance * 10).toFixed(2) + " Parsecs"; // the * 10 is because I decided 1 unit in normalized device coordinates is equal to 10 parsecs.

	
	var currDEC = Math.asin(camY / currDistance) * 180 / Math.PI;
	var DECSign = Math.sign(currDEC);
	var currRA = Math.atan2(-camX, camZ);
	if(currRA < 0){
		currRA = currRA + 2 * Math.PI;
	}
	aladinFrame.contentWindow.postMessage(`setCoords\n${currRA * 180 / Math.PI}\n${currDEC}`);
	currDEC = Math.abs(currDEC);
	currRA *= 12 / Math.PI;

	var degrees = Math.trunc(currDEC);
	var dMinutes = Math.trunc((currDEC - degrees) * 60);
	var dSeconds = ((currDEC - degrees) * 60 - dMinutes) * 60;

	var hours = Math.trunc(currRA);
	var rMinutes = Math.trunc((currRA - hours) * 60);
	var rSeconds = ((currRA - hours) * 60 - rMinutes) * 60;

	currentRA.H = hours;
	currentRA.M = rMinutes;
	currentRA.S = rSeconds;
	currentDEC.D = degrees;
	currentDEC.M = dMinutes;
	currentDEC.S = dSeconds;
	
	var message = `If a star was located at your current position, it would have these coordinates:\n RA: ${hours}h ${rMinutes}m ${rSeconds.toFixed(2)}s\n DEC: ${DECSign < 0 ? '-' : ''}${degrees}° ${dMinutes}\' ${dSeconds.toFixed(2)}\"\nParallax: ${currentParallax}`;
	document.getElementById("starPosition").innerText = message;
}

function MulMatrix3x3(leftMat, rightMat) {
	return [
		rightMat[0] * leftMat[0] + rightMat[3] * leftMat[1] + rightMat[6] * leftMat[2], rightMat[1] * leftMat[0] + rightMat[4] * leftMat[1] + rightMat[7] * leftMat[2], rightMat[2] * leftMat[0] + rightMat[5] * leftMat[1] + rightMat[8] * leftMat[2],
		rightMat[0] * leftMat[3] + rightMat[3] * leftMat[4] + rightMat[6] * leftMat[5], rightMat[1] * leftMat[3] + rightMat[4] * leftMat[4] + rightMat[7] * leftMat[5], rightMat[2] * leftMat[3] + rightMat[5] * leftMat[4] + rightMat[8] * leftMat[5],
		rightMat[0] * leftMat[6] + rightMat[3] * leftMat[7] + rightMat[6] * leftMat[8], rightMat[1] * leftMat[6] + rightMat[4] * leftMat[7] + rightMat[7] * leftMat[8], rightMat[2] * leftMat[6] + rightMat[5] * leftMat[7] + rightMat[8] * leftMat[8]
	];
}

function MulMatrix4x4(leftMat, rightMat) {
	return [
		rightMat[0] * leftMat[0] + rightMat[4] * leftMat[1] + rightMat[8] * leftMat[2] + rightMat[12] * leftMat[3], rightMat[1] * leftMat[0] + rightMat[5] * leftMat[1] + rightMat[9] * leftMat[2] + rightMat[13] * leftMat[3], rightMat[2] * leftMat[0] + rightMat[6] * leftMat[1] + rightMat[10] * leftMat[2] + rightMat[14] * leftMat[3], rightMat[3] * leftMat[0] + rightMat[7] * leftMat[1] + rightMat[11] * leftMat[2] + rightMat[15] * leftMat[3],
		rightMat[0] * leftMat[4] + rightMat[4] * leftMat[5] + rightMat[8] * leftMat[6] + rightMat[12] * leftMat[7], rightMat[1] * leftMat[4] + rightMat[5] * leftMat[5] + rightMat[9] * leftMat[6] + rightMat[13] * leftMat[7], rightMat[2] * leftMat[4] + rightMat[6] * leftMat[5] + rightMat[10] * leftMat[6] + rightMat[14] * leftMat[7], rightMat[3] * leftMat[4] + rightMat[7] * leftMat[5] + rightMat[11] * leftMat[6] + rightMat[15] * leftMat[7],
		rightMat[0] * leftMat[8] + rightMat[4] * leftMat[9] + rightMat[8] * leftMat[10] + rightMat[12] * leftMat[11], rightMat[1] * leftMat[8] + rightMat[5] * leftMat[9] + rightMat[9] * leftMat[10] + rightMat[13] * leftMat[11], rightMat[2] * leftMat[8] + rightMat[6] * leftMat[9] + rightMat[10] * leftMat[10] + rightMat[14] * leftMat[11], rightMat[3] * leftMat[8] + rightMat[7] * leftMat[9] + rightMat[11] * leftMat[10] + rightMat[15] * leftMat[11],
		rightMat[0] * leftMat[12] + rightMat[4] * leftMat[13] + rightMat[8] * leftMat[14] + rightMat[12] * leftMat[15], rightMat[1] * leftMat[12] + rightMat[5] * leftMat[13] + rightMat[9] * leftMat[14] + rightMat[13] * leftMat[15], rightMat[2] * leftMat[12] + rightMat[6] * leftMat[13] + rightMat[10] * leftMat[14] + rightMat[14] * leftMat[15], rightMat[3] * leftMat[12] + rightMat[7] * leftMat[13] + rightMat[11] * leftMat[14] + rightMat[15] * leftMat[15]
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
	alert(gl.getShaderInfoLog(shader))
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

document.addEventListener("keyup", function(e) {
	if (e.key.toLowerCase() == "w") { keydown[0] = false }
	if (e.key.toLowerCase() == "a") { keydown[1] = false }
	if (e.key.toLowerCase() == "s") { keydown[2] = false }
	if (e.key.toLowerCase() == "d") { keydown[3] = false }
	if (e.key == "ArrowUp") { keydown[4] = false }
	if (e.key == "ArrowLeft") { keydown[5] = false }
	if (e.key == "ArrowDown") { keydown[6] = false }
	if (e.key == "ArrowRight") { keydown[7] = false }
	if (e.key == " ") { keydown[8] = false }
	if (e.key == "Shift") { keydown[9] = false }
	if (e.key.toLowerCase() == "c") { keydown[10] = false }
	if (e.key.toLowerCase() == "x") { keydown[11] = false }
});

document.addEventListener("keydown", function(e) {
	if (e.key.toLowerCase() == "w") { keydown[0] = true }
	if (e.key.toLowerCase() == "a") { keydown[1] = true }
	if (e.key.toLowerCase() == "s") { keydown[2] = true }
	if (e.key.toLowerCase() == "d") { keydown[3] = true }
	if (e.key == "ArrowUp") { keydown[4] = true; if(canvasFocused){e.preventDefault();} }
	if (e.key == "ArrowLeft") { keydown[5] = true }
	if (e.key == "ArrowDown") { keydown[6] = true; if(canvasFocused){e.preventDefault();} }
	if (e.key == "ArrowRight") { keydown[7] = true }
	if (e.key == " ") { keydown[8] = true; e.preventDefault(); }
	if (e.key == "Shift") { keydown[9] = true }
	if (e.key.toLowerCase() == "c") { keydown[10] = true }
	if (e.key.toLowerCase() == "x") { keydown[11] = true }
	if (e.key == "Enter") {switch(canvasFocused){case true: canvasFocused = false;break; case false: canvasFocused = true;break;}}
	if(e.key.toLowerCase() == "p"){switch(showDetails){case false: showDetails = true; infoPointer.parentNode.style.display = "block"; break; case true: showDetails = false; infoPointer.parentNode.style.display = "none"; break;}};
});

var isPointerCaptured = false;

function CanvasClick() {
	canvasFocused = true;
	canvas.requestPointerLock();
}

document.addEventListener("pointerlockchange", function() {
	if (document.pointerLockElement === canvas) {
		isPointerCaptured = true;
		canvasFocused = true;
		pastTouches = [];
	}
	else {
		isPointerCaptured = false;
		canvasFocused = false;
		pastTouches = [];
	}
});

document.addEventListener("mousemove", function(e) {
	if (isPointerCaptured) {
		angleY += e.movementX * 0.005;
		angleX -= e.movementY * 0.005;
		angleX = Math.max(Math.min(angleX, Math.PI / 2), -Math.PI / 2)
	}
})

function CanvasDoubleClick() {
	canvasFocused = false;
	document.exitPointerLock();
}


class TogglableHidden {
	constructor(show, toggler, toggled) {
		this.isShown = show;
		this.toggled = toggled;
		toggler.addEventListener("click", () => { this.click(); });
	}

	click() {
		switch (this.isShown) {
			case true:
				this.toggled.style.maxHeight = "0";
				this.isShown = false;
				break;
			case false:
				this.toggled.style.maxHeight = "" + this.toggled.scrollHeight + "px";
				this.isShown = true;
				var currentNode = this.toggled;
				while (currentNode != document.body) {
					var parent = currentNode.parentNode;
					if (parent.classList.contains("inDepth")) {
						parent.style.maxHeight = "" + (parseInt(parent.style.maxHeight.replace(/\D/g, '')) + currentNode.scrollHeight) + "px";
					}
					currentNode = parent;
				}
				break;
		}
	}
}

var numTouches = 0;
var pastTouches = [];
document.addEventListener("touchstart", function(e){
	if(canvasFocused){
		e.preventDefault();
		for(var i = 0; i < e.changedTouches.length; i++){
			pastTouches.push(e.changedTouches[i]);
			numTouches++;
		}
	}
});
document.addEventListener("touchmove", function(e){
	if(canvasFocused){
		e.preventDefault();
		e.stopImmediatePropagation();
		if(numTouches == 1){
			angleY += 0.005 * (pastTouches[0].clientX - e.changedTouches[0].clientX);
			angleX -= 0.005 * (pastTouches[0].clientY - e.changedTouches[0].clientY);
			angleX = Math.max(Math.min(angleX, Math.PI / 2), -Math.PI / 2)
			pastTouches[0] = e.changedTouches[0];
		}
		else if(numTouches == 2){
			if(e.changedTouches.length == 1){
				var replacedIndex = 1;
				if(Math.hypot(pastTouches[0].clientX - e.changedTouches[0].clientX, pastTouches[0].clientY - e.changedTouches[0].clientY) < Math.hypot(pastTouches[1].clientX - e.changedTouches[0].clientX, pastTouches[1].clientY - e.changedTouches[0].clientY)){
					replacedIndex = 0;
				}
				var dist = Math.hypot(pastTouches[1-replacedIndex].clientX - e.changedTouches[0].clientX, pastTouches[1-replacedIndex].clientY - e.changedTouches[0].clientY) - Math.hypot(pastTouches[0].clientX - pastTouches[1].clientX, pastTouches[0].clientY - pastTouches[1].clientY);
				var direction = RadiansToPointOnSphere({RA: -angleY, DEC: angleX});
				camX += 0.01 * dist * direction[0] * speedModifier;
				camY += 0.01 * dist * direction[1] * speedModifier;
				camZ += 0.01 * dist * direction[2] * speedModifier;
				pastTouches[replacedIndex] = e.changedTouches[0];
			}
			else{
				var dist = Math.hypot(e.changedTouches[0].clientX - e.changedTouches[1].clientX, e.changedTouches[0].clientY - e.changedTouches[1].clientY) - Math.hypot(pastTouches[0].clientX - pastTouches[1].clientX, pastTouches[0].clientY - pastTouches[1].clientY);
				var direction = RadiansToPointOnSphere({RA: -angleY, DEC: angleX});
				camX += 0.01 * dist * direction[0] * speedModifier;
				camY += 0.01 * dist * direction[1] * speedModifier;
				camZ += 0.01 * dist * direction[2] * speedModifier;
				pastTouches[0] = e.changedTouches[0];
				pastTouches[1] = e.changedTouches[1];
			}
		}
	}
}, {passive: false});

function EndPointer(e){
	for(var j = 0; j < e.changedTouches.length; j++){
		var minDist = Infinity;
		var minDistIndex = null;
		for(var i = 0; i < pastTouches.length; i++){
			var dist = Math.hypot(pastTouches[i].clientX - e.changedTouches[j].clientX, pastTouches[i].clientY - e.changedTouches[j].clientY);
			if(dist < minDist){
				minDist = dist;
				minDistIndex = i;
			}
		}
		if(minDistIndex != null){
			pastTouches.splice(minDistIndex, 1);
			numTouches--;
		}
	}
}

document.addEventListener("touchend", EndPointer);
document.addEventListener("touchcancel", EndPointer);

document.addEventListener("wheel", function(e){
	if(canvasFocused){
		e.preventDefault();
		var dist = -e.deltaY * 0.5;
		var direction = RadiansToPointOnSphere({RA: -angleY, DEC: angleX});
		camX += 0.01 * dist * direction[0] * speedModifier;
		camY += 0.01 * dist * direction[1] * speedModifier;
		camZ += 0.01 * dist * direction[2] * speedModifier;
	}
},{passive:false});

var toggles = []
for (var i = 0; i < document.getElementsByClassName("toggler").length; i++) {
	toggles[i] = new TogglableHidden(false, document.getElementsByClassName("toggler")[i], document.getElementsByClassName("inDepth")[i]);
}


var octree;
var stillLoading = false;

function updateLoadingScreen(dataRequest){
	if(stillLoading){
		var percent = dataRequest.responseText.length / 141577538;
		loadingScreen.innerText = `Loading Astrometric data ${(percent * 100).toFixed(2)}% done (${(percent * 2557131).toFixed(0)} stars)`;
		setTimeout(updateLoadingScreen, 100, dataRequest);
	}
}

var buildingTree = false;
var index = 0;
function buildTree(data){
	if(buildingTree){
		var time = Date.now();
		loadingScreen.innerText = `Building Octree ${(index / data.length * 100).toFixed(2)}% done`;
		while(Date.now() - time < 90 && index < data.length){
			var RA = parseFloat(data[index][0]), DEC = parseFloat(data[index][1]), parallax = parseFloat(data[index][2]);
			var distance = 1000/parallax;
			var unitPos = RadiansToPointOnSphere(EquitorialCoordsToRadians(RA, DEC));
			octree.addPoint(unitPos[0] * distance * 0.1, unitPos[1] * distance * 0.1, unitPos[2] * distance * 0.1, 1, 1, 1);
			index++;
		}
		if(index == data.length){
			loadingScreen.innerText = "Finishing setup";
			buildingTree = false;
		}
		setTimeout(buildTree, 10, data);
	}
	else{
		octree.finishSetUp();
		finishSetUp();
	}
}

function attachFieldStars() {
	loadingScreen.innerText = "Loading Astrometric data";
	stillLoading = true;
	var dataRequest = new XMLHttpRequest();
	updateLoadingScreen(dataRequest);
	dataRequest.onload = function() {
		stillLoading = false;
		octree = new Node(0, 0, 0, 250 * 0.1, 0);
		var data = this.responseText.split("\n");
		for (var i = 0; i < data.length; i++) {
			data[i] = data[i].split(",");
		}
		buildingTree = true;
		buildTree(data);
		
	}
	dataRequest.open("GET", "field stars.csv");
	dataRequest.send();
}

//hack
/*var consolePointer = document.getElementById("console");
console.log = function(...args){
	for(var i of args){
		consolePointer.innerText += i + ", ";
	}
	consolePointer.innerText += "\n";
}

var errorsPointer = document.getElementById("errors");
console.error = function(...args){
	for(var i of args){
		errorsPointer.innerText += i + ", ";
	}
	errorsPointer.innerText += "\n";
}*/