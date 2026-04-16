import { useState, useEffect, useCallback } from 'react';
import { GalleryImage } from '../types';
import { galleryService } from '../services/gallery.service';

export function useGallery() {
  const [images, setImages]       = useState<GalleryImage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryService.getAll();
      setImages(data);
    } catch {
      setError('No se pudieron cargar las imágenes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = useCallback(async (): Promise<boolean> => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const image = await galleryService.pickAndUpload((pct) => setProgress(pct));
      if (image) setImages(prev => [image, ...prev]);
      return !!image;
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError('Error al subir la imagen');
      return false;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const remove = useCallback(async (image: GalleryImage): Promise<boolean> => {
    try {
      await galleryService.delete(image);
      setImages(prev => prev.filter(i => i.id !== image.id));
      return true;
    } catch {
      setError('Error al eliminar la imagen');
      return false;
    }
  }, []);

  return { images, loading, uploading, progress, error, upload, remove, reload: load };
}
