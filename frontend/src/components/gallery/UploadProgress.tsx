import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  progress: number;
}

export function UploadProgress({ progress }: Props) {
  const { theme } = useTheme();
  const pct = Math.round(progress * 100);
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceGlass, borderBottomColor: theme.colors.border }]}>
      <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: theme.colors.primary }]} />
      </View>
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>Subiendo {pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 7,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  track: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
  },
});
