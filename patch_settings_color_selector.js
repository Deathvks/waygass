const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SettingsModal.jsx', 'utf8');

const colorBlock = `
              {/* Color Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Color de Acento
                </label>
                <div className="flex justify-between px-4 py-2">
                  {[
                    { id: 'red', color: '#ff3b30' },
                    { id: 'blue', color: '#007aff' },
                    { id: 'green', color: '#34c759' },
                    { id: 'purple', color: '#af52de' },
                    { id: 'orange', color: '#ff9500' }
                  ].map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setSettings({ ...settings, appColor: c.id })}
                      className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all \${(!settings.appColor && c.id === 'red') || settings.appColor === c.id ? 'ring-2 ring-offset-2 dark:ring-offset-black ring-slate-400 dark:ring-slate-500 scale-110' : 'hover:scale-110 opacity-60 hover:opacity-100'}\`}
                      style={{ backgroundColor: c.color }}
                    >
                      {((!settings.appColor && c.id === 'red') || settings.appColor === c.id) && (
                        <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
`;

code = code.replace(/\{\/\* GPS App Row \*\/\}/, colorBlock + '\n              {/* GPS App Row */}');
fs.writeFileSync('frontend/src/components/SettingsModal.jsx', code, 'utf8');
