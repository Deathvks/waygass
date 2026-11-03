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
    <div className="space-y-6 pb-12">
      
      {/* CABECERA CON RESUMEN Y CONTADOR EN TIEMPO REAL */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 flex items-center gap-1.5">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Motor Editorial IA
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
                Modelo: {status?.primaryModel || 'gemini-3.6-flash'}
              </span>
              {status?.publishedToday ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <i className="fa-solid fa-circle-check"></i>
                  Noticia de hoy publicada
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <i className="fa-solid fa-clock"></i>
                  Pendiente para las 06:00 AM
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Automatización de Noticias Diarias
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Genera cada día a las 06:00 AM un reportaje periodístico exclusivo con retención de lectura óptima, SEO técnico y fotos de portada únicas sin repetir.
            </p>
          </div>

          {/* CONTADOR EN TIEMPO REAL */}
          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[240px] text-center backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-2">
              <i className="fa-solid fa-stopwatch text-primary"></i>
              Próxima noticia automática en
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1">
              <span className="bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                {String(timeRemaining.hours).padStart(2, '0')}h
              </span>
              <span className="text-primary font-bold animate-pulse">:</span>
              <span className="bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                {String(timeRemaining.minutes).padStart(2, '0')}m
              </span>
              <span className="text-primary font-bold animate-pulse">:</span>
              <span className="bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                {String(timeRemaining.seconds).padStart(2, '0')}s
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Horario programado: 06:00 AM diaria
            </span>
          </div>
        </div>

        {/* ACCIÓN MANUAL */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
            <span><i className="fa-solid fa-newspaper mr-1.5 text-slate-300"></i>{status?.totalAiArticles || 0} artículos con IA</span>
            <span>&bull;</span>
            <span><i className="fa-solid fa-eye mr-1.5 text-slate-300"></i>{status?.totalViews || 0} lecturas</span>
          </div>

          <button
            type="button"
            onClick={handleGenerateNow}
            disabled={isGeneratingActive}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              isGeneratingActive
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                : 'bg-primary hover:bg-primary-dark text-white hover:scale-105 shadow-primary/30'
            }`}
          >
            {isGeneratingActive ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Redactando con Gemini 3.6 Flash...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt"></i>
                <span>Generar Noticia con IA Ahora</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ESTADO EN VIVO DE LA IA (PIPELINE) */}
      <div className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
            <i className={`fa-solid fa-robot ${isGeneratingActive ? 'text-primary animate-bounce' : 'text-slate-400'}`}></i>
            Estado del Proceso en Tiempo Real
          </h4>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
            isGeneratingActive 
              ? 'bg-primary/10 text-primary border border-primary/20 animate-pulse'
              : 'bg-slate-100 dark:bg-white/10 text-slate-500'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isGeneratingActive ? 'bg-primary animate-ping' : 'bg-emerald-500'}`}></span>
            {isGeneratingActive ? 'PROCESANDO CON IA' : 'EN ESPERA'}
          </span>
        </div>

        {/* PASO ACTUAL EN TIEMPO REAL */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-start gap-3">
          <div className="mt-0.5 text-base text-primary">
            {isGeneratingActive ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-circle-info text-slate-400"></i>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-black uppercase tracking-wide text-slate-400 mb-0.5">Acción en curso</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
              {status?.currentStep || 'En reposo. Próxima noticia programada a las 06:00 AM.'}
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO DE LA ÚLTIMA EJECUCIÓN (ÉXITO O ERROR) */}
      {lastRun && (
        <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${
          isLastSuccess 
            ? 'bg-emerald-500/5 border-emerald-500/20' 
            : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white ${
                isLastSuccess ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-red-500 shadow-md shadow-red-500/20'
              }`}>
                <i className={isLastSuccess ? "fa-solid fa-check" : "fa-solid fa-xmark"}></i>
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wide block text-slate-800 dark:text-white">
                  {isLastSuccess ? 'Última Noticia Generada con Éxito' : 'Error en la Última Ejecución'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lastRun.timestamp ? new Date(lastRun.timestamp).toLocaleString('es-ES') : ''}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
              isLastSuccess ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500'
            }`}>
              {isLastSuccess ? '200 OK' : 'Fallo'}
            </span>
          </div>

          {isLastSuccess && lastRun.article ? (
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white dark:bg-black/40 border border-slate-200/50 dark:border-white/5">
              <div className="sm:w-44 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-white/5 relative">
                <img 
                  src={lastRun.article.image} 
                  alt={lastRun.article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase mb-1">
                    <span>{lastRun.article.kicker || lastRun.article.category}</span>
                    <span>&bull;</span>
                    <span className="text-slate-400">{lastRun.article.readTime}</span>
                  </div>
                  <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug mb-1">
                    {lastRun.article.title}
                  </h5>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {lastRun.article.excerpt}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    /blog/{lastRun.article.slug}
                  </span>
                  <a
                    href={`/blog/${lastRun.article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-black text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                  >
                    Ver noticia en vivo <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono">
              <strong>Detalle del error:</strong> {lastRun.error || 'Error indeterminado durante la llamada a Gemini'}
            </div>
          )}
        </div>
      )}

      {/* TERMINAL DE LOGS EN VIVO */}
      <div className="bg-[#08090d] text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-black/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Terminal de Auditoría Editorial IA</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchEditorialStatus(true)}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-rotate text-[10px]"></i>
              <span>Refrescar</span>
            </button>
          </div>
        </div>

        <div 
          ref={terminalRef}
          className="p-4 font-mono text-xs max-h-[320px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800"
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
                  className={`flex items-start gap-2.5 leading-relaxed ${
                    isErr ? 'text-red-400' : isSucc ? 'text-emerald-400' : isWarn ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 shrink-0 text-[10px] select-none">[{time}]</span>
                  <span className="break-all">{log.message}</span>
                </div>
              );
            })
          ) : (
            <div className="text-slate-600 text-center py-6">
              No hay logs registrados en esta sesión.
            </div>
          )}
        </div>
      </div>

      {/* LISTADO DE ÚLTIMOS ARTÍCULOS PUBLICADOS POR IA */}
      {status?.latestArticles && status.latestArticles.length > 0 && (
        <div className="bg-white dark:bg-[#0c1017] p-5 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-list-check text-primary"></i>
              Últimas Noticias Publicadas en Base de Datos
            </h4>
            <span className="text-xs text-slate-400 font-bold">{status.latestArticles.length} registradas</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {status.latestArticles.map((art) => (
              <a
                key={art.slug}
                href={`/blog/${art.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-primary/40 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-3 transition-all hover:scale-[1.01] group"
              >
                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-white/10">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-primary uppercase block truncate">{art.category}</span>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{art.title}</h6>
                  <span className="text-[10px] text-slate-400">{art.date}</span>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 group-hover:text-primary transition-colors pr-1"></i>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
