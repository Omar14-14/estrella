import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { SoftButton } from './SoftButton';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  title: string;
  subtitle?: string;
  leftLabel?: string;
  rightLabel?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  rightLoading?: boolean;
  showThemeToggle?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  leftLabel = 'Volver',
  rightLabel,
  onLeftPress,
  onRightPress,
  rightLoading = false,
  showThemeToggle = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.surfaceGlass,
          borderColor: theme.colors.border,
        },
        theme.shadow.soft,
      ]}
    >
      <View style={styles.side}>
        {onLeftPress ? (
          <SoftButton label={leftLabel} variant="ghost" onPress={onLeftPress} style={styles.sideButton} />
        ) : showThemeToggle ? (
          <ThemeToggle />
        ) : null}
      </View>

      <View style={styles.center}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        {rightLabel && onRightPress ? (
          <SoftButton
            label={rightLabel}
            variant="primary"
            onPress={onRightPress}
            loading={rightLoading}
            style={styles.sideButton}
          />
        ) : showThemeToggle ? (
          <ThemeToggle />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: {
    width: 96,
    alignItems: 'flex-start',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  sideButton: {
    minHeight: 38,
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
});

