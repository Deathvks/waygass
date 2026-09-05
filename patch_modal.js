const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SettingsModal.jsx', 'utf8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">([\s\S]*?)<\/div><\/div>\s*<\/div>\s*<\/>/m;

if (code.includes('grid-cols-1 md:grid-cols-2')) {
    code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">/g, '<div className="flex flex-col gap-3">');
    // Change translucent backgrounds to solid app colors
    code = code.replace(/bg-slate-50 dark:bg-slate-800\/50/g, 'bg-white dark:bg-[#1a1a1c]');
    
    // Also remove glass-core from the entire file
    code = code.replace(/glass-core /g, '');
    code = code.replace(/ bg-white\/95 dark:bg-\[#0c0c0e\]\/95 backdrop-blur-3xl /g, ' bg-[#f5f5f7] dark:bg-[#000000] ');

    fs.writeFileSync('frontend/src/components/SettingsModal.jsx', code, 'utf8');
    console.log("Patched SettingsModal.jsx");
} else {
    console.log("Could not find grid string");
}
