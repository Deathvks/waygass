import React from 'react';

export default function SummaryCards({ stats, tankSize, isPro }) {
 const { min, avg, maxSavings } = stats;

 return (
 <section className="grid grid-cols-3 gap-2.5">
 <div className="bg-transparent text-primary dark:bg-transparent dark:border-white/10 rounded-lg p-3.5 flex flex-col justify-between border border-primary/20 dark:border-slate-700">
 <span className="text-[10px] font-medium text-primary-dark dark:text-primary uppercase tracking-wider">Mínimo</span>
 <p className="text-base sm:text-lg font-semibold text-primary-dark dark:text-slate-900 dark:text-white mt-1">
 {min > 0 ? `${min.toFixed(3)} €` : '-'}
 </p>
 </div>

 <div className="bg-white dark:bg-transparent dark:border-white/10 rounded-lg p-3.5 flex flex-col justify-between border border-slate-100 dark:border-slate-700">
 <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Media</span>
 <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-900 dark:text-white mt-1">
 {avg > 0 ? `${avg.toFixed(3)} €` : '-'}
 </p>
 </div>

 <div className="bg-transparent border border-slate-200 dark:bg-transparent dark:border-white/10 dark:bg-slate-700 rounded-lg p-3.5 text-slate-900 dark:text-white flex flex-col justify-between border border-slate-800 dark:border-slate-600">
 <span className="text-[10px] font-medium text-slate-400 dark:text-slate-300 uppercase tracking-wider">Ahorro Máx.</span>
 <p className="text-base sm:text-lg font-semibold text-primary mt-1 flex items-center gap-1">
 {isPro ? (
 maxSavings > 0 ? `+${maxSavings.toFixed(2)} €` : '-'
 ) : (
 <span className="text-xs bg-slate-800/50 dark:bg-transparent border border-slate-200 dark:bg-transparent dark:border-white/10 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700 dark:border-slate-800 text-slate-300">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
 PRO
 </span>
 )}
 </p>
 </div>
 </section>
 );
}
