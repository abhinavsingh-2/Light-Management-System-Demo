import * as THREE from "three";

/* ===============================
   BASIC COLORS
================================ */
export const WALL_DEFAULT_COLOR = "#f7fcffff";

/* ===============================
   GREEN MESHES (EXACT LIST)
================================ */
export const GREEN_MESHES = new Set([
  "Mesh", "Mesh_1",
  "Mesh8179","Mesh8179_1",
  "Mesh8180","Mesh8180_1",
  "Mesh8181","Mesh8181_1",
  "Mesh8182","Mesh8182_1",
  "Mesh8183","Mesh8183_1",
  "Mesh8184","Mesh8184_1",
  "Mesh8185","Mesh8185_1",
  "Mesh8186","Mesh8186_1",
  "Mesh8187","Mesh8187_1",
  "Mesh8188","Mesh8188_1",
  "Mesh8189","Mesh8189_1",
  "Mesh8190","Mesh8190_1",
  "Mesh8191","Mesh8191_1",
  "Mesh8192","Mesh8192_1",
  "Mesh8193","Mesh8193_1",
  "Mesh8194","Mesh8194_1",
  "Mesh8195","Mesh8195_1",
  "Mesh8196","Mesh8196_1",
  "Mesh8197","Mesh8197_1",
  "Mesh8198","Mesh8198_1",
  "Mesh8199","Mesh8199_1",
  "Mesh8200","Mesh8200_1",
  "Mesh8201","Mesh8201_1",
  "Mesh8202","Mesh8202_1",
  "Mesh8203","Mesh8203_1",
  "Mesh8204","Mesh8204_1",
  "Mesh8205","Mesh8205_1",
  "Mesh8206","Mesh8206_1",
  "Mesh8207","Mesh8207_1",
  "Mesh8208","Mesh8208_1",
  "Mesh8209","Mesh8209_1",
  "Mesh8210","Mesh8210_1",
  "Mesh8211","Mesh8211_1",
  "Mesh8212","Mesh8212_1",
  "Mesh8213","Mesh8213_1",
  "Mesh8214","Mesh8214_1",
  "Mesh8215","Mesh8215_1",
  "Mesh8216","Mesh8216_1",
  "Mesh8217","Mesh8217_1",
  "Mesh8218","Mesh8218_1",
  "Mesh8219","Mesh8219_1",
]);

export const GREEN_COLOR = "#109e10";

/* ===============================
   SOFA / STAND COLORS
================================ */
export const SOFA_MESH_COLORS = {
  Cube007: "#000000",
  Cube008: "#FFB731",
  Cube009: "#FFB731",
  Cube010: "#000000",
  Cube011: "#000000",
  Cube012: "#FFB731",
  Cube013: "#FFB731",
  Cube014: "#000000",
};

/* ===============================
   MATERIAL HELPERS (OPTIONAL)
================================ */
export function createStandardMaterial(color, roughness = 0.5, metalness = 0.0) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness,
  });
}
