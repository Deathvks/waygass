const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SettingsModal.jsx', 'utf8');

const mapStyleBlock = `
              {/* Map Style Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Estilo de Mapa
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => setSettings({ ...settings, mapStyle: 'auto' })} className={\`py-2 text-xs font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-1 \${(!settings.mapStyle || settings.mapStyle === 'auto') ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100/50 dark:bg-black/30 text-slate-500 hover:text-slate-700 dark:text-slate-400 border border-transparent'}\`}>
                    Auto
                  </button>
                  <button onClick={() => setSettings({ ...settings, mapStyle: 'satellite' })} className={\`py-2 text-xs font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-1 \${settings.mapStyle === 'satellite' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100/50 dark:bg-black/30 text-slate-500 hover:text-slate-700 dark:text-slate-400 border border-transparent'}\`}>
                    Satélite
                  </button>
                  <button onClick={() => setSettings({ ...settings, mapStyle: 'light' })} className={\`py-2 text-xs font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-1 \${settings.mapStyle === 'light' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100/50 dark:bg-black/30 text-slate-500 hover:text-slate-700 dark:text-slate-400 border border-transparent'}\`}>
                    Claro
                  </button>
                  <button onClick={() => setSettings({ ...settings, mapStyle: 'dark' })} className={\`py-2 text-xs font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-1 \${settings.mapStyle === 'dark' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100/50 dark:bg-black/30 text-slate-500 hover:text-slate-700 dark:text-slate-400 border border-transparent'}\`}>
                    Oscuro
                  </button>
                </div>
              </div>
`;

code = code.replace(/\{(\/\* Tarjetas Row \*\/)\}/, mapStyleBlock + '\n              {$1}');
fs.writeFileSync('frontend/src/components/SettingsModal.jsx', code, 'utf8');
