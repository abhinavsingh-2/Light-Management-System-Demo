

import { useState, useEffect, useMemo } from "react";
import "./../css/RightControlPanel.css";
import { MEETING_ROOMS } from "./MeetingRoom";

/* ===============================
   FIX: Lock the original order outside the component
=============================== */

const TEMP_HUMIDITY_LEGEND = [  //Legend
    { range: "Below 21 °C", color: "#25afff" },
    { range: "21 °C – 25 °C", color: "#76f385" },
    { range: "Above 25 °C", color: "#d24f4f" }
];

const ORIGINAL_ROOMS = MEETING_ROOMS.filter(
    (room) => room.button !== "disable"
);


/* ===============================
  GET TAB FROM URL (SAME AS FIRST FILE)
=============================== */
const getTabFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "lms";
};




export default function RightControlPanel({
    defaultView,
    setDefaultView,
    selectedRoomId,
    setSelectedRoomId,
    heatMapEnabled,//heat
    setHeatMapEnabled,
    occupancyEnabled,          // 👈 ADD THIS
    setOccupancyEnabled,
    phase1,
    phase2,
    handlePhase1,
    handlePhase2     // 👈 ADD THIS
}) {

    const [activeTab, setActiveTab] = useState(getTabFromUrl);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setDefaultView(true);
    }, [setDefaultView]);

    /* ===============================
      🔑 ORD → TAB SYNC (OPTIONAL)
      Niagara may call this
    =============================== */
    useEffect(() => {
        window.setActiveTabFromOrd = (tab) => {
            setActiveTab(tab);
        };

        return () => {
            delete window.setActiveTabFromOrd;
        };
    }, []);

    // const handleDefaultToggle = (value) => {
    //   setDefaultView(value);
    //   if (value) setSelectedRoomId(null);
    // };

    const handleDefaultToggle = (checked) => {
        if (!checked) return; // prevent turning everything off

        setDefaultView(true);
        setHeatMapEnabled(false);
        setOccupancyEnabled(false);
        setSelectedRoomId(null);
    };

    const handleRoomSelect = (roomId) => {
        setSelectedRoomId(roomId);
        setDefaultView(false);

        // 🔥 TURN OFF BOTH MODES
        setHeatMapEnabled(false);
        setOccupancyEnabled(false);
    };


    // const handleHeatToggle = (checked) => {
    //   if (checked) {
    //     // Switch to default mode
    //     setDefaultView(true);
    //     setSelectedRoomId(null);

    //     setHeatMapEnabled(true);
    //     setOccupancyEnabled(false); // ❌ Mutual exclusion
    //   } else {
    //     setHeatMapEnabled(false);
    //   }
    // };


    const handleHeatToggle = (checked) => {
        if (!checked) {
            setHeatMapEnabled(false);
            return;
        }

        // 🔥 STEP 1: Turn default off
        setDefaultView(false);

        // 🔥 STEP 2: Delay heat enable to next render cycle
        requestAnimationFrame(() => {
            setHeatMapEnabled(true);
            setOccupancyEnabled(false);
        });
    };

    // const handleOccupancyToggle = (checked) => {
    //   if (checked) {
    //     setDefaultView(true);
    //     setSelectedRoomId(null);

    //     setOccupancyEnabled(true);
    //     setHeatMapEnabled(false);
    //   } else {
    //     setOccupancyEnabled(false);
    //   }
    // };

    const handleOccupancyToggle = (checked) => {
        if (!checked) {
            setOccupancyEnabled(false);
            return;
        }

        setDefaultView(false);

        requestAnimationFrame(() => {
            setOccupancyEnabled(true);
            setHeatMapEnabled(false);
        });
    };


    /* ===============================
       FIXED FILTER LOGIC
    =============================== */
    const filteredRooms = useMemo(() => {
        const query = search.toLowerCase().trim();

        // If search is empty, return the original list in original order
        if (!query) return ORIGINAL_ROOMS;

        // Strict filter: only show rooms that START with the search text
        return ORIGINAL_ROOMS.filter((room) =>
            room.label.toLowerCase().trim().startsWith(query)
        );
    }, [search]);

    return (
        <div className="right-control-wrapper">
            {/* FIXED PANEL */}
            <div className="control-panel">
                <div className="control-section fixed-section">
                    <Toggle
                        label="Default"
                        value={defaultView}
                        onChange={handleDefaultToggle}
                    />

                    <Toggle
                        label="Heat Map(Temp)"
                        value={heatMapEnabled}
                        onChange={handleHeatToggle}
                    />

                    <Toggle
                        label="Heat Map(Occupancy)"
                        value={occupancyEnabled}
                        onChange={handleOccupancyToggle}
                    />
                </div>
                {!heatMapEnabled && !occupancyEnabled && (
                    <div className="control-section scroll-section">
                        <div className="section-title">Meeting Rooms</div>

                        <input
                            type="text"
                            placeholder="Search room..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                marginBottom: "8px",
                                padding: "8px 10px",
                                borderRadius: "6px",
                                border: "1px solid rgba(0,0,0,0.15)",
                                fontSize: "13px",
                                width: "100%",
                                boxSizing: "border-box"
                            }}
                        />

                        <div className="rooms-scroll" style={{ overflowX: "hidden" }}>
                            {filteredRooms.map((room) => {
                                const isActive = selectedRoomId === room.id;

                                return (
                                    <button
                                        key={room.id}
                                        onClick={() => handleRoomSelect(room.id)}
                                        style={{
                                            width: "100%",
                                            padding: "7px",
                                            marginBottom: "9px",
                                            borderRadius: "5px",
                                            border: isActive
                                                ? "2px solid #870047"
                                                : "1px solid rgba(0,0,0,0.15)",
                                            textAlign: "center",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            background: isActive
                                                ? "linear-gradient(135deg, #f91c90, #870047)"
                                                : "rgba(255,255,255,0.95)",
                                            color: isActive ? "#fff" : "#333",
                                            boxShadow: isActive
                                                ? "0 6px 14px rgba(249,28,144,0.45)"
                                                : "0 2px 6px rgba(0,0,0,0.15)",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.transform = "scale(1.04)";
                                                e.currentTarget.style.background =
                                                    "rgba(249, 28, 144, 0.15)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.transform = "scale(1)";
                                                e.currentTarget.style.background =
                                                    "rgba(255,255,255,0.95)";
                                            }
                                        }}
                                    >
                                        {room.label}
                                    </button>
                                );
                            })}

                            {filteredRooms.length === 0 && (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        opacity: 0.6,
                                        textAlign: "center",
                                        marginTop: "10px",
                                    }}
                                >
                                    No rooms found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* TEMP LEGEND FOR HEAT MAP */}
            {heatMapEnabled && (
                <div className="legend-panel">
                    <div className="legend-header">Temperature</div>

                    <div className="legend-stack">
                        {TEMP_HUMIDITY_LEGEND.map((item) => (
                            <div
                                key={item.range}
                                className="legend-stack-row center-only"
                                style={{ background: item.color }}
                            >
                                <span className="legend-stack-range">
                                    {item.range}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {occupancyEnabled && (
                <div className="legend-panel">
                    <div className="legend-header">Occupancy Status</div>

                    <div className="legend-stack">
                        <div
                            className="legend-stack-row center-only"
                            style={{ background: "#00cc55" }}
                        >
                            <span className="legend-stack-range">Unoccupied</span>
                        </div>

                        <div
                            className="legend-stack-row center-only"
                            style={{ background: "#ff2b2b" }}
                        >
                            <span className="legend-stack-range">Occupied</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="toggle-row">
            <span className="toggle-label">{label}</span>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="slider" />
            </label>
        </div>
    );
}