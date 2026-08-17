var vertex = `#version 300 es

    layout(std140) uniform;

    layout(location=0) in vec3 pos;
    layout(location=1) in vec3 vel;

    out vec3 position;
    out vec3 velocity;
    
    void main(){

        position = pos;
        velocity = vel;

        if(position.x > 1.0){
            position.x = 1.0;
            velocity.x *= -1.0;
        }
        if(position.x < -1.0){
            position.x = -1.0;
            velocity.x *= -1.0;
        }
        if(position.y > 1.0){
            position.y = 1.0;
            velocity.y *= -1.0;
        }
        if(position.y < -1.0){
            position.y = -1.0;
            velocity.y *= -1.0;
        }

        position += velocity;

        gl_PointSize = 4.0;
        gl_Position = vec4(position, 1.0);
    }
`;

var fragment = `#version 300 es
    precision highp float;

    out vec4 color;

    void main(){
        float alpha = 0.1;
        color = vec4(alpha);
    }
`

//things to look at:
//webgl2 new things: https://webgl2fundamentals.org/webgl/lessons/webgl2-whats-new.html
//getting data from buffer: https://stackoverflow.com/questions/31921501/how-to-read-webgl-gl-bufferdata-in-javascript
//bind uniform buffer objects: https://stackoverflow.com/questions/44629165/bind-multiple-uniform-buffer-objects
//getBufferSubData reference: https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData

//Good example:
//https://github.com/tsherif/webgl2examples/blob/master/particles.html

var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var gl = canvas.getContext("webgl2");

var shader;
var numPoints = 100000;

var positionData = new Float32Array(numPoints * 3);
var velocityData = new Float32Array(numPoints * 3);

var currentVertexArray;
var currentTransformFeedback;

var positionBufferA, positionBufferB;
var velocityBufferA, velocityBufferB;
var transformFeedbackA, transformFeedbackB;
var vertexArrayA, vertexArrayB;

function LoadStuff(){

    if(!gl){
        alert("webgl2 not working");
        return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    shader = SetUpProgram(vertex, fragment);
    gl.useProgram(shader);

    for(var i = 0; i < numPoints; ++i){
        var index = i * 3;
        //positionData[index] = Math.random() * 2 - 1;
        //positionData[index + 1] = Math.random() * 2 - 1;
        //positionData[index + 2] = 0;//Math.random() * 2 - 1;

        var angle = Math.random() * 2 * Math.PI;

        velocityData[index] = Math.cos(angle) * 0.01;
        velocityData[index + 1] = Math.sin(angle) * 0.01;
    }

    //Set Up transform feedback

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

    requestAnimationFrame(Draw);
}

function Draw(){

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindVertexArray(currentVertexArray);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, currentTransformFeedback);

    if(currentTransformFeedback == transformFeedbackA){
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferA);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferA);
    }
    else{
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferB);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferB);
    }

    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numPoints);
    gl.endTransformFeedback();

    if(currentVertexArray == vertexArrayA){
        currentVertexArray = vertexArrayB;
        currentTransformFeedback = transformFeedbackA;
    }
    else{
        currentVertexArray = vertexArrayA;
        currentTransformFeedback = transformFeedbackB;
    }

    requestAnimationFrame(Draw);
}

function SetUpProgram(vertexShaderSource = "", fragmentShaderSource = ""){
    var vsSource = vertexShaderSource.trim();
    var fsSource = fragmentShaderSource.trim();

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(vertexShader));
        console.error(gl.getShaderInfoLog(vertexShader));
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(fragmentShader));
        console.error(gl.getShaderInfoLog(fragmentShader));
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //probabbly should be removed if not used, not entirely sure how to use
    gl.transformFeedbackVaryings(program, ["position", "velocity"], gl.SEPARATE_ATTRIBS);

    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        alert(gl.getProgramInfoLog(program));
        console.error(gl.getProgramInfoLog(program));
    }

    return program;
}