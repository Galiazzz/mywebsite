var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = canvas.height * (window.innerWidth / window.innerHeight);

var resolution = canvas.height * canvas.width
var MaxRaySteps = 100;
var MinimumDistance = 1;

var arr = [];

function LoadStuff() {
    for (var i = 0; i < canvas.width; i++) {
        arr.push([]);
        for (n = 0; n < canvas.height; n++) {
            arr[i][n] = 0
        }
    }
    //setInterval(Update, 10);
    Update();
}

function Update() {
    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            var ray = Raymarch(new Vector3(x - canvas.width / 2, y - canvas.height / 2, -55), new Vector3(.001*(x - canvas.width/2), .001*(y -canvas.height/2), .1))
            var value = ray.value * 255;
            
            arr[y][x] = value;
            ctx.fillStyle = "rgb(" + value + "," + value + "," + value + ")";
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function distanceFromSphere(point, centerOfSphere, radius) {
    return DistanceVec3(point, centerOfSphere) - radius;
}

function Raymarch(rayOrigin, rayDirection) {
    var totalDistance = 0;
    var steps;
    for (steps = 0; steps < MaxRaySteps; steps++) {
        var p = new Vector3(rayOrigin.x + totalDistance * rayDirection.x, rayOrigin.y + totalDistance * rayDirection.y, rayOrigin.z + totalDistance * rayDirection.z);
        var distance = distanceFromSphere(p, new Vector3(0, 0, 0), 50);
        totalDistance += distance;
        if (distance < MinimumDistance) {
            break;
        }
    }
    return {
        value: 1 - steps / MaxRaySteps,
        point: new Vector3(rayOrigin.x + totalDistance * rayDirection.x, rayOrigin.y + totalDistance * rayDirection.y, rayOrigin.z + totalDistance * rayDirection.z)
    }

}

function MandleBulbleDistanceEstimator(pos) {
	var z = pos;
	var dr = 1.0;
    var r = 0.0;
    var Power = 8;
    var Iterations = 8;
    var Bailout = 100;
	for (var i = 0; i < Iterations; i++) {
		r = Math.sqrt((z.x * z.x) + (z.y * z.y) + (z.z * z.z));
		if (r>Bailout) break;
		
		// convert to polar coordinates
		var theta = Math.acos(z.z/r);
		var phi = Math.atan(z.y,z.x);
		dr =  Math.pow( r, Power-1.0)*Power*dr + 1.0;
		
		// scale and rotate the point
		var zr = Math.pow( r,Power);
		theta = theta*Power;
		phi = phi*Power;
		
        // convert back to cartesian coordinates
        var stage = new Vector3(Math.sin(theta)*Math.cos(phi), Math.sin(phi)*Math.sin(theta), Math.cos(theta))
		z = new Vector3(stage.x * zr, stage.y * zr, stage.z * zr);
		z.Add(pos);
	}
	return 0.5*Math.log(r)*r/dr;
}

document.addEventListener("mousedown", function (e) {
    Debug.Log(arr[e.clientY][e.clientX]);
})