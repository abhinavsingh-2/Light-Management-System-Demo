import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Box,
    Typography,
    Slider,
    Tooltip,
    styled,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { safeDispatchEvent } from "../utils/eventBus";

/* ============================================================
   WHITE TOOLTIP
============================================================ */

const WhiteTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
))(() => ({
    "& .MuiTooltip-tooltip": {
        backgroundColor: "#fff",
        color: "#000",
        fontSize: 11,
        padding: "4px 6px",
    },
    "& .MuiTooltip-arrow": { color: "#fff" },
}));

// function ValueLabelComponent(props) {
//     const { children, open, value } = props;
//     return (
//         <WhiteTooltip open={open} placement="top" title={`Value: ${value}`}>
//             {children}
//         </WhiteTooltip>
//     );
// }


function ValueLabelComponent(props) {
    const { children, open, value } = props;

    const formatted =
        Number.isInteger(value)
            ? value
            : Number(value).toFixed(2);

    return (
        <WhiteTooltip open={open} placement="top" title={`Value: ${formatted}`}>
            {children}
        </WhiteTooltip>
    );
}

/* ============================================================
   SLIDER CARD
============================================================ */

function SliderCard({ label, min, max, step, unit, locked = false }) {
    const [value, setValue] = useState(null);
    const [dragging, setDragging] = useState(false);

    const writeLock = useRef(false);
    const lastWrittenValue = useRef(null);
    const mountedRef = useRef(false);

    const round = (v) => Math.round(v / step) * step;

    const formatValue = (val) => {
        if (val === null || val === undefined) return "--";
        const num = Number(val);
        if (isNaN(num)) return "--";
        return Number.isInteger(num) ? num : num.toFixed(2);
    };

    /* RX FROM NIAGARA */
    useEffect(() => {
        const handler = (e) => {
            const { key, value: raw } = e.detail || {};
            if (!key) return;

            const map = {
                "Desired LUX": "Desired_Lux",
                "Dimmer Comfort": "Dimmer_Comfort",
                "Color Temperature": "Color_Temp",
                "EM Lights": "EM_Lights",
                "Avg Level Feedback": "Avg_Level_Feedback",
            };

            if (map[label] !== key) return;

            const num = Number(raw);
            if (isNaN(num)) return;

            if (writeLock.current) {
                if (num === lastWrittenValue.current) writeLock.current = false;
                else return;
            }

            if (!dragging) setValue(num);
        };

        window.addEventListener("niagara-main-slider-update", handler);
        return () =>
            window.removeEventListener("niagara-main-slider-update", handler);
    }, [label, dragging]);

    /* WRITE TO NIAGARA */
    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }

        if (value === null || dragging || locked) return;

        const map = {
            "Desired LUX": "Desired_Lux",
            "Dimmer Comfort": "Dimmer_Comfort",
            "Color Temperature": "Color_Temp",
            "EM Lights": "EM_Lights",
            "Avg Level Feedback": "Avg_Level_Feedback",
        };

        const key = map[label];
        if (!key) return;

        writeLock.current = true;
        lastWrittenValue.current = value;

        safeDispatchEvent(
            new CustomEvent("set-main-slider-value", {
                detail: { key, value },
            })
        );
    }, [value, dragging, label, locked]);

    const handleChange = (_, newValue) => {
        if (locked || !dragging) return;
        const stepped = round(newValue);
        if (stepped !== value) setValue(stepped);
    };

    const handleMouseDown = () => !locked && setDragging(true);
    const handleMouseUp = () => setDragging(false);

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);

    return (
        <Card
            sx={{
                position: "relative",
                p: 0.8,
                borderRadius: 2,
                backgroundColor: "transparent",
                border: "2px solid rgba(255,255,255,0.8)",
                boxShadow: "0 0 8px rgba(255,255,255,0.4)",
                height: "68px",
            }}
        >
            {/* 🔥 Scheduler Icon → EVENT ONLY */}
            {label === "Color Temperature" && (
                <Tooltip title="Open Scheduler">
                    <ScheduleIcon
                        onClick={(e) => {
                            e.stopPropagation();

                            console.log("🖱️ Scheduler icon clicked");

                            if (window.openColorTempSchedulerOrd) {
                                window.openColorTempSchedulerOrd();
                            } else {
                                console.warn("⚠️ Scheduler ORD function not found");
                            }
                        }}
                        sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            fontSize: 18,
                            color: "#0E60D3",
                            cursor: "pointer",
                            "&:hover": { color: "#083a8c" },
                        }}
                    />
                </Tooltip>
            )}

            <Typography sx={{ textAlign: "center", fontSize: 11, fontWeight: 600, mt: 0.5 }}>
                {label}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box flexGrow={1} onMouseDown={handleMouseDown} sx={{ ml: 1 }}>
                    <Slider
                        value={value ?? min}
                        min={min}
                        max={max}
                        step={step}
                        onChange={handleChange}
                        components={{ ValueLabel: ValueLabelComponent }}
                        valueLabelDisplay="auto"
                    />
                </Box>

                <Typography sx={{ width: 65, textAlign: "right", fontSize: 12, fontWeight: 600 }}>
                    {formatValue(value)} {unit}
                </Typography>
            </Box>
        </Card>
    );
}

export default function MainPageSliders() {
    return (
        <div className="d-flex flex-column gap-2">
            <SliderCard label="Desired LUX" min={0} max={2000} step={10} unit="lx" />
            <SliderCard label="Dimmer Comfort" min={0} max={100} step={1} unit="%" />
            <SliderCard label="Color Temperature" min={2700} max={6500} step={100} unit="K" />
            <SliderCard label="EM Lights" min={0} max={100} step={10} unit="%" />
            <SliderCard label="Avg Level Feedback" min={0} max={100} step={10} unit="%" locked />
        </div>
    );
}






// import React, { useState, useEffect, useRef } from "react";
// import {
//     Card,
//     Box,
//     Typography,
//     Slider,
//     Tooltip,
//     styled,
//     Switch,
//     FormControlLabel,
// } from "@mui/material";
// import ScheduleIcon from "@mui/icons-material/Schedule";

// /* ============================================================
//    WHITE TOOLTIP
// ============================================================ */

// const WhiteTooltip = styled(({ className, ...props }) => (
//     <Tooltip {...props} classes={{ popper: className }} arrow />
// ))(() => ({
//     "& .MuiTooltip-tooltip": {
//         backgroundColor: "#fff",
//         color: "#000",
//         fontSize: 11,
//         padding: "4px 6px",
//     },
//     "& .MuiTooltip-arrow": { color: "#fff" },
// }));

// // function ValueLabelComponent(props) {
// //     const { children, open, value } = props;
// //     return (
// //         <WhiteTooltip open={open} placement="top" title={`Value: ${value}`}>
// //             {children}
// //         </WhiteTooltip>
// //     );
// // }


// function ValueLabelComponent(props) {
//     const { children, open, value } = props;

//     const formatted =
//         Number.isInteger(value)
//             ? value
//             : Number(value).toFixed(2);

//     return (
//         <WhiteTooltip open={open} placement="top" title={`Value: ${formatted}`}>
//             {children}
//         </WhiteTooltip>
//     );
// }

// /* ============================================================
//    SLIDER CARD
// ============================================================ */

// function SliderCard({ label, min, max, step, unit, locked = false }) {
//     const [value, setValue] = useState(null);
//     const [dragging, setDragging] = useState(false);

//     const [isAuto, setIsAuto] = useState(false);

//     const writeLock = useRef(false);
//     const lastWrittenValue = useRef(null);
//     const mountedRef = useRef(false);

//     const round = (v) => Math.round(v / step) * step;

//     const formatValue = (val) => {
//         if (val === null || val === undefined) return "--";
//         const num = Number(val);
//         if (isNaN(num)) return "--";
//         return Number.isInteger(num) ? num : num.toFixed(2);
//     };


//     /* ======================================
//    AUTO MODE RX FROM NIAGARA
// ====================================== */

//     useEffect(() => {

//         if (label !== "Dimmer Comfort") return;

//         const handler = (e) => {

//             console.log(
//                 "📡 Niagara Auto Mode:",
//                 e.detail.value
//             );

//             // Niagara:
//             // false = AUTO
//             // true = MANUAL

//             setIsAuto(!e.detail.value);
//         };

//         window.addEventListener(
//             "niagara-auto-mode-update",
//             handler
//         );

//         return () =>
//             window.removeEventListener(
//                 "niagara-auto-mode-update",
//                 handler
//             );

//     }, [label]);

//     /* RX FROM NIAGARA */
//     useEffect(() => {
//         const handler = (e) => {
//             const { key, value: raw } = e.detail || {};
//             if (!key) return;

//             const map = {
//                 "Desired LUX": "Desired_Lux",
//                 "Dimmer Comfort": "Dimmer_Comfort",
//                 "Color Temperature": "Color_Temp",
//                 "EM Lights": "EM_Lights",
//                 "Avg Level Feedback": "Avg_Level_Feedback",
//             };

//             if (map[label] !== key) return;

//             const num = Number(raw);
//             if (isNaN(num)) return;

//             if (writeLock.current) {
//                 if (num === lastWrittenValue.current) writeLock.current = false;
//                 else return;
//             }

//             if (!dragging) setValue(num);
//         };

//         window.addEventListener("niagara-main-slider-update", handler);
//         return () =>
//             window.removeEventListener("niagara-main-slider-update", handler);
//     }, [label, dragging]);

//     /* WRITE TO NIAGARA */
//     useEffect(() => {
//         if (!mountedRef.current) {
//             mountedRef.current = true;
//             return;
//         }

//         if (
//             value === null ||
//             dragging ||
//             locked ||
//             (label === "Dimmer Comfort" && !isAuto)
//         ) return;

//         const map = {
//             "Desired LUX": "Desired_Lux",
//             "Dimmer Comfort": "Dimmer_Comfort",
//             "Color Temperature": "Color_Temp",
//             "EM Lights": "EM_Lights",
//             "Avg Level Feedback": "Avg_Level_Feedback",
//         };

//         const key = map[label];
//         if (!key) return;

//         writeLock.current = true;
//         lastWrittenValue.current = value;

//         window.parent.dispatchEvent(
//             new CustomEvent("set-main-slider-value", {
//                 detail: { key, value },
//             })
//         );
//     }, [value, dragging, label, locked]);

//     const handleChange = (_, newValue) => {
//         if (
//             locked ||
//             !dragging ||
//             (label === "Dimmer Comfort" && !isAuto)
//         ) return;
//         const stepped = round(newValue);
//         if (stepped !== value) setValue(stepped);
//     };


//     /* ======================================
//    AUTO / MANUAL TOGGLE
// ====================================== */

//     const toggleAuto = () => {

//         if (label !== "Dimmer Comfort") return;

//         const newIsAuto = !isAuto;

//         console.log(
//             "🟦 Toggle clicked:",
//             newIsAuto
//         );

//         setIsAuto(newIsAuto);

//         // Niagara:
//         // AUTO = false
//         // MANUAL = true

//         window.dispatchEvent(
//             new CustomEvent(
//                 "niagara-write-auto-mode",
//                 {
//                     detail: {
//                         value: !newIsAuto
//                     }
//                 }
//             )
//         );
//     };


//     const handleMouseDown = () => !locked && setDragging(true);
//     const handleMouseUp = () => setDragging(false);

//     useEffect(() => {
//         window.addEventListener("mouseup", handleMouseUp);
//         return () => window.removeEventListener("mouseup", handleMouseUp);
//     }, []);

//     return (
//         <Card
//             sx={{
//                 position: "relative",
//                 p: 0.8,
//                 borderRadius: 2,
//                 backgroundColor: "transparent",
//                 border: "2px solid rgba(255,255,255,0.8)",
//                 boxShadow: "0 0 8px rgba(255,255,255,0.4)",
//                 height: "68px",
//             }}
//         >
//             {/* 🔥 Scheduler Icon → EVENT ONLY */}
//             {label === "Color Temperature" && (
//                 <Tooltip title="Open Scheduler">
//                     <ScheduleIcon
//                         onClick={(e) => {
//                             e.stopPropagation();

//                             console.log("🖱️ Scheduler icon clicked");

//                             if (window.openColorTempSchedulerOrd) {
//                                 window.openColorTempSchedulerOrd();
//                             } else {
//                                 console.warn("⚠️ Scheduler ORD function not found");
//                             }
//                         }}
//                         sx={{
//                             position: "absolute",
//                             top: 6,
//                             right: 6,
//                             fontSize: 18,
//                             color: "#0E60D3",
//                             cursor: "pointer",
//                             "&:hover": { color: "#083a8c" },
//                         }}
//                     />
//                 </Tooltip>
//             )}

//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     px: 1,
//                     mt: 0.5,
//                 }}
//             >

//                 <Typography
//                     sx={{
//                         fontSize: 11,
//                         fontWeight: 600,
//                     }}
//                 >
//                     {label}
//                 </Typography>

//                 {label === "Dimmer Comfort" && (

//                     <FormControlLabel
//                         control={
//                             <Switch
//                                 checked={isAuto}
//                                 onChange={toggleAuto}
//                                 size="small"
//                             />
//                         }
//                         label={
//                             isAuto
//                                 ? "AUTO"
//                                 : "MANUAL"
//                         }
//                         sx={{
//                             m: 0,

//                             "& .MuiFormControlLabel-label": {
//                                 fontSize: 10,
//                                 fontWeight: 700,
//                             },
//                         }}
//                     />

//                 )}

//             </Box>

//             <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Box flexGrow={1} onMouseDown={handleMouseDown} sx={{ ml: 1 }}>
//                     <Slider
//                         value={value ?? min}
//                         min={min}
//                         max={max}
//                         step={step}
//                         onChange={handleChange}
//                         components={{ ValueLabel: ValueLabelComponent }}
//                         valueLabelDisplay="auto"

//                         disabled={
//                             label === "Dimmer Comfort"
//                                 ? !isAuto
//                                 : locked
//                         }
//                     />
//                 </Box>

//                 <Typography sx={{ width: 65, textAlign: "right", fontSize: 12, fontWeight: 600 }}>
//                     {formatValue(value)} {unit}
//                 </Typography>
//             </Box>
//         </Card>
//     );
// }

// export default function MainPageSliders() {
//     return (
//         <div className="d-flex flex-column gap-2">
//             <SliderCard label="Desired LUX" min={0} max={2000} step={10} unit="lx" />
//             <SliderCard label="Dimmer Comfort" min={0} max={100} step={1} unit="%" />
//             <SliderCard label="Color Temperature" min={2700} max={6500} step={100} unit="K" />
//             <SliderCard label="EM Lights" min={0} max={100} step={10} unit="%" />
//             <SliderCard label="Avg Level Feedback" min={0} max={100} step={10} unit="%" locked />
//         </div>
//     );
// }