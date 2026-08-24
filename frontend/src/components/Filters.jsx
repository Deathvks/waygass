import React from 'react';

export const FUELS = [
  { id: 'g95', label: 'Gasolina 95' },
  { id: 'g98', label: 'Gasolina 98' },
  { id: 'diesel', label: 'Diésel A' },
  { id: 'dieselPremium', label: 'Diésel +' },
  { id: 'glp', label: 'GLP' },
  { id: 'gnc', label: 'GNC' }
];

export default function Filters({ filters, setFilters }) {
  const { fuelType, province, radius, sortBy, priceCategory, openNow, brand } = filters;

  const handleChange = (key, value) => {
    // Si cambia provincia a auto, poner radio a 10km como defecto. Si cambia a toda españa o provincia, sin limite
    if (key === 'province') {
        if (value === 'auto') {
            setFilters(prev => ({ ...prev, province: value, radius: 10 }));
            return;
        } else {
            setFilters(prev => ({ ...prev, province: value, radius: 0 }));
            return;
        }
    }
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const provinceOptions = [
 { value: 'auto', label: 'Detectar por GPS' },
 { value: 'all', label: 'Toda España' },
 { value: '01', label: 'Álava' }, { value: '02', label: 'Albacete' }, { value: '03', label: 'Alicante' },
 { value: '04', label: 'Almería' }, { value: '33', label: 'Asturias' }, { value: '05', label: 'Ávila' },
 { value: '06', label: 'Badajoz' }, { value: '07', label: 'Baleares' }, { value: '08', label: 'Barcelona' },
 { value: '09', label: 'Burgos' }, { value: '10', label: 'Cáceres' }, { value: '11', label: 'Cádiz' },
 { value: '39', label: 'Cantabria' }, { value: '12', label: 'Castellón' }, { value: '51', label: 'Ceuta' },
 { value: '13', label: 'Ciudad Real' }, { value: '14', label: 'Córdoba' }, { value: '15', label: 'A Coruña' },
 { value: '16', label: 'Cuenca' }, { value: '17', label: 'Girona' }, { value: '18', label: 'Granada' },
 { value: '19', label: 'Guadalajara' }, { value: '20', label: 'Guipúzcoa' }, { value: '21', label: 'Huelva' },
 { value: '22', label: 'Huesca' }, { value: '23', label: 'Jaén' }, { value: '24', label: 'León' },
 { value: '25', label: 'Lleida' }, { value: '26', label: 'La Rioja' }, { value: '27', label: 'Lugo' },
 { value: '28', label: 'Madrid' }, { value: '29', label: 'Málaga' }, { value: '52', label: 'Melilla' },
 { value: '30', label: 'Murcia' }, { value: '31', label: 'Navarra' }, { value: '32', label: 'Ourense' },
 { value: '34', label: 'Palencia' }, { value: '35', label: 'Las Palmas' }, { value: '36', label: 'Pontevedra' },
 { value: '37', label: 'Salamanca' }, { value: '38', label: 'S.C. Tenerife' }, { value: '40', label: 'Segovia' },
 { value: '41', label: 'Sevilla' }, { value: '42', label: 'Soria' }, { value: '43', label: 'Tarragona' },
 { value: '44', label: 'Teruel' }, { value: '45', label: 'Toledo' }, { value: '46', label: 'Valencia' },
 { value: '47', label: 'Valladolid' }, { value: '48', label: 'Vizcaya' }, { value: '49', label: 'Zamora' },
 { value: '50', label: 'Zaragoza' }
 ];
  const radiusOptions = [
 { value: 5, label: '5 km' },
 { value: 10, label: '10 km' },
 { value: 20, label: '20 km' },
 { value: 50, label: '50 km' },
 { value: 0, label: 'Sin límite' }
 ];
  const sortOptions = [
 { value: 'price', label: 'Más baratas' },
 { value: 'distance', label: 'Más cercanas' }
 ];
  const priceCategoryOptions = [
 { value: 'all', label: 'Todas' },
 { value: 'cheap', label: 'Solo Económicas' },
 { value: 'cheap_avg', label: 'Económicas y Medias' }
 ];
  const brandOptions = [
 { value: 'all', label: 'Todas las marcas' },
 { value: 'REPSOL', label: 'Repsol' },
 { value: 'CEPSA', label: 'Cepsa' },
 { value: 'BP', label: 'BP' },
 { value: 'GALP', label: 'Galp' },
 { value: 'SHELL', label: 'Shell' },
 { value: 'PLENOIL', label: 'Plenoil' },
 { value: 'PETROPRIX', label: 'Petroprix' },
 { value: 'BALLENOIL', label: 'Ballenoil' },
 { value: 'Otras', label: 'Otras marcas' }
 ];

  const ChevronIcon = () => (
    <svg className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-2 py-2 items-center px-1 -mx-2 sm:mx-0">
      
      {/* Abierto Ahora Toggle */}
      <button 
        onClick={() => handleChange('openNow', !openNow)}
        className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 flex items-center gap-2 ${openNow ? 'bg-primary text-white shadow-md' : 'glass-core border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
      >
        <span className={`w-2 h-2 rounded-full ${openNow ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
        Abierto Ahora
      </button>

      {/* Fuel Type */}
      <div className="relative shrink-0">
        <select 
          value={fuelType} 
          onChange={e => handleChange('fuelType', e.target.value)} 
          className="appearance-none cursor-pointer glass-core border border-slate-200 dark:border-white/10 rounded-full pl-4 pr-9 py-2 text-[13px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          {FUELS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
        <ChevronIcon />
      </div>

      {/* Brand */}
      <div className="relative shrink-0">
        <select 
          value={brand || 'all'} 
          onChange={e => handleChange('brand', e.target.value)} 
          className={`appearance-none cursor-pointer glass-core border ${brand && brand !== 'all' ? 'border-primary dark:border-primary text-primary' : 'border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'} rounded-full pl-4 pr-9 py-2 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary hover:bg-black/5 dark:hover:bg-white/5 transition`}
        >
          {brandOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronIcon />
      </div>

      {/* Provincia */}
      <div className="relative shrink-0">
        <select 
          value={province} 
          onChange={e => handleChange('province', e.target.value)} 
          className={`appearance-none cursor-pointer glass-core border ${province !== 'all' ? 'border-primary dark:border-primary text-primary' : 'border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'} rounded-full pl-4 pr-9 py-2 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary hover:bg-black/5 dark:hover:bg-white/5 transition`}
        >
          {provinceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronIcon />
      </div>

      {/* Radio */}
      {province === 'auto' && (
        <div className="relative shrink-0">
          <select 
            value={radius} 
            onChange={e => handleChange('radius', Number(e.target.value))} 
            className="appearance-none cursor-pointer glass-core border border-slate-200 dark:border-white/10 rounded-full pl-4 pr-9 py-2 text-[13px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            {radiusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronIcon />
        </div>
      )}

      {/* Sort By */}
      <div className="relative shrink-0">
        <select 
          value={sortBy} 
          onChange={e => handleChange('sortBy', e.target.value)} 
          className="appearance-none cursor-pointer glass-core border border-slate-200 dark:border-white/10 rounded-full pl-4 pr-9 py-2 text-[13px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronIcon />
      </div>

      {/* Category */}
      <div className="relative shrink-0">
        <select 
          value={priceCategory} 
          onChange={e => handleChange('priceCategory', e.target.value)} 
          className={`appearance-none cursor-pointer glass-core border ${priceCategory !== 'all' ? 'border-primary dark:border-primary text-primary' : 'border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'} rounded-full pl-4 pr-9 py-2 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary hover:bg-black/5 dark:hover:bg-white/5 transition`}
        >
          {priceCategoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronIcon />
      </div>

    </div>
  );
}
