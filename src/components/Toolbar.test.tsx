import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  const defaultProps = {
    onAction: vi.fn(),
    onDownload: vi.fn(),
    onUpload: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит все кнопки форматирования', () => {
    render(<Toolbar {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    // 12 кнопок форматирования + 6 управления
    expect(buttons.length).toBeGreaterThan(15);
  });

  it('вызывает onAction при клике на Bold', async () => {
    render(<Toolbar {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const boldBtn = buttons[3]; // h1, h2, h3, bold

    await userEvent.click(boldBtn);
    expect(defaultProps.onAction).toHaveBeenCalledWith('bold');
  });

  it('вызывает onDownload при клике', async () => {
    render(<Toolbar {...defaultProps} />);
    const downloadBtn = screen.getByTitle(/скачать/i);
    await userEvent.click(downloadBtn);
    expect(defaultProps.onDownload).toHaveBeenCalled();
  });

  it('переключает тему на dark', async () => {
    render(<Toolbar {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    // Три последние — light, system, dark
    const darkBtn = buttons[buttons.length - 1];

    await userEvent.click(darkBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('копирует ссылку в буфер обмена', async () => {
    render(<Toolbar {...defaultProps} />);
    const shareBtn = screen.getByTitle(/ссылка/i);
    await userEvent.click(shareBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});