var fragmentSource = `#version 300 es
    precision highp float;    
    layout(std140) uniform Uniforms{
        float screenWidthOverHeight;
        vec3 cameraPos;
        mat3 transform;
    };

    in vec2 screen_position;

    out vec4 color;

    const int MAX_ITER = 100;
    const float MIN_DIST = 0.01;
    const float PI = 3.14159265359;
    const float FOV = PI / 1.0;

    float Mod(float f1, float f2){
        return (f2 * ((f1/f2)-round(f1/f2)));
    }

    void main(){
        vec3 position = vec3(screen_position.x * screenWidthOverHeight, screen_position.y, 0.0);
        //vec3 pos = cameraPos + (position * transform);
        vec3 direction = normalize(vec3(position.xy, 1.0)) * transform;
        /*vec3(
            cos(position.y * FOV * 0.5) * sin(position.x * FOV * 0.5),
            sin(position.y * FOV * 0.5),
            cos(position.y * FOV * 0.5) * cos(position.x * FOV * 0.5)) * transform;*/

        vec3 p = cameraPos;
        float dist;

        int iterations = 0;
        for(int i = 0; i < MAX_ITER; i++){
            vec3 point = vec3(Mod(p.x, 10.0), Mod(p.y, 10.0), Mod(p.z, 10.0));
            dist = distance(point, vec3(0.0, 0.0, 2.0)) - 1.0;
            p += direction * dist;
            iterations = dist < MIN_DIST ? iterations : (iterations + 1);
        }

        if(dist < MIN_DIST){
            float value = float(iterations) / float(MAX_ITER);
            color = vec4(value, value, value, 1.0);
        }
        else{
            color = vec4(0.0, 0.0, 0.0, 1.0);
        }
        
    }
`;