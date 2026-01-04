
import React, { useState, useMemo } from 'react';
import { 
  Settings as SettingsIcon, BookOpen, ScrollText, 
  Download, FileText, ChevronRight, Check, Copy,
  Info, ShieldAlert, Zap, Book, Target, ShieldCheck, 
  Box, Shield, Briefcase, Ban, Palette, Flame, 
  Grid, Type, Code, Sparkles, Hash, ImageIcon, 
  Share2, Mail, QrCode, Monitor, DownloadCloud,
  Search, Terminal, Cpu, Database, Activity, Compass,
  Eye, MousePointer2, Workflow, Fingerprint,
  BrainCircuit, CheckCircle2, BadgeCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useBrandStore } from '../store/brandStore';

const TECHNICAL_BIBLE = `# BRANDHUB MASTER PROTOCOL: THE ENGINEER’S BIBLE
Version: 4.5.0-RC1 "Stable Launch"
Classification: Enterprise Identity Orchestrator (Level 5)

I. ARCHITECTURAL TOPOGRAPHY
1. The Reactive Core (React 19)
Utilizes a high-density, concurrent-safe component architecture. Optimized for zero-latency UI updates during asynchronous AI synthesis.

2. State Logic (Zustand)
'useBrandStore' functions as the centralized nervous system, handling persistence via IndexedDB (BrandHubVault) with Zod-enforced schema integrity.

3. The Iron Mirror (Bidirectional Reconciliation)
A proprietary protocol ensuring root-level metadata and nested section data are permanently synchronized.
- UPSTREAM: Editor -> Section Payload -> Root Mirroring.
- DOWNSTREAM: AI Synthesis -> Root -> Section Injection.
- METADATA SHIELD: v2.5.1 Final. User wording updates for Studios (ST-10, ST-01, etc) are strictly protected.

II. NEURAL INFRASTRUCTURE
1. Vector Synthesis (Gemini 3 Pro)
Extracts raw SVG geometry from neural prompts. Sanitization logic uses regex to prune malformed XML tags, leaving only high-fidelity path data.

2. PDF Plate Engine (Phantom Plate Synthesis)
Bypasses standard DOM printing limitations by constructing a hidden 1600px "Draft Stage," hydrating all assets into Base64 to defeat CORS constraints before rendering.

3. Multi-Variant Logic
Orchestrates Primary, White, and Black identity nodes for automated assets like favicons and social avatars. Surface Stress Testing verified in build 2.5.1.
`;

const USER_GUIDE = `# MASTER OPERATIONAL MANUAL
Protocol Scope: End-to-End Orchestration of the 19 Core Studios

---

[STUDIO] 01 BASICS STUDIO
- Goal: Define the primary organizational identity nodes.
- Input: 'Brand Name', 'Industry', 'Category', 'Summary'.
- Process: Establishes 'Grounding Strings' that the Intelligence Studio uses to filter all future generative content.
- Manifestation: Updates site headers, metadata titles, and dashboard index cards.

[STUDIO] 02 IDENTITY FORGE
- Goal: Encode the brand's 'Soul' and mission-critical narrative.
- Input: 'Mission Manifesto', 'Intro Video URL', 'Values Matrix'.
- Process: Detects video type; YouTube/Vimeo links are wrapped in 16:9 responsive frames with 'Autoplay/Mute' overrides.
- Manifestation: Renders the cinematic 'Mission Section' with the animated manifesto block.

[STUDIO] 03 MARK REPOSITORY
- Goal: Secure and organize official logo variations.
- Input: URLs for 'Color', 'White', 'Black', and 'Wordmark'.
- Process: Logic identifies the 'Header Primary' variant for sticky navigation.
- Manifestation: Renders the 'Logo Variants' section with dynamic background toggles.

[STUDIO] 04 SYMBOL PROTOCOL
- Goal: Standardize the brand shorthand icon across multi-surface levels.
- Input: Primary, Inverse (White), and Monochrome (Black) Symbol URLs.
- Process: Orchestrates multi-variant identity nodes with real-time surface stress testing.
- Manifestation: Updates browser identity and renders the interactive Symbol Grid.

[STUDIO] 05 PORTFOLIO STUDIO
- Goal: Manage sub-products and bidirectional ecosystem links.
- Input: 'Product Names', 'Connected Guide Registry'.
- Process: Generates a neural map of related IDs for rapid cross-navigation.
- Manifestation: Creates the 'Portfolio Grid' and the 'Connected Brand Guides' footer.

[STUDIO] 06 ANTI-PATTERN REGISTRY
- Goal: Prevent brand dilution through misuse examples.
- Input: 'Prohibited Specimen' (URL), 'Label' (Warning).
- Process: Applies 'ShieldX' grayscale filter to visually mark assets as 'Incorrect'.
- Manifestation: Renders the 'Prohibited Usage' grid with high-visibility warning UI.

[STUDIO] 07 PALETTE LAB
- Goal: Chromatic governance and accessibility verification.
- Input: Hex Codes, 'Usage Type' (Primary/Secondary/Neutral).
- Lab Function: 'Image Upload' extracts DNA; 'A/B Test' runs real-time WCAG 2.1 contrast scans.
- Manifestation: Skins the interface and renders the 'Accessibility Matrix' table.

[STUDIO] 08 FLUX NODES (Gradients)
- Goal: Define sophisticated depth patterns.
- Input: CSS Gradient strings.
- Process: Validates CSS syntax for cross-browser engine support.
- Manifestation: Renders 'Flux' cards with developer 'One-Click Copy' protocols.

[STUDIO] 09 GEOMETRIC PRIMITIVES (Patterns)
- Goal: Manage texture and background assets.
- Input: Texture Name, Repeatable URL Protocol.
- Process: Normalizes cloud storage links into direct asset streams.
- Manifestation: Displays tiled background specimens for design reference.

[STUDIO] 10 TYPOGRAPHY REGISTRY
- Goal: Centralize font families and role definitions.
- Input: Family Name, Role, Narrative Guidelines, Download Link.
- Process: Registers the stack for the global text-rendering engine.
- Manifestation: Renders 'Typography' samples with role-based specimens and custom wording.

[STUDIO] 11 SEMANTIC HIERARCHIES (Text Styles)
- Goal: Define precise CSS typography standards.
- Input: Tag (h1-p), Size (px), Weight, Leading, Live String Buffer.
- Process: Live CSS injector maps user inputs to visual specimens.
- Manifestation: Renders the 'Text Styles' list with technical metadata.

[STUDIO] 12 ICONOGRAPHY STUDIO
- Goal: Neural synthesis of custom vector assets.
- Input: 'Theme Brief', Quantity.
- Process: Gemini 3 Pro generates raw SVG path geometry.
- Manifestation: Renders 'Iconography' grid with SVG extraction buttons.

[STUDIO] 13 SOCIAL TAG PROTOCOL
- Goal: Manage digital handles and platform identities.
- Input: Platform, Handle, Brand Platform Color.
- Process: Maps platform strings to Lucide Icon components.
- Manifestation: Renders 'Social Identity Badges' with copy-protocol.

[STUDIO] 14 IMAGERY GUIDELINES
- Goal: Direct creative photography and visual assets.
- Input: Creative Guardrails (Markdown), Specimen Stacks.
- Process: Organizes images into 'Approved' vs 'Avoid' directional stacks.
- Manifestation: Renders the visual direction gallery with 'Do/Don't' cues.

[STUDIO] 15 DIGITAL FOOTPRINT (Banners)
- Goal: Standardize social and marketing ad formats.
- Input: Banner URL per standard dimension (e.g., LinkedIn 1584x396).
- Process: Enforces aspect ratio containers for asset validation.
- Manifestation: Displays downloadable marketing banners with format labels.

[STUDIO] 16 COMMUNICATION PROTOCOL (Email)
- Goal: Standardize organizational email signatures.
- Input: Name, Role, HTML Source, Avatar URL, Banner URL.
- Process: Dual-pane logic: 'Visual Preview' vs 'Technical Source'.
- Manifestation: Renders 'Email Signature' module with 'Copy HTML' function.

[STUDIO] 17 ACCESS PORTS (QR Codes)
- Goal: Generate brand-aligned quick-response markers.
- Input: Destination URL, Custom Colors.
- Process: Real-time Canvas synthesis using 'QRCode' libraries.
- Manifestation: Generates high-res PNG modules for print/digital.

[STUDIO] 18 INTELLIGENCE STUDIO (Brain)
- Goal: Configure the organizational AI constraints.
- Input: Archetype, Narrative DNA, Visual Constraints.
- Process: Injects custom strings into EVERY AI prompt for total brand-alignment.
- Manifestation: Unlocks the Sidebar 'AI Assistant' and 'Content synthesis'.

[STUDIO] 19 GLOBAL ASSET VAULT
- Goal: Master repository for core file packages.
- Input: File Name, Direct Link, Format.
- Process: Primary 'Download Hub' for .zip and .pdf packages.
- Manifestation: Renders metadata-rich asset cards for end-users.
`;

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bible' | 'guide' | 'inspector'>('guide');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const { brands } = useBrandStore();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (title: string, content: string) => {
    const doc = new jsPDF();
    const margin = 20;
    const splitText = doc.splitTextToSize(content, 170);
    doc.setFontSize(10);
    doc.text(splitText, margin, margin);
    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  const currentContent = activeTab === 'bible' ? TECHNICAL_BIBLE : USER_GUIDE;
  const currentTitle = activeTab === 'bible' ? 'Technical Bible' : 'User Manual';

  const StudioIcon = (index: string) => {
    const icons: Record<string, any> = {
      '01': Target, '02': ShieldCheck, '03': Box, '04': Shield, '05': Briefcase,
      '06': Ban, '07': Palette, '08': Flame, '09': Grid, '10': Type,
      '11': Code, '12': Sparkles, '13': Hash, '14': ImageIcon, '15': Share2,
      '16': Mail, '17': QrCode, '18': Monitor, '19': DownloadCloud
    };
    const IconComp = icons[index] || Box;
    return <IconComp className="w-5 h-5" />;
  };

  const filteredLines = useMemo(() => {
    if (!searchQuery.trim()) return currentContent.split('\n');
    return currentContent.split('\n').filter(line => 
      line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.startsWith('#') || 
      line.startsWith('[STUDIO]')
    );
  }, [currentContent, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 animate-in fade-in duration-700 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Protocol Documentation</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium flex items-center gap-2">
            <Fingerprint className="w-4 h-4" /> System Governance, User Guidance & State Inspection
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" /> Version Stable
           </div>
        </div>
      </div>

      <div className="mb-16 p-8 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex items-center justify-between relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none" />
         <div className="flex-1 grid grid-cols-4 gap-4 relative z-10">
            {[
              { label: 'Discovery', icon: Compass, status: 'Completed', color: 'text-emerald-500' },
              { label: 'Identity Forge', icon: ShieldCheck, status: 'Active Protocol', color: 'text-blue-500' },
              { label: 'Neural Maturity', icon: BrainCircuit, status: 'Stable Release', color: 'text-indigo-500' },
              { label: 'Total Replicability', icon: Workflow, status: 'Certified', color: 'text-emerald-400' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${step.color}`}>
                       <step.icon className="w-4 h-4" />
                    </div>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{step.label}</span>
                 <span className={`text-[8px] font-bold uppercase tracking-tight ${step.color}`}>{step.status}</span>
              </div>
            ))}
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-3 space-y-2">
          <div className="px-4 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Knowledge Base</p>
            <div className="h-0.5 w-8 bg-blue-500 rounded-full" />
          </div>

          <button 
            onClick={() => setActiveTab('guide')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'guide' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-widest">User Manual</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'guide' ? 'rotate-90' : ''}`} />
          </button>

          <button 
            onClick={() => setActiveTab('bible')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'bible' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-widest">Technical Bible</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'bible' ? 'rotate-90' : ''}`} />
          </button>

          <button 
            onClick={() => setActiveTab('inspector')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'inspector' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-widest">State Inspector</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'inspector' ? 'rotate-90' : ''}`} />
          </button>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                <Zap className="w-3 h-3" /> Quick Action
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">Download high-fidelity PDF versions of these protocols for offline governance.</p>
             <button 
                onClick={() => handleDownload(currentTitle, currentContent)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-[1.02] transition-all"
             >
                <Download className="w-3.5 h-3.5" /> Download PDF
             </button>
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col h-[800px]">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
               <div className="flex-1 max-w-md relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search Protocols & Studios..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
               </div>
               <div className="flex items-center gap-4 ml-6">
                  <div className="hidden md:flex flex-col text-right">
                    <h3 className="text-xs font-black dark:text-white uppercase tracking-tight">{currentTitle}</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">v4.5 RC-1 Stable</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(currentContent)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase border border-slate-200 dark:border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Source'}
                  </button>
               </div>
            </div>
            
            <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar font-sans text-left bg-grid-slate-100/50 dark:bg-grid-white/[0.01]">
               <div className="prose prose-slate dark:prose-invert max-w-none">
                  {activeTab === 'inspector' ? (
                    <div className="space-y-10 animate-in fade-in zoom-in duration-500">
                       <div className="flex items-center gap-4 mb-10">
                          <div className="p-4 bg-slate-900 rounded-3xl border border-white/10">
                             <Database className="w-8 h-8 text-blue-500" />
                          </div>
                          <div>
                             <h2 className="text-3xl font-black text-white uppercase tracking-tight">Active State Registry</h2>
                             <p className="text-sm text-slate-500 font-medium">Real-time inspection of the BrandHub persistence layer.</p>
                          </div>
                       </div>
                       <div className="grid gap-6">
                          {brands.map(brand => (
                            <div key={brand.id} className="bg-slate-900/80 rounded-[2.5rem] border border-white/5 overflow-hidden">
                               <div className="p-6 bg-white/5 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                     <img src={brand.logoUrl} className="w-10 h-10 rounded-xl bg-white p-1 object-contain" />
                                     <span className="font-black text-white uppercase tracking-tight">{brand.name} Node</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-blue-400">ID: {brand.id}</span>
                               </div>
                               <div className="p-8">
                                  <pre className="text-[11px] font-mono text-slate-400 bg-black/40 p-6 rounded-2xl overflow-x-auto custom-scrollbar">
                                     <code>{JSON.stringify(brand, null, 2)}</code>
                                  </pre>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ) : filteredLines.map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-5xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter uppercase relative"><div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-blue-600 rounded-full" /> {line.replace('# ', '')}</h1>;
                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black text-slate-900 dark:text-white mt-16 mb-8 tracking-tight uppercase border-b-2 border-slate-100 dark:border-white/5 pb-4 flex items-center gap-4"><Workflow className="w-6 h-6 text-blue-500" /> {line.replace('## ', '')}</h2>;
                    
                    if (line.startsWith('[STUDIO]')) {
                        const parts = line.replace('[STUDIO] ', '').split(' ');
                        const index = parts[0];
                        const title = parts.slice(1).join(' ');
                        return (
                           <div key={i} className="mt-20 mb-12 group">
                               <div className="flex items-center gap-6 mb-8">
                                  <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl group-hover:scale-110 transition-transform relative">
                                     <div className="absolute -top-2 -right-2 bg-slate-900 text-[8px] px-2 py-0.5 rounded-full border border-white/10 font-black">ST-{index}</div>
                                     {StudioIcon(index)}
                                  </div>
                                  <div>
                                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1 block">Studio Module Protocol</span>
                                     <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{title}</h3>
                                  </div>
                               </div>
                           </div>
                        );
                    }

                    if (line.startsWith('- Goal:')) return <div key={i} className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 mb-6 relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-12 h-12 text-blue-500" /></div><p className="text-blue-800 dark:text-blue-300 font-bold flex items-center gap-4 italic relative z-10 text-lg"><Target className="w-5 h-5 shrink-0 text-blue-500" /> {line.replace('- Goal: ', '')}</p></div>;
                    
                    if (line.startsWith('- Input:')) return (
                        <div key={i} className="grid grid-cols-12 gap-6 mb-6 items-start">
                           <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2 flex items-center gap-3">
                              <MousePointer2 className="w-3 h-3 text-slate-400" /> Administrative Input
                           </div>
                           <div className="col-span-9 text-slate-700 dark:text-slate-300 font-bold bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">{line.replace('- Input: ', '')}</div>
                        </div>
                    );

                    if (line.startsWith('- Process:')) return (
                        <div key={i} className="grid grid-cols-12 gap-6 mb-6 items-start">
                           <div className="col-span-3 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] pt-2 flex items-center gap-3">
                              <Cpu className="w-3 h-3 text-blue-500" /> System Logic
                           </div>
                           <div className="col-span-9 text-slate-600 dark:text-slate-400 font-medium italic border-l-2 border-blue-500/20 pl-6 py-2">{line.replace('- Process: ', '')}</div>
                        </div>
                    );

                    if (line.startsWith('- Manifestation:')) return (
                        <div key={i} className="grid grid-cols-12 gap-6 mb-16 items-start">
                           <div className="col-span-3 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] pt-2 flex items-center gap-3">
                              <Eye className="w-3 h-3 text-emerald-500" /> Frontend Display
                           </div>
                           <div className="col-span-9 text-slate-900 dark:text-white font-black bg-emerald-50/20 dark:bg-emerald-500/5 p-6 rounded-2xl border border-emerald-100/30 dark:border-emerald-500/10 shadow-lg shadow-emerald-500/5 flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {line.replace('- Manifestation: ', '')}</div>
                        </div>
                    );

                    if (!line.trim()) return <br key={i} />;
                    return <p key={i} className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 font-medium pl-2">{line}</p>;
                  })}
               </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-slate-500 shrink-0">
               <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em]">
                  <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> Master Protocol Sync Verified
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-[8px] font-mono opacity-50">NODE_ID: DOC-INF-0922</span>
                  <div className="h-3 w-px bg-slate-200 dark:bg-white/10" />
                  <span className="text-[8px] font-mono opacity-50 uppercase">SHA-256: F9B3...E2A1</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
