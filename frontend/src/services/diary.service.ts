import { api } from './api';
import { Note } from '../types';

export const diaryService = {
  getAll: async (): Promise<Note[]> => {
    const { data } = await api.get<Note[]>('/diary');
    return data;
  },

  create: async (title: string, content: string): Promise<Note> => {
    const { data } = await api.post<Note>('/diary', { title, content });
    return data;
  },

  update: async (id: string, title: string, content: string): Promise<Note> => {
    const { data } = await api.put<Note>(`/diary/${id}`, { title, content });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/diary/${id}`);
  },
};
