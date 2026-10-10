// // src/components/MainPageAvgTempHumLuxOcc.jsx

// import React, { useState, useEffect } from "react";
// import MainPageTemperatureGauge from "./MainPageTemperatureGauge";
// import MainPageOccupancyGauge from "./MainPageOccupancyGauge";
// import MainPageLuxBar from "./MainPageLuxBar";
// import MainPageSoundLevelGauge from "./MainPageSoundLevelGauge";

// export default function MainPageAvgTempHumLuxOcc() {
//   const cardBaseStyle = {
//     borderRadius: "14px",
//     background: "rgba(255,255,255,0.04)",
//     border: "2px solid rgba(255, 255, 255, 0.6)",
//     boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//     minHeight: "134px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     padding: "1rem 0.8rem",
//     width: "100%",
//     maxWidth: "260px",
//     margin: "0 auto",
//   };

//   const cardHoverStyle = {
//     transform: "translateY(-3px)",
//     border: "2px solid rgba(255,255,255,1)",
//     boxShadow:
//       "0 0 16px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.4)",
//   };

//   const labelStyle = {
//     fontSize: "clamp(10px, 1vw, 14px)",
//     color: "#000",
//     fontWeight: 500,
//     marginTop: "0.4rem",
//   };

//   const [hoverIndex, setHoverIndex] = useState(null);

//   const [dashboardData, setDashboardData] = useState({
//     Temp: { value: 0, unit: "" },
//     RH: { value: 0, unit: "" },
//     Lux_Level: { value: 0, unit: "" },
//     Occ_Sts: { value: null, unit: "" },
//     Sound_Level: { value: 0, unit: "" },
//   });

//   /* =========================================================
//      MAIN PAGE NIAGARA LISTENER
//   ========================================================= */

//   useEffect(() => {
//     const handler = (e) => {
//       const { key, value, unit } = e.detail || {};
//       if (!key) return;

//       const numeric = (() => {
//         if (value == null) return null;
//         const m = String(value).match(/^[\s]*([-+]?\d+(\.\d+)?)/);
//         if (m) return Number(m[1]);
//         return value;
//       })();

//       setDashboardData((prev) => ({
//         ...prev,
//         [key]: {
//           value: numeric,
//           unit:
//             unit ||
//             (typeof value === "string"
//               ? String(value)
//                 .replace(/^[\s]*[-+]?[\d.,\s]+/, "")
//                 .trim() || ""
//               : ""),
//         },
//       }));
//     };

//     window.addEventListener(
//       "niagara-main-dashboard-update",
//       handler
//     );

//     return () =>
//       window.removeEventListener(
//         "niagara-main-dashboard-update",
//         handler
//       );
//   }, []);

//   const cards = [
//     { label: "Avg Temperature", type: "gauge", key: "Temp" },
//     { label: "Avg Humidity", type: "gauge", key: "RH" },
//     { label: "Avg Lux", type: "luxbar", key: "Lux_Level" },
//     { label: "Occupancy Status", type: "occupancy", key: "Occ_Sts" },
//     { label: "Avg Sound Level", type: "sound", key: "Sound_Level" },
//   ];

//   return (
//     <div className="container" style={{ padding: "8px 4px" }}>
//       <div className="row g-2">
//         {cards.map((card, index) => {
//           const isHovered = hoverIndex === index;
//           const data = dashboardData[card.key] || {
//             value: null,
//             unit: "",
//           };

//           return (
//             <div
//               className="col-12 col-md-4 d-flex justify-content-center"
//               key={index}
//             >
//               <div
//                 style={{
//                   ...cardBaseStyle,
//                   ...(isHovered ? cardHoverStyle : {}),
//                 }}
//                 onMouseEnter={() => setHoverIndex(index)}
//                 onMouseLeave={() => setHoverIndex(null)}
//               >
//                 {card.type === "occupancy" ? (
//                   data.value === null ? null : (
//                     <MainPageOccupancyGauge
//                       occupied={
//                         data.value === true ||
//                         data.value === "true" ||
//                         data.value === 1 ||
//                         data.value === "1"
//                       }
//                       size={90}
//                     />
//                   )
//                 ) : card.type === "gauge" ? (
//                   <MainPageTemperatureGauge
//                     value={data.value}
//                     unit={data.unit}
//                     min={0}
//                     max={card.key === "Temp" ? 50 : 100}
//                   />
//                 ) : card.type === "luxbar" ? (
//                   <MainPageLuxBar
//                     value={data.value}
//                     unit={data.unit}
//                   />
//                 ) : card.type === "sound" ? (
//                   <MainPageSoundLevelGauge
//                     value={data.value}
//                     unit={data.unit}
//                   />
//                 ) : null}

//                 <div style={labelStyle}>{card.label}</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }






// src/components/MainPageAvgTempHumLuxOcc.jsx

import React, { useState, useEffect } from "react";
import MainPageTemperatureGauge from "./MainPageTemperatureGauge";
import MainPageOccupancyGauge from "./MainPageOccupancyGauge";
import MainPageLuxBar from "./MainPageLuxBar";
import MainPageSoundLevelGauge from "./MainPageSoundLevelGauge";
import MainPageAutoManualToggle from "./MainPageAutoManualToggle";
import { safeAddEventListener, safeRemoveEventListener } from "../utils/eventBus";

export default function MainPageAvgTempHumLuxOcc() {

  const cardBaseStyle = {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    border: "2px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minHeight: "134px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "1rem 0.8rem",
    width: "100%",
    maxWidth: "260px",
    margin: "0 auto",
  };

  const cardHoverStyle = {
    transform: "translateY(-3px)",
    border: "2px solid rgba(255,255,255,1)",
    boxShadow:
      "0 0 16px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.4)",
  };

  const labelStyle = {
    fontSize: "clamp(10px, 1vw, 14px)",
    color: "#000",
    fontWeight: 500,
    marginTop: "0.4rem",
  };

  const [hoverIndex, setHoverIndex] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    Temp: { value: 0, unit: "" },
    RH: { value: 0, unit: "" },
    Lux_Level: { value: 0, unit: "" },
    Occ_Sts: { value: null, unit: "" },
    Sound_Level: { value: 0, unit: "" },
    Auto_Mode: { value: false, unit: "" }, // ✅ Added
  });

  /* =========================================================
     MAIN PAGE NIAGARA LISTENER
  ========================================================= */

  useEffect(() => {

    /* ===============================
       EXISTING DASHBOARD LISTENER
    =============================== */

    const dashboardHandler = (e) => {
      const { key, value, unit } = e.detail || {};
      if (!key) return;

      const numeric = (() => {
        if (value == null) return null;
        if (value === true || value === false) return value;
        const m = String(value).match(/^[\s]*([-+]?\d+(\.\d+)?)/);
        if (m) return Number(m[1]);
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
      })();

      setDashboardData((prev) => ({
        ...prev,
        [key]: {
          value: numeric,
          unit:
            unit ||
            (typeof value === "string"
              ? String(value)
                  .replace(/^[\s]*[-+]?[\d.,\s]+/, "")
                  .trim() || ""
              : ""),
        },
      }));
    };

    safeAddEventListener(
      "niagara-main-dashboard-update",
      dashboardHandler
    );

    /* ===============================
       AUTO MODE LISTENER (NIAGARA → REACT)
    =============================== */

    const autoModeHandler = (e) => {
      const boolVal = e.detail?.value === true;

      console.log("📥 React received AutoMode:", boolVal);

      setDashboardData((prev) => ({
        ...prev,
        Auto_Mode: {
          value: boolVal,
          unit: "",
        },
      }));
    };

    safeAddEventListener(
      "niagara-auto-mode-update",
      autoModeHandler
    );

    return () => {
      safeRemoveEventListener(
        "niagara-main-dashboard-update",
        dashboardHandler
      );

      safeRemoveEventListener(
        "niagara-auto-mode-update",
        autoModeHandler
      );
    };

  }, []);

  const cards = [
    { label: "Avg Temperature", type: "gauge", key: "Temp" },
    { label: "Avg Humidity", type: "gauge", key: "RH" },
    { label: "Avg Lux", type: "luxbar", key: "Lux_Level" },
    { label: "Occupancy Status", type: "occupancy", key: "Occ_Sts" },
    { label: "Avg Sound Level", type: "sound", key: "Sound_Level" },
    { label: "Auto Manual", type: "toggle", key: "Auto_Mode" },
  ];

  return (
    <div className="container" style={{ padding: "8px 4px" }}>
      <div className="row g-2">
        {cards.map((card, index) => {
          const isHovered = hoverIndex === index;
          const data = dashboardData[card.key] || {
            value: null,
            unit: "",
          };

          return (
            <div
              className="col-12 col-md-4 d-flex justify-content-center"
              key={index}
            >
              <div
                style={{
                  ...cardBaseStyle,
                  ...(isHovered ? cardHoverStyle : {}),
                }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {card.type === "occupancy" ? (
                  data.value === null ? null : (
                    <MainPageOccupancyGauge
                      occupied={
                        data.value === true ||
                        data.value === "true" ||
                        data.value === 1 ||
                        data.value === "1"
                      }
                      size={90}
                    />
                  )
                ) : card.type === "gauge" ? (
                  <MainPageTemperatureGauge
                    value={data.value}
                    unit={data.unit}
                    min={0}
                    max={card.key === "Temp" ? 50 : 100}
                  />
                ) : card.type === "luxbar" ? (
                  <MainPageLuxBar
                    value={data.value}
                    unit={data.unit}
                  />
                ) : card.type === "sound" ? (
                  <MainPageSoundLevelGauge
                    value={data.value}
                    unit={data.unit}
                  />
                ) : card.type === "toggle" ? (
                  <MainPageAutoManualToggle
                    value={data.value}
                    onChange={(val) => {

                      console.log("📤 React → Niagara:", val);

                      // ✅ EXACT MATCH WITH YOUR NIAGARA SCRIPT
                      window.dispatchEvent(
                        new CustomEvent(
                          "niagara-write-auto-mode",
                          {
                            detail: { value: val },
                          }
                        )
                      );
                    }}
                  />
                ) : null}

                <div style={labelStyle}>{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}