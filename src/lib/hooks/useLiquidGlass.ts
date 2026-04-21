"use client";
import { useCallback } from "react";

/**
 * Hook to apply 'Liquid Glass' mouse tracking to elements.
 * Updates --mouse-x and --mouse-y CSS variables based on local element coordinates.
 */
export const useLiquidGlass = () => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
  }, []);

  return { handleMouseMove };
};
