import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function CarModel({ isDarkMode, scrollProgress }) {
  const { nodes, materials } = useGLTF('/models/ferrari.glb')
  const carRef = useRef()
  const wheelRR = useRef()
  const wheelRL = useRef()
  const wheelFL = useRef()
  const wheelFR = useRef()

  const lastScrollProgress = useRef(0)

  // Configure materials once
  useMemo(() => {
    if (materials) {
      // Windshield glass semi-transparent black
      if (materials.Glass_Gray) {
        materials.Glass_Gray.color = new THREE.Color("#000000")
        materials.Glass_Gray.transparent = true
        materials.Glass_Gray.opacity = 0.6
        materials.Glass_Gray.roughness = 0.05
      }
      // Glowing lights for headlights
      if (materials.Projector_Glass) {
        materials.Projector_Glass.emissive = new THREE.Color("#ffffff")
        materials.Projector_Glass.emissiveIntensity = isDarkMode ? 8 : 1
      }
      if (materials.Taillight_Glass) {
        materials.Taillight_Glass.emissive = new THREE.Color("#ff0000")
        materials.Taillight_Glass.emissiveIntensity = isDarkMode ? 6 : 1
      }
      // Body color glossy black
      if (materials.Body_Color) {
        materials.Body_Color.color = new THREE.Color("#111111")
        materials.Body_Color.roughness = 0.1
        materials.Body_Color.metalness = 0.9
      }
    }
  }, [materials, isDarkMode])

  // Snap function: stays at steps, zooms in transition areas
  const getSnappedProgress = (p) => {
    // 7 sections (About, Education, Experience, Profiles, Projects, Certificates, Resume) = 6 steps
    const steps = 6
    const x = p * steps
    const i = Math.floor(x)
    const f = x - i

    let t
    if (f < 0.38) {
      // Stay stopped at current section
      t = 0
    } else if (f > 0.62) {
      // Stay stopped at next section
      t = 1
    } else {
      // Move quickly in between the sections
      const normalized = (f - 0.38) / 0.24
      // Smoothstep curve for speed burst feeling
      t = normalized * normalized * (3 - 2 * normalized)
    }

    return (i + t) / steps
  }

  useFrame(() => {
    if (!carRef.current) return

    const snapped = getSnappedProgress(scrollProgress)
    // Z = -1.8 (top section) to Z = 1.8 (bottom section)
    const targetZ = -1.8 + snapped * 3.6
    
    // Smoothly interpolate Z position (increased lerp factor to 0.16 for faster transition)
    carRef.current.position.z = THREE.MathUtils.lerp(carRef.current.position.z, targetZ, 0.16)

    // Calculate movement delta to rotate wheels
    const delta = carRef.current.position.z - lastScrollProgress.current
    lastScrollProgress.current = carRef.current.position.z

    // Roll wheels based on vertical movement
    const rollAngle = delta * 12
    if (wheelRR.current) wheelRR.current.rotation.x += rollAngle
    if (wheelRL.current) wheelRL.current.rotation.x += rollAngle
    if (wheelFR.current) wheelFR.current.rotation.x += rollAngle
    if (wheelFL.current) wheelFL.current.rotation.x += rollAngle

    // 1. Reset front wheel steering angles to face straight forward
    if (wheelFR.current) wheelFR.current.rotation.y = 0
    if (wheelFL.current) wheelFL.current.rotation.y = 0

    // 2. Keep the chassis facing straight down (PI) with no roll tilt
    carRef.current.rotation.y = Math.PI
    carRef.current.rotation.z = 0

    // 3. Subtle hover wiggling effect
    carRef.current.position.x = Math.sin(Date.now() * 0.003) * 0.015
  })

  // Wheel positions based on chassis scaling
  const pRL_X = -0.821 * 1.1
  const pFL_X = -0.843 * 1.1
  const pRR_X = 0.824 * 1.1
  const pFR_X = 0.829 * 1.1
  
  const pRL_Z = 1.495 * 1.15
  const pFL_Z = -1.155 * 1.15
  const pRR_Z = 1.496 * 1.15
  const pFR_Z = -1.154 * 1.15

  return (
    <group 
      ref={carRef} 
      scale={0.42} // Increased size significantly
      position={[0, 0, -1.8]} 
      rotation={[0, Math.PI, 0]} // Face downwards (towards +Z)
    >
      <group position={[0, 0.676, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={[1.15, 1.1, 1]}>
        <mesh geometry={nodes.trim.geometry} material={materials.Leather_red} material-color="#111" position={[-0.379, -0.004, -0.016]} />
        <mesh geometry={nodes.lights_red.geometry} material={materials.Taillight_Glass} position={[0.913, -0.004, -0.006]} />
        <mesh geometry={nodes.plastic_gray.geometry} material={materials.plastic_gray} position={[0.108, -0.001, -0.029]} />
        <mesh geometry={nodes.metal.geometry} material={materials.metal_gray} position={[0.218, -0.005, -0.002]} />
        <mesh geometry={nodes.lights.geometry} material={materials.Projector_Glass} position={[-1.845, -0.002, -0.067]} />
        <mesh geometry={nodes.leds.geometry} material={materials.Turn_Signal_LED} position={[-1.265, -0.001, 0.022]} />
        <mesh geometry={nodes.leather.geometry} material={materials.Leather} position={[-0.348, -0.002, -0.031]} />
        <mesh geometry={nodes.interior_light.geometry} material={materials.Interior_dark} position={[0.005, -0.004, -0.004]} />
        <mesh geometry={nodes.grills.geometry} material={materials.Tires} position={[0.048, -0.007, -0.033]} />
        <mesh geometry={nodes.glass.geometry} material={materials.Glass_Gray} position={[0.001, -0.002, 0.194]} />
        <mesh geometry={nodes.chrome.geometry} material={materials.metal_chrome} position={[0.033, 0, 0.007]} />
        <mesh geometry={nodes.carpet.geometry} material={materials.Carpet} position={[-0.281, -0.004, -0.235]} />
        <mesh geometry={nodes.carbon_fibre_trim.geometry} material={materials.Carbon_Fiber} position={[-0.177, -0.002, -0.04]} />
        <mesh geometry={nodes.carbon_fibre.geometry} material={materials.Carbon_Fiber} position={[-0.438, -0.346, 0.118]} />
        <mesh geometry={nodes.brakes.geometry} material={materials.Taillight_Glass} position={[1.989, -0.004, 0.2]} />
        <mesh geometry={nodes.interior_dark.geometry} material={materials.Interior_light} position={[0.003, 0, 0.011]} />
        <mesh geometry={nodes.body.geometry} material={materials.Body_Color} position={[-0.005, 0, 0.022]} />
        <mesh geometry={nodes.blue.geometry} material={materials._0098_DodgerBlue} position={[-0.35, -0.435, 0.068]} />
        <mesh geometry={nodes.wipers.geometry} material={materials.Tires} position={[-1.089, 0.006, 0.11]} />
        <mesh geometry={nodes.yellow_trim.geometry} material={materials.Ferrari_Yellow} material-color="#ff0000" position={[-1.397, -0.003, 0.047]} />
      </group>

      {/* Wheels */}
      <group ref={wheelRR} position={[pRR_X, 0.358, pRR_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.wheel.geometry} material-color="#111" />
        <mesh geometry={nodes.tire.geometry} material={materials.Tires} />
        <mesh geometry={nodes.rim_rr.geometry} material-color="#222" />
      </group>
      <group ref={wheelRL} position={[pRL_X, 0.358, pRL_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.wheel_1.geometry} material-color="#111" />
        <mesh geometry={nodes.tire_1.geometry} material={materials.Tires} />
        <mesh geometry={nodes.rim_rl.geometry} material-color="#222" />
      </group>
      <group ref={wheelFL} position={[pFL_X, 0.358, pFL_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.wheel_2.geometry} material-color="#111" />
        <mesh geometry={nodes.tire_2.geometry} material={materials.Tires} />
        <mesh geometry={nodes.rim_fl.geometry} material-color="#222" />
      </group>
      <group ref={wheelFR} position={[pFR_X, 0.361, pFR_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.wheel_3.geometry} material-color="#111" />
        <mesh geometry={nodes.tire_3.geometry} material={materials.Tires} />
        <mesh geometry={nodes.rim_fr.geometry} material-color="#222" />
      </group>
    </group>
  )
}

function ScrollCar({ isDarkMode }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const scrollTimeoutRef = useRef(null)
  const offsetsRef = useRef({ startOffset: 0, endOffset: 0, totalRange: 0 })

  // Compute section offsets only on resize or mount to avoid layout thrashing during scroll
  const measureOffsets = () => {
    const startEl = document.getElementById('scroll-about')
    const endEl = document.getElementById('scroll-resume') || document.getElementById('scroll-contact')
    if (!startEl || !endEl) return

    const getAbsoluteTop = (el) => el.getBoundingClientRect().top + window.scrollY
    const startOffset = getAbsoluteTop(startEl) - window.innerHeight * 0.85
    const endOffset = getAbsoluteTop(endEl) + endEl.offsetHeight - window.innerHeight * 0.55
    const totalRange = Math.max(1, endOffset - startOffset)

    offsetsRef.current = { startOffset, endOffset, totalRange }
  }

  useEffect(() => {
    measureOffsets()

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { startOffset, totalRange } = offsetsRef.current
          const currentScroll = window.scrollY

          const visible = currentScroll >= startOffset && currentScroll <= offsetsRef.current.endOffset + 300
          setIsVisible(visible)

          if (visible && totalRange > 0) {
            const rawProgress = Math.max(0, Math.min(1, (currentScroll - startOffset) / totalRange))
            
            if (scrollTimeoutRef.current) {
              clearTimeout(scrollTimeoutRef.current)
            }

            setScrollProgress(rawProgress)

            scrollTimeoutRef.current = setTimeout(() => {
              const steps = 6
              const snapped = Math.round(rawProgress * steps) / steps
              setScrollProgress(snapped)
            }, 120)
          }
          ticking = false
        })
        ticking = true
      }
    }

    const handleResize = () => {
      measureOffsets()
      handleScroll()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    const timeout = setTimeout(handleResize, 300)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeout)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className={`w-full h-full transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'high-performance', antialias: false }}
        orthographic
        camera={{
          zoom: 55, // Clean aspect-ratio preserving zoom
          near: 0.1,
          far: 20,
          position: [0, 8, 0] // Top-down view
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={isDarkMode ? 0.3 : 1.2} />
        <directionalLight position={[0, 10, 0]} intensity={isDarkMode ? 0.4 : 1.5} />
        {isDarkMode && <pointLight position={[0, 4, 0]} intensity={2} color="#00d8ff" />}
        <CarModel isDarkMode={isDarkMode} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}

export default React.memo(ScrollCar)
