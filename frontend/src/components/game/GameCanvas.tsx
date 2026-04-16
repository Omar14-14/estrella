import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect, Circle, Polygon, Line, Defs, LinearGradient, Stop,
} from 'react-native-svg';
import { Colors } from '../../constants/colors';
import {
  SCREEN_W, SCREEN_H, GROUND_Y, GROUND_H,
  PLAYER_X, PLAYER_W, PLAYER_H,
  OBS_W,
} from '../../constants/game';
import { GameState } from '../../types/game';

interface Props {
  state: GameState;
}

function Player({ y }: { y: number }) {
  const cx = PLAYER_X + PLAYER_W / 2;
  const cy = y + PLAYER_H / 2;
  return (
    <>
      <Polygon
        points={`${cx},${cy - 18} ${cx + 14},${cy} ${cx},${cy + 18} ${cx - 14},${cy}`}
        fill={Colors.primary}
        opacity={0.95}
      />
      <Polygon
        points={`${cx},${cy - 9} ${cx + 7},${cy} ${cx},${cy + 9} ${cx - 7},${cy}`}
        fill={Colors.surface}
        opacity={0.9}
      />
      <Circle cx={cx - 3} cy={cy - 8} r={3} fill="#fff" opacity={0.65} />
    </>
  );
}

function ObstacleComp({ x, h }: { x: number; h: number }) {
  const top = GROUND_Y - h;
  const mid = x + OBS_W / 2;
  return (
    <>
      <Rect
        x={x}
        y={top + 10}
        width={OBS_W}
        height={h - 10}
        fill={Colors.accent + '55'}
        stroke={Colors.accent}
        strokeWidth={1}
        rx={4}
      />
      <Polygon
        points={`${mid},${top} ${x},${top + 12} ${x + OBS_W},${top + 12}`}
        fill={Colors.accent}
        opacity={0.88}
      />
    </>
  );
}

export function GameCanvas({ state }: Props) {
  const { player, obstacles, stars } = state;

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={SCREEN_W} height={SCREEN_H}>
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#fff7fb" stopOpacity="1" />
            <Stop offset="1" stopColor="#f8edf4" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#f2dfe9" stopOpacity="1" />
            <Stop offset="1" stopColor="#ead9e5" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={SCREEN_W} height={GROUND_Y} fill="url(#skyGrad)" />

        {stars.map((st, i) => (
          <Circle key={i} cx={st.x} cy={st.y} r={st.size / 2} fill={Colors.primary} opacity={0.16} />
        ))}

        <Line
          x1={0} y1={GROUND_Y} x2={SCREEN_W} y2={GROUND_Y}
          stroke={Colors.primary + '55'} strokeWidth={1}
        />

        <Rect x={0} y={GROUND_Y} width={SCREEN_W} height={GROUND_H} fill="url(#groundGrad)" />

        {obstacles.map(obs => (
          <ObstacleComp key={obs.id} x={obs.x} h={obs.h} />
        ))}

        <Player y={player.y} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
