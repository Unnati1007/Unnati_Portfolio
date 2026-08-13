import React, { useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Ferrari from './Ferrari'
import TechRoom from './TechRoom'

function ResponsiveCamera({ isDarkMode, introComplete }) {
  const { camera, size, scene } = useThree()
  
  useEffect(() => {
    const colorStr = introComplete ? (isDarkMode ? '#050508' : '#faf8f5') : '#000000'
    scene.background = new THREE.Color(colorStr)
  }, [isDarkMode, introComplete, scene])
  
  useEffect(() => {
    const aspect = size.width / size.height
    if (aspect < 1.0) {
      // Portrait / Mobile
      camera.fov = 72
      camera.position.set(0, 2.3, 10.5)
    } else if (aspect < 1.4) {
      // Tablet / Narrow desktop
      camera.fov = 55
      camera.position.set(0, 2.1, 9.5)
    } else {
      // Desktop
      camera.fov = 45
      camera.position.set(0, 2, 9)
    }
    camera.updateProjectionMatrix()
  }, [size.width, size.height, camera])

  return null
}

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
        <ResponsiveCamera isDarkMode={isDarkMode} introComplete={introComplete} />
        
        {/* Studio Lighting - Dimmed for car, and dynamic for day vs cozy night mode */}
        {!introComplete ? (
          <>
            <directionalLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-5, 3, 5]} intensity={0.8} color="#ffffff" />
            <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
          </>
        ) : (
          <>
            <ambientLight intensity={isDarkMode ? 0.15 : 0.55} color="#f8fafc" />
            {/* Sunlight/Moonlight coming through the window */}
            <directionalLight 
              position={[0, 4, -4]} 
              intensity={isDarkMode ? 0.20 : 0.85} 
              color={isDarkMode ? '#e0f2fe' : '#fffbee'} 
            />
            {/* Front fill light */}
            <directionalLight position={[0, 3, 4]} intensity={isDarkMode ? 0.05 : 0.25} color="#ffffff" />
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
          <Bloom 
            luminanceThreshold={isDarkMode ? 0.85 : 0.98} 
            mipmapBlur 
            intensity={isDarkMode ? 1.5 : 0.2} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
