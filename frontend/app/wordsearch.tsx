import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
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
import { Layout } from '../src/constants/layout';
import { WORDS } from '../src/constants/wordSearch';
import { useWordSearch } from '../src/hooks/useWordSearch';
import { WordSearchGrid } from '../src/components/wordsearch/WordSearchGrid';
import { Screen, SoftCard, ThemeToggle } from '../src/components/ui';
import { useTheme } from '../src/theme/ThemeProvider';
import { usePushNotifications } from '../src/hooks/usePushNotifications';

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
  const { theme } = useTheme();
  const routeColors: Record<string, string> = {
    '/diary': theme.colors.accent,
    '/game': theme.colors.primary,
    '/music': theme.colors.accentAlt,
    '/gallery': theme.colors.success,
  };
  const color = routeColors[route];
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        found
          ? { backgroundColor: color + '18', borderColor: color }
          : { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border },
        theme.shadow.soft,
      ]}
      onPress={() => onPress(route)}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, { color: found ? color : theme.colors.textMuted }]}>
        {ROUTE_LABELS[route]}
      </Text>
    </TouchableOpacity>
  );
}

export default function WordSearchScreen() {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const { register } = usePushNotifications();
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

  useEffect(() => {
    void register();
  }, [register]);

  return (
    <Screen>
      <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
        <View style={styles.toggleWrap}>
          <ThemeToggle />
        </View>
        <Animated.View style={styles.header} entering={FadeInDown.duration(400)}>
          <Animated.Text style={[styles.star, { color: theme.colors.text }, starStyle]}>
            Estrella
          </Animated.Text>
          <Text style={[styles.title, { color: theme.colors.textMuted }]}>
            {allFound ? 'Todo encontrado' : `${found.size} de ${WORDS.length}`}
          </Text>
        </Animated.View>

        <Animated.Text style={[styles.hint, { color: theme.colors.textMuted }, hintStyle]}>
          {hint}
        </Animated.Text>

        <SoftCard style={styles.gridWrapper} elevated>
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
        </SoftCard>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  toggleWrap: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 5,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  star: {
    fontSize: 30,
    fontWeight: '900',
  },
  title: {
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  hint: {
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: '700',
  },
  gridWrapper: {
    borderRadius: Layout.borderRadius.lg,
    padding: 6,
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
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
