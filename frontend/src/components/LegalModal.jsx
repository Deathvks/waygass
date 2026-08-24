import React from 'react';

export default function LegalModal({ type, onClose }) {
 if (!type) return null;

 const isTerms = type === 'terms';

 return (
 <div className="fixed inset-0 z-[10000] bg-slate-950/50 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
 <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-full sm:max-w-2xl rounded-3xl max-h-[85vh] flex flex-col relative">
 <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
 <h2 className="font-black text-xl">
 {isTerms ? 'Términos de Servicio' : 'Política de Privacidad y Cookies'}
 </h2>
 <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
 </button>
 </div>
 <div className="p-6 overflow-y-auto prose dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
 {isTerms ? (
 <>
 <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-2 mt-4 text-lg">1. Aceptación de los términos</h3>
 <p className="mb-4">Al acceder a WayGass, aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no utilices la aplicación.</p>
 
 <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-2 mt-4 text-lg">2. Uso del servicio</h3>
 <p className="mb-4">El servicio de comparación de precios de gasolineras se proporciona "tal cual". Obtenemos la información de fuentes públicas y de la comunidad. Los precios son orientativos y pueden diferir de los precios reales en la estación. WayGass no se hace responsable de las discrepancias.</p>
 
 <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-2 mt-4 text-lg">3. Cuentas de usuario</h3>
 <p className="mb-4">Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. WayGass se reserva el derecho de suspender cuentas que hagan un uso abusivo del sistema de validación de precios.</p>
 
 <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-2 mt-4 text-lg">4. Propiedad Intelectual</h3>
 <p className="mb-4">Todo el código, diseño, contenido y logos de WayGass son propiedad exclusiva y están protegidos por leyes de derechos de autor.</p>
 </>
 ) : (
 <>
 <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-2 mt-4 text-lg">1. Recopilación de Información</h3>
 <p className="mb-4">Solo recopilamos la información estrictamente necesaria. Tu ubicación GPS se solicita y procesa únicamente en tu dispositivo local para mostrarte gasolineras cercanas, y no se guarda en nuestros servidores a menos que la guardes como tu "ubicación por defecto". Si creas una cuenta, guardamos tu email, nombre y contraseña (encriptada).</p>
 
 <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-2 mt-4 text-lg">2. Uso de Cookies y Almacenamiento Local (Local Storage)</h3>
 <p className="mb-4">Usamos almacenamiento local en tu navegador (similar a las cookies) con los siguientes propósitos:</p>
 <ul className="list-disc pl-5 mb-4">
 <li><strong>Esenciales:</strong> Para mantener tu sesión de usuario activa (Token JWT).</li>
 <li><strong>Funcionales y Preferencias:</strong> Para guardar tu configuración (modo oscuro, gasolinera favorita, filtros aplicados, radio de búsqueda).</li>
 </ul>
 <p className="mb-4">Si seleccionas "Rechazar" en el banner de cookies, dejaremos de guardar permanentemente tus filtros, ubicaciones manuales y configuraciones de la app, por lo que se reiniciarán cada vez que cierres la pestaña. La sesión de usuario y las funciones esenciales seguirán funcionando.</p>
 
 <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-2 mt-4 text-lg">3. Compartir con Terceros</h3>
 <p className="mb-4">No vendemos tus datos a terceros bajo ninguna circunstancia. Utilizamos proveedores de mapas externos (como OpenStreetMap / Leaflet) para renderizar la interfaz gráfica basándonos en coordenadas anónimas.</p>
 </>
 )}
 </div>
 </div>
 </div>
 );
}
