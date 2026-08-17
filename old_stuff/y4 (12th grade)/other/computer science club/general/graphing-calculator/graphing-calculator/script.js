var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function loadStuff(funcStr){

  
  var func = cleanupFunction(funcStr);
  
  
  var pixelSize = 1;
	var resolutionX = canvas.width / pixelSize;
	var resolutionY = canvas.height / pixelSize;
	for(var x = 0; x < resolutionX; x++){
		for(var y = 0; y < resolutionY; y++){
			var yNew = (-y + resolutionY / 2) * 20 / resolutionY * (canvas.height / canvas.width);
			var xNew = (x - resolutionX / 2) * 20 / resolutionX;
			//var v = Math.abs(yNew * yNew+ xNew*xNew - 400, 2);
      var v = Math.pow(func(xNew, yNew), 2);
			var dx = (Math.abs(Math.pow(func(xNew + 0.01, yNew), 2) - v) / 0.01);
			var dy = (Math.abs(Math.pow(func(xNew, yNew + 0.01), 2) - v) / 0.01);
			v /= Math.sqrt(dx * dx + dy * dy);
			v *= 1000;
			ctx.fillStyle = `rgb(${v}, ${v}, ${v})`;
			ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
		}	
	}
  


	//the messing around we did the first day, in case anyone wants to look through it again.
  /*var squareSize = 3;
	for(var i = 0; i < canvas.width / squareSize; i++){
		for(var j = 0; j < canvas.height / squareSize; j++){
			ctx.fillStyle = isEven(i + j) ? "black" : "white";
			ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
		}
	}

  ctx.fillStyle = "gold";
  ctx.fillRect(0, 0, 100, 20);


  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillText(`width: ${canvas.width} height: ${canvas.height}`, 70, 70);
  ctx.font = "100px monospace";
  ctx.fillText("(^v^)", 100, 100);

  ctx.fillStyle = 'grey'
  ctx.fillRect(canvas.width/2-canvas.height/40*8.1, canvas.height/2-canvas.height/40*18.9, canvas.height/20*8.1, canvas.height/20*18.9);*/
  
}

// if you dont put in a valid equation it will crash so dont
function graphButton(equation) {
	// sample: y = 3 * x - 4
  loadStuff(equation);
	
	
}

function cleanupFunction(text) {
  var string = "";
  // remove spaces
  for (var i = 0; i < text.length; i++) {
    string += text.substring(i, i + 1) == " " ? "" : text.substring(i, i + 1);
  }
  
  var sides = string.split("=");
  string = `return (${sides[0]})-(${sides[1]})`;
  
  return new Function("x", "y", string);
}

function isEven(num) {
  num = Math.abs(num);
  return num == 0 ? true : !isEven(num - 1);
}

function fastIsEven(num){
	return (num % 2); //I personally like num & 1, but there are concerns that bitwise operators are slow in JS
}

document.addEventListener("keydown", function(e){
	if(e.key == "Enter" && document.getElementById("equation")){
		graphButton(document.getElementById('equation').value);
		console.log("hi")
	}
});