import React from "react";

const OccupancyGauge = ({ occupied = false, size = 100 }) => {
  // 🔹 Updated occupied color to blue
  const color = occupied ? "#ff4545ff" : "#00ff7f";
  const label = occupied ? "Occupied" : "Unoccupied";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size + 20}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Circle with colored border and pulse */}
      <div
        style={{
          width: `${size * 0.6}px`,
          height: `${size * 0.6}px`,
          borderRadius: "50%",
          background: occupied
            ? "radial-gradient(circle at 30% 30%,  #ff4545ff, #ff4545ff)" // 🔹 Blue gradient
            : "radial-gradient(circle at 30% 30%, #00ff7f, #00ff7f )",
          border: `4px solid ${color}`,
          boxShadow: occupied
            ? `0 0 15px 4px ${color}80`
            : `0 0 6px 2px rgba(0,0,0,0.1)`,
          transition:
            "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
          animation: occupied ? "pulse 1.8s infinite ease-in-out" : "none",
        }}
      />

      {/* Label */}
      <div
        style={{
          marginTop: "10px",
          fontWeight: "600",
          fontSize: "16px",
          color: color,
          transition: "color 0.4s ease",
        }}
      >
        {label}
      </div>

      {/* Pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0px ${color}80; }
            50% { box-shadow: 0 0 25px 10px ${color}40; }
            100% { box-shadow: 0 0 0px ${color}80; }
          }
        `}
      </style>
    </div>
  );
};

export default OccupancyGauge;






// //import React, { Suspense } from "react";
// import { Canvas } from "@react-three/fiber";
// import { PerspectiveCamera, Stage, Float } from "@react-three/drei";

// // --- 3D COMPONENTS ---

// const ChairModel = ({ color }) => (
//   <group scale={0.8} position={[0, -0.5, 0]}>
//     {/* Chair Seat */}
//     <mesh position={[0, 0.5, 0]}>
//       <boxGeometry args={[1, 0.15, 1]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//     {/* Chair Back */}
//     <mesh position={[0, 1, -0.45]}>
//       <boxGeometry args={[1, 1, 0.15]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//     {/* Chair Base/Leg */}
//     <mesh position={[0, 0.1, 0]}>
//       <cylinderGeometry args={[0.05, 0.05, 0.8]} />
//       <meshStandardMaterial color="#444" />
//     </mesh>
//     <mesh position={[0, -0.3, 0]}>
//       <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
//       <meshStandardMaterial color="#222" />
//     </mesh>
//   </group>
// );

// const HumanModel = () => (
//   <group scale={0.7} position={[0, 0.1, 0.1]}>
//     {/* Torso */}
//     <mesh position={[0, 0.8, 0]}>
//       <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
//       <meshStandardMaterial color="#d0d0d0" />
//     </mesh>
//     {/* Head */}
//     <mesh position={[0, 1.6, 0]}>
//       <sphereGeometry args={[0.22, 32, 32]} />
//       <meshStandardMaterial color="#d0d0d0" />
//     </mesh>
//     {/* Legs (Sitting position) */}
//     <mesh position={[0.2, 0.4, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
//       <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
//       <meshStandardMaterial color="#d0d0d0" />
//     </mesh>
//     <mesh position={[-0.2, 0.4, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
//       <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
//       <meshStandardMaterial color="#d0d0d0" />
//     </mesh>
//   </group>
// );

// // --- MAIN COMPONENT ---

// const OccupancyGauge = ({ occupied = false, size = 100 }) => {
//   const color = occupied ? "#1f1fc4" : "#ff4545ff";
//   const label = occupied ? "Occupied" : "Unoccupied";

//   return (
//     <div
//       style={{
//         width: `${size}px`,
//         height: `${size + 40}px`, // Increased slightly for 3D depth
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         position: "relative",
//       }}
//     >
//       {/* 3D Scene replacing the CSS Circle */}
//       <div
//         style={{
//           width: `${size}px`,
//           height: `${size}px`,
//           position: "relative",
//           animation: occupied ? "pulse 1.8s infinite ease-in-out" : "none",
//           borderRadius: "50%",
//         }}
//       >
//         <Canvas shadows>
//           <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={40} />
//           <ambientLight intensity={0.7} />
//           <pointLight position={[5, 5, 5]} intensity={1} />
          
//           <Suspense fallback={null}>
//             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
//                <ChairModel color={color} />
//                {occupied && <HumanModel />}
//             </Float>
//           </Suspense>
//         </Canvas>
//       </div>

//       {/* Label */}
//       <div
//         style={{
//           marginTop: "10px",
//           fontWeight: "600",
//           fontSize: "16px",
//           color: color,
//           transition: "color 0.4s ease",
//         }}
//       >
//         {label}
//       </div>

//       <style>
//         {`
//           @keyframes pulse {
//             0% { filter: drop-shadow(0 0 0px ${color}80); }
//             50% { filter: drop-shadow(0 0 15px ${color}); }
//             100% { filter: drop-shadow(0 0 0px ${color}80); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default OccupancyGauge;