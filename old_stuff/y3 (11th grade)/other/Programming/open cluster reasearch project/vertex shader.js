var starVertexShader = `#version 300 es
    layout(std140) uniform Uniforms{ //items must be multiples of bytes, so vec3 has an extra value at the end and mat3 has 3 extra values when setting
        vec2 screenSize;
        vec3 cameraPos;
        mat3 transform;
    };

    layout(location = 0) in vec3 position;
    layout(location = 1) in vec3 in_color;

    out vec3 color;
    void main(){
        color = in_color;
        vec3 transformed = position - cameraPos;
        transformed *= transform;
        transformed = vec3(transformed.x * screenSize.y / screenSize.x, transformed.yz);
        gl_Position = vec4(transformed, transformed.z);
        gl_PointSize = 1.0 / transformed.z;
    }
`;