
// @ts-nocheck
import { Brand, BrandSection, SectionType, RestorePoint } from '../types';
import { BrandSchema } from '../schemas';
import { 
  BRANDS as DEFAULT_BRANDS, 
  NEW_BRAND_TEMPLATE,
  DEFAULT_BRAND_SECTIONS
} from '../constants';
import { getDirectImageUrl } from '../utils/linkUtils';

const DB_NAME = 'BrandHubVault';
const DB_VERSION = 2;
const STORE_NAME = 'brands';
const BACKUP_STORE = 'backups';
const SCHEMA_VERSION = '2.5.6'; 

class VaultDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(BACKUP_STORE)) {
          db.createObjectStore(BACKUP_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  async getAll(): Promise<Brand[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (e) { reject(e); }
    });
  }

  async saveAll(brands: Brand[]): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.clear();
        brands.forEach(brand => {
          // Pre-save sanity check
          const validation = BrandSchema.safeParse(brand);
          if (validation.success) {
            store.add(validation.data);
          } else {
            console.warn(`Vault skipping corrupted node [${brand.name}]:`, validation.error);
          }
        });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      } catch (e) { reject(e); }
    });
  }

  async delete(id: string): Promise<void> {
    await this.init();
    const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id);
  }

  async clear(): Promise<void> {
    await this.init();
    const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).clear();
  }

  async getBackups(): Promise<RestorePoint[]> {
    await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(BACKUP_STORE, 'readonly');
      const store = transaction.objectStore(BACKUP_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.sort((a,b) => b.timestamp - a.timestamp));
    });
  }

  async createBackup(backup: RestorePoint): Promise<void> {
    await this.init();
    const transaction = this.db!.transaction(BACKUP_STORE, 'readwrite');
    transaction.objectStore(BACKUP_STORE).add(backup);
  }

  async deleteBackup(id: string): Promise<void> {
    await this.init();
    const transaction = this.db!.transaction(BACKUP_STORE, 'readwrite');
    transaction.objectStore(BACKUP_STORE).delete(id);
  }
}

const vault = new VaultDB();

class BackendService {
  private sanitizeLinks(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(item => this.sanitizeLinks(item));
    
    const sanitized = { ...obj };
    for (const key in sanitized) {
      const val = sanitized[key];
      if (typeof val === 'string' && (val.includes('dropbox.com') || val.includes('drive.google.com') || val.includes('1drv.ms'))) {
        sanitized[key] = getDirectImageUrl(val);
      } else if (typeof val === 'object') {
        sanitized[key] = this.sanitizeLinks(val);
      }
    }
    return sanitized;
  }

  public migrateAndRepair(brand: any, updateSource: 'top-level' | 'sections' = 'top-level'): Brand {
    brand = this.sanitizeLinks(brand);
    const blueprint = JSON.parse(JSON.stringify(NEW_BRAND_TEMPLATE));
    
    if (updateSource === 'sections' && Array.isArray(brand.sections)) {
      brand.sections.forEach((s: BrandSection) => {
        if (!s.data) return;
        const d = s.data;
        switch (s.type) {
          case 'identity':
            if (d.missionStatement !== undefined) brand.missionStatement = d.missionStatement;
            if (d.toneOfVoice !== undefined) brand.toneOfVoice = d.toneOfVoice;
            if (d.values !== undefined) brand.values = d.values;
            if (d.websiteUrl !== undefined) brand.websiteUrl = d.websiteUrl;
            if (d.introVideoUrl !== undefined) brand.introVideoUrl = d.introVideoUrl;
            if (d.tagline !== undefined) brand.tagline = d.tagline;
            if (d.archetype !== undefined) brand.archetype = d.archetype;
            break;
          case 'logos': 
            const { guidelines, headerLogoVariant, ...variants } = d;
            brand.logos = { ...brand.logos, ...variants }; 
            if (headerLogoVariant !== undefined) brand.headerLogoVariant = headerLogoVariant;
            if (guidelines !== undefined) brand.logoGuidelines = guidelines;
            break;
          case 'brandIcon': 
            brand.brandIcon = { ...brand.brandIcon, ...d }; 
            break;
          case 'colors': brand.colors = d; break;
          case 'gradients': brand.gradients = d; break;
          case 'patterns': brand.patterns = d; break;
          case 'typography': brand.typography = d; break;
          case 'textStyles': brand.textStyles = d; break;
          case 'iconography': 
            if (d.icons) brand.icons = d.icons;
            if (d.aiSets) brand.aiIconSets = d.aiSets;
            break;
          case 'socialIcons': brand.socialIcons = d; break;
          case 'imagery': 
            if (d.guidelines !== undefined) brand.imageryGuidelines = d.guidelines;
            if (d.images !== undefined) brand.imagery = d.images;
            break;
          case 'social':
            if (d.socials) brand.socials = d.socials;
            if (d.banners) brand.socialBanners = d.banners;
            if (d.digital) brand.digitalBanners = d.digital;
            break;
          case 'signatures':
            if (d.signatures) brand.signatures = d.signatures;
            if (d.banners) brand.emailBanners = d.banners;
            break;
          case 'qr': brand.qrSettings = d; break;
          case 'ai': brand.brainRegistry = d; break;
          case 'assets': brand.assets = d; break;
          case 'misuse': brand.logoUsageDonts = d; break;
          case 'products': 
            if (d.products) brand.products = d.products;
            if (d.linkedBrandIds) brand.linkedBrandIds = d.linkedBrandIds;
            break;
        }
      });
    }

    const merged: Brand = {
      ...blueprint, 
      ...brand,     
      id: brand.id || blueprint.id, 
      version: SCHEMA_VERSION,
      updatedAt: brand.updatedAt || Date.now(),
      logos: { ...blueprint.logos, ...(brand.logos || {}) },
      brandIcon: { ...blueprint.brandIcon, ...(brand.brandIcon || {}) },
      qrSettings: { ...blueprint.qrSettings, ...(brand.qrSettings || {}) },
      brainRegistry: { ...blueprint.brainRegistry, ...(brand.brainRegistry || {}) },
      logoHero: { ...blueprint.logoHero, ...(brand.logoHero || {}) },
      backgroundSettings: { ...blueprint.backgroundSettings, ...(brand.backgroundSettings || {}) },
      logoGuidelines: { ...blueprint.logoGuidelines, ...(brand.logoGuidelines || {}) }
    };

    const getSyncedSectionData = (type: SectionType, existingSection?: any) => {
      const baseData = existingSection?.data || {};
      switch (type) {
        case 'identity': return { ...baseData, missionStatement: merged.missionStatement, values: merged.values, toneOfVoice: merged.toneOfVoice, websiteUrl: merged.websiteUrl, introVideoUrl: merged.introVideoUrl, tagline: merged.tagline, archetype: merged.archetype };
        case 'logos': return { ...merged.logos, guidelines: merged.logoGuidelines, headerLogoVariant: merged.headerLogoVariant };
        case 'brandIcon': return { ...merged.brandIcon };
        case 'colors': return Array.isArray(merged.colors) ? merged.colors : blueprint.colors;
        case 'gradients': return Array.isArray(merged.gradients) ? merged.gradients : blueprint.gradients;
        case 'patterns': return Array.isArray(merged.patterns) ? merged.patterns : blueprint.patterns;
        case 'typography': return Array.isArray(merged.typography) ? merged.typography : blueprint.typography;
        case 'textStyles': return Array.isArray(merged.textStyles) ? merged.textStyles : blueprint.textStyles;
        case 'iconography': return { ...baseData, icons: merged.icons, aiSets: merged.aiIconSets };
        case 'socialIcons': return { ...merged.socialIcons };
        case 'imagery': return { ...baseData, guidelines: merged.imageryGuidelines, images: merged.imagery };
        case 'social': return { ...baseData, socials: merged.socials, banners: merged.socialBanners, digital: merged.digitalBanners };
        case 'signatures': return { ...baseData, signatures: merged.signatures, banners: merged.emailBanners };
        case 'qr': return { ...merged.qrSettings };
        case 'ai': return { ...merged.brainRegistry };
        case 'assets': return Array.isArray(merged.assets) ? merged.assets : [];
        case 'misuse': return Array.isArray(merged.logoUsageDonts) ? merged.logoUsageDonts : [];
        case 'products': return { products: merged.products, linkedBrandIds: merged.linkedBrandIds };
        default: return baseData;
      }
    };

    const incomingSections = Array.isArray(brand.sections) ? brand.sections : [];
    
    merged.sections = DEFAULT_BRAND_SECTIONS.map(systemSection => {
      const savedSection = incomingSections.find(s => s.type === systemSection.type);
      return {
        ...systemSection, 
        id: savedSection?.id || systemSection.id,
        title: savedSection?.title || systemSection.title,
        description: savedSection?.description || systemSection.description,
        isVisible: savedSection?.isVisible !== undefined ? savedSection.isVisible : systemSection.isVisible,
        order: savedSection?.order !== undefined ? savedSection.order : systemSection.order,
        data: getSyncedSectionData(systemSection.type, savedSection)
      };
    }).sort((a, b) => a.order - b.order);
    
    return merged;
  }

  async fetchBrands(): Promise<Brand[]> {
    const data = await vault.getAll();
    if (data.length === 0) return DEFAULT_BRANDS.map(b => this.migrateAndRepair(b));
    return data.map((b: any) => this.migrateAndRepair(b));
  }

  async deleteBrand(id: string): Promise<void> { await vault.delete(id); }

  async syncDatabase(brands: Brand[]): Promise<boolean> {
    try {
      await vault.saveAll(brands);
      return true;
    } catch (e) {
      console.error("Persistence Protocol Fault:", e);
      return false;
    }
  }

  async factoryReset(): Promise<Brand[]> {
    await vault.clear();
    return DEFAULT_BRANDS.map(b => this.migrateAndRepair(b));
  }

  async fetchRestorePoints(): Promise<RestorePoint[]> { return vault.getBackups(); }

  async createRestorePoint(label: string, brands: Brand[]): Promise<RestorePoint> {
    const backup: RestorePoint = { id: `bp-${Date.now()}`, timestamp: Date.now(), label: label || 'Snapshot', brandCount: brands.length, data: brands };
    await vault.createBackup(backup);
    return backup;
  }

  async deleteRestorePoint(id: string): Promise<void> { await vault.deleteBackup(id); }
}

export const backend = new BackendService();
