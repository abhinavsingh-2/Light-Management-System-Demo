import * as THREE from "three";

export default function LeaderRod({ start, end }) {
  const height = end.y - start.y;
  const midY = start.y + height / 2;

  return (
    <mesh
      position={[start.x, midY, start.z]}
      renderOrder={999}
    >
      <cylinderGeometry args={[0.03, 0.03, height, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
