# BRANDHUB MASTER PROTOCOL: THE ENGINEER’S BIBLE
**Version:** 4.2.0 "Multi-Variant Sync"  
**Classification:** Enterprise Identity Orchestrator (Level 5)  

---

## I. ARCHITECTURAL TOPOGRAPHY

### 1. The Reactive Core (React 19)
The system utilizes a high-density, concurrent-safe component architecture. It relies on `React.useMemo` for heavy chromatic calculations and `React.useCallback` to prevent unnecessary re-renders during high-frequency AI streaming.

### 2. State Logic (Zustand)
`useBrandStore` serves as the centralized "Nervous System." 
*   **Persistence:** Hydrated via `backendService.ts` from IndexedDB.
*   **Safety:** Every mutation is passed through `Zod` schema validation to prevent "State Poisoning" from malformed AI responses.

### 3. The Iron Mirror (Bidirectional Reconciliation)
Residing in `backendService.ts`, this protocol ensures the flat root properties (for search) and nested section data (for UI) are always identical.
*   **Upstream:** Editor -> Section Data -> Root Property Mirroring.
*   **Downstream:** AI Synthesis -> Root Property -> Section Data Injection.
*   **Metadata Shield:** A specialized repair logic that prioritizes user-defined section titles and descriptions over code-defined defaults during synchronization.

---

## II. SYSTEM PROTOCOLS & LOGIC

### 1. The PDF Plate Engine
Unlike standard PDF exports, BrandHub uses **"Phantom Plate Synthesis"**:
1.  **Hydration:** All remote URLs are fetched and converted to Base64 to bypass CORS "Tainted Canvas" security.
2.  **Synthesis:** Gemini Flash generates a `PDFBlueprint`, mapping sections to logical "Plates."
3.  **Rendering:** A hidden `.pdf-stage` DOM node is built at 1600px width.
4.  **Capture:** `html2canvas` @ 1.5x density captures the stage and compiles it into `jsPDF`.

### 2. Neural Vector Extraction
1.  **Prompt:** Requests raw SVG path data from Gemini 3 Pro.
2.  **Regex Sanitization:** `/<path[^>]*d="([^"]*)"/` extracts only the geometry.
3.  **Encapsulation:** Geometry is stored as a string and rendered in a standard `0 0 24 24` viewport.

### 3. WCAG Chromatic Logic
Uses the Relative Luminance formula: `(L1 + 0.05) / (L2 + 0.05)`.
*   **Logic:** Normalizes RGB values, applies color coefficients, and compares results to determine `AAA` or `FAIL` status in the Palette Lab.

### 4. Symbol Multi-Variant Orchestration
Manages Primary (Color), Inverse (White), and Monochrome (Black) shorthand marks. 
*   **Surface Stress Testing:** Logic allows users to toggle backgrounds (Slate/White/Mesh) in the renderer to verify transparency and contrast for each specific variant.

---
**END OF BIBLE**