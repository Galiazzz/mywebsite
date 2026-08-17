var vertexShader = `#version 300 es
		layout(std140) uniform Uniforms{
				mat4 transform;
    };

	  layout(location = 0) in vec3 position;

	 	out float zPos;
		void main(){
			vec4 transformed = vec4(position, 1.0) * transform;
	 		zPos =  3.0 - position.y; 
			gl_Position = vec4(transformed.xy, transformed.z * transformed.z * 0.001, transformed.z);
		}
`
var fragmentShader = `#version 300 es
		precision highp float;

 		out vec4 pixel_color;
	 	in float zPos;
		


void main(){
			pixel_color = vec4(1, -zPos / 8.0 + 1.0, 0, 1);
		}
`


var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = canvas.getContext("webgl2");

var positions = [];
var positionBuffer;

var VAO;

var program;

var UBO;
var UBOIndex;
const UBOVariableNames = ["transform"];
var UBOVariableIndicies;
var UBOVariableOffsets;

var camX = 0;
var camY = 5;
var camZ = 0;

var yAngle = 0, xAngle = 0;
var setEncoders = false;

parallel = true

var zoom = 1;

var points = [];
var gridX = 100, gridZ = 100;

function generateGeometry() {
	for (var r = 0; r < gridZ; r++) {
		points[r] = [];
		for (var c = 0; c < gridX; c++) {
			points[r].push(c - gridX / 2); //x
			var yValue = 0;
			for (var n = 0; n < 4; n++) {
				yValue += Math.sin(Math.pow(2, n) * c / 10 + Math.pow(2, n) * Math.random() / 10);
				yValue += Math.sin(Math.pow(2, n) * r / 10 + Math.pow(2, n) * Math.random() / 10);
			}
			points[r].push(yValue); //y //0.00001 * (r * r + Math.pow(c - gridX / 2, 8)) - 2
			points[r].push(r); //z
		}
	}

	for (var r = 0; r < gridZ - 1; r++) {
		for (var c = 0; c < gridX - 1; c++) {
			//first Triangle
			positions.push(points[r][c * 3]);
			positions.push(points[r][c * 3 + 1]);
			positions.push(points[r][c * 3 + 2]);

			positions.push(points[r][(c + 1) * 3]);
			positions.push(points[r][(c + 1) * 3 + 1]);
			positions.push(points[r][(c + 1) * 3 + 2]);

			positions.push(points[r + 1][(c + 1) * 3]);
			positions.push(points[r + 1][(c + 1) * 3 + 1]);
			positions.push(points[r + 1][(c + 1) * 3 + 2]);

			//second Triangle
			// Triangle triangle = new Triangle(triangle);
			positions.push(points[r][c * 3]);
			positions.push(points[r][c * 3 + 1]);
			positions.push(points[r][c * 3 + 2]);

			positions.push(points[r + 1][(c) * 3]);
			positions.push(points[r + 1][(c) * 3 + 1]);
			positions.push(points[r + 1][(c) * 3 + 2]);

			positions.push(points[r + 1][(c + 1) * 3]);
			positions.push(points[r + 1][(c + 1) * 3 + 1]);
			positions.push(points[r + 1][(c + 1) * 3 + 2]);
		}
	}
}

function onLoad() {
	setEncoders = true;
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
	gl.depthMask(true);

	generateGeometry();
	program = CreateProgram(vertexShader, fragmentShader);

	//Uniform Buffer setup
	UBOIndex = gl.getUniformBlockIndex(program, "Uniforms");
	var blockSize = gl.getActiveUniformBlockParameter(program, UBOIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
	UBO = gl.createBuffer();
	gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
	gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.UNIFORM_BUFFER, null);

	//the 0 is the index of the uniform block
	gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, UBO);

	//for both the indicies and offsets, index 0 is screenSize, index 1 is cameraPos, index 2 is transform mat
	UBOVariableIndicies = gl.getUniformIndices(program, UBOVariableNames);
	UBOVariableOffsets = gl.getActiveUniforms(program, UBOVariableIndicies, gl.UNIFORM_OFFSET);
	//c(UBOVariableNames); // ehehehehehe
	//create VAO
	VAO = gl.createVertexArray();
	gl.bindVertexArray(VAO);

	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

	setInterval(update, 10);
	requestAnimationFrame(draw);
}

function update() {
	
	var speed = 0.025;

	camX += speed * Math.cos(yAngle) * vX * 5;
	camZ -= speed * Math.sin(yAngle) * vX * 5;

	
	camY += speed * vY;

	camZ += speed * Math.cos(yAngle) * vZ * 5;
	camX += speed * Math.sin(yAngle) * vZ * 5;
	vX *= 0.5;
	vY *= 0.5;
	vZ *= 0.5;
	
	var rotSpeed = 0.01;
	if (keysDown[Keys.fwd]) {
		camZ += speed * Math.cos(yAngle);
		camX += speed * Math.sin(yAngle);
	}
	if (keysDown[Keys.bwd]) {
		camZ -= speed * Math.cos(yAngle);
		camX -= speed * Math.sin(yAngle);
	}
	if (keysDown[Keys.left]) {
		camX -= speed * Math.cos(yAngle);
		camZ += speed * Math.sin(yAngle);
	}
	if (keysDown[Keys.right]) {
		camX += speed * Math.cos(yAngle);
		camZ -= speed * Math.sin(yAngle);
	}
	if (keysDown[Keys.up]) {
		camY += speed;
	}
	if (keysDown[Keys.down]) {
		camY -= speed;
	}
	if (keysDown[Keys.camUp]) {
		xAngle += rotSpeed;
	}
	if (keysDown[Keys.camDown]) {
		xAngle -= rotSpeed;
	}
	if (keysDown[Keys.camLeft]) {
		yAngle -= rotSpeed;
	}
	if (keysDown[Keys.camRight]) {
		yAngle += rotSpeed;
	}
}

function draw() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;

	gl.clearColor(0.25, 0, 0.25, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var index = gl.getUniformBlockIndex(program, "Uniforms");
	gl.uniformBlockBinding(program, index, 0); // the 0 is the index of the uniform block

	gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
	var translate = [
		1, 0, 0, -camX,
		0, 1, 0, -camY,
		0, 0, 1, -camZ,
		0, 0, 0, 1
	];
	var yRot = [
		Math.cos(yAngle), 0, -Math.sin(yAngle), 0,
		0, 1, 0, 0,
		Math.sin(yAngle), 0, Math.cos(yAngle), 0,
		0, 0, 0, 1
	];
	var xRot = [
		1, 0, 0, 0,
		0, Math.cos(xAngle), -Math.sin(xAngle), 0,
		0, Math.sin(xAngle), Math.cos(xAngle), 0,
		0, 0, 0, 1
	];
	var eyeOffset = [
		1, 0, 0, -0.3,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	var project = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 1, 0
	];
	var screenStretch = [
		(canvas.width > canvas.height) ? canvas.height / canvas.width : 1, 0, 0, 0,
		0, (canvas.width < canvas.height) ? canvas.width / canvas.height : 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	var zoomMat = [
		zoom, 0, 0, 0,
		0, zoom, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];

	var combined = MulMatrix4x4(yRot, translate);
	combined = MulMatrix4x4(xRot, combined);
	combined = MulMatrix4x4(eyeOffset, combined);
	combined = MulMatrix4x4(project, combined);
	combined = MulMatrix4x4(screenStretch, combined);
	combined = MulMatrix4x4(zoomMat, combined);

	gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[0], new Float32Array(combined));
	gl.bindBuffer(gl.UNIFORM_BUFFER, null);

	if(parallel){
		gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height);
	} 
	else{
		gl.viewport(0, 0, canvas.width / 2, canvas.height);
	}
	
	gl.useProgram(program);
	gl.bindVertexArray(VAO);
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

	gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
	var eyeOffset = [
		1, 0, 0, 0.3,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	combined = MulMatrix4x4(yRot, translate);
	combined = MulMatrix4x4(xRot, combined);
	combined = MulMatrix4x4(eyeOffset, combined);
	combined = MulMatrix4x4(project, combined);
	combined = MulMatrix4x4(screenStretch, combined);
	combined = MulMatrix4x4(zoomMat, combined);

	gl.bufferSubData(gl.UNIFORM_BUFFER, UBOVariableOffsets[0], new Float32Array(combined));

	if(parallel){
		gl.viewport(0, 0, canvas.width / 2, canvas.height);
	}
	else{
		gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height);
	}
	gl.useProgram(program);
	gl.bindVertexArray(VAO);
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

	requestAnimationFrame(draw);
}

function MulMatrix4x4(leftMat, rightMat) {
	return [
		rightMat[0] * leftMat[0] + rightMat[4] * leftMat[1] + rightMat[8] * leftMat[2] + rightMat[12] * leftMat[3], rightMat[1] * leftMat[0] + rightMat[5] * leftMat[1] + rightMat[9] * leftMat[2] + rightMat[13] * leftMat[3], rightMat[2] * leftMat[0] + rightMat[6] * leftMat[1] + rightMat[10] * leftMat[2] + rightMat[14] * leftMat[3], rightMat[3] * leftMat[0] + rightMat[7] * leftMat[1] + rightMat[11] * leftMat[2] + rightMat[15] * leftMat[3],
		rightMat[0] * leftMat[4] + rightMat[4] * leftMat[5] + rightMat[8] * leftMat[6] + rightMat[12] * leftMat[7], rightMat[1] * leftMat[4] + rightMat[5] * leftMat[5] + rightMat[9] * leftMat[6] + rightMat[13] * leftMat[7], rightMat[2] * leftMat[4] + rightMat[6] * leftMat[5] + rightMat[10] * leftMat[6] + rightMat[14] * leftMat[7], rightMat[3] * leftMat[4] + rightMat[7] * leftMat[5] + rightMat[11] * leftMat[6] + rightMat[15] * leftMat[7],
		rightMat[0] * leftMat[8] + rightMat[4] * leftMat[9] + rightMat[8] * leftMat[10] + rightMat[12] * leftMat[11], rightMat[1] * leftMat[8] + rightMat[5] * leftMat[9] + rightMat[9] * leftMat[10] + rightMat[13] * leftMat[11], rightMat[2] * leftMat[8] + rightMat[6] * leftMat[9] + rightMat[10] * leftMat[10] + rightMat[14] * leftMat[11], rightMat[3] * leftMat[8] + rightMat[7] * leftMat[9] + rightMat[11] * leftMat[10] + rightMat[15] * leftMat[11],
		rightMat[0] * leftMat[12] + rightMat[4] * leftMat[13] + rightMat[8] * leftMat[14] + rightMat[12] * leftMat[15], rightMat[1] * leftMat[12] + rightMat[5] * leftMat[13] + rightMat[9] * leftMat[14] + rightMat[13] * leftMat[15], rightMat[2] * leftMat[12] + rightMat[6] * leftMat[13] + rightMat[10] * leftMat[14] + rightMat[14] * leftMat[15], rightMat[3] * leftMat[12] + rightMat[7] * leftMat[13] + rightMat[11] * leftMat[14] + rightMat[15] * leftMat[15]
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

// keyboard input

var keysDown = [];

const Keys = {
	fwd: 0,
	bwd: 1,
	left: 2,
	right: 3,
	up: 4,
	down: 5,
	camLeft: 6,
	camRight: 7,
	camUp: 8,
	camDown: 9
};

for (let i = 0; i < Keys.length; i++) {
	keysDown[i] = false;
}

document.addEventListener('keydown', (event) => {
	switch (event.key.toLowerCase()) {
		case 'w':
			keysDown[Keys.fwd] = true;
			break;
		case 'a':
			keysDown[Keys.left] = true;
			break;
		case 's':
			keysDown[Keys.bwd] = true;
			break;
		case 'd':
			keysDown[Keys.right] = true;
			break;
		case ' ':
			keysDown[Keys.up] = true;
			break;
		case 'shift':
			keysDown[Keys.down] = true;
			break;
		case 'arrowleft':
			keysDown[Keys.camLeft] = true;
			break;
		case 'arrowright':
			keysDown[Keys.camRight] = true;
			break;
		case 'arrowup':
			keysDown[Keys.camUp] = true;
			break;
		case 'arrowdown':
			keysDown[Keys.camDown] = true;
			break;

	}
});

document.addEventListener('keyup', (event) => {
	switch (event.key.toLowerCase()) {
		case 'w':
			keysDown[Keys.fwd] = false;
			break;
		case 'a':
			keysDown[Keys.left] = false;
			break;
		case 's':
			keysDown[Keys.bwd] = false;
			break;
		case 'd':
			keysDown[Keys.right] = false
			break;
		case ' ':
			keysDown[Keys.up] = false;
			break;
		case 'shift':
			keysDown[Keys.down] = false;
			break;
		case 'arrowleft':
			keysDown[Keys.camLeft] = false;
			break;
		case 'arrowright':
			keysDown[Keys.camRight] = false;
			break;
		case 'arrowup':
			keysDown[Keys.camUp] = false;
			break;
		case 'arrowdown':
			keysDown[Keys.camDown] = false;
			break;
	}
});

/*var startOrientation = {a:null, b:null, g:null};
if(window.DeviceOrientationEvent){
	
	window.addEventListener("deviceorientation", function(e){
		//alert(e.beta * Math.PI / 180);
		if(startOrientation.a === null && setEncoders){
			startOrientation.a = e.alpha
			startOrientation.b = e.beta
			startOrientation.g = e.gamma
			setEncoders = false;
			alert(`set orientation to ${e.alpha}, ${e.beta}, ${e.gamma}`)
		}
		var diff = {g:-(e.gamma - startOrientation.g), a: -(e.alpha - startOrientation.a)}
		//alert(diff.g + ", " + (e.gamma - 180 - startOrientation.g))
		if(Math.abs(e.gamma - 180 - startOrientation.g) < Math.abs(e.gamma - startOrientation.g)){
			diff.g = -(e.gamma - 180 - startOrientation.g);
			diff.a += 180;
			//alert(diff.g + " "+ diff.a)
		}
		//alert(diff.g)
		//if(Math.abs(diff.g)>1)diff.g -= Math.PI/2 * Math.sign(diff.g);
		//if(Math.abs(diff.a)>1)diff.a -= Math.PI * Math.sign(diff.a);
		xAngle = diff.g * Math.PI / 180;
		yAngle = diff.a * Math.PI / 180;
		//xAngle = Math.max(Math.min(Math.PI/2, xAngle), -Math.PI/2);
	});
}*/

 var time = Date.now();
 var vX = 0, vY = 0, vZ = 0;
	window.addEventListener("devicemotion", function(e){
		var newTime = Date.now();
		var elapsedTime = newTime - time
		xAngle -= e.rotationRate.beta * Math.PI / 180 * elapsedTime * 0.001;
		yAngle -= e.rotationRate.alpha * Math.PI / 180 * elapsedTime * 0.001;
		vX += e.acceleration.y * elapsedTime * 0.1;
		vY += e.acceleration.x * elapsedTime * 0.1;
		vZ += e.acceleration.z * elapsedTime * 0.1;
		time = newTime;
	})



function c(d) {
	for (var i = 0; i < d.length; i++) {
		alert(d[i]);
	}
}

