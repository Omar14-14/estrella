import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}

export function SoftCard({ children, style, elevated = false }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surfaceGlass,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
        elevated ? theme.shadow.floating : theme.shadow.soft,
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.gloss,
          {
            backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.74)',
            borderTopLeftRadius: theme.radius.lg,
            borderTopRightRadius: theme.radius.lg,
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
  },
});

