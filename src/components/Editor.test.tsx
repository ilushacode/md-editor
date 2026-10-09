import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Editor } from './Editor';
import { useStore } from '../store/useStore';

describe('Editor', () => {
  beforeEach(() => {
    useStore.setState({
      content: 'начальный текст',
      theme: 'light',
      lastSaved: '',
    });
  });

  it('рендерит textarea со значением из store', () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText(/начните писать/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('начальный текст');
  });

  it('обновляет store при вводе текста', async () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText(/начните писать/i);

    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'новый текст');

    expect(useStore.getState().content).toBe('новый текст');
  });

  it('обрабатывает bold через кастомное событие', async () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText(/начните писать/i) as HTMLTextAreaElement;

    // Выделяем весь текст
    textarea.setSelectionRange(0, textarea.value.length);

    // Симулируем клик по Bold в тулбаре
    window.dispatchEvent(new CustomEvent('editor-action', { detail: 'bold' }));

    // Даём время на setTimeout внутри insertText
    await new Promise((r) => setTimeout(r, 10));

    expect(useStore.getState().content).toBe('**начальный текст**');
  });

  it('обрабатывает h1 через кастомное событие', async () => {
    useStore.setState({ content: '' });
    render(<Editor />);

    window.dispatchEvent(new CustomEvent('editor-action', { detail: 'h1' }));

    await new Promise((r) => setTimeout(r, 10));

    expect(useStore.getState().content).toContain('# ');
  });

  it('применяет правильные стили (font-size 15px)', () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText(/начните писать/i);
    expect(textarea).toHaveStyle({ fontSize: '15px', lineHeight: '1.75' });
  });
});