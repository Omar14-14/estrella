// Palabras que aparecen en la sopa de letras y sus módulos destino
export const WORDS = [
  { word: 'DIARIO',  route: '/diary'   },
  { word: 'JUEGO',   route: '/game'    },
  { word: 'MUSICA',  route: '/music'   },
  { word: 'GALERIA', route: '/gallery' },
] as const;

export type ModuleWord = typeof WORDS[number];
