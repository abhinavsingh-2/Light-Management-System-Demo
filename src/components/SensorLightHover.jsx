import { Html, Billboard } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MEETING_ROOMS } from "./MeetingRoom";

/*
  DISPLAY ONLY
  Hover detection comes from SceneCanvas.jsx
*/

export default function SensorLightHover({ hoveredMeshName }) {
  const { scene } = useThree();

  if (!hoveredMeshName) return null;

  let hoveredRoom = null;
  let hoveredType = null;

  for (const room of MEETING_ROOMS) {
    if (room.light?.meshes?.includes(hoveredMeshName)) {
      hoveredRoom = room;
      hoveredType = "light";
      break;
    }
    if (room.sensor?.meshes?.includes(hoveredMeshName)) {
      hoveredRoom = room;
      hoveredType = "sensor";
      break;
    }
  }

  if (!hoveredRoom) return null;

  const target = scene.getObjectByName(hoveredMeshName);
  if (!target) return null;

  const position = new THREE.Vector3();
  target.getWorldPosition(position);

  /* 🔑 MOCK VALUES (replace later from Niagara if needed) */
  const sensorValues = {
    temp: "24.6°C",
    humidity: "52%",
    lux: "310 lx",
    sound: "38 dB",
    presence: "Yes",
  };

  const lightValues = {
    brightness: "75%",
    status: "OK",
  };

  /* 🔑 Value pill style */
  const valuePill = (bg, color = "#fff") => ({
    background: bg,
    padding: "2px 6px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 600,
    color,
    minWidth: 44,
    textAlign: "right",
  });

  return (
    <Billboard follow position={position}>
      <Html center transform distanceFactor={10} pointerEvents="none">
        {/* ================= SENSOR CARD ================= */}
        {hoveredType === "sensor" && (
          <div
            style={{
              width: 160,
              background: "rgba(12,14,18,0.9)",
              borderRadius: 8,
              padding: "8px 10px",
              color: "#fff",
              fontSize: 10,
              lineHeight: "14px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.45)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            <div
              style={{
                color: "#4aa3ff",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {hoveredMeshName}
            </div>

            {[
              ["🌡 Temp", sensorValues.temp, "#1e3a8a"],
              ["💧 Humidity", sensorValues.humidity, "#065f46"],
              ["💡 Lux", sensorValues.lux, "#92400e"],
              ["🔊 Sound", sensorValues.sound, "#374151"],
              ["🧍 Presence", sensorValues.presence, "#14532d"],
            ].map(([label, value, bg]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span>{label}</span>
                <span style={valuePill(bg)}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ================= LIGHT CARD ================= */}
        {hoveredType === "light" && (
          <div
            style={{
              width: 160,
              background: "rgba(12,14,18,0.9)",
              borderRadius: 8,
              padding: "8px 10px",
              color: "#fff",
              fontSize: 10,
              lineHeight: "14px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.45)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              <span style={{ color: "#f5c542" }}>💡</span>
              <span>{hoveredMeshName}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span>Brightness</span>
              <span style={valuePill("#92400e")}>
                {lightValues.brightness}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Status</span>
              <span style={valuePill("#14532d", "#3cff7a")}>
                {lightValues.status}
              </span>
            </div>
          </div>
        )}
      </Html>
    </Billboard>
  );
}
