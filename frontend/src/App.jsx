import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import SummaryCards from './components/SummaryCards';
import SearchBar from './components/SearchBar';
import Filters, { FUELS } from './components/Filters';
import StationList from './components/StationList';
import MapView from './components/MapView';
import SettingsModal from './components/SettingsModal';
import GarageView from './components/GarageView';
import SecurityPanel from './components/SecurityPanel';
import SubscriptionModal from './components/SubscriptionModal';
import NavigationDock from './components/NavigationDock';
import AuthScreen from './components/AuthScreen';
import LogoutModal from './components/LogoutModal';
import ProfileModal from './components/ProfileModal';
import CookiesBanner from './components/CookiesBanner';
import LegalModal from './components/LegalModal';
import VerifyEmail from './components/VerifyEmail';
import { Toaster, toast } from 'react-hot-toast';

const API_BASE = '/api/gas';
const SETTINGS_API = '/api/settings';

// Coordenadas aproximadas del centro de cada provincia para usar como fallback
const PROVINCE_CENTERS = {
 '01': {lat: 42.85, lng: -2.68}, '02': {lat: 38.99, lng: -1.85}, '03': {lat: 38.34, lng: -0.49},
 '04': {lat: 36.83, lng: -2.40}, '05': {lat: 40.65, lng: -4.69}, '06': {lat: 38.87, lng: -6.97},
 '07': {lat: 39.56, lng: 2.65}, '08': {lat: 41.38, lng: 2.17}, '09': {lat: 42.34, lng: -3.70},
 '10': {lat: 39.47, lng: -6.37}, '11': {lat: 36.52, lng: -6.29}, '12': {lat: 39.98, lng: -0.04},
 '13': {lat: 38.98, lng: -3.92}, '14': {lat: 37.88, lng: -4.77}, '15': {lat: 43.36, lng: -8.41},
 '16': {lat: 40.07, lng: -2.13}, '17': {lat: 41.98, lng: 2.82}, '18': {lat: 37.17, lng: -3.59},
 '19': {lat: 40.63, lng: -3.16}, '20': {lat: 43.31, lng: -1.98}, '21': {lat: 37.26, lng: -6.95},
 '22': {lat: 42.14, lng: -0.40}, '23': {lat: 37.77, lng: -3.78}, '24': {lat: 42.59, lng: -5.56},
 '25': {lat: 41.61, lng: 0.62}, '26': {lat: 42.46, lng: -2.44}, '27': {lat: 43.01, lng: -7.55},
 '28': {lat: 40.41, lng: -3.70}, '29': {lat: 36.72, lng: -4.42}, '30': {lat: 37.99, lng: -1.13},
 '31': {lat: 42.81, lng: -1.64}, '32': {lat: 42.33, lng: -7.86}, '33': {lat: 43.36, lng: -5.84},
 '34': {lat: 42.01, lng: -4.53}, '35': {lat: 28.12, lng: -15.43}, '36': {lat: 42.43, lng: -8.64},
 '37': {lat: 40.97, lng: -5.66}, '38': {lat: 28.46, lng: -16.25}, '39': {lat: 43.46, lng: -3.80},
 '40': {lat: 40.94, lng: -4.11}, '41': {lat: 37.38, lng: -5.98}, '42': {lat: 41.76, lng: -2.46},
 '43': {lat: 41.11, lng: 1.25}, '44': {lat: 40.34, lng: -1.10}, '45': {lat: 39.86, lng: -4.02},
 '46': {lat: 39.46, lng: -0.37}, '47': {lat: 41.65, lng: -4.72}, '48': {lat: 43.26, lng: -2.93},
 '49': {lat: 41.50, lng: -5.74}, '50': {lat: 41.64, lng: -0.88}, '51': {lat: 35.88, lng: -5.32},
 '52': {lat: 35.29, lng: -2.93}
};

const PROVINCE_MAP = {
 // Andalucía
 'almería': '04', 'almeria': '04',
 'cádiz': '11', 'cadiz': '11', 'jerez': '11',
 'córdoba': '14', 'cordoba': '14',
 'granada': '18',
 'huelva': '21',
 'jaén': '23', 'jaen': '23',
 'málaga': '29', 'malaga': '29', 'marbella': '29',
 'sevilla': '41',
 // Aragón
 'huesca': '22',
 'teruel': '44',
 'zaragoza': '50',
 // Asturias
 'asturias': '33', 'oviedo': '33', 'gijón': '33', 'gijon': '33',
 // Baleares
 'baleares': '07', 'balears': '07', 'mallorca': '07', 'menorca': '07', 'ibiza': '07', 'palma': '07',
 // Canarias
 'las palmas': '35', 'gran canaria': '35', 'lanzarote': '35', 'fuerteventura': '35',
 'santa cruz de tenerife': '38', 'tenerife': '38', 'la palma': '38', 'la gomera': '38', 'el hierro': '38',
 // Cantabria
 'cantabria': '39', 'santander': '39',
 // Castilla-La Mancha
 'albacete': '02',
 'ciudad real': '13',
 'cuenca': '16',
 'guadalajara': '19',
 'toledo': '45',
 // Castilla y León
 'ávila': '05', 'avila': '05',
 'burgos': '09',
 'león': '24', 'leon': '24',
 'palencia': '34',
 'salamanca': '37',
 'segovia': '40',
 'soria': '42',
 'valladolid': '47',
 'zamora': '49',
 // Cataluña
 'barcelona': '08',
 'girona': '17', 'gerona': '17',
 'lleida': '25', 'lérida': '25', 'lerida': '25',
 'tarragona': '43',
 // Comunidad Valenciana
 'alicante': '03', 'alacant': '03',
 'castellón': '12', 'castellon': '12',
 'valencia': '46', 'valència': '46',
 // Extremadura
 'badajoz': '06',
 'cáceres': '10', 'caceres': '10',
 // Galicia
 'a coruña': '15', 'la coruña': '15', 'coruña': '15',
 'lugo': '27',
 'ourense': '32', 'orense': '32',
 'pontevedra': '36', 'vigo': '36',
 // La Rioja
 'la rioja': '26', 'rioja': '26', 'logroño': '26', 'logrono': '26',
 // Madrid
 'madrid': '28',
 // Murcia
 'murcia': '30', 'cartagena': '30',
 // Navarra
 'navarra': '31', 'pamplona': '31', 'iruña': '31',
 // País Vasco
 'álava': '01', 'alava': '01', 'vitoria': '01', 'gasteiz': '01',
 'guipúzcoa': '20', 'gipuzkoa': '20', 'san sebastián': '20', 'donostia': '20',
 'vizcaya': '48', 'bizkaia': '48', 'bilbao': '48',
 // Ceuta y Melilla
 'ceuta': '51',
 'melilla': '52'
};

function App() {

 const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem('waygass_cookie_consent'));
 const [showCookiesBanner, setShowCookiesBanner] = useState(!localStorage.getItem('waygass_cookie_consent'));
 const [legalType, setLegalType] = useState(null);

 const safeSetItem = (key, value) => {
 // Auth is essential, allow it always
 if (key === 'waygas_token' || key === 'waygas_user') {
 localStorage.setItem(key, value);
 return;
 }
 // Only save preferences if cookies are accepted
 // Note: Dark mode (theme) is explicitly exempted as functional
 if (cookieConsent === 'accepted' || key === 'waygas_settings') {
 localStorage.setItem(key, value);
 }
 };

 const handleRejectCookies = () => {
 setCookieConsent('rejected');
 setShowCookiesBanner(false);
 ['waygas_filters', 'waygas_viewMode', 'waygas_province', 'waygas_location'].forEach(k => localStorage.removeItem(k));
 };

 const handleAcceptCookies = () => {
 setCookieConsent('accepted');
 setShowCookiesBanner(false);
 };

 const [authToken, setAuthToken] = useState(localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token'));
 const [authUser, setAuthUser] = useState(() => {
 try {
 const stored = localStorage.getItem('waygas_user') || sessionStorage.getItem('waygas_user');
 if (!stored || stored === 'undefined') return null;
 return JSON.parse(stored);
 } catch (e) {
 localStorage.removeItem('waygas_user');
 sessionStorage.removeItem('waygas_user');
 return null;
 }
 });
 
 const [settings, setSettings] = useState(() => {
 const saved = localStorage.getItem('waygas_settings');
 return saved ? JSON.parse(saved) : { tankSize: 50, gpsApp: 'gmaps', isPro: false, cardWaylet: false, cardCepsa: false, theme: 'system' };
 });

 useEffect(() => {
 const applyTheme = () => {
 const isDark = 
 settings.theme === 'dark' || 
 (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
 
 if (isDark) {
 document.documentElement.classList.add('dark');
 } else {
 document.documentElement.classList.remove('dark');
 }
 };

 applyTheme();

 if (settings.theme === 'system') {
 const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
 const listener = () => applyTheme();
 mediaQuery.addEventListener('change', listener);
 return () => mediaQuery.removeEventListener('change', listener);
 }
 }, [settings.theme]);

 // Persistir ajustes localmente cada vez que cambien para que no se pierdan al recargar
 useEffect(() => {
    safeSetItem('waygas_settings', JSON.stringify(settings));
    if (authToken) {
      const timeout = setTimeout(() => {
        axios.put(SETTINGS_API, settings, { headers: { Authorization: `Bearer ${authToken}` } }).catch(e => console.error("Sync error", e));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [settings, cookieConsent, authToken]);

 const defaultFilters = {
 fuelType: 'g95', province: 'auto', radius: 10, sortBy: 'price',
 priceCategory: 'all',
 openNow: false,
 brand: 'all'
 };

 const [filters, setFilters] = useState(() => {
 try {
 const saved = localStorage.getItem('waygas_filters');
 if (saved) {
 const parsed = JSON.parse(saved);
 // Evitar filtros fantasma: solo guardamos tipo de combustible y radio.
 return { 
 ...defaultFilters, 
 fuelType: parsed.fuelType || defaultFilters.fuelType,
 radius: parsed.radius !== undefined ? parsed.radius : defaultFilters.radius
 };
 }
 return defaultFilters;
 } catch { return defaultFilters; }
 });

 const [currentProvince, setCurrentProvince] = useState(() => localStorage.getItem('waygas_province') || '35');
 const [userLocation, setUserLocation] = useState(() => {
 try {
 const saved = localStorage.getItem('waygas_location');
 return saved ? JSON.parse(saved) : { lat: 40.4168, lng: -3.7038 }; // Default Madrid
 } catch { return { lat: 40.4168, lng: -3.7038 }; }
 });
  const [isUsingGps, setIsUsingGps] = useState(true);
 
 const [stationsData, setStationsData] = useState([]);
 const [loading, setLoading] = useState(false);
 const [lastUpdate, setLastUpdate] = useState(null);
 
 const [isSettingsOpen, setSettingsOpen] = useState(false);
 const [isSubOpen, setSubOpen] = useState(false);
 const [isLogoutOpen, setLogoutOpen] = useState(false);
 const [isProfileOpen, setProfileOpen] = useState(false);
 
 const [activeTab, setActiveTab] = useState(() => localStorage.getItem('waygas_activeTab') || 'list');
  
  useEffect(() => {
    localStorage.setItem('waygas_activeTab', activeTab);
  }, [activeTab]);
 const [viewMode, setViewMode] = useState(() => localStorage.getItem('waygas_viewMode') || 'explore');
 const [favoriteIds, setFavoriteIds] = useState([]);
 const [selectedStationId, setSelectedStationId] = useState(null);

 // Persistir estado (solo campos fijos para los filtros)
 useEffect(() => { 
 safeSetItem('waygas_filters', JSON.stringify({
 fuelType: filters.fuelType,
 radius: filters.radius
 })); 
 }, [filters.fuelType, filters.radius, cookieConsent]);
 useEffect(() => { safeSetItem('waygas_viewMode', viewMode); }, [viewMode, cookieConsent]);
 useEffect(() => { safeSetItem('waygas_province', currentProvince); }, [currentProvince, cookieConsent]);
 useEffect(() => { safeSetItem('waygas_location', JSON.stringify(userLocation)); }, [userLocation, cookieConsent]);

 // Fetch Favoritos
 const fetchFavorites = async () => {
 if (!authToken) return;
 try {
 const res = await axios.get('/api/favorites', {
 headers: { Authorization: `Bearer ${authToken}` }
 });
 setFavoriteIds(res.data);
 } catch (e) {
 console.error(e);
 }
 };

 const toggleFavorite = async (stationId) => {
 if (!authToken) {
 // Si no hay token, podemos forzar el modal, pero aquí simplificamos
 alert("Inicia sesión desde tu perfil para guardar favoritos.");
 return;
 }
 try {
 const res = await axios.post('/api/favorites/toggle', { stationId }, {
 headers: { Authorization: `Bearer ${authToken}` }
 });
 if (res.data.action === 'added') {
 setFavoriteIds(prev => [...prev, stationId.toString()]);
 } else {
 setFavoriteIds(prev => prev.filter(id => id !== stationId.toString()));
 }
 } catch (e) {
 console.error(e);
 }
 };

 // Cargar Perfil (antes fetchSettings)
 const fetchProfile = async () => {
 if (!authToken) return;
 try {
 const res = await axios.get(SETTINGS_API, {
 headers: { Authorization: `Bearer ${authToken}` }
 });
 if (res.data) {
      setAuthUser(res.data);
      localStorage.setItem('waygas_user', JSON.stringify(res.data));
      
      setSettings(prev => ({
        ...prev,
        tankSize: res.data.tankSize || prev.tankSize,
        gpsApp: res.data.gpsApp || prev.gpsApp,
        theme: res.data.theme || prev.theme,
        cardWaylet: res.data.cardWaylet !== undefined ? res.data.cardWaylet : prev.cardWaylet,
        cardCepsa: res.data.cardCepsa !== undefined ? res.data.cardCepsa : prev.cardCepsa,
        garage: res.data.garage || prev.garage,
        activeGarageId: res.data.activeGarageId || prev.activeGarageId,
        vehicleName: res.data.vehicleName || prev.vehicleName
      }));
    }
 } catch (e) {
 console.error("Error cargando perfil", e);
 if (e.response && (e.response.status === 401 || e.response.status === 404)) {
 handleLogout();
 }
 }
 };

 const saveSettings = async (newSettings) => {
 try {
 await axios.put(SETTINGS_API, newSettings, {
 headers: { Authorization: `Bearer ${authToken}` }
 });
 setSettings(newSettings);
 } catch (e) {
 console.error(e);
 }
 };

 // Geolocalización
 const detectProvince = async (lat, lng) => {
 let detectedCode = null;
 try {
 // Usar email para cumplir con la política de Nominatim y evitar bloqueos (rate limit)
 const res = { data: await (await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)).json() };
 const text = JSON.stringify(res.data).toLowerCase();
 
 // Ordenar las claves por longitud (de mayor a menor) para evitar que "palma" (Baleares) pise a "las palmas" (Canarias)
 const sortedKeys = Object.keys(PROVINCE_MAP).sort((a, b) => b.length - a.length);
 
 for (const key of sortedKeys) {
 if (text.includes(key)) {
 detectedCode = PROVINCE_MAP[key];
 break;
 }
 }
 } catch (e) {
 console.warn("Nominatim fallback activado por error/rate limit:", e.message);
 }

 // Fallback matemático si Nominatim falla, da error o es océano
 if (!detectedCode) {
 let minD = Infinity;
 for (const [code, center] of Object.entries(PROVINCE_CENTERS)) {
 const d = Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2);
 if (d < minD) {
 minD = d;
 detectedCode = code;
 }
 }
 }

 if (detectedCode) {
 setCurrentProvince(detectedCode);
 return detectedCode;
 }
 return currentProvince;
 };

 const getUserGPS = (isManual = false) => {
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
 async (pos) => {
 const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setIsUsingGps(true);
        await detectProvince(loc.lat, loc.lng);
      },
 (err) => {
 if (isManual && err.code === 1) {
 alert("⚠️ Permiso bloqueado.\n\nPara usar tu GPS, debes tocar el icono del candado en la barra de direcciones de tu navegador y permitir el acceso a la ubicación.");
 } else if (isManual && err.code === 2) {
 alert("No se ha podido determinar tu ubicación. Verifica que tienes activado el GPS en tu dispositivo.");
 } else if (isManual && err.code === 3) {
 alert("Tiempo de espera agotado al intentar buscar tu ubicación.");
 }
 detectProvince(userLocation.lat, userLocation.lng);
 },
 { timeout: 8000 }
 );
 }
 };

 useEffect(() => {
 getUserGPS();
 if (authToken) {
 fetchProfile();
 fetchFavorites();
 }
 }, [authToken]);

 const handleSearch = async (query) => {
 setLoading(true);
 try {
 // Si el usuario busca manualmente, asegurarnos de que el radio sea amplio para que vea resultados (ej: islas enteras)
 setFilters(prev => ({ ...prev, radius: 10 }));
 
 const res = { data: await (await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=-18.16,27.63,4.32,43.79&limit=5`)).json() };
      if (res.data && res.data.features && res.data.features.length > 0) {
        const esFeatures = res.data.features.filter(f => f.properties.countrycode === 'ES');
        if(esFeatures.length > 0) {
          const first = esFeatures[0];
          const loc = { lat: parseFloat(first.geometry.coordinates[1]), lng: parseFloat(first.geometry.coordinates[0]) };
        setUserLocation(loc);
        setIsUsingGps(false);
        await detectProvince(loc.lat, loc.lng);
        }
      }
 } catch (e) { console.error(e); }
 setLoading(false);
 };

 useEffect(() => {
 const controller = new AbortController();
 const fetchGasStations = async () => {
 const code = (filters.province !== 'auto' && filters.province !== 'all') ? filters.province : currentProvince;
 const endpoint = filters.province === 'all' ? '' : `FiltroProvincia/${code}`;
 
 setLoading(true);
 setStationsData([]); // Clear previous stations
 try {
 const res = await axios.get(`${API_BASE}/${endpoint}`, { signal: controller.signal });
 if (res.data && res.data.ListaEESSPrecio) {
 setStationsData(res.data.ListaEESSPrecio);
 // Convertir la fecha del API (hora peninsular Europe/Madrid) a la hora local del usuario
 if (res.data.Fecha) {
 try {
 const parts = res.data.Fecha.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{1,2})/);
 if (parts) {
 const [, dd, mm, yyyy, hh, min, ss] = parts;
 // 1. Tratar la hora de Madrid como si fuera UTC para tener un punto de referencia
 const asUtcMs = Date.UTC(yyyy, mm - 1, dd, hh, min, ss);
 // 2. Calcular el offset real de Madrid respecto a UTC en ese instante
 const madridRendered = new Date(new Date(asUtcMs).toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
 const utcRendered = new Date(new Date(asUtcMs).toLocaleString('en-US', { timeZone: 'UTC' }));
 const madridOffsetMs = madridRendered.getTime() - utcRendered.getTime();
 // 3. La hora real UTC = hora Madrid - offset de Madrid
 const realUtcMs = asUtcMs - madridOffsetMs;
 // 4. Formatear en la zona horaria local del dispositivo del usuario
 const localStr = new Date(realUtcMs).toLocaleString('es-ES', {
 day: '2-digit', month: '2-digit', year: 'numeric',
 hour: '2-digit', minute: '2-digit', second: '2-digit'
 });
 setLastUpdate(localStr);
 } else {
 setLastUpdate(res.data.Fecha);
 }
 } catch {
 setLastUpdate(res.data.Fecha);
 }
 } else {
 setLastUpdate(null);
 }
 } else {
 setStationsData([]);
 setLastUpdate(null);
 }
 } catch (e) {
 if (!axios.isCancel(e)) {
 console.error(`Error fetching data:`, e);
 setStationsData([]);
 }
 } finally {
 if (!controller.signal.aborted) {
 setLoading(false);
 }
 }
 };

 fetchGasStations();

 return () => controller.abort();
 }, [filters.province, currentProvince]);

 // Procesamiento de datos
 const parsePrice = (str) => {
 if (!str) return null;
 const val = parseFloat(str.toString().replace(',', '.').trim());
 return isNaN(val) || val <= 0 ? null : val;
 };

 const parseCoord = (str) => {
 if (!str) return null;
 const val = parseFloat(str.toString().replace(',', '.').trim());
 return isNaN(val) ? null : val;
 };

 const getFuelPrice = (s, fuelType) => {
 for (const [key, val] of Object.entries(s)) {
 if (!key.toLowerCase().startsWith('precio') || !val) continue;
 const k = key.toLowerCase();
 const p = parsePrice(val);
 if (!p) continue;

 if (fuelType === 'g95' && k.includes('95')) return p;
 if (fuelType === 'g98' && k.includes('98')) return p;
 if (fuelType === 'diesel' && k.includes('gasoleo a') && !k.includes('premium') && !k.includes('+')) return p;
 if (fuelType === 'dieselPremium' && (k.includes('gasoleo premium') || k.includes('+'))) return p;
 if (fuelType === 'glp' && (k.includes('glp') || k.includes('licuados'))) return p;
 if (fuelType === 'gnc' && (k.includes('gnc') || k.includes('comprimido'))) return p;
 }
 return null;
 };

 const calculateDistance = (lat1, lon1, lat2, lon2) => {
 const R = 6371;
 const dLat = (lat2 - lat1) * Math.PI / 180;
 const dLon = (lon2 - lon1) * Math.PI / 180;
 const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
 return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 };

 const isOpenNow = (scheduleStr) => {
 if (!scheduleStr) return true;
 const s = scheduleStr.toLowerCase();
 if (s.includes('24h') || s.includes('00:00-23:59')) return true;
 
 const now = new Date();
 const currentMinutes = now.getHours() * 60 + now.getMinutes();

 const regex = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g;
 let match;
 let hasTimeRange = false;
 let isCurrentlyOpen = false;

 while ((match = regex.exec(s)) !== null) {
 hasTimeRange = true;
 const startMinutes = parseInt(match[1]) * 60 + parseInt(match[2]);
 let endMinutes = parseInt(match[3]) * 60 + parseInt(match[4]);
 if (endMinutes < startMinutes) endMinutes += 24 * 60; // closes after midnight

 let checkMinutes = currentMinutes;
 if (currentMinutes < startMinutes && endMinutes > 24 * 60) {
 checkMinutes += 24 * 60;
 }

 if (checkMinutes >= startMinutes && checkMinutes <= endMinutes) {
 isCurrentlyOpen = true;
 break;
 }
 }
 return hasTimeRange ? isCurrentlyOpen : true; // default to open if unparseable
 };

 const getGpsUrl = (lat, lng) => {
 if (settings.gpsApp === 'waze') return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
 if (settings.gpsApp === 'apple') return `maps://maps.apple.com/?daddr=${lat},${lng}`;
 return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
 };

 const processedStations = useMemo(() => {
 let processed = stationsData.map(s => {
 const lat = parseCoord(s['Latitud']);
 const lng = parseCoord(s['Longitud (WGS84)']);
 let price = getFuelPrice(s, filters.fuelType);

 if (lat === null || lng === null || price === null) return null;

 const brandLower = (s['Rótulo'] || '').toLowerCase();
 if (settings.isPro) {
 if (settings.cardWaylet && brandLower.includes('repsol')) price = Math.max(0.1, price - 0.05);
 if (settings.cardCepsa && brandLower.includes('cepsa')) price = Math.max(0.1, price - 0.05);
 }

 const schedule = s['Horario'] || 'Horario no disponible';
 const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng); 
 
 return {
 id: s['IDEESS'].toString(), brand: s['Rótulo'] || 'Gasolinera', address: s['Dirección'], town: s['Municipio'],
 schedule, lat, lng, price, distance, isOpen: isOpenNow(schedule)
 };
 }).filter(Boolean);

 // Calculate temporary min for price category filtering
 const tempPrices = processed.map(s => s.price);
 const minP = tempPrices.length ? Math.min(...tempPrices) : 0;

 // Filtrar por favoritos si estamos en la vista de favoritos
 if (viewMode === 'favorites') {
 processed = processed.filter(s => favoriteIds.includes(s.id.toString()));
 } else {
 // Estos filtros solo aplican en modo explorar
 if (filters.radius > 0) {
 let withinRadius = processed.filter(s => s.distance <= filters.radius);
 if (withinRadius.length === 0 && processed.length > 0) {
 console.warn(`[processedStations] El filtro de radio (${filters.radius}km) eliminó TODAS las gasolineras. Ignorando el filtro temporalmente para mostrar resultados.`);
 // No actualizamos 'processed', dejamos que pasen todas
 } else {
 processed = withinRadius;
 }
 }
 
 if (filters.openNow) {
 processed = processed.filter(s => s.isOpen);
 }
 
 if (filters.priceCategory === 'cheap') {
 processed = processed.filter(s => s.price - minP <= 0.03);
 }
 
 if (filters.priceCategory === 'cheap_avg') {
 processed = processed.filter(s => s.price - minP <= 0.08);
 }
 
 if (filters.brand && filters.brand !== 'all') {
 processed = processed.filter(s => {
 const b = s.brand.toUpperCase();
 const mains = ['REPSOL', 'CEPSA', 'BP', 'GALP', 'SHELL', 'PLENOIL', 'PETROPRIX', 'BALLENOIL'];
 if (filters.brand === 'Otras') {
 return !mains.some(m => b.includes(m));
 }
 return b.includes(filters.brand);
 });
 }
 }

 if (filters.sortBy === 'price') processed.sort((a, b) => a.price - b.price);
 if (filters.sortBy === 'distance') processed.sort((a, b) => a.distance - b.distance);

 return processed;
 }, [stationsData, filters, userLocation, settings, viewMode, favoriteIds]);

 const prices = processedStations.map(s => s.price);
 const minPrice = prices.length ? Math.min(...prices) : 0;
 const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
 
 const stats = {
 min: minPrice,
 avg: avgPrice,
 maxSavings: prices.length ? ((avgPrice - minPrice) * (settings.tankSize || 50)) : 0
 };
 const activeFuelLabel = FUELS.find(f => f.id === filters.fuelType)?.label || 'Carburante';

 const handleLoginSuccess = (token, user, rememberMe) => {
 if (rememberMe) {
 localStorage.setItem('waygas_token', token);
 localStorage.setItem('waygas_user', JSON.stringify(user));
 } else {
 sessionStorage.setItem('waygas_token', token);
 sessionStorage.setItem('waygas_user', JSON.stringify(user));
 }
 setAuthToken(token);
 setAuthUser(user);
 };

 const handleLogout = () => {
 // Auth data
 localStorage.removeItem('waygas_token');
 localStorage.removeItem('waygas_user');
 sessionStorage.removeItem('waygas_token');
 sessionStorage.removeItem('waygas_user');
 
 // User preferences
 localStorage.removeItem('waygas_settings');
 localStorage.removeItem('waygas_filters');
 localStorage.removeItem('waygas_province');
 localStorage.removeItem('waygas_location');
 localStorage.removeItem('waygas_viewMode');
 
 // Hard reload to completely wipe React memory state for the next user
 window.location.reload();
 };

 if (window.location.pathname === '/verify') {
 return <VerifyEmail />;
 }

 if (!authToken) {
 return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
 }

 return (
 <div className="min-h-[100dvh] lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row antialiased text-slate-900 dark:text-slate-100 relative">
 <div className="liquid-bg"></div>

 <Toaster 
 position="bottom-center"
 toastOptions={{
 duration: 3500,
 style: {
 background: '#000000',
 color: '#e5e1e4',
 borderRadius: '16px',
 padding: '12px 20px',
 fontWeight: 'bold',
 fontSize: '14px',
 boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
 border: '1px solid rgba(255,255,255,0.05)'
 },
 success: { iconTheme: { primary: '#00dbe9', secondary: '#000000' } },
 error: { iconTheme: { primary: '#f43f5e', secondary: '#000000' } }
 }} 
 />

 {isSettingsOpen && (
 <SettingsModal isOpen={true} settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} onLogout={() => setLogoutOpen(true)} user={authUser} />
 )}
 {isSubOpen && (
 <SubscriptionModal isOpen={true} 
 onClose={() => setSubOpen(false)} 
 isPro={authUser?.subscription === 'pro' || authUser?.subscription === 'premium'}
 />
 )}
 {isProfileOpen && (
 <ProfileModal isOpen={true} 
          user={authUser} 
          onClose={() => setProfileOpen(false)}
          onLogout={() => { setProfileOpen(false); setLogoutOpen(true); }}
          openSub={() => setSubOpen(true)}
          openSettings={() => setSettingsOpen(true)}
        />
 )}

 {/* MOBILE HEADER (Floating Search Pill) */}
 <div className="lg:hidden fixed top-3 left-3 right-3 z-40 pointer-events-none">
 <MobileHeader 
            user={authUser}
            openProfile={() => setProfileOpen(true)}
            onSearch={handleSearch}
            loadingSearch={loading}
            onGps={() => getUserGPS(true)}
            isUsingGps={isUsingGps}
          />
 </div>

 
      
      {/* SECURITY PANEL (Admin Only) */}
      {authUser?.role === 'admin' && (
        <div className={`
          fixed inset-x-0 bottom-0 top-[88px] z-30 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-3xl rounded-t-3xl border-t border-slate-200/50 dark:border-white/10 transition-transform duration-300 ease-in-out
          lg:absolute lg:inset-y-0 lg:left-0 lg:w-[420px] xl:w-[460px] lg:rounded-none lg:border-t-0 lg:border-r
          ${activeTab === 'security' ? 'translate-y-0 lg:translate-x-0' : 'translate-y-[150%] lg:translate-x-[-150%]'}
        `}>
          <SecurityPanel onClose={() => setActiveTab("list")} />
        </div>
      )}

      {/* GARAGE PANEL */}
      <div className={`
        fixed inset-x-0 bottom-0 top-[88px] z-30 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-3xl rounded-t-3xl border-t border-slate-200/50 dark:border-white/10 transition-transform duration-300 ease-in-out
        lg:absolute lg:inset-y-0 lg:left-0 lg:w-[420px] xl:w-[460px] lg:rounded-none lg:border-t-0 lg:border-r
        ${activeTab === 'garage' ? 'translate-y-0 lg:translate-x-0' : 'translate-y-[150%] lg:translate-x-[-150%]'}
      `}>
        <GarageView settings={settings} setSettings={setSettings} />
      </div>

      {/* DESKTOP LIST PANEL / MOBILE BOTTOM SHEET */}
 <div className={`
 flex-col z-30 transition-transform duration-300 ease-in-out
 lg:w-[420px] xl:w-[460px] lg:h-full lg:glass-core lg:border-r lg:border-slate-200/50 dark:lg:border-white/10 lg:flex
 ${activeTab === 'list' 
 ? 'fixed inset-x-0 bottom-0 top-[88px] bg-white/90 dark:bg-[#000000]/90 backdrop-blur-2xl rounded-t-3xl flex border-t border-slate-200/50 dark:border-white/10 translate-y-0 lg:static lg:bg-white dark:lg:bg-[#000000] lg:backdrop-blur-none lg:rounded-none lg:border-none' 
 : 'fixed inset-x-0 bottom-0 top-[88px] flex translate-y-[150%] lg:translate-y-0 lg:static lg:bg-white dark:lg:bg-[#000000] lg:backdrop-blur-none lg:rounded-none lg:border-none'
 }
 `}>
 {/* Desktop Header */}
 <div className="hidden lg:block p-6 pb-4 border-b border-slate-200/50 dark:border-white/5">
 <Header openSecurity={() => setActiveTab("security")} isPro={authUser?.subscription === 'pro' || authUser?.subscription === 'premium'} 
 openSettings={() => setSettingsOpen(true)} 
 openSub={() => setSubOpen(true)}
          openSettings={() => setSettingsOpen(true)} 
 user={authUser}
 openProfile={() => setProfileOpen(true)}
 />
 <div className="mt-5">
 <SearchBar onSearch={handleSearch} onGps={() => getUserGPS(true)} loadingSearch={loading} isUsingGps={isUsingGps} />
 </div>
 </div>
 
 <div className="p-4 pb-24 lg:p-6 lg:pb-6 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5">
 <SummaryCards stats={stats} tankSize={settings.tankSize} isPro={authUser?.subscription === 'pro' || authUser?.subscription === 'premium'} />
 <Filters filters={filters} setFilters={setFilters} />
 <div className="glass-core border border-slate-200/50 dark:border-white/5 p-1 rounded-2xl flex items-center mb-1">
   <button onClick={() => setViewMode('explore')} className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${viewMode === 'explore' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      Explorar
   </button>
   <button onClick={() => setViewMode('favorites')} className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${viewMode === 'favorites' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      Favoritas
   </button>
   </div>
 
 {loading ? (
 <div className="flex flex-col gap-4">
 {[1,2,3].map(i => <div key={i} className="bg-slate-200 dark:bg-white/5 rounded-2xl h-32 animate-pulse "></div>)}
 </div>
 ) : (
 <StationList 
 stations={processedStations} 
 totalStations={processedStations.length}
 minPrice={minPrice} 
 avgPrice={avgPrice} 
 tankSize={settings.tankSize}
 radius={filters.radius}
 getGpsUrl={getGpsUrl}
 activeFuelLabel={FUELS.find(f => f.id === filters.fuel)?.label || 'Gasolina 95'}
 favoriteIds={favoriteIds}
 onToggleFavorite={toggleFavorite}
 selectedStationId={selectedStationId}
 onSelectStation={(id) => {
     setSelectedStationId(id);
     if (id && window.innerWidth < 1024) setActiveTab('list');
     }}
   
 lastUpdate={lastUpdate}
 />
 )}
 </div>
 </div>
 {/* MAP AREA */}
 <div className="absolute inset-0 z-0 lg:static lg:flex-1">
 <MapView 
 userLocation={userLocation} 
 stations={processedStations} 
 minPrice={minPrice} 
 getGpsUrl={getGpsUrl}
 selectedStationId={selectedStationId}
 onSelectStation={(id) => {
   setSelectedStationId(id);
   if (id && window.innerWidth < 1024) setActiveTab('list');
   }}
   onSearchArea={async (center) => {
     setIsUsingGps(false);
     setUserLocation(center);
     await detectProvince(center.lat, center.lng);
   }}
 />
 </div>

 {/* MOBILE BOTTOM TAB BAR */}
 <div className="lg:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
 <div className="pointer-events-auto">
 <NavigationDock activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={authUser?.role === 'admin'} />
 </div>
 </div>

   {isLogoutOpen && (
        <LogoutModal 
          isOpen={isLogoutOpen} 
          onClose={() => setLogoutOpen(false)} 
          onConfirm={handleLogout} 
        />
      )}
         {isLogoutOpen && (
        <LogoutModal 
          isOpen={isLogoutOpen} 
          onClose={() => setLogoutOpen(false)} 
          onConfirm={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;







