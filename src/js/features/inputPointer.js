export function registerPointerInput(canvas, store, onDraw) {
  const pointFromEvent = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  canvas.addEventListener("pointerdown", (event) => {
    store.isDrawing = true;
    store.previousPoint = pointFromEvent(event);
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!store.isDrawing) return;
    const current = pointFromEvent(event);
    onDraw(store.previousPoint, current);
    store.previousPoint = current;
  });

  const stop = () => {
    store.isDrawing = false;
    store.previousPoint = null;
  };

  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
}
