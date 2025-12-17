export const GAME_SPEED = 4;
export const GRAVITY = 0.4;
export const THRUST = -0.7;
export const MAX_FUEL = 100;
export const FUEL_CONSUMPTION = 0.5;
export const FUEL_RECHARGE = 0.8;
export const CHARGE_HEIGHT_THRESHOLD = 150; // Pixels from bottom where charging happens
export const SPAWN_RATE = 180; // Frames between spawns

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export type ObstacleType = 'BARN' | 'SILO';

export interface Obstacle {
  id: number;
  x: number;
  type: ObstacleType;
  height: number;
  width: number;
  passed: boolean;
}