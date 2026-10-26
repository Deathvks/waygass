import React, { useEffect } from 'react';

export default function LandingPage({ onEnterApp }) {
  useEffect(() => {
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3243042902219004";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white flex flex-col font-sans selection:bg-primary selection:text-white">
      
      {/* HEADER NAVBAR */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-white/5 sticky top-0 bg-[#f8fafc]/90 dark:bg-[#000000]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
            <i className="fa-solid fa-gas-pump text-white text-sm"></i>
          </div>
          <span className="text-xl font-black tracking-tight">Way<span className="text-primary">Gass</span></span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/blog" className="text-sm font-bold hover:text-primary transition-colors">Blog</a>
          <button 
          onClick={onEnterApp}
          className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          Acceder
          </button>
        </div>
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
                <i className="fa-solid fa-arrow-right text-base"></i>
              </button>
            </div>
            
            {/* COMPATIBILITY BANNER */}
            <div className="pt-12 mt-12 border-t border-slate-200 dark:border-white/10 flex flex-col items-center">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Integrado y funcionando con</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-all duration-500">
                
                {/* Spain */}
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-white">
                  <div className="w-8 h-6 rounded-sm overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="h-[25%] bg-[#c60b1e]"></div>
                    <div className="h-[50%] bg-[#ffc400]"></div>
                    <div className="h-[25%] bg-[#c60b1e]"></div>
                  </div>
                  Toda España
                </div>

                {/* Canarias */}
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-white">
                  <div className="w-8 h-6 rounded-sm overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-row">
                    <div className="w-[33.3%] bg-white"></div>
                    <div className="w-[33.3%] bg-[#155BE3]"></div>
                    <div className="w-[33.3%] bg-[#FFD100]"></div>
                  </div>
                  Incluye Canarias
                </div>

                {/* Google Maps */}
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-white">
                  <i className="fa-brands fa-google text-2xl text-[#4285F4]"></i>
                  Google Maps
                </div>

                {/* Apple Maps */}
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-white">
                  <i className="fa-brands fa-apple text-2xl text-black dark:text-white"></i>
                  Apple Maps
                </div>
                
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES / SEO CONTENT */}
        <section className="px-6 py-20 bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
              
              <div className="space-y-4">
                <div className="w-14 h-14 mx-auto md:mx-0 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-chart-column text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <h3 className="text-xl font-bold">Datos Oficiales MITECO</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Todos nuestros precios provienen directamente del Ministerio para la Transición Ecológica y el Reto Demográfico. Analizamos más de 11.000 estaciones de servicio en la Península, Baleares y Canarias para ofrecerte datos 100% reales y actualizados diariamente.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 mx-auto md:mx-0 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-piggy-bank text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <h3 className="text-xl font-bold">Ahorro Inteligente</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  ¿Gasolina 95, 98 o Diésel? Sea cual sea tu vehículo, el precio del combustible es uno de los mayores gastos anuales. Utilizar nuestra herramienta comparadora antes de repostar puede suponer un ahorro de hasta 250€ al año. Añade tus gasolineras favoritas para tenerlas siempre a mano.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 mx-auto md:mx-0 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved text-2xl text-purple-600 dark:text-purple-400"></i>
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
        {/* LATEST NEWS & GUIDES SECTION (AdSense Content) */}
        <section className="px-6 py-24 bg-[#f8fafc] dark:bg-[#000000]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Guías y Actualidad</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Consejos prácticos para el conductor inteligente.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg flex flex-col cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href='/blog/5-trucos-ahorrar-combustible'}>
                <div className="h-40 relative">
                  <img src="/blog-eco-driving.jpg" alt="Eco Driving" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Guía Práctica</span>
                  <h3 className="text-lg font-black mb-2 leading-tight">5 Trucos infalibles para ahorrar combustible</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">¿Sabías que la presión de los neumáticos o el uso del aire acondicionado pueden disparar tu consumo?</p>
                </div>
              </article>

              <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg flex flex-col cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href='/blog/gasolineras-lowcost-mito-realidad'}>
                <div className="h-40 relative">
                  <img src="/blog-low-cost.jpg" alt="Low Cost Gas" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Mecánica</span>
                  <h3 className="text-lg font-black mb-2 leading-tight">Gasolineras Low-Cost: ¿Mito o realidad?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">Desmentimos los mitos más comunes sobre las estaciones de bajo coste y la calidad de sus combustibles.</p>
                </div>
              </article>

              <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg flex flex-col cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href='/blog/mejores-apps-coche-2026'}>
                <div className="h-40 relative">
                  <img src="/blog-apps-car.jpg" alt="Car Apps" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Tecnología</span>
                  <h3 className="text-lg font-black mb-2 leading-tight">Las 5 mejores apps para conductores en 2026</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">Digitaliza tu coche y exprime al máximo cada viaje con estas herramientas imprescindibles.</p>
                </div>
              </article>

              <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg flex flex-col cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href='/blog/mantenimiento-preventivo-consumo'}>
                <div className="h-40 relative">
                  <img src="/blog-maintenance.jpg" alt="Maintenance" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Mecánica</span>
                  <h3 className="text-lg font-black mb-2 leading-tight">Mantenimiento preventivo y el consumo</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">Descubre cuánto combustible estás perdiendo por no visitar al mecánico a tiempo.</p>
                </div>
              </article>
              
            </div>
            
            <div className="mt-12 text-center">
              <a href="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
                Ver todos los artículos
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </a>
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
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm">
            <a href="/blog" className="hover:text-primary transition-colors whitespace-nowrap">Blog</a>
            <a href="/legal" className="hover:text-primary transition-colors whitespace-nowrap">Aviso Legal</a>
            <a href="/privacidad" className="hover:text-primary transition-colors whitespace-nowrap">Privacidad</a>
            <a href="/cookies" className="hover:text-primary transition-colors whitespace-nowrap">Cookies</a>
          </div>
      </footer>
    </div>
  );
}
