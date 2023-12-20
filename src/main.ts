// canvas要素の取得とWebGL2コンテキストの取得
const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

let mousePosition = { x: 0, y: 0 };

function getMousePosition(event: MouseEvent) {
  mousePosition.x = event.clientX / canvas.width;
  mousePosition.y = 1.0 - (event.clientY / canvas.height); // Y軸を反転
}

canvas.addEventListener('mousemove', getMousePosition);

// シェーダープログラムの作成
import vertexShaderSource from "./shaders/plane.vert";
import fragmentShaderSource from "./shaders/plane.frag";

const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram() as WebGLProgram;
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// バッファの作成と設定
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// canvasの幅と高さの半分の大きさの矩形の頂点データ
const positions = new Float32Array([
  -1.0, -1.0,
   1.0, -1.0,
  -1.0,  1.0,
   1.0,  1.0,
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// シェーダーに渡すデータの設定
const positionAttributeLocation = gl.getAttribLocation(
  shaderProgram,
  "aPosition"
);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'uResolution');

const timeUniformLocation = gl.getUniformLocation(shaderProgram, "uTime");

const mousePositionUniformLocation = gl.getUniformLocation(shaderProgram, "uMousePosition");

// 描画の実行
function drawScene(width: number, height: number, time: number) {
  const currentTime = time * 0.001;
  gl.uniform1f(timeUniformLocation, currentTime);
  gl.uniform2f(resolutionUniformLocation, width, height);
  gl.uniform2f(mousePositionUniformLocation, mousePosition.x, mousePosition.y);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame((currentTime) => drawScene(width, height, currentTime));
}

// ウィンドウサイズに合わせてcanvasのサイズを変更する
function resizeCanvasToDisplaySize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
  drawScene(width, height, 0.0);
}

// ウィンドウリサイズイベントに対するリスナーを設定
window.addEventListener("resize", resizeCanvasToDisplaySize);

// 初期表示時にもリサイズを実行
document.addEventListener("DOMContentLoaded", resizeCanvasToDisplaySize);
