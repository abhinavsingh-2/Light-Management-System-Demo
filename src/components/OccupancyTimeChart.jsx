import React, { useState } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useDashboard } from "./DashboardContext"; // ✅ ADDED

const OccupancyTimeChart = () => {
  const [hover, setHover] = useState(false);
  const { dashboardData } = useDashboard(); // ✅ ADDED

  const chartData = dashboardData?.occupancyTimeline ?? []; // ✅ SAFE FALLBACK

  const chartCardStyle = {
    width: "100%",
    height: 372,
    borderRadius: "16px",
    padding: "1rem",
    backgroundColor: "transparent",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    boxShadow: hover
      ? "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)"
      : "0 0 10px rgba(255,255,255,0.3)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  return (
    <div
      style={chartCardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData} // ✅ ADDED
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.2)"
          />
          <XAxis
            dataKey="time" // assumes { time, value }
            tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: "rgba(255,255,255,0.7)", strokeWidth: 1.5 }}
            tickLine={{ stroke: "rgba(255,255,255,0.7)" }}
          />
          <YAxis
            tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: "rgba(255,255,255,0.7)", strokeWidth: 1.5 }}
            tickLine={{ stroke: "rgba(255,255,255,0.7)" }}
            width={35}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyTimeChart;
