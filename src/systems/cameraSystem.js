import { CAMERA_CONFIG } from '../constants.js';
export function updateCamera(camera, playerPos) {
  const targetX = playerPos.x + CAMERA_CONFIG.xOffset;
  const targetZ = playerPos.z + CAMERA_CONFIG.zOffset;
  camera.position.x += (targetX - camera.position.x) * CAMERA_CONFIG.easing;
  camera.position.z += (targetZ - camera.position.z) * CAMERA_CONFIG.easing;
  camera.lookAt(playerPos.x, 0, playerPos.z);
}
