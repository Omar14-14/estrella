import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
const PIN_LENGTH = 4;

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const { login, loading, error } = useAuth();

  const handleKey = async (key: string) => {
    if (key === '⌫') {
      setPin(p => p.slice(0, -1));
      return;
    }
    if (key === '') return;

    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      const ok = await login(next);
      if (ok) {
        router.replace('/wordsearch');
      } else {
        Vibration.vibrate(300);
        setPin('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estrella</Text>
        <Text style={styles.subtitle}>Acceso privado</Text>
      </View>

      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
        ))}
      </View>

      <Text style={[styles.message, !!error && styles.error]}>
        {error ? 'PIN incorrecto' : 'Ingresa el PIN para continuar'}
      </Text>

      <View style={styles.keyboard}>
        {KEYS.map((key, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.key, key === '' && styles.keyEmpty]}
            onPress={() => handleKey(key)}
            disabled={loading || key === ''}
            activeOpacity={0.72}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.xl,
    gap: Layout.spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  title: {
    color: Colors.text,
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
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
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  dotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  message: {
    color: Colors.textMuted,
    fontSize: 13,
    minHeight: 18,
  },
  error: {
    color: Colors.error,
    fontWeight: '600',
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
    borderRadius: 33,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  keyEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '500',
  },
});
