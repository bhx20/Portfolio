"use client";
import { useCallback } from "react";

/**
 * Hook to apply 'Liquid Glass' mouse tracking to elements.
 * Updates CSS variables for localized radial gradients and 3D parallax tilt.
 */
export const useLiquidGlass = () => {
  const updatePosition = useCallback((card: HTMLElement, e: React.MouseEvent<HTMLElement>) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. Update Glow Position
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    // 2. Calculate 3D Tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX; // -1 to 1
    const percentY = (y - centerY) / centerY; // -1 to 1
    
    const maxRotate = 0.5; // Max degrees of tilt (made very nominal)
    const rotateX = percentY * -maxRotate;
    const rotateY = percentX * maxRotate;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    updatePosition(e.currentTarget, e);
  }, [updatePosition]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    updatePosition(e.currentTarget, e);
  }, [updatePosition]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", `0deg`);
    card.style.setProperty("--rotate-y", `0deg`);
  }, []);

  return { handleMouseMove, handleMouseEnter, handleMouseLeave };
};
