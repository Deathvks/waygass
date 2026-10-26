import React, { useState, useRef, useEffect } from 'react';

export default function Header({ isPro, openSettings, openSub, user, openProfile, openSecurity }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú al hacer clic fuera o pulsar Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="flex items-center justify-between w-full relative">
      {/* Izquierda: Logotipo y Marca */}
      <div className="flex items-center gap-2">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md shadow-primary/20 shrink-0 group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-gas-pump text-white text-sm"></i>
          </div>
          <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Way<span className="text-primary">Gass</span>
          </span>
        </a>

        {isPro && (
          <span className="text-[9px] bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
            <i className="fa-solid fa-crown text-[8px]"></i>
            PRO
          </span>
        )}
      </div>

      {/* Derecha: Acciones Compactas y Menú */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Botón PRO destacado solo si no es PRO */}
        {!isPro && (
          <button 
            type="button"
            onClick={openSub}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/15 to-yellow-400/15 hover:from-amber-400/25 hover:to-yellow-400/25 text-amber-700 dark:text-amber-400 border border-amber-400/30 text-[11px] font-black transition-all hover:scale-105 shadow-sm cursor-pointer"
            title="Hazte PRO"
          >
            <i className="fa-solid fa-crown text-[9px] text-amber-500"></i>
            <span>PRO</span>
          </button>
        )}

        {/* Perfil de Usuario */}
        <button 
          type="button"
          onClick={openProfile} 
          className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary dark:hover:border-primary transition p-0.5 cursor-pointer shrink-0"
          title={user?.name ? `Perfil de ${user.name}` : "Mi Perfil"}
        >
          <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : <i className="fa-regular fa-user text-[11px]"></i>}
          </div>
        </button>

        {/* Ajustes de la App */}
        <button 
          type="button"
          onClick={openSettings} 
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer shrink-0"
          title="Ajustes de la aplicación"
        >
          <i className="fa-solid fa-gear text-sm"></i>
        </button>

        {/* Menú Desplegable con Provincias, Blog y Enlaces */}
        <div className="relative" ref={menuRef}>
          <button 
            type="button"
            onClick={() => setMenuOpen(!menuOpen)} 
            className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
              menuOpen 
                ? 'bg-primary text-white shadow-md shadow-primary/25' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
            title="Más opciones y navegación"
            aria-expanded={menuOpen}
          >
            <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>

          {/* Popover desplegable con estilo limpio */}
          {menuOpen && (
            <div className="absolute right-0 top-10 w-60 rounded-2xl bg-white dark:bg-[#0f131a] border border-slate-200 dark:border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/5 mb-1">
                Navegación WayGass
              </div>

              <a 
                href="/gasolineras"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition text-xs font-bold text-slate-700 dark:text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-map-location-dot text-xs"></i>
                </div>
                <div>
                  <div className="leading-tight">Provincias de España</div>
                  <div className="text-[10px] text-slate-400 font-normal">Directorio de gasolineras</div>
                </div>
              </a>

              <a 
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition text-xs font-bold text-slate-700 dark:text-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-newspaper text-xs"></i>
                </div>
                <div>
                  <div className="leading-tight">Blog & Guías</div>
                  <div className="text-[10px] text-slate-400 font-normal">Ahorro y actualidad motor</div>
                </div>
              </a>

              {user?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openSecurity();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition text-xs font-bold text-slate-700 dark:text-slate-200 text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-shield-halved text-xs"></i>
                  </div>
                  <div>
                    <div className="leading-tight">Ciberseguridad & Admin</div>
                    <div className="text-[10px] text-slate-400 font-normal">Panel de control del sistema</div>
                  </div>
                </button>
              )}

              {!isPro && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openSub();
                  }}
                  className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/20 text-xs font-bold text-amber-800 dark:text-amber-300 text-left transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <i className="fa-solid fa-crown text-xs"></i>
                  </div>
                  <div>
                    <div className="leading-tight">Hazte WayGass PRO</div>
                    <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-normal">Desbloquea todas las funciones</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
