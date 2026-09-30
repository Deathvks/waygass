const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const oldFetchCheck = /if \(cookieConsent === 'accepted'\) \{[\s\S]*?setSettings\(prev =>/
const newFetchCheck = `if (localStorage.getItem('waygass_cookie_consent_v2') === 'accepted') {
          setSettings(prev =>`;
code = code.replace(oldFetchCheck, newFetchCheck);

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
console.log('Fixed fetchProfile race condition');
