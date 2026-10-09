import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useStore } from '../store/useStore';

export const Preview = forwardRef<HTMLDivElement>((_, ref) => {
  const { content } = useStore();

  return (
    <div ref={ref} className="w-full h-full overflow-y-auto custom-scroll">
      <div
        className="markdown-body mx-auto"
        style={{
          padding: '22px 30px',
          maxWidth: '820px',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';