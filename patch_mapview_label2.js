const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

code = code.replace('<MapView settings={settings} userLocation={userLocation}', '<MapView settings={settings} userLocation={userLocation} activeFuelLabel={activeFuelLabel}');

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
