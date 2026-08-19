import React from 'react';

export default function Header({ isPro, openSettings, openSub, user, openProfile }) {
  return (
    <header className="relative z-40 px-4 lg:px-6 xl:px-8 pt-5 pb-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Izquierda: Logo y Marca */}
        <div className="flex items-center gap-2.5 text-white">
          <div className="w-8 h-8 rounded-xl bg-white shadow-sm overflow-hidden flex items-center justify-center">
            <img src="/logo.svg" alt="WayGass Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-bold text-2xl tracking-tight leading-none flex items-center gap-2">
            <span>WayGass</span>
            {isPro && (
              <span className="text-[10px] bg-gradient-to-r from-amber-200 to-yellow-400 text-slate-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                PRO
              </span>
            )}
          </h1>
        </div>

        {/* Derecha: Acciones agrupadas */}
        <div className="flex items-center gap-3">
          
          {/* Botón Hazte PRO (Móvil solamente en la fila superior) */}
          {!isPro && (
            <button 
              onClick={openSub}
              className="lg:hidden bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-amber-300 border border-slate-700/50 shadow-lg font-bold text-[11px] px-3 py-1.5 rounded-full transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              <span>HAZTE PRO</span>
            </button>
          )}

          {/* User Pill Consolidado */}
          {user && (
            <div className="flex items-center bg-white/10 border border-white/20 backdrop-blur-md rounded-full p-1 shadow-sm whitespace-nowrap shrink-0">
              
              {/* Botón Perfil (PC) */}
              <button 
                onClick={openProfile}
                className="hidden lg:flex items-center gap-2 hover:bg-white/10 rounded-full pr-3 transition group cursor-pointer"
                title="Ver Perfil"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-xs font-semibold">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              
              {/* Nombre simple (Móvil/Tablet) */}
              <span className="lg:hidden sm:inline-block hidden text-white text-xs font-semibold px-2">
                Hola, {user.name.split(' ')[0]}
              </span>
              
              <div className="hidden sm:block w-px h-4 bg-white/20 mx-1"></div>
              
              <button 
                onClick={openSettings}
                className="w-8 h-8 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition" 
                title="Ajustes"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Botón Hazte PRO (Banner de bloque completo, solo para PC) */}
      {!isPro && (
        <div className="hidden lg:block mt-5">
          <button 
            onClick={openSub}
            className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-amber-300 border border-slate-700/50 shadow-xl font-black text-xs px-4 py-2.5 rounded-2xl transition active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            <span>MEJORAR A PRO</span>
          </button>
        </div>
      )}
    </header>
  );
}
