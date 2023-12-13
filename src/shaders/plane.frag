#version 300 es

precision mediump float;

in vec2 vTextureCoord;
out vec4 outColor;

float createNoise(float seed) {
  return fract(sin(dot(vTextureCoord.xy * seed, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  float gradient = sin(vTextureCoord.y);
  float noiseIntensity = mix(1.0, 0.5, gradient);
  float r = createNoise(2.0) * 2.0 + gradient;
  float g = createNoise(5.0) + gradient;
  float b = createNoise(10.0) + gradient;
  vec3 color = vec3(r, g, b) * noiseIntensity;

  outColor = vec4(color, 1.0);
}
