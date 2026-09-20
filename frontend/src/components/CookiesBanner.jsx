import React from 'react';

export default function CookiesBanner({ onAccept, onReject }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 z-[9999] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex-1 text-sm text-slate-600 dark:text-slate-400">
        <p className="mb-2">
          Utilizamos cookies y almacenamiento local para recordar tu ubicación, mantener tus filtros favoritos y mejorar tu experiencia. 
          Al hacer clic en "Aceptar", consientes el uso de TODOS los datos locales, incluidas las cookies de anuncios. Si rechazas, algunas configuraciones no se guardarán al salir.
        </p>
        <div className="flex gap-4 text-xs font-medium text-primary">
          <a href="/privacidad" className="hover:underline">Política de Privacidad</a>
          <a href="/legal" className="hover:underline">Términos de Servicio</a>
          <a href="/cookies" className="hover:underline">Política de Cookies</a>
        </div>
      </div>
      <div className="flex shrink-0 gap-3 w-full sm:w-auto">
        <button onClick={onReject} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          Rechazar
        </button>
        <button onClick={onAccept} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-primary/30">
          Aceptar Todas
        </button>
      </div>
    </div>
  );
}
