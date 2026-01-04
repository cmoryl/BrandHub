import React, { useState } from 'react';
import { Shield, Key, User, ArrowRight, Loader2, AlertCircle, ArrowLeft, Bookmark } from 'lucide-react';
import Logo from './Logo';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulated Handshake
    await new Promise(r => setTimeout(r, 1200));

    if (username === 'admin' && password === 'protocol2025') {
      if (rememberMe) {
        localStorage.setItem('admin_session_active', 'true');
      }
      onSuccess();
    } else {
      setError('Neural handshake rejected: Credentials invalid.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-left">
          {/* Accent Glow */}
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-10 transform scale-90">
              <Logo size="lg" variant="admin" textClassName="text-white" />
            </div>

            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Admin Authorization</h2>
              <p className="text-sm text-slate-500 font-medium">Verify credentials to unlock master governance protocols.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Identity..."
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-white outline-none"
                  />
                </div>

                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access Key..."
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-white outline-none"
                  />
                </div>
              </div>

              {/* Memory Option */}
              <div className="flex items-center gap-3 px-1">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-5 h-5 rounded-lg border-2 border-white/10 bg-white/5 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  <Shield className="absolute pointer-events-none w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity" />
                </div>
                <label htmlFor="remember" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors">
                   Persist Authorization protocol
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-widest text-left">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden rounded-2xl p-[2px] transition-all duration-700 hover:scale-[1.02] shadow-xl w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <div className="relative bg-slate-900 dark:bg-[#02030a] rounded-2xl px-8 py-5 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <>
                      <span className="text-sm font-black text-white tracking-widest uppercase">Validate Protocol</span>
                      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <button 
              onClick={onCancel}
              className="mt-8 text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-3 h-3" /> Abort Authorization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;