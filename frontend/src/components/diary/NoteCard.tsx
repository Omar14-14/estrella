import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { Note } from '../../types';

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
    <TouchableOpacity onPress={onPress} activeOpacity={0.78} style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={1}>{note.title || 'Sin titulo'}</Text>
        <TouchableOpacity onPress={confirmDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      {preview.length > 0 && (
        <Text style={styles.preview} numberOfLines={2}>{preview}</Text>
      )}

      <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Layout.spacing.md,
    gap: 8,
    marginBottom: Layout.spacing.sm,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  deleteText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  preview: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
