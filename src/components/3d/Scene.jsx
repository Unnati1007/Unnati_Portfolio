import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Ferrari from './Ferrari'
import TechRoom from './TechRoom'

export default function Scene({ 
  onIntroComplete, 
  introComplete, 
  sector, 
  setSector,
  activeProject, 
  setActiveProject,
  isDarkMode,
  setIsDarkMode
}) {
  return (
    <div 
      className={`fixed inset-0 z-0 ${introComplete ? 'pointer-events-auto' : 'pointer-events-none'}`} 
      style={{ backgroundColor: '#000000' }}
    >
      <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
        {/* Dynamic background color transition (black for car intro, dark slate for night mode, light slate-blue for day mode) */}
        <color attach="background" args={[introComplete ? (isDarkMode ? '#050508' : '#f1f5f9') : '#000000']} />
        
        {/* Studio Lighting - Dimmed for car, and dynamic for day vs cozy night mode */}
        {!introComplete ? (
          <>
            <directionalLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-5, 3, 5]} intensity={0.8} color="#ffffff" />
            <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
          </>
        ) : (
          <>
            <ambientLight intensity={isDarkMode ? 0.15 : 0.65} color="#f8fafc" />
            {/* Sunlight/Moonlight coming through the window */}
            <directionalLight 
              position={[0, 4, -4]} 
              intensity={isDarkMode ? 0.15 : 1.25} 
              color={isDarkMode ? '#a5f3fc' : '#fffbee'} 
            />
            {/* Front fill light */}
            <directionalLight position={[0, 3, 4]} intensity={isDarkMode ? 0.05 : 0.35} color="#ffffff" />
          </>
        )}

        {/* The Animated Car or the Tech Desk Room */}
        {!introComplete ? (
          <Ferrari onIntroComplete={onIntroComplete} scale={1.2} />
        ) : (
          <TechRoom 
            sector={sector} 
            setSector={setSector}
            activeProject={activeProject} 
            setActiveProject={setActiveProject} 
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
        
        {/* Environment map for realistic body reflections, dynamically adjusted for day/night mode */}
        <Environment preset="city" environmentIntensity={introComplete ? (isDarkMode ? 0.1 : 0.55) : 0.08} />

        {/* Cinematic Post-Processing: Bloom makes the headlights and screens actually GLOW */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.85} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
