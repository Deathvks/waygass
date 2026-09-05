const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SearchBar.jsx', 'utf8');
code = code.replace(/Direccin/g, 'Dirección');
fs.writeFileSync('frontend/src/components/SearchBar.jsx', code, 'utf8');
