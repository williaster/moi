varying float vElevation;
varying vec2 vUv;

uniform float uElevation;
uniform float uTime;

float getElevation(vec3 position) {
    float elevation = 0.0;

    // general
    float x = position.x + uTime * 0.01;
    float z = position.z + uTime * 0.03;
    vec2 xz = vec2(x, z);
    float amplitude = 0.8; 
    elevation += cnoise(vec2(xz) * amplitude) * 0.4;

    // smaller details
    elevation += cnoise(vec2((xz + 111.0) * 0.1)) * 0.1;

    elevation *= uElevation;

    return elevation;
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = getElevation(modelPosition.xyz);
    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

     vElevation = elevation;
     vUv = uv;

    gl_Position = projectedPosition;
}