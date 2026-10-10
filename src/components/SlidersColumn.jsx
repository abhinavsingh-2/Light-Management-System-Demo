



import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Box,
  Typography,
  Slider,
  Tooltip,
  styled,
} from "@mui/material";
import { useDashboard } from "./DashboardContext";
import { safeAddEventListener, safeRemoveEventListener, safeDispatchEvent } from "../utils/eventBus";

/* ============================================================
   WHITE TOOLTIP
============================================================ */

const WhiteTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(() => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 12,
    padding: "6px 8px",
  },
  "& .MuiTooltip-arrow": { color: "#fff" },
}));

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <WhiteTooltip open={open} placement="top" title={`Value: ${value}`}>
      {children}
    </WhiteTooltip>
  );
}

/* ============================================================
   SLIDER CARD
============================================================ */

export function SliderCard({
  label,
  min,
  max,
  step,
  unit,
  initialValue,
  locked = false,
}) {
  const [value, setValue] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [isAuto, setIsAuto] = useState(false);

  const activeRoom = useRef(null);
  const writeLock = useRef(false);
  const lastWrittenValue = useRef(null);
  const mountedRef = useRef(false);
  const firstNiagaraRead = useRef(false);

  /* ROOM SELECT */
  useEffect(() => {
    const handler = (e) => {
      const roomId = e.detail?.roomId;
      if (!roomId) return;

      activeRoom.current = roomId;

      writeLock.current = false;
      lastWrittenValue.current = null;
      setDragging(false);
    };

    safeAddEventListener("room-selected", handler);
    return () =>
      safeRemoveEventListener("room-selected", handler);
  }, []);

  /* INITIAL VALUE SYNC */
  useEffect(() => {
    if (initialValue !== undefined && !dragging && !writeLock.current) {
      setValue(Number(initialValue));
    }
  }, [initialValue, dragging]);


  /* ======================================
   AUTO MODE RX
====================================== */

  useEffect(() => {

    if (label !== "Dimmer Comfort")
      return;

    const handler = (e) => {

      const {
        roomId,
        value
      } = e.detail || {};

      if (
        roomId !== activeRoom.current
      ) return;

      // false = AUTO
      // true = MANUAL

      setIsAuto(!value);

    };

    safeAddEventListener(
      "room-auto-mode-update",
      handler
    );

    return () =>
      safeRemoveEventListener(
        "room-auto-mode-update",
        handler
      );

  }, [label]);



  /* RX FROM NIAGARA */
  useEffect(() => {
    const handler = (e) => {
      const { key, value: raw, roomId } = e.detail || {};
      if (!roomId || !key) return;

      if (activeRoom.current === null) {
        activeRoom.current = roomId;
      }

      if (roomId !== activeRoom.current) return;

      const map = {
        "Desired LUX": "Desired_Lux",
        "Dimmer Comfort": "Dimmer_Comfort",
        "Color Temperature": "Color_Temp",
      };

      if (map[label] !== key) return;

      const num = Number(raw);
      if (isNaN(num)) return;

      if (!firstNiagaraRead.current) {
        firstNiagaraRead.current = true;
        writeLock.current = false;
      } else if (writeLock.current) {
        if (num === lastWrittenValue.current) {
          writeLock.current = false;
        } else {
          return;
        }
      }

      if (dragging) return;

      setValue(num);
    };

    safeAddEventListener("niagara-slider-update", handler);
    return () =>
      safeRemoveEventListener("niagara-slider-update", handler);
  }, [label, dragging]);

  /* WRITE TO NIAGARA */
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (value === null || dragging || locked) return;
    if (!activeRoom.current) return;

    const map = {
      "Desired LUX": "Desired_Lux",
      "Dimmer Comfort": "Dimmer_Comfort",
      "Color Temperature": "Color_Temp",
    };

    const key = map[label];
    if (!key) return;

    writeLock.current = true;
    lastWrittenValue.current = value;

    safeDispatchEvent(
      new CustomEvent("set-slider-value", {
        detail: {
          roomId: activeRoom.current,
          key,
          value,
        },
      })
    );
  }, [value, dragging, label, locked]);

  /* SLIDER HANDLERS */

  const round = (v) => Math.round(v / step) * step;

  const handleChange = (_, newValue) => {
    if (
      locked ||
      !dragging ||
      (label === "Dimmer Comfort" && !isAuto)
    ) return;
    const stepped = round(newValue);
    if (stepped !== value) setValue(stepped);
  };


  /* ======================================
   AUTO TOGGLE
====================================== */

  const toggleAuto = () => {

    const newIsAuto =
      !isAuto;

    setIsAuto(newIsAuto);

    safeDispatchEvent(

      new CustomEvent(
        "write-room-auto-mode",
        {
          detail: {

            roomId:
              activeRoom.current,

            // Niagara:
            // false = AUTO
            // true = MANUAL

            value:
              !newIsAuto
          }
        }
      )

    );
  };

  const handleMouseDown = () => {
    if (!locked) setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <Card
      sx={{
        p: 1,
        borderRadius: 2,
        backgroundColor: "transparent",
        border: "2px solid rgba(255,255,255,0.8)",
        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
        height: "114px",
        cursor: locked ? "default" : "pointer",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          px: 1,
        }}
      >

        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "#0b183b",
          }}
        >
          {label}
        </Typography>

        {label === "Dimmer Comfort" && (

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >

            {/* LABEL */}

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color:
                  isAuto
                    ? "#0d6efd"
                    : "#777",
                minWidth: "50px",
                textAlign: "right",
              }}
            >

              {isAuto
                ? "AUTO"
                : "MANUAL"}

            </Typography>

            {/* TOGGLE */}

            <Box
              onClick={toggleAuto}
              sx={{

                width: 42,

                height: 22,

                borderRadius: "20px",

                background:
                  isAuto
                    ? "#0d6efd"
                    : "#6c757d",

                position: "relative",

                cursor: "pointer",

                transition:
                  "background 0.25s ease",

              }}
            >

              {/* CIRCLE */}

              <Box
                sx={{

                  width: 18,

                  height: 18,

                  borderRadius: "50%",

                  background: "#fff",

                  position: "absolute",

                  top: 2,

                  left:
                    isAuto
                      ? 21
                      : 3,

                  transition:
                    "left 0.25s ease",

                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.35)",

                }}
              />

            </Box>

          </Box>

        )}

      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box flexGrow={1} onMouseDown={handleMouseDown} sx={{ ml: 2 }}>
          <Slider
            value={value ?? 0}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            components={{ ValueLabel: ValueLabelComponent }}
            valueLabelDisplay="auto"

            disabled={
              label === "Dimmer Comfort"
                ? !isAuto
                : locked
            }
          />
        </Box>

        <Typography sx={{ width: 60, textAlign: "right", fontSize: 14 }}>
          {value ?? 0} {unit}
        </Typography>
      </Box>
    </Card>
  );
}

/* ============================================================
   COLUMN WRAPPER
============================================================ */export default function SlidersColumn() {

  const { dashboardData } = useDashboard();

  const [selectedRoomId, setSelectedRoomId] = useState(
    window.__ACTIVE_ROOM__ || null
  );

  /* ROOM EVENT */
  useEffect(() => {

    const handler = (e) => {

      const roomId = e.detail?.roomId;
      if (!roomId) return;

      window.__ACTIVE_ROOM__ = roomId;
      setSelectedRoomId(roomId);

    };

    safeAddEventListener("room-selected", handler);

    if (window.__ACTIVE_ROOM__) {
      setSelectedRoomId(window.__ACTIVE_ROOM__);
    }

    return () =>
      safeRemoveEventListener("room-selected", handler);

  }, []);

  /* ZONE ROOMS */
  const ZONE_ROOMS = ["ZONE_1", "ZONE_2", "ZONE_3", "ZONE_4"];
  const isZoneRoom = ZONE_ROOMS.includes(selectedRoomId);

  console.log("Selected Room:", selectedRoomId);

  return (
    <div className="d-flex flex-column gap-3">

      {/* ZONE ROOMS → 3 SLIDERS */}
      {isZoneRoom && (
        <>
          <SliderCard
            label="Desired LUX"
            initialValue={dashboardData?.desiredLux}
            min={0}
            max={2000}
            step={10}
            unit="lx"
          />

          <SliderCard
            label="Dimmer Comfort"
            initialValue={dashboardData?.dimmerComfort}
            min={0}
            max={100}
            step={1}
            unit="%"
          />

          <SliderCard
            label="Color Temperature"
            initialValue={dashboardData?.colorTemp}
            min={2700}
            max={6500}
            step={100}
            unit="K"
            locked
          />
        </>
      )}

      {/* OTHER ROOMS → 2 SLIDERS */}
      {!isZoneRoom && (
        <>
          <SliderCard
            label="Dimmer Comfort"
            initialValue={dashboardData?.dimmerComfort}
            min={0}
            max={100}
            step={1}
            unit="%"
          />

          <SliderCard
            label="Color Temperature"
            initialValue={dashboardData?.colorTemp}
            min={2700}
            max={6000}
            step={100}
            unit="K"
            locked
          />
        </>
      )}

    </div>
  );
}