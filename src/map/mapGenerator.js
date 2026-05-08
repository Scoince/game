import { ROW_PROBABILITY, ROW_TYPES, ROWS_AHEAD, ROWS_BEHIND_KEEP, START_ROW } from '../constants.js';
import { makeRow } from './rows.js';

export class MapGenerator {
  constructor(scene) { this.scene = scene; this.rows = new Map(); this.maxGeneratedZ = START_ROW - 1; }
  chooseType(z) {
    if (z <= 1) return ROW_TYPES.GRASS;
    const r = Math.random();
    if (r < ROW_PROBABILITY.grass) return ROW_TYPES.GRASS;
    if (r < ROW_PROBABILITY.grass + ROW_PROBABILITY.forest) return ROW_TYPES.FOREST;
    if (r < ROW_PROBABILITY.grass + ROW_PROBABILITY.forest + ROW_PROBABILITY.roadCar) return ROW_TYPES.ROAD_CAR;
    return ROW_TYPES.ROAD_TRUCK;
  }
  ensureRows(playerZ) {
    while (this.maxGeneratedZ < playerZ + ROWS_AHEAD) {
      const z = this.maxGeneratedZ + 1;
      const row = makeRow(z, this.chooseType(z));
      this.rows.set(z, row); this.scene.add(row.group); this.maxGeneratedZ = z;
    }
    for (const [z, row] of this.rows) if (z < playerZ - ROWS_BEHIND_KEEP) {
      this.scene.remove(row.group); this.rows.delete(z);
    }
  }
  getRow(z) { return this.rows.get(z); }
  clear() { for (const r of this.rows.values()) this.scene.remove(r.group); this.rows.clear(); this.maxGeneratedZ = START_ROW - 1; }
}
