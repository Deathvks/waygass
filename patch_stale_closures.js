const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const oldSave = /if \(cookieConsent === 'accepted'\) \{\s*await axios\.put/g;
const newSave = `if (localStorage.getItem('waygass_cookie_consent_v2') === 'accepted') {
        await axios.put`;
code = code.replace(oldSave, newSave);

const oldEffect = /if \(authToken && cookieConsent === 'accepted'\) \{\s*const timeout = setTimeout/g;
const newEffect = `if (authToken && localStorage.getItem('waygass_cookie_consent_v2') === 'accepted') {
        const timeout = setTimeout`;
code = code.replace(oldEffect, newEffect);

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
console.log('Fixed all stale closure checks');
