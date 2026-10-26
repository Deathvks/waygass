import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-leaflet';
import L from 'leaflet';


function MapLibreLayer({ styleUrl }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !L.maplibreGL) return;
    const layer = L.maplibreGL({
      style: styleUrl,
      maxZoom: 20,
      attribution: '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    layer.addTo(map);
    return () => {
      try {
        map.removeLayer(layer);
      } catch (_) {}
    };
  }, [map, styleUrl]);

  return null;
}

function CustomMapEvents({ onMapMoveEnd, onMapClick, onBoundsChange }) {
 const map = useMap();
 useEffect(() => {
   if (onBoundsChange) onBoundsChange(map.getBounds());
 }, [map, onBoundsChange]);

 useMapEvents({
 moveend: () => {
   if (onBoundsChange) onBoundsChange(map.getBounds());
   onMapMoveEnd(true);
 },
 zoomend: () => {
   if (onBoundsChange) onBoundsChange(map.getBounds());
   onMapMoveEnd(true);
 },
 click: () => { if (onMapClick) onMapClick(); },
 });
 return null;
}


function FlyToUser({ center, trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0 && center) {
      map.flyTo(center, 15, { animate: true, duration: 1 });
    }
  }, [trigger, map]); // Only run when trigger changes
  return null;
}

function MapUpdater({ center, zoom, bounds, activeTab }) {
 const map = useMap();
 useEffect(() => {
 if (bounds && bounds.length > 0) {
 map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
 } else if (center) {
 map.setView(center, zoom);
 }
 }, [center?.[0], center?.[1], zoom, bounds, map]);

 useEffect(() => {
 const container = map.getContainer();
 if (!container) return;
 
 // ResizeObserver detecta cualquier cambio de tamaño (incluyendo display: none a block)
 const resizeObserver = new ResizeObserver(() => {
 map.invalidateSize();
 if (bounds && bounds.length > 0 && activeTab === 'map') {
 map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
 }
 });
 
 resizeObserver.observe(container);
 
 return () => resizeObserver.disconnect();
 }, [map, bounds, activeTab]);

 return null;
}

// Componente que vuela al pin seleccionado desde la lista
function FlyToSelected({ selectedStation, activeTab }) {
 const map = useMap();
 useEffect(() => {
 if (!selectedStation) return;
 if (!selectedStation.lat || !selectedStation.lng) return;
 if (isNaN(selectedStation.lat) || isNaN(selectedStation.lng)) return;

 // Add a slight delay so the DOM has time to update if the tab was just switched
 const timer = setTimeout(() => {
   try {
     map.flyTo([selectedStation.lat, selectedStation.lng], 15, { duration: 0.6 });
   } catch (e) {
     try { map.setView([selectedStation.lat, selectedStation.lng], 15); } catch (_) {}
   }
 }, 150);
 
 return () => clearTimeout(timer);
 }, [selectedStation, map, activeTab]);
 return null;
}

const MemoizedStationMarker = React.memo(({ s, minPrice, isSelected, activeFuelLabel, onSelectStation }) => {
 const diff = s.price - minPrice;
 let colorClass = 'bg-avg';
 if (diff <= 0.03) colorClass = 'bg-cheap';
 else if (diff > 0.08) colorClass = 'bg-expensive';

 const customIcon = L.divIcon({
 className: '',
 html: `<div class="custom-pin ${colorClass}" style="${isSelected ? 'transform: scale(1.3); box-shadow: 0 0 0 3px var(--app-primary, #ff3b30), 0 6px 16px rgba(0,0,0,0.35); z-index: 9999;' : ''}"><span>${s.price.toFixed(3)}€</span></div>`,
 iconSize: isSelected ? [58, 24] : [48, 20],
 iconAnchor: isSelected ? [29, 12] : [24, 10]
 });

 return (
 <Marker 
 position={[s.lat, s.lng]} 
 icon={customIcon}
 zIndexOffset={isSelected ? 1000 : 0}
 eventHandlers={{
 click: () => {
 try { if ('vibrate' in navigator) navigator.vibrate(10); } catch (_) {}
 if (onSelectStation) onSelectStation(s.id);
 },
 popupclose: () => {
 if (onSelectStation) onSelectStation(null);
 }
 }}
 >
 <Popup maxWidth={260} className="custom-station-popup">
 <div className="p-1 max-w-[240px] break-words text-slate-900 dark:text-white">
 <strong className="text-[13px] font-bold block leading-tight">{s.brand}</strong>
 <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">{s.address}</span>
 <div className="mt-2 font-black text-[15px] flex items-center gap-1.5 text-primary">
 {s.price.toFixed(3)} €/L
 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">({activeFuelLabel})</span>
 </div>
 </div>
 </Popup>
 </Marker>
 );
}, (prevProps, nextProps) => {
 return prevProps.isSelected === nextProps.isSelected && 
 prevProps.minPrice === nextProps.minPrice && 
 prevProps.activeFuelLabel === nextProps.activeFuelLabel &&
 prevProps.s.id === nextProps.s.id;
});

export default function MapView({ settings, 
 userLocation, 
 stations, 
 minPrice, 
 activeFuelLabel,
  selectedStationId,
  recenterTrigger,
 onSelectStation,
 activeTab,
 onSearchArea 
}) {
 const [showSearchBtn, setShowSearchBtn] = useState(false);
 const mapRef = useRef(null);
 const [mapBounds, setMapBounds] = useState(null);

  
  
  const mapStyle = settings?.mapStyle || 'light';
  
  const isDark = settings?.theme === 'dark' || 
    (settings?.theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

const handleMapMove = (isUserAction) => {
 if (isUserAction) setShowSearchBtn(true);
 };

 const executeSearch = () => {
 setShowSearchBtn(false);
 if (mapRef.current) {
 const center = mapRef.current.getCenter();
 onSearchArea({ lat: center.lat, lng: center.lng });
 }
 };

 const visibleStations = useMemo(() => {
 if (!mapBounds || stations.length === 0) return stations.slice(0, 50); // Fallback inicial seguro
 
 const padLat = (mapBounds.getNorth() - mapBounds.getSouth()) * 0.2;
 const padLng = (mapBounds.getEast() - mapBounds.getWest()) * 0.2;
 
 const expandedBounds = {
   north: mapBounds.getNorth() + padLat,
   south: mapBounds.getSouth() - padLat,
   east: mapBounds.getEast() + padLng,
   west: mapBounds.getWest() - padLng,
 };

 let visible = stations.filter(s => 
   s.lat <= expandedBounds.north && 
   s.lat >= expandedBounds.south && 
   s.lng <= expandedBounds.east && 
   s.lng >= expandedBounds.west
 );

 if (visible.length > 80) {
   visible = visible.slice(0, 80);
 }
 
 if (selectedStationId && !visible.find(s => s.id === selectedStationId)) {
    const sel = stations.find(s => s.id === selectedStationId);
    if (sel) visible.push(sel);
 }
 
 return visible;
}, [stations, mapBounds, selectedStationId]);

 const bounds = useMemo(() => {
 if (stations.length > 0) {
 return [...stations.map(s => [s.lat, s.lng]), [userLocation.lat, userLocation.lng]];
 }
 return null;
 }, [stations, userLocation]);

 const userIcon = L.divIcon({ className: 'user-marker', iconSize: [16, 16], iconAnchor: [8, 8] });

 const selectedStation = stations.find(s => s.id === selectedStationId);

 return (
 <div className="relative w-full h-full overflow-hidden z-0">
 <MapContainer 
 center={[userLocation.lat, userLocation.lng]} 
 zoom={13} 
 maxZoom={20}
 minZoom={3}
 style={{ height: '100%', width: '100%', zIndex: 1 }}
 ref={mapRef}
 zoomControl={false}
 >
 <ZoomControl position="bottomright" />
 {mapStyle === 'satellite' ? (
    <TileLayer 
      key="google-satellite"
      url="https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
      subdomains={['0', '1', '2', '3']}
      maxZoom={20}
      className="satellite-tiles"
      attribution="&copy; Google Maps"
    />
  ) : isDark ? (
    <MapLibreLayer 
      key="openfreemap-dark" 
      styleUrl="https://tiles.openfreemap.org/styles/dark" 
    />
  ) : (
    <TileLayer 
      key="google-roadmap"
      url="https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
      subdomains={['0', '1', '2', '3']}
      maxZoom={20}
      className="roadmap-tiles"
      attribution="&copy; Google Maps"
    />
  )}
 <CustomMapEvents onMapMoveEnd={handleMapMove} onMapClick={() => onSelectStation && onSelectStation(null)} onBoundsChange={setMapBounds} />
 <FlyToUser center={[userLocation.lat, userLocation.lng]} trigger={recenterTrigger} />
        <MapUpdater center={[userLocation.lat, userLocation.lng]} zoom={13} bounds={bounds} activeTab={activeTab} />
 <FlyToSelected selectedStation={selectedStation} activeTab={activeTab} />
 
 <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />

 <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
 {visibleStations.map(s => (
 <MemoizedStationMarker 
 key={s.id}
 s={s}
 minPrice={minPrice}
 isSelected={s.id === selectedStationId}
 activeFuelLabel={activeFuelLabel}
 onSelectStation={onSelectStation}
 />
 ))}
 </MarkerClusterGroup>
 </MapContainer>

 {showSearchBtn && (
 <button 
 onClick={executeSearch}
 className="map-search-btn absolute top-24 lg:top-6 left-1/2 -translate-x-1/2 z-[500] bg-primary/90 text-white shadow-[0_4px_15px_rgba(255,59,48,0.4)] border-none text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg transition hover:bg-primary active:scale-95"
 >
 Buscar en esta zona
 </button>
 )}
 </div>
 );
}



