const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/MapView.jsx', 'utf8');

// 1. Add settings to props
code = code.replace(/export default function MapView\(\{ (.*?)\}\) \{/, 'export default function MapView({ settings, $1}) {');

// 2. Define map style and URL
const tileLogic = `
  const mapStyle = settings?.mapStyle || 'auto';
  
  const getTileUrl = () => {
    if (mapStyle === 'satellite') return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    if (mapStyle === 'light') return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    if (mapStyle === 'dark') return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };
`;
code = code.replace(/const \[mapBounds, setMapBounds\] = useState\(null\);/, 'const [mapBounds, setMapBounds] = useState(null);\n' + tileLogic);

// 3. Update MapContainer className
code = code.replace(/className="w-full h-full z-0"/, 'className={`w-full h-full z-0 ${mapStyle === "auto" ? "theme-auto" : ""}`}');

// 4. Update TileLayer
code = code.replace(/<TileLayer url="https:\/\/\{s\}\.tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png" \/>/, '<TileLayer url={getTileUrl()} maxZoom={19} />');

fs.writeFileSync('frontend/src/components/MapView.jsx', code, 'utf8');
