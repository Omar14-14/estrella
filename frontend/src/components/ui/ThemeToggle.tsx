import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleMode } = useTheme();
  const progress = useSharedValue(theme.isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(theme.isDark ? 1 : 0, { damping: 16, stiffness: 170 });
  }, [progress, theme.isDark]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, 28]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 18])}deg` },
      { scale: withTiming(theme.isDark ? 0.96 : 1, { duration: 180 }) },
    ],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0.2]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.74]) }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={toggleMode}
      style={[
        styles.track,
        {
          backgroundColor: theme.isDark ? theme.colors.surfaceElevated : theme.colors.primarySoft,
          borderColor: theme.colors.borderStrong,
        },
        theme.shadow.soft,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: theme.isDark }}
    >
      <Animated.View style={[styles.sparkle, sparkleStyle]}>
        <Text style={styles.sparkleText}>*</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.knob,
          {
            backgroundColor: theme.isDark ? theme.colors.lavender : theme.colors.surface,
            borderColor: theme.isDark ? theme.colors.accent : '#ffffff',
          },
          knobStyle,
        ]}
      >
        <Text style={[styles.icon, { color: theme.isDark ? theme.colors.background : theme.colors.primary }]}>
          {theme.isDark ? 'm' : 's'}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 66,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    justifyContent: 'center',
  },
  knob: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sparkle: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  sparkleText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
});

