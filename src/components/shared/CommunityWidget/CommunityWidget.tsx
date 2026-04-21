"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc } from "firebase/firestore";
import { HiChatAlt2, HiX, HiPaperAirplane } from "react-icons/hi";
import filter from "leo-profanity";
import { db } from "@/lib/firebase";
import { usePortfolio } from "@/components/shared/providers/AppProvider";
import "./CommunityWidget.css";

// Initialize profanity filter
filter.loadDictionary('en');

const CommunityWidget = () => {
  const { data } = usePortfolio();
  const community = data?.community || {};
  const ui = community.ui || {};

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync dynamic moderation words from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "portfolio", "community", "moderation", "restrictedWords"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.restrictedWords && Array.isArray(data.restrictedWords)) {
          // Clear previous custom words and add new ones
          filter.add(data.restrictedWords);
          console.log("🛡️ Moderation list updated from Firestore");
        }
      }
    });

    return () => unsub();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Real-time listener for community messages
  useEffect(() => {
    const q = query(
      collection(db, "portfolio", "community", "chats"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsub();
  }, []);

  const formatTime = (ts: any) => {
    if (!ts) return "Just now";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    if (isToday) {
      return `Today, ${timeStr}`;
    }

    const dateStr = date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });

    return `${dateStr}, ${timeStr}`;
  };

  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    // Check for profanity before sending
    if (filter.check(newMsg)) {
      setError("Please keep it respectful! Restricted words are not allowed.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const msgData = {
      user: "Anonymous",
      message: newMsg, // Sending original since we've already blocked bad words
      timestamp: serverTimestamp(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
    };

    try {
      setNewMsg("");
      setError(null);
      await addDoc(collection(db, "portfolio", "community", "chats"), msgData);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="community-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="widget-panel"
            initial={{ opacity: 0, scale: 0.9, y: 30, x: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30, x: 30 }}
          >


            <div className="widget-header">
              <div className="header-info">
                <h3>{ui.headerTitle || "Community Talks"}</h3>
                <span className="live-badge">
                  <div className="live-dot"></div> {ui.liveText || "LIVE"}
                </span>
              </div>
              <button className="close-widget" onClick={() => setIsOpen(false)}>
                <HiX />
              </button>
            </div>

            <div 
              className="widget-messages" 
              ref={scrollRef}
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
            >
              {messages.map((msg: any) => (
                <motion.div
                  key={msg.id}
                  className="widget-msg-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  layout
                >
                  <img src={msg.avatar} alt={msg.user} className="user-avatar" />
                  <div className="msg-content">
                    <div className="msg-user">
                      {msg.user} <span className="msg-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="msg-text">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="msg-error-toast"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="widget-input-area">
              <input
                type="text"
                placeholder={ui.inputPlaceholder || "Say something anonymous..."}
                value={newMsg}
                onChange={(e) => {
                  setNewMsg(e.target.value);
                  if (error) setError(null);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="widget-send" onClick={handleSend}>
                <HiPaperAirplane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`widget-toggle ${isOpen ? 'widget-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Community Chat"
      >
        <HiChatAlt2 size={24} />
        {messages.length > 0 && !isOpen && (
          <span className="notification-badge">
            {messages.length > 99 ? '99+' : messages.length}
          </span>
        )}
        <span className="widget-tooltip">{ui.tooltip || "Community"}</span>
      </motion.button>
    </div>
  );
};

export default CommunityWidget;

