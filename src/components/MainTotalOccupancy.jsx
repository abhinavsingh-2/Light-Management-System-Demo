import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material";

/* =========================================================
   MAIN TOTAL OCCUPANCY CARD (MATCH FAILURE BEHAVIOR)
========================================================= */

const TOTAL_COUNT = 218;
const ROYAL_BLUE = "#4169E1";

const TotalOccupancyCard = ({ label, value }) => {

    console.log("🧠 TOTAL OCCUPANCY VALUE:", value);

    // ✅ IMPORTANT: default null → 0 (same as Failure card behavior)
    const numeric = Number(value ?? 0);

    const percent = Math.min((numeric / TOTAL_COUNT) * 100, 100);

    return (
        <Card
            sx={{
                textAlign: "center",
                width: "100%",
                maxWidth: 340,
                borderRadius: 2,
                minHeight: 376,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 2,
                px: 1.5,
                mt: 5,
                backgroundColor: "transparent",
                border: "2px solid rgba(255,255,255,0.8)",
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                margin: "auto",
            }}
        >
            <CardContent sx={{ padding: 0, width: "100%" }}>
                <Box position="relative" sx={{ width: "80%", maxWidth: 220, aspectRatio: "1", margin: "0 auto", mb: 2 }}>
                    
                    {/* Background Ring */}
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size="100%"
                        thickness={4}
                        sx={{
                            color: "rgba(65,105,225,0.2)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    />

                    {/* Foreground Ring */}
                    <CircularProgress
                        variant="determinate"
                        value={percent}
                        size="100%"
                        thickness={4}
                        sx={{
                            color: ROYAL_BLUE,
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    />

                    {/* CENTER TEXT */}
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        sx={{
                            width: "58%",
                            height: "58%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            component="div"
                            fontWeight={600}
                            sx={{
                                fontSize: "clamp(22px, 5vw, 34px)",
                                color: "#000",
                                textAlign: "center",
                            }}
                        >
                            {numeric} / {TOTAL_COUNT}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        fontWeight: 500,
                        color: "#000",
                        fontSize: "clamp(13px,2vw,18px)",
                        textAlign: "center",
                    }}
                >
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
};

/* =========================================================
   COLUMN WRAPPER (Niagara Listener)
========================================================= */

export default function MainTotalOccupancy() {

    // ✅ IMPORTANT: start with 0 instead of null
    const [occupancyValue, setOccupancyValue] = useState(0);

    useEffect(() => {

        const handler = (e) => {
            const { key, value } = e.detail || {};

            console.groupCollapsed("📥 MAIN TOTAL OCCUPANCY RX");
            console.log("Key:", key);
            console.log("Value:", value);
            console.groupEnd();

            if (key === "totalOccupancy") {
                setOccupancyValue(value ?? 0);
            }
        };

        window.addEventListener("niagara-main-total-occupancy-update", handler);

        return () =>
            window.removeEventListener(
                "niagara-main-total-occupancy-update",
                handler
            );

    }, []);

    return (
        <TotalOccupancyCard
            label="Total Occ"
            value={occupancyValue}
        />
    );
}