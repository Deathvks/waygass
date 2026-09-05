import React from 'react';

export default function Header({ isPro, openSettings, openSub, user, openProfile, openSecurity }) {
 return (
 <header className="flex items-center justify-between w-full">
 {/* Left: Logo */}
 <div className="flex items-center gap-1.5 sm:gap-3">
 <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
 <img src="/logo.png" alt="WayGass" className="w-6 h-6 object-contain" />
 </div>
 <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
 WayGass
 </h1>
 {isPro && (
 <span className="text-[9px] bg-gradient-to-r from-amber-200 to-yellow-400 text-slate-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ">
 PRO
 </span>
 )}
 </div>
 
 {/* Right: Actions */}
 <div className="flex items-center gap-1 sm:gap-2">
 {!isPro && (
 <button 
 onClick={openSub}
 className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition hover:scale-105"
 >
 <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
 <span>PRO</span>
 </button>
 )}
 
      {user?.role === 'admin' && (
        <button onClick={openSecurity} className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-primary hover:bg-primary/10 dark:hover:bg-primary/10 transition" title="Ciberseguridad">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </button>
      )}
      <button onClick={openProfile} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition p-0.5">
 <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm">
 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
 </div>
 </button>
 
 <button onClick={openSettings} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition">
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
 </button>
 </div>
 </header>
 );
}


