"use client";
import { motion } from "framer-motion";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import { LuDatabase, LuLayers, LuSmartphone, LuCode } from "react-icons/lu";
import { useLiquidGlass } from "@/lib/hooks/useLiquidGlass";
import "./TechStack.css";

const EngineIcons: Record<string, any> = { LuCode, LuDatabase, LuSmartphone, LuLayers };

const TechStack = () => {
  const { data } = usePortfolio();
  const tech = data?.tech || {};
  const { engine = [], career = [], techStack = {}, ui = {} } = tech;
  const { handleMouseMove } = useLiquidGlass();

  const sectionLabel = ui.sectionLabel;
  const engineTitle = ui.engineTitle;
  const evolutionTitle = ui.evolutionTitle;
  const coreStackTitle = ui.coreStackTitle;
  const toolsTitle = ui.toolsTitle;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <section className="bento-slide" id="tech">
      <div className="tech-layout">
        <div className="section-label">
          {sectionLabel}
        </div>
        <motion.div
          className="tech-container module-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="tech-bento-grid">

            {/* CARD 1-3: The Engine (Separated Bentos) */}
            {engine.map((item: any, i: number) => {
              const Icon = EngineIcons[item.icon] || LuCode;
              const gridClass = i === 0 ? "grid-front" : i === 1 ? "grid-back" : "grid-mobile";
              return (
                <motion.div
                  key={`engine-${i}`}
                  className={`glass-card bento-card bento-compact engine-bento-card rich-glass ${gridClass}`}
                  variants={itemVariants}
                  onMouseMove={handleMouseMove}
                >
                  <div className="bento-icon-wrapper icon-sm">
                    <Icon />
                  </div>
                  <h3 className="engine-bento-title title-card">{item.title}</h3>
                  <p className="engine-bento-subtitle text-body">{item.subtitle}</p>
                </motion.div>
              );
            })}

            {/* CARD 2: Journey (Right Column - Full Height) */}
            <motion.div 
                className="glass-card bento-card tech-evolution-card rich-glass" 
                variants={itemVariants}
                onMouseMove={handleMouseMove}
            >
              <h2 className="card-primary-title title-secondary">{evolutionTitle}</h2>
              <div className="evolution-timeline">
                {career.map((item: any, i: number) => (
                  <div key={i} className={`evolution-item ${i === 0 ? 'active' : ''}`}>
                    <div className="evolution-dot-container">
                      <div className="evolution-dot"></div>
                    </div>
                    <div className="evolution-details">
                      <span className="evolution-year text-body text-muted">
                        {item.year}{i === 0 ? ' - Present' : ''}
                      </span>
                      <h4 className="evolution-role title-card">{item.role}</h4>
                      <p className="evolution-desc text-body">{item.description || item.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CARD 3: Core Stack (Bottom Left, 1 Col) */}
            <motion.div 
                className="glass-card bento-card tech-stack-card rich-glass" 
                variants={itemVariants}
                onMouseMove={handleMouseMove}
            >
              <h2 className="card-primary-title title-secondary">{coreStackTitle}</h2>
              <div className="core-stack-circles">
                {techStack.coreStack?.map((item: any, i: number) => (
                  <div key={i} className="stack-circle-item">
                    <div className="circle-icon-wrapper" title={item.name}>
                      <img src={item.icon} alt={item.name} className="circle-logo-img" />
                    </div>
                    <span className="circle-label text-label">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CARD 4: Collaboration (Bottom Center, 1 Col) */}
            <motion.div 
                className="glass-card bento-card tech-collab-card rich-glass" 
                variants={itemVariants}
                onMouseMove={handleMouseMove}
            >
              <h2 className="card-primary-title title-secondary">{toolsTitle}</h2>
              <div className="collab-tags-cloud">
                {techStack.supportStack?.map((item: any, i: number) => (
                  <div key={i} className="support-tag">
                    <img src={item.icon} alt={item.name} className="support-tag-img" />
                    <span className="support-tag-text text-label">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
