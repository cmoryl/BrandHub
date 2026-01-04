
import { Sparkles, Wand2, Download, Trash2, LayoutGrid, CheckCircle2, Loader2, Save, BrainCircuit, FolderTree, AlertCircle, Lightbulb, X, RefreshCw, Upload, FileUp, Box, Layers, DownloadCloud, Hash } from 'lucide-react';
import React, { useState, useMemo, useRef } from 'react';
import { Brand, IconSet, Icon } from '../types';
import { generateIconSet } from '../services/geminiService';

interface AIIconStudioProps {
  brand: Brand;
  onCommit: (data: { icons?: Icon[], set?: IconSet }) => void;
}

const AIIconStudio: React.FC<AIIconStudioProps> = ({ brand, onCommit }) => {
  const [theme, setTheme] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIcons, setCurrentIcons] = useState<Icon[]>([]);
  const [setName, setSetName] = useState('');
  const [commitMode, setCommitMode] = useState<'set' | 'standalone'>('set');
  const [mode, setMode] = useState<'new' | 'append'>('new');
  const [error, setError] = useState<string | null>(null);
  
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      if (!file.name.endsWith('.svg')) {
        setError("Invalid format. Only SVG vectors accepted.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const pathMatch = content.match(/<path[^>]*d="([^"]*)"/);
          const pathData = pathMatch ? pathMatch[1] : "";

          if (!pathData) {
            setError(`Could not extract path from ${file.name}.`);
            return;
          }

          const newIcon: Icon = {
            id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: file.name.replace('.svg', '').replace(/[-_]/g, ' '),
            svgPath: pathData,
            category: 'Custom Uploads',
            tags: ['manual', 'upload']
          };

          setCurrentIcons(prev => [...prev, newIcon]);
          if (!setName) setSetName("Custom Asset Collection");
        } catch (err) {
          setError("Fault in SVG parsing logic.");
        }
      };
      reader.readAsText(file);
    });
    
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const newIcons = await generateIconSet(brand, theme, quantity, mode === 'append' ? currentIcons : []);
      if (mode === 'append') setCurrentIcons(prev => [...prev, ...newIcons]);
      else {
        setCurrentIcons(newIcons);
        setSetName(`${theme} Protocol Set`);
      }
    } catch (e: any) {
      setError("Synthesis Protocol Interrupted.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (currentIcons.length === 0) return;
    if (commitMode === 'set' && !setName.trim()) {
      setError("Set label required.");
      return;
    }
    
    if (commitMode === 'set') {
      onCommit({ set: { id: Date.now().toString(), name: setName, description: `${currentIcons.length} units`, icons: [...currentIcons], style: 'minimalist', createdAt: Date.now() } });
    } else {
      onCommit({ icons: [...currentIcons] });
    }
    
    setCurrentIcons([]);
    setTheme('');
    setSetName('');
    setError(null);
  };

  const groupedIcons = useMemo(() => {
    return currentIcons.reduce((acc, icon) => {
      const cat = icon.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(icon);
      return acc;
    }, {} as Record<string, Icon[]>);
  }, [currentIcons]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-full text-left">
      {/* Header & Controls */}
      <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl text-white shadow-lg"><Sparkles className="w-6 h-6" /></div>
            <div><h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">Icon Studio</h2><p className="text-sm text-slate-500">Vector synthesis grounded in DNA</p></div>
          </div>
          <div className="flex items-center gap-4">
            <input type="file" ref={uploadInputRef} onChange={handleFileUpload} accept=".svg" multiple className="hidden" />
            <button type="button" onClick={() => uploadInputRef.current?.click()} className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase border border-slate-200 dark:border-slate-700 shadow-sm"><FileUp className="w-4 h-4" /> Upload</button>
            <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
               <button type="button" onClick={() => setMode('new')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${mode === 'new' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>New</button>
               <button type="button" onClick={() => setMode('append')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${mode === 'append' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>Append</button>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <div className="relative group">
              <input 
                type="text" 
                value={theme} 
                onChange={e => setTheme(e.target.value)} 
                placeholder="Synthesis Brief (e.g., 'Industrial Logistics' or 'Cloud Architecture')..." 
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">V2.5 Engine</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <button 
              type="button" 
              onClick={handleGenerate} 
              disabled={isGenerating || !theme.trim()} 
              className="w-full h-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />} 
              Execute
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-widest">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-black/5 rounded"><X className="w-3 h-3" /></button>
          </div>
        )}
      </div>

      {/* Workspace Area */}
      <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30">
        {currentIcons.length > 0 ? (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
              <div className="space-y-4 flex-1 w-full">
                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl w-fit">
                   <button 
                    type="button" 
                    onClick={() => setCommitMode('set')} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${commitMode === 'set' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                   >
                     <Layers className="w-3.5 h-3.5" /> Collection Protocol
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setCommitMode('standalone')} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${commitMode === 'standalone' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                   >
                     <Box className="w-3.5 h-3.5" /> Standalone Nodes
                   </button>
                </div>
                {commitMode === 'set' && (
                  <div className="relative">
                    <input 
                      type="text" 
                      value={setName} 
                      onChange={e => setSetName(e.target.value)} 
                      placeholder="Protocol Set Label (e.g. Navigation Core)..." 
                      className="bg-transparent border-b-2 border-slate-200 dark:border-white/10 text-3xl font-black text-slate-900 dark:text-white focus:ring-0 focus:border-indigo-500 w-full p-0 transition-colors" 
                    />
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={handleSave} 
                className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3"
              >
                <Save className="w-5 h-5" /> 
                Commit to Registry
              </button>
            </div>

            <div className="space-y-12">
              {(Object.entries(groupedIcons) as [string, Icon[]][]).map(([cat, icons]) => (
                <div key={cat} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{cat}</h3>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-5">
                    {icons.map(icon => (
                      <div key={icon.id} className="group relative aspect-square bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10">
                        <svg className="w-full h-full text-slate-900 dark:text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d={icon.svgPath} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button 
                            type="button" 
                            onClick={() => setCurrentIcons(prev => prev.filter(i => i.id !== icon.id))} 
                            className="p-1.5 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="absolute bottom-2 inset-x-0 text-[8px] font-black text-slate-400 uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity truncate px-2">{icon.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400/40 text-center animate-in fade-in duration-1000">
            <div className="w-32 h-32 rounded-[3rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-8 border-2 border-dashed border-slate-200 dark:border-white/5">
              <LayoutGrid className="w-12 h-12" />
            </div>
            <h4 className="uppercase font-black text-sm tracking-[0.3em] mb-2 text-slate-500 dark:text-slate-400">Studio Idle</h4>
            <p className="text-xs font-medium max-w-[280px] leading-relaxed">
              Initiate a brief to synthesize DNA-aligned vector assets for individual modules or structural collections.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-10 py-6 bg-slate-900 border-t border-white/5 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-500" />
              <span className="text-[9px] font-black uppercase tracking-widest">Neural Vector Engine</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-widest">{currentIcons.length} Vectors in Buffer</span>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Protocol Version 2.5-VEC</span>
         </div>
      </div>
    </div>
  );
};

export default AIIconStudio;
