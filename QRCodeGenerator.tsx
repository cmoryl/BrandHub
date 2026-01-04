
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Share2, RefreshCw, Palette, Layers, Globe, RotateCcw, ShieldCheck } from 'lucide-react';
import { Brand } from '../types';

interface QRCodeGeneratorProps {
  brand: Brand;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ brand }) => {
  // Sync logic: Force settings extraction from brand
  const getBrandQRSettings = () => brand.qrSettings || { 
    defaultUrl: 'https://www.transperfect.com', 
    useCustomColors: false, 
    fgColor: '#3b82f6', 
    bgColor: '#02030a' 
  };
  
  const qrSettings = getBrandQRSettings();
  const brandPrimary = (brand.colors && brand.colors[0]?.hex) || '#38bdf8';
  
  const [url, setUrl] = useState(qrSettings.defaultUrl);
  const [size, setSize] = useState(256);
  
  // Initial states derived from Brand Protocol
  const [fgColor, setFgColor] = useState(qrSettings.useCustomColors ? qrSettings.fgColor : brandPrimary);
  const [bgColor, setBgColor] = useState(qrSettings.useCustomColors ? qrSettings.bgColor : '#02030a');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if current settings differ from brand standards
  const isModified = 
    fgColor !== (qrSettings.useCustomColors ? qrSettings.fgColor : brandPrimary) ||
    bgColor !== (qrSettings.useCustomColors ? qrSettings.bgColor : '#02030a');

  // React to Brand updates (Admin studio changes)
  useEffect(() => {
    const settings = getBrandQRSettings();
    setUrl(settings.defaultUrl);
    if (settings.useCustomColors) {
      setFgColor(settings.fgColor);
      setBgColor(settings.bgColor);
    } else {
      setFgColor(brandPrimary);
      setBgColor('#02030a');
    }
  }, [brand.id, brand.qrSettings, brandPrimary]);

  const handleResetToStandards = () => {
    const settings = getBrandQRSettings();
    setFgColor(settings.useCustomColors ? settings.fgColor : brandPrimary);
    setBgColor(settings.useCustomColors ? settings.bgColor : '#02030a');
  };

  const generateQR = async () => {
    if (!canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, url || 'https://example.com', {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
    } catch (err) {
      console.error("QR Synthesis Error:", err);
    }
  };

  useEffect(() => {
    generateQR();
  }, [url, size, bgColor, fgColor, brand.logoUrl]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-access-marker.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-700">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
             <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
               <Globe className="w-3 h-3" /> Destination Identifier
             </label>
             {isModified && (
               <button 
                  onClick={handleResetToStandards}
                  className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-tighter transition-colors"
               >
                  <RotateCcw className="w-2.5 h-2.5" /> Reset to Brand Standards
               </button>
             )}
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-slate-950 text-white font-bold focus:ring-1 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                <Palette className="w-3 h-3" /> Chromatic Primary
              </label>
              <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                 <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-10 w-10 rounded-lg cursor-pointer border-none bg-transparent" />
                 <span className="text-[10px] font-mono font-bold text-slate-400">{fgColor.toUpperCase()}</span>
              </div>
           </div>
           <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                <Layers className="w-3 h-3" /> Surface Level
              </label>
               <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                 <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-10 w-10 rounded-lg cursor-pointer border-none bg-transparent" />
                 <span className="text-[10px] font-mono font-bold text-slate-400">{bgColor.toUpperCase()}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pt-8 border-t border-white/5">
         <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
            <canvas ref={canvasRef} className="max-w-full rounded-xl relative z-10 shadow-lg" style={{ width: '180px', height: '180px' }} />
         </div>
         <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-xl active:scale-95"
          >
            <Download className="w-4 h-4" /> Export High-Res PNG
          </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
