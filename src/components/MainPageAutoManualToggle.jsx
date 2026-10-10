// src/components/MainPageAutoManualToggle.jsx

import React, { useState, useEffect } from "react";

export default function MainPageAutoManualToggle() {

    const [isAuto, setIsAuto] = useState(false);

    /* ======================================
       🔹 NIAGARA → REACT (LISTENER)
    ====================================== */
    useEffect(() => {

        const handler = (e) => {
            console.log("📡 Niagara → Toggle:", e.detail.value);
           setIsAuto(!e.detail.value);
        };

        window.addEventListener("niagara-auto-mode-update", handler);

        return () => {
            window.removeEventListener("niagara-auto-mode-update", handler);
        };

    }, []);

    /* ======================================
       🔹 TOGGLE CLICK (REACT → NIAGARA)
    ====================================== */
   const toggle = () => {

    const newIsAuto = !isAuto;

    console.log("🟦 Toggle clicked (UI Auto):", newIsAuto);

    setIsAuto(newIsAuto);

    // 🔥 Convert back: AUTO=false, MANUAL=true
    window.dispatchEvent(
        new CustomEvent("niagara-write-auto-mode", {
            detail: { value: !newIsAuto }
        })
    );
};

    /* ======================================
       🔹 STYLES
    ====================================== */
    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
    };

    const labelStyle = {
        fontSize: "14px",
        fontWeight: "bold",
        color: isAuto ? "#0d6efd" : "#6c757d",
    };

    const switchStyle = {
        width: "70px",
        height: "34px",
        borderRadius: "20px",
        background: isAuto ? "#0d6efd" : "#6c757d",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.3s ease",
    };

    const circleStyle = {
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        background: "#ffffff",
        position: "absolute",
        top: "3px",
        left: isAuto ? "38px" : "4px",
        transition: "left 0.3s ease",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    };

    /* ======================================
       🔹 UI
    ====================================== */
    return (
        <div style={containerStyle}>

            <span style={labelStyle}>
                {isAuto ? "AUTO" : "MANUAL"}
            </span>

            <div style={switchStyle} onClick={toggle}>
                <div style={circleStyle}></div>
            </div>

        </div>
    );
}