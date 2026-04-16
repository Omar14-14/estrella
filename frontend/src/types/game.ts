export type GameStatus = 'idle' | 'running' | 'dead';

export interface PlayerState {
  y: number;        // posición Y actual
  vy: number;       // velocidad vertical
  isOnGround: boolean;
}

export interface Obstacle {
  id: number;
  x: number;
  h: number;        // altura del obstáculo
}

export interface GameState {
  status: GameStatus;
  score: number;
  hiScore: number;
  speed: number;
  player: PlayerState;
  obstacles: Obstacle[];
  stars: Star[];    // decoración de fondo
  frameTime: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;    // paralax speed multiplier
}
