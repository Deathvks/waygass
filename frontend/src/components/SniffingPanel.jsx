import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const getCountryFlag = (code) => {
  if (!code || code === 'LOC' || code === 'XX' || code.length !== 2) return '🌐';
  try {
    return code
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
  } catch (e) {
    return '🌐';
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Ahora mismo';
  if (diffSec < 3600) return `Hace ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `Hace ${Math.floor(diffSec / 3600)} h`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export default function SniffingPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // ALL, app, blog
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      const res = await axios.get('/api/admin/sniffing', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error al cargar datos de sniffing:', err);
      if (isManual) toast.error('Error al actualizar datos de sniffing');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Auto-refresco cada 25 segundos
    const interval = setInterval(() => fetchStats(false), 25000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const filteredVisits = useMemo(() => {
    if (!data?.recentVisits) return [];
    return data.recentVisits.filter(v => {
      if (categoryFilter !== 'ALL' && v.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchIp = (v.ip || '').toLowerCase().includes(q);
        const matchPath = (v.path || '').toLowerCase().includes(q);
        const matchCountry = (v.country || '').toLowerCase().includes(q);
        const matchCity = (v.city || '').toLowerCase().includes(q);
        const matchRef = (v.referrer || '').toLowerCase().includes(q);
        const matchUser = (v.userName || '').toLowerCase().includes(q) || (v.userEmail || '').toLowerCase().includes(q);
        return matchIp || matchPath || matchCountry || matchCity || matchRef || matchUser;
      }
      return true;
    });
  }, [data, categoryFilter, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">Cargando métricas de sniffing y tráfico...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-white dark:bg-black rounded-2xl border border-slate-200/50 dark:border-white/5">
        <p className="text-sm text-slate-500 mb-3">No se pudieron cargar las analíticas de tráfico.</p>
        <button onClick={() => fetchStats(true)} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90">
          Reintentar
        </button>
      </div>
    );
  }

  const { overview, dailyTrend, topCountries, topCities, topReferrers, tech } = data;

  // Cálculo de porcentajes para barra de segmentación global
  const totalVisits = overview.allTime.total || 0;
  const appVisits = overview.allTime.app || 0;
  const blogVisits = overview.allTime.blog || 0;
  const appPercent = totalVisits > 0 ? Math.round((appVisits / totalVisits) * 100) : 50;
  const blogPercent = totalVisits > 0 ? 100 - appPercent : 50;

  // Máximo para el mini-gráfico de barras de 7 días
  const maxDayVisits = Math.max(...(dailyTrend || []).map(d => d.total || 0), 1);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      
      {/* CABECERA CON ESTADO Y CONTROL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-black p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-800 dark:text-white tracking-tight">Sniffing & Analítica de Tráfico</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                En Vivo
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {lastUpdated ? `Última sincronización: ${lastUpdated.toLocaleTimeString('es-ES')}` : 'Métricas en tiempo real'}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {refreshing ? 'Actualizando...' : 'Refrescar'}
        </button>
      </div>

      {/* KPI CARDS: HOY, SEMANAL, MENSUAL, TOTAL CON DIFERENCIACIÓN BLOG VS WEB */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resumen de Visitas</h4>
          <span className="text-[11px] font-bold text-slate-500">Separadas por Web y Noticias</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* HOY */}
          <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Hoy (24h)</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
              {overview.today.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.today.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Noticias
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.today.blog}</span>
              </div>
            </div>
          </div>

          {/* SEMANAL */}
          <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Esta Semana (7d)</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
              {overview.week.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.week.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Noticias
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.week.blog}</span>
              </div>
            </div>
          </div>

          {/* MENSUAL */}
          <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Este Mes (30d)</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
              {overview.month.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.month.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Noticias
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.month.blog}</span>
              </div>
            </div>
          </div>

          {/* TOTAL HISTÓRICO */}
          <div className="bg-white dark:bg-black border border-primary/20 bg-primary/[0.02] p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-wider text-primary">Total Registrado</div>
            <div className="text-3xl font-black text-primary my-2 tracking-tight">
              {overview.allTime.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.allTime.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Noticias
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.allTime.blog}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* COMPARATIVA VISUAL & TENDENCIA 7 DÍAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* SEGMENTACIÓN: BARRA DE PROPORCIÓN WEB VS NOTICIAS */}
        <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Proporción de Audiencia</h4>
              <span className="text-[11px] font-bold text-slate-400">{totalVisits} visitas</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Comparativa del tráfico entre la aplicación principal (mapa y precios) frente al blog y artículos.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Barra segmentada */}
            <div className="h-4 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden flex p-0.5">
              <div 
                className="bg-emerald-500 h-full rounded-l-full transition-all duration-500" 
                style={{ width: `${appPercent}%` }}
                title={`Web App: ${appPercent}%`}
              ></div>
              <div 
                className="bg-indigo-500 h-full rounded-r-full transition-all duration-500" 
                style={{ width: `${blogPercent}%` }}
                title={`Noticias: ${blogPercent}%`}
              ></div>
            </div>

            {/* Leyenda con números y porcentajes */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Web Normal</div>
                  <div className="text-sm font-black text-emerald-900 dark:text-white">{appPercent}% <span className="text-xs font-normal text-slate-500">({appVisits})</span></div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shrink-0"></div>
                <div>
                  <div className="text-[10px] font-black uppercase text-indigo-800 dark:text-indigo-300">Noticias / Blog</div>
                  <div className="text-sm font-black text-indigo-900 dark:text-white">{blogPercent}% <span className="text-xs font-normal text-slate-500">({blogVisits})</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MINI-GRÁFICO DE TENDENCIA DE LOS ÚLTIMOS 7 DÍAS */}
        <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Tendencia Últimos 7 Días</h4>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Web</span>
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Noticias</span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-36 pt-4 px-1">
            {dailyTrend?.map((day, idx) => {
              const appH = maxDayVisits > 0 ? (day.app / maxDayVisits) * 100 : 0;
              const blogH = maxDayVisits > 0 ? (day.blog / maxDayVisits) * 100 : 0;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip flotante al pasar el ratón */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {day.total} visitas (Web: {day.app}, Blog: {day.blog})
                  </div>

                  <div className="w-full max-w-[28px] flex flex-col-reverse items-center justify-start h-24 bg-slate-100 dark:bg-white/5 rounded-t-lg overflow-hidden p-0.5">
                    <div 
                      className="w-full bg-emerald-500 rounded-sm transition-all duration-500" 
                      style={{ height: `${appH}%`, minHeight: day.app > 0 ? '4px' : '0px' }}
                    ></div>
                    <div 
                      className="w-full bg-indigo-500 rounded-sm transition-all duration-500 mb-0.5" 
                      style={{ height: `${blogH}%`, minHeight: day.blog > 0 ? '4px' : '0px' }}
                    ></div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 mt-2 truncate w-full text-center">
                    {day.date.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SECCIÓN GEOGRAFÍA Y PROCEDENCIA: DE DÓNDE NOS VISITAN & DE DÓNDE VENÍAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* DE DÓNDE NOS VISITAN (TOP PAÍSES Y CIUDADES) */}
        <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              De Dónde Nos Visitan
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Por Geolocalización IP</span>
          </div>

          {topCountries && topCountries.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topCountries.map((c, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <span className="text-base">{getCountryFlag(c.countryCode)}</span>
                      <span>{c.country}</span>
                    </span>
                    <span className="font-bold text-slate-500">
                      {c.count} <span className="text-[10px] font-normal text-slate-400">({c.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(c.percentage, 4)}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {/* CIUDADES TOP */}
              {topCities && topCities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Principales Ciudades</div>
                  <div className="flex flex-wrap gap-1.5">
                    {topCities.map((city, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {city.city} ({city.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">No hay datos geográficos aún.</div>
          )}
        </div>

        {/* DE DÓNDE VENÍAN (FUENTES DE TRÁFICO / REFERRERS) */}
        <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              De Dónde Venían (Fuentes)
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Referrer / Origen</span>
          </div>

          {topReferrers && topReferrers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topReferrers.map((r, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span className="truncate max-w-[200px]" title={r.name}>{r.name}</span>
                    </span>
                    <span className="font-bold text-slate-500">
                      {r.count} <span className="text-[10px] font-normal text-slate-400">({r.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(r.percentage, 4)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">No hay fuentes registradas aún.</div>
          )}
        </div>

      </div>

      {/* QUIÉN NOS VISITA: DISPOSITIVOS, SISTEMAS Y USUARIOS */}
      <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            Quién Nos Visita (Dispositivos & Perfil)
          </h4>
          <span className="text-[10px] font-bold text-slate-400">User-Agent & Auth</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* DISPOSITIVO */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Dispositivos</div>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="flex items-center gap-1.5">📱 Móviles</span>
                <span className="text-slate-900 dark:text-white font-black">{tech?.devices?.mobile || 0}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="flex items-center gap-1.5">💻 Escritorio / PC</span>
                <span className="text-slate-900 dark:text-white font-black">{tech?.devices?.desktop || 0}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="flex items-center gap-1.5">📟 Tablets</span>
                <span className="text-slate-900 dark:text-white font-black">{tech?.devices?.tablet || 0}</span>
              </div>
            </div>
          </div>

          {/* SISTEMAS OPERATIVOS */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sistemas Operativos</div>
            <div className="flex flex-col gap-1.5 text-xs">
              {tech?.operatingSystems && tech.operatingSystems.length > 0 ? (
                tech.operatingSystems.slice(0, 4).map((os, idx) => (
                  <div key={idx} className="flex justify-between items-center font-bold">
                    <span className="truncate">{os.name}</span>
                    <span className="text-slate-900 dark:text-white font-black">{os.count}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-xs">Sin datos</span>
              )}
            </div>
          </div>

          {/* NAVEGADORES & TIPO DE USUARIO */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Navegadores & Usuarios</div>
            <div className="flex flex-col gap-1.5 text-xs">
              {tech?.browsers && tech.browsers.slice(0, 2).map((b, idx) => (
                <div key={idx} className="flex justify-between items-center font-bold">
                  <span className="truncate">{b.name}</span>
                  <span className="text-slate-900 dark:text-white font-black">{b.count}</span>
                </div>
              ))}
              <div className="pt-1.5 mt-0.5 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[11px]">
                <span className="font-bold text-primary">Usuarios Registrados</span>
                <span className="font-black text-primary">{tech?.users?.authenticated || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-500">Anónimos</span>
                <span className="font-bold text-slate-500">{tech?.users?.anonymous || 0}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FEED EN TIEMPO REAL / REGISTRO DETALLADO DE VISITAS (ÚLTIMAS 50) */}
      <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl flex flex-col gap-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Registro en Tiempo Real ({filteredVisits.length} visitas)
            </h4>
            <p className="text-xs text-slate-500">Últimos accesos con geolocalización, ruta y dispositivo</p>
          </div>

          {/* FILTROS DE CATEGORÍA (TODAS / WEB NORMAL / BLOG NOTICIAS) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                categoryFilter === 'ALL' ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setCategoryFilter('app')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                categoryFilter === 'app' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
              Web
            </button>
            <button
              onClick={() => setCategoryFilter('blog')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                categoryFilter === 'blog' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
              Noticias
            </button>
          </div>
        </div>

        {/* BUSCADOR DENTRO DEL REGISTRO */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por IP, página, ciudad, país o usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">
              ✕
            </button>
          )}
        </div>

        {/* LISTADO RESPONSIVE DE VISITAS */}
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                
                {/* IZQUIERDA: HORA, UBICACIÓN, IP Y USUARIO */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="text-2xl shrink-0 leading-none pt-0.5">
                    {getCountryFlag(v.countryCode)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {v.ip}
                      </span>

                      {/* BADGE USUARIO */}
                      {v.userName ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20" title={v.userEmail || ''}>
                          👤 {v.userName}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                          Anónimo
                        </span>
                      )}

                      {/* UBICACIÓN */}
                      <span className="text-xs text-slate-500 font-medium">
                        {v.city ? `${v.city}, ` : ''}{v.country || 'Desconocido'}
                      </span>
                    </div>

                    {/* RUTA VISITADA & REFERRER */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs">
                      {/* BADGE CATEGORÍA */}
                      {v.category === 'blog' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          Noticias
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Web App
                        </span>
                      )}

                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium truncate max-w-[260px] sm:max-w-[340px]" title={v.path}>
                        {v.path}
                      </span>

                      <span className="text-slate-400 text-[11px]">
                        • Desde <strong className="text-slate-600 dark:text-slate-400">{v.referrer || 'Directo'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* DERECHA: DISPOSITIVO, NAVEGADOR Y TIEMPO */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/50 dark:border-white/5 text-xs text-slate-500 gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                    <span>{v.device === 'Móvil' ? '📱' : v.device === 'Tablet' ? '📟' : '💻'}</span>
                    <span>{v.os || 'SO'}</span>
                    <span className="text-slate-400">•</span>
                    <span>{v.browser || 'Navegador'}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    {formatTimeAgo(v.createdAt)}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No hay visitas registradas que coincidan con los filtros.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
