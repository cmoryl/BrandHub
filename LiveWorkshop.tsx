
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Mic, MicOff, Volume2, Sparkles, BrainCircuit, 
  Loader2, Radio, Info, MessageSquareText
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Brand } from '../types';
import { decodeBase64, decodeAudioData, encodeBase64 } from '../services/geminiService';

interface LiveWorkshopProps {
  brand: Brand;
  onClose: () => void;
}

const LiveWorkshop: React.FC<LiveWorkshopProps> = ({ brand, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const handleMessage = useCallback(async (message: LiveServerMessage) => {
    if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
      const base64 = message.serverContent.modelTurn.parts[0].inlineData.data;
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const bytes = decodeBase64(base64);
      const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      const playTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
      source.start(playTime);
      nextStartTimeRef.current = playTime + audioBuffer.duration;
      
      sourcesRef.current.add(source);
      source.onended = () => sourcesRef.current.delete(source);
    }

    if (message.serverContent?.interrupted) {
      sourcesRef.current.forEach(s => s.stop());
      sourcesRef.current.clear();
      nextStartTimeRef.current = 0;
    }
    
    if (message.serverContent?.outputTranscription) {
      const text = message.serverContent.outputTranscription.text;
      if (text) setTranscripts(prev => [...prev.slice(-4), `Gemini: ${text}`]);
    }
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const b64 = encodeBase64(new Uint8Array(int16.buffer));
              sessionPromise.then(s => s.sendRealtimeInput({
                media: { data: b64, mimeType: 'audio/pcm;rate=16000' }
              }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: handleMessage,
          onerror: (e) => console.error("Live Fault:", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are a high-level branding consultant at the Live Brand Workshop for ${brand.name}. Industry: ${brand.industry}. Tone: ${brand.toneOfVoice.join(', ')}. Help the user brainstorm campaign ideas, taglines, and strategy. Be concise and professional.`,
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
      setIsActive(true);
    } catch (err) {
      console.error("Connection Failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      sessionRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-2xl bg-slate-950/80">
      <div className="max-w-4xl w-full aspect-video bg-[#02030a] rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                <Radio className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Live Brand Workshop</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Grounded in {brand.name} Governance</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-12 flex flex-col items-center justify-center text-center relative">
          {!isActive ? (
            <div className="space-y-8 animate-in fade-in duration-700">
               <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto relative group">
                  <div className="absolute inset-0 bg-blue-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Mic className="w-12 h-12 text-blue-500" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Establish Handshake</h3>
                  <p className="text-slate-500 max-w-sm mx-auto text-sm">Initiate a real-time, brand-aware voice session with the Intelligence Studio.</p>
               </div>
               <button 
                onClick={startSession}
                disabled={isConnecting}
                className="px-12 py-5 bg-white text-black rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
               >
                 {isConnecting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enter Workshop'}
               </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-12">
               <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 bg-blue-600/5 blur-[100px]" />
                  <div className="flex items-center justify-center gap-2 h-32">
                     {[...Array(24)].map((_, i) => (
                       <div 
                        key={i} 
                        className="w-1.5 bg-blue-500/40 rounded-full animate-pulse" 
                        style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s` }} 
                       />
                     ))}
                  </div>
               </div>
               
               <div className="w-full max-w-2xl bg-white/5 rounded-3xl p-8 border border-white/5 min-h-[200px] flex flex-col justify-end text-left space-y-3">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-[0.4em] mb-4">
                     <MessageSquareText className="w-3 h-3" /> Live Transcription
                  </div>
                  {transcripts.map((t, i) => (
                    <p key={i} className={`text-sm font-medium ${t.startsWith('Gemini') ? 'text-blue-400' : 'text-slate-300'}`}>
                      {t}
                    </p>
                  ))}
                  {transcripts.length === 0 && <p className="text-sm text-slate-600 italic">Listening for brand-grounded input...</p>}
               </div>

               <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-6 rounded-full border transition-all ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                  >
                    {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-10 py-5 bg-red-600 text-white rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all"
                  >
                    Decommission
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-white/5 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol: Neural Brainstorming</span>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                <BrainCircuit className="w-4 h-4 text-indigo-500" /> Gemini 2.5 Native Audio
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveWorkshop;
