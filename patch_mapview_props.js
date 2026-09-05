const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/MapView.jsx', 'utf8');

code = code.replace('export default function MapView({ ', 'export default function MapView({ settings, ');

fs.writeFileSync('frontend/src/components/MapView.jsx', code, 'utf8');
