import React, { useState, useMemo } from 'react';
import SEOHead from './SEOHead.jsx';
import { PROVINCES_DATA } from '../data/provincesData.js';

export default function ProvincesDirectory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProvinces = useMemo(() => {
    if (!searchTerm.trim()) return PROVINCES_DATA;
    const term = searchTerm.toLowerCase().trim();
    return PROVINCES_DATA.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.region.toLowerCase().includes(term) ||
      p.capital.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Agrupar por Comunidad Autónoma
  const groupedByRegion = useMemo(() => {
    const map = {};
    filteredProvinces.forEach(p => {
      if (!map[p.region]) map[p.region] = [];
      map[p.region].push(p);
    });
    return map;
  }, [filteredProvinces]);

  const pageTitle = "Gasolineras Baratas por Provincia en España - Directorio Oficial | WayGass";
  const pageDescription = "Directorio de gasolineras más baratas de España por provincias y comunidades autónomas. Compara precios actualizados hoy de Gasolina 95, Diésel y GLP.";
  const canonicalUrl = "https://waygass.es/gasolineras";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white font-sans selection:bg-primary selection:text-white">
      <SEOHead 
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        breadcrumbs={[
          { name: 'Inicio', url: 'https://waygass.es/' },
          { name: 'Gasolineras', url: canonicalUrl }
        ]}
      />

      {/* HEADER */}
      <header className="px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-[#f8fafc]/90 dark:bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
            <i className="fa-solid fa-gas-pump text-white text-sm"></i>
          </div>
          <span className="text-xl font-black tracking-tight">Way<span className="text-primary">Gass</span></span>
        </a>
        <a 
          href="/" 
          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl text-xs sm:text-sm transition-transform hover:scale-105 shadow-sm flex items-center gap-1.5"
        >
          <i className="fa-solid fa-map-location-dot text-xs text-primary"></i>
          <span>Ir al mapa</span>
        </a>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <a href="/" className="hover:text-primary transition-colors">Inicio</a>
          <i className="fa-solid fa-chevron-right text-[10px] opacity-60"></i>
          <span className="text-slate-900 dark:text-white font-bold">Gasolineras por Provincia</span>
        </nav>

        <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider border border-primary/20">
            <i className="fa-solid fa-location-crosshairs"></i>
            Directorio Nacional Completo
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Gasolineras Baratas en España por <span className="text-primary">Provincia</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Selecciona tu provincia para consultar en tiempo real las estaciones de servicio más baratas, el precio medio y los mejores lugares para repostar Gasolina 95, Diésel y GLP.
          </p>

          {/* BUSCADOR RÁPIDO */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text"
                placeholder="Buscar tu provincia o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LISTADO POR COMUNIDADES */}
        <div className="space-y-10">
          {Object.keys(groupedByRegion).length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5">
              No hemos encontrado ninguna provincia que coincida con "{searchTerm}".
            </div>
          ) : (
            Object.entries(groupedByRegion).map(([region, provinces]) => (
              <section key={region} className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-primary inline-block"></span>
                  <span>{region}</span>
                  <span className="text-xs font-semibold text-slate-400 font-normal">({provinces.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {provinces.map(p => (
                    <a
                      key={p.slug}
                      href={`/gasolineras/${p.slug}`}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 hover:border-primary/40 hover:shadow-md transition-all group flex items-center justify-between"
                    >
                      <div>
                        <div className="font-black text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {p.capital}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-primary group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500 mt-20">
        <p className="font-medium">&copy; {new Date().getFullYear()} WayGass. Comparador oficial de precios de gasolineras en España.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
          <a href="/" className="hover:text-primary transition-colors">Inicio</a>
          <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
          <a href="/legal" className="hover:text-primary transition-colors">Aviso Legal</a>
          <a href="/privacidad" className="hover:text-primary transition-colors">Privacidad</a>
          <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
        </div>
      </footer>
    </div>
  );
}
