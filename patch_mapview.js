const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');
code = code.replace(/<MapView \s*userLocation/m, '<MapView settings={settings} userLocation');
fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
