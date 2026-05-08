import { createScene } from './scene.js';
import { createCamera, resizeCamera } from './camera.js';
import { createRenderer } from './renderer.js';
import { createGameState } from './gameState.js';
import { Player } from './entities/Player.js';
import { MapGenerator } from './map/mapGenerator.js';
import { tryStartMove, updatePlayerMovement } from './systems/movementSystem.js';
import { updateVehicles } from './systems/vehicleSystem.js';
import { detectCollision } from './systems/collisionSystem.js';
import { updateCamera } from './systems/cameraSystem.js';
import { setupInput } from './input.js';
import { createUI } from './ui/ui.js';

const app = document.getElementById('app');
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
app.append(renderer.domElement);

let state = createGameState();
let player = new Player();
scene.add(player.group);
let map = new MapGenerator(scene);
map.ensureRows(state.playerTile.z);

const reset = () => {
  scene.remove(player.group); map.clear();
  state = createGameState(); player = new Player();
  player.group.position.set(0, 0, 0); scene.add(player.group);
  map.ensureRows(state.playerTile.z);
  ui.hideGameOver(); ui.setScore(0); ui.setPaused(false);
};

const handleMove = (dir) => {
  if (tryStartMove(state, dir, map)) {
    ui.hideIntro();
  }
};

const ui = createUI(app, handleMove, reset);
setupInput(handleMove, () => { if (!state.gameOver) { state.paused = !state.paused; ui.setPaused(state.paused); } });

window.addEventListener('resize', () => { resizeCamera(camera); renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); });

let prev = performance.now();
function loop(now) {
  const dt = Math.min((now - prev) / 1000, 0.033);
  prev = now;
  if (!state.gameOver && !state.paused) {
    updatePlayerMovement(dt, state, player);
    map.ensureRows(state.playerTile.z);
    updateVehicles(dt, map);
    state.highestRow = Math.max(state.highestRow, state.playerTile.z);
    state.score = Math.max(0, state.highestRow);
    ui.setScore(state.score);
    if (detectCollision(state, map)) {
      state.gameOver = true;
      ui.showGameOver(state.score);
    }
  }
  updateCamera(camera, player.group.position);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
