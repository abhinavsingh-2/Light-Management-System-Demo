import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// --- 3D Bulb Component ---
const Bulb3D = ({ fillLevel }) => {
  const bulbRef = useRef();
  const lightRef = useRef();
  
  // Normalize fill for color interpolation (0 to 1)
  const factor = fillLevel / 100;

  useFrame((state) => {
    if (bulbRef.current) {
      const time = state.clock.getElapsedTime();
      // Flicker effect: subtle pulse when lit
      const flicker = 0.97 + Math.sin(time * 15) * 0.03;

      // ILLUSION: Interpolate color from White (#ffffff) to Yellow (#ffeb3b)
      // We use Three.js Color.lerp for a smooth transition
      const white = new THREE.Color("#ffffff");
      const yellow = new THREE.Color("#ffeb3b");
      bulbRef.current.color.lerpColors(white, yellow, factor);
      
      // Update emissive (glow) properties based on fill
      bulbRef.current.emissive.lerpColors(new THREE.Color("#000000"), yellow, factor);
      bulbRef.current.emissiveIntensity = factor * 1.5 * flicker;
    }
    
    if (lightRef.current) {
      lightRef.current.intensity = factor * 2;
    }
  });

  return (
    <group scale={0.75} position={[0, -0.6, 0]}>
      {/* Bulb Glass Shell */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          ref={bulbRef}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Metal Base */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.6, 16]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.15, 16]} />
          <meshStandardMaterial color="#666" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Point light to illuminate the 3D scene */}
      <pointLight ref={lightRef} position={[0, 1.2, 0]} color="#ffeb3b" />
    </group>
  );
};

// --- Main Component (Structure preserved) ---
const LightHoursBulb = ({ value = 0, max = 24, size = 80 }) => {
  const targetPercentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const [fillLevel, setFillLevel] = useState(0);

  // PRESERVED ANIMATION LOGIC
  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setFillLevel(targetPercentage * progress);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [targetPercentage]);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size + 30}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 3D Canvas replacing SVG */}
      <div style={{ width: "100%", height: "100%", cursor: "grab" }}>
        <Canvas camera={{ position: [0, 1, 4.2], fov: 35 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          
          <Bulb3D fillLevel={fillLevel} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
          />
        </Canvas>
      </div>

      {/* PRESERVED LABEL */}
      <div
        style={{
          marginTop: "-5px",
          textAlign: "center",
          color: "#fbc02d",
          fontWeight: "600",
          fontSize: "15px",
          pointerEvents: "none"
        }}
      >
        {value} hrs
      </div>
    </div>
  );
};

export default LightHoursBulb;