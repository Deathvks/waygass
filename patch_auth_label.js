const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SettingsModal.jsx', 'utf8');

const oldHtml = `<div className="text-[11px] text-slate-500 truncate w-full">{u.email}</div>`;
const newHtml = `<div className="flex items-center gap-2 mt-0.5 w-full">
  <div className="text-[11px] text-slate-500 truncate max-w-[130px] sm:max-w-[200px]">{u.email}</div>
  {u.authProvider === 'google' ? (
    <span className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-[8px] px-1.5 py-0.5 rounded font-black flex items-center gap-1 shrink-0" title="Inició sesión con Google"><svg className="w-2.5 h-2.5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg> GOOGLE</span>
  ) : (
    <span className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-[8px] px-1.5 py-0.5 rounded font-black flex items-center gap-1 shrink-0" title="Inició sesión con Email y Contraseña"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> EMAIL</span>
  )}
</div>`;

code = code.replace(oldHtml, newHtml);
fs.writeFileSync('frontend/src/components/SettingsModal.jsx', code, 'utf8');
