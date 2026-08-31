import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Resume = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices to adjust 3D tilt sensitivity
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // 3D Document Tilt Physics
  const docRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end parallax response
  const springConfig = { damping: 20, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse coordinates into 3D rotations & realistic cast shadow
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 14]);
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [15, 45]);

  const docRectRef = useRef(null);
  const docRafRef = useRef(null);

  const handleDocMouseEnter = () => {
    if (isTouchDevice || !docRef.current) return;
    docRectRef.current = docRef.current.getBoundingClientRect();
  };

  const handleDocMouseMove = (e) => {
    if (isTouchDevice) return;
    if (!docRectRef.current) {
      if (docRef.current) {
        docRectRef.current = docRef.current.getBoundingClientRect();
      } else {
        return;
      }
    }

    if (docRafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    docRafRef.current = requestAnimationFrame(() => {
      const rect = docRectRef.current;
      if (rect) {
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      }
      docRafRef.current = null;
    });
  };

  const handleDocMouseLeave = () => {
    if (docRafRef.current) {
      cancelAnimationFrame(docRafRef.current);
      docRafRef.current = null;
    }
    docRectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  // Magnetic Button Physics
  const buttonRef = useRef(null);
  const btnRectRef = useRef(null);
  const btnRafRef = useRef(null);
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const smoothBtnX = useSpring(btnX, { damping: 15, stiffness: 280, mass: 0.4 });
  const smoothBtnY = useSpring(btnY, { damping: 15, stiffness: 280, mass: 0.4 });

  const handleBtnMouseEnter = () => {
    if (isTouchDevice || !buttonRef.current) return;
    btnRectRef.current = buttonRef.current.getBoundingClientRect();
  };

  const handleBtnMouseMove = (e) => {
    if (isTouchDevice) return;
    if (!btnRectRef.current) {
      if (buttonRef.current) {
        btnRectRef.current = buttonRef.current.getBoundingClientRect();
      } else {
        return;
      }
    }

    if (btnRafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    btnRafRef.current = requestAnimationFrame(() => {
      const rect = btnRectRef.current;
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = (clientX - centerX) * 0.35;
        const distanceY = (clientY - centerY) * 0.35;
        btnX.set(distanceX);
        btnY.set(distanceY);
      }
      btnRafRef.current = null;
    });
  };

  const handleBtnMouseLeave = () => {
    if (btnRafRef.current) {
      cancelAnimationFrame(btnRafRef.current);
      btnRafRef.current = null;
    }
    btnRectRef.current = null;
    btnX.set(0);
    btnY.set(0);
  };

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-8 max-w-5xl mx-auto relative overflow-visible" id="resume">
      
      {/* Ambient Atmospheric Glows & Depth Elements (Non-Boxed) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 md:w-[420px] h-80 md:h-[420px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 md:w-96 h-72 md:h-96 bg-sky-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Free-Floating Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Get In Touch & Magnetic Resume CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 flex flex-col items-start"
        >
          {/* Section Marker & Heading matching other sections */}
          <div className="mb-4 sm:mb-6">
            <span className="text-blue-600 font-mono text-[11px] sm:text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
              // 06. Connect & Work Together
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
              Get In Touch
              <span className="absolute -bottom-1.5 left-0 w-10 sm:w-12 h-0.5 bg-blue-500 rounded-full"></span>
            </h2>
          </div>

          {/* Subtitle / Intro Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed mb-4 max-w-lg">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          {/* Direct Contact Links / Cards (Email, LinkedIn, GitHub) */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-5 w-full sm:w-auto">
            {/* Email Pill */}
            <a
              href="mailto:unnatijadon1007@gmail.com"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all duration-200 group min-h-[38px] max-w-full truncate"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 group-hover:scale-110 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">unnatijadon1007@gmail.com</span>
            </a>

            {/* LinkedIn Pill */}
            <a
              href="https://linkedin.com/in/unnati-jadon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all duration-200 group min-h-[38px]"
            >
              <svg className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* GitHub Pill */}
            <a
              href="https://github.com/Unnati1007"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all duration-200 group min-h-[38px]"
            >
              <svg className="w-3.5 h-3.5 text-slate-800 group-hover:scale-110 transition-transform shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>

          {/* Clean Floating Download Button */}
          <div className="flex flex-col items-start gap-2 sm:gap-2.5 w-full sm:w-auto">
            <motion.div
              ref={buttonRef}
              style={{ x: smoothBtnX, y: smoothBtnY }}
              onMouseEnter={handleBtnMouseEnter}
              onMouseMove={handleBtnMouseMove}
              onMouseLeave={handleBtnMouseLeave}
              className="relative group inline-block w-full sm:w-auto"
            >
              <a
                href="/Unnati_Jadon_Resume.pdf"
                download="Unnati_Jadon_Resume.pdf"
                className="relative flex items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 md:px-9 md:py-4.5 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50/70 text-blue-600 font-extrabold text-sm sm:text-base md:text-lg border-2 border-blue-400 hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer select-none min-h-[44px] w-full sm:w-auto"
              >
                {/* Icon */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <svg 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <span>Download Resume</span>
                <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 hidden sm:inline-block border border-blue-200">
                  PDF
                </span>
              </a>
            </motion.div>

            {/* Subtext */}
            <div className="text-[11px] sm:text-xs font-mono text-slate-500 flex items-center gap-1.5 pl-1">
              <span>Direct download</span>
              <span>•</span>
              <span>Single-click verified PDF</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: 3D Interactive Floating Resume Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, rotateX: -20, rotateY: 25, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 6, rotateY: -8, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 65, damping: 14, mass: 0.8 }}
          className="lg:col-span-6 flex items-center justify-center lg:justify-end perspective-[1200px] w-full mt-4 lg:mt-0"
        >
          {/* 3D Floating Canvas Wrapper */}
          <div 
            ref={docRef}
            onMouseEnter={handleDocMouseEnter}
            onMouseMove={handleDocMouseMove}
            onMouseLeave={handleDocMouseLeave}
            className="relative cursor-pointer group select-none max-w-full"
            style={{ perspective: 1200 }}
          >
            {/* Download Link Wrapper around the Document */}
            <a
              href="/Unnati_Jadon_Resume.pdf"
              download="Unnati_Jadon_Resume.pdf"
              className="block outline-none max-w-full"
              title="Click to download resume"
            >
              {/* Dynamic 3D Cast Shadow */}
              <motion.div 
                style={{
                  x: shadowX,
                  y: shadowY,
                }}
                className="absolute inset-4 rounded-3xl bg-slate-900/15 blur-2xl -z-10 transition-all duration-300 pointer-events-none group-hover:bg-blue-600/25 group-hover:blur-3xl"
              />

              {/* 3D Floating Document Sheet */}
              <motion.div
                style={{
                  rotateX: isTouchDevice ? 2 : rotateX,
                  rotateY: isTouchDevice ? -2 : rotateY,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-[280px] sm:w-[340px] md:w-[370px] max-w-[90vw] bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-2xl relative overflow-hidden transition-colors group-hover:border-blue-300"
              >
                {/* Dynamic Sheen / Glare Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/50 to-transparent"
                  style={{
                    transform: `translate3d(0, 0, 1px)`,
                  }}
                />

                {/* Document Top Bar with Mac-style controls */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    UNNATI_JADON.PDF
                  </span>
                  <div className="w-2.5 h-2.5" />
                </div>

                {/* Mockup Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                      UNNATI JADON
                    </h3>
                    <p className="text-[11px] font-semibold text-blue-600 font-mono mt-0.5">
                      Software Engineer • AIML & Full-Stack
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-slate-400">
                      <span>Gwalior, IN</span>
                      <span>•</span>
                      <span>8.5 CGPA</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 shadow-inner">
                    UJ
                  </div>
                </div>

                {/* Section 1: Experience Mini Bars */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      Experience
                    </span>
                    <span className="text-[9px] font-mono text-blue-600 font-semibold">3 Roles</span>
                  </div>

                  {/* Role 1: DRDO */}
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                      <span>DRDO — Project Intern</span>
                      <span className="text-[8px] font-mono text-slate-400">2025</span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <div className="h-1 bg-slate-200 rounded-full w-full" />
                      <div className="h-1 bg-slate-200/70 rounded-full w-4/5" />
                    </div>
                  </div>

                  {/* Role 2: Ethara AI */}
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                      <span>Ethara AI — LLM & RLHF Intern</span>
                      <span className="text-[8px] font-mono text-slate-400">2026</span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <div className="h-1 bg-slate-200 rounded-full w-full" />
                      <div className="h-1 bg-slate-200/70 rounded-full w-3/4" />
                    </div>
                  </div>

                  {/* Role 3: Praedico */}
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                      <span>Praedico — Full-Stack Intern</span>
                      <span className="text-[8px] font-mono text-slate-400">2026</span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <div className="h-1 bg-slate-200 rounded-full w-11/12" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Technical Skills Chips */}
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded inline-block mb-2">
                    Core Skills
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['React.js', 'Next.js', 'FastAPI', 'PyTorch', 'LangChain', 'MongoDB', 'Redis'].map((skill, i) => (
                      <span key={i} className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floating "Click to Download" Interactive Stamp on Hover */}
                <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, y: 10 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs font-mono shadow-xl flex items-center gap-2 border border-blue-400"
                  >
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>CLICK TO DOWNLOAD</span>
                  </motion.div>
                </div>

              </motion.div>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default React.memo(Resume);
