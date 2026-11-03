import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function EditorialPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
  const terminalRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchEditorialStatus = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const res = await axios.get('/api/admin/blog/status', {
        headers: getAuthHeaders(),
        params: { _t: Date.now() }
      });
      if (res.data && res.data.success) {
        setStatus(res.data);
      }
    } catch (err) {
      if (!quiet) {
        console.error('Error al cargar estado editorial:', err.message);
      }
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEditorialStatus(false);
    const intervalTime = (status?.isGenerating || triggering) ? 2500 : 8000;
    const timer = setInterval(() => {
      fetchEditorialStatus(true);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [fetchEditorialStatus, status?.isGenerating, triggering]);

  useEffect(() => {
    const updateCountdown = () => {
      if (!status?.nextScheduledTime) return;
      const target = new Date(status.nextScheduledTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const totalSec = Math.floor(diff / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeRemaining({ hours, minutes, seconds, totalSeconds: totalSec });
    };

    updateCountdown();
    const secTimer = setInterval(updateCountdown, 1000);
    return () => clearInterval(secTimer);
  }, [status?.nextScheduledTime]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [status?.logs]);

  const handleGenerateNow = async () => {
    if (status?.isGenerating || triggering) return;
    setTriggering(true);
    toast.info('Iniciando generación editorial...');

    try {
      const res = await axios.post('/api/admin/blog/generate', { force: true }, {
        headers: getAuthHeaders()
      });

      if (res.data?.status === 'success') {
        toast.success(`Noticia publicada: "${res.data.article.title}"`);
      } else if (res.data?.status === 'error') {
        toast.error(`Error: ${res.data.error || 'Fallo en la generación'}`);
      }
      await fetchEditorialStatus(true);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      toast.error(`Error de conexión: ${msg}`);
    } finally {
      setTriggering(false);
      await fetchEditorialStatus(true);
    }
  };

  const isGeneratingActive = status?.isGenerating || triggering;
  const lastRun = status?.lastRun;
  const isLastSuccess = lastRun?.status === 'success';

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden pb-0">
      
      {/* TARJETA PRINCIPAL: CABECERA & CONTADOR */}
      <div className="bg-white dark:bg-[#0c1017] border border-slate-200/70 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
              <i className="fa-solid fa-newspaper text-base"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Editorial Automática
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                  {status?.primaryModel || 'gemini-3.6-flash'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Publicación programada a las 06:00 AM
              </p>
            </div>
          </div>

          <div>
            {status?.publishedToday ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Publicada hoy
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Pendiente hoy
              </span>
            )}
          </div>
        </div>

        {/* CONTADOR REGRESIVO (ESTILO APPLE TIMER / WIDGET) */}
        <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 rounded-xl p-3.5 sm:p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <i className="fa-regular fa-clock text-xs"></i>
            <span>Próxima publicación en</span>
          </p>

          <div className="flex items-center justify-center gap-2 font-mono">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {String(timeRemaining.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Horas</span>
            </div>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600 -mt-3.5">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {String(timeRemaining.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Min</span>
            </div>
            <span className="text-xl font-bold text-slate-300 dark:text-slate-600 -mt-3.5">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {String(timeRemaining.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Seg</span>
            </div>
          </div>
        </div>

        {/* MÉTRICAS & BOTÓN DE ACCIÓN */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 rounded-xl p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Artículos IA</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {status?.totalAiArticles || 0}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 rounded-xl p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Lecturas Totales</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {status?.totalViews?.toLocaleString('es-ES') || 0}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateNow}
          disabled={isGeneratingActive}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isGeneratingActive
              ? 'bg-slate-100 dark:bg-white/10 text-slate-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark text-white shadow-sm active:scale-[0.99]'
          }`}
        >
          {isGeneratingActive ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
              <span>Generando artículo...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-play text-[10px]"></i>
              <span>Generar Noticia Ahora</span>
            </>
          )}
        </button>
      </div>

      {/* ESTADO EN TIEMPO REAL */}
      <div className="bg-white dark:bg-[#0c1017] border border-slate-200/70 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Estado del Proceso
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isGeneratingActive 
              ? 'bg-primary/10 text-primary' 
              : 'bg-slate-100 dark:bg-white/10 text-slate-500'
          }`}>
            {isGeneratingActive ? 'En Ejecución' : 'En Reposo'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Paso Actual</span>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 break-words leading-relaxed">
            {status?.currentStep || 'En reposo. Próxima noticia programada a las 06:00 AM.'}
          </p>
        </div>
      </div>

      {/* ÚLTIMA PUBLICACIÓN O RESULTADO */}
      {lastRun && (
        <div className="bg-white dark:bg-[#0c1017] border border-slate-200/70 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isLastSuccess ? 'Último Artículo Publicado' : 'Resultado de la Última Ejecución'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isLastSuccess ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600'
            }`}>
              {isLastSuccess ? 'Completado' : 'Fallo'}
            </span>
          </div>

          {isLastSuccess && lastRun.article ? (
            <div className="space-y-3">
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
                <img 
                  src={lastRun.article.image} 
                  alt={lastRun.article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1">
                  <span className="text-primary">{lastRun.article.category}</span>
                  <span>&bull;</span>
                  <span>{lastRun.article.readTime}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {lastRun.article.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {lastRun.article.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px] sm:max-w-[200px]">
                  /blog/{lastRun.article.slug}
                </span>
                <a
                  href={`/blog/${lastRun.article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Ver artículo</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono break-words">
              <strong>Error:</strong> {lastRun.error || 'Error indeterminado durante la ejecución.'}
            </div>
          )}
        </div>
      )}

      {/* REGISTRO DE ACTIVIDAD (LOGS) */}
      <div className="bg-white dark:bg-[#0c1017] border border-slate-200/70 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Registro de Actividad
          </span>
          <button
            onClick={() => fetchEditorialStatus(true)}
            className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-semibold transition-colors"
          >
            <i className="fa-solid fa-rotate text-[10px]"></i>
            <span>Actualizar</span>
          </button>
        </div>

        <div 
          ref={terminalRef}
          className="bg-[#0f1115] text-slate-300 rounded-xl border border-slate-200/30 dark:border-white/5 p-3 font-mono text-[11px] max-h-52 overflow-y-auto space-y-1.5 no-scrollbar"
        >
          {status?.logs && status.logs.length > 0 ? (
            status.logs.map((log, idx) => {
              const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString('es-ES') : '';
              const isErr = log.type === 'error';
              const isSucc = log.type === 'success';

              return (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0 select-none">[{time}]</span>
                  <span className={`break-all flex-1 min-w-0 ${
                    isErr ? 'text-red-400' : isSucc ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-slate-500 text-center py-4 text-xs">
              Sin actividad registrada en esta sesión.
            </div>
          )}
        </div>
      </div>

      {/* HISTORIAL DE ARTÍCULOS EN BASE DE DATOS */}
      {status?.latestArticles && status.latestArticles.length > 0 && (
        <div className="bg-white dark:bg-[#0c1017] border border-slate-200/70 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Historial de Artículos
            </span>
            <span className="text-[10px] font-bold text-slate-400">{status.latestArticles.length} en base de datos</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {status.latestArticles.map((art) => (
              <a
                key={art.slug}
                href={`/blog/${art.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 flex items-center gap-3 transition-colors hover:opacity-80 group first:pt-0 last:pb-0"
              >
                <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-white/5">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-primary uppercase block truncate">{art.category}</span>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{art.title}</h5>
                  <span className="text-[10px] text-slate-400 block truncate">{art.date}</span>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400 group-hover:text-primary transition-colors shrink-0 pr-1"></i>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
