
import React, { useState, useEffect } from 'react';
import { ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { getDirectImageUrl } from '../utils/linkUtils';

interface ProtocolImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined | null;
  fallbackClassName?: string;
}

const ProtocolImage: React.FC<ProtocolImageProps> = ({ src, className, fallbackClassName, ...props }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [processedUrl, setProcessedUrl] = useState<string>('');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      setProcessedUrl('');
      return;
    }
    
    const directUrl = getDirectImageUrl(src);
    
    // If the URL hasn't changed, don't trigger a new loading state
    if (directUrl === processedUrl && status === 'loaded') return;

    setProcessedUrl(directUrl);
    setStatus('loading');
  }, [src, processedUrl, status]);

  // If the URL is empty or invalid after processing
  if (!processedUrl && status !== 'loading') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-700 bg-slate-100 dark:bg-slate-800/50 ${className} ${fallbackClassName}`}>
        <AlertCircle className="w-5 h-5 opacity-20" />
        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Invalid Protocol</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className} ${status === 'loading' ? 'bg-slate-100 dark:bg-slate-800/50' : ''}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin relative z-20" />
        </div>
      )}
      
      {status === 'error' ? (
        <div className={`flex flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-700 ${fallbackClassName}`}>
          <AlertCircle className="w-5 h-5 opacity-20" />
          <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Link Severed</span>
        </div>
      ) : (
        <img
          {...props}
          key={processedUrl}
          src={processedUrl}
          loading="lazy"
          className={`${className} transition-opacity duration-700 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  );
};

export default ProtocolImage;
