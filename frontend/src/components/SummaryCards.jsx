import React from 'react';

export default function SummaryCards({ stats, tankSize, isPro }) {
  const { min, avg, maxSavings } = stats;

  return (
    <section className="grid grid-cols-3 gap-2.5">
      <div className="bg-transparent text-primary dark:bg-transparent rounded-lg p-3.5 flex flex-col justify-between border border-primary/20 dark:border-slate-700">
        <span className="text-[10px] font-bold text-primary-dark dark:text-primary uppercase tracking-wider flex items-center gap-1">
          <i className="fa-solid fa-arrow-trend-down text-[9px]"></i>
          Mínimo
        </span>
        <p className="text-base sm:text-lg font-bold text-primary-dark dark:text-white mt-1">
          {min > 0 ? `${min.toFixed(3)} €` : '-'}
        </p>
      </div>

      <div className="bg-white dark:bg-transparent rounded-lg p-3.5 flex flex-col justify-between border border-slate-100 dark:border-slate-700">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <i className="fa-solid fa-calculator text-[9px]"></i>
          Media
        </span>
        <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-1">
          {avg > 0 ? `${avg.toFixed(3)} €` : '-'}
        </p>
      </div>

      <div className="bg-transparent rounded-lg p-3.5 text-slate-900 dark:text-white flex flex-col justify-between border border-slate-200 dark:border-slate-700">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
          <i className="fa-solid fa-piggy-bank text-primary text-[10px]"></i>
          Ahorro Máx.
        </span>
        <p className="text-base sm:text-lg font-bold text-primary mt-1 flex items-center gap-1">
          {isPro ? (
            maxSavings > 0 ? `+${maxSavings.toFixed(2)} €` : '-'
          ) : (
            <span className="text-xs bg-slate-800/50 dark:bg-transparent px-2 py-0.5 rounded flex items-center gap-1.5 border border-slate-700 dark:border-slate-800 text-slate-300 font-bold">
              <i className="fa-solid fa-lock text-[9px] text-amber-400"></i>
              PRO
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
