import * as THREE from 'three';
export function createCar(color = Math.random() * 0xffffff) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.5), new THREE.MeshStandardMaterial({ color, flatShading: true }));
  body.position.y = 0.2;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.42), new THREE.MeshStandardMaterial({ color: 0xe5e7eb, flatShading: true }));
  cabin.position.set(0.08, 0.45, 0);
  g.add(body, cabin);
  return g;
}
