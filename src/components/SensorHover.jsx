
// // src/components/SensorInfoCard3D.jsx

// import React, { useEffect, useState, useRef } from "react";
// import { Html } from "@react-three/drei";
// import { useThree } from "@react-three/fiber";
// import * as THREE from "three";
// import { MEETING_ROOMS } from "./MeetingRoom";

// /* ===============================
//    STATUS COLORS
// ================================ */
// const STATUS_COLORS = {
//   alarm: { text: "#ff4d4d", bg: "rgba(255,0,0,0.25)" },
//   unackedalarm: { text: "#ff8080", bg: "rgba(255,100,100,0.25)" },
//   fault: { text: "#ffa94d", bg: "rgba(255,165,0,0.25)" },
//   down: { text: "#ffd43b", bg: "rgba(255,215,0,0.25)" },
//   stale: { text: "#c19a6b", bg: "rgba(210,180,140,0.25)" },
//   overridden: { text: "#b48cff", bg: "rgba(180,140,255,0.25)" },
//   disabled: { text: "#aaaaaa", bg: "rgba(200,200,200,0.25)" },
//   ok: { text: "#ffffff", bg: "rgba(255,255,255,0.08)" }
// };

// const normalizeStatus = (status = "") => {
//   const clean = status
//     .replace(/[{}]/g, "")
//     .split(",")[0]
//     .trim()
//     .toLowerCase();

//   return STATUS_COLORS[clean] ? clean : "ok";
// };

// export default function SensorInfoCard3D({ hoveredMeshName }) {
//   const { scene } = useThree();

//   /* -----------------------------
//      Resolve SENSOR ID
//   ----------------------------- */
//   const sensorId = MEETING_ROOMS
//     .flatMap((r) => r.sensor?.meshes || [])
//     .includes(hoveredMeshName)
//     ? hoveredMeshName
//     : null;

//   /* -----------------------------
//      STATE
//   ----------------------------- */
//   const [data, setData] = useState({
//     displayName: undefined,
//     Temp: {},
//     RH: {},
//     Lux_Level: {},
//     Sound_Level: {},
//     Occ_Sts: {}
//   });

//   const [hoverKey, setHoverKey] = useState(null);
//   const lastUpdateRef = useRef(0);
//   const THROTTLE_MS = 20_000;

//   /* -----------------------------
//      RESET ON SENSOR CHANGE
//   ----------------------------- */
//   useEffect(() => {
//     if (!sensorId) return;

//     lastUpdateRef.current = 0;

//     setData({
//       displayName: undefined,
//       Temp: {},
//       RH: {},
//       Lux_Level: {},
//       Sound_Level: {},
//       Occ_Sts: {}
//     });
//   }, [sensorId]);

//   /* -----------------------------
//      PRELOAD CACHE
//   ----------------------------- */
//   useEffect(() => {
//     if (!sensorId) return;

//     const cache = window.__niagaraSensorCache?.[sensorId];
//     if (!cache) return;

//     setData((prev) => ({ ...prev, ...cache }));
//   }, [sensorId]);

//   /* -----------------------------
//      Niagara Listener
//   ----------------------------- */
//   useEffect(() => {
//     if (!sensorId) return;

//     const handler = (e) => {
//       const d = e?.detail;
//       if (!d || d.sensorId !== sensorId || !d.key) return;

//       const now = Date.now();

//       if (d.key === "Occ_Sts") {
//         setData((prev) => ({
//           ...prev,
//           Occ_Sts: {
//             value: d.value,
//             bool: d.bool,
//             raw: d.raw,
//             status: d.status
//           }
//         }));
//         return;
//       }

//       if (lastUpdateRef.current && now - lastUpdateRef.current < THROTTLE_MS) {
//         return;
//       }

//       lastUpdateRef.current = now;

//       setData((prev) => ({
//         ...prev,
//         [d.key]: {
//           value: d.value,
//           raw: d.raw,
//           status: d.status
//         },
//         displayName:
//           d.displayName !== undefined ? d.displayName : prev.displayName
//       }));
//     };

//     window.addEventListener("niagara-sensor-update", handler);
//     return () =>
//       window.removeEventListener("niagara-sensor-update", handler);
//   }, [sensorId]);

//   /* -----------------------------
//      Exit if no sensor
//   ----------------------------- */
//   if (!sensorId) return null;

//   const target = scene.getObjectByName(sensorId);
//   if (!target) return null;

//   const position = new THREE.Vector3();
//   target.getWorldPosition(position);

//   /* -----------------------------
//      Row Component
//   ----------------------------- */
//   const Row = ({ label, field }) => {
//     const row = data[field] || {};
//     const statusKey = normalizeStatus(row.status);
//     const statusColor = STATUS_COLORS[statusKey];

//     /* ===============================
//        PRESENCE ROW (UNCHANGED)
//     =============================== */
//     if (field === "Occ_Sts") {
//       const isOcc = row.bool === true;

//       let text = "-";
//       if (row.bool === true) text = "Occ";
//       else if (row.bool === false) text = "Unocc";

//       return (
//         <div
//           style={{ position: "relative", marginBottom: 8 }}
//           onMouseEnter={() => setHoverKey(field)}
//           onMouseLeave={() => setHoverKey(null)}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: "6px 8px",
//               borderRadius: 8
//             }}
//           >
//             <span>{label}</span>

//             <span
//               style={{
//                 padding: "4px 10px",
//                 borderRadius: 8,
//                 background: isOcc
//                   ? "rgba(255,77,77,0.25)"
//                   : "rgba(0,255,127,0.25)",
//                 color: isOcc ? "#ff4d4d" : "#00ff7f",
//                 fontSize: 12,
//                 fontWeight: 600,
//                 whiteSpace: "nowrap"
//               }}
//             >
//               {text}
//             </span>
//           </div>

//           {/* 🔹 NESTED STATUS CARD (ONLY ADDITION) */}
//           {/* {hoverKey === field && (
//             <div
//               style={{
//                 position: "absolute",
//                 left: "105%",
//                 top: 0,
//                 background: "#0e0e12",
//                 border: "1px solid #333",
//                 borderRadius: 10,
//                 padding: "6px 10px",
//                 fontSize: 12,
//                 whiteSpace: "nowrap",
//                 zIndex: 99999
//               }}
//             >
//               <div style={{ fontWeight: 600, marginBottom: 2 }}>
//                 Status
//               </div>
//               <div style={{ color: statusColor.text }}>
//                 {row.status ?? "ok"}
//               </div>
//             </div>
//           )} */}
//         </div>
//       );
//     }

//     /* ===============================
//        NORMAL ROW (UNCHANGED + HOVER CARD)
//     =============================== */
//     return (
//       <div
//         style={{ position: "relative", marginBottom: 8 }}
//         onMouseEnter={() => setHoverKey(field)}
//         onMouseLeave={() => setHoverKey(null)}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "6px 8px",
//             borderRadius: 8
//           }}
//         >
//           <span>{label}</span>

//           <span
//             style={{
//               padding: "4px 10px",
//               borderRadius: 8,
//               background: statusColor.bg,
//               color: statusColor.text,
//               fontSize: 12
//             }}
//           >
//             {"value" in row ? row.value : "-"}
//           </span>
//         </div>

//         {/* 🔹 NESTED STATUS CARD (ONLY ADDITION) */}
//         {hoverKey === field && (
//           <div
//             style={{
//               position: "absolute",
//               left: "105%",
//               top: 0,
//               background: "#0e0e12",
//               border: "1px solid #333",
//               borderRadius: 10,
//               padding: "6px 10px",
//               fontSize: 12,
//               whiteSpace: "nowrap",
//               zIndex: 99999
//             }}
//           >
//             {/* <div style={{ fontWeight: 600, marginBottom: 2 }}>
//               Status
//             </div> */}
//             <div style={{ color: statusColor.text }}>
//               {row.status ?? "ok"}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* -----------------------------
//      Render
//   ----------------------------- */
//   return (
//     <Html position={position} center>
//       <div
//         style={{
//           background: "rgba(10,10,15,0.96)",
//           padding: 12,
//           borderRadius: 16,
//           minWidth: 260,
//           color: "#fff"
//         }}
//       >
//         <div
//           style={{
//             textAlign: "center",
//             color: "#00e0ff",
//             marginBottom: 10,
//             fontWeight: 600
//           }}
//         >
//           {data.displayName ?? sensorId}
//         </div>

//         <Row label="🌡 Temperature" field="Temp" />
//         <Row label="💧 Humidity" field="RH" />
//         <Row label="💡 Lux" field="Lux_Level" />
//         <Row label="🔊 Sound Level" field="Sound_Level" />
//         <Row label="🧍 Presence Status" field="Occ_Sts" />
//       </div>
//     </Html>
//   );
// }







// src/components/SensorInfoCard3D.jsx

import React, { useEffect, useState, useRef } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MEETING_ROOMS } from "./MeetingRoom";

/* ===============================
   STATUS COLORS
================================ */
const STATUS_COLORS = {
  alarm: { text: "#ff4d4d", bg: "rgba(255,0,0,0.25)" },
  unackedalarm: { text: "#ff8080", bg: "rgba(255,100,100,0.25)" },
  fault: { text: "#ffa94d", bg: "rgba(255,165,0,0.25)" },
  down: { text: "#ffd43b", bg: "rgba(255,215,0,0.25)" },
  stale: { text: "#c19a6b", bg: "rgba(210,180,140,0.25)" },
  overridden: { text: "#b48cff", bg: "rgba(180,140,255,0.25)" },
  disabled: { text: "#aaaaaa", bg: "rgba(200,200,200,0.25)" },
  ok: { text: "#ffffff", bg: "rgba(255,255,255,0.08)" }
};

const normalizeStatus = (status = "") => {
  const clean = status
    .replace(/[{}]/g, "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  return STATUS_COLORS[clean] ? clean : "ok";
};

export default function SensorInfoCard3D({ hoveredMeshName }) {
  const { scene } = useThree();

  /* -----------------------------
     Resolve SENSOR ID
  ----------------------------- */
  const sensorId = MEETING_ROOMS
    .flatMap((r) => r.sensor?.meshes || [])
    .includes(hoveredMeshName)
    ? hoveredMeshName
    : null;

  /* -----------------------------
 ACTIVATE NIAGARA (REQUIRED)
----------------------------- */
  useEffect(() => {
    if (!sensorId) return;

    console.log("🚀 Activating Niagara for sensor:", sensorId);

    window.dispatchEvent(
      new CustomEvent("niagara-activate-sensors", {
        detail: {
          sensors: [sensorId]
        }
      })
    );
  }, [sensorId]);


  /* -----------------------------
     STATE
  ----------------------------- */
  const [data, setData] = useState({
    displayName: undefined,
    Temp: {},
    RH: {},
    Lux_Level: {},
    Sound_Level: {},
    Occ_Sts: {}
  });

  const [hoverKey, setHoverKey] = useState(null);
  const lastUpdateRef = useRef(0);
  const THROTTLE_MS = 20_000;

  /* -----------------------------
     RESET ON SENSOR CHANGE
  ----------------------------- */
  useEffect(() => {
    if (!sensorId) return;

    lastUpdateRef.current = 0;

    setData({
      displayName: undefined,
      Temp: {},
      RH: {},
      Lux_Level: {},
      Sound_Level: {},
      Occ_Sts: {}
    });
  }, [sensorId]);

  /* -----------------------------
     PRELOAD CACHE
  ----------------------------- */
  useEffect(() => {
    if (!sensorId) return;

    const cache = window.__niagaraSensorCache?.[sensorId];
    if (!cache) return;

    setData((prev) => {
      const next = { ...prev, ...cache };

      // 🔴 IMPORTANT: do NOT preload Occ_Sts from cache
      // live Niagara event is source of truth
      next.Occ_Sts = prev.Occ_Sts;

      return next;
    });
  }, [sensorId]);


  /* -----------------------------
     Niagara Listener
  ----------------------------- */
  useEffect(() => {
    if (!sensorId) return;

    const handler = (e) => {
      const d = e?.detail;
      if (!d || d.sensorId !== sensorId || !d.key) return;

      console.log("📨 EVENT RECEIVED", {
        key: d.key,
        value: d.value,
        bool: d.bool,
        status: d.status,
        outType: d.outType
      });


      const now = Date.now();

      /* ===== PRESENCE ===== */
      if (d.key === "Occ_Sts") {
        setData((prev) => ({
          ...prev,
          Occ_Sts: {
            value: d.value,
            bool: d.bool,
            raw: d.raw,
            status: d.status
          }
        }));
        return;
      }

      /* ===== OTHERS ===== */
      if (lastUpdateRef.current && now - lastUpdateRef.current < THROTTLE_MS) {
        return;
      }

      lastUpdateRef.current = now;

      setData((prev) => ({
        ...prev,
        [d.key]: {
          value: d.value,
          raw: d.raw,
          status: d.status
        },
        displayName:
          d.displayName !== undefined ? d.displayName : prev.displayName
      }));
    };

    window.addEventListener("niagara-sensor-update", handler);
    return () =>
      window.removeEventListener("niagara-sensor-update", handler);
  }, [sensorId]);

  /* -----------------------------
     Exit if no sensor
  ----------------------------- */
  if (!sensorId) return null;

  const target = scene.getObjectByName(sensorId);
  if (!target) return null;

  const position = new THREE.Vector3();
  target.getWorldPosition(position);

  /* -----------------------------
     Row Component
  ----------------------------- */
  const Row = ({ label, field }) => {
    const row = data[field] || {};

    // console.log("🧩 ROW RENDER", {
    //   field,
    //   value: row.value,
    //   bool: row.bool,
    //   raw: row.raw,
    //   status: row.status
    // });


    const statusKey = normalizeStatus(row.status);
    const statusColor = STATUS_COLORS[statusKey];

    const isOcc = field === "Occ_Sts" && row.bool === true;

    const formatValue = (val) => {
      if (val === undefined || val === null) return "-";

      const str = String(val).trim();

      // Extract numeric portion only
      const match = str.match(/-?\d+(\.\d+)?/);
      if (!match) return val;

      const formatted = parseFloat(match[0]).toFixed(2);

      // If original had units, preserve them
      return str.replace(match[0], formatted);
    };

    const displayValue =
      field === "Occ_Sts"
        ? row.value ?? "-"
        : "value" in row
          ? formatValue(row.value)
          : "-";

    return (
      <div
        style={{ position: "relative", marginBottom: 8 }}
        onMouseEnter={() => setHoverKey(field)}
        onMouseLeave={() => setHoverKey(null)}
      >
        {/* ===== MAIN ROW ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 8px",
            borderRadius: 8
          }}
        >
          <span>{label}</span>

          <span
            style={{
              padding: "4px 10px",
              borderRadius: 8,
              background:
                field === "Occ_Sts"
                  ? isOcc
                    ? "rgba(255,77,77,0.25)"
                    : "rgba(0,255,127,0.25)"
                  : statusColor.bg,
              color:
                field === "Occ_Sts"
                  ? isOcc
                    ? "#ff4d4d"
                    : "#00ff7f"
                  : statusColor.text,
              fontSize: 12,
              fontWeight: field === "Occ_Sts" ? 600 : 400,
              whiteSpace: "nowrap"
            }}
          >
            {displayValue}
          </span>
        </div>

        {/* ===== NESTED STATUS CARD ===== */}
        {hoverKey === field && (
          <div
            style={{
              position: "absolute",
              left: "105%",
              top: 0,
              background: "#0e0e12",
              border: "1px solid #333",
              borderRadius: 10,
              padding: "6px 10px",
              fontSize: 12,
              whiteSpace: "nowrap",
              zIndex: 99999
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              Status
            </div>
            <div style={{ color: statusColor.text }}>
              {row.status ?? "ok"}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <Html position={position} center>
      <div
        style={{
          background: "rgba(10,10,15,0.96)",
          padding: 12,
          borderRadius: 16,
          minWidth: 260,
          color: "#fff"
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#00e0ff",
            marginBottom: 10,
            fontWeight: 600
          }}
        >
          {data.displayName ?? sensorId}
        </div>

        <Row label="🌡 Temperature" field="Temp" />
        <Row label="💧 Humidity" field="RH" />
        <Row label="💡 Lux" field="Lux_Level" />
        <Row label="🔊 Sound Level" field="Sound_Level" />
        <Row label="🧍 Presence Status" field="Occ_Sts" />
      </div>
    </Html>
  );
}
