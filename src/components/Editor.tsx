import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useStore } from '../store/useStore';

interface EditorProps {
  scrollRef: React.RefObject<HTMLTextAreaElement>;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(({ scrollRef }, ref) => {
  const { content, setContent } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => textareaRef.current!);
  useImperativeHandle(scrollRef, () => textareaRef.current!);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newText = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  useEffect(() => {
    const handleAction = (e: CustomEvent) => {
      switch (e.detail) {
        case 'bold': insertText('**', '**'); break;
        case 'italic': insertText('*', '*'); break;
        case 'strikethrough': insertText('~~', '~~'); break;
        case 'code': insertText('`', '`'); break;
        case 'link': insertText('[', '](url)'); break;
        case 'image': insertText('![alt](', ')'); break;
        case 'h1': insertText('# '); break;
        case 'h2': insertText('## '); break;
        case 'h3': insertText('### '); break;
        case 'ul': insertText('- '); break;
        case 'ol': insertText('1. '); break;
        case 'quote': insertText('> '); break;
      }
    };
    window.addEventListener('editor-action' as any, handleAction);
    return () => window.removeEventListener('editor-action' as any, handleAction);
  }, [content]);

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      className="w-full h-full resize-none bg-transparent outline-none custom-scroll
        font-mono text-neutral-700 dark:text-neutral-300
        placeholder-neutral-400 dark:placeholder-neutral-600"
      style={{
        fontSize: '15px',
        lineHeight: '1.75',
        padding: '22px 30px',
        letterSpacing: '0.01em',
      }}
      placeholder="Начните писать..."
      spellCheck={false}
    />
  );
});

Editor.displayName = 'Editor';