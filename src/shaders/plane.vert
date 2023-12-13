#version 300 es

in vec2 aPosition;
out vec2 vTextureCoord;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);

  // 座標を[-1, 1]から[0, 1]に正規化する
  vTextureCoord = aPosition * 0.5 + 0.5;
}
