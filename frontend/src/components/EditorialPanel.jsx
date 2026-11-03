import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function EditorialPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
  const terminalRef = useRef(null);

  // Obtener headers de autenticación admin
  const getAuthHeaders = () => {
    const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Cargar estado de la IA editorial
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

  // Polling en tiempo real: cada 2.5s si está generando, cada 6s si está en reposo
  useEffect(() => {
    fetchEditorialStatus(false);
    const intervalTime = (status?.isGenerating || triggering) ? 2500 : 6000;
    const timer = setInterval(() => {
      fetchEditorialStatus(true);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [fetchEditorialStatus, status?.isGenerating, triggering]);

  // Contador regresivo en tiempo real hasta la próxima publicación (06:00 AM)
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

  // Auto-scroll en la terminal al recibir nuevos logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [status?.logs]);

  // Disparar generación manual con IA
  const handleGenerateNow = async () => {
    if (status?.isGenerating || triggering) return;
    setTriggering(true);
    toast.info('🚀 Lanzando generador con Gemini 3.6 Flash...');

    try {
      const res = await axios.post('/api/admin/blog/generate', { force: true }, {
        headers: getAuthHeaders()
      });

      if (res.data?.status === 'success') {
        toast.success(`🎉 Noticia publicada: "${res.data.article.title}"`);
      } else if (res.data?.status === 'error') {
        toast.error(`❌ Error de la IA: ${res.data.error || 'Fallo desconocido'}`);
      }
      await fetchEditorialStatus(true);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      toast.error(`Error al conectar con el servidor: ${msg}`);
    } finally {
      setTriggering(false);
      await fetchEditorialStatus(true);
    }
  };

  const isGeneratingActive = status?.isGenerating || triggering;
  const lastRun = status?.lastRun;
  const isLastSuccess = lastRun?.status === 'success';
  const isLastError = lastRun?.status === 'error';

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full overflow-hidden pb-6">
      
      {/* CABECERA RESUMEN Y CONTADOR EN TIEMPO REAL */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
        {/* Glow de fondo decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="relative z-10 space-y-4">
          {/* Fila de badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Motor Editorial IA
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
              {status?.primaryModel || 'gemini-3.6-flash'}
            </span>
            {status?.publishedToday ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <i className="fa-solid fa-circle-check"></i>
                Publicada Hoy
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <i className="fa-solid fa-clock"></i>
                Pendiente 06:00 AM
              </span>
            )}
          </div>

          {/* Título y subtítulo */}
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-snug">
              Automatización Editorial Diaria
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Genera a las 06:00 AM un reportaje periodístico con SEO técnico, retención optimizada y miniaturas 16:9 sin repetir.
            </p>
          </div>

          {/* CONTADOR EN TIEMPO REAL RESPONSIVE */}
          <div className="bg-white/5 border border-white/10 p-3 sm:p-3.5 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-md w-full">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5">
              <i className="fa-solid fa-stopwatch text-primary"></i>
              Próxima noticia automática en
            </span>
            <div className="font-mono text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1 w-full">
              <span className="bg-black/50 px-2 py-1 rounded-lg border border-white/10 min-w-[42px] text-center">
                {String(timeRemaining.hours).padStart(2, '0')}h
              </span>
              <span className="text-primary font-bold animate-pulse px-0.5">:</span>
              <span className="bg-black/50 px-2 py-1 rounded-lg border border-white/10 min-w-[42px] text-center">
                {String(timeRemaining.minutes).padStart(2, '0')}m
              </span>
              <span className="text-primary font-bold animate-pulse px-0.5">:</span>
              <span className="bg-black/50 px-2 py-1 rounded-lg border border-white/10 min-w-[42px] text-center">
                {String(timeRemaining.seconds).padStart(2, '0')}s
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 font-medium">
              Programado diariamente a las 06:00 AM
            </span>
          </div>

          {/* MÉTRICAS RÁPIDAS Y BOTÓN MANUAL */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-newspaper text-primary"></i>
                <span>{status?.totalAiArticles || 0} artículos IA</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-eye text-emerald-400"></i>
                <span>{status?.totalViews || 0} lecturas</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateNow}
              disabled={isGeneratingActive}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
                isGeneratingActive
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                  : 'bg-primary hover:bg-primary-dark text-white shadow-primary/25'
              }`}
            >
              {isGeneratingActive ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                  <span className="truncate">Redactando con Gemini 3.6 Flash...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt text-amber-300"></i>
                  <span>Generar Noticia con IA Ahora</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ESTADO EN VIVO DE LA IA (PIPELINE) */}
      <div className="bg-white dark:bg-[#0c1017] p-3.5 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
            <i className={`fa-solid fa-robot ${isGeneratingActive ? 'text-primary animate-bounce' : 'text-slate-400'}`}></i>
            <span>Monitor en Tiempo Real</span>
          </h4>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 ${
            isGeneratingActive 
              ? 'bg-primary/10 text-primary border border-primary/20 animate-pulse'
              : 'bg-slate-100 dark:bg-white/10 text-slate-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isGeneratingActive ? 'bg-primary animate-ping' : 'bg-emerald-500'}`}></span>
            {isGeneratingActive ? 'PROCESANDO' : 'EN ESPERA'}
          </span>
        </div>

        {/* PASO ACTUAL */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-start gap-2.5">
          <div className="mt-0.5 text-sm text-primary shrink-0">
            {isGeneratingActive ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-circle-info text-slate-400"></i>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-0.5">Acción actual</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 break-words leading-snug">
              {status?.currentStep || 'En reposo. Próxima noticia programada a las 06:00 AM.'}
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO DE LA ÚLTIMA EJECUCIÓN (ÉXITO O ERROR) */}
      {lastRun && (
        <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
          isLastSuccess 
            ? 'bg-emerald-500/5 border-emerald-500/20' 
            : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] text-white shrink-0 ${
                isLastSuccess ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-red-500 shadow-sm shadow-red-500/20'
              }`}>
                <i className={isLastSuccess ? "fa-solid fa-check" : "fa-solid fa-xmark"}></i>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-wide block text-slate-800 dark:text-white truncate">
                  {isLastSuccess ? 'Última Noticia Publicada' : 'Fallo en la Ejecución'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {lastRun.timestamp ? new Date(lastRun.timestamp).toLocaleString('es-ES') : ''}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
              isLastSuccess ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500'
            }`}>
              {isLastSuccess ? '200 OK' : 'Fallo'}
            </span>
          </div>

          {isLastSuccess && lastRun.article ? (
            <div className="flex flex-col gap-3 p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200/50 dark:border-white/5 overflow-hidden">
              <div className="w-full aspect-video max-h-40 sm:max-h-48 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 relative">
                <img 
                  src={lastRun.article.image} 
                  alt={lastRun.article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase">
                  <span>{lastRun.article.kicker || lastRun.article.category}</span>
                  <span>&bull;</span>
                  <span className="text-slate-400">{lastRun.article.readTime}</span>
                </div>
                <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {lastRun.article.title}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {lastRun.article.excerpt}
                </p>
                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px] sm:max-w-[200px]">
                    /blog/{lastRun.article.slug}
                  </span>
                  <a
                    href={`/blog/${lastRun.article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-black text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                  >
                    <span>Ver noticia</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono break-words leading-relaxed">
              <strong>Error:</strong> {lastRun.error || 'Fallo indeterminado durante la generación'}
            </div>
          )}
        </div>
      )}

      {/* TERMINAL DE AUDITORÍA EN VIVO */}
      <div className="bg-[#08090d] text-slate-200 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        <div className="px-3.5 py-2.5 bg-black/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
              <span className="w-2 h-2 rounded-full bg-amber-500/80"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-[11px] text-slate-400 ml-1">Terminal de Auditoría</span>
          </div>
          <button
            onClick={() => fetchEditorialStatus(true)}
            className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
          >
            <i className="fa-solid fa-rotate text-[9px]"></i>
            <span>Refrescar</span>
          </button>
        </div>

        <div 
          ref={terminalRef}
          className="p-3 font-mono text-[11px] max-h-56 sm:max-h-64 overflow-y-auto space-y-1.5 no-scrollbar"
        >
          {status?.logs && status.logs.length > 0 ? (
            status.logs.map((log, idx) => {
              const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString('es-ES') : '';
              const isErr = log.type === 'error';
              const isSucc = log.type === 'success';
              const isWarn = log.type === 'warn';

              return (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 leading-relaxed ${
                    isErr ? 'text-red-400' : isSucc ? 'text-emerald-400' : isWarn ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 shrink-0 text-[10px] select-none">[{time}]</span>
                  <span className="break-all flex-1 min-w-0">{log.message}</span>
                </div>
              );
            })
          ) : (
            <div className="text-slate-600 text-center py-4 text-xs">
              No hay logs registrados en esta sesión.
            </div>
          )}
        </div>
      </div>

      {/* LISTADO DE ÚLTIMOS ARTÍCULOS EN BASE DE DATOS */}
      {status?.latestArticles && status.latestArticles.length > 0 && (
        <div className="bg-white dark:bg-[#0c1017] p-3.5 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
              <i className="fa-solid fa-list-check text-primary"></i>
              <span>Artículos Publicados</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-bold">{status.latestArticles.length} en BD</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {status.latestArticles.map((art) => (
              <a
                key={art.slug}
                href={`/blog/${art.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-primary/40 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-2.5 transition-all group"
              >
                <div className="w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-white/10">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-primary uppercase block truncate">{art.category}</span>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{art.title}</h6>
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
