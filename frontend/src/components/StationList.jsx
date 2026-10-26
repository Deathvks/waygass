import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StationList({ stations, totalStations, minPrice, avgPrice, tankSize, radius, getGpsUrl, activeFuelLabel, favoriteIds = [], onToggleFavorite, selectedStationId, onSelectStation, lastUpdate , refuelAmount = 20}) {
 const cardRefs = useRef({});
 const loadMoreRef = useRef(null);

 const [expandedId, setExpandedId] = useState(null);
 const [historyData, setHistoryData] = useState([]);
 const [loadingHistory, setLoadingHistory] = useState(false);
 const [visibleCount, setVisibleCount] = useState(10);

 
 
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
 const token = (localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token'));
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
 if (selectedStationId) {
   const index = stations.findIndex(s => s.id === selectedStationId);
   if (index !== -1 && index >= visibleCount) {
     setVisibleCount(index + 10);
   }
   
   setTimeout(() => {
     if (cardRefs.current[selectedStationId]) {
       cardRefs.current[selectedStationId].scrollIntoView({ behavior: 'smooth', block: 'center' });
     }
   }, 150);
 } else if (!selectedStationId) {
   const container = document.querySelector('.no-scrollbar');
   if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
 }
 }, [selectedStationId, stations, visibleCount]);

 const handleDeselect = () => {
 if (onSelectStation) onSelectStation(null);
 };

 const handleValidate = async (stationId, type) => {
 try {
 const token = (localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token'));
 
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
 const capacity = tankSize || 50;
 const costOfFuel = capacity * s.price;
 const costPerKm = (0.07 * s.price) + 0.15;
 const travelCost = (s.distance * 2) * costPerKm;
 
 const trueCost = costOfFuel + travelCost;
 
 return { id: s.id, score: trueCost };
 });

 scored.sort((a, b) => a.score - b.score);
 // Devolvemos el ID de la gasolinera con el menor gasto total
 return [scored[0].id];
 }, [stations]);

 const sortedStations = React.useMemo(() => {
    if (!stations || stations.length === 0) return [];
    const recommended = stations.filter(s => recommendedIds.includes(s.id));
    const others = stations.filter(s => !recommendedIds.includes(s.id));
    return [...recommended, ...others];
 }, [stations, recommendedIds]);

 const CustomTooltip = ({ active, payload, label }) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-medium">
 <p>{label}</p>
 <p className="text-amber-300">{payload[0].value.toFixed(3)} €/L</p>
 </div>
 );
 }
 return null;
 };

 if (!stations || stations.length === 0) {
 return (
 <div className="mt-8 lg:mt-16 mb-auto flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400">
 <i className="fa-solid fa-gas-pump text-5xl text-slate-300 dark:text-slate-700 mb-4"></i>
 <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">No hay estaciones</h3>
 <p>Prueba a ampliar el radio de búsqueda o cambiar los filtros.</p>
 </div>
 );
 }

  return (
    <div className="flex flex-col gap-2.5 pb-4">
 <div className="flex items-center justify-between px-2 -mb-1">
 {lastUpdate ? (
 <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
 <i className="fa-regular fa-clock text-xs"></i>
 Actualizado: {lastUpdate}
 </div>
 ) : <div></div>}
 
 {totalStations !== undefined && totalStations > 0 && (
 <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold bg-transparent border border-slate-200 dark:bg-transparent dark:border-white/10 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 ">
 {stations.length < totalStations ? `Mostrando ${stations.length} de ` : ''}{totalStations} gasolineras
 </div>
 )}
 </div>
 {sortedStations.slice(0, visibleCount).map(s => {
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

 const stationLiters = refuelAmount / s.price;
  const avgLiters = avgPrice ? (refuelAmount / avgPrice) : 0;
  const diffLiters = avgLiters > 0 ? (stationLiters - avgLiters) : 0;

 return (
 <div 
 key={s.id} 
 ref={el => cardRefs.current[s.id] = el}
 onClick={() => onSelectStation && onSelectStation(s.id)}
 className={`native-card relative flex flex-col transition-all overflow-hidden cursor-pointer ${
 isSelected 
 ? 'border-2 !border-primary bg-transparent text-primary ' 
 : isRecommended
 ? 'border-2 !border-primary/40 dark:!border-primary/30 bg-primary/5 dark:bg-primary/5 ring-4 ring-primary/5 dark:ring-primary/5 hover:'
 : 'hover:'
 }`}
 >
 {isRecommended && !isSelected && (
 <div className="absolute top-0 right-0 bg-gradient-to-r from-secondary to-primary text-white text-[9px] sm:text-[10px] font-medium px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1.5">
 <i className="fa-solid fa-star text-[10px] text-amber-300"></i>
 <span className="flex gap-1 items-baseline">
 RECOMENDADA <span className="text-[7px] sm:text-[8px] font-medium opacity-90 normal-case">por precio y cercanía</span>
 </span>
 </div>
 )}
 {/* Barra de seleccionado con X */}
 {isSelected && (
 <div className="flex items-center justify-between px-4 pt-2.5 pb-0">
 <span className="text-[10px] font-medium text-primary uppercase tracking-widest">Seleccionada</span>
 <button 
 onClick={(e) => { e.stopPropagation(); handleDeselect(); }}
 className="w-5 h-5 flex items-center justify-center bg-slate-200 text-slate-500 rounded-lg hover:bg-slate-300 transition"
 >
 <i className="fa-solid fa-xmark text-xs"></i>
 </button>
 </div>
 )}
 {/* Cabecera de la Tarjeta */}
 <div className={`p-4 flex flex-col gap-3 ${isRecommended && !isSelected ? 'pt-8' : ''}`}>
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-1.5">
 <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm leading-tight truncate">{s.brand}</h3>
 <button 
 onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(s.id); }}
 className="shrink-0 p-1 rounded-lg transition-transform active:scale-75 cursor-pointer relative z-10 touch-manipulation"
 >
 <i className={`text-sm transition-colors ${isFav ? 'fa-solid fa-heart text-rose-500' : 'fa-regular fa-heart text-slate-300 dark:text-slate-600 hover:text-rose-400'}`}></i>
 </button>
 </div>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.address}, {s.town}</p>
 </div>

 <div className="text-right shrink-0 min-w-0">
 <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium border ${badgeClass} whitespace-nowrap`}>
 {s.price.toFixed(3)} €/L
 </span>
 <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap truncate">{activeFuelLabel}</p>
 <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium whitespace-nowrap">{s.distance.toFixed(1)} km</p>
 </div>
 </div>

 <div className="bg-transparent border border-slate-200/80 dark:bg-transparent dark:border-white/10 rounded-lg px-2.5 py-1.5 flex flex-col gap-0.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-[11px]">Con {refuelAmount}€ repostas:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{stationLiters.toFixed(2)} L</span>
          </div>
          {diffLiters > 0 && (
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">vs media zona:</span>
              <span className="font-bold text-[10px] text-emerald-600 dark:text-emerald-400">+{diffLiters.toFixed(2)} L</span>
            </div>
          )}
          {diffLiters < 0 && (
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-[10px] text-rose-600 dark:text-rose-400">vs media zona:</span>
              <span className="font-bold text-[10px] text-rose-600 dark:text-rose-400">{diffLiters.toFixed(2)} L</span>
            </div>
          )}
        </div>

 {/* Botón de Histórico Prominente */}
 <button 
 onClick={(e) => { e.stopPropagation(); toggleExpand(s, activeFuelLabel.toLowerCase().includes('diésel') ? 'diesel' : '95'); }}
 className={`w-full flex items-center justify-center gap-2 py-2 mt-1 transition-colors rounded-lg text-xs font-medium ${
 isExpanded ? 'bg-transparent text-primary dark:bg-transparent text-primary text-primary-dark dark:text-primary' : 'bg-transparent dark:bg-transparent dark:border-white/10 hover:bg-transparent border border-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
 }`}
 >
 <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
 {isExpanded ? 'Ocultar Histórico' : 'Ver Histórico de Precios (30d)'}
 </button>

 <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
 <div className={`flex items-start sm:items-center gap-1.5 text-[11px] font-medium px-2 py-1.5 rounded-md mr-3 ${
 s.isOpen ? 'bg-emerald-50 dark:bg-emerald-500/10 backdrop-blur-md text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 backdrop-blur-md text-red-600 dark:text-red-400'
 }`}>
 <i className={`fa-regular fa-clock text-xs shrink-0 mt-[1px] ${s.isOpen ? 'text-emerald-500' : 'text-red-500'}`}></i>
 <span className="leading-relaxed">
    <span className={s.isOpen ? 'font-bold' : 'font-bold'}>
      {s.isOpen ? 'Abierto' : 'Cerrado'}
    </span> &bull; {s.schedule}
  </span>
 </div>
 <div className="flex items-center gap-1.5 shrink-0">
   <a 
     href={"https://api.whatsapp.com/send?text=" + encodeURIComponent("¡Mira esta gasolinera barata en WayGass! " + s.brand + " a " + s.priceFormatted + " €/L en " + s.address + " (" + s.city + "). Consulta más en https://waygass.es")}
     target="_blank" 
     rel="noopener noreferrer" 
     className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:bg-emerald-500/20 dark:hover:bg-emerald-500 dark:text-emerald-400 dark:hover:text-white px-2.5 py-1.5 rounded-lg transition text-[11px] flex items-center gap-1 font-medium cursor-pointer"
     title="Compartir por WhatsApp"
   >
     <i className="fa-brands fa-whatsapp text-xs"></i>
     <span className="hidden sm:inline">Compartir</span>
   </a>
   <a 
     href={getGpsUrl(s.lat, s.lng)} 
     target="_blank" 
     rel="noopener noreferrer" 
     className="bg-[#001F3F] dark:bg-white text-white dark:text-[#001F3F] font-medium px-4 py-1.5 rounded-lg transition text-[11px] flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-200"
   >
     <span>Ir al GPS</span>
     <i className="fa-solid fa-location-arrow text-[10px]"></i>
   </a>
 </div>
 </div>
 </div>

 {/* Zona Expandida: Gráfica de Histórico */}
 {isExpanded && (
 <div className="bg-transparent dark:bg-transparent dark:border-white/10 border-t border-slate-100 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 fade-in duration-200">
 <div className="flex items-center justify-between mb-3">
 <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Histórico de Precios</span>
 <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">Últimos 30 días</span>
 </div>
 
 <div className="h-32 w-full">
 {loadingHistory ? (
 <div className="w-full h-full flex items-center justify-center">
 <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-lg animate-spin"></div>
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
 <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-white/10 bg-transparent rounded-b-xl">
 <div className="flex items-center justify-between mb-2">
 <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Comunidad Waygass</span>
 {globalValidations[s.id]?.PRICE_CORRECT > 0 && (
 <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
 {globalValidations[s.id].PRICE_CORRECT} {globalValidations[s.id].PRICE_CORRECT === 1 ? 'persona' : 'personas'} dicen que el precio es correcto
 </span>
 )}
 </div>
 <div className="flex gap-1.5 sm:gap-2">
 <button 
 onClick={(e) => { e.stopPropagation(); handleValidate(s.id, 'PRICE_CORRECT'); }}
 className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
 userVotes[s.id] === 'PRICE_CORRECT'
 ? 'bg-emerald-500/10 backdrop-blur-md text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 ' 
 : 'bg-slate-50/50 dark:bg-white/5 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-emerald-500/10 backdrop-blur-md hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 '
 }`}
 title={userVotes[s.id] === 'PRICE_CORRECT' ? "Cancelar validación" : "El precio es correcto"}
 >
 <i className="fa-solid fa-thumbs-up text-xs"></i>
 <span className="hidden sm:inline">Correcto</span>
 </button>

 <button 
 onClick={(e) => { e.stopPropagation(); handleValidate(s.id, 'WRONG_PRICE'); }}
 className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
 userVotes[s.id] === 'WRONG_PRICE'
 ? 'bg-primary/10 backdrop-blur-md text-primary border-primary/30 text-primary border border-amber-500/30 ' 
 : 'bg-slate-50/50 dark:bg-white/5 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-primary/10 backdrop-blur-md text-primary border-primary/30 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/30 '
 }`}
 title={userVotes[s.id] === 'WRONG_PRICE' ? "Cancelar reporte" : "El precio está mal"}
 >
 <i className="fa-solid fa-triangle-exclamation text-xs"></i>
 <span className="hidden sm:inline">Mal precio</span>
 </button>
 
 <button 
 onClick={(e) => { e.stopPropagation(); handleValidate(s.id, 'CLOSED'); }}
 className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
 userVotes[s.id] === 'CLOSED'
 ? 'bg-rose-500/10 backdrop-blur-md text-rose-700 dark:text-rose-400 border border-rose-500/30 ' 
 : 'bg-slate-50/50 dark:bg-white/5 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-rose-500/10 backdrop-blur-md hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30 '
 }`}
 title={userVotes[s.id] === 'CLOSED' ? "Cancelar reporte" : "La gasolinera está cerrada"}
 >
 <i className="fa-solid fa-ban text-xs"></i>
 <span className="hidden sm:inline">Cerrada</span>
 </button>
 </div>
 
 {(globalValidations[s.id]?.CLOSED > 0 || globalValidations[s.id]?.WRONG_PRICE > 0) && (
 <div className="mt-3 flex flex-col gap-1.5">
 {globalValidations[s.id]?.WRONG_PRICE > 0 && (
 <div className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 bg-amber-50 dark:bg-primary/10 backdrop-blur-md text-primary border-primary/30 px-2.5 py-1.5 rounded-lg border border-amber-100 dark:border-amber-500/20">
 <i className="fa-solid fa-triangle-exclamation text-xs shrink-0"></i>
 {globalValidations[s.id].WRONG_PRICE} usuario(s) indican que el precio no es correcto.
 </div>
 )}
 {globalValidations[s.id]?.CLOSED > 0 && (
 <div className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5 bg-rose-50 dark:bg-rose-500/10 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-rose-100 dark:border-rose-500/20">
 <i className="fa-solid fa-ban text-xs shrink-0"></i>
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
 <button 
 onClick={(e) => { e.stopPropagation(); setVisibleCount(v => v + 10); }}
 className="w-full py-3 bg-slate-50/50 dark:bg-white/5 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold rounded-lg mt-2 hover:bg-transparent dark:hover:bg-slate-700 transition-colors"
 >
 Mostrar más gasolineras
 </button>
 )}
 </div>
 );
}


