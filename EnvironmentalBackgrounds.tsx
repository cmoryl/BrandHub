
import React, { useEffect, useRef } from 'react';
import { hexToRgb } from '../utils/colorUtils';

interface Props {
  style: 'flow' | 'circuit' | 'aurora' | 'spectral' | 'ribbons';
  primaryColor: string;
  secondaryColor: string;
  animate: boolean;
  isDarkMode: boolean;
}

const EnvironmentalBackgrounds: React.FC<Props> = ({ style, primaryColor, secondaryColor, animate, isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || style === 'aurora') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const p1 = hexToRgb(primaryColor);
    const p2 = hexToRgb(secondaryColor);

    let offset = 0;

    // RIBBONS LOGIC: High-fidelity wavy line bundle matching user reference
    const drawRibbons = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.2;
      
      const lineCount = 22;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `rgba(${p1.r}, ${p1.g}, ${p1.b}, 0.8)`);
      gradient.addColorStop(0.5, `rgba(${p2.r}, ${p2.g}, ${p2.b}, 0.5)`);
      gradient.addColorStop(1, `rgba(${p1.r}, ${p1.g}, ${p1.b}, 0.8)`);

      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        // Variance in opacity creates depth like the reference image
        ctx.globalAlpha = 0.2 + (i / lineCount) * 0.6;
        
        // Base line position
        const yBase = height * 0.6; 
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= width; x += 5) {
          // Compound waves for organic movement
          // i * 0.08 creates the "spread" between lines
          const wave1 = Math.sin(x * 0.002 + offset + i * 0.08) * (height * 0.15);
          const wave2 = Math.sin(x * 0.001 - offset * 0.4 + i * 0.1) * (height * 0.1);
          const y = yBase + wave1 + wave2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (animate) offset += 0.008;
      animationFrameId = requestAnimationFrame(drawRibbons);
    };

    // SPECTRAL LOGIC: Multi-layered smooth ribbon lines
    const drawSpectral = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      
      const lineCount = 15;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `rgba(${p1.r}, ${p1.g}, ${p1.b}, 0.6)`);
      gradient.addColorStop(0.5, `rgba(${p2.r}, ${p2.g}, ${p2.b}, 0.4)`);
      gradient.addColorStop(1, `rgba(${p1.r}, ${p1.g}, ${p1.b}, 0.6)`);

      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = 0.3 + (i / lineCount) * 0.4;
        
        const yBase = height * 0.5 + (i - lineCount / 2) * 4;
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= width; x += 10) {
          const wave1 = Math.sin(x * 0.003 + offset + i * 0.1) * 120;
          const wave2 = Math.sin(x * 0.0015 - offset * 0.5 + i * 0.05) * 80;
          const y = yBase + wave1 + wave2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (animate) offset += 0.01;
      animationFrameId = requestAnimationFrame(drawSpectral);
    };

    // FLOW LINES LOGIC
    const drawFlow = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.5;
      
      const lines = 12;
      const spacing = height / lines;

      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${i % 2 === 0 ? p1.r : p2.r}, ${i % 2 === 0 ? p1.g : p2.g}, ${i % 2 === 0 ? p1.b : p2.b}, 0.15)`;
        
        const yBase = i * spacing + spacing / 2;
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= width; x += 20) {
          const y = yBase + Math.sin(x * 0.002 + offset + i) * 60 + Math.cos(x * 0.001 - offset * 0.5) * 40;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (animate) offset += 0.005;
      animationFrameId = requestAnimationFrame(drawFlow);
    };

    // CIRCUIT LOGIC
    const points: {x: number, y: number, vx: number, vy: number}[] = [];
    for(let i=0; i<40; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    const drawCircuit = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(${p1.r}, ${p1.g}, ${p1.b}, 0.1)`;
      ctx.fillStyle = `rgba(${p2.r}, ${p2.g}, ${p2.b}, 0.2)`;
      ctx.lineWidth = 1;

      points.forEach((p, i) => {
        if (animate) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Draw connections
        points.forEach((p2, j) => {
          if (i === j) return;
          const dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
          if (dist < 200) {
            ctx.beginPath();
            ctx.globalAlpha = (1 - dist / 200) * 0.3;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Draw nodes
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawCircuit);
    };

    if (style === 'ribbons') drawRibbons();
    else if (style === 'spectral') drawSpectral();
    else if (style === 'flow') drawFlow();
    else if (style === 'circuit') drawCircuit();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [style, primaryColor, secondaryColor, animate]);

  if (style === 'aurora') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${animate ? 'animate-pulse' : ''}`}
          style={{
            background: `linear-gradient(125deg, ${primaryColor}44 0%, transparent 40%, ${secondaryColor}33 70%, ${primaryColor}22 100%)`,
            filter: 'blur(100px)',
            transform: 'scale(1.5)'
          }}
        />
        <div 
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] mix-blend-screen opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${secondaryColor} 0%, transparent 50%)`,
            animation: animate ? 'spin-slow 30s linear infinite' : 'none'
          }}
        />
      </div>
    );
  }

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default EnvironmentalBackgrounds;
