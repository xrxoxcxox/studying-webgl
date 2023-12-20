#version 300 es

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePosition;

out vec4 outColor;

float pi = acos(-1.0);

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float sNoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // アスペクト比を考慮したUV座標の計算
  vec2 aspectCorrectedUV = uv;
  aspectCorrectedUV.x *= uResolution.x / uResolution.y;

  // マウス位置のアスペクト比を補正
  vec2 aspectCorrectedMouse = uMousePosition;
  aspectCorrectedMouse.x *= uResolution.x / uResolution.y;

  // マウス位置との距離を計算
  float mouseDistnace = distance(aspectCorrectedMouse, aspectCorrectedUV);
  float mouseColorIntensity = 1.0 - smoothstep(0.0, 500.0 / uResolution.x, mouseDistnace);
  float mouseR = mouseColorIntensity * 0.5;
  float mouseG = mouseColorIntensity;
  float mouseB = mouseColorIntensity * 0.8;
  float mouseA = mouseColorIntensity * 0.2;
  vec4 mouseColor = vec4(mouseR, mouseG, mouseB, mouseA);

  float offset = sNoise(vec2(cos(uv.x * pi) + uTime * 0.1, uv.y * sin(uTime) * 0.2) - uTime * 0.1);
  float colorValue = mix(1.0, offset, 0.25);
  float r = clamp(colorValue, 0.2, 0.75);
  float g = clamp(colorValue + 0.1, 0.2, 0.85);
  float b = clamp(colorValue * 1.2, 0.2, 0.9);

  vec4 gradient = vec4(r, g, b, 1.0);

  outColor = mix(gradient, mouseColor, mouseColor.a);
}
