import React, { useState, useEffect } from 'react';

const POPULAR_BRANDS = [
  { id: 'seat', name: 'SEAT', logo: 'https://unpkg.com/simple-icons@11.12.0/icons/seat.svg', models: [{name: 'Ibiza', tank: 40}, {name: 'León', tank: 50}, {name: 'Arona', tank: 40}] },
  { id: 'vw', name: 'Volkswagen', logo: 'https://unpkg.com/simple-icons@11.12.0/icons/volkswagen.svg', models: [{name: 'Golf', tank: 50}, {name: 'Polo', tank: 40}, {name: 'T-Roc', tank: 50}] },
  { id: 'peugeot', name: 'Peugeot', logo: 'https://unpkg.com/simple-icons@11.12.0/icons/peugeot.svg', models: [{name: '208', tank: 44}, {name: '308', tank: 52}, {name: '3008', tank: 53}] },
  { id: 'toyota', name: 'Toyota', logo: 'https://unpkg.com/simple-icons@11.12.0/icons/toyota.svg', models: [{name: 'Corolla', tank: 43}, {name: 'Yaris', tank: 36}, {name: 'C-HR', tank: 43}] },
  { id: 'renault', name: 'Renault', logo: 'https://unpkg.com/simple-icons@11.12.0/icons/renault.svg', models: [{name: 'Clio', tank: 42}, {name: 'Megane', tank: 50}, {name: 'Captur', tank: 48}] },
  { id: 'dacia', name: 'Dacia', logo: 'https://unpkg.com/simple-icons@11.12.0/icons/dacia.svg', models: [{name: 'Sandero', tank: 50}, {name: 'Duster', tank: 50}] },
];

function AddManualView({ onBack, onSave }) {
  const [tank, setTank] = useState(50);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-1 mb-2">
        <button onClick={onBack} className="p-1 text-slate-400 hover:text-primary transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ajuste Manual</h4>
      </div>

      <div className="bg-white dark:bg-[#1a1a1c] border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl">
        <div className="flex justify-between items-end mb-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Capacidad del depósito</label>
          <span className="text-2xl font-black text-primary">{tank}L</span>
        </div>
        <input 
          type="range" 
          min="20" 
          max="120" 
          step="1"
          value={tank}
          onChange={(e) => setTank(parseInt(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs font-medium text-slate-400 mt-2 mb-6">
          <span>20L (Moto/Híbrido)</span>
          <span>120L (Furgoneta)</span>
        </div>
        
        <button onClick={() => onSave(tank)} className="w-full bg-primary text-slate-900 font-bold py-3 rounded-xl hover:scale-105 transition-transform">
          Guardar Vehículo
        </button>
      </div>
    </div>
  );
}

export default function GarageView({ settings, setSettings }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [mode, setMode] = useState('list'); // 'list', 'add_catalog', 'add_manual', 'edit_manual'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const garage = settings.garage || [];
  const activeGarageId = settings.activeGarageId || (garage.length > 0 ? garage[0].id : null);

  // Sync backwards compatibility
  useEffect(() => {
    if (activeGarageId) {
      const activeCar = garage.find(c => c.id === activeGarageId);
      if (activeCar && (activeCar.name !== settings.vehicleName || activeCar.tankSize !== settings.tankSize)) {
        setSettings(prev => ({
          ...prev,
          vehicleName: activeCar.name,
          tankSize: activeCar.tankSize
        }));
      }
    }
  }, [activeGarageId, garage, settings.vehicleName, settings.tankSize, setSettings]);

  // Ensure default state
  useEffect(() => {
    if (garage.length === 0 && settings.vehicleName && !settings.garage) {
      // Migrate old single car to garage array
      setSettings(prev => ({
        ...prev,
        garage: [{ id: Date.now().toString(), name: prev.vehicleName, tankSize: prev.tankSize }],
        activeGarageId: Date.now().toString()
      }));
    }
  }, []);

  const handleSelectModel = (brandName, model) => {
    const newCar = {
      id: Date.now().toString(),
      name: `${brandName} ${model.name}`,
      tankSize: model.tank,
      originalTankSize: model.tank
    };
    setSettings(prev => ({
      ...prev,
      garage: [...(prev.garage || []), newCar],
      activeGarageId: newCar.id
    }));
    setSelectedBrand(null);
    setMode('list');
  };

  const handleAddManual = (val) => {
    const newCar = {
      id: Date.now().toString(),
      name: `Personalizado (${val}L)`,
      tankSize: val
    };
    setSettings(prev => ({
      ...prev,
      garage: [...(prev.garage || []), newCar],
      activeGarageId: newCar.id
    }));
    setMode('list');
  };

  const handleEditTank = (id, newTankSize) => {
    setSettings(prev => ({
      ...prev,
      garage: (prev.garage || []).map(c => 
        c.id === id ? { ...c, tankSize: newTankSize, name: c.name.includes('Personalizado') ? `Personalizado (${newTankSize}L)` : c.name } : c
      )
    }));
  };

  const handleDelete = (id) => {
    setSettings(prev => {
      const newGarage = (prev.garage || []).filter(c => c.id !== id);
      return {
        ...prev,
        garage: newGarage,
        activeGarageId: newGarage.length > 0 ? newGarage[0].id : null,
        vehicleName: newGarage.length === 0 ? '' : prev.vehicleName,
        tankSize: newGarage.length === 0 ? 50 : prev.tankSize
      };
    });
  };

  const activeCar = garage.find(c => c.id === activeGarageId);

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto no-scrollbar pb-24">
      <div className="p-6 pb-2 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between sticky top-0 bg-[#f5f5f7] dark:bg-[#000000] z-10">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Mi Garaje</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {garage.length} / 3 vehículos configurados.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1">
        
        {/* VIEW: LIST GARAGE */}
        {mode === 'list' && (
          <>
            {garage.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white px-1">Tus Vehículos</h4>
                <div className="flex flex-col gap-3">
                  {garage.map(car => (
                    <div 
                      key={car.id} 
                      onClick={() => setSettings(prev => ({...prev, activeGarageId: car.id}))}
                      className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                        activeGarageId === car.id 
                        ? 'bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent border-primary/40' 
                        : 'bg-white dark:bg-[#1a1a1c] border-slate-200/50 dark:border-white/5 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          {activeGarageId === car.id && <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Activo</p>}
                          <h3 className={`text-lg font-bold ${activeGarageId === car.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                            {car.name}
                          </h3>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(car.id); }}
                          className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <label className="text-xs font-bold text-slate-500">Capacidad (Litros)</label>
                          <p className="text-xl font-black text-slate-800 dark:text-white">{car.tankSize}L</p>
                        </div>
                        {activeGarageId === car.id && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setMode('edit_manual'); }}
                            className="text-xs font-bold bg-white/50 dark:bg-white/10 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-primary transition-colors text-slate-700 dark:text-slate-300"
                          >
                            Ajustar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {garage.length < 3 && (
                  <button 
                    onClick={() => setMode('add_catalog')}
                    className="w-full py-4 mt-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Añadir otro vehículo
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Garaje vacío</h3>
                <p className="text-sm text-slate-500 mb-6">Añade tu coche para calcular llenados exactos.</p>
                <button 
                  onClick={() => setMode('add_catalog')}
                  className="bg-primary text-slate-900 font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
                >
                  Añadir Vehículo
                </button>
              </div>
            )}
          </>
        )}

        {/* VIEW: ADD CATALOG */}
        {mode === 'add_catalog' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-1 mb-2">
              <button onClick={() => { setMode('list'); setSelectedBrand(null); }} className="p-1 text-slate-400 hover:text-primary transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedBrand ? `Modelos ${selectedBrand.name}` : 'Selecciona marca'}</h4>
            </div>

            {!selectedBrand ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {POPULAR_BRANDS.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand)}
                      className="bg-white dark:bg-[#1a1a1c] border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                        <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain dark:invert" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{brand.name}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setMode('add_manual')}
                  className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Mi coche no está aquí (Ajuste Manual)
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedBrand.models.map((model, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectModel(selectedBrand.name, model)}
                    className="bg-white dark:bg-[#1a1a1c] border border-slate-200/50 dark:border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left"
                  >
                    <span className="font-bold text-slate-800 dark:text-white">{model.name}</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">{model.tank} L</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: ADD MANUAL */}
        {mode === 'add_manual' && (
          <AddManualView onBack={() => setMode('add_catalog')} onSave={handleAddManual} />
        )}

        {/* VIEW: EDIT MANUAL */}
        {mode === 'edit_manual' && activeCar && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-1 mb-2">
              <button onClick={() => setMode('list')} className="p-1 text-slate-400 hover:text-primary transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ajustar {activeCar.name}</h4>
            </div>

            <div className="bg-white dark:bg-[#1a1a1c] border border-slate-200/50 dark:border-white/5 p-5 rounded-2xl">
              <div className="flex justify-between items-end mb-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Capacidad real (L)</label>
                <span className="text-2xl font-black text-primary">{activeCar.tankSize}L</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="120" 
                step="1"
                value={activeCar.tankSize}
                onChange={(e) => handleEditTank(activeCar.id, parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs font-medium text-slate-400 mt-2 mb-4">
                <span>20L</span>
                <span>120L</span>
              </div>
              
              {activeCar.originalTankSize && activeCar.tankSize !== activeCar.originalTankSize && (
                <button 
                  onClick={() => handleEditTank(activeCar.id, activeCar.originalTankSize)}
                  className="w-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                  Restaurar a original ({activeCar.originalTankSize}L)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (() => {
        const carToDelete = garage.find(c => c.id === deleteConfirmId);
        if (!carToDelete) return null;
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6" onClick={() => setDeleteConfirmId(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div 
              className="relative bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl p-6 w-full max-w-sm border border-slate-200/50 dark:border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 mx-auto flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">¿Eliminar vehículo?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Estás a punto de eliminar <span className="font-bold text-slate-700 dark:text-slate-200">{carToDelete.name}</span> de tu garaje. Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => { handleDelete(deleteConfirmId); setDeleteConfirmId(null); }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
