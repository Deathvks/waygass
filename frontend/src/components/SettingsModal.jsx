import React from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import SniffingPanel from './SniffingPanel';

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
  const handleClose = () => {
    if (onSave) onSave(settings);
    onClose();
  };

  const [activeTab, setActiveTab] = React.useState('settings');
  const [adminSubTab, setAdminSubTab] = React.useState('sniffing');
  const [adminStats, setAdminStats] = React.useState(null);
  const [usersList, setUsersList] = React.useState([]);
  const [loadingStats, setLoadingStats] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncProgress, setSyncProgress] = React.useState({ percent: 0, message: '' });
  const [roleModalUser, setRoleModalUser] = React.useState(null);
  const [deleteModalUser, setDeleteModalUser] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState('user');
  const [updatingRole, setUpdatingRole] = React.useState(false);

  React.useEffect(() => {
    if (roleModalUser) {
      setSelectedRole(roleModalUser.role || 'user');
    }
  }, [roleModalUser]);
  
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


  const handleTriggerCron = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress({ percent: 0, message: 'Iniciando...' });
    
    const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
    
    const pollInterval = setInterval(async () => {
      try {
        const pRes = await axios.get('/api/admin/cron-status', { headers: { Authorization: `Bearer ${token}` } });
        if (pRes.data) setSyncProgress({ percent: pRes.data.percent, message: pRes.data.message });
      } catch(e) {}
    }, 2000);

    try {
      await axios.post('/api/admin/trigger-cron', {}, { headers: { Authorization: `Bearer ${token}` } });
      
      let done = false;
      while(!done) {
        await new Promise(r => setTimeout(r, 2500));
        try {
          const check = await axios.get('/api/admin/cron-status', { headers: { Authorization: `Bearer ${token}` } });
          if (check.data.status !== 'running') done = true;
        } catch(e) { done = true; }
      }
      
      clearInterval(pollInterval);
      toast.success("Gasolineras descargadas con éxito");
      const statsRes = await axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
      setAdminStats(statsRes.data);
    } catch (e) {
      clearInterval(pollInterval);
      toast.error(e.response?.data?.error || "Error iniciando descarga");
    } finally {
      clearInterval(pollInterval);
      setIsSyncing(false);
    }
  };

  const handleApplyRole = async () => {
    if (!roleModalUser || !selectedRole) return;
    if (selectedRole === roleModalUser.role) {
      setRoleModalUser(null);
      return;
    }
    setUpdatingRole(true);
    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      await axios.patch(`/api/admin/users/${roleModalUser.id}/role`, { role: selectedRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Rol cambiado a ${selectedRole === 'admin' ? 'Administrador' : 'Usuario'}`);
      setUsersList(usersList.map(u => u.id === roleModalUser.id ? { ...u, role: selectedRole } : u));
      setRoleModalUser(null);
    } catch(e) {
      toast.error(e.response?.data?.error || "Error actualizando rol");
    } finally {
      setUpdatingRole(false);
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
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
      {/* Fondo borroso y oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity transition-opacity" onClick={handleClose}></div>

      {/* Contenido del modal */}
      <div className={`relative w-full ${activeTab === 'admin' ? (adminSubTab === 'sniffing' ? 'max-w-4xl' : 'max-w-2xl') : 'max-w-md'} bg-[#f5f5f7] dark:bg-[#000000] rounded-[32px] border border-slate-200/50 dark:border-white/10 shadow-none overflow-y-auto overflow-x-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 no-scrollbar transition-all duration-300`}>
        
        <div className="sticky top-0 z-10 bg-[#f5f5f7] dark:bg-[#000000] px-4 sm:px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3 sm:pb-4 border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {activeTab === 'settings' ? 'Ajustes' : activeTab === 'ranking' ? 'Comunidad' : 'Administración'}
            </h2>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center bg-slate-100/50 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition">
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
          
          <div className="flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-xl">
            <button onClick={() => setActiveTab('settings')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary text-white shadow-none' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}>General</button>
            <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'ranking' ? 'bg-primary text-white shadow-none' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}>Ranking</button>
            {user?.role === 'admin' && (
              <button onClick={() => setActiveTab('admin')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${activeTab === 'admin' ? 'bg-primary text-white shadow-none' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}>Admin</button>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-6 pt-2">
          {activeTab === 'settings' && (
            <div className="border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col">
              
              {/* Refuel Amount Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-euro-sign text-sm text-primary"></i>
                  Gasto Habitual (€)
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Calcularemos cuántos litros te caben y cuánto más echas en comparación con la media de la zona.</p>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="1" 
                    max="500" 
                    value={settings.refuelAmount !== undefined ? settings.refuelAmount : 20} 
                    onChange={(e) => setSettings({ ...settings, refuelAmount: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full bg-slate-100/50 dark:bg-black/30 border border-slate-200/50 dark:border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Color Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-palette text-sm text-primary"></i>
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${(!settings.appColor && c.id === 'red') || settings.appColor === c.id ? 'ring-2 ring-offset-2 dark:ring-offset-black ring-slate-400 dark:ring-slate-500 scale-110' : 'hover:scale-110 opacity-60 hover:opacity-100'}`}
                      style={{ backgroundColor: c.color }}
                    >
                      {((!settings.appColor && c.id === 'red') || settings.appColor === c.id) && (
                        <i className="fa-solid fa-check text-xs text-white"></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS App Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-location-arrow text-sm text-primary"></i>
                  Navegador Predeterminado
                </label>
                <div className="flex bg-slate-100/50 dark:bg-black/30 p-1 rounded-xl">
                  <button onClick={() => setSettings({ ...settings, gpsApp: 'gmaps' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${settings.gpsApp === 'gmaps' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>G. Maps</button>
                  <button onClick={() => setSettings({ ...settings, gpsApp: 'waze' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${settings.gpsApp === 'waze' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Waze</button>
                  <button onClick={() => setSettings({ ...settings, gpsApp: 'apple' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${settings.gpsApp === 'apple' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Apple</button>
                </div>
              </div>

              {/* View Mode Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-table-cells-large text-sm text-primary"></i>
                  Vista Inicial
                </label>
                <div className="flex bg-slate-100/50 dark:bg-black/30 p-1 rounded-xl">
                  <button onClick={() => setSettings({ ...settings, viewMode: 'list' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.viewMode === 'list' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Lista</button>
                  <button onClick={() => setSettings({ ...settings, viewMode: 'map' })} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.viewMode === 'map' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Mapa</button>
                </div>
              </div>

              
              {/* Map Style Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-map text-sm text-primary"></i>
                  Estilo de Mapa
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSettings({ ...settings, mapStyle: 'light' })} className={`py-2 text-xs font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-1 ${(!settings.mapStyle || settings.mapStyle === 'light' || settings.mapStyle === 'auto' || settings.mapStyle === 'dark') ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100/50 dark:bg-black/30 text-slate-500 hover:text-slate-700 dark:text-slate-400 border border-transparent'}`}>
                    Normal
                  </button>
                  <button onClick={() => setSettings({ ...settings, mapStyle: 'satellite' })} className={`py-2 text-xs font-bold rounded-lg transition-colors flex flex-col items-center justify-center gap-1 ${settings.mapStyle === 'satellite' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100/50 dark:bg-black/30 text-slate-500 hover:text-slate-700 dark:text-slate-400 border border-transparent'}`}>
                    Satélite
                  </button>
                </div>
              </div>

              {/* Tarjetas Row */}
              {user?.role === 'admin' && (
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-id-card text-sm text-primary"></i>
                    Fidelización
                  </div>
                  {(!user || user.subscription === 'free') && (
                    <span onClick={() => { handleClose(); if (openSub) openSub(); }} className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded cursor-pointer hover:bg-primary/20">PRO</span>
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
              )}

              {/* Legal Row */}
              <div className="p-4 flex flex-col items-center justify-center gap-1">
                <button onClick={() => { handleClose(); if (openCookies) openCookies(); }} className="text-xs font-bold text-primary hover:underline transition-colors">
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
                  <i className="fa-solid fa-circle-question text-base text-primary"></i>
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
                <div className="border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col">
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
                <div className="border border-slate-200/50 dark:border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <i className="fa-solid fa-trophy text-2xl text-slate-400"></i>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Aún no hay contribuciones</h4>
                  <p className="text-xs text-slate-500">Sé el primero en ganar puntos reportando precios.</p>
            </div>
          )}
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="flex flex-col gap-5">
              {/* SUBTABS ADMINISTRACIÓN */}
              <div className="flex bg-slate-200/60 dark:bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setAdminSubTab('sniffing')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    adminSubTab === 'sniffing'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-chart-line text-xs"></i>
                  <span>Sniffing (Tráfico)</span>
                </button>
                <button
                  onClick={() => setAdminSubTab('general')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    adminSubTab === 'general'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-users-gear text-xs"></i>
                  <span>Usuarios & Sistema</span>
                </button>
              </div>

              {adminSubTab === 'sniffing' ? (
                <SniffingPanel />
              ) : (
                <div className="flex flex-col gap-6">
                  {loadingStats ? (
                    <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                  ) : adminStats && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl">
                            <div className="text-2xl font-black text-slate-800 dark:text-white">{adminStats.totalUsers}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Usuarios Totales</div>
                          </div>
                          <div className="border border-primary/20 bg-primary/5 p-4 rounded-2xl">
                            <div className="text-2xl font-black text-primary">{adminStats.proUsers}</div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Usuarios Pro</div>
                          </div>
                          <div className="border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl col-span-2 flex flex-col gap-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gasolineras Descargadas</div>
                                  <div className="text-2xl font-black text-slate-800 dark:text-white">{adminStats.totalStations}</div>
                                  {adminStats.lastStationUpdate && (
                                    <div className="text-[10px] font-mono text-slate-500 mt-1 font-bold">
                                      Última act: {new Date(adminStats.lastStationUpdate).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                    </div>
                                  )}
                                </div>
                                <button onClick={handleTriggerCron} disabled={isSyncing} className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors shrink-0 flex items-center justify-center min-w-[110px] disabled:opacity-50">
                                  {isSyncing ? <div className="flex gap-1.5 items-center"><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>{syncProgress.percent}%</span></div> : 'Descargar Ahora'}
                                </button>
                              </div>
                              
                              {isSyncing && (
                                <div className="w-full mt-1">
                                  <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 mb-1 overflow-hidden">
                                    <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${syncProgress.percent}%` }}></div>
                                  </div>
                                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-1 text-right">{syncProgress.message}</div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Gestión de Usuarios ({usersList.length})</h3>
                        <div className="flex flex-col gap-3">
                          {usersList.map((u, i) => (
                            <div key={u.id} className="relative group bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-4 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
                              <div className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-black text-sm shrink-0 shadow-inner">
                                  {((u.name || '').charAt(0) + (u.lastName || '').charAt(0)).toUpperCase() || '?'}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-[13px] text-slate-800 dark:text-white truncate">{u.name} {u.lastName}</div>
                                  <div className="text-[11px] text-slate-500 truncate mt-0.5" title={u.email}>{u.email}</div>
                                  <div className="text-[9px] text-slate-400 mt-1 font-medium">Desde {new Date(u.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/50 dark:border-white/5">
                                <div className="flex flex-wrap gap-1.5">
                                  {u.authProvider === 'google' ? (
                                    <span className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm" title="Google"><i className="fa-brands fa-google text-blue-500 text-[10px]"></i> Google</span>
                                  ) : (
                                    <span className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm" title="Email/Contraseña"><i className="fa-solid fa-envelope text-slate-400 text-[10px]"></i> Email</span>
                                  )}
                                  {u.role === 'admin' && <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded-full font-black flex items-center shadow-sm">ADMIN</span>}
                                  {u.subscription === 'pro' && <span className="bg-amber-400 text-amber-900 text-[9px] px-2 py-0.5 rounded-full font-black flex items-center shadow-sm">PRO</span>}
                                </div>

                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setRoleModalUser(u)} className="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition" title="Cambiar Rol">
                                    <i className="fa-solid fa-user-gear text-xs"></i>
                                  </button>
                                  <button onClick={() => setDeleteModalUser(u)} className="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-500 transition" title="Eliminar Usuario">
                                    <i className="fa-solid fa-trash-can text-xs"></i>
                                  </button>
                                </div>
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
          )}
        </div>
      </div>

      
      {roleModalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity" 
            onClick={() => !updatingRole && setRoleModalUser(null)}
          ></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-black rounded-[32px] border border-slate-200/70 dark:border-white/10 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            
            {/* Cabecera con Icono Apple Style */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 text-primary shadow-sm">
                <i className="fa-solid fa-shield-halved text-2xl text-primary"></i>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Cambiar Rol
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Configura los permisos de acceso del usuario
              </p>

              {/* Ficha compacta del usuario */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 w-full mb-4 text-left">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0">
                  {((roleModalUser.name || '').charAt(0) + (roleModalUser.lastName || '').charAt(0)).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-800 dark:text-white truncate">
                    {roleModalUser.name} {roleModalUser.lastName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {roleModalUser.email}
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 shrink-0">
                  {roleModalUser.role}
                </span>
              </div>
            </div>

            {/* Opciones de Roles */}
            <div className="flex flex-col gap-2.5 mb-5">
              
              {/* Opción Administrador */}
              <div 
                onClick={() => setSelectedRole('admin')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  selectedRole === 'admin'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                    : 'border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'admin' ? 'bg-primary text-white shadow-sm' : 'bg-slate-200/60 dark:bg-white/10 text-slate-500'
                  }`}>
                    <i className="fa-solid fa-user-shield text-sm"></i>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Administrador</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-primary/20 text-primary">ADMIN</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Acceso total a métricas, descargas y panel
                    </div>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-300 dark:border-white/20'
                }`}>
                  {selectedRole === 'admin' && (
                    <i className="fa-solid fa-check text-xs"></i>
                  )}
                </div>
              </div>

              {/* Opción Usuario Estándar */}
              <div 
                onClick={() => setSelectedRole('user')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  selectedRole === 'user'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                    : 'border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'user' ? 'bg-primary text-white shadow-sm' : 'bg-slate-200/60 dark:bg-white/10 text-slate-500'
                  }`}>
                    <i className="fa-solid fa-user text-sm"></i>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Usuario Estándar</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-400">USER</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Acceso al mapa, filtros, ahorro y favoritos
                    </div>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  selectedRole === 'user'
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-300 dark:border-white/20'
                }`}>
                  {selectedRole === 'user' && (
                    <i className="fa-solid fa-check text-xs"></i>
                  )}
                </div>
              </div>

            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleApplyRole}
                disabled={updatingRole}
                className="w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-white bg-primary hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {updatingRole ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Guardando cambios...</span>
                  </>
                ) : (
                  <span>Guardar Rol</span>
                )}
              </button>

              <button
                onClick={() => setRoleModalUser(null)}
                disabled={updatingRole}
                className="w-full px-4 py-3 rounded-2xl font-bold text-xs text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 transition-all"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

      {deleteModalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity" 
            onClick={() => setDeleteModalUser(null)}
          ></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-black rounded-[32px] border border-slate-200/70 dark:border-white/10 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-3 border border-rose-100 dark:border-rose-500/20 text-rose-500">
                <i className="fa-solid fa-trash-can text-2xl text-rose-500"></i>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                ¿Eliminar Usuario?
              </h3>
              
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Esta acción no se puede deshacer. Se eliminarán sus favoritos y datos de cuenta.
              </p>

              {/* Ficha del usuario a eliminar */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100/70 dark:border-rose-500/10 w-full mb-6 text-left">
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-xs shrink-0">
                  {((deleteModalUser.name || '').charAt(0) + (deleteModalUser.lastName || '').charAt(0)).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {deleteModalUser.name} {deleteModalUser.lastName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {deleteModalUser.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-2">
                <button
                  onClick={confirmDeleteUser}
                  className="w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200/80 dark:border-rose-500/20 transition-all active:scale-98"
                >
                  Sí, eliminar cuenta
                </button>
                <button
                  onClick={() => setDeleteModalUser(null)}
                  className="w-full px-4 py-3 rounded-2xl font-bold text-xs text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
    </>
  );
}





