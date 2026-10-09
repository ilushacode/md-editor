import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from './useUndoRedo';

describe('useUndoRedo', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('откатывает контент по Ctrl+Z', () => {
    const setContent = vi.fn();

    const { rerender } = renderHook(
      ({ content }) => useUndoRedo({ content, setContent }),
      { initialProps: { content: 'первый' } }
    );

    // Меняем контент + ждём дебаунс-эффект (250ms внутри хука)
    act(() => {
      rerender({ content: 'второй' });
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Проверяем, что в историю записалось "второй"
    // Ctrl+Z должен откатить к "первый"
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }));
    });

    expect(setContent).toHaveBeenCalledWith('первый');
  });

  it('повторяет контент по Ctrl+Y', () => {
    const setContent = vi.fn();

    const { rerender } = renderHook(
      ({ content }) => useUndoRedo({ content, setContent }),
      { initialProps: { content: 'первый' } }
    );

    act(() => {
      rerender({ content: 'второй' });
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Откатываем
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }));
    });

    setContent.mockClear();

    // Возвращаем вперёд
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true }));
    });

    expect(setContent).toHaveBeenCalledWith('второй');
  });

  it('не падает при Ctrl+Z на пустой истории', () => {
    const setContent = vi.fn();
    renderHook(() => useUndoRedo({ content: 'initial', setContent }));

    expect(() => {
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }));
      });
    }).not.toThrow();
  });

  it('игнорирует Ctrl+Z без модификатора', () => {
    const setContent = vi.fn();
    renderHook(() => useUndoRedo({ content: 'initial', setContent }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }));
    });

    expect(setContent).not.toHaveBeenCalled();
  });
});