import React, { useEffect, useRef } from 'react';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { useStore } from './store/useStore';
import { useTheme } from './hooks/useTheme';
import { useHash } from './hooks/useHash';
import { useSyncScroll } from './hooks/useSyncScroll';
import { useUndoRedo } from './hooks/useUndoRedo';

function App() {
  const { content, setContent, saveToCache } = useStore();
  useTheme();
  useHash(content, setContent);
  
  // История отмен/повторов
  useUndoRedo({ content, setContent });

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  useSyncScroll(editorRef, previewRef);

  useEffect(() => {
    const timer = setTimeout(() => saveToCache(), 1500);
    return () => clearTimeout(timer);
  }, [content, saveToCache]);

  const handleAction = (action: string) => {
    window.dispatchEvent(new CustomEvent('editor-action', { detail: action }));
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setContent(event.target?.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="w-screen h-screen flex flex-col p-2.5 gap-2.5 overflow-hidden">

      <header className="glass rounded-xl flex items-center justify-between px-4 py-2 shrink-0 animate-fade-up">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-black dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-black text-[10px] font-bold">M</span>
          </div>
          <span className="text-[13px] font-medium tracking-tight">Markdown Editor</span>
        </div>

        <span className="text-[10px] text-neutral-400 font-mono">
          {content.length} chars
        </span>
      </header>

      <Toolbar onAction={handleAction} onDownload={handleDownload} onUpload={handleUpload} />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2.5 min-h-0">

        <section className="glass rounded-xl flex flex-col overflow-hidden min-h-0 animate-fade-up">
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-black/5 dark:border-white/5 shrink-0">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 ml-1.5">
              Editor
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <Editor scrollRef={editorRef} />
          </div>
        </section>

        <section className="glass-subtle rounded-xl flex flex-col overflow-hidden min-h-0 animate-fade-up">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-black/5 dark:border-white/5 shrink-0">
            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              Preview
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Live
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <Preview ref={previewRef} />
          </div>
        </section>

      </main>

      <footer className="glass rounded-xl flex items-center justify-between px-4 py-1.5 text-[10px] text-neutral-500 shrink-0 animate-fade-up">
        <span>© {new Date().getFullYear()} Ilushacode</span>
        <span className="uppercase tracking-[0.18em]">Local Storage</span>
      </footer>

    </div>
  );
}

export default App;