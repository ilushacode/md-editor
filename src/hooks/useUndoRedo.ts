import { useEffect, useRef } from 'react';

interface UseUndoRedoOptions {
  content: string;
  setContent: (value: string) => void;
  maxHistory?: number;
}

export const useUndoRedo = ({ content, setContent, maxHistory = 200 }: UseUndoRedoOptions) => {
  const historyRef = useRef<string[]>([content]);
  const pointerRef = useRef<number>(0);
  const isApplyingRef = useRef<boolean>(false);
  const lastEditRef = useRef<number>(Date.now());

  // Отслеживаем изменения контента и пушим в историю с дебаунсом
  useEffect(() => {
    if (isApplyingRef.current) {
      isApplyingRef.current = false;
      return;
    }

    const now = Date.now();
    const timeSinceLastEdit = now - lastEditRef.current;
    lastEditRef.current = now;

    const timer = setTimeout(() => {
      const history = historyRef.current;
      const pointer = pointerRef.current;

      // Не сохраняем, если контент не изменился
      if (history[pointer] === content) return;

      // Если это продолжение быстрого набора — заменяем последний
      if (timeSinceLastEdit < 400 && pointer === history.length - 1 && pointer > 0) {
        history[pointer] = content;
      } else {
        // Обрезаем "будущее" если пользователь сделал новый ввод после undo
        history.splice(pointer + 1);
        history.push(content);
        pointerRef.current = history.length - 1;

        // Ограничиваем историю
        if (history.length > maxHistory) {
          history.shift();
          pointerRef.current--;
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [content, maxHistory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      const key = e.key.toLowerCase();

      // Undo: Ctrl+Z / Cmd+Z
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const history = historyRef.current;
        if (pointerRef.current > 0) {
          pointerRef.current--;
          isApplyingRef.current = true;
          setContent(history[pointerRef.current]);
        }
        return;
      }

      // Redo: Ctrl+Shift+Z или Ctrl+Y / Cmd+Shift+Z или Cmd+Y
      if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        const history = historyRef.current;
        if (pointerRef.current < history.length - 1) {
          pointerRef.current++;
          isApplyingRef.current = true;
          setContent(history[pointerRef.current]);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setContent]);
};