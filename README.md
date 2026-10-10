# SmartSpace 3D &mdash; Real-Time IoT Building Digital Twin

An interactive, web-based 3D spatial digital twin and smart building management dashboard. Built with React, Three.js, and WebGL, SmartSpace 3D visualizes floor-level architectural spatial models, IoT telemetry, climate metrics, and occupancy distribution in real time.

---

## Features

- **Interactive 3D Spatial Twin**: High-fidelity Three.js/WebGL architectural model rendering with smooth orbit, pan, zoom, and room-focus camera transitions.
- **Environmental & Climate Telemetry**: Real-time monitoring of key indoor air quality parameters:
  - Ambient Temperature (&deg;C)
  - Relative Humidity (% RH)
  - Carbon Dioxide (CO&sub2; ppm)
  - Particulate Matter (PM 2.5 & PM 10)
  - Volatile Organic Compounds (VOC)
- **Spatial Heatmaps**: Dynamic gradient overlays for thermal distribution and real-time room occupancy density.
- **Meeting Room & Zone Inspection**: Click-to-inspect room isolation with 3D elevation pins and zone status cards.
- **Building Management Integration**: Telemetry bridge supporting Tridium Niagara BMS points, BACnet/IP, and live sensor event streams.
- **Lighting & Driver Diagnostics**: Instant failure detection, driver load tracking, and lighting circuit status.

---

## Tech Stack

- **Frontend Core**: React 18, Vite
- **3D Graphics & Rendering**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **UI Components & Styling**: Material-UI (MUI), Emotion, Bootstrap grid, Lucide React icons
- **Data Visualization**: Recharts, SVG metric gauges
- **Typography**: Montserrat

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smartspace-3d.git
   cd smartspace-3d
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Project Structure

```text
├── public/              # Static assets, 3D GLB floor models, and icons
├── src/
│   ├── components/      # 3D SceneCanvas, gauges, room cards, and panels
│   ├── css/             # Scoped styles and glassmorphism UI definitions
│   ├── Navbar/          # Telemetry status bar and header metrics
│   ├── niagara/         # BMS / IoT sensor event bridge
│   ├── utils/           # Custom event bus and helpers
│   ├── App.jsx          # Root application layout
│   └── index.jsx        # React DOM entrypoint
├── index.html           # HTML5 entry with Niagara bridge fallbacks
└── package.json         # Project dependencies and build scripts
```

---

## License

MIT License &copy; 2026. Free for personal and educational use.
