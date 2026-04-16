import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Layout } from '../../constants/layout';
import { PlayerState } from '../../hooks/useAudioPlayer';
import { MusicTrack } from '../../types';
import { useTheme } from '../../theme/ThemeProvider';

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
  const { theme } = useTheme();
  const progress = duration > 0 ? position / duration : 0;

  const handleSeekBar = useCallback((evt: any) => {
    if (duration === 0) return;
    const { locationX } = evt.nativeEvent;
    onSeek(Math.max(0, Math.min(locationX / 280, 1)) * duration);
  }, [duration, onSeek]);

  const isLoading = state === 'loading';
  const isPlaying = state === 'playing';

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border },
        theme.shadow.floating,
      ]}
      entering={FadeInUp.duration(350)}
    >
      <View style={styles.info}>
        <View
          style={[
            styles.albumMark,
            {
              backgroundColor: isPlaying ? theme.colors.primarySoft : theme.colors.surfaceAlt,
              borderColor: isPlaying ? theme.colors.primary : theme.colors.border,
            },
          ]}
        >
          <View style={[styles.albumDot, { backgroundColor: theme.colors.primary }]} />
        </View>
        <View style={styles.meta}>
          <Text style={[styles.trackTitle, { color: theme.colors.text }]} numberOfLines={1}>{track.title}</Text>
          <Text style={[styles.trackArtist, { color: theme.colors.textMuted }]} numberOfLines={1}>{track.artist}</Text>
        </View>
        <TouchableOpacity onPress={onStop} style={styles.closeBtn}>
          <Text style={[styles.closeText, { color: theme.colors.textMuted }]}>Cerrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.seekRow}>
        <Text style={[styles.time, { color: theme.colors.textMuted }]}>{formatTime(position)}</Text>
        <TouchableOpacity
          style={styles.seekTrack}
          onPress={handleSeekBar}
          activeOpacity={1}
        >
          <View style={[styles.seekBase, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.seekFill, { width: `${progress * 100}%`, backgroundColor: theme.colors.primary }]} />
          <View style={[styles.seekThumb, { left: `${progress * 100}%`, backgroundColor: theme.colors.primary }]} />
        </TouchableOpacity>
        <Text style={[styles.time, { color: theme.colors.textMuted }]}>{formatTime(duration)}</Text>
      </View>

      <TouchableOpacity
        onPress={onToggle}
        style={[styles.playBtn, { backgroundColor: theme.colors.primary }, theme.shadow.glow]}
        disabled={isLoading}
        activeOpacity={0.82}
      >
        <Text style={[styles.playText, { color: theme.colors.textOnPrimary }]}>
          {isLoading ? 'Cargando' : isPlaying ? 'Pausar' : 'Reproducir'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Layout.spacing.lg,
    gap: Layout.spacing.md,
    overflow: 'hidden',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  albumMark: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  trackArtist: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  seekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  time: {
    fontSize: 11,
    width: 38,
    textAlign: 'center',
    fontWeight: '700',
  },
  seekTrack: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
  },
  seekBase: {
    height: 6,
    borderRadius: 3,
  },
  seekFill: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
  },
  seekThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: 4,
    marginLeft: -8,
  },
  playBtn: {
    alignSelf: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: 13,
    borderRadius: 22,
  },
  playText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
