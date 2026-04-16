import React, { useCallback } from 'react';
import {
  View, Text, FlatList,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Layout } from '../src/constants/layout';
import { useDiary } from '../src/hooks/useDiary';
import { NoteCard } from '../src/components/diary/NoteCard';
import { Note } from '../src/types';
import { AppHeader, Screen, SoftButton } from '../src/components/ui';
import { useTheme } from '../src/theme/ThemeProvider';

export default function DiaryScreen() {
  const { notes, loading, error, remove, reload } = useDiary();
  const { theme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const handleNew = useCallback(() => {
    router.push('/diary-detail' as any);
  }, []);

  const handleOpen = useCallback((note: Note) => {
    router.push({ pathname: '/diary-detail' as any, params: { noteId: note.id } });
  }, []);

  const renderItem = useCallback(({ item, index }: { item: Note; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(300)}>
      <NoteCard
        note={item}
        onPress={() => handleOpen(item)}
        onDelete={() => remove(item.id)}
      />
    </Animated.View>
  ), [handleOpen, remove]);

  return (
    <Screen>
      <AppHeader
        title="Diario"
        subtitle={`${notes.length} notas`}
        onLeftPress={() => router.back()}
        rightLabel="Nueva"
        onRightPress={handleNew}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <SoftButton label="Reintentar" onPress={reload} />
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>Aun no hay notas</Text>
          <Text style={[styles.emptyHint, { color: theme.colors.textMuted }]}>Crea una nota para empezar.</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={n => n.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
