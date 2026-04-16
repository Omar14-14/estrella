import { useState, useCallback, useMemo, useRef } from 'react';
import { generateGrid, matchWord, CellData } from '../utils/wordSearchGenerator';
import { WORDS } from '../constants/wordSearch';

const GRID_SIZE = 10;

export type SelectionState = 'idle' | 'selecting';

export function useWordSearch() {
  const { grid, placed } = useMemo(() => generateGrid([...WORDS], GRID_SIZE), []);

  const [selecting, setSelecting] = useState<SelectionState>('idle');
  const [selected, setSelected] = useState<CellData[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Map<string, string>>(new Map());
  const [flash, setFlash] = useState<Set<string>>(new Set());

  const selectionRef = useRef<CellData[]>([]);

  const cellKey = (r: number, c: number) => `${r}-${c}`;

  const startSelection = useCallback((cell: CellData) => {
    selectionRef.current = [cell];
    setSelected([cell]);
    setSelecting('selecting');
  }, []);

  const extendSelection = useCallback((cell: CellData) => {
    const cur = selectionRef.current;
    if (cur.length === 0) return;

    const first = cur[0];
    if (first.row === cell.row && first.col === cell.col) {
      setSelected([first]);
      return;
    }

    const rowDelta = cell.row - first.row;
    const colDelta = cell.col - first.col;
    const rowStep = Math.sign(rowDelta);
    const colStep = Math.sign(colDelta);
    const distance = Math.max(Math.abs(rowDelta), Math.abs(colDelta));
    const isStraight =
      rowDelta === 0 ||
      colDelta === 0 ||
      Math.abs(rowDelta) === Math.abs(colDelta);

    if (!isStraight) return;

    const next: CellData[] = [];
    for (let i = 0; i <= distance; i++) {
      const row = first.row + rowStep * i;
      const col = first.col + colStep * i;
      next.push({ letter: grid[row][col], row, col });
    }

    selectionRef.current = next;
    setSelected(next);
  }, [grid]);

  const endSelection = useCallback(() => {
    setSelecting('idle');
    const sel = selectionRef.current;
    const match = matchWord(sel, placed);

    if (match && found.has(match.word)) {
      selectionRef.current = [];
      setSelected([]);
      return match.route;
    }

    if (match) {
      setFound(prev => new Set([...prev, match.word]));
      const newFoundCells = new Map(foundCells);
      match.cells.forEach(c => newFoundCells.set(cellKey(c.row, c.col), match.route));
      setFoundCells(newFoundCells);

      const keys = new Set(match.cells.map(c => cellKey(c.row, c.col)));
      setFlash(keys);
      setTimeout(() => setFlash(new Set()), 600);

      selectionRef.current = [];
      setSelected([]);
      return match.route;
    }

    selectionRef.current = [];
    setSelected([]);
    return null;
  }, [placed, found, foundCells]);

  const isSelected = useCallback((r: number, c: number) =>
    selected.some(c2 => c2.row === r && c2.col === c), [selected]);

  const isFound = useCallback((r: number, c: number) =>
    foundCells.has(cellKey(r, c)), [foundCells]);

  const isFlashing = useCallback((r: number, c: number) =>
    flash.has(cellKey(r, c)), [flash]);

  const getFoundRoute = useCallback((r: number, c: number) =>
    foundCells.get(cellKey(r, c)) ?? null, [foundCells]);

  return {
    grid,
    placed,
    found,
    selecting,
    selected,
    startSelection,
    extendSelection,
    endSelection,
    isSelected,
    isFound,
    isFlashing,
    getFoundRoute,
    gridSize: GRID_SIZE,
    totalWords: WORDS.length,
  };
}
