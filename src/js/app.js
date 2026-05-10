import { store } from "./state/store.js";
import { createCanvasEngine } from "./core/canvasEngine.js";
import { startCamera } from "./core/cameraController.js";
import { bindControls } from "./features/controls.js";
import { registerPointerInput } from "./features/inputPointer.js";
import { startHandTracking } from "./features/handTracking.js";

async function bootstrap() {
  const video = document.getElementById("cameraFeed");
  const canvas = document.getElementById("drawLayer");
  const statusText = document.getElementById("statusText");

  const engine = createCanvasEngine(canvas, store);
  engine.resizeToDisplaySize();

  window.addEventListener("resize", engine.resizeToDisplaySize);

  bindControls(store, engine, {
    colorPicker: document.getElementById("colorPicker"),
    brushSize: document.getElementById("brushSize"),
    drawModeBtn: document.getElementById("drawModeBtn"),
    eraseModeBtn: document.getElementById("eraseModeBtn"),
    clearBtn: document.getElementById("clearBtn"),
    downloadBtn: document.getElementById("downloadBtn"),
    handTrackingToggle: document.getElementById("handTrackingToggle"),
    video,
  });

  registerPointerInput(canvas, store, engine.drawLine);

  try {
    await startCamera(video);
    statusText.textContent = "Camera ready. Start drawing.";

    const hand = startHandTracking(video, canvas, store, engine.drawLine);
    if (!hand.supported) {
      statusText.textContent = "Camera ready. Hand tracking unavailable (MediaPipe failed to load).";
    }
  } catch {
    statusText.textContent = "Unable to access camera. Check browser permissions and HTTPS/localhost.";
  }
}

bootstrap();
