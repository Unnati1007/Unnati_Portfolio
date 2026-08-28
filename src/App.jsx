import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene from './components/3d/Scene'
import About from './components/sections/About'
import Education from './components/sections/Education'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Profiles from './components/sections/Profiles'
import Resume from './components/sections/Resume'
import Certificates from './components/sections/Certificates'
import Contact from './components/sections/Contact'
import ScrollCar from './components/3d/ScrollCar'
import './index.css'

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [sector, setSector] = useState('center') // 'center', 'left', 'right'
  const [activeProject, setActiveProject] = useState(0) // 0: Torus Knot, 1: Ferrari, 2: Space Planet
  const [isDarkMode, setIsDarkMode] = useState(false) // Default to professional light day mode

  // Force scroll to top on mount to ensure intro animation is visible on reload
  useEffect(() => {
    window.scrollTo(0, 0)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  // Lock scrolling while the intro animation is playing
  useEffect(() => {
    if (!introComplete) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    // Cleanup to ensure scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [introComplete])

  // We will rely on the left/right buttons to change sectors in the 3D scene.

  return (
    <div 
      className="relative w-full bg-[#03050a] text-white font-sans overflow-x-clip selection:bg-indigo-500/30 selection:text-indigo-200"
      onDoubleClick={() => {
        if (!introComplete) {
          setIntroComplete(true)
        }
      }}
    >
      {/* 3D Canvas Scene - Sticky Hero */}
      <div className="relative w-full h-screen sticky top-0 z-0 border-b border-white/5 shadow-2xl">
        <Scene 
          onIntroComplete={() => setIntroComplete(true)} 
          introComplete={introComplete}
          sector={sector}
          setSector={setSector}
          activeProject={activeProject}
          setActiveProject={setActiveProject}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Skip Hint */}
        {!introComplete && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none font-mono text-xs md:text-sm tracking-widest font-black text-indigo-200/80 uppercase text-center animate-pulse">
            Double-click anywhere to skip intro
          </div>
        )}

        {/* Cyber HUD Overlay */}
        <AnimatePresence>
          {introComplete && (
            <>

              {/* Left Navigation (Development Journey) */}
              {sector === 'center' && (
                <motion.button
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  onClick={() => setSector('left')}
                  className={`absolute left-3 md:left-8 top-[35%] -translate-y-1/2 z-10 flex flex-col items-center gap-2 md:gap-3 transition-all duration-300 cursor-pointer group px-2 py-4 md:px-4 md:py-8 rounded-xl md:rounded-2xl pointer-events-auto bg-white text-slate-900 hover:text-indigo-600 border border-slate-200 shadow-xl`}
                >
                  <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 mb-1 md:mb-2 font-extrabold">DEVELOPMENT JOURNEY</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              )}
  
              {/* Right Navigation (DSA Journey) */}
              {sector === 'center' && (
                <motion.button
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  onClick={() => setSector('right')}
                  className={`absolute right-3 md:right-8 top-[35%] -translate-y-1/2 z-10 flex flex-col items-center gap-2 md:gap-3 transition-all duration-300 cursor-pointer group px-2 py-4 md:px-4 md:py-8 rounded-xl md:rounded-2xl pointer-events-auto bg-white text-slate-900 hover:text-indigo-600 border border-slate-200 shadow-xl`}
                >
                  <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase [writing-mode:vertical-lr] mb-1 md:mb-2 font-extrabold">DSA JOURNEY</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )}
  
              {/* Return Back Button */}
              {sector !== 'center' && (
                <motion.button
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  onClick={() => setSector('center')}
                  className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 backdrop-blur-md transition-all duration-300 cursor-pointer pointer-events-auto font-sans text-[9px] tracking-wider uppercase font-extrabold px-4 py-2 rounded-full ${
                    isDarkMode 
                      ? 'bg-[rgba(8,10,16,0.85)] text-indigo-200 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-indigo-400 shadow-[0_8px_30px_rgba(0,0,0,0.2)]' 
                      : 'bg-white/85 text-slate-800 hover:text-indigo-600 border border-slate-200/60 hover:border-indigo-300 shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  RETURN TO DESK
                </motion.button>
              )}
              
              {/* Scroll Down Indicator */}
              {sector === 'center' && (
                 <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-3 text-slate-950 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
                 >
                    <span className="text-sm font-bold font-quicksand uppercase tracking-[0.25em] text-slate-800">SCROLL TO EXPLORE</span>
                   <svg className="w-9 h-9 animate-bounce text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                 </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Sections - Rendered below Hero */}
      <div id="portfolio-sections-wrapper" className="relative z-10 bg-[#faf8f5] text-slate-800 light-mode-portfolio pt-10">
        <div className="max-w-6xl mx-auto relative px-4">
          <div id="car-active-wrapper" className="relative">
            {/* Sticky Side Column for Ferrari - tightly aligned to the left of section headers */}
            <div className="absolute left-[-30px] xl:left-[-60px] top-0 bottom-0 w-[80px] xl:w-[110px] pointer-events-none hidden lg:block z-30">
              <div className="sticky top-[10%] h-[80vh] w-full">
                <ScrollCar isDarkMode={isDarkMode} />
              </div>
            </div>
            <div id="scroll-about"><About /></div>
            <div id="scroll-education"><Education /></div>
            <div id="scroll-experience"><Experience /></div>
            <div id="scroll-profiles"><Profiles /></div>
            <div id="scroll-projects"><Projects /></div>
            <div id="scroll-certificates"><Certificates /></div>
            <div id="scroll-resume"><Resume /></div>
            <div id="scroll-contact"><Contact /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
