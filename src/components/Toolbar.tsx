import React from 'react';
import { 
  Bold, Italic, Strikethrough, Code, Link, Image, 
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  Sun, Moon, Laptop, Download, Upload, Share2, Check
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx } from 'clsx';

interface ToolbarProps {
  onAction: (action: string) => void;
  onDownload: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAction, onDownload, onUpload }) => {
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    { icon: <Heading1 size={15} />, action: 'h1' },
    { icon: <Heading2 size={15} />, action: 'h2' },
    { icon: <Heading3 size={15} />, action: 'h3' },
    { icon: <Bold size={15} />, action: 'bold' },
    { icon: <Italic size={15} />, action: 'italic' },
    { icon: <Strikethrough size={15} />, action: 'strikethrough' },
    { icon: <Code size={15} />, action: 'code' },
    { icon: <Link size={15} />, action: 'link' },
    { icon: <Image size={15} />, action: 'image' },
    { icon: <List size={15} />, action: 'ul' },
    { icon: <ListOrdered size={15} />, action: 'ol' },
    { icon: <Quote size={15} />, action: 'quote' },
  ];

  return (
    <div className="glass rounded-2xl px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 animate-fade-up">
      <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
        {tools.map((tool) => (
          <button key={tool.action} onClick={() => onAction(tool.action)} className="icon-btn shrink-0">
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button onClick={onDownload} className="icon-btn" title="Скачать">
          <Download size={15} />
        </button>
        <label className="icon-btn cursor-pointer" title="Загрузить">
          <Upload size={15} />
          <input type="file" accept=".md" className="hidden" onChange={onUpload} />
        </label>
        <button onClick={copyShareLink} className="icon-btn" title="Ссылка">
          {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
        </button>

        <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />

        <button onClick={() => setTheme('light')} className={clsx("icon-btn", theme === 'light' && "text-black dark:text-white bg-black/5 dark:bg-white/10")}>
          <Sun size={15} />
        </button>
        <button onClick={() => setTheme('system')} className={clsx("icon-btn", theme === 'system' && "text-black dark:text-white bg-black/5 dark:bg-white/10")}>
          <Laptop size={15} />
        </button>
        <button onClick={() => setTheme('dark')} className={clsx("icon-btn", theme === 'dark' && "text-black dark:text-white bg-black/5 dark:bg-white/10")}>
          <Moon size={15} />
        </button>
      </div>
    </div>
  );
};