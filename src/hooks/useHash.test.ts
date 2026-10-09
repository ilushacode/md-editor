import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHash } from './useHash';

describe('useHash', () => {
  beforeEach(() => {
    // Очищаем hash в URL
    window.history.replaceState(null, '', '/');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('загружает контент из hash при монтировании', () => {
    const encoded = btoa(encodeURIComponent('# Тестовый заголовок'));
    window.history.replaceState(null, '', `#${encoded}`);

    const setContent = vi.fn();
    renderHook(() => useHash('initial', setContent));

    expect(setContent).toHaveBeenCalledWith('# Тестовый заголовок');
  });

  it('не трогает контент, если hash пустой', () => {
    const setContent = vi.fn();
    renderHook(() => useHash('initial', setContent));
    expect(setContent).not.toHaveBeenCalled();
  });

  it('обновляет hash при изменении контента (с дебаунсом)', () => {
    const setContent = vi.fn();
    const { rerender } = renderHook(
      ({ content }) => useHash(content, setContent),
      { initialProps: { content: 'initial' } }
    );

    rerender({ content: 'новый контент' });

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    const hash = window.location.hash.slice(1);
    expect(hash).toBeTruthy();
    expect(decodeURIComponent(atob(hash))).toBe('новый контент');
  });

  it('корректно обрабатывает битый hash', () => {
    window.history.replaceState(null, '', '#не-base64-строка-%%%');
    const setContent = vi.fn();

    // Не должно выбросить ошибку
    expect(() => {
      renderHook(() => useHash('initial', setContent));
    }).not.toThrow();
  });
});