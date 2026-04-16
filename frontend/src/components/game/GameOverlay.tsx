import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { GameStatus } from '../../types/game';

interface Props {
  status: GameStatus;
  score: number;
  hiScore: number;
  onStart: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export function GameOverlay({ status, score, hiScore, onStart, onRestart, onBack }: Props) {
  if (status === 'running') return null;

  const isIdle = status === 'idle';
  const isDead = status === 'dead';
  const isNew = isDead && score > 0 && score >= hiScore;

  return (
    <Animated.View style={styles.overlay} entering={FadeIn.duration(250)}>
      <Animated.View style={styles.card} entering={ZoomIn.duration(300)}>
        {isIdle && (
          <>
            <Text style={styles.title}>Juego</Text>
            <Text style={styles.subtitle}>Toca la pantalla para saltar.</Text>
          </>
        )}

        {isDead && (
          <>
            <Text style={styles.title}>Fin del juego</Text>
            <View style={styles.scoreRow}>
              <View style={styles.scoreBlock}>
                <Text style={styles.scoreLabel}>PUNTOS</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </View>
              <View style={styles.dividerV} />
              <View style={styles.scoreBlock}>
                <Text style={styles.scoreLabel}>RECORD</Text>
                <Text style={[styles.scoreValue, { color: Colors.primary }]}>{hiScore}</Text>
              </View>
            </View>
            {isNew && <Text style={styles.newRecord}>Nuevo record</Text>}
          </>
        )}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={isIdle ? onStart : onRestart}
          activeOpacity={0.82}
        >
          <Text style={styles.primaryBtnText}>
            {isIdle ? 'Empezar' : 'Reintentar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack} style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Volver</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(43, 36, 48, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface + 'f5',
    borderRadius: Layout.borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Layout.spacing.xl,
    alignItems: 'center',
    gap: Layout.spacing.lg,
    width: 286,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  scoreValue: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  dividerV: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: Colors.border,
  },
  newRecord: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xxl,
    paddingVertical: Layout.spacing.md,
    borderRadius: 22,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: Layout.spacing.sm,
  },
  secondaryBtnText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
