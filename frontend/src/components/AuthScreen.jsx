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
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col relative overflow-hidden">
      {/* Fondo Superior Curvo */}
      <div className="relative w-full h-[40vh] sm:h-[45vh] shrink-0 bg-orange-500 dark:bg-slate-900">
        <img src="/auth_bg.jpg" alt="WayGass Map" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 dark:opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 to-orange-600/90 dark:from-slate-800/90 dark:to-slate-900/90"></div>
        
        {/* Curva SVG en la base */}
        <div className="absolute bottom-0 left-0 w-full leading-none translate-y-[1px]">
          <svg viewBox="0 0 1440 320" className="w-full h-auto text-white dark:text-[#0f172a] fill-current" preserveAspectRatio="none">
            <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Logo flotante (Opcional, para dar toque de marca) */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
           <img src="/logo.svg" alt="WayGass" className="w-12 h-12 drop-shadow-md brightness-0 invert" />
           <span className="text-white font-black tracking-widest mt-2">WAYGASS</span>
        </div>
      </div>

      {/* Contenedor del Formulario (Centrado en desktop, ancho completo en móvil) */}
      <div className="flex-1 flex flex-col px-8 sm:px-12 pb-8 pt-4 relative z-10 w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          {isLogin ? 'Sign in' : 'Welcome'}
        </h1>
        <div className="w-12 h-1 bg-orange-500 rounded-full mb-8"></div>

        {error && (
          <div className="text-rose-500 text-sm font-medium mb-4 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg border border-rose-100 dark:border-rose-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          
          {!isLogin && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
                <div className="flex items-center border-b border-slate-200 dark:border-slate-700 py-2 focus-within:border-orange-500 dark:focus-within:border-orange-500 transition-colors">
                  <svg className="w-4 h-4 text-slate-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} 
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    placeholder="Tu nombre"
                  />
                </div>
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
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Apellidos</label>
                <div className="flex items-center border-b border-slate-200 dark:border-slate-700 py-2 focus-within:border-orange-500 dark:focus-within:border-orange-500 transition-colors">
                  <input 
                    type="text" name="lastName" value={formData.lastName} onChange={handleChange} 
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    placeholder="Apellidos"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Email</label>
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700 py-2 focus-within:border-orange-500 dark:focus-within:border-orange-500 transition-colors">
              <svg className="w-4 h-4 text-slate-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <input 
                type="text" name="email" value={formData.email} onChange={handleChange} 
                className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
                placeholder="demo@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Password</label>
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700 py-2 focus-within:border-orange-500 dark:focus-within:border-orange-500 transition-colors">
              <svg className="w-4 h-4 text-slate-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <input 
                type="password" name="password" value={formData.password} onChange={handleChange} 
                className="w-full bg-transparent border-none focus:outline-none text-slate-800 dark:text-white text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
                placeholder="Ingresa tu contraseña"
              />
              <button type="button" className="text-slate-300 dark:text-slate-600 ml-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          {isLogin && (
            <div className="flex justify-between items-center text-xs mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 bg-transparent" />
                <span className="font-medium">Remember Me</span>
              </label>
              <button type="button" className="font-bold text-orange-500 hover:text-orange-600">
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mt-auto pt-6 flex flex-col gap-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-orange-500 text-white font-bold text-sm shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : (isLogin ? 'Login' : 'Crear Cuenta')}
            </button>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              {isLogin ? "Don't have an Account ? " : "¿Ya tienes cuenta? "}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ name:'', lastName:'', email:'', password:'' }); }}
                className="font-bold text-orange-500 hover:text-orange-600 transition"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
