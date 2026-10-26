import React from 'react';

export default function NavigationDock({ activeTab, setActiveTab, isAdmin }) {
  const tabs = [
    { id: 'map', icon: 'fa-solid fa-map-location-dot', label: 'Mapa' },
    { id: 'list', icon: 'fa-solid fa-list-ul', label: 'Lista' },
    { id: 'garage', icon: 'fa-solid fa-car', label: 'Garaje' },
    ...(isAdmin ? [{ id: 'security', icon: 'fa-solid fa-shield-halved', label: 'Seguridad' }] : [])
  ];

  return (
    <div className="flex justify-around items-center h-14 px-2 w-full max-w-md mx-auto rounded-2xl bg-white dark:bg-[#111] border border-slate-200/50 dark:border-white/10 shadow-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center justify-center rounded-full px-4 h-10 transition-all duration-300 ${
            activeTab === tab.id 
              ? 'bg-primary/20 text-primary' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
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
