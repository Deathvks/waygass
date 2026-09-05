const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SettingsModal.jsx', 'utf8');

// Replace standard ones
code = code.replace(/'bg-white dark:bg-white\/10 text-slate-900 dark:text-white border border-slate-200\/50 dark:border-white\/5'/g, "'bg-primary/10 text-primary border border-primary/20'");

// Replace ones with shadow-sm
code = code.replace(/'bg-white dark:bg-white\/10 text-slate-900 dark:text-white border border-slate-200\/50 dark:border-white\/5 shadow-sm'/g, "'bg-primary/10 text-primary border border-primary/20'");

fs.writeFileSync('frontend/src/components/SettingsModal.jsx', code, 'utf8');
