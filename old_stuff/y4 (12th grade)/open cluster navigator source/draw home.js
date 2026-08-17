var homeVertex = `#version 300 es
		layout(std140) uniform Uniforms{
        mat4 transform;
    };

		uniform vec2 screen;
		
		layout(location = 0) in vec2 uvPos;

 		out vec2 uv;
	 	out float dist;
	 	out float closenessMod;
		void main(){
			vec4 transformed = vec4(0, 0, 0, 1) * transform;
	 		vec2 screenStretch = vec2(min(1.0, screen.y / screen.x), min(1.0, screen.x / screen.y));
	 		vec2 modifier = 0.3 * (uvPos - vec2(0.5));
			uv = vec2(uvPos.x, 1.0 - uvPos.y);
	 		dist = transformed.z;
			modifier *= closenessMod = max(1.0, 1.0/(dist * 5.0));
			gl_Position = vec4((transformed.xy) / transformed.z + modifier * screenStretch, transformed.z > 0.0 ? 1.0 : 2.0, 1.0);
		}
	
`;
var homeFragment = `#version 300 es
		precision mediump float;

 		uniform sampler2D tex;

    in vec2 uv;
		in float dist;
		in float closenessMod;
    out vec4 color;

    void main (){
			vec2 modifiedUV = (uv - 0.5) * 5.0 * dist * closenessMod;
	 		vec2 clamped = clamp(modifiedUV, -0.5, 0.5);
			color = modifiedUV == clamped ? texture(tex, modifiedUV + 0.5) : vec4(0);
      color = abs(length(uv - 0.5) - 0.49) < 0.01 ? vec4(1) : color;
						
    }
`;

var drawHome = false;

var homeProgram = CreateProgram(homeVertex, homeFragment);
var homeVAO = gl.createVertexArray();
gl.bindVertexArray(homeVAO);
var homeUVBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, homeUVBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 1, 0,    0, 1, 0, 0, 1, 0]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
var homeTextureUniformLocation = gl.getUniformLocation(homeProgram, "tex");

var homeTexture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, homeTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 255, 0, 255]));

var screenUniformPos = gl.getUniformLocation(homeProgram, "screen");

var image = new Image();
image.src = "images/Earth.png";
image.addEventListener("load", function(){

	gl.bindTexture(gl.TEXTURE_2D, homeTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	//gl.generateMipmap(gl.TEXTURE_2D);
	drawHome = true;
	document.getElementById('homeDrawn').innerText = (drawHome ? 'on' : 'off')
})
