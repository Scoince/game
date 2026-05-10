export function startHandTracking(video, canvas, store, onDraw) {
  const Hands = window.Hands;
  if (!Hands) {
    return { supported: false, stop: () => {} };
  }

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results) => {
    if (!store.handTrackingEnabled || !results.multiHandLandmarks?.length) {
      store.previousPoint = null;
      return;
    }

    const indexTip = results.multiHandLandmarks[0][8];
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: (1 - indexTip.x) * rect.width,
      y: indexTip.y * rect.height,
    };

    if (store.previousPoint) {
      onDraw(store.previousPoint, point);
    }

    store.previousPoint = point;
  });

  const camera = new window.Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 1280,
    height: 720,
  });

  camera.start();

  return {
    supported: true,
    stop: () => camera.stop(),
  };
}
