


import { useEffect, useRef } from "react";
import { useThree, invalidate } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { applyColors } from "./applyColors";

// ----------------------
// Reusable Metallic PBR Material
// ----------------------
function createPBRMaterial(baseColor = 0xffffff, roughness = 0.8, metalness = 0.04, envMap = null) {
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness,
    metalness,
    envMap,
    envMapIntensity: 0.5,
  });
}

export default function Model() {
  const groupRef = useRef();
  const { camera, gl } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.physicallyCorrectLights = true;

    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    loader.load(
      "/models/model iso.glb",
      (gltf) => {
        const model = gltf.scene;

        /* =========================
           CENTER MODEL
        ========================= */
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y -= box.min.y;

        groupRef.current.clear();
        groupRef.current.add(model);

        /* ===== FORCE FIRST RENDER ===== */
        invalidate();

        // ----------------------
        // Apply studio metallic PBR to all meshes
        // ----------------------
        model.traverse((child) => {
          if (child.isMesh) {
            // Preserve original color if present
            let color = 0xffffff;
            if (child.material && !Array.isArray(child.material) && 'color' in child.material) {
              color = child.material.color.getHex();
            }

            if (child.material && child.material.isMeshStandardMaterial) {
              child.material.roughness = 0.8;
              child.material.metalness = 0.0;

              if (child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              }

              child.material.needsUpdate = true;
            } // studio metallic
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        /* =========================
           FLOOR MATERIAL (IMPORTANT)
        ========================= */
        const floorTexture = textureLoader.load("/images/floor3.jpg");
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(6, 3);
        floorTexture.colorSpace = THREE.SRGBColorSpace;

        const floorMaterial = new THREE.MeshStandardMaterial({
          map: floorTexture,
          roughness: 1,
          metalness: 0.0,
        });

        /* =========================
           GLOBAL REGISTRY
        ========================= */
        window.sceneMeshes = {};
        window.floorMeshes = [];
        window.__SENSOR_POSITIONS__ = []; // HEAT

        /* =========================
           APPLY COLORS + REGISTER
        ========================= */
        model.traverse((obj) => {
          applyColors({ obj, floorMaterial });
          if (!obj.isMesh) return;

          // UNIQUE MATERIAL PER MESH
          if (obj.material && !obj.userData._uniqueMaterial) {
            obj.material = obj.material.clone();
            obj.userData._uniqueMaterial = true;
          }

          obj.castShadow = false;

          // Disable Blender emissive completely
          if (obj.material) {
            if (obj.material.emissive) obj.material.emissive.set("#000000");
            obj.material.emissiveIntensity = 0;
            obj.material.toneMapped = true;
          }

          // FLOOR DETECTION
          const lname = obj.name.toLowerCase();
          const isFloor = lname.includes("floor") || lname.includes("ground") || lname.includes("tile") || lname.includes("carpet");

          if (isFloor) {
            obj.userData.isFloor = true;
            obj.receiveShadow = true;
            window.floorMeshes.push(obj);
          }

          // SENSOR DETECTION
          if (lname.includes("sensor")) {
            obj.updateWorldMatrix(true, false);
            const worldPos = new THREE.Vector3();
            obj.getWorldPosition(worldPos);
            window.__SENSOR_POSITIONS__.push(worldPos);
          }

          // REGISTER FOR NIAGARA
          window.sceneMeshes[obj.name] = obj;
        });

        /* =========================
           CAMERA
        ========================= */
        camera.position.set(6.96, 4.07, -0.56);
        camera.lookAt(-10, 0, 0);
        camera.updateProjectionMatrix();                   
        // Dispatch meshes-ready
        window.dispatchEvent(new Event("scene-meshes-ready"));
      });
  }, [camera, gl]);

  return <group ref={groupRef} />;
}













