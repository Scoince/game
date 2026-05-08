import { START_ROW } from './constants.js';

export function createGameState() {
  return {
    playerTile: { x: 0, z: START_ROW },
    targetTile: { x: 0, z: START_ROW },
    highestRow: START_ROW,
    score: 0,
    gameOver: false,
    paused: false,
    started: false,
    moving: false,
    moveElapsed: 0,
    moveFrom: { x: 0, z: START_ROW }
  };
}
