import React, { useRef, useLayoutEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

export default function Ferrari({ onIntroComplete, ...props }) {
  const { nodes, materials } = useGLTF('/models/ferrari.glb')
  
  const groupRef = useRef()
  const chassisRef = useRef()
  const wheelRR = useRef()
  const wheelRL = useRef()
  const wheelFL = useRef()
  const wheelFR = useRef()

  useLayoutEffect(() => {
    // Setup materials for true glowing emissive "eyes" (only main projector headlights, not the side turn signals)
    materials.Projector_Glass.emissive = new THREE.Color("#ffffff")
    materials.Projector_Glass.emissiveIntensity = 0

    // Taillights subtle red glow
    materials.Taillight_Glass.emissive = new THREE.Color("#ff0000")
    materials.Taillight_Glass.emissiveIntensity = 0

    // Setup main windshield/window glass to be black and semi-transparent
    materials.Glass_Gray.color = new THREE.Color("#000000")
    materials.Glass_Gray.transparent = true
    materials.Glass_Gray.opacity = 0.35 // Semi-transparent to reveal the seats inside
    materials.Glass_Gray.roughness = 0.05
    materials.Glass_Gray.metalness = 0.9
    if (materials.Glass_Gray.clearcoat !== undefined) {
      materials.Glass_Gray.clearcoat = 1.0
      materials.Glass_Gray.clearcoatRoughness = 0.05
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (onIntroComplete) onIntroComplete()
      }
    })

    // In this GLTF: Z is Length (Front = -Z, Rear = +Z), X is Width (Left = -X, Right = +X)
    // We scaled chassis length by 1.15 and width by 1.1
    const posRL_X = -0.821 * 1.1
    const posFL_X = -0.843 * 1.1
    const posRR_X = 0.824 * 1.1
    const posFR_X = 0.829 * 1.1
    
    const posRL_Z = 1.495 * 1.15
    const posFL_Z = -1.155 * 1.15
    const posRR_Z = 1.496 * 1.15
    const posFR_Z = -1.154 * 1.15

    // Initial state: Wheels way off-screen to the left and right (X axis)
    // We set Euler order to ZYX to avoid Gimbal lock. This ensures Z is applied last (as global Z),
    // allowing the wheels to perfectly roll like a hoop without tumbling!
    wheelRL.current.rotation.order = "ZYX"
    wheelFL.current.rotation.order = "ZYX"
    wheelRR.current.rotation.order = "ZYX"
    wheelFR.current.rotation.order = "ZYX"

    // We rotate them 90 degrees on Y so they face the camera.
    gsap.set(wheelRL.current.position, { x: -15, z: posRL_Z })
    gsap.set(wheelRL.current.rotation, { x: -Math.PI / 2, y: Math.PI / 2, z: 0 })

    gsap.set(wheelFL.current.position, { x: -15, z: posFL_Z })
    gsap.set(wheelFL.current.rotation, { x: -Math.PI / 2, y: Math.PI / 2, z: 0 })

    gsap.set(wheelRR.current.position, { x: 15, z: posRR_Z })
    gsap.set(wheelRR.current.rotation, { x: -Math.PI / 2, y: -Math.PI / 2, z: 0 })

    gsap.set(wheelFR.current.position, { x: 15, z: posFR_Z })
    gsap.set(wheelFR.current.rotation, { x: -Math.PI / 2, y: -Math.PI / 2, z: 0 })
    
    // Chassis starts faded/scaled down. Initial rotation forced to face camera
    gsap.set(groupRef.current.rotation, { y: Math.PI })
    gsap.set(groupRef.current.scale, { x: 0.01, y: 0.01, z: 0.01 })

    // Step 1: Chassis comes in and scales up
    tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: "power3.out" })

    // Step 2: Wheels attach sequentially (Back Left, Back Right, Front Left, Front Right)
    // They roll in like a hoop (animating Z), then snap to their attached position (animating Y)
    const rDur = 0.8 // Roll duration (faster)
    const sDur = 0.2 // Snap duration (faster)
    const spinAmt = Math.PI * 4
    
    // Back Left (RL)
    tl.to(wheelRL.current.position, { x: posRL_X, duration: rDur, ease: "power1.out" }, "+=0.2")
    tl.to(wheelRL.current.rotation, { z: `-=${spinAmt}`, duration: rDur, ease: "power1.out" }, "<")
    tl.to(wheelRL.current.rotation, { y: 0, duration: sDur, ease: "power2.inOut" })
    
    // Back Right (RR)
    tl.to(wheelRR.current.position, { x: posRR_X, duration: rDur, ease: "power1.out" })
    tl.to(wheelRR.current.rotation, { z: `+=${spinAmt}`, duration: rDur, ease: "power1.out" }, "<")
    tl.to(wheelRR.current.rotation, { y: 0, duration: sDur, ease: "power2.inOut" })
    
    // Front Left (FL)
    tl.to(wheelFL.current.position, { x: posFL_X, duration: rDur, ease: "power1.out" })
    tl.to(wheelFL.current.rotation, { z: `-=${spinAmt}`, duration: rDur, ease: "power1.out" }, "<")
    tl.to(wheelFL.current.rotation, { y: 0, duration: sDur, ease: "power2.inOut" })
    
    // Front Right (FR)
    tl.to(wheelFR.current.position, { x: posFR_X, duration: rDur, ease: "power1.out" })
    tl.to(wheelFR.current.rotation, { z: `+=${spinAmt}`, duration: rDur, ease: "power1.out" }, "<")
    tl.to(wheelFR.current.rotation, { y: 0, duration: sDur, ease: "power2.inOut" })

    // Step 3: Chassis bump as wheels lock in
    tl.to(chassisRef.current.position, { y: "+=0.05", duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" })

    // Step 4: Move slowly 360 degrees showing all the smartness
    tl.to(groupRef.current.rotation, { 
      y: `+=${Math.PI * 2}`, 
      duration: 3.5, // Sped up from 5s to 3.5s
      ease: "power2.inOut" 
    }, "+=0.3")

    // Step 5: After 360 spin — headlights power ON once and stay on
    tl.to(materials.Projector_Glass, { emissiveIntensity: 40, duration: 0.3, ease: "power2.inOut" }, "+=0.2")
    tl.to(materials.Taillight_Glass, { emissiveIntensity: 30, duration: 0.3, ease: "power2.inOut" }, "<")

    // Step 6: Immediately drive off zoom-past-camera transition
    tl.to(groupRef.current.position, {
      z: "+=12",
      duration: 0.9,
      ease: "power2.in"
    }, "+=0.15") // Shortly after lights turn on
    
    tl.to(materials.Projector_Glass, {
      emissiveIntensity: 100, // Bright flare as it drives towards camera
      duration: 0.9,
      ease: "power2.in"
    }, "<")
    
    tl.to(groupRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.9,
      ease: "power2.in"
    }, "<")

    tl.add(() => {
      if (onIntroComplete) onIntroComplete()
    })

    return () => {
      tl.kill()
    }
  }, [onIntroComplete])

  return (
    <group ref={groupRef} {...props} dispose={null} rotation={[0, Math.PI, 0]}>

      {/* Chassis / Body */}
      {/* Scaled X by 1.15 for length, Y by 1.1 for width to look more like a hypercar */}
      <group ref={chassisRef} position={[0, 0.676, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={[1.15, 1.1, 1]}>
        <mesh geometry={nodes.trim.geometry} material={materials.Leather_red} material-color="#111111" position={[-0.379, -0.004, -0.016]} />
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
        {/* HYPER-POLISHED BODY MATERIAL */}
        <mesh geometry={nodes.body.geometry} material={materials.Body_Color} material-color="#0a0a0a" material-roughness={0.05} material-metalness={0.9} material-clearcoat={1.0} material-envMapIntensity={3.0} position={[-0.005, 0, 0.022]} />
        <mesh geometry={nodes.blue.geometry} material={materials._0098_DodgerBlue} position={[-0.35, -0.435, 0.068]} />
        <mesh geometry={nodes.wipers.geometry} material={materials.Tires} position={[-1.089, 0.006, 0.11]} />
        <mesh geometry={nodes.yellow_trim.geometry} material={materials.Ferrari_Yellow} material-color="#ff0000" position={[-1.397, -0.003, 0.047]} />
        
        {/* Procedural Hardtop Roof - Flat Matte Black */}
        <mesh position={[0.15, 0.0, 0.495]} rotation={[0, 0.02, 0]}>
          <boxGeometry args={[0.85, 0.95, 0.02]} />
          <meshStandardMaterial color="#151515" roughness={0.7} metalness={0.2} envMapIntensity={0.5} />
        </mesh>

        {/* Mansory-style Rear Wing */}
        <group position={[1.7, 0, 0.3]}>
          {/* Left strut */}
          <mesh position={[0, -0.3, 0.1]} rotation={[0, 0, -Math.PI / 8]}>
            <boxGeometry args={[0.1, 0.02, 0.25]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Right strut */}
          <mesh position={[0, 0.3, 0.1]} rotation={[0, 0, -Math.PI / 8]}>
            <boxGeometry args={[0.1, 0.02, 0.25]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Main wing blade */}
          <mesh position={[0.05, 0, 0.25]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.2, 1.3, 0.02]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Wing endplates */}
          <mesh position={[0.05, -0.65, 0.2]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.25, 0.02, 0.2]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          <mesh position={[0.05, 0.65, 0.2]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.25, 0.02, 0.2]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
        </group>
      </group>
      
      {/* Wheel Rear Right */}
      <group ref={wheelRR} position={[0.824 * 1.1, 0.358, 1.496 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.wheel.geometry} material={materials.metal_gray} material-color="#cccccc" position={[0, 0, -0.001]} />
        <mesh geometry={nodes.tire.geometry} material={materials.Tires} position={[-0.005, 0, 0]} />
        <mesh geometry={nodes.rim_rr.geometry} material={materials.metal_gray} material-color="#cccccc" position={[0.125, 0, -0.001]} />
        <mesh geometry={nodes.centre.geometry} material={materials.Ferrari_Yellow} material-color="#ff0000" position={[0.113, 0, -0.001]} />
        <mesh geometry={nodes.brake.geometry} material={materials.metal_gray} material-color="#ff0000" position={[0.009, 0.001, -0.001]} />
        <mesh geometry={nodes.nuts.geometry} material={materials.Interior_dark} position={[0.103, 0, 0.006]} />
      </group>
      
      {/* Wheel Rear Left */}
      <group ref={wheelRL} position={[-0.821 * 1.1, 0.358, 1.495 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.tire_1.geometry} material={materials.Tires} position={[0.006, 0, 0]} />
        <mesh geometry={nodes.brake_1.geometry} material={materials.metal_gray} material-color="#ff0000" position={[-0.018, -0.001, -0.001]} />
        <mesh geometry={nodes.centre_1.geometry} material={materials.Ferrari_Yellow} material-color="#ff0000" position={[-0.113, 0, -0.001]} />
        <mesh geometry={nodes.wheel_1.geometry} material={materials.metal_gray} material-color="#cccccc" position={[0, 0, -0.001]} />
        <mesh geometry={nodes.rim_rl.geometry} material={materials.metal_gray} material-color="#cccccc" position={[-0.125, 0, -0.001]} />
        <mesh geometry={nodes.nuts_1.geometry} material={materials.Interior_dark} position={[-0.103, 0, 0.006]} />
      </group>
      
      {/* Wheel Front Left */}
      <group ref={wheelFL} position={[-0.843 * 1.1, 0.358, -1.155 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.rim_fl.geometry} material={materials.metal_gray} material-color="#cccccc" position={[-0.114, 0, -0.001]} />
        <mesh geometry={nodes.brake_2.geometry} material={materials.metal_gray} material-color="#ff0000" position={[-0.002, -0.001, -0.001]} />
        <mesh geometry={nodes.centre_2.geometry} material={materials.Ferrari_Yellow} material-color="#ff0000" position={[-0.102, 0, -0.001]} />
        <mesh geometry={nodes.nuts_2.geometry} material={materials.Interior_dark} position={[-0.094, 0, 0.006]} />
        <mesh geometry={nodes.wheel_2.geometry} material={materials.metal_gray} material-color="#cccccc" position={[0, 0, -0.001]} />
        <mesh geometry={nodes.tire_2.geometry} material={materials.Tires} position={[0.005, 0, 0]} />
      </group>
      
      {/* Wheel Front Right */}
      <group ref={wheelFR} position={[0.829 * 1.1, 0.361, -1.154 * 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.brake_3.geometry} material={materials.metal_gray} material-color="#ff0000" position={[0.001, 0, -0.001]} />
        <mesh geometry={nodes.centre_3.geometry} material={materials.Ferrari_Yellow} material-color="#ff0000" position={[0.102, 0, -0.001]} />
        <mesh geometry={nodes.wheel_3.geometry} material={materials.metal_gray} material-color="#cccccc" position={[0, 0, -0.001]} />
        <mesh geometry={nodes.rim_fr.geometry} material={materials.metal_gray} material-color="#cccccc" position={[0.114, 0, -0.001]} />
        <mesh geometry={nodes.tire_3.geometry} material={materials.Tires} position={[-0.005, 0, 0]} />
        <mesh geometry={nodes.nuts_3.geometry} material={materials.Interior_dark} position={[0.094, 0, 0.006]} />
      </group>
      
      {/* Steering Wheel */}
      <group position={[-0.346, 0.799, -0.346]} rotation={[-1.92, 0, 0]}>
        <mesh geometry={nodes.steering_carbon.geometry} material={materials.Carbon_Fiber} position={[0, 0.016, 0.006]} rotation={[Math.PI / 9, 0, 0]} />
        <mesh geometry={nodes.steering_centre.geometry} material={materials.Ferrari_Yellow} />
        <mesh geometry={nodes.steering_column.geometry} material={materials.Interior_dark} position={[0, 0.068, -0.015]} rotation={[Math.PI / 9, 0, 0]} />
        <mesh geometry={nodes.steering_leather.geometry} material={materials.Leather} position={[0, 0.015, 0.007]} rotation={[Math.PI / 9, 0, 0]} />
        <mesh geometry={nodes.steering_metal.geometry} material={materials.metal_gray} position={[0.086, 0.021, -0.066]} rotation={[Math.PI / 9, 0, 0]} />
        <mesh geometry={nodes.steering_red_lights.geometry} material={materials.Taillight_Glass} position={[0.006, 0.02, -0.072]} rotation={[Math.PI / 9, 0, 0]} />
        <mesh geometry={nodes.steering_trim.geometry} material={materials.Leather_red} material-color="#111111" position={[0, 0.016, -0.075]} rotation={[Math.PI / 9, 0, 0]} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/ferrari.glb')
