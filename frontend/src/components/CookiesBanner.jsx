import React, { useState, useEffect } from 'react';

export default function CookiesBanner({ isVisible, onAccept, onReject, onShowLegal }) {
  const handleAccept = () => {
    localStorage.setItem('waygass_cookie_consent', 'accepted');
    if (onAccept) onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('waygass_cookie_consent', 'rejected');
    if (onReject) onReject();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[9999] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex-1 text-sm text-slate-600 dark:text-slate-400">
        <p className="mb-2">
          Utilizamos cookies y almacenamiento local para recordar tu ubicación, mantener tus filtros favoritos y mejorar tu experiencia. 
          Al hacer clic en "Aceptar", consientes el uso de TODOS los datos locales. Si rechazas, algunas configuraciones no se guardarán al salir.
        </p>
        <div className="flex gap-4 text-xs font-medium text-orange-500">
          <button onClick={() => onShowLegal('privacy')} className="hover:underline">Política de Privacidad</button>
          <button onClick={() => onShowLegal('terms')} className="hover:underline">Términos de Servicio</button>
        </div>
      </div>
      <div className="flex shrink-0 gap-3 w-full sm:w-auto">
        <button onClick={handleReject} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          Rechazar
        </button>
        <button onClick={handleAccept} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-md hover:opacity-90 transition">
          Aceptar
        </button>
      </div>
    </div>
  );
}
