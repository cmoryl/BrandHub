import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './Sidebar';
import BrandCard from './BrandCard';
import BrandDetail from './BrandDetail';
import BrandEditor from './BrandEditor';
import DataVault from './DataVault';
import StabilityMonitor from './StabilityMonitor';
import Settings from './Settings';
import OrionBackground from './OrionBackground';
import BrandBackground from './BrandBackground';
import Logo from './Logo';
import AdminLogin from './AdminLogin';
import RunthroughWizard from './RunthroughWizard';
import { backend } from '../services/backendService';
import { useBrandStore } from '../store/brandStore';
import { useAutoSave } from '../hooks/useAutoSave';
import { STORAGE_KEY } from '../constants';
import { Brand, View, Role } from '../types';
import { getDirectImageUrl } from '../utils/linkUtils';
import { 
  Plus, Shield, Search, ArrowRight, Command, 
  Bell, CheckCircle2, AlertCircle, X, Moon, Sun, 
  Loader2, History, Lock, Eye, Radio, Clock, Building2, Box, Activity, Rocket
} from 'lucide-react';

const FAVORITES_KEY = 'brand_favorites';
const DEFAULT_APP_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='10' fill='%230033A0'/%3E%3Cpath d='M21 19v-6a2 2 0 0 0-1-1.73l-4-2.27a2 2 0 0 0-2 0l-4 2.27A2 2 0 0 0 11 13v6a2 2 0 0 0 1 1.73l4 2.27a2 2 0 0 0 2 0l4-2.27A2 2 0 0 0 21 19z' fill='white'/%3E%3Ccircle cx='16' cy='16' r='2' fill='%2338bdf8'/%3E%3C/svg%3E";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const BackgroundElements = ({ isDarkMode, hideGlobal }: { isDarkMode: boolean, hideGlobal: boolean }) => (
  <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000 ${hideGlobal ? 'opacity-0' : 'opacity-100'}`}>
      <OrionBackground isDarkMode={isDarkMode} />
      <div className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full filter blur-[160px] animate-blob transition-all duration-1000 ${
        isDarkMode 
          ? 'bg-blue-600/10 mix-blend-screen opacity-40' 
          : 'bg-blue-400/5 mix-blend-multiply opacity-30'
      }`}></div>
      <div className={`absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full filter blur-[160px] animate-blob animation-delay-4000 transition-all duration-1000 ${
        isDarkMode 
          ? 'bg-indigo-600/10 mix-blend-screen opacity-40' 
          : 'bg-indigo-400/5 mix-blend-multiply opacity-30'
      }`}></div>
  </div>
);

type SortMode = 'recent' | 'companies' | 'products';

const App: React.FC = () => {
  const { 
    brands, setBrands, updateBrand, removeBrand, addBrand,
    isSyncing, lastSync, systemHealth, updateSystemHealth
  } = useBrandStore();
  
  const [isBooting, setIsBooting] = useState(true);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [showWizard, setShowWizard] = useState(false);
  
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return localStorage.getItem('admin_session_active') === 'true' ? 'admin' : 'public';
  });

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useAutoSave();

  useEffect(() => {
    const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    
    if (selectedBrand && (currentView === 'brand-detail' || currentView === 'brand-editor')) {
      document.title = `${selectedBrand.name} | BrandHub`;
      const brandIcon = selectedBrand.brandIcon?.url || selectedBrand.logoUrl;
      link.href = brandIcon ? getDirectImageUrl(brandIcon) : DEFAULT_APP_FAVICON;
    } else {
      document.title = 'BrandHub | Global Identity Orchestration';
      link.href = DEFAULT_APP_FAVICON;
    }
    
    if (!document.head.contains(link)) {
      document.head.appendChild(link);
    }
  }, [selectedBrand, currentView]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await backend.fetchBrands();
        setBrands(data);
        updateSystemHealth({ status: 'nominal', message: 'Protocol handshake verified.' });
      } catch (err) {
        addToast("Database Connection Fault", "error");
        updateSystemHealth({ status: 'critical', message: 'Database link failure.' });
      } finally {
        setIsBooting(false);
      }
    };
    initialize();
  }, [addToast, setBrands, updateSystemHealth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView === 'landing' && e.shiftKey && e.key === 'A') {
        setCurrentView('login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleUpdateBrand = async (updatedBrand: Brand, source: 'top-level' | 'sections' = 'top-level') => {
    const repaired = backend.migrateAndRepair(updatedBrand, source);
    repaired.updatedAt = Date.now();
    updateBrand(repaired);
    setSelectedBrand(repaired);
    addToast('Protocol Committed', 'success');
  };

  const handleDeleteBrand = async (brandId: string) => {
    try {
      await backend.deleteBrand(brandId);
      removeBrand(brandId);
      setSelectedBrand(null);
      setCurrentView('dashboard');
      addToast('Protocol Decommissioned', 'success');
    } catch (err) {
      console.error("Purge Error:", err);
      addToast('Decommissioning Fault', 'error');
    }
  };

  const handleImportBrands = async (importedBrands: Brand[]) => {
    const repaired = importedBrands.map(b => backend.migrateAndRepair(b, 'top-level'));
    setBrands(repaired);
    addToast('System Restored', 'success');
  };

  const handleResetBrands = async () => {
    const defaults = await backend.factoryReset();
    setBrands(defaults);
    addToast('Factory Reset Complete', 'success');
  };

  const handleAdminSuccess = async () => {
    setCurrentRole('admin');
    setCurrentView('dashboard');
    addToast('Admin Privileges Granted', 'success');
  };

  const handleWizardComplete = (newBrand: Brand) => {
    addBrand(newBrand);
    setSelectedBrand(newBrand);
    setShowWizard(false);
    setCurrentView('brand-detail');
    addToast('Synthetic Identity Deployed', 'success');
  };

  const filteredBrands = useMemo(() => {
    let list = (currentRole === 'public' ? brands.filter(b => b.isVisible) : brands)
      .filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (sortMode === 'recent') {
      return [...list].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    } else if (sortMode === 'companies') {
      return list.filter(b => b.entityType === 'brand');
    } else if (sortMode === 'products') {
      return list.filter(b => b.entityType === 'product');
    }
    return list;
  }, [brands, currentRole, searchQuery, sortMode]);

  const recentUpdates = useMemo(() => {
    return [...brands].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 4);
  }, [brands]);

  const groupedBrands = useMemo(() => {
    if (sortMode !== 'recent') {
      return filteredBrands.reduce((acc, brand) => {
        const category = brand.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(brand);
        return acc;
      }, {} as Record<string, Brand[]>);
    }
    return { 'Recent Activity': filteredBrands };
  }, [filteredBrands, sortMode]);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const activeBrandSettings = useMemo(() => {
    if ((currentView === 'brand-detail' || currentView === 'brand-editor') && selectedBrand?.backgroundSettings) {
      return selectedBrand.backgroundSettings;
    }
    return null;
  }, [currentView, selectedBrand]);

  if (isBooting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#02030a] text-white font-sans">
        <BackgroundElements isDarkMode={true} hideGlobal={false} />
        <div className="relative z-10 flex flex-col items-center gap-8">
           <Logo size="lg" variant="default" textClassName="text-white" />
           <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Connecting to Brand Grid</p>
           </div>
        </div>
      </div>
    );
  }

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#02030a] relative overflow-hidden font-sans text-left">
        <BackgroundElements isDarkMode={true} hideGlobal={false} />
        <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">
          <div className="mb-12 transform animate-in fade-in zoom-in duration-1000">
            <Logo size="xl" variant="default" textClassName="text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Global Identity <br/> <span className="text-blue-500">Orchestration</span>
          </h1>

          <p className="text-slate-400 text-lg lg:text-xl max-w-2xl mb-12 leading-relaxed font-light animate-in fade-in duration-1000 delay-500 text-center">
            A high-fidelity platform for managing brand standards, asset synchronicity, and generative intelligence protocols.
          </p>

          <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
            <button 
              onClick={() => { 
                if (currentRole !== 'admin') setCurrentRole('public'); 
                setCurrentView('dashboard'); 
              }}
              className="group relative flex items-center gap-4 bg-white text-slate-950 px-12 py-6 rounded-full font-black uppercase text-sm tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Enter Protocol Hub
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>

            <button 
              onClick={() => setCurrentView('login')}
              className="group flex items-center gap-2 px-6 py-2 text-slate-500 hover:text-blue-400 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <Lock className="w-3 h-3 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Governance Protocol</span>
            </button>
          </div>

          <div className="mt-24 flex flex-wrap justify-center gap-12 text-slate-500 animate-in fade-in duration-1000 delay-1000">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Engine</span>
              <span className="text-xs font-bold text-white uppercase">Gemini 3.0 Pro</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Build</span>
              <span className="text-xs font-bold text-white uppercase">v2.1 Stable</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network State</span>
              <span className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Grounded
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className={`min-h-screen transition-all duration-1000 font-sans ${isDarkMode ? 'bg-[#02030a]' : 'bg-slate-50'}`}>
        <BackgroundElements isDarkMode={isDarkMode} hideGlobal={false} />
        <AdminLogin 
          onSuccess={handleAdminSuccess}
          onCancel={() => setCurrentView('landing')}
        />
      </div>
    );
  }

  const isNominal = systemHealth.status === 'nominal';

  return (
    <div className={`flex min-h-screen transition-all duration-1000 font-sans ${isDarkMode ? 'bg-[#02030a]' : 'bg-slate-50'}`}>
      <BackgroundElements isDarkMode={isDarkMode} hideGlobal={!!activeBrandSettings && activeBrandSettings.style !== 'none'} />
      {activeBrandSettings && <BrandBackground settings={activeBrandSettings} isDarkMode={isDarkMode} />}
      
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 dark:border-white/10 animate-in slide-in-from-right-8 duration-500 ${toast.type === 'success' ? 'bg-emerald-50/90 dark:bg-emerald-500/90 text-slate-900 dark:text-white' : toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-white" /> : toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            <span className="font-bold text-sm uppercase tracking-widest">{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-2 opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <Sidebar 
        activeView={currentView} 
        role={currentRole}
        isSyncing={isSyncing}
        lastSync={lastSync}
        onNavigate={() => { setCurrentView('dashboard'); setSelectedBrand(null); }} 
        onSwitchRole={() => { 
          localStorage.removeItem('admin_session_active');
          setCurrentRole('public'); 
          setCurrentView('landing'); 
          setSelectedBrand(null); 
        }}
        onLoginRedirect={() => setCurrentView('login')}
        favoriteBrands={brands.filter(b => favorites.includes(b.id))}
        onBrandClick={(b) => { setSelectedBrand(b); setCurrentView('brand-detail'); }}
        onVaultClick={() => setCurrentView('vault')}
        onStabilityClick={() => setCurrentView('stability')}
        onSettingsClick={() => setCurrentView('settings')}
        selectedBrand={selectedBrand}
        onActiveBrandClick={() => selectedBrand && setCurrentView('brand-detail')}
      />
      <main className="flex-1 ml-20 lg:ml-64 relative z-10 flex flex-col">
        {currentView === 'dashboard' && (
          <div className="flex flex-col flex-1">
             <div className={`w-full backdrop-blur-md border-b py-3 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-20 transition-colors duration-500 ${isDarkMode ? (isNominal ? 'bg-slate-900/40 border-white/5' : 'bg-amber-900/40 border-amber-500/20') : (isNominal ? 'bg-white/80 border-slate-200' : 'bg-amber-50/80 border-amber-200')}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center gap-2">
                    <Radio className={`w-3 h-3 animate-pulse ${isNominal ? (isDarkMode ? 'text-sky-400' : 'text-blue-600') : 'text-amber-400'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isNominal ? (isDarkMode ? 'text-sky-400' : 'text-blue-600') : 'text-amber-400'}`}>System Pulse</span>
                  </div>
                  <div className={`h-3 w-px ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <div className="flex items-center gap-6 overflow-hidden">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                       {isNominal ? 'Recent Protocol Updates:' : 'Integrity Observation:'}
                    </span>
                    <div className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-1000">
                       {isNominal ? recentUpdates.map(b => (
                         <button 
                            key={b.id} 
                            onClick={() => { setSelectedBrand(b); setCurrentView('brand-detail'); }}
                            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                          >
                            <span className={`text-[9px] font-bold uppercase transition-colors ${isDarkMode ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-blue-600'}`}>{b.name}</span>
                            <span className="text-[8px] font-medium text-slate-400 dark:text-slate-600 uppercase">{getTimeAgo(b.updatedAt)}</span>
                         </button>
                       )) : (
                         <span className="text-[9px] font-bold text-amber-500 uppercase animate-pulse">{systemHealth.message}</span>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5">
                      <div className={`w-1 h-1 rounded-full ${isNominal ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isNominal ? 'text-slate-400 dark:text-slate-500' : 'text-amber-500'}`}>
                         {isNominal ? 'Network Stable' : 'Action Required'}
                      </span>
                   </div>
                </div>
             </div>

             <div className="max-w-7xl mx-auto p-6 lg:p-12 animate-in fade-in duration-700 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 text-left">
                    <div className="space-y-2">
                      <h1 className={`text-4xl lg:text-6xl font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Brand Index</h1>
                      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium flex items-center gap-2">
                         <Command className="w-4 h-4" /> Global Identity Orchestration
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="text" placeholder="Filter Protocols..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-12 pr-6 py-4 rounded-2xl border backdrop-blur-md focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold min-w-[300px] ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}
                          />
                       </div>
                       {currentRole === 'admin' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedBrand(null); setCurrentView('brand-editor'); }} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                            <Plus className="w-5 h-5" /> Manual
                          </button>
                          <button onClick={() => setShowWizard(true)} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                            <Rocket className="w-5 h-5" /> Synthetic
                          </button>
                        </div>
                       )}
                    </div>
                </div>

                {showWizard && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl">
                    <RunthroughWizard onComplete={handleWizardComplete} onCancel={() => setShowWizard(false)} />
                  </div>
                )}

                <div className={`flex p-1 rounded-2xl w-fit mb-12 border ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                   <button onClick={() => setSortMode('recent')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortMode === 'recent' ? (isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 shadow-md') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                     <Clock className="w-3.5 h-3.5" /> Most Recent
                   </button>
                   <button onClick={() => setSortMode('companies')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortMode === 'companies' ? (isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 shadow-md') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                     <Building2 className="w-3.5 h-3.5" /> Brands
                   </button>
                   <button onClick={() => setSortMode('products')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortMode === 'products' ? (isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 shadow-md') : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                     <Box className="w-3.5 h-3.5" /> Products
                   </button>
                </div>

                {(Object.entries(groupedBrands) as [string, Brand[]][]).map(([category, brands]) => (
                  <div key={category} className="mb-20 text-left">
                    <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-[0.4em] flex items-center gap-4">
                      <span className="whitespace-nowrap">{category}</span>
                      <div className={`h-px w-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`} />
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                      {brands.map((brand) => (
                        <BrandCard 
                            key={brand.id} 
                            brand={brand} 
                            onClick={(b) => { setSelectedBrand(b); setCurrentView('brand-detail'); }} 
                            isFavorite={favorites.includes(brand.id)}
                            toggleFavorite={() => {
                              setFavorites(prev => {
                                const isFav = prev.includes(brand.id);
                                const next = isFav ? prev.filter(id => id !== brand.id) : [...prev, brand.id];
                                localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
                                return next;
                              });
                            }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
        {currentView === 'brand-detail' && selectedBrand && (
          <BrandDetail 
            brand={selectedBrand} 
            brands={brands} 
            isReadOnly={currentRole === 'public'} 
            onBack={() => setCurrentView('dashboard')} 
            onEdit={(b) => { setSelectedBrand(b); setCurrentView('brand-editor'); }} 
            onDelete={handleDeleteBrand}
            onBrandClick={(b) => { setSelectedBrand(b); setCurrentView('brand-detail'); }} 
            isDarkMode={isDarkMode} 
            onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
            onUpdateBrand={(b) => handleUpdateBrand(b, 'sections')} 
          />
        )}
        {currentView === 'brand-editor' && (
          <BrandEditor brand={selectedBrand} isDarkMode={isDarkMode} onUpdateLocal={(b) => setSelectedBrand(b)} onSave={(b) => { handleUpdateBrand(b, 'top-level'); setCurrentView('brand-detail'); }} onCancel={() => setCurrentView('dashboard')} />
        )}
        {currentView === 'vault' && (
           <DataVault brands={brands} onImport={handleImportBrands} onReset={handleResetBrands} />
        )}
        {currentView === 'stability' && (
           <StabilityMonitor brands={brands} />
        )}
        {currentView === 'settings' && (
           <Settings />
        )}
      </main>
      <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-4 px-4 py-2 backdrop-blur-xl border rounded-full animate-in fade-in slide-in-from-bottom-4 ${isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/90 border-slate-200 shadow-xl'}`}>
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-500 animate-bounce' : isNominal ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
             <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
               {isSyncing ? 'Writing...' : isNominal ? 'Integrity Verified' : 'Integrity Fault'}
             </span>
          </div>
          <div className={`h-3 w-px ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
             <History className="w-3.5 h-3.5" />
             <span className="text-[8px] font-bold uppercase tracking-widest">{new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
      </div>
    </div>
  );
};

export default App;