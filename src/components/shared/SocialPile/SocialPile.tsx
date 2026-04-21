"use client";
import { motion, AnimatePresence } from "framer-motion";
import "./SocialPile.css";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { LuFileText, LuArrowUpRight } from "react-icons/lu";

interface SocialIconsProps {
  isHeroActive?: boolean;
}

const SocialPile = () => {
  const { data } = usePortfolio();
  
  // socialLinks are now nested in the contact section
  const socialLinks = data?.contact?.socials || [];

  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <motion.div
      className="icons-section"
      data-cursor="disable"
    >
          <div className="social-icons">
            {socialLinks.map((link: any, index: number) => {
              const platform = link.platform?.toLowerCase() || "";
              const platformName = link.platform || "Social";
              
              // Map platforms to icons if no explicit icon URL is provided
              let IconComp = LuArrowUpRight;
              if (platform.includes("github")) IconComp = FaGithub;
              else if (platform.includes("linkedin")) IconComp = FaLinkedin;
              else if (platform.includes("instagram")) IconComp = FaInstagram;
              else if (platform.includes("whatsapp")) IconComp = FaWhatsapp;
              else if (platform.includes("resume")) IconComp = LuFileText;

              return (
                <a 
                  key={`${link.platform}-${index}`}
                  href={link.url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link"
                  aria-label={platformName}
                  data-premium-tooltip={platformName}
                  data-tooltip-pos="right"
                >
                  <div className="icon-wrapper">
                    {link.icon ? (
                      link.icon.startsWith("<svg") ? (
                        <div className="remote-icon" dangerouslySetInnerHTML={{ __html: link.icon }} />
                      ) : (
                        <img src={link.icon} alt={link.platform} className="remote-icon" />
                      )
                    ) : (
                      <IconComp className="remote-icon" />
                    )}
                  </div>
                </a>
              );
            })}
      </div>
    </motion.div>
  );
};

export default SocialPile;
