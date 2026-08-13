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
      <span className="text-indigo-600 font-bold">{words[index].substring(0, subIndex)}</span>
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity text-slate-800`}>|</span>
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

  // Cloned taillight material for the miniature toy Ferrari to keep its glow soft and subtle
  const toyTaillightMaterial = useMemo(() => {
    if (!materials || !materials.Taillight_Glass) return null
    const mat = materials.Taillight_Glass.clone()
    mat.emissive = new THREE.Color("#ff0000")
    mat.emissiveIntensity = 1.5 // Soft, professional glow instead of blazing bright 30
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

      {/* Back Wall Left Part */}
      <mesh position={[-3.125, 1.2, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[1.75, 5, 0.05]} />
        <meshBasicMaterial color={isDarkMode ? '#111827' : '#faf8f5'} />
      </mesh>

      {/* Back Wall Right Part */}
      <mesh position={[1.525, 1.2, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[4.95, 5, 0.05]} />
        <meshBasicMaterial color={isDarkMode ? '#111827' : '#faf8f5'} />
      </mesh>


      {/* Back Wall Bottom Part (Under window) */}
      <mesh position={[-1.6, -0.4, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[1.3, 1.8, 0.05]} />
        <meshBasicMaterial color={isDarkMode ? '#111827' : '#faf8f5'} />
      </mesh>

      {/* Back Wall Top Part (Above window) */}
      <mesh position={[-1.6, 2.54, -1.8]} onClick={(e) => handleWallClick('center', e)}>
        <boxGeometry args={[1.3, 1.6, 0.05]} />
        <meshBasicMaterial color={isDarkMode ? '#111827' : '#faf8f5'} />
      </mesh>

      {/* Interactive Wall Light Switch (Right side back wall) */}
      <WallSwitch position={[2.0, 0.9, -1.77]} scale={2.5} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* ========================================================================= */}
      {/* VERTICAL WINDOW & DYNAMIC SCENERY (Moved Left) */}
      {/* ========================================================================= */}
      <group position={[-1.6, 0, 0]}>
        {/* Window Frame Borders (Clean White Wood) */}
        <mesh position={[0, 1.72, -1.77]}><boxGeometry args={[1.3, 0.04, 0.06]} /><meshBasicMaterial color={isDarkMode ? '#1f2937' : '#faf8f5'} /></mesh>
        <mesh position={[0, 0.5, -1.77]}><boxGeometry args={[1.3, 0.04, 0.08]} /><meshBasicMaterial color={isDarkMode ? '#1f2937' : '#faf8f5'} /></mesh>
        <mesh position={[-0.63, 1.11, -1.77]}><boxGeometry args={[0.04, 1.26, 0.04]} /><meshBasicMaterial color={isDarkMode ? '#1f2937' : '#faf8f5'} /></mesh>
        <mesh position={[0.63, 1.11, -1.77]}><boxGeometry args={[0.04, 1.26, 0.04]} /><meshBasicMaterial color={isDarkMode ? '#1f2937' : '#faf8f5'} /></mesh>

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
              <meshStandardMaterial color="#2a3b2e" roughness={1.0} />
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

      {/* Left Wall */}
      <mesh
        position={[-3.5, 1.2, 1.0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => handleWallClick('left', e)}
        onPointerOver={(sector === 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[6, 5, 0.05]} />
        <meshBasicMaterial color={isDarkMode ? '#111827' : '#faf8f5'} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[3.5, 1.2, 1.0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => handleWallClick('right', e)}
        onPointerOver={(sector === 'center') ? handlePointerOver : undefined}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[6, 5, 0.05]} />
        <meshBasicMaterial color={isDarkMode ? '#111827' : '#faf8f5'} />
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
        scale={1.08}
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
            background: '#ffffff',
            color: '#0f172a',
            fontFamily: '"Outfit", "Inter", sans-serif',
            boxSizing: 'border-box',
            borderRadius: '8px',
            opacity: sector === 'center' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease',
            overflow: 'hidden',
            userSelect: 'none'
          }}
        >
          <div className="flex flex-row h-full w-full bg-white select-none text-slate-900">
            {/* Left Column: Photo / Profile */}
            <div className="w-[35%] h-full flex flex-col relative overflow-hidden bg-white">
              {/* The Photo */}
              <div className="w-full h-full absolute inset-0 group cursor-pointer bg-white overflow-hidden">
                <img 
                  src="/profile.png" 
                  alt="Unnati Profile" 
                  className="w-full h-full object-contain object-left scale-[1.0] transition-transform duration-700 group-hover:scale-[1.05]" 
                />
              </div>
            </div>

            {/* Right Column: Hero Content */}
            <div className="w-[65%] h-full flex flex-col justify-center pl-8 pr-16 relative overflow-hidden">
              
              <div className="text-indigo-600 font-mono text-3xl mb-6 tracking-widest uppercase z-10">
                <span className="inline-block mr-3 text-indigo-500/50">{">"}</span>
                Hello World, I am
              </div>
              
              <h1 className="text-[5.5rem] font-black text-slate-900 mb-8 tracking-tighter leading-none z-10">
                Unnati Jadon
              </h1>
              
              {/* Typewriter text wrapper */}
              <div className="text-5xl text-slate-700 font-bold h-[70px] mb-12 flex items-center z-10">
                I'm <span className="ml-4"><TypewriterText /></span>
              </div>
              
              <div className="flex gap-6 z-10 mt-4">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-10 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer text-lg tracking-wider uppercase">
                  View My Projects
                </button>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-5 px-10 rounded-xl border border-slate-300 hover:border-slate-400 transition-all cursor-pointer text-lg tracking-wider uppercase">
                  Contact Me
                </button>
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
        position={[-0.75, -0.35, 0.65]}
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
          <boxGeometry args={[1.7, 1.15, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Screen Bezel */}
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[1.66, 1.11, 0.005]} />
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
            width: '1000px',
            height: '660px',
            background: 'transparent',
            color: '#39ff14',
            fontFamily: '"Courier New", Courier, monospace',
            padding: '0px',
            boxSizing: 'border-box',
            opacity: sector === 'left' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease'
          }}
        >
          <div className="flex flex-col h-full w-full bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#39ff14]/30 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(57,255,20,0.12)]">
            {/* MacBook Title Bar */}
            <div className="flex items-center justify-between bg-[#1a1a1a] border-b border-[#2d2d2d] px-4 py-2.5 select-none">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5 w-1/4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-90"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-90"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-90"></div>
              </div>
              {/* Terminal Title */}
              <div className="text-[11px] font-sans font-medium text-slate-400 text-center w-2/4 tracking-wide">
                dev_journey.log — zsh — 80×24
              </div>
              {/* Right Spacer */}
              <div className="w-1/4"></div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-[36px] flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex items-center justify-between border-b border-[#39ff14]/30 pb-1.5 mb-3">
                  <span className="font-mono text-xs tracking-wider text-[#39ff14] font-bold">[ SECTOR_01 // DEV_JOURNEY ]</span>
                  <span className="font-mono text-[10px] text-[#39ff14]/70 animate-pulse">STATUS: ONLINE_</span>
                </div>

                <div className="flex items-baseline gap-3 mb-5">
                  <h2 className="text-xl font-bold tracking-tight text-[#39ff14] font-mono">&gt; DEV_JOURNEY</h2>
                  <span className="text-[#39ff14]/60 text-[11px] font-mono">$ cat dev_journey.log</span>
                </div>

                {/* Horizontal layout for Content */}
                <div className="flex flex-row gap-6 mb-2">
                  {/* Left Column: Image & CTA */}
                  <div className="w-[55%] flex flex-col gap-4">
                    <div className="w-full h-[225px] flex items-center justify-center border border-[#39ff14]/30 bg-[#0a0a0a]/50 p-3 rounded overflow-hidden">
                      {/* GitHub Contributions Chart */}
                      <img 
                        src="/github-profile.png" 
                        alt="Unnati GitHub Contributions" 
                        className="w-full h-auto object-contain filter brightness-110 contrast-125" 
                      />
                    </div>
                    
                    <a
                      href="https://github.com/Unnati1007"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 p-3 border border-[#39ff14] bg-[#39ff14] text-[#0a0a0a] shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold transition-all hover:scale-[1.01] duration-200 select-none cursor-pointer rounded"
                    >
                      <span className="text-sm font-mono tracking-wide">&gt; Check Out My GitHub Profile</span>
                    </a>
                  </div>

                  {/* Right Column: Narrative */}
                  <div className="w-[45%] font-mono text-[10.5px] text-[#39ff14]/55 leading-[1.7] flex flex-col justify-center border border-[#39ff14]/20 p-4 bg-[#0a0a0a]/50 rounded-lg">
                    <div className="text-[#39ff14]/75 mb-3 font-bold text-[11px]"># dev_journey.log</div>
                    <div className="mb-2"># Started with the classic "Guess the Number" game —<br/># a few lines of code, a lot of confusion, zero design sense.</div>
                    
                    <div className="mb-2"># From there it just kept growing — small scripts turned into<br/># actual projects, projects turned into apps people could use.</div>
                    
                    <div className="mb-2"># Somewhere along the way, building things stopped feeling<br/># like an assignment and started feeling like the fun part.</div>
                    
                    <div># Still shipping, still breaking things, still figuring it out.<br/># Check out my GitHub to see how it's evolved.</div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#39ff14]/50 font-mono tracking-wider pt-3 mt-4 border-t border-[#39ff14]/10 text-center">
                _Click Screen or Desk to Return to Center_
              </div>
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
            background: 'transparent',
            color: '#39ff14',
            fontFamily: '"Courier New", Courier, monospace',
            padding: '0px',
            boxSizing: 'border-box',
            opacity: sector === 'right' ? 1.0 : 0.4,
            transition: 'opacity 0.4s ease'
          }}
        >
          <div className="flex flex-col h-full w-full bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#39ff14]/30 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(57,255,20,0.12)]">
            {/* MacBook Title Bar */}
            <div className="flex items-center justify-between bg-[#1a1a1a] border-b border-[#2d2d2d] px-4 py-2.5 select-none">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5 w-1/4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-90"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-90"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-90"></div>
              </div>
              {/* Terminal Title */}
              <div className="text-[11px] font-sans font-medium text-slate-400 text-center w-2/4 tracking-wide">
                dsa_journey.log — zsh — 80×24
              </div>
              {/* Right Spacer */}
              <div className="w-1/4"></div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-[36px] flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between border-b border-[#39ff14]/30 pb-1.5 mb-2.5">
                  <span className="font-mono text-xs tracking-wider text-[#39ff14] font-bold">[ SECTOR_02 // DSA_JOURNEY ]</span>
                  <span className="font-mono text-[10px] text-[#39ff14]/70 animate-pulse">STATUS: ONLINE_</span>
                </div>

                <div className="flex items-baseline gap-3 mb-3.5">
                  <h2 className="text-xl font-bold tracking-tight text-[#39ff14] font-mono">&gt; DSA_JOURNEY</h2>
                  <span className="text-[#39ff14]/60 text-[11px] font-mono">$ cat dsa_journey.log</span>
                </div>

                {/* Heatmap Section (Top) - Clean, borderless, and enlarged */}
                <div className="flex gap-6 mb-4.5">
                  {/* Heatmap 1 */}
                  <div className="flex-1 h-[215px] flex items-center justify-center">
                    <img 
                      src="/leetcode-heatmap1.png" 
                      alt="LeetCode Heatmap 2025" 
                      className="w-full h-full object-contain filter brightness-105 contrast-[1.02]" 
                    />
                  </div>

                  {/* Heatmap 2 */}
                  <div className="flex-1 h-[215px] flex items-center justify-center">
                    <img 
                      src="/leetcode-heatmap2.png" 
                      alt="LeetCode Heatmap 2026/Recent" 
                      className="w-full h-full object-contain filter brightness-105 contrast-[1.02]" 
                    />
                  </div>
                </div>

                {/* Bottom Section - Columns layout */}
                <div className="flex flex-row gap-6 items-start mb-4">
                  {/* Bottom Left: Journey Narrative */}
                  <div className="w-1/2 font-mono text-[9.5px] text-[#39ff14]/55 leading-normal border border-[#39ff14]/20 p-4 bg-[#0a0a0a]/50 rounded-lg h-[165px] overflow-hidden">
                    <div className="text-[#39ff14]/75 mb-2 font-mono">// JOURNEY_SUMMARY</div>
                    <div># Started DSA in 1st year, more out of curiosity than confidence.</div>
                    <div># Struggled a lot in the beginning brute force, wrong approaches,</div>
                    <div># giving up mid-problem.</div>
                    <br />
                    <div># Somewhere along the way it became a habit rather than a task.</div>
                    <div># Solving consistently since, one problem at a time.</div>
                    <br />
                    <div># Still learning. Still solving. Still counting streaks and still stuck in dp</div>
                  </div>

                  {/* Bottom Right: Code CTA and Profiles */}
                  <div className="w-1/2 flex flex-col justify-between h-[165px]">
                    {/* LeetCode Profile CTA */}
                    <div>
                      <a
                        href="https://leetcode.com/u/Unnati_1705/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2.5 p-3 border border-[#39ff14] bg-[#39ff14] text-[#0a0a0a] shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold transition-all hover:scale-[1.01] duration-200 select-none cursor-pointer rounded"
                      >
                        <img src="/leetcode-logo.png" alt="LeetCode Logo" className="w-5 h-5 object-contain" />
                        <span className="text-sm font-mono">Check My LeetCode Profile & Badges</span>
                      </a>
                    </div>

                    {/* Other Profile Links */}
                    <div>
                      <div className="text-[11px] text-[#39ff14]/80 mb-2 font-mono font-bold">// OTHER_CODING_PROFILES:</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {/* HackerRank */}
                        <a href="https://www.hackerrank.com/profile/unnatijadon17" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:underline text-[#39ff14]/90 hover:text-[#39ff14] font-mono font-bold flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#2ec866] fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.329 14.286H12.98v-3.714H11.02v3.714H8.671V7.714H11.02V10.82h1.96V7.714h2.348v8.572z"/>
                          </svg>
                          HackerRank
                        </a>

                        {/* GeeksforGeeks */}
                        <a href="https://www.geeksforgeeks.org/profile/23it100fyb" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:underline text-[#39ff14]/90 hover:text-[#39ff14] font-mono font-bold flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#2f8d46] fill-current" viewBox="0 0 24 24">
                            <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1.8 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
                          </svg>
                          GeeksforGeeks
                        </a>

                        {/* Codeforces */}
                        <a href="https://codeforces.com/profile/unnati_1711" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:underline text-[#39ff14]/90 hover:text-[#39ff14] font-mono font-bold flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <rect x="3" y="10" width="4.5" height="11" rx="1" fill="#FFCA28" />
                            <rect x="9.75" y="5" width="4.5" height="16" rx="1" fill="#2196F3" />
                            <rect x="16.5" y="13" width="4.5" height="8" rx="1" fill="#F44336" />
                          </svg>
                          Codeforces
                        </a>

                        {/* CodeChef */}
                        <a href="https://www.codechef.com/users/span_frogs_65" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:underline text-[#39ff14]/90 hover:text-[#39ff14] font-mono font-bold flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#a06840] fill-current" viewBox="0 0 24 24">
                            <path d="M11.2574.0039c-.37.0101-.7353.041-1.1003.095C9.6164.153 9.0766.4236 8.482.694c-.757.3244-1.5147.6486-2.2176.7027-1.1896.3785-1.568.919-1.8925 1.3516 0 .054-.054.1079-.054.1079-.4325.865-.4873 1.73-.325 2.5952.1621.5407.3786 1.0282.5408 1.5148.3785 1.0274.7578 2.0007.92 3.1362.1622.3244.3235.7571.4316 1.1897.2704.8651.542 1.8383 1.353 2.5952l.0057-.0028c.0175.0183.0301.0387.0482.0568.0072-.0036.0141-.0063.0213-.0099l-.0213-.5849c.6489-.9733 1.5673-1.6221 2.865-1.8925.5195-.1093 1.081-.1497 1.6625-.1278a8.7733 8.7733 0 0 1 1.7988.2357c1.4599.3785 2.595 1.1358 2.6492 1.7846.0273.3549.0398.6952.0326 1.0364-.001.064-.0046.1285-.007.193l.1362.0682c.075-.0375.1424-.107.2059-.1902.0008-.001.002-.002.0028-.0028.0018-.0023.0039-.0061.0057-.0085.0396-.0536.0747-.1236.1107-.1931.0188-.0377.0372-.0866.0554-.1292.2048-.4622.362-1.1536.538-1.9635.0541-.2703.1092-.4864.1633-.7027.4326-.9733 1.0266-1.8382 1.6213-2.6492.9733-1.3518 1.8928-2.5962 1.7846-4.0561-1.784-3.4608-4.2718-4.0017-5.5695-4.272-.2163-.0541-.3233-.0539-.4856-.108-1.3382-.2433-2.4945-.3953-3.6046-.3648zm5.0428 14.3788a9.8602 9.8602 0 0 0-.0326-.9824c-.0541-.703-1.1892-1.46-2.7032-1.8386-.588-.1336-1.1764-.2142-1.7448-.2356-.539-.0137-1.0657.0248-1.5546.1277-1.2436.2704-2.2162.9193-2.811 1.8925l.0511 1.431c.6672-.3558 1.7326-.8747 3.139-.9994.0662-.0059.1368-.0059.2044-.0099.1177-.013.2667-.044.4444-.044 1.6075 0 3.2682.5336 4.8767 1.6483.039-.2744.0611-.549.071-.8234l.044.0227c.0028-.0622.0143-.1268.0156-.1888z"/>
                          </svg>
                          CodeChef
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#39ff14]/50 font-mono tracking-wider pt-2 border-t border-[#39ff14]/10">
                _Click Screen or Desk to Return to Center_
              </div>
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
      <group position={[0, -0.175, -0.12]} scale={1.45}>
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
          <meshStandardMaterial color="#e5e5e4" roughness={0.9} />
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
          <mesh geometry={nodes.lights_red.geometry} material={toyTaillightMaterial || materials.Taillight_Glass} position={[0.913, -0.004, -0.006]} />
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
          <mesh geometry={nodes.brakes.geometry} material={toyTaillightMaterial || materials.Taillight_Glass} position={[1.989, -0.004, 0.2]} />
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
