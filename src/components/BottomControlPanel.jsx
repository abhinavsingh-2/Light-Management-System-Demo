import React from "react";
import AvgTempHumLuxOcc from "./AvgTempHumLuxOcc";
import FailuresColumn from "./FailuresColumn";
import SlidersColumn from "./SlidersColumn";
import SchedulerColumn from "./SchedulerColumn";
import OccupancyTimeChart from "./OccupancyTimeChart";
import "./../css/BottomControlPanel.css";
export default function BottomControlPanel({ selectedRoomId }) {
  return (
    <div className="bottom-control-panel">
      <div className="dashboard-grid">
        {/* Left – Avg cards */}
        <div className="dashboard-col" style={{ marginTop: "-10px" }}>
          <AvgTempHumLuxOcc />
        </div>

        {/* Failure */}
        <div className="dashboard-col" style={{ marginTop: "-15px" }}>
          <FailuresColumn />
        </div>

        {/* Sliders */}
       <div className="dashboard-col">
         <SlidersColumn selectedRoomId={selectedRoomId} />
        </div>

        {/* Scheduler */}
        <div className="dashboard-col narrow">
          <SchedulerColumn />
        </div>

        {/* Chart */}
        {/* <div className="dashboard-col wide">
          <OccupancyTimeChart />
        </div> */}
      </div>
    </div>
  );
}
