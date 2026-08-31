import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Interactive 3D Browser Mockup with built-in Multi-Image Carousel
const BrowserMockupCarousel = React.memo(({ images, url, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(null);

  // 3D Parallax Tilt Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      } else {
        return;
      }
    }

    if (rafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const rect = rectRef.current;
      if (rect) {
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      }
      rafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Safely clamp activeIndex to prevent out-of-bounds on image changes / HMR
  const activeIndex = (images && images.length > 0 && currentIndex < images.length) ? currentIndex : 0;
  const currentImage = (images && images.length > 0) ? (images[activeIndex] || images[0]) : '';

  // Reset index if image count reduces
  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  // Auto-advance carousel every 4.5s if multiple images and not hovered
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="perspective-[1200px] w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full rounded-2xl md:rounded-3xl bg-slate-900 border border-slate-700/60 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative group"
      >
        {/* Browser Top Window Bar - Compact */}
        <div className="bg-[#0f172a] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between select-none relative z-20">
          {/* Window Action Dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500/80" />
            <div className="w-2 h-2 rounded-full bg-amber-500/80" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
          </div>

          {/* Center Address Pill */}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-300 max-w-[180px] truncate shadow-inner">
            <svg className="w-2.5 h-2.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="truncate">{url || 'preview.app'}</span>
          </div>

          {/* Right Image Counter */}
          {images.length > 1 ? (
            <span className="text-[9px] font-mono text-slate-400 font-bold px-1.5 py-0.2 rounded bg-slate-800/60">
              {activeIndex + 1} / {images.length}
            </span>
          ) : (
            <div className="w-4" />
          )}
        </div>

        {/* Carousel Image Container - Proportional compact aspect */}
        <div className="relative aspect-[16/9.5] w-full max-h-[240px] md:max-h-[260px] bg-slate-950 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={`${title} screenshot ${activeIndex + 1}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full object-cover object-top block"
              loading="lazy"
              decoding="async"
            />
          </AnimatePresence>

          {/* Interactive Navigation Arrows for multi-image gallery */}
          {images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                aria-label="Previous screenshot"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-20 cursor-pointer shadow-md"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                aria-label="Next screenshot"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-blue-600 text-white backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-20 cursor-pointer shadow-md"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Bottom Dot Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                      currentIndex === idx ? 'w-3.5 bg-blue-400' : 'w-1 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Subtle Glare Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>
    </div>
  );
});

const Projects = () => {
  // Ordered in reverse as requested: Chat screen first, then Domains dashboard, then Admin overview
  const projects = [
    {
      id: "intellichoice",
      tag: "// 01. Full-Stack & Generative AI",
      title: "IntelliChoice",
      tagline: "AI-Powered Decision Support System with RAG & Guard Pipelines",
      url: "intellichoice.ai/agent",
      description: "An intelligent decision support system integrating Retrieval-Augmented Generation (RAG) with FAISS vector search for accurate, evidence-backed outputs. Implemented a multi-layer Guard Pipeline and multi-turn conversational agents to generate structured recommendations with reasoning across career, finance, and legal workflows.",
      tech: ["React.js", "FastAPI", "LangChain", "RAG", "FAISS", "Redis", "Tailwind CSS"],
      images: [
        "/images/projects/intellichoice-1-chat.webp",
        "/images/projects/intellichoice-2-domains.webp",
        "/images/projects/intellichoice-3-admin.webp"
      ],
      liveUrl: "#",
      githubUrl: "https://github.com/Unnati1007"
    },
    {
      id: "aiclubmits",
      tag: "// 02. Campus Community & Web Platform",
      title: "AI Club MITS",
      tagline: "Official website for the AI Club at MITS — built to showcase events, resources, and community activities.",
      url: "aiclubmits.site",
      description: "Designed and developed the official website for the AI Club at MITS to serve as a central hub for club activities, event announcements, and member resources. The site highlights upcoming workshops, past events, project showcases, and ways for students to get involved with the club's AI/ML initiatives on campus. Built with a focus on clean UI, fast performance, and easy content updates for club organizers.",
      tech: ["React.js", "Tailwind CSS", "JavaScript", "Vercel"],
      images: [
        "/images/projects/aiclubmits-1-hero.webp",
        "/images/projects/aiclubmits-2-events.webp",
        "/images/projects/aiclubmits-3-team.webp"
      ],
      liveUrl: "https://aiclubmits.site",
      isPrivateRepo: true
    },
    {
      id: "studentloan",
      tag: "// 03. Production Enterprise Portal",
      title: "Student Loan Management Portal",
      tagline: "A production-deployed portal streamlining student loan and fee-related processes for MITS Gwalior.",
      url: "ofp.mitsgwalior.in",
      description: "Contributed to and guided the development of the Student Loan Management Portal, a production system currently live and in use at MITS Gwalior for managing student loan and fee-related workflows. Played a mentorship/guidance role in the project's development, helping shape its architecture and implementation alongside the team. The portal is actively deployed and used by the institution, handling real student data and processes securely.",
      techGroups: [
        { label: "Frontend", items: ["React", "Protected Routes", "Axios"] },
        { label: "Backend", items: ["Node.js", "Express", "TypeScript", "MongoDB", "JWT", "Multer"] }
      ],
      images: [
        "/images/projects/studentloan-1-partners.webp"
      ],
      liveUrl: "https://ofp.mitsgwalior.in/",
      isPrivateRepo: true
    },
    {
      id: "ecommerce",
      tag: "// 04. Full-Stack E-Commerce Platform",
      title: "E-commerce Website",
      tagline: "A full-featured online shopping platform built with modern web technologies.",
      url: "ecommerce.anon-shop.local",
      description: "Built a complete e-commerce web application featuring product browsing, category filtering, cart management, and a smooth checkout flow. The project focuses on clean UI/UX, responsive design, and a robust backend to handle product catalogs, user authentication, and order processing.",
      tech: ["Python", "Django", "JavaScript", "HTML5", "CSS3", "SQLite", "Bootstrap"],
      images: [
        "/images/projects/ecommerce-1-home.webp",
        "/images/projects/ecommerce-2-admin.webp",
        "/images/projects/ecommerce-3-cart.webp"
      ],
      githubUrl: "https://github.com/Unnati1007/E-commerce-website"
    },
    {
      id: "lingofy",
      tag: "// 05. Full-Stack & HCI Research Platform",
      title: "Lingofy",
      tagline: "Music-Based Language Learning Platform",
      url: "lingofy.app/dashboard",
      description: "Lingofy is a full-stack language learning platform developed as an HCI research project to evaluate the impact of music-based learning on user engagement and retention. It allows users to learn languages through interactive song-based experiences with synchronized lyrics, quizzes, pronunciation analysis, and structured learning paths. Built using React, TypeScript, Node.js, Express, and MongoDB, the project highlights full-stack development and user-centered design principles.",
      tech: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
      images: [
        "/images/projects/lingofy-1-home.webp",
        "/images/projects/lingofy-2-lessons.webp",
        "/images/projects/lingofy-3-statistics.webp"
      ],
      liveUrl: "#",
      githubUrl: "https://github.com/Unnati1007"
    },
    {
      id: "ayurpredict",
      tag: "// 06. Machine Learning & Bioactivity Prediction",
      title: "AyurPredict-AI",
      tagline: "Herbal Interaction Prediction System using Machine Learning",
      url: "ayurpredict.ai/research",
      description: "Developed a machine learning platform using Python, Flask, Scikit-Learn, and XGBoost to predict herb-target bioactivity and symptom-based remedies. Engineered a trustworthy ML pipeline analyzing 8,000+ interactions across 20+ Ayurvedic herbs, optimizing for prediction stability rather than just raw accuracy. Achieved ~87% cross-validated accuracy and a precision score of 0.5699 using an optimized Random Forest model. Built and integrated a responsive web interface (HTML/Bootstrap 5) with RESTful APIs to deliver real-time, biologically plausible recommendations for users and clinical researchers.",
      tech: ["Python", "Flask", "Scikit-Learn", "XGBoost", "Random Forest", "RESTful API", "Bootstrap 5"],
      images: [
        "/images/projects/ayurpredict-1-path.webp",
        "/images/projects/ayurpredict-2-recommendations.webp",
        "/images/projects/ayurpredict-3-molecular.webp",
        "/images/projects/ayurpredict-4-safety.webp"
      ],
      liveUrl: "#",
      githubUrl: "https://github.com/Unnati1007"
    }
  ];

  return (
    <section className="py-6 px-4 sm:px-6 max-w-5xl mx-auto" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <span className="text-blue-600 font-mono text-[11px] sm:text-xs md:text-sm tracking-widest uppercase block mb-1 font-bold">
            // 04. Selected Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 inline-block relative">
            Projects
            <span className="absolute -bottom-1.5 left-0 w-10 sm:w-12 h-0.5 bg-blue-500 rounded-full"></span>
          </h2>
        </div>

        {/* Alternating Showcase Blocks (Zig-Zag Layout - Compact) */}
        <div className="space-y-6 md:space-y-8">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg p-4 sm:p-5 lg:p-6 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
                  
                  {/* Image Column (Alternates side on Desktop) */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <BrowserMockupCarousel
                      images={project.images}
                      url={project.url}
                      title={project.title}
                    />
                  </div>

                  {/* Text & Details Column */}
                  <div className={`lg:col-span-6 flex flex-col items-start ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    
                    {/* Project Domain Tag */}
                    <span className="text-blue-600 font-mono text-[11px] font-bold uppercase tracking-wider mb-0.5 block">
                      {project.tag}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                      {project.title}
                    </h3>

                    {/* Tagline */}
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-700 font-mono mb-1.5">
                      {project.tagline}
                    </p>

                    {/* Description Paragraph - Compact & concise */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3 md:line-clamp-2 hover:line-clamp-none transition-all">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills (Supports grouped categories or flat list) */}
                    {project.techGroups ? (
                      <div className="space-y-1 mb-3.5 w-full">
                        {project.techGroups.map((group, gIdx) => (
                          <div key={gIdx} className="flex flex-wrap items-center gap-1">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold shrink-0">
                              {group.label}:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {group.items.map((item, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : project.tech ? (
                      <div className="flex flex-wrap gap-1 mb-3.5">
                        {project.tech.map((item, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* Action Buttons: Solid + Outline / Private Badge */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm hover:shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[42px]"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>View Project</span>
                        </a>
                      )}

                      {project.isPrivateRepo ? (
                        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold select-none cursor-default shadow-xs min-h-[42px]">
                          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Private Repository</span>
                        </div>
                      ) : project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-[11px] uppercase tracking-wider border border-slate-300 hover:border-blue-400 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[42px]"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          <span>View Code</span>
                        </a>
                      ) : null}
                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* More Projects & Explorations 2-Column Mini-Grid - Compact */}
        <div className="mt-10 md:mt-12 pt-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-blue-600 font-mono text-xs font-bold uppercase tracking-wider shrink-0">
              // More Projects & Explorations
            </span>
            <div className="h-[1px] flex-grow bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Card 1: Python Projects Journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border-2 border-dashed border-blue-200 hover:border-blue-400 shadow-xs hover:shadow-md p-4 sm:p-5 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* Python Logo Badge */}
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 shadow-xs flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-full h-full" viewBox="0 0 128 128" fill="none">
                      <path d="M63.086 0c-17.05 0-26.666 4.965-29.355 14.897-.042.155-.07.31-.085.465l-.014.283v12.355h29.84v4.118H20.404c-12.784 0-20.404 8.784-20.404 22.016 0 11.233 6.945 19.537 17.574 21.05v-12.92c0-8.232 7.02-14.936 15.637-14.936h29.84V33.682h14.07V14.897C77.12 4.965 67.505 0 63.086 0zM47.785 7.423a3.71 3.71 0 11.002 7.42 3.71 3.71 0 01-.002-7.42z" fill="#387eb8" />
                      <path d="M64.914 128c17.05 0 26.666-4.965 29.355-14.897.042-.155.07-.31.085-.465l.014-.283v-12.355H64.528v-4.118h43.068c12.784 0 20.404-8.784 20.404-22.016 0-11.233-6.945-19.537-17.574-21.05v12.92c0 8.232-7.02 14.936-15.637 14.936H44.95v13.646H30.88v18.785c0 9.932 9.615 14.897 14.034 14.897zM80.215 120.577a3.71 3.71 0 11-.002-7.42 3.71 3.71 0 01.002 7.42z" fill="#ffd43b" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100/80 text-blue-800 border border-blue-200">
                    Python
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1.5 group-hover:text-blue-600 transition-colors">
                  Python Projects Journey
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  A collection of Python projects built while learning and practicing core programming concepts, data structures, and problem-solving — reflecting continuous hands-on growth beyond coursework.
                </p>
              </div>

              <a
                href="https://github.com/Unnati1007/python_projects"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white font-bold text-[11px] uppercase tracking-wider border border-slate-300 hover:border-slate-900 shadow-xs hover:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Explore on GitHub</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </motion.div>

            {/* Card 2: Product Review Analyzer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-2 border-dashed border-blue-200 hover:border-blue-400 shadow-xs hover:shadow-md p-4 sm:p-5 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* NLP / Analytics Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 shadow-xs flex items-center justify-center shrink-0 p-2 text-blue-600 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100/80 text-blue-800 border border-blue-200">
                      Python
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100/80 text-indigo-800 border border-indigo-200">
                      NLP
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1.5 group-hover:text-blue-600 transition-colors">
                  Product Review Analyzer
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  A tool that analyzes product reviews to extract sentiment and key insights, helping surface patterns in customer feedback using natural language processing techniques.
                </p>
              </div>

              <a
                href="https://github.com/Unnati1007/Product-Review-Analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-900 text-slate-800 hover:text-white font-bold text-[11px] uppercase tracking-wider border border-slate-300 hover:border-slate-900 shadow-xs hover:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Explore on GitHub</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default React.memo(Projects);
