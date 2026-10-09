import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  theme: Theme;
  content: string;
  lastSaved: string;
  setTheme: (theme: Theme) => void;
  setContent: (content: string) => void;
  saveToCache: () => void;
  loadFromCache: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      content: '# Добро пожаловать в Markdown Editor\n\nНачните печатать...',
      lastSaved: '',
      setTheme: (theme) => set({ theme }),
      setContent: (content) => set({ content }),
      saveToCache: () => {
        set({ lastSaved: new Date().toISOString() });
        // Данные уже сохраняются автоматически через persist middleware
      },
      loadFromCache: () => {
        // Логика загрузки из persist происходит автоматически при инициализации
      },
    }),
    {
      name: 'md-editor-storage',
    }
  )
);