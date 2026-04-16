import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Rect, Circle, Polygon, Line, Defs, LinearGradient, Stop,
} from 'react-native-svg';
import {
  SCREEN_W, SCREEN_H, GROUND_Y, GROUND_H,
  PLAYER_X, PLAYER_W, PLAYER_H,
  OBS_W,
} from '../../constants/game';
import { GameState } from '../../types/game';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  state: GameState;
}

function Player({ y, primary, surface }: { y: number; primary: string; surface: string }) {
  const cx = PLAYER_X + PLAYER_W / 2;
  const cy = y + PLAYER_H / 2;
  return (
    <>
      <Polygon
        points={`${cx},${cy - 18} ${cx + 14},${cy} ${cx},${cy + 18} ${cx - 14},${cy}`}
        fill={primary}
        opacity={0.95}
      />
      <Polygon
        points={`${cx},${cy - 9} ${cx + 7},${cy} ${cx},${cy + 9} ${cx - 7},${cy}`}
        fill={surface}
        opacity={0.9}
      />
      <Circle cx={cx - 3} cy={cy - 8} r={3} fill="#fff" opacity={0.65} />
    </>
  );
}

function ObstacleComp({ x, h, accent }: { x: number; h: number; accent: string }) {
  const top = GROUND_Y - h;
  const mid = x + OBS_W / 2;
  return (
    <>
      <Rect
        x={x}
        y={top + 10}
        width={OBS_W}
        height={h - 10}
        fill={accent + '55'}
        stroke={accent}
        strokeWidth={1}
        rx={4}
      />
      <Polygon
        points={`${mid},${top} ${x},${top + 12} ${x + OBS_W},${top + 12}`}
        fill={accent}
        opacity={0.88}
      />
    </>
  );
}

export function GameCanvas({ state }: Props) {
  const { player, obstacles, stars } = state;
  const { theme } = useTheme();

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={SCREEN_W} height={SCREEN_H}>
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.colors.background} stopOpacity="1" />
            <Stop offset="1" stopColor={theme.colors.backgroundSoft} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.colors.surfaceAlt} stopOpacity="1" />
            <Stop offset="1" stopColor={theme.colors.surface} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={SCREEN_W} height={GROUND_Y} fill="url(#skyGrad)" />

        {stars.map((st, i) => (
          <Circle
            key={i}
            cx={st.x}
            cy={st.y}
            r={st.size / 2}
            fill={theme.colors.primary}
            opacity={theme.isDark ? 0.28 : 0.16}
          />
        ))}

        <Line
          x1={0} y1={GROUND_Y} x2={SCREEN_W} y2={GROUND_Y}
          stroke={theme.colors.primary + '55'} strokeWidth={1}
        />

        <Rect x={0} y={GROUND_Y} width={SCREEN_W} height={GROUND_H} fill="url(#groundGrad)" />

        {obstacles.map(obs => (
          <ObstacleComp key={obs.id} x={obs.x} h={obs.h} accent={theme.colors.accent} />
        ))}

        <Player y={player.y} primary={theme.colors.primary} surface={theme.colors.surface} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
