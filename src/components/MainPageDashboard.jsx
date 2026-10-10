import React from "react";
import EnergyCards from "./EnergyCards";
import MainPageSliders from "./MainPageSliders";
import MainPageFailures from "./MainPageFailures";
import SchedulerColumn from "./SchedulerColumn";
import MainPageAvgTempHumLuxOcc from "./MainPageAvgTempHumLuxOcc";
import OccupancyTimeChart from "./OccupancyTimeChart";
import MainTotalOccupancy from "./MainTotalOccupancy";

export default function MainPageDashboard() {
    return (
        <div className="container-fluid mt-4">
            <div className="row gx-3 gy-3" >

                {/* Column 1 - Environmental Cards */}
                <div
                    className="col-12 col-md-12 col-lg-4"
                    style={{ marginTop: "45px" }}
                >
                    <MainPageAvgTempHumLuxOcc />
                </div>
                <div
                    className="col-12 col-md-4 col-lg-2"
                    style={{ marginTop: "56px" }}
                >
                    <MainTotalOccupancy />
                </div>

                {/* Column 2 - Failures */}
                <div
                    className="col-12 col-md-4 col-lg-2"
                    style={{ marginTop: "40px" }}
                >
                    <MainPageFailures />
                </div>

                {/* Column 3 - Sliders */}
                <div
                    className="col-12 col-md-4 col-lg-4"
                    style={{ marginTop: "56px" }}
                >
                    <MainPageSliders />
                </div>

                {/* Column 4 - Scheduler */}


                {/* Column 5 - Occupancy Chart */}
                {/* <div
                    className="col-12 col-md-8 col-lg-3"
                    style={{ marginTop: "56px" }}
                >
                    <OccupancyTimeChart />
                </div> */}

            </div>
        </div>
    );
}