


// src/components/AvgTempHumLuxOcc.jsx

import React, { useState, useEffect } from "react";

import TemperatureGauge from "./TemperatureGauge";
import OccupancyGauge from "./OccupancyGauge";
import LuxBar from "./LuxBar";
import SoundLevelGauge from "./SoundLevelGauge";
import LightHoursBar from "./LightHoursBar";
import { safeAddEventListener, safeRemoveEventListener } from "../utils/eventBus";

export default function AvgTempHumLuxOcc() {

  // console.log("🟢 AvgTempHumLuxOcc mounted at:", Date.now());

  /* ===============================
     DASHBOARD STATE
  =============================== */

  const [dashboardData, setDashboardData] = useState({
    Temp: { value: 0, unit: "°C" },
    RH: { value: 0, unit: "%" },
    Lux_Level: { value: 0, unit: "lx" },
    Occ_Sts: { value: null, unit: "" },
    Sound_Level: { value: 0, unit: "db" },
  });

  const [activeRoom, setActiveRoom] = useState(null);
  const [firstPacketReceived, setFirstPacketReceived] = useState(false);


  /* ===============================
     TRACK ROOM SELECTION
  =============================== */

  useEffect(() => {

    const roomHandler = (e) => {
      const roomId = e.detail?.roomId;

      console.group("🏷️ ROOM SELECTED EVENT");
      console.log("Time:", Date.now());
      console.log("Room ID:", roomId);
      console.log("Previous activeRoom:", activeRoom);
      console.groupEnd();

      setActiveRoom(roomId);
    };

    safeAddEventListener("room-selected", roomHandler);

    return () => {
      safeRemoveEventListener("room-selected", roomHandler);
    };
  }, [activeRoom]);



  /* ===============================
     RECEIVE FROM NIAGARA
  =============================== */

  useEffect(() => {

    const handler = (e) => {

      const { key, value, unit, roomId } = e.detail;

      // console.group("📥 NIAGARA UPDATE RECEIVED");
      // console.log("Time:", Date.now());
      // console.log("Incoming roomId:", roomId);
      // console.log("Active room:", activeRoom);
      // console.log("Key:", key);
      // console.log("Value:", value);
      // console.log("Unit:", unit);
      // console.groupEnd();


      /* ---------- RESET ---------- */

      if (key === "RESET") {
        // console.warn("🔄 RESET received for room:", roomId);

        setDashboardData({
          Temp: { value: 0, unit: "°C" },
          RH: { value: 0, unit: "%" },
          Lux_Level: { value: 0, unit: "lx" },
          Occ_Sts: { value: null, unit: "" },
          Sound_Level: { value: 0, unit: "db" }
        });

        return;
      }


      /* ---------- AUTO SET ACTIVE ROOM ---------- */

      if (!activeRoom && roomId) {
        // console.warn("⚡ Auto-setting ACTIVE ROOM from data:", roomId);
        setActiveRoom(roomId);
      }


      /* ---------- IGNORE OTHER ROOMS ---------- */

      if (activeRoom && roomId && roomId !== activeRoom) {
        // console.warn("🚫 Ignored update. Different room.");
        // console.log("Incoming:", roomId);
        // console.log("Expected:", activeRoom);
        return;
      }


      /* ---------- FIRST DATA PACKET ---------- */

      if (!firstPacketReceived) {
        // console.log("🔥 FIRST VALID DATA PACKET RECEIVED");
        setFirstPacketReceived(true);
      }


      /* ---------- UPDATE STATE ---------- */

      setDashboardData((prev) => {

        // console.group("🧠 STATE UPDATE");
        // console.log("Updating key:", key);
        // console.log("Previous:", prev[key]);
        // console.log("New value:", value);
        // console.groupEnd();

        return {
          ...prev,
          [key]: {
            value: value,
            unit: unit || prev[key]?.unit || "",
          },
        };
      });
    };

    safeAddEventListener("niagara-dashboard-update", handler);

    return () => {
      safeRemoveEventListener("niagara-dashboard-update", handler);
    };

  }, [activeRoom, firstPacketReceived]);


  /* ===============================
     VALUE FORMATTER
  =============================== */

  const formatValue = (val) => {
    if (val === null || val === undefined || val === "") return null;
    const num = Number(val);
    if (Number.isNaN(num)) return null;
    return num.toFixed(2);
  };


  /* ===============================
     UI STYLES
  =============================== */

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


  /* ===============================
     CARD CONFIG
  =============================== */

  const cards = [
    { label: "Avg Temperature", type: "gauge", key: "Temp" },
    { label: "Avg Humidity", type: "gauge", key: "RH" },
    { label: "Avg Lux", type: "luxbar", key: "Lux_Level" },
    { label: "Occupancy Status", type: "occupancy", key: "Occ_Sts" },
    { label: "Avg Sound Level", type: "sound", key: "Sound_Level" },
  ];


  /* ===============================
     RENDER
  =============================== */

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

                    <OccupancyGauge
                      occupied={
                        data.value === true ||
                        data.value === "true" ||
                        data.value === 1 ||
                        data.value === "1"
                      }
                      size={90}
                    />
                  )

                ) :

                  card.type === "gauge" ? (

                    <TemperatureGauge
                      value={Number(formatValue(data.value))}
                      unit={data.unit}
                      min={0}
                      max={card.key === "Temp" ? 50 : 100}
                    />

                  ) :

                    card.type === "luxbar" ? (

                      <LuxBar
                        value={formatValue(data.value)}
                        unit={data.unit}
                      />

                    ) :

                      card.type === "sound" ? (

                        <SoundLevelGauge
                          value={formatValue(data.value)}
                          unit={data.unit}
                        />

                      ) : null}

                <div style={labelStyle}>
                  {card.label}
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
 