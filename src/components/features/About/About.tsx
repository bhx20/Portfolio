"use client";
import { motion } from "framer-motion";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import { LuRocket, LuMonitor } from "react-icons/lu";
import { useLiquidGlass } from "@/lib/hooks/useLiquidGlass";
import "./About.css";

const About = () => {
  const { data } = usePortfolio();
  const about = data?.about || {};
  const stats = about.stats || {};
  const ui = about.ui || {};
  const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useLiquidGlass();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <section className="bento-slide" id="about">
      <div className="about-layout">
        <div className="section-label">
          {ui.sectionLabel}
        </div>
        <motion.div
          className="about-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="about-bento-grid">
            {/* Row 1: Primary Vision Card (Span 2x2) */}
            <motion.div
              className="glass-card bento-card vision-card rich-glass"
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="vision-content">
                <h1 className="about-vision-title title-primary">
                  {about.visionTitle} <br />
                  <span className="text-gradient">{about.visionGradient}</span>
                </h1>
                <p className="about-bio-text text-body">{about.description}</p>
              </div>

              <div className="vision-footer">
                <div className="vision-line"></div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)" stroke="none" className="vision-star">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </motion.div>

            {/* Row 1: Visual Asset Card (Span 1x2) */}
            <motion.div
              className="glass-card bento-card asset-card rich-glass"
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {about.assetImage && <img src={about.assetImage} className="bento-asset-img" alt={about.assetTitle} />}
              <div className="asset-overlay">
                <span className="asset-tag text-label">{about.assetTag}</span>
                <span className="asset-title title-card">{about.assetTitle}</span>
              </div>
            </motion.div>

            {/* Row 2: Projects Hero (Span 1x1) */}
            <motion.div
              className="glass-card bento-card proj-hero-card rich-glass"
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-inner-center">
                <div className="bento-icon-wrapper">
                  <LuRocket />
                </div>
                <span className="bento-stat-medium title-stat">{stats.projects}</span>
                <span className="bento-label-sub text-label">{ui.projSubLabel}</span>
              </div>
            </motion.div>

            {/* Row 2: Experience Hero (Span 1x1) */}
            <motion.div
              className="glass-card bento-card exp-hero-card rich-glass"
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-inner-center">
                <div className="bento-icon-wrapper">
                  <LuMonitor />
                </div>
                <span className="bento-stat-medium title-stat">{stats.experience}</span>
                <span className="bento-label-sub text-label">{ui.expSubLabel}</span>
              </div>
            </motion.div>

            {/* Row 2: Location (Span 1x1) */}
            <motion.div
              className="glass-card bento-card loc-card rich-glass"
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-inner-center loc-content">
                <span className="bento-label-sub text-label">{ui.locSubLabel || "CURRENT ORBIT"}</span>
                <h3 className="loc-title title-card">{about.location}</h3>
                <div className="loc-status">
                  <div className="loc-orb"></div>
                  <span className="loc-status-text text-body">{about.locStatus}</span>
                </div>
                <div className="loc-bg-number">{about.pageIndex}</div>
                <span className="loc-watermark text-label text-muted">{about.watermark}</span>
              </div>
            </motion.div>

            {/* Row 3: Contact Card (Span 3 Wide) */}
            <motion.div
              className="bento-card rich-glass cta-card"
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
            >
              <div className="cta-left">
                <h2 className="cta-title title-secondary">{about.ctaTitle} <em className="italic-accent">{about.ctaAccent}</em></h2>
                <p className="cta-sub text-body">{about.ctaSub}</p>
              </div>
              <div className="cta-right">
                <a href="#contact" className="cta-btn-white">{about.ctaAction}</a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
