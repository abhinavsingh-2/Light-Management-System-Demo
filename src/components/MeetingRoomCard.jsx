import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

export default function MeetingRoomCard3D({
  name = "Reception Area",
  position = [0, 2.5, 0],

  /* 🔑 CONTROLLABLE FROM MeetingRoom.jsx */
  heightMultiplier = 1,
  anchorY = -0.7,
  cardOffset = 0.3,
}) {
  const groupRef = useRef();
  const cardRef = useRef();
  const lineRef = useRef();
  const { camera } = useThree();

  /* ===============================
     DRAW CARD TEXTURE
  =============================== */
  useEffect(() => {
    if (!cardRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const w = 1024;
    const h = 512;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    const r = 20;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = "bold 152px Montserrat";
    ctx.fillText(name, w / 2, h / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    cardRef.current.material.map = texture;
    cardRef.current.material.transparent = true;
    cardRef.current.material.needsUpdate = true;
  }, [name]);

  /* ===============================
     CAMERA FACING + HEIGHT
  =============================== */
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Always face camera
    groupRef.current.lookAt(camera.position);

    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    const distance = camera.position.distanceTo(worldPos);

    const targetHeight = THREE.MathUtils.clamp(
      distance * 0.15 * heightMultiplier,
      0.4,
      3.5
    );

    if (lineRef.current) {
      const speed = 2.0;
      const current = lineRef.current.scale.y;
      const next = THREE.MathUtils.lerp(current, targetHeight, speed * delta);

      lineRef.current.scale.y = next;
      lineRef.current.position.y = next / 2 + anchorY;

      if (cardRef.current) {
        cardRef.current.position.y = next + anchorY + cardOffset;
      }
    }
  });

  /* ===============================
     RENDER
  =============================== */
  return (
    <group ref={groupRef} position={position}>
      {/* CARD */}
      <mesh ref={cardRef}>
        <planeGeometry args={[1.6, 0.8]} />
        <meshBasicMaterial transparent side={THREE.DoubleSide} />
      </mesh>

      {/* ANCHOR DOT */}
      <mesh position={[0, anchorY, 0]}>
        <circleGeometry args={[0.018, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* LINE (START NON-ZERO!) */}
      <mesh ref={lineRef} scale={[1, 0.6, 1]}>
        <planeGeometry args={[0.01, 1]} />
        <meshBasicMaterial color="white" transparent />
      </mesh>
    </group>
  );
}
