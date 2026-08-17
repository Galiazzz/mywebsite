var globeVertexShader = `#version 300 es
    layout(std140) uniform Uniforms{ //items must be multiples of bytes, so vec3 has an extra value at the end and mat3 has 3 extra values when setting
        vec2 screenSize;
        vec3 cameraPos;
        mat3 transform;
    };

    layout(location = 0) in vec3 position;

    out float z;
    void main(){
        vec3 transformed = position - cameraPos;
        transformed *= transform;
        transformed = vec3(transformed.x * screenSize.y / screenSize.x, transformed.yz);
        z = transformed.z;
        gl_Position = vec4(transformed, transformed.z);
        gl_PointSize = 1.0 / transformed.z;
    }
`;

var globeFragmentShader = `#version 300 es
    precision highp float;

    in float z;
    out vec4 color;

    void main (){
        color = vec4(0.0, 1.0, 0.0, 5.0/(z * z));
    }
`;