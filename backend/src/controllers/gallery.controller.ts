import { Response } from 'express';
import { randomUUID } from 'crypto';
import { db, storage } from '../config/firebase';
import { AuthRequest } from '../middlewares/auth';

const COLLECTION = 'gallery';
const GALLERY_PATH = 'gallery';

function makeDownloadUrl(bucketName: string, filePath: string, token: string): string {
  const encodedPath = encodeURIComponent(filePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
}

export const getImages = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
    const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(images);
  } catch (error) {
    console.error('Error al obtener imagenes:', error);
    res.status(500).json({ error: 'Error al obtener imagenes' });
  }
};

export const saveImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { base64, contentType, fileName } = req.body as {
      base64?: string;
      contentType?: string;
      fileName?: string;
    };

    if (!base64 || !contentType || !fileName) {
      res.status(400).json({ error: 'Imagen invalida' });
      return;
    }

    const cleanBase64 = base64.includes(',')
      ? base64.split(',').pop() ?? ''
      : base64;
    const buffer = Buffer.from(cleanBase64, 'base64');
    const bucket = storage.bucket();
    const filePath = `${GALLERY_PATH}/${fileName}`;
    const token = randomUUID();

    await bucket.file(filePath).save(buffer, {
      metadata: {
        contentType,
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    const url = makeDownloadUrl(bucket.name, filePath, token);
    const image = { url, fileName, createdAt: new Date().toISOString() };
    const ref = await db.collection(COLLECTION).add(image);
    res.status(201).json({ id: ref.id, ...image });
  } catch (error) {
    console.error('Error al guardar imagen:', error);
    res.status(500).json({ error: 'Error al guardar imagen' });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    const image = doc.data() as { fileName?: string } | undefined;

    if (image?.fileName) {
      try {
        await storage.bucket().file(`${GALLERY_PATH}/${image.fileName}`).delete();
      } catch (error) {
        console.warn('No se pudo eliminar archivo de Storage:', error);
      }
    }

    await docRef.delete();
    res.json({ message: 'Imagen eliminada' });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};
