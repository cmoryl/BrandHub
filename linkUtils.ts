
/**
 * Normalizes cloud storage links to direct asset URLs.
 * Optimized for high-reliability binary streaming.
 */
export const getDirectImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  const cleanUrl = url.trim();

  // Already processed data or standard link
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) return cleanUrl;

  // Handle Dropbox - Preservation Protocol v3
  // We use the URL API for surgical precision to preserve rlkey and other essential params
  if (cleanUrl.includes('dropbox.com')) {
    try {
      const urlObj = new URL(cleanUrl);
      
      // 1. Purge standard download/preview params
      urlObj.searchParams.delete('dl');
      urlObj.searchParams.delete('preview');
      
      // 2. Force raw delivery protocol
      urlObj.searchParams.set('raw', '1');
      
      // 3. Normalize domain to binary-optimized endpoint
      if (urlObj.hostname === 'www.dropbox.com' || urlObj.hostname === 'dropbox.com') {
        urlObj.hostname = 'dl.dropboxusercontent.com';
      }
      
      return urlObj.toString();
    } catch (e) {
      // Fallback for malformed strings
      let direct = cleanUrl
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace('dropbox.com', 'dl.dropboxusercontent.com');
      
      if (direct.includes('?')) {
        direct = direct.replace(/[?&]dl=[01]/, '');
        direct = direct.replace(/[?&]raw=[01]/, '');
        direct += '&raw=1';
      } else {
        direct += '?raw=1';
      }
      return direct;
    }
  }

  // Handle Google Drive - Enhanced Extraction
  if (cleanUrl.includes('drive.google.com')) {
    // Format: /file/d/[ID]/view
    const fileDMatch = cleanUrl.match(/\/file\/d\/([^\/?]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${fileDMatch[1]}`;
    }
    // Format: ?id=[ID]
    const idMatch = cleanUrl.match(/[?&]id=([^&]+)/);
    if (idMatch && idMatch[1]) {
       return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
    }
  }

  // Handle Microsoft OneDrive
  if (cleanUrl.includes('1drv.ms')) {
    return cleanUrl.replace('1drv.ms', '1drv.ms/download');
  }

  // Handle Box
  if (cleanUrl.includes('box.com/s/')) {
    return cleanUrl.replace('app.box.com/s/', 'dl.boxcloud.com/direct/').replace('box.com/s/', 'dl.boxcloud.com/direct/');
  }
  
  return cleanUrl;
};

/**
 * Heuristic Optimizer: Injects resizing parameters for known CDNs 
 * to improve dashboard performance.
 */
export const getOptimizedImageUrl = (url: string | undefined | null, width: number = 800): string => {
  if (!url) return '';
  const directUrl = getDirectImageUrl(url);

  // If it's an Unsplash URL (common for covers), apply width and quality constraints
  if (directUrl.includes('images.unsplash.com')) {
    const baseUrl = directUrl.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&auto=format&fit=crop`;
  }

  return directUrl;
};

export const getVideoType = (url: string | undefined | null): 'direct' | 'youtube' | 'vimeo' | 'unsupported' => {
  if (!url) return 'unsupported';
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('vimeo.com')) return 'vimeo';
  if (u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg') || u.includes('?raw=1') || u.includes('dropbox.com')) return 'direct';
  return 'unsupported';
};

export const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`;
  }
  if (u.includes('vimeo.com')) {
    const id = url.split('/').pop();
    return `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&muted=1`;
  }
  return url;
};
