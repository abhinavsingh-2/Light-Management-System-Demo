import React, { useEffect, useState } from "react";

const SoundLevelGauge = ({
  value = 0,
  unit = "dB",
  barCount = 20,
  width = 120,
  height = 90, // ⬆️ Taller height
}) => {
  const [bars, setBars] = useState(Array(barCount).fill(0));

  const percentage = Math.min(Math.max(value, 0), 100);
  const getColor = () => {
    if (percentage < 40) return "#00b050"; // green
    if (percentage < 70) return "#ffcc00"; // yellow
    return "#ff0000"; // red
  };
  const color = getColor();

  useEffect(() => {
    const interval = setInterval(() => {
      // Random height per bar, scaled by sound intensity
      setBars(
        Array(barCount)
          .fill(0)
          .map(() =>
            Math.random() *
            (height * (0.3 + (percentage / 100) * 0.7))
          )
      );
    }, 120);
    return () => clearInterval(interval);
  }, [percentage, height, barCount]);

  const barWidth = width / barCount - 2;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height + 30}px`, // extra space for label
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {/* Bars container */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          height: `${height}px`,
          width: "100%",
        }}
      >
        {bars.map((barHeight, i) => (
          <div
            key={i}
            style={{
              width: `${barWidth}px`,
              height: `${barHeight}px`,
              margin: "0 1px",
              backgroundColor: color,
              borderRadius: "3px",
              transition: "height 0.25s ease",
              boxShadow: `0 0 6px ${color}80`,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: "8px",
          fontWeight: "600",
          fontSize: "15px",
          color: color,
        }}
      >
        {Math.round(value)} {unit}
      </div>
    </div>
  );
};

export default SoundLevelGauge;
