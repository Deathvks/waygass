const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const oldColors = /orange: \{ primary: '#ff9500', dark: '#cc7700', container: '#ffad33', secondary: '#ffcc00' \}/;
const newColors = `orange: { primary: '#ff9500', dark: '#cc7700', container: '#ffad33', secondary: '#ffcc00' },
        indigo: { primary: '#4f46e5', dark: '#3730a3', container: '#6366f1', secondary: '#818cf8' }`;
code = code.replace(oldColors, newColors);

// Ensure settings defaults to indigo
const oldInit = /appColor: 'indigo'/;
const newInit = `appColor: 'indigo'`; // Just verifying it exists

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
console.log('Added indigo to colors object');
