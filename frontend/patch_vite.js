const fs = require('fs');
let code = fs.readFileSync('vite.config.js', 'utf8');
code = code.replace(/allowedHosts: true/g, "allowedHosts: ['waygass-test-perf.loca.lt', '.loca.lt']");
fs.writeFileSync('vite.config.js', code);
