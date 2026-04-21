"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuMoveLeft } from "react-icons/lu";
import "./NotFound.css";

const NotFoundView = () => {
  return (
    <main className="not-found-section">
      {/* Background Cinematic Atmosphere */}
      <div className="not-found-glows">
        <div className="glow-orb-404 orb-p"></div>
        <div className="glow-orb-404 orb-s"></div>
      </div>

      <div className="not-found-container">
        {/* Status Tag (Matching Hero) */}
        <motion.div 
          className="not-found-status"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="pulse-dot-red"></div>
          <span className="not-found-tag-text">SIGNAL_INTERRUPTED</span>
        </motion.div>

        {/* Massive Hero-Style Branding */}
        <motion.div 
          className="not-found-number"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <span>404</span>
          <span className="not-found-surname text-gradient">Lost_In_Static</span>
        </motion.div>

        {/* Minimal Subtext */}
        <motion.div 
          className="not-found-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="not-found-subtext">Coordinates Not Found in Current Stack</span>
        </motion.div>

        {/* Premium Action Button */}
        <motion.div 
          className="not-found-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link href="/" className="btn-premium">
            <LuMoveLeft size={18} />
            BACK TO BASE_CORE
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFoundView;
