import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { diaryService } from '../services/diary.service';

export function useDiary() {
  const [notes, setNotes]     = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await diaryService.getAll();
      setNotes(data);
    } catch {
      setError('No se pudieron cargar las notas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (title: string, content: string): Promise<Note | null> => {
    try {
      const note = await diaryService.create(title, content);
      setNotes(prev => [note, ...prev]);
      return note;
    } catch {
      setError('Error al crear la nota');
      return null;
    }
  }, []);

  const update = useCallback(async (id: string, title: string, content: string): Promise<boolean> => {
    try {
      const updated = await diaryService.update(id, title, content);
      setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n));
      return true;
    } catch {
      setError('Error al actualizar la nota');
      return false;
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await diaryService.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      return true;
    } catch {
      setError('Error al eliminar la nota');
      return false;
    }
  }, []);

  return { notes, loading, error, create, update, remove, reload: load };
}
