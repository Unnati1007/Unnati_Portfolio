import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NavigationMenu = ({ setSector }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      id: 'home',
      name: 'Home / 3D Desk',
      tag: '// Top & Center',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      action: () => {
        if (setSector) setSector('center');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'dev-journey',
      name: 'Development Journey',
      tag: '// 3D Dev Sector',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      action: () => {
        if (setSector) setSector('left');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'dsa-journey',
      name: 'DSA Journey',
      tag: '// 3D DSA Sector',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      action: () => {
        if (setSector) setSector('right');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'scroll-about',
      name: 'About Me',
      tag: '// Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'scroll-education',
      name: 'Education',
      tag: '// 01. Academic',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      id: 'scroll-experience',
      name: 'Experience',
      tag: '// 02. History',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'scroll-profiles',
      name: 'Coding Profiles',
      tag: '// 03. Digital',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      id: 'scroll-projects',
      name: 'Projects',
      tag: '// 04. Selected Works',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    {
      id: 'scroll-certificates',
      name: 'Achievements & Leadership',
      tag: '// 05. Recognition',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 'scroll-resume',
      name: 'Resume & Contact',
      tag: '// 06. CV & Connect',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const handleItemClick = (item) => {
    setIsOpen(false);
    if (item.action) {
      item.action();
      return;
    }
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed Top-Right Tactile Switch Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        className="fixed top-5 right-5 md:top-7 md:right-8 z-50 flex items-center gap-2 px-3.5 py-2 md:px-4 md:py-2.5 rounded-2xl bg-[#0c1017]/90 hover:bg-[#111722] text-white border border-slate-700/70 hover:border-cyan-400/60 shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 cursor-pointer group"
      >
        {/* Text Label */}
        <span className="font-mono text-xs font-black tracking-widest text-slate-200 group-hover:text-cyan-300 transition-colors uppercase">
          {isOpen ? 'CLOSE' : 'MENU'}
        </span>

        {/* Rotating Animated Morph Icon */}
        <div className="w-5 h-5 flex items-center justify-center relative text-slate-300 group-hover:text-cyan-300 transition-colors">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Slide-out Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[3px] z-40 cursor-pointer"
            />

            {/* Cyber Drawer Panel with Hidden Scrollbar (Mouse Wheel Scrollable) */}
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-80 sm:w-[380px] max-w-[90vw] z-40 bg-[#070a11]/95 backdrop-blur-2xl border-l border-slate-800 shadow-[-25px_0_60px_rgba(0,0,0,0.85)] flex flex-col justify-between p-5 sm:p-7 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Top Cyber Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-blue-500" />
              
              {/* Left Subtle Glow Border */}
              <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-cyan-400/40 via-blue-500/20 to-transparent" />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                      // SYSTEM NAVIGATION
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                      Direct Waypoints
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    ONLINE
                  </span>
                </div>

                {/* Nav Items List */}
                <nav className="space-y-1.5">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.035, duration: 0.25 }}
                      onClick={() => handleItemClick(item)}
                      className="w-full group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-cyan-500/30 bg-slate-900/30 hover:bg-gradient-to-r hover:from-cyan-950/40 hover:to-slate-900/60 text-slate-300 hover:text-white transition-all duration-200 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-cyan-400 border border-slate-700/60 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/20 flex items-center justify-center shrink-0 transition-colors shadow-inner">
                          {item.icon}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold tracking-wide group-hover:text-cyan-300 transition-colors truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                            {item.tag}
                          </div>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <svg
                        className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200 shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationMenu;
