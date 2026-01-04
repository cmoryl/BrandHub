import { GoogleGenAI, Type } from "@google/genai";
import { Brand, Icon, Gradient, Color, NeuralRegistry } from '../types';

/**
 * Robustly extracts raw JSON string from a potentially Markdown-wrapped response.
 */
function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
  return (match[1] || text).trim();
}

/**
 * Standardized Fault Handling
 */
const handleNeuralFault = (error: any, context: string): never => {
  console.error(`Neural Fault [${context}]:`, error);
  const message = error?.message || String(error);
  if (message.includes("Safety")) throw new Error("Synthesis Halted: Content safety protocols triggered.");
  if (message.includes("quota")) throw new Error("Neural Capacity Exhausted: Rate limit exceeded.");
  if (message.includes("API_KEY")) throw new Error("Authorization Fault: Neural handshake rejected.");
  throw new Error(`Neural Link Fragmented: ${context} failed.`);
};

// Fix: Added decodeBase64 utility function for Live API audio decoding
/**
 * Decodes a base64 string into a Uint8Array.
 */
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Fix: Added encodeBase64 utility function for Live API audio encoding
/**
 * Encodes a Uint8Array into a base64 string.
 */
export function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Fix: Added decodeAudioData utility function for Live API PCM stream processing
/**
 * Decodes raw PCM audio bytes into an AudioBuffer.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const auditBrandBrain = async (brand: Brand, registry: NeuralRegistry): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    TASK: Senior Neural Architect & Brand Strategist.
    PROJECT: Evolutionary Audit of "${brand.name}" Organizational Intelligence.
    
    CURRENT STANDARDS:
    - Archetype: ${registry.archetype}
    - Narrative: ${registry.narrative}
    - Visual Constraints: ${registry.visualConstraints}
    - Cultural Nuance: ${registry.culturalNuance}
    
    GOAL: Evaluate the maturity, clarity, and effectiveness of these standards. 
    Identify logic gaps and suggest "DNA Splices" (Direct string replacements) to enhance the brand's AI-generated content.
    
    RESPOND ONLY WITH JSON:
    {
      "maturityScore": number (0-100),
      "analysis": "string",
      "gaps": ["string"],
      "suggestions": [
        {
          "field": "archetype" | "narrative" | "visualConstraints" | "culturalNuance",
          "label": "short name for enhancement",
          "improvement": "The new enhanced string to replace the old one",
          "reasoning": "why this is better"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 16384 }
      }
    });
    return JSON.parse(extractJson(response.text || '{}'));
  } catch (error) {
    handleNeuralFault(error, "Neural Audit");
  }
};

export const generatePDFBlueprint = async (brand: Brand): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    TASK: Senior Brand Information Architect.
    PROJECT: Master Visual Dossier for "${brand.name}".
    Organize brand assets into 4 "Plates" of content. Respond ONLY with valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return JSON.parse(extractJson(response.text || '{}'));
  } catch (error) {
    return null;
  }
};

export const generatePaletteFromImage = async (brand: Brand, base64Image: string): Promise<Color[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const [mimeType, data] = base64Image.split(';base64,');
  const actualMimeType = mimeType.replace('data:', '');
  const prompt = `Extract professional palette for "${brand.name}". 6 colors. Return JSON array of objects with 'name', 'hex', 'usage'.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [
          { inlineData: { mimeType: actualMimeType, data: data } }, 
          { text: prompt }
        ] 
      },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(extractJson(response.text || '[]'));
  } catch (error) { 
    handleNeuralFault(error, "Image Analysis");
  }
};

export const generateAIPalette = async (brand: Brand, prompt: string): Promise<Color[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const sys = `Design 6-color palette for "${brand.name}". Request: ${prompt}. Return JSON array of objects with 'name', 'hex', 'usage'.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: sys,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(extractJson(response.text || '[]'));
  } catch (error) { 
    handleNeuralFault(error, "Palette Synthesis");
  }
};

export const generateAIGradients = async (brand: Brand): Promise<Gradient[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Create 6 sophisticated CSS gradients for "${brand.name}". Return JSON array of objects with 'name', 'css'.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(extractJson(response.text || '[]'));
  } catch (error) { 
    handleNeuralFault(error, "Gradient Generation");
  }
};

export const generateIconSet = async (brand: Brand, theme: string, count: number = 10, existingIcons: Icon[] = []): Promise<Icon[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate SVG path data for ${count} minimalist icons. Theme: ${theme}. Return JSON array of objects with 'name', 'svgPath', 'category'.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 16384 } 
      }
    });
    const iconsData = JSON.parse(extractJson(response.text || '[]'));
    return iconsData.map((icon: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: icon.name || "Icon",
      svgPath: icon.svgPath || "M12 12h.01",
      category: icon.category || "General",
      tags: [theme]
    }));
  } catch (error) { 
    handleNeuralFault(error, "Vector Synthesis");
  }
};

export const generateBrandCopy = async (brand: Brand, topic: string, contentType: string, deepReasoning: boolean = false, isJson: boolean = false): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const brainStandards = brand.intelligenceBrain 
    ? `\n\nCRITICAL MASTER STANDARDS (The "Backend Brain"): \n${brand.intelligenceBrain}`
    : "";

  const systemInstruction = `
    You are a senior brand copywriter for "${brand.name}". 
    Organizational DNA: 
    - Industry: ${brand.industry}
    - Tone of Voice: ${brand.toneOfVoice.join(', ')}
    - Mission: ${brand.missionStatement}
    - Values: ${brand.values.map(v => v.text).join(', ')}
    ${brainStandards}

    TASK: Write ${contentType} content about "${topic}". Strictly adhere to the Master Standards.
  `;

  try {
    const config: any = {
      systemInstruction,
      thinkingConfig: deepReasoning ? { thinkingBudget: 32768 } : { thinkingBudget: 0 }
    };
    
    if (isJson) {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: deepReasoning ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      contents: `Execute content synthesis for: ${topic}`,
      config
    });
    return response.text || "";
  } catch (error) { 
    handleNeuralFault(error, "Copy Synthesis");
  }
};

export const generateBrandVisual = async (brand: Brand, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const brainStandards = brand.intelligenceBrain 
    ? `\n\nApply these Visual Protocol Standards: ${brand.intelligenceBrain}`
    : "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ 
          text: `High-fidelity branding visual for "${brand.name}". 
                 Organizational DNA: ${brand.industry}, ${brand.tagline}.
                 Prompt: ${prompt} 
                 ${brainStandards}` 
        }] 
      }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned.");
  } catch (error) { 
    handleNeuralFault(error, "Visual Synthesis");
  }
};

export const researchBrandTrends = async (brand: Brand, query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const brainStandards = brand.intelligenceBrain 
    ? `\n\nFilter all research and trend analysis through these Organizational Master Standards: \n${brand.intelligenceBrain}`
    : "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform comprehensive market research for "${brand.name}" regarding: ${query}. Focus on current trends and competitors. Brand description: ${brand.description} ${brainStandards}`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter((c: any) => c.web)?.map((c: any) => c.web) || []
    };
  } catch (error) { 
    handleNeuralFault(error, "Trend Research");
  }
};

export const synthesizeBrandIdentity = async (params: { name: string, industry: string, description: string }): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Synthesize a comprehensive brand identity framework for "${params.name}" in the "${params.industry}" sector. Context: ${params.description}.
    Generate the following as a valid JSON object:
    - missionStatement (string)
    - archetype (string)
    - toneOfVoice (array of strings)
    - coreValues (array of objects with {text: string, icon: lucide-icon-name})`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return JSON.parse(extractJson(response.text || '{}'));
  } catch (error) {
    handleNeuralFault(error, "Identity Synthesis");
  }
};