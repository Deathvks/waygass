import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StationList({ stations, totalStations, minPrice, avgPrice, tankSize, radius, getGpsUrl, activeFuelLabel, favoriteIds = [], onToggleFavorite, selectedStationId, onSelectStation, lastUpdate }) {
  const cardRefs = useRef({});
  const loadMoreRef = useRef(null);

  const [expandedId, setExpandedId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < stations.length) {
        setVisibleCount(v => v + 25);
      }
    }, { rootMargin: '400px' });
    
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [visibleCount, stations.length]);
  
  // Validaciones Globales
  const [globalValidations, setGlobalValidations] = useState({});
  const [userVotes, setUserVotes] = useState({});

  // Cargar validaciones de todas las estaciones al montar
  useEffect(() => {
    const fetchValidations = async () => {
      try {
        const res = await axios.get(`/api/validations/all`);
        setGlobalValidations(res.data);
      } catch (e) {
        console.error("Error cargando validaciones globales", e);
      }
    };
    
    const fetchMyVotes = async () => {
      try {
        const token = localStorage.getItem('waygas_token');
        const res = await axios.get(`/api/validations/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const myVotesMap = {};
        res.data.forEach(v => {
           myVotesMap[v.stationId] = v.type;
        });
        setUserVotes(myVotesMap);
      } catch (e) {
        console.error("Error cargando mis votos", e);
      }
    };

    fetchValidations();
    fetchMyVotes();
  }, [stations]); // Recargar si cambian las estaciones

  const toggleExpand = async (station, fuelType) => {
    if (expandedId === station.id) {
      setExpandedId(null);
      return;
    }
    
    setExpandedId(station.id);
    setLoadingHistory(true);
    
    try {
      const res = await axios.get(`/api/history/${station.id}`);
      
      const mappedData = res.data.map(d => {
        const dateObj = new Date(d.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('es-ES', { month: 'short' });
        
        return {
          name: `${day} ${month}`,
          precio: fuelType === 'diesel' ? d.priceDiesel : d.price95
        };
      }).filter(d => d.precio != null);

      setHistoryData(mappedData.reverse());
    } catch (error) {
      console.error("Error cargando histórico", error);
      setHistoryData([]);
    }
    setLoadingHistory(false);
  };

  useEffect(() => {
    if (selectedStationId && cardRefs.current[selectedStationId]) {
      cardRefs.current[selectedStationId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!selectedStationId) {
      const container = document.querySelector('.no-scrollbar');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedStationId]);

  const handleDeselect = () => {
    if (onSelectStation) onSelectStation(null);
  };

  const handleValidate = async (stationId, type) => {
    try {
      const token = localStorage.getItem('waygas_token');
      
      const currentVote = userVotes[stationId];
      const isCancelling = currentVote === type;
      const targetType = isCancelling ? 'CANCEL' : type;

      await axios.post(`/api/stations/${stationId}/validate`, { type: targetType }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      // Actualizar estado local para reflejar el voto inmediatamente
      setGlobalValidations(prev => {
        const stationVals = prev[stationId] || { PRICE_CORRECT: 0, WRONG_PRICE: 0, CLOSED: 0 };
        const updatedVals = { ...stationVals };
        
        if (currentVote && currentVote !== 'CANCEL') {
           updatedVals[currentVote] = Math.max(0, (updatedVals[currentVote] || 0) - 1);
        }
        
        if (!isCancelling) {
           updatedVals[type] = (updatedVals[type] || 0) + 1;
        }

        return { ...prev, [stationId]: updatedVals };
      });
      
      setUserVotes(prev => {
        const newVotes = { ...prev };
        if (isCancelling) {
           delete newVotes[stationId];
        } else {
           newVotes[stationId] = type;
        }
        return newVotes;
      });
      
    } catch (error) {
      console.error("Error enviando validación", error);
    }
  };

  // Calcular la gasolinera recomendada (balance real entre precio y distancia)
  const recommendedIds = useMemo(() => {
    if (stations.length === 0) return [];
    
    // Filtrar aquellas con precio y distancia válidos
    const validStations = stations.filter(s => s.price > 0 && typeof s.distance === 'number');
    if (validStations.length === 0) return [];
    
    const scored = validStations.map(s => {
      // Cálculo del coste real absoluto para determinar si compensa ir más lejos:
      // - Asumimos un repostaje medio de 50 Litros.
      // - Asumimos un consumo de 7 L / 100 km (0.07 L / km).
      // - El coste de desplazamiento es de ida y vuelta (distancia * 2).
      const costOfFuel = 50 * s.price;
      const travelCost = (s.distance * 2) * 0.07 * s.price;
      
      // La puntuación es el gasto total estimado en euros (cuanto más bajo, mejor)
      const trueCost = costOfFuel + travelCost;
      
      return { id: s.id, score: trueCost };
    });

    scored.sort((a, b) => a.score - b.score);
    // Devolvemos el ID de la gasolinera con el menor gasto total
    return [scored[0].id];
  }, [stations]);

  if (stations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400">
        <svg className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No hay estaciones</h3>
        <p>Prueba a ampliar el radio de búsqueda o cambiar los filtros.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg shadow-xl font-bold">
          <p>{label}</p>
          <p className="text-amber-300">{payload[0].value.toFixed(3)} €/L</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-2.5 pb-4">
      <div className="flex items-center justify-between px-2 -mb-1">
        {lastUpdate ? (
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Actualizado: {lastUpdate}
          </div>
        ) : <div></div>}
        
        {totalStations !== undefined && totalStations > 0 && (
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            {stations.length < totalStations ? `Mostrando ${stations.length} de ` : ''}{totalStations} gasolineras
          </div>
        )}
      </div>
      {stations.slice(0, visibleCount).map(s => {
        const diff = s.price - minPrice;
        const category = diff <= 0.03 ? 'cheap' : diff > 0.08 ? 'expensive' : 'avg';
        
        const isRecommended = recommendedIds.includes(s.id);
        const isExpanded = expandedId === s.id;
        const isFav = favoriteIds.includes(s.id);
        const isSelected = s.id === selectedStationId;

        let badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
        let strokeColor = '#f59e0b'; // amber
        
        if (category === 'cheap') {
          badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          strokeColor = '#10b981'; // emerald
        } else if (category === 'expensive') {
          badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
          strokeColor = '#f43f5e'; // rose
        }

        const stationSavings = (avgPrice - s.price) * tankSize;

        return (
          <div 
            key={s.id} 
            ref={el => cardRefs.current[s.id] = el}
            onClick={() => onSelectStation && onSelectStation(s.id)}
            className={`native-card relative flex flex-col transition-all overflow-hidden cursor-pointer ${
              isSelected 
                ? 'border-2 !border-orange-400 bg-orange-50/40 shadow-lg shadow-orange-100' 
                : isRecommended
                  ? 'border-2 !border-amber-300 dark:!border-amber-500/50 bg-amber-50/20 dark:bg-amber-500/5 ring-4 ring-amber-50 dark:ring-amber-500/10 hover:shadow-md'
                  : 'hover:shadow-md'
            }`}
          >
            {isRecommended && !isSelected && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="flex gap-1 items-baseline">
                  RECOMENDADA <span className="text-[7px] sm:text-[8px] font-medium opacity-90 normal-case">por precio y cercanía</span>
                </span>
              </div>
            )}
            {/* Barra de seleccionado con X */}
            {isSelected && (
              <div className="flex items-center justify-between px-4 pt-2.5 pb-0">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Seleccionada</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeselect(); }}
                  className="w-5 h-5 flex items-center justify-center bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300 transition"
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            )}
            {/* Cabecera de la Tarjeta */}
            <div className={`p-4 flex flex-col gap-3 ${isRecommended && !isSelected ? 'pt-8' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight truncate">{s.brand}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(s.id); }}
                      className="shrink-0 p-1 rounded-full transition-transform active:scale-75"
                    >
                      <svg className={`w-4 h-4 transition-colors ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500'}`} fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.address}, {s.town}</p>
                </div>

                <div className="text-right shrink-0 min-w-0">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass} whitespace-nowrap`}>
                    {s.price.toFixed(3)} €/L
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap truncate">{activeFuelLabel}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium whitespace-nowrap">{s.distance.toFixed(1)} km</p>
                </div>
              </div>

              {stationSavings > 0 && (
                <div className="bg-slate-100/80 dark:bg-slate-800 rounded-xl px-2.5 py-1 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-[11px]">Ahorro vs. media de la zona:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">+{stationSavings.toFixed(2)} €</span>
                </div>
              )}

              {/* Botón de Histórico Prominente */}
              <button 
                onClick={() => toggleExpand(s, activeFuelLabel.toLowerCase().includes('diésel') ? 'diesel' : '95')}
                className={`w-full flex items-center justify-center gap-2 py-2 mt-1 transition-colors rounded-xl text-xs font-bold ${
                  isExpanded ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                {isExpanded ? 'Ocultar Histórico' : 'Ver Histórico de Precios (30d)'}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md ${
                  s.isOpen ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <svg className={`w-3.5 h-3.5 ${s.isOpen ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{s.schedule}</span>
                </div>
                <a 
                  href={getGpsUrl(s.lat, s.lng)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#001F3F] dark:bg-white text-white dark:text-[#001F3F] font-bold px-4 py-1.5 rounded-full transition text-[11px] flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-sm"
                >
                  <span>Ir al GPS</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </div>

            {/* Zona Expandida: Gráfica de Histórico */}
            {isExpanded && (
              <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Histórico de Precios</span>
                  <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">Últimos 30 días</span>
                </div>
                
                <div className="h-32 w-full">
                  {loadingHistory ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : historyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 9, fill: '#94a3b8'}} 
                          minTickGap={15}
                        />
                        <YAxis 
                          domain={['auto', 'auto']} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 9, fill: '#94a3b8'}}
                          tickFormatter={(val) => val.toFixed(2)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="precio" 
                          stroke={strokeColor} 
                          strokeWidth={3} 
                          dot={false}
                          activeDot={{ r: 4, strokeWidth: 0, fill: strokeColor }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      No hay datos históricos disponibles.
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Botones de Validación (Comunidad) - Siempre visibles */}
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f172a] rounded-b-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Comunidad Waygass</span>
                {globalValidations[s.id]?.PRICE_CORRECT > 0 && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {globalValidations[s.id].PRICE_CORRECT} {globalValidations[s.id].PRICE_CORRECT === 1 ? 'persona' : 'personas'} dicen que el precio es correcto
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                <button 
                  onClick={() => handleValidate(s.id, 'PRICE_CORRECT')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    userVotes[s.id] === 'PRICE_CORRECT'
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 shadow-sm' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30 shadow-sm'
                  }`}
                  title={userVotes[s.id] === 'PRICE_CORRECT' ? "Cancelar validación" : "El precio es correcto"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                  <span className="hidden sm:inline">Correcto</span>
                </button>

                <button 
                  onClick={() => handleValidate(s.id, 'WRONG_PRICE')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    userVotes[s.id] === 'WRONG_PRICE'
                      ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40 shadow-sm' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-500/30 shadow-sm'
                  }`}
                  title={userVotes[s.id] === 'WRONG_PRICE' ? "Cancelar reporte" : "El precio está mal"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span className="hidden sm:inline">Mal precio</span>
                </button>
                
                <button 
                  onClick={() => handleValidate(s.id, 'CLOSED')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    userVotes[s.id] === 'CLOSED'
                      ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40 shadow-sm' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30 shadow-sm'
                  }`}
                  title={userVotes[s.id] === 'CLOSED' ? "Cancelar reporte" : "La gasolinera está cerrada"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  <span className="hidden sm:inline">Cerrada</span>
                </button>
              </div>
              
              {(globalValidations[s.id]?.CLOSED > 0 || globalValidations[s.id]?.WRONG_PRICE > 0) && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {globalValidations[s.id]?.WRONG_PRICE > 0 && (
                    <div className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-100 dark:border-amber-500/20">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {globalValidations[s.id].WRONG_PRICE} usuario(s) indican que el precio no es correcto.
                    </div>
                  )}
                  {globalValidations[s.id]?.CLOSED > 0 && (
                    <div className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-100 dark:border-rose-500/20">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                      {globalValidations[s.id].CLOSED} usuario(s) indican que está cerrada.
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>
        );
      })}
      
      {visibleCount < stations.length && (
        <div ref={loadMoreRef} className="h-10 w-full flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
