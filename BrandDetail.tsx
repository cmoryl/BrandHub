
// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowLeft, Edit, Moon, Sun, Layout, ArrowRight, FileDown, Loader2, Info, ChevronDown, Check, Monitor, FileText, Sparkles, BrainCircuit, Radio, ImagePlus, Trash2, Video, Maximize2
} from 'lucide-react';
import { Brand, BrandSection, PageFormat } from '../types';
import { SectionRenderer } from './SectionRenderer';
import { getDirectImageUrl } from '../utils/linkUtils';
import { pdfExport } from '../services/pdfExportService';
import { useBrandStore } from '../store/brandStore';
import { backend } from '../services/backendService';
import BrandBackground from './BrandBackground';

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=256&h=256&fit=crop';

interface BrandDetailProps {
  brand: Brand;
  brands: Brand[];
  isReadOnly: boolean;
  onBack: () => void;
  onEdit?: (brand: Brand) => void;
  onDelete?: (brandId: string) => void;
  onBrandClick: (brand: Brand) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onUpdateBrand?: (brand: Brand) => void;
  isFavorite?: boolean;
  toggleFavorite?: () => void;
}

const ExportOverlay = ({ status }: { status: string }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-700">
    <div className="max-w-md w-full p-12 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-white/10 shadow-2xl text-center space-y-10">
      <div className="relative mx-auto w-28 h-28">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 animate-pulse" />
        <div className="relative z-10 w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl rotate-3 animate-pulse">
          <BrainCircuit className="w-12 h-12 text-blue-500" />
        </div>
        <div className="absolute -top-3 -right-3 p-2.5 bg-blue-600 rounded-2xl animate-bounce shadow-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Orchestration</h3>
        <div className="flex items-center justify-center gap-2">
           <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
           <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.25em]">{status}</p>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-shimmer" style={{ width: '100%', backgroundSize: '200% 100%' }} />
      </div>
      
      <p className="text-[11px] text-slate-400 font-bold leading-loose uppercase tracking-widest">
        Synthesizing high-density layouts.<br/>Eliminating dead space & optimizing flow.
      </p>
    </div>
  </div>
);

const BrandDetail: React.FC<BrandDetailProps> = ({ 
  brand, 
  brands,
  onBack, 
  onEdit, 
  onDelete,
  onBrandClick,
  isDarkMode, 
  onToggleTheme,
  isReadOnly,
  onUpdateBrand
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveSection('overview');
  }, [brand.id]);

  const orderedSections = useMemo(() => {
    return [...(brand.sections || [])].sort((a, b) => (a.order || 0) - (a.order || 0));
  }, [brand.sections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    const targets = ['overview', ...orderedSections.map(s => s.id)];
    targets.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [orderedSections]);

  const sidebarSections = orderedSections.filter(s => isReadOnly ? s.isVisible : true);

  const handleExport = useCallback(async (format: PageFormat) => {
    if (isExporting) return;
    setIsExporting(true);
    setShowExportMenu(false);
    setExportStatus('Activating AI Designer...');
    
    try {
      await pdfExport.export(format, 'brand-detail-content-area', brand, isDarkMode, (status) => {
        setExportStatus(status);
      });
    } catch (e) {
      console.error("Export Protocol Failure:", e);
    } finally {
      setIsExporting(false);
      setExportStatus('');
    }
  }, [isExporting, brand, isDarkMode]);

  const handleDeleteBrand = async () => {
    if (onDelete && window.confirm(`PROTOCOL WARNING: Irreversibly purge all governance data for "${brand.name}"?`)) {
      onDelete(brand.id);
    }
  };

  const handleSectionUpdate = (sectionId: string, updates: Partial<BrandSection>) => {
    if (!onUpdateBrand) return;
    
    const updatedSections = (brand.sections || []).map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    );

    onUpdateBrand({
      ...brand,
      sections: updatedSections
    });
  };

  const isValid = (url?: string) => {
    if (!url) return false;
    const clean = url.trim();
    if (clean === '' || clean === '#') return false;
    if (clean.includes(DEFAULT_PLACEHOLDER)) return false;
    return true;
  };

  const heroSettings = brand.logoHero || { variant: 'color', alignment: 'left', scaling: 1, background: 'glass', showInDetail: true, padding: 8 };
  
  const heroLogoUrl = useMemo(() => {
    const lightLogo = brand.logos?.['white'] || brand.logos?.['light'];
    const darkLogo = brand.logos?.['black'] || brand.logos?.['dark'] || brand.logos?.['color'] || brand.logoUrl;
    
    if (isDarkMode) {
      return isValid(lightLogo) ? lightLogo : (isValid(brand.logoUrl) ? brand.logoUrl : null);
    } else {
      return isValid(darkLogo) ? darkLogo : (isValid(brand.logoUrl) ? brand.logoUrl : null);
    }
  }, [brand.logos, brand.logoUrl, isDarkMode]);

  const stickyHeaderLogo = useMemo(() => {
    if (brand.headerLogoVariant && isValid(brand.logos?.[brand.headerLogoVariant])) return brand.logos[brand.headerLogoVariant];
    if (isValid(heroLogoUrl)) return heroLogoUrl;
    if (isValid(brand.brandIcon?.url)) return brand.brandIcon.url;
    return isValid(brand.logoUrl) ? brand.logoUrl : '';
  }, [brand.headerLogoVariant, brand.logos, heroLogoUrl, brand.brandIcon?.url, brand.logoUrl]);

  return (
    <div className="min-h-screen pb-20 text-left print:bg-white print:text-black relative">
      <BrandBackground settings={brand.backgroundSettings} isDarkMode={isDarkMode} />
      
      {isExporting && <ExportOverlay status={exportStatus} />}
      
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-6 lg:-mx-12 px-6 lg:px-12 py-4 mb-8 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white backdrop-blur-md p-1.5 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
                <img src={getDirectImageUrl(stickyHeaderLogo)} alt={brand.name} className="max-h-full max-w-full object-contain drop-shadow-sm" />
             </div>
             <h2 className="text-xl font-bold dark:text-white">{brand.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${isExporting ? 'opacity-80 cursor-wait' : 'hover:bg-blue-700'}`}
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isExporting ? 'Neural Exporting...' : 'Export Protocol'}
                <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Manifest Type</span>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => handleExport('a4')}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        <div>
                          <span className="block text-xs font-bold dark:text-white">A4 Manifest</span>
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest">AI-Optimized Standard</span>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleExport('letter')}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        <div>
                          <span className="block text-xs font-bold dark:text-white">US Letter</span>
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest">Print Optimization</span>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleExport('presentation_wide')}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        <div>
                          <span className="block text-xs font-bold dark:text-white">Presentation Wide</span>
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest">High-Impact Deck</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
           </div>

           {!isReadOnly && onEdit && (
             <div className="flex items-center gap-2">
               <button onClick={() => onEdit(brand)} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95">
                 <Edit className="w-4 h-4" /> Edit
               </button>
               <button onClick={handleDeleteBrand} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95 border border-red-500/20" title="Purge Protocol">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
           )}
           <button onClick={onToggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 print:block relative z-10">
        <div className="hidden lg:block col-span-3 print:hidden text-left">
          <div className="sticky top-32 space-y-1">
             <div className="px-4 mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Brand Hierarchy</p>
                <div className="h-0.5 w-8 bg-blue-500 rounded-full" />
             </div>
             
             <button 
                onClick={() => scrollToSection('overview')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === 'overview' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
             >
                <Layout className="w-4 h-4" />
                Overview
             </button>

             {sidebarSections.map(section => (
               <button 
                key={section.id} 
                onClick={() => scrollToSection(section.id)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === section.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <div className={`w-1.5 h-1.5 rounded-full transition-all ${activeSection === section.id ? 'bg-blue-500 scale-125' : 'bg-slate-300 dark:bg-slate-700'}`} />
                 {section.title}
               </button>
             ))}
          </div>
        </div>

        <div id="brand-detail-content-area" className="col-span-12 lg:col-span-9 space-y-12 print:col-span-12 print:w-full print:m-0">
           <section id="overview" className="mb-24 scroll-mt-32 print:mb-12 flex flex-col items-start text-left">
              {heroSettings.showInDetail && (
                <div 
                  className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 flex justify-start"
                >
                  <div 
                    style={{ 
                      padding: `${heroSettings.padding * 4}px`,
                      transform: `scale(${heroSettings.scaling})`,
                      transformOrigin: 'left'
                    }}
                    className={`inline-block rounded-[3rem] transition-all duration-500 ${
                      heroSettings.background === 'glass' ? 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl' :
                      heroSettings.background === 'solid' ? 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl' :
                      'bg-transparent'
                    }`}
                  >
                    {heroLogoUrl ? (
                      <img 
                        src={getDirectImageUrl(heroLogoUrl)} 
                        alt={`${brand.name} Master Identity`} 
                        className="max-h-32 md:max-h-40 w-auto object-contain drop-shadow-sm transition-all duration-700" 
                      />
                    ) : (
                      <div className="p-8 text-slate-300 dark:text-slate-700 opacity-20 flex flex-col items-center gap-2">
                        <ImagePlus className="w-12 h-12" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Protocol Missing</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none print:text-5xl">
                {brand.name}
              </h1>
              {brand.tagline && <p className="text-2xl font-bold text-blue-600 mb-8 italic print:text-xl text-left w-full">"{brand.tagline}"</p>}
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed print:text-lg text-left">{brand.description}</p>
              
              <div className="mt-12 flex flex-wrap gap-4 print:mt-8">
                 <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm print:shadow-none print:border-slate-200">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Industry Sector</span>
                    <span className="text-sm font-bold print:text-xs">{brand.industry}</span>
                 </div>
                 <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm print:shadow-none print:border-slate-200">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Governance Version</span>
                    <span className="text-sm font-bold text-blue-600 print:text-xs">v{brand.version}</span>
                 </div>
              </div>
           </section>

           {orderedSections.map(section => (
             <div key={section.id} id={section.id} className="print:page-break-before-always section-container" data-section-id={section.id}>
               <SectionRenderer 
                  brand={brand} 
                  brands={brands}
                  section={section} 
                  mode={isReadOnly ? 'view' : 'edit'} 
                  onUpdate={(updates) => handleSectionUpdate(section.id, updates)} 
                  onBrandClick={onBrandClick}
               />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
