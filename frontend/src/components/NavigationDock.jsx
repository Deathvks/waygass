import React from 'react';

export default function NavigationDock({ activeTab, setActiveTab, isAdmin }) {
       const tabs = [
    { id: 'map', viewBox: '0 0 24 24', icon: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>, label: 'Mapa' },
    { id: 'list', viewBox: '0 0 24 24', icon: <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></>, label: 'Lista' },
    { id: 'garage', viewBox: '0 0 24 24', icon: <><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/></>, label: 'Garaje' },
    ...(isAdmin ? [{ id: 'security', viewBox: '0 0 24 24', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>, label: 'Escudo' }] : [])
  ];

 return (
 <div className="flex justify-around items-center h-14 px-2 w-full max-w-md mx-auto rounded-2xl bg-white dark:bg-[#111] border border-slate-200/50 dark:border-white/10">
 {tabs.map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`flex items-center justify-center rounded-full px-4 h-10 transition-all duration-300 ${
 activeTab === tab.id 
 ? 'bg-primary/20 text-primary ' 
 : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
 }`}
 >
 <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox={tab.viewBox || "0 0 24 24"}>
 {tab.icon}
 </svg>
 {activeTab === tab.id && (
 <span className="ml-1.5 text-[11px] font-bold tracking-wide font-mono">{tab.label}</span>
 )}
 </button>
 ))}
 </div>
 );
}
