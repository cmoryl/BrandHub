
/**
 * A robust utility to copy text to the clipboard.
 * It first attempts to use the modern navigator.clipboard API.
 * If that fails (e.g., permission denied, non-secure context),
 * it falls back to the legacy document.execCommand('copy') method.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Try modern API first if in a secure context
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Modern clipboard API failed, trying fallback...", err);
    }
  }

  // Fallback to legacy execCommand('copy')
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure the textarea is not visible but part of the DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
    return false;
  }
};
