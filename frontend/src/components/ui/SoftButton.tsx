import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function SoftButton({
  label,
  onPress,
  variant = 'secondary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: Props) {
  const { theme } = useTheme();
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';
  const bg = isPrimary
    ? theme.colors.primary
    : isDanger
      ? theme.colors.error + '1f'
      : isGhost
        ? 'transparent'
        : theme.colors.surfaceAlt;
  const color = isPrimary
    ? theme.colors.textOnPrimary
    : isDanger
      ? theme.colors.error
      : theme.colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor: isGhost ? 'transparent' : theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        isPrimary ? theme.shadow.glow : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text style={[styles.label, { color }, textStyle]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    borderRadius: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
  },
});

