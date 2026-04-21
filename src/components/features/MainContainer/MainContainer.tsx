/* ==========================================================================
   CORE PORTFOLIO ENGINE
   Architecture: Cinematic Vertical Slider + Deep Link Handler
   Interactions: GSAP Observer + Intersection Observer
   ========================================================================== */

"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";

// ── Feature Components ──
import Hero from "../Hero/Hero";
import About from "../About/About";
import Showcase from "../Showcase/Showcase";
import TechStack from "../TechStack/TechStack";
import Contact from "../Contact/Contact";

// ── Shared UI ──
import Cursor from "../../shared/Cursor/Cursor";
import SocialPile from "../../shared/SocialPile/SocialPile";
import CommunityWidget from "../../shared/CommunityWidget/CommunityWidget";

// ── Context & Styles ──
import { useApp } from "@/components/shared/providers/AppProvider";
import "./MainContainer.css";

// ── GSAP Registration ──
gsap.registerPlugin(ScrollToPlugin, Observer);

const SECTIONS = ["hero", "about", "showcase", "tech", "contact"];
const NAV_LABELS = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"];

const MainContainer = () => {
  // ── 1. Hooks & Refs ──
  const { data, errors, activeSection, setActiveSection, setNavigationCallback } = useApp();
  const component = useRef<HTMLDivElement>(null);
  const sliderInnerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const [isMobile, setIsMobile] = useState(false);
  
  const currentIndexRef = useRef(activeSection);
  const isAnimatingRef = useRef(false);

  // ── 2. Navigation Engine ──
  const goToSection = useCallback((index: number, force = false) => {
    if (index < 0 || index >= SECTIONS.length) return;
    
    // Logic for Mobile (Snap Scroll)
    if (isMobile) {
      const target = sectionsRef.current[index];
      if (target) {
        window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
        setActiveSection(index);
        currentIndexRef.current = index;
        const path = index === 0 ? "/" : `/${SECTIONS[index]}`;
        window.history.replaceState(null, "", path);
      }
      return;
    }

    // Logic for Desktop (Slider)
    if ((isAnimatingRef.current || index === currentIndexRef.current) && !force) return;

    isAnimatingRef.current = true;
    currentIndexRef.current = index;
    setActiveSection(index);

    const path = index === 0 ? "/" : `/${SECTIONS[index]}`;
    window.history.replaceState(null, "", path);

    gsap.killTweensOf(sliderInnerRef.current);
    gsap.to(sliderInnerRef.current, {
      yPercent: -index * 100,
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: () => {
        setTimeout(() => { isAnimatingRef.current = false; }, 200); 
      }
    });
  }, [isMobile, setActiveSection]);

  const scrollToSection = (index: number) => goToSection(index, true);

  // ── 3. Device Detection & Router Registration ──
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Register slider controls to global AppProvider
    setNavigationCallback(goToSection);

    return () => {
      window.removeEventListener("resize", checkMobile);
      setNavigationCallback(null);
    };
  }, [goToSection, setNavigationCallback]);

  // ── 4. Mobile Intersection Tracking ──
  useEffect(() => {
    if (!isMobile) return;

    const options = { root: null, rootMargin: "-20% 0px -70% 0px", threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = SECTIONS.indexOf(entry.target.id);
          if (index !== -1 && !isAnimatingRef.current) {
            setActiveSection(index);
            currentIndexRef.current = index;
            const path = index === 0 ? "/" : `/${SECTIONS[index]}`;
            window.history.replaceState(null, "", path);
          }
        }
      });
    }, options);

    sectionsRef.current.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [isMobile]);

  // ── 5. Desktop Observer Engine ──
  useLayoutEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        wheelSpeed: 1,
        tolerance: 50,
        onUp: () => !isAnimatingRef.current && currentIndexRef.current > 0 && goToSection(currentIndexRef.current - 1),
        onDown: () => !isAnimatingRef.current && currentIndexRef.current < SECTIONS.length - 1 && goToSection(currentIndexRef.current + 1),
        preventDefault: true
      });
      gsap.set(sliderInnerRef.current, { yPercent: -currentIndexRef.current * 100 });
    }, component);

    return () => ctx.revert();
  }, [goToSection, isMobile]);

  // ── 6. Initial Deep Link Handling ──
  useEffect(() => {
    const path = window.location.pathname.replace("/", "");
    const initialIndex = SECTIONS.indexOf(path || "hero");
    if (initialIndex !== -1) setTimeout(() => goToSection(initialIndex, true), 500);
  }, []);

  // ── 7. Render ──
  return (
    <div className="main-app-container" data-active-section={SECTIONS[activeSection]}>
      
      {/* Connection Safety Banner */}
      {Object.keys(errors || {}).length > 0 && (
        <div className="connection-status-banner">
          ⚠️ Connection issues detected. 
          {Object.entries(errors || {}).map(([s, e]: [string, any]) => ` [${s}: ${e.code || "err"}]`).join("")}
        </div>
      )}

      {/* Persistent UI */}
      <Cursor />
      <SocialPile />
      <CommunityWidget />

      {/* Main Experience Wrapper */}
      <div className="portfolio-wrapper" ref={component}>
        <div className="global-glow-1"></div>
        <div className="global-glow-2"></div>
        <div className="global-glow-3"></div>

        <div className="slider-inner" ref={sliderInnerRef}>
          <div id="hero" className="slider-section" ref={(el) => { sectionsRef.current[0] = el; }}><Hero isActive={activeSection === 0} /></div>
          <div id="about" className="slider-section" ref={(el) => { sectionsRef.current[1] = el; }}><About /></div>
          <div id="showcase" className="slider-section" ref={(el) => { sectionsRef.current[2] = el; }}><Showcase /></div>
          <div id="tech" className="slider-section" ref={(el) => { sectionsRef.current[3] = el; }}><TechStack /></div>
          <div id="contact" className="slider-section" ref={(el) => { sectionsRef.current[4] = el; }}><Contact /></div>
        </div>
      </div>

      {/* Premium Navigation Dots */}
      <nav className="section-dots" aria-label="Main navigation">
        {SECTIONS.map((section, i) => (
          <a
            key={i}
            href={`#${section}`}
            className={`section-dot ${activeSection === i ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection(i); }}
            data-premium-tooltip={NAV_LABELS[i] || section.toUpperCase()}
            data-tooltip-pos="left"
            aria-label={`Navigate to ${NAV_LABELS[i] || section}`}
            aria-current={activeSection === i ? "page" : undefined}
          />
        ))}
      </nav>
    </div>
  );
};

export default MainContainer;
