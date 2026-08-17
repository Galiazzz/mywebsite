canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

var magX = []
var magY = []
var magZ = []

let magSensor = new Magnetometer({ frequency: 60 });

magSensor.addEventListener("reading", (e) => {
    magX.push(magSensor.x)
    magY.push(magSensor.y)
    magZ.push(magSensor.z)
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.beginPath()
    ctx.moveTo(0, canvas.height/2)
    for(var i = 0 ; i < magX.length; i++){
        ctx.lineTo(i/4,canvas.height/2+magX[i])
    }
    ctx.strokeStyle="red"
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, canvas.height/2)
    for(var i = 0 ; i < magY.length; i++){
        ctx.lineTo(i/4,canvas.height/2+magY[i])
    }
    ctx.strokeStyle="green"
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, canvas.height/2)
    for(var i = 0 ; i < magZ.length; i++){
        ctx.lineTo(i/4,canvas.height/2+magZ[i])
    }
    ctx.strokeStyle="blue"
    ctx.stroke()
});
magSensor.start();