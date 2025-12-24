export const GAME_SPEED = 4;
export const GRAVITY = 0.45;
export const THRUST = -0.75;
export const MAX_FUEL = 100;
export const FUEL_CONSUMPTION = 0.32; // Reduced from 0.35 to make it deplete slower
export const FUEL_RECHARGE = 0.12;
export const VERTICAL_FUEL_CONSUMPTION_MULTIPLIER = 0.85; // 15% less consumption in vertical mode
export const VERTICAL_FUEL_RECHARGE_MULTIPLIER = 1.25; // 25% more recharge in vertical mode
export const SPAWN_RATE = 180; 

export enum GameState {
  START = 'START',
  INTRO = 'INTRO',
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