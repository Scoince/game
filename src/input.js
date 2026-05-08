const keyMap = {
  ArrowUp: { x: 0, z: 1 }, KeyW: { x: 0, z: 1 },
  ArrowDown: { x: 0, z: -1 }, KeyS: { x: 0, z: -1 },
  ArrowLeft: { x: -1, z: 0 }, KeyA: { x: -1, z: 0 },
  ArrowRight: { x: 1, z: 0 }, KeyD: { x: 1, z: 0 }
};

export function setupInput(onMove, onPause) {
  const handler = (e) => {
    if (e.repeat) return;
    if (e.code === 'Escape') { onPause(); return; }
    const dir = keyMap[e.code];
    if (dir) onMove(dir);
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
