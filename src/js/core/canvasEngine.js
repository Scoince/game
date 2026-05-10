import { lerp } from "../utils/math.js";

export function createCanvasEngine(canvas, store) {
  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  function resizeToDisplaySize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawLine(from, to) {
    ctx.strokeStyle = store.mode === "erase" ? "#000" : store.color;
    ctx.globalCompositeOperation = store.mode === "erase" ? "destination-out" : "source-over";
    ctx.lineWidth = store.size;

    const smoothX = lerp(from.x, to.x, 0.55);
    const smoothY = lerp(from.y, to.y, 0.55);

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(smoothX, smoothY, to.x, to.y);
    ctx.stroke();
  }

  function snapshot(video) {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");

    exportCtx.save();
    exportCtx.scale(-1, 1);
    exportCtx.drawImage(video, -exportCanvas.width, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.restore();

    exportCtx.drawImage(canvas, 0, 0);
    return exportCanvas.toDataURL("image/png");
  }

  return { ctx, resizeToDisplaySize, clear, drawLine, snapshot };
}
