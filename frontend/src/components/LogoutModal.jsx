import React from 'react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Fondo oscuro con blur profundo */}
 <div 
 className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity"
 onClick={onClose}
 ></div>

 {/* Contenido del modal */}
 <div className="relative w-full max-w-sm bg-white dark:bg-[#1a1a1c] rounded-[32px] border border-white/20 dark:border-white/10 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-none">
 
 <div className="flex flex-col items-center text-center mt-2">
 {/* Icono de advertencia/salida */}
 <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-500/20">
 <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
 </svg>
 </div>

 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
 ¿Cerrar sesión?
 </h3>
 
 <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 px-2">
 Tendrás que volver a introducir tus credenciales la próxima vez que entres a WayGass.
 </p>

 <div className="flex flex-col w-full gap-3">
 <button
 onClick={() => {
 onConfirm();
 onClose();
 }}
 className="w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/20 transition-colors"
 >
 Sí, cerrar sesión
 </button>
 <button
 onClick={onClose}
 className="w-full px-4 py-3.5 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 transition-colors"
 >
 Cancelar
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
