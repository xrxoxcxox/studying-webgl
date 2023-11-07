#version 300 es

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

out vec4 outColor;

void main() {
  float x = gl_FragCoord.x / uResolution.x;
  float y = gl_FragCoord.y / uResolution.y;
  outColor = vec4(x * abs(sin(uTime / 11.0f)), y * abs(sin(uTime / 13.0f)), abs(sin(uTime / 19.0f)), 1.0f);
}
