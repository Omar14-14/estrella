import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, Alert, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { useDiary } from '../src/hooks/useDiary';

export default function DiaryDetailScreen() {
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();
  const { notes, create, update } = useDiary();

  const isNew = !noteId;
  const existing = noteId ? notes.find(n => n.id === noteId) : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const contentRef = useRef<TextInput>(null);

  useEffect(() => {
    if (existing && !dirty) {
      setTitle(existing.title);
      setContent(existing.content);
    }
  }, [existing, dirty]);

  const handleTitleChange = (t: string) => { setTitle(t); setDirty(true); };
  const handleContentChange = (c: string) => { setContent(c); setDirty(true); };

  const handleSave = useCallback(async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Nota vacia', 'Escribe algo antes de guardar.');
      return;
    }

    setSaving(true);
    let ok = false;
    if (isNew) {
      const note = await create(title.trim() || 'Sin titulo', content.trim());
      ok = !!note;
    } else if (noteId) {
      ok = await update(noteId, title.trim() || 'Sin titulo', content.trim());
    }
    setSaving(false);
    if (ok) router.back();
  }, [title, content, isNew, noteId, create, update]);

  const handleBack = useCallback(() => {
    if (dirty) {
      Alert.alert(
        'Cambios sin guardar',
        'Quieres salir sin guardar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  }, [dirty]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
            <Text style={styles.headerAction}>Volver</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{isNew ? 'Nueva nota' : 'Editar nota'}</Text>

          <TouchableOpacity onPress={handleSave} style={styles.headerBtn} disabled={saving}>
            {saving
              ? <ActivityIndicator size="small" color={Colors.primary} />
              : <Text style={[styles.headerAction, styles.primaryAction]}>Guardar</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.editor}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Titulo"
            placeholderTextColor={Colors.textMuted}
            returnKeyType="next"
            onSubmitEditing={() => contentRef.current?.focus()}
            blurOnSubmit={false}
            maxLength={100}
          />

          <Text style={styles.dateLabel}>
            {existing
              ? `Editado ${new Date(existing.updatedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`
              : `Hoy, ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`
            }
          </Text>

          <TextInput
            ref={contentRef}
            style={styles.contentInput}
            value={content}
            onChangeText={handleContentChange}
            placeholder="Escribe aqui..."
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
            autoFocus={isNew}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.surface + 'ee',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    minWidth: 76,
  },
  headerAction: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  primaryAction: {
    color: Colors.primary,
    textAlign: 'right',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  editor: {
    flex: 1,
    margin: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  titleInput: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: Layout.spacing.sm,
  },
  dateLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: Layout.spacing.md,
  },
  contentInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
