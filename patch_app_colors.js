const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

code = code.replace(/'bg-white dark:bg-white\/10 text-slate-900 dark:text-white shadow-sm border border-slate-200\/50 dark:border-white\/5'/g, "'bg-primary/10 text-primary border border-primary/20'");

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
