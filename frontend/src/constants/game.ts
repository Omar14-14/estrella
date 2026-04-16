import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_W = width;
export const SCREEN_H = height;

// Personaje
export const PLAYER_W      = 36;
export const PLAYER_H      = 44;
export const PLAYER_X      = 80;
export const GROUND_Y      = SCREEN_H * 0.72; // Y del suelo
export const PLAYER_FLOOR  = GROUND_Y - PLAYER_H;

// Física
export const GRAVITY        = 1400;  // px/s²
export const JUMP_VELOCITY  = -520;  // px/s (negativo = arriba)

// Obstáculos
export const OBS_W          = 22;
export const OBS_MIN_H      = 30;
export const OBS_MAX_H      = 90;
export const OBS_GAP_MIN    = 280;  // distancia mínima entre obstáculos
export const OBS_GAP_MAX    = 480;

// Velocidad inicial y aceleración
export const INITIAL_SPEED  = 220;  // px/s
export const SPEED_INCREMENT = 12;  // px/s cada 5 puntos

// Suelo y cielo decorativo
export const GROUND_H       = SCREEN_H - GROUND_Y;
