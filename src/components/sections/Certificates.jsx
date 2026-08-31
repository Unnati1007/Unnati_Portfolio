import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// Count-up animated component for numeric stats
const CountUpStat = ({ target, prefix = '', suffix = '', duration = 1.8 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;
    
    const end = parseInt(target, 10);
    if (isNaN(end)) {
      setCount(target);
      return;
    }
    
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const updateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * end);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

const Certificates = () => {
  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.1
      }
    }
  };

  // Card item entrance animation
  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 90, 
        damping: 14 
      } 
    }
  };

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-8 max-w-5xl mx-auto" id="achievements">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
      >
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <span className="text-blue-600 font-mono text-[11px] sm:text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
            // 05. Recognition & Impact
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
            Achievements & Leadership
            <span className="absolute -bottom-1.5 left-0 w-10 sm:w-12 h-0.5 bg-blue-500 rounded-full"></span>
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="space-y-6">
          
          {/* TOP ROW: Large Stat Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Stat 1: DSA Solved */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Algorithmic
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                <CountUpStat target="500" suffix="+" />
              </div>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                DSA problems solved
              </div>
            </motion.div>

            {/* Stat 2: Contest Rating */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  LeetCode
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                <CountUpStat target="1458" />
              </div>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                Max Contest Rating: 1458 (LeetCode)
              </div>
            </motion.div>

            {/* Stat 3: GSSoC */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 relative overflow-hidden group sm:col-span-2 md:col-span-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Open Source
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                <CountUpStat prefix="Top " target="500" />
              </div>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                GSSoC Open Source Contributor 2026 (Top 500)
              </div>
            </motion.div>

          </div>

          {/* LOWER SECTION: Bento Split between Leadership & Recognitions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Leadership / Roles Column */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2 mb-1 px-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Leadership & Campus Roles
                </h3>
              </div>

              {/* Role 1 */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-4 border border-slate-200 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    VP, AI Club and DIY & Innovation Club MITS
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Driving student innovation, technical workshops & AI initiatives
                  </div>
                </div>
              </motion.div>

              {/* Role 2 */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-4 border border-slate-200 border-l-4 border-l-cyan-500 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                    Technical Team Member, Google Developer Groups on Campus MITS
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Coordinating hackathons, developer seminars & cloud sprints
                  </div>
                </div>
              </motion.div>

              {/* Role 3 */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-4 border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    Core Member, GeeksforGeeks
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Campus chapter community building and peer coding mentorship
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Certifications & Recognitions Column */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2 mb-1 px-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Honors & Certifications
                </h3>
              </div>

              {/* Tag / Pill Cards */}
              <div className="grid grid-cols-1 gap-2.5">
                
                {/* 1. IIITM Infotsav */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                    IIITM Infotsav Grand Finalist 2025
                  </span>
                </motion.div>

                {/* 2. Infosys */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:border-cyan-400 hover:shadow-md transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors">
                    Infosys Springboard Intern '26
                  </span>
                </motion.div>

                {/* 3. NCC Cadet */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:border-red-400 hover:shadow-md transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-red-600 transition-colors">
                    NCC Cadet (B & C Certificate)
                  </span>
                </motion.div>

                {/* 4. DSA Certifications */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    DSA Certifications (GeeksforGeeks, Udemy)
                  </span>
                </motion.div>

                {/* 5. HackerRank 5 Stars */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:border-yellow-400 hover:shadow-md transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-yellow-600 transition-colors">
                    HackerRank Python & Problem Solving 5 Stars
                  </span>
                </motion.div>

              </div>
            </div>

          </div>

          {/* BOTTOM FULL-WIDTH CTA BANNER: View All Certificates */}
          <motion.a
            href="https://drive.google.com/drive/folders/10RUr_6X03U2Rg17Krfi2Nerw5429d0ER"
            target="_blank"
            rel="noopener noreferrer"
            variants={cardVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group block rounded-2xl p-5 md:p-6 bg-gradient-to-r from-blue-50/90 via-white to-sky-50/80 border border-blue-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle decorative background glow */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-300/40 transition-colors" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                {/* Folder / Google Drive style Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      View All Certificates
                    </h4>
                    <span className="hidden sm:inline-flex text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-700 border border-blue-200">
                      Google Drive
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                    All achievement certificates & proofs in one place
                  </p>
                </div>
              </div>

              {/* Clickable Arrow Icon Indicator */}
              <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-xs md:text-sm shrink-0 self-end sm:self-auto">
                <span className="font-medium">Explore Proofs</span>
                <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.a>

        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Certificates);
