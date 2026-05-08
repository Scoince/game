export function detectCollision(state, map) {
  const row = map.getRow(state.playerTile.z);
  if (!row || !row.vehicles.length) return false;
  for (const v of row.vehicles) if (Math.abs(v.x - state.playerTile.x) < v.length * 0.5) return true;
  return false;
}
