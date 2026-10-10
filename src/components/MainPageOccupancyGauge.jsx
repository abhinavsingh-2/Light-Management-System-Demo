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




