



import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

const MAX_POINTS = 400;

export default function HeatmapPlane({ heatPoints = [], heatValues = [] }) {
  const { scene } = useThree();
  const materialRef = useRef();
  const [heatPointsState, setHeatPointsState] = useState([]);
  const [heatValuesState, setHeatValuesState] = useState([]);
  const [visible, setVisible] = useState(false);
  const [hoveredSensor, setHoveredSensor] = useState(null);
  const [sensorTemps, setSensorTemps] = useState({});

  useEffect(() => {
    if (!materialRef.current) return;

    const uniforms = materialRef.current.uniforms;
    if (!uniforms?.heatPoints?.value) return;

    // Reset
    for (let i = 0; i < MAX_POINTS; i++) {
      uniforms.heatPoints.value[i] = new THREE.Vector3(0, 0, 0);
      uniforms.heatValues.value[i] = 0;
    }

    // Fill
    for (let i = 0; i < heatPointsState.length && i < MAX_POINTS; i++) {
      const p = heatPointsState[i];
      if (!p) continue;

      uniforms.heatPoints.value[i] = new THREE.Vector3(p.x, p.y, p.z);
      uniforms.heatValues.value[i] = heatValuesState[i] ?? 0;
    }

    uniforms.pointCount.value = Math.min(heatPointsState.length, MAX_POINTS);

  }, [heatPointsState, heatValuesState]);


  useEffect(() => {



    function handleNiagara(e) {
      const d = e?.detail;
      if (!d) return;

      const { sensorId, value, displayName } = d;
      if (value == null) return;

      const MIN_TEMP = 18;
      const MAX_TEMP = 32;

      let normalized = (value - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
      normalized = Math.max(0, Math.min(1, normalized));
      setSensorTemps(prev => ({
        ...prev,
        [sensorId]: {
          value,
          displayName
        }
      }));

      const mesh = scene.getObjectByName(sensorId);
      if (!mesh) return;

      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);

      const pos = {
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z
      };

      setHeatPointsState(prevPoints => {
        const existingIndex = prevPoints.findIndex(p => p.id === sensorId);

        if (existingIndex !== -1) {
          const updated = [...prevPoints];
          updated[existingIndex] = { ...pos, id: sensorId };

          setHeatValuesState(prevValues => {
            const copy = [...prevValues];
            copy[existingIndex] = normalized;
            return copy;
          });

          return updated;
        } else {
          setHeatValuesState(prevValues => [...prevValues, normalized]);
          return [...prevPoints, { ...pos, id: sensorId }];
        }
      });

      setVisible(true);
    }

    // 🔥 INSERT THIS BLOCK RIGHT HERE (AFTER handleNiagara, BEFORE addEventListener)

    if (window.__niagaraTempCache) {
      Object.entries(window.__niagaraTempCache).forEach(
        ([sensorId, data]) => {

          if (data?.value == null) return;

          handleNiagara({
            detail: {
              sensorId,
              value: data.value,
              displayName: data.displayName
            }
          });
        }
      );
    }

    // 🔥 THEN KEEP THIS

    window.addEventListener("niagara-temp-sensor-update", handleNiagara);

    return () =>
      window.removeEventListener("niagara-temp-sensor-update", handleNiagara);

  }, []);

  function handlePointerMove(e) {
    e.stopPropagation();

    const point = e.point;

    let nearest = null;
    let minDist = Infinity;

    heatPointsState.forEach(p => {
      const dx = p.x - point.x;
      const dz = p.z - point.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    });

    const HOVER_RADIUS = 4;

    if (minDist < HOVER_RADIUS && nearest) {
      setHoveredSensor(nearest.id);
    } else {
      setHoveredSensor(null);
    }
  }

  const uniformsRef = useRef({
    heatPoints: {
      value: Array.from({ length: MAX_POINTS }, () => new THREE.Vector3())
    },
    heatValues: {
      value: new Array(MAX_POINTS).fill(0)
    },
    pointCount: { value: 0 }
  });
  if (!visible) return null;

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 2.8, 0]}
        onPointerMove={handlePointerMove}
        onPointerOut={() => setHoveredSensor(null)}
      >
        <planeGeometry args={[78, 60, 160, 120]} />

        <shaderMaterial
          ref={materialRef}
          uniforms={uniformsRef.current}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}


          vertexShader={`
          uniform vec3 heatPoints[400];
          uniform float heatValues[400];
          uniform int pointCount;

          varying float vHeat;

          void main() {

            vec3 pos = position;
            float heat = 0.0;

            for (int i = 0; i < 400; i++) {
              if (i >= pointCount) break;

              float dist = distance((modelMatrix * vec4(position,1.0)).xz, heatPoints[i].xz);

              float softness = 2.2;
              float influence = exp(-pow(dist / softness, 2.0));

              heat += heatValues[i] * influence;
            }

            heat = clamp(heat, 0.0, 1.0);

            float height = heat * 2.5;
            pos.z += height;

            vHeat = heat;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); 
          }
        `}

          fragmentShader={`
  varying float vHeat;

  void main() {

    float t = clamp(pow(vHeat, 0.65), 0.0, 1.0);

    // Normalized temperature thresholds
    float t21 = (21.0 - 18.0) / (32.0 - 18.0);   // 0.214
float t25 = (25.0 - 18.0) / (32.0 - 18.0);   // 0.5

    vec3 blue  = vec3(0.0, 0.2, 1.0);
    vec3 green = vec3(0.0, 1.0, 0.4);
    vec3 red   = vec3(1.0, 0.0, 0.0);

    vec3 heatColor;

    if (t < t21) {
      // 🔵 Below 21°C → Blue only
      heatColor = blue;
    }
    else if (t < t25) {
      // 🔵🟢 21–25°C → Blue to Green
      float localT = (t - t21) / (t25 - t21);
      heatColor = mix(blue, green, localT);
    }
    else {
      // 🔵🟢🔴 Above 25°C → Blue → Green → Red
      float localT = clamp((t - t25) / (0.8 - t25), 0.0, 1.0);
      vec3 mid = mix(blue, green, 1.0);
      heatColor = mix(mid, red, localT);
    }

    gl_FragColor = vec4(heatColor, t);
  }
`}
        />
      </mesh>

      {hoveredSensor && sensorTemps[hoveredSensor] != null && (
        <Html
          position={[
            heatPointsState.find(p => p.id === hoveredSensor)?.x || 0,
            heatPointsState.find(p => p.id === hoveredSensor)?.y + 3 || 3,
            heatPointsState.find(p => p.id === hoveredSensor)?.z || 0
          ]}
          center
        >
          <div
            style={{
              background: "rgba(10,12,16,0.9)",
              padding: "10px 14px",
              borderRadius: 10,
              minWidth: 170,
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "Montserrat, sans-serif",
              fontSize: 12,
              position: "relative"
            }}
          >
            {/* Header */}
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                marginBottom: 6,
                textAlign: "center"
              }}
            >
              🌡 {sensorTemps[hoveredSensor]?.displayName ?? hoveredSensor}
            </div>

            {/* Temperature Row */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                textAlign: "center"
              }}
            >
              {sensorTemps[hoveredSensor]?.value != null
                ? sensorTemps[hoveredSensor].value.toFixed(2)
                : "--"}°
            </div>
          </div>
        </Html>
      )}
    </>
  );



}


