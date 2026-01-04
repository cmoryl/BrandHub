
// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Save, X, Layout, Shield, Box, Palette, Type, Grid, Share2, 
  Monitor, DownloadCloud, Plus, Trash2, Layers, QrCode, Sparkles,
  Target, Wand2, ImageIcon, Globe, Flame, AtSign, Mail, 
  BrainCircuit, Loader2, Ban, FileText, Code, AlignLeft, 
  AlignCenter, AlignRight, Zap, Image, Smartphone, 
  Search, ShieldCheck, Cpu, Eye, Compass, Rocket, Link2, ExternalLink,
  Briefcase, Ghost, ImagePlus, FileCode, CheckCircle2, Ruler, Maximize2, Hash, UserCircle, Video, PlusCircle,
  Activity, ArrowUpRight, ZapIcon, Info, RefreshCw, Braces,
  Instagram, Linkedin, Twitter, Facebook, Youtube, Github, AlertTriangle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Brand, IconSet, Typography, SocialBanner, UsageImage, Asset, BrandValue, LogoUsageDont, EmailSignature, DigitalBanner, SocialExample, Color, Gradient, EmailBanner, BrandSection, Icon, SocialIconProtocol, TextStyle, CustomBlockData, BackgroundSettings, LogoHeroSettings, EntityType, SectionType, NeuralRegistry } from '../types';
import { DEFAULT_COLORS, DEFAULT_PATTERNS, DEFAULT_GRADIENTS, NEW_BRAND_TEMPLATE, generateMainSignatureHTML, generateMinimalSignatureHTML, generateCenteredSignatureHTML, DEFAULT_EMAIL_BANNERS, DEFAULT_TYPOGRAPHY, DEFAULT_BRAND_SECTIONS, DEFAULT_TEXT_STYLES, DEFAULT_SOCIAL_BANNERS, DEFAULT_DIGITAL_BANNERS } from '../constants';
import { backend } from '../services/backendService';
import { useBrandStore } from '../store/brandStore';
import { synthesizeBrandIdentity, auditBrandBrain } from '../services/geminiService';
import { getDirectImageUrl } from '../utils/linkUtils';
import AIIconStudio from './AIIconStudio';
import ColorPalette from './ColorPalette';

const BrandEditor: React.FC<any> = ({ brand, onSave, onCancel }) => {
  const { brands } = useBrandStore();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [formData, setFormData] = useState<Partial<Brand>>({});
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);
  
  const [newVal, setNewVal] = useState({ text: '', icon: 'Zap' });
  const [newTone, setNewTone] = useState('');
  const [newLogoKey, setNewLogoKey] = useState('');
  const [newAsset, setNewAsset] = useState({ name: '', url: '' });

  useEffect(() => {
    const initialBrand = brand ? JSON.parse(JSON.stringify(brand)) : JSON.parse(JSON.stringify(NEW_BRAND_TEMPLATE));
    setFormData(backend.migrateAndRepair(initialBrand, 'sections'));
  }, [brand]);

  const updateField = (field: keyof Brand, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      
      if (field === 'brainRegistry') {
        const r = value as NeuralRegistry;
        next.intelligenceBrain = `ARCHETYPE: ${r.archetype}\nNARRATIVE: ${r.narrative}\nVISUALS: ${r.visualConstraints}\nCULTURE: ${r.culturalNuance}\nTECHNICAL: ${r.technicalGuardrails}`;
      }

      if (!next.sections) return next;

      next.sections = next.sections.map(s => {
        const d = s.data || {};
        switch (s.type) {
          case 'identity': 
            if (['missionStatement', 'values', 'toneOfVoice', 'websiteUrl', 'tagline', 'archetype', 'introVideoUrl'].includes(field)) return { ...s, data: { ...d, [field]: next[field] } };
            break;
          case 'logos': if (field === 'logos' || field === 'logoGuidelines' || field === 'headerLogoVariant') return { ...s, data: { ...next.logos, guidelines: next.logoGuidelines, headerLogoVariant: next.headerLogoVariant } }; break;
          case 'brandIcon': if (field === 'brandIcon') return { ...s, data: next.brandIcon }; break;
          case 'products': 
            if (field === 'products' || field === 'linkedBrandIds') return { ...s, data: { products: next.products, linkedBrandIds: next.linkedBrandIds } }; 
            break;
          case 'misuse': if (field === 'logoUsageDonts') return { ...s, data: next.logoUsageDonts }; break;
          case 'colors': if (field === 'colors') return { ...s, data: next.colors }; break;
          case 'gradients': if (field === 'gradients') return { ...s, data: next.gradients }; break;
          case 'patterns': if (field === 'patterns') return { ...s, data: next.patterns }; break;
          case 'typography': if (field === 'typography') return { ...s, data: next.typography }; break;
          case 'textStyles': if (field === 'textStyles') return { ...s, data: next.textStyles }; break;
          case 'iconography': 
            if (field === 'icons') return { ...s, data: { ...d, icons: next.icons } };
            if (field === 'aiIconSets') return { ...s, data: { ...d, aiSets: next.aiIconSets } };
            break;
          case 'socialIcons': if (field === 'socialIcons') return { ...s, data: next.socialIcons }; break;
          case 'imagery':
            if (field === 'imagery') return { ...s, data: { ...d, images: next.imagery } };
            if (field === 'imageryGuidelines') return { ...s, data: { ...d, guidelines: next.imageryGuidelines } };
            break;
          case 'social': if (field === 'socials' || field === 'socialBanners') return { ...s, data: { socials: next.socials, banners: next.socialBanners } }; break;
          case 'signatures': if (field === 'signatures') return { ...s, data: next.signatures }; break;
          case 'qr': if (field === 'qrSettings') return { ...s, data: next.qrSettings }; break;
          case 'ai': if (field === 'brainRegistry') return { ...s, data: next.brainRegistry }; break;
          case 'assets': if (field === 'assets') return { ...s, data: next.assets }; break;
        }
        return s;
      });
      return next;
    });
  };

  const runBrainAudit = async () => {
    if (!formData.brainRegistry) return;
    setIsAuditing(true);
    try {
      const results = await auditBrandBrain(formData as Brand, formData.brainRegistry);
      setAuditResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  const applySplice = (field: string, newValue: string) => {
    const nextRegistry = { ...formData.brainRegistry, [field]: newValue };
    updateField('brainRegistry', nextRegistry);
    setAuditResults(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter(s => s.field !== field)
    }));
  };

  const StudioHeader = ({ title, description, icon: Icon, onRun, label }: any) => (
    <div className="p-8 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] text-white flex items-center justify-between mb-10 shadow-2xl relative overflow-hidden border border-white/5">
      <div className="flex items-center gap-4 text-left relative z-10">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10"><Icon className="w-8 h-8" /></div>
        <div><h3 className="text-xl font-black uppercase tracking-tight">{title}</h3><p className="text-xs opacity-70 font-medium">{description}</p></div>
      </div>
      {onRun && <button type="button" onClick={onRun} disabled={isSynthesizing || isAuditing} className="relative z-10 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/20 shadow-xl disabled:opacity-50 transition-all">{isSynthesizing || isAuditing ? <Loader2 className="animate-spin" /> : <Wand2 className="w-4 h-4 inline mr-2" />}{label}</button>}
    </div>
  );

  const TABS = [
    {id:'general', label:'Basics', icon:Layout}, {id:'identity', label:'Identity', icon:ShieldCheck}, 
    {id:'logos', label:'Marks', icon:Box}, {id:'brandIcon', label:'Symbol', icon:Shield},
    {id:'products', label:'Portfolio', icon:Briefcase}, {id:'misuse', label:'Anti-Patterns', icon:Ban},
    {id:'colors', label:'Palette', icon:Palette}, {id:'gradients', label:'Flux', icon:Flame}, 
    {id:'patterns', label:'Patterns', icon:Grid}, {id:'typography', label:'Typography', icon:Type}, 
    {id:'textStyles', label:'Styles', icon:Code}, {id:'iconography', label:'Icons', icon:Sparkles}, 
    {id:'socialIcons', label:'Social Tags', icon:Hash}, {id:'imagery', label:'Imagery', icon:ImageIcon}, 
    {id:'social', label:'Digital', icon:Share2}, {id:'signatures', label:'Email', icon:Mail}, 
    {id:'qr', label:'QR', icon:QrCode}, {id:'ai', label:'Brain', icon:Monitor}, 
    {id:'components', label:'Assets', icon:DownloadCloud}
  ];

  const toggleLinkedBrand = (id: string) => {
    const current = formData.linkedBrandIds || [];
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateField('linkedBrandIds', next);
  };

  const addCustomLogo = () => {
    if (!newLogoKey.trim()) return;
    const key = newLogoKey.trim().toLowerCase().replace(/\s+/g, '_');
    if (formData.logos?.[key]) return;
    updateField('logos', { ...formData.logos, [key]: '' });
    setNewLogoKey('');
  };

  const removeCustomLogo = (key: string) => {
    if (['color', 'white', 'black'].includes(key)) return;
    const next = { ...formData.logos };
    delete next[key];
    updateField('logos', next);
  };

  const addValue = () => {
    if (!newVal.text.trim()) return;
    updateField('values', [...(formData.values || []), { ...newVal }]);
    setNewVal({ text: '', icon: 'Zap' });
  };

  const addTone = () => {
    if (!newTone.trim()) return;
    updateField('toneOfVoice', [...(formData.toneOfVoice || []), newTone.trim()]);
    setNewTone('');
  };

  const signatureSyncAlert = useMemo(() => {
    if (!formData.signatures || formData.signatures.length === 0) return false;
    const masterLogo = getDirectImageUrl(formData.logos?.color || formData.logoUrl);
    return formData.signatures.some(sig => !sig.htmlCode?.includes(masterLogo));
  }, [formData.signatures, formData.logos, formData.logoUrl]);

  return (
    <div className="max-w-6xl mx-auto bg-slate-950/40 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[85vh] text-left">
      <div className="bg-slate-950 px-8 py-6 flex justify-between items-center shrink-0 border-b border-white/5">
        <div><h2 className="text-xl font-black text-white uppercase tracking-tighter">Master Protocol Editor</h2><p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Configuring: {formData.name || 'New Node'}</p></div>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white p-2"><X className="w-6 h-6" /></button>
      </div>
      <div className="flex border-b border-white/5 bg-slate-900/40 sticky top-0 z-20 overflow-x-auto no-scrollbar">
        {TABS.map(t => (<button key={t.id} type="button" onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] border-b-2 transition-all whitespace-nowrap ${activeTab === t.id ? 'border-blue-600 text-blue-600 bg-blue-50/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}><t.icon className="w-3.5 h-3.5" /> {t.label}</button>))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(backend.migrateAndRepair(formData, 'sections')); }} className="flex-1 overflow-y-auto p-12 bg-transparent space-y-12">
        {activeTab === 'general' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Basics Studio" description="Core identifiers and meta descriptors." icon={Target} />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="col-span-2 space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 px-1">Brand Name</label><input required type="text" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-950 text-white font-bold" /></div>
              <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 px-1">Industry</label><input type="text" value={formData.industry || ''} onChange={e => updateField('industry', e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-950 text-white" /></div>
              <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 px-1">Category</label><input type="text" value={formData.category || ''} onChange={e => updateField('category', e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-950 text-white" /></div>
              <div className="col-span-2 space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 px-1">Summary</label><textarea rows={4} value={formData.description || ''} onChange={e => updateField('description', e.target.value)} className="w-full p-6 rounded-2xl border border-white/10 bg-slate-950 text-slate-300" /></div>
            </div>
          </div>
        )}

        {activeTab === 'identity' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Identity Forge" description="Mission critical narratives and core value systems." icon={ShieldCheck} />
            <div className="space-y-8">
              <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 px-1">Tagline</label><input type="text" value={formData.tagline || ''} onChange={e => updateField('tagline', e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-950 text-white" /></div>
              <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 px-1">Mission Statement</label><textarea rows={3} value={formData.missionStatement || ''} onChange={e => updateField('missionStatement', e.target.value)} className="w-full p-6 rounded-2xl border border-white/10 bg-slate-950 text-white font-serif italic" /></div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Intro Cinematic URL (MP4, YouTube, Vimeo)</label>
                <div className="flex gap-4">
                   <input type="text" value={formData.introVideoUrl || ''} onChange={e => updateField('introVideoUrl', e.target.value)} className="flex-1 px-6 py-4 rounded-2xl border border-white/10 bg-slate-950 text-blue-400 font-mono text-xs" placeholder="https://youtube.com/..." />
                   <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5 text-slate-500" />
                   </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Core Values</label>
                  <div className="flex gap-3 mb-4">
                    <input type="text" value={newVal.text} onChange={e => setNewVal({...newVal, text: e.target.value})} placeholder="Value..." className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white" />
                    <button type="button" onClick={addValue} className="p-3 bg-blue-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-2">
                    {(formData.values || []).map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-sm font-bold text-white">{v.text}</span>
                        <button type="button" onClick={() => updateField('values', formData.values.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Tone Protocol</label>
                  <div className="flex gap-3 mb-4">
                    <input type="text" value={newTone} onChange={e => setNewTone(e.target.value)} placeholder="Adjective..." className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white" />
                    <button type="button" onClick={addTone} className="p-3 bg-blue-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.toneOfVoice || []).map((t, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2">
                        {t} <button type="button" onClick={() => updateField('toneOfVoice', formData.toneOfVoice.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logos' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Mark Repository" description="High-fidelity vector source links for all approved variants." icon={Box} />
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(formData.logos || {}).map(([key, url]) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">{key} Protocol URL</label>
                    {!['color', 'white', 'black', 'stacked', 'wordmark'].includes(key) && (
                      <button type="button" onClick={() => removeCustomLogo(key)} className="text-red-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <input type="text" value={url} onChange={e => updateField('logos', { ...formData.logos, [key]: e.target.value })} className="flex-1 px-5 py-3 rounded-xl bg-slate-950 border border-white/10 text-blue-400 font-mono text-xs" />
                    <div className="w-12 h-12 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center overflow-hidden"><img src={getDirectImageUrl(url)} className="max-h-full max-w-full object-contain" /></div>
                  </div>
                </div>
              ))}
              <div className="col-span-2 p-6 bg-slate-900/40 rounded-2xl border border-white/5 flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Add Variant Key</label>
                  <input type="text" value={newLogoKey} onChange={e => setNewLogoKey(e.target.value)} placeholder="e.g. monochrome_alt" className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-lg text-white" />
                </div>
                <button type="button" onClick={addCustomLogo} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-black text-[10px] uppercase tracking-widest border border-white/5">Register Key</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brandIcon' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Symbol Protocol" description="The shorthand mark for favicon, avatar, and subtle brand reinforcement." icon={Shield} />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Primary Symbol (Color)</label>
                  <input type="text" value={formData.brandIcon?.url || ''} onChange={e => updateField('brandIcon', { ...formData.brandIcon, url: e.target.value })} className="w-full px-5 py-3 rounded-xl border border-white/10 bg-slate-950 text-blue-400 font-mono text-xs" placeholder="URL Node..." />
                  <div className="h-24 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                    {formData.brandIcon?.url ? <img src={getDirectImageUrl(formData.brandIcon.url)} className="h-12 w-12 object-contain" /> : <div className="text-[8px] font-black text-slate-700 uppercase">Primary Missing</div>}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Inverse Symbol (White)</label>
                  <input type="text" value={formData.brandIcon?.whiteUrl || ''} onChange={e => updateField('brandIcon', { ...formData.brandIcon, whiteUrl: e.target.value })} className="w-full px-5 py-3 rounded-xl border border-white/10 bg-slate-950 text-blue-400 font-mono text-xs" placeholder="URL Node..." />
                  <div className="h-24 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                    {formData.brandIcon?.whiteUrl ? <img src={getDirectImageUrl(formData.brandIcon.whiteUrl)} className="h-12 w-12 object-contain" /> : <div className="text-[8px] font-black text-slate-700 uppercase">Inverse Missing</div>}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Monochrome Symbol (Black)</label>
                  <input type="text" value={formData.brandIcon?.blackUrl || ''} onChange={e => updateField('brandIcon', { ...formData.brandIcon, blackUrl: e.target.value })} className="w-full px-5 py-3 rounded-xl border border-white/10 bg-slate-950 text-blue-400 font-mono text-xs" placeholder="URL Node..." />
                  <div className="h-24 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
                    {formData.brandIcon?.blackUrl ? <img src={getDirectImageUrl(formData.brandIcon.blackUrl)} className="h-12 w-12 object-contain" /> : <div className="text-[8px] font-black text-slate-300 uppercase">Black Missing</div>}
                  </div>
                </div>
              </div>
              <div className="col-span-full space-y-3 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Usage Protocol Notes</label>
                <textarea rows={3} value={formData.brandIcon?.usageRights || ''} onChange={e => updateField('brandIcon', { ...formData.brandIcon, usageRights: e.target.value })} className="w-full p-6 rounded-2xl border border-white/10 bg-slate-950 text-slate-300" placeholder="e.g. Must maintain 20% clear space. Never use below 16px." />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Portfolio Studio" description="Bi-directional links between brands and products." icon={Briefcase} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {brands.map(b => (
                <button 
                  key={b.id} 
                  type="button"
                  onClick={() => toggleLinkedBrand(b.id)}
                  className={`p-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${formData.linkedBrandIds?.includes(b.id) ? 'bg-blue-600 border-blue-500 shadow-xl' : 'bg-slate-900 border-white/5 hover:border-blue-500/50'}`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-md"><img src={getDirectImageUrl(b.logoUrl)} className="w-full h-full object-contain" /></div>
                    <div><span className={`block font-black uppercase text-xs tracking-tight ${formData.linkedBrandIds?.includes(b.id) ? 'text-white' : 'text-slate-200'}`}>{b.name}</span><span className={`block text-[8px] font-bold uppercase tracking-widest ${formData.linkedBrandIds?.includes(b.id) ? 'text-blue-100' : 'text-slate-500'}`}>{b.entityType}</span></div>
                  </div>
                  {formData.linkedBrandIds?.includes(b.id) && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'misuse' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Anti-Pattern Registry" description="Documenting prohibited visual specimens." icon={Ban} />
            <div className="grid gap-6">
               <button 
                type="button" 
                onClick={() => updateField('logoUsageDonts', [...(formData.logoUsageDonts || []), { id: Date.now().toString(), label: 'Distorted Ratio', imageUrl: '', type: 'distort' }])}
                className="p-6 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-500 hover:text-white hover:border-blue-500/50 transition-all flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest"
               >
                 <PlusCircle className="w-4 h-4" /> Add Anti-Pattern Specimen
               </button>
               <div className="grid md:grid-cols-2 gap-6">
                  {(formData.logoUsageDonts || []).map((dont, i) => (
                    <div key={dont.id} className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-6">
                       <div className="flex justify-between items-center">
                          <input type="text" value={dont.label} onChange={e => {
                             const next = [...formData.logoUsageDonts];
                             next[i].label = e.target.value;
                             updateField('logoUsageDonts', next);
                          }} className="bg-transparent border-none p-0 text-white font-black uppercase text-sm focus:ring-0" />
                          <button type="button" onClick={() => updateField('logoUsageDonts', formData.logoUsageDonts.filter(d => d.id !== dont.id))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                       </div>
                       <input type="text" placeholder="Specimen URL..." value={dont.imageUrl} onChange={e => {
                          const next = [...formData.logoUsageDonts];
                          next[i].imageUrl = e.target.value;
                          updateField('logoUsageDonts', next);
                       }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-blue-400 font-mono text-xs" />
                       <div className="aspect-video bg-slate-950 rounded-2xl flex items-center justify-center p-6 border border-white/5 overflow-hidden">
                          <img src={getDirectImageUrl(dont.imageUrl)} className="max-h-full max-w-full object-contain grayscale opacity-40" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Palette Lab" description="Chromatic governance and accessibility orchestration." icon={Palette} />
            <ColorPalette brand={formData as Brand} colors={formData.colors || []} mode="edit" onChange={nc => updateField('colors', nc)} />
          </div>
        )}

        {activeTab === 'gradients' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Flux Nodes" description="Sophisticated depth patterns and CSS gradients." icon={Flame} />
            <div className="grid md:grid-cols-2 gap-8">
               {(formData.gradients || []).map((g, i) => (
                 <div key={i} className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between">
                       <input type="text" value={g.name} onChange={e => {
                          const next = [...formData.gradients];
                          next[i].name = e.target.value;
                          updateField('gradients', next);
                       }} className="bg-transparent border-none font-black text-white uppercase text-xs p-0 focus:ring-0" />
                       <button type="button" onClick={() => updateField('gradients', formData.gradients.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea value={g.css} onChange={e => {
                       const next = [...formData.gradients];
                       next[i].css = e.target.value;
                       updateField('gradients', next);
                    }} className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-blue-400 font-mono text-[10px] h-20" />
                    <div className="h-12 rounded-xl" style={{ background: g.css }} />
                 </div>
               ))}
               <button 
                type="button" 
                onClick={() => updateField('gradients', [...(formData.gradients || []), { name: 'New Flux Node', css: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }])}
                className="aspect-square border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 hover:text-white flex flex-col items-center justify-center gap-4 transition-all"
               >
                 <PlusCircle className="w-12 h-12" />
                 <span className="font-black uppercase text-[10px] tracking-widest">Register Flux Node</span>
               </button>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
           <div className="space-y-10 animate-in fade-in">
              <StudioHeader title="Geometric Primitives" description="Texture management and repeatable background assets." icon={Grid} />
              <div className="grid md:grid-cols-2 gap-8">
                 {(formData.patterns || []).map((p, i) => (
                   <div key={i} className="p-6 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-4">
                      <div className="flex justify-between items-center">
                         <input type="text" value={p.name} onChange={e => {
                            const next = [...formData.patterns];
                            next[i].name = e.target.value;
                            updateField('patterns', next);
                         }} className="bg-transparent border-none p-0 text-white font-black uppercase text-xs focus:ring-0" />
                         <button type="button" onClick={() => updateField('patterns', formData.patterns.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <input type="text" value={p.url} onChange={e => {
                         const next = [...formData.patterns];
                         next[i].url = e.target.value;
                         updateField('patterns', next);
                      }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-blue-400 font-mono text-[10px]" />
                      <div className="aspect-video rounded-xl bg-repeat border border-white/5 shadow-inner" style={{ backgroundImage: `url(${p.url})` }} />
                   </div>
                 ))}
                 <button type="button" onClick={() => updateField('patterns', [...(formData.patterns || []), { name: 'New Primal Texture', url: '' }])} className="aspect-video border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 hover:text-white flex flex-col items-center justify-center gap-4 transition-all"><PlusCircle className="w-10 h-10" /><span className="font-black uppercase text-[10px] tracking-widest">Link Primal Texture</span></button>
              </div>
           </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Typography Registry" description="Centralized typeface roles and CSS stacks." icon={Type} />
            <div className="space-y-8">
               {(formData.typography || []).map((t, i) => (
                 <div key={i} className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] space-y-8">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/5 rounded-2xl text-blue-400"><Type className="w-6 h-6" /></div>
                          <input type="text" value={t.name} onChange={e => {
                             const next = [...formData.typography];
                             next[i].name = e.target.value;
                             updateField('typography', next);
                          }} className="bg-transparent border-none p-0 text-3xl font-black text-white uppercase tracking-tighter focus:ring-0 w-64" />
                       </div>
                       <button type="button" onClick={() => updateField('typography', formData.typography.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Role</label><select value={t.role} onChange={e => { const next = [...formData.typography]; next[i].role = e.target.value; updateField('typography', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs font-bold"><option>Heading</option><option>Body</option><option>Display</option><option>Web Safe</option></select></div>
                       <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">CSS Stack</label><input type="text" value={t.fontFamily} onChange={e => { const next = [...formData.typography]; next[i].fontFamily = e.target.value; updateField('typography', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-blue-400 font-mono text-xs" /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Download URL</label><input type="text" value={t.downloadUrl} onChange={e => { const next = [...formData.typography]; next[i].downloadUrl = e.target.value; updateField('typography', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-400 font-mono text-xs" /></div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 px-1">Typeface Narrative / Guidelines</label>
                       <textarea rows={2} value={t.description || ''} onChange={e => { const next = [...formData.typography]; next[i].description = e.target.value; updateField('typography', next); }} className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-slate-300 text-xs font-medium" placeholder="Describe the purpose of this typeface..." />
                    </div>
                    <div className="p-8 bg-slate-950 rounded-2xl border border-white/5">
                       <label className="text-[8px] font-black uppercase text-slate-700 mb-2 block">Live Specimen Wording</label>
                       <textarea rows={2} value={t.sampleText} onChange={e => { const next = [...formData.typography]; next[i].sampleText = e.target.value; updateField('typography', next); }} className="w-full bg-transparent border-none p-0 text-3xl text-white focus:ring-0 resize-none" style={{ fontFamily: t.fontFamily }} />
                    </div>
                 </div>
               ))}
               <button type="button" onClick={() => updateField('typography', [...(formData.typography || []), { name: 'New Typeface', role: 'Body', fontFamily: 'system-ui', sampleText: 'Sphinx of black quartz, judge my vow.', downloadUrl: '' }])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 hover:text-white flex flex-col items-center justify-center gap-4 transition-all"><PlusCircle className="w-12 h-12" /><span className="font-black uppercase text-[10px] tracking-widest">Register Typeface Node</span></button>
            </div>
          </div>
        )}

        {activeTab === 'textStyles' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Semantic Hierarchies" description="Precise CSS standard definitions for text elements." icon={Code} />
            <div className="space-y-8">
               {(formData.textStyles || []).map((ts, i) => (
                 <div key={ts.id} className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <input type="text" value={ts.name} onChange={e => { const next = [...formData.textStyles]; next[i].name = e.target.value; updateField('textStyles', next); }} className="bg-transparent border-none p-0 text-xl font-black text-white uppercase focus:ring-0" />
                          <button type="button" onClick={() => updateField('textStyles', formData.textStyles.filter(s => s.id !== ts.id))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Semantic Tag</label><select value={ts.tag} onChange={e => { const next = [...formData.textStyles]; next[i].tag = e.target.value; updateField('textStyles', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs font-bold"><option>h1</option><option>h2</option><option>h3</option><option>h4</option><option>p</option><option>span</option></select></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Font Size</label><input type="text" value={ts.fontSize} onChange={e => { const next = [...formData.textStyles]; next[i].fontSize = e.target.value; updateField('textStyles', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs font-bold" /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Weight</label><input type="text" value={ts.fontWeight} onChange={e => { const next = [...formData.textStyles]; next[i].fontWeight = e.target.value; updateField('textStyles', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs font-bold" /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Leading</label><input type="text" value={ts.lineHeight} onChange={e => { const next = [...formData.textStyles]; next[i].lineHeight = e.target.value; updateField('textStyles', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs font-bold" /></div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 px-1">Live String Buffer</label>
                          <input type="text" value={ts.sampleText || ''} onChange={e => { const next = [...formData.textStyles]; next[i].sampleText = e.target.value; updateField('textStyles', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs font-bold" placeholder="Visual Identity" />
                       </div>
                    </div>
                    <div className="p-8 bg-slate-950 rounded-2xl border border-white/5 flex flex-col justify-center overflow-hidden">
                       <p className="truncate" style={{ 
                         fontSize: ts.fontSize, 
                         fontWeight: ts.fontWeight, 
                         lineHeight: ts.lineHeight, 
                         fontFamily: ts.fontFamily, 
                         color: '#fff' 
                       }}>{ts.sampleText || 'Visual Identity'}</p>
                       <span className="mt-4 text-[8px] font-mono text-slate-600 uppercase tracking-widest">LIVE_RENDER_PROTO</span>
                    </div>
                 </div>
               ))}
               <button type="button" onClick={() => updateField('textStyles', [...(formData.textStyles || []), { id: Date.now().toString(), name: 'New Style', tag: 'p', fontSize: '16px', fontWeight: '400', lineHeight: '1.5', fontFamily: 'system-ui', sampleText: 'Visual Identity' }])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 hover:text-white flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest"><PlusCircle className="w-5 h-5" /> Add Semantic Node</button>
            </div>
          </div>
        )}

        {activeTab === 'iconography' && (
          <div className="space-y-10 h-full flex flex-col animate-in fade-in">
            <StudioHeader title="Iconography Studio" description="Neural vector synthesis and set management." icon={Sparkles} />
            <div className="flex-1 min-h-[600px]"><AIIconStudio brand={formData as Brand} onCommit={({ icons, set }) => {
              if (set) updateField('aiIconSets', [...(formData.aiIconSets || []), set]);
              if (icons) updateField('icons', [...(formData.icons || []), ...icons]);
            }} /></div>
          </div>
        )}

        {activeTab === 'socialIcons' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Social Tag Protocol" description="Platform specific handles and color coordination." icon={Hash} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {(formData.socialIcons?.icons || []).map((tag, i) => (
                 <div key={i} className="p-6 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 text-blue-400"><Hash className="w-4 h-4" /></div>
                          <span className="font-black text-white uppercase text-xs">{tag.platform}</span>
                       </div>
                       <button type="button" onClick={() => {
                          const next = { ...formData.socialIcons };
                          next.icons = next.icons.filter((_, idx) => idx !== i);
                          updateField('socialIcons', next);
                       }} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[8px] font-black uppercase text-slate-600">Handle</label>
                       <input type="text" value={tag.handle} onChange={e => {
                          const next = { ...formData.socialIcons };
                          next.icons[i].handle = e.target.value;
                          updateField('socialIcons', next);
                       }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-white text-xs font-bold" />
                    </div>
                 </div>
               ))}
               <button type="button" onClick={() => {
                  const current = formData.socialIcons || { icons: [], guidelines: '', examples: [] };
                  updateField('socialIcons', { ...current, icons: [...current.icons, { platform: 'LinkedIn', handle: '@handle', color: '#0077b5', svgPath: '' }] });
               }} className="p-6 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 hover:text-white flex flex-col items-center justify-center gap-3 transition-all"><PlusCircle className="w-8 h-8" /><span className="font-black uppercase text-[10px] tracking-widest">Add Social Protocol</span></button>
            </div>
          </div>
        )}

        {activeTab === 'imagery' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Imagery Forge" description="Directing creative photography and visual direction." icon={ImageIcon} />
            <div className="space-y-8">
               <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 px-1">Creative Guardrails (Markdown)</label><textarea rows={4} value={formData.imageryGuidelines || ''} onChange={e => updateField('imageryGuidelines', e.target.value)} className="w-full p-6 rounded-[2rem] border border-white/10 bg-slate-950 text-slate-300 leading-relaxed" /></div>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(formData.imagery || []).map((img, i) => (
                    <div key={img.id} className="p-4 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-4">
                       <div className="flex justify-between items-center">
                          <select value={img.type} onChange={e => { const next = [...formData.imagery]; next[i].type = e.target.value; updateField('imagery', next); }} className="bg-transparent border-none text-[10px] font-black uppercase text-blue-500 focus:ring-0"><option value="approved">Approved</option><option value="avoid">Avoid</option></select>
                          <button type="button" onClick={() => updateField('imagery', formData.imagery.filter(m => m.id !== img.id))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                       </div>
                       <input type="text" placeholder="Direct Image URL..." value={img.url} onChange={e => { const next = [...formData.imagery]; next[i].url = e.target.value; updateField('imagery', next); }} className="w-full px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-blue-400 font-mono text-[9px]" />
                       <div className="aspect-[4/5] rounded-2xl bg-slate-950 border border-white/5 overflow-hidden"><img src={getDirectImageUrl(img.url)} className="w-full h-full object-cover" /></div>
                       <input type="text" placeholder="Directive caption..." value={img.caption} onChange={e => { const next = [...formData.imagery]; next[i].caption = e.target.value; updateField('imagery', next); }} className="w-full bg-transparent border-none p-0 text-white font-bold text-xs focus:ring-0" />
                    </div>
                  ))}
                  <button type="button" onClick={() => updateField('imagery', [...(formData.imagery || []), { id: Date.now().toString(), url: '', caption: '', type: 'approved' }])} className="aspect-[4/5] border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 hover:text-white flex flex-col items-center justify-center gap-4 transition-all"><PlusCircle className="w-12 h-12" /><span className="font-black uppercase text-[10px] tracking-widest">Link Visual DNA</span></button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Digital Footprint" description="Platform links and standard marketing banner formats." icon={Share2} />
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Official Channels</h4>
                  <div className="space-y-3">
                     {(formData.socials || []).map((s, i) => (
                       <div key={i} className="flex gap-4 items-center p-4 bg-slate-900 border border-white/5 rounded-2xl">
                          <div className="p-2 bg-white/5 text-blue-400 rounded-lg"><Link2 className="w-4 h-4" /></div>
                          <input type="text" value={s.platform} onChange={e => { const next = [...formData.socials]; next[i].platform = e.target.value; updateField('socials', next); }} className="bg-transparent border-none p-0 text-white font-black uppercase text-[10px] w-24 focus:ring-0" />
                          <input type="text" value={s.url} onChange={e => { const next = [...formData.socials]; next[i].url = e.target.value; updateField('socials', next); }} className="flex-1 bg-transparent border-none p-0 text-blue-400 font-mono text-[10px] focus:ring-0" />
                          <button type="button" onClick={() => updateField('socials', formData.socials.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     ))}
                     <button type="button" onClick={() => updateField('socials', [...(formData.socials || []), { platform: 'LinkedIn', url: '' }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-600 hover:text-white flex items-center justify-center gap-3 font-black uppercase text-[9px] tracking-widest"><PlusCircle className="w-4 h-4" /> Link Active Channel</button>
                  </div>
               </div>
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Banner Protocols</h4>
                  <div className="grid gap-3">
                     {(formData.socialBanners || []).map((b, i) => (
                       <div key={b.id} className="flex gap-4 items-center p-4 bg-slate-900 border border-white/5 rounded-2xl">
                          <div className="p-2 bg-white/5 text-blue-400 rounded-lg"><Image className="w-4 h-4" /></div>
                          <div className="flex-1">
                             <span className="block text-[8px] font-black text-slate-500 uppercase">{b.platform} • {b.dimensions}</span>
                             <input type="text" value={b.url} onChange={e => { const next = [...formData.socialBanners]; next[i].url = e.target.value; updateField('socialBanners', next); }} placeholder="Banner Source URL..." className="w-full bg-transparent border-none p-0 text-white font-bold text-xs focus:ring-0" />
                          </div>
                          <button type="button" onClick={() => updateField('socialBanners', formData.socialBanners.filter(x => x.id !== b.id))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'signatures' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Communication Protocol" description="Master email signature templates and camapign banners." icon={Mail} />
            
            {signatureSyncAlert && (
              <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-[2rem] flex items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg"><AlertTriangle className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-black text-amber-500 uppercase tracking-tight">Signature Identity Mismatch</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Stored HTML signatures are using an outdated mark URL. Manual refresh required.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right hidden md:block">
                      <span className="block text-[8px] font-black text-slate-600 uppercase">Protocol Sync Status</span>
                      <span className="block text-[10px] text-amber-500 font-bold uppercase tracking-widest">Out of Alignment</span>
                   </div>
                </div>
              </div>
            )}

            <div className="space-y-12">
               {(formData.signatures || []).map((sig, i) => (
                 <div key={sig.id} className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] space-y-8">
                    <div className="flex justify-between items-center">
                       <input type="text" value={sig.name} onChange={e => { const next = [...formData.signatures]; next[i].name = e.target.value; updateField('signatures', next); }} className="bg-transparent border-none p-0 text-2xl font-black text-white uppercase focus:ring-0" />
                       <button type="button" onClick={() => updateField('signatures', formData.signatures.filter(s => s.id !== sig.id))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Representative Name</label><input type="text" value={sig.userName} onChange={e => { const next = [...formData.signatures]; next[i].userName = e.target.value; updateField('signatures', next); }} className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-bold" /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500">Professional Role</label><input type="text" value={sig.userRole} onChange={e => { const next = [...formData.signatures]; next[i].userRole = e.target.value; updateField('signatures', next); }} className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-white/10 text-white" /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">HTML Source Code</label><textarea rows={6} value={sig.htmlCode} onChange={e => { const next = [...formData.signatures]; next[i].htmlCode = e.target.value; updateField('signatures', next); }} className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl text-blue-400 font-mono text-[9px] h-40" /></div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-500">Visual Handshake Preview</label>
                          <div className="bg-white p-10 rounded-2xl shadow-inner min-h-[240px] flex items-center justify-center overflow-hidden"><div dangerouslySetInnerHTML={{ __html: sig.htmlCode }} /></div>
                       </div>
                    </div>
                 </div>
               ))}
               <button type="button" onClick={() => updateField('signatures', [...(formData.signatures || []), { id: Date.now().toString(), name: 'Main Corporate Signature', userName: 'John Doe', userRole: 'Design Orchestrator', htmlCode: generateMainSignatureHTML('John Doe', 'Design Orchestrator', formData.name || 'BrandHub', (formData.colors?.[0]?.hex || '#3b82f6'), getDirectImageUrl(formData.logos?.color || formData.logoUrl || '')) }])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 hover:text-white flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest transition-all hover:border-blue-500/50"><PlusCircle className="w-5 h-5" /> Generate Template Protocol</button>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="space-y-10 animate-in fade-in">
            <StudioHeader title="Access Ports" description="Brand-grounded quick response markers." icon={QrCode} />
            <div className="grid md:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-400 px-1">Default Destination URL</label>
                     <input type="text" value={formData.qrSettings?.defaultUrl || ''} onChange={e => updateField('qrSettings', { ...formData.qrSettings, defaultUrl: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-slate-950 text-blue-400 font-mono text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 px-1">FG Color</label>
                        <input type="color" value={formData.qrSettings?.fgColor || '#ffffff'} onChange={e => updateField('qrSettings', { ...formData.qrSettings, fgColor: e.target.value, useCustomColors: true })} className="w-full h-12 rounded-xl bg-slate-950 border border-white/10 p-1 cursor-pointer" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 px-1">BG Color</label>
                        <input type="color" value={formData.qrSettings?.bgColor || '#000000'} onChange={e => updateField('qrSettings', { ...formData.qrSettings, bgColor: e.target.value, useCustomColors: true })} className="w-full h-12 rounded-xl bg-slate-950 border border-white/10 p-1 cursor-pointer" />
                     </div>
                  </div>
               </div>
               <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center space-y-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10"><QrCode className="w-24 h-24 text-blue-500" /></div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Protocol Preview Ready</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
           <div className="space-y-10 animate-in fade-in">
              <StudioHeader 
                title="Neural Registry" 
                description="Evolutionary governance for automated content synthesis." 
                icon={Monitor} 
                onRun={runBrainAudit}
                label="Neural Audit & Evolve"
              />

              <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                 <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Maturity Index</span>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Organizational Neural State</h4>
                    </div>
                    <div className="flex-1 max-w-md flex flex-col gap-2">
                       <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Seed Node</span>
                          <span>{auditResults?.maturityScore || 45}% Verified</span>
                          <span>Neural Maturity</span>
                       </div>
                       <div className="h-4 bg-slate-950 rounded-full border border-white/5 overflow-hidden p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full transition-all duration-1000 animate-shimmer" 
                            style={{ width: `${auditResults?.maturityScore || 45}%`, backgroundSize: '200% 100%' }} 
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {auditResults && (
                <div className="p-8 bg-blue-900/10 border border-blue-500/20 rounded-[3rem] space-y-8 animate-in slide-in-from-top-4 duration-700">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg"><BrainCircuit className="w-6 h-6" /></div>
                        <div>
                           <h4 className="text-xl font-black text-white uppercase tracking-tight">Audit Findings</h4>
                           <p className="text-xs text-slate-400">Gemini 3 Pro identified {auditResults.suggestions.length} DNA Splices.</p>
                        </div>
                      </div>
                      <button onClick={() => setAuditResults(null)} className="p-2 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                   </div>
                   
                   <div className="grid lg:grid-cols-2 gap-6">
                      {auditResults.suggestions.map((s, i) => (
                        <div key={i} className="p-6 bg-slate-900/60 border border-white/10 rounded-[2rem] space-y-4 group hover:border-blue-500/30 transition-all">
                           <div className="flex items-center justify-between">
                              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[8px] font-black uppercase tracking-widest">{s.field} enhancement</span>
                              <div className="flex items-center gap-1.5 text-emerald-500 animate-pulse"><ZapIcon className="w-3 h-3" /><span className="text-[8px] font-black uppercase">DNA Splice</span></div>
                           </div>
                           <p className="text-xs text-slate-300 font-medium italic">"{s.reasoning}"</p>
                           <div className="p-4 bg-slate-950 border border-white/5 rounded-xl">
                              <p className="text-[10px] text-blue-400 font-mono leading-relaxed">{s.improvement}</p>
                           </div>
                           <button 
                             type="button" 
                             onClick={() => applySplice(s.field, s.improvement)}
                             className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2"
                           >
                             <RefreshCw className="w-3 h-3" /> Merge into Protocol
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1">Core Archetype</label>
                    <input value={formData.brainRegistry?.archetype} onChange={e => updateField('brainRegistry', { ...formData.brainRegistry, archetype: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white font-bold" placeholder="e.g. The Outlaw, The Sage..." />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1">Cultural Nuance</label>
                    <input value={formData.brainRegistry?.culturalNuance} onChange={e => updateField('brainRegistry', { ...formData.brainRegistry, culturalNuance: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white font-bold" placeholder="e.g. High-context, Global-first..." />
                 </div>
                 <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1">Narrative DNA</label>
                    <textarea value={formData.brainRegistry?.narrative} onChange={e => updateField('brainRegistry', { ...formData.brainRegistry, narrative: e.target.value })} rows={4} className="w-full p-6 rounded-[2rem] bg-slate-950 border border-white/10 text-slate-300 font-medium leading-relaxed" placeholder="The core story behind every output..." />
                 </div>
                 <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1">Visual Guardrails</label>
                    <textarea value={formData.brainRegistry?.visualConstraints} onChange={e => updateField('brainRegistry', { ...formData.brainRegistry, visualConstraints: e.target.value })} rows={4} className="w-full p-6 rounded-[2rem] bg-slate-950 border border-white/10 text-slate-300 font-medium leading-relaxed" placeholder="Technical visual rules for image generation..." />
                 </div>
                 <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 px-1 flex items-center gap-2"><Braces className="w-3 h-3" /> Master Backend Brain Protocol (Read Only View of Merged logic)</label>
                    <div className="p-6 bg-slate-950 border border-white/5 rounded-[2.5rem] font-mono text-[10px] text-slate-500 overflow-hidden relative">
                       <div className="absolute top-0 right-0 p-6 opacity-20"><Cpu className="w-20 h-20" /></div>
                       <pre className="whitespace-pre-wrap">{formData.intelligenceBrain || '// PROTOCOL EMPTY'}</pre>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'components' && (
           <div className="space-y-10 animate-in fade-in">
              <StudioHeader title="Global Asset Vault" description="Master file repository links." icon={DownloadCloud} />
              <div className="grid gap-4">
                 <div className="p-8 bg-slate-900/40 border border-white/10 rounded-[2rem] flex gap-4">
                    <input value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} placeholder="Asset Title..." className="flex-1 px-5 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-bold" />
                    <input value={newAsset.url} onChange={e => setNewAsset({...newAsset, url: e.target.value})} placeholder="Direct URL Protocol..." className="flex-1 px-5 py-3 rounded-xl bg-slate-950 border border-white/10 text-blue-400 font-mono text-xs" />
                    <button type="button" onClick={() => { if(!newAsset.url) return; updateField('assets', [...(formData.assets || []), { id: Date.now().toString(), name: newAsset.name || 'Specimen', url: newAsset.url, type: 'archive', format: 'SVG', size: 'Native' }]); setNewAsset({ name: '', url: '' }); }} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Link Node</button>
                 </div>
                 <div className="grid gap-3">
                    {(formData.assets || []).map((asset, i) => (
                       <div key={i} className="p-5 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500"><FileCode className="w-5 h-5" /></div>
                             <div><span className="block text-sm font-black text-slate-200 uppercase">{asset.name}</span><span className="text-[10px] font-mono text-slate-500 uppercase">{asset.format} • ARCHIVE NODE</span></div>
                          </div>
                          <button type="button" onClick={() => updateField('assets', formData.assets.filter((_, idx) => idx !== i))} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </form>
      <div className="p-10 bg-slate-900/50 border-t border-white/5 flex items-center justify-between shrink-0">
        <button type="button" onClick={onCancel} className="px-10 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Discard Draft</button>
        <button type="submit" className="px-14 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center gap-3"><Save className="w-5 h-5" /> Commit to Database</button>
      </div>
    </div>
  );
};

export default BrandEditor;
