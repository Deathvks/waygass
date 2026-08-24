import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  setSettings, 
  onSave, 
  openSub,
  user,
  openCookies
}) {
  const [activeTab, setActiveTab] = React.useState('settings');
  const [adminStats, setAdminStats] = React.useState(null);
  const [usersList, setUsersList] = React.useState([]);
  const [loadingStats, setLoadingStats] = React.useState(false);
  const [roleModalUser, setRoleModalUser] = React.useState(null);
  const [deleteModalUser, setDeleteModalUser] = React.useState(null);
  const [rankingData, setRankingData] = React.useState([]);
  const [loadingRanking, setLoadingRanking] = React.useState(false);

  React.useEffect(() => {
    if (activeTab === 'ranking') {
      const fetchRanking = async () => {
        setLoadingRanking(true);
        try {
          const res = await axios.get('/api/ranking');
          setRankingData(res.data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingRanking(false);
        }
      };
      fetchRanking();
    } else if (activeTab === 'admin') {
      const fetchAdminStats = async () => {
        setLoadingStats(true);
        try {
          const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
          const [statsRes, usersRes] = await Promise.all([
            axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
          ]);
          setAdminStats(statsRes.data);
          setUsersList(usersRes.data);
        } catch(e) {
          console.error(e);
          toast.error("Error cargando panel de admin");
        } finally {
          setLoadingStats(false);
        }
      };
      fetchAdminStats();
    }
  }, [activeTab]);

  const handleChangeRole = async (newRole) => {
    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      await axios.put(`/api/admin/users/${roleModalUser.id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Rol actualizado");
      setUsersList(usersList.map(u => u.id === roleModalUser.id ? { ...u, role: newRole } : u));
      setRoleModalUser(null);
    } catch(e) {
      toast.error("Error actualizando rol");
    }
  };

  const confirmDeleteUser = async () => {
    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      await axios.delete(`/api/admin/users/${deleteModalUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Usuario eliminado");
      setUsersList(usersList.filter(u => u.id !== deleteModalUser.id));
      setDeleteModalUser(null);
    } catch(e) {
      toast.error("Error eliminando usuario");
    }
  };

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Fondo borroso y oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity transition-opacity" onClick={onClose}></div>

      {/* Contenido del modal */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-3xl rounded-[32px] border border-slate-200/50 dark:border-white/10 shadow-none overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 no-scrollbar">
        
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-3xl p-6 pb-4 border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {activeTab === 'settings' ? 'Ajustes' : activeTab === 'ranking' ? 'Comunidad' : 'Administración'}
            </h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100/50 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div className="flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-xl">
            <button onClick={() => setActiveTab('settings')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-white dark:bg-[#1a1a1c] text-slate-900 dark:text-white shadow-none border border-slate-200/50 dark:border-white/10' : 'text-slate-500 dark:text-slate-400'}`}>General</button>
            <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'ranking' ? 'bg-primary/10 text-primary shadow-none border border-primary/20' : 'text-slate-500 dark:text-slate-400'}`}>Ranking</button>
            {user?.role === 'admin' && (
              <button onClick={() => setActiveTab('admin')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${activeTab === 'admin' ? 'bg-primary text-white shadow-none' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}>Admin</button>
            )}
          </div>
        </div>

        <div className="p-6 pt-2">
          {activeTab === 'settings' && (
            <div className="glass-core border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col">
              
              {/* Theme Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  Apariencia
                </label>
                <div className="flex bg-slate-100/50 dark:bg-black/30 p-1 rounded-xl">
                  <button onClick={() => setSettings({ ...settings, theme: 'light' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.theme === 'light' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Claro</button>
                  <button onClick={() => setSettings({ ...settings, theme: 'dark' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.theme === 'dark' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Oscuro</button>
                  <button onClick={() => setSettings({ ...settings, theme: 'system' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.theme === 'system' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Auto</button>
                </div>
              </div>

              {/* GPS App Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17l-6 3z"/></svg>
                  Navegador Predeterminado
                </label>
                <div className="flex bg-slate-100/50 dark:bg-black/30 p-1 rounded-xl">
                  <button onClick={() => setSettings({ ...settings, gpsApp: 'gmaps' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${settings.gpsApp === 'gmaps' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>G. Maps</button>
                  <button onClick={() => setSettings({ ...settings, gpsApp: 'waze' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${settings.gpsApp === 'waze' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Waze</button>
                  <button onClick={() => setSettings({ ...settings, gpsApp: 'apple' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${settings.gpsApp === 'apple' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Apple</button>
                </div>
              </div>

              {/* View Mode Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                  Vista Inicial
                </label>
                <div className="flex bg-slate-100/50 dark:bg-black/30 p-1 rounded-xl">
                  <button onClick={() => setSettings({ ...settings, viewMode: 'list' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.viewMode === 'list' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Lista</button>
                  <button onClick={() => setSettings({ ...settings, viewMode: 'map' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.viewMode === 'map' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Mapa</button>
                </div>
              </div>

              {/* Tarjetas Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    Fidelización
                  </div>
                  {(!user || user.subscription === 'free') && (
                    <span onClick={() => { onClose(); if (openSub) openSub(); }} className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded cursor-pointer hover:bg-primary/20">PRO</span>
                  )}
                </label>
                
                <div className={`flex flex-col gap-2 mt-1 ${(!user || user.subscription === 'free') ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${settings.cardWaylet ? 'bg-[#ff8200] text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>W</div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Waylet</span>
                    </div>
                    <button onClick={() => setSettings({ ...settings, cardWaylet: !settings.cardWaylet })} className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.cardWaylet ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${settings.cardWaylet ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${settings.cardCepsa ? 'bg-[#e4002b] text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>C</div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Cepsa Gow</span>
                    </div>
                    <button onClick={() => setSettings({ ...settings, cardCepsa: !settings.cardCepsa })} className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.cardCepsa ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${settings.cardCepsa ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Legal Row */}
              <div className="p-4 flex flex-col items-center justify-center gap-1">
                <button onClick={() => { onClose(); if (openCookies) openCookies(); }} className="text-xs font-bold text-primary hover:underline transition-colors">
                  Gestionar Cookies
                </button>
                <div className="text-[10px] text-slate-400 dark:text-slate-600 font-medium text-center">
                  WayGass v1.2.0 &copy; 2026
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-3 items-start">
                <div className="shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">¿Cómo funciona el ranking?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Gana puntos reportando precios incorrectos y validando las estaciones. 
                    ¡Aparecerás aquí automáticamente en cuanto empieces a contribuir a la comunidad WayGass!
                  </p>
                </div>
              </div>

              {loadingRanking ? (
                <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : rankingData.length > 0 ? (
                <div className="glass-core border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col">
                  {rankingData.map((u, index) => (
                    <div key={u.id} className="flex items-center p-4 border-b border-slate-200/50 dark:border-white/5 last:border-0 gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${index === 0 ? 'bg-primary text-white' : index === 1 ? 'bg-slate-300 text-slate-700' : index === 2 ? 'bg-primary/20 text-primary' : 'bg-slate-100/50 dark:bg-white/5 text-slate-500'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{u.name} {u.lastName}</span>
                        {u.score >= 7 && (
                          <span className="text-[9px] font-bold text-primary mt-0.5 uppercase tracking-wider">Top Contribuidor</span>
                        )}
                      </div>
                      <div className="font-black text-primary">{u.score} pts</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-core border border-slate-200/50 dark:border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18"/></svg>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Aún no hay contribuciones</h4>
                  <p className="text-xs text-slate-500">Sé el primero en ganar puntos reportando precios.</p>
            </div>
          )}
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="flex flex-col gap-6">
              {loadingStats ? (
                <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : adminStats && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                      <div className="glass-core border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl">
                        <div className="text-2xl font-black text-slate-800 dark:text-white">{adminStats.totalUsers}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Usuarios Totales</div>
                      </div>
                      <div className="glass-core border border-primary/20 bg-primary/5 p-4 rounded-2xl">
                        <div className="text-2xl font-black text-primary">{adminStats.proUsers}</div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Usuarios Pro</div>
                      </div>
                      <div className="glass-core border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl col-span-2 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gasolineras Descargadas</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-white">{adminStats.totalStations}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        </div>
                      </div>
                    </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Gestión de Usuarios ({usersList.length})</h3>
                    <div className="glass-core border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col">
                      {usersList.map((u, i) => (
                        <div key={u.id} className="p-4 border-b border-slate-200/50 dark:border-white/5 last:border-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-1">
                            <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
                              <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="truncate flex-shrink">{u.name} {u.lastName}</span>
                                <div className="flex shrink-0 gap-1">
                                  {u.role === 'admin' && <span className="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black">Admin</span>}
                                  {u.subscription === 'pro' && <span className="bg-primary/20 text-primary text-[8px] px-1.5 py-0.5 rounded uppercase font-black">Pro</span>}
                                </div>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate w-full">{u.email}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                            <button onClick={() => setRoleModalUser(u)} className="w-8 h-8 rounded-full bg-slate-100/50 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary transition">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"/></svg>
                            </button>
                            <button onClick={() => setDeleteModalUser(u)} className="w-8 h-8 rounded-full bg-slate-100/50 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 transition">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      
      {roleModalUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity" onClick={() => setRoleModalUser(null)}></div>
          <div className="relative w-full max-w-sm glass-core border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 shadow-none animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Cambiar Rol</h3>
            <p className="text-sm text-slate-500 mb-6">Selecciona el nuevo rol para <strong>{roleModalUser.name}</strong>.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleChangeRole('admin')} className="p-4 rounded-xl flex items-center justify-between border border-slate-200/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:bg-primary/10 hover:border-primary/50 transition">
                <span className="font-bold text-slate-800 dark:text-white">Admin</span>
                {roleModalUser.role === 'admin' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
              </button>
              <button onClick={() => handleChangeRole('user')} className="p-4 rounded-xl flex items-center justify-between border border-slate-200/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:bg-primary/10 hover:border-primary/50 transition">
                <span className="font-bold text-slate-800 dark:text-white">User</span>
                {roleModalUser.role === 'user' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
              </button>
            </div>
            <button onClick={() => setRoleModalUser(null)} className="w-full mt-4 px-4 py-3.5 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {deleteModalUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity" onClick={() => setDeleteModalUser(null)}></div>
          <div className="relative w-full max-w-sm glass-core border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 shadow-none animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 text-center">Eliminar Usuario</h3>
            <p className="text-sm text-slate-500 mb-6 text-center">¿Seguro que deseas eliminar a <strong>{deleteModalUser.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalUser(null)} className="flex-1 px-4 py-3.5 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 transition-colors">Cancelar</button>
                <button onClick={confirmDeleteUser} className="flex-1 px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/20 transition-colors">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





