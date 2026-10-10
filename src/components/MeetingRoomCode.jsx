// // // MeetingRoomCode.jsx
// // import * as THREE from "three";
// // import { useThree } from "@react-three/fiber";
// // import { useCallback, useRef } from "react";

// // /* ===============================
// //    ROOM CLIPPING + CAMERA HOOK
// // =============================== */
// // export function useRoomClipping() {
// //   const { gl, camera, controls } = useThree();

// //   // 🔑 Prevent overlapping animations
// //   const animationRef = useRef(null);

// //   /* ===============================
// //      SMOOTH CAMERA MOVE
// //   =============================== */
// //   const smoothMoveCamera = useCallback(
// //     (targetPos, targetLook, duration = 1200, onComplete) => {
// //       if (!targetPos || !targetLook) return;

// //       // ❌ Cancel any previous animation
// //       if (animationRef.current) {
// //         cancelAnimationFrame(animationRef.current);
// //         animationRef.current = null;
// //       }

// //       const startPos = camera.position.clone();
// //       const startTarget = controls?.target.clone() ?? new THREE.Vector3();

// //       const endPos = new THREE.Vector3(...targetPos);
// //       const endTarget = new THREE.Vector3(...targetLook);

// //       const startTime = performance.now();

// //       // 🔒 Freeze controls + disable damping during animation
// //       if (controls) {
// //         controls.enabled = false;
// //         controls.enableDamping = false; // ✅ KEY FIX
// //       }

// //       function animate() {
// //         const elapsed = performance.now() - startTime;
// //         const t = Math.min(elapsed / duration, 1);

// //         camera.position.lerpVectors(startPos, endPos, t);

// //         if (controls) {
// //           controls.target.lerpVectors(startTarget, endTarget, t);
// //           controls.update();
// //         } else {
// //           camera.lookAt(endTarget);
// //         }

// //         if (t < 1) {
// //           animationRef.current = requestAnimationFrame(animate);
// //         } else {
// //           // ✅ Force exact final state (no drift)
// //           camera.position.copy(endPos);

// //           if (controls) {
// //             controls.target.copy(endTarget);
// //             controls.enabled = true;
// //             controls.enableDamping = true; // ✅ RESTORE DAMPING
// //             controls.update();
// //           }

// //           animationRef.current = null;
// //           onComplete?.(); // 🔑 animation finished callback
// //         }
// //       }

// //       animate();
// //     },
// //     [camera, controls]
// //   );

// //   /* ===============================
// //      ROOM ISOLATION
// //   =============================== */
// //   const isolateRoom = useCallback(
// //     (room) => {
// //       if (!room || !room.corners) return;

// //       const xs = room.corners.map((c) => c[0]);
// //       const zs = room.corners.map((c) => c[2]);

// //       const minX = Math.min(...xs);
// //       const maxX = Math.max(...xs);
// //       const minZ = Math.min(...zs);
// //       const maxZ = Math.max(...zs);

// //       const minY = room.minY ?? 0;
// //       const maxY = room.maxY ?? 5;

// //       const planes = [
// //         new THREE.Plane(new THREE.Vector3(1, 0, 0), -minX),
// //         new THREE.Plane(new THREE.Vector3(-1, 0, 0), maxX),

// //         new THREE.Plane(new THREE.Vector3(0, 0, 1), -minZ),
// //         new THREE.Plane(new THREE.Vector3(0, 0, -1), maxZ),

// //         new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY),
// //         new THREE.Plane(new THREE.Vector3(0, -1, 0), maxY),
// //       ];

// //       // 🎥 Move camera FIRST
// //       if (room.cameraPosition && room.cameraTarget) {
// //         smoothMoveCamera(
// //           room.cameraPosition,
// //           room.cameraTarget,
// //           1200,
// //           () => {
// //             // ✂️ Clip ONLY AFTER animation fully finishes
// //             gl.localClippingEnabled = true;
// //             gl.clippingPlanes = planes;
// //             console.log("✅ Room isolated:", room.label);
// //           }
// //         );
// //       }
// //     },
// //     [gl, smoothMoveCamera]
// //   );

// //   /* ===============================
// //      CLEAR ROOM
// //   =============================== */
// //   const clearClipping = useCallback(() => {
// //     // ❌ Stop any running animation
// //     if (animationRef.current) {
// //       cancelAnimationFrame(animationRef.current);
// //       animationRef.current = null;
// //     }

// //     if (controls) {
// //       controls.enabled = true;
// //       controls.enableDamping = true;
// //     }

// //     gl.clippingPlanes = [];
// //     gl.localClippingEnabled = false;
// //   }, [gl, controls]);

// //   return { isolateRoom, clearClipping };
// // }


// // // // MeetingRoomCode.jsx
// // // import * as THREE from "three";
// // // import { useThree } from "@react-three/fiber";
// // // import { useCallback, useRef } from "react";
// // // import { useDashboard } from "./DashboardContext";

// // // export function useRoomClipping() {
// // //   const { gl, camera, controls, scene } = useThree();
// // //   const { setDashboardData } = useDashboard();

// // //   const animationRef = useRef(null);
// // //   const roomFloorRef = useRef(null);

// // //   /* ---------- POINT IN POLYGON (XZ) ---------- */
// // //   const pointInPolygon = (x, z, poly) => {
// // //     let inside = false;
// // //     for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
// // //       const xi = poly[i][0], zi = poly[i][2];
// // //       const xj = poly[j][0], zj = poly[j][2];
// // //       const intersect =
// // //         zi > z !== zj > z &&
// // //         x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
// // //       if (intersect) inside = !inside;
// // //     }
// // //     return inside;
// // //   };

// // //   /* ---------- SMOOTH CAMERA MOVE ---------- */
// // //   const smoothMoveCamera = useCallback(
// // //     (targetPos, targetLook, duration = 1200, onComplete) => {
// // //       if (!targetPos || !targetLook) return;

// // //       if (animationRef.current) {
// // //         cancelAnimationFrame(animationRef.current);
// // //         animationRef.current = null;
// // //       }

// // //       const startPos = camera.position.clone();
// // //       const startTarget = controls?.target.clone() ?? new THREE.Vector3();
// // //       const endPos = new THREE.Vector3(...targetPos);
// // //       const endTarget = new THREE.Vector3(...targetLook);
// // //       const startTime = performance.now();

// // //       if (controls) {
// // //         controls.enabled = false;
// // //         controls.enableDamping = false;
// // //       }

// // //       function animate() {
// // //         const t = Math.min((performance.now() - startTime) / duration, 1);
// // //         camera.position.lerpVectors(startPos, endPos, t);

// // //         if (controls) {
// // //           controls.target.lerpVectors(startTarget, endTarget, t);
// // //           controls.update();
// // //         } else {
// // //           camera.lookAt(endTarget);
// // //         }

// // //         if (t < 1) {
// // //           animationRef.current = requestAnimationFrame(animate);
// // //         } else {
// // //           if (controls) {
// // //             controls.enabled = true;
// // //             controls.enableDamping = true;
// // //           }
// // //           animationRef.current = null;
// // //           onComplete?.();
// // //         }
// // //       }

// // //       animate();
// // //     },
// // //     [camera, controls]
// // //   );

// // //   /* ---------- CREATE ROOM FLOOR ---------- */
// // //   const createRoomFloor = (floorCorners, y) => {
// // //     const shape = new THREE.Shape();
// // //     const offset = window.modelOffset || new THREE.Vector3();

// // //     floorCorners.forEach(([x, , z], i) => {
// // //       const fx = x - offset.x;
// // //       const fz = -(z - offset.z);
// // //       i === 0 ? shape.moveTo(fx, fz) : shape.lineTo(fx, fz);
// // //     });

// // //     shape.closePath();

// // //     const geo = new THREE.ShapeGeometry(shape);
// // //     geo.rotateX(-Math.PI / 2);
// // //     geo.translate(0, y + 1, 0);

// // //     const material =
// // //       window.floorMeshes?.[0]?.material.clone() ||
// // //       new THREE.MeshStandardMaterial({ color: "#cccccc" });

// // //     material.side = THREE.DoubleSide;

// // //     const mesh = new THREE.Mesh(geo, material);
// // //     mesh.receiveShadow = true;
// // //     mesh.frustumCulled = false;
// // //     mesh.renderOrder = 1;

// // //     return mesh;
// // //   };

// // //   /* ---------- ROOM ISOLATION ---------- */
// // //   const isolateRoom = useCallback(
// // //     (room) => {
// // //       if (!room || !room.corners) return;
// // //       setDashboardData(room);

// // //       const xs = room.corners.map((c) => c[0]);
// // //       const zs = room.corners.map((c) => c[2]);

// // //       const minX = Math.min(...xs);
// // //       const maxX = Math.max(...xs);
// // //       const minZ = Math.min(...zs);
// // //       const maxZ = Math.max(...zs);

// // //       const minY = room.minY ?? 0;
// // //       const maxY = room.maxY ?? 5;

// // //       const planes = [
// // //         new THREE.Plane(new THREE.Vector3(1, 0, 0), -minX),
// // //         new THREE.Plane(new THREE.Vector3(-1, 0, 0), maxX),
// // //         new THREE.Plane(new THREE.Vector3(0, 0, 1), -minZ),
// // //         new THREE.Plane(new THREE.Vector3(0, 0, -1), maxZ),
// // //         new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY),
// // //         new THREE.Plane(new THREE.Vector3(0, -1, 0), maxY),
// // //       ];

// // //       /* 🔥 FIXED DELETE[] — APPLY TO ENTIRE SCENE */
// // //       if (room.delete?.length) {
// // //         scene.traverse((obj) => {
// // //           if (!obj.isMesh) return;
// // //           const p = obj.getWorldPosition(new THREE.Vector3());
// // //           if (pointInPolygon(p.x, p.z, room.delete)) {
// // //             obj.visible = false;
// // //           }
// // //         });
// // //       }

// // //       /* Floor handling */
// // //       if (room.floor?.length) {
// // //         window.floorMeshes?.forEach((f) => (f.visible = false));
// // //       }

// // //       if (roomFloorRef.current) {
// // //         scene.remove(roomFloorRef.current);
// // //         roomFloorRef.current.geometry.dispose();
// // //         roomFloorRef.current = null;
// // //       }

// // //       if (room.floor?.length) {
// // //         const floorMesh = createRoomFloor(room.floor, minY);
// // //         scene.add(floorMesh);
// // //         roomFloorRef.current = floorMesh;
// // //       }

// // //       smoothMoveCamera(room.cameraPosition, room.cameraTarget, 1200, () => {
// // //         gl.localClippingEnabled = true;
// // //         gl.clippingPlanes = planes;
// // //       });
// // //     },
// // //     [gl, scene, smoothMoveCamera, setDashboardData]
// // //   );

// // //   /* ---------- CLEAR ---------- */
// // //   const clearClipping = useCallback(() => {
// // //     scene.traverse((obj) => {
// // //       if (obj.isMesh) obj.visible = true;
// // //     });

// // //     window.floorMeshes?.forEach((f) => (f.visible = true));

// // //     if (roomFloorRef.current) {
// // //       scene.remove(roomFloorRef.current);
// // //       roomFloorRef.current.geometry.dispose();
// // //       roomFloorRef.current = null;
// // //     }

// // //     gl.clippingPlanes = [];
// // //     gl.localClippingEnabled = false;

// // //     if (controls) {
// // //       controls.enabled = true;
// // //       controls.enableDamping = true;
// // //     }
// // //   }, [gl, scene, controls]);

// // //   return { isolateRoom, clearClipping };
// // // }

// // import * as THREE from "three";
// // import { useThree } from "@react-three/fiber";
// // import { useCallback, useRef } from "react";
// // import { useDashboard } from "./DashboardContext";

// // export function useRoomClipping() {
// //   const { gl, camera, controls, scene } = useThree();
// //   const { setDashboardData } = useDashboard();

// //   const animationRef = useRef(null);
// //   const roomFloorRef = useRef(null);

// //   /* ---------- POINT IN POLYGON (XZ) ---------- */
// //   const pointInPolygon = (x, z, poly) => {
// //     let inside = false;
// //     for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
// //       const xi = poly[i][0], zi = poly[i][2];
// //       const xj = poly[j][0], zj = poly[j][2];
// //       const intersect =
// //         zi > z !== zj > z &&
// //         x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
// //       if (intersect) inside = !inside;
// //     }
// //     return inside;
// //   };

// //   /* ---------- SMOOTH CAMERA MOVE ---------- */
// //   const smoothMoveCamera = useCallback(
// //     (targetPos, targetLook, duration = 1200, onComplete) => {
// //       if (!targetPos || !targetLook) return;

// //       if (animationRef.current) {
// //         cancelAnimationFrame(animationRef.current);
// //         animationRef.current = null;
// //       }

// //       const startPos = camera.position.clone();
// //       const startTarget = controls?.target.clone() ?? new THREE.Vector3();
// //       const endPos = new THREE.Vector3(...targetPos);
// //       const endTarget = new THREE.Vector3(...targetLook);
// //       const startTime = performance.now();

// //       if (controls) {
// //         controls.enabled = false;
// //         controls.enableDamping = false;
// //       }

// //       function animate() {
// //         const t = Math.min((performance.now() - startTime) / duration, 1);
// //         camera.position.lerpVectors(startPos, endPos, t);

// //         if (controls) {
// //           controls.target.lerpVectors(startTarget, endTarget, t);
// //           controls.update();
// //         } else {
// //           camera.lookAt(endTarget);
// //         }

// //         if (t < 1) {
// //           animationRef.current = requestAnimationFrame(animate);
// //         } else {
// //           if (controls) {
// //             controls.enabled = true;
// //             controls.enableDamping = true;
// //           }
// //           animationRef.current = null;
// //           onComplete?.();
// //         }
// //       }

// //       animate();
// //     },
// //     [camera, controls]
// //   );

// //   /* ---------- CREATE FAKE ROOM FLOOR ---------- */
// //   const createRoomFloor = (floorCorners, y) => {
// //     const shape = new THREE.Shape();
// //     const offset = window.modelOffset || new THREE.Vector3();

// //     floorCorners.forEach(([x, , z], i) => {
// //       const fx = x - offset.x;
// //       const fz = -(z - offset.z); // 🔑 Z flip (matches your model)
// //       i === 0 ? shape.moveTo(fx, fz) : shape.lineTo(fx, fz);
// //     });

// //     shape.closePath();

// //     const geo = new THREE.ShapeGeometry(shape);
// //     geo.rotateX(-Math.PI / 2);
// //     geo.translate(0, y + 1, 0);

// //     const material =
// //       window.floorMeshes?.[0]?.material.clone() ||
// //       new THREE.MeshStandardMaterial({ color: "#cccccc" });

// //     material.side = THREE.DoubleSide;

// //     const mesh = new THREE.Mesh(geo, material);
// //     mesh.receiveShadow = true;
// //     mesh.frustumCulled = false;
// //     mesh.renderOrder = 1;

// //     return mesh;
// //   };

// //   /* ---------- ROOM ISOLATION ---------- */
// //   const isolateRoom = useCallback(
// //     (room) => {
// //       if (!room || !room.corners) return;

// //       setDashboardData(room);

// //       /* ===============================
// //          🔑 GLOBAL RESET (MOST IMPORTANT)
// //       =============================== */
// //       scene.traverse((obj) => {
// //         if (obj.isMesh) obj.visible = true;
// //       });

// //       window.floorMeshes?.forEach((f) => (f.visible = true));

// //       if (roomFloorRef.current) {
// //         scene.remove(roomFloorRef.current);
// //         roomFloorRef.current.geometry.dispose();
// //         roomFloorRef.current = null;
// //       }

// //       gl.clippingPlanes = [];
// //       gl.localClippingEnabled = false;

// //       /* ===============================
// //          CLIPPING PLANES (corners[])
// //       =============================== */
// //       const xs = room.corners.map((c) => c[0]);
// //       const zs = room.corners.map((c) => c[2]);

// //       const minX = Math.min(...xs);
// //       const maxX = Math.max(...xs);
// //       const minZ = Math.min(...zs);
// //       const maxZ = Math.max(...zs);

// //       const minY = room.minY ?? 0;
// //       const maxY = room.maxY ?? 5;

// //       const planes = [
// //         new THREE.Plane(new THREE.Vector3(1, 0, 0), -minX),
// //         new THREE.Plane(new THREE.Vector3(-1, 0, 0), maxX),
// //         new THREE.Plane(new THREE.Vector3(0, 0, 1), -minZ),
// //         new THREE.Plane(new THREE.Vector3(0, 0, -1), maxZ),
// //         new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY),
// //         new THREE.Plane(new THREE.Vector3(0, -1, 0), maxY),
// //       ];

// //       /* ===============================
// //          DELETE[] (only if provided)
// //       =============================== */
// //       if (room.delete?.length) {
// //         scene.traverse((obj) => {
// //           if (!obj.isMesh) return;
// //           const p = obj.getWorldPosition(new THREE.Vector3());
// //           if (pointInPolygon(p.x, p.z, room.delete)) {
// //             obj.visible = false;
// //           }
// //         });
// //       }

// //       /* ===============================
// //          FLOOR[] (only if provided)
// //       =============================== */
// //       if (room.floor?.length) {
// //         window.floorMeshes?.forEach((f) => (f.visible = false));
// //         const floorMesh = createRoomFloor(room.floor, minY);
// //         scene.add(floorMesh);
// //         roomFloorRef.current = floorMesh;
// //       }

// //       /* ===============================
// //          APPLY CAMERA + CLIPPING
// //       =============================== */
// //       smoothMoveCamera(room.cameraPosition, room.cameraTarget, 1200, () => {
// //         gl.localClippingEnabled = true;
// //         gl.clippingPlanes = planes;
// //       });
// //     },
// //     [gl, scene, smoothMoveCamera, setDashboardData]
// //   );

// //   /* ---------- CLEAR ---------- */
// //   const clearClipping = useCallback(() => {
// //     scene.traverse((obj) => {
// //       if (obj.isMesh) obj.visible = true;
// //     });

// //     window.floorMeshes?.forEach((f) => (f.visible = true));

// //     if (roomFloorRef.current) {
// //       scene.remove(roomFloorRef.current);
// //       roomFloorRef.current.geometry.dispose();
// //       roomFloorRef.current = null;
// //     }

// //     gl.clippingPlanes = [];
// //     gl.localClippingEnabled = false;

// //     if (controls) {
// //       controls.enabled = true;
// //       controls.enableDamping = true;
// //     }
// //   }, [gl, scene, controls]);

// //   return { isolateRoom, clearClipping };
// // }



// import * as THREE from "three";
// import { useThree } from "@react-three/fiber";
// import { useCallback, useRef } from "react";
// import { useDashboard } from "./DashboardContext";

// export function useRoomClipping() {
//   const FLOOR_DELAY = 300; // milliseconds


//   const { gl, camera, controls, scene } = useThree();
//   const { setDashboardData } = useDashboard();

//   const animationRef = useRef(null);
//   const roomFloorRef = useRef(null);

//   /* ---------- POINT IN POLYGON (XZ) ---------- */
//   const pointInPolygon = (x, z, poly) => {
//     let inside = false;
//     for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
//       const xi = poly[i][0], zi = poly[i][2];
//       const xj = poly[j][0], zj = poly[j][2];
//       const intersect =
//         zi > z !== zj > z &&
//         x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
//       if (intersect) inside = !inside;
//     }
//     return inside;
//   };

//   /* ---------- SMOOTH CAMERA MOVE ---------- */
//   const smoothMoveCamera = useCallback(
//     (targetPos, targetLook, duration = 1200, onComplete) => {
//       if (!targetPos || !targetLook) return;

//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//         animationRef.current = null;
//       }

//       const startPos = camera.position.clone();
//       const startTarget = controls?.target.clone() ?? new THREE.Vector3();
//       const endPos = new THREE.Vector3(...targetPos);
//       const endTarget = new THREE.Vector3(...targetLook);
//       const startTime = performance.now();

//       if (controls) {
//         controls.enabled = false;
//         controls.enableDamping = false;
//       }

//       function animate() {
//         const t = Math.min((performance.now() - startTime) / duration, 1);
//         camera.position.lerpVectors(startPos, endPos, t);

//         if (controls) {
//           controls.target.lerpVectors(startTarget, endTarget, t);
//           controls.update();
//         } else {
//           camera.lookAt(endTarget);
//         }

//         if (t < 1) {
//           animationRef.current = requestAnimationFrame(animate);
//         } else {
//           if (controls) {
//             controls.enabled = true;
//             controls.enableDamping = true;
//           }
//           animationRef.current = null;
//           onComplete?.();
//         }
//       }

//       animate();
//     },
//     [camera, controls]
//   );

//   /* ---------- CREATE FAKE ROOM FLOOR ---------- */
//   const createRoomFloor = (floorCorners, y) => {
//     const shape = new THREE.Shape();
//     const offset = window.modelOffset || new THREE.Vector3();

//     floorCorners.forEach(([x, , z], i) => {
//       const fx = x - offset.x;
//       const fz = -(z - offset.z); // 🔑 Z flip (matches your model)
//       i === 0 ? shape.moveTo(fx, fz) : shape.lineTo(fx, fz);
//     });

//     shape.closePath();

//     const geo = new THREE.ShapeGeometry(shape);
//     geo.rotateX(-Math.PI / 2);
//     geo.translate(0, y + 1, 0);

//     const material =
//       window.floorMeshes?.[0]?.material.clone() ||
//       new THREE.MeshStandardMaterial({ color: "#cccccc" });

//     material.side = THREE.DoubleSide;

//     const mesh = new THREE.Mesh(geo, material);
//     mesh.receiveShadow = true;
//     mesh.frustumCulled = false;
//     mesh.renderOrder = 1;

//     return mesh;
//   };

//   /* ---------- ROOM ISOLATION ---------- */
//   const isolateRoom = useCallback(
//     (room) => {
//       if (!room || !room.corners) return;

//       setDashboardData(room);
//       window.__CLIPPING_ACTIVE__ = true;


//       // 🎯 Collect only this room's lights
//       window.__ROOM_LIGHTS__ = [];

//       if (room.light?.meshes?.length) {
//         room.light.meshes.forEach(name => {
//           const real = window.sceneMeshes?.[`NIAGARA_${name}_REAL`];
//           const fill = window.sceneMeshes?.[`NIAGARA_${name}_FILL`];

//           if (real) window.__ROOM_LIGHTS__.push(real);
//           if (fill) window.__ROOM_LIGHTS__.push(fill);
//         });
//       }


//       /* ===============================
//          🔑 GLOBAL RESET (MOST IMPORTANT)
//       =============================== */
//       scene.traverse((obj) => {
//         if (obj.isMesh) obj.visible = true;
//       });
//       delete window.__ROOM_LIGHTS__;

//       window.floorMeshes?.forEach((f) => (f.visible = true));

//       if (roomFloorRef.current) {
//         scene.remove(roomFloorRef.current);
//         roomFloorRef.current.geometry.dispose();
//         roomFloorRef.current = null;
//       }

//       gl.clippingPlanes = [];
//       gl.localClippingEnabled = false;

//       /* ===============================
//          CLIPPING PLANES (corners[])
//       =============================== */
//       const xs = room.corners.map((c) => c[0]);
//       const zs = room.corners.map((c) => c[2]);

//       const minX = Math.min(...xs);
//       const maxX = Math.max(...xs);
//       const minZ = Math.min(...zs);
//       const maxZ = Math.max(...zs);

//       const minY = room.minY ?? 0;
//       const maxY = room.maxY ?? 5;

//       const planes = [
//         new THREE.Plane(new THREE.Vector3(1, 0, 0), -minX),
//         new THREE.Plane(new THREE.Vector3(-1, 0, 0), maxX),
//         new THREE.Plane(new THREE.Vector3(0, 0, 1), -minZ),
//         new THREE.Plane(new THREE.Vector3(0, 0, -1), maxZ),
//         new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY),
//         new THREE.Plane(new THREE.Vector3(0, -1, 0), maxY),
//       ];

//       /* ===============================
//          DELETE[] (only if provided)
//       =============================== */
//       if (room.delete?.length) {
//         scene.traverse((obj) => {
//           if (!obj.isMesh) return;
//           const p = obj.getWorldPosition(new THREE.Vector3());
//           if (pointInPolygon(p.x, p.z, room.delete)) {
//             obj.visible = false;
//           }
//         });
//       }

//       /* ===============================
//          FLOOR[] (only if provided)
//       =============================== */


//       /* ===============================
//          APPLY CAMERA + CLIPPING
//       =============================== */
//       smoothMoveCamera(room.cameraPosition, room.cameraTarget, 1200, () => {
//         gl.localClippingEnabled = true;
//         gl.clippingPlanes = planes;

//         /* ===============================
//            ⏳ DELAY FLOOR SWAP
//         =============================== */
//         if (room.floor?.length) {
//           setTimeout(() => {
//             // hide original floors
//             window.floorMeshes?.forEach((f) => (f.visible = false));

//             // create fake room floor
//             const floorMesh = createRoomFloor(room.floor, minY);
//             scene.add(floorMesh);
//             roomFloorRef.current = floorMesh;
//           }, FLOOR_DELAY);
//         }
//       });


//     },
//     [gl, scene, smoothMoveCamera, setDashboardData]
//   );

//   /* ---------- CLEAR ---------- */
//   const clearClipping = useCallback(() => {
//     scene.traverse((obj) => {
//       if (obj.isMesh) obj.visible = true;
//     });
//     window.__CLIPPING_ACTIVE__ = false;
//     window.floorMeshes?.forEach((f) => (f.visible = true));

//     if (roomFloorRef.current) {
//       scene.remove(roomFloorRef.current);
//       roomFloorRef.current.geometry.dispose();
//       roomFloorRef.current = null;
//     }

//     gl.clippingPlanes = [];
//     gl.localClippingEnabled = false;

//     if (controls) {
//       controls.enabled = true;
//       controls.enableDamping = true;
//     }
//   }, [gl, scene, controls]);

//   return { isolateRoom, clearClipping };
// }




import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import { useDashboard } from "./DashboardContext";

export function useRoomClipping() {
  const FLOOR_DELAY = 300; // milliseconds


  const { gl, camera, controls, scene } = useThree();
  const { setDashboardData } = useDashboard();

  const animationRef = useRef(null);
  const roomFloorRef = useRef(null);
  const floorTimeoutRef = useRef(null);

  /* ---------- POINT IN POLYGON (XZ) ---------- */
  const pointInPolygon = (x, z, poly) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], zi = poly[i][2];
      const xj = poly[j][0], zj = poly[j][2];
      const intersect =
        zi > z !== zj > z &&
        x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  /* ---------- SMOOTH CAMERA MOVE ---------- */
  const smoothMoveCamera = useCallback(
    (targetPos, targetLook, duration = 1200, onComplete) => {
      if (!targetPos || !targetLook) return;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const startPos = camera.position.clone();
      const startTarget = controls?.target.clone() ?? new THREE.Vector3();
      const endPos = new THREE.Vector3(...targetPos);
      const endTarget = new THREE.Vector3(...targetLook);
      const startTime = performance.now();

      if (controls) {
        controls.enabled = false;
        controls.enableDamping = false;
      }

      function animate() {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        camera.position.lerpVectors(startPos, endPos, t);

        if (controls) {
          controls.target.lerpVectors(startTarget, endTarget, t);
          controls.update();
        } else {
          camera.lookAt(endTarget);
        }

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          if (controls) {
            controls.enabled = true;
            controls.enableDamping = true;
          }
          animationRef.current = null;
          onComplete?.();
        }
      }

      animate();
    },
    [camera, controls]
  );

  /* ---------- CREATE FAKE ROOM FLOOR ---------- */
  const createRoomFloor = (floorCorners, y) => {
    const shape = new THREE.Shape();
    const offset = window.modelOffset || new THREE.Vector3();

    floorCorners.forEach(([x, , z], i) => {
      const fx = x - offset.x;
      const fz = -(z - offset.z); // 🔑 Z flip (matches your model)
      i === 0 ? shape.moveTo(fx, fz) : shape.lineTo(fx, fz);
    });

    shape.closePath();

    const geo = new THREE.ShapeGeometry(shape);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, y + 1, 0);

    const material =
      window.floorMeshes?.[0]?.material.clone() ||
      new THREE.MeshStandardMaterial({ color: "#cccccc" });

    material.side = THREE.DoubleSide;

    const mesh = new THREE.Mesh(geo, material);
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;

    return mesh;
  };

  const hardResetScene = () => {

    // Cancel pending floor swap
    if (floorTimeoutRef.current) {
      clearTimeout(floorTimeoutRef.current);
      floorTimeoutRef.current = null;
    }

    // Remove fake floor
    if (roomFloorRef.current) {
      scene.remove(roomFloorRef.current);
      roomFloorRef.current.geometry.dispose();
      roomFloorRef.current = null;
    }

    // Restore original floors
    window.floorMeshes?.forEach((f) => (f.visible = true));

    // Reset mesh visibility
    scene.traverse((obj) => {
      if (obj.isMesh) obj.visible = true;
    });

    // Remove clipping from materials
    scene.traverse((obj) => {
      if (!obj.isMesh) return;

      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => {
          mat.clippingPlanes = null;
          mat.needsUpdate = true;
        });
      } else if (obj.material) {
        obj.material.clippingPlanes = null;
        obj.material.needsUpdate = true;
      }
    });

    gl.localClippingEnabled = false;
  };

  /* ---------- ROOM ISOLATION ---------- */
  const isolateRoom = useCallback(
    (room) => {
      if (!room || !room.corners) return;

      setDashboardData(room);
      window.__CLIPPING_ACTIVE__ = true;


      // 🎯 Collect only this room's lights
      window.__ROOM_LIGHTS__ = [];

      if (room.light?.meshes?.length) {
        room.light.meshes.forEach(name => {
          const real = window.sceneMeshes?.[`NIAGARA_${name}_REAL`];
          const fill = window.sceneMeshes?.[`NIAGARA_${name}_FILL`];

          if (real) window.__ROOM_LIGHTS__.push(real);
          if (fill) window.__ROOM_LIGHTS__.push(fill);
        });
      }


      /* ===============================
         🔑 GLOBAL RESET (MOST IMPORTANT)
      =============================== */
      hardResetScene();

      /* ===============================
         CLIPPING PLANES (corners[])
      =============================== */
      const xs = room.corners.map((c) => c[0]);
      const zs = room.corners.map((c) => c[2]);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minZ = Math.min(...zs);
      const maxZ = Math.max(...zs);

      const minY = room.minY ?? 0;
      const maxY = room.maxY ?? 5;

      const planes = [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), -minX),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), maxX),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), -minZ),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), maxZ),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY),
        new THREE.Plane(new THREE.Vector3(0, -1, 0), maxY),
      ];

      /* ===============================
         DELETE[] (only if provided)
      =============================== */
      if (room.delete?.length) {
        scene.traverse((obj) => {
          if (!obj.isMesh) return;
          const p = obj.getWorldPosition(new THREE.Vector3());
          if (pointInPolygon(p.x, p.z, room.delete)) {
            obj.visible = false;
          }
        });
      }

      /* ===============================
         FLOOR[] (only if provided)
      =============================== */


      /* ===============================
         APPLY CAMERA + CLIPPING
      =============================== */
      smoothMoveCamera(room.cameraPosition, room.cameraTarget, 1200, () => {
        gl.localClippingEnabled = true;

        scene.traverse((obj) => {
          if (!obj.isMesh) return;

          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => {
              mat.clippingPlanes = planes;
              mat.clipShadows = true;
              mat.needsUpdate = true;
            });
          } else if (obj.material) {
            obj.material.clippingPlanes = planes;
            obj.material.clipShadows = true;
            obj.material.needsUpdate = true;
          }
        });

        /* ===============================
           ⏳ DELAY FLOOR SWAP
        =============================== */
        if (room.floor?.length) {
          floorTimeoutRef.current = setTimeout(() => {
            // hide original floors
            window.floorMeshes?.forEach((f) => (f.visible = false));

            // create fake room floor
            const floorMesh = createRoomFloor(room.floor, minY);
            scene.add(floorMesh);
            roomFloorRef.current = floorMesh;
          }, FLOOR_DELAY);
        }
      });


    },
    [gl, scene, smoothMoveCamera, setDashboardData]
  );

  /* ---------- CLEAR ---------- */
  const clearClipping = useCallback(() => {

  hardResetScene();

  if (controls) {
    controls.enabled = true;
    controls.enableDamping = true;
  }

}, [gl, scene, controls]);

  return { isolateRoom, clearClipping };
}



