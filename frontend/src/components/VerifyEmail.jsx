import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function VerifyEmail() {
 const [status, setStatus] = useState('loading');
 const called = useRef(false);
 const [message, setMessage] = useState('Verificando tu cuenta...');

 useEffect(() => {
 if (called.current) return;
 called.current = true;
 const params = new URLSearchParams(window.location.search);
 const token = params.get('token');

 if (!token) {
 setStatus('error');
 setMessage('Enlace de verificación no válido. Faltan datos.');
 return;
 }

 const verifyToken = async () => {
 try {
 const res = await axios.get('/api/verify?token=' + token);
 setStatus('success');
 setMessage(res.data.message || '¡Cuenta verificada con éxito!');
 } catch (err) {
 setStatus('error');
 setMessage(err.response?.data?.error || 'No se pudo verificar la cuenta.');
 }
 };

 verifyToken();
 }, []);

 return (
 <div className="min-h-[100dvh] bg-white dark:bg-[#0f172a] flex flex-col justify-center items-center px-4">
 <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-md w-full text-center ">
 {status === 'loading' && (
 <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Verificando...</h2>
 )}

 {status === 'success' && (
 <>
 <h2 className="text-2xl font-bold text-green-500 mb-2">¡Cuenta verificada!</h2>
 <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
 <p className="text-sm font-bold text-primary bg-primary/10 dark:bg-primary/10 p-4 rounded-xl">
 Ya puedes cerrar esta pestaña y volver a la página original para entrar a tu cuenta.
 </p>
 </>
 )}

 {status === 'error' && (
 <>
 <h2 className="text-2xl font-bold text-rose-500 mb-2">Error de verificación</h2>
 <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
 <button
 onClick={() => window.location.href = '/'}
 className="w-full py-3 bg-slate-900 dark:bg-primary text-white font-bold rounded-xl"
 >
 Volver al inicio
 </button>
 </>
 )}
 </div>
 </div>
 );
}


