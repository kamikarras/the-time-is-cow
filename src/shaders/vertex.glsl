uniform float uTest;

varying vec2 vUv;
varying float vTest;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
    vTest = uTest;
}