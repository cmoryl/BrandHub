
import React from 'react';
import { Hexagon } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'admin' | 'public';
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'default', textClassName = '' }) => {
  const iconSizes = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-20 h-20' };
  const textSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-4xl', xl: 'text-6xl' };
  const subTextSizes = { sm: 'text-[0.4rem]', md: 'text-[0.5rem]', lg: 'text-xs', xl: 'text-sm' };
  
  // Dynamic colors - Using specific TransPerfect Corporate Blue (#0033A0)
  // Public view uses lighter cyan/sky for dark mode contrast
  const accentColor = variant === 'public' ? 'text-sky-500' : 'text-[#0033A0]';
                   
  const glowColor = variant === 'public' ? 'bg-sky-500' : 'bg-[#0033A0]';

  const borderColor = variant === 'public' ? 'border-sky-500' : 'border-[#0033A0]';

  const gradientText = variant === 'public' 
    ? 'from-sky-400 to-cyan-200' 
    : 'from-[#0033A0] to-[#0077C8]'; // Corporate Blue to Bright Azure

  return (
    <div className="flex items-center gap-4 group select-none">
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className={`absolute inset-0 ${glowColor} blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />
        
        {/* Outer Ring - Gyroscope Horizontal */}
        <div className={`absolute inset-0 m-auto rounded-full border border-slate-700/50 ${borderColor}/30 animate-spin-reverse-slow`} 
             style={{ width: '180%', height: '180%' }}>
             <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${glowColor}`}></div>
        </div>

        {/* Inner Ring - Gyroscope Vertical */}
        <div className={`absolute inset-0 m-auto rounded-full border border-slate-600/50 ${borderColor}/60 animate-spin-slow`} 
             style={{ width: '140%', height: '140%' }}>
             <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full ${glowColor}`}></div>
        </div>

        {/* Main Icon */}
        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
           <Hexagon className={`${iconSizes[size]} ${accentColor} fill-current/10`} strokeWidth={2.5} />
           
           {/* Center Core Pulse */}
           <div className={`absolute inset-0 m-auto w-2 h-2 rounded-full ${glowColor} animate-pulse shadow-[0_0_10px_currentColor] text-white`} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`${textSizes[size]} font-extrabold tracking-tight ${textClassName} leading-none`}>
          Brand<span className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientText}`}>Hub</span>
        </div>
        <div className={`${subTextSizes[size]} font-sans font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400 mt-0 ml-0.5`}>
            TransPerfect
        </div>
      </div>
    </div>
  );
};

export default Logo;
