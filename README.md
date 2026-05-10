# Air Writing Board (Rebuilt)

A clean, modular rebuild of a webcam-based “air writing” demo where users can draw over a live camera feed using mouse/touch, with optional hand-tracking support via MediaPipe Hands.

## Run

No build step is required.

```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

> Note: Webcam access requires serving over `http://localhost` (or HTTPS) and browser permission.

## Project Structure

- `index.html` – App shell and semantic UI sections.
- `src/styles/` – Global design tokens and component styles.
- `src/js/`
  - `app.js` – Composition root and initialization flow.
  - `state/store.js` – Single source of truth for app state.
  - `core/canvasEngine.js` – All drawing logic and render loop.
  - `core/cameraController.js` – Camera lifecycle and stream handling.
  - `features/controls.js` – Toolbar/event wiring.
  - `features/inputPointer.js` – Mouse/touch drawing input.
  - `features/handTracking.js` – Optional MediaPipe integration.
  - `utils/` – Shared helpers.

## Features

- Live webcam preview in a bounded stage.
- Drawing overlay with stroke smoothing and configurable brush size/color.
- Eraser mode.
- Clear canvas action.
- Download drawing snapshot.
- Optional hand-tracking mode (index finger as pen) when MediaPipe loads.
- Responsive layout for desktop/tablet/mobile.

## Limitations

- Hand tracking depends on third-party CDN script availability.
- Accuracy varies by lighting/background and camera quality.
- No multi-user/session persistence yet.

## Next Improvements

- Undo/redo history stack.
- Gesture-based mode switching (draw/erase/clear).
- PWA offline mode and settings persistence.
- Web Worker offloading for heavy vision processing.
