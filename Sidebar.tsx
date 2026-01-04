
import React from 'react';
import { 
  LayoutGrid, Layers, Settings, ArrowLeftCircle, Star, Database, 
  Cloud, RefreshCw, History, Activity, Shield, Lock, AlertTriangle, 
  Wifi, WifiOff 
} from 'lucide-react';
import { Role, View, Brand, SystemHealth } from '../types';
import Logo from './Logo';
import { getDirectImageUrl } from '../utils/linkUtils';
import { useBrandStore } from '../store/brandStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface SidebarProps {
  activeView: View;
  role: Role;
  onNavigate: () => void;
  onSwitchRole: () => void;
  onLoginRedirect?: () => void;
  favoriteBrands?: Brand[];
  onBrandClick?: (brand: Brand) => void;
  onVaultClick?: () => void;
  onStabilityClick?: () => void;
  onSettingsClick?: () => void;
  selectedBrand?: Brand | null;
  onActiveBrandClick?: () => void;
  isSyncing?: boolean;
  lastSync?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  role, 
  onNavigate, 
  onSwitchRole,
  onLoginRedirect,
  favoriteBrands = [],
  onBrandClick,
  onVaultClick,
  onStabilityClick,
  onSettingsClick,
  selectedBrand,
  onActiveBrandClick,
  isSyncing = false,
  lastSync = Date.now()
}) => {
  const systemHealth = useBrandStore(state => state.systemHealth);
  const isOnline = useNetworkStatus();
  const isBrandView = activeView === 'brand-detail' || activeView === 'brand-editor';
  
  const displayIcon = isBrandView && !selectedBrand?.hideBrandIcon && selectedBrand?.brandIcon?.url 
    ? getDirectImageUrl(selectedBrand.brandIcon.url) 
    : null;

  const hasFaults = systemHealth.status !== 'nominal';

  return (
    <div className="w-20 lg:w-64 h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none">
      <div className="h-full flex flex-col transition-colors duration-500 overflow-hidden">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100 dark:border-slate-800 cursor-pointer shrink-0" onClick={onNavigate}>
          {displayIcon ? (
             <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                <div className="w-10 h-10 rounded-xl bg-white backdrop-blur-md p-1.5 shadow-md border border-slate-100 dark:border-white/20 flex items-center justify-center">
                   <img src={displayIcon} className="w-full h-full object-contain" alt="Brand Symbol" />
                </div>
                <div className="hidden lg:flex flex-col text-left">
                   <span className="text-xs font-black uppercase tracking-tighter truncate max-w-[120px] text-slate-900 dark:text-white">{selectedBrand?.name}</span>
                   <span className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Active Protocol</span>
                </div>
             </div>
          ) : (
            <div className="lg:-ml-2 transform scale-75 lg:scale-90 origin-left transition-transform">
              <Logo variant={role} size="md" textClassName="hidden lg:block ml-1 text-slate-900 dark:text-white" />
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 flex flex-col gap-1 shrink-0">
           <div className="flex items-center justify-between">
             <div className={`text-[9px] uppercase tracking-widest font-black ${role === 'admin' ? 'text-blue-600 dark:text-blue-400' : 'text-sky-600 dark:text-sky-400'}`}>
                {role === 'admin' ? 'Admin Portal' : 'Public Viewer'}
             </div>
             <div className="hidden lg:flex items-center gap-1.5">
                {!isOnline ? (
                  <WifiOff className="w-3 h-3 text-red-500 animate-pulse" />
                ) : isSyncing ? (
                  <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${hasFaults ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                )}
                <Cloud className={`w-3 h-3 ${isSyncing ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'}`} />
             </div>
           </div>
           <div className="hidden lg:flex items-center gap-1.5 text-slate-400 dark:text-slate-600">
              <History className="w-2.5 h-2.5" />
              <span className="text-[8px] font-bold uppercase tracking-widest">
                Synced: {new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
           </div>
        </div>

        <nav className="flex-1 py-2 flex flex-col gap-2 px-3 overflow-y-auto custom-scrollbar">
          <button
            onClick={onNavigate}
            className={`flex items-center p-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white'}`}
          >
            <LayoutGrid className="w-5 h-5 shrink-0" />
            <span className="ml-3 font-bold text-sm hidden lg:block uppercase tracking-wide">Brands</span>
          </button>

          <button
            onClick={onActiveBrandClick}
            disabled={!selectedBrand}
            className={`flex items-center p-3 rounded-xl transition-all ${activeView === 'brand-detail' || activeView === 'brand-editor' ? 'bg-indigo-100 text-indigo-600 dark:bg-blue-600/50 dark:text-blue-100 shadow-sm' : selectedBrand ? 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed opacity-50'}`}
          >
            <Layers className="w-5 h-5 shrink-0" />
            <span className="ml-3 font-bold text-sm hidden lg:block uppercase tracking-wide">Active Brand</span>
          </button>

          {role === 'admin' && (
            <>
              <button
                onClick={onVaultClick}
                className={`flex items-center p-3 rounded-xl transition-all ${activeView === 'vault' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white'}`}
              >
                <Database className="w-5 h-5 shrink-0" />
                <span className="ml-3 font-bold text-sm hidden lg:block uppercase tracking-wide">System Vault</span>
              </button>
              <button
                onClick={onStabilityClick}
                className={`group flex items-center p-3 rounded-xl transition-all relative ${activeView === 'stability' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white'}`}
              >
                <Activity className="w-5 h-5 shrink-0" />
                <span className="ml-3 font-bold text-sm hidden lg:block uppercase tracking-wide">Stability Hub</span>
                {hasFaults && <span className="absolute top-3 right-3 lg:right-4 w-2 h-2 bg-amber-500 rounded-full animate-ping" />}
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0">
          <div className="px-3 py-2 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
             <span>Network State</span>
             <span className={isOnline ? 'text-emerald-500' : 'text-red-500 animate-pulse'}>{isOnline ? 'Active' : 'Offline'}</span>
          </div>
          <button 
            onClick={onSettingsClick}
            className={`flex items-center p-3 rounded-xl transition-all w-full ${activeView === 'settings' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800'}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="ml-3 font-bold text-sm hidden lg:block uppercase tracking-wide">Documentation</span>
          </button>
          <button 
            onClick={onSwitchRole}
            className="flex items-center p-3 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 w-full transition-all"
          >
            <ArrowLeftCircle className="w-5 h-5 shrink-0" />
            <span className="ml-3 font-bold text-sm hidden lg:block uppercase tracking-wide">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
