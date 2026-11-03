import React, { useState, useMemo } from 'react';
import SEOHead from './SEOHead.jsx';
import { FAQ_DATA } from '../data/faqData.js';

export default function AboutPage() {
  const [activeFaqCategory, setActiveFaqCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(FAQ_DATA[0].id);

  const categories = useMemo(() => {
    const cats = ['Todas', ...new Set(FAQ_DATA.map(f => f.category))];
    return cats;
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = activeFaqCategory === 'Todas' || item.category === activeFaqCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) || 
        item.answerText.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeFaqCategory, searchQuery]);

  const toggleFaq = (id) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const isFaqPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/faq');
  const canonicalUrl = isFaqPath ? "https://waygass.es/faq" : "https://waygass.es/sobre-nosotros";

  const jsonLdAbout = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Sobre Nosotros y Preguntas Frecuentes | WayGass",
    "description": "Información corporativa, metodología de datos oficiales de MITECO e índice exhaustivo de preguntas frecuentes sobre precios de combustible en España.",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "Organization",
      "name": "WayGass",
      "url": "https://waygass.es",
      "logo": "https://waygass.es/logo.png",
      "description": "Plataforma independiente de monitorización y comparación en tiempo real de precios de combustible (gasolina, diésel, GLP) en España con datos oficiales del Gobierno.",
      "foundingDate": "2026",
      "areaServed": {
        "@type": "Country",
        "name": "España"
      },
      "knowsAbout": [
        "Precios de gasolina en España",
        "Precios de diésel hoy",
        "Datos oficiales MITECO",
        "Gasolineras baratas en España",
        "Ahorro de combustible y conducción eficiente",
        "GLP Autogás y combustibles alternativos"
      ]
    }
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answerText
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary selection:text-white">
      <SEOHead 
        title="Sobre Nosotros y Preguntas Frecuentes (FAQ) | WayGass"
        description="Conoce WayGass: plataforma independiente de precios de gasolina y diésel en España en tiempo real con datos oficiales de MITECO. Metodología, transparencia y FAQ completa."
        canonical={canonicalUrl}
        image="https://waygass.es/logo.png"
        type="website"
        breadcrumbs={[
          { name: "Inicio", url: "https://waygass.es/" },
          { name: "Sobre Nosotros & FAQ", url: canonicalUrl }
        ]}
        extraSchemas={[jsonLdAbout, jsonLdFaq]}
      />

      {/* HEADER NAVEGACIÓN APPLE LIQUID GLASS CON RESPETO A NOTCH */}
      <header 
        className="px-4 sm:px-8 pb-3.5 sm:pb-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between"
        style={{
          paddingTop: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.65rem))'
        }}
      >
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity group">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="WayGass" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">
                Way<span className="text-primary">Gass</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 dark:text-slate-500">
                Información & Transparencia
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-white/10 pl-6">
            <a href="/" className="hover:text-primary transition-colors">Mapa en Vivo</a>
            <a href="/gasolineras" className="hover:text-primary transition-colors">Provincias</a>
            <a href="/blog" className="hover:text-primary transition-colors">Blog & Noticias</a>
            <a href="/sobre-nosotros" className="text-primary hover:text-primary-dark transition-colors">Sobre Nosotros & FAQ</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/" 
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-md shadow-primary/20 flex items-center gap-2"
          >
            <i className="fa-solid fa-map-location-dot"></i>
            <span>Ir al Mapa de Precios</span>
          </a>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
        
        {/* HERO SECTION INSTITUCIONAL */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
            <i className="fa-solid fa-certificate text-[11px]"></i>
            Metodología Oficial e Independencia
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Tu copiloto imparcial para ahorrar en cada repostaje en España
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            WayGass nació con una misión innegociable: <strong>democratizar el acceso a los datos de precios de combustibles en tiempo real</strong>. Sin acuerdos comerciales con distribuidoras, sin gasolineras patrocinadas y basándonos exclusivamente en datos auditados del Gobierno de España.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-check text-emerald-500"></i> Datos oficiales de MITECO</span>
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-check text-emerald-500"></i> Actualización cada 30 min</span>
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-check text-emerald-500"></i> 100% Gratuito y Libre</span>
          </div>
        </section>

        {/* MÉTRICAS CLAVE / TARJETAS FROSTED GLASS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm text-center space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-primary font-mono">+11.500</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Gasolineras activas</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Península, Baleares y Canarias</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm text-center space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-primary font-mono">52 / 52</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Provincias cubiertas</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">17 Comunidades Autónomas</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm text-center space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-primary font-mono">30 min</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Ciclo de refresco</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sincronización telemática MITECO</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm text-center space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-primary font-mono">0 €</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Comisiones o sesgos</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Neutralidad absoluta garantizada</p>
          </div>
        </section>

        {/* METODOLOGÍA Y TRANSPARENCIA DE DATOS (GEO / AI OVERVIEWS) */}
        <section className="space-y-8">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm">
                <i className="fa-solid fa-database"></i>
              </span>
              Metodología de Datos y Marco Legal
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Cómo procesamos, auditamos y publicamos los precios que ves en pantalla.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-base">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Obligación Legal MITECO</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Según la <strong>Orden ITC/2308/2007</strong> del Ministerio de Industria, Turismo y Comercio (actual MITECO), las estaciones de servicio tienen la obligación legal de comunicar de inmediato cualquier cambio de precios. WayGass ingiere este feed oficial directamente.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-base">
                <i className="fa-solid fa-filter-circle-dollar"></i>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Auditoría y Outliers</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nuestros algoritmos depuran anomalías: se descartan precios a cero, valores desfasados de estaciones cerradas o errores tipográficos en el origen para que el precio mostrado coincida con la realidad en el surtidor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-base">
                <i className="fa-solid fa-route"></i>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Distancia y Ahorro Real</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculamos la distancia geodésica mediante la fórmula de Haversine y geocodificación normalizada del INE. El ahorro se computa sobre la capacidad del tanque de tu coche para evaluar si el desvío en kilómetros compensa el descuento.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN PREGUNTAS FRECUENTES (FAQ) */}
        <section className="space-y-8" id="faq">
          <div className="border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                <i className="fa-solid fa-circle-question"></i>
                Respuestas Verificadas
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Preguntas Frecuentes sobre Combustibles y WayGass
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Resolvemos las dudas más habituales sobre tarifas, calidad del combustible low-cost, aditivos y funcionamiento del servicio.
              </p>
            </div>

            {/* Buscador de preguntas */}
            <div className="relative w-full md:w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en preguntas..." 
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* Filtro por categorías de FAQ */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFaqCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Acordeón de preguntas */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500">
                <i className="fa-solid fa-search text-2xl mb-2 text-slate-400"></i>
                <p className="text-sm font-semibold">No se encontraron preguntas que coincidan con tu búsqueda.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFaqCategory('Todas'); }}
                  className="mt-3 text-xs text-primary font-bold hover:underline"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className={`rounded-2xl transition-all border ${
                      isOpen 
                        ? 'bg-white dark:bg-white/10 border-primary/30 shadow-md shadow-primary/5' 
                        : 'bg-white/70 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-xs font-mono font-bold shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                            {faq.category}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'bg-primary/10 text-primary rotate-180' : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                      }`}>
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 pl-13 sm:pl-14 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 mt-2 pt-4">
                        <p>{faq.answerText}</p>
                        {faq.highlight && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border-l-4 border-primary text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <i className="fa-solid fa-lightbulb text-primary text-xs shrink-0"></i>
                            <span>{faq.highlight}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* CTA FINAL HACIA EL MAPA */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              ¿Listo para empezar a ahorrar en tu próximo depósito?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Comprueba ahora mismo en nuestro mapa interactivo las estaciones más económicas a tu alrededor o en tu ruta de viaje.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a 
                href="/" 
                className="px-6 py-3.5 bg-white text-slate-900 font-extrabold rounded-2xl text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-map-location-dot text-primary"></i>
                <span>Ver Mapa en Tiempo Real</span>
              </a>
              <a 
                href="/gasolineras" 
                className="px-6 py-3.5 bg-black/20 hover:bg-black/30 text-white font-bold rounded-2xl text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-list-ul"></i>
                <span>Ranking por Provincias</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-white/10 text-center text-sm text-slate-500 mt-20 bg-white dark:bg-[#0a0d14]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs">
              <i className="fa-solid fa-gas-pump"></i>
            </div>
            <span className="font-black text-slate-800 dark:text-white">WayGass</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Plataforma independiente especializada en monitorización de precios de carburantes en España con datos oficiales del Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs font-semibold">
            <a href="/" className="hover:text-primary transition-colors">Mapa en Vivo</a>
            <a href="/gasolineras" className="hover:text-primary transition-colors">Gasolineras por Provincia</a>
            <a href="/blog" className="hover:text-primary transition-colors">Blog y Noticias</a>
            <a href="/sobre-nosotros" className="text-primary hover:text-primary-dark transition-colors font-bold">Sobre Nosotros & FAQ</a>
            <a href="/legal" className="hover:text-primary transition-colors">Aviso Legal</a>
            <a href="/privacidad" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
          </div>
          <p className="text-[11px] text-slate-400 pt-4">&copy; {new Date().getFullYear()} WayGass. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
