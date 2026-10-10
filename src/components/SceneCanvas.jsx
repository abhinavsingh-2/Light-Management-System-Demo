
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MapControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";

import Model from "./Model";
import CameraLogger from "./CameraLogger";
import MeetingRoomCard from "./MeetingRoomCard";
import { MEETING_ROOMS } from "./MeetingRoom";
import { useRoomClipping } from "./MeetingRoomCode";
import HeatmapPlane from "./HeatmapPlane";
import Occupancy from "./Occupancy";


import SensorHover from "./SensorHover";
import LightHover from "./LightHover";
import { safeDispatchEvent } from "../utils/eventBus";

import "./../css/RightControlPanel.css";




const BLOOM_LAYER = 1;

const ENABLE_CAMERA_LOGS = false;
const MAX_ACTIVE_LIGHTS = 8; // Further reduced for smooth performance

// ----------------------
// Reusable Metallic PBR Material
// ----------------------



function createGlowTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
    );

    // More subtle gradient for comfortable viewing from top
    g.addColorStop(0.0, "rgba(255, 245, 200, 0.65)");  // Reduced center brightness
    g.addColorStop(0.15, "rgba(255, 240, 180, 0.5)");  // Softer inner glow
    g.addColorStop(0.35, "rgba(255, 230, 150, 0.35)"); // Medium glow
    g.addColorStop(0.6, "rgba(255, 220, 130, 0.2)");   // Soft outer
    g.addColorStop(0.85, "rgba(255, 210, 110, 0.08)"); // Very soft edge
    g.addColorStop(1.0, "rgba(255, 200, 100, 0.0)");   // Fade out

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    return tex;
}



const BULB_GEOMETRY = new THREE.SphereGeometry(0.08, 8, 8); // Reduced segments from 12 to 8
const CONE_GEOMETRY = new THREE.ConeGeometry(1.0, 2.8, 16, 1, true);

/* ===============================
   EXTRA LIGHT SHAPES
=============================== */

const RING_GEOMETRY = new THREE.TorusGeometry(0.18, 0.04, 12, 24);

const LONG_GEOMETRY = new THREE.CylinderGeometry(
    0.05, 0.05, 0.6, 12
);

const SQUARE_GEOMETRY = new THREE.BoxGeometry(
    0.4, 0.05, 0.4
);



const BULB_MATERIAL = new THREE.MeshStandardMaterial({
    color: "#fff2cc",
    emissive: "#ffd37a",
    emissiveIntensity: 1.5,  // Reduced from 2.2
    roughness: 0.15,
    metalness: 0.0
});


new THREE.MeshBasicMaterial({
    color: "#ffffff",                 // PURE WHITE = MAX ENERGY
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,  // 🔥 MAKES IT BLAZE
    depthWrite: false,
    depthTest: false,                 // 🔥 ALWAYS VISIBLE
    side: THREE.DoubleSide
});




/* ===============================
   SELECT GEOMETRY BY TYPE
=============================== */

function getLightGeometry(name) {

    const n = name.toUpperCase();

    if (n.startsWith("CLL")) {
        return BULB_GEOMETRY;
    }

    if (n.startsWith("RL")) {
        return RING_GEOMETRY;
    }

    if (n.startsWith("LL")) {
        return LONG_GEOMETRY;
    }

    if (n.startsWith("SL")) {
        return SQUARE_GEOMETRY;
    }

    // Default fallback
    return BULB_GEOMETRY;
}



/* =========================================================
   DYNAMIC LIGHT MANAGER (PREVENTS GPU OVERLOAD)
========================================================= */
function DynamicLightManager() {
    const { camera, scene } = useThree();
    const frameCounter = useRef(0);
    const lastCameraPosition = useRef(new THREE.Vector3());
    const CAMERA_MOVE_THRESHOLD = 0; // Increased threshold - only update on significant movement
    const frustum = useRef(new THREE.Frustum());
    const projScreenMatrix = useRef(new THREE.Matrix4());

    useFrame(() => {
        console.log(
            "Visible lights:",
            window.__ALL_NIAGARA_LIGHTS__?.filter(l => l.visible).length
        );
    });


    useFrame(() => {
        // Update every 8th frame (~7-8 FPS) for better performance
        if (++frameCounter.current % 12 !== 0) return;


        if (!window.__ALL_NIAGARA_LIGHTS__) return;

        const camPos = camera.position;

        // Skip update if camera hasn't moved much
        if (camPos.distanceTo(lastCameraPosition.current) < CAMERA_MOVE_THRESHOLD) {
            return;
        }


        lastCameraPosition.current.copy(camPos);

        // Update frustum for culling
        camera.updateMatrixWorld(false);
        frustum.current.setFromProjectionMatrix(
            camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse)
        );



        let allLights = window.__ALL_NIAGARA_LIGHTS__ || [];

        // 🔥 If clipping active, filter to visible lights only
        if (window.__CLIPPING_ACTIVE__) {
            allLights = allLights.filter(light => light.parent?.visible);
        }



        // Calculate distances and sort (optimized)
        const lightsWithDistance = [];
        const camX = camPos.x;
        const camY = camPos.y;
        const camZ = camPos.z;

        for (let i = 0; i < allLights.length; i++) {
            const light = allLights[i];
            // const pos = light.position;
            const pos = light.getWorldPosition(new THREE.Vector3());


            // Frustum culling - skip lights not in view


            // Fast distance calculation (squared distance to avoid sqrt)
            // 🔥 Use horizontal distance only (ignore height)
            const dx = pos.x - camX;
            const dz = pos.z - camZ;
            const distSq = dx * dx + dz * dz;


            lightsWithDistance.push({ light, distSq });
        }

        // Sort by squared distance (faster than actual distance)
        lightsWithDistance.sort((a, b) => a.distSq - b.distSq);

        const maxDistSq = 11320 * 11320; // Reduced from 150 to 120 units squared

        // Enable closest lights up to MAX_ACTIVE_LIGHTS
        for (let i = 0; i < lightsWithDistance.length; i++) {
            const { light, distSq } = lightsWithDistance[i];

            if (i < MAX_ACTIVE_LIGHTS && distSq < maxDistSq && light.userData.shouldBeVisible) {

                light.visible = true;

                const v = light.userData.niagaraValue || 0;

                // 🔥 Apply dynamic intensity here
                if (light.isPointLight) {
                    light.intensity = v * 6;   // fill scale
                }

                if (light.isSpotLight) {
                    light.intensity = v * 20;  // real scale
                }

            } else {

                light.visible = false;
                light.intensity = 0;

            }

        }

    });

    return null;
}

/* =========================================================
   CAMERA-FACING BILLBOARD UPDATER (OPTIMIZED + ANGLE-AWARE)
========================================================= */

/* =========================================================
   HOVER RAYCASTER (THROTTLED + CANVAS-AWARE + OPTIMIZED)
========================================================= */
function HoverRaycaster({ setHoveredMeshName }) {
    const { camera, gl } = useThree();

    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    const lastHit = useRef(null);
    const lastCheck = useRef(0);

    const mouseMoving = useRef(false);
    const mouseMoveTimeout = useRef(null);

    const needsRaycast = useRef(false);

    /* ===============================
       Mouse Move Listener (Canvas Based)
    =============================== */
    useEffect(() => {

        if (!gl?.domElement) return;

        const onMove = (e) => {

            const rect = gl.domElement.getBoundingClientRect();

            // Canvas-relative coords (accurate)
            mouse.current.x =
                ((e.clientX - rect.left) / rect.width) * 2 - 1;

            mouse.current.y =
                -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Activity tracking (performance)
            mouseMoving.current = true;
            needsRaycast.current = true;

            clearTimeout(mouseMoveTimeout.current);

            mouseMoveTimeout.current = setTimeout(() => {
                mouseMoving.current = false;
            }, 120);
        };

        gl.domElement.addEventListener("mousemove", onMove, {
            passive: true
        });

        return () => {
            gl.domElement.removeEventListener("mousemove", onMove);
            clearTimeout(mouseMoveTimeout.current);
        };

    }, [gl]);

    /* ===============================
       Raycast Loop (Throttled)
    =============================== */
    useFrame(() => {

        const now = performance.now();

        // Throttle (~6 FPS)
        if (now - lastCheck.current < 150) return;

        // Only when needed
        if (!mouseMoving.current || !needsRaycast.current) return;

        lastCheck.current = now;
        needsRaycast.current = false;

        /* ===============================
           Target Collection
        =============================== */

        let targets = window.__RAYCAST_TARGETS__;

        // Fallback
        if (!targets || targets.length === 0) {
            targets = window.sceneMeshes
                ? Object.values(window.sceneMeshes)
                : [];
        }

        if (!targets || targets.length === 0) return;

        /* ===============================
           Raycast
        =============================== */

        raycaster.current.setFromCamera(mouse.current, camera);

        const hits = raycaster.current.intersectObjects(
            targets,
            false
        );

        /* ===============================
           Result Handling
        =============================== */

        if (hits.length > 0) {

            const name = hits[0].object.name;

            if (name !== lastHit.current) {
                lastHit.current = name;
                setHoveredMeshName(name);
            }

        } else if (lastHit.current !== null) {

            lastHit.current = null;
            setHoveredMeshName(null);
        }

    });

    return null;
}


/* =========================================================
   MAIN SCENE CANVAS
========================================================= */
export default function SceneCanvas({   //heat occupancy
    defaultView,
    selectedRoomId,
    heatMapEnabled,
    occupancyEnabled,
    phase1,
    phase2,
    handlePhase1,
    handlePhase2
}) {
    const controlsRef = useRef();

    const [hoveredMeshName, setHoveredMeshName] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const initialCameraPos = useRef(null);
    const initialCameraTarget = useRef(null);

    const selectedRoom = MEETING_ROOMS.find(r => r.id === selectedRoomId);

    const overlayActive = heatMapEnabled || occupancyEnabled;

    const cameraMovingRef = useRef(false);

    const [sensorPoints, setSensorPoints] = useState([]);

    useEffect(() => {
        const handler = () => {
            const sensors = window.__SENSOR_POSITIONS__ || [];
            console.log("Loaded sensors:", sensors.length);
            setSensorPoints(sensors);
        };

        window.addEventListener("scene-meshes-ready", handler);

        return () => {
            window.removeEventListener("scene-meshes-ready", handler);
        };
    }, []);




    useEffect(() => {
        if (!controlsRef.current) return;

        const controls = controlsRef.current;

        const onStart = () => (cameraMovingRef.current = true);
        const onEnd = () => (cameraMovingRef.current = false);

        controls.addEventListener("start", onStart);
        controls.addEventListener("end", onEnd);

        return () => {
            controls.removeEventListener("start", onStart);
            controls.removeEventListener("end", onEnd);
        };
    }, []);



    // useEffect(() => {
    //   if (!selectedRoomId) return;

    //   console.log("📡 Dispatching room-selected to Niagara:", selectedRoomId);

    //   window.parent.dispatchEvent(
    //     new CustomEvent("room-selected", {
    //       detail: { roomId: selectedRoomId }
    //     })
    //   );
    // }, [selectedRoomId]);


    useEffect(() => {
        if (!selectedRoomId) return;

        console.log("📡 Dispatching room-selected to Niagara:", selectedRoomId);

        window.__ACTIVE_ROOM__ = selectedRoomId;

        safeDispatchEvent(
            new CustomEvent("room-selected", {
                detail: { roomId: selectedRoomId }
            })
        );

    }, [selectedRoomId]);



    useEffect(() => {
        if (overlayActive) {
            setHoveredMeshName(null);
        }
    }, [overlayActive]);


    // ✅ Loading state tracking
    const [loadingState, setLoadingState] = useState({
        modelLoaded: false,
        glowsCreated: 0,
        totalGlows: 0,
        glowsEnabled: false,
        isComplete: false
    });



    /* ===============================
      ACTIVATE NIAGARA (THROTTLED 10s)
   =============================== */
    useEffect(() => {

        let interval = null;

        let lastActivateTime = 0;
        const ACTIVATE_THROTTLE = 5_000; // 10s

        const tryActivate = () => {

            const now = Date.now();

            // ⛔ Throttle
            if (now - lastActivateTime < ACTIVATE_THROTTLE) {
                return;
            }

            // Wait until meshes ready
            if (
                !window.sceneMeshes ||
                Object.keys(window.sceneMeshes).length === 0
            ) {
                return;
            }

            lastActivateTime = now;

            clearInterval(interval);

            /* ===== DEFAULT MODE ===== */
            if (defaultView) {

                const allLights = [];
                const allSensors = [];

                MEETING_ROOMS.forEach((room) => {

                    if (room.light?.meshes) {
                        allLights.push(...room.light.meshes);
                    }

                    if (room.sensor?.meshes) {
                        allSensors.push(...room.sensor.meshes);
                    }

                });

                window.dispatchEvent(
                    new CustomEvent("niagara-activate-meshes", {
                        detail: { meshes: [...allLights, ...allSensors] },
                    })
                );

                window.dispatchEvent(
                    new CustomEvent("niagara-activate-sensors", {
                        detail: { sensors: allSensors },
                    })
                );

                window.dispatchEvent(
                    new CustomEvent("niagara-activate-lights", {
                        detail: { lights: allLights },
                    })
                );

                console.log("⚙️ Activated DEFAULT MODE");

                return;
            }

            /* ===== ROOM MODE ===== */
            if (!selectedRoom) return;

            window.dispatchEvent(
                new CustomEvent("niagara-activate-meshes", {
                    detail: {
                        meshes: [
                            ...selectedRoom.light.meshes,
                            ...selectedRoom.sensor.meshes,
                        ],
                    },
                })
            );

            window.dispatchEvent(
                new CustomEvent("niagara-activate-sensors", {
                    detail: {
                        sensors: selectedRoom.sensor.meshes,
                    },
                })
            );

            window.dispatchEvent(
                new CustomEvent("niagara-activate-lights", {
                    detail: {
                        lights: selectedRoom.light.meshes,
                    },
                })
            );

            console.log("⚙️ Activated ROOM MODE");

        };

        interval = setInterval(tryActivate, 300);

        tryActivate();

        return () => clearInterval(interval);

    }, [defaultView, selectedRoom]);



    /* ===============================
       NIAGARA → CREATE + UPDATE (FULL EFFECT)
    =============================== */
    useEffect(() => {

        console.log("✅ Niagara Visual System Loaded");


        if (!window.__ALL_NIAGARA_LIGHTS__) window.__ALL_NIAGARA_LIGHTS__ = [];

        const glowTexture = createGlowTexture();

        const handler = (e) => {

            console.log("📥 Niagara Update:", e.detail);

            const { mesh, value } = e.detail;

            const scene = window.__THREE_SCENE__;
            if (!scene) return;

            const src = window.sceneMeshes?.[mesh];

            if (!src.userData._emissiveReady) {
                src.material = src.material.clone();
                src.userData._emissiveReady = true;

                src.material.emissive = new THREE.Color("#ffd37a");
                src.material.emissiveIntensity = 0;
                src.material.toneMapped = false;

            }


            if (!src) {
                console.error("❌ Mesh missing:", mesh);
                return;
            }

            const v = Math.min(1, Math.max(0, value / 100));

            /* =================================
               AUTO CREATE (FIRST TIME)
            ================================= */

            let glow = window.sceneMeshes[`NIAGARA_${mesh}_GLOW`];
            let bulb = window.sceneMeshes[`NIAGARA_${mesh}_BULB`];
            let center = window.sceneMeshes[`NIAGARA_${mesh}_CENTER`];
            let real = window.sceneMeshes[`NIAGARA_${mesh}_REAL`];
            let fill = window.sceneMeshes[`NIAGARA_${mesh}_FILL`];

            if (!glow) {

                console.log("✨ Creating Niagara Light:", mesh);

                const basePos = src.getWorldPosition(new THREE.Vector3());

                // 🔵 TOP CIRCULAR GLOW (ONLY FOR CLL / EL)
                let topGlow = window.sceneMeshes[`NIAGARA_${mesh}_TOP_GLOW`];

                if (!topGlow && (mesh.startsWith("CLL") || mesh.startsWith("EL"))) {

                    topGlow = new THREE.Mesh(
                        new THREE.CircleGeometry(0.0, 32), // size of disk
                        new THREE.MeshStandardMaterial({
                            color: "#ffffff",
                            emissive: "#ffffff",
                            emissiveIntensity: 100,    // 🔥 BRIGHT WHITE
                            roughness: 0.1,
                            metalness: 0.0
                        })

                    );

                    // Position just ABOVE the fixture
                    topGlow.position.set(
                        basePos.x,
                        basePos.y + 0.12, // 👈 raise if needed
                        basePos.z
                    );

                    // Face upward (top-down camera)
                    topGlow.rotation.x = -Math.PI / 2;

                    topGlow.visible = false;
                    topGlow.frustumCulled = false;

                    src.add(topGlow);
                    topGlow.layers.enable(BLOOM_LAYER);

                    topGlow.renderOrder = 9999;
                    window.sceneMeshes[`NIAGARA_${mesh}_TOP_GLOW`] = topGlow;
                }


                /* ---------- BULB ---------- */
                /* ---------- LIGHT MESH ---------- */

                // Pick correct geometry
                const geo = getLightGeometry(mesh);

                bulb = new THREE.Mesh(geo, BULB_MATERIAL);

                // Orientation fix
                if (mesh.startsWith("LL")) {
                    bulb.rotation.x = Math.PI / 2; // try this only if needed
                }


                if (mesh.startsWith("RL")) {
                    bulb.rotation.x = Math.PI / 2; // flat ring
                }

                // bulb.position.copy(basePos);
                // bulb.visible = false;

                // scene.add(bulb);

                // window.sceneMeshes[`NIAGARA_${mesh}_BULB`] = bulb;



                /* ---------- GLOW ---------- */


                /* ---------- CENTER ---------- */

                /* ---------- REAL LIGHT ---------- */

                if (mesh.startsWith("CLL")) {

                    real = new THREE.SpotLight(
                        "#FFD7A3",
                        0,
                        40,
                        Math.PI / 2.8,
                        0.6,
                        1.5
                    );

                    real.position.set(0, 0, 0);


                    real.target.position.set(
                        basePos.x,
                        basePos.y - 15,
                        basePos.z
                    );

                    scene.add(real.target);

                } else {

                    real = new THREE.PointLight(
                        "#FFD7A3",
                        0,
                        30,
                        1.5
                    );

                    real.position.copy(basePos);
                }

                real.visible = false;
                real.userData.shouldBeVisible = false;

                src.add(real);


                window.sceneMeshes[`NIAGARA_${mesh}_REAL`] = real;
                window.__ALL_NIAGARA_LIGHTS__.push(real);


                /* ---------- FILL LIGHT ---------- */

                fill = new THREE.PointLight(
                    "#FFD7A3",
                    0,
                    60,
                    2
                );

                fill.position.set(
                    basePos.x,
                    basePos.y - 4,
                    basePos.z
                );

                fill.visible = false;
                fill.userData.shouldBeVisible = false;

                src.add(fill);


                window.sceneMeshes[`NIAGARA_${mesh}_FILL`] = fill;
                window.__ALL_NIAGARA_LIGHTS__.push(fill);
            }


            /* =================================
               UPDATE (EVERY EVENT)
            ================================= */

            const shouldShow = v > 0.02;
            // src.visible = shouldShow;

            // smooth glow curve (no fog, no harsh bloom)
            // Always keep mesh visible
            // src.visible = true;

            // Only control baked glow
            src.material.emissiveIntensity = v > 0.02 ? 2.5 : 0;


            // 🔵 UPDATE TOP CIRCULAR GLOW
            const topGlow = window.sceneMeshes[`NIAGARA_${mesh}_TOP_GLOW`];

            if (topGlow && (mesh.startsWith("CLL") || mesh.startsWith("EL"))) {
                topGlow.visible = shouldShow;

                topGlow.material.opacity = shouldShow ? 1 : 0;



                if (topGlow) {
                    topGlow.visible = shouldShow;
                }

            }




            /* ---- Glow ---- */


            /* ---- Bulb ---- */
            if (bulb) {
                bulb.visible = shouldShow;
                bulb.material.emissiveIntensity = v * 4;
            }


            /* ---- Real Light ---- */
            /* ---- Real Light ---- */
            if (real) {
                real.userData.shouldBeVisible = shouldShow;
                real.userData.niagaraValue = v;   // ✅ store dynamic value
            }


            /* ---- Fill Light ---- */
            // if (fill) {
            //   fill.userData.shouldBeVisible = shouldShow;
            //   // ❌ DO NOT set fill.visible here
            //   fill.intensity = shouldShow ? v * 6 : 0;
            // }

            if (fill) {
                fill.userData.shouldBeVisible = shouldShow;
                fill.userData.niagaraValue = v;   // ✅ store dynamic value
            }


        };


        window.addEventListener("niagara-mesh-update", handler);

        return () =>
            window.removeEventListener("niagara-mesh-update", handler);

    }, []);





    /* ===============================
       NIAGARA → SENSOR COLOR
    =============================== */
    useEffect(() => {

        const lastUpdateMap = {};
        const THROTTLE_MS = 5_000;

        const handler = (e) => {


            if (cameraMovingRef.current) return;

            const { sensorId, bool } = e.detail;

            if (!sensorId) return;

            const now = Date.now();

            if (
                lastUpdateMap[sensorId] &&
                now - lastUpdateMap[sensorId] < THROTTLE_MS
            ) {
                return;
            }

            lastUpdateMap[sensorId] = now;

            let mesh = window.sceneMeshes?.[sensorId];

            if (!mesh && window.scene) {
                mesh = window.scene.getObjectByName(sensorId);
            }

            if (!mesh || !mesh.material) return;

            if (!mesh.userData._sensorMat) {
                mesh.material = mesh.material.clone();
                mesh.userData._sensorMat = true;
            }

            // ✅ PURE BOOLEAN
            const active = bool === true;

            const color = active ? "#ff4d4d" : "#00ff7f";

            mesh.material.color.set(color);
            mesh.material.emissive.set(color);
            mesh.material.emissiveIntensity = 0.3;
            mesh.material.needsUpdate = true;

            console.log("🎨 SENSOR COLOR:", sensorId, bool, color);
        };

        window.addEventListener("niagara-sensor-boolean-update", handler);

        return () =>
            window.removeEventListener("niagara-sensor-boolean-update", handler);

    }, []);


    /* ===============================
     HEAT MAP VISIBILITY CONTROL
  =============================== */
    /* ===============================
       HEAT / OCCUPANCY VISIBILITY CONTROL
    =============================== */
    useEffect(() => {

        const scene = window.__THREE_SCENE__;
        if (!scene) return;

        const overlayActive = heatMapEnabled || occupancyEnabled;

        scene.traverse((obj) => {

            // Store original visibility once
            if (obj.userData._originalVisible === undefined) {
                obj.userData._originalVisible = obj.visible;
            }

            if (obj.isMesh) {
                const pos = obj.getWorldPosition(new THREE.Vector3());

                if (overlayActive && pos.y >= 0.5) {
                    obj.visible = false;
                } else if (!overlayActive) {
                    obj.visible = obj.userData._originalVisible;
                }
            }

            if (obj.isPointLight || obj.isSpotLight) {
                if (overlayActive) {
                    obj.visible = false;
                } else {
                    obj.visible = obj.userData._originalVisible ?? true;
                }
            }

        });

        // Also handle Niagara-managed lights
        if (window.__ALL_NIAGARA_LIGHTS__) {
            window.__ALL_NIAGARA_LIGHTS__.forEach(light => {
                if (overlayActive) {
                    light.visible = false;
                } else {
                    light.visible = true;
                }
            });
        }

    }, [heatMapEnabled, occupancyEnabled]);
    return (
        <div style={{ width: "100vw", height: "100%", position: "relative" }}>
            <Canvas
                frameloop="always"
                shadows={false}  // ✅ Disable shadows completely for major performance boost
                onCreated={({ camera, scene, gl }) => {
                    setCameraRef(camera);
                    window.__THREE_CAMERA__ = camera;
                    window.__THREE_SCENE__ = scene;
                    gl.localClippingEnabled = true;
                    // Optimized renderer settings for performance
                    gl.physicallyCorrectLights = false;  // Disable for better performance
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 0.95;  // Reduced for less bright, more comfortable viewing
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                    gl.shadowMap.enabled = false;

                    // Performance optimizations
                    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // Cap pixel ratio
                }}
                gl={{
                    antialias: window.devicePixelRatio < 2,  // Only use antialiasing on low-DPI screens
                    localClippingEnabled: true,
                    powerPreference: "high-performance",  // Request high-performance GPU
                    stencil: false,  // Disable stencil buffer
                    depth: true
                }}
            >

                <color attach="background" args={["#b1b1b1"]} />

                {/* Further reduced ambient for better light definition */}
                <ambientLight intensity={0.8} />
                <hemisphereLight skyColor="#eeeeff" groundColor="#222222" intensity={0.25} />
                <directionalLight
                    color="#ffffff"
                    intensity={0.9}
                    position={[10, 20, 10]}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />


                <Model />
                {heatMapEnabled && sensorPoints.length > 0 && (  //heat
                    <HeatmapPlane
                        heatPoints={sensorPoints}
                        heatValues={sensorPoints.map(() => 1.0)}
                    />
                )}
                {occupancyEnabled && (
                    <Occupancy />
                )}
                <MinimalBloom />


                <DynamicLightManager />

                {/* <HoverRaycaster setHoveredMeshName={setHoveredMeshName} />
        <SensorHover hoveredMeshName={hoveredMeshName} />
        <LightHover hoveredMeshName={hoveredMeshName} /> */}

                {!overlayActive && (
                    <>
                        <HoverRaycaster setHoveredMeshName={setHoveredMeshName} />
                        <SensorHover hoveredMeshName={hoveredMeshName} />
                        <LightHover hoveredMeshName={hoveredMeshName} />
                    </>
                )}


                <MapControls
                    makeDefault
                    ref={controlsRef}
                    enablePan
                    enableRotate
                    enableZoom
                    screenSpacePanning
                    enableDamping
                    dampingFactor={0.05}  // Smoother damping
                    minDistance={1}
                    maxDistance={2000}
                    maxPolarAngle={Math.PI}
                    zoomSpeed={0.8}  // Slightly slower zoom
                    rotateSpeed={0.8}  // Slightly slower rotation
                    panSpeed={0.8}  // Slightly slower pan
                    mouseButtons={{
                        LEFT: THREE.MOUSE.ROTATE,
                        MIDDLE: THREE.MOUSE.DOLLY,
                        RIGHT: THREE.MOUSE.PAN,
                    }}
                />

                {selectedRoom && (
                    <MeetingRoomCard
                        name={selectedRoom.label}
                        position={
                            selectedRoom.MEETING_CARD_POS?.position || [0, 2.5, 0]
                        }
                        heightMultiplier={1}
                    />
                )}


                <RoomIsolationBridge
                    selectedRoomId={selectedRoomId}
                    defaultView={defaultView}
                    controlsRef={controlsRef}
                    initialCameraPos={initialCameraPos}
                    initialCameraTarget={initialCameraTarget}
                />
            </Canvas>
            {/* 🔴 PHASE BUTTONS (ADD THIS BLOCK) */}
            {/* <div className="phase-panel">
                <button
                    className={`phase-btn ${phase1 ? "active" : ""}`}
                    onClick={handlePhase1}
                >
                    Phase 1
                </button>

                <button
                    className={`phase-btn ${phase2 ? "active" : ""}`}
                    onClick={handlePhase2}
                >
                    Phase 2
                </button>
            </div> */}


            {/* Floor panel removed as 11th, 10th and 12th floor are not required */}


            {ENABLE_CAMERA_LOGS && cameraRef && controlsRef.current && (
        <CameraLogger camera={cameraRef} controls={controlsRef.current} />
      )}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
        </div>
    );
}

/* ===============================
       ROOM ISOLATION
    =============================== */

function MinimalBloom() {
    const { gl, scene, camera, size } = useThree();
    const composer = useRef();

    useEffect(() => {
        const renderPass = new RenderPass(scene, camera);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(size.width, size.height),
            0.15,
            0.0,
            0.9
        );

        composer.current = new EffectComposer(gl);
        composer.current.renderToScreen = true;

        composer.current.setSize(size.width, size.height);
        composer.current.addPass(renderPass);
        composer.current.addPass(bloomPass);

        return () => composer.current?.dispose();
    }, [gl, scene, camera, size]);

    useFrame((state) => {
        if (!composer.current) return;

        // 🔥 Re-apply clipping planes before postprocessing
        state.gl.localClippingEnabled = true;

        composer.current.render();
    }, 1);

    return null;
}
function RoomIsolationBridge({
    selectedRoomId,
    defaultView,
    controlsRef,
    initialCameraPos,
    initialCameraTarget,
}) {
    const { isolateRoom, clearClipping } = useRoomClipping();

    useEffect(() => {
        if (defaultView || !selectedRoomId) {
            clearClipping();

            if (controlsRef.current && initialCameraPos.current) {
                const camera = controlsRef.current.object;
                camera.position.copy(initialCameraPos.current);

                if (!initialCameraTarget.current) {
                    initialCameraTarget.current =
                        controlsRef.current.target.clone();
                }

                controlsRef.current.target.copy(
                    initialCameraTarget.current
                );
                controlsRef.current.update();
            }
            return;
        }

        const room = MEETING_ROOMS.find(
            (r) => r.id === selectedRoomId
        );

        if (room) isolateRoom(room);
    }, [
        selectedRoomId,
        defaultView,
        isolateRoom,
        clearClipping,
        controlsRef,
        initialCameraPos,
        initialCameraTarget,
    ]);

    return null;
}





