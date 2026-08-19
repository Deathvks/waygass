import React, { useState } from 'react';
import axios from 'axios';

export default function AuthScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', lastName: '', email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
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
      const payload = { ...formData, rememberMe };
      const res = await axios.post(`${endpoint}`, payload);
      
      const { token, user } = res.data;
      
      onLoginSuccess(token, user, rememberMe);
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
    <div className="min-h-screen bg-white dark:bg-[#0f172a] flex flex-col md:flex-row relative overflow-hidden">
      {/* Fondo Superior Curvo (Móvil) / Panel Izquierdo (PC) */}
      <div className="relative w-full h-[40vh] sm:h-[45vh] md:h-screen md:w-1/2 lg:w-[55%] shrink-0 bg-orange-500 dark:bg-slate-900 flex flex-col justify-center md:shadow-[4px_0_24px_rgba(0,0,0,0.05)] md:z-20">
        <img src="/auth_bg.jpg" alt="WayGass Map" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 dark:opacity-20 md:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 to-orange-600/90 dark:from-slate-800/90 dark:to-slate-900/90"></div>
        
        {/* Curva SVG en la base (SOLO MÓVIL) */}
        <div className="absolute bottom-0 left-0 w-full leading-none translate-y-[1px] md:hidden">
          <svg viewBox="0 0 1440 320" className="w-full h-auto text-white dark:text-[#0f172a] fill-current" preserveAspectRatio="none">
            <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Contenido Izquierdo */}
        <div className="absolute md:relative top-12 md:top-auto left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 flex flex-col items-center md:items-start md:px-16 lg:px-24 z-20 w-full">
           <img src="/logo.svg" alt="WayGass" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md brightness-0 invert" />
           <span className="text-white font-black tracking-widest mt-2 md:mt-4 text-sm md:text-xl">WAYGASS</span>
           
           <h2 className="hidden md:block text-white text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg mt-12">
             Tu combustible,<br/>tu ruta,<br/><span className="text-orange-200">al mejor precio.</span>
           </h2>
           <p className="hidden md:block text-orange-100 mt-6 text-lg max-w-sm">
             Encuentra las estaciones más baratas en tiempo real y optimiza tus repostajes en España.
           </p>
        </div>
      </div>

      {/* Contenedor del Formulario (Derecha en PC) */}
      <div className="flex-1 flex flex-col md:justify-center px-8 sm:px-12 pb-8 pt-0 -mt-16 sm:-mt-28 md:mt-0 relative z-10 w-full max-w-md md:max-w-none md:w-1/2 lg:w-[45%] mx-auto md:mx-0">
        <div className="bg-white/80 dark:bg-slate-900/80 md:bg-transparent md:dark:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-8 md:p-12 lg:p-20 md:py-8 rounded-[32px] md:rounded-none shadow-2xl md:shadow-none border border-white/20 dark:border-slate-700/30 md:border-none w-full max-w-lg mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
            {isLogin ? 'Iniciar Sesión' : 'Bienvenido'}
          </h1>
          <div className="w-12 h-1 bg-orange-500 rounded-full mb-6"></div>

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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Contraseña</label>
            </div>
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
            
            {!isLogin && (
              <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Requisitos de contraseña</p>
                <ul className="text-xs flex flex-col gap-2.5 font-medium">
                  <li className={`flex items-center gap-2.5 transition-colors ${formData.password.length >= 8 ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${formData.password.length >= 8 ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-600'}`}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d={formData.password.length >= 8 ? "M5 13l4 4L19 7" : ""}/></svg>
                    </div>
                    Mínimo 8 caracteres
                  </li>
                  <li className={`flex items-center gap-2.5 transition-colors ${/[A-Z]/.test(formData.password) ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${/[A-Z]/.test(formData.password) ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-600'}`}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d={/[A-Z]/.test(formData.password) ? "M5 13l4 4L19 7" : ""}/></svg>
                    </div>
                    Al menos una letra mayúscula
                  </li>
                  <li className={`flex items-center gap-2.5 transition-colors ${/[0-9]/.test(formData.password) ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${/[0-9]/.test(formData.password) ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-600'}`}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d={/[0-9]/.test(formData.password) ? "M5 13l4 4L19 7" : ""}/></svg>
                    </div>
                    Al menos un número
                  </li>
                  <li className={`flex items-center gap-2.5 transition-colors ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${/[^A-Za-z0-9]/.test(formData.password) ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-600'}`}>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d={/[^A-Za-z0-9]/.test(formData.password) ? "M5 13l4 4L19 7" : ""}/></svg>
                    </div>
                    Al menos un carácter especial
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          {isLogin && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs mt-2 w-full">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400 group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 appearance-none bg-white dark:bg-slate-800 checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer" 
                  />
                  <svg className={`absolute w-2.5 h-2.5 text-white pointer-events-none transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">Recordar sesión</span>
              </label>
              <button type="button" className="font-bold text-orange-500 hover:text-orange-600">
                ¿Olvidaste la contraseña?
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
              ) : (isLogin ? 'Entrar' : 'Crear Cuenta')}
            </button>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes cuenta? "}
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ name:'', lastName:'', email:'', password:'' }); }}
                className="font-bold text-orange-500 hover:text-orange-600 transition"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
