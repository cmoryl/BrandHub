
import { 
  Sparkles, Send, Loader2, Copy, CheckCircle2, Globe, MessageSquare, 
  ExternalLink, ImageIcon, BrainCircuit, AlertCircle, Cpu
} from 'lucide-react';
import React, { useState } from 'react';
import { Brand } from '../types';
import { 
  generateBrandCopy, researchBrandTrends, generateBrandVisual 
} from '../services/geminiService';

interface AIAssistantProps {
  brand: Brand;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ brand }) => {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'copy' | 'research' | 'visual'>('copy');
  const [contentType, setContentType] = useState<'Social Post' | 'Blog Intro' | 'Email' | 'Tagline' | 'Strategy'>('Social Post');
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [output, setOutput] = useState<{ text?: string, sources?: any[], imageUrl?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setOutput({});
    
    try {
      // Authorization Check for Pro Features
      if (mode === 'visual' || isDeepResearch) {
        // @ts-ignore
        if (typeof window.aistudio !== 'undefined' && !await window.aistudio.hasSelectedApiKey()) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      }
      
      if (mode === 'copy') {
        const result = await generateBrandCopy(brand, topic, contentType, isDeepResearch);
        setOutput({ text: result });
      } else if (mode === 'research') {
        const result = await researchBrandTrends(brand, topic);
        setOutput(result);
      } else if (mode === 'visual') {
        const result = await generateBrandVisual(brand, topic);
        setOutput({ imageUrl: result });
      }
    } catch (e: any) {
      console.error("Synthesis Error:", e);
      const errorMessage = e.message || String(e);
      if (errorMessage.includes("Requested entity was not found")) {
        setError("Protocol Authorization Fault. Please re-select your valid API Key.");
        // @ts-ignore
        if (typeof window.aistudio !== 'undefined') {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (output.text) {
      navigator.clipboard.writeText(output.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-0 h-full bg-white dark:bg-slate-950">
      {/* Controls */}
      <div className="border-r border-slate-200 dark:border-slate-800 p-8 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Intelligence Studio</h3>
            <p className="text-xs text-slate-500 font-medium">Grounded in organizational DNA</p>
          </div>
        </div>

        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
          {(['copy', 'research', 'visual'] as const).map((m) => (
            <button 
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 min-w-[80px] py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === m ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m === 'copy' && <MessageSquare className="w-3.5 h-3.5" />}
              {m === 'research' && <Globe className="w-3.5 h-3.5" />}
              {m === 'visual' && <ImageIcon className="w-3.5 h-3.5" />}
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-8 flex-1">
          {brand.intelligenceBrain && (
             <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/20 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-left">
                   <Cpu className="w-4 h-4 text-emerald-500 animate-pulse" />
                   <div>
                      <span className="block text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Backend Brain Linked</span>
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tight">Applying custom organizational standards</p>
                   </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             </div>
          )}

          {mode === 'copy' && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-left">Content Protocol</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Social Post', 'Blog Intro', 'Email', 'Tagline', 'Strategy'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setContentType(type)}
                      className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        contentType === type
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Deep Reasoning</span>
                    <span className="text-[9px] text-slate-500">High-budget thinking</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDeepResearch(!isDeepResearch)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isDeepResearch ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDeepResearch ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-left">
              {mode === 'copy' ? 'Campaign Theme' : mode === 'research' ? 'Search Query' : 'Visual Brief'}
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                mode === 'copy' ? "e.g., Announcing our new sustainability initiative..." : 
                mode === 'research' ? "e.g., Current trends in enterprise SaaS marketing 2025..." :
                "e.g., A minimalist workspace representing global connectivity..."
              }
              className="w-full h-40 px-6 py-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none font-medium text-sm leading-relaxed"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed font-medium text-left">{error}</p>
          </div>
        )}

        <button
          onClick={handleRun}
          disabled={isLoading || !topic.trim()}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Synthesizing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Execute Protocol
            </>
          )}
        </button>
      </div>

      {/* Output Panel */}
      <div className="bg-slate-50 dark:bg-[#010410] p-10 flex flex-col h-full relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Draft Output</span>
          {output.text && mode === 'copy' && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
            >
              {isCopied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>

        <div className="flex-1 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 relative z-10 overflow-y-auto custom-scrollbar">
            {output.text || output.imageUrl ? (
              <div className="space-y-10 animate-in fade-in zoom-in duration-700 text-left">
                 {output.text && (
                   <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-loose text-lg font-light">
                     {output.text}
                   </p>
                 )}

                 {output.imageUrl && (
                   <div className="space-y-6">
                     <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                       <img src={output.imageUrl} alt="Generated Campaign Visual" className="w-full h-auto" />
                     </div>
                     <button className="flex items-center gap-2 text-xs font-black uppercase text-blue-500 tracking-widest" onClick={() => window.open(output.imageUrl)}>
                       View Full Resolution <ExternalLink className="w-4 h-4" />
                     </button>
                   </div>
                 )}

                 {output.sources && output.sources.length > 0 && (
                   <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cited Sources</h4>
                      <div className="grid gap-3">
                         {output.sources.map((source, idx) => (
                           <a 
                             key={idx} 
                             href={source.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800 hover:border-blue-500/50 transition-all group"
                           >
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate pr-4">{source.title || source.uri}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
                           </a>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6 opacity-40">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h4 className="font-black uppercase tracking-[0.2em] text-sm mb-2">Interface Neutral</h4>
                <p className="text-xs max-w-[240px] leading-relaxed opacity-60">
                  Select a module and provide a brief to generate brand-grounded intelligence or visuals.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
