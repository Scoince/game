# Crossy Mini (Three.js)

A polished, modular Crossy-Road-inspired mini game built from scratch with Three.js + Vite.

## Run locally

```bash
npm install
npm run dev
```

## Customize

- **Player style:** `src/entities/Player.js`
- **Vehicle speed:** `src/constants.js` -> `VEHICLE_SPEED`
- **Row generation probability:** `src/constants.js` -> `ROW_PROBABILITY`
- **Tile size / bounds:** `src/constants.js` -> `TILE_SIZE`, `MAP_HALF_WIDTH`
- **Camera angle/feel:** `src/constants.js` -> `CAMERA_CONFIG`

## Controls

- Keyboard: WASD / Arrow keys
- Mobile: On-screen directional buttons
- Pause/Resume: `Escape`

## Notes

- Endless forward row generation with cleanup behind player
- Hop animation movement with blocking checks (trees + bounds)
- Collision-based game over with retry reset
