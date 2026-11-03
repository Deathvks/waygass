import React from 'react';

export default function NavigationDock({ activeTab, setActiveTab, isAdmin }) {
  const tabs = [
    { id: 'map', icon: 'fa-solid fa-map-location-dot', label: 'Mapa' },
    { id: 'list', icon: 'fa-solid fa-list-ul', label: 'Lista' },
    { id: 'garage', icon: 'fa-solid fa-car', label: 'Garaje' },
    ...(isAdmin ? [{ id: 'security', icon: 'fa-solid fa-shield-halved', label: 'Seguridad' }] : [])
  ];

  return (
    <div 
      className="flex justify-around items-center h-14 px-2 w-[calc(100%-2rem)] max-w-[380px] mx-auto rounded-2xl bg-white/25 dark:bg-black/40 border border-white/30 dark:border-white/10 shadow-2xl transition-all"
      style={{
        backdropFilter: 'blur(28px) saturate(190%)',
        WebkitBackdropFilter: 'blur(28px) saturate(190%)'
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center justify-center rounded-xl px-3.5 sm:px-4 h-10 sm:h-11 transition-all duration-200 shrink-0 active:scale-95 ${
            activeTab === tab.id 
              ? 'bg-primary/20 text-primary font-bold shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <i className={`${tab.icon} text-base sm:text-lg shrink-0`}></i>
          {activeTab === tab.id && (
            <span className="ml-2 text-xs font-bold tracking-wide whitespace-nowrap">{tab.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
