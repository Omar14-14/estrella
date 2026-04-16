import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Layout } from '../../constants/layout';
import { GameStatus } from '../../types/game';
import { useTheme } from '../../theme/ThemeProvider';
import { SoftButton, ThemeToggle } from '../ui';

interface Props {
  status: GameStatus;
  score: number;
  hiScore: number;
  onStart: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export function GameOverlay({ status, score, hiScore, onStart, onRestart, onBack }: Props) {
  const { theme } = useTheme();
  if (status === 'running') return null;

  const isIdle = status === 'idle';
  const isDead = status === 'dead';
  const isNew = isDead && score > 0 && score >= hiScore;

  return (
    <Animated.View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]} entering={FadeIn.duration(250)}>
      <View style={styles.toggleWrap}>
        <ThemeToggle />
      </View>
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border },
          theme.shadow.floating,
        ]}
        entering={ZoomIn.duration(300)}
      >
        {isIdle && (
          <>
            <Text style={[styles.title, { color: theme.colors.text }]}>Juego</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Toca la pantalla para saltar.</Text>
          </>
        )}

        {isDead && (
          <>
            <Text style={[styles.title, { color: theme.colors.text }]}>Fin del juego</Text>
            <View style={styles.scoreRow}>
              <View style={styles.scoreBlock}>
                <Text style={[styles.scoreLabel, { color: theme.colors.textMuted }]}>PUNTOS</Text>
                <Text style={[styles.scoreValue, { color: theme.colors.text }]}>{score}</Text>
              </View>
              <View style={[styles.dividerV, { backgroundColor: theme.colors.border }]} />
              <View style={styles.scoreBlock}>
                <Text style={[styles.scoreLabel, { color: theme.colors.textMuted }]}>RECORD</Text>
                <Text style={[styles.scoreValue, { color: theme.colors.primary }]}>{hiScore}</Text>
              </View>
            </View>
            {isNew && <Text style={[styles.newRecord, { color: theme.colors.primary }]}>Nuevo record</Text>}
          </>
        )}

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }, theme.shadow.glow]}
          onPress={isIdle ? onStart : onRestart}
          activeOpacity={0.82}
        >
          <Text style={[styles.primaryBtnText, { color: theme.colors.textOnPrimary }]}>
            {isIdle ? 'Empezar' : 'Reintentar'}
          </Text>
        </TouchableOpacity>

        <SoftButton label="Volver" variant="ghost" onPress={onBack} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleWrap: {
    position: 'absolute',
    top: 44,
    right: 18,
  },
  card: {
    borderRadius: Layout.borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Layout.spacing.xl,
    alignItems: 'center',
    gap: Layout.spacing.lg,
    width: 296,
    overflow: 'hidden',
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.lg,
  },
  scoreBlock: {
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '900',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  dividerV: {
    width: StyleSheet.hairlineWidth,
    height: 40,
  },
  newRecord: {
    fontSize: 14,
    fontWeight: '900',
  },
  primaryBtn: {
    paddingHorizontal: Layout.spacing.xxl,
    paddingVertical: Layout.spacing.md,
    borderRadius: 22,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '900',
  },
});
