import React, { useState } from 'react';
import Select from 'react-select';

export const FUELS = [
 { id: 'g95', label: 'Gasolina 95' },
 { id: 'g98', label: 'Gasolina 98' },
 { id: 'diesel', label: 'Diésel A' },
 { id: 'dieselPremium', label: 'Diésel +' },
 { id: 'glp', label: 'GLP' },
 { id: 'gnc', label: 'GNC' }
];

export default function Filters({ filters, setFilters }) {
 const [isOpen, setIsOpen] = useState(true);
 const { fuelType, province, radius, sortBy, priceCategory, openNow } = filters;

 const handleChange = (key, value) => {
 setFilters(prev => ({ ...prev, [key]: value }));
 };

 const isDark = document.documentElement.classList.contains('dark');

 const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? 'rgba(10, 10, 12, 0.3)' : 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(64px)',
      border: state.isFocused ? (isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)') : (isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'),
      borderRadius: '0.75rem',
      boxShadow: 'none',
      minHeight: '36px',
      fontSize: '0.75rem',
      fontWeight: 600,
      cursor: 'pointer',
      color: isDark ? '#fff' : '#0f172a',
      '&:hover': {
        border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)'
      }
    }),
    menuList: (base) => ({
      ...base,
      '::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      padding: '4px'
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)') : isFocused ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : 'transparent',
      color: isDark ? '#fff' : '#0f172a',
      fontSize: '0.75rem',
      fontWeight: 500,
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '0.5rem',
      marginBottom: '2px'
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#fff' : '#0f172a',
      fontWeight: 600
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? 'rgba(10, 10, 12, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(64px)',
      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999
    }),
    input: (base) => ({
      ...base,
      color: isDark ? '#fff' : '#0f172a'
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      padding: '4px 8px',
      '&:hover': { color: isDark ? '#fff' : '#0f172a' }
    })
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

 // Helper function to get current active fuel label
 const getActiveFuelLabel = () => {
 return FUELS.find(f => f.id === fuelType)?.label || 'Filtros';
 };

 return (
 <section className="glass-core border border-slate-200/50 dark:border-white/5 flex flex-col rounded-[24px]">
 <button 
 onClick={() => setIsOpen(!isOpen)}
 className="w-full p-4 flex items-center justify-between font-medium text-slate-800 dark:text-slate-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 rounded-[24px]"
 >
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-8 h-8 rounded-lg brand-gradient-bg flex items-center justify-center text-white shrink-0">
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
 </div>
 <div className="flex flex-col items-start min-w-0 pr-2">
 <span className="text-sm truncate max-w-full">Opciones de Búsqueda</span>
 <span className="text-[10px] font-medium text-primary uppercase tracking-wider truncate max-w-full">{getActiveFuelLabel()}</span>
 </div>
 </div>
 <div className="flex items-center gap-2 shrink-0">
 {!isOpen && <span className="hidden sm:block text-xs font-medium text-slate-400 bg-transparent border border-slate-200 dark:bg-transparent dark:border-white/10 px-2 py-1 rounded-md">Desplegar</span>}
 <svg className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
 </svg>
 </div>
 </button>

 <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
 <div className="p-4 pt-0 flex flex-col gap-4">
 <div>
 <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 p-1.5 rounded-[16px]">
 {FUELS.map(fuel => (
 <button 
 key={fuel.id}
 onClick={() => handleChange('fuelType', fuel.id)}
 className={`flex-1 min-w-[100px] text-center px-2 py-1.5 rounded-lg text-xs sm:text-sm transition ${
 fuelType === fuel.id 
 ? 'font-bold bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5 shadow-sm' 
 : 'font-medium text-slate-500 dark:text-slate-400 hover:bg-transparent border border-slate-200 dark:hover:bg-slate-700/50'
 }`}
 >
 {fuel.label}
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3 pt-4 mt-2 border-t border-slate-200/50 dark:border-white/5 text-xs relative z-50">
 <div>
 <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">Marca</label>
 <Select 
 styles={customStyles}
 options={brandOptions}
 value={brandOptions.find(o => o.value === filters.brand) || brandOptions[0]}
 onChange={(selected) => handleChange('brand', selected.value)}
 isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" menuPlacement="auto"
 menuPortalTarget={document.body}
 menuPosition="fixed"
 menuPlacement="auto"
 maxMenuHeight={500}
 classNamePrefix="rs"
 />
 </div>

 <div>
 <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">Provincia</label>
 <Select 
 styles={customStyles}
 options={provinceOptions}
 value={provinceOptions.find(o => o.value === province) || provinceOptions[0]}
 onChange={(selected) => handleChange('province', selected.value)}
 isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" menuPlacement="auto"
 menuPortalTarget={document.body}
 menuPosition="fixed"
 menuPlacement="auto"
 classNamePrefix="rs"
 />
 </div>

 <div>
 <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">Radio Máximo</label>
 <Select 
 styles={customStyles}
 options={radiusOptions}
 value={radiusOptions.find(o => o.value === radius) || radiusOptions[1]}
 onChange={(selected) => handleChange('radius', selected.value)}
 isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" menuPlacement="auto"
 menuPortalTarget={document.body}
 menuPosition="fixed"
 menuPlacement="auto"
 classNamePrefix="rs"
 />
 </div>

 <div>
 <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">Categoría</label>
 <Select 
 styles={customStyles}
 options={priceCategoryOptions}
 value={priceCategoryOptions.find(o => o.value === priceCategory) || priceCategoryOptions[0]}
 onChange={(selected) => handleChange('priceCategory', selected.value)}
 isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" menuPlacement="auto"
 menuPortalTarget={document.body}
 menuPosition="fixed"
 menuPlacement="auto"
 classNamePrefix="rs"
 />
 </div>

 <div>
 <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">Ordenación</label>
 <Select 
 styles={customStyles}
 options={sortOptions}
 value={sortOptions.find(o => o.value === sortBy) || sortOptions[0]}
 onChange={(selected) => handleChange('sortBy', selected.value)}
 isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" menuPlacement="auto"
 menuPortalTarget={document.body}
 menuPosition="fixed"
 menuPlacement="auto"
 classNamePrefix="rs"
 />
 </div>

 <div className="flex flex-col justify-end mt-1">
 <label className="flex items-center justify-between cursor-pointer glass-core border border-slate-200/50 dark:border-white/5 px-3 py-2 rounded-xl transition h-[36px]">
 <span className="font-semibold text-slate-700 dark:text-slate-300">Abierto Ahora</span>
 <div className="relative inline-flex items-center">
 <input 
 type="checkbox" 
 checked={openNow || false} 
 onChange={(e) => handleChange('openNow', e.target.checked)} 
 className="sr-only peer" 
 />
 <div className="w-8 h-4 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[100%] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary border border-slate-200/50 dark:border-white/10 "></div>
 </div>
 </label>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}

