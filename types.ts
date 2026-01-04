
export type SectionType = 
  | 'hero' 
  | 'identity' 
  | 'logos' 
  | 'brandIcon' 
  | 'colors' 
  | 'gradients' 
  | 'patterns' 
  | 'typography' 
  | 'textStyles' 
  | 'iconography' 
  | 'socialIcons'
  | 'imagery' 
  | 'social' 
  | 'signatures' 
  | 'qr' 
  | 'ai' 
  | 'assets'
  | 'misuse'
  | 'products'
  | 'custom';

export type EntityType = 'brand' | 'product';

export interface FileEntry {
  path: string;
  name: string;
  isDir: boolean;
}

export interface ProjectAnalysis {
  projectName: string;
  summary: string;
  technologies: string[];
  architectureOverview: string;
  suggestedImprovements: string[];
}

export type PageFormat = 'a4' | 'letter' | 'presentation_wide';

export interface NeuralRegistry {
  archetype: string;
  narrative: string;
  visualConstraints: string;
  culturalNuance: string;
  technicalGuardrails: string;
}

export interface CustomBlockData {
  body: string;
  subBody?: string;
  videoUrl?: string;
  images: { id: string; url: string; caption: string }[];
  links: { id: string; label: string; url: string }[];
}

export interface QRProtocolSettings {
  defaultUrl: string;
  preferLogo: boolean;
  useCustomColors: boolean;
  fgColor: string;
  bgColor: string;
}

export interface BrandSection<T = any> {
  id: string;
  type: SectionType;
  title: string;
  description?: string;
  isVisible: boolean;
  data: T;
  order: number;
}

export interface Color {
  name: string;
  hex: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface Gradient {
  name: string;
  css: string;
}

export interface Typography {
  name: string;
  role: 'Heading' | 'Body' | 'Display' | 'Web Safe';
  fontFamily: string;
  sampleText: string;
  weights?: string[];
  description?: string;
  downloadUrl?: string;
}

export interface TextStyle {
  id: string;
  name: string;
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textCase: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  alignment: 'left' | 'center' | 'right' | 'justify';
  safeZone: string;
  sampleText?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'logo' | 'icon' | 'image' | 'presentation' | 'archive';
  url: string;
  format: string;
  size: string;
}

export interface Icon {
  id: string;
  name: string;
  svgPath: string;
  tags: string[];
  category?: string;
}

export interface IconSet {
  id: string;
  name: string;
  description: string;
  icons: Icon[];
  style: 'outlined' | 'filled' | 'minimalist';
  createdAt: number;
}

export interface BrandValue {
  text: string;
  icon: string;
}

export interface UsageImage {
  id: string;
  url: string;
  caption: string;
  type: 'approved' | 'avoid';
}

export interface LogoUsageDont {
  id: string;
  type: 'distort' | 'recolor' | 'rotate' | 'effect' | 'background';
  label: string;
  imageUrl: string;
  backgroundColor?: string;
}

export interface EmailSignature {
  id: string;
  name: string;
  userName?: string;
  userRole?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  previewUrl: string;
  downloadUrl: string;
  htmlCode?: string;
}

export interface EmailBanner {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  directive: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SocialExample {
  id: string;
  platform: string;
  imageUrl: string;
  caption: string;
}

export interface SocialBanner {
  id: string;
  platform: 'LinkedIn' | 'X (Twitter)' | 'Instagram' | 'Facebook' | 'YouTube' | 'Other';
  url: string;
  dimensions: string;
}

export interface DigitalBanner {
  id: string;
  formatName: string;
  url: string;
  width: number;
  height: number;
}

export interface SocialIconProtocol {
  platform: string;
  handle: string;
  svgPath: string;
  color: string;
}

export interface BackgroundSettings {
  style: 'none' | 'mesh' | 'dots' | 'orion' | 'flow' | 'circuit' | 'aurora' | 'spectral' | 'solid' | 'ribbons';
  primaryColor?: string;
  secondaryColor?: string;
  opacity?: number;
  blur?: number;
  animate?: boolean;
}

export interface LogoHeroSettings {
  variant: string;
  alignment: 'left' | 'center';
  scaling: number;
  background: 'none' | 'glass' | 'solid';
  showInDetail: boolean;
  padding: number;
}

export interface Brand {
  id: string;
  version: string;
  name: string;
  entityType: EntityType;
  isVisible: boolean;
  category: string;
  logoUrl: string;
  coverImage: string;
  websiteUrl?: string;
  introVideoUrl?: string;
  description: string;
  industry: string;
  tagline?: string;
  archetype?: string;
  updatedAt: number;
  status: 'active' | 'maintenance' | 'deprecated';
  sections: BrandSection[];
  
  toneOfVoice: string[];
  colors: Color[];
  gradients: Gradient[];
  patterns: { name: string; url: string }[];
  typography: Typography[];
  textStyles: TextStyle[];
  assets: Asset[];
  icons: Icon[];
  aiIconSets: IconSet[];
  imagery: UsageImage[];
  imageryGuidelines?: string;
  iconographyRights?: string;
  iconographySettings?: string;
  logoUsageDonts: LogoUsageDont[];
  logoGuidelines: {
    clearSpace: string;
    minSizeDigital: string;
    minSizePrint: string;
    useCases: string;
  };
  signatures: EmailSignature[];
  emailBanners: EmailBanner[];
  values: BrandValue[];
  missionStatement?: string;
  logos: {
    color: string;
    white: string;
    black: string;
    stacked: string;
    wordmark: string;
    [key: string]: string; 
  };
  hiddenLogos?: string[];
  hideMainLogo?: boolean;
  hideBrandIcon?: boolean;
  headerLogoVariant?: string;
  brandIcon: {
    url: string;
    whiteUrl?: string;
    blackUrl?: string;
    usageRights: string;
    settings: string;
  };
  logoHero?: LogoHeroSettings;
  socials: SocialLink[];
  socialIcons: {
    icons: SocialIconProtocol[];
    guidelines: string;
    examples: UsageImage[];
  };
  socialBanners: SocialBanner[];
  socialExamples: SocialExample[];
  digitalBanners: DigitalBanner[];
  products: string[]; 
  linkedBrandIds?: string[];
  subBrands: any[];
  hideAIAssistant?: boolean;
  intelligenceBrain?: string; 
  brainRegistry?: NeuralRegistry;
  backgroundSettings?: BackgroundSettings;
  qrSettings?: QRProtocolSettings;
}

export type View = 'landing' | 'login' | 'dashboard' | 'brand-detail' | 'brand-editor' | 'vault' | 'stability' | 'settings';
export type Role = 'admin' | 'public';

export interface SystemHealth {
  status: 'nominal' | 'degraded' | 'critical' | 'scanning';
  lastCheck: number;
  faultCount: number;
  message: string;
}

export interface RestorePoint {
  id: string;
  timestamp: number;
  label: string;
  brandCount: number;
  data: any;
}

export interface DiagnosticResult {
  id: string;
  name: string;
  status: 'pending' | 'success' | 'warning' | 'error';
  log: string;
}
