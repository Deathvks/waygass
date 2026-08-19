import React from 'react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo borroso y oscuro */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenido del modal */}
      <div className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-rose-400"></div>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Icono de advertencia/salida */}
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            ¿Cerrar sesión?
          </h3>
          
          <p className="text-sm text-slate-500 mb-8 px-2">
            Tendrás que volver a introducir tus credenciales la próxima vez que entres a WayGass.
          </p>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
