const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/MapView.jsx', 'utf8');

const newTileLogic = `
  const mapStyle = settings?.mapStyle || 'light';
  
  const getTileUrl = () => {
    if (mapStyle === 'satellite') return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };
`;
code = code.replace(/const mapStyle = settings\?\.mapStyle[\s\S]*?\{z\}\/\{x\}\/\{y\}\.png";\s*\};\s*/, newTileLogic);

// Remove the theme-auto and theme-dark logic
code = code.replace(/className=\{`w-full h-full z-0 \$\{mapStyle === "auto" \? "theme-auto" : mapStyle === "dark" \? "theme-dark" : ""\}`\}/, 'className="w-full h-full z-0"');

fs.writeFileSync('frontend/src/components/MapView.jsx', code, 'utf8');
