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
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Fondo borroso y oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity transition-opacity" onClick={handleClose}></div>

      {/* Contenido del modal */}
      <div className={`relative w-full ${activeTab === 'admin' ? (adminSubTab === 'sniffing' ? 'max-w-4xl' : 'max-w-2xl') : 'max-w-md'} bg-[#f5f5f7] dark:bg-[#000000] rounded-[32px] border border-slate-200/50 dark:border-white/10 shadow-none overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 no-scrollbar transition-all duration-300`}>
        
        <div className="sticky top-0 z-10 bg-[#f5f5f7] dark:bg-[#000000] px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-4 border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {activeTab === 'settings' ? 'Ajustes' : activeTab === 'ranking' ? 'Comunidad' : 'Administración'}
            </h2>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center bg-slate-100/50 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
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

        <div className="p-6 pt-2">
          {activeTab === 'settings' && (
            <div className="border border-slate-200/50 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col">
              
              {/* Refuel Amount Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${(!settings.appColor && c.id === 'red') || settings.appColor === c.id ? 'ring-2 ring-offset-2 dark:ring-offset-black ring-slate-400 dark:ring-slate-500 scale-110' : 'hover:scale-110 opacity-60 hover:opacity-100'}`}
                      style={{ backgroundColor: c.color }}
                    >
                      {((!settings.appColor && c.id === 'red') || settings.appColor === c.id) && (
                        <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS App Row */}
              <div className="flex flex-col p-4 border-b border-slate-200/50 dark:border-white/5 gap-3">
                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17l-6 3z"/></svg>
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
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
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
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
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
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
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
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18"/></svg>
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
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                  Sniffing (Tráfico)
                </button>
                <button
                  onClick={() => setAdminSubTab('general')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    adminSubTab === 'general'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  Usuarios & Sistema
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
                                    <span className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm" title="Google"><svg className="w-2.5 h-2.5 text-blue-500" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg> Google</span>
                                  ) : (
                                    <span className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm" title="Email/Contraseña"><svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Email</span>
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
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
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
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
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
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
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
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
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





