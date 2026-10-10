import { useEffect, useState } from "react";

export default function CameraLogger({ camera, controls }) {
  const [pos, setPos] = useState([0, 0, 0]);
  const [target, setTarget] = useState([0, 0, 0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!camera || !controls) return;

    let raf;

    const update = () => {
      setPos([
        camera.position.x.toFixed(2),
        camera.position.y.toFixed(2),
        camera.position.z.toFixed(2),
      ]);

      setTarget([
        controls.target.x.toFixed(2),
        controls.target.y.toFixed(2),
        controls.target.z.toFixed(2),
      ]);

      raf = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(raf);
  }, [camera, controls]);

  const handleCopy = () => {
    const text = `
cameraPosition: [${pos.join(", ")}],
cameraTarget:   [${target.join(", ")}]
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "black",
        color: "lime",
        padding: "8px 10px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        borderRadius: "4px",
        minWidth: "260px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <strong>Camera Info</strong>
        <button
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: "none",
            color: copied ? "#00ff99" : "lime",
            cursor: "pointer",
          }}
        >
          {copied ? "✔" : "📋"}
        </button>
      </div>

      <div>cameraPosition: [{pos.join(", ")}],</div>
      <div>cameraTarget: [{target.join(", ")}]</div>
    </div>
  );
}
