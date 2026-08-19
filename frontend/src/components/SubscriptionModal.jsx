import React from 'react';

export default function SubscriptionModal({ isOpen, onClose, onActivatePro }) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/50 backdrop-blur-md flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[88vh] overflow-y-auto sheet-scroll p-6 shadow-2xl flex flex-col gap-5 border border-slate-100 dark:border-slate-800 relative">
        
        <div className="w-9 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto -mt-2 mb-1 sm:hidden"></div>

        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          
          {/* Epic Glowing Icon */}
          <div className="relative mb-8 mt-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 blur-2xl opacity-40 animate-pulse rounded-full"></div>
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-2xl relative z-10 border border-slate-700/50 dark:border-white/20">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            
            {/* Sparkles */}
            <div className="absolute -top-3 -right-3 text-amber-500 animate-bounce delay-75">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6-6.2-4.5h7.6z"/></svg>
            </div>
          </div>

          <h2 className="font-black text-3xl sm:text-4xl tracking-tighter mb-3">
            <span className="text-slate-900 dark:text-white">WayGass </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">PRO</span>
          </h2>
          
          <div className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase mb-6 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Próximamente
          </div>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed font-medium">
            Estamos preparando la mayor actualización hasta la fecha. Ahorro inteligente, tendencias de precios y 0% de publicidad.
          </p>

        </div>

      </div>
    </div>
  );
}
