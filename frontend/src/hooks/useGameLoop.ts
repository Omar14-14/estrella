import { useRef, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GRAVITY, JUMP_VELOCITY, PLAYER_FLOOR, PLAYER_X, PLAYER_W, PLAYER_H,
  OBS_W, OBS_MIN_H, OBS_MAX_H, OBS_GAP_MIN, OBS_GAP_MAX,
  INITIAL_SPEED, SPEED_INCREMENT, SCREEN_W, SCREEN_H, GROUND_Y,
} from '../constants/game';
import { GameState, GameStatus, Obstacle, Star } from '../types/game';

const HI_SCORE_KEY = 'estrella_game_hiscore';

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeStars(): Star[] {
  return Array.from({ length: 40 }, () => ({
    x: Math.random() * SCREEN_W,
    y: Math.random() * GROUND_Y * 0.85,
    size: randomBetween(1, 3),
    speed: randomBetween(0.1, 0.4),
  }));
}

function makeObstacle(id: number, afterX: number): Obstacle {
  return {
    id,
    x: afterX + randomBetween(OBS_GAP_MIN, OBS_GAP_MAX),
    h: randomBetween(OBS_MIN_H, OBS_MAX_H),
  };
}

const INITIAL_STATE = (): GameState => ({
  status: 'idle',
  score: 0,
  hiScore: 0,
  speed: INITIAL_SPEED,
  player: { y: PLAYER_FLOOR, vy: 0, isOnGround: true },
  obstacles: [
    makeObstacle(1, SCREEN_W + 100),
    makeObstacle(2, SCREEN_W + 100 + randomBetween(OBS_GAP_MIN, OBS_GAP_MAX)),
  ],
  stars: makeStars(),
  frameTime: 0,
});

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const stateRef   = useRef<GameState>(gameState);
  const rafRef     = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const obsCountRef = useRef(3);

  // Cargar hiScore al inicio
  useEffect(() => {
    AsyncStorage.getItem(HI_SCORE_KEY).then(val => {
      const hi = val ? parseInt(val, 10) : 0;
      stateRef.current = { ...stateRef.current, hiScore: hi };
      setGameState(s => ({ ...s, hiScore: hi }));
    });
  }, []);

  const saveHiScore = useCallback(async (score: number) => {
    const current = stateRef.current.hiScore;
    if (score > current) {
      await AsyncStorage.setItem(HI_SCORE_KEY, String(score));
      return score;
    }
    return current;
  }, []);

  const tick = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap 50ms
    lastTimeRef.current = timestamp;

    const s = stateRef.current;
    if (s.status !== 'running') return;

    // ── Física del jugador ─────────────────────────────
    let vy = s.player.vy + GRAVITY * dt;
    let y  = s.player.y + vy * dt;
    let onGround = false;

    if (y >= PLAYER_FLOOR) {
      y = PLAYER_FLOOR;
      vy = 0;
      onGround = true;
    }

    // ── Mover obstáculos ───────────────────────────────
    const speed   = s.speed;
    let   score   = s.score;
    let   newSpeed = speed;
    const newObs: Obstacle[] = [];

    for (const obs of s.obstacles) {
      const nx = obs.x - speed * dt;
      if (nx + OBS_W < -10) {
        // Salió por la izquierda → nuevo obstáculo al final
        score += 1;
        if (score % 5 === 0) newSpeed = speed + SPEED_INCREMENT;
        const lastX = newObs.length > 0
          ? newObs[newObs.length - 1].x
          : SCREEN_W;
        newObs.push(makeObstacle(obsCountRef.current++, Math.max(lastX, SCREEN_W)));
      } else {
        newObs.push({ ...obs, x: nx });
      }
    }
    while (newObs.length < 2) {
      const lastX = newObs.length > 0 ? newObs[newObs.length - 1].x : SCREEN_W;
      newObs.push(makeObstacle(obsCountRef.current++, lastX));
    }

    // ── Colisión ───────────────────────────────────────
    const px1 = PLAYER_X + 4;
    const px2 = PLAYER_X + PLAYER_W - 4;
    const py1 = y + 4;
    const py2 = y + PLAYER_H;

    let hit = false;
    for (const obs of newObs) {
      const ox1 = obs.x;
      const ox2 = obs.x + OBS_W;
      const oy1 = GROUND_Y - obs.h;
      const oy2 = GROUND_Y;
      if (px2 > ox1 && px1 < ox2 && py2 > oy1 && py1 < oy2) {
        hit = true;
        break;
      }
    }

    // ── Paralax estrellas ──────────────────────────────
    const newStars = s.stars.map(st => ({
      ...st,
      x: st.x - speed * st.speed * dt,
      ...(st.x < -5 ? { x: SCREEN_W + 5 } : {}),
    }));

    if (hit) {
      saveHiScore(score).then(hi => {
        const next: GameState = {
          ...stateRef.current,
          status: 'dead',
          score,
          hiScore: hi,
          player: { y, vy, isOnGround: onGround },
          obstacles: newObs,
          stars: newStars,
          frameTime: timestamp,
        };
        stateRef.current = next;
        setGameState({ ...next });
      });
      return;
    }

    const next: GameState = {
      ...s,
      score,
      speed: newSpeed,
      player: { y, vy, isOnGround: onGround },
      obstacles: newObs,
      stars: newStars,
      frameTime: timestamp,
    };
    stateRef.current = next;
    setGameState({ ...next });
    rafRef.current = requestAnimationFrame(tick);
  }, [saveHiScore]);

  const start = useCallback(() => {
    const fresh = INITIAL_STATE();
    const hi = stateRef.current.hiScore;
    const next = { ...fresh, status: 'running' as GameStatus, hiScore: hi };
    stateRef.current = next;
    lastTimeRef.current = 0;
    obsCountRef.current = 3;
    setGameState({ ...next });
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== 'running') return;
    if (!s.player.isOnGround) return;
    stateRef.current = {
      ...s,
      player: { ...s.player, vy: JUMP_VELOCITY, isOnGround: false },
    };
  }, []);

  const restart = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    start();
  }, [start]);

  // Limpiar RAF al desmontar
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { gameState, start, jump, restart };
}
