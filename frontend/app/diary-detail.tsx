import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput,
  StyleSheet, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Layout } from '../src/constants/layout';
import { useDiary } from '../src/hooks/useDiary';
import { AppHeader, Screen, SoftCard } from '../src/components/ui';
import { useTheme } from '../src/theme/ThemeProvider';

export default function DiaryDetailScreen() {
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();
  const { notes, create, update } = useDiary();
  const { theme } = useTheme();

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
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppHeader
          title={isNew ? 'Nueva nota' : 'Editar nota'}
          subtitle={dirty ? 'sin guardar' : 'diario'}
          onLeftPress={handleBack}
          rightLabel="Guardar"
          onRightPress={handleSave}
          rightLoading={saving}
        />

        <Animated.View style={styles.editorWrap} entering={FadeInUp.duration(360)}>
          <SoftCard style={styles.editor} elevated>
            <TextInput
              style={[styles.titleInput, { color: theme.colors.text }]}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="Titulo"
              placeholderTextColor={theme.colors.textMuted}
              returnKeyType="next"
              onSubmitEditing={() => contentRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={100}
            />

            <Text style={[styles.dateLabel, { color: theme.colors.primary }]}>
              {existing
                ? `Editado ${new Date(existing.updatedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`
                : `Hoy, ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`
              }
            </Text>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <TextInput
              ref={contentRef}
              style={[styles.contentInput, { color: theme.colors.text }]}
              value={content}
              onChangeText={handleContentChange}
              placeholder="Escribe aqui..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              textAlignVertical="top"
              autoFocus={isNew}
            />
          </SoftCard>
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  editorWrap: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  editor: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  titleInput: {
    fontSize: 25,
    fontWeight: '900',
    paddingVertical: Layout.spacing.sm,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: Layout.spacing.md,
    fontWeight: '800',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: Layout.spacing.md,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
