"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { usePortfolioSync } from "@/lib/hooks/usePortfolioSync";

// ── Constants ─────────────────────────────────────────────────────────────
export const SECTIONS = ["hero", "about", "showcase", "tech", "contact"];
export const NAV_LABELS = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"];

// ── Context Types ─────────────────────────────────────────────────────────
interface AppContextType {
  // Loading State
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  percent: number;
  setPercent: (percent: number) => void;

  // Portfolio Data (Separated Data Layer)
  data: any;
  loading: boolean;
  isCached: boolean;
  errors: Record<string, any>;

  // Navigation State
  activeSection: number;
  setActiveSection: (index: number) => void;
  goToSection: (index: number, force?: boolean) => void;
  setNavigationCallback: (cb: ((index: number, force?: boolean) => void) | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Progress Global Hook ──────────────────────────────────────────────────
export const progress = {
  set: (n: number) => {
    if ((progress as any)._setter) (progress as any)._setter(n);
  },
  _setter: null as ((n: number) => void) | null
};

// ── Provider Component ────────────────────────────────────────────────────
export const AppProvider = ({ children, initialData }: { children: ReactNode; initialData?: any }) => {
  // 1. Data Layer (Decoupled Sync Hook)
  const { data, loading, isCached, errors } = usePortfolioSync(initialData);

  // 2. UI/App Layer State
  const [isLoading, setIsLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const navigationCallback = useRef<((index: number, force?: boolean) => void) | null>(null);

  // ── Instant Load Logic ──
  // If data is already in cache, skip the loader entirely.
  useEffect(() => {
    if (isCached || !loading) {
      setIsLoading(false);
    }
  }, [isCached, loading]);

  // ── Router Setup ──
  const setNavigationCallback = useCallback((cb: ((index: number, force?: boolean) => void) | null) => {
    navigationCallback.current = cb;
  }, []);

  const goToSection = useCallback((index: number, force?: boolean) => {
    if (navigationCallback.current) {
      navigationCallback.current(index, force);
    } else {
      setActiveSection(index); 
    }
  }, []);

  // ── Global Initializations ──
  useEffect(() => {
    (progress as any)._setter = setPercent;
    
    // Viewport Height Fix
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppContext.Provider value={{ 
      isLoading, setIsLoading, percent, setPercent,
      data, loading, isCached, errors,
      activeSection, setActiveSection, goToSection, setNavigationCallback
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ── Shared Hooks ──────────────────────────────────────────────────────────
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

// Backwards compatibility hooks
export const useLoading = () => {
  const { isLoading, setIsLoading, percent, setPercent } = useApp();
  return { isLoading, setIsLoading, percent, setPercent };
};

export const usePortfolio = () => {
  const { data, loading, isCached, errors } = useApp();
  return { data, loading, isCached, errors };
};

export const useRouter = () => {
  const { activeSection, setActiveSection, goToSection } = useApp();
  return { activeSection, setActiveSection, goToSection };
};
