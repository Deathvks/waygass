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

export const BRAND_OPTIONS = [
  { value: 'all', label: 'Todas las marcas' },
  { value: 'REPSOL', label: 'Repsol' },
  { value: 'CEPSA', label: 'Cepsa / Moeve' },
  { value: 'BP', label: 'BP' },
  { value: 'GALP', label: 'Galp' },
  { value: 'SHELL', label: 'Shell' },
  { value: 'PLENOIL', label: 'Plenoil' },
  { value: 'PETROPRIX', label: 'Petroprix' },
  { value: 'BALLENOIL', label: 'Ballenoil' },
  { value: 'AVIA', label: 'Avia' },
  { value: 'DISA', label: 'Disa' },
  { value: 'CAMPSA', label: 'Campsa' },
  { value: 'PETRONOR', label: 'Petronor' },
  { value: 'BONAREA', label: 'BonÀrea' },
  { value: 'ESCLATOIL', label: 'EsclatOil' },
  { value: 'Q8', label: 'Q8' },
  { value: 'CARREFOUR', label: 'Carrefour' },
  { value: 'ALCAMPO', label: 'Alcampo' },
  { value: 'EROSKI', label: 'Eroski' },
  { value: 'Otras', label: 'Otras marcas independientes' }
];

export default function Filters({ filters, setFilters }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fuelType, province, radius, sortBy, priceCategory, openNow, brand, brands } = filters;

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const isDark = document.documentElement.classList.contains('dark');

  // Múltiples marcas seleccionadas
  const selectedBrands = Array.isArray(brands)
    ? brands
    : (brand && brand !== 'all' && brand !== 'multi' ? [brand] : []);

  const toggleBrand = (bVal) => {
    if (bVal === 'all') {
      setFilters(prev => ({ ...prev, brands: [], brand: 'all' }));
      return;
    }
    const exists = selectedBrands.includes(bVal);
    const updated = exists ? selectedBrands.filter(b => b !== bVal) : [...selectedBrands, bVal];
    setFilters(prev => ({
      ...prev,
      brands: updated,
      brand: updated.length === 1 ? updated[0] : (updated.length === 0 ? 'all' : 'multi')
    }));
  };

  const removeBrand = (bVal) => {
    const updated = selectedBrands.filter(b => b !== bVal);
    setFilters(prev => ({
      ...prev,
      brands: updated,
      brand: updated.length === 1 ? updated[0] : (updated.length === 0 ? 'all' : 'multi')
    }));
  };

  const clearAllBrands = () => {
    setFilters(prev => ({ ...prev, brands: [], brand: 'all' }));
  };

  const getBrandLabel = (val) => {
    const found = BRAND_OPTIONS.find(b => b.value === val);
    return found ? found.label : val;
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
    { value: '25', label: 'Lleida' }, { value: '27', label: 'Lugo' }, { value: '28', label: 'Madrid' },
    { value: '29', label: 'Málaga' }, { value: '52', label: 'Melilla' }, { value: '30', label: 'Murcia' },
    { value: '31', label: 'Navarra' }, { value: '32', label: 'Ourense' }, { value: '34', label: 'Palencia' },
    { value: '35', label: 'Las Palmas' }, { value: '36', label: 'Pontevedra' }, { value: '26', label: 'La Rioja' },
    { value: '37', label: 'Salamanca' }, { value: '38', label: 'S.C. de Tenerife' }, { value: '40', label: 'Segovia' },
    { value: '41', label: 'Sevilla' }, { value: '42', label: 'Soria' }, { value: '43', label: 'Tarragona' },
    { value: '44', label: 'Teruel' }, { value: '45', label: 'Toledo' }, { value: '46', label: 'Valencia' },
    { value: '47', label: 'Valladolid' }, { value: '49', label: 'Zamora' }, { value: '50', label: 'Zaragoza' }
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

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? '#111' : '#fff',
      border: state.isFocused ? '2px solid var(--color-primary)' : '2px solid transparent',
      borderRadius: '0.75rem',
      boxShadow: 'none',
      minHeight: '40px',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      color: isDark ? '#fff' : '#0f172a',
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? '#64748b' : '#94a3b8',
      fontSize: '0.875rem'
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
      maxHeight: '220px',
      '::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? 'var(--color-primary)' : isFocused ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : 'transparent',
      color: isSelected ? '#fff' : (isDark ? '#fff' : '#0f172a'),
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      padding: '10px 14px',
      borderRadius: '0.5rem',
      marginBottom: '2px'
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#fff' : '#0f172a',
      fontWeight: 600
    }),
    menuPortal: base => ({ ...base, zIndex: 9999999 }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? '#000' : '#fff',
      borderRadius: '0.75rem',
      border: 'none',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
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
    <div className="flex flex-col gap-3">
      {/* SOLID FUEL CONTAINER */}
      <div className="flex flex-wrap items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-2xl">
        {FUELS.map(fuel => (
          <button 
            key={fuel.id}
            onClick={() => handleChange('fuelType', fuel.id)}
            className={`flex-1 min-w-[100px] text-center px-2 py-2 rounded-xl text-xs sm:text-sm transition ${
              fuelType === fuel.id 
              ? 'font-bold bg-primary text-white shadow-md' 
              : 'font-medium text-slate-500 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {fuel.label}
          </button>
        ))}
      </div>

      {/* SOLID FILTROS BUTTON */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 bg-black/5 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
      >
        <i className="fa-solid fa-sliders text-sm text-slate-500 dark:text-slate-400"></i>
        <span>Más Filtros y Opciones</span>
        {selectedBrands.length > 0 && (
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary text-white">
            {selectedBrands.length} {selectedBrands.length === 1 ? 'marca' : 'marcas'}
          </span>
        )}
      </button>

      {/* CHIPS DE GASOLINERAS SELECCIONADAS FUERA DEL MODAL */}
      {selectedBrands.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 py-0.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <i className="fa-solid fa-gas-pump text-[10px] text-primary"></i>
            <span>Marcas:</span>
          </span>
          {selectedBrands.map(bVal => (
            <span
              key={bVal}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20"
            >
              <span>{getBrandLabel(bVal)}</span>
              <button
                type="button"
                onClick={() => removeBrand(bVal)}
                className="w-3.5 h-3.5 rounded-full hover:bg-primary/20 flex items-center justify-center text-[9px] transition-colors cursor-pointer"
                title={`Quitar ${getBrandLabel(bVal)}`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAllBrands}
            className="text-[10px] font-bold text-slate-400 hover:text-rose-500 underline ml-1 cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex flex-col justify-end sm:justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#f5f5f7] dark:bg-black w-full sm:w-[520px] rounded-t-[32px] sm:rounded-[32px] p-5 pt-3 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-fade-in">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto mb-2 mt-1 sm:hidden"></div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-sliders text-primary text-base"></i>
                <span>Opciones de Búsqueda</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer" title="Cerrar">
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-50">
              
              {/* SELECTOR MÚLTIPLE DE MARCAS / GASOLINERAS */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-1.5">
                    <i className="fa-solid fa-gas-pump text-primary text-xs"></i>
                    <span>Gasolineras / Marcas</span>
                  </label>
                  {selectedBrands.length > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400">
                      {selectedBrands.length} {selectedBrands.length === 1 ? 'seleccionada' : 'seleccionadas'}
                    </span>
                  )}
                </div>

                {/* CHIPS ARRIBA CON NOMBRE Y BOTÓN X PARA QUITAR CADA UNA */}
                {selectedBrands.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5 p-2 rounded-xl bg-slate-200/60 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
                    {selectedBrands.map(bVal => (
                      <span
                        key={bVal}
                        className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-sm transition-transform hover:scale-105"
                      >
                        <span>{getBrandLabel(bVal)}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBrand(bVal);
                          }}
                          className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                          title={`Quitar ${getBrandLabel(bVal)}`}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={clearAllBrands}
                      className="ml-auto text-[11px] font-bold text-slate-500 hover:text-rose-500 px-2 py-0.5 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      Limpiar todas
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2 font-medium">
                    Todas las marcas activas (selecciona abajo una o varias para filtrar)
                  </p>
                )}

                <Select
                  styles={customStyles}
                  options={BRAND_OPTIONS}
                  value={null}
                  placeholder={
                    selectedBrands.length === 0
                      ? "Seleccionar gasolineras (pulsa para añadir)..."
                      : `Añadir más marcas (${selectedBrands.length} activas)...`
                  }
                  onChange={(s) => {
                    if (s) toggleBrand(s.value);
                  }}
                  formatOptionLabel={(option) => {
                    if (option.value === 'all') {
                      return (
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{option.label}</span>
                          {selectedBrands.length === 0 && <i className="fa-solid fa-check text-primary text-xs"></i>}
                        </div>
                      );
                    }
                    const isSelected = selectedBrands.includes(option.value);
                    return (
                      <div className="flex items-center justify-between w-full">
                        <span className={isSelected ? 'font-bold text-primary' : 'text-slate-800 dark:text-slate-200'}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1.5 text-xs text-primary font-bold">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        )}
                      </div>
                    );
                  }}
                  closeMenuOnSelect={false}
                  isSearchable={true}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  classNamePrefix="rs"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Provincia</label>
                <Select styles={customStyles} options={provinceOptions} value={provinceOptions.find(o => o.value === province) || provinceOptions[0]} onChange={(s) => handleChange('province', s.value)} isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" classNamePrefix="rs" />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Radio Máximo</label>
                <Select styles={customStyles} options={radiusOptions} value={radiusOptions.find(o => o.value === radius) || radiusOptions[1]} onChange={(s) => handleChange('radius', s.value)} isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" classNamePrefix="rs" />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Categoría</label>
                <Select styles={customStyles} options={priceCategoryOptions} value={priceCategoryOptions.find(o => o.value === priceCategory) || priceCategoryOptions[0]} onChange={(s) => handleChange('priceCategory', s.value)} isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" classNamePrefix="rs" />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-2 font-bold text-sm">Ordenación</label>
                <Select styles={customStyles} options={sortOptions} value={sortOptions.find(o => o.value === sortBy) || sortOptions[0]} onChange={(s) => handleChange('sortBy', s.value)} isSearchable={false} menuPortalTarget={document.body} menuPosition="fixed" classNamePrefix="rs" />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
               <label className="flex items-center justify-between cursor-pointer bg-black/5 dark:bg-white/5 px-4 py-3 rounded-2xl transition">
                  <div className="flex flex-col">
                     <span className="font-bold text-slate-900 dark:text-white text-sm">Abierto Ahora</span>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" checked={openNow || false} onChange={(e) => handleChange('openNow', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
               </label>
            </div>

            <button onClick={() => setIsModalOpen(false)} className="mt-6 w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-md active:scale-95 transition-transform text-[15px] cursor-pointer">
              Ver Resultados
            </button>
          </div>
        </div>
      , document.body)}
    </div>
  );
}