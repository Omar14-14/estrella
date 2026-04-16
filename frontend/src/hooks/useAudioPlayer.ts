import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { MusicTrack } from '../types';

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function useAudioPlayer() {
  const soundRef              = useRef<Audio.Sound | null>(null);
  const [track, setTrack]     = useState<MusicTrack | null>(null);
  const [state, setState]     = useState<PlayerState>('idle');
  const [position, setPos]    = useState(0);   // ms
  const [duration, setDur]    = useState(0);   // ms

  // Configurar modo de audio al montar
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    return () => { unload(); };
  }, []);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setState('idle');
    setPos(0);
    setDur(0);
  }, []);

  const onPlaybackUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setPos(status.positionMillis ?? 0);
    setDur(status.durationMillis ?? 0);
    if (status.didJustFinish) {
      setState('paused');
      setPos(0);
    }
  }, []);

  const load = useCallback(async (t: MusicTrack) => {
    await unload();
    setTrack(t);
    setState('loading');
    try {
      const { sound } = await Audio.Sound.createAsync(
        t.file,
        { shouldPlay: true },
        onPlaybackUpdate
      );
      soundRef.current = sound;
      setState('playing');
    } catch {
      setState('error');
    }
  }, [unload, onPlaybackUpdate]);

  const togglePlay = useCallback(async () => {
    if (!soundRef.current) return;
    if (state === 'playing') {
      await soundRef.current.pauseAsync();
      setState('paused');
    } else if (state === 'paused') {
      await soundRef.current.playAsync();
      setState('playing');
    }
  }, [state]);

  const seek = useCallback(async (ms: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(ms);
    setPos(ms);
  }, []);

  const stop = useCallback(async () => {
    await unload();
    setTrack(null);
  }, [unload]);

  return { track, state, position, duration, load, togglePlay, seek, stop };
}
