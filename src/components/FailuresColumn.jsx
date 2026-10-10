


import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { safeAddEventListener, safeRemoveEventListener } from "../utils/eventBus";

/* =========================================================
   FAILURE CARD
========================================================= */

const FailureCard = ({ label, value, text }) => {

  const getRingColor = (value) => {
    if (value == null) return "#9e9e9e";
    return value ? "#d32f2f" : "#1976d2";
  };

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
        border: "2px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        margin: "auto",
      }}
    >
      <CardContent sx={{ padding: 0, width: "100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <Box position="relative" sx={{ width:"80%", maxWidth:220, aspectRatio:"1", marginBottom:"14px" }}>

          <CircularProgress variant="determinate" value={100} size="100%" thickness={4}
            sx={{ color:getRingColor(value), position:"absolute", top:0, left:0 }} />

          <CircularProgress variant="determinate" value={value==null?0:100} size="100%" thickness={4}
            sx={{ color:getRingColor(value), position:"absolute", top:0, left:0 }} />

          {/* CENTER TEXT NOW USES NIAGARA TEXT */}
          <Box position="absolute" top="50%" left="50%"
            sx={{ width:"58%", height:"58%", transform:"translate(-50%, -50%)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Typography component="div" fontWeight={600}
              sx={{ fontSize:"clamp(22px,5vw,34px)", color:"#000" }}>
              {value == null ? "No Data" : text}
            </Typography>
          </Box>

        </Box>

        <Typography variant="body1"
          sx={{ mt:1, fontWeight:500, color:"#000", fontSize:"clamp(13px,2vw,18px)" }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

/* =========================================================
   COLUMN
========================================================= */

export default function FailuresColumn() {

  const [failureData, setFailureData] = useState({ value:null, text:null });
  const activeRoom = useRef(null);

  useEffect(() => {
    const roomHandler = (e) => {
      activeRoom.current = e.detail?.roomId;
      setFailureData({ value:null, text:null });
    };
    safeAddEventListener("room-selected", roomHandler);
    return () => safeRemoveEventListener("room-selected", roomHandler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const { key, value, text, roomId } = e.detail || {};

      if (key === "RESET_FAILURE") {
        setFailureData({ value:null, text:null });
        return;
      }

      if (activeRoom.current == null && roomId != null)
        activeRoom.current = roomId;

      if (roomId !== activeRoom.current) return;

      if (key === "failureStatus")
        setFailureData({ value, text });
    };

    safeAddEventListener("niagara-dashboard-update", handler);
    return () => safeRemoveEventListener("niagara-dashboard-update", handler);
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth={340} sx={{ padding:"16px 0", margin:"auto" }}>
      <FailureCard label="Light / Driver Failure"
        value={failureData.value}
        text={failureData.text}
      />
    </Box>
  );
}