
import { z } from 'zod';

export const ColorSchema = z.object({
  name: z.string().default('Unnamed Color'),
  hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default('#000000'),
  usage: z.enum(['primary', 'secondary', 'accent', 'neutral']).default('primary'),
});

export const GradientSchema = z.object({
  name: z.string().default('Unnamed Gradient'),
  css: z.string().default('linear-gradient(135deg, #000, #fff)'),
});

export const SectionTypeSchema = z.enum([
  'hero', 'identity', 'logos', 'brandIcon', 'colors', 'gradients', 
  'patterns', 'typography', 'textStyles', 'iconography', 'socialIcons',
  'imagery', 'social', 'signatures', 'qr', 'ai', 'assets', 'misuse', 'products', 'custom'
]);

export const BrandSectionSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  isVisible: z.boolean().default(true),
  data: z.any().default({}),
  order: z.number().default(0),
});

export const BackgroundSettingsSchema = z.object({
  style: z.enum(['none', 'mesh', 'dots', 'orion', 'flow', 'circuit', 'aurora', 'spectral', 'solid', 'ribbons']).default('none'),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  opacity: z.number().optional(),
  blur: z.number().optional(),
  animate: z.boolean().optional(),
});

export const LogoHeroSettingsSchema = z.object({
  variant: z.string().default('color'),
  alignment: z.enum(['left', 'center']).default('left'),
  scaling: z.number().default(1),
  background: z.enum(['none', 'glass', 'solid']).default('glass'),
  showInDetail: z.boolean().default(true),
  padding: z.number().default(8),
});

export const BrandSchema = z.object({
  id: z.string().uuid().or(z.string()),
  version: z.string().default('2.0.0'),
  name: z.string().min(1, "Brand name required").default('New Protocol'),
  entityType: z.enum(['brand', 'product']).default('brand'),
  isVisible: z.boolean().default(true),
  category: z.string().default('Other'),
  logoUrl: z.string().url().or(z.string().length(0)).default(''),
  coverImage: z.string().url().or(z.string().length(0)).default(''),
  introVideoUrl: z.string().url().or(z.string().length(0)).optional(),
  description: z.string().default(''),
  industry: z.string().default('Technology'),
  tagline: z.string().optional(),
  archetype: z.string().optional(),
  sections: z.array(BrandSectionSchema).default([]),
  
  toneOfVoice: z.array(z.string()).default([]),
  colors: z.array(ColorSchema).default([]),
  gradients: z.array(GradientSchema).default([]),
  patterns: z.array(z.any()).default([]),
  typography: z.array(z.any()).default([]),
  textStyles: z.array(z.any()).default([]),
  assets: z.array(z.any()).default([]),
  icons: z.array(z.any()).default([]),
  aiIconSets: z.array(z.any()).default([]),
  imagery: z.array(z.any()).default([]),
  imageryGuidelines: z.string().optional(),
  iconographyRights: z.string().optional(),
  iconographySettings: z.string().optional(),
  logoUsageDonts: z.array(z.any()).default([]),
  logoGuidelines: z.object({
    clearSpace: z.string().default(''),
    minSizeDigital: z.string().default(''),
    minSizePrint: z.string().default(''),
    useCases: z.string().default(''),
  }).default({}),
  signatures: z.array(z.any()).default([]),
  emailBanners: z.array(z.any()).default([]),
  values: z.array(z.any()).default([]),
  missionStatement: z.string().optional(),
  logos: z.record(z.string()).default({}),
  hiddenLogos: z.array(z.string()).default([]),
  hideMainLogo: z.boolean().optional().default(false),
  hideBrandIcon: z.boolean().optional().default(false),
  brandIcon: z.object({
    url: z.string().default(''),
    whiteUrl: z.string().optional(),
    blackUrl: z.string().optional(),
    usageRights: z.string().default(''),
    settings: z.string().default(''),
  }).default({}),
  logoHero: LogoHeroSettingsSchema.optional(),
  socials: z.array(z.any()).default([]),
  socialIcons: z.object({
    icons: z.array(z.any()).default([]),
    guidelines: z.string().default(''),
    examples: z.array(z.any()).default([]),
  }).default({ icons: [], guidelines: '', examples: [] }),
  socialBanners: z.array(z.any()).default([]),
  socialExamples: z.array(z.any()).default([]),
  digitalBanners: z.array(z.any()).default([]),
  products: z.array(z.string()).default([]),
  subBrands: z.array(z.any()).default([]),
  hideAIAssistant: z.boolean().optional().default(false),
  backgroundSettings: BackgroundSettingsSchema.optional(),
});

export type ValidatedBrand = z.infer<typeof BrandSchema>;
