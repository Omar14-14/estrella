// Tipos
export type Direction = [number, number]; // [rowDelta, colDelta]
export type CellData = { letter: string; row: number; col: number };
export type PlacedWord = {
  word: string;
  route: string;
  cells: CellData[];
};

const DIRECTIONS: Direction[] = [
  [0, 1],   // →
  [0, -1],  // ←
  [1, 0],   // ↓
  [-1, 0],  // ↑
  [1, 1],   // ↘
  [1, -1],  // ↙
  [-1, 1],  // ↗
  [-1, -1], // ↖
];

const ALPHABET = 'ABCDEFGHIJKLMNOPRSTUVWXYZ';

function randomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

function canPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  [dr, dc]: Direction,
  size: number
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  [dr, dc]: Direction
): CellData[] {
  const cells: CellData[] = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    grid[r][c] = word[i];
    cells.push({ letter: word[i], row: r, col: c });
  }
  return cells;
}

export function generateGrid(
  words: { word: string; route: string }[],
  size: number = 10
): { grid: string[][]; placed: PlacedWord[] } {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
  const placed: PlacedWord[] = [];

  for (const { word, route } of words) {
    let success = false;
    // Intentar hasta 200 veces por palabra
    for (let attempt = 0; attempt < 200 && !success; attempt++) {
      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (canPlace(grid, word, row, col, dir, size)) {
        const cells = placeWord(grid, word, row, col, dir);
        placed.push({ word, route, cells });
        success = true;
      }
    }
  }

  // Rellenar celdas vacías con letras aleatorias
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') grid[r][c] = randomLetter();
    }
  }

  return { grid, placed };
}

// Dado un path de celdas seleccionadas, verificar si coincide con una palabra colocada
export function matchWord(
  selected: CellData[],
  placed: PlacedWord[]
): PlacedWord | null {
  if (selected.length < 2) return null;
  for (const p of placed) {
    if (p.cells.length !== selected.length) continue;
    const fwd = p.cells.every((c, i) => c.row === selected[i].row && c.col === selected[i].col);
    const bwd = p.cells.every((c, i) => c.row === selected[selected.length - 1 - i].row && c.col === selected[selected.length - 1 - i].col);
    if (fwd || bwd) return p;
  }
  return null;
}
