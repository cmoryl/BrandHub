
import { Brand, Icon, TextStyle, BrandSection, SocialBanner, DigitalBanner, EmailBanner, QRProtocolSettings, BackgroundSettings, NeuralRegistry, LogoHeroSettings, Asset, UsageImage, LogoUsageDont } from './types';

export const STORAGE_KEY = 'brand_data_vault_v4';

export const DEFAULT_COLORS = [
  { name: 'TP Dark Blue', hex: '#003b71', usage: 'primary' as const },
  { name: 'TP Light Blue', hex: '#139dd8', usage: 'primary' as const },
  { name: 'Teal', hex: '#3bbfb5', usage: 'accent' as const },
  { name: 'Purple', hex: '#7356c0', usage: 'accent' as const },
  { name: 'Orange', hex: '#ff6600', usage: 'accent' as const },
  { name: 'Pink', hex: '#ec388a', usage: 'accent' as const },
  { name: 'Green', hex: '#7bcd3a', usage: 'accent' as const },
  { name: 'Alabaster', hex: '#e7e3da', usage: 'secondary' as const },
  { name: 'Dark Gray', hex: '#666666', usage: 'neutral' as const },
  { name: 'Light Gray', hex: '#f2f2f2', usage: 'neutral' as const },
  { name: 'Blue White', hex: '#e0e8f8', usage: 'neutral' as const },
];

export const DEFAULT_GRADIENTS = [
  { name: 'Corporate Depth', css: 'linear-gradient(135deg, #003b71 0%, #139dd8 100%)' },
  { name: 'Innovation Teal', css: 'linear-gradient(135deg, #3bbfb5 0%, #7bcd3a 100%)' },
  { name: 'Creative Pulse', css: 'linear-gradient(135deg, #7356c0 0%, #ec388a 100%)' },
  { name: 'Global Energy', css: 'linear-gradient(135deg, #ff6600 0%, #ff9e00 100%)' },
  { name: 'Midnight Horizon', css: 'linear-gradient(180deg, #050a14 0%, #003b71 100%)' },
  { name: 'Stellar Glow', css: 'linear-gradient(45deg, #e0e8f8 0%, #ffffff 100%)' }
];

export const DEFAULT_PATTERNS = [
  { name: 'Subtle Grid', url: 'https://www.transparenttextures.com/patterns/pinstripe-dark.png' },
  { name: 'Connectivity', url: 'https://www.transparenttextures.com/patterns/cubes.png' },
  { name: 'Geometric Dust', url: 'https://www.transparenttextures.com/patterns/asfalt-dark.png' },
  { name: 'Tech Pulse', url: 'https://www.transparenttextures.com/patterns/carbon-fibre.png' }
];

export const DEFAULT_TYPOGRAPHY = [
  { 
    name: 'Poppins', 
    role: 'Heading' as const, 
    fontFamily: 'Poppins, sans-serif', 
    sampleText: 'Global Solutions', 
    weights: ['Bold', 'SemiBold', 'Regular'],
    description: 'Primary Typeface used for headlines and high-level branding.',
    downloadUrl: 'https://fonts.google.com/specimen/Poppins'
  },
  { 
    name: 'Montserrat', 
    role: 'Body' as const, 
    fontFamily: 'Montserrat, sans-serif', 
    sampleText: 'Connecting Business', 
    weights: ['Regular', 'SemiBold', 'Italic'],
    description: 'Secondary Typeface utilized for body copy and supporting documentation.',
    downloadUrl: 'https://fonts.google.com/specimen/Montserrat'
  }
];

export const DEFAULT_TEXT_STYLES: TextStyle[] = [
    {
        id: 'ts-1',
        name: 'Display H1',
        tag: 'h1',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '64px',
        fontWeight: '900',
        lineHeight: '1.05',
        letterSpacing: '-0.03em',
        textCase: 'none',
        alignment: 'left',
        safeZone: 'Margin: 0 0 48px 0',
        sampleText: 'Global Excellence'
    },
    {
        id: 'ts-2',
        name: 'Heading H2',
        tag: 'h2',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '36px',
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.01em',
        textCase: 'none',
        alignment: 'left',
        safeZone: 'Margin: 0 0 32px 0',
        sampleText: 'Enterprise Strategy'
    }
];

export const DEFAULT_SOCIAL_BANNERS: SocialBanner[] = [
  { id: 'sb-1', platform: 'LinkedIn', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1584&h=396&fit=crop', dimensions: '1584 x 396' },
  { id: 'sb-2', platform: 'X (Twitter)', url: 'https://images.unsplash.com/photo-1557426282-08699bd68b57?w=1500&h=500&fit=crop', dimensions: '1500 x 500' },
  { id: 'sb-3', platform: 'Instagram', url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1080&h=1080&fit=crop', dimensions: '1080 x 1080 (Grid Focus)' },
  { id: 'sb-4', platform: 'Facebook', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=820&h=312&fit=crop', dimensions: '820 x 312' }
];

export const DEFAULT_DIGITAL_BANNERS: DigitalBanner[] = [
  { id: 'db-1', formatName: 'Billboard (Wide)', url: '', width: 970, height: 250 },
  { id: 'db-2', formatName: 'Leaderboard', url: '', width: 728, height: 90 },
  { id: 'db-4', formatName: 'Medium Rectangle', url: '', width: 300, height: 250 },
  { id: 'db-6', formatName: 'Square', url: '', width: 250, height: 250 },
];

export const DEFAULT_EMAIL_BANNERS: EmailBanner[] = [
  { 
    id: 'eb-1', 
    name: 'Primary Campaign Banner', 
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=120&fit=crop', 
    width: 600, 
    height: 120, 
    directive: 'Center 100% (Avoid edges for critical CTAs)' 
  }
];

export const DEFAULT_QR_SETTINGS: QRProtocolSettings = {
  defaultUrl: 'https://www.transperfect.com',
  preferLogo: true,
  useCustomColors: true,
  fgColor: '#003b71',
  bgColor: '#ffffff'
};

export const DEFAULT_BACKGROUND_SETTINGS: BackgroundSettings = {
  style: 'orion',
  primaryColor: '#003b71',
  secondaryColor: '#139dd8',
  opacity: 0.4,
  blur: 0,
  animate: true
};

export const DEFAULT_BRAIN_REGISTRY: NeuralRegistry = {
  archetype: 'The Global Connector',
  narrative: 'A story of precision, high-touch service, and technical mastery that bridges cultures.',
  visualConstraints: 'Ample negative space, high contrast corporate blues, and professional photography.',
  culturalNuance: 'Respectful, localized, and multi-cultural in outlook.',
  technicalGuardrails: 'WCAG compliance for all digital assets and vector-first iconography.'
};

export const DEFAULT_HERO_SETTINGS: LogoHeroSettings = {
  variant: 'color',
  alignment: 'left',
  scaling: 1.1,
  background: 'glass',
  showInDetail: true,
  padding: 8
};

export const generateMainSignatureHTML = (name: string, role: string, brandName: string, primaryColor: string, logoUrl: string, profileUrl?: string, bannerUrl?: string) => `
<div style="font-family: 'Poppins', Helvetica, sans-serif;">
  <table cellpadding="0" cellspacing="0" style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; width: 100%; max-width: 600px;">
    <tr>
      <td style="padding-right: 30px; vertical-align: top; width: 140px;">
        ${profileUrl ? `<img src="${profileUrl}" alt="${name}" width="100" style="display: block; border-radius: 50%; margin-bottom: 15px;" />` : ''}
        <img src="${logoUrl}" alt="${brandName}" width="140" style="display: block; filter: contrast(1.1);" />
      </td>
      <td style="border-left: 2px solid ${primaryColor}; padding-left: 30px; vertical-align: top;">
        <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">${name}</div>
        <div style="font-size: 13px; font-weight: 600; color: ${primaryColor}; margin-bottom: 12px; text-transform: uppercase;">${role}</div>
        <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
          <strong>T:</strong> +1 212.555.0123<br/>
          <strong>E:</strong> ${name.toLowerCase().replace(' ', '.')}@${brandName.toLowerCase().replace(/\s+/g, '')}.com<br/>
          <strong>W:</strong> ${brandName.toLowerCase().replace(/\s+/g, '')}.com
        </div>
        <div style="margin-top: 12px; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">Global Excellence Protocol</div>
      </td>
    </tr>
  </table>
  ${bannerUrl ? `
  <div style="margin-top: 20px; width: 600px;">
    <img src="${bannerUrl}" alt="Campaign Banner" width="600" style="display: block; border-radius: 8px;" />
  </div>
  ` : ''}
</div>
`;

// Fix: Added missing 'data' property to all DEFAULT_BRAND_SECTIONS to satisfy interface requirements
export const DEFAULT_BRAND_SECTIONS: BrandSection[] = [
  { id: 'sec-identity', type: 'identity', title: 'Brand Identity', isVisible: true, order: 0, description: 'The core foundations of our identity architecture.', data: {} },
  { id: 'sec-logos', type: 'logos', title: 'Logo Variants', isVisible: true, order: 1, description: 'Approved variations of the master logo for diverse applications.', data: {} },
  { id: 'sec-brandIcon', type: 'brandIcon', title: 'Brand Mark', isVisible: true, order: 2, description: 'The shorthand symbol for favicon and minimal UI.', data: {} },
  { id: 'sec-misuse', type: 'misuse', title: 'Anti-Patterns', isVisible: true, order: 3, description: 'Critical prohibited usage guidelines to prevent brand dilution.', data: {} },
  { id: 'sec-colors', type: 'colors', title: 'Color Palette', isVisible: true, order: 4, description: 'The primary chromatic system for all communications.', data: {} },
  { id: 'sec-gradients', type: 'gradients', title: 'Gradients', isVisible: true, order: 5, description: 'Sophisticated depth and transition nodes.', data: {} },
  { id: 'sec-patterns', type: 'patterns', title: 'Patterns', isVisible: true, order: 6, description: 'Tiled texture assets for background orchestration.', data: {} },
  { id: 'sec-typography', type: 'typography', title: 'Typography', isVisible: true, order: 7, description: 'The official typeface registry and usage rules.', data: {} },
  { id: 'sec-textStyles', type: 'textStyles', title: 'Text Styles', isVisible: true, order: 8, description: 'Semantic CSS hierarchies for digital implementation.', data: {} },
  { id: 'sec-iconography', type: 'iconography', title: 'Iconography', isVisible: true, order: 9, description: 'Custom vector assets for high-fidelity communication.', data: {} },
  { id: 'sec-socialIcons', type: 'socialIcons', title: 'Social Tags', isVisible: true, order: 10, description: 'Standard platform handles and platform chromatic tags.', data: {} },
  { id: 'sec-imagery', type: 'imagery', title: 'Imagery Guidelines', isVisible: true, order: 11, description: 'Directional guidance for photography and visual selection.', data: {} },
  { id: 'sec-social', type: 'social', title: 'Social & Digital', isVisible: true, order: 12, description: 'Official channels and marketing banner standards.', data: {} },
  { id: 'sec-signatures', type: 'signatures', title: 'Email Signatures', isVisible: true, order: 13, description: 'Standardized communication handshakes.', data: {} },
  { id: 'sec-qr', type: 'qr', title: 'Access Protocols', isVisible: true, order: 14, description: 'Brand-grounded quick response markers.', data: {} },
  { id: 'sec-ai', type: 'ai', title: 'Intelligence Studio', isVisible: true, order: 15, description: 'Evolutionary governance for automated content.', data: {} },
  { id: 'sec-assets', type: 'assets', title: 'Global Assets', isVisible: true, order: 16, description: 'Centralized repository for master file packages.', data: {} },
  { id: 'sec-products', type: 'products', title: 'Portfolio & Products', isVisible: true, order: 17, description: 'The wider product ecosystem and connected entities.', data: {} }
];

const placeholderLogo = 'https://www.transperfect.com/themes/custom/transperfect/logo.svg';
const placeholderCover = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80';

// Fix: Added missing 'stacked' property to NEW_BRAND_TEMPLATE.logos to satisfy interface requirements
export const NEW_BRAND_TEMPLATE: Brand = {
  id: 'template-' + Math.random().toString(36).substr(2, 9),
  version: '2.5.0',
  entityType: 'brand',
  isVisible: true,
  name: 'New Protocol Hub',
  category: 'Other',
  industry: 'Technology & Innovation',
  websiteUrl: '',
  description: 'This protocol serves as the central orchestration point for all visual and communicative assets.',
  tagline: 'Orchestrating Excellence.',
  logoUrl: placeholderLogo,
  coverImage: placeholderCover,
  updatedAt: Date.now(),
  status: 'active',
  toneOfVoice: ['Professional', 'Visionary'],
  missionStatement: 'To redefine global connectivity through precision.',
  values: [{ text: 'Integrity', icon: 'ShieldCheck' }],
  colors: [...DEFAULT_COLORS],
  gradients: [...DEFAULT_GRADIENTS],
  patterns: [...DEFAULT_PATTERNS],
  typography: [...DEFAULT_TYPOGRAPHY],
  textStyles: [...DEFAULT_TEXT_STYLES],
  assets: [],
  icons: [],
  aiIconSets: [],
  imageryGuidelines: 'Visuals should prioritize light and depth.',
  imagery: [],
  logoUsageDonts: [],
  logoGuidelines: { clearSpace: '20% of width', minSizeDigital: '32px', minSizePrint: '15mm', useCases: 'Primary corporate communications' },
  logos: { color: placeholderLogo, white: placeholderLogo, black: placeholderLogo, stacked: placeholderLogo, wordmark: placeholderLogo },
  brandIcon: { url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=256&h=256&fit=crop', usageRights: 'Reserved Corporate Asset', settings: '1:1 Ratio' },
  socials: [],
  socialIcons: {
    icons: [
      { platform: 'LinkedIn', handle: '@transperfect', color: '#0077B5', svgPath: '' },
      { platform: 'X', handle: '@transperfect', color: '#000000', svgPath: '' }
    ],
    guidelines: 'Use official brand handles across all primary communication channels.',
    examples: []
  },
  socialBanners: [...DEFAULT_SOCIAL_BANNERS],
  socialExamples: [],
  digitalBanners: [...DEFAULT_DIGITAL_BANNERS],
  signatures: [],
  emailBanners: [...DEFAULT_EMAIL_BANNERS],
  products: [],
  linkedBrandIds: [],
  subBrands: [],
  sections: [...DEFAULT_BRAND_SECTIONS],
  qrSettings: { ...DEFAULT_QR_SETTINGS },
  backgroundSettings: { ...DEFAULT_BACKGROUND_SETTINGS },
  brainRegistry: { ...DEFAULT_BRAIN_REGISTRY },
  logoHero: { ...DEFAULT_HERO_SETTINGS }
};

export const BRANDS: Brand[] = [
  {
    ...NEW_BRAND_TEMPLATE,
    id: 'transperfect-id',
    name: 'TransPerfect',
    industry: 'Language & Technology',
    description: 'TransPerfect is the world\'s largest provider of language and technology solutions for global business. From translation to e-discovery and clinical trial management, our mission is to redefine how business works globally.',
    tagline: 'Global Business Simplified.',
    logoUrl: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg',
    // Fix: Added missing 'stacked' property to BRANDS logos to satisfy interface requirements
    logos: {
      color: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg',
      white: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg',
      black: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg',
      stacked: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg',
      wordmark: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg'
    },
    icons: [
      { id: 'ic-1', name: 'Global Network', svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', tags: ['global', 'network'] },
      { id: 'ic-2', name: 'Neural Link', svgPath: 'M13 2L3 14h9v8l10-12h-9l9-8z', tags: ['tech', 'ai'] }
    ],
    imagery: [
      { id: 'im-1', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', caption: 'High-density professional workspace', type: 'approved' },
      { id: 'im-2', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', caption: 'Diverse collaborative environments', type: 'approved' }
    ],
    logoUsageDonts: [
      { id: 'ud-1', type: 'distort', label: 'Do not stretch or compress the mark', imageUrl: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg' },
      { id: 'ud-2', type: 'recolor', label: 'Do not use unapproved chromatic nodes', imageUrl: 'https://www.transperfect.com/themes/custom/transperfect/logo.svg' }
    ],
    assets: [
      { id: 'as-1', name: 'Master Brand Package', url: '#', type: 'archive', format: 'ZIP', size: '42 MB' },
      { id: 'as-2', name: 'Corporate Presentation', url: '#', type: 'presentation', format: 'PPTX', size: '12 MB' }
    ],
    signatures: [
      { 
        id: 'sig-tp-main', 
        name: 'Master Enterprise Protocol', 
        userName: 'Alex Rivera',
        userRole: 'Director of Global Orchestration',
        previewUrl: '', 
        downloadUrl: '', 
        htmlCode: generateMainSignatureHTML('Alex Rivera', 'Director of Global Orchestration', 'TransPerfect', '#003b71', 'https://www.transperfect.com/themes/custom/transperfect/logo.svg') 
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
    category: 'Corporate & Divisions',
    updatedAt: Date.now(),
  }
];
