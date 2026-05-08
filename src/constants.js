export const TILE_SIZE = 1;
export const HALF_TILE = TILE_SIZE * 0.5;
export const MAP_HALF_WIDTH = 6;
export const START_ROW = 0;
export const MIN_ROW = -2;
export const ROWS_AHEAD = 20;
export const ROWS_BEHIND_KEEP = 8;

export const ROW_TYPES = {
  GRASS: 'grass',
  FOREST: 'forest',
  ROAD_CAR: 'road_car',
  ROAD_TRUCK: 'road_truck'
};

export const ROW_PROBABILITY = {
  grass: 0.35,
  forest: 0.2,
  roadCar: 0.3,
  roadTruck: 0.15
};

export const VEHICLE_SPEED = {
  carMin: 1.6,
  carMax: 2.8,
  truckMin: 1.1,
  truckMax: 1.8
};

export const CAMERA_CONFIG = {
  frustumSize: 14,
  y: 12,
  zOffset: 8,
  xOffset: 5,
  easing: 0.08
};

export const PLAYER_CONFIG = {
  moveDuration: 0.17,
  hopHeight: 0.35
};
