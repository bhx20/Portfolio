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
            transition={{ delay: 0.5, duration: 1 }}
            className="hero-branding"
          >
            <div className="hero-title-tag">
              <span className="status-dot"></span>
              <span className="tag-text text-label">{hero.tag || "DIGITAL ARCHITECT"}</span>
              <div className="tag-shimmer"></div>
            </div>
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
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="title-text"
                  >
                    {titles[index]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              className="hero-scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: showScrollHint ? 1.5 : 0, duration: 0.8 }}
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

