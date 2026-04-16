import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Layout } from '../../constants/layout';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  score: number;
  hiScore: number;
}

export function GameHUD({ score, hiScore }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.hud} pointerEvents="none">
      <View style={[styles.block, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }, theme.shadow.soft]}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>PUNTOS</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{String(score).padStart(5, '0')}</Text>
      </View>
      <View style={[styles.block, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }, theme.shadow.soft]}>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>RECORD</Text>
        <Text style={[styles.value, { color: theme.colors.primary }]}>
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
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '900',
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
});
