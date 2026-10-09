import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Preview } from './Preview';
import { useStore } from '../store/useStore';

describe('Preview', () => {
  beforeEach(() => {
    useStore.setState({ content: '' });
  });

  it('рендерит заголовок h1', () => {
    useStore.setState({ content: '# Hello, World!' });
    render(<Preview />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Hello, World!');
  });

  it('рендерит h2 и h3', () => {
    useStore.setState({ content: '## Второй\n### Третий' });
    render(<Preview />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Второй');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Третий');
  });

  it('рендерит жирный текст', () => {
    useStore.setState({ content: 'это **жирный** текст' });
    render(<Preview />);
    expect(screen.getByText('жирный').tagName).toBe('STRONG');
  });

  it('рендерит курсив', () => {
    useStore.setState({ content: 'это *курсив* текст' });
    render(<Preview />);
    expect(screen.getByText('курсив').tagName).toBe('EM');
  });

  it('рендерит списки ul и ol', () => {
    useStore.setState({ content: '- один\n- два\n\n1. первый\n2. второй' });
    render(<Preview />);
    expect(screen.getByText('один').closest('ul')).toBeInTheDocument();
    expect(screen.getByText('первый').closest('ol')).toBeInTheDocument();
  });

  it('рендерит цитату', () => {
    useStore.setState({ content: '> цитата' });
    render(<Preview />);
    const quote = screen.getByText('цитата').closest('blockquote');
    expect(quote).toBeInTheDocument();
  });

  it('рендерит инлайн-код', () => {
    useStore.setState({ content: 'код: `const x = 1`' });
    render(<Preview />);
    const code = screen.getByText('const x = 1');
    expect(code.tagName).toBe('CODE');
  });

  it('рендерит одиночный перенос строки как <br> (remark-breaks)', () => {
    useStore.setState({ content: 'первая\nвторая' });
    render(<Preview />);
    const p = screen.getByText(/первая/);
    expect(p.querySelector('br')).toBeInTheDocument();
  });

  it('рендерит ссылку', () => {
    useStore.setState({ content: '[ссылка](https://example.com)' });
    render(<Preview />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('рендерит таблицу (GFM)', () => {
    useStore.setState({
      content: '| A | B |\n|---|---|\n| 1 | 2 |',
    });
    render(<Preview />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('применяет класс markdown-body', () => {
    useStore.setState({ content: '# Test' });
    const { container } = render(<Preview />);
    expect(container.querySelector('.markdown-body')).toBeInTheDocument();
  });
});