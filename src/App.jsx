

import React, { useState } from "react";

import "./css/CO2Overlay.css";
import Navbar from "./Navbar/Navbar";
import SceneCanvas from "./components/SceneCanvas";
import RightControlPanel from "./components/RightControlPanel";
import BottomControlPanel from "./components/BottomControlPanel";
import MainPageDashboard from "./components/MainPageDashboard";   // ✅ ADD THIS
import { DashboardProvider } from "./components/DashboardContext";
import { ErrorBoundary } from "./components/ErrorBoundary";


export default function App() {
  const [defaultView, setDefaultView] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const [heatMapEnabled, setHeatMapEnabled] = useState(false);//Heat
  const [occupancyEnabled, setOccupancyEnabled] = useState(false);
  const [phase1, setPhase1] = useState(false);   // ✅ default selected
  const [phase2, setPhase2] = useState(true);
  const handlePhase1 = () => {
    setPhase1(true);
    setPhase2(false);
  };

  const handlePhase2 = () => {
    setPhase1(false);
    setPhase2(true);
  };

  return (
    <>
      <Navbar />

      <DashboardProvider>

        {/* 🔑 Scene Viewer */}
        <div
          style={{
            height: selectedRoomId
              ? "calc(100vh - 130px)"
              : "100vh",
            transition: "height 0.4s ease",
          }}
        >
          <SceneCanvas
            defaultView={defaultView}
            selectedRoomId={selectedRoomId}
            heatMapEnabled={heatMapEnabled}
            occupancyEnabled={occupancyEnabled}
            phase1={phase1}
            phase2={phase2}
            handlePhase1={handlePhase1}
            handlePhase2={handlePhase2}
          />
        </div>

        <RightControlPanel     //heat
          defaultView={defaultView}
          setDefaultView={setDefaultView}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          heatMapEnabled={heatMapEnabled}
          setHeatMapEnabled={setHeatMapEnabled}
          occupancyEnabled={occupancyEnabled}
          setOccupancyEnabled={setOccupancyEnabled}
          phase1={phase1}
          phase2={phase2}
          handlePhase1={handlePhase1}
          handlePhase2={handlePhase2}
        />

        {/* ✅ MAIN PAGE DASHBOARD */}
        {defaultView && (
          <ErrorBoundary fallbackTitle="Main Dashboard">
            <MainPageDashboard />
          </ErrorBoundary>
        )}

        {/* ✅ ROOM DASHBOARD */}
        {selectedRoomId && (
          <ErrorBoundary fallbackTitle="Room Dashboard">
            <BottomControlPanel />
          </ErrorBoundary>
        )}

      </DashboardProvider>
    </>
  );
}
