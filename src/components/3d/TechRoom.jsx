import React, { useRef, useState, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

export default function TechRoom({ sector, setSector, activeProject, setActiveProject, isDarkMode, setIsDarkMode }) {
  // Load Ferrari GLTF for the wireframe car hologram AND the miniature toy Ferrari
  const { nodes, materials } = useGLTF('/models/ferrari.glb')

  const levitatingHeadphoneRef = useRef()
  const pcFansRef = useRef()
  const chairRef = useRef()
  const roomGroupRef = useRef()

  const [hoveredProject, setHoveredProject] = useState(null)

  // Eased vectors for smooth camera transition (adjusted for cozy desk view, hiding table legs)
  const easedLook = useMemo(() => new THREE.Vector3(0, 0.22, -0.4), [])
  const easedPos = useMemo(() => new THREE.Vector3(0, 0.28, 2.2), [])

  // Cozy Night Mode stars generator (aligned to window frame dimensions)
  const stars = useMemo(() => {
    const arr = []
    for (let i = 0; i < 25; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 2.1,
          0.65 + Math.random() * 1.1,
          -2.25
        ],
        size: 0.004 + Math.random() * 0.007
      })
    }
    return arr
  }, [])

  // Cloned body material for the miniature toy Ferrari to prevent shared material mutation bugs
  const toyBodyMaterial = useMemo(() => {
    if (!materials || !materials.Body_Color) return null
    const mat = materials.Body_Color.clone()
    mat.color = new THREE.Color("#0a0a0a") // Glossy deep black
    mat.roughness = 0.05
    mat.metalness = 0.9
    if (mat.clearcoat !== undefined) {
      mat.clearcoat = 1.0
      mat.clearcoatRoughness = 0.05
    }
    mat.envMapIntensity = 3.0
    return mat
  }, [materials])

  useFrame((state) => {
    // 1. Rotate PC fans and Levitating Headphone
    if (pcFansRef.current) {
      pcFansRef.current.children.forEach(fan => {
        fan.rotation.z += 0.05
      })
    }
    if (levitatingHeadphoneRef.current) {
      // Bob up and down (magnetic floating effect)
      levitatingHeadphoneRef.current.position.y = 0.22 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.015
      // Slow rotation
      levitatingHeadphoneRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }

    // 2. Smoothly rotate the chair based on mouse coordinate
    if (chairRef.current) {
      const targetRot = 0.4 + state.pointer.x * 0.4
      chairRef.current.rotation.y = THREE.MathUtils.lerp(chairRef.current.rotation.y, targetRot, 0.05)
    }

    // 3. Camera transition logic based on selected sector (adjusted for cozy desk view, reduced camera motion)
    const basePos = new THREE.Vector3()
    const baseLook = new THREE.Vector3()

    if (sector === 'left') {
      // Look at the Left Wall screen (About/Skills)
      basePos.set(-0.7, 0.25, 1.45)
      baseLook.set(-3.4, 0.4, 0.4)
    } else if (sector === 'right') {
      // Look at the Right Wall screen (Projects)
      basePos.set(0.7, 0.25, 1.45)
      baseLook.set(3.4, 0.4, 0.4)
    } else {
      // Center position looking at main desk and iMac monitor
      basePos.set(0, 0.28, 2.2)
      baseLook.set(0, 0.22, -0.4)
    }

    // Add mouse panning (parallax) - reduced for stability
    const mx = state.pointer.x
    const my = state.pointer.y

    basePos.x += mx * 0.12
    basePos.y += my * 0.06

    // Smooth easing
    easedPos.lerp(basePos, 0.04)
    easedLook.lerp(baseLook, 0.04)

    state.camera.position.copy(easedPos)
    state.camera.lookAt(easedLook)
  })

  useLayoutEffect(() => {
    // Initial state: room group is slid down
    gsap.set(roomGroupRef.current.position, { y: -3.0 })

    // Animate room group to slide up smoothly and lock into place
    gsap.to(roomGroupRef.current.position, {
      y: 0.0,
      duration: 1.6,
      ease: "power3.out",
      delay: 0.1
    })
  }, [])

  const handlePointerOver = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
  }

  const handleWallClick = (targetSector, e) => {
    e.stopPropagation()
    if (sector === 'center' && targetSector !== 'center') {
      setSector(targetSector)
      document.body.style.cursor = 'auto'
    } else if (sector !== 'center' && targetSector === 'center') {
      setSector('center')
      document.body.style.cursor = 'auto'
    }
  }

  const currentHoloType = hoveredProject !== null ? hoveredProject : activeProject

  return (
    <group ref={roomGroupRef}>
      {/* ========================================================================= */}
      {/* 1. ROOM STRUCTURE (LIGHT COZY STUDY ROOM WALLS, WINDOW, GARDEN BACKGROUND) */}
      {/* ========================================================================= */}

      {/* Back Wall Left Part (Slate-800 Dark Wall) */}
      <mesh position={[-2.55, 1.2, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[2.9, 5, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Back Wall Right Part */}
      <mesh position={[2.55, 1.2, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[2.9, 5, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Back Wall Bottom Part */}
      <mesh position={[0, -0.1, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[2.2, 1.4, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Back Wall Top Part */}
      <mesh position={[0, 2.5, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[2.2, 1.4, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Window Frame Borders (Clean White Wood) */}
      <group position={[0, 0, 0]}>
        {/* Top Border */}
        <mesh position={[0, 1.8, -1.77]}><boxGeometry args={[2.24, 0.04, 0.04]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>
        {/* Bottom Border (Windowsill - slightly wider) */}
        <mesh position={[0, 0.6, -1.77]}><boxGeometry args={[2.24, 0.04, 0.08]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>
        {/* Left Border */}
        <mesh position={[-1.1, 1.2, -1.77]}><boxGeometry args={[0.04, 1.24, 0.04]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>
        {/* Right Border */}
        <mesh position={[1.1, 1.2, -1.77]}><boxGeometry args={[0.04, 1.24, 0.04]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>

        {/* Middle Vertical Divider Grid Line */}
        <mesh position={[0, 1.2, -1.77]}><boxGeometry args={[0.02, 1.2, 0.02]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>
        {/* Middle Horizontal Divider Grid Line */}
        <mesh position={[0, 1.2, -1.77]}><boxGeometry args={[2.2, 0.02, 0.02]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>

        {/* Semi-Transparent Glass Pane with soft reflections */}
        <mesh position={[0, 1.2, -1.78]}>
          <planeGeometry args={[2.2, 1.2]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.12} roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Daylight/Night Sky Background Plane */}
      <mesh position={[0, 1.2, -2.3]}>
        <planeGeometry args={[6.0, 3.5]} />
        <meshBasicMaterial color={isDarkMode ? "#05070f" : "#dbeafe"} />
      </mesh>

      {/* Night Sky Elements (Stars & Crescent Moon) */}
      {isDarkMode && (
        <>
          {/* Glowing Stars */}
          {stars.map((star, idx) => (
            <mesh key={idx} position={star.position}>
              <sphereGeometry args={[star.size, 4, 4]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          ))}
          {/* Glowing Crescent Moon */}
          <group position={[0.7, 1.45, -2.27]} scale={0.7}>
            {/* Outer yellow circle */}
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            {/* Dark mask offset to shape the crescent moon */}
            <mesh position={[0.05, 0.03, 0.005]}>
              <sphereGeometry args={[0.115, 16, 16]} />
              <meshBasicMaterial color="#05070f" />
            </mesh>
          </group>
        </>
      )}

      {/* Outdoor Foliage (Green Leafy Meshes Outside Window) */}
      <group position={[0, 0, -2.2]}>
        <mesh position={[-1.6, 0.9, 0]}><sphereGeometry args={[0.7, 8, 8]} /><meshStandardMaterial color={isDarkMode ? "#143a25" : "#84cc16"} roughness={0.9} /></mesh>
        <mesh position={[-1.2, 0.7, 0]}><sphereGeometry args={[0.5, 8, 8]} /><meshStandardMaterial color={isDarkMode ? "#0f2f1d" : "#a3e635"} roughness={0.9} /></mesh>
        <mesh position={[1.5, 0.8, 0]}><sphereGeometry args={[0.65, 8, 8]} /><meshStandardMaterial color={isDarkMode ? "#0c2416" : "#65a30d"} roughness={0.9} /></mesh>
        {/* Railing/Balcony bar */}
        <mesh position={[0, 0.7, 0.05]}><boxGeometry args={[4.0, 0.02, 0.02]} /><meshStandardMaterial color={isDarkMode ? "#334155" : "#ffffff"} roughness={0.4} /></mesh>
      </group>

      {/* Left Wall (Slate-800 Dark Wall) */}
      <mesh
        position={[-3.5, 1.2, 1.0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => handleWallClick('left', e)}
        onPointerOver={(sector === 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[6, 5, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Right Wall (Slate-800 Dark Wall) */}
      <mesh
        position={[3.5, 1.2, 1.0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => handleWallClick('right', e)}
        onPointerOver={(sector === 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[6, 5, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Floor (Light Oak Wood Floor) */}
      <mesh position={[0, -0.83, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#c29b74" roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Ceiling (Slate-900 Dark Ceiling) */}
      <mesh
        position={[0, 3.2, 1.0]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => handleWallClick('center', e)}
      >
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. THE WOODEN DESK */}
      {/* ========================================================================= */}

      <group
        position={[0, 0, 0]}
        onClick={(e) => handleWallClick('center', e)}
        onPointerOver={(sector !== 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        {/* Desk Tabletop (Oak Wood Finish - raised to y = -0.2 and pushed back to z = -0.2) */}
        <mesh position={[0, -0.2, -0.2]}>
          <boxGeometry args={[3.4, 0.05, 1.2]} />
          <meshStandardMaterial color={isDarkMode ? "#785335" : "#c89d7c"} roughness={0.7} metalness={0.05} />
        </mesh>

        {/* Desk Legs (Dark Slate Metal - aligned perfectly from floor to tabletop bottom) */}
        <mesh position={[-1.6, -0.5275, 0.3]}><boxGeometry args={[0.04, 0.605, 0.04]} /><meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[1.6, -0.5275, 0.3]}><boxGeometry args={[0.04, 0.605, 0.04]} /><meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[-1.6, -0.5275, -0.7]}><boxGeometry args={[0.04, 0.605, 0.04]} /><meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[1.6, -0.5275, -0.7]}><boxGeometry args={[0.04, 0.605, 0.04]} /><meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} /></mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. ULTRAWIDE MONITOR & DESK RISER */}
      {/* ========================================================================= */}

      <group
        position={[0, 0.45, -0.6]}
        scale={0.85}
        onClick={(e) => handleWallClick('center', e)}
        onPointerOver={(sector !== 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        {/* Wooden Monitor Riser (Sitting flush on the desk to prevent floating) */}
        <mesh position={[0, -0.735, -0.05]}>
          <boxGeometry args={[3.2, 0.03, 0.4]} />
          <meshStandardMaterial color={isDarkMode ? "#785335" : "#c89d7c"} roughness={0.7} metalness={0.05} />
        </mesh>
        {/* Riser Legs */}
        <mesh position={[-1.4, -0.765, -0.05]}>
          <boxGeometry args={[0.04, 0.04, 0.35]} />
          <meshStandardMaterial color="#0c0a09" roughness={0.8} />
        </mesh>
        <mesh position={[1.4, -0.765, -0.05]}>
          <boxGeometry args={[0.04, 0.04, 0.35]} />
          <meshStandardMaterial color="#0c0a09" roughness={0.8} />
        </mesh>

        {/* Monitor Stand Column (Slightly taller as requested) */}
        <mesh position={[0, -0.51, -0.05]}>
          <cylinderGeometry args={[0.025, 0.025, 0.45]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Ultrawide Curved Back Plate (Raised slightly) */}
        <mesh position={[0, -0.2, 0.0]}>
          <boxGeometry args={[2.1, 0.72, 0.04]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Screen Bezel (Black Glass) */}
        <mesh position={[0, -0.18, 0.022]}>
          <boxGeometry args={[2.06, 0.68, 0.005]} />
          <meshStandardMaterial color="#020305" roughness={0.08} metalness={0.9} />
        </mesh>

        {/* Minimal Bottom Chin */}
        <mesh position={[0, -0.54, 0.022]}>
          <boxGeometry args={[2.06, 0.04, 0.006]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Center Screen HTML Landing Page Content (Raised slightly) */}
        <Html
          transform
          distanceFactor={0.58}
          position={[0, -0.17, 0.026]}
          pointerEvents={sector === 'center' ? 'auto' : 'none'}
          style={{
            width: '1440px',
            height: '470px',
            background: '#ffffff',
            color: '#1e293b',
            fontFamily: '"Outfit", "Inter", sans-serif',
            boxSizing: 'border-box',
            borderRadius: '8px',
            opacity: sector === 'center' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease',
            overflow: 'hidden',
            userSelect: 'none'
          }}
        >
          <div className="flex flex-col h-full w-full bg-white select-none">
            {/* Top Purple/Indigo Section */}
            <div className="relative bg-gradient-to-br from-[#7c3aed] via-[#6366f1] to-[#4f46e5] w-full h-[62%] px-8 py-6 text-white flex flex-row items-center justify-between overflow-hidden">
              {/* Background light blobs */}
              <div className="absolute top-[-30px] left-[-30px] w-[140px] h-[140px] bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-[-40px] right-[30px] w-[160px] h-[160px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-pulse"></div>

              {/* Left Column info */}
              <div className="flex flex-col z-10 max-w-[50%]">
                {/* Logo & Name */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-[#6366f1] font-black text-sm">P</span>
                  </div>
                  <span className="text-white font-extrabold text-sm tracking-tight">Slice Library</span>
                </div>
                {/* Main Headline */}
                <h1 className="text-white text-xl font-extrabold leading-tight mb-2 tracking-tight">
                  Build components & website sections in minutes.
                </h1>
                {/* Small Subtitle */}
                <p className="text-indigo-100 text-[10px] leading-relaxed mb-3 opacity-90">
                  A gorgeous creative portfolio and library of interactive 3D components designed with React and Tailwind.
                </p>
                {/* Button */}
                <div>
                  <button className="bg-white text-indigo-700 font-bold text-[9px] py-1.5 px-4 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer">
                    Get Started
                  </button>
                </div>
              </div>

              {/* Right Column mockup */}
              <div className="w-[44%] z-10 pr-2">
                <div className="relative w-full h-[155px] bg-[#0f172a] rounded-lg border border-indigo-400/40 shadow-2xl flex flex-col overflow-hidden">
                  {/* Mockup Header */}
                  <div className="bg-[#1e293b] px-2 py-1 flex items-center gap-1 border-b border-indigo-950/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[6.5px] text-indigo-200/50 font-mono ml-1.5">unnati.dev/slices</span>
                  </div>
                  {/* Inside Mockup */}
                  <div className="p-2 grid grid-cols-3 gap-1.5 flex-1 bg-[#0b0f19] overflow-hidden">
                    {/* Mockup Sidebar */}
                    <div className="col-span-1 bg-[#161e2e] rounded p-1 flex flex-col gap-1">
                      <div className="h-1.5 w-full bg-indigo-500/30 rounded"></div>
                      <div className="h-1 w-4/5 bg-gray-600/20 rounded"></div>
                      <div className="h-1 w-3/5 bg-gray-600/20 rounded"></div>
                      <div className="mt-auto h-1.5 w-full bg-indigo-500/20 rounded"></div>
                    </div>
                    {/* Mockup Cards */}
                    <div className="col-span-2 grid grid-cols-2 gap-1">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded p-1 flex flex-col justify-between shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="h-1.5 w-3/4 bg-white/30 rounded mt-2"></div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded p-1 flex flex-col justify-between shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="h-1.5 w-3/4 bg-white/30 rounded mt-2"></div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded p-1 flex flex-col justify-between shadow-sm col-span-2">
                        <div className="h-1.5 w-1/2 bg-white/30 rounded"></div>
                        <div className="h-1 w-3/4 bg-white/20 rounded mt-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom White Section */}
            <div className="bg-white w-full h-[38%] px-8 py-3.5 border-t border-gray-100 flex flex-row items-center justify-between">
              {/* Column 1 */}
              <div className="w-[47%] flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black text-slate-800 tracking-tight">Design Faster</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-normal">
                  Leverage bespoke UI design systems, gorgeous palettes, and smooth spring-based animations to create premium layouts.
                </p>
              </div>

              {/* Column 2 */}
              <div className="w-[47%] flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black text-slate-800 tracking-tight">Build Smarter</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-normal">
                  Clean modular structures and high-performance WebGL renders optimized for loading speed and accessibility.
                </p>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================================= */}
      {/* 4. CHAIR (FRONT LEFT COMPONENT) */}
      {/* ========================================================================= */}

      {/* ========================================================================= */}
      {/* 4. CHAIR (FRONT LEFT COMPONENT - ROTATES WITH MOUSE CONTROL) */}
      {/* ========================================================================= */}

      <group
        ref={chairRef}
        position={[-0.35, -0.463, 0.72]}
        rotation={[0, 0.4, 0]}
        scale={0.78}
        onClick={(e) => handleWallClick('center', e)}
        onPointerOver={(sector !== 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        {/* Five-Leg Star Base */}
        <mesh position={[0, -0.42, 0.1]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 5]} />
          <meshStandardMaterial color="#0c0d0f" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 5 Roller Wheels (sitting perfectly flat on the floor) */}
        <group position={[0, 0, 0.1]}>
          <mesh position={[0, -0.455, 0.22]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02, 8]} /><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></mesh>
          <mesh position={[0.21, -0.455, 0.07]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02, 8]} /><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></mesh>
          <mesh position={[-0.21, -0.455, 0.07]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02, 8]} /><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></mesh>
          <mesh position={[0.13, -0.455, -0.17]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02, 8]} /><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></mesh>
          <mesh position={[-0.13, -0.455, -0.17]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02, 8]} /><meshStandardMaterial color="#1a1a1a" roughness={0.6} /></mesh>
        </group>

        {/* Hydraulic Chrome Strut */}
        <mesh position={[0, -0.24, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Double-Layer Seat Cushion (Carbon Fiber base + Mesh Top) */}
        {/* Carbon Fiber Under-shell */}
        <mesh position={[0, -0.07, 0.1]}>
          <boxGeometry args={[0.42, 0.02, 0.42]} />
          <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Soft fabric mesh cushion */}
        <mesh position={[0, -0.045, 0.1]}>
          <boxGeometry args={[0.4, 0.03, 0.4]} />
          <meshStandardMaterial color={isDarkMode ? "#1f2937" : "#4b5563"} roughness={0.85} />
        </mesh>

        {/* Sleek Ergonomic Loop Armrests */}
        {/* Left Armrest */}
        <group position={[-0.21, 0.04, 0.1]}>
          <mesh><boxGeometry args={[0.012, 0.15, 0.03]} /><meshStandardMaterial color="#0c0d0f" roughness={0.4} /></mesh>
          <mesh position={[0, 0.075, 0]}><boxGeometry args={[0.03, 0.015, 0.24]} /><meshStandardMaterial color="#111827" roughness={0.7} /></mesh>
        </group>
        {/* Right Armrest */}
        <group position={[0.21, 0.04, 0.1]}>
          <mesh><boxGeometry args={[0.012, 0.15, 0.03]} /><meshStandardMaterial color="#0c0d0f" roughness={0.4} /></mesh>
          <mesh position={[0, 0.075, 0]}><boxGeometry args={[0.03, 0.015, 0.24]} /><meshStandardMaterial color="#111827" roughness={0.7} /></mesh>
        </group>

        {/* Ergonomic Mesh Backrest with Exoskeleton Support Spine */}
        {/* Back Spine Support (Glowing in Dark Mode) */}
        <mesh position={[0, 0.26, -0.13]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.03, 0.55, 0.03]} />
          <meshStandardMaterial
            color={isDarkMode ? "#8b5cf6" : "#4f46e5"}
            emissive={isDarkMode ? "#8b5cf6" : "#4f46e5"}
            emissiveIntensity={isDarkMode ? 3.0 : 0.0}
            roughness={0.2}
          />
        </mesh>
        {/* Backrest Frame */}
        <mesh position={[0, 0.25, -0.1]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.38, 0.52, 0.02]} />
          <meshStandardMaterial color="#0c0d0f" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Backrest Mesh Panel */}
        <mesh position={[0, 0.25, -0.09]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.34, 0.48, 0.005]} />
          <meshStandardMaterial color="#1f2937" transparent opacity={0.65} roughness={0.9} />
        </mesh>

        {/* Separate Ergonomic Headrest */}
        <mesh position={[0, 0.56, -0.14]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.01]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.61, -0.12]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.04]} />
          <meshStandardMaterial color={isDarkMode ? "#1f2937" : "#4b5563"} roughness={0.8} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 5. PC TOWER (DESK RIGHT COMPONENT - SIT FLAT ON DESK) */}
      {/* ========================================================================= */}

      <group
        position={[1.2, 0.105, -0.05]}
        rotation={[0, -0.12, 0]}
        onClick={(e) => handleWallClick('center', e)}
        onPointerOver={(sector !== 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        {/* PC Chassis (Dark semi-transparent glass) */}
        <mesh>
          <boxGeometry args={[0.28, 0.56, 0.52]} />
          <meshStandardMaterial color="#090a0d" roughness={0.1} metalness={0.9} transparent opacity={0.88} />
        </mesh>

        {/* Internal glowing fans group (Glowing Violet) */}
        <group ref={pcFansRef} position={[-0.13, 0, 0]}>
          {/* Top glowing fan */}
          <mesh position={[0, 0.14, 0.1]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.07, 0.008, 8, 24]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={isDarkMode ? 6.0 : 2.0} />
          </mesh>
          {/* Bottom glowing fan */}
          <mesh position={[0, -0.14, 0.1]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.07, 0.008, 8, 24]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={isDarkMode ? 6.0 : 2.0} />
          </mesh>
        </group>
      </group>      {/* ========================================================================= */}
      {/* 6. LEFT WALL DISPLAY PANEL (ABOUT & SKILLS SCREEN) - CLICK TO ENTER SECTOR */}
      {/* ========================================================================= */}

      <group
        position={[-3.44, 0.4, 0.4]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => handleWallClick('left', e)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Screen Frame */}
        <mesh>
          <boxGeometry args={[1.3, 0.9, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Screen Bezel */}
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[1.27, 0.87, 0.005]} />
          <meshStandardMaterial color="#020305" roughness={0.08} metalness={0.9} />
        </mesh>
        {/* Left Screen HTML Content - Light Glassmorphic Dashboard */}
        <Html
          transform
          distanceFactor={0.8}
          position={[0, 0, 0.018]}
          pointerEvents={sector === 'left' ? 'auto' : 'none'}
          style={{
            width: '800px',
            height: '560px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(241, 245, 249, 0.97) 100%)',
            color: '#1e293b',
            fontFamily: '"Outfit", "Inter", sans-serif',
            padding: '28px',
            boxSizing: 'border-box',
            border: '1px solid rgba(99, 102, 241, 0.18)',
            borderRadius: '12px',
            opacity: sector === 'left' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.06)'
          }}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4">
                <span className="font-mono text-xs tracking-wider text-indigo-600 font-bold">SECTOR_01 // BIO_AND_SKILLS</span>
                <span className="font-mono text-[10px] text-slate-400">OS_STABLE</span>
              </div>

              <h2 className="text-xl font-black tracking-tight text-slate-800 mb-2 font-sans">About Me</h2>
              <p className="text-slate-600 text-xs leading-relaxed mb-5 font-sans opacity-95">
                I merge engineering and creative design to build digital environments that wow at first glance. Working at the intersection of aesthetics and physics, I focus on premium, interactive web applications.
              </p>

              <h3 className="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-3">Core Stack & Proficiency</h3>
              <div className="space-y-3.5">
                {/* Skill 1 */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold text-slate-700">
                    <span>WebGL & React Three Fiber (3D)</span>
                    <span className="text-indigo-600">95%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded" style={{ width: '95%' }}></div>
                  </div>
                </div>
                {/* Skill 2 */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold text-slate-700">
                    <span>React & NextJS (Frontend)</span>
                    <span className="text-indigo-600">90%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded" style={{ width: '90%' }}></div>
                  </div>
                </div>
                {/* Skill 3 */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-bold text-slate-700">
                    <span>GSAP & Motion (Animation)</span>
                    <span className="text-indigo-600">88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
              _Click Screen or Desk to Return to Center_
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================================= */}
      {/* 7. RIGHT WALL DISPLAY PANEL (PROJECTS DATABASE SCREEN) - CLICK TO ENTER */}
      {/* ========================================================================= */}

      <group
        position={[3.44, 0.4, 0.4]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => handleWallClick('right', e)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Screen Frame */}
        <mesh>
          <boxGeometry args={[1.3, 0.9, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Screen Bezel */}
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[1.27, 0.87, 0.005]} />
          <meshStandardMaterial color="#020305" roughness={0.08} metalness={0.9} />
        </mesh>
        {/* Right Screen HTML Content - Light Glassmorphic Dashboard */}
        <Html
          transform
          distanceFactor={0.8}
          position={[0, 0, 0.018]}
          pointerEvents={sector === 'right' ? 'auto' : 'none'}
          style={{
            width: '800px',
            height: '560px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(241, 245, 249, 0.97) 100%)',
            color: '#1e293b',
            fontFamily: '"Outfit", "Inter", sans-serif',
            padding: '28px',
            boxSizing: 'border-box',
            border: '1px solid rgba(99, 102, 241, 0.18)',
            borderRadius: '12px',
            opacity: sector === 'right' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.06)'
          }}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4">
                <span className="font-mono text-xs tracking-wider text-indigo-600 font-bold">SECTOR_02 // ARTIFACTS</span>
                <span className="font-mono text-[10px] text-slate-400">STATUS: ONLINE</span>
              </div>

              <h2 className="text-xl font-black tracking-tight text-slate-800 mb-1 font-sans">Project Database</h2>
              <p className="text-slate-500 text-xs mb-4 font-sans opacity-95">
                Hover cards to project blueprint on desk:
              </p>

              <div className="space-y-2.5">
                {/* Project 1 */}
                <div
                  className={`p-3 border rounded-xl transition-all cursor-pointer ${activeProject === 1
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-sm text-indigo-950 font-bold'
                    : 'border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 bg-transparent text-slate-700'
                    }`}
                  onMouseEnter={() => setHoveredProject(1)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={(e) => { e.stopPropagation(); setActiveProject(1); }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs">01 / Ferrari 3D Intro Sequence</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">R3F + GSAP</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-1 font-normal leading-relaxed">Realistic chassis scale-up and camera-facing wheel roll sequence.</p>
                </div>

                {/* Project 2 */}
                <div
                  className={`p-3 border rounded-xl transition-all cursor-pointer ${activeProject === 2
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-sm text-indigo-950 font-bold'
                    : 'border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 bg-transparent text-slate-700'
                    }`}
                  onMouseEnter={() => setHoveredProject(2)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={(e) => { e.stopPropagation(); setActiveProject(2); }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs">02 / Celestial Audio Space</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">GLSL Shaders</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-1 font-normal leading-relaxed">Interactive space environment built with custom shaders.</p>
                </div>

                {/* Project 3 */}
                <div
                  className={`p-3 border rounded-xl transition-all cursor-pointer ${activeProject === 0
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-sm text-indigo-950 font-bold'
                    : 'border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 bg-transparent text-slate-700'
                    }`}
                  onMouseEnter={() => setHoveredProject(0)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={(e) => { e.stopPropagation(); setActiveProject(0); }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs">03 / Virtual Tech Room</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">R3F + CSS3D</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-1 font-normal leading-relaxed">This current sloped office workspace setup with mouse camera panning.</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
              _Click Screen or Desk to Return to Center_
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================================= */}
      {/* 8. LEVITATING MAGNETIC HEADPHONE STAND (DESK LEFT SURFACE - FROM REFERENCE IMAGE) */}
      {/* ========================================================================= */}
      <group position={[-1.15, -0.175, -0.05]}>
        {/* Glossy Black C-Frame Base */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.22]} />
          <meshStandardMaterial color="#090a0f" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* Glossy Black Spine (Vertical Column at the back of the C-frame) */}
        <mesh position={[-0.09, 0.22, 0]}>
          <boxGeometry args={[0.04, 0.42, 0.18]} />
          <meshStandardMaterial color="#090a0f" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* Glossy Black Top Arm */}
        <mesh position={[0, 0.425, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.18]} />
          <meshStandardMaterial color="#090a0f" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* LED Glowing strips on the inner frame (Violet/Neon Purple) */}
        {/* Base inner strip */}
        <mesh position={[0.01, 0.031, 0]}>
          <planeGeometry args={[0.16, 0.16]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#8b5cf6"
            emissiveIntensity={isDarkMode ? 5.0 : 1.5}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </mesh>
        {/* Spine inner strip */}
        <mesh position={[-0.069, 0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.16, 0.38]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#8b5cf6"
            emissiveIntensity={isDarkMode ? 5.0 : 1.5}
          />
        </mesh>
        {/* Top arm inner strip */}
        <mesh position={[0.01, 0.409, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 0.16]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#8b5cf6"
            emissiveIntensity={isDarkMode ? 5.0 : 1.5}
          />
        </mesh>

        {/* Levitating and Rotating Headphone */}
        <group ref={levitatingHeadphoneRef} position={[0, 0.22, 0]}>
          {/* Headphone Earcups */}
          {/* Left Earcup */}
          <group position={[-0.055, 0, 0]} rotation={[0, 0, -0.08]}>
            <mesh>
              <boxGeometry args={[0.024, 0.075, 0.055]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
            </mesh>
            {/* Earpad cushion */}
            <mesh position={[0.005, 0, 0]}>
              <boxGeometry args={[0.008, 0.07, 0.05]} />
              <meshStandardMaterial color="#111111" roughness={0.7} />
            </mesh>
          </group>
          {/* Right Earcup */}
          <group position={[0.055, 0, 0]} rotation={[0, 0, 0.08]}>
            <mesh>
              <boxGeometry args={[0.024, 0.075, 0.055]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
            </mesh>
            {/* Earpad cushion */}
            <mesh position={[-0.005, 0, 0]}>
              <boxGeometry args={[0.008, 0.07, 0.05]} />
              <meshStandardMaterial color="#111111" roughness={0.7} />
            </mesh>
          </group>

          {/* Headphone Arch Band */}
          <mesh position={[0, 0.038, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.052, 0.006, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#111111" roughness={0.5} />
          </mesh>
          {/* Inner headband padding */}
          <mesh position={[0, 0.033, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.048, 0.004, 6, 24, Math.PI]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>

          {/* Earcup extension forks */}
          <mesh position={[-0.048, 0.02, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.005, 0.035, 0.015]} />
            <meshStandardMaterial color="#2d3748" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0.048, 0.02, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.005, 0.035, 0.015]} />
            <meshStandardMaterial color="#2d3748" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 9. KEYBOARD & MOUSE (WHITE/SILVER MODERN SETUP - SITTING ON DESK) */}
      {/* ========================================================================= */}

      <group position={[0, -0.175, 0.25]}>
        {/* Keyboard Base */}
        <mesh position={[0, 0.0075, 0]}>
          <boxGeometry args={[0.48, 0.015, 0.15]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Keys (White) */}
        <mesh position={[0, 0.0175, 0]}>
          <boxGeometry args={[0.46, 0.005, 0.13]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>

        {/* Mouse (Sleek White Magic Mouse style) */}
        <mesh position={[0.32, 0.01, 0.02]}>
          <boxGeometry args={[0.055, 0.02, 0.095]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 10. LIGHT DESK ACCESSORIES (FROM REFERENCE IMAGE - REALISTIC ALIGNMENTS) */}
      {/* ========================================================================= */}

      {/* Desktop Speakers (iMac-style clean dark finish) */}
      <group position={[-0.58, -0.095, -0.58]}>
        <mesh><boxGeometry args={[0.07, 0.16, 0.07]} /><meshStandardMaterial color="#1a1b1f" roughness={0.3} metalness={0.7} /></mesh>
        <mesh position={[0, 0.02, 0.036]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.004, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.58, -0.095, -0.58]}>
        <mesh><boxGeometry args={[0.07, 0.16, 0.07]} /><meshStandardMaterial color="#1a1b1f" roughness={0.3} metalness={0.7} /></mesh>
        <mesh position={[0, 0.02, 0.036]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.004, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>



      {/* Origami Stone Art Piece Removed as requested */}

      {/* Leather Notebook/Planner (placed left-center, from reference image) */}
      <group position={[-0.26, -0.175, 0.3]} rotation={[0, 0.04, 0]}>
        {/* Cover */}
        <mesh position={[0, 0.006, 0]}><boxGeometry args={[0.12, 0.012, 0.16]} /><meshStandardMaterial color="#ea580c" roughness={0.65} /></mesh>
        {/* Pages */}
        <mesh position={[0.004, 0.006, 0]}><boxGeometry args={[0.11, 0.01, 0.15]} /><meshBasicMaterial color="#fffff8" /></mesh>
      </group>

      {/* Silver/White Pen (from reference image) */}
      <group position={[-0.37, -0.175, 0.32]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Pen tip */}
        <mesh position={[0, 0, -0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.004, 0.01, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>
      </group>

      {/* Potted Plant (on desk right, from reference image) */}
      <group position={[1.05, -0.175, -0.2]}>
        {/* Blue Ceramic Pot */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.06, 0.045, 0.1, 16]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.098, 0]}>
          <cylinderGeometry args={[0.056, 0.056, 0.004, 16]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        {/* Green Leafy Stem 1 */}
        <mesh position={[-0.02, 0.13, 0.01]} rotation={[0.2, -0.1, 0.3]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={isDarkMode ? "#155e37" : "#22c55e"} roughness={0.8} />
        </mesh>
        {/* Green Leafy Stem 2 */}
        <mesh position={[0.02, 0.14, -0.01]} rotation={[-0.1, 0.2, -0.2]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={isDarkMode ? "#166534" : "#4ade80"} roughness={0.8} />
        </mesh>
        {/* Green Leafy Stem 3 */}
        <mesh position={[0.0, 0.16, 0.02]} rotation={[0.1, 0.3, 0.0]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color={isDarkMode ? "#14532d" : "#16a34a"} roughness={0.8} />
        </mesh>
      </group>

      {/* Smartphone standing in Dock (Right Side) */}
      <group position={[1.0, -0.1375, 0.15]} rotation={[0, -Math.PI / 10, 0]}>
        {/* Silver Dock stand */}
        <mesh position={[0, -0.03, 0.01]}>
          <boxGeometry args={[0.07, 0.015, 0.06]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Phone vertical slate */}
        <mesh position={[0, 0.04, 0]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.062, 0.125, 0.008]} />
          <meshStandardMaterial color="#0c0d0f" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>

      {/* Vintage Camera (on Desk Right) */}
      <group position={[0.88, -0.14, -0.08]} rotation={[0, Math.PI / 10, 0]}>
        {/* Camera Body */}
        <mesh>
          <boxGeometry args={[0.11, 0.07, 0.05]} />
          <meshStandardMaterial color="#45271a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.02, 0.002]}>
          <boxGeometry args={[0.112, 0.032, 0.052]} />
          <meshStandardMaterial color="#121316" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Lens */}
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.016, 12]} />
          <meshStandardMaterial color="#121316" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Potted Plant with flowers on the bottom Windowsill (Left Side) */}
      <group position={[-0.9, 0.68, -1.74]}>
        {/* Terracotta Pot */}
        <mesh>
          <cylinderGeometry args={[0.05, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#c2410c" roughness={0.6} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.058, 0]}>
          <cylinderGeometry args={[0.046, 0.046, 0.005, 16]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        {/* Leaves */}
        <mesh position={[0, 0.09, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color={isDarkMode ? "#0d3b1f" : "#16a34a"} roughness={0.9} /></mesh>
        {/* Orange Flowers */}
        <mesh position={[0, 0.13, 0]} scale={0.015}><boxGeometry /><meshBasicMaterial color="#ea580c" /></mesh>
        <mesh position={[0.025, 0.11, 0.025]} scale={0.015}><boxGeometry /><meshBasicMaterial color="#ea580c" /></mesh>
        <mesh position={[-0.025, 0.12, -0.025]} scale={0.015}><boxGeometry /><meshBasicMaterial color="#ea580c" /></mesh>
      </group>

      {/* MINIATURE RED TOY FERRARI CAR (placed on right-center, matching parent scale) */}
      <group position={[0.7, -0.175, 0.2]} rotation={[0, -Math.PI / 4, 0]} scale={0.065}>
        {/* Body Group (Chassis wrapper with proper rotation, scale, and positions matching Ferrari.jsx) */}
        <group position={[0, 0.676, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={[1.15, 1.1, 1]}>
          <mesh geometry={nodes.trim.geometry} material={materials.Leather_red} material-color="#111111" position={[-0.379, -0.004, -0.016]} />
          <mesh geometry={nodes.lights_red.geometry} material={materials.Taillight_Glass} position={[0.913, -0.004, -0.006]} />
          <mesh geometry={nodes.plastic_gray.geometry} material={materials.plastic_gray} position={[0.108, -0.001, -0.029]} />
          <mesh geometry={nodes.metal.geometry} material={materials.metal_gray} position={[0.218, -0.005, -0.002]} />
          <mesh geometry={nodes.lights.geometry} material={materials.Projector_Glass} position={[-1.845, -0.002, -0.067]} />
          <mesh geometry={nodes.leds.geometry} material={materials.Turn_Signal_LED} position={[-1.265, -0.001, 0.022]} />
          <mesh geometry={nodes.leather.geometry} material={materials.Leather} position={[-0.348, -0.002, -0.031]} />
          <mesh geometry={nodes.interior_light.geometry} material={materials.Interior_dark} position={[0.005, -0.004, -0.004]} />
          <mesh geometry={nodes.grills.geometry} material={materials.Tires} position={[0.048, -0.007, -0.033]} />
          <mesh geometry={nodes.glass.geometry} material={materials.Glass_Gray} position={[0.001, -0.002, 0.194]} material-transparent material-opacity={0.4} />
          <mesh geometry={nodes.chrome.geometry} material={materials.metal_chrome} position={[0.033, 0, 0.007]} />
          <mesh geometry={nodes.carpet.geometry} material={materials.Carpet} position={[-0.281, -0.004, -0.235]} />
          <mesh geometry={nodes.carbon_fibre_trim.geometry} material={materials.Carbon_Fiber} position={[-0.177, -0.002, -0.04]} />
          <mesh geometry={nodes.carbon_fibre.geometry} material={materials.Carbon_Fiber} position={[-0.438, -0.346, 0.118]} />
          <mesh geometry={nodes.brakes.geometry} material={materials.Taillight_Glass} position={[1.989, -0.004, 0.2]} />
          <mesh geometry={nodes.interior_dark.geometry} material={materials.Interior_light} position={[0.003, 0, 0.011]} />
          <mesh geometry={nodes.body.geometry} material={toyBodyMaterial || materials.Body_Color} position={[-0.005, 0, 0.022]} />
          <mesh geometry={nodes.blue.geometry} material={materials._0098_DodgerBlue} position={[-0.35, -0.435, 0.068]} />
          <mesh geometry={nodes.wipers.geometry} material={materials.Tires} position={[-1.089, 0.006, 0.11]} />
          <mesh geometry={nodes.yellow_trim.geometry} material={materials.Ferrari_Yellow} material-color="#ff0000" position={[-1.397, -0.003, 0.047]} />
        </group>

        {/* Miniature Wheels (with 1.1x and 1.15x scale adjustments matching the chassis scale) */}
        <group position={[0.824 * 1.1, 0.358, 1.496 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.wheel.geometry} material-color="#111111" />
          <mesh geometry={nodes.tire.geometry} material={materials.Tires} />
          <mesh geometry={nodes.rim_rr.geometry} material-color="#222222" />
        </group>
        <group position={[-0.821 * 1.1, 0.358, 1.495 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.wheel_1.geometry} material-color="#111111" />
          <mesh geometry={nodes.tire_1.geometry} material={materials.Tires} />
          <mesh geometry={nodes.rim_rl.geometry} material-color="#222222" />
        </group>
        <group position={[-0.843 * 1.1, 0.358, -1.155 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.wheel_2.geometry} material-color="#111111" />
          <mesh geometry={nodes.tire_2.geometry} material={materials.Tires} />
          <mesh geometry={nodes.rim_fl.geometry} material-color="#222222" />
        </group>
        <group position={[0.829 * 1.1, 0.361, -1.154 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.wheel_3.geometry} material-color="#111111" />
          <mesh geometry={nodes.tire_3.geometry} material={materials.Tires} />
          <mesh geometry={nodes.rim_fr.geometry} material-color="#222222" />
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 11. DESK LAMP & PEN STAND (COZY NIGHT LIGHT TOGGLE) */}
      {/* ========================================================================= */}

      {/* Pen Stand (Separate object next to the lamp) */}
      <group position={[-0.65, -0.175, 0.05]}>
        {/* Pen Cup */}
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.11, 16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.7} />
        </mesh>

        {/* 3 Pens inside the holder cup */}
        <group position={[0, 0, 0]}>
          {/* Pen 1 (angled left) */}
          <mesh position={[-0.015, 0.09, -0.015]} rotation={[0.2, 0.1, -0.3]}>
            <cylinderGeometry args={[0.005, 0.005, 0.14, 8]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.5} />
          </mesh>
          {/* Pen 2 (angled right) */}
          <mesh position={[0.015, 0.09, -0.015]} rotation={[-0.1, -0.25, 0.2]}>
            <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Pen 3 (angled forward) */}
          <mesh position={[0, 0.09, 0.01]} rotation={[0.3, -0.1, 0.05]}>
            <cylinderGeometry args={[0.004, 0.004, 0.13, 8]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Desk Lamp */}
      <group
        position={[-0.85, -0.175, 0.1]}
        onClick={(e) => {
          e.stopPropagation()
          setIsDarkMode(!isDarkMode)
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Lamp Base (Flat and solid dark metallic) */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Lower Joint */}
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 16]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Arm Assembly (Anglepoise style) */}
        <group position={[0, 0.03, 0]} rotation={[0.4, -0.4, 0]}>
          {/* Lower Arm (Dual springs/bars) */}
          <group>
            <mesh position={[-0.01, 0.15, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
              <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.01, 0.15, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
              <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Middle Joint */}
            <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.035, 16]} />
              <meshStandardMaterial color="#2d2d2d" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Upper Arm */}
            <group position={[0, 0.3, 0]} rotation={[-1.0, 0, 0]}>
              <mesh position={[-0.01, 0.125, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.25, 8]} />
                <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0.01, 0.125, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.25, 8]} />
                <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* Head Joint */}
              <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.03, 16]} />
                <meshStandardMaterial color="#2d2d2d" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* Lamp Head (Dome pointing towards keyboard) */}
              <group position={[0, 0.25, 0]} rotation={[1.3, -0.4, 0.1]}>
                <mesh position={[0, -0.07, 0]}>
                  {/* Hemisphere Dome */}
                  <sphereGeometry args={[0.07, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  {/* side={2} is THREE.DoubleSide so the inside of the dome is visible */}
                  <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} side={2} />
                </mesh>
                {/* Glowing Bulb inside */}
                <mesh position={[0, -0.05, 0]}>
                  <sphereGeometry args={[0.025, 16, 16]} />
                  <meshBasicMaterial color={isDarkMode ? "#ffffff" : "#cccccc"} />
                </mesh>

                {/* Light casting white light directly onto keyboard */}
                <pointLight
                  position={[0, -0.08, 0]}
                  color="#ffffff"
                  intensity={isDarkMode ? 3.5 : 0.0}
                  distance={5.0}
                  decay={1.5}
                  castShadow
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
