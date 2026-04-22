"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import {
  LuMail,
  LuUser,
  LuPenTool,
  LuArrowUpRight,
  LuArrowRight,
  LuMapPin,
  LuBriefcase,
  LuClock,
  LuFileText
} from "react-icons/lu";
import { FaWhatsapp, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { useLiquidGlass } from "@/lib/hooks/useLiquidGlass";
import "./Contact.css";

const Contact = () => {
  const { data } = usePortfolio();
  const contact = data?.contact || {};
  const ui = contact.ui || {};
  const { handleMouseMove, handleMouseEnter, handleMouseLeave } = useLiquidGlass();

  const [showForm, setShowForm] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "name" && value.length < 2) error = "Name must be 2+ chars";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
    if (name === "subject" && value.length < 5) error = "Subject must be 5+ chars";
    if (name === "message" && value.length < 20) error = "Message must be 20+ chars";

    setErrors(prev => {
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
    return !error;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const [clockParts, setClockParts] = useState({
    h: 0, m: 0, s: 0,
    ampm: "",
    hrDeg: 0, minDeg: 0, secDeg: 0
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const seconds = istDate.getSeconds();

      const sDeg = seconds * 6;
      const mDeg = (minutes * 6) + (seconds * 0.1);
      const hDeg = ((hours % 12) * 30) + (minutes * 0.5);

      const ampm = hours >= 12 ? "PM" : "AM";

      setClockParts({
        h: hours, m: minutes, s: seconds,
        ampm,
        hrDeg: hDeg, minDeg: mDeg, secDeg: sDeg
      });

      setCurrentTime(now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: true }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants: any = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = Object.keys(formData).every(key =>
      validateField(key, (formData as any)[key])
    );

    if (!isValid) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="bento-slide" id="contact">
      <div className="contact-layout">
        <div className="section-label">{ui.sectionLabel}</div>
        <div className="contact-container module-container">
          <motion.div
            className="contact-bento-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            <motion.div
              className={`glass-card bento-card rich-glass contact-hero-card ${showForm ? "form-active" : ""}`}
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >

              {!showForm ? (
                <>
                  <div className="hero-data-stream" />
                  <div className="contact-status-badge">
                    <span className="status-dot" />
                    <span>{ui.tag}</span>
                  </div>

                  <div className="contact-hero-body">
                    <div className="hero-main-content">
                      <p className="contact-hero-eyebrow card-subtitle">{ui.eyebrow}</p>
                      <h2 className="contact-hero-title section-title">
                        {ui.title}
                      </h2>
                      <p className="contact-hero-sub card-subtitle">
                        {ui.subtitle}
                      </p>
                    </div>

                    <div className="hero-side-meta">
                      <div className="contact-meta-chip">
                        <LuMapPin size={14} />
                        {contact.location}
                      </div>
                      <div className="contact-meta-chip">
                        <LuClock size={14} />
                        {contact.timezone}
                      </div>
                      <div className="contact-meta-chip">
                        <LuBriefcase size={14} />
                        {contact.remote}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowForm(true)}
                    className="contact-email-cta"
                    id="contact-email-btn"
                  >
                    <span className="cta-email-address">
                      <HiOutlineMail size={16} className="contact-icon-shrink" />
                      <span className="email-text-wrap">{contact.email}</span>
                    </span>
                    <span className="cta-arrow"><LuArrowUpRight /></span>
                  </button>
                </>
              ) : (
                <div className="contact-form-container">
                  <div className="form-header">
                    <h3 className="form-title">{ui.formTitle}</h3>
                    <button onClick={() => setShowForm(false)} className="form-close-btn">
                      <span className="close-text">{ui.formClose}</span>
                      <span className="close-icon">×</span>
                    </button>
                  </div>

                  {status === "success" ? (
                    <div className="form-success-view">
                      <div className="success-icon">✓</div>
                      <h4>{ui.successTitle}</h4>
                      <p>{ui.successDesc}</p>
                      <button onClick={() => setStatus("idle")} className="form-reset-btn">{ui.successReset || "Send another"}</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-grid">
                        <div className="input-group">
                          <label>{ui.labelName || "Name"}</label>
                          <div className={`contact-input-wrapper ${errors.name ? 'error-state' : ''}`}>
                            <LuUser className="input-icon" />
                            <input
                              required
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              onBlur={(e) => validateField("name", e.target.value)}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.name && (
                              <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="error-message">
                                {errors.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="input-group">
                          <label>{ui.labelEmail || "Email"}</label>
                          <div className={`contact-input-wrapper ${errors.email ? 'error-state' : ''}`}>
                            <LuMail className="input-icon" />
                            <input
                              required
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              onBlur={(e) => validateField("email", e.target.value)}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.email && (
                              <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="error-message">
                                {errors.email}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="input-group">
                        <label>{ui.labelSubject || "Subject"}</label>
                        <div className={`contact-input-wrapper ${errors.subject ? 'error-state' : ''}`}>
                          <LuPenTool className="input-icon" />
                          <input
                            type="text"
                            placeholder="Project Inquiry"
                            value={formData.subject}
                            onChange={(e) => handleInputChange("subject", e.target.value)}
                            onBlur={(e) => validateField("subject", e.target.value)}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.subject && (
                            <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="error-message">
                              {errors.subject}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="input-group">
                        <label>{ui.labelMessage || "Message"}</label>
                        <div className={`contact-input-wrapper ${errors.message ? 'error-state' : ''}`}>
                          <textarea
                            required
                            rows={3}
                            placeholder="Tell me about your project..."
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            onBlur={(e) => validateField("message", e.target.value)}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.message && (
                            <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="error-message">
                              {errors.message}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        type="submit"
                        disabled={status === "sending" || Object.keys(errors).length > 0}
                        className="form-submit-btn"
                      >
                        <div className="btn-shimmer" />
                        <span className="btn-text">{status === "sending" ? ui.sendingText : ui.submitText}</span>
                        <LuArrowUpRight className="btn-arrow" />
                      </button>

                      {status === "error" && <p className="form-error-msg">{ui.errorMsg || "Something went wrong. Please try again."}</p>}
                    </form>
                  )}
                </div>
              )}

            </motion.div>

            <div className="contact-top-cards">
              <motion.div 
                className="glass-card bento-card bento-compact rich-glass contact-info-card clock-card analog-view" 
                variants={itemVariants}
                onMouseMove={handleMouseMove}
              >
                <div className="clock-scanline" />

                <div className="analog-clock-wrapper">
                  <div className="clock-face">
                    {/* Hour markers using Array(12).map */}
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="clock-marker" style={{ transform: `rotate(${i * 30}deg) translateY(-38px)` }} />
                    ))}

                    {/* Hands */}
                    <div className="clock-hand hour-hand" style={{ transform: `rotate(${clockParts.hrDeg}deg)` }} />
                    <div className="clock-hand minute-hand" style={{ transform: `rotate(${clockParts.minDeg}deg)` }} />
                    <div className="clock-hand second-hand" style={{ transform: `rotate(${clockParts.secDeg}deg)` }} />
                    <div className="clock-center-pin" />
                  </div>
                </div>

              </motion.div>

              {/* WHATSAPP CONNECT CARD (Premium Glow Approach) */}
              <motion.a
                href={`https://wa.me/${contact.whatsapp || "919727409439"}`}
                target="_blank"
                rel="noreferrer"
                className="glass-card bento-card bento-compact rich-glass contact-info-card whatsapp-card-premium"
                variants={itemVariants}
                onMouseMove={handleMouseMove}
              >
                <div className="whatsapp-aura" />
                <div className="bento-icon-wrapper">
                  <FaWhatsapp className="wa-main-icon" />
                </div>

                <div className="wa-bottom-row">
                  <div className="wa-status-pill">
                    <span className="wa-dot" />
                    <span>{ui.waStatus || "Active"}</span>
                  </div>
                  <div className="wa-action-arrow">
                    <LuArrowRight />
                  </div>
                </div>
              </motion.a>
            </div>

            {/* STAY CONNECTED — Individual List Tiles */}
            <div className="contact-social-grid">
              {(contact.socials || []).map((link: any, i: number) => {
                const platform = link.platform?.toLowerCase();
                let Icon = LuArrowUpRight;
                if (platform?.includes("github")) Icon = FaGithub;
                else if (platform?.includes("linkedin")) Icon = FaLinkedin;
                else if (platform?.includes("instagram")) Icon = FaInstagram;
                else if (platform?.includes("resume")) Icon = LuFileText;

                return (
                  <motion.a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-card bento-card bento-compact rich-glass openfor-item social-link-tile"
                    variants={itemVariants}
                    onMouseMove={handleMouseMove}
                  >
                    <div className="openfor-scanline" />
                    <div className="bento-icon-wrapper icon-sm">
                      <Icon />
                    </div>
                    <div className="openfor-text">
                      <span className="openfor-label card-title">{link.platform}</span>
                      <span className="openfor-sub card-subtitle">
                        {link.handle || link.sub || "External link"}
                      </span>
                    </div>
                    <div className="item-launcher-wrap">
                      <LuArrowUpRight />
                    </div>
                  </motion.a>
                );
              })}
            </div>

          </motion.div>

          {/* Global Footer Positioned at True Bottom of Section */}
          <div className="portfolio-global-footer">
            <p className="contact-footer-copy">
              © {new Date().getFullYear()} {contact.copyrightName}. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
