"use client";
import { useEffect, useState, useRef } from "react";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import "./Loading.css";
import { useLoading } from "@/components/shared/providers/AppProvider";
import { gsap } from "gsap";

type Particle = { left: string; top: string; animationDelay: string; opacity: number };

const Loading = () => {
  const { isLoading, setIsLoading, percent, setPercent } = useLoading();
  const { data, errors, loading: portfolioLoading, isCached } = usePortfolio();
  
  const loading = data?.loading || {};
  const hero = data?.hero || {};
  const [logs, setLogs] = useState<string[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);

  const statusMessages = loading.statusMessages || [];

  // ── 1. Independent Emergency Timeout ──
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      console.warn("⏳ Emergency bypass triggered after 3s.");
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(safetyTimer);
  }, [setIsLoading]);

  // ── 2. Progress & Success Logic ──
  useEffect(() => {
    if (!portfolioLoading || isCached) {
      setIsLoading(false);
      return;
    }

    const handler = setProgressHandler(setPercent);
    const progressTimer = setTimeout(() => {
      handler.loaded().then(() => {
        // Successfully ticked to 100%
      });
    }, 150);

    return () => clearTimeout(progressTimer);
  }, [portfolioLoading, isCached, setIsLoading, setPercent]);

  // ── 3. Manual Bypass Handler ──
  const hasAnimated = useRef(false);
  const handleManualBypass = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    gsap.to(".loading-screen-advanced", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => setIsLoading(false)
    });
  };

  // ── 4. Internal Effects ──
  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5,
      }))
    );
  }, []);

  useEffect(() => {
    const logIndex = Math.floor((percent / 100) * statusMessages.length);
    if (logIndex > logs.length && logIndex < statusMessages.length) {
      setLogs(prev => [...prev, statusMessages[logIndex - 1]]);
    }
  }, [percent, logs.length, statusMessages]);

  useEffect(() => {
    if (percent >= 100 && !hasAnimated.current) {
        handleManualBypass();
    }
  }, [percent]);

  if (!isLoading) return null;

  return (
    <div 
      className="loading-screen-advanced" 
      ref={containerRef}
      onClick={handleManualBypass}
    >
      <div className="iris-layer" ref={irisRef} />
      
      <div className="loading-glow-1"></div>
      <div className="loading-glow-2"></div>

      <div className="warp-field">
        {particles.map((p, i) => (
          <div key={i} className="warp-particle" style={p} />
        ))}
      </div>

      <div className="loading-content-synaptic">
        <div className="synaptic-hub">
          <svg viewBox="0 0 200 200" className="hub-svg">
            <circle cx="100" cy="100" r="98" className="hub-ring outer" />
            <circle cx="100" cy="100" r="85" className="hub-ring mid" strokeDasharray="20, 10" />
            <circle cx="100" cy="100" r="70" className="hub-ring inner" strokeDasharray="5, 5" />
            <circle 
              cx="100" cy="100" r="85" 
              className="hub-progress" 
              style={{ strokeDashoffset: 534 - (534 * percent) / 100 }}
            />
          </svg>
          
          <div className="hub-core">
            <div className="core-glow"></div>
            <div className="core-percent">
              <span className="num">{percent}</span>
              <span className="sym">%</span>
            </div>
          </div>
        </div>

        <div className="fragmented-logo">
          {(hero.name?.toUpperCase() || "").split("").map((char: string, i: number) => (
            <span key={i} className="logo-char" style={{ 
              animationDelay: `${i * 0.15}s`,
              filter: `blur(${Math.max(0, (80 - percent) / 10)}px)`,
              opacity: percent / 100 + 0.2,
              transform: `translateY(${(100 - percent) / (i + 1)}px)`
            }}>
              {char}
            </span>
          ))}
        </div>

        <div className="refraction-sweep"></div>
        
        <div className="synaptic-status">
          <span className="status-scanner"></span>
          <p className="status-text text-label">{loading.status}</p>
        </div>

        <div className="synaptic-meta">
          <span>{loading.version}</span>
          <span className="sep">+</span>
          <span>{loading.sub}</span>
        </div>

        <div className="debug-error-monitor">
          {Object.entries(errors || {}).map(([section, error]: [string, any]) => (
            <div key={section} className="debug-error-item text-body">
              ⚠️ {section.toUpperCase()}: {error.code || "Connection Error"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;

export const setProgressHandler = (setLoading: (val: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 70) {
      let rand = Math.round(Math.random() * 5);
      percent = Math.min(70, percent + rand);
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = Math.min(99, percent + 1);
        setLoading(percent);
        if (percent >= 99) {
          clearInterval(interval);
        }
      }, 800);
    }
  }, 200);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 50);
    });
  }

  return { loaded, percent, clear };
};
