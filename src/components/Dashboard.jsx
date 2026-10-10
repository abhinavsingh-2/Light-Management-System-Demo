import React from "react";
import EnergyCards from "./EnergyCards";
import SlidersColumn from "./SlidersColumn";
import FailuresColumn from "./FailuresColumn";
import SchedulerColumn from "./SchedulerColumn";
import AvgTempHumLuxOcc from "./AvgTempHumLuxOcc";
import OccupancyTimeChart from "./OccupancyTimeChart";

export default function Dashboard() {
  return (
    <div className="container-fluid mt-4">
      <div className="row gx-3 gy-3">

        <div className="dashboard-grid">
  <AvgTempHumLuxOcc />
  <FailuresColumn />
  <SlidersColumn />
  <SchedulerColumn />
  <OccupancyTimeChart />
</div>


        {/* Column 1 */}
        <div className="col-12 col-md-12 col-lg-4" style={{ marginTop: "45px" }}>
          <AvgTempHumLuxOcc />
        </div>

        {/* Column 2 — aligned with sliders */}
        <div className="col-12 col-md-4 col-lg-2" style={{ marginTop: "40px" }}>
          <FailuresColumn />
        </div>

        {/* Column 3 */}
        <div className="col-12 col-md-4 col-lg-2" style={{ marginTop: "56px" }}>
          <SlidersColumn />
        </div>

        {/* Column 4 */}
        <div className="col-12 col-md-4 col-lg-1" style={{ marginTop: "56px" }}>
          <SchedulerColumn />
        </div>

        {/* Column 5 */}
        <div className="col-12 col-md-8 col-lg-3" style={{ marginTop: "56px" }}>
          <OccupancyTimeChart />
        </div>

      </div>
    </div>
  );
}
