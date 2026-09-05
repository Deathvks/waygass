const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/SettingsModal.jsx', 'utf8');

// Replace the usersList mapping code
const oldHtmlStart = `                        {usersList.map((u, i) => (`;
const oldHtmlEnd = `                            </div>\n                          </div>\n                        ))}`;

const oldCodeBlock = code.substring(code.indexOf(oldHtmlStart), code.indexOf(oldHtmlEnd) + oldHtmlEnd.length);

const newCodeBlock = `                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                        {usersList.map((u, i) => (
                          <div key={u.id} className="relative group bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-4 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
                            
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-black text-sm shrink-0 shadow-inner">
                                {((u.name || '').charAt(0) + (u.lastName || '').charAt(0)).toUpperCase() || '?'}
                              </div>

                              {/* Info */}
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-[13px] text-slate-800 dark:text-white truncate pr-16">{u.name} {u.lastName}</div>
                                <div className="text-[11px] text-slate-500 truncate mt-0.5" title={u.email}>{u.email}</div>
                                <div className="text-[9px] text-slate-400 mt-1 font-medium">Socio desde {new Date(u.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</div>
                              </div>
                            </div>

                            {/* Badges area */}
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/50 dark:border-white/5">
                              <div className="flex flex-wrap gap-1.5">
                                {u.authProvider === 'google' ? (
                                  <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"><svg className="w-2.5 h-2.5 text-blue-500" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg> Google</span>
                                ) : (
                                  <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"><svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Email</span>
                                )}
                                {u.role === 'admin' && <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded-full font-black flex items-center shadow-sm">ADMIN</span>}
                                {u.subscription === 'pro' && <span className="bg-amber-400 text-amber-900 text-[9px] px-2 py-0.5 rounded-full font-black flex items-center shadow-sm">PRO</span>}
                              </div>

                              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setRoleModalUser(u)} className="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition" title="Cambiar Rol">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"/></svg>
                                </button>
                                <button onClick={() => setDeleteModalUser(u)} className="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-500 transition" title="Eliminar Usuario">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                        </div>`;

if (oldCodeBlock && oldCodeBlock.includes('usersList.map')) {
    code = code.replace(oldCodeBlock, newCodeBlock);
    fs.writeFileSync('frontend/src/components/SettingsModal.jsx', code, 'utf8');
} else {
    console.error("Could not find the old code block!");
}
