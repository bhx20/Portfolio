"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import "./Hero.css";

const Hero = ({ isActive = true }: { isActive?: boolean }) => {
  const { data } = usePortfolio();
  const hero = data?.hero || {};

  const tag = hero.tag;
  const name = hero.name;
  const surname = hero.surname;
  const titles = hero.heroTitles || [];
  const scrollText = hero.scrollText;

  const [index, setIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    if (!isActive && showScrollHint) {
      setShowScrollHint(false);
    }
  }, [isActive, showScrollHint]);

  useEffect(() => {
    if (titles.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 4000);

    return () => {
      clearInterval(timer);
    };
  }, [titles.length]);

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hero-branding"
          >
            <div className="hero-text-content">

              <h1 className="hero-name">
                <span className="name-block">{hero.name || "Code"}</span>
                <span className="surname-block surname-glass">{hero.surname || "Crafter"}</span>
              </h1>
  
              <div className="hero-subtitle-container">
                <div className="title-rotation-wrapper">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                      className="title-text"
                    >
                      {titles[index]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Premium Avatar Widget */}
            <motion.div 
              className="hero-avatar-widget"
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)", x: 20 }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)", x: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-avatar-glow"></div>
              <div className="hero-avatar-border">
                {hero.image && <img src={hero.image} alt={hero.name || "Profile"} className="hero-avatar-img" />}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              className="hero-scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: showScrollHint ? 1.5 : 0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mouse-icon-sim">
                <div className="mouse-dot"></div>
              </div>
              <span className="scroll-text text-label">{hero.scrollText || "SCROLL TO DISCOVER"}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;

