import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { WORDS } from '../src/constants/wordSearch';
import { useWordSearch } from '../src/hooks/useWordSearch';
import { WordSearchGrid } from '../src/components/wordsearch/WordSearchGrid';

const ROUTE_COLORS: Record<string, string> = {
  '/diary': Colors.accent,
  '/game': Colors.primary,
  '/music': Colors.accentAlt,
  '/gallery': Colors.success,
};

const ROUTE_LABELS: Record<string, string> = {
  '/diary': 'DIARIO',
  '/game': 'JUEGO',
  '/music': 'MUSICA',
  '/gallery': 'GALERIA',
};

function WordPill({
  word,
  route,
  found,
  onPress,
}: {
  word: string;
  route: string;
  found: boolean;
  onPress: (route: string) => void;
}) {
  const color = ROUTE_COLORS[route];
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        found
          ? { backgroundColor: color + '18', borderColor: color }
          : { backgroundColor: Colors.surface, borderColor: Colors.border },
      ]}
      onPress={() => onPress(route)}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, { color: found ? color : Colors.textMuted }]}>
        {ROUTE_LABELS[route]}
      </Text>
    </TouchableOpacity>
  );
}

export default function WordSearchScreen() {
  const { width } = useWindowDimensions();
  const PADDING = Layout.spacing.lg * 2;
  const CELL_SIZE = Math.floor((width - PADDING) / 10);

  const {
    grid, found, gridSize,
    isSelected, isFound, isFlashing, getFoundRoute,
    startSelection, extendSelection, endSelection,
  } = useWordSearch();

  const [hint, setHint] = useState('Busca una palabra o toca un acceso');
  const hintOpacity = useSharedValue(1);
  const starScale = useSharedValue(1);

  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOpacity.value }));
  const starStyle = useAnimatedStyle(() => ({ transform: [{ scale: starScale.value }] }));

  const handleNavigate = useCallback((route: string) => {
    setHint(`Abrir ${ROUTE_LABELS[route]}`);
    starScale.value = withSequence(
      withSpring(1.4, { damping: 5 }),
      withSpring(1.0)
    );
    setTimeout(() => router.push(route as any), 700);
  }, []);

  const handleStart = useCallback((cell: any) => {
    hintOpacity.value = withTiming(0.4, { duration: 150 });
    startSelection(cell);
  }, [hintOpacity, startSelection]);

  const handleEnd = useCallback(() => {
    hintOpacity.value = withTiming(1, { duration: 200 });
    return endSelection();
  }, [hintOpacity, endSelection]);

  const handlePillPress = useCallback((route: string) => {
    router.push(route as any);
  }, []);

  const allFound = found.size === WORDS.length;

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(400)}>
          <Animated.Text style={[styles.star, starStyle]}>Estrella</Animated.Text>
          <Text style={styles.title}>
            {allFound ? 'Todo encontrado' : `${found.size} de ${WORDS.length}`}
          </Text>
        </Animated.View>

        <Animated.Text style={[styles.hint, hintStyle]}>
          {hint}
        </Animated.Text>

        <View style={styles.gridWrapper}>
          <WordSearchGrid
            grid={grid}
            gridSize={gridSize}
            cellSize={CELL_SIZE}
            isSelected={isSelected}
            isFound={isFound}
            isFlashing={isFlashing}
            getFoundRoute={getFoundRoute}
            onStart={handleStart}
            onExtend={extendSelection}
            onEnd={handleEnd}
            onNavigate={handleNavigate}
          />
        </View>

        <Animated.View style={styles.pills} entering={FadeInDown.delay(200).duration(400)}>
          {WORDS.map(({ word, route }) => (
            <WordPill
              key={word}
              word={word}
              route={route}
              found={found.has(word)}
              onPress={handlePillPress}
            />
          ))}
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  star: {
    fontSize: 30,
    color: Colors.text,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  hint: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  gridWrapper: {
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    elevation: 4,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.md,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
