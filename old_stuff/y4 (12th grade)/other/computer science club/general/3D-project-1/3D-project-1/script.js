var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var points = [];
triangles = [];
var gridX = 16, gridZ = 16;

var camX = 0, camY = 0, camZ = 0;
var yAngle = 0, xAngle = 0;

function loadStuff() {
	for(var r = 0; r < gridZ; r++){
		points[r] = [];
		for(var c = 0; c < gridX; c++){
			points[r].push(c - gridX / 2); //x
			points[r].push(Math.sin(r) + Math.sin(c)); //y //0.00001 * (r * r + Math.pow(c - gridX / 2, 8)) - 2
			points[r].push(r); //z
		}
	}
for(var r = 0; r < gridZ-1; r++){
  for(var c = 0; c < gridX-1; c++){
		//first Triangle
    triangles.push(points[r][c * 3]);
		triangles.push(points[r][c * 3 + 1]);
		triangles.push(points[r][c * 3 + 2]);

		triangles.push(points[r][(c + 1) * 3]);
		triangles.push(points[r][(c + 1) * 3 + 1]);
		triangles.push(points[r][(c + 1) * 3 + 2]);

		triangles.push(points[r + 1][(c + 1) * 3]);
		triangles.push(points[r + 1][(c + 1) * 3 + 1]);
		triangles.push(points[r + 1][(c + 1) * 3 + 2]);

		//second Triangle
    // Triangle triangle = new Triangle(triangle);
    triangles.push(points[r][c * 3]);
		triangles.push(points[r][c * 3 + 1]);
		triangles.push(points[r][c * 3 + 2]);

		triangles.push(points[r + 1][(c) * 3]);
		triangles.push(points[r + 1][(c) * 3 + 1]);
		triangles.push(points[r + 1][(c) * 3 + 2]);

		triangles.push(points[r + 1][(c + 1) * 3]);
		triangles.push(points[r + 1][(c + 1) * 3 + 1]);
		triangles.push(points[r + 1][(c + 1) * 3 + 2]);
  }
}
  setInterval(update, 10);
	requestAnimationFrame(draw);
}

function update(){
  var speed = 0.025;
  var rotSpeed = 0.01;
	if(keysDown[Keys.fwd]){
		camZ += speed * Math.cos(yAngle);
    camX += speed * Math.sin(yAngle);
	}
	if(keysDown[Keys.bwd]){
		camZ -= speed * Math.cos(yAngle);
    camX -= speed * Math.sin(yAngle);
	}
	if(keysDown[Keys.left]){
		camX -= speed * Math.cos(yAngle);
    camZ += speed * Math.sin(yAngle);
	}
	if(keysDown[Keys.right]){
		camX += speed * Math.cos(yAngle);
    camZ -= speed * Math.sin(yAngle);
	}
	if(keysDown[Keys.up]){
		camY += speed;
	}
	if(keysDown[Keys.down]){
		camY -= speed;
	}
	if(keysDown[Keys.camUp]){
		xAngle += rotSpeed;
	}
	if(keysDown[Keys.camDown]){
		xAngle -= rotSpeed;
	}
	if(keysDown[Keys.camLeft]){
		yAngle -= rotSpeed;
	}
	if(keysDown[Keys.camRight]){
		yAngle += rotSpeed;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var yRot = [
		Math.cos(yAngle), 0, -Math.sin(yAngle),
		0, 1, 0,
		Math.sin(yAngle), 0, Math.cos(yAngle)
	];

	var xRot = [
		1, 0, 0,
		0, Math.cos(xAngle), -Math.sin(xAngle),
		0, Math.sin(xAngle), Math.cos(xAngle)
	];

  var rotations = MulMatrix3x3(xRot, yRot);
	
	for(var i = 0; i < triangles.length / 9; i++){

		var ox1 = triangles[i * 9 + 0 * 3 + 0], oy1 = triangles[i * 9 + 0 * 3 + 1], oz1 = triangles[i * 9 + 0 * 3 + 2]
		var sx1 = ox1 - camX, sy1 = oy1 - camY, sz1 = oz1 - camZ;
    var rotated1 = applyMatrix3x3ToPoint(rotations, sx1, sy1, sz1);
		var px1 = (rotated1.x) / (rotated1.z), py1 = (rotated1.y) / (rotated1.z);

    var ox2 = triangles[i * 9 + 1 * 3 + 0], oy2 = triangles[i * 9 + 1 * 3 + 1], oz2 = triangles[i * 9 + 1 * 3 + 2];
    var sx2 = ox2 - camX, sy2 = oy2 - camY, sz2 = oz2 - camZ;
    var rotated2 = applyMatrix3x3ToPoint(rotations, sx2, sy2, sz2);
    var px2 = (rotated2.x) / (rotated2.z), py2 = (rotated2.y) / (rotated2.z);

    var ox3 = triangles[i * 9 + 2 * 3 + 0], oy3 = triangles[i * 9 + 2 * 3 + 1], oz3 = triangles[i * 9 + 2 * 3 + 2];
    var sx3 = ox3 - camX, sy3 = oy3 - camY, sz3 = oz3 - camZ;
    var rotated3 = applyMatrix3x3ToPoint(rotations, sx3, sy3, sz3);
		var px3 = (rotated3.x) / (rotated3.z), py3 = (rotated3.y) / (rotated3.z);

    var fovConstant = 500;
    
		px1 *= fovConstant; 
    px2 *= fovConstant;
    px3 *= fovConstant;

		py1 *= -fovConstant;
		py2 *= -fovConstant;
		py3 *= -fovConstant;
		
		px1 += canvas.width / 2; 
    px2 += canvas.width / 2; 
    px3 += canvas.width / 2;

		py1 += canvas.height / 2;
		py2 += canvas.height / 2;
		py3 += canvas.height / 2;
		
    ctx.strokeStyle = "black";
		try{
			var gradient = ctx.createLinearGradient(Math.min(canvas.width, px1), Math.min(canvas.width, py1), Math.min(canvas.width, px3), Math.min(canvas.width, py3));

    gradient.addColorStop(0, "green");
		gradient.addColorStop(0.5, "cyan");
    gradient.addColorStop(1, "salmon");
			ctx.fillStyle = gradient;
		}
		catch{
			ctx.fillStyle = "green";
		}
    
    
    ctx.beginPath();
		if(rotated1.z > 0)ctx.moveTo(px1, py1);
		if(rotated2.z > 0)ctx.lineTo(px2, py2);
    if(rotated3.z > 0)ctx.lineTo(px3, py3);
		if(rotated1.z > 0)ctx.lineTo(px1, py1);
    ctx.stroke();
		ctx.fill();
	}
  
  requestAnimationFrame(draw);
}

function MulMatrix3x3(leftMat, rightMat) {
	return [
		rightMat[0] * leftMat[0] + rightMat[3] * leftMat[1] + rightMat[6] * leftMat[2], rightMat[1] * leftMat[0] + rightMat[4] * leftMat[1] + rightMat[7] * leftMat[2], rightMat[2] * leftMat[0] + rightMat[5] * leftMat[1] + rightMat[8] * leftMat[2],
		rightMat[0] * leftMat[3] + rightMat[3] * leftMat[4] + rightMat[6] * leftMat[5], rightMat[1] * leftMat[3] + rightMat[4] * leftMat[4] + rightMat[7] * leftMat[5], rightMat[2] * leftMat[3] + rightMat[5] * leftMat[4] + rightMat[8] * leftMat[5],
		rightMat[0] * leftMat[6] + rightMat[3] * leftMat[7] + rightMat[6] * leftMat[8], rightMat[1] * leftMat[6] + rightMat[4] * leftMat[7] + rightMat[7] * leftMat[8], rightMat[2] * leftMat[6] + rightMat[5] * leftMat[7] + rightMat[8] * leftMat[8]
	];
}

function applyMatrix3x3ToPoint(mat, x, y, z){
	return {x: x * mat[0] + y * mat[1] + z * mat[2],
				  y: x * mat[3] + y * mat[4] + z * mat[5],
				 	z: x * mat[6] + y * mat[7] + z * mat[8]};
}

/*
// super useful counting function
console.log(countToNum(10));

async function countToNum(num) {
  for (var i = 0; i < num; i++) {
    console.log(i < num ? i + 1 : num);  
  }
  return "[object Object]";
}
*/


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
	switch(event.key.toLowerCase()) {
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
	switch(event.key.toLowerCase()) {
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