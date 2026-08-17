var starVertexShader = `#version 300 es
    layout(std140) uniform Uniforms{ //items must be multiples of 4 bytes, so vec3 has an extra value at the end and mat3 has 3 extra values when setting
        //vec2 screenSize;
        //vec3 cameraPos;
        //mat3 transform;
				mat4 transform;
    };

    layout(location = 0) in vec3 position;
    layout(location = 1) in vec4 in_color;

    out vec4 color;
    void main(){
        color = in_color;
        vec4 transformed = vec4(position, 1) * transform;
        //transformed *= transform;
        //transformed = vec3(transformed.x * screenSize.y / screenSize.x, transformed.yz);
				color.a = 1.0 / transformed.z;// /= transformed.z * transformed.z;
        gl_Position = transformed;//vec4(transformed, transformed.z); //to preserve z, turn this to vec4(transformed.xy, transformed.z * transformed.z, transformed.z)
        gl_PointSize = max(1.0, 1.0 / transformed.z);
    }
`;

var depthVertexShader = `#version 300 es
    layout(std140) uniform Uniforms{
				mat4 transform;
    };

    layout(location = 0) in vec3 position;
    layout(location = 1) in vec4 in_color;

    out vec4 color;
    void main(){
        vec4 transformed = vec4(position, 1) * transform;
				color = vec4(in_color.rgb / transformed.z, 1.0);
        gl_Position = vec4(transformed.xy, 0.001 * transformed.z * transformed.z, transformed.z);
        gl_PointSize = max(1.0, 1.0 / transformed.z);
    }
`;