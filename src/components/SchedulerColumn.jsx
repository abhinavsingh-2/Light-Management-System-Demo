import React, { useRef, useMemo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useDashboard } from "./DashboardContext"; // ✅ PRESERVED

const HourglassModel = () => {
  const sandTopRef = useRef();
  const sandBottomRef = useRef();
  const streamRef = useRef();

  // Glass profile: creates the "X" shape
  const glassPoints = useMemo(() => [new THREE.Vector2(0, 0), new THREE.Vector2(0.6, 0.9)], []);
  
  // Clipping plane for the top sand to make the "level" drop
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 1), []);

  useFrame((state) => {
    // Very slow speed (0.05)
    const t = (state.clock.getElapsedTime() * 0.05) % 1;
    
    // Calculate the current height of the top sand level (drops from 0.9 to 0)
    const currentLevel = 0.9 * (1 - t);

    // 1. UPPER SAND (Inverted Triangle - Level Falling)
    if (sandTopRef.current) {
      clippingPlane.constant = currentLevel + 0.05;
    }

    // 2. DYNAMIC STREAM (Starts FROM the neck/bottom of top sand)
    if (streamRef.current) {
      if (t < 0.98) {
        streamRef.current.visible = true;
        const streamHeight = 1.0; 
        streamRef.current.scale.y = streamHeight;
        
        // Positioned at -0.4 to overlap the neck area
        streamRef.current.position.y = -0.4;
        
        // Add jitter for grain movement
        streamRef.current.scale.x = 0.7 + Math.random() * 0.3;
      } else {
        streamRef.current.visible = false;
      }
    }

    // 3. LOWER SAND (Growing from floor)
    if (sandBottomRef.current) {
      const bottomScale = t;
      sandBottomRef.current.scale.set(bottomScale, bottomScale, bottomScale);
      sandBottomRef.current.position.y = -1.0 + (0.45 * bottomScale); 
    }
  });

  const blueFrameMat = new THREE.MeshStandardMaterial({ color: "#0E60D3", metalness: 0.8, roughness: 0.2 });
  const glassMaterial = <meshPhysicalMaterial transparent opacity={0.15} transmission={0.9} thickness={1} roughness={0} />;
  const sandColor = "#3a3aff"; 

  return (
    <group scale={0.9}> {/* ✅ Scaled down to make it a little smaller */}
      {/* --- STAND --- */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.1, 32]} />
        <primitive object={blueFrameMat} attach="material" />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.1, 32]} />
        <primitive object={blueFrameMat} attach="material" />
      </mesh>

      {/* --- PILLARS --- */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos((i * 2 * Math.PI) / 3) * 0.65, 0, Math.sin((i * 2 * Math.PI) / 3) * 0.65]}>
          <cylinderGeometry args={[0.03, 0.03, 2.1, 16]} />
          <primitive object={blueFrameMat} attach="material" />
        </mesh>
      ))}

      {/* --- GLASS --- */}
      <mesh position={[0, 0.05, 0]}>
        <latheGeometry args={[glassPoints, 32]} />
        {glassMaterial}
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI, 0, 0]}>
        <latheGeometry args={[glassPoints, 32]} />
        {glassMaterial}
      </mesh>

      {/* --- SAND --- */}
      <mesh ref={sandTopRef} position={[0, 0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.57, 0.9, 32]} />
        <meshStandardMaterial 
          color={sandColor} 
          emissive={sandColor} 
          emissiveIntensity={0.5} 
          clippingPlanes={[clippingPlane]} 
        />
      </mesh>

      <mesh ref={streamRef}>
        <cylinderGeometry args={[0.012, 0.012, 1, 8]} />
        <meshStandardMaterial color={sandColor} emissive={sandColor} emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={sandBottomRef} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.57, 0.9, 32]} />
        <meshStandardMaterial color={sandColor} emissive={sandColor} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

const Hourglass = () => (
  <Box sx={{ position: "relative", width: 100, height: 220, margin: "0 auto 16px" }}>
    <Canvas gl={{ localClippingEnabled: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 2} 
        maxPolarAngle={Math.PI / 2} 
      />

      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <HourglassModel />
      </Float>
      {/* ✅ ContactShadows removed from here */}
    </Canvas>
  </Box>
);

export default function SchedulerColumn() {
  const { dashboardData } = useDashboard();
  const timerMinutes = dashboardData?.occupancyTimer ?? 5;

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Card sx={{ 
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
        height: "372px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "transparent",
        border: "2px solid rgba(255, 255, 255, 0.8)",
      }}>
        <CardContent sx={{ p: 0 }}>
          <Hourglass />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1, color: "white" }}>
            {timerMinutes} Minutes
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Occupancy Timer
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}