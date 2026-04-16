import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middlewares/auth';

const COLLECTION = 'diary';

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Error al obtener notas' });
  }
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const note = { title, content, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const ref = await db.collection(COLLECTION).add(note);
    res.status(201).json({ id: ref.id, ...note });
  } catch {
    res.status(500).json({ error: 'Error al crear nota' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    await db.collection(COLLECTION).doc(id).update({ title, content, updatedAt: new Date().toISOString() });
    res.json({ id, title, content });
  } catch {
    res.status(500).json({ error: 'Error al actualizar nota' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    res.json({ message: 'Nota eliminada' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar nota' });
  }
};
