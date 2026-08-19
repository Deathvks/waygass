import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';

function CustomMapEvents({ onMapMoveEnd, onMapClick }) {
  useMapEvents({
    dragend: () => onMapMoveEnd(true),
    zoomend: () => onMapMoveEnd(true),
    click: () => { if (onMapClick) onMapClick(); },
  });
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
function FlyToSelected({ selectedStation }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedStation) return;
    if (!selectedStation.lat || !selectedStation.lng) return;
    if (isNaN(selectedStation.lat) || isNaN(selectedStation.lng)) return;
    
    // Esperar a que el mapa tenga dimensiones reales (evita NaN si está oculto)
    const container = map.getContainer();
    if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;

    try {
      map.flyTo([selectedStation.lat, selectedStation.lng], 15, { duration: 0.6 });
    } catch (e) {
      // Fallback silencioso si flyTo falla
      try { map.setView([selectedStation.lat, selectedStation.lng], 15); } catch (_) {}
    }
  }, [selectedStation, map]);
  return null;
}

const MemoizedStationMarker = React.memo(({ s, minPrice, isSelected, activeFuelLabel, onSelectStation }) => {
  const diff = s.price - minPrice;
  let colorClass = 'bg-avg';
  if (diff <= 0.03) colorClass = 'bg-cheap';
  else if (diff > 0.08) colorClass = 'bg-expensive';

  const customIcon = L.divIcon({
    className: '',
    html: `<div class="custom-pin ${colorClass}" style="${isSelected ? 'transform: scale(1.35); box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.4), 0 4px 12px rgba(0,0,0,0.15); z-index: 9999;' : ''}">${s.price.toFixed(3)}€</div>`,
    iconSize: isSelected ? [56, 24] : [42, 18],
    iconAnchor: isSelected ? [28, 12] : [21, 9]
  });

  return (
    <Marker 
      position={[s.lat, s.lng]} 
      icon={customIcon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        click: () => {
          if (onSelectStation) onSelectStation(s.id);
        },
        popupclose: () => {
          if (onSelectStation) onSelectStation(null);
        }
      }}
    >
      <Popup>
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2px' }}>
          <strong style={{ fontSize: '13px', color: '#0f172a' }}>{s.brand}</strong><br/>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{s.address}</span>
          <div style={{ marginTop: '4px', fontWeight: 700, color: '#0f172a', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {s.price.toFixed(3)} €/L
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>({activeFuelLabel})</span>
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

export default function MapView({ 
  userLocation, 
  stations, 
  minPrice, 
  activeFuelLabel,
  selectedStationId,
  onSelectStation,
  activeTab,
  onSearchArea 
}) {
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const mapRef = useRef(null);

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

  const bounds = useMemo(() => {
    if (stations.length > 0) {
      return [...stations.map(s => [s.lat, s.lng]), [userLocation.lat, userLocation.lng]];
    }
    return null;
  }, [stations, userLocation]);

  const userIcon = L.divIcon({ className: 'user-marker', iconSize: [14, 14], iconAnchor: [7, 7] });

  const selectedStation = stations.find(s => s.id === selectedStationId);

  return (
    <div className="relative w-full h-full rounded-xl lg:rounded-none overflow-hidden z-0">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        ref={mapRef}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CustomMapEvents onMapMoveEnd={handleMapMove} onMapClick={() => onSelectStation && onSelectStation(null)} />
        <MapUpdater center={[userLocation.lat, userLocation.lng]} zoom={13} bounds={bounds} activeTab={activeTab} />
        <FlyToSelected selectedStation={selectedStation} />
        
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />

        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {stations.map(s => (
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
          className="absolute top-6 left-1/2 -translate-x-1/2 z-[500] bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition active:scale-95"
        >
          Buscar en esta zona
        </button>
      )}
    </div>
  );
}
