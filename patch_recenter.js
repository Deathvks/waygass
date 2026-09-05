const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Add recenterTrigger state
code = code.replace(/const \[isUsingGps, setIsUsingGps\] = useState\(true\);/, "const [isUsingGps, setIsUsingGps] = useState(true);\n  const [recenterTrigger, setRecenterTrigger] = useState(0);");

// 2. Increment it in getUserGPS
code = code.replace(/setIsUsingGps\(true\);\s*await detectProvince/g, "setIsUsingGps(true);\n          setRecenterTrigger(prev => prev + 1);\n          await detectProvince");

// 3. Pass it to MapView
code = code.replace(/activeFuelLabel=\{activeFuelLabel\}/, "activeFuelLabel={activeFuelLabel} recenterTrigger={recenterTrigger}");

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
