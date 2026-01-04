
import React from 'react';
import { ArrowRight, EyeOff, Box, Star, ShieldCheck, RefreshCw } from 'lucide-react';
import { Brand } from '../types';
import ProtocolImage from './ProtocolImage';
import { getOptimizedImageUrl } from '../utils/linkUtils';

interface BrandCardProps {
  brand: Brand;
  onClick: (brand: Brand) => void;
  isFavorite?: boolean;
  toggleFavorite?: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onClick, isFavorite, toggleFavorite }) => {
  const isProduct = brand.entityType === 'product';
  
  // Optimization: Request a smaller version for the dashboard card (600px width)
  const optimizedCover = getOptimizedImageUrl(brand.coverImage, 600);

  return (
    <div 
      onClick={() => onClick(brand)}
      className="group relative rounded-[2.5rem] transition-all duration-500 cursor-pointer h-full min-h-[380px] overflow-hidden flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 dark:to-slate-900/80 z-10"></div>
        <ProtocolImage 
          src={optimizedCover} 
          alt={`${brand.name} cover`} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute top-6 left-6 z-20 transition-transform duration-300 group-hover:scale-105">
          <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 dark:border-white/20 flex items-center justify-center overflow-hidden">
             <ProtocolImage src={brand.logoUrl} alt="logo" className="max-h-full max-w-full object-contain" />
          </div>
        </div>
        
        <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
           {toggleFavorite && (
             <button 
              onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
              className={`p-2.5 rounded-xl backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110 ${isFavorite ? 'bg-yellow-400 border-yellow-300 text-white' : 'bg-slate-900/40 dark:bg-slate-900/60 border-white/10 text-white hover:bg-slate-900/80'}`}
             >
               <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
             </button>
           )}

           {isProduct && (
              <div className="bg-blue-600 dark:bg-blue-600/90 px-3 py-1.5 rounded-xl text-white text-[9px] font-black shadow-lg border border-white/20 flex items-center gap-1.5 tracking-widest uppercase">
                  <Box className="w-3 h-3" /> PRODUCT
              </div>
           )}
           
           {!brand.isVisible && (
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl text-white text-[9px] font-black flex items-center gap-1.5 shadow-sm border border-white/10 tracking-widest uppercase">
                  <EyeOff className="w-3 h-3" /> HIDDEN
              </div>
           )}
        </div>

        <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
           <div className="px-2 py-1 bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 rounded-lg text-[7px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-1">
              <RefreshCw className="w-2 h-2 animate-spin-slow" /> Protocol v{brand.version}
           </div>
           <div className="px-2 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-lg text-[7px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-1">
              <ShieldCheck className="w-2 h-2" /> Verified
           </div>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col text-left">
        <div className="mb-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight uppercase leading-tight mb-2">{brand.name}</h3>
          <div className="flex items-center gap-3">
             <p className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em]">{brand.industry}</p>
             <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
             <p className="text-[9px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em]">{brand.category}</p>
          </div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed font-medium">
          {brand.description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
          <div className="flex -space-x-2">
             {brand.sections.slice(0, 5).map((s, i) => (
               <div key={i} className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[7px] font-black text-slate-500 dark:text-slate-400 shadow-sm" title={s.title}>
                  {s.title.charAt(0)}
               </div>
             ))}
             {brand.sections.length > 5 && (
               <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[7px] font-black text-white shadow-sm">
                  +{brand.sections.length - 5}
               </div>
             )}
          </div>
          <span className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-500/20 active:scale-90">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
