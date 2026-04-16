export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  fileName: string;
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  file: number | { uri: string };
  date?: string; // YYYY-MM-DD asociado en el calendario
}

export type RootStackParamList = {
  Pin: undefined;
  WordSearch: undefined;
  Diary: undefined;
  DiaryDetail: { noteId?: string };
  Gallery: undefined;
  Music: undefined;
  Game: undefined;
};
