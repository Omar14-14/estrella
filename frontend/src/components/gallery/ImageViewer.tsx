import React, { useCallback } from 'react';
import {
  View, Image, TouchableOpacity, Text,
  StyleSheet, Modal, Dimensions, Alert,
  StatusBar,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { GalleryImage } from '../../types';

const { width, height } = Dimensions.get('window');

interface Props {
  image: GalleryImage | null;
  onClose: () => void;
  onDelete: (image: GalleryImage) => void;
}

export function ImageViewer({ image, onClose, onDelete }: Props) {
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
      <View style={styles.overlay}>
        {image && (
          <Image
            source={{ uri: image.url }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.controlBtn}>
            <Text style={styles.controlText}>Cerrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete} style={styles.controlBtn}>
            <Text style={[styles.controlText, styles.deleteText]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 20, 28, 0.96)',
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
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  controlText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteText: {
    color: Colors.error,
  },
});
