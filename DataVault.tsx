// @ts-nocheck
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { 
  Database, Download, Upload, RefreshCw, AlertTriangle, ShieldCheck, 
  FileJson, CheckCircle2, Server, Cloud, Link2, Unlink, Activity, 
  RotateCcw, Box, History, Trash2, Save, Shield, Loader2
} from 'lucide-react';
import { Brand, RestorePoint } from '../types';
import { backend } from '../services/backendService';
import { getDirectImageUrl } from '../utils/linkUtils';

interface DataVaultProps {
  brands: Brand[];
  onImport: (brands: Brand[]) => void;
  onReset: () => void;
}

const DataVault: React.FC<DataVaultProps> = ({ brands, onImport, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Diagnostics State
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'good' | 'warning' | 'critical'>('good');

  // Restore Point State
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupLabel, setBackupLabel] = useState('');

  useEffect(() => {
    loadRestorePoints();
  }, []);

  const loadRestorePoints = async () => {
    const pts = await backend.fetchRestorePoints();
    setRestorePoints(pts);
  };

  const handleCreateRestorePoint = async () => {
    setIsBackingUp(true);
    try {
      await backend.createRestorePoint(backupLabel || `Manual Freeze`, brands);
      setBackupLabel('');
      await loadRestorePoints();
    } catch (e) {} finally { setIsBackingUp(false); }
  };

  const handleRestoreFromPoint = (pt: RestorePoint) => {
    if (window.confirm(`PROTOCOL REVERSION: Overwrite current state with "${pt.label}" from ${new Date(pt.timestamp).toLocaleString()}?`)) {
      onImport(pt.data);
    }
  };

  const handleDeleteRestorePoint = async (id: string) => {
    await backend.deleteRestorePoint(id);
    await loadRestorePoints();
  };

  const dataSize = new Blob([JSON.stringify(brands)]).size;
  
  const handleExport = () => {
    const dataStr = JSON.stringify(brands, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brandhub-protocol-export-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 text-left space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-blue-600 rounded-[1.5rem] text-white shadow-2xl shadow-blue-500/20"><Database className="w-10 h-10" /></div>
          <div><h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">System Vault</h1><p className="text-slate-500 dark:text-slate-400 font-medium">Enterprise persistence & protocol orchestration.</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
            {/* Active Registry Area */}
            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8"><h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight"><Server className="w-6 h-6 text-blue-500" />Active Registry</h2><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{brands.length} Nodes Online</span></div>
                <div className="space-y-3">
                   {brands.slice(0, 8).map(b => (
                     <div key={b.id} className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0"><img src={getDirectImageUrl(b.logoUrl)} className="max-h-full max-w-full object-contain" /></div>
                           <div className="text-left"><span className="block text-sm font-black text-slate-200 uppercase">{b.name}</span><span className="block text-[9px] text-slate-500 uppercase tracking-widest">{b.industry}</span></div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right hidden md:block"><span className="block text-[8px] font-black text-slate-600 uppercase">Weight</span><span className="block text-xs font-mono text-slate-400">{(new Blob([JSON.stringify(b)]).size / 1024).toFixed(1)} KB</span></div>
                           <div className={`w-2 h-2 rounded-full ${b.isVisible ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                        </div>
                     </div>
                   ))}
                   {brands.length > 8 && <div className="text-center pt-4"><p className="text-[9px] font-black uppercase text-slate-600 tracking-[0.3em]">Registry Continues: {brands.length - 8} Additional Nodes Linked</p></div>}
                </div>
            </div>

            {/* Restore Point Protocol */}
            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div className="space-y-2 text-left"><h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight"><History className="w-6 h-6 text-indigo-500" />Restore Points</h2><p className="text-slate-500 text-sm font-medium">Internal version snapshots for rapid protocol recovery.</p></div>
                  <div className="flex gap-3"><input value={backupLabel} onChange={e => setBackupLabel(e.target.value)} placeholder="Snapshot Label..." className="px-5 py-3 rounded-xl bg-slate-950 border border-white/5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500" /><button onClick={handleCreateRestorePoint} disabled={isBackingUp} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50">{isBackingUp ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Freeze Protocol</button></div>
               </div>
               <div className="grid gap-3">
                  {restorePoints.length > 0 ? restorePoints.map(pt => (
                    <div key={pt.id} className="flex items-center justify-between p-5 bg-slate-900/60 border border-white/5 rounded-2xl group hover:border-indigo-500/20 transition-all">
                       <div className="flex items-center gap-5 text-left">
                          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl"><History className="w-5 h-5" /></div>
                          <div><span className="block font-black text-slate-200 uppercase text-sm tracking-tight">{pt.label}</span><span className="block text-[9px] text-slate-500 uppercase font-mono">{new Date(pt.timestamp).toLocaleString()} • {pt.brandCount} Nodes</span></div>
                       </div>
                       <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleRestoreFromPoint(pt)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all"><RotateCcw className="w-3 h-3" /> Revert State</button>
                          <button onClick={() => handleDeleteRestorePoint(pt.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                  )) : (
                    <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-center opacity-30"><History className="w-12 h-12 mx-auto mb-4" /><p className="text-xs font-black uppercase tracking-widest">No Manual Restore Points Found</p></div>
                  )}
               </div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 shadow-2xl text-left">
                <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight"><Activity className="w-5 h-5 text-emerald-500" />Vitals Audit</h2>
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-white/5 mb-8"><span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Storage Allocation</span><div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2"><div className="h-full bg-blue-600" style={{width: `${Math.min(100, (dataSize / (5*1024*1024)) * 100)}%`}} /></div><div className="flex justify-between text-[9px] font-mono text-slate-600 uppercase font-bold"><span>{(dataSize/1024).toFixed(1)} KB consumed</span><span>5.0 MB Limit</span></div></div>
                <div className="space-y-3"><button onClick={handleExport} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-slate-300 border border-white/5"><span className="flex items-center gap-2"><Download className="w-4 h-4" /> Export Master JSON</span></button><button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-slate-300 border border-white/5"><span className="flex items-center gap-2"><Upload className="w-4 h-4" /> Import Data Snapshot</span><input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onload = (ev) => { try { onImport(JSON.parse(ev.target.result)); } catch(err){} }; r.readAsText(f); } }} className="hidden" accept=".json" /></button></div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-red-900/20 rounded-[2rem] p-8 shadow-2xl text-left">
                <div className="flex items-center gap-3 text-red-500 font-black uppercase text-[10px] tracking-[0.3em] mb-6"><AlertTriangle className="w-4 h-4" />Nuclear Protocol</div>
                <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">Overwrite all custom nodes with default factory architecture.</p>
                <button onClick={() => window.confirm('Nuclear Wipe Requested. Proceed?') && onReset()} className="w-full py-4 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl border border-red-500/20 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3"><RotateCcw className="w-4 h-4" /> Reset Persistence</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataVault;