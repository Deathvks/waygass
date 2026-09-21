import React from 'react';

export default function CookiesBanner({ onAccept, onReject }) {
  return (
    <div style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }} className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl shadow-black/20 dark:shadow-black/50 border border-slate-200/60 dark:border-white/10 p-5 sm:p-6 z-[99999] flex flex-col gap-4 backdrop-blur-xl bg-white/90 dark:bg-[#1a1a1a]/90">
      
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> Privacidad y Cookies
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Utilizamos almacenamiento local para recordar tu ubicación, mantener tus filtros favoritos y mejorar tu experiencia con anuncios personalizados. 
          Si rechazas, tus ajustes como el <strong>color o el tema oscuro</strong> no se guardarán al salir.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <button onClick={onReject} className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors active:scale-95">
          Rechazar
        </button>
        <button onClick={onAccept} className="w-full px-5 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition-all active:scale-95">
          Aceptar Todo
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
        <a href="/privacidad" className="hover:text-primary transition-colors">Privacidad</a>
        <a href="/legal" className="hover:text-primary transition-colors">Términos</a>
        <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
      </div>

    </div>
  );
}
