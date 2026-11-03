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
      className="flex items-center justify-center gap-1 h-12 px-2 w-fit max-w-[calc(100vw-24px)] mx-auto rounded-full bg-white/20 dark:bg-black/40 border border-white/30 dark:border-white/10 shadow-2xl transition-all"
      style={{
        backdropFilter: 'blur(28px) saturate(190%)',
        WebkitBackdropFilter: 'blur(28px) saturate(190%)'
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center justify-center rounded-full px-2.5 sm:px-3.5 h-8 sm:h-9 transition-all duration-200 shrink-0 ${
            activeTab === tab.id 
              ? 'bg-primary/20 text-primary font-bold' 
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <i className={`${tab.icon} text-sm shrink-0`}></i>
          {activeTab === tab.id && (
            <span className="ml-1.5 text-xs font-bold tracking-wide whitespace-nowrap">{tab.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
