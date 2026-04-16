import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { getTrackByDate, getDatesWithTrack } from '../src/constants/music';
import { useAudioPlayer } from '../src/hooks/useAudioPlayer';
import { MusicCalendar } from '../src/components/music/MusicCalendar';
import { MusicPlayer } from '../src/components/music/MusicPlayer';

const datesWithTrack = getDatesWithTrack();

export default function MusicScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { track, state, position, duration, load, togglePlay, seek, stop } = useAudioPlayer();

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { handleStop(); router.back(); }} style={styles.headerBtn}>
          <Text style={styles.headerAction}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Musica</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={styles.intro} entering={FadeIn.duration(350)}>
          <Text style={styles.introTitle}>Calendario</Text>
          <Text style={styles.introText}>Selecciona un dia marcado para reproducir una pista.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(350)}>
          <MusicCalendar
            datesWithTrack={datesWithTrack}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </Animated.View>

        <Animated.View style={styles.legend} entering={FadeInDown.delay(150).duration(350)}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Dia con pista</Text>
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
            <Text style={styles.emptyText}>No hay pistas configuradas</Text>
            <Text style={styles.emptyHint}>Agrega tracks en src/constants/music.ts</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.surface + 'ee',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    minWidth: 76,
  },
  headerAction: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  scroll: {
    padding: Layout.spacing.lg,
    gap: Layout.spacing.lg,
  },
  intro: {
    gap: Layout.spacing.xs,
  },
  introTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  introText: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
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
    backgroundColor: Colors.accentAlt,
  },
  legendText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingTop: Layout.spacing.xl,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  emptyHint: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
