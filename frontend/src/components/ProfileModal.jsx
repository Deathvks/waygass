import React from 'react';

export default function ProfileModal({ isOpen, onClose, user, onLogout, openSub }) {
  if (!isOpen || !user) return null;

  const isPro = user.subscription === 'pro' || user.subscription === 'premium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo borroso y oscuro */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenido del modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] dark:border dark:border-slate-800 p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-rose-400"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="flex flex-col items-center mt-2">
          {/* Avatar inicial */}
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-100 to-rose-100 rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-slate-900 shadow-sm relative">
            <span className="text-3xl font-black text-orange-500">{user.name.charAt(0).toUpperCase()}</span>
            {isPro && (
              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-300 w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">
            {user.name} {user.lastName}
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {user.email}
          </p>

          <div className="w-full space-y-3">
            {/* Estado de Suscripción */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Plan Actual</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{user.subscription}</p>
              </div>
              {!isPro && (
                <button 
                  onClick={() => { onClose(); openSub(); }}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[11px] px-3 py-1.5 rounded-full transition active:scale-95"
                >
                  Mejorar a PRO
                </button>
              )}
            </div>

            {/* Cerrar Sesión */}
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
