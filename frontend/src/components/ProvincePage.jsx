import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import SEOHead from './SEOHead.jsx';
import { getProvinceBySlug, PROVINCES_DATA } from '../data/provincesData.js';

const FUELS = [
  { id: 'g95', label: 'Gasolina 95', key: 'Precio Gasolina 95 E5', icon: 'fa-solid fa-gas-pump' },
  { id: 'diesel', label: 'Diésel A', key: 'Precio Gasoleo A', icon: 'fa-solid fa-truck-droplet' },
  { id: 'g98', label: 'Gasolina 98', key: 'Precio Gasolina 98 E5', icon: 'fa-solid fa-gauge-high' },
  { id: 'glp', label: 'GLP', key: 'Precio Gases licuados del petróleo', icon: 'fa-solid fa-fire-flame-simple' }
];

export default function ProvincePage({ slug }) {
  const province = useMemo(() => getProvinceBySlug(slug), [slug]);
  const [fuelType, setFuelType] = useState('g95');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (!province) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    axios.get(`/api/gas/FiltroProvincia/${province.id}`)
      .then(res => {
        if (!isMounted) return;
        const list = res.data?.ListaEESSPrecio || [];
        setStations(list);
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error('Error cargando gasolineras de la provincia:', err);
        setError('No se han podido cargar los precios en tiempo real. Por favor, reintenta en unos instantes.');
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [province]);

  const activeFuel = useMemo(() => FUELS.find(f => f.id === fuelType) || FUELS[0], [fuelType]);

  // Procesar precios para el combustible seleccionado
  const processedData = useMemo(() => {
    if (!stations || stations.length === 0) {
      return { topStations: [], minPrice: null, avgPrice: null, maxPrice: null, savings: null };
    }

    const valid = stations
      .map(s => {
        const rawPrice = s[activeFuel.key];
        if (!rawPrice) return null;
        const priceNum = parseFloat(rawPrice.replace(',', '.'));
        if (isNaN(priceNum) || priceNum <= 0) return null;

        const lat = parseFloat(s.Latitud?.replace(',', '.'));
        const lng = parseFloat(s['Longitud (WGS84)']?.replace(',', '.'));

        return {
          id: s.IDEESS,
          brand: s['Rótulo'] || 'Gasolinera',
          address: s['Dirección'] || '',
          city: s.Municipio || province?.name || '',
          postalCode: s['C.P.'] || '',
          schedule: s.Horario || 'Consultar horario',
          price: priceNum,
          priceFormatted: rawPrice,
          lat,
          lng
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.price - b.price);

    if (valid.length === 0) {
      return { topStations: [], minPrice: null, avgPrice: null, maxPrice: null, savings: null };
    }

    const minPrice = valid[0].price;
    const maxPrice = valid[valid.length - 1].price;
    const avgPrice = valid.reduce((acc, s) => acc + s.price, 0) / valid.length;
    const savings = ((maxPrice - minPrice) * 50).toFixed(2);

    return {
      topStations: valid.slice(0, 15),
      minPrice: minPrice.toFixed(3),
      avgPrice: avgPrice.toFixed(3),
      maxPrice: maxPrice.toFixed(3),
      savings,
      totalCount: valid.length
    };
  }, [stations, activeFuel, province]);

  if (!province) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black mb-3">Provincia no encontrada</h1>
        <p className="text-slate-500 mb-6">No hemos encontrado la provincia solicitada en nuestro directorio.</p>
        <a href="/gasolineras" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform">
          Ver todas las provincias
        </a>
      </div>
    );
  }

  const pageTitle = `Gasolineras Más Baratas en ${province.name} Hoy - Precios Diésel y Gasolina 95 | WayGass`;
  const pageDescription = `Compara y encuentra las gasolineras más baratas de ${province.name} en tiempo real. Precios actualizados hoy de Gasolina 95, Diésel y GLP con datos oficiales de MITECO. Ahorra hasta 15€ por depósito.`;
  const canonicalUrl = `https://waygass.es/gasolineras/${province.slug}`;

  const nearbyProvinces = (province.nearbySlugs || [])
    .map(slug => getProvinceBySlug(slug))
    .filter(Boolean);

  const faqs = [
    {
      q: `¿Cuál es la gasolinera más barata hoy en ${province.name}?`,
      a: processedData.topStations.length > 0 
        ? `Actualmente, la estación más económica para ${activeFuel.label} en ${province.name} es ${processedData.topStations[0].brand} en ${processedData.topStations[0].city} (${processedData.topStations[0].address}) con un precio de ${processedData.topStations[0].priceFormatted} €/L.`
        : `Los precios se actualizan continuamente según los datos oficiales del Ministerio para la Transición Ecológica (MITECO). Puedes consultar el ranking en directo en esta página.`
    },
    {
      q: `¿Cuánto cuesta de media la gasolina y el diésel en ${province.name}?`,
      a: processedData.avgPrice 
        ? `El precio medio registrado hoy para ${activeFuel.label} en toda la provincia de ${province.name} es de aproximadamente ${processedData.avgPrice} €/L.`
        : `El precio medio varía a diario. WayGass calcula la media de todas las estaciones de ${province.name} para que sepas si estás pagando de más.`
    },
    {
      q: `¿Cuánto dinero puedo ahorrar repostando en una estación barata de ${province.name}?`,
      a: processedData.savings && parseFloat(processedData.savings) > 0
        ? `La diferencia entre la estación más barata y la más cara de ${province.name} permite un ahorro de hasta ${processedData.savings} € en un depósito estándar de 50 litros.`
        : `Repostar en gasolineras de bajo coste o independientes en ${province.name} suele suponer un ahorro de entre 10€ y 18€ por repostaje completo.`
    },
    {
      q: `¿A qué hora se actualizan los precios de las gasolineras en ${province.name}?`,
      a: `Las estaciones de servicio están obligadas por ley a notificar sus modificaciones de tarifa al Geoportal del Ministerio (MITECO). WayGass sincroniza estos datos continuamente para ofrecerte los precios en tiempo real.`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Gasolineras más baratas en ${province.name}`,
    "itemListElement": processedData.topStations.slice(0, 10).map((st, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": `${st.brand} - ${st.city}`,
      "description": `Precio ${activeFuel.label}: ${st.priceFormatted} €/L. Dirección: ${st.address}`
    }))
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white font-sans selection:bg-primary selection:text-white">
      <SEOHead 
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        breadcrumbs={[
          { name: 'Inicio', url: 'https://waygass.es/' },
          { name: 'Gasolineras', url: 'https://waygass.es/gasolineras' },
          { name: province.name, url: canonicalUrl }
        ]}
        extraSchemas={[faqSchema, itemListSchema]}
      />

      {/* HEADER */}
      <header className="px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-[#f8fafc]/90 dark:bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
            <i className="fa-solid fa-gas-pump text-white text-sm"></i>
          </div>
          <span className="text-xl font-black tracking-tight">Way<span className="text-primary">Gass</span></span>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="/gasolineras" className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            Todas las provincias
          </a>
          <a 
            href={`/?provincia=${province.id}`} 
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl text-xs sm:text-sm transition-transform hover:scale-105 shadow-sm flex items-center gap-1.5"
          >
            <i className="fa-solid fa-map-location-dot text-xs text-primary"></i>
            <span>Ver Mapa</span>
          </a>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <a href="/" className="hover:text-primary transition-colors">Inicio</a>
          <i className="fa-solid fa-chevron-right text-[10px] opacity-60"></i>
          <a href="/gasolineras" className="hover:text-primary transition-colors">Gasolineras</a>
          <i className="fa-solid fa-chevron-right text-[10px] opacity-60"></i>
          <span className="text-slate-900 dark:text-white font-bold">{province.name}</span>
        </nav>

        {/* HERO SECTION */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Precios oficiales en tiempo real (MITECO)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Gasolineras Más Baratas en <span className="text-primary">{province.name}</span> Hoy
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Consulta el ranking actualizado con las estaciones de servicio más económicas de toda la provincia de {province.name} ({province.region}). Compara tarifas y ahorra en cada repostaje.
          </p>
        </div>

        {/* FUEL SELECTOR TABS */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-200/60 dark:bg-white/5 p-1.5 rounded-2xl w-fit">
          {FUELS.map(f => (
            <button
              key={f.id}
              onClick={() => setFuelType(f.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                fuelType === f.id
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className={`${f.icon} text-primary`}></i>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Precio Más Bajo</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {processedData.minPrice ? `${processedData.minPrice} €` : '—'}
            </div>
            <div className="text-xs text-slate-400 mt-1">por litro de {activeFuel.label}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Precio Medio en {province.name}</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {processedData.avgPrice ? `${processedData.avgPrice} €` : '—'}
            </div>
            <div className="text-xs text-slate-400 mt-1">media provincial calculada</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Ahorro por Depósito</div>
            <div className="text-2xl sm:text-3xl font-black text-primary">
              {processedData.savings ? `Hasta ${processedData.savings} €` : '—'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">estimado en depósito de 50L</div>
          </div>
        </div>

        {/* CTA TO INTERACTIVE MAP */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-black flex items-center justify-center md:justify-start gap-2">
              <i className="fa-solid fa-map-location-dot text-primary"></i>
              <span>¿Quieres verlas en el mapa interactivo?</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Explora las {processedData.totalCount || ''} estaciones de {province.name} con filtros por radio, marcas favoritas y rutas personalizadas.
            </p>
          </div>
          <a
            href={`/?provincia=${province.id}`}
            className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-black rounded-xl text-sm transition-transform hover:scale-105 shadow-lg shadow-primary/30 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Abrir Mapa de {province.name}</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </div>

        {/* RANKING LIST / TABLE */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-ranking-star text-amber-500"></i>
              <span>Top 15 Gasolineras Más Económicas</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">{activeFuel.label}</span>
          </div>

          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse"></div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-center font-medium">
              {error}
            </div>
          )}

          {!loading && !error && processedData.topStations.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/5">
              No hay precios reportados para {activeFuel.label} en esta provincia en este momento.
            </div>
          )}

          {!loading && !error && processedData.topStations.length > 0 && (
            <div className="space-y-3">
              {processedData.topStations.map((st, index) => {
                const isTop3 = index < 3;
                const badgeColor = index === 0 
                  ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/30' 
                  : index === 1 
                    ? 'bg-slate-300 dark:bg-slate-400 text-slate-900' 
                    : index === 2 
                      ? 'bg-amber-700 text-white' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500';

                const mapsUrl = (st.lat && st.lng) 
                  ? `https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${st.brand} ${st.address} ${st.city}`)}`;

                return (
                  <article 
                    key={st.id || index}
                    className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isTop3 
                        ? 'border-primary/20 dark:border-primary/30 ring-1 ring-primary/10' 
                        : 'border-slate-200/80 dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black flex items-center justify-center text-sm shrink-0 ${badgeColor}`}>
                        #{index + 1}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                            {st.brand}
                          </h3>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                            {st.city}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-md">
                          <i className="fa-solid fa-location-dot text-[10px] mr-1 text-primary"></i>
                          {st.address} {st.postalCode && `(${st.postalCode})`}
                        </p>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span><i className="fa-regular fa-clock mr-1"></i>{st.schedule}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          {st.priceFormatted} <span className="text-xs font-semibold text-slate-500">€/L</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-medium">MITECO oficial</span>
                      </div>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                        title="Cómo llegar con Google Maps"
                      >
                        <i className="fa-solid fa-diamond-turn-right text-xs"></i>
                        <span className="hidden sm:inline">Cómo llegar</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* SEO CONTENT SECTION */}
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-7 rounded-full bg-primary inline-block"></span>
            <span>Consejos para ahorrar combustible en {province.name}</span>
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              El precio del carburante en la provincia de <strong>{province.name}</strong> oscila significativamente entre estaciones tradicionales de grandes redes y distribuidoras automáticas de bajo coste (como Plenoil, Ballenoil, Petroprix o cooperativas locales). Elegir estratégicamente dónde repostar puede suponer un ahorro de más de <strong>200€ al año</strong> para un conductor medio.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              Municipios destacados para repostar barato en {province.name}
            </h3>
            <p>
              Si te desplazas habitualmente por {province.name}, comprueba los precios en las principales áreas urbanas e industriales de:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(province.popularMunicipalities || []).map((mun, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  📍 {mun}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <i className="fa-solid fa-circle-question text-primary"></i>
            <span>Preguntas Frecuentes sobre el combustible en {province.name}</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <i className={`fa-solid fa-chevron-down text-xs text-primary transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}></i>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/5 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* NEARBY PROVINCES (SEO INTERNAL LINKING) */}
        {nearbyProvinces.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-signs-post text-primary"></i>
              <span>Gasolineras baratas en provincias limítrofes</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {nearbyProvinces.map(np => (
                <a
                  key={np.slug}
                  href={`/gasolineras/${np.slug}`}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {np.name}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Ver precios</span>
                    <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500">
        <p className="font-medium">&copy; {new Date().getFullYear()} WayGass. Precios oficiales de carburantes en {province.name}.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
          <a href="/" className="hover:text-primary transition-colors">Inicio</a>
          <a href="/gasolineras" className="hover:text-primary transition-colors">Todas las Provincias</a>
          <a href="/blog" className="hover:text-primary transition-colors">Blog de Ahorro</a>
          <a href="/legal" className="hover:text-primary transition-colors">Aviso Legal</a>
          <a href="/privacidad" className="hover:text-primary transition-colors">Privacidad</a>
          <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
        </div>
      </footer>
    </div>
  );
}
