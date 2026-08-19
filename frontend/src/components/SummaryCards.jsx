import React from 'react';

export default function SummaryCards({ stats, tankSize, isPro }) {
  const { min, avg, maxSavings } = stats;

  return (
    <section className="grid grid-cols-3 gap-2.5">
      <div className="bg-orange-50 dark:bg-slate-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm border border-orange-100 dark:border-slate-700">
        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wider">Mínimo</span>
        <p className="text-base sm:text-lg font-black text-orange-900 dark:text-white mt-1">
          {min > 0 ? `${min.toFixed(3)} €` : '-'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-3.5 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-700">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Media</span>
        <p className="text-base sm:text-lg font-black text-slate-800 dark:text-white mt-1">
          {avg > 0 ? `${avg.toFixed(3)} €` : '-'}
        </p>
      </div>

      <div className="bg-slate-900 dark:bg-slate-700 rounded-3xl p-3.5 text-white flex flex-col justify-between shadow-sm border border-slate-800 dark:border-slate-600">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider">Ahorro Máx.</span>
        <p className="text-base sm:text-lg font-black text-orange-400 mt-1 flex items-center gap-1">
          {isPro ? (
            maxSavings > 0 ? `+${maxSavings.toFixed(2)} €` : '-'
          ) : (
            <span className="text-xs bg-slate-800/50 dark:bg-slate-900/50 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700 dark:border-slate-800 text-slate-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              PRO
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
