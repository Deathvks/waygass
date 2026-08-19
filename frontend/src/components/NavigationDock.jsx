import React from 'react';

export default function NavigationDock({ activeTab, setActiveTab, openProfile }) {
  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto max-w-xs z-50 lg:hidden px-4">
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-700/80 rounded-full py-2 px-6 flex items-center justify-around shadow-lg dark:shadow-none">
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
            activeTab === 'list' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span>Lista</span>
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
            activeTab === 'map' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          <span>Mapa</span>
        </button>
        <button 
          onClick={openProfile}
          className="flex flex-col items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors hover:text-slate-900 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
