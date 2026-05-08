import * as THREE from 'three';

export class Player {
  constructor() {
    this.group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xfff1f5, flatShading: true });
    const capMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, flatShading: true });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 0.7), mat);
    body.position.y = 0.45;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), capMat);
    cap.position.y = 0.88;
    this.shadow = new THREE.Mesh(new THREE.CircleGeometry(0.28, 18), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.01;
    body.castShadow = cap.castShadow = true;
    body.receiveShadow = cap.receiveShadow = true;
    this.group.add(this.shadow, body, cap);
  }
}
