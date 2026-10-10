// src/components/GLBViewer.jsx
import React, { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

function GLBModel() {
  const group = useRef();
  const { scene, gl } = useThree();
  const envMapRef = useRef(null);

  /** ----------------------- LOAD HDR (OFFLINE) ----------------------- **/
  useEffect(() => {
    console.log("HDR → Loading /studio_small_08_1k.hdr");

    new RGBELoader()
      .setDataType(THREE.FloatType)
      .load(
        "/studio_small_08_1k.hdr",
        (hdr) => {
          try {
            const pmrem = new THREE.PMREMGenerator(gl);
            envMapRef.current = pmrem.fromEquirectangular(hdr).texture;
            console.log("HDR → Env map ready");
          } catch (e) {
            console.error("HDR PMREM error:", e);
          }
        },
        undefined,
        (err) => console.error("HDR load error:", err)
      );
  }, [gl]);

  /** ----------------------- MIRROR MATERIAL MAKER ----------------------- **/
  const makeMirrorMaterial = () =>
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.8,
      roughness: 0.12,
      envMap: envMapRef.current,
      envMapIntensity: 1.6,
      side: THREE.DoubleSide,
    });

  const isCube002OrChild = (obj) => {
    let o = obj;
    while (o) {
      if (String(o.name).toLowerCase() === "cube002") return true;
      o = o.parent;
    }
    return false;
  };

  /** ----------------------- LOAD THE GLB ----------------------- **/
  useEffect(() => {
    console.log("GLB → Loading Receptionalt");
    const loader = new GLTFLoader();

    loader.load(
      "/models/2ndFloor/Receptionalt 1.glb",
      (gltf) => {
        console.log("GLB → Loaded OK", gltf);

        const model = gltf.scene;

        /** ---------- FIX 1: CENTER MODEL ---------- **/
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        /** ---------- FIX 2: SCALE IT UP ---------- **/
        model.scale.set(1.5, 1.5, 1.5);

        /** ---------- FIX 3: FLOOR OFFSET ---------- **/
        model.position.y = -0.4;

        /** ---------- FIX 4: Rotate to face camera ---------- **/
        model.rotation.y = Math.PI;

        group.current.add(model);

        /** ---------- Traverse and assign materials ---------- **/
        model.traverse((child) => {
          if (!child.isMesh) return;

          const name = child.name.toLowerCase();
          child.material.roughness = 0.55;
          child.material.metalness = 0;

          if (name.includes("cuboid")) {
            child.material.color.set(0xffffff);
          }

          if (["cube001", "cube"].includes(name)) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#7F9AB8",
              roughness: 0.6,
            });
          }

          if (
            ["circle006", "circle007", "circle009", "circle001", "circle002", "circle"].includes(
              name
            )
          ) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#ff9f80",
              roughness: 0.4,
            });
          }

          if (["circle008"].includes(name)) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#555",
              roughness: 0.4,
            });
          }

          if (["circle003", "circle011"].includes(name)) {
            child.material = new THREE.MeshStandardMaterial({
              color: "#D3B683",
              roughness: 0.4,
            });
          }

          /** ---------- Ceiling Lights ---------- **/
          if (["cube565", "cube561"].includes(name)) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffcc,
              emissive: 0xffffcc,
              emissiveIntensity: 3.5,
            });

            const pos = child.getWorldPosition(new THREE.Vector3());

            const spot = new THREE.SpotLight(0xffffaa, 35, 25, Math.PI / 3, 0.4, 1);
            spot.castShadow = true;
            spot.position.set(pos.x, pos.y + 0.6, pos.z);

            const target = new THREE.Object3D();
            target.position.set(pos.x, pos.y - 4, pos.z);

            scene.add(target);
            spot.target = target;
            scene.add(spot);
          }

          /** ---------- Cylinder Glow ---------- **/
          if (name.includes("cylinder")) {
            const bbox = new THREE.Box3().setFromObject(child);
            const radius = (bbox.max.x - bbox.min.x) * 0.5;

            const bottom = new THREE.Mesh(
              new THREE.CircleGeometry(radius, 32),
              new THREE.MeshStandardMaterial({
                color: 0xffff00,
                emissive: 0xffff00,
                emissiveIntensity: 30,
              })
            );

            bottom.rotation.x = -Math.PI / 2;
            bottom.position.set(child.position.x, bbox.min.y - 0.002, child.position.z);
            scene.add(bottom);
          }
        });

        /** ---------- Gradient + Mirror Pass ---------- **/
        model.traverse((mesh) => {
          if (!mesh.isMesh) return;
          if (!isCube002OrChild(mesh)) return;

          const geo = mesh.geometry.clone();
          const pos = geo.attributes.position;

          if (!pos) return;

          const colors = new Float32Array(pos.count * 3);
          const top = new THREE.Color("#FB9EC6");
          const bottom = new THREE.Color("#FFE893");

          for (let i = 0; i < pos.count; i++) {
            const t = i / pos.count;
            const c = bottom.clone().lerp(top, t);

            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
          }

          geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
          mesh.geometry = geo;

          const applyMirror = () => {
            if (envMapRef.current) {
              mesh.material = makeMirrorMaterial();
            } else {
              requestAnimationFrame(applyMirror);
            }
          };

          applyMirror();
        });
      },

      // progress
      undefined,

      // error
      (err) => console.error("GLB Load Error:", err)
    );
  }, [scene, gl]);

  return <group ref={group} />;
}

/** ----------------------- MAIN VIEWER ----------------------- **/
export default function GLBViewer() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 2, 12], // pulled back so entire room fits
        fov: 40,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl, camera }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMappingExposure = 0.35; // prevent over-white glow
        camera.rotation.set(-0.05, 0, 0);
      }}
    >
      {/* Balanced Light */}
      <hemisphereLight intensity={0.35} />
      <ambientLight intensity={0.4} />

      {/* Anchor floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <OrbitControls enableDamping enableZoom />

      <GLBModel />
    </Canvas>
  );
}
