

import React, { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MEETING_ROOMS } from "./MeetingRoom";

/* ===============================
   STATUS COLORS (Niagara only)
================================ */
const STATUS_COLORS = {
  alarm: { text: "#ff4d4d", bg: "rgba(255,0,0,0.18)" },
  fault: { text: "#ffa94d", bg: "rgba(255,165,0,0.18)" },
  down: { text: "#c7a000", bg: "rgba(255,215,0,0.18)" },
  stale: { text: "#b08b5c", bg: "rgba(210,180,140,0.18)" },
  overridden: { text: "#b48cff", bg: "rgba(180,140,255,0.18)" },
  disabled: { text: "#aaa", bg: "rgba(200,200,200,0.18)" },
  ok: { text: "#00ff88", bg: "rgba(255,255,255,0.05)" }
};

const normalizeStatus = (status = "") => {
  const clean = status
    .replace(/[{}]/g, "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  return STATUS_COLORS[clean] ? clean : "ok";
};

export default function LightInfoCard3D({ hoveredMeshName }) {
  const { scene } = useThree();

  /* ===============================
     LIGHT DATA STATE
  =============================== */
  const [lightData, setLightData] = useState(null);

  /* ===============================
     ONLY USE NIAGARA-MAPPED LIGHTS
  =============================== */
  const lightId =
    hoveredMeshName &&
    window.__niagaraLightCache &&
    window.__niagaraLightCache[hoveredMeshName]
      ? hoveredMeshName
      : null;

  /* ===============================
     PRELOAD FROM CACHE
  =============================== */
  useEffect(() => {
    if (!lightId) return;

    const cache = window.__niagaraLightCache[lightId];

    if (cache) {
      setLightData(cache);
    }
  }, [lightId]);

 /* ===============================
   NIAGARA EVENT LISTENER (THROTTLED 10s)
=============================== */
useEffect(() => {
  if (!lightId) return;

  // ⏱ Track last update per light
  const lastUpdateRef = {};

  const THROTTLE_MS = 5_000; // 10 seconds

  const handler = (e) => {

    const d = e?.detail;

    if (!d || d.lightId !== lightId) return;

    const now = Date.now();

    // ⛔ Throttle per light
    if (
      lastUpdateRef[lightId] &&
      now - lastUpdateRef[lightId] < THROTTLE_MS
    ) {
      return;
    }

    lastUpdateRef[lightId] = now;

    console.log("💡 Throttled Light Card:", lightId, d);

    setLightData(d);
  };

  window.addEventListener("niagara-light-update", handler);

  return () => {
    window.removeEventListener("niagara-light-update", handler);
  };

}, [lightId]);

  /* ===============================
     HARD STOP — NO ORD → NO CARD
  =============================== */
  if (!lightId || !lightData) {
    return null;
  }

  const target = scene.getObjectByName(lightId);
  if (!target) {
    return null;
  }

  const position = new THREE.Vector3();
  target.getWorldPosition(position);

  const { displayName, percentage, status } = lightData;

  const cleanStatus = normalizeStatus(status);
  const statusStyle = STATUS_COLORS[cleanStatus];

  /* ===============================
     RENDER (NO NESTED CARD)
  =============================== */
  return (
    <Html position={position} center>
      <div
        style={{
          background: "rgba(10,10,15,0.9)",
          padding: "8px 10px",
          borderRadius: 10,
          minWidth: 220,
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.05)",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "11px"
        }}
      >
        {/* ===== HEADING ===== */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 6,
            color: "#f9ca24",
            fontSize: "13px",
            fontWeight: 400
          }}
        >
          💡 {displayName || lightId}
        </div>

        {/* ===== BRIGHTNESS ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6
          }}
        >
          <span>Brightness</span>
          <span>{Number(percentage).toFixed(1)}%</span>
        </div>

        {/* ===== NIAGARA STATUS ONLY ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 6,
            borderTop: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <span>Status</span>
          <span style={{ color: statusStyle.text }}>
            {status || "-"}
          </span>
        </div>
      </div>
    </Html>
  );
}
