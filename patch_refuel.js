const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SettingsModal.jsx', 'utf8');

// Fix value assignment
code = code.replace(/value=\{settings\.refuelAmount \|\| 20\}/, "value={settings.refuelAmount !== undefined ? settings.refuelAmount : 20}");

// Fix onChange assignment
code = code.replace(/onChange=\{\(e\) => setSettings\(\{ \.\.\.settings, refuelAmount: Number\(e\.target\.value\) \|\| 20 \}\)\}/, "onChange={(e) => setSettings({ ...settings, refuelAmount: e.target.value === '' ? '' : Number(e.target.value) })}");

fs.writeFileSync('frontend/src/components/SettingsModal.jsx', code, 'utf8');
