import * as THREE from 'three';

export function createTree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.4, 0.24), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, flatShading: true }));
  trunk.position.y = 0.2;
  const h = 0.65 + Math.random() * 0.3;
  const crown = new THREE.Mesh(new THREE.BoxGeometry(0.65, h, 0.65), new THREE.MeshStandardMaterial({ color: 0x16a34a, flatShading: true }));
  crown.position.y = 0.4 + h * 0.5;
  trunk.castShadow = crown.castShadow = true;
  trunk.receiveShadow = crown.receiveShadow = true;
  g.add(trunk, crown);
  return g;
}
