"use client";
import "@/styles/globals.css";

const HoverLinks = ({ text, cursor }: { text: string; cursor?: boolean }) => {
  return (
    <div 
      className="hover-link" 
      data-cursor={cursor ? undefined : "disable"}
      data-text={text}
      aria-label={text}
    >
      <div className="hover-inner">
        <span className="h-text-top">{text}</span>
        <span className="h-text-bottom">{text}</span>
      </div>
    </div>
  );
};

export default HoverLinks;

