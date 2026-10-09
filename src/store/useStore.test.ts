import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Сброс стора перед каждым тестом
    useStore.setState({
      theme: 'system',
      content: '# Добро пожаловать в Markdown Editor\n\nНачните печатать...',
      lastSaved: '',
    });
  });

  it('имеет дефолтное состояние', () => {
    const state = useStore.getState();
    expect(state.theme).toBe('system');
    expect(state.content).toContain('Markdown Editor');
    expect(state.lastSaved).toBe('');
  });

  it('обновляет content через setContent', () => {
    const { setContent } = useStore.getState();
    setContent('# Новый заголовок');
    expect(useStore.getState().content).toBe('# Новый заголовок');
  });

  it('меняет тему через setTheme', () => {
    const { setTheme } = useStore.getState();
    setTheme('dark');
    expect(useStore.getState().theme).toBe('dark');

    setTheme('light');
    expect(useStore.getState().theme).toBe('light');
  });

  it('сохраняет lastSaved при saveToCache', () => {
    const { saveToCache } = useStore.getState();
    expect(useStore.getState().lastSaved).toBe('');
    saveToCache();
    expect(useStore.getState().lastSaved).not.toBe('');
    // Проверяем, что это валидная ISO-дата
    expect(() => new Date(useStore.getState().lastSaved)).not.toThrow();
  });
});