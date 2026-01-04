
import React from 'react';
import { BackgroundSettings } from '../types';
import OrionBackground from './OrionBackground';
import EnvironmentalBackgrounds from './EnvironmentalBackgrounds';

interface Props {
  settings?: BackgroundSettings;
  isDarkMode: boolean;
}

const BrandBackground: React.FC<Props> = ({ settings, isDarkMode }) => {
  // CRITICAL: If no settings or style is none, do not render to allow global background to show
  if (!settings || settings.style === 'none') return null;

  const primary = settings.primaryColor || (isDarkMode ? '#0033A0' : '#139dd8');
  const secondary = settings.secondaryColor || (isDarkMode ? '#0077C8' : '#3bbfb5');

  /**
   * OPACITY TUNING: We increase the base opacity during preview 
   * to ensure it competes with the heavy glass panels of the editor.
   */
  const styleOpacity = settings.opacity !== undefined ? settings.opacity : 0.4;
  const baseOpacity = ['mesh', 'aurora', 'spectral', 'flow', 'ribbons'].includes(settings.style)
    ? Math.max(styleOpacity, 0.8) // Higher baseline for preview
    : Math.max(styleOpacity, 0.6);

  const containerStyle: React.CSSProperties = {
    opacity: baseOpacity,
    filter: `blur(${settings.blur || 0}px)`,
    transition: 'opacity 0.8s ease-in-out, filter 0.5s ease-in-out',
    pointerEvents: 'none',
  };

  /**
   * REFRESH PROTOCOL: Forces canvas re-initialization when parameters shift.
   */
  const refreshKey = `${settings.style}-${primary}-${secondary}-${settings.animate}-${settings.opacity}-${settings.blur}`;

  const renderBackground = () => {
    switch (settings.style) {
      case 'mesh':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-full h-full"
              style={{
                background: `
                  radial-gradient(at 0% 0%, ${primary} 0px, transparent 65%),
                  radial-gradient(at 100% 0%, ${secondary} 0px, transparent 65%),
                  radial-gradient(at 100% 100%, ${primary} 0px, transparent 65%),
                  radial-gradient(at 0% 100%, ${secondary} 0px, transparent 65%)
                `
              }}
            />
            {settings.animate && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay" />
            )}
          </div>
        );

      case 'dots':
        return (
          <div className="absolute inset-0" 
               style={{ 
                 backgroundImage: `radial-gradient(${primary} 2.5px, transparent 2.5px)`, 
                 backgroundSize: '48px 48px' 
               }} 
          />
        );

      case 'orion':
        return <OrionBackground isDarkMode={isDarkMode} />;

      case 'solid':
        return (
          <div className="absolute inset-0" 
               style={{ backgroundColor: primary }} 
          />
        );
        
      case 'flow':
      case 'aurora':
      case 'circuit':
      case 'spectral':
      case 'ribbons':
        return (
          <EnvironmentalBackgrounds 
            style={settings.style} 
            primaryColor={primary} 
            secondaryColor={secondary} 
            animate={!!settings.animate} 
            isDarkMode={isDarkMode}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div key={refreshKey} className="fixed inset-0 z-[5] pointer-events-none overflow-hidden" style={containerStyle}>
      {renderBackground()}
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} />
    </div>
  );
};

export default BrandBackground;
