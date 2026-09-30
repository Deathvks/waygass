const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const oldSafeSet = /const safeSetItem = \([\s\S]*?\};\n/;
const newSafeSet = `const safeSetItem = (key, value) => {
  if (key === 'waygas_token' || key === 'waygas_user') {
    localStorage.setItem(key, value);
    return;
  }
  if (localStorage.getItem('waygass_cookie_consent_v2') === 'accepted') {
    localStorage.setItem(key, value);
  }
};\n`;

code = code.replace(oldSafeSet, newSafeSet);

// Also update initial state to avoid undefined appColor
const oldInit = /return saved \? JSON\.parse\(saved\) : \{ tankSize: 50, refuelAmount: 20, gpsApp: 'gmaps', isPro: false, cardWaylet: false, cardCepsa: false, theme: 'system' \};/;
const newInit = `return saved ? JSON.parse(saved) : { tankSize: 50, refuelAmount: 20, gpsApp: 'gmaps', isPro: false, cardWaylet: false, cardCepsa: false, theme: 'system', appColor: 'indigo' };`;
code = code.replace(oldInit, newInit);

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
console.log('Fixed safeSetItem race condition');
