





import React from "react";

const LuxBar = ({ value = 0, max = 2000, unit = "lx" }) => {

  // ⭐ EXACT 2 decimals WITHOUT rounding (same logic as TemperatureGauge)
  const trimLux = (val) => {
    const s = String(val);
    return s.includes(".")
      ? s.replace(/^(\d+)\.(\d{0,2}).*/, "$1.$2")
      : s;
  };

  const numericValue = Number(value);
  const displayValue = trimLux(numericValue);   // ⭐ Trimmed value for display

  const percentage = Math.min((numericValue / max) * 100, 100);

  // Gradient color like Grafana (blue → green → yellow → red)
  const getGradient = () => {
    if (percentage < 25) return "linear-gradient(90deg, #4fc3f7, #81d4fa)";
    if (percentage < 50) return "linear-gradient(90deg, #00b050, #aeea00)";
    if (percentage < 75) return "linear-gradient(90deg, #ffcc00, #ffb300)";
    return "linear-gradient(90deg, #ff7043, #ff0000)";
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* Bar container */}
      <div
        style={{
          width: "100%",
          height: "16px",
          backgroundColor: "#e0e0e0",
          borderRadius: "5px",
          overflow: "hidden",
          marginTop: "45px",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        {/* Filled part */}
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: getGradient(),
            transition: "width 0.4s ease",
          }}
        ></div>
      </div>

      {/* Value text */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "1.2rem",
          fontWeight: "600",
          color: "black",
        }}
      >
        {displayValue} {unit}
      </div>
    </div>
  );
};

export default LuxBar



// import React from "react";

// const LuxBar = ({ value = 0, max = 2000, unit = "lx" }) => {

//   /* ===============================
//      RAW NUMERIC VALUE (NO TRIM)
//   =============================== */
//   const numericValue =
//     value === null || value === undefined || isNaN(Number(value))
//       ? 0
//       : Number(value);

//   /* ===============================
//      BAR PERCENTAGE
//   =============================== */
//   const percentage =
//     max > 0
//       ? Math.min((numericValue / max) * 100, 100)
//       : 0;

//   /* ===============================
//      COLOR GRADIENT
//   =============================== */
//   const getGradient = () => {
//     if (percentage < 25) return "linear-gradient(90deg, #4fc3f7, #81d4fa)";
//     if (percentage < 50) return "linear-gradient(90deg, #00b050, #aeea00)";
//     if (percentage < 75) return "linear-gradient(90deg, #ffcc00, #ffb300)";
//     return "linear-gradient(90deg, #ff7043, #ff0000)";
//   };

//   const getGlow = () => {
//     if (percentage < 25) return "0 0 8px #4fc3f7";
//     if (percentage < 50) return "0 0 10px #00c853";
//     if (percentage < 75) return "0 0 12px #ffb300";
//     return "0 0 14px #ff5252";
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         padding: "12px 10px",
//         borderRadius: "14px",
//         background: "rgba(255,255,255,0.06)",
//         border: "2px solid rgba(255,255,255,0.7)",
//         boxShadow:
//           "0 0 14px rgba(255,255,255,0.35), inset 0 0 6px rgba(255,255,255,0.2)",
//         textAlign: "center",
//       }}
//     >

//       {/* VALUE */}
//       <div
//         style={{
//           fontSize: "2rem",
//           fontWeight: 700,
//           marginBottom: "6px",
//           color: "#000",
//           textShadow: getGlow(),
//         }}
//       >
//         {numericValue} <span style={{ fontSize: "1rem" }}>{unit}</span>
//       </div>

//       {/* BAR */}
//       <div
//         style={{
//           width: "100%",
//           height: "16px",
//           backgroundColor: "#e0e0e0",
//           borderRadius: "8px",
//           overflow: "hidden",
//           boxShadow: "inset 0 1px 4px rgba(0,0,0,0.25)",
//         }}
//       >
//         <div
//           style={{
//             width: `${percentage}%`,
//             height: "100%",
//             background: getGradient(),
//             transition: "width 0.4s ease",
//             boxShadow: getGlow(),
//           }}
//         />
//       </div>

//       {/* MIN / MAX */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "11px",
//           color: "#333",
//           marginTop: "6px",
//         }}
//       >
//         <span>0 {unit}</span>
//         <span>{max} {unit}</span>
//       </div>

//     </div>
//   );
// };

// export default LuxBar;
