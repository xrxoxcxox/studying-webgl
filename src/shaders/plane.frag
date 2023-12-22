#version 300 es

precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMousePosition;
uniform float uScrollPosition;
uniform int uSectionNumber;
uniform float uInterpolationFactor;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // outColor = vec4(uv.x, sin(uScrollPosition * 0.001), uMousePosition.y, 1.0);

  vec4 colorA;
  vec4 colorB;

  vec4 firstColor = vec4(abs(sin(uv.x + uTime)), 0.0, 0.0, 1.0);
  vec4 secondColor = vec4(0.0, abs(sin(uv.y + uTime)), 0.0, 1.0);
  vec4 thirdColor = vec4(0.0, 0.0, abs(sin(uv.x + uv.y + uTime)), 1.0);

  // セクションに基づいた色の設定
  if (uSectionNumber == 1) {
    colorA = firstColor;
    colorB = firstColor;
  } else if (uSectionNumber == 2) {
    colorA = firstColor;
    colorB = secondColor;
  } else if (uSectionNumber == 3) {
    colorA = secondColor;
    colorB = thirdColor;
  }

  outColor = mix(colorA, colorB, uInterpolationFactor);
}
