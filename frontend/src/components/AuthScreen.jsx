import React, { useState } from 'react';
import axios from 'axios';

export default function AuthScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!formData.email.trim()) {
      setError("Por favor, introduce tu correo electrónico.");
      return;
    }
    if (!formData.password) {
      setError("Por favor, introduce tu contraseña.");
      return;
    }

    if (!isLogin) {
      if (!formData.name.trim() || !formData.lastName.trim()) {
        setError("Por favor, rellena tu nombre y apellidos.");
        return;
      }
      
      const passwordRules = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[^A-Za-z0-9]/.test(formData.password)
      };

      if (!Object.values(passwordRules).every(Boolean)) {
        setError("La contraseña no cumple todos los requisitos de seguridad.");
        return;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, introduce un correo electrónico válido.");
      return;
    }

    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const res = await axios.post(`https://unsnap-causing-affluent.ngrok-free.dev${endpoint}`, formData);
      
      const { token, user } = res.data;
      localStorage.setItem('waygas_token', token);
      localStorage.setItem('waygas_user', JSON.stringify(user));
      
      onLoginSuccess(token, user);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error de conexión con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex">
      {/* Columna Izquierda: Ilustración (Solo Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 dark:bg-slate-900 overflow-hidden items-center justify-center">
        <img src="/auth_bg.jpg" alt="WayGass Map" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-16 left-16 text-white z-10">
          <h2 className="text-5xl font-black mb-3 tracking-tight">Tu repostaje,<br/>más inteligente.</h2>
          <p className="text-white/80 text-lg max-w-md">Encuentra los mejores precios, optimiza tus rutas y ahorra en cada depósito.</p>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Fondo móvil (Solo visible en móviles) */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-[45vh] overflow-hidden z-0">
           <img src="/auth_bg.jpg" alt="WayGass Map" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/90 dark:via-[#0f172a]/90 to-slate-50 dark:to-[#0f172a]"></div>
        </div>

        <div className="bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-2xl sm:shadow-xl border border-white/50 dark:border-slate-700/50 relative z-10 mt-16 sm:mt-0">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl brand-gradient-bg flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
              <img src="/logo.svg" alt="WayGass" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">WayGass</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
              {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratuita'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm p-3 rounded-xl mb-4 font-medium border border-rose-100 dark:border-rose-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nombre</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Apellidos</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                    placeholder="Tus apellidos"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
              <input 
                type="text" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                placeholder="nombre@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="bg-slate-50 dark:bg-[#0f172a]/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50 flex flex-col gap-1.5 mt-1">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Requisitos de seguridad</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={formData.password.length >= 8 ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}>
                    {formData.password.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={/[A-Z]/.test(formData.password) ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '○'} Una letra mayúscula
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={/[0-9]/.test(formData.password) ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}>
                    {/[0-9]/.test(formData.password) ? '✓' : '○'} Un número
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={/[^A-Za-z0-9]/.test(formData.password) ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}>
                    {/[^A-Za-z0-9]/.test(formData.password) ? '✓' : '○'} Un símbolo especial (!@#$%)
                  </span>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 bg-slate-900 dark:bg-orange-500 hover:bg-slate-800 dark:hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-slate-900/20 dark:shadow-orange-500/20 disabled:opacity-70"
            >
              {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-1 font-bold text-orange-500 hover:text-orange-600 transition"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
