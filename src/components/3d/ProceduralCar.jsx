import React, { useRef, useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'

export default function ProceduralCar({ onIntroComplete }) {
  const groupRef = useRef()
  const chassisRef = useRef()
  const wheelFL = useRef() 
  const wheelFR = useRef() 
  const wheelBL = useRef() 
  const wheelBR = useRef() 

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onIntroComplete) onIntroComplete()
      }
    })

    // Wheels start behind the car (off-screen right)
    gsap.set([wheelFL.current.position, wheelFR.current.position, wheelBL.current.position, wheelBR.current.position], { x: 15 })

    // Target positions for the wheels to fit the Porsche silhouette
    const posFL = { x: -1.3, y: 0.35, z: -1.0 }
    const posBL = { x: 1.4, y: 0.35, z: -1.0 } // Front/back are flipped because shape goes from -X to +X. Wait: X is front-to-back? Yes, shape coordinates: -2.3 front, 2.3 rear. Wait, if X is length, then front is -1.3, rear is 1.4. Left/Right is Z. Z offset is +/- 1.0. 
    // Wait, let's remap: Z is depth. Z goes from -0.9 to 0.9.
    const wZ = 1.0; 
    
    // Front Left (Z: -1.0, X: -1.4)
    // Front Right (Z: 1.0, X: -1.4)
    // Back Left (Z: -1.0, X: 1.4)
    // Back Right (Z: 1.0, X: 1.4)

    const rollDuration = 1.5
    // Drive wheels in from behind the car (X axis)
    tl.to([wheelFL.current.position, wheelFR.current.position], { x: posFL.x, duration: rollDuration, ease: "power3.out" }, 0)
    tl.to([wheelBL.current.position, wheelBR.current.position], { x: posBL.x, duration: rollDuration, ease: "power3.out" }, 0)

    // Roll wheels (Z axis) to match the driving motion
    tl.to([wheelFL.current.rotation, wheelBL.current.rotation, wheelFR.current.rotation, wheelBR.current.rotation], { z: `+=${Math.PI * 6}`, duration: rollDuration, ease: "power3.out" }, 0)

    // Chassis bump
    tl.to(groupRef.current.position, { y: "+=0.2", duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }, ">")

    // 360 Spin (Rotate around Y axis)
    tl.to(groupRef.current.rotation, { 
      y: Math.PI * 2, 
      duration: 2.5, 
      ease: "power3.inOut" 
    }, ">+0.2")

    // Idle float
    tl.add(() => {
      gsap.to(groupRef.current.position, {
        y: 0.05,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      })
    })

    return () => {
      tl.kill()
    }
  }, [onIntroComplete])

  // Create Porsche Silhouette Shape
  const porscheShape = useMemo(() => {
    const shape = new THREE.Shape()
    // Start at bottom front
    shape.moveTo(-2.2, 0.2)
    // Front nose curve
    shape.quadraticCurveTo(-2.2, 0.45, -1.8, 0.55)
    // Hood slope
    shape.quadraticCurveTo(-1.0, 0.7, -0.5, 0.8)
    // Windshield to roof peak
    shape.quadraticCurveTo(0.2, 1.25, 0.6, 1.25)
    // Roof slope down to rear
    shape.quadraticCurveTo(1.6, 1.05, 2.1, 0.65)
    // Rear ducktail spoiler
    shape.quadraticCurveTo(2.3, 0.7, 2.3, 0.5)
    // Rear bumper
    shape.lineTo(2.2, 0.2)
    // Bottom flat
    shape.lineTo(-2.2, 0.2)
    return shape
  }, [])

  const extrudeSettings = {
    depth: 1.6,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 2,
    bevelSize: 0.15,
    bevelThickness: 0.15,
  }

  return (
    <group ref={groupRef}>
      {/* Chassis: Extruded Porsche Silhouette */}
      <mesh ref={chassisRef} position={[0, 0, -0.8]} castShadow receiveShadow>
        <extrudeGeometry args={[porscheShape, extrudeSettings]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" // Sleek dark grey/black
          roughness={0.1} 
          metalness={0.6} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
        />
      </mesh>

      {/* Headlights (Simple spheres on the hood) */}
      <mesh position={[-1.7, 0.6, -0.5]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-1.7, 0.6, 0.5]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights (Red strip at the back) */}
      <mesh position={[2.2, 0.55, 0]} castShadow>
        <boxGeometry args={[0.1, 0.05, 1.4]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>

      {/* Wheels */}
      {/* Note: In this shape, X is length, Z is depth. Wheels must be positioned correctly */}
      <Wheel ref={wheelFL} position={[-1.3, 0.35, -1.0]} />
      <Wheel ref={wheelFR} position={[-1.3, 0.35, 1.0]} />
      <Wheel ref={wheelBL} position={[1.4, 0.35, -1.0]} />
      <Wheel ref={wheelBR} position={[1.4, 0.35, 1.0]} />
    </group>
  )
}

const Wheel = React.forwardRef(({ position }, ref) => {
  return (
    <group ref={ref} position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.35, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        {/* We make the rim stick out slightly on both sides */}
        <cylinderGeometry args={[0.25, 0.25, 0.38, 16]} />
        <meshStandardMaterial color="#dddddd" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
})
