import { MAP_HALF_WIDTH } from '../constants.js';
export function updateVehicles(dt, map) {
  for (const row of map.rows.values()) for (const v of row.vehicles) {
    v.x += v.dir * v.speed * dt;
    const wrap = MAP_HALF_WIDTH + 4;
    if (v.dir > 0 && v.x > wrap) v.x = -wrap;
    if (v.dir < 0 && v.x < -wrap) v.x = wrap;
    v.mesh.position.x = v.x;
    v.mesh.rotation.y = v.dir > 0 ? 0 : Math.PI;
  }
}
