import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene from './components/3d/Scene'
import './index.css'

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [sector, setSector] = useState('center') // 'center', 'left', 'right'
  const [activeProject, setActiveProject] = useState(0) // 0: Torus Knot, 1: Ferrari, 2: Space Planet
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to cozy dark night mode

  // Global mouse wheel/trackpad scroll listener to transition between room walls
  useEffect(() => {
    if (!introComplete) return

    let lastScrollTime = 0
    const handleWheel = (e) => {
      const now = Date.now()
      if (now - lastScrollTime < 900) return // Throttle scroll to ensure controlled screen transition

      const deltaY = e.deltaY
      const deltaX = e.deltaX

      if (Math.abs(deltaY) > 20 || Math.abs(deltaX) > 20) {
        if (deltaY > 20 || deltaX > 20) {
          // Scroll down or right -> slide screen to the right
          setSector((current) => {
            if (current === 'left') {
              lastScrollTime = now
              return 'center'
            }
            if (current === 'center') {
              lastScrollTime = now
              return 'right'
            }
            return current
          })
        } else {
          // Scroll up or left -> slide screen to the left
          setSector((current) => {
            if (current === 'right') {
              lastScrollTime = now
              return 'center'
            }
            if (current === 'center') {
              lastScrollTime = now
              return 'left'
            }
            return current
          })
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [introComplete])

  return (
    <div 
      className="relative w-full min-h-screen bg-black text-white font-sans overflow-hidden"
      onDoubleClick={() => {
        if (!introComplete) {
          setIntroComplete(true)
        }
      }}
    >
      {/* 3D Canvas Scene */}
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

      {/* Skip Hint (Only visible during intro) */}
      {!introComplete && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none font-mono text-[9px] tracking-widest text-indigo-300/40 uppercase text-center animate-pulse">
          Double-click anywhere to skip intro
        </div>
      )}

      {/* Cyber HUD Overlay (Fades in when intro completes) */}
      <AnimatePresence>
        {introComplete && (
          <>
            {/* Top Status Bar (Dynamic Glassmorphic Theme) */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-10 font-sans text-xs font-semibold tracking-wider transition-all duration-500 px-6 py-3.5 rounded-xl ${
                isDarkMode 
                  ? 'text-indigo-200 bg-[rgba(8,10,16,0.65)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.25)]' 
                  : 'text-slate-800 bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-indigo-400' : 'bg-emerald-500'}`}></span>
                <span>SYSTEM ACTIVE</span>
              </div>
              <div className="hidden sm:block">
                SECTOR: <span className={`font-extrabold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{sector.toUpperCase()}</span>
              </div>
              <div className={`font-mono ${isDarkMode ? 'text-indigo-300/60' : 'text-slate-500'}`}>
                UNNATI // PORTFOLIO
              </div>
            </motion.div>
 
            {/* Tech Crosshairs / Corners (Subdued Slate/Indigo Brackets) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 pointer-events-none z-5"
            >
              {/* Corner brackets */}
              <div className={`absolute top-6 left-6 w-6 h-6 border-t border-l transition-all duration-500 ${isDarkMode ? 'border-indigo-500/50' : 'border-slate-400'}`}></div>
              <div className={`absolute top-6 right-6 w-6 h-6 border-t border-r transition-all duration-500 ${isDarkMode ? 'border-indigo-500/50' : 'border-slate-400'}`}></div>
              <div className={`absolute bottom-6 left-6 w-6 h-6 border-b border-l transition-all duration-500 ${isDarkMode ? 'border-indigo-500/50' : 'border-slate-400'}`}></div>
              <div className={`absolute bottom-6 right-6 w-6 h-6 border-b border-r transition-all duration-500 ${isDarkMode ? 'border-indigo-500/50' : 'border-slate-400'}`}></div>
            </motion.div>
 
            {/* Left Navigation (About Sector) */}
            {sector === 'center' && (
              <motion.button
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                onClick={() => setSector('left')}
                className={`absolute left-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-3 backdrop-blur-md transition-all duration-300 cursor-pointer group px-4 py-8 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-[rgba(8,10,16,0.7)] text-indigo-200 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-indigo-400 shadow-[0_8px_30px_rgba(0,0,0,0.2)]' 
                    : 'bg-white/70 text-slate-800 hover:text-indigo-600 border border-slate-200/60 hover:border-indigo-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
                }`}
              >
                <span className="font-sans text-xs tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 mb-2 font-extrabold">ABOUT SECTOR</span>
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
 
            {/* Right Navigation (Projects Sector) */}
            {sector === 'center' && (
              <motion.button
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                onClick={() => setSector('right')}
                className={`absolute right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-3 backdrop-blur-md transition-all duration-300 cursor-pointer group px-4 py-8 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-[rgba(8,10,16,0.7)] text-indigo-200 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-indigo-400 shadow-[0_8px_30px_rgba(0,0,0,0.2)]' 
                    : 'bg-white/70 text-slate-800 hover:text-indigo-600 border border-slate-200/60 hover:border-indigo-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
                }`}
              >
                <span className="font-sans text-xs tracking-widest uppercase [writing-mode:vertical-lr] mb-2 font-extrabold">PROJECTS SECTOR</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}
 
            {/* Return Back Button (Center) */}
            {sector !== 'center' && (
              <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                onClick={() => setSector('center')}
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 backdrop-blur-md transition-all duration-300 cursor-pointer font-sans text-xs tracking-wider uppercase font-extrabold px-6 py-3.5 rounded-full ${
                  isDarkMode 
                    ? 'bg-[rgba(8,10,16,0.85)] text-indigo-200 hover:text-white border border-[rgba(255,255,255,0.08)] hover:border-indigo-400 shadow-[0_8px_30px_rgba(0,0,0,0.2)]' 
                    : 'bg-white/85 text-slate-800 hover:text-indigo-600 border border-slate-200/60 hover:border-indigo-300 shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
                }`}
              >
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                RETURN TO DESK
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
