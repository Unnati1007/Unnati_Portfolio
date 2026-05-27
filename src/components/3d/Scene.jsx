import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Ferrari from './Ferrari'

export default function Scene({ onIntroComplete }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: '#000000' }}>
      <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
        {/* Pure Black Background */}
        <color attach="background" args={['#000000']} />
        
        {/* Studio Lighting - Directional so there are no visible light orbs */}
        <directionalLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, 3, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />

        {/* The Animated Car */}
        <Ferrari onIntroComplete={onIntroComplete} scale={1.2} />
        
        {/* Environment map for realistic body reflections, dimmed heavily for true black scene */}
        <Environment preset="city" environmentIntensity={0.08} />

        {/* Cinematic Post-Processing: Bloom makes the headlights actually GLOW */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.8} mipmapBlur intensity={2.0} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
