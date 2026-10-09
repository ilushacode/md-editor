import { useEffect, useState } from 'react';

export const useHash = (initialContent: string, setContent: (val: string) => void) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка из хэша при монтировании
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setIsInitialized(true);
      return;
    }
    try {
      const decoded = decodeURIComponent(atob(hash));
      setContent(decoded);
    } catch (e) {
      // Битый hash - игнорируем, работаем с начальным контентом
    }
    setIsInitialized(true);
  }, [setContent]);

  // Обновление хэша при изменении контента (с дебаунсом)
  useEffect(() => {
    if (!isInitialized) return;
    
    const timer = setTimeout(() => {
      const encoded = btoa(encodeURIComponent(initialContent));
      window.history.replaceState(null, '', `#${encoded}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [initialContent, isInitialized]);
};