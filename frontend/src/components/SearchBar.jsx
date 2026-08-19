import React, { useState } from 'react';

export default function SearchBar({ onSearch, onGps, loadingSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <section className="native-card p-3.5 dark:bg-slate-900 dark:border-slate-800">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            placeholder="Dirección o municipio..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-100/80 dark:bg-slate-800 border-0 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-white/10 font-medium transition outline-none"
          />
          {loadingSearch && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-slate-900 dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="submit" className="flex-1 sm:flex-initial bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition">
            Buscar
          </button>
          <button 
            type="button" 
            onClick={onGps}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Mi GPS</span>
          </button>
        </div>
      </form>
    </section>
  );
}
