// canvas要素の取得とWebGL2コンテキストの取得
const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

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

// canvasの幅と高さの大きさの矩形の頂点データ
const positions = new Float32Array([
  -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// シェーダーに渡すデータの設定
// 座標データ
const positionAttributeLocation = gl.getAttribLocation(
  shaderProgram,
  "aPosition"
);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// 解像度
const resolutionUniformLocation = gl.getUniformLocation(
  shaderProgram,
  "uResolution"
);

// 時間
const timeUniformLocation = gl.getUniformLocation(shaderProgram, "uTime");

// マウス位置
const mousePositionUniformLocation = gl.getUniformLocation(
  shaderProgram,
  "uMousePosition"
);

let mousePosition = { x: 0, y: 0 };

function getMousePosition(event: MouseEvent) {
  mousePosition.x = event.clientX / canvas.width;
  mousePosition.y = 1.0 - event.clientY / canvas.height; // Y軸を反転
}

window.addEventListener("mousemove", getMousePosition);

// スクロール位置
const scrollPositionUniformLocation = gl.getUniformLocation(
  shaderProgram,
  "uScrollPosition"
);

// sectionNumberの初期値設定
let sectionNumber:number = 1;

function updateSectionNumber(newSectionNumber: number) {
  if (sectionNumber !== newSectionNumber) {
    previousSectionNumber = sectionNumber;
    sectionNumber = newSectionNumber;
    interpolationFactor = 0.0; // セクションが変わったときに補完パラメータをリセット
  }
}

// Intersection Observerのコールバック関数
function intersectionObserverCallback(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.getAttribute("id");
      if (sectionId === "first-section") {
        updateSectionNumber(1);
      } else if (sectionId === "second-section") {
        updateSectionNumber(2);
      } else if (sectionId === "third-section") {
        updateSectionNumber(3);
      }
    }
  });
}

// Intersection Observerの設定
const intersectionObserverOptions = {
  root: null, // ビューポートをルートとする
  rootMargin: "0px",
  threshold: 0.1,
};

// Observerのインスタンス作成
const observer = new IntersectionObserver(intersectionObserverCallback, intersectionObserverOptions);

// 監視する要素を追加
document.querySelectorAll(".section").forEach((section) => {
  observer.observe(section);
});

// セクションのID
const sectionNumberUniformLocation = gl.getUniformLocation(
  shaderProgram,
  "uSectionNumber"
);

let interpolationFactor = 0.0;
let previousSectionNumber = 0;

const interpolationFactorLocation = gl.getUniformLocation(
  shaderProgram,
  "uInterpolationFactor"
);

// 描画の実行
function drawScene(width: number, height: number, time: number) {
  const currentTime = time * 0.001;
  gl.uniform1f(timeUniformLocation, currentTime);
  gl.uniform2f(resolutionUniformLocation, width, height);
  gl.uniform2f(mousePositionUniformLocation, mousePosition.x, mousePosition.y);
  gl.uniform1f(scrollPositionUniformLocation, window.scrollY);
  gl.uniform1i(sectionNumberUniformLocation, sectionNumber);
  if (sectionNumber !== previousSectionNumber && interpolationFactor < 1.0) {
    interpolationFactor += 0.01; // 補完速度調整
    gl.uniform1f(interpolationFactorLocation, interpolationFactor);
  }
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
