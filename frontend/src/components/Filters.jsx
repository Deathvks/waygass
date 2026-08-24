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
  const [isOpen, setIsOpen] = useState(false);
  const { fuelType, province, radius, sortBy, priceCategory, openNow } = filters;

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const isDark = document.documentElement.classList.contains('dark');

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)', // slate-800/80 vs slate-100/80
      border: state.isFocused ? (isDark ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(15, 23, 42, 0.1)') : '2px solid transparent',
      borderRadius: '0.75rem',
      boxShadow: 'none',
      minHeight: '36px',
      fontSize: '0.75rem',
      fontWeight: 500,
      cursor: 'pointer',
      '&:hover': {
        border: state.isFocused ? (isDark ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(15, 23, 42, 0.1)') : '2px solid transparent'
      }
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#0f172a' : isFocused ? (isDark ? '#334155' : '#f1f5f9') : 'transparent',
      color: isSelected ? 'white' : (isDark ? '#f8fafc' : '#1e293b'),
      fontSize: '0.75rem',
      fontWeight: 500,
      cursor: 'pointer',
      padding: '8px 12px'
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#f8fafc' : '#1e293b'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? '#94a3b8' : '#64748b',
      padding: '4px 8px',
      '&:hover': { color: isDark ? '#f8fafc' : '#0f172a' }
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
    <section className="native-card flex flex-col">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition rounded-[24px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full brand-gradient-bg flex items-center justify-center text-white shadow-sm shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          </div>
          <div className="flex flex-col items-start min-w-0 pr-2">
            <span className="text-sm truncate max-w-full">Opciones de Búsqueda</span>
            <span className="text-[10px] font-medium text-orange-500 uppercase tracking-wider truncate max-w-full">{getActiveFuelLabel()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isOpen && <span className="hidden sm:block text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Desplegar</span>}
          <svg className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0 flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              {FUELS.map(fuel => (
                <button 
                  key={fuel.id}
                  onClick={() => handleChange('fuelType', fuel.id)}
                  className={`flex-1 min-w-[100px] text-center px-2 py-1.5 rounded-xl text-xs sm:text-sm transition ${
                    fuelType === fuel.id 
                      ? 'font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' 
                      : 'font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {fuel.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs relative z-50">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Marca</label>
              <Select 
                styles={customStyles}
                options={brandOptions}
                value={brandOptions.find(o => o.value === filters.brand) || brandOptions[0]}
                onChange={(selected) => handleChange('brand', selected.value)}
                isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                maxMenuHeight={500}
                classNamePrefix="rs"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Provincia</label>
              <Select 
                styles={customStyles}
                options={provinceOptions}
                value={provinceOptions.find(o => o.value === province) || provinceOptions[0]}
                onChange={(selected) => handleChange('province', selected.value)}
                isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                classNamePrefix="rs"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Radio Máximo</label>
              <Select 
                styles={customStyles}
                options={radiusOptions}
                value={radiusOptions.find(o => o.value === radius) || radiusOptions[1]}
                onChange={(selected) => handleChange('radius', selected.value)}
                isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                classNamePrefix="rs"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Categoría</label>
              <Select 
                styles={customStyles}
                options={priceCategoryOptions}
                value={priceCategoryOptions.find(o => o.value === priceCategory) || priceCategoryOptions[0]}
                onChange={(selected) => handleChange('priceCategory', selected.value)}
                isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                classNamePrefix="rs"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Ordenación</label>
              <Select 
                styles={customStyles}
                options={sortOptions}
                value={sortOptions.find(o => o.value === sortBy) || sortOptions[0]}
                onChange={(selected) => handleChange('sortBy', selected.value)}
                isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                classNamePrefix="rs"
              />
            </div>

            <div className="flex flex-col justify-end mt-1">
              <label className="flex items-center justify-between cursor-pointer bg-slate-100/80 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition h-[36px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Abierto Ahora</span>
                <div className="relative inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={openNow || false} 
                    onChange={(e) => handleChange('openNow', e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-8 h-4 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-400 shadow-inner"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
