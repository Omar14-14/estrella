import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '../src/hooks/useAuth';
import { Screen, SoftCard, ThemeToggle } from '../src/components/ui';
import { useTheme } from '../src/theme/ThemeProvider';
import { usePushNotifications } from '../src/hooks/usePushNotifications';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
const PIN_LENGTH = 4;

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const { login, loading, error } = useAuth();
  const { theme } = useTheme();
  const { register } = usePushNotifications();

  const handleKey = async (key: string) => {
    if (key === 'del') {
      setPin(p => p.slice(0, -1));
      return;
    }
    if (key === '') return;

    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      const ok = await login(next);
      if (ok) {
        void register();
        router.replace('/wordsearch');
      } else {
        Vibration.vibrate(300);
        setPin('');
      }
    }
  };

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.toggleWrap}>
        <ThemeToggle />
      </View>

      <Animated.View style={styles.header} entering={FadeInDown.duration(420)}>
        <View style={[styles.badge, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }]}>
          <Text style={[styles.badgeText, { color: theme.colors.primary }]}>privado</Text>
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>Estrella</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>un rinconcito solo para ti</Text>
      </Animated.View>

      <SoftCard style={styles.pinCard} elevated>
        <Animated.View style={styles.dots} entering={ZoomIn.delay(100).duration(380)}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  borderColor: theme.colors.borderStrong,
                  backgroundColor: theme.colors.surfaceAlt,
                },
                i < pin.length && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                  transform: [{ scale: 1.08 }],
                },
              ]}
            />
          ))}
        </Animated.View>

        <Text style={[styles.message, { color: error ? theme.colors.error : theme.colors.textMuted }]}>
          {error ? 'PIN incorrecto' : 'Ingresa el PIN para continuar'}
        </Text>
      </SoftCard>

      <Animated.View style={styles.keyboard} entering={FadeInUp.delay(120).duration(420)}>
        {KEYS.map((key, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.key,
              {
                backgroundColor: theme.colors.surfaceGlass,
                borderColor: theme.colors.border,
              },
              theme.shadow.soft,
              key === '' && styles.keyEmpty,
            ]}
            onPress={() => handleKey(key)}
            disabled={loading || key === ''}
            activeOpacity={0.72}
          >
            <Text style={[styles.keyText, { color: theme.colors.text }]}>
              {key === 'del' ? '<' : key}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 28,
  },
  toggleWrap: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 5,
  },
  header: {
    alignItems: 'center',
    gap: 7,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  pinCard: {
    width: '100%',
    maxWidth: 320,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  message: {
    fontSize: 13,
    fontWeight: '700',
    minHeight: 18,
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 246,
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: 66,
    height: 66,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  keyEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '800',
  },
});
