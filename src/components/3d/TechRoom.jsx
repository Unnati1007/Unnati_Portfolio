import React, { useRef, useState, useMemo, useLayoutEffect, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

function TwinklingStar({ position, size, delay }) {
  const materialRef = useRef()
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Sharper, more realistic twinkle effect using Math.pow
      const t = clock.elapsedTime * 2.0 + delay
      materialRef.current.opacity = 0.2 + 0.8 * Math.pow(Math.sin(t), 4)
    }
  })
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial ref={materialRef} color="#fef08a" transparent />
    </mesh>
  )
}

function TypewriterText() {
  const words = ["a Full Stack Developer.", "an AI/ML Enthusiast.", "a Python Developer."];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  return (
    <span className="inline-block min-w-[200px]">
      <span className="text-indigo-400 font-bold">{words[index].substring(0, subIndex)}</span>
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity text-white`}>|</span>
    </span>
  );
}

function FallingLeaf({ startDelay }) {
  const meshRef = useRef()
  
  // Randomize initial position
  const [startPos] = useState(() => [
    (Math.random() - 0.5) * 2.5, // X position across window
    1.5 + Math.random(), // Y start high
    0.1 + Math.random() * 0.1 // Z relative to day group
  ])

  // Randomize characteristics
  const [speed] = useState(() => 0.2 + Math.random() * 0.3)
  const [wobbleSpeed] = useState(() => 1.0 + Math.random() * 2.0)
  const [wobbleAmount] = useState(() => 0.1 + Math.random() * 0.2)
  const [spinSpeedX] = useState(() => 1.5 + Math.random() * 2.0)
  const [spinSpeedY] = useState(() => 1.0 + Math.random() * 2.0)
  
  // Randomize visuals to break monotony
  const [leafScale] = useState(() => 0.5 + Math.random() * 1.0)
  const [leafColor] = useState(() => {
    // Mix of light green, dark green, yellow, and subtle orange for variety
    const colors = ["#4ade80", "#22c55e", "#15803d", "#facc15", "#fb923c"]
    return colors[Math.floor(Math.random() * colors.length)]
  })
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.elapsedTime
      if (time < startDelay) return
      
      // Fall down continuously
      meshRef.current.position.y -= speed * 0.015
      
      // Drift sideways
      meshRef.current.position.x = startPos[0] + Math.sin(time * wobbleSpeed) * wobbleAmount
      
      // Spin and flutter organically with unique speeds
      meshRef.current.rotation.x = time * spinSpeedX
      meshRef.current.rotation.y = time * spinSpeedY
      
      // Loop back to top once it falls out of frame
      if (meshRef.current.position.y < -0.6) {
        meshRef.current.position.y = 1.5 + Math.random()
        meshRef.current.position.x = (Math.random() - 0.5) * 2.5
      }
    }
  })

  return (
    <mesh ref={meshRef} position={startPos} scale={[leafScale, leafScale * 1.5, leafScale * 0.1]}>
      {/* A low-poly sphere squashed on the Z axis creates a perfect 3D leaf/diamond shape */}
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshStandardMaterial color={leafColor} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
  )
}

function WallSwitch({ position, scale = 1, isDarkMode, setIsDarkMode }) {
  const [hovered, setHovered] = useState(false)
  const toggleRef = useRef()

  const handlePointerDown = (e) => {
    e.stopPropagation()
    gsap.to(toggleRef.current.position, { z: 0.002, duration: 0.1 })
  }

  const handlePointerUp = (e) => {
    e.stopPropagation()
    gsap.to(toggleRef.current.position, { z: 0.006, duration: 0.1, ease: "back.out(2)" })
    setIsDarkMode(!isDarkMode)
  }

  return (
    <group 
      position={position}
      scale={scale}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {/* Outer Plate (Matte Dark Gray) */}
      <mesh position={[0, 0, 0]} scale={hovered ? 1.02 : 1.0}>
        <boxGeometry args={[0.09, 0.13, 0.008]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      
      {/* Inner Frame (Recessed look) */}
      <mesh position={[0, 0, 0.004]}>
        <boxGeometry args={[0.07, 0.11, 0.002]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      
      {/* Toggle Button (Lighter/Metallic) */}
      <group ref={toggleRef} position={[0, 0, 0.006]} scale={hovered ? 1.05 : 1.0}>
        <mesh>
          <boxGeometry args={[0.05, 0.08, 0.01]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
        </mesh>
        
        {/* State Indicator Glow Dot */}
        <mesh position={[0, 0.025, 0.0051]}>
          <circleGeometry args={[0.006, 16]} />
          <meshStandardMaterial 
            color={isDarkMode ? "#a855f7" : "#f59e0b"} 
            emissive={isDarkMode ? "#a855f7" : "#fbbf24"} 
            emissiveIntensity={hovered ? 2.5 : 1.5} 
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* State Text */}
        <Text
          position={[0, -0.012, 0.0052]}
          fontSize={0.022}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {isDarkMode ? "OFF" : "ON"}
        </Text>
      </group>
    </group>
  )
}

export default function TechRoom({ sector, setSector, activeProject, setActiveProject, isDarkMode, setIsDarkMode }) {
  // Load Ferrari GLTF for the wireframe car hologram AND the miniature toy Ferrari
  const { nodes, materials } = useGLTF('/models/ferrari.glb')

  const levitatingHeadphoneRef = useRef()
  const pcFansRef = useRef()
  const chairRef = useRef()
  const chairInteraction = useRef({ isDragging: false, lastX: 0 })
  const roomGroupRef = useRef()

  const [hoveredProject, setHoveredProject] = useState(null)
  const [hoveredSwitch, setHoveredSwitch] = useState(false)

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

    // 2. Smoothly rotate the chair based on mouse coordinate (disabled for 360 manual drag control)
    // if (chairRef.current) {
    //   const targetRot = 0.4 + state.pointer.x * 0.4
    //   chairRef.current.rotation.y = THREE.MathUtils.lerp(chairRef.current.rotation.y, targetRot, 0.05)
    // }

    // 3. Camera transition logic based on selected sector (adjusted for cozy desk view, reduced camera motion)
    const basePos = new THREE.Vector3()
    const baseLook = new THREE.Vector3()

    if (sector === 'left') {
      // Look at the Left Wall screen (About/Skills)
      // Moved camera X to -1.7 to perfectly clear the headphone stand
      basePos.set(-1.7, 0.4, 0.4)
      baseLook.set(-3.4, 0.4, 0.4)
    } else if (sector === 'right') {
      // Look at the Right Wall screen (Projects)
      // Moved camera X to 1.7 to perfectly clear the PC tower
      basePos.set(1.7, 0.4, 0.4)
      baseLook.set(3.4, 0.4, 0.4)
    } else {
      // Center position looking at main desk and iMac monitor
      basePos.set(0, 0.28, 2.2)
      baseLook.set(0, 0.22, -0.4)
    }

    // Add mouse panning (parallax) - disabled as per user request to keep room fixed
    // const mx = state.pointer.x
    // const my = state.pointer.y

    // basePos.x += mx * 0.12
    // basePos.y += my * 0.06

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
      <mesh position={[-3.125, 1.2, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[1.75, 5, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Back Wall Right Part */}
      <mesh position={[1.525, 1.2, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[4.95, 5, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Wall Calendar (JULY 2026) */}
      <group position={[0.2, 1.35, -1.76]} scale={0.75}>
        {/* Calendar Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.0, 0.75, 0.02]} />
          <meshStandardMaterial color={isDarkMode ? "#0f172a" : "#f1f5f9"} roughness={0.9} />
        </mesh>
        
        {/* HTML Content for Calendar UI */}
        <Html 
          transform 
          occlude="blending"
          distanceFactor={1.2}
          position={[0, 0, 0.005]}
        >
          <div style={{
            width: '480px',
            height: '360px',
            backgroundColor: isDarkMode ? 'rgba(21, 25, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            borderRadius: '8px',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            fontFamily: 'sans-serif',
            padding: '16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isDarkMode 
              ? 'inset 0 0 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)' 
              : 'inset 0 0 20px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.1)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, paddingBottom: '8px', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '600', letterSpacing: '1px' }}>JULY</h2>
              <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '400' }}>2026</h2>
            </div>
            
            {/* Days of Week */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontSize: '11px', marginBottom: '4px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            
            {/* Dates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: '2px', flex: 1 }}>
              {Array.from({length: 35}).map((_, index) => {
                const dayNumber = index - 2; // Offset so July 1st starts on a Wednesday
                const date = dayNumber > 0 && dayNumber <= 31 ? dayNumber : '';
                
                // Content for specific days
                const task = 
                  date === 10 ? { text: 'API Design', done: true } :
                  date === 19 ? { text: 'Deploy DB', done: true } :
                  date === 20 ? { text: 'Code Review', done: true } :
                  date === 22 ? { text: 'Fix UI Bugs', done: true } :
                  date === 27 ? { text: 'Client Demo', done: false } : null;

                return (
                  <div key={index} style={{
                    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                    position: 'relative',
                    padding: '2px 4px',
                    fontSize: '11px',
                    backgroundColor: task 
                      ? (isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 0.8)') 
                      : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: date ? 1 : (isDarkMode ? 0.2 : 0.4)
                  }}>
                    <span>{date}</span>
                    {task && (
                      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: isDarkMode ? '#f8fafc' : '#3b82f6', marginBottom: '-1px' }}>{task.done ? '☑' : '☐'}</div>
                        <div style={{ fontSize: '6.5px', color: isDarkMode ? '#cbd5e1' : '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {task.text}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Bottom Footer Tasks */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '10px', color: isDarkMode ? '#cbd5e1' : '#475569', paddingTop: '8px', borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` }}>
              <div>☑ Setup Database</div>
              <div>☐ Write Unit Tests</div>
              <div>☑ Fix CORS issues</div>
              <div>☑ Daily Standup</div>
            </div>
          </div>
        </Html>
      </group>

      {/* Back Wall Bottom Part (Under window) */}
      <mesh position={[-1.6, -0.4, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[1.3, 1.8, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Back Wall Top Part (Above window) */}
      <mesh position={[-1.6, 2.54, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[1.3, 1.6, 0.05]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Interactive Wall Light Switch (Right side back wall) */}
      <WallSwitch position={[2.0, 0.9, -1.77]} scale={2.5} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* ========================================================================= */}
      {/* VERTICAL WINDOW & DYNAMIC SCENERY (Moved Left) */}
      {/* ========================================================================= */}
      <group position={[-1.6, 0, 0]}>
        {/* Window Frame Borders (Clean White Wood) */}
        <mesh position={[0, 1.72, -1.77]}><boxGeometry args={[1.3, 0.04, 0.06]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>
        <mesh position={[0, 0.5, -1.77]}><boxGeometry args={[1.3, 0.04, 0.08]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>
        <mesh position={[-0.63, 1.11, -1.77]}><boxGeometry args={[0.04, 1.26, 0.04]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>
        <mesh position={[0.63, 1.11, -1.77]}><boxGeometry args={[0.04, 1.26, 0.04]} /><meshStandardMaterial color="#cbd5e1" roughness={0.5} /></mesh>

        {/* Single Clean Glass Pane (No grid dividers) */}
        <mesh position={[0, 1.11, -1.78]}>
          <planeGeometry args={[1.22, 1.26]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.12} roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Curtain Rod (Golden/Brass) */}
        <mesh position={[0, 1.76, -1.74]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Rod end caps (Finials) */}
        <mesh position={[-0.9, 1.76, -1.74]}><sphereGeometry args={[0.045, 16, 16]} /><meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0.9, 1.76, -1.74]}><sphereGeometry args={[0.045, 16, 16]} /><meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} /></mesh>

        {/* Curtains (Navy Blue Pleated Fabric) */}
        {/* Left Curtain */}
        <group position={[-0.75, 1.06, -1.73]}>
          <mesh position={[-0.12, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
          <mesh position={[-0.04, 0, 0.03]}><cylinderGeometry args={[0.06, 0.06, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
          <mesh position={[0.04, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
          <mesh position={[0.1, 0, 0.02]}><cylinderGeometry args={[0.04, 0.04, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
        </group>
        {/* Right Curtain */}
        <group position={[0.75, 1.06, -1.73]}>
          <mesh position={[-0.1, 0, 0.02]}><cylinderGeometry args={[0.04, 0.04, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
          <mesh position={[-0.04, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
          <mesh position={[0.04, 0, 0.03]}><cylinderGeometry args={[0.06, 0.06, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
          <mesh position={[0.12, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 1.4, 16]} /><meshStandardMaterial color="#1e3a8a" roughness={0.9} /></mesh>
        </group>

        {/* Background Sky Plane */}
        <mesh position={[0, 1.3, -2.5]}>
          <planeGeometry args={[4.0, 3.5]} />
          {/* Using a softer, hazy blue (#bae6fd) for daylight to match reference */}
          <meshBasicMaterial color={isDarkMode ? "#05070f" : "#bae6fd"} />
        </mesh>

        {/* Dynamic Day/Night Scenery behind the glass */}
        {isDarkMode ? (
          <group position={[0, 0, 0]}>
            {/* Crescent Moon (Moved to Left Side, Tilted Up) */}
            <group position={[-0.35, 1.6, -2.4]} rotation={[0, 0, Math.PI / 6]}>
              <mesh>
                <circleGeometry args={[0.09, 64]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
              {/* Dark cutout positioned on the right to make tips point right/up */}
              <mesh position={[0.035, 0.0, 0.001]}>
                <circleGeometry args={[0.08, 64]} />
                <meshBasicMaterial color="#05070f" />
              </mesh>
            </group>
            
            {/* Twinkling Stars (Significantly larger and spread out to all corners of the window) */}
            {/* Top section */}
            <TwinklingStar position={[0.5, 1.75, -2.4]} size={0.014} delay={0} />
            <TwinklingStar position={[0.1, 1.7, -2.4]} size={0.009} delay={1.2} />
            <TwinklingStar position={[-0.55, 1.65, -2.4]} size={0.015} delay={3.3} />
            
            {/* Upper Middle section */}
            <TwinklingStar position={[-0.15, 1.5, -2.4]} size={0.011} delay={2.3} />
            <TwinklingStar position={[0.3, 1.55, -2.4]} size={0.008} delay={4.1} />
            <TwinklingStar position={[-0.45, 1.4, -2.4]} size={0.012} delay={5.2} />
            
            {/* Lower Middle section */}
            <TwinklingStar position={[0.55, 1.35, -2.4]} size={0.013} delay={3.5} />
            <TwinklingStar position={[0.05, 1.25, -2.4]} size={0.007} delay={6.1} />
            <TwinklingStar position={[-0.25, 1.2, -2.4]} size={0.009} delay={0.8} />
            <TwinklingStar position={[-0.6, 1.15, -2.4]} size={0.011} delay={1.7} />
            
            {/* Bottom section (near trees) */}
            <TwinklingStar position={[0.45, 1.05, -2.4]} size={0.010} delay={0.5} />
            <TwinklingStar position={[0.2, 0.95, -2.4]} size={0.014} delay={2.8} />
            <TwinklingStar position={[-0.1, 0.9, -2.4]} size={0.008} delay={4.8} />
            <TwinklingStar position={[-0.5, 0.85, -2.4]} size={0.009} delay={1.9} />
            
            {/* Dark Trees (Night Silhouette) */}
            <group position={[0, 0, -2.3]}>
              <mesh position={[-0.5, 0.7, 0]}><sphereGeometry args={[0.4, 8, 8]} /><meshBasicMaterial color="#020617" /></mesh>
              <mesh position={[0.3, 0.8, 0]}><sphereGeometry args={[0.5, 8, 8]} /><meshBasicMaterial color="#020617" /></mesh>
            </group>
          </group>
        ) : (
          <group position={[0, 0, -2.2]}>
            {/* Low-Poly Forest Scenery (Day Mode) */}
            
            {/* Flat Grass Ground Plane */}
            <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[5, 2]} />
              <meshStandardMaterial color="#4ade80" roughness={1.0} />
            </mesh>

            {/* Left Pine Tree (Deep Forest Green) */}
            <group position={[-0.9, -0.4, -0.1]}>
              <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.04, 0.06, 0.6]} /><meshStandardMaterial color="#451a03" roughness={0.9} /></mesh>
              <mesh position={[0, 0.7, 0]}><coneGeometry args={[0.35, 0.8, 6]} /><meshStandardMaterial color="#064e3b" roughness={0.8} /></mesh>
              <mesh position={[0, 1.1, 0]}><coneGeometry args={[0.25, 0.6, 6]} /><meshStandardMaterial color="#064e3b" roughness={0.8} /></mesh>
              <mesh position={[0, 1.4, 0]}><coneGeometry args={[0.15, 0.4, 6]} /><meshStandardMaterial color="#064e3b" roughness={0.8} /></mesh>
            </group>

            {/* Right Round Canopy Tree (Medium Green) */}
            <group position={[0.8, -0.4, 0.0]}>
              <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.05, 0.07, 0.7]} /><meshStandardMaterial color="#78350f" roughness={0.9} /></mesh>
              {/* IcosahedronGeometry (with detail=1) creates a beautiful low-poly faceted sphere look */}
              <mesh position={[0, 0.9, 0]}><icosahedronGeometry args={[0.4, 1]} /><meshStandardMaterial color="#16a34a" roughness={0.8} flatShading /></mesh>
              <mesh position={[-0.15, 0.7, 0.1]}><icosahedronGeometry args={[0.3, 1]} /><meshStandardMaterial color="#15803d" roughness={0.8} flatShading /></mesh>
              <mesh position={[0.2, 0.8, -0.1]}><icosahedronGeometry args={[0.35, 1]} /><meshStandardMaterial color="#15803d" roughness={0.8} flatShading /></mesh>
            </group>

            {/* Background Center Tree (Lighter/Yellowish Green) */}
            <group position={[0.1, -0.4, -0.2]}>
              <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.06, 0.08, 1.0]} /><meshStandardMaterial color="#78350f" roughness={0.9} /></mesh>
              <mesh position={[0, 1.2, 0]}><icosahedronGeometry args={[0.5, 1]} /><meshStandardMaterial color="#84cc16" roughness={0.8} flatShading /></mesh>
              <mesh position={[0.2, 1.0, 0.1]}><icosahedronGeometry args={[0.35, 1]} /><meshStandardMaterial color="#65a30d" roughness={0.8} flatShading /></mesh>
            </group>

            {/* Extra Small Background Pine (Depth variation) */}
            <group position={[-0.3, -0.4, -0.2]}>
              <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.03, 0.04, 0.4]} /><meshStandardMaterial color="#451a03" roughness={0.9} /></mesh>
              <mesh position={[0, 0.5, 0]}><coneGeometry args={[0.2, 0.6, 6]} /><meshStandardMaterial color="#064e3b" roughness={0.8} /></mesh>
              <mesh position={[0, 0.8, 0]}><coneGeometry args={[0.15, 0.4, 6]} /><meshStandardMaterial color="#064e3b" roughness={0.8} /></mesh>
            </group>

            {/* Falling Leaves Animation */}
            {Array.from({length: 12}).map((_, i) => <FallingLeaf key={i} startDelay={i * 0.4} />)}
          </group>
        )}
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

      {/* Floor (Light Brown / Natural Wood Texture Tone) */}
      <mesh position={[0, -0.83, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#d0b490" roughness={0.9} metalness={0.05} />
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
        {/* Desk Tabletop (Walnut Wood Finish - raised to y = -0.2 and pushed back to z = -0.2) */}
        <mesh position={[0, -0.2, -0.2]}>
          <boxGeometry args={[3.4, 0.05, 1.2]} />
          <meshStandardMaterial color={isDarkMode ? "#3d2514" : "#5a3a22"} roughness={0.7} metalness={0.05} />
        </mesh>

        {/* Left Desk Leg (Black Metal Loop) */}
        <group position={[-1.6, -0.5275, -0.2]}>
          {/* Front post */}
          <mesh position={[0, 0, 0.5]}>
            <boxGeometry args={[0.05, 0.605, 0.05]} />
            <meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Back post */}
          <mesh position={[0, 0, -0.5]}>
            <boxGeometry args={[0.05, 0.605, 0.05]} />
            <meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Bottom rail */}
          <mesh position={[0, -0.2775, 0]}>
            <boxGeometry args={[0.05, 0.05, 1.05]} />
            <meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Top rail */}
          <mesh position={[0, 0.2775, 0]}>
            <boxGeometry args={[0.05, 0.05, 1.05]} />
            <meshStandardMaterial color="#0c0a09" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Desk Drawer Unit (Right Side Support) */}
        <group position={[1.4, -0.525, -0.2]}>
          {/* Main Cabinet Body */}
          <mesh>
            <boxGeometry args={[0.6, 0.6, 1.15]} />
            <meshStandardMaterial color={isDarkMode ? "#3d2514" : "#5a3a22"} roughness={0.8} />
          </mesh>
          
          {/* Top Drawer */}
          <mesh position={[0, 0.18, 0.58]}>
            <boxGeometry args={[0.55, 0.2, 0.02]} />
            <meshStandardMaterial color={isDarkMode ? "#3d2514" : "#5a3a22"} roughness={0.7} />
          </mesh>
          {/* Top Drawer Handle (Sleek Silver) */}
          <mesh position={[0, 0.18, 0.6]}>
            <boxGeometry args={[0.25, 0.015, 0.015]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.9} />
          </mesh>

          {/* Bottom Drawer */}
          <mesh position={[0, -0.13, 0.58]}>
            <boxGeometry args={[0.55, 0.4, 0.02]} />
            <meshStandardMaterial color={isDarkMode ? "#3d2514" : "#5a3a22"} roughness={0.7} />
          </mesh>
          {/* Bottom Drawer Handle */}
          <mesh position={[0, 0.02, 0.6]}>
            <boxGeometry args={[0.25, 0.015, 0.015]} />
            <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 3. ULTRAWIDE MONITOR & DESK RISER */}
      {/* ========================================================================= */}

      <group
        position={[0, 0.45, -0.6]}
        scale={0.80}
        onClick={(e) => handleWallClick('center', e)}
        onPointerOver={(sector !== 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        {/* Wooden Monitor Riser (Sitting flush on the desk to prevent floating) */}
        <mesh position={[0, -0.735, -0.05]}>
          <boxGeometry args={[3.2, 0.03, 0.4]} />
          <meshStandardMaterial color={isDarkMode ? "#3d2514" : "#5a3a22"} roughness={0.7} metalness={0.05} />
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

        {/* Realistic Monitor Stand Base (Metallic V/X-Shape) */}
        {/* Main Base Hub */}
        <mesh position={[0, -0.702, -0.05]}>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Front Left Leg */}
        <mesh position={[-0.2, -0.702, 0.05]} rotation={[0, -Math.PI/6, 0]}>
          <boxGeometry args={[0.45, 0.02, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Front Right Leg */}
        <mesh position={[0.2, -0.702, 0.05]} rotation={[0, Math.PI/6, 0]}>
          <boxGeometry args={[0.45, 0.02, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Back Legs (shorter) */}
        <mesh position={[-0.15, -0.702, -0.15]} rotation={[0, Math.PI/4, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.15, -0.702, -0.15]} rotation={[0, -Math.PI/4, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Realistic Monitor Stand Column (Segmented Metallic Pole) */}
        {/* Core Pole */}
        <mesh position={[0, -0.45, -0.05]}>
          <cylinderGeometry args={[0.04, 0.04, 0.52]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Segment Rings */}
        <mesh position={[0, -0.6, -0.05]}>
          <cylinderGeometry args={[0.055, 0.055, 0.05]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.45, -0.05]}>
          <cylinderGeometry args={[0.055, 0.055, 0.05]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.3, -0.05]}>
          <cylinderGeometry args={[0.055, 0.055, 0.05]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Top Joint connecting to monitor */}
        <mesh position={[0, -0.2, -0.04]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* Ultrawide Back Housing (Solid dark gray plastic) */}
        <mesh position={[0, -0.175, 0.0]}>
          <boxGeometry args={[2.14, 0.76, 0.04]} />
          <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Top Bezel Frame */}
        <mesh position={[0, 0.19, 0.024]}>
          <boxGeometry args={[2.14, 0.03, 0.012]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Bottom Bezel Chin (Thicker) */}
        <mesh position={[0, -0.54, 0.024]}>
          <boxGeometry args={[2.14, 0.05, 0.012]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Left Bezel Frame */}
        <mesh position={[-1.055, -0.175, 0.024]}>
          <boxGeometry args={[0.03, 0.70, 0.012]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Right Bezel Frame */}
        <mesh position={[1.055, -0.175, 0.024]}>
          <boxGeometry args={[0.03, 0.70, 0.012]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Screen Glass (The actual display area inside the bezels) */}
        <mesh position={[0, -0.175, 0.022]}>
          <boxGeometry args={[2.08, 0.70, 0.005]} />
          <meshStandardMaterial color="#020305" roughness={0.08} metalness={0.9} />
        </mesh>

        {/* Center Screen HTML Landing Page Content (Hero Section) */}
        <Html
          transform
          occlude="blending"
          distanceFactor={0.58}
          position={[0, -0.175, 0.026]}
          pointerEvents={sector === 'center' ? 'auto' : 'none'}
          style={{
            width: '1440px',
            height: '470px',
            background: '#0f172a',
            color: '#f8fafc',
            fontFamily: '"Outfit", "Inter", sans-serif',
            boxSizing: 'border-box',
            borderRadius: '8px',
            opacity: sector === 'center' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease',
            overflow: 'hidden',
            userSelect: 'none'
          }}
        >
          <div className="flex flex-row h-full w-full bg-[#0f172a] select-none text-white">
            {/* Left Column: Hero Content */}
            <div className="w-[65%] h-full flex flex-col justify-center px-24 relative overflow-hidden border-r border-slate-800">
              {/* Background ambient glow */}
              <div className="absolute bottom-[-100px] left-[-50px] w-[400px] h-[400px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
              
              <div className="text-indigo-400 font-mono text-3xl mb-6 tracking-widest uppercase text-opacity-90 z-10">
                <span className="inline-block mr-3 text-indigo-500/50">{">"}</span>
                Hello World, I am
              </div>
              
              <h1 className="text-[5.5rem] font-black text-white mb-8 tracking-tighter leading-none z-10 drop-shadow-xl">
                Unnati Jadon
              </h1>
              
              {/* Typewriter text wrapper */}
              <div className="text-5xl text-slate-200 font-bold h-[70px] mb-12 flex items-center z-10">
                I'm <span className="ml-4"><TypewriterText /></span>
              </div>
              
              <div className="flex gap-6 z-10 mt-4">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-10 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer text-lg tracking-wider uppercase">
                  View My Projects
                </button>
                <button className="bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800 text-white font-bold py-5 px-10 rounded-xl border border-slate-600 hover:border-slate-400 transition-all cursor-pointer text-lg tracking-wider uppercase">
                  Contact Me
                </button>
              </div>
            </div>

            {/* Right Column: Photo / Profile */}
            <div className="w-[35%] h-full flex flex-col relative overflow-hidden bg-slate-900">
              {/* The Photo */}
              <div className="w-full h-full absolute inset-0 group cursor-pointer bg-slate-900 overflow-hidden">
                <img 
                  src="/profile.png" 
                  alt="Unnati Profile" 
                  className="w-full h-full object-cover object-[95%_5%] scale-110 transition-transform duration-700 group-hover:scale-125 group-hover:translate-x-2" 
                />
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
        position={[-0.35, -0.35, 0.65]}
        rotation={[0, 0.4, 0]}
        scale={0.78}
        onPointerDown={(e) => {
          e.stopPropagation()
          if (sector === 'center') {
            chairInteraction.current.isDragging = true
            chairInteraction.current.lastX = e.clientX
            e.target.setPointerCapture(e.pointerId)
            document.body.style.cursor = 'grabbing'
          } else {
            handleWallClick('center', e)
          }
        }}
        onPointerUp={(e) => {
          if (chairInteraction.current.isDragging) {
            chairInteraction.current.isDragging = false
            try { e.target.releasePointerCapture(e.pointerId) } catch (err) {}
            if (sector === 'center') document.body.style.cursor = 'grab'
          }
        }}
        onPointerMove={(e) => {
          if (chairInteraction.current.isDragging && chairRef.current) {
            const deltaX = e.clientX - chairInteraction.current.lastX
            chairRef.current.rotation.y += deltaX * 0.015
            chairInteraction.current.lastX = e.clientX
          }
        }}
        onPointerOver={(e) => {
          if (sector === 'center') {
            document.body.style.cursor = 'grab'
          } else {
            handlePointerOver(e)
          }
        }}
        onPointerOut={(e) => {
          if (chairInteraction.current.isDragging) {
            chairInteraction.current.isDragging = false
            try { e.target.releasePointerCapture(e.pointerId) } catch (err) {}
          }
          if (sector === 'center') {
            document.body.style.cursor = 'auto'
          } else {
            handlePointerOut(e)
          }
        }}
      >
        {/* Modern Cyber/Herman-Miller Style Sharp Star Base */}
        <group position={[0, -0.44, 0.1]}>
          {/* Central Hub */}
          <mesh><cylinderGeometry args={[0.05, 0.06, 0.04, 8]} /><meshStandardMaterial color="#0c0d0f" metalness={0.9} roughness={0.2} /></mesh>
          {/* Sharp Spider Legs */}
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`leg-${i}`} position={[Math.sin((i * Math.PI * 2) / 5) * 0.15, 0, Math.cos((i * Math.PI * 2) / 5) * 0.15]} rotation={[Math.PI / 2, 0, -(i * Math.PI * 2) / 5]}>
              <cylinderGeometry args={[0.015, 0.005, 0.28, 4]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* 5 Roller Wheels (sitting perfectly flat on the floor) */}
        <group position={[0, 0, 0.1]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`wheel-${i}`} position={[Math.sin((i * Math.PI * 2) / 5) * 0.27, -0.455, Math.cos((i * Math.PI * 2) / 5) * 0.27]} rotation={[0, -(i * Math.PI * 2) / 5, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.025, 12]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* Hydraulic Chrome Strut */}
        <mesh position={[0, -0.25, 0.1]}>
          <cylinderGeometry args={[0.018, 0.022, 0.34, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* PREMIUM ERGONOMIC CHAIR (Matching Reference Image) */}
        
        {/* Seat Cushion (Dark Grey Mesh/Fabric on Black Frame) */}
        <group position={[0, -0.05, 0.02]}>
          {/* Black Plastic Base under seat */}
          <RoundedBox position={[0, -0.02, 0]} args={[0.48, 0.04, 0.50]} radius={0.015} smoothness={4}>
            <meshStandardMaterial color="#0f0f11" roughness={0.8} />
          </RoundedBox>
          {/* Dark Grey Seat Mesh/Cushion */}
          <RoundedBox position={[0, 0.015, 0]} args={[0.49, 0.04, 0.51]} radius={0.015} smoothness={4}>
            <meshStandardMaterial color="#2d2d30" roughness={0.9} />
          </RoundedBox>
        </group>

        {/* Structural Spine (Central Black Plastic Pillar) */}
        <group position={[0, 0.15, -0.15]} rotation={[0.2, 0, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.25, 0.05]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
        </group>

        {/* Backrest (Black Frame, Dark Mesh, Silver Metallic Accents) */}
        <group position={[0, 0.35, -0.13]} rotation={[0.15, 0, 0]}>
          {/* Ergonomic Shaped Lower Back (Lumbar) */}
          <group position={[0, -0.12, 0.02]} rotation={[0.1, 0, 0]}>
            <RoundedBox position={[0, 0, -0.02]} args={[0.42, 0.28, 0.04]} radius={0.03} smoothness={4}>
              <meshStandardMaterial color="#111111" roughness={0.8} />
            </RoundedBox>
            <RoundedBox position={[0, 0, 0.005]} args={[0.38, 0.25, 0.02]} radius={0.02} smoothness={4}>
              <meshStandardMaterial color="#222224" roughness={0.8} />
            </RoundedBox>
          </group>

          {/* Ergonomic Shaped Upper Back */}
          <group position={[0, 0.15, -0.01]} rotation={[-0.05, 0, 0]}>
            <RoundedBox position={[0, 0, -0.02]} args={[0.42, 0.3, 0.04]} radius={0.03} smoothness={4}>
              <meshStandardMaterial color="#111111" roughness={0.8} />
            </RoundedBox>
            <RoundedBox position={[0, 0, 0.005]} args={[0.38, 0.27, 0.02]} radius={0.02} smoothness={4}>
              <meshStandardMaterial color="#222224" roughness={0.8} />
            </RoundedBox>
          </group>

          {/* Silver Metallic V-Shape Support Structure on the back */}
          {/* Top horizontal silver bar */}
          <mesh position={[0, 0.23, -0.025]}>
            <boxGeometry args={[0.38, 0.03, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Left Silver diagonal */}
          <mesh position={[-0.15, -0.05, -0.025]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.03, 0.5, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Right Silver diagonal */}
          <mesh position={[0.15, -0.05, -0.025]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.03, 0.5, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.3} />
          </mesh>
          
          {/* Lower ribbed lumbar support (Black plastic) */}
          <mesh position={[0, -0.18, 0.015]}>
            <boxGeometry args={[0.25, 0.1, 0.02]} />
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </mesh>
        </group>

        {/* Headrest (Mesh Panel with T-bracket) */}
        <group position={[0, 0.68, -0.17]} rotation={[0.2, 0, 0]}>
          {/* Central thick black pillar going up to headrest */}
          <mesh position={[0, -0.1, -0.03]}>
            <boxGeometry args={[0.05, 0.15, 0.04]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Horizontal crossbar of the T-bracket */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.3, 0.04, 0.03]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Circular pivots on the ends of the crossbar */}
          <mesh position={[-0.14, 0, -0.01]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
            <meshStandardMaterial color="#050505" roughness={0.8} />
          </mesh>
          <mesh position={[0.14, 0, -0.01]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
            <meshStandardMaterial color="#050505" roughness={0.8} />
          </mesh>
          
          {/* Headrest Black Frame */}
          <mesh position={[0, 0.03, 0.01]}>
            <boxGeometry args={[0.34, 0.16, 0.03]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Headrest Dark Grey Mesh */}
          <mesh position={[0, 0.03, 0.026]}>
            <boxGeometry args={[0.31, 0.13, 0.01]} />
            <meshStandardMaterial color="#2d2d30" roughness={0.8} />
          </mesh>
        </group>

        {/* T-Style Armrests (Flat black pads on single posts) */}
        {/* Left Armrest */}
        <group position={[-0.25, 0.15, -0.05]}>
          {/* Vertical Post */}
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.03, 0.24, 0.04]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Flat Armrest Pad */}
          <RoundedBox position={[0, 0, 0.05]} args={[0.08, 0.03, 0.32]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </RoundedBox>
        </group>
        
        {/* Right Armrest */}
        <group position={[0.25, 0.15, -0.05]}>
          {/* Vertical Post */}
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.03, 0.24, 0.04]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Flat Armrest Pad */}
          <RoundedBox position={[0, 0, 0.05]} args={[0.08, 0.03, 0.32]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </RoundedBox>
        </group>
      </group>

      {/* 5. PC TOWER (DESK RIGHT COMPONENT - SIT FLAT ON DESK) */}
      {/* ========================================================================= */}

      <group
        position={[1.2, 0.105, -0.05]}
        rotation={[0, -0.12, 0]}
        onClick={(e) => handleWallClick('center', e)}
        onPointerOver={(sector !== 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        {/* Top Panel (Dark Metal) */}
        <mesh position={[0, 0.275, 0]}>
          <boxGeometry args={[0.28, 0.01, 0.52]} />
          <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.9} />
        </mesh>
        
        {/* Bottom Panel (Dark Metal) */}
        <mesh position={[0, -0.275, 0]}>
          <boxGeometry args={[0.28, 0.01, 0.52]} />
          <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.9} />
        </mesh>
        
        {/* Back Panel (Rear) */}
        <mesh position={[0, 0, -0.255]}>
          <boxGeometry args={[0.28, 0.54, 0.01]} />
          <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.9} />
        </mesh>
        
        {/* Right Side Panel (Solid metal facing away from user) */}
        <mesh position={[0.135, 0, 0]}>
          <boxGeometry args={[0.01, 0.54, 0.50]} />
          <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Front Glass Panel (Fully transparent like aquarium PC) */}
        <mesh position={[0, 0, 0.255]}>
          <boxGeometry args={[0.26, 0.54, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.0} metalness={1.0} transparent opacity={0.15} />
        </mesh>
        
        {/* Tempered Glass Left Side Panel (Facing user, Clear/transparent) */}
        <mesh position={[-0.135, 0, 0]}>
          <boxGeometry args={[0.01, 0.54, 0.50]} />
          <meshStandardMaterial color="#ffffff" roughness={0.0} metalness={1.0} transparent opacity={0.15} />
        </mesh>

        {/* Front Bezel/Pillars (Corner Supports) */}
        <mesh position={[-0.135, 0, 0.255]}>
          <boxGeometry args={[0.01, 0.54, 0.01]} />
          <meshStandardMaterial color="#020202" roughness={0.9} />
        </mesh>
        <mesh position={[0.135, 0, 0.255]}>
          <boxGeometry args={[0.01, 0.54, 0.01]} />
          <meshStandardMaterial color="#020202" roughness={0.9} />
        </mesh>
        
        {/* PSU Shroud (Bottom compartment) */}
        <mesh position={[0, -0.21, 0]}>
          <boxGeometry args={[0.26, 0.14, 0.50]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.8} />
        </mesh>

        {/* Internal GPU */}
        <group position={[-0.02, -0.05, 0.05]}>
          <mesh>
            <boxGeometry args={[0.08, 0.04, 0.25]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
          </mesh>
          <mesh position={[-0.045, 0, 0]}>
            <boxGeometry args={[0.01, 0.045, 0.26]} />
            <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* GPU glowing logo */}
          <mesh position={[-0.051, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.1, 0.015]} />
            <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 1.5 : 0.5} />
          </mesh>
        </group>

        {/* Motherboard block (Background) */}
        <mesh position={[0.12, 0.05, -0.05]}>
          <boxGeometry args={[0.02, 0.35, 0.3]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>

        {/* RAM Sticks */}
        <mesh position={[0.1, 0.12, 0.03]}><boxGeometry args={[0.04, 0.08, 0.01]} /><meshStandardMaterial color="#111" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 1.2 : 0.5} /></mesh>
        <mesh position={[0.1, 0.12, 0.05]}><boxGeometry args={[0.04, 0.08, 0.01]} /><meshStandardMaterial color="#111" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 1.2 : 0.5} /></mesh>

        {/* CPU Cooler Pump Block */}
        <mesh position={[0.08, 0.12, -0.1]}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
          <meshStandardMaterial color="#0a0a0c" />
        </mesh>
        <mesh position={[0.055, 0.12, -0.1]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[0.025, 0.035, 16]} />
          <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 1.8 : 0.8} side={THREE.DoubleSide} />
        </mesh>

        {/* RGB Fans Group (Animated via pcFansRef) */}
        <group ref={pcFansRef}>
          {/* Massive Side Intake Fan 1 (Top) */}
          <group position={[0.1, 0.15, 0.13]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh>
              <torusGeometry args={[0.065, 0.008, 12, 32]} />
              <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 2.2 : 1.0} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/4]}><boxGeometry args={[0.13, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh rotation={[0, 0, -Math.PI/4]}><boxGeometry args={[0.13, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
          </group>

          {/* Massive Side Intake Fan 2 (Bottom) */}
          <group position={[0.1, -0.01, 0.13]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh>
              <torusGeometry args={[0.065, 0.008, 12, 32]} />
              <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 2.2 : 1.0} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/4]}><boxGeometry args={[0.13, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh rotation={[0, 0, -Math.PI/4]}><boxGeometry args={[0.13, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
          </group>

          {/* Rear Exhaust Fan */}
          <group position={[-0.05, 0.15, -0.22]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <torusGeometry args={[0.05, 0.006, 12, 32]} />
              <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 1.8 : 1.0} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/4]}><boxGeometry args={[0.1, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh rotation={[0, 0, -Math.PI/4]}><boxGeometry args={[0.1, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
          </group>
          
          {/* Bottom Intake Fans (on top of PSU shroud) */}
          <group position={[-0.04, -0.135, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.05, 0.006, 12, 32]} />
              <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 2.0 : 1.0} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/4]}><boxGeometry args={[0.1, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh rotation={[0, 0, -Math.PI/4]}><boxGeometry args={[0.1, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
          </group>
          <group position={[-0.04, -0.135, -0.01]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.05, 0.006, 12, 32]} />
              <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={isDarkMode ? 2.0 : 1.0} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/4]}><boxGeometry args={[0.1, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh rotation={[0, 0, -Math.PI/4]}><boxGeometry args={[0.1, 0.005, 0.005]} /><meshStandardMaterial color="#111" /></mesh>
          </group>
        </group>

        {/* Thin RGB/Underglow accent strip along the bottom edge, flush with case base */}
        <mesh position={[0, -0.278, 0]}>
          <boxGeometry args={[0.282, 0.004, 0.522]} />
          <meshStandardMaterial 
            color="#8b5cf6" 
            emissive="#8b5cf6" 
            emissiveIntensity={isDarkMode ? 3.0 : 1.0} 
          />
        </mesh>
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
          occlude="blending"
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
          <boxGeometry args={[1.7, 1.15, 0.02]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.9} roughness={0.5} />
        </mesh>
        {/* Screen Bezel */}
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[1.66, 1.11, 0.005]} />
          <meshStandardMaterial color="#020305" roughness={0.08} metalness={0.9} />
        </mesh>
        {/* Right Screen HTML Content - Terminal Dashboard */}
        <Html
          transform
          occlude="blending"
          distanceFactor={0.8}
          position={[0, 0, 0.018]}
          pointerEvents={sector === 'right' ? 'auto' : 'none'}
          style={{
            width: '1000px',
            height: '660px',
            background: '#0a0a0a',
            color: '#39ff14',
            fontFamily: '"Courier New", Courier, monospace',
            padding: '36px',
            boxSizing: 'border-box',
            border: '2px solid rgba(57, 255, 20, 0.8)',
            borderRadius: '8px',
            opacity: sector === 'right' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.15)'
          }}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#39ff14]/30 pb-2.5 mb-4">
                <span className="font-mono text-xs tracking-wider text-[#39ff14] font-bold">[ SECTOR_02 // ARTIFACTS ]</span>
                <span className="font-mono text-[10px] text-[#39ff14]/70 animate-pulse">STATUS: ONLINE_</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-[#39ff14] mb-1 font-mono">&gt; PROJECT_DATABASE</h2>
              <p className="text-[#39ff14]/70 text-xs mb-6 font-mono">
                $ select_project --mode=desk_projection:
              </p>

              <div className="space-y-3">
                {/* Project 1 */}
                <div
                  className={`p-4 border font-mono transition-all cursor-pointer ${activeProject === 1
                    ? 'border-[#39ff14] bg-[#39ff14] text-[#0a0a0a] shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold'
                    : 'border-[#39ff14]/30 hover:border-[#39ff14] bg-transparent text-[#39ff14]/80'
                    }`}
                  onMouseEnter={() => setHoveredProject(1)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={(e) => { e.stopPropagation(); setActiveProject(1); }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">&gt; 01 // Ferrari 3D Sequence</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${activeProject === 1 ? 'bg-[#0a0a0a] text-[#39ff14]' : 'bg-[#39ff14]/10 text-[#39ff14]'}`}>R3F + GSAP</span>
                  </div>
                  <p className={`text-[11px] mt-2 ${activeProject === 1 ? 'text-[#0a0a0a]/80' : 'text-[#39ff14]/60'}`}>Realistic chassis scale-up and camera-facing wheel roll sequence.</p>
                </div>

                {/* Project 2 */}
                <div
                  className={`p-4 border font-mono transition-all cursor-pointer ${activeProject === 2
                    ? 'border-[#39ff14] bg-[#39ff14] text-[#0a0a0a] shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold'
                    : 'border-[#39ff14]/30 hover:border-[#39ff14] bg-transparent text-[#39ff14]/80'
                    }`}
                  onMouseEnter={() => setHoveredProject(2)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={(e) => { e.stopPropagation(); setActiveProject(2); }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">&gt; 02 // Celestial Audio Space</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${activeProject === 2 ? 'bg-[#0a0a0a] text-[#39ff14]' : 'bg-[#39ff14]/10 text-[#39ff14]'}`}>GLSL Shaders</span>
                  </div>
                  <p className={`text-[11px] mt-2 ${activeProject === 2 ? 'text-[#0a0a0a]/80' : 'text-[#39ff14]/60'}`}>Interactive space environment built with custom shaders.</p>
                </div>

                {/* Project 3 */}
                <div
                  className={`p-4 border font-mono transition-all cursor-pointer ${activeProject === 0
                    ? 'border-[#39ff14] bg-[#39ff14] text-[#0a0a0a] shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold'
                    : 'border-[#39ff14]/30 hover:border-[#39ff14] bg-transparent text-[#39ff14]/80'
                    }`}
                  onMouseEnter={() => setHoveredProject(0)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={(e) => { e.stopPropagation(); setActiveProject(0); }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">&gt; 03 // Virtual Tech Room</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${activeProject === 0 ? 'bg-[#0a0a0a] text-[#39ff14]' : 'bg-[#39ff14]/10 text-[#39ff14]'}`}>R3F + CSS3D</span>
                  </div>
                  <p className={`text-[11px] mt-2 ${activeProject === 0 ? 'text-[#0a0a0a]/80' : 'text-[#39ff14]/60'}`}>This current sloped office workspace setup with mouse camera panning.</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[#39ff14]/50 font-mono tracking-wider">
              _Click Screen or Desk to Return to Center_
            </div>
          </div>
        </Html>
      </group>

      {/* ========================================================================= */}
      {/* 8. LEVITATING MAGNETIC HEADPHONE STAND (DESK LEFT SURFACE - FROM REFERENCE IMAGE) */}
      {/* ========================================================================= */}
      <group position={[-1.15, -0.175, -0.05]}>
        {/* Metallic C-Frame Base */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.22]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Metallic Spine (Vertical Column at the back of the C-frame) */}
        <mesh position={[-0.09, 0.22, 0]}>
          <boxGeometry args={[0.04, 0.42, 0.18]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Glossy Black Top Arm */}
        <mesh position={[0, 0.425, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.18]} />
          <meshStandardMaterial color="#090a0f" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* Lit Fabric Panels on the inner frame (Soft textured purple) */}
        {/* Base inner strip */}
        <mesh position={[0.01, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 0.16]} />
          <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={isDarkMode ? 0.4 : 0.1} roughness={1.0} />
        </mesh>
        {/* Spine inner strip */}
        <mesh position={[-0.069, 0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.16, 0.38]} />
          <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={isDarkMode ? 0.4 : 0.1} roughness={1.0} />
        </mesh>
        {/* Top arm inner strip */}
        <mesh position={[0.01, 0.409, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 0.16]} />
          <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={isDarkMode ? 0.4 : 0.1} roughness={1.0} />
        </mesh>

        {/* Levitating Headphone (Sleek Modern Premium Design matching reference) */}
        <group ref={levitatingHeadphoneRef} position={[0.03, 0.22, 0]} scale={[1.4, 1.4, 1.4]}>
          {/* Headphone Earcups (Dark Matte Premium Look) */}
          {/* Left Earcup */}
          <group position={[-0.05, 0, 0]} rotation={[0, 0, -0.05]}>
            {/* Outer shell (Dark matte grey/black) */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.02, 32]} />
              <meshStandardMaterial color="#1a1c23" roughness={0.8} metalness={0.1} />
            </mesh>
            {/* Edge detail / bevel */}
            <mesh position={[0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.036, 0.036, 0.005, 32]} />
              <meshStandardMaterial color="#111" roughness={0.6} />
            </mesh>
            {/* Earpad cushion (Black leather) */}
            <mesh position={[0.015, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.033, 0.033, 0.015, 32]} />
              <meshStandardMaterial color="#050505" roughness={0.9} />
            </mesh>
            {/* Inner speaker grill */}
            <mesh position={[0.022, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.025, 32]} />
              <meshStandardMaterial color="#000" roughness={1.0} />
            </mesh>
          </group>
          
          {/* Right Earcup */}
          <group position={[0.05, 0, 0]} rotation={[0, 0, 0.05]}>
            {/* Outer shell (Dark matte grey/black) */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.02, 32]} />
              <meshStandardMaterial color="#1a1c23" roughness={0.8} metalness={0.1} />
            </mesh>
            {/* Edge detail / bevel */}
            <mesh position={[-0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.036, 0.036, 0.005, 32]} />
              <meshStandardMaterial color="#111" roughness={0.6} />
            </mesh>
            {/* Earpad cushion (Black leather) */}
            <mesh position={[-0.015, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.033, 0.033, 0.015, 32]} />
              <meshStandardMaterial color="#050505" roughness={0.9} />
            </mesh>
            {/* Inner speaker grill */}
            <mesh position={[-0.022, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.025, 32]} />
              <meshStandardMaterial color="#000" roughness={1.0} />
            </mesh>
            
            {/* Subtle buttons on the bottom of the right earcup */}
            <mesh position={[0.005, -0.035, 0]}>
              <boxGeometry args={[0.005, 0.002, 0.015]} />
              <meshStandardMaterial color="#222" roughness={0.5} />
            </mesh>
            <mesh position={[0.005, -0.035, -0.015]}>
              <boxGeometry args={[0.005, 0.002, 0.005]} />
              <meshStandardMaterial color="#222" roughness={0.5} />
            </mesh>
          </group>

          {/* Headphone Arch Band (Sleek wide curve) */}
          <mesh position={[0, 0.045, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.058, 0.008, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#3b3b4f" roughness={1.0} />
          </mesh>
          {/* Inner headband padding */}
          <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.056, 0.004, 12, 32, Math.PI]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>

          {/* Metallic Yokes (Connecting headband to earcups) */}
          <mesh position={[-0.058, 0.03, 0]} rotation={[0, 0, -0.05]}>
            <cylinderGeometry args={[0.002, 0.002, 0.035, 16]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0.058, 0.03, 0]} rotation={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.002, 0.002, 0.035, 16]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 9. KEYBOARD & MOUSE (WHITE/SILVER MODERN SETUP - SITTING ON DESK) */}
      {/* ========================================================================= */}

      {/* Scaled up and shifted on the table */}
      <group position={[0, -0.175, -0.12]} scale={1.25}>
        {/* Extended Desk Mousepad (Deep Black) */}
        <mesh position={[0.05, 0.002, 0]}>
          <boxGeometry args={[1.0, 0.004, 0.35]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>

        {/* Keyboard Cable */}
        <mesh position={[-0.1, 0.005, -0.15]} rotation={[Math.PI / 2, 0, 0.2]}>
          <cylinderGeometry args={[0.002, 0.002, 0.15, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        
        {/* Mouse Cable */}
        <mesh position={[0.36, 0.005, -0.12]} rotation={[Math.PI / 2, 0, -0.4]}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.25, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        {/* Keyboard Base (Thick Dark Mechanical Keyboard) */}
        <mesh position={[0, 0.012, 0]} rotation={[0.04, 0, 0]}>
          <boxGeometry args={[0.62, 0.018, 0.23]} />
          <meshStandardMaterial color="#0f1115" metalness={0.8} roughness={0.5} />
        </mesh>

        {/* Keyboard Underglow (Blue Cyan) */}
        <mesh position={[0, 0.022, 0]} rotation={[0.04, 0, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.58, 0.20]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={isDarkMode ? 0.8 : 0.3} />
        </mesh>
        
        {/* Detailed Keyboard Keys (TKL Layout) */}
        <group position={[0, 0.016, 0]} rotation={[0.04, 0, 0]}>
          {/* Generate a 5x14 grid of individual keycaps */}
          {Array.from({ length: 5 }).map((_, row) => 
            Array.from({ length: 14 }).map((_, col) => {
              // Leave a gap for the spacebar
              if (row === 4 && col >= 4 && col <= 9) return null;
              
              // Sculpted profile tilt
              const tilt = (row - 2.5) * 0.05;
              
              return (
                <group key={`key-${row}-${col}`} position={[-0.26 + col * 0.04, 0.008, -0.08 + row * 0.04]}>
                  <mesh rotation={[tilt, 0, 0]}>
                    <boxGeometry args={[0.032, 0.02, 0.032]} />
                    {/* Dark matte keycaps with slight color variations for modifiers */}
                    <meshStandardMaterial color={
                      (col === 0 || col === 13 || col === 12 || row === 0 || (row === 4 && col < 4)) ? "#1a1d24" : "#22262d"
                    } roughness={0.6} metalness={0.1} />
                  </mesh>
                </group>
              );
            })
          )}
          {/* Spacebar */}
          <group position={[0, 0.008, 0.08]}>
             <mesh>
               <boxGeometry args={[0.23, 0.02, 0.032]} />
               <meshStandardMaterial color="#22262d" roughness={0.6} metalness={0.1} />
             </mesh>
          </group>
        </group>

        {/* Mouse (Ergonomic Dark Gaming Mouse) */}
        <group position={[0.38, 0.01, 0.02]} rotation={[0, -0.15, 0]}>
          {/* Main Body */}
          <mesh position={[0, 0.014, 0]} scale={[0.55, 0.38, 1.1]}>
            <sphereGeometry args={[0.06, 32, 16]} />
            <meshStandardMaterial color="#111" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Ergonomic Thumb Rest */}
          <mesh position={[-0.03, 0.005, 0.01]} scale={[0.5, 0.1, 0.8]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
          {/* Mouse RGB glow strip underneath */}
          <mesh position={[0, 0.002, 0]} scale={[0.62, 0.05, 1.15]}>
            <sphereGeometry args={[0.06, 32, 16]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={isDarkMode ? 2.5 : 1.0} />
          </mesh>
          {/* Scroll Wheel */}
          <mesh position={[0, 0.032, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.008, 16]} />
            <meshStandardMaterial color="#000" roughness={0.6} metalness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 10. LIGHT DESK ACCESSORIES (FROM REFERENCE IMAGE - REALISTIC ALIGNMENTS) */}
      {/* ========================================================================= */}

      {/* Smart Speaker (Alexa/Echo Style) on Left Side */}
      <group position={[-0.85, -0.053, -0.5]} scale={1.35}>
        {/* Main Cylindrical Body (Matte charcoal finish) */}
        <mesh>
          <cylinderGeometry args={[0.038, 0.04, 0.18, 32]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.8} metalness={0.2} />
        </mesh>
        
        {/* Subtle Speaker Grille Texture overlay (lower portion) */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.0405, 0.042, 0.13, 32]} />
          {/* Using faint wireframe to mimic a mesh grille pattern */}
          <meshStandardMaterial color="#050505" roughness={0.9} metalness={0.1} wireframe={true} transparent opacity={0.3} />
        </mesh>
        
        {/* Smart Speaker Light Ring (Subtle glowing blue/purple ring near top) */}
        <mesh position={[0, 0.075, 0]}>
          <cylinderGeometry args={[0.0385, 0.0385, 0.003, 32]} />
          <meshStandardMaterial 
            color="#8b5cf6" 
            emissive="#00d8ff" 
            emissiveIntensity={isDarkMode ? 2.0 : 0.8} 
          />
        </mesh>

        {/* Top Control Panel (Flat dark surface) */}
        <mesh position={[0, 0.091, 0]}>
          <cylinderGeometry args={[0.037, 0.038, 0.002, 32]} />
          <meshStandardMaterial color="#0f0f11" roughness={0.5} />
        </mesh>
      </group>



      {/* Origami Stone Art Piece Removed as requested */}

      {/* Leather Diary / Notebook (Premium Moleskine Style with pen on top) */}
      <group position={[0.3, -0.175, 0.25]} rotation={[0, 0.1, 0]} scale={1.5}>
        {/* Bottom Cover */}
        <mesh position={[0, 0.0015, 0]}>
          <boxGeometry args={[0.18, 0.003, 0.16]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.9} />
        </mesh>
        {/* Paper Pages (slightly recessed) */}
        <mesh position={[0.002, 0.009, 0]}>
          <boxGeometry args={[0.174, 0.012, 0.156]} />
          <meshBasicMaterial color="#fdfbf7" />
        </mesh>
        {/* Top Cover */}
        <mesh position={[0, 0.0165, 0]}>
          <boxGeometry args={[0.18, 0.003, 0.16]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.9} />
        </mesh>
        {/* Spine (Dark Leather binding) */}
        <mesh position={[-0.089, 0.009, 0]}>
          <boxGeometry args={[0.003, 0.018, 0.16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        {/* Elastic Strap (Black) */}
        <mesh position={[0.065, 0.009, 0]}>
          <boxGeometry args={[0.015, 0.0185, 0.161]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        {/* Red Bookmark Ribbon (Hanging off the front-left edge) */}
        <mesh position={[-0.06, 0.004, 0.09]} rotation={[-0.3, 0, 0.1]}>
          <boxGeometry args={[0.008, 0.001, 0.04]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.9} />
        </mesh>

        {/* Silver/Metallic Pen sitting on top of the notebook */}
        <group position={[0.01, 0.018, 0]} rotation={[0, 0.4, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            {/* Back half (Silver) */}
            <mesh position={[0, 0.035, 0]}>
              <cylinderGeometry args={[0.0035, 0.0035, 0.05, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Black Grip (Middle) */}
            <mesh position={[0, 0.0, 0]}>
              <cylinderGeometry args={[0.0038, 0.0038, 0.02, 16]} />
              <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>
            {/* Front half (Silver) */}
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.0035, 0.003, 0.02, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Pen tip (Silver) */}
            <mesh position={[0, -0.035, 0]}>
              <coneGeometry args={[0.003, 0.01, 16]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Pen clip (Black) */}
            <mesh position={[0.004, 0.04, 0]}>
              <boxGeometry args={[0.002, 0.04, 0.002]} />
              <meshStandardMaterial color="#222" roughness={0.5} />
            </mesh>
          </group>
        </group>
      </group>



      {/* Parlor Palm Plant (on desk right, from reference image) */}
      <group position={[0.75, -0.175, -0.28]}>
        {/* Terracotta Pot Saucer/Base */}
        <mesh position={[0, 0.003, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.006, 32]} />
          <meshStandardMaterial color="#a64c2e" roughness={0.9} />
        </mesh>
        
        {/* Terracotta Tapered Pot */}
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.08, 32]} />
          <meshStandardMaterial color="#c25e3a" roughness={0.9} />
        </mesh>
        
        {/* Pot Top Rim */}
        <mesh position={[0, 0.088, 0]}>
          <cylinderGeometry args={[0.059, 0.055, 0.01, 32]} />
          <meshStandardMaterial color="#c25e3a" roughness={0.9} />
        </mesh>
        
        {/* Soil */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.005, 32]} />
          <meshStandardMaterial color="#3f2e22" roughness={1.0} />
        </mesh>
        
        {/* Palm Fronds (Clusters of sharp, thin green leaves) */}
        {Array.from({ length: 8 }).map((_, frondIdx) => (
          <group 
            key={`frond-${frondIdx}`} 
            position={[
              Math.sin(frondIdx * Math.PI / 4) * 0.02, 
              0.08, 
              Math.cos(frondIdx * Math.PI / 4) * 0.02
            ]} 
            rotation={[
              0.15 + Math.random() * 0.2, 
              frondIdx * (Math.PI / 4), 
              0
            ]}
          >
            {/* Main stalk */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.0015, 0.002, 0.1, 8]} />
              <meshStandardMaterial color="#4ade80" roughness={0.7} />
            </mesh>
            
            {/* Leaves radiating from the stalk */}
            {Array.from({ length: 8 }).map((_, leafIdx) => (
              <group 
                key={`leaf-${leafIdx}`}
                position={[0, 0.02 + (leafIdx * 0.01), 0]}
                rotation={[0.9 - (leafIdx * 0.05), leafIdx * 2.4, 0]} 
              >
                {/* Thin, sharp cone for clarity and sharpness */}
                <mesh position={[0, 0.035, 0]}>
                  <coneGeometry args={[0.0035, 0.07, 4]} />
                  <meshStandardMaterial color={leafIdx % 2 === 0 ? "#22c55e" : "#16a34a"} roughness={0.8} />
                </mesh>
              </group>
            ))}
            
            {/* Top leaf pointing straight up */}
            <mesh position={[0, 0.13, 0]}>
              <coneGeometry args={[0.0035, 0.06, 4]} />
              <meshStandardMaterial color="#4ade80" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>



      {/* MINIATURE RED TOY FERRARI CAR (placed on right-center, matching parent scale) */}
      <group position={[0.7, -0.175, 0.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.065}>
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
          <mesh geometry={nodes.glass.geometry} material={materials.Glass_Gray} position={[0.001, -0.002, 0.194]} material-transparent={false} material-opacity={1} material-color="#020202" />
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
          
          {/* Procedural Hardtop Canopy (Solid block acting as Roof + tinted side windows) */}
          <mesh position={[0.12, 0.0, 0.38]} rotation={[0, 0.05, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.26]} />
            <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} envMapIntensity={1.0} />
          </mesh>
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

      {/* Pen Stand (Larger, more detailed, pushed back on desk) */}
      <group position={[-1.0, -0.175, -0.3]}>
        {/* Pen Cup Main Body */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.05, 0.045, 0.14, 32]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} metalness={0.1} />
        </mesh>
        
        {/* Hollow interior illusion (Dark circle at the top) */}
        <mesh position={[0, 0.141, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.046, 32]} />
          <meshBasicMaterial color="#050505" />
        </mesh>

        {/* Pens inside the holder cup */}
        <group position={[0, 0.05, 0]}>
          {/* Pen 1 (Blue Pen) */}
          <group position={[-0.02, 0.05, -0.02]} rotation={[0.2, 0.4, -0.3]}>
            {/* Body */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.16, 16]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.4} />
            </mesh>
            {/* Cap/Tip */}
            <mesh position={[0, 0.135, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.03, 16]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.3} />
            </mesh>
          </group>

          {/* Pen 2 (Silver Premium Pen with pocket clip) */}
          <group position={[0.02, 0.05, -0.01]} rotation={[-0.1, -0.25, 0.2]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.18, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Pocket Clip */}
            <mesh position={[0.006, 0.12, 0]}>
              <boxGeometry args={[0.002, 0.04, 0.002]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>

          {/* Pen 3 (Orange Pencil with eraser) */}
          <group position={[0, 0.05, 0.02]} rotation={[0.3, -0.1, 0.1]}>
            <mesh position={[0, 0.04, 0]}>
              {/* Hexagonal shape for pencil */}
              <cylinderGeometry args={[0.004, 0.004, 0.15, 6]} />
              <meshStandardMaterial color="#ea580c" roughness={0.6} />
            </mesh>
            {/* Eraser top */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.015, 16]} />
              <meshStandardMaterial color="#fca5a5" roughness={0.8} />
            </mesh>
            {/* Metal band for eraser */}
            <mesh position={[0, 0.11, 0]}>
              <cylinderGeometry args={[0.0042, 0.0042, 0.005, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        </group>
      </group>


    </group>
  )
}
