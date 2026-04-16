import React, { useCallback } from 'react';
import {
  View, Image, TouchableOpacity, Text,
  StyleSheet, Modal, Dimensions, Alert,
  StatusBar,
} from 'react-native';
import { GalleryImage } from '../../types';
import { useTheme } from '../../theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

interface Props {
  image: GalleryImage | null;
  onClose: () => void;
  onDelete: (image: GalleryImage) => void;
}

export function ImageViewer({ image, onClose, onDelete }: Props) {
  const { theme } = useTheme();
  const confirmDelete = useCallback(() => {
    if (!image) return;
    Alert.alert(
      'Eliminar imagen',
      'Seguro que quieres eliminar esta imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => { onDelete(image); onClose(); } },
      ]
    );
  }, [image, onDelete, onClose]);

  return (
    <Modal
      visible={!!image}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={[styles.overlay, { backgroundColor: theme.isDark ? 'rgba(12, 8, 16, 0.97)' : 'rgba(43, 36, 48, 0.92)' }]}>
        {image && (
          <Image
            source={{ uri: image.url }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.controlBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }]}
          >
            <Text style={[styles.controlText, { color: theme.colors.text }]}>Cerrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmDelete}
            style={[styles.controlBtn, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }]}
          >
            <Text style={[styles.controlText, { color: theme.colors.error }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width,
    height,
  },
  topBar: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  controlBtn: {
    minWidth: 82,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  controlText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
