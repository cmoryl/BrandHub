
// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { 
  BrandSection, Brand, Asset, Typography as ITypography, Color, 
  LogoUsageDont, EmailSignature, BrandValue, DigitalBanner, 
  SocialBanner, SocialExample, IconSet, SocialLink, UsageImage, 
  TextStyle, Gradient, EmailBanner, Icon, SocialIconProtocol, 
  CustomBlockData 
} from '../types';
import ColorPalette from './ColorPalette';
import AIIconStudio from './AIIconStudio';
import QRCodeGenerator from './QRCodeGenerator';
import QRCodeRequest from './QRCodeRequest';
import ProtocolImage from './ProtocolImage';
import StudioBoundary from './StudioBoundary';
import { getVideoType, getEmbedUrl, getDirectImageUrl } from '../utils/linkUtils';
import { 
  ShieldCheck, Box, Palette, Flame, Grid, Type, 
  ImageIcon, Share2, Mail, QrCode, Monitor, DownloadCloud, 
  Ban, Shield, Layout, FileText, Archive, FileImage, 
  Presentation, CheckCircle2, XCircle, Info, ExternalLink,
  ChevronRight, Copy, Check, Eye, Wand2, Globe, Sparkles, Video,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, ArrowRight, 
  RefreshCw, PenTool, Save, X, ImagePlus, LayoutTemplate,
  Linkedin, Twitter, Instagram, Facebook, Megaphone, Download, 
  Briefcase, Trash2, Smartphone, AtSign, Link2, Play, Search, 
  FolderTree, Settings2, SlidersHorizontal, Maximize, Zap as ZapIcon, 
  Compass, Ruler, Maximize2, MonitorPlay, AlertCircle, Cpu, Code, 
  Layers, ShieldX, Hash, Youtube, Github, UserCircle, Activity, Fingerprint,
  Link as LinkIcon, PlusCircle, Globe2, BrainCircuit
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const SectionHeading = ({ title, icon: Icon, description, isEditMode, onUpdateDescription }: any) => {
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [localDesc, setLocalDesc] = useState(description || '');
  const handleSave = () => { onUpdateDescription(localDesc); setIsEditingDesc(false); };
  return (
    <div className="mb-10 text-left">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20"><Icon className="w-6 h-6" /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
        </div>
        {isEditMode && !isEditingDesc && (
          <button onClick={() => setIsEditingDesc(true)} className="edit-controls flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition-colors border border-slate-200 dark:border-white/5">
            <PenTool className="w-3 h-3" /> Edit Guidelines
          </button>
        )}
      </div>
      {isEditMode && isEditingDesc ? (
        <div className="edit-controls animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-500/30 shadow-xl">
            <textarea value={localDesc} onChange={(e) => setLocalDesc(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none" />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsEditingDesc(false)} className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">Commit</button>
            </div>
          </div>
        </div>
      ) : description && <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-4xl">{description}</p>}
    </div>
  );
};

// --- SPECIALIZED MODULE RENDERERS ---

const TextStyleRenderer = React.memo(({ styles }: { styles: TextStyle[] }) => (
  <div className="space-y-6">
    {styles.map((style) => (
      <div key={style.id} className="p-8 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-[2.5rem] group hover:border-blue-500/30 transition-all text-left shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{style.tag} Protocol</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">{style.name}</h3>
            </div>
            <div 
              className="p-10 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden"
              style={{
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textCase as any,
                textAlign: style.alignment as any,
              }}
            >
              <span className="dark:text-white text-slate-900">{style.sampleText || 'Sphinx of black quartz, judge my vow.'}</span>
            </div>
          </div>
          <div className="lg:w-72 grid grid-cols-2 gap-3">
             {[{ label: 'Size', val: style.fontSize }, { label: 'Weight', val: style.fontWeight }, { label: 'Leading', val: style.lineHeight }, { label: 'Family', val: style.fontFamily.split(',')[0] }].map((meta, i) => (
               <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="block text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">{meta.label}</span>
                  <span className="text-xs font-mono text-slate-700 dark:text-white truncate block">{meta.val}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    ))}
  </div>
));

const GradientRenderer = ({ gradients }: { gradients: Gradient[] }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const handleCopy = (css: string) => {
    navigator.clipboard.writeText(css);
    setCopied(css);
    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {gradients.map((g, i) => (
        <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div className="h-40 w-full" style={{ background: g.css }} />
          <div className="p-6 space-y-4">
             <div className="flex justify-between items-center">
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{g.name}</h4>
                <button onClick={() => handleCopy(g.css)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:text-blue-500 transition-all">
                   {copied === g.css ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
             </div>
             <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-white/5">
                <code className="text-[10px] font-mono text-blue-500 dark:text-blue-400 break-all">{g.css}</code>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TypographyRenderer = ({ typography }: { typography: ITypography[] }) => (
  <div className="space-y-12">
    {typography.map((t, i) => (
      <div key={i} className="p-10 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-[3rem] space-y-10 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest">{t.role}</span>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.name}</h3>
               </div>
               <p className="text-slate-500 font-medium max-w-lg">{t.description}</p>
            </div>
            {t.downloadUrl && (
              <a href={t.downloadUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">
                <DownloadCloud className="w-4 h-4" /> Download Node
              </a>
            )}
         </div>
         <div className="p-12 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden">
            <p className="text-5xl lg:text-7xl leading-tight dark:text-white text-slate-900" style={{ fontFamily: t.fontFamily }}>
              {t.sampleText || 'Abcdefghijklmnopqrstuvwxyz'}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
               {['Regular', 'SemiBold', 'Bold', 'Black'].map(weight => (
                 <div key={weight} className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{weight}</span>
                    <span className="text-2xl dark:text-slate-200" style={{ fontFamily: t.fontFamily, fontWeight: weight === 'Regular' ? 400 : weight === 'SemiBold' ? 600 : weight === 'Bold' ? 700 : 900 }}>Aa</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    ))}
  </div>
);

const PatternRenderer = ({ patterns }: { patterns: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {patterns.map((p, i) => (
      <div key={i} className="group space-y-4">
        <div className="aspect-square rounded-[2rem] border border-slate-200 dark:border-white/5 bg-repeat shadow-inner transition-transform group-hover:scale-[1.02]" style={{ backgroundImage: `url(${p.url})`, backgroundSize: 'auto' }} />
        <div className="px-4 flex justify-between items-center">
           <span className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest">{p.name}</span>
           <span className="text-[8px] font-mono text-slate-400">TEXTURE_ID: {i+1}</span>
        </div>
      </div>
    ))}
  </div>
);

const ImageryRenderer = ({ images, guidelines }: { images: UsageImage[], guidelines?: string }) => (
  <div className="space-y-12">
    <div className="grid md:grid-cols-2 gap-12">
      {['approved', 'avoid'].map(type => (
        <div key={type} className="space-y-6">
           <div className="flex items-center gap-3 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'approved' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {type === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{type === 'approved' ? 'Visual Directive' : 'Anti-Directive'}</h3>
           </div>
           <div className="grid gap-6">
              {images.filter(img => img.type === type).map((img, idx) => (
                <div key={idx} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                   <div className="aspect-video relative overflow-hidden">
                      <ProtocolImage src={img.url} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${type === 'avoid' ? 'grayscale opacity-60' : ''}`} />
                      {type === 'avoid' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><ShieldX className="w-20 h-20 text-red-500 opacity-20" /></div>}
                   </div>
                   <div className="p-6">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">"{img.caption}"</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ))}
    </div>
  </div>
);

const SocialRenderer = ({ socials, banners, digital }: { socials: SocialLink[], banners: SocialBanner[], digital: DigitalBanner[] }) => (
  <div className="space-y-12">
    <div className="flex flex-wrap gap-4">
      {socials.map((s, i) => (
        <a key={i} href={s.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm hover:border-blue-500 transition-all">
           <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
              <Globe2 className="w-5 h-5" />
           </div>
           <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.platform}</span>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">Official Channel</span>
           </div>
           <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
        </a>
      ))}
    </div>
    <div className="grid md:grid-cols-2 gap-8">
       {banners.map((b, i) => (
         <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="aspect-[4/1] bg-slate-50 dark:bg-slate-950 overflow-hidden">
               {b.url ? <ProtocolImage src={b.url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /> : <div className="h-full flex items-center justify-center text-slate-300 opacity-20 font-black uppercase text-[10px] tracking-widest">Protocol Missing</div>}
            </div>
            <div className="p-6 flex items-center justify-between">
               <div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{b.platform} Banner</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{b.dimensions}</p>
               </div>
               {b.url && <a href={b.url} download className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Download className="w-4 h-4" /></a>}
            </div>
         </div>
       ))}
    </div>
  </div>
);

const SignatureRenderer = ({ signatures }: { signatures: EmailSignature[] }) => {
  const [activeTab, setActiveTab] = useState<Record<string, 'visual' | 'code'>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12">
      {signatures.map((sig, i) => (
        <div key={sig.id} className="p-10 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-[3rem] shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{sig.name}</h4>
                 <p className="text-xs text-slate-500 font-medium">Standard Representative Protocol</p>
              </div>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                 <button onClick={() => setActiveTab(prev => ({...prev, [sig.id]: 'visual'}))} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${(!activeTab[sig.id] || activeTab[sig.id] === 'visual') ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>Visual</button>
                 <button onClick={() => setActiveTab(prev => ({...prev, [sig.id]: 'code'}))} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeTab[sig.id] === 'code' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>Source</button>
              </div>
           </div>
           
           {activeTab[sig.id] === 'code' ? (
             <div className="relative group">
                <pre className="p-8 bg-slate-950 rounded-2xl border border-white/5 overflow-x-auto text-[10px] font-mono text-blue-400 custom-scrollbar">
                   <code>{sig.htmlCode}</code>
                </pre>
                <button onClick={() => handleCopy(sig.htmlCode || '')} className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase shadow-xl hover:scale-105 transition-all">
                   {copied === sig.htmlCode ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                   {copied === sig.htmlCode ? 'Copied' : 'Copy HTML'}
                </button>
             </div>
           ) : (
             <div className="p-12 bg-white rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center min-h-[200px]">
                <div dangerouslySetInnerHTML={{ __html: sig.htmlCode }} />
             </div>
           )}
        </div>
      ))}
    </div>
  );
};

const MisuseRenderer = ({ items }: { items: LogoUsageDont[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
     {items.map((item, i) => (
       <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="aspect-video relative bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-12">
             <ProtocolImage src={item.imageUrl} className="max-h-full max-w-full object-contain grayscale opacity-40 group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-red-500/5 mix-blend-multiply pointer-events-none" />
             <div className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg">
                <XCircle className="w-4 h-4" />
             </div>
          </div>
          <div className="p-6 border-t border-slate-50 dark:border-white/5">
             <span className="block text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">{item.type} ERROR</span>
             <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{item.label}</h4>
          </div>
       </div>
     ))}
  </div>
);

const AssetRenderer = ({ assets }: { assets: Asset[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {assets.map((asset, i) => (
      <a key={i} href={asset.url} className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm hover:border-blue-500 hover:shadow-xl transition-all">
         <div className="flex items-center gap-5">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
               {asset.type === 'archive' ? <Archive className="w-6 h-6" /> : asset.type === 'presentation' ? <Presentation className="w-6 h-6" /> : <FileImage className="w-6 h-6" />}
            </div>
            <div>
               <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{asset.name}</h4>
               <span className="text-[10px] font-mono text-slate-400 uppercase">{asset.format} • {asset.size}</span>
            </div>
         </div>
         <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Download className="w-5 h-5" />
         </div>
      </a>
    ))}
  </div>
);

const IconographyRenderer = ({ icons, aiSets }: { icons: Icon[], aiSets: IconSet[] }) => (
  <div className="space-y-12">
    {icons && icons.length > 0 && (
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6">
         {icons.map((icon, i) => (
           <div key={i} className="aspect-square bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex items-center justify-center group hover:border-blue-500 transition-all shadow-sm">
              <svg className="w-full h-full text-slate-900 dark:text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d={icon.svgPath} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
           </div>
         ))}
      </div>
    )}
    {aiSets && aiSets.map((set, i) => (
      <div key={i} className="p-8 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] space-y-6">
         <div className="flex justify-between items-center">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{set.name}</h4>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[8px] font-black uppercase tracking-widest">AI GENERATED SET</span>
         </div>
         <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-15 gap-4">
            {set.icons.map((icon, idx) => (
              <div key={idx} className="aspect-square bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-xl p-3 flex items-center justify-center">
                 <svg className="w-full h-full text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={icon.svgPath} strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
              </div>
            ))}
         </div>
      </div>
    ))}
  </div>
);

const SymbolProtocolRenderer = React.memo(({ brandIcon }: { brandIcon: any }) => {
  const [activePreviews, setActivePreviews] = useState({ primary: 'slate', white: 'slate', black: 'white' });
  const variants = [
    { id: 'primary', label: 'Primary Symbol', url: brandIcon.url },
    { id: 'white', label: 'Inverse (White)', url: brandIcon.whiteUrl },
    { id: 'black', label: 'Monochrome (Black)', url: brandIcon.blackUrl }
  ];
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
        {variants.map((v) => (
          <div key={v.id} className="space-y-4">
             <div className="flex items-center justify-between px-4">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{v.label}</span>
                <div className="flex gap-1.5">
                   {['slate', 'white', 'mesh'].map(bg => (
                     <button key={bg} onClick={() => setActivePreviews(prev => ({ ...prev, [v.id]: bg }))} className={`w-3 h-3 rounded-full border border-slate-200 dark:border-white/10 transition-all ${activePreviews[v.id] === bg ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`} style={{ background: bg === 'slate' ? '#0f172a' : bg === 'white' ? '#ffffff' : 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }} />
                   ))}
                </div>
             </div>
             <div className={`aspect-square rounded-[3rem] border border-slate-200 dark:border-white/5 flex items-center justify-center p-12 transition-colors duration-500 overflow-hidden shadow-sm dark:shadow-2xl ${activePreviews[v.id] === 'slate' ? 'bg-slate-900' : activePreviews[v.id] === 'white' ? 'bg-white' : 'bg-gradient-to-br from-indigo-900 to-blue-900'}`}>
                {v.url ? <ProtocolImage src={v.url} className="max-h-full max-w-full object-contain" /> : <ShieldX className="w-12 h-12 text-slate-200" />}
             </div>
          </div>
        ))}
      </div>
      {brandIcon.usageRights && (
        <div className="p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] flex gap-6 items-start shadow-sm">
           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Info className="w-5 h-5" /></div>
           <div className="space-y-2">
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Symbol Usage Protocol</span>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{brandIcon.usageRights}</p>
           </div>
        </div>
      )}
    </div>
  );
});

// --- MAIN DISPATCHER ---

export const SectionRenderer: React.FC<any> = ({ brand, brands, section, mode, onUpdate, onBrandClick }) => {
  const { type, data, title, description } = section;
  const Icon = ({ identity: ShieldCheck, logos: Box, brandIcon: Shield, colors: Palette, gradients: Flame, patterns: Grid, typography: Type, textStyles: Code, iconography: Sparkles, socialIcons: Hash, imagery: ImageIcon, social: Share2, signatures: Mail, qr: QrCode, ai: Monitor, assets: DownloadCloud, misuse: Ban, products: Briefcase, custom: LayoutTemplate }[type]) || Box;

  const linkedBrands = useMemo(() => {
    if (type !== 'products' || !brand.linkedBrandIds || !brands) return [];
    return brands.filter(b => brand.linkedBrandIds?.includes(b.id));
  }, [type, brand.linkedBrandIds, brands]);

  return (
    <StudioBoundary title={title}>
      <div className="animate-in fade-in duration-1000 text-left">
        <SectionHeading title={title} icon={Icon} description={description} isEditMode={mode === 'edit'} onUpdateDescription={(d) => onUpdate({ description: d })} />
        <div className="section-content">
          {type === 'identity' && (
            <div className="space-y-12">
              <div className="p-10 bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-5"><ShieldCheck className="w-40 h-40" /></div>
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 mb-4 opacity-70">Mission Architecture</span>
                <p className="text-3xl font-serif italic relative z-10 leading-relaxed dark:text-white text-slate-900">"{brand.missionStatement}"</p>
              </div>

              {brand.introVideoUrl && (
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Video className="w-4 h-4" /> Intro Cinematic</h3>
                  <div className="aspect-video bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-lg relative group">
                    {getVideoType(brand.introVideoUrl) !== 'direct' ? (
                      <iframe src={getEmbedUrl(brand.introVideoUrl)} className="w-full h-full border-none" allow="autoplay; fullscreen; picture-in-picture" />
                    ) : (
                      <video src={brand.introVideoUrl} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Core Values</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(brand.values || []).map((v, i) => {
                      const IconComp = LucideIcons[v.icon] || ZapIcon;
                      return (<div key={i} className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center gap-4 shadow-sm"><IconComp className="w-5 h-5 text-blue-600 dark:text-blue-500" /><span className="text-slate-700 dark:text-slate-100 font-bold block">{v.text}</span></div>);
                    })}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Tone Protocol</h3>
                  <div className="flex flex-wrap gap-2">{(brand.toneOfVoice || []).map((t, i) => (<span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-full text-xs font-black uppercase text-slate-500 dark:text-slate-400">{t}</span>))}</div>
                </div>
              </div>
            </div>
          )}

          {type === 'brandIcon' && <SymbolProtocolRenderer brandIcon={brand.brandIcon || {}} />}
          {type === 'textStyles' && <TextStyleRenderer styles={brand.textStyles || []} />}
          {type === 'colors' && <ColorPalette colors={brand.colors || []} brand={brand} mode={mode} onChange={(nc) => onUpdate({ data: nc })} />}
          {type === 'gradients' && <GradientRenderer gradients={brand.gradients || []} />}
          {type === 'patterns' && <PatternRenderer patterns={brand.patterns || []} />}
          {type === 'typography' && <TypographyRenderer typography={brand.typography || []} />}
          {type === 'imagery' && <ImageryRenderer images={brand.imagery || []} guidelines={brand.imageryGuidelines} />}
          {type === 'social' && <SocialRenderer socials={brand.socials || []} banners={brand.socialBanners || []} digital={brand.digitalBanners || []} />}
          {type === 'signatures' && <SignatureRenderer signatures={brand.signatures || []} />}
          {type === 'assets' && <AssetRenderer assets={brand.assets || []} />}
          {type === 'misuse' && <MisuseRenderer items={brand.logoUsageDonts || []} />}
          {type === 'iconography' && <IconographyRenderer icons={brand.icons || []} aiSets={brand.aiIconSets || []} />}
          {type === 'qr' && (
             <div className="grid lg:grid-cols-2 gap-12">
                <QRCodeGenerator brand={brand} />
                <QRCodeRequest brand={brand} />
             </div>
          )}
          {type === 'ai' && (
             <div className="p-10 bg-slate-950 rounded-[3rem] border border-white/5 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><BrainCircuit className="w-6 h-6" /></div>
                   <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight">Intelligence Registry</h4>
                      <p className="text-xs text-slate-500 font-medium">Core constraints for organizational content synthesis.</p>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                   {[
                     { label: 'Archetype', val: brand.brainRegistry?.archetype },
                     { label: 'Cultural Nuance', val: brand.brainRegistry?.culturalNuance },
                     { label: 'Narrative DNA', val: brand.brainRegistry?.narrative, full: true },
                     { label: 'Visual Guardrails', val: brand.brainRegistry?.visualConstraints, full: true }
                   ].map((item, i) => (
                     <div key={i} className={`p-6 bg-white/5 rounded-2xl border border-white/5 ${item.full ? 'md:col-span-2' : ''}`}>
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.label}</span>
                        <p className="text-slate-300 font-medium leading-relaxed">{item.val || 'Protocol Empty'}</p>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {type === 'products' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {linkedBrands.map(b => (
                <button key={b.id} onClick={() => onBrandClick(b)} className="group p-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-[3rem] text-left hover:border-blue-500/30 transition-all shadow-sm dark:shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-5 group-hover:scale-110 transition-transform"><Briefcase className="w-24 h-24" /></div>
                  <div className="relative z-10 space-y-6">
                     <div className="w-16 h-16 rounded-2xl bg-white p-2.5 shadow-md border border-slate-100"><ProtocolImage src={b.logoUrl} className="w-full h-full object-contain" /></div>
                     <div><span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest block mb-1">{b.entityType} Node</span><h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{b.name}</h4></div>
                     <p className="text-xs text-slate-500 dark:text-slate-500 font-medium line-clamp-2 leading-relaxed">{b.description}</p>
                     <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">Inspect Protocol <ArrowRight className="w-3 h-3" /></div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {type === 'logos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{Object.entries(brand.logos || {}).map(([key, url]) => (<div key={key} className="space-y-4"><div className={`aspect-video rounded-[2.5rem] flex items-center justify-center p-8 border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/40 shadow-sm ${key === 'white' ? 'bg-slate-50 dark:bg-slate-950/80' : ''}`}>{url ? <ProtocolImage src={url} className="max-h-full max-w-full object-contain" /> : <Box className="opacity-10 w-8 h-8" />}</div><span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 px-4">{key} variant</span></div>))}</div>
          )}

          {type === 'socialIcons' && (
            <div className="flex flex-wrap gap-4">
               {brand.socialIcons?.icons?.map((tag, i) => (
                 <div key={i} className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
                    <div className="p-2.5 rounded-xl text-white shadow-lg" style={{ backgroundColor: tag.color || '#3b82f6' }}>
                       <Hash className="w-4 h-4" />
                    </div>
                    <div>
                       <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">{tag.platform}</span>
                       <span className="block text-sm font-bold dark:text-white">{tag.handle}</span>
                    </div>
                 </div>
               ))}
            </div>
          )}
          
        </div>
      </div>
    </StudioBoundary>
  );
};
