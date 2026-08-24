import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fuelType, province, radius, sortBy, priceCategory, openNow, brand } = filters;

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const isDark = document.documentElement.classList.contains('dark');

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
      backgroundColor: isDark ? 'rgba(30, 30, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1rem',
      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      zIndex: 99999
    })
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  return (
    <>
      <div className="flex overflow-x-auto no-scrollbar gap-2 py-2 items-center px-1 -mx-2 sm:mx-0">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filtros
        </button>

        {FUELS.map(fuel => (
          <button 
            key={fuel.id}
            onClick={() => handleChange('fuelType', fuel.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 ${fuelType === fuel.id ? 'font-bold bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5 shadow-sm' : 'font-medium text-slate-500 dark:text-slate-400 hover:bg-transparent border border-slate-200 dark:border-white/5 dark:hover:bg-slate-700/50'}`}
          >
            {fuel.label}
          </button>
        ))}
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex flex-col justify-end sm:justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-[#121212] w-full sm:w-[500px] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-fade-in border border-white/10">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-6 sm:hidden"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Opciones de Búsqueda</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 relative z-50">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Marca</label>
                <Select styles={customStyles} options={brandOptions} value={brandOptions.find(o => o.value === brand) || brandOptions[0]} onChange={(s) => handleChange('brand', s.value)} isSearchable={false} menuPortalTarget={document.body} classNamePrefix="rs" />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Provincia</label>
                <Select styles={customStyles} options={provinceOptions} value={provinceOptions.find(o => o.value === province) || provinceOptions[0]} onChange={(s) => handleChange('province', s.value)} isSearchable={false} menuPortalTarget={document.body} classNamePrefix="rs" />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Radio Máximo</label>
                <Select styles={customStyles} options={radiusOptions} value={radiusOptions.find(o => o.value === radius) || radiusOptions[1]} onChange={(s) => handleChange('radius', s.value)} isSearchable={false} menuPortalTarget={document.body} classNamePrefix="rs" />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Categoría</label>
                <Select styles={customStyles} options={priceCategoryOptions} value={priceCategoryOptions.find(o => o.value === priceCategory) || priceCategoryOptions[0]} onChange={(s) => handleChange('priceCategory', s.value)} isSearchable={false} menuPortalTarget={document.body} classNamePrefix="rs" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Ordenación</label>
                <Select styles={customStyles} options={sortOptions} value={sortOptions.find(o => o.value === sortBy) || sortOptions[0]} onChange={(s) => handleChange('sortBy', s.value)} isSearchable={false} menuPortalTarget={document.body} classNamePrefix="rs" />
              </div>
            </div>
            
            <div className="mt-2 border-t border-slate-200/50 dark:border-white/5 pt-4">
               <label className="flex items-center justify-between cursor-pointer glass-core border border-slate-200/50 dark:border-white/5 px-3 py-2 rounded-xl transition h-[36px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Abierto Ahora</span>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" checked={openNow || false} onChange={(e) => handleChange('openNow', e.target.checked)} className="sr-only peer" />
                    <div className="w-8 h-4 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[100%] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary border border-slate-200/50 dark:border-white/10"></div>
                  </div>
               </label>
            </div>

            <button onClick={() => setIsModalOpen(false)} className="mt-6 w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-[0_4px_15px_rgba(255,59,48,0.4)] active:scale-95 transition-transform text-[15px]">
              Ver Resultados
            </button>
          </div>
        </div>
      , document.body)}
    </>
  );
}
