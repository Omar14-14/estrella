import React from 'react';
import { SafeAreaView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({ children, style, contentStyle }: Props) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }, style]}>
      <View style={[styles.ambient, { backgroundColor: theme.colors.primarySoft }]} />
      <View style={[styles.ambientAlt, { backgroundColor: theme.colors.accentSoft }]} />
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    overflow: 'hidden',
  },
  ambient: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.72,
  },
  ambientAlt: {
    position: 'absolute',
    bottom: -130,
    left: -110,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.48,
  },
  content: {
    flex: 1,
  },
});

