
import React, { useState, useMemo, useRef } from 'react';
import { Copy, Check, Info, FlaskConical, Plus, Trash2, Sparkles, Loader2, CheckCircle2, ChevronRight, ArrowLeftRight, Wand2, Camera, Upload, X, Shield, Layers } from 'lucide-react';
import { Color, Brand } from '../types';
import { hexToRgb, rgbToCmyk, rgbToHsv, hexToPantone, getContrastRatio, getWCAGRating, getContrastColor } from '../utils/colorUtils';
import { generateAIPalette, generatePaletteFromImage } from '../services/geminiService';

interface ColorPaletteProps {
  colors: Color[];
  brand?: Brand;
  mode?: 'view' | 'edit';
  onChange?: (colors: Color[]) => void;
}

const ColorABTest = ({ colors }: { colors: Color[] }) => {
  const [bgIndex, setBgIndex] = useState(0);
  const [fgIndex, setFgIndex] = useState(Math.min(1, colors.length - 1));

  const handleSwap = () => {
    const temp = bgIndex;
    setBgIndex(fgIndex);
    setFgIndex(temp);
  };

  const colorA = colors[bgIndex] || { hex: '#000000', name: 'Black' };
  const colorB = colors[fgIndex] || { hex: '#ffffff', name: 'White' };

  return (
    <div className="bg-[#0f172a] dark:bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 space-y-10 text-left mb-16 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Color A Selector */}
        <div className="flex-1 w-full space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Color A (Background)</label>
          <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 focus-within:border-blue-500 transition-colors">
            <div className="w-10 h-10 rounded-xl shadow-inner shrink-0" style={{ backgroundColor: colorA.hex }} />
            <select 
              value={bgIndex} 
              onChange={(e) => setBgIndex(parseInt(e.target.value))}
              className="bg-transparent border-none text-white text-sm font-bold w-full focus:ring-0 cursor-pointer"
            >
              {colors.map((c, i) => (
                <option key={i} value={i} className="bg-slate-900 text-white">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <button 
          onClick={handleSwap}
          className="p-4 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all hover:scale-110 active:rotate-180 duration-500 border border-slate-700 mt-6"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>

        {/* Color B Selector */}
        <div className="flex-1 w-full space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Color B (Foreground/Text)</label>
          <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 focus-within:border-blue-500 transition-colors">
            <div className="w-10 h-10 rounded-xl shadow-inner shrink-0" style={{ backgroundColor: colorB.hex }} />
            <select 
              value={fgIndex} 
              onChange={(e) => setFgIndex(parseInt(e.target.value))}
              className="bg-transparent border-none text-white text-sm font-bold w-full focus:ring-0 cursor-pointer"
            >
              {colors.map((c, i) => (
                <option key={i} value={i} className="bg-slate-900 text-white">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Result Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[2rem] border border-slate-800 shadow-inner min-h-[360px]">
        {/* Panel 1: BG(A) Text(B) */}
        <div 
          className="flex flex-col items-center justify-center p-12 text-center transition-all duration-500"
          style={{ backgroundColor: colorA.hex, color: colorB.hex }}
        >
          <h4 className="text-5xl font-black tracking-tighter mb-4">Heading</h4>
          <p className="text-lg font-medium opacity-90 max-w-xs leading-relaxed">This is how body text looks in the primary interface protocol.</p>
        </div>
        
        {/* Panel 2: BG(B) Text(A) */}
        <div 
          className="flex flex-col items-center justify-center p-12 text-center transition-all duration-500"
          style={{ backgroundColor: colorB.hex, color: colorA.hex }}
        >
          <h4 className="text-5xl font-black tracking-tighter mb-4">Heading</h4>
          <p className="text-lg font-medium opacity-90 max-w-xs leading-relaxed">This is how body text looks in the inverted interface protocol.</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Contrast Ratio</span>
              <span className="text-xl font-black text-white">{getContrastRatio(colorA.hex, colorB.hex).toFixed(2)}:1</span>
           </div>
           <div className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest ${getWCAGRating(getContrastRatio(colorA.hex, colorB.hex)).pass ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
              WCAG {getWCAGRating(getContrastRatio(colorA.hex, colorB.hex)).label}
           </div>
        </div>
        <div className="text-right text-[10px] font-black text-slate-500 uppercase tracking-widest max-w-[200px]">
           * Testing visual resonance between surface and character levels.
        </div>
      </div>
    </div>
  );
};

const AccessibilityMatrix = ({ colors }: { colors: Color[] }) => {
  const testTextColors = useMemo(() => {
    const brandCols = colors.slice(0, 2).map(c => ({ name: `${c.name} Text`, hex: c.hex }));
    return [
      { name: 'White Text', hex: '#ffffff' },
      { name: 'Black Text', hex: '#000000' },
      ...brandCols
    ];
  }, [colors]);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest">04</div>
        <h3 className="text-2xl font-black uppercase tracking-tight dark:text-white">Accessibility Stress Test (The Matrix)</h3>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 border-r border-white/5">Background</th>
              {testTextColors.map((col, i) => (
                <th key={i} className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] border-r border-white/5 last:border-r-0">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((bgColor, rowIdx) => (
              <tr key={rowIdx} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors" style={{ backgroundColor: bgColor.hex }}>
                <td className="px-8 py-8 border-r border-black/5 font-black text-sm" style={{ color: getContrastColor(bgColor.hex) }}>
                  {bgColor.name} BG
                </td>
                {testTextColors.map((textColor, colIdx) => {
                  const ratio = getContrastRatio(bgColor.hex, textColor.hex);
                  const rating = getWCAGRating(ratio);
                  const isSame = bgColor.hex.toLowerCase() === textColor.hex.toLowerCase();
                  const contentColor = getContrastColor(bgColor.hex);

                  return (
                    <td key={colIdx} className="px-8 py-8 border-r border-black/5 last:border-r-0">
                      {isSame ? (
                        <span className="text-[10px] font-bold opacity-60 italic" style={{ color: contentColor }}>(Inverse) N/A</span>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-black text-sm" style={{ color: textColor.hex }}>
                              {rating.pass ? (ratio > 10 ? 'Readable' : 'Pass') : 'Fail'}
                            </p>
                            <p className="text-[10px] font-mono font-bold opacity-60" style={{ color: contentColor }}>
                              Ratio {ratio.toFixed(1)}:1
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded text-[10px] font-black tracking-widest ${rating.pass ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                            {rating.label}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, brand, mode = 'view', onChange }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const safeColors = useMemo(() => Array.isArray(colors) ? colors : [], [colors]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(safeColors[0] || null);
  const [activeTab, setActiveTab] = useState<'palette' | 'lab'>('palette');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lab State
  const [labPrompt, setLabPrompt] = useState('');
  const [proposedPalette, setProposedPalette] = useState<Color[] | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleUpdate = (index: number, field: keyof Color, value: string) => {
    if (!onChange) return;
    const next = [...safeColors];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const addColor = () => {
    if (!onChange) return;
    onChange([...safeColors, { name: 'New Color', hex: '#000000', usage: 'primary' }]);
  };

  const removeColor = (index: number) => {
    if (!onChange) return;
    onChange(safeColors.filter((_, i) => i !== index));
  };

  const runLabSynthesis = async () => {
    if (!brand || !labPrompt.trim()) return;
    setIsSynthesizing(true);
    try {
      const result = await generateAIPalette(brand, labPrompt);
      setProposedPalette(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      if (brand) {
        setIsSynthesizing(true);
        try {
          const result = await generatePaletteFromImage(brand, base64);
          setProposedPalette(result);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSynthesizing(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const commitAsMaster = () => {
    if (proposedPalette && onChange) {
      onChange(proposedPalette);
      setProposedPalette(null);
      setUploadedImage(null);
      setActiveTab('palette');
    }
  };

  const commitAsSub = () => {
    if (proposedPalette && onChange) {
      // Logic: Append with a clear visual marker or just merge
      onChange([...safeColors, ...proposedPalette.map(c => ({...c, name: `[SUB] ${c.name}`}))]);
      setProposedPalette(null);
      setUploadedImage(null);
      setActiveTab('palette');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('palette')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'palette' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Full Palette</button>
          <button onClick={() => setActiveTab('lab')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'lab' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Color Lab</button>
        </div>
        {mode === 'edit' && activeTab === 'palette' && (
          <button onClick={addColor} className="mb-2 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
            <Plus className="w-3 h-3" /> Add Color
          </button>
        )}
      </div>

      {activeTab === 'palette' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 text-left">
            {safeColors.map((color, idx) => (
              <div key={idx} className={`group relative bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md ${selectedColor?.hex === color.hex ? 'border-blue-500' : 'border-slate-200 dark:border-slate-800'}`}>
                <div 
                  className="h-24 w-full cursor-pointer relative" 
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Info className="text-white w-6 h-6" />
                  </div>
                </div>
                <div className="p-3">
                  {mode === 'edit' ? (
                    <div className="space-y-2">
                       <input type="text" value={color.name} onChange={e => handleUpdate(idx, 'name', e.target.value)} className="w-full text-xs font-bold uppercase bg-transparent border-none p-0 focus:ring-0 dark:text-white" />
                       <div className="flex items-center justify-between">
                          <input type="text" value={color.hex} onChange={e => handleUpdate(idx, 'hex', e.target.value)} className="text-[10px] font-mono uppercase bg-transparent border-none p-0 focus:ring-0 text-slate-500" />
                          <button onClick={() => removeColor(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate text-left">{color.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-slate-500 text-[10px] font-mono uppercase">{color.hex}</p>
                        <button onClick={() => handleCopy(color.hex)}>
                          {copiedHex === color.hex ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
             {selectedColor && (
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-32 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: selectedColor.hex }}></div>
                    <div className="text-left">
                       <h3 className="text-lg font-black dark:text-white">{selectedColor.name}</h3>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{selectedColor.usage}</p>
                    </div>
                 </div>

                 <div className="grid gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-left">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">HEX Native</span>
                       <span className="font-mono text-xs dark:text-slate-300 uppercase">{selectedColor.hex}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-left">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">RGB Protocol</span>
                       {(() => {
                          const rgb = hexToRgb(selectedColor.hex);
                          return <span className="font-mono text-xs dark:text-slate-300">R:{rgb.r} G:{rgb.g} B:{rgb.b}</span>
                       })()}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-left">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">HSV Depth</span>
                       {(() => {
                          const rgb = hexToRgb(selectedColor.hex);
                          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                          return <span className="font-mono text-xs dark:text-slate-300">H:{hsv.h}° S:{hsv.s}% V:{hsv.v}%</span>
                       })()}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-left">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">CMYK Master</span>
                       {(() => {
                          const rgb = hexToRgb(selectedColor.hex);
                          const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
                          return <span className="font-mono text-xs dark:text-slate-300">C:{cmyk.c}% M:{cmyk.m}% Y:{cmyk.y}% K:{cmyk.k}%</span>
                       })()}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-left">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pantone Match</span>
                       <span className="font-mono text-xs dark:text-slate-300">{hexToPantone(selectedColor.hex)}</span>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-left">Accessibility Manifest (WCAG 2.1)</span>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[10px] dark:text-slate-400">
                             <span>Vs. White</span>
                             <span className="font-bold">{getContrastRatio(selectedColor.hex, '#ffffff').toFixed(2)}:1</span>
                          </div>
                          <div className={`px-2 py-1 rounded text-center text-[10px] font-black ${getWCAGRating(getContrastRatio(selectedColor.hex, '#ffffff')).pass ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                             {getWCAGRating(getContrastRatio(selectedColor.hex, '#ffffff')).label}
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[10px] dark:text-slate-400">
                             <span>Vs. Black</span>
                             <span className="font-bold">{getContrastRatio(selectedColor.hex, '#000000').toFixed(2)}:1</span>
                          </div>
                          <div className={`px-2 py-1 rounded text-center text-[10px] font-black ${getWCAGRating(getContrastRatio(selectedColor.hex, '#000000')).pass ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                             {getWCAGRating(getContrastRatio(selectedColor.hex, '#000000')).label}
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'lab' && (
        <div className="space-y-16 animate-in fade-in duration-500 text-left">
           {/* New A/B Test Section */}
           <ColorABTest colors={safeColors} />

           <div className="grid lg:grid-cols-2 gap-12 pt-12 border-t border-slate-200 dark:border-slate-800">
              {/* Image Analysis Module */}
              <div className="space-y-6 text-left">
                 <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Visual Inspiration Protocol
                 </div>
                 
                 <div className="relative group aspect-video rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-500/50">
                    {uploadedImage ? (
                       <>
                          <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover" />
                          <button 
                             onClick={() => { setUploadedImage(null); setProposedPalette(null); }}
                             className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X className="w-4 h-4" />
                          </button>
                       </>
                    ) : (
                       <div className="text-center p-8">
                          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Camera className="w-8 h-8" />
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-widest dark:text-white mb-2">Upload Visual DNA</h4>
                          <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Extract brand-aligned palettes directly from imagery.</p>
                          <input 
                             type="file" 
                             ref={fileInputRef} 
                             onChange={handleImageUpload} 
                             className="hidden" 
                             accept="image/*" 
                          />
                          <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="mt-6 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
                          >
                             Choose File
                          </button>
                       </div>
                    )}
                 </div>
              </div>

              {/* Lab Control */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center">
                 <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl mb-6">
                    <FlaskConical className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight dark:text-white mb-2">A/B Palette Refinement</h3>
                 <p className="text-sm text-slate-500 max-w-xs mb-8">Direct the Intelligence Studio to evolve your current palette for specific campaign themes or products.</p>
                 
                 <div className="w-full max-w-sm space-y-4">
                    <textarea 
                      value={labPrompt}
                      onChange={e => setLabPrompt(e.target.value)}
                      placeholder="e.g., Generate a high-energy variant for an upcoming product launch..."
                      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    <button 
                       onClick={runLabSynthesis}
                       disabled={isSynthesizing || !labPrompt.trim()}
                       className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
                    >
                       {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                       Initiate Synthesis
                    </button>
                 </div>
              </div>
           </div>

           {proposedPalette && (
              <div className="pt-12 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4 text-left">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black uppercase tracking-tight dark:text-white">Proposed Protocol</h4>
                          <p className="text-xs text-slate-500 font-medium">Verify structural resonance before committing.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button 
                          onClick={commitAsSub}
                          className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:border-blue-500 shadow-sm"
                       >
                          <Layers className="w-4 h-4" />
                          Append as Sub-Palette
                       </button>
                       <button 
                          onClick={commitAsMaster}
                          className="flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
                       >
                          <Shield className="w-4 h-4" />
                          Set as Master Palette
                       </button>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {proposedPalette.map((c, i) => (
                       <div key={i} className="group relative rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg transition-all hover:scale-[1.02]">
                          <div className="h-32 w-full" style={{ backgroundColor: c.hex }} />
                          <div className="p-5 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
                             <p className="text-[10px] font-black uppercase dark:text-white truncate mb-1">{c.name}</p>
                             <p className="text-[9px] font-mono text-slate-500">{c.hex.toUpperCase()}</p>
                             <div className="mt-3 inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[7px] font-black text-slate-400 uppercase tracking-widest">{c.usage}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {/* Matrix Section */}
           <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
              <AccessibilityMatrix colors={safeColors} />
           </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
