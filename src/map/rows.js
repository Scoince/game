import * as THREE from 'three';
import { MAP_HALF_WIDTH, ROW_TYPES, TILE_SIZE, VEHICLE_SPEED } from '../constants.js';
import { createTree } from '../entities/Tree.js';
import { createCar } from '../entities/Car.js';
import { createTruck } from '../entities/Truck.js';

export function makeRow(z, type) {
  const group = new THREE.Group();
  const obstacles = new Set();
  const vehicles = [];
  const groundColor = (type === ROW_TYPES.ROAD_CAR || type === ROW_TYPES.ROAD_TRUCK) ? 0x4b5563 : 0x84cc16;
  const ground = new THREE.Mesh(new THREE.BoxGeometry((MAP_HALF_WIDTH * 2 + 1) * TILE_SIZE, 0.1, TILE_SIZE), new THREE.MeshStandardMaterial({ color: groundColor, flatShading: true }));
  ground.position.set(0, -0.05, z);
  ground.receiveShadow = true;
  group.add(ground);

  if (type === ROW_TYPES.FOREST) {
    for (let x = -MAP_HALF_WIDTH; x <= MAP_HALF_WIDTH; x++) if (Math.random() < 0.35 && x !== 0) {
      const tree = createTree();
      tree.position.set(x, 0, z);
      group.add(tree);
      obstacles.add(x);
    }
  }

  if (type === ROW_TYPES.ROAD_CAR || type === ROW_TYPES.ROAD_TRUCK) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    const count = type === ROW_TYPES.ROAD_CAR ? 3 : 2;
    for (let i = 0; i < count; i++) {
      const mesh = type === ROW_TYPES.ROAD_CAR ? createCar() : createTruck();
      const spacing = 4.5;
      const x = -MAP_HALF_WIDTH - 3 + i * spacing;
      mesh.position.set(x, 0, z);
      mesh.castShadow = true;
      group.add(mesh);
      const speed = type === ROW_TYPES.ROAD_CAR
        ? VEHICLE_SPEED.carMin + Math.random() * (VEHICLE_SPEED.carMax - VEHICLE_SPEED.carMin)
        : VEHICLE_SPEED.truckMin + Math.random() * (VEHICLE_SPEED.truckMax - VEHICLE_SPEED.truckMin);
      vehicles.push({ mesh, x, dir, speed, length: type === ROW_TYPES.ROAD_CAR ? 0.9 : 1.7 });
    }
    for (let x = -MAP_HALF_WIDTH; x <= MAP_HALF_WIDTH; x += 2) {
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.08), new THREE.MeshStandardMaterial({ color: 0xf8fafc, flatShading: true }));
      mark.position.set(x, 0.02, z);
      group.add(mark);
    }
  }
  return { z, type, group, obstacles, vehicles };
}
