export class HeatmapLightSystem {
  constructor(size = 1024) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext("2d");
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawLight(x, y, intensity, radius = 40) {
    const g = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `rgba(255,255,200,${intensity})`);
    g.addColorStop(1, "rgba(255,255,200,0)");

    this.ctx.fillStyle = g;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
