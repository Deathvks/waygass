import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const renderFlag = (code) => {
  if (!code || code === 'LOC' || code === 'XX' || code.length !== 2) {
    return <i className="fa-solid fa-network-wired text-slate-400 text-xs"></i>;
  }
  return <span className={`fi fi-${code.toLowerCase()} rounded-[2px] shadow-sm text-sm shrink-0`}></span>;
};

const getDeviceIcon = (device) => {
  const d = (device || '').toLowerCase();
  if (d.includes('móvil') || d.includes('movil') || d.includes('mobile')) {
    return <i className="fa-solid fa-mobile-screen-button text-slate-600 dark:text-slate-300"></i>;
  }
  if (d.includes('tablet')) {
    return <i className="fa-solid fa-tablet-screen-button text-slate-600 dark:text-slate-300"></i>;
  }
  return <i className="fa-solid fa-desktop text-slate-600 dark:text-slate-300"></i>;
};

const getOsIcon = (os) => {
  const s = (os || '').toLowerCase();
  if (s.includes('ios') || s.includes('ipados') || s.includes('mac') || s.includes('apple')) {
    return <i className="fa-brands fa-apple text-slate-800 dark:text-slate-100"></i>;
  }
  if (s.includes('android')) {
    return <i className="fa-brands fa-android text-emerald-500"></i>;
  }
  if (s.includes('windows')) {
    return <i className="fa-brands fa-windows text-blue-500"></i>;
  }
  if (s.includes('linux')) {
    return <i className="fa-brands fa-linux text-amber-600"></i>;
  }
  if (s.includes('bot') || s.includes('crawler')) {
    return <i className="fa-solid fa-robot text-purple-500"></i>;
  }
  return <i className="fa-solid fa-microchip text-slate-400"></i>;
};

const getBrowserIcon = (browser) => {
  const b = (browser || '').toLowerCase();
  if (b.includes('chrome')) return <i className="fa-brands fa-chrome text-amber-500"></i>;
  if (b.includes('safari')) return <i className="fa-brands fa-safari text-blue-500"></i>;
  if (b.includes('firefox')) return <i className="fa-brands fa-firefox-browser text-orange-500"></i>;
  if (b.includes('edge')) return <i className="fa-brands fa-edge text-blue-600"></i>;
  if (b.includes('opera')) return <i className="fa-brands fa-opera text-red-500"></i>;
  return <i className="fa-solid fa-globe text-slate-400"></i>;
};

const getReferrerIcon = (refName) => {
  const r = (refName || '').toLowerCase();
  if (r.includes('google')) return <i className="fa-brands fa-google text-red-500"></i>;
  if (r.includes('directo') || r.includes('marcador')) return <i className="fa-solid fa-bookmark text-amber-500"></i>;
  if (r.includes('instagram')) return <i className="fa-brands fa-instagram text-pink-500"></i>;
  if (r.includes('facebook')) return <i className="fa-brands fa-facebook text-blue-600"></i>;
  if (r.includes('twitter') || r.includes('x.com')) return <i className="fa-brands fa-x-twitter text-slate-800 dark:text-white"></i>;
  if (r.includes('tiktok')) return <i className="fa-brands fa-tiktok text-slate-900 dark:text-white"></i>;
  if (r.includes('whatsapp')) return <i className="fa-brands fa-whatsapp text-emerald-500"></i>;
  if (r.includes('telegram')) return <i className="fa-brands fa-telegram text-sky-500"></i>;
  if (r.includes('bing') || r.includes('microsoft')) return <i className="fa-brands fa-microsoft text-cyan-600"></i>;
  if (r.includes('reddit')) return <i className="fa-brands fa-reddit text-orange-600"></i>;
  if (r.includes('interna')) return <i className="fa-solid fa-arrow-right-arrow-left text-emerald-500"></i>;
  return <i className="fa-solid fa-arrow-up-right-from-square text-indigo-500"></i>;
};

const parseSafeDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    let d = new Date(val);
    if (!isNaN(d.getTime())) return d;
    const parts = val.trim().split(' ');
    if (parts.length >= 2) {
      const iso = parts[0] + 'T' + parts[1] + (parts[2] ? parts[2] : 'Z');
      d = new Date(iso);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
};

const formatTimeAgo = (dateStr) => {
  const date = parseSafeDate(dateStr);
  if (!date) return 'Reciente';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Resetear a página 1 al cambiar filtros o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedVisits = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return filteredVisits.slice(start, start + pageSize);
  }, [filteredVisits, validCurrentPage, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">Cargando métricas de tráfico...</p>
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

  const totalVisits = overview.allTime.total || 0;
  const appVisits = overview.allTime.app || 0;
  const blogVisits = overview.allTime.blog || 0;
  const appPercent = totalVisits > 0 ? Math.round((appVisits / totalVisits) * 100) : 50;
  const blogPercent = totalVisits > 0 ? 100 - appPercent : 50;

  const maxDayVisits = Math.max(...(dailyTrend || []).map(d => d.total || 0), 1);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-full overflow-x-hidden animate-in fade-in duration-200">
      
      {/* CABECERA CON ESTADO Y CONTROL */}
      <div className="flex items-center justify-between gap-2.5 bg-white dark:bg-black p-3 sm:p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <i className="fa-solid fa-network-wired text-sm sm:text-base"></i>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-base font-black text-slate-800 dark:text-white tracking-tight truncate">
                Sniffing & Tráfico
              </h3>
              <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                En Vivo
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5">
              {lastUpdated ? `Sincronizado: ${lastUpdated.toLocaleTimeString('es-ES')}` : 'Métricas en tiempo real'}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="shrink-0 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          title="Refrescar datos"
        >
          <i className={`fa-solid fa-arrows-rotate text-xs ${refreshing ? 'fa-spin' : ''}`}></i>
          <span className="hidden sm:inline">{refreshing ? 'Actualizando...' : 'Refrescar'}</span>
        </button>
      </div>

      {/* KPI CARDS: HOY, SEMANAL, MENSUAL, TOTAL CON DIFERENCIACIÓN BLOG VS WEB */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-chart-simple text-primary"></i>
            Resumen de Visitas
          </h4>
          <span className="text-[11px] font-bold text-slate-500">Separadas por Web y Noticias</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* HOY */}
          <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-calendar-day text-slate-400"></i>
              Hoy (24h)
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
              {overview.today.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <i className="fa-solid fa-globe text-[10px]"></i> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.today.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                  <i className="fa-solid fa-newspaper text-[10px]"></i> Noticias
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.today.blog}</span>
              </div>
            </div>
          </div>

          {/* SEMANAL */}
          <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-calendar-week text-slate-400"></i>
              Esta Semana (7d)
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
              {overview.week.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <i className="fa-solid fa-globe text-[10px]"></i> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.week.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                  <i className="fa-solid fa-newspaper text-[10px]"></i> Noticias
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.week.blog}</span>
              </div>
            </div>
          </div>

          {/* MENSUAL */}
          <div className="bg-white dark:bg-black border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-calendar-days text-slate-400"></i>
              Este Mes (30d)
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
              {overview.month.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <i className="fa-solid fa-globe text-[10px]"></i> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.month.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                  <i className="fa-solid fa-newspaper text-[10px]"></i> Noticias
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.month.blog}</span>
              </div>
            </div>
          </div>

          {/* TOTAL HISTÓRICO */}
          <div className="bg-white dark:bg-black border border-primary/20 bg-primary/[0.02] p-4 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
              <i className="fa-solid fa-chart-pie text-primary"></i>
              Total Registrado
            </div>
            <div className="text-3xl font-black text-primary my-2 tracking-tight">
              {overview.allTime.total}
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <i className="fa-solid fa-globe text-[10px]"></i> Web
                </span>
                <span className="font-black text-slate-700 dark:text-slate-300">{overview.allTime.app}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                  <i className="fa-solid fa-newspaper text-[10px]"></i> Noticias
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
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-scale-balanced text-primary"></i>
                Proporción de Audiencia
              </h4>
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
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Web Normal</div>
                  <div className="text-sm font-black text-emerald-900 dark:text-white">{appPercent}% <span className="text-xs font-normal text-slate-500">({appVisits})</span></div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20">
                <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs shrink-0">
                  <i className="fa-solid fa-newspaper"></i>
                </div>
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
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-arrow-trend-up text-primary"></i>
              Tendencia Últimos 7 Días
            </h4>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <i className="fa-solid fa-globe text-[9px]"></i> Web
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <i className="fa-solid fa-newspaper text-[9px]"></i> Noticias
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-36 pt-4 px-1">
            {dailyTrend?.map((day, idx) => {
              const appH = maxDayVisits > 0 ? (day.app / maxDayVisits) * 100 : 0;
              const blogH = maxDayVisits > 0 ? (day.blog / maxDayVisits) * 100 : 0;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
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
              <i className="fa-solid fa-earth-europe text-primary"></i>
              De Dónde Nos Visitan
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Geolocalización</span>
          </div>

          {topCountries && topCountries.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topCountries.map((c, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
                      {renderFlag(c.countryCode)}
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
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <i className="fa-solid fa-city text-primary"></i>
                    Principales Ciudades
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {topCities.map((city, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <i className="fa-solid fa-location-dot text-primary text-[10px]"></i>
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
              <i className="fa-solid fa-bullhorn text-indigo-500"></i>
              De Dónde Venían (Fuentes)
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Referrer / Origen</span>
          </div>

          {topReferrers && topReferrers.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topReferrers.map((r, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
                      <span className="w-5 text-center shrink-0">
                        {getReferrerIcon(r.name)}
                      </span>
                      <span className="truncate max-w-[130px] sm:max-w-[220px]" title={r.name}>{r.name}</span>
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
            <i className="fa-solid fa-laptop-code text-primary"></i>
            Quién Nos Visita (Dispositivos & Perfil)
          </h4>
          <span className="text-[10px] font-bold text-slate-400">User-Agent & Auth</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* DISPOSITIVO */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-mobile-screen"></i>
              Dispositivos
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-mobile-screen-button text-slate-500"></i>
                  Móviles
                </span>
                <span className="text-slate-900 dark:text-white font-black">{tech?.devices?.mobile || 0}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-desktop text-slate-500"></i>
                  Escritorio / PC
                </span>
                <span className="text-slate-900 dark:text-white font-black">{tech?.devices?.desktop || 0}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-tablet-screen-button text-slate-500"></i>
                  Tablets
                </span>
                <span className="text-slate-900 dark:text-white font-black">{tech?.devices?.tablet || 0}</span>
              </div>
            </div>
          </div>

          {/* SISTEMAS OPERATIVOS */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-microchip"></i>
              Sistemas Operativos
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              {tech?.operatingSystems && tech.operatingSystems.length > 0 ? (
                tech.operatingSystems.slice(0, 4).map((os, idx) => (
                  <div key={idx} className="flex justify-between items-center font-bold">
                    <span className="flex items-center gap-2 truncate">
                      <span className="w-4 text-center shrink-0">{getOsIcon(os.name)}</span>
                      <span className="truncate">{os.name}</span>
                    </span>
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
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i className="fa-solid fa-window-maximize"></i>
              Navegadores & Usuarios
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              {tech?.browsers && tech.browsers.slice(0, 2).map((b, idx) => (
                <div key={idx} className="flex justify-between items-center font-bold">
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-4 text-center shrink-0">{getBrowserIcon(b.name)}</span>
                    <span className="truncate">{b.name}</span>
                  </span>
                  <span className="text-slate-900 dark:text-white font-black">{b.count}</span>
                </div>
              ))}
              <div className="pt-1.5 mt-0.5 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-[11px]">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <i className="fa-solid fa-user-check text-[10px]"></i>
                  Usuarios Registrados
                </span>
                <span className="font-black text-primary">{tech?.users?.authenticated || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-500 flex items-center gap-1.5">
                  <i className="fa-solid fa-user-secret text-[10px]"></i>
                  Anónimos
                </span>
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
              <i className="fa-solid fa-clock-rotate-left text-emerald-500"></i>
              Registro en Tiempo Real ({filteredVisits.length} visitas)
            </h4>
            <p className="text-xs text-slate-500">Últimos accesos con geolocalización, ruta y dispositivo</p>
          </div>

          {/* FILTROS DE CATEGORÍA (TODAS / WEB NORMAL / BLOG NOTICIAS) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 p-1 rounded-xl flex-wrap self-start sm:self-auto shrink-0">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                categoryFilter === 'ALL' ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-layer-group text-[10px]"></i>
              Todas
            </button>
            <button
              onClick={() => setCategoryFilter('app')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                categoryFilter === 'app' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-globe text-[10px]"></i>
              Web
            </button>
            <button
              onClick={() => setCategoryFilter('blog')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                categoryFilter === 'blog' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-newspaper text-[10px]"></i>
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
          <i className="fa-solid fa-magnifying-glass text-slate-400 absolute left-3 top-3 text-xs"></i>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* LISTADO RESPONSIVE DE VISITAS */}
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
          {paginatedVisits.length > 0 ? (
            paginatedVisits.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                
                {/* IZQUIERDA: HORA, UBICACIÓN, IP Y USUARIO */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="pt-0.5">
                    {renderFlag(v.countryCode)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {v.ip}
                      </span>

                      {/* BADGE USUARIO */}
                      {v.userName ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20" title={v.userEmail || ''}>
                          <i className="fa-solid fa-user-check text-[9px]"></i>
                          <span className="truncate max-w-[80px] sm:max-w-[150px]">{v.userName}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                          <i className="fa-solid fa-user-secret text-[9px]"></i>
                          <span>Anónimo</span>
                        </span>
                      )}

                      {/* UBICACIÓN */}
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-[10px] text-slate-400"></i>
                        <span className="truncate max-w-[100px] sm:max-w-[200px]">{v.city ? `${v.city}, ` : ''}{v.country || 'Desconocido'}</span>
                      </span>
                    </div>

                    {/* RUTA VISITADA & REFERRER */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs">
                      {/* BADGE CATEGORÍA */}
                      {v.category === 'blog' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          <i className="fa-solid fa-newspaper text-[9px]"></i>
                          Noticias
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <i className="fa-solid fa-globe text-[9px]"></i>
                          Web App
                        </span>
                      )}

                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium truncate max-w-[130px] sm:max-w-[300px]" title={v.path}>
                        {v.path}
                      </span>

                      <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>Desde</span>
                        <span className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400">
                          {getReferrerIcon(v.referrer)}
                          <span className="truncate max-w-[90px] sm:max-w-[180px]">{v.referrer || 'Directo'}</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* DERECHA / ABAJO EN MÓVIL: DISPOSITIVO, NAVEGADOR Y TIEMPO */}
                <div className="flex items-center justify-between shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/50 dark:border-white/5 text-xs text-slate-500 gap-2 sm:flex-col sm:items-end sm:justify-center">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 min-w-0 whitespace-nowrap">
                    <span className="shrink-0 text-slate-500 dark:text-slate-400" title={v.device}>{getDeviceIcon(v.device)}</span>
                    <span title={v.os} className="flex items-center gap-1 shrink-0">
                      {getOsIcon(v.os)}
                      <span className="truncate max-w-[85px] sm:max-w-[120px]">{v.os || 'SO'}</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-600 shrink-0">•</span>
                    <span title={v.browser} className="flex items-center gap-1 min-w-0">
                      {getBrowserIcon(v.browser)}
                      <span className="truncate max-w-[75px] sm:max-w-[110px]">{v.browser || 'Navegador'}</span>
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <i className="fa-regular fa-clock text-[10px] text-slate-400"></i>
                    <span>{formatTimeAgo(v.createdAt)}</span>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
              <i className="fa-solid fa-inbox text-2xl text-slate-300 dark:text-slate-600"></i>
              <span>No hay visitas registradas que coincidan con los filtros.</span>
            </div>
          )}
        </div>

        {/* CONTROLES DE PAGINACIÓN */}
        {filteredVisits.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            {/* IZQUIERDA: CONTADOR & TAMAÑO DE PÁGINA */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
              <span>
                Mostrando <strong className="text-slate-800 dark:text-white font-bold">{((validCurrentPage - 1) * pageSize) + 1}</strong> a <strong className="text-slate-800 dark:text-white font-bold">{Math.min(validCurrentPage * pageSize, filteredVisits.length)}</strong> de <strong className="text-slate-800 dark:text-white font-bold">{filteredVisits.length}</strong>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <span>Por pág:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 dark:bg-white/10 border border-slate-200/50 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* DERECHA: BOTONES DE NAVEGACIÓN */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                type="button"
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200/50 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página anterior"
              >
                <i className="fa-solid fa-chevron-left text-[11px]"></i>
              </button>

              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {validCurrentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200/50 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página siguiente"
              >
                <i className="fa-solid fa-chevron-right text-[11px]"></i>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
