import * as THREE from 'three';
export function createTruck(color = Math.random() * 0xffffff) {
  const g = new THREE.Group();
  const cargo = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.35, 0.5), new THREE.MeshStandardMaterial({ color, flatShading: true }));
  cargo.position.set(-0.15, 0.23, 0);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.5), new THREE.MeshStandardMaterial({ color: 0x374151, flatShading: true }));
  cabin.position.set(0.65, 0.23, 0);
  g.add(cargo, cabin);
  return g;
}
