"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";

// ── Cache Config ──────────────────────────────────────────────────────────
const CACHE_KEY = "portfolio_cache";
const CACHE_VERSION = "v1";

export function usePortfolioSync(initialData?: any) {
  const [data, setData] = useState<any>(initialData || {});
  const [loading, setLoading] = useState(!initialData || Object.keys(initialData).length === 0);
  const [isCached, setIsCached] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const dataRef = useRef<any>(initialData || {});

  // ── Cache Internal Logic ──
  const readCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.version !== CACHE_VERSION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return parsed;
    } catch { return null; }
  }, []);

  const patchCache = useCallback((section: string, sectionData: any) => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const cache = raw ? JSON.parse(raw) : { version: CACHE_VERSION, sections: {}, cachedAt: 0 };
      cache.sections[section] = sectionData;
      cache.cachedAt = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch { }
  }, []);

  // ── Sync Logic ──
  useEffect(() => {
    // 1. Try Cache First
    const cache = readCache();
    if (cache && Object.keys(cache.sections).length > 0) {
      setData(cache.sections);
      dataRef.current = cache.sections;
      setLoading(false);
      setIsCached(true);
    }

    // 2. Real-time Firebase Sync
    const unsub = onSnapshot(collection(db, "portfolio"), (snapshot) => {
      const updated = { ...dataRef.current };
      let hasChanges = false;

      snapshot.docChanges().forEach((change) => {
        const section = change.doc.id;
        const incoming = change.doc.data();

        if (change.type === "removed") {
          delete updated[section];
          hasChanges = true;
        } else {
          if (JSON.stringify(dataRef.current[section]) !== JSON.stringify(incoming)) {
            updated[section] = incoming;
            patchCache(section, incoming);
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        dataRef.current = updated;
        setData(updated);
      }
      setLoading(false);
    }, (error) => {
      console.error("❌ Sync Error:", error);
      setErrors(prev => ({ ...prev, global: error }));
      setLoading(false);
    });

    return () => unsub();
  }, [readCache, patchCache]);

  return { data, loading, isCached, errors };
}
