import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { useStore } from './store/useStore';

describe('App (integration)', () => {
  beforeEach(() => {
    useStore.setState({
      content: '',
      theme: 'light',
      lastSaved: '',
    });
    window.history.replaceState(null, '', '/');
  });

  it('рендерит основной layout', () => {
    render(<App />);
    
    // Точный текст — избегаем коллизии с "Markdown Editor"
    expect(screen.getByText('Markdown Editor')).toBeInTheDocument();
    expect(screen.getByText('Editor', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('Preview', { exact: true })).toBeInTheDocument();
  });

  it('отображает количество символов', () => {
    useStore.setState({ content: '12345' });
    render(<App />);
    expect(screen.getByText('5 chars')).toBeInTheDocument();
  });

  it('обновляет preview при вводе в редактор', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/начните писать/i);

    await userEvent.type(textarea, '# Тест');

    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Тест');
  });

  it('показывает копирайт Ilushacode', () => {
    render(<App />);
    expect(screen.getByText(/Ilushacode/)).toBeInTheDocument();
  });

  it('показывает Local Storage в футере', () => {
    render(<App />);
    expect(screen.getByText(/Local Storage/)).toBeInTheDocument();
  });
});