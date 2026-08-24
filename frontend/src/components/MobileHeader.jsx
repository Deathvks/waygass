import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function MobileHeader({ user, openProfile, onSearch, loadingSearch, onGps, isUsingGps }) {
  const [query, setQuery] = useState('');

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [query]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      setIsFocused(false);
      document.activeElement?.blur();
      onSearch(query);
    }
  };

  return (
    <div className={`relative flex items-center glass-core bg-white/90 dark:bg-[#1c1c1e]/90 shadow-md border-slate-200/60 dark:border-white/10 rounded-full px-4 py-1.5 gap-2 pointer-events-auto w-full mx-auto shadow-sm transition-all duration-300 ${isFocused || query.length > 0 ? "max-w-[95%]" : "max-w-[340px]"}`}>
      
      {/* Search Icon */}
      <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-[15px] pl-2 pr-12 text-slate-900 dark:text-white placeholder-slate-500/70 dark:placeholder-slate-400 font-medium h-9 tracking-tight" onFocus={() => { setShowSuggestions(true); setIsFocused(true); }} onBlur={() => { setTimeout(() => setShowSuggestions(false), 200); setIsFocused(false); }}
        />
        {loadingSearch && (
          <div className="absolute right-2">
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
            className="absolute right-2 w-6 h-6 flex items-center justify-center bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 text-slate-500 dark:text-slate-400 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
  
      
        
  
      </form>

      {!(isFocused || query.length > 0) && (
        <>
          {/* Divider */}
      <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 shrink-0 mx-0.5"></div>

      {/* GPS Button */}
      <button 
        type="button"
        onClick={onGps} 
        className={`shrink-0 p-1.5 transition ${isUsingGps ? "text-primary drop-shadow-[0_0_8px_rgba(0,219,233,0.5)]" : "text-slate-400 hover:text-primary"}`}
        title="Usar mi ubicación actual"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isUsingGps ? 1.8 : 1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </button>

      {/* Profile Button */}
      <button 
        onClick={openProfile} 
        className="w-7 h-7 shrink-0 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5 hover:border-primary transition overflow-hidden ml-0.5"
      >
        <span className="font-bold text-slate-600 dark:text-slate-300 text-[10px]">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </span>
      </button>
        </>
      )}

    {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full mt-3 left-0 w-full bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl rounded-xl border border-slate-200/50 dark:border-white/10 overflow-hidden z-[500]">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                type="button"
                onClick={() => {
                  setQuery(s.display_name);
                  setShowSuggestions(false);
                  onSearch(s.display_name);
                }}
                className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a1a1c] border-b border-slate-100 dark:border-white/5 last:border-0 truncate"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}
