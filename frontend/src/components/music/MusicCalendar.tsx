import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Layout } from '../../constants/layout';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  datesWithTrack: Set<string>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function pad(n: number) { return String(n).padStart(2, '0'); }
function toKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export function MusicCalendar({ datesWithTrack, selectedDate, onSelectDate }: Props) {
  const { theme } = useTheme();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = useCallback(() => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }, [month]);

  const nextMonth = useCallback(() => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }, [month]);

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border },
        theme.shadow.soft,
      ]}
    >
      <View style={styles.nav}>
        <TouchableOpacity onPress={prevMonth} style={[styles.navBtn, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.navArrow, { color: theme.colors.primary }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: theme.colors.text }]}>{MONTHS[month]} {year}</Text>
        <TouchableOpacity onPress={nextMonth} style={[styles.navBtn, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.navArrow, { color: theme.colors.primary }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {DAYS.map(d => (
          <Text key={d} style={[styles.dayHeader, { color: theme.colors.textMuted }]}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e-${i}`} style={styles.cell} />;

          const key = toKey(year, month, day);
          const hasTrack = datesWithTrack.has(key);
          const isSelected = selectedDate === key;
          const isToday = (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
          );

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.cell,
                isToday && { borderColor: theme.colors.primary, borderWidth: StyleSheet.hairlineWidth },
                isSelected && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => hasTrack && onSelectDate(key)}
              activeOpacity={hasTrack ? 0.72 : 1}
            >
              <Text style={[
                styles.dayText,
                { color: hasTrack ? theme.colors.text : theme.colors.textMuted },
                isSelected && { color: theme.colors.textOnPrimary, fontWeight: '900' },
                isToday && !isSelected && { color: theme.colors.primary, fontWeight: '900' },
              ]}>
                {day}
              </Text>
              {hasTrack && (
                <View style={[styles.dot, { backgroundColor: isSelected ? theme.colors.textOnPrimary : theme.colors.accentAlt }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const CELL = 44;

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Layout.spacing.md,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayHeader: {
    width: CELL,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CELL / 2,
  },
  dayText: {
    fontSize: 14,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
