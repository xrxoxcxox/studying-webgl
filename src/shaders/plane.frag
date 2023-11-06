#version 300 es

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

out vec4 outColor;

void main() {
  outColor = vec4(sin(uTime), sin(uTime / 2.0), sin(uTime / 3.0), 1.0);
}
