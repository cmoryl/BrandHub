
import React from 'react';
import { FileEntry } from '../types';

interface Props {
  files: FileEntry[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

const FileTree: React.FC<Props> = ({ files, selectedPath, onSelect }) => {
  // Sort files: directories first, then alphabetical
  const sortedFiles = [...files].sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.path.localeCompare(b.path);
  });

  return (
    <div className="py-2">
      {sortedFiles.map(file => (
        <button
          key={file.path}
          onClick={() => !file.isDir && onSelect(file.path)}
          className={`w-full text-left px-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${
            file.isDir ? 'cursor-default' : 'hover:bg-slate-800'
          } ${selectedPath === file.path ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-500' : 'text-slate-400'}`}
          style={{ paddingLeft: `${(file.path.split('/').length - 1) * 12 + 16}px` }}
        >
          {file.isDir ? (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          )}
          <span className="truncate">{file.name}</span>
        </button>
      ))}
    </div>
  );
};

export default FileTree;
