
import React, { useState, useEffect } from 'react';
import { 
  Rocket, BrainCircuit, Sparkles, Wand2, Loader2, CircleCheckBig as CheckCircle2, 
  Zap, Box, ShieldCheck, ArrowRight, Activity, Terminal, Layers
} from 'lucide-react';
import { Brand } from '../types';
import { synthesizeBrandIdentity } from '../services/geminiService';
import { backend } from '../services/backendService';

interface RunthroughWizardProps {
  onComplete: (brand: Brand) => void;
  onCancel: () => void;
}

const RunthroughWizard: React.FC<RunthroughWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'input' | 'synthesizing' | 'review'>('input');
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [synthesizedBrand, setSynthesizedBrand] = useState<Brand | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `[PROTO] ${msg}`]);
  };

  const startSynthesis = async () => {
    if (!name || !industry) return;
    setStep('synthesizing');
    addLog("Initializing Neural Bridge...");
    
    try {
      await new Promise(r => setTimeout(r, 800));
      addLog(`Analyzing sector: ${industry}...`);
      
      const identity = await synthesizeBrandIdentity({
        name,
        industry,
        description: `A forward-thinking organization in the ${industry} sector.`
      });
      
      addLog("Constructing Identity Core...");
      await new Promise(r => setTimeout(r, 1000));
      addLog("Mapping Chromatic Primitives...");
      
      const newBrand = backend.migrateAndRepair({
        id: `synth-${Date.now()}`,
        name,
        industry,
        missionStatement: identity.missionStatement,
        archetype: identity.archetype,
        toneOfVoice: identity.toneOfVoice,
        values: identity.coreValues?.map((v: any) => ({ text: v.text, icon: v.icon || 'Zap' })),
        description: `Synthetic brand node generated during protocol runthrough. Optimized for the ${industry} sector.`,
        updatedAt: Date.now()
      });

      setSynthesizedBrand(newBrand);
      addLog("Synthesis complete. Establishing retinal handshake.");
      await new Promise(r => setTimeout(r, 1200));
      setStep('review');
    } catch (error) {
      console.error(error);
      addLog("FAULT: Synthesis interrupted. Reverting to backup protocols.");
    }
  };

  const handleFinalize = async () => {
    if (!synthesizedBrand) return;
    setIsFinalizing(true);
    await new Promise(r => setTimeout(r, 1000));
    onComplete(synthesizedBrand);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] bg-[#02030a] rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in duration-700">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
        <Rocket className="w-64 h-64 text-blue-500 rotate-12" />
      </div>

      <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Synthetic Runthrough</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em]">Automated Brand Orchestration</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <Zap className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center text-center">
        {step === 'input' && (
          <div className="max-w-md w-full space-y-10 animate-in fade-in duration-500">
            <div className="space-y-4">
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Initiate Protocol</h3>
               <p className="text-slate-500 text-sm font-medium">Provide basic identifiers to trigger a full-spectrum brand synthesis.</p>
            </div>
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-left px-1">Organizational Identifier</label>
                 <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Nexus Dynamics"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-left px-1">Primary Sector</label>
                 <input 
                  type="text" 
                  value={industry} 
                  onChange={e => setIndustry(e.target.value)} 
                  placeholder="e.g. Deep Sea Logistics"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                 />
               </div>
               <button 
                onClick={startSynthesis}
                disabled={!name || !industry}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
               >
                 <Wand2 className="w-5 h-5" /> Execute Synthesis
               </button>
            </div>
          </div>
        )}

        {step === 'synthesizing' && (
          <div className="space-y-12 animate-in fade-in duration-500 w-full max-w-lg">
             <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative z-10 w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl animate-spin-slow">
                   <Sparkles className="w-12 h-12 text-indigo-500" />
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Synthesizing DNA</h3>
                <div className="flex items-center justify-center gap-2">
                   <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                   <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em]">Bypassing manual configuration...</p>
                </div>
             </div>
             <div className="bg-white/5 rounded-2xl p-6 border border-white/5 font-mono text-[10px] text-left space-y-1 text-indigo-400/80 min-h-[140px]">
                {logs.map((log, i) => (
                  <div key={i} className="animate-in slide-in-from-left-2 duration-300">
                    <span className="opacity-40 mr-2">></span> {log}
                  </div>
                ))}
             </div>
          </div>
        )}

        {step === 'review' && synthesizedBrand && (
          <div className="w-full space-y-10 animate-in zoom-in duration-700">
             <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20"><ShieldCheck className="w-20 h-20 text-emerald-500" /></div>
                <div className="relative z-10 text-left space-y-6">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Protocol Success</span>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{synthesizedBrand.name}</h3>
                   </div>
                   <div className="flex gap-4">
                      <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Archetype</span>
                         <span className="text-xs font-bold text-white uppercase">{synthesizedBrand.archetype}</span>
                      </div>
                      <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Sector</span>
                         <span className="text-xs font-bold text-white uppercase">{synthesizedBrand.industry}</span>
                      </div>
                   </div>
                   <p className="text-lg text-slate-300 font-medium italic leading-relaxed">"{synthesizedBrand.missionStatement}"</p>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-left">
                   <Zap className="w-5 h-5 text-indigo-500 mb-3" />
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Generative Tone</h4>
                   <p className="text-[9px] text-slate-500 uppercase">{synthesizedBrand.toneOfVoice.join(' • ')}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-left">
                   <Activity className="w-5 h-5 text-emerald-500 mb-3" />
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Health Score</h4>
                   <p className="text-[9px] text-slate-500 uppercase">98% Readiness</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-left">
                   <Layers className="w-5 h-5 text-blue-500 mb-3" />
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Section Count</h4>
                   <p className="text-[9px] text-slate-500 uppercase">{synthesizedBrand.sections.length} Active Modules</p>
                </div>
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => setStep('input')}
                  className="flex-1 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all hover:text-white"
                >
                  Discard & Re-Synth
                </button>
                <button 
                  onClick={handleFinalize}
                  disabled={isFinalizing}
                  className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
                >
                  {isFinalizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Deploy Brand Node</>}
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-white/5 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Build Protocol: v2.5-AUTO</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Handshake Valid</span>
         </div>
      </div>
    </div>
  );
};

export default RunthroughWizard;
