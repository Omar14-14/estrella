import React, { useState, useCallback } from 'react';
import {
  View, Text,
  StyleSheet, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Layout } from '../src/constants/layout';
import { getTrackByDate, getDatesWithTrack } from '../src/constants/music';
import { useAudioPlayer } from '../src/hooks/useAudioPlayer';
import { MusicCalendar } from '../src/components/music/MusicCalendar';
import { MusicPlayer } from '../src/components/music/MusicPlayer';
import { AppHeader, Screen, SoftCard } from '../src/components/ui';
import { useTheme } from '../src/theme/ThemeProvider';

const datesWithTrack = getDatesWithTrack();

export default function MusicScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { track, state, position, duration, load, togglePlay, seek, stop } = useAudioPlayer();
  const { theme } = useTheme();

  const handleSelectDate = useCallback((date: string) => {
    const t = getTrackByDate(date);
    if (!t) return;
    setSelectedDate(date);
    load(t);
  }, [load]);

  const handleStop = useCallback(() => {
    stop();
    setSelectedDate(null);
  }, [stop]);

  return (
    <Screen>
      <AppHeader
        title="Musica"
        subtitle={track ? 'reproduciendo' : 'calendario'}
        onLeftPress={() => { handleStop(); router.back(); }}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(350)}>
          <SoftCard style={styles.intro}>
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>Calendario</Text>
            <Text style={[styles.introText, { color: theme.colors.textMuted }]}>
              Selecciona un dia marcado para reproducir una pista.
            </Text>
          </SoftCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(350)}>
          <MusicCalendar
            datesWithTrack={datesWithTrack}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </Animated.View>

        <Animated.View style={styles.legend} entering={FadeInDown.delay(150).duration(350)}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.accentAlt }]} />
          <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Dia con pista</Text>
        </Animated.View>

        {track && (
          <Animated.View entering={FadeInDown.duration(350)}>
            <MusicPlayer
              track={track}
              state={state}
              position={position}
              duration={duration}
              onToggle={togglePlay}
              onSeek={seek}
              onStop={handleStop}
            />
          </Animated.View>
        )}

        {datesWithTrack.size === 0 && (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No hay pistas configuradas</Text>
            <Text style={[styles.emptyHint, { color: theme.colors.textMuted }]}>Agrega tracks en src/constants/music.ts</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Layout.spacing.lg,
    gap: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  intro: {
    gap: Layout.spacing.xs,
    padding: Layout.spacing.lg,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingTop: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
