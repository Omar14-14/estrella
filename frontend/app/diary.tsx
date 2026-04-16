import React, { useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { useDiary } from '../src/hooks/useDiary';
import { NoteCard } from '../src/components/diary/NoteCard';
import { Note } from '../src/types';

export default function DiaryScreen() {
  const { notes, loading, error, remove, reload } = useDiary();

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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.headerAction}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Diario</Text>
        <TouchableOpacity onPress={handleNew} style={styles.headerBtn}>
          <Text style={[styles.headerAction, styles.primaryAction]}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={reload} style={styles.retryBtn}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Aun no hay notas</Text>
          <Text style={styles.emptyHint}>Crea una nota para empezar.</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  list: {
    padding: Layout.spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyHint: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  retryBtn: {
    marginTop: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  retryText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
