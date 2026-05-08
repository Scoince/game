import { MIN_ROW, MAP_HALF_WIDTH, PLAYER_CONFIG } from '../constants.js';

export function tryStartMove(state, dir, map) {
  if (state.gameOver || state.paused || state.moving) return false;
  const next = { x: state.playerTile.x + dir.x, z: state.playerTile.z + dir.z };
  if (next.x < -MAP_HALF_WIDTH || next.x > MAP_HALF_WIDTH) return false;
  if (next.z < MIN_ROW) return false;
  const nextRow = map.getRow(next.z);
  if (nextRow?.obstacles?.has(next.x)) return false;
  state.moving = true;
  state.moveElapsed = 0;
  state.moveFrom = { ...state.playerTile };
  state.targetTile = next;
  state.started = true;
  return true;
}

export function updatePlayerMovement(dt, state, player) {
  if (!state.moving) return;
  state.moveElapsed += dt;
  const t = Math.min(state.moveElapsed / PLAYER_CONFIG.moveDuration, 1);
  const sx = state.moveFrom.x + (state.targetTile.x - state.moveFrom.x) * t;
  const sz = state.moveFrom.z + (state.targetTile.z - state.moveFrom.z) * t;
  const hop = Math.sin(t * Math.PI) * PLAYER_CONFIG.hopHeight;
  player.group.position.set(sx, hop, sz);
  player.group.scale.y = 1 - Math.sin(t * Math.PI) * 0.08;
  if (t >= 1) {
    state.playerTile = { ...state.targetTile };
    state.moving = false;
    player.group.scale.y = 1;
    player.group.position.set(state.playerTile.x, 0, state.playerTile.z);
  }
}
