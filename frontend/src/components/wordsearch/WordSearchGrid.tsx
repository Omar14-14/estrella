import React, { useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { CellData } from '../../utils/wordSearchGenerator';

interface Props {
  grid: string[][];
  gridSize: number;
  cellSize: number;
  isSelected: (r: number, c: number) => boolean;
  isFound: (r: number, c: number) => boolean;
  isFlashing: (r: number, c: number) => boolean;
  getFoundRoute: (r: number, c: number) => string | null;
  onStart: (cell: CellData) => void;
  onExtend: (cell: CellData) => void;
  onEnd: () => string | null;
  onNavigate: (route: string) => void;
}

// Colores por ruta
const ROUTE_COLORS: Record<string, string> = {
  '/diary': Colors.accent,
  '/game': Colors.primary,
  '/music': Colors.accentAlt,
  '/gallery': Colors.success,
};

export function WordSearchGrid({
  grid, gridSize, cellSize,
  isSelected, isFound, isFlashing, getFoundRoute,
  onStart, onExtend, onEnd, onNavigate,
}: Props) {
  const containerRef = useRef<View>(null);
  const offsetRef    = useRef({ x: 0, y: 0 });

  const getCellFromTouch = useCallback((px: number, py: number): CellData | null => {
    const col = Math.floor((px - offsetRef.current.x) / cellSize);
    const row = Math.floor((py - offsetRef.current.y) / cellSize);
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null;
    return { letter: grid[row][col], row, col };
  }, [cellSize, gridSize, grid]);

  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const cell = getCellFromTouch(e.nativeEvent.pageX, e.nativeEvent.pageY);
        if (cell) onStart(cell);
      },
      onPanResponderMove: (e) => {
        const cell = getCellFromTouch(e.nativeEvent.pageX, e.nativeEvent.pageY);
        if (cell) onExtend(cell);
      },
      onPanResponderRelease: () => {
        const route = onEnd();
        if (route) setTimeout(() => onNavigate(route), 400);
      },
      onPanResponderTerminate: () => { onEnd(); },
    }),
    [getCellFromTouch, onStart, onExtend, onEnd, onNavigate]
  );

  const measureOffset = useCallback((e: LayoutChangeEvent) => {
    containerRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
      offsetRef.current = { x: pageX, y: pageY };
    });
    void e; // suppress lint
  }, []);

  return (
    <View
      ref={containerRef}
      onLayout={measureOffset}
      {...panResponder.panHandlers}
      style={[styles.grid, styles.webGrid, { width: cellSize * gridSize, height: cellSize * gridSize }]}
    >
      {grid.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((letter, c) => {
            const selected  = isSelected(r, c);
            const found     = isFound(r, c);
            const flashing  = isFlashing(r, c);
            const route     = getFoundRoute(r, c);
            const color     = route ? ROUTE_COLORS[route] : Colors.primary;

            return (
              <View
                key={c}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  selected  && styles.cellSelected,
                  found     && { backgroundColor: color + '22', borderColor: color + '55' },
                  flashing  && { backgroundColor: color + '55' },
                ]}
              >
                <Text
                  style={[
                    styles.letter,
                    { fontSize: cellSize * 0.38 },
                    selected && { color: Colors.primary, fontWeight: '700' },
                    found    && { color: color, fontWeight: '700' },
                  ]}
                >
                  {letter}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  webGrid: {
    userSelect: 'none',
    touchAction: 'none',
  } as any,
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  cellSelected: {
    backgroundColor: Colors.primary + '18',
    borderColor: Colors.primary,
  },
  letter: {
    color: Colors.text,
    fontFamily: 'monospace',
  },
});
