#version 300 es

precision mediump float;

in vec2 vTextureCoord;
out vec4 outColor;

void main() {
  float r = vTextureCoord.x;
  float g = vTextureCoord.y;
  outColor = vec4(r, g, 0.0, 1.0);
}
