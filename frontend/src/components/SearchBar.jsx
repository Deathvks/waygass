import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function SearchBar({ onSearch, onGps, loadingSearch, isUsingGps }) {
 const [query, setQuery] = useState('');

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = { data: await (await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=-18.16,27.63,4.32,43.79&limit=5`)).json() };
        if(res.data && res.data.features) {
          const formatted = res.data.features
            .filter(f => f.properties.countrycode === 'ES')
            .map(f => {
              let p = f.properties;
              let parts = [];
              if (p.name) parts.push(p.name);
              
              if (p.street && p.street !== p.name) {
                parts.push(p.housenumber ? `${p.street} ${p.housenumber}` : p.street);
              } else if (p.housenumber && p.name) {
                parts[0] = `${p.name} ${p.housenumber}`;
              }
              
              if (p.city && p.city !== p.name) parts.push(p.city);
              else if (p.town && p.town !== p.name) parts.push(p.town);
              else if (p.village && p.village !== p.name) parts.push(p.village);
              
              if (p.state && p.state !== p.name && p.state !== p.city) parts.push(p.state);
              
              return { display_name: parts.filter(Boolean).join(', ') };
            });
          setSuggestions(formatted);
        } else {
          setSuggestions([]);
        }
      } catch(e) {}
    }, 150);
    return () => clearTimeout(debounceRef.current);
  }, [query]);
  

 const handleSubmit = (e) => {
 e.preventDefault();
 if (query.trim()) onSearch(query);
 };

 return (
 <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111] flex items-center shadow-lg border border-slate-200/50 dark:border-white/10 w-full rounded-2xl p-1.5 transition-all focus-within: focus-within:border-primary/50 relative z-20">
 
 <div className="relative flex-1 flex items-center">
 <svg className="w-4 h-4 absolute left-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
 </svg>
 
 <input 
 type="text" 
 placeholder="Dirección o municipio..." 
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 className="w-full bg-transparent border-none outline-none pl-10 pr-12 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-500 font-medium" onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
 />
 
 {loadingSearch && (
 <div className="absolute right-3">
 <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
 )}
        {!loadingSearch && query.length > 0 && (
          <button 
            type="button"
            onClick={() => {
              setQuery('');
              onGps();
            }}
            className="absolute right-3 w-6 h-6 flex items-center justify-center bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 text-slate-500 dark:text-slate-400 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
  
 </div>

 <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 shrink-0 mx-1"></div>

 <button 
 type="button" 
 onClick={onGps}
 title="Usar mi ubicacin actual"
 className={`shrink-0 p-2 transition flex items-center justify-center rounded-xl ${isUsingGps ? "text-primary drop-shadow-[0_0_8px_rgba(0,219,233,0.5)]" : "text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5"}`}
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isUsingGps ? 1.8 : 1.2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
 </svg>
 </button>
 
 
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full mt-2 left-0 w-full bg-[#f5f5f7] dark:bg-[#000000] shadow-xl rounded-xl border border-slate-200/50 dark:border-white/10 overflow-hidden z-[500]">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                type="button"
                onClick={() => {
                  setQuery(s.display_name);
                  setShowSuggestions(false);
                  onSearch(s.display_name);
                }}
                className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0 truncate"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
  
      </form>
 );
}
