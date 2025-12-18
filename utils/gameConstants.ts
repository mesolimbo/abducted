export const GAME_SPEED = 4;
export const GRAVITY = 0.45;
export const THRUST = -0.75;
export const MAX_FUEL = 100;
export const FUEL_CONSUMPTION = 0.58; // Bumped up from 0.5
export const FUEL_RECHARGE = 0.12; 
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