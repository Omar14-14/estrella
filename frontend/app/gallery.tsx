import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet,
  ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Layout } from '../src/constants/layout';
import { useGallery } from '../src/hooks/useGallery';
import { ImageViewer } from '../src/components/gallery/ImageViewer';
import { UploadProgress } from '../src/components/gallery/UploadProgress';
import { GalleryImage } from '../src/types';
import { AppHeader, Screen, SoftButton } from '../src/components/ui';
import { useTheme } from '../src/theme/ThemeProvider';

type GalleryLayout = 'mosaic' | 'grid' | 'mini';

const LAYOUT_OPTIONS: { id: GalleryLayout; label: string; hint: string; columns: number }[] = [
  { id: 'mosaic', label: 'Mosaico', hint: 'suave', columns: 2 },
  { id: 'grid', label: 'Cuadricula', hint: 'orden', columns: 3 },
  { id: 'mini', label: 'Mini', hint: 'compacto', columns: 4 },
];

function getTileHeight(layout: GalleryLayout, size: number, index: number) {
  if (layout === 'grid' || layout === 'mini') return size;
  return index % 5 === 0 || index % 5 === 3 ? size * 1.32 : size * 0.98;
}

export default function GalleryScreen() {
  const { images, loading, uploading, progress, error, upload, remove } = useGallery();
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [layout, setLayout] = useState<GalleryLayout>('mosaic');
  const [controlsMinimized, setControlsMinimized] = useState(true);
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const useCompactControls = width < 390;

  const activeLayout = LAYOUT_OPTIONS.find(option => option.id === layout) ?? LAYOUT_OPTIONS[0];
  const gap = layout === 'mini' ? 6 : 10;
  const horizontalPadding = layout === 'mini' ? 12 : 16;
  const tileSize = useMemo(() => {
    const available = width - horizontalPadding * 2 - gap * (activeLayout.columns - 1);
    return Math.floor(available / activeLayout.columns);
  }, [activeLayout.columns, gap, horizontalPadding, width]);

  const handleUpload = useCallback(async () => {
    await upload();
  }, [upload]);

  const renderControls = () => {
    if (controlsMinimized) {
      return (
        <Animated.View entering={FadeInDown.duration(250)} style={styles.miniControlsWrap}>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => setControlsMinimized(false)}
            style={[
              styles.miniControls,
              { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border },
              theme.shadow.soft,
            ]}
          >
            <Text
              style={[styles.miniControlsText, { color: theme.colors.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
            >
              Vista {activeLayout.label}
            </Text>
            <Text style={[styles.miniControlsAction, { color: theme.colors.primary }]}>Cambiar</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        entering={FadeInDown.duration(280)}
        style={[
          styles.controlsCard,
          { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border },
          theme.shadow.soft,
        ]}
      >
        <View style={[styles.controlsTop, useCompactControls && styles.controlsTopCompact]}>
          <View style={styles.controlsCopy}>
            <Text
              style={[styles.controlsTitle, { color: theme.colors.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
            >
              Acomodo
            </Text>
            <Text
              style={[styles.controlsHint, { color: theme.colors.textMuted }]}
              numberOfLines={useCompactControls ? 2 : 1}
            >
              Cambia como se acomodan tus recuerdos
            </Text>
          </View>
          <SoftButton
            label="Minimizar"
            variant="ghost"
            onPress={() => setControlsMinimized(true)}
            style={[styles.minimizeButton, useCompactControls && styles.minimizeButtonCompact]}
            textStyle={{ color: theme.colors.primary }}
          />
        </View>

        <View
          style={[
            styles.segment,
            useCompactControls && styles.segmentCompact,
            { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
          ]}
        >
          {LAYOUT_OPTIONS.map(option => {
            const selectedOption = option.id === layout;
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.8}
                onPress={() => setLayout(option.id)}
                style={[
                  styles.segmentItem,
                  selectedOption && {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.borderStrong,
                  },
                  selectedOption && theme.shadow.soft,
                  useCompactControls && styles.segmentItemCompact,
                ]}
              >
                <Text
                  style={[styles.segmentLabel, { color: selectedOption ? theme.colors.primary : theme.colors.textMuted }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {option.label}
                </Text>
                <Text
                  style={[styles.segmentHint, { color: selectedOption ? theme.colors.text : theme.colors.textMuted }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {option.hint}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const renderItem = useCallback(({ item, index }: { item: GalleryImage; index: number }) => {
    const height = getTileHeight(layout, tileSize, index);
    const isMini = layout === 'mini';

    return (
      <Animated.View entering={FadeInUp.delay(Math.min(index, 10) * 28).duration(260)}>
        <TouchableOpacity
          onPress={() => setSelected(item)}
          activeOpacity={0.88}
          style={[
            styles.cell,
            {
              width: tileSize,
              height,
              borderRadius: isMini ? Layout.borderRadius.sm : Layout.borderRadius.md,
              backgroundColor: theme.colors.surfaceGlass,
              borderColor: theme.colors.border,
            },
            isMini ? null : theme.shadow.soft,
          ]}
        >
          <Image source={{ uri: item.url }} style={styles.thumb} resizeMode="cover" />
          {layout === 'mosaic' && (
            <View style={[styles.tileGloss, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.20)' }]} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }, [layout, theme, tileSize]);

  return (
    <Screen>
      <AppHeader
        title="Galeria"
        subtitle={`${images.length} recuerdos`}
        onLeftPress={() => router.back()}
        rightLabel="Anadir"
        onRightPress={handleUpload}
        rightLoading={uploading}
      />

      {uploading && <UploadProgress progress={progress} />}

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '18', borderBottomColor: theme.colors.error + '35' }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : images.length === 0 ? (
        <Animated.View style={styles.center} entering={FadeIn.duration(350)}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>La galeria esta vacia</Text>
          <Text style={[styles.emptyHint, { color: theme.colors.textMuted }]}>Agrega una foto para verla aqui.</Text>
        </Animated.View>
      ) : (
        <FlatList
          key={layout}
          data={images}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          numColumns={activeLayout.columns}
          ListHeaderComponent={renderControls}
          contentContainerStyle={[
            styles.grid,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: controlsMinimized ? Layout.spacing.xxl : Layout.spacing.xxl + Layout.spacing.md,
            },
          ]}
          columnWrapperStyle={{ gap, marginBottom: gap, alignItems: 'flex-start' }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ImageViewer
        image={selected}
        onClose={() => setSelected(null)}
        onDelete={(img) => { remove(img); setSelected(null); }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    paddingTop: Layout.spacing.md,
  },
  controlsCard: {
    borderRadius: Layout.borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    gap: Layout.spacing.md,
    overflow: 'hidden',
  },
  controlsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Layout.spacing.sm,
  },
  controlsTopCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  controlsCopy: {
    flex: 1,
    minWidth: 0,
  },
  controlsTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  controlsHint: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  minimizeButton: {
    minHeight: 34,
    paddingHorizontal: 10,
    flexShrink: 0,
  },
  minimizeButtonCompact: {
    alignSelf: 'flex-end',
  },
  segment: {
    flexDirection: 'row',
    borderRadius: Layout.borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
    gap: 4,
  },
  segmentCompact: {
    flexDirection: 'column',
  },
  segmentItem: {
    flex: 1,
    minHeight: 58,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
  },
  segmentItemCompact: {
    minHeight: 46,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: '900',
    maxWidth: '70%',
  },
  segmentHint: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  miniControlsWrap: {
    marginBottom: Layout.spacing.md,
  },
  miniControls: {
    minHeight: 44,
    borderRadius: Layout.borderRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Layout.spacing.sm,
  },
  miniControlsText: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontWeight: '900',
  },
  miniControlsAction: {
    fontSize: 12,
    fontWeight: '900',
  },
  cell: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  tileGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '36%',
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
});
