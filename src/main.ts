import vertexShaderSource from "./shaders/plane.vert";
import fragmentShaderSource from "./shaders/plane.frag";

const canvas = document.getElementById("webgl-canvas");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("The element with id 'webgl-canvas' is not an HTMLCanvasElement.");
}

const gl = canvas.getContext("webgl2");
if (!(gl instanceof WebGL2RenderingContext)) {
  alert("Unable to initialize WebGL2.");
  throw new Error("WebGL2 not supported");
}

function setCanvasToDisplaySize(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

window.addEventListener("resize", () => {
  setCanvasToDisplaySize(canvas, gl);
  drawScene(canvas, gl);
});

function compileShader(source: string , type: GLenum, gl: WebGL2RenderingContext) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error('Unable to create shader.');
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl);

if (!vertexShader || !fragmentShader) {
  console.error("Shaders were not created successfully");
  throw new Error("Shaders were not created successfully");
}

const shaderProgram = gl.createProgram();
if (!shaderProgram) {
  console.error("Failed to create shader program");
  throw new Error("Failed to create shader program");
}

gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.error(
    "Unable to initialize the shader program: " +
      gl.getProgramInfoLog(shaderProgram)
  );
}

gl.useProgram(shaderProgram);

const vertices = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]; // Top left, top right, bottom left, bottom right

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(
  shaderProgram,
  "position"
);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

function drawScene(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  setCanvasToDisplaySize(canvas, gl);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

drawScene(canvas, gl);