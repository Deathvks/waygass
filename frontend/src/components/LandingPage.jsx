import React from 'react';

export default function LandingPage({ onEnterApp }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white flex flex-col font-sans selection:bg-primary selection:text-white">
      
      {/* HEADER NAVBAR */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-white/5 sticky top-0 bg-[#f8fafc]/90 dark:bg-[#000000]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight">Way<span className="text-primary">Gass</span></span>
        </div>
        <button 
          onClick={onEnterApp}
          className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          Acceder
        </button>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col">
        <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-30"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Precios actualizados en tiempo real
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Encuentra la gasolina <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">más barata</span> de España.
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              WayGass es la plataforma definitiva para conductores inteligentes. Compara precios, descubre estaciones cercanas y ahorra cientos de euros al año en combustible con nuestro mapa interactivo.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onEnterApp}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Abrir Mapa Interactivo
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES / SEO CONTENT */}
        <section className="px-6 py-20 bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
              
              <div className="space-y-4">
                <div className="w-14 h-14 mx-auto md:mx-0 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Datos Oficiales MITECO</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Todos nuestros precios provienen directamente del Ministerio para la Transición Ecológica y el Reto Demográfico. Analizamos más de 11.000 estaciones de servicio en la Península, Baleares y Canarias para ofrecerte datos 100% reales y actualizados diariamente.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 mx-auto md:mx-0 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Ahorro Inteligente</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  ¿Gasolina 95, 98 o Diésel? Sea cual sea tu vehículo, el precio del combustible es uno de los mayores gastos anuales. Utilizar nuestra herramienta comparadora antes de repostar puede suponer un ahorro de hasta 250€ al año. Añade tus gasolineras favoritas para tenerlas siempre a mano.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 mx-auto md:mx-0 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Sin Publicidad Invasiva</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Creemos en una experiencia de usuario limpia. Navega por el mapa de forma fluida, filtra por tipo de combustible y encuentra tu ruta óptima. Para los usuarios más exigentes, disponemos de funciones avanzadas de gestión de garaje y cálculo de depósitos.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="px-6 py-24 bg-[#f8fafc] dark:bg-[#000000]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Ahorrar es así de fácil</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Tu bolsillo te lo agradecerá en solo 3 pasos.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Line connecting steps (hidden on mobile) */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-xl">1</div>
                <h3 className="text-xl font-bold">Abre el Mapa</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm px-4">Localiza automáticamente las gasolineras a tu alrededor usando el GPS integrado.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 mt-8 md:mt-0">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-primary/50 flex items-center justify-center text-3xl font-black text-primary shadow-xl">2</div>
                <h3 className="text-xl font-bold">Filtra por Combustible</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm px-4">Selecciona Diésel, Gasolina 95 o 98. Te mostramos los precios exactos actualizados al minuto.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 mt-8 md:mt-0">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/40">3</div>
                <h3 className="text-xl font-bold">Elige y Navega</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm px-4">Toca la estación más barata y deja que Google Maps te guíe hasta el surtidor.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION (Great for SEO / AdSense) */}
        <section className="px-6 py-24 bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">Preguntas Frecuentes</h2>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
                <h4 className="text-lg font-bold mb-2">¿De dónde salen los precios de las gasolineras?</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Todos los datos mostrados en WayGass se obtienen en tiempo real del portal oficial de datos abiertos del Ministerio para la Transición Ecológica (MITECO). Las propias estaciones de servicio están obligadas por ley a reportar sus cambios de precio al ministerio diariamente.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
                <h4 className="text-lg font-bold mb-2">¿Cuánto dinero puedo ahorrar usando la app?</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Depende mucho de tu zona y tu consumo, pero en una misma ciudad puede haber diferencias de hasta 25 céntimos por litro entre la gasolinera más cara y la más barata (low-cost). Para un depósito de 50 litros, eso supone un ahorro directo de 12,50€ cada vez que vas a repostar. Si repostas dos veces al mes, hablamos de más de 300€ al año.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
                <h4 className="text-lg font-bold mb-2">¿Es 100% gratuita?</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Sí. El acceso al mapa interactivo, la consulta de precios de Diésel y Gasolina, y la geolocalización de estaciones cercanas es una herramienta totalmente gratuita para todos los conductores en España peninsular e islas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-6 py-32 bg-slate-900 dark:bg-black text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black">Deja de pagar de más por la gasolina.</h2>
            <p className="text-lg text-slate-300">Únete a los conductores inteligentes que ya usan WayGass para encontrar el mejor precio de combustible en España.</p>
            <button 
              onClick={onEnterApp}
              className="px-10 py-5 bg-primary hover:bg-primary-dark text-white text-xl font-bold rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105"
            >
              Comenzar a Ahorrar Ahora
            </button>
          </div>
        </section>
      </main>


      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500">
        <p className="font-medium">&copy; {new Date().getFullYear()} WayGass. Todos los derechos reservados.</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <a href="#" className="hover:text-primary transition-colors">Aviso Legal</a>
          <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
          <a href="#" className="hover:text-primary transition-colors">Política de Cookies</a>
        </div>
      </footer>
    </div>
  );
}
