"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import { HiOutlineExternalLink, HiOutlineChevronRight, HiOutlineChevronLeft, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useLiquidGlass } from "@/lib/hooks/useLiquidGlass";
import "./Showcase.css";

const Showcase = () => {
  const { data } = usePortfolio();
  const [activeView, setActiveView] = useState<"bento" | "products">("bento");
  const { handleMouseMove } = useLiquidGlass();

  const showcase = data?.showcase || {};
  const projects = showcase.projects || [];
  const products = showcase.products || [];
  const ui = showcase.ui || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const childVariants: any = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <section className="bento-slide" id="showcase">
      <AnimatePresence mode="wait">
        {activeView === "bento" ? (
          <motion.div
            key="bento"
            className="showcase-layout"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="section-label">{ui.sectionLabel}</div>
            <div className="showcase-bento-grid">
                {projects.map((project: any, index: number) => (
                  <motion.div
                    key={project.id || index}
                    className={`bento-card rich-glass showcase-cell showcase-node-${index}`}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    onMouseMove={handleMouseMove}
                  >
                    {project.image && (
                      <div className="project-media">
                        <img src={project.image} alt={project.title} className="project-bg" />
                        <div className="project-mask"></div>
                      </div>
                    )}

                    <div className="project-aura" />

                    <div className="project-content-v">
                      <motion.div variants={childVariants} className="card-subtitle text-label">{project.category}</motion.div>
                      <motion.h3
                        variants={childVariants}
                        className="project-header title-card"
                      >
                        {project.title}
                      </motion.h3>
                      <motion.p variants={childVariants} className="about-bio-text text-body">{project.description}</motion.p>

                      <motion.div variants={childVariants} className="project-meta">
                        <div className="tool-row">
                          {project.tools?.slice(0, 3).map((tool: string, i: number) => (
                            <span key={i} className="tool-tag text-label">{tool}</span>
                          ))}
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="launch-icon-btn"
                            data-premium-tooltip="LAUNCH"
                            data-tooltip-pos="left"
                            aria-label="Launch project"
                          >
                            <HiOutlineExternalLink />
                          </a>
                        )}
                      </motion.div>
                    </div>

                    <span className="project-card-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="showcase-nav-arrow next-view-btn"
                onClick={() => setActiveView("products")}
                aria-label="View Products"
              >
                <div className="arrow-pulse"></div>
                <HiOutlineChevronRight />
              </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="products"
            className="products-layout"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="section-label">{ui.sectionLabel}</div>
            <div className="products-bento-grid">
                {products.map((product: any, index: number) => (
                  <motion.div
                    key={product.id || index}
                    className={`bento-card rich-glass showcase-cell product-card product-node-${index}`}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    onMouseMove={handleMouseMove}
                  >
                    <div className="project-aura" />

                    <div className="project-content-v">
                      <div className="product-header-top">
                        <motion.div variants={childVariants} className="card-subtitle text-label">
                          {product.category}
                        </motion.div>
                        <motion.div variants={childVariants} className="product-price-pill text-label">
                          {product.price}
                        </motion.div>
                      </div>

                      <div className="product-main-content">
                        <motion.h3
                          variants={childVariants}
                          className="project-header title-card"
                        >
                          {product.title}
                        </motion.h3>

                        {index === 0 ? (
                          <ul className="spec-list">
                            {product.description.split('. ').map((spec: string, i: number) => (
                              <motion.li key={i} variants={childVariants} className="spec-item text-body">
                                <HiOutlineChevronRight className="spec-icon" />
                                {spec}
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <motion.p variants={childVariants} className="about-bio-text text-body">
                            {product.description}
                          </motion.p>
                        )}
                      </div>

                      <motion.div variants={childVariants} className="project-meta">
                        <div className="tool-row">
                          <span className="tool-tag text-label">{product.tag}</span>
                        </div>
                        <div className="product-actions">
                          <a
                            href={product.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="launch-icon-btn"
                            data-premium-tooltip="LAUNCH"
                            data-tooltip-pos="left"
                            aria-label={`Launch ${product.title}`}
                          >
                            <HiOutlineExternalLink />
                          </a>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="showcase-nav-arrow prev-view-btn"
                onClick={() => setActiveView("bento")}
                aria-label="Back to Projects"
              >
                <HiOutlineChevronLeft />
              </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Showcase;
