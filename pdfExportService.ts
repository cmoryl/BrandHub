import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PageFormat, Brand } from '../types';
import { generatePDFBlueprint } from './geminiService';
import { getDirectImageUrl } from '../utils/linkUtils';

class PDFExportService {
  /**
   * HYDRATION PROTOCOL v2.5
   * Converts remote URLs to Base64 and ensures GPU decoding is complete.
   */
  private async hydrateImage(url: string): Promise<string> {
    if (!url || url === '#' || url.startsWith('data:')) return url;
    
    const directUrl = getDirectImageUrl(url);
    
    try {
      const response = await fetch(directUrl, { mode: 'cors', cache: 'no-cache' });
      if (!response.ok) throw new Error('Network response failure');
      const blob = await response.blob();
      
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Verification: Ensure the image can actually be decoded by the browser
      const img = new Image();
      img.src = base64;
      // Fix: Cast to any to prevent TypeScript from narrowing 'img' to 'never' in the unreachable code block.
      // This occurs if 'decode' is defined as a mandatory property in HTMLImageElement within the environment.
      const imgAny = img as any;
      if (imgAny.decode) {
        await imgAny.decode();
      } else {
        // Fix: Use any cast to safely assign event handlers on what the compiler might see as unreachable code.
        await new Promise((r) => { 
          imgAny.onload = r; 
          imgAny.onerror = r; 
        });
      }

      return base64;
    } catch (e) {
      console.warn(`Hydration Fault for ${url}:`, e);
      return url; 
    }
  }

  private async sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }

  public async export(
    format: PageFormat, 
    containerId: string, 
    brand: Brand,
    isDarkMode: boolean = true,
    onProgress?: (status: string) => void
  ): Promise<void> {
    const MASTER_WIDTH_PT = 1200; 
    const MASTER_WIDTH_PX = 1600; 
    const bgColor = isDarkMode ? '#030510' : '#ffffff';
    const textColor = isDarkMode ? '#f8fafc' : '#0a0a0c';
    const accentColor = isDarkMode ? '#38bdf8' : '#0033a0';
    const gridColor = isDarkMode ? 'rgba(56, 189, 248, 0.04)' : 'rgba(10, 10, 12, 0.02)';
    
    onProgress?.("Neural Mapping: Constructing Blueprint...");
    const blueprint = await generatePDFBlueprint(brand);
    await document.fonts.ready;

    const styleRig = document.createElement('style');
    styleRig.innerHTML = `
      .pdf-stage {
        width: ${MASTER_WIDTH_PX}px;
        background-color: ${bgColor} !important;
        color: ${textColor} !important;
        font-family: 'Poppins', sans-serif;
        padding: 160px;
        position: fixed;
        left: -20000px;
        top: 0;
        background-image: radial-gradient(${gridColor} 2px, transparent 2px);
        background-size: 80px 80px;
        display: flex;
        flex-direction: column;
        gap: 120px;
        box-sizing: border-box;
      }
      .pdf-stage * { overflow: visible !important; color: inherit !important; box-sizing: border-box !important; transform: none !important; transition: none !important; animation: none !important; }
      .pdf-stage h1 { font-size: 160px; font-weight: 500; letter-spacing: -0.05em; line-height: 0.95; margin: 0; text-transform: uppercase; }
      .pdf-stage h2 { font-size: 90px; font-weight: 400; letter-spacing: -0.02em; margin: 0; text-transform: uppercase; line-height: 1; }
      .pdf-stage .divider { height: 8px; width: 400px; background: ${accentColor}; margin: 30px 0; border-radius: 4px; }
      .pdf-stage .tech-meta { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 400; color: ${accentColor}; letter-spacing: 6px; opacity: 0.8; margin-bottom: 30px; display: block; }
      .pdf-stage .module-card { background: ${isDarkMode ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.01)'}; border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}; padding: 100px; border-radius: 80px; width: 100%; }
      .pdf-stage img { max-width: 100%; height: auto !important; object-fit: contain; }
      .pdf-stage .header-grid { display: grid !important; grid-template-columns: 1fr 300px; align-items: end; gap: 60px; width: 100%; }
      .pdf-stage p { font-weight: 400 !important; }
    `;
    document.head.appendChild(styleRig);

    const capturedPages: { canvas: HTMLCanvasElement; heightPt: number }[] = [];

    const synthesizePlate = async (el: HTMLElement) => {
      document.body.appendChild(el);
      await this.sleep(300); 
      
      // Explicit Wait: Ensure all images in the plate are decoded
      const imgs = Array.from(el.querySelectorAll('img'));
      await Promise.all(imgs.map(async img => {
        if (!img.complete) {
          // Fix: Use any cast to avoid type errors when the compiler narrows the element type in conditional branches.
          const imgAny = img as any;
          await new Promise(r => { imgAny.onload = r; imgAny.onerror = r; });
        }
        if ('decode' in img) {
          try { await img.decode(); } catch(e) {}
        }
      }));
      
      const canvas = await html2canvas(el, { 
        scale: 1.5, 
        useCORS: true, 
        backgroundColor: bgColor, 
        width: MASTER_WIDTH_PX,
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      });
      
      document.body.removeChild(el);
      const heightPt = (canvas.height * MASTER_WIDTH_PT) / canvas.width;
      capturedPages.push({ canvas, heightPt });
      
      await this.sleep(100);
    };

    onProgress?.("Synthesizing Identity Core...");
    const heroPlate = document.createElement('div');
    heroPlate.className = 'pdf-stage';
    const hydratedLogo = await this.hydrateImage(brand.logoUrl);
    heroPlate.innerHTML = `
      <span class="tech-meta">PLATE_01 // IDENTITY_CORE</span>
      <div class="header-grid">
        <div>
          <h1>${brand.name}</h1>
          <div class="divider"></div>
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <img src="${hydratedLogo}" style="height: 200px; width: auto;" />
        </div>
      </div>
      <div style="margin-top: 80px; border-left: 4px solid ${accentColor}; padding-left: 80px; max-width: 1300px;">
          <p style="font-size: 52px; line-height: 1.35; font-weight: 400; opacity: 0.95; letter-spacing: -0.01em;">
            ${blueprint?.manifesto?.objective || brand.description}
          </p>
      </div>
    `;
    await synthesizePlate(heroPlate);

    const blueprintPlates = blueprint?.plates || [];
    const processedIds = new Set<string>();

    for (let i = 1; i < blueprintPlates.length; i++) {
      const plateData = blueprintPlates[i];
      onProgress?.(`Processing Plate ${i+1}: ${plateData.title}...`);
      
      const plateEl = document.createElement('div');
      plateEl.className = 'pdf-stage';
      plateEl.innerHTML = `
        <span class="tech-meta">PLATE_0${i + 1} // ${plateData.id.toUpperCase()}</span>
        <div style="margin-bottom: 20px;">
          <h2>${plateData.title}</h2>
          <p style="font-size: 26px; color: ${accentColor} !important; font-weight: 400; margin-top: 20px; letter-spacing: 2px; text-transform: uppercase;">${plateData.intent}</p>
        </div>
        <div class="stack" style="display: flex; flex-direction: column; gap: 100px;"></div>
      `;

      const stack = plateEl.querySelector('.stack')!;
      for (const sid of plateData.sectionIds) {
        const source = document.getElementById(sid);
        if (source && !processedIds.has(sid)) {
          const clone = source.cloneNode(true) as HTMLElement;
          const images = Array.from(clone.querySelectorAll('img'));
          for (const img of images) { 
            img.src = await this.hydrateImage(img.src); 
          }
          clone.querySelectorAll('button, .edit-controls, .print-hidden, [role="button"], select, .h-px, .border-t').forEach(e => e.remove());
          clone.style.cssText = 'padding:0 !important; margin:0 !important; background:transparent !important; border:none !important; width:100% !important; max-width: none !important; left: auto !important; transform: none !important;';
          
          const wrapper = document.createElement('div');
          wrapper.className = 'module-card';
          wrapper.appendChild(clone);
          stack.appendChild(wrapper);
          processedIds.add(sid);
        }
      }

      if (stack.children.length > 0) {
        await synthesizePlate(plateEl);
      }
    }

    onProgress?.("Deploying Final Manifest...");
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [MASTER_WIDTH_PT, capturedPages[0].heightPt]
    });

    for (let idx = 0; idx < capturedPages.length; idx++) {
      const page = capturedPages[idx];
      if (idx > 0) pdf.addPage([MASTER_WIDTH_PT, page.heightPt], 'p');
      const imgData = page.canvas.toDataURL('image/jpeg', 0.90);
      pdf.addImage(imgData, 'JPEG', 0, 0, MASTER_WIDTH_PT, page.heightPt, undefined, 'FAST');
    }

    document.head.removeChild(styleRig);
    onProgress?.("Protocol Established.");
    pdf.save(`${brand.name.replace(/\s+/g, '_')}_Master_Manual.pdf`);
  }
}

export const pdfExport = new PDFExportService();