import { useEffect, RefObject } from 'react';

/**
 * Точная синхронизация редактора и preview по строкам.
 * Preview размечается data-line атрибутами - привязка к номеру строки в исходнике.
 * Логика: при скролле редактора находим верхнюю видимую строку,
 * затем скроллим preview к блоку с соответствующим data-line.
 */
export const useSyncScroll = (
  editorRef: RefObject<HTMLTextAreaElement>,
  previewRef: RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    // Синхронизация editor -> preview
    const onEditorScroll = () => {
      // Определяем номер первой видимой строки в редакторе
      const lineHeight = parseFloat(getComputedStyle(editor).lineHeight);
      const paddingTop = parseFloat(getComputedStyle(editor).paddingTop);
      const currentLine = Math.floor((editor.scrollTop - paddingTop) / lineHeight);
      const targetLine = Math.max(0, currentLine);

      // Ищем блок в preview с ближайшим data-line
      const blocks = preview.querySelectorAll<HTMLElement>('[data-line]');
      let bestMatch: HTMLElement | null = null;
      let bestDiff = Infinity;

      blocks.forEach((block) => {
        const line = parseInt(block.dataset.line!, 10);
        const diff = Math.abs(line - targetLine);
        if (diff < bestDiff && line <= targetLine + 2) {
          bestDiff = diff;
          bestMatch = block;
        }
      });

      if (bestMatch) {
        const matchEl = bestMatch as HTMLElement;
        preview.scrollTop = matchEl.offsetTop - paddingTop;
      }
    };

    // Синхронизация preview -> editor
    const onPreviewScroll = () => {
      const paddingTop = parseFloat(getComputedStyle(preview).paddingTop);
      const scrollY = preview.scrollTop + paddingTop;

      // Находим верхний видимый блок в preview
      const blocks = preview.querySelectorAll<HTMLElement>('[data-line]');
      let activeBlock: HTMLElement | null = null;
      for (const block of Array.from(blocks)) {
        if (block.offsetTop <= scrollY) {
          activeBlock = block;
        } else {
          break;
        }
      }

      if (!activeBlock) return;
      const targetLine = parseInt(activeBlock.dataset.line!, 10);

      const editorLineHeight = parseFloat(getComputedStyle(editor).lineHeight);
      const editorPaddingTop = parseFloat(getComputedStyle(editor).paddingTop);

      editor.scrollTop = targetLine * editorLineHeight + editorPaddingTop;
    };

    editor.addEventListener('scroll', onEditorScroll, { passive: true });
    preview.addEventListener('scroll', onPreviewScroll, { passive: true });

    return () => {
      editor.removeEventListener('scroll', onEditorScroll);
      preview.removeEventListener('scroll', onPreviewScroll);
    };
  }, [editorRef, previewRef]);
};