import React from "react";

const TemperatureGauge = ({
  value = "",
  unit = "",
  min = 0,
  max = 100,
}) => {

  /* ===============================
     EXTRACT NUMBER ONLY FOR ARC
  =============================== */

  const numericValue = parseFloat(value);

  const safeValue = isNaN(numericValue) ? min : numericValue;

  const percentage = Math.min(
    Math.max((safeValue - min) / (max - min), 0),
    1
  );


  /* ===============================
     GAUGE CONFIG
  =============================== */

  const radius = 80;
  const strokeWidth = 16;
  const circumference = Math.PI * radius;

  const filledLength = circumference * percentage;
  const emptyLength = circumference - filledLength;


  /* ===============================
     COLOR
  =============================== */

  const getColor = () => {
    if (percentage < 0.33) return "#00b050";
    if (percentage < 0.66) return "#ffcc00";
    return "#ff0000";
  };


  /* ===============================
     RAW DISPLAY
  =============================== */

  const displayValue =
    value !== null && value !== undefined && !isNaN(numericValue)
      ? numericValue.toFixed(2)
      : "--";

  /* ===============================
     RENDER
  =============================== */

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "130px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: "0 auto",
        paddingTop: "4px",
        gap: "2px",
      }}
    >

      {/* GAUGE */}
      <svg viewBox="0 0 220 140" style={{ width: "130%", height: "auto" }}>

        {/* BACKGROUND */}
        <path
          d="M40 100 A70 70 0 0 1 180 100"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* ACTIVE */}
        <path
          d="M40 100 A70 70 0 0 1 180 100"
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={`${filledLength} ${emptyLength}`}
          strokeLinecap="round"
        />

        {/* ALIGNMENT TEXT */}
        <text
          x="110"
          y="78"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="1.2rem"
          fontWeight="600"
          fill="transparent"
        >
          {displayValue}
          {unit}
        </text>

      </svg>


      {/* VALUE */}
      <div
        style={{
          fontSize: "1.2rem",
          fontWeight: "600",
          color: "#000",
          marginTop: "-23px",
          textAlign: "center",
        }}
      >
        {displayValue}
        {unit}
      </div>

    </div>
  );
};

export default TemperatureGauge;
