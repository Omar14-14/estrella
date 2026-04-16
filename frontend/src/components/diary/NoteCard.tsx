import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Layout } from '../../constants/layout';
import { Note } from '../../types';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function NoteCard({ note, onPress, onDelete }: Props) {
  const { theme } = useTheme();
  const preview = note.content.replace(/\n/g, ' ').slice(0, 100);

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar nota',
      'Seguro que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceGlass,
          borderColor: theme.colors.border,
        },
        theme.shadow.soft,
      ]}
    >
      <View pointerEvents="none" style={[styles.tint, { backgroundColor: theme.colors.primarySoft }]} />
      <View style={styles.top}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{note.title || 'Sin titulo'}</Text>
        <TouchableOpacity onPress={confirmDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.deleteText, { color: theme.colors.error }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      {preview.length > 0 && (
        <Text style={[styles.preview, { color: theme.colors.textMuted }]} numberOfLines={2}>{preview}</Text>
      )}

      <Text style={[styles.date, { color: theme.colors.textMuted }]}>{formatDate(note.updatedAt)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Layout.spacing.md,
    gap: 8,
    marginBottom: Layout.spacing.base,
    overflow: 'hidden',
  },
  tint: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 6,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    flex: 1,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '800',
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    fontWeight: '700',
  },
});
