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
      className="flex justify-around items-center h-14 px-2 w-full max-w-md mx-auto rounded-2xl bg-white/20 dark:bg-black/35 border border-white/30 dark:border-white/10 shadow-2xl transition-all"
      style={{
        backdropFilter: 'blur(28px) saturate(190%)',
        WebkitBackdropFilter: 'blur(28px) saturate(190%)'
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center justify-center rounded-full px-4 h-10 transition-all duration-300 ${
            activeTab === tab.id 
              ? 'bg-primary/20 text-primary font-bold' 
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <i className={`${tab.icon} text-base shrink-0`}></i>
          {activeTab === tab.id && (
            <span className="ml-2 text-xs font-bold tracking-wide">{tab.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
