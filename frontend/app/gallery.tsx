import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet, SafeAreaView,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../src/constants/colors';
import { Layout } from '../src/constants/layout';
import { useGallery } from '../src/hooks/useGallery';
import { ImageViewer } from '../src/components/gallery/ImageViewer';
import { UploadProgress } from '../src/components/gallery/UploadProgress';
import { GalleryImage } from '../src/types';

const { width } = Dimensions.get('window');
const NUM_COLS = 3;
const CELL_GAP = 6;
const CELL_SIZE = (width - CELL_GAP * (NUM_COLS + 1)) / NUM_COLS;

export default function GalleryScreen() {
  const { images, loading, uploading, progress, error, upload, remove } = useGallery();
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const handleUpload = useCallback(async () => {
    await upload();
  }, [upload]);

  const renderItem = useCallback(({ item, index }: { item: GalleryImage; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 35).duration(280)}>
      <TouchableOpacity
        onPress={() => setSelected(item)}
        activeOpacity={0.88}
        style={styles.cell}
      >
        <Image source={{ uri: item.url }} style={styles.thumb} resizeMode="cover" />
      </TouchableOpacity>
    </Animated.View>
  ), []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.headerAction}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Galeria</Text>
        <TouchableOpacity
          onPress={handleUpload}
          style={styles.headerBtn}
          disabled={uploading}
        >
          <Text style={[styles.headerAction, styles.primaryAction]}>Anadir</Text>
        </TouchableOpacity>
      </View>

      {uploading && <UploadProgress progress={progress} />}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : images.length === 0 ? (
        <Animated.View style={styles.center} entering={FadeIn.duration(350)}>
          <Text style={styles.emptyText}>La galeria esta vacia</Text>
          <Text style={styles.emptyHint}>Agrega una foto para verla aqui.</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          numColumns={NUM_COLS}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ImageViewer
        image={selected}
        onClose={() => setSelected(null)}
        onDelete={(img) => { remove(img); setSelected(null); }}
      />
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
  errorBanner: {
    backgroundColor: Colors.error + '14',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.error + '30',
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
  },
  grid: {
    padding: CELL_GAP,
  },
  row: {
    gap: CELL_GAP,
    marginBottom: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 2,
  },
  thumb: {
    width: '100%',
    height: '100%',
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
});
