var starFragmentShader = `#version 300 es
    precision highp float;

    in vec3 color;
    out vec4 pixel_color;

    void main (){
        pixel_color = vec4(color, 1.0);
    }
`;