// @ts-nocheck
import React, { useState } from 'react';
import { Send, CheckCircle2, FileQuestion, Loader2, Target, Mail, MessageSquare } from 'lucide-react';
import { Brand } from '../types';

interface QRCodeRequestProps {
  brand: Brand;
}

const QRCodeRequest: React.FC<QRCodeRequestProps> = ({ brand }) => {
  const [formData, setFormData] = useState({
    url: '',
    purpose: 'Marketing Material',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-[3rem] p-12 text-center animate-in fade-in zoom-in duration-500 h-full flex flex-col justify-center backdrop-blur-md">
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Request Transmitted</h3>
        <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium">
          The governance request for <strong className="text-white">{brand.name}</strong> digital markers has been queued. ETA: &lt;24 hours.
        </p>
        <button 
          onClick={() => { setIsSuccess(false); setFormData({ url: '', purpose: 'Marketing Material', notes: '' }); }}
          className="text-emerald-400 font-black uppercase text-[10px] tracking-widest hover:text-emerald-300 transition-colors"
        >
          Submit Additional Protocol
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 h-full flex flex-col shadow-2xl text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><FileQuestion className="w-48 h-48 text-blue-500" /></div>
      
      <div className="flex items-start gap-5 mb-10 relative z-10">
        <div className="p-3.5 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-500">
          <FileQuestion className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Request Redundancy</h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Order tracking-enabled, vector-optimized QR modules directly from the design orchestrators.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 flex-1 relative z-10">
        <div className="space-y-6">
            <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                    <Target className="w-3 h-3" /> Target URL
                </label>
                <input
                    required
                    type="url"
                    placeholder="https://company.com/campaign"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-slate-950 text-white text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                        Primary Usage
                    </label>
                    <select
                        value={formData.purpose}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-slate-950 text-white text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option>Print Material</option>
                        <option>Digital / Web</option>
                        <option>Event Signage</option>
                        <option>Internal Protocol</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                        <Mail className="w-3 h-3" /> Requestor ID
                    </label>
                    <input
                        required
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-slate-950 text-white text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                    <MessageSquare className="w-3 h-3" /> Synthesis Notes
                </label>
                <textarea
                    rows={4}
                    placeholder="e.g. Requesting specific sizing for 4k exhibition screens..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-6 py-5 rounded-3xl border border-white/5 bg-slate-950 text-white text-sm font-medium focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                />
            </div>
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-600/20"
        >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {isSubmitting ? 'Transmitting Protocol...' : 'Dispatch Request'}
        </button>
      </form>
    </div>
  );
};

export default QRCodeRequest;
