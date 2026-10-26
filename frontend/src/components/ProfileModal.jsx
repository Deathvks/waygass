import React from 'react';

export default function ProfileModal({ isOpen, onClose, user, onLogout, openSub, openSettings }) {
 if (!isOpen || !user) return null;

 const isPro = user.subscription === 'pro' || user.subscription === 'premium';

 return (
 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
 {/* Fondo borroso y oscuro */}
 <div 
 className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
 onClick={onClose}
 ></div>

 {/* Contenido del modal */}
 <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl dark:bg-[#000000]/90 dark:backdrop-blur-2xl rounded-[32px] dark:border dark:border-slate-800 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
 
 {/* Decoración superior */}
 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-dark"></div>

 <button 
 onClick={onClose}
 className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-black text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
 >
 <i className="fa-solid fa-xmark text-sm"></i>
 </button>

 <div className="flex flex-col items-center mt-2">
 {/* Avatar inicial */}
 <div className="w-20 h-20 bg-gradient-to-tr from-primary/20 to-rose-100 rounded-full flex items-center justify-center mb-4 border-4 border-white dark:border-slate-900 relative">
 <span className="text-3xl font-black text-primary">{user.name.charAt(0).toUpperCase()}</span>
 {isPro && (
 <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-300 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
 <i className="fa-solid fa-crown text-[11px] text-amber-300"></i>
 </div>
 )}
 </div>

 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">
 {user.name} {user.lastName}
 </h3>
 
 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
 {user.email}
 </p>

 <div className="w-full space-y-3">
 {/* Estado de Suscripción */}
 <div className="bg-slate-50 dark:bg-black/50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-slate-700/50">
 <div>
 <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Plan Actual</p>
 <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{user.subscription}</p>
 </div>
 {!isPro && (
 <button 
 onClick={() => { onClose(); openSub(); }}
 className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[11px] px-3 py-1.5 rounded-full transition active:scale-95"
 >
 <i className="fa-solid fa-crown mr-1.5 text-amber-400"></i>Mejorar a PRO
 </button>
 )}
 </div>

 
        {/* Ajustes */}
        <button
          onClick={() => { onClose(); openSettings(); }}
          className="w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-black/50 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 border border-slate-100 dark:border-white/5"
        >
          <i className="fa-solid fa-gear text-base text-slate-500 dark:text-slate-400"></i>
          Ajustes de la App
        </button>

        {/* Cerrar Sesión */}
 <button
 onClick={() => {
 onClose();
 onLogout();
 }}
 className="w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
 >
 <i className="fa-solid fa-arrow-right-from-bracket text-sm"></i>
 Cerrar Sesión
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}



