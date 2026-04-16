import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { PlayerState } from '../../hooks/useAudioPlayer';
import { MusicTrack } from '../../types';

interface Props {
  track: MusicTrack;
  state: PlayerState;
  position: number;
  duration: number;
  onToggle: () => void;
  onSeek: (ms: number) => void;
  onStop: () => void;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function MusicPlayer({ track, state, position, duration, onToggle, onSeek, onStop }: Props) {
  const progress = duration > 0 ? position / duration : 0;

  const handleSeekBar = useCallback((evt: any) => {
    if (duration === 0) return;
    const { locationX } = evt.nativeEvent;
    onSeek(Math.max(0, Math.min(locationX / 280, 1)) * duration);
  }, [duration, onSeek]);

  const isLoading = state === 'loading';
  const isPlaying = state === 'playing';

  return (
    <Animated.View style={styles.container} entering={FadeInUp.duration(350)}>
      <View style={styles.info}>
        <View style={[styles.albumMark, isPlaying && styles.albumMarkActive]} />
        <View style={styles.meta}>
          <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
        </View>
        <TouchableOpacity onPress={onStop} style={styles.closeBtn}>
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.seekRow}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <TouchableOpacity
          style={styles.seekTrack}
          onPress={handleSeekBar}
          activeOpacity={1}
        >
          <View style={styles.seekBase} />
          <View style={[styles.seekFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.seekThumb, { left: `${progress * 100}%` }]} />
        </TouchableOpacity>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      <TouchableOpacity
        onPress={onToggle}
        style={styles.playBtn}
        disabled={isLoading}
        activeOpacity={0.82}
      >
        <Text style={styles.playText}>
          {isLoading ? 'Cargando' : isPlaying ? 'Pausar' : 'Reproducir'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Layout.spacing.lg,
    gap: Layout.spacing.md,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  albumMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  albumMarkActive: {
    backgroundColor: Colors.primary + '18',
    borderColor: Colors.primary,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  trackArtist: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  seekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  time: {
    color: Colors.textMuted,
    fontSize: 11,
    width: 38,
    textAlign: 'center',
  },
  seekTrack: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
  },
  seekBase: {
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  seekFill: {
    position: 'absolute',
    height: 5,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  seekThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    top: 5,
    marginLeft: -7,
  },
  playBtn: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: 13,
    borderRadius: 22,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  playText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
