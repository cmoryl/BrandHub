
import React from 'react';

interface Props {
  content: string;
}

const CodeViewer: React.FC<Props> = ({ content }) => {
  return (
    <div className="bg-slate-950 p-6 overflow-x-auto min-h-[400px]">
      <pre className="code-font text-sm leading-relaxed text-slate-300">
        <code>
          {content.split('\n').map((line, i) => (
            <div key={i} className="flex gap-4">
              <span className="w-8 text-slate-600 text-right select-none">{i + 1}</span>
              <span>{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default CodeViewer;
