import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';

const API = import.meta.env.VITE_API_URL || '';

const TIME_OPTIONS = [
  { value: '24h', label: 'Últimas 24 horas' },
  { value: '3d', label: 'Últimos 3 días' },
  { value: '5d', label: 'Últimos 5 días' },
  { value: '7d', label: 'Últimos 7 días' },
  { value: '15d', label: 'Últimos 15 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: 'custom', label: 'Personalizado...' }
];

const EVENT_COLORS = {
  REQUEST: 'text-slate-500',
  LOGIN_OK: 'text-green-500',
  LOGIN_FAIL: 'text-red-500',
  BLOCKED: 'text-red-600 font-bold',
  RATE_LIMITED: 'text-amber-500'
};

const EVENT_BADGES = {
  REQUEST: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400',
  LOGIN_OK: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  LOGIN_FAIL: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  BLOCKED: 'bg-red-200 dark:bg-red-500/30 text-red-800 dark:text-red-300',
  RATE_LIMITED: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
};

export default function SecurityPanel({ onClose }) {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  
  // DATE FILTER STATES
  const [timePreset, setTimePreset] = useState('24h'); // 24h, 3d, 5d, 7d, 15d, 30d, custom
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const [blockInput, setBlockInput] = useState('');
  const [pageLogs, setPageLogs] = useState(1);
  const [pageBlocked, setPageBlocked] = useState(1);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  const dateParams = useMemo(() => {
    if (timePreset === 'custom') {
      return { from: customFrom ? new Date(customFrom).toISOString() : '', to: customTo ? new Date(customTo).toISOString() : '' };
    }
    const now = new Date();
    let ms = 24 * 60 * 60 * 1000;
    if (timePreset === '3d') ms *= 3;
    if (timePreset === '5d') ms *= 5;
    if (timePreset === '7d') ms *= 7;
    if (timePreset === '15d') ms *= 15;
    if (timePreset === '30d') ms *= 30;
    return { from: new Date(now.getTime() - ms).toISOString(), to: now.toISOString() };
  }, [timePreset, customFrom, customTo]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, logsRes, blockedRes] = await Promise.all([
        axios.get(`${API}/api/admin/security/stats`, { headers, params: { ...dateParams, _t: Date.now() } }),
        axios.get(`${API}/api/admin/security/logs`, { headers, params: { limit: 500, ...dateParams, ...(filter !== 'ALL' ? { eventType: filter } : {}), _t: Date.now() } }),
        axios.get(`${API}/api/admin/security/blocked`, { headers, params: { ...dateParams, _t: Date.now() } })
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data);
      setBlockedIPs(blockedRes.data);
    } catch(e) {
      console.error('Security fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [filter, dateParams]);

  useEffect(() => { fetchData(); setPageLogs(1); setPageBlocked(1); }, [fetchData]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  
  const handleBlock = async () => {
    const ip = blockInput.trim();
    if (!ip) return;
    
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipv4Regex.test(ip)) {
      setModalState({ isOpen: true, title: 'Formato Inválido', message: 'Por favor, introduce una dirección IPv4 válida (ejemplo: 192.168.1.1).', type: 'error', onConfirm: null });
      return;
    }

    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      await axios.post(`${API}/api/admin/security/block`, { ip }, { headers: { Authorization: `Bearer ${token}` } });
      setBlockInput('');
      fetchData();
    } catch(e) {
      setModalState({ isOpen: true, title: 'Error', message: 'No se pudo bloquear la IP.', type: 'error', onConfirm: null });
    }
  };

  const handleUnblock = (ip) => {
    setModalState({
      isOpen: true,
      title: 'Desbloquear IP',
      message: `¿Estás seguro de que quieres desbloquear la IP ${ip}? Podría volver a realizar ataques.`,
      type: 'warning',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
          await axios.delete(`${API}/api/admin/security/block/${encodeURIComponent(ip)}`, { headers: { Authorization: `Bearer ${token}` } });
          fetchData();
          setModalState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });
        } catch(e) {
          setModalState({ isOpen: true, title: 'Error', message: 'No se pudo desbloquear la IP.', type: 'error', onConfirm: null });
        }
      }
    });
  };

  const handleBlockFromLog = async (ip) => {
    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      await axios.post(`${API}/api/admin/security/block`, { ip, reason: 'Bloqueado desde panel de logs' }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch(e) {}
  };

  const formatTime = (d) => {
    const date = new Date(d);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto no-scrollbar pb-24">
            {/* Header */}
      <div className="p-6 pb-3 border-b border-slate-200/50 dark:border-white/10 sticky top-0 bg-[#f5f5f7] dark:bg-[#000000] z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Ciberseguridad</h2>
              <p className="text-xs text-slate-500">Auto-refresh cada 30s</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1">
            {['overview', 'logs', 'blocked'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tab === t ? 'bg-primary text-white shadow-md' : 'text-slate-500'}`}>
                {t === 'overview' ? 'Resumen' : t === 'logs' ? 'Actividad' : 'Bloqueos'}
              </button>
            ))}
          </div>

          {/* TIME FILTERS */}
                  <div className="mt-4 flex flex-col gap-3 p-3 bg-white dark:bg-black rounded-2xl border-0 overflow-visible relative z-40">
          <div className="flex flex-col gap-2 relative z-50">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Filtro de Tiempo</label>
            <Select
              options={TIME_OPTIONS}
              value={TIME_OPTIONS.find(o => o.value === timePreset) || TIME_OPTIONS[0]}
              onChange={opt => setTimePreset(opt.value)}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              styles={{
                control: (base, state) => {
                  const isDark = document.documentElement.classList.contains('dark');
                  return {
                    ...base,
                    backgroundColor: isDark ? 'rgba(10, 10, 12, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '0.75rem',
                    boxShadow: 'none',
                    minHeight: '36px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                    }
                  };
                },
                menuList: (base) => ({ 
                  ...base, 
                  '::-webkit-scrollbar': { display: 'none' }, 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  padding: '4px'
                }),
                option: (base, { isFocused, isSelected }) => {
                  const isDark = document.documentElement.classList.contains('dark');
                  return {
                    ...base,
                    backgroundColor: isSelected ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') : isFocused ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)') : 'transparent',
                    color: isDark ? 'white' : 'black',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 700 : 500,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    marginBottom: '2px'
                  };
                },
                singleValue: (base) => {
                  const isDark = document.documentElement.classList.contains('dark');
                  return { ...base, color: isDark ? 'white' : 'black', fontWeight: 600 };
                },
                menu: (base) => {
                  const isDark = document.documentElement.classList.contains('dark');
                  return {
                    ...base,
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    backgroundColor: isDark ? 'rgba(10, 10, 12, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(64px) saturate(200%)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: 'none',
                    marginTop: '4px'
                  };
                },
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: (base) => {
                  const isDark = document.documentElement.classList.contains('dark');
                  return { 
                    ...base, 
                    color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', 
                    padding: '4px 8px', 
                    '&:hover': { color: isDark ? 'white' : 'black' } 
                  };
                }
              }}
            />
          </div>

            {timePreset === 'custom' && (
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Desde (Fecha y Hora)</label>
                  <input 
                    type="datetime-local" 
                    value={customFrom} 
                    onChange={e => setCustomFrom(e.target.value)} 
                    className="w-full bg-transparent dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Hasta (Fecha y Hora)</label>
                  <input 
                    type="datetime-local" 
                    value={customTo} 
                    onChange={e => setCustomTo(e.target.value)} 
                    className="w-full bg-transparent dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>
      </div>

      <div className="p-5 space-y-5 flex-1">

        {/* TAB: OVERVIEW */}
        {tab === 'overview' && stats && (
          <>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{TIME_OPTIONS.find(o => o.value === timePreset)?.label || 'Últimas 24 horas'}</h4>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Peticiones" value={stats.totalRequests} color="text-primary" />
              <StatCard label="IPs Únicas" value={stats.uniqueIPs} color="text-blue-500" />
              <StatCard label="Login OK" value={stats.loginOK} color="text-green-500" />
              <StatCard label="Login Fallido" value={stats.loginFail} color="text-red-500" />
              <StatCard label="Bloqueadas" value={stats.blocked} color="text-red-600" />
              <StatCard label="Rate Limited" value={stats.rateLimited} color="text-amber-500" />
            </div>

            {/* Last Station Update */}
            {stats.lastStationUpdate && (
              <div className="bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Última actualización de gasolineras</h4>
                <p className="text-sm font-mono font-bold text-primary">
                  {new Date(stats.lastStationUpdate).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'medium' })}
                </p>
              </div>
            )}

            {/* Top IPs */}
            {stats.topIPs?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{TIME_OPTIONS.find(o => o.value === timePreset)?.label || 'Últimas 24 horas'}</h4>
                <div className="bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl overflow-hidden">
                  {stats.topIPs.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{item.ip}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">{item.count} req</span>
                        {!blockedIPs.find(b => b.ip === item.ip) && (
                          <button onClick={() => handleBlockFromLog(item.ip)} className="text-[10px] font-bold bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md hover:bg-red-200 transition">
                            Bloquear
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Failed Login IPs */}
            {stats.topFailIPs?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">⚠ IPs con Login Fallido</h4>
                <div className="bg-white/50 dark:bg-white/5 border border-red-200/50 dark:border-red-500/20 rounded-xl overflow-hidden">
                  {stats.topFailIPs.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-red-100 dark:border-red-500/10 last:border-0">
                      <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">{item.ip}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-500">{item.count} intentos</span>
                        {!blockedIPs.find(b => b.ip === item.ip) && (
                          <button onClick={() => handleBlockFromLog(item.ip)} className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-md hover:bg-red-600 transition">
                            Bloquear
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: LOGS */}
        {tab === 'logs' && (
          <>
            <div className="flex gap-1.5 flex-wrap">
              {['ALL', 'REQUEST', 'LOGIN_OK', 'LOGIN_FAIL', 'BLOCKED', 'RATE_LIMITED'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${filter === f ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                  {f === 'ALL' ? 'Todo' : f}
                </button>
              ))}
            </div>
            
            <div className="space-y-1.5">
              {(logs.slice((pageLogs - 1) * 10, pageLogs * 10)).map((log, i) => (
                <div key={i} className="bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl px-3 py-2.5 flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${EVENT_BADGES[log.eventType] || EVENT_BADGES.REQUEST}`}>
                    {log.eventType}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{log.ip}</span>
                      <span className="text-[10px] font-bold text-slate-400">{log.method}</span>
                      <span className="text-[10px] text-slate-500 truncate">{log.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{formatTime(log.createdAt)}</span>
                      {log.statusCode && <span className={`text-[10px] font-bold ${log.statusCode >= 400 ? 'text-red-500' : 'text-green-500'}`}>{log.statusCode}</span>}
                      {log.detail && <span className="text-[10px] text-slate-400 truncate">({log.detail})</span>}
                    </div>
                  </div>
                  {!blockedIPs.find(b => b.ip === log.ip) && log.eventType !== 'REQUEST' && (
                    <button onClick={() => handleBlockFromLog(log.ip)} className="shrink-0 text-[9px] font-bold bg-red-100 dark:bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded hover:bg-red-200 transition">
                      Ban
                    </button>
                  )}
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-8">No hay logs para este filtro.</p>
              )}
            </div>
          </>
        )}

        {/* TAB: BLOCKED */}
        {tab === 'blocked' && (
          <>
            {/* Block Input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Introducir IP a bloquear..."
                value={blockInput}
                onChange={(e) => setBlockInput(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-primary transition"
              />
              <button 
                onClick={handleBlock}
                disabled={!blockInput.trim()}
                className="bg-red-500 text-white font-bold py-3 sm:py-0 px-5 rounded-xl hover:bg-red-600 transition disabled:opacity-30 shrink-0"
              >
                Bloquear
              </button>
            </div>

            {/* Blocked List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{TIME_OPTIONS.find(o => o.value === timePreset)?.label || 'Últimas 24 horas'}</h4>
              {blockedIPs.length > 0 ? (blockedIPs.slice((pageBlocked - 1) * 10, pageBlocked * 10)).map((b, i) => (
                <div key={i} className="bg-white/50 dark:bg-white/5 border border-red-200/50 dark:border-red-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-mono font-bold text-red-700 dark:text-red-400">{b.ip}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{b.reason} · {formatTime(b.createdAt)}</p>
                  </div>
                  <button 
                    onClick={() => handleUnblock(b.ip)}
                    className="text-xs font-bold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-200 transition"
                  >
                    Desbloquear
                  </button>
                  </div>
                )) : (
                <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">No hay IPs bloqueadas</p>
                    <p className="text-xs text-slate-500 mt-1">Todo limpio por ahora.</p>
                  </div>
              )}
            </div>
          </>
        )}
            </div>

      {/* Custom Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80" onClick={() => setModalState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null })}>
          <div className="bg-white dark:bg-black rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200/50 dark:border-white/10 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <h3 className={`text-lg font-black mb-2 ${modalState.type === 'error' || modalState.type === 'warning' ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{modalState.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-6 leading-relaxed">{modalState.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null })} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition">
                {modalState.onConfirm ? 'Cancelar' : 'Cerrar'}
              </button>
              {modalState.onConfirm && (
                <button onClick={modalState.onConfirm} className="px-4 py-2 rounded-xl text-sm font-bold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 transition">
                  Confirmar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value?.toLocaleString() || 0}</p>
    </div>
  );
}









