import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

interface Props {
  score: number;
  hiScore: number;
}

export function GameHUD({ score, hiScore }: Props) {
  return (
    <View style={styles.hud} pointerEvents="none">
      <View style={styles.block}>
        <Text style={styles.label}>PUNTOS</Text>
        <Text style={styles.value}>{String(score).padStart(5, '0')}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>RECORD</Text>
        <Text style={[styles.value, { color: Colors.primary }]}>
          {String(hiScore).padStart(5, '0')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.xl,
  },
  block: {
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.surface + 'd9',
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  value: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
});
