var globeVertexShader = `#version 300 es
    layout(std140) uniform Uniforms{ //items must be multiples of 4 bytes, so vec3 has an extra value at the end and mat3 has 3 extra values when setting
        mat4 transform;
    };

    layout(location = 0) in vec3 position;
		layout(location = 1) in vec3 color;

    out float z;
		out vec3 pix_color;
    void main(){
        vec4 transformed = vec4(position, 1) * transform;
        z = transformed.z;
				pix_color = color;
        gl_Position = transformed;
    }
`;

var globeFragmentShader = `#version 300 es
    precision highp float;

    in float z;
		in vec3 pix_color;
    out vec4 color;

    void main (){
        color = vec4(pix_color, 5.0/(z * z));
    }
`;