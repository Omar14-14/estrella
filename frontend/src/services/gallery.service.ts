import * as ImagePicker from 'expo-image-picker';
import { api } from './api';
import { GalleryImage } from '../types';

function extensionFromMime(contentType: string): string {
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  return 'jpg';
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('No se pudo leer la imagen'));
        return;
      }
      resolve(result);
    };
    reader.readAsDataURL(blob);
  });
}

export const galleryService = {
  getAll: async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<GalleryImage[]>('/gallery');
    return data;
  },

  pickAndUpload: async (
    onProgress?: (pct: number) => void
  ): Promise<GalleryImage | null> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (result.canceled) return null;

    const asset = result.assets[0];
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const contentType = asset.mimeType ?? blob.type ?? 'image/jpeg';
    const fileName = `gallery_${Date.now()}.${extensionFromMime(contentType)}`;
    const base64 = await blobToBase64(blob);

    const { data } = await api.post<GalleryImage>(
      '/gallery',
      { base64, contentType, fileName },
      {
        onUploadProgress: (event) => {
          if (event.total) onProgress?.(event.loaded / event.total);
        },
      }
    );
    return data;
  },

  delete: async (image: GalleryImage): Promise<void> => {
    await api.delete(`/gallery/${image.id}`);
  },
};
