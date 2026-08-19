import React from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  setSettings, 
  onSave, 
  openSub,
  user
}) {
  const [activeTab, setActiveTab] = React.useState('settings');
  const [adminStats, setAdminStats] = React.useState(null);
  const [usersList, setUsersList] = React.useState([]);
  const [loadingStats, setLoadingStats] = React.useState(false);
  const [roleModalUser, setRoleModalUser] = React.useState(null);
  const [rankingData, setRankingData] = React.useState([]);
  const [loadingRanking, setLoadingRanking] = React.useState(false);

  React.useEffect(() => {
    if (activeTab === 'ranking') {
      const fetchRanking = async () => {
        setLoadingRanking(true);
        try {
          const res = await axios.get('https://unsnap-causing-affluent.ngrok-free.dev/api/ranking');
          setRankingData(res.data);
        } catch (e) {
          console.error("Error fetching ranking", e);
        }
        setLoadingRanking(false);
      };
      fetchRanking();
    }
  }, [activeTab]);

  React.useEffect(() => {
    if (activeTab === 'admin' && user?.role === 'admin') {
      const fetchData = async () => {
        setLoadingStats(true);
        try {
          const token = localStorage.getItem('waygas_token');
          const [statsRes, usersRes] = await Promise.all([
            axios.get('https://unsnap-causing-affluent.ngrok-free.dev/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
            axios.get('https://unsnap-causing-affluent.ngrok-free.dev/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
          ]);
          setAdminStats(statsRes.data);
          setUsersList(usersRes.data);
        } catch (e) {
          console.error("Error fetching admin data", e);
        }
        setLoadingStats(false);
      };
      fetchData();
    }
  }, [activeTab, user]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      alert("No puedes borrarte a ti mismo.");
      return;
    }
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario permanentemente?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem('waygas_token');
      await axios.delete(`https://unsnap-causing-affluent.ngrok-free.dev/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Actualizar estado local
      setUsersList(prev => prev.filter(u => u.id !== userId));
      setAdminStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1
      }));
    } catch (e) {
      alert(e.response?.data?.error || "Error eliminando usuario.");
    }
  };

  const handleChangeRole = async (newRole) => {
    if (!roleModalUser) return;
    
    try {
      const token = localStorage.getItem('waygas_token');
      await axios.patch(`https://unsnap-causing-affluent.ngrok-free.dev/api/admin/users/${roleModalUser.id}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setUsersList(prev => prev.map(usr => usr.id === roleModalUser.id ? { ...usr, role: newRole } : usr));
      setRoleModalUser(null);
    } catch (e) {
      alert(e.response?.data?.error || "Error cambiando rol.");
    }
  };

  const handleForceSync = async () => {
    try {
      const token = localStorage.getItem('waygas_token');
      await axios.get('https://unsnap-causing-affluent.ngrok-free.dev/api/admin/force-history-sync', {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sincronización iniciada en el servidor.');
    } catch (e) {
      alert('Error al sincronizar');
    }
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const gpsOptions = [
    { value: 'gmaps', label: 'Google Maps' },
    { value: 'waze', label: 'Waze' },
    { value: 'apple', label: 'Apple Maps' }
  ];

  const isDark = document.documentElement.classList.contains('dark');
  
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
      border: state.isFocused ? (isDark ? '1px solid #475569' : '1px solid #cbd5e1') : '1px solid transparent',
      borderRadius: '16px',
      boxShadow: 'none',
      minHeight: '48px',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      '&:hover': {
        border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
      }
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#ea580c' : isFocused ? (isDark ? '#334155' : '#fff7ed') : 'transparent',
      color: isSelected ? 'white' : (isDark ? '#f8fafc' : '#1e293b'),
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      padding: '12px 16px',
      borderRadius: '8px',
      margin: '4px 8px',
      width: 'auto'
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#f8fafc' : '#0f172a',
      fontWeight: 600
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: isDark ? '#1e293b' : 'white',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
      padding: '4px 0'
    }),
    menuPortal: base => ({ ...base, zIndex: 99999 }),
    indicatorSeparator: () => ({ display: 'none' })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo borroso y oscuro */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenido del modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 no-scrollbar">
        
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-rose-400"></div>

        <div className="flex items-center justify-between pb-2 mt-1">
          <h2 className="font-black text-slate-900 dark:text-white text-xl tracking-tight flex items-center gap-2">
            {activeTab === 'settings' ? 'Ajustes' : activeTab === 'ranking' ? 'Comunidad' : (
              <>
                Administración
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </>
            )}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
            General
          </button>
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'ranking' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Ranking
          </button>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${activeTab === 'admin' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
            >
              Admin
            </button>
          )}
        </div>

        {activeTab === 'settings' ? (
          <div className="flex flex-col gap-6">
          {/* Apariencia */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Apariencia</label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setSettings({ ...settings, theme: 'light' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.theme === 'light' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                Claro
              </button>
              <button 
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.theme === 'dark' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                Oscuro
              </button>
              <button 
                onClick={() => setSettings({ ...settings, theme: 'system' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${settings.theme === 'system' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Auto
              </button>
            </div>
          </div>

          {/* Capacidad Depósito */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Capacidad del Depósito</label>
            <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl">
              <input 
                type="range" 
                min="20" max="100" step="5" 
                value={settings.tankSize} 
                onChange={(e) => setSettings({ ...settings, tankSize: Number(e.target.value) })}
                className="flex-1 accent-orange-500 cursor-pointer"
              />
              <span className="font-black text-lg text-slate-800 dark:text-white w-16 text-right">{settings.tankSize} <span className="text-sm font-semibold text-slate-400">L</span></span>
            </div>
          </div>

          {/* GPS App */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navegador GPS Predeterminado</label>
            <Select 
              styles={customStyles}
              options={gpsOptions}
              value={gpsOptions.find(o => o.value === settings.gpsApp) || gpsOptions[0]}
              onChange={(selected) => setSettings({ ...settings, gpsApp: selected.value })}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuPlacement="auto"
            />
          </div>

          {/* Tarjetas */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tarjetas de Fidelización</label>
              {!settings.isPro && (
                <span className="text-[9px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  PRO
                </span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Waylet */}
              <div 
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl cursor-pointer transition active:scale-[0.98]"
                onClick={() => {
                  if (!settings.isPro) { onClose(); openSub(); }
                  else { setSettings({ ...settings, cardWaylet: !settings.cardWaylet }) }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${settings.cardWaylet ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <svg className={`w-4 h-4 ${settings.cardWaylet ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm">Repsol Waylet</span>
                </div>
                
                {/* Toggle Switch */}
                <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.cardWaylet ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.cardWaylet ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>

              {/* Cepsa */}
              <div 
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl cursor-pointer transition active:scale-[0.98]"
                onClick={() => {
                  if (!settings.isPro) { onClose(); openSub(); }
                  else { setSettings({ ...settings, cardCepsa: !settings.cardCepsa }) }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${settings.cardCepsa ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <svg className={`w-4 h-4 ${settings.cardCepsa ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm">Cepsa Gow</span>
                </div>
                
                {/* Toggle Switch */}
                <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.cardCepsa ? 'bg-orange-500' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.cardCepsa ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>
            </div>
          </div>
          
            <div className="pt-2">
              <button 
                onClick={handleSave} 
                className="w-full mt-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-2xl text-sm transition-colors shadow-lg shadow-slate-900/20 dark:shadow-none"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in">
            {loadingStats ? (
              <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : adminStats ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl text-center">
                    <div className="text-3xl font-black text-slate-800 dark:text-white">{adminStats.totalUsers}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Usuarios</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-2xl text-center">
                    <div className="text-3xl font-black text-amber-600 dark:text-amber-500">{adminStats.proUsers}</div>
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">Cuentas PRO</div>
                  </div>
                  <div className="col-span-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-2xl text-center flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-500">{adminStats.totalValidations}</div>
                      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Validaciones</div>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    <h3 className="font-bold text-sm">Cron Job Manual</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Fuerza la descarga inmediata de los precios desde el MITECO para actualizar la base de datos local y generar las gráficas del Histórico de 30 días, sin tener que esperar a la sincronización automática de las 03:00 AM.
                  </p>
                  <button 
                    onClick={handleForceSync}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
                  >
                    <span>Ejecutar Descarga Global</span>
                  </button>
                </div>

                {/* Gestión de Usuarios */}
                <div className="mt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gestión de Usuarios</h3>
                  <div className="flex flex-col gap-2">
                    {usersList.map(u => (
                      <div key={u.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${u.role === 'admin' ? 'bg-indigo-500' : 'bg-slate-800 dark:bg-slate-700'}`}>
                            {u.name.charAt(0)}{u.lastName.charAt(0)}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{u.name} {u.lastName}</span>
                              {u.subscription === 'pro' && (
                                <span className="text-[8px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 px-1.5 py-0.5 rounded uppercase tracking-wider">PRO</span>
                              )}
                              
                              <button 
                                onClick={() => {
                                  if (u.id === user.id) {
                                    alert("No puedes cambiarte el rol a ti mismo.");
                                    return;
                                  }
                                  setRoleModalUser(u);
                                }}
                                className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider transition-colors cursor-pointer ${u.role === 'admin' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                title="Cambiar Rol"
                                disabled={u.id === user.id}
                              >
                                {u.role === 'admin' ? 'ADMIN' : 'USER'}
                              </button>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="w-8 h-8 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
                          title="Eliminar usuario"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Usuarios que más contribuyen validando precios y estados. Llega a 7 validaciones para conseguir la insignia de <strong>Usuario de Confianza</strong>.
            </p>
            {loadingRanking ? (
              <div className="text-center text-slate-400 py-8">Cargando ranking...</div>
            ) : rankingData.length === 0 ? (
              <div className="text-center text-slate-400 py-8">Aún no hay validaciones.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {rankingData.map((u, index) => (
                  <div key={u.id} className="flex items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${index === 0 ? 'bg-amber-400 text-white' : index === 1 ? 'bg-slate-300 text-slate-700' : index === 2 ? 'bg-orange-300 text-orange-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-white">{u.name} {u.lastName}</span>
                      {u.score >= 7 && (
                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-md flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          CONFIANZA
                        </span>
                      )}
                    </div>
                    <div className="font-black text-indigo-600 dark:text-indigo-400">{u.score} pts</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {roleModalUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRoleModalUser(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10 animate-fade-in border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Cambiar Rol</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Selecciona el nuevo rol para <strong>{roleModalUser.name} {roleModalUser.lastName}</strong>.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleChangeRole('admin')}
                className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all ${roleModalUser.role === 'admin' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleModalUser.role === 'admin' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </div>
                  <div className="text-left">
                    <div className={`font-bold ${roleModalUser.role === 'admin' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>Administrador</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Acceso total al panel</div>
                  </div>
                </div>
                {roleModalUser.role === 'admin' && <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>}
              </button>
              
              <button 
                onClick={() => handleChangeRole('user')}
                className={`p-4 rounded-xl flex items-center justify-between border-2 transition-all ${roleModalUser.role === 'user' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleModalUser.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div className="text-left">
                    <div className={`font-bold ${roleModalUser.role === 'user' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>Usuario</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Acceso estándar</div>
                  </div>
                </div>
                {roleModalUser.role === 'user' && <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>}
              </button>
            </div>
            
            <button 
              onClick={() => setRoleModalUser(null)}
              className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
