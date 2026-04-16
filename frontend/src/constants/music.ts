import { MusicTrack } from '../types';

// Tracks remotos temporales para probar el reproductor sin archivos locales.
// Cambia cada uri por tu musica cuando ya tengas los links finales.
export const TRACKS: MusicTrack[] = [
  {
    id: '1',
    title: 'Prueba aleatoria 1',
    artist: 'SoundHelix',
    file: { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    date: '2026-04-16',
  },
  {
    id: '2',
    title: 'Prueba aleatoria 2',
    artist: 'SoundHelix',
    file: { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    date: '2026-04-17',
  },
  {
    id: '3',
    title: 'Prueba aleatoria 3',
    artist: 'SoundHelix',
    file: { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    date: '2026-04-20',
  },
];

// Helper: dado YYYY-MM-DD, retorna el track o null
export function getTrackByDate(date: string): MusicTrack | null {
  return TRACKS.find(t => t.date === date) ?? null;
}

// Helper: set de fechas que tienen track
export function getDatesWithTrack(): Set<string> {
  return new Set(TRACKS.map(t => t.date ?? '').filter(Boolean));
}
