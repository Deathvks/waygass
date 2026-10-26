import React from 'react';

export default function Header({ isPro, openSettings, openSub, user, openProfile, openSecurity }) {
  return (
    <header className="flex items-center justify-between w-full">
      {/* Left: Logo */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
          <img src="/logo.png" alt="WayGass" className="w-6 h-6 object-contain" />
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          WayGass
        </h1>
        {isPro && (
          <span className="text-[9px] bg-gradient-to-r from-amber-200 to-yellow-400 text-slate-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
            <i className="fa-solid fa-crown text-[8px]"></i>
            PRO
          </span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <a 
          href="/gasolineras"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold transition"
          title="Directorio de Gasolineras por Provincia"
        >
          <i className="fa-solid fa-map-location-dot text-primary text-xs"></i>
          <span>Provincias</span>
        </a>
        <a 
          href="/blog"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold transition"
          title="Blog de Ahorro y Consejos"
        >
          <i className="fa-solid fa-newspaper text-xs"></i>
          <span>Blog</span>
        </a>

        {!isPro && (
          <button 
            onClick={openSub}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition hover:scale-105 shadow-sm"
          >
            <i className="fa-solid fa-crown text-amber-400 text-xs"></i>
            <span>PRO</span>
          </button>
        )}

        {user?.role === 'admin' && (
          <button 
            onClick={openSecurity} 
            className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-primary hover:bg-primary/10 dark:hover:bg-primary/10 transition" 
            title="Ciberseguridad & Admin"
          >
            <i className="fa-solid fa-shield-halved text-base"></i>
          </button>
        )}

        <button 
          onClick={openProfile} 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition p-0.5"
          title="Mi Perfil"
        >
          <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </button>

        <button 
          onClick={openSettings} 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition"
          title="Ajustes de la aplicación"
        >
          <i className="fa-solid fa-gear text-base"></i>
        </button>
      </div>
    </header>
  );
}
