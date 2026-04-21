# Core Architecture & AI Agent Protocol

This document defines the strict architectural standards and interaction protocols for the Sanket Portfolio project. Every AI agent MUST adhere to these rules to maintain project integrity.

## 1. Directory Structure Standards

### **Feature-First Colocation**
*   **Path**: `src/components/features/[FeatureName]/`
*   **Rules**: Logic (`.tsx`) and Component Styles (`.css`) MUST live together in the same folder.
*   **Importing Styles**: Component styles should be imported via relative path: `import "./[Name].css"`.

### **Shared Components**
*   **Path**: `src/components/shared/[ComponentName]/`
*   **Rules**: Global UI elements (SocialPile, Cursor, Widget) live here with colocated styles.

### **Global Design System (Design Tokens)**
*   **Path**: `src/styles/`
    *   `core/`: Design tokens (colors, typography, dimensions).
    *   `layout/`: Global layout and container styles.
    *   `breakpoints/`: Device-specific overrides.
*   **Usage**: Components MUST use variables from these files. Hardcoded HEX/PX values in component CSS are strictly PROHIBITED.

## 2. State & Data Layer

### **The "AppProvider" (UI Layer)**
*   **Location**: `src/components/shared/providers/AppProvider.tsx`
*   *Purpose**: Orchestrates global UI state (Loading, Navigation, Slider Controls).
*   **Protocol**: Components should use `useApp()`, `useLoading()`, or `useRouter()` to interact with the app state.

### **The "usePortfolioSync" (Data Layer)**
*   **Location**: `src/lib/hooks/usePortfolioSync.ts`
*   **Purpose**: Handles Firebase `onSnapshot` and `localStorage` caching.
*   **Logic**: High-performance "Instant-On" logic (Cached data loads immediately, sync happens in background).

## 3. Navigation Engine

*   **Logic**: Cinematic Vertical Slider (GSAP Observer).
*   **Routing**: Next.js `rewrites` map virtual paths (e.g., `/contact`) to the main page sections.
*   **Global Access**: Use `goToSection(index)` from `useRouter()` to navigate from any component.

## 4. AI Agent Protocol (MML/Task Flow)

When starting a new task, agents must:
1.  **Read this file** to understand the current architecture.
2.  **Update Task MD**: All tasks must be tracked in `.planning/tasks.md`.
3.  **No Manual Style Inlining**: Never use `style={{...}}` in TSX.
4.  **Colocation**: When creating a new component, always create a folder with both `.tsx` and `.css`.
5.  **Security**: Never hardcode keys. Use `.env.local`.

---
*Last Updated: 2026-04-21*
