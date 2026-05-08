import * as THREE from 'three';
import { CAMERA_CONFIG } from './constants.js';

export function createCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  const d = CAMERA_CONFIG.frustumSize;
  const cam = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 100);
  cam.position.set(CAMERA_CONFIG.xOffset, CAMERA_CONFIG.y, CAMERA_CONFIG.zOffset);
  cam.lookAt(0, 0, 0);
  return cam;
}

export function resizeCamera(camera) {
  const aspect = window.innerWidth / window.innerHeight;
  const d = CAMERA_CONFIG.frustumSize;
  camera.left = -d * aspect;
  camera.right = d * aspect;
  camera.top = d;
  camera.bottom = -d;
  camera.updateProjectionMatrix();
}
