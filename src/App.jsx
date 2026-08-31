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
import NavigationMenu from './components/ui/NavigationMenu'
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

  // Auto-return to center desk after 30 seconds of inactivity in left/right journey sectors
  useEffect(() => {
    if (sector === 'center') return

    let timer = setTimeout(() => {
      setSector('center')
    }, 30000)

    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setSector('center')
      }, 30000)
    }

    // Reset inactivity timer on any user interaction
    window.addEventListener('click', resetTimer, { passive: true })
    window.addEventListener('mousemove', resetTimer, { passive: true })
    window.addEventListener('keydown', resetTimer, { passive: true })
    window.addEventListener('touchstart', resetTimer, { passive: true })
    window.addEventListener('scroll', resetTimer, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', resetTimer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      window.removeEventListener('touchstart', resetTimer)
      window.removeEventListener('scroll', resetTimer)
    }
  }, [sector])

  return (
    <div 
      className="relative w-full bg-[#03050a] text-white font-sans overflow-x-clip selection:bg-blue-500/30 selection:text-blue-200"
      onDoubleClick={() => {
        if (!introComplete) {
          setIntroComplete(true)
        }
      }}
    >
      {/* Persistent Site-Wide Tactile Navigation Menu (Appears only after intro loader finishes) */}
      <AnimatePresence>
        {introComplete && (
          <NavigationMenu setSector={setSector} />
        )}
      </AnimatePresence>

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
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none font-mono text-xs md:text-sm tracking-widest font-black text-blue-200/80 uppercase text-center animate-pulse">
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
                  aria-label="Navigate to Development Journey"
                  className="absolute left-2 sm:left-3 md:left-8 top-[36%] md:top-[35%] -translate-y-1/2 z-10 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 transition-all duration-300 cursor-pointer group px-1.5 py-3 sm:px-2.5 sm:py-5 md:px-4 md:py-8 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-auto bg-white/95 text-slate-900 hover:text-blue-600 border border-slate-200 shadow-xl min-h-[44px]"
                >
                  <span className="font-sans text-[8px] sm:text-[10px] md:text-xs tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 mb-0.5 sm:mb-1 md:mb-2 font-extrabold">DEVELOPMENT JOURNEY</span>
                  <svg className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  aria-label="Navigate to DSA Journey"
                  className="absolute right-2 sm:right-3 md:right-8 top-[36%] md:top-[35%] -translate-y-1/2 z-10 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 transition-all duration-300 cursor-pointer group px-1.5 py-3 sm:px-2.5 sm:py-5 md:px-4 md:py-8 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-auto bg-white/95 text-slate-900 hover:text-blue-600 border border-slate-200 shadow-xl min-h-[44px]"
                >
                  <span className="font-sans text-[8px] sm:text-[10px] md:text-xs tracking-widest uppercase [writing-mode:vertical-lr] mb-0.5 sm:mb-1 md:mb-2 font-extrabold">DSA JOURNEY</span>
                  <svg className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className={`absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 backdrop-blur-md transition-all duration-300 cursor-pointer pointer-events-auto font-sans text-[9px] sm:text-[10px] tracking-wider uppercase font-extrabold px-4 py-2.5 rounded-full min-h-[44px] ${
                    isDarkMode 
                      ? 'bg-[rgba(8,10,16,0.85)] text-blue-200 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-blue-400 shadow-[0_8px_30px_rgba(0,0,0,0.2)]' 
                      : 'bg-white/90 text-slate-800 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-1.5 sm:gap-2.5 text-slate-950 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
                 >
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold font-quicksand uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-800">SCROLL TO EXPLORE</span>
                   <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 animate-bounce text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                 </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Sections - Rendered below Hero with Solid Opaque Background */}
      <div id="portfolio-sections-wrapper" className="relative z-20 bg-[#faf8f5] text-slate-800 light-mode-portfolio pt-4 pb-6">
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
          </div>
        </div>

        {/* Solid Opaque Footer Base to guarantee zero background bleed */}
        <footer className="relative z-20 w-full pt-4 pb-4 text-center bg-[#faf8f5] light-mode-portfolio select-none">
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-[1px] w-24 bg-slate-200/80 mx-auto rounded-full" />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
