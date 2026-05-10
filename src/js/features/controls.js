export function bindControls(store, engine, elements) {
  const {
    colorPicker,
    brushSize,
    drawModeBtn,
    eraseModeBtn,
    clearBtn,
    downloadBtn,
    handTrackingToggle,
    video,
  } = elements;

  colorPicker.addEventListener("input", (event) => {
    store.color = event.target.value;
  });

  brushSize.addEventListener("input", (event) => {
    store.size = Number(event.target.value);
  });

  drawModeBtn.addEventListener("click", () => {
    store.mode = "draw";
    drawModeBtn.classList.add("btn--active");
    eraseModeBtn.classList.remove("btn--active");
  });

  eraseModeBtn.addEventListener("click", () => {
    store.mode = "erase";
    eraseModeBtn.classList.add("btn--active");
    drawModeBtn.classList.remove("btn--active");
  });

  clearBtn.addEventListener("click", engine.clear);

  downloadBtn.addEventListener("click", () => {
    const data = engine.snapshot(video);
    const link = document.createElement("a");
    link.href = data;
    link.download = `air-writing-${Date.now()}.png`;
    link.click();
  });

  handTrackingToggle.addEventListener("change", (event) => {
    store.handTrackingEnabled = event.target.checked;
  });
}
