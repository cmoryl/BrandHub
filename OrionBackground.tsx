
import React, { useEffect, useRef } from 'react';

interface OrionBackgroundProps {
  isDarkMode: boolean;
}

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulse: number;
  pulseDir: number;
}

const OrionBackground: React.FC<OrionBackgroundProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    const stars: Star[] = [];
    
    const initStars = () => {
      stars.length = 0;
      const density = width < 768 ? 20000 : 12000;
      const numStars = Math.floor((width * height) / density);

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 1.8 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random(),
          pulseDir: Math.random() > 0.5 ? 0.005 : -0.005
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const draw = () => {
      // Background fill based on theme to prevent flickering
      ctx.fillStyle = isDarkMode ? '#02030a' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);
      
      const starBaseColor = isDarkMode ? '255, 255, 255' : '30, 41, 59';
      const connectionColor = isDarkMode ? '56, 189, 248' : '15, 23, 42'; // Cyan-400 vs Slate-900

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // Motion logic
        star.x += star.vx;
        star.y += star.vy;

        // Interaction logic
        const dxMouse = star.x - mouseRef.current.x;
        const dyMouse = star.y - mouseRef.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 150) {
           star.x += dxMouse * 0.01;
           star.y += dyMouse * 0.01;
        }

        // Wrap logic
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Pulse logic
        star.pulse += star.pulseDir;
        if (star.pulse > 1 || star.pulse < 0.2) star.pulseDir *= -1;

        // Render Star
        ctx.beginPath();
        const currentOpacity = star.opacity * star.pulse;
        ctx.fillStyle = `rgba(${starBaseColor}, ${currentOpacity})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Nebula-like Glow for larger stars
        if (star.radius > 1.2 && isDarkMode) {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4);
          gradient.addColorStop(0, `rgba(56, 189, 248, ${currentOpacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Connection logic (spatial network)
        for (let j = i + 1; j < stars.length; j++) {
          const star2 = stars[j];
          const dx = star.x - star2.x;
          const dy = star.y - star2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            const opacity = (1 - dist / 100) * 0.15 * star.pulse;
            ctx.strokeStyle = `rgba(${connectionColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />;
};

export default OrionBackground;
